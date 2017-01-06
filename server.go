package biblio

import (
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	"handlers"
)

func init() {
	r := mux.NewRouter()
	r.HandleFunc("/", HomeHandler)
	r.HandleFunc("/works", handlers.WorksHandler)
	r.HandleFunc("/shelves", handlers.ShelvesHandler)

	// The path "/" matches everything not matched by some other path.
	http.Handle("/", r)
}

func HomeHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "Hello, World!")
}
