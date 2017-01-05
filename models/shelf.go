package models

type Shelf struct {
	Id    int    `json:"id"`
	Title string `json:"title"`
	Works Works  `json:"works"`
}

type Shelves []Shelf
