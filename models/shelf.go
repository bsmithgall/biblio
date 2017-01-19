package models

import (
	"encoding/json"
	"google.golang.org/appengine/datastore"
)

type Shelf struct {
	Key   *datastore.Key `json:"-" datastore:"-"`
	Id    int64          `json:"id" datastore:"-"`
	Title string         `json:"title"`
	Works Works          `json:"works" datastore:"-"`
}

func (s *Shelf) MarshalJSON() ([]byte, error) {
	type Alias Shelf
	return json.Marshal(&struct {
		Id int64 `json:"id"`
		*Alias
	}{
		Id:    s.Key.IntID(),
		Alias: (*Alias)(s),
	})
}

type Shelves []Shelf

type ShelfDB interface {
	ListShelves() (Shelves, error)

	AddShelf(shelf *Shelf) (*Shelf, error)
}
