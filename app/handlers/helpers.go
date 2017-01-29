package app

import (
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/satori/go.uuid"

	"github.com/bsmithgall/biblio"
	m "github.com/bsmithgall/biblio/models"

	"golang.org/x/net/context"
	"golang.org/x/oauth2"

	"google.golang.org/api/plus/v1"
	"google.golang.org/appengine"
	"google.golang.org/appengine/log"
)

func getIdFromParams(r *http.Request) (int64, error) {
	return strconv.ParseInt(mux.Vars(r)["key"], 10, 64)
}

func makeOAuthURL(w http.ResponseWriter, r *http.Request) (string, error) {
	sessionId := uuid.NewV4().String()

	oauthFlowSession, err := biblio.SessionStore.New(r, sessionId)
	if err != nil {
		return "", err
	}
	oauthFlowSession.Options.MaxAge = 60 * 60 * 24 * 30 // 30 months

	if err := oauthFlowSession.Save(r, w); err != nil {
		return "", err
	}

	return biblio.OAuthConfig.AuthCodeURL(sessionId, oauth2.ApprovalForce,
		oauth2.AccessTypeOnline), nil
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

func getProfileFromSession(r *http.Request) *m.Profile {
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

	profile, ok := session.Values[googleProfileSessionKey].(*m.Profile)
	log.Debugf(ctx, "Getting profile: %#v | %v", profile, ok)
	if !ok {
		return nil
	}

	return profile
}

// stripProfile returns a subset of a plus.Person.
func stripProfile(p *plus.Person) *m.Profile {
	return &m.Profile{
		ID:          p.Id,
		DisplayName: p.DisplayName,
		ImageURL:    p.Image.Url,
	}
}
