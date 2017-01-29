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
	if profile == nil {
		url, err := makeOAuthURL(w, r)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		var loginURL = struct {
			Url string `json:"url"`
		}{
			url,
		}
		json.NewEncoder(w).Encode(loginURL)
	} else {
		log.Debugf(ctx, "Get profile from session: %#v", profile)
		json.NewEncoder(w).Encode(profile)
	}
}
