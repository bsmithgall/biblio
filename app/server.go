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
	api.Path("/works").HandlerFunc(h.WorkListHandler)
	api.Path("/works/{key}").HandlerFunc(h.WorkHandler)
	api.Path("/shelves").HandlerFunc(h.ShelfListHandler)
	api.Path("/shelves/{key}").HandlerFunc(h.ShelfHandler)

	// Register our mux router with http package, needed
	// for app engine to see the routes
	http.Handle("/", &BiblioServer{r})
}

type BiblioServer struct {
	r *mux.Router
}

// Custom server to handle CORS -- see http://stackoverflow.com/a/24818638
func (s *BiblioServer) ServeHTTP(rw http.ResponseWriter, req *http.Request) {
	if origin := req.Header.Get("Origin"); origin != "" {
		rw.Header().Set("Access-Control-Allow-Origin", origin)
		rw.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		rw.Header().Set("Access-Control-Allow-Headers",
			"Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
	}
	// Stop here if its Preflighted OPTIONS request
	if req.Method == "OPTIONS" {
		return
	}
	// Lets Gorilla work
	s.r.ServeHTTP(rw, req)
}
