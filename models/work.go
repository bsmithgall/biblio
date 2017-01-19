package models

import (
	"google.golang.org/appengine/datastore"
)

type Work struct {
	Title    string         `json:"title"`
	Author   string         `json:"author"`
	Id       int64          `json:"id" datastore:"-"`
	Position int64          `json:"position"`
	ShelfId  int64          `json:"shelfId" datastore:"-"`
	ShelfKey *datastore.Key `json:"-"`
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
