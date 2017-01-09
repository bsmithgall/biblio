package biblio

import (
	"github.com/gorilla/mux"
	"handlers"
	"net/http"
)

func init() {
	r := mux.NewRouter()

	// API Components
	api := r.PathPrefix("/api/v1").Subrouter()
	api.Path("/works").HandlerFunc(handlers.WorkListHandler)
	api.Path("/works/{key}").HandlerFunc(handlers.WorkHandler)
	api.Path("/shelves").HandlerFunc(handlers.ShelfListHandler)

	// Register our mux router with http package, needed
	// for app engine to see the routes
	http.Handle("/", r)
}
