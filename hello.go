package biblio

import (
	"net/http"

	"github.com/gorilla/mux"
)

func init() {
	r := mux.NewRouter()
	r.HandleFunc("/", HomeHandler)
	r.HandleFunc("/works", WorksHandler)
	r.HandleFunc("/shelves", ShelvesHandler)

	// The path "/" matches everything not matched by some other path.
	http.Handle("/", r)
}
