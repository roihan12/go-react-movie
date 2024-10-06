package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/roihan12/backend/internal/repository"
	"github.com/roihan12/backend/internal/repository/dbrepo"
)

const port = 8000

type application struct {
	Domain       string
	DSN          string
	DB           repository.DatabaseRepo
	auth         Auth
	JWTSecret    string
	JWTIssuer    string
	JWTAudience  string
	CookieDomain string
	APIKey       string
}

func main() {
	// set application config

	var app application
	// read from command line
	flag.StringVar(&app.DSN, "dsn", "host=localhost port=5432 user=postgres password=root123 dbname=movies sslmode=disable timezone=UTC connect_timeout=5", "Postgres connection ")
	flag.StringVar(&app.JWTSecret, "jwt-secret", "verysecretsecret", "signing secret")
	flag.StringVar(&app.JWTIssuer, "jwt-issuer", "example.com", "signing issuer")
	flag.StringVar(&app.JWTAudience, "jwt-audience", "example.com", "signing audience")
	flag.StringVar(&app.CookieDomain, "cookie-domain", "localhost", "cookie domain")
	flag.StringVar(&app.Domain, "domain", "example.com", "domain")
	flag.StringVar(&app.APIKey, "api-key", "de7487cab03b557aa8e4f425887d70d3", "api key")
	flag.Parse()

	// connect to database
	conn, err := app.connectDB()

	if err != nil {
		log.Fatal(err)
	}

	app.DB = &dbrepo.PostgresDBRepo{DB: conn}
	defer app.DB.Connection().Close()

	app.auth = Auth{
		Issuer:        app.JWTIssuer,
		Audience:      app.JWTAudience,
		Secret:        app.JWTSecret,
		TokenExpiry:   15 * time.Minute,
		RefreshExpiry: 24 * time.Hour,
		CookiePath:    "/",
		CookieName:    "__Host-refresh_token",
		CookieDomain:  app.CookieDomain,
	}

	log.Println("Starting server on port", port)

	// start http server
	err = http.ListenAndServe(fmt.Sprintf(":%d", port), app.routes())

	if err != nil {
		log.Fatal(err)
	}

}
