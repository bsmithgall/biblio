package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"google.golang.org/appengine"
	"google.golang.org/appengine/log"

	"models"
)

func ShelfListHandler(w http.ResponseWriter, r *http.Request) {
	dao := &models.ShelfDAO{Ctx: appengine.NewContext(r)}

	switch r.Method {
	case "GET":
		listShelves(w, r, dao)
	case "POST":
		addShelf(w, r, dao)
	default:
		http.Error(w, fmt.Sprintf("This method (%s) is not supported", r.Method), http.StatusMethodNotAllowed)
		return
	}
}

func ShelfHandler(w http.ResponseWriter, r *http.Request) {
	dao := &models.ShelfDAO{Ctx: appengine.NewContext(r)}

	switch r.Method {
	case "GET":
		getShelf(w, r, dao)
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
	log.Debugf(dao.Context(), "listShelves [shelves]: %#v", shelves)
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

	w.Header().Set("Location", r.URL.String()+fmt.Sprintf("/%d", shelf.Key.IntID()))
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(shelf)
}

func getShelf(w http.ResponseWriter, r *http.Request, dao models.ShelfDB) {
	id, err := getIdFromParams(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	shelf, err := dao.GetShelf(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(&shelf)
}
