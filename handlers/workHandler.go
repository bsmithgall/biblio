package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"

	"google.golang.org/appengine"

	"models"
)

func WorkListHandler(w http.ResponseWriter, r *http.Request) {
	dao := &models.WorkDAO{Ctx: appengine.NewContext(r)}

	switch r.Method {
	case "GET":
		listWorks(w, r, dao)
	case "POST":
		addWork(w, r, dao)
	default:
		http.Error(w, fmt.Sprintf("This method (%s) is not supported", r.Method), http.StatusMethodNotAllowed)
		return
	}
}

func WorkHandler(w http.ResponseWriter, r *http.Request) {
	dao := &models.WorkDAO{Ctx: appengine.NewContext(r)}

	switch r.Method {
	case "GET":
		getWork(w, r, dao)
	case "PUT":
		updateWork(w, r, dao)
	case "DELETE":
		deleteWork(w, r, dao)
	default:
		http.Error(w, fmt.Sprintf("This method (%s) is not supported", r.Method), http.StatusMethodNotAllowed)
		return
	}
}

func listWorks(w http.ResponseWriter, r *http.Request, dao models.WorkDB) {
	works, err := dao.ListWorks()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if works == nil {
		works = models.Works{}
	}
	json.NewEncoder(w).Encode(works)
}

func addWork(w http.ResponseWriter, r *http.Request, dao models.WorkDB) {
	var work models.Work

	if err := json.NewDecoder(r.Body).Decode(&work); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	work, err := dao.AddWork(work)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Location", r.URL.String()+fmt.Sprintf("/%d", work.Id))
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(work)
}

func getWork(w http.ResponseWriter, r *http.Request, dao models.WorkDB) {
	id, err := getIdFromParams(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	work, err := dao.GetWork(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(work)
}

func updateWork(w http.ResponseWriter, r *http.Request, dao models.WorkDB) {
	var work models.Work

	id, err := getIdFromParams(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	work, getWorkErr := dao.GetWork(id)
	if getWorkErr != nil {
		http.Error(w, getWorkErr.Error(), http.StatusInternalServerError)
		return
	}

	if err := json.NewDecoder(r.Body).Decode(&work); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	work, updateErr := dao.UpdateWork(work)
	if updateErr != nil {
		http.Error(w, updateErr.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(work)
}

func deleteWork(w http.ResponseWriter, r *http.Request, dao models.WorkDB) {
	id, err := getIdFromParams(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if err := dao.DeleteWork(id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
	fmt.Println(w, []byte{})
}

func getIdFromParams(r *http.Request) (int64, error) {
	return strconv.ParseInt(mux.Vars(r)["key"], 10, 64)
}
