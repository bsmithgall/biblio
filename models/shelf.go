package biblio

import (
	"encoding/json"
	"fmt"

	"golang.org/x/net/context"

	"google.golang.org/appengine/datastore"
	"google.golang.org/appengine/log"
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

type ShelfDAO struct {
	Ctx context.Context
}

func (dao *ShelfDAO) Context() context.Context {
	return dao.Ctx
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

func (dao *ShelfDAO) GetShelf(id int64) (Shelf, error) {
	var shelf Shelf
	log.Errorf(dao.Ctx, "GetShelf: %d", id)

	shelfKey := datastore.NewKey(dao.Ctx, "Shelf", "", id, nil)

	if err := datastore.Get(dao.Ctx, shelfKey, &shelf); err != nil {
		return shelf, fmt.Errorf("ShelfDAO: could not get shelf: %v", err)
	}

	workDao := &WorkDAO{Ctx: dao.Ctx}
	works, worksErr := workDao.ListWorksByShelf(shelfKey.IntID())
	if worksErr != nil {
		return shelf, fmt.Errorf("GetShelf: %v", worksErr)
	}

	log.Errorf(dao.Ctx, "GetShelf [works]: %v", works)
	log.Errorf(dao.Ctx, "GetShelf [set key]: %#v", shelfKey)

	shelf.Works = works
	shelf.Key = shelfKey
	return shelf, nil
}
