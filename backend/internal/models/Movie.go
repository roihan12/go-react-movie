package models

import "time"

type Movie struct {
	ID           string    `json:"id"`
	Title        string    `json:"title"`
	RealaseDate  time.Time `json:"release_date"`
	RunTime      int       `json:"runtime"`
	MPAARating   string    `json:"mpaa_rating"`
	Description  string    `json:"description"`
	Image        string    `json:"image"`
	CreatedAt    time.Time `json:"-"`
	UpdatedAt    time.Time `json:"-"`
}
