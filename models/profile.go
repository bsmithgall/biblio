package biblio

type Profile struct {
	ID          string `json:"-"`
	DisplayName string `json:"display_name"`
	ImageURL    string `json:"image_url"`
}
