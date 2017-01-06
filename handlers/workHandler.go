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

func WorksHandler(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)

	switch r.Method {
	case "GET":
		listWorks(w, r, ctx)
	case "POST":
		addWork(w, r, ctx)
	default:
		http.Error(w, fmt.Sprintf("This method (%s) is not supported", r.Method), http.StatusMethodNotAllowed)
		return
	}
}

func listWorks(w http.ResponseWriter, r *http.Request, ctx context.Context) {
	var works []*models.Work

	q := datastore.NewQuery("Work")
	keys, err := q.GetAll(ctx, &works)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		log.Errorf(ctx, "GetAll: %v", err)
		return
	}

	for i, key := range keys {
		works[i].Id = key.IntID()
	}

	json.NewEncoder(w).Encode(works)
}

func addWork(w http.ResponseWriter, r *http.Request, ctx context.Context) {
	var work models.Work

	if err := json.NewDecoder(r.Body).Decode(&work); err != nil {
		log.Errorf(ctx, "POST: %v", err)
		return
	}

	shelfKey := datastore.NewKey(ctx, "Shelf", "", work.ShelfId, nil)
	log.Debugf(ctx, "lol: %#v", shelfKey)
	work.ShelfKey = shelfKey

	workKey := datastore.NewIncompleteKey(ctx, "Work", nil)
	key, err := datastore.Put(ctx, workKey, &work)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	work.Id = key.IntID()

	w.Header().Set("Location", r.URL.String()+fmt.Sprintf("/%d", key.IntID()))
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(work)
}
