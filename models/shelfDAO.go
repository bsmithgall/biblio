package models

import (
	"fmt"

	"golang.org/x/net/context"

	"google.golang.org/appengine/datastore"
)

type ShelfDAO struct {
	Ctx context.Context
}

func (dao *ShelfDAO) ListShelves() (Shelves, error) {
	var shelves Shelves

	q := datastore.NewQuery("Shelf")
	keys, err := q.GetAll(dao.Ctx, &shelves)

	if err != nil {
		return nil, fmt.Errorf("GetAll: %v", err)
	}

	for i, key := range keys {
		// find our works
		workDao := &WorkDAO{Ctx: dao.Ctx}
		works, err := workDao.ListWorksByShelf(key.IntID())
		if err != nil {
			return nil, fmt.Errorf("GetAll: %v", err)
		}

		// populate the shelf
		shelves[i].Key = key
		shelves[i].Works = works
	}

	return shelves, nil
}

func (dao *ShelfDAO) AddShelf(shelf *Shelf) (*Shelf, error) {
	newKey := datastore.NewIncompleteKey(dao.Ctx, "Shelf", nil)
	putKey, err := datastore.Put(dao.Ctx, newKey, shelf)
	if err != nil {
		return shelf, fmt.Errorf("AddShelf: Err: %v", err)
	}
	shelf.Key = putKey

	return shelf, nil
}
