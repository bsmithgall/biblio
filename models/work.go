package models

import (
	"encoding/json"
	"google.golang.org/appengine/datastore"
)

type Work struct {
	Key      *datastore.Key `json:"-" datastore:"-"`
	Id       int64          `json:"id" datastore:"-"`
	Title    string         `json:"title"`
	Author   string         `json:"author"`
	Position int64          `json:"position"`
	ShelfId  int64          `json:"shelf_id" datastore:"-"`
	ShelfKey *datastore.Key `json:"-"`
}

func (w *Work) MarshalJSON() ([]byte, error) {
	type Alias Work
	return json.Marshal(&struct {
		Id      int64 `json:"id"`
		ShelfId int64 `json:"shelf_id"`
		*Alias
	}{
		Id:      w.Key.IntID(),
		ShelfId: w.ShelfKey.IntID(),
		Alias:   (*Alias)(w),
	})
}

type Works []Work

type WorkDB interface {
	ListWorks() (Works, error)

	ListWorksByShelf(shelfID int64) (Works, error)

	AddWork(work Work) (Work, error)

	GetWork(id int64) (Work, error)

	UpdateWork(work Work) (Work, error)

	DeleteWork(id int64) error
}
