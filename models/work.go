package biblio

import (
	"encoding/json"
	"fmt"

	"golang.org/x/net/context"

	"google.golang.org/appengine/datastore"
	"google.golang.org/appengine/log"
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

func (w Work) MarshalJSON() ([]byte, error) {
	type Alias Work

	return json.Marshal(&struct {
		Id      int64 `json:"id"`
		ShelfId int64 `json:"shelf_id"`
		Alias
	}{
		Id:      w.Key.IntID(),
		ShelfId: w.ShelfKey.IntID(),
		Alias:   (Alias)(w),
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

type WorkDAO struct {
	Ctx context.Context
}

func (dao *WorkDAO) ListWorks() (Works, error) {
	log.Infof(dao.Ctx, "ListWorks")
	var works Works

	keys, err := datastore.NewQuery("Work").GetAll(dao.Ctx, &works)
	if err != nil {
		log.Errorf(dao.Ctx, "ListWorks: %v", err)
		return nil, fmt.Errorf("WorkDAO: could not list works: %v", err)
	}

	for i, key := range keys {
		works[i].Key = key
	}

	log.Infof(dao.Ctx, "ListWorks: %#v", works)
	return works, nil
}

func (dao *WorkDAO) ListWorksByShelf(shelfID int64) (Works, error) {
	log.Infof(dao.Ctx, "ListWorksByShelf: %d", shelfID)
	var works Works

	key := datastore.NewKey(dao.Ctx, "Shelf", "", shelfID, nil)
	vq := datastore.NewQuery("Work").Filter("ShelfKey=", key)

	workKeys, err := vq.GetAll(dao.Ctx, &works)
	if err != nil {
		log.Errorf(dao.Ctx, "GetAll: %v", err)
		return nil, fmt.Errorf("WORKDAO: could not list works by shelf: %v", err)
	}

	for j, workKey := range workKeys {
		works[j].Key = workKey
	}

	return works, nil
}

func (dao *WorkDAO) AddWork(work Work) (Work, error) {
	log.Infof(dao.Ctx, "AddWork: %#v", work)
	shelfKey := datastore.NewKey(dao.Ctx, "Shelf", "", work.ShelfId, nil)
	work.ShelfKey = shelfKey

	workKey := datastore.NewIncompleteKey(dao.Ctx, "Work", nil)
	key, err := datastore.Put(dao.Ctx, workKey, &work)
	if err != nil {
		log.Errorf(dao.Ctx, "AddWork: %v", err)
		return work, fmt.Errorf("WORKDAO: could not add work: %v", err)
	}

	work.Key = key
	return work, nil
}

func (dao *WorkDAO) GetWork(id int64) (Work, error) {
	log.Infof(dao.Ctx, "GetWork: %d", id)
	var work Work
	workKey := datastore.NewKey(dao.Ctx, "Work", "", id, nil)

	if err := datastore.Get(dao.Ctx, workKey, &work); err != nil {
		log.Errorf(dao.Ctx, "GetWork: %v", err)
		return work, fmt.Errorf("WORKDAO: could not get work: %v", err)
	}

	work.Key = workKey
	return work, nil
}

func (dao *WorkDAO) UpdateWork(work Work) (Work, error) {
	log.Infof(dao.Ctx, "UpdateWork: %#v", work)
	shelfKey := datastore.NewKey(dao.Ctx, "Shelf", "", work.ShelfId, nil)
	work.ShelfKey = shelfKey

	workKey := datastore.NewKey(dao.Ctx, "Work", "", work.Id, nil)
	key, err := datastore.Put(dao.Ctx, workKey, &work)

	if err != nil {
		log.Errorf(dao.Ctx, "UpdateWork: %v", err)
		return work, fmt.Errorf("WORKDAO: could not update work: %v", err)
	}

	work.Key = key
	return work, nil
}

func (dao *WorkDAO) DeleteWork(id int64) error {
	log.Infof(dao.Ctx, "DeleteWork: %d", id)
	workKey := datastore.NewKey(dao.Ctx, "Work", "", id, nil)

	if err := datastore.Delete(dao.Ctx, workKey); err != nil {
		log.Errorf(dao.Ctx, "DeleteWork: %v", err)
		return fmt.Errorf("WORKDAO: could not delete work: %v", err)
	}

	return nil
}
