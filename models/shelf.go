package models

type Shelf struct {
	Id    int64  `json:"id" datastore:"-"`
	Title string `json:"title"`
	Works Works  `json:"works" datastore:"-"`
}

type Shelves []Shelf
