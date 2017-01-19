package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"golang.org/x/net/context"
	"google.golang.org/appengine"

	"models"
)

func ShelfListHandler(w http.ResponseWriter, r *http.Request) {
	dao := &models.ShelfDAO{Ctx: appengine.NewContext(r)}

	switch r.Method {
	case "GET":
		listShelves(w, r, dao, ctx)
	case "POST":
		addShelf(w, r, dao, ctx)
	default:
		http.Error(w, fmt.Sprintf("This method (%s) is not supported", r.Method), http.StatusMethodNotAllowed)
		return
	}
}

func listShelves(w http.ResponseWriter, r *http.Request, dao models.ShelfDB) {
	shelves, err := dao.ListShelves()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if shelves == nil {
		shelves = models.Shelves{}
	}

	json.NewEncoder(w).Encode(shelves)
}

func addShelf(w http.ResponseWriter, r *http.Request, dao models.ShelfDB) {
	shelf := &models.Shelf{}

	if err := json.NewDecoder(r.Body).Decode(shelf); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if _, err := dao.AddShelf(shelf); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Location", r.URL.String()+fmt.Sprintf("/%s", shelf.Id))
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(shelf)
}
