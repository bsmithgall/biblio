package app

import (
	"net/http"

	"github.com/gorilla/mux"

	h "handlers"
)

func init() {
	r := mux.NewRouter()

	// User Components
	users := r.PathPrefix("/users").Subrouter()
	users.Path("/login").HandlerFunc(h.LoginHandler)
	users.Path("/oauth2callback").HandlerFunc(h.OAuthCallbackHandler)

	// API Components
	api := r.PathPrefix("/api/v1").Subrouter()
	// works
	api.Path("/works").HandlerFunc(h.WorkListHandler)
	api.Path("/works/{key}").HandlerFunc(h.WorkHandler)

	// shelves
	api.Path("/shelves").HandlerFunc(h.ShelfListHandler)
	api.Path("/shelves/{key}").HandlerFunc(h.ShelfHandler)

	// user
	api.Path("/user").HandlerFunc(h.UserHandler)

	// Register our mux router with http package, needed
	// for app engine to see the routes
	http.Handle("/", r)
}
