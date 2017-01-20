package models

import (
	"encoding/json"

	"golang.org/x/net/context"
	"google.golang.org/appengine/datastore"
)

type Shelf struct {
	Key   *datastore.Key `json:"-" datastore:"-"`
	Id    int64          `json:"id" datastore:"-"`
	Title string         `json:"title"`
	Works Works          `json:"works" datastore:"-"`
}

func (s *Shelf) MarshalJSON() ([]byte, error) {
	if s.Works == nil {
		s.Works = Works{}
	}

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
	Context() context.Context

	ListShelves() (Shelves, error)

	AddShelf(shelf *Shelf) (*Shelf, error)

	GetShelf(id int64) (Shelf, error)
}
