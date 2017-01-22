package biblio

import (
	"log"
	"os"

	"github.com/gorilla/sessions"
	"github.com/joho/godotenv"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

var (
	OAuthConfig  *oauth2.Config
	SessionStore sessions.Store
)

func init() {
	var err error

	godotenv.Load()

	OAuthConfig = configureOAuthClient(os.Getenv("OAUTH_CLIENT_ID"), os.Getenv("OAUTH_SECRET"))
	store := sessions.NewCookieStore([]byte(os.Getenv("SECRET_KEY")))
	SessionStore = store

	if err != nil {
		log.Fatal(err)
	}
}

func configureOAuthClient(clientID string, clientSecret string) *oauth2.Config {
	redirectURL := os.Getenv("OAUTH2_CALLBACK")
	if redirectURL == "" {
		redirectURL = "http://localhost:8080/users/oauth2callback"
	}
	return &oauth2.Config{
		ClientID:     clientID,
		ClientSecret: clientSecret,
		RedirectURL:  redirectURL,
		Scopes:       []string{"email", "profile"},
		Endpoint:     google.Endpoint,
	}
}
