package app

import (
	"encoding/gob"
	"net/http"

	"github.com/bsmithgall/biblio"
	"github.com/satori/go.uuid"

	"golang.org/x/net/context"
	"golang.org/x/oauth2"

	"google.golang.org/api/plus/v1"
	"google.golang.org/appengine"
	"google.golang.org/appengine/log"
)

const (
	defaultSessionID = "default"
	// The following keys are used for the default session. For example:
	//  session, _ := biblio.SessionStore.New(r, defaultSessionID)
	//  session.Values[oauthTokenSessionKey]
	googleProfileSessionKey = "google_profile"
	oauthTokenSessionKey    = "oauth_token"

	// This key is used in the OAuth flow session to store the URL to redirect the
	// user to after the OAuth flow is complete.
	oauthFlowRedirectKey = "redirect"
)

type Profile struct {
	ID, DisplayName, ImageURL string
}

func init() {
	// Gob encoding for gorilla/sessions
	gob.Register(&oauth2.Token{})
	gob.Register(&Profile{})
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	sessionId := uuid.NewV4().String()

	oauthFlowSession, err := biblio.SessionStore.New(r, sessionId)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	oauthFlowSession.Options.MaxAge = 600 // 10 minutes

	if err := oauthFlowSession.Save(r, w); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	url := biblio.OAuthConfig.AuthCodeURL(sessionId, oauth2.ApprovalForce,
		oauth2.AccessTypeOnline)
	http.Redirect(w, r, url, http.StatusFound)
	return
}

func OAuthCallbackHandler(w http.ResponseWriter, r *http.Request) {
	rCtx := appengine.NewContext(r)
	oauthFlowSession, err := biblio.SessionStore.Get(r, r.FormValue("state"))
	log.Debugf(rCtx, "oauthFlowSession [state]: %#v", oauthFlowSession)
	if err != nil {
		log.Errorf(rCtx, "invalid state parameter. try logging in again.")
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	code := r.FormValue("code")
	token, err := biblio.OAuthConfig.Exchange(rCtx, code)
	log.Debugf(rCtx, "Getting token: %#v", token)
	if err != nil {
		log.Errorf(rCtx, "could not get auth token: %v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	session, err := biblio.SessionStore.New(r, defaultSessionID)
	log.Debugf(rCtx, "Getting default session: %#v", session)
	if err != nil {
		log.Errorf(rCtx, "could not get default session: %v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	profile, err := fetchProfile(rCtx, token)
	if err != nil {
		log.Errorf(rCtx, "could not fetch Google profile: %v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	session.Values[oauthTokenSessionKey] = token
	// Strip the profile to only the fields we need. Otherwise the struct is too big.
	session.Values[googleProfileSessionKey] = stripProfile(profile)

	if err := session.Save(r, w); err != nil {
		log.Errorf(rCtx, "could not save session: %v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	http.Redirect(w, r, "/api/v1/user", http.StatusFound)
	return
}

// fetchProfile retrieves the Google+ profile of the user associated with the
// provided OAuth token.
func fetchProfile(ctx context.Context, tok *oauth2.Token) (*plus.Person, error) {
	client := oauth2.NewClient(ctx, biblio.OAuthConfig.TokenSource(ctx, tok))
	plusService, err := plus.New(client)
	if err != nil {
		return nil, err
	}
	return plusService.People.Get("me").Do()
}

func getProfileFromSession(r *http.Request) *Profile {
	ctx := appengine.NewContext(r)
	session, err := biblio.SessionStore.Get(r, defaultSessionID)
	log.Debugf(ctx, "Getting default session: %#v", session)
	log.Debugf(ctx, "Getting default session [values]: %#v", session.Values)
	if err != nil {
		return nil
	}

	token, ok := session.Values[oauthTokenSessionKey].(*oauth2.Token)
	log.Debugf(ctx, "Getting token: %#v | %v", token, ok)
	if !ok || !token.Valid() {
		return nil
	}

	profile, ok := session.Values[googleProfileSessionKey].(*Profile)
	log.Debugf(ctx, "Getting profile: %#v | %v", profile, ok)
	if !ok {
		return nil
	}

	return profile
}

// stripProfile returns a subset of a plus.Person.
func stripProfile(p *plus.Person) *Profile {
	return &Profile{
		ID:          p.Id,
		DisplayName: p.DisplayName,
		ImageURL:    p.Image.Url,
	}
}
