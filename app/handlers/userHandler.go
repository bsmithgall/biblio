package app

import (
	"encoding/json"
	"net/http"

	"google.golang.org/appengine"
	"google.golang.org/appengine/log"
)

func UserHandler(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	profile := getProfileFromSession(r)
	log.Debugf(ctx, "Get profile from session: %#v", profile)
	json.NewEncoder(w).Encode(profile)
}
