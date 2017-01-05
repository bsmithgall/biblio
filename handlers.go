package biblio

import (
	"encoding/json"
	"fmt"
	"net/http"

	"models"
)

func makeWorks() models.Works {
	return models.Works{
		models.Work{Id: 1, Title: "1984", Author: "George Orwell"},
		models.Work{Id: 2, Title: "Brave New World", Author: "Aldous Huxley"},
	}
}

func HomeHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "Hello, World!")
}

func ShelvesHandler(w http.ResponseWriter, r *http.Request) {
	works := makeWorks()

	shelves := models.Shelves{
		models.Shelf{Id: 1, Title: "Want", Works: []models.Work{}},
		models.Shelf{Id: 2, Title: "Read", Works: works},
	}
	json.NewEncoder(w).Encode(shelves)
}

func WorksHandler(w http.ResponseWriter, r *http.Request) {
	works := makeWorks()
	json.NewEncoder(w).Encode(works)
}
