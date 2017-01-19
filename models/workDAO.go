package models

import (
	"fmt"

	"golang.org/x/net/context"

	"google.golang.org/appengine/datastore"
	"google.golang.org/appengine/log"
)

type WorkDAO struct {
	Ctx context.Context
}

func (dao *WorkDAO) ListWorks() (Works, error) {
	var works Works

	q := datastore.NewQuery("Work")
	keys, err := q.GetAll(dao.Ctx, &works)

	if err != nil {
		log.Errorf(dao.Ctx, "ListWorks: %v", err)
		return nil, fmt.Errorf("WorkDAO: could not list works: %v", err)
	}

	for i, key := range keys {
		works[i].Id = key.IntID()
	}

	return works, nil
}

func (dao *WorkDAO) ListWorksByShelf(shelfID int64) (Works, error) {
	var works Works

	key := datastore.NewKey(dao.Ctx, "Shelf", "", shelfID, nil)
	vq := datastore.NewQuery("Work").Filter("ShelfKey=", key)

	workKeys, err := vq.GetAll(dao.Ctx, &works)
	if err != nil {
		log.Errorf(dao.Ctx, "GetAll: %v", err)
		return nil, fmt.Errorf("WORKDAO: could not list works by shelf: %v", err)
	}

	if works == nil {
		works = Works{}
	} else {
		for j, workKey := range workKeys {
			works[j].Id = workKey.IntID()
			works[j].ShelfId = shelfID
		}
	}

	return works, nil
}

func (dao *WorkDAO) AddWork(work Work) (Work, error) {
	shelfKey := datastore.NewKey(dao.Ctx, "Shelf", "", work.ShelfId, nil)
	work.ShelfKey = shelfKey

	workKey := datastore.NewIncompleteKey(dao.Ctx, "Work", nil)
	key, err := datastore.Put(dao.Ctx, workKey, &work)
	if err != nil {
		log.Errorf(dao.Ctx, "AddWork: %v", err)
		return work, fmt.Errorf("WORKDAO: could not add work: %v", err)
	}

	work.Id = key.IntID()
	return work, nil
}

func (dao *WorkDAO) GetWork(id int64) (Work, error) {
	var work Work
	workKey := datastore.NewKey(dao.Ctx, "Work", "", id, nil)

	if err := datastore.Get(dao.Ctx, workKey, &work); err != nil {
		log.Errorf(dao.Ctx, "GetWork: %v", err)
		return work, fmt.Errorf("WORKDAO: could not get work: %v", err)
	}

	work.Id = workKey.IntID()
	return work, nil
}

func (dao *WorkDAO) UpdateWork(work Work) (Work, error) {
	shelfKey := datastore.NewKey(dao.Ctx, "Shelf", "", work.ShelfId, nil)
	work.ShelfKey = shelfKey

	workKey := datastore.NewKey(dao.Ctx, "Work", "", work.Id, nil)

	if _, err := datastore.Put(dao.Ctx, workKey, &work); err != nil {
		log.Errorf(dao.Ctx, "UpdateWork: %v", err)
		return work, fmt.Errorf("WORKDAO: could not update work: %v", err)
	}

	return work, nil
}

func (dao *WorkDAO) DeleteWork(id int64) error {
	workKey := datastore.NewKey(dao.Ctx, "Work", "", id, nil)

	if err := datastore.Delete(dao.Ctx, workKey); err != nil {
		log.Errorf(dao.Ctx, "DeleteWork: %v", err)
		return fmt.Errorf("WORKDAO: could not delete work: %v", err)
	}

	return nil
}
