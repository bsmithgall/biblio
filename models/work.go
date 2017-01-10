package models

import "google.golang.org/appengine/datastore"

type Work struct {
	Title    string         `json:"title"`
	Author   string         `json:"author"`
	Id       int64          `json:"id" datastore:"-"`
	Position int64          `json:"position"`
	ShelfId  int64          `json:"shelfId" datastore:"-"`
	ShelfKey *datastore.Key `json:"-"`
}

type Works []Work
