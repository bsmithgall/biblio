package app

import (
	"encoding/gob"
	"net/http"

	"github.com/bsmithgall/biblio"
	m "github.com/bsmithgall/biblio/models"

	"golang.org/x/oauth2"

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

func init() {
	// Gob encoding for gorilla/sessions
	gob.Register(&oauth2.Token{})
	gob.Register(&m.Profile{})
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	url, err := makeOAuthURL(w, r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
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

	http.Redirect(w, r, "/", http.StatusFound)
	return
}
