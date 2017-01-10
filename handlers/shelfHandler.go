package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"golang.org/x/net/context"

	"google.golang.org/appengine"
	"google.golang.org/appengine/datastore"
	"google.golang.org/appengine/log"

	"models"
)

func ShelfListHandler(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)

	switch r.Method {
	case "GET":
		listShelves(w, r, ctx)
	case "POST":
		addShelf(w, r, ctx)
	default:
		http.Error(w, fmt.Sprintf("This method (%s) is not supported", r.Method), http.StatusMethodNotAllowed)
		return
	}
}

func listShelves(w http.ResponseWriter, r *http.Request, ctx context.Context) {
	var shelves []*models.Shelf

	q := datastore.NewQuery("Shelf")
	keys, err := q.GetAll(ctx, &shelves)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		log.Errorf(ctx, "GetAll: %v", err)
		return
	}

	for i, key := range keys {
		var works models.Works
		shelves[i].Id = key.IntID()
		vq := datastore.NewQuery("Work").Filter("ShelfKey=", key)

		workKeys, err := vq.GetAll(ctx, &works)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			log.Errorf(ctx, "GetAll: %v", err)
			return
		}

		if works == nil {
			works = models.Works{}
		} else {
			for j, workKey := range workKeys {
				works[j].Id = workKey.IntID()
				works[j].ShelfId = key.IntID()
			}
		}

		shelves[i].Works = works
	}

	json.NewEncoder(w).Encode(shelves)
}

func addShelf(w http.ResponseWriter, r *http.Request, ctx context.Context) {
	shelf := &models.Shelf{}

	if err := json.NewDecoder(r.Body).Decode(shelf); err != nil {
		log.Errorf(ctx, "POST: %v", err)
	}

	newKey := datastore.NewIncompleteKey(ctx, "Shelf", nil)
	key, err := datastore.Put(ctx, newKey, shelf)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	shelf.Id = key.IntID()

	w.Header().Set("Location", r.URL.String()+fmt.Sprintf("/%s", key.IntID()))
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(shelf)
}
