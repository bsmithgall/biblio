package handlers

import (
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

func getIdFromParams(r *http.Request) (int64, error) {
	return strconv.ParseInt(mux.Vars(r)["key"], 10, 64)
}
