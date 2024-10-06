package dbrepo

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/roihan12/backend/internal/models"
)

type PostgresDBRepo struct {
	DB *sql.DB
}

const dbTimeout = 3 * time.Second

func (repo *PostgresDBRepo) Connection() *sql.DB {
	return repo.DB
}
func (repo *PostgresDBRepo) AllMovies(genre ...int) ([]*models.Movie, error) {

	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	where := ""

	if len(genre) > 0 {
		where = fmt.Sprintf("WHERE id IN (SELECT movie_id FROM movies_genres WHERE genre_id = %d)", genre[0])
	}

	query := fmt.Sprintf(`SELECT id, title, release_date, runtime, mpaa_rating, description, coalesce(image, ''), created_at, updated_at FROM movies %s ORDER BY title`, where)

	rows, err := repo.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var movies []*models.Movie

	for rows.Next() {
		var movie models.Movie
		err := rows.Scan(
			&movie.ID,
			&movie.Title,
			&movie.RealaseDate,
			&movie.RunTime,
			&movie.MPAARating,
			&movie.Description,
			&movie.Image,
			&movie.CreatedAt,
			&movie.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		movies = append(movies, &movie)
	}

	return movies, nil
}

func (repo *PostgresDBRepo) GetUserByEmail(email string) (*models.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `SELECT id, first_name, last_name, email, password, created_at, updated_at FROM users WHERE email=$1`

	var user models.User
	row := repo.DB.QueryRowContext(ctx, query, email)

	err := row.Scan(
		&user.ID,
		&user.FirstName,
		&user.LastName,
		&user.Email,
		&user.Password,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (repo *PostgresDBRepo) OneMovie(id int) (*models.Movie, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `SELECT id, title, release_date, runtime, mpaa_rating, description, coalesce(image, ''), created_at, updated_at FROM movies WHERE id = $1`

	row := repo.DB.QueryRowContext(ctx, query, id)

	var movie models.Movie

	err := row.Scan(
		&movie.ID,
		&movie.Title,
		&movie.RealaseDate,
		&movie.RunTime,
		&movie.MPAARating,
		&movie.Description,
		&movie.Image,
		&movie.CreatedAt,
		&movie.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	// get the genres, if any
	query = `SELECT g.id, g.genre from movies_genres mg LEFT JOIN genres g ON (g.id = mg.genre_id)WHERE mg.movie_id = $1 order by g.genre`

	rows, err := repo.DB.QueryContext(ctx, query, id)
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}
	defer rows.Close()

	var genres []*models.Genre

	for rows.Next() {
		var g models.Genre
		err := rows.Scan(
			&g.ID,
			&g.Genre,
		)
		if err != nil {
			return nil, err
		}
		genres = append(genres, &g)
	}
	movie.Genres = genres

	return &movie, nil

}

func (repo *PostgresDBRepo) OneMovieForEdit(id int) (*models.Movie, []*models.Genre, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `SELECT id, title, release_date, runtime, mpaa_rating, description, coalesce(image, ''), created_at, updated_at FROM movies WHERE id = $1`

	row := repo.DB.QueryRowContext(ctx, query, id)

	var movie models.Movie

	err := row.Scan(
		&movie.ID,
		&movie.Title,
		&movie.RealaseDate,
		&movie.RunTime,
		&movie.MPAARating,
		&movie.Description,
		&movie.Image,
		&movie.CreatedAt,
		&movie.UpdatedAt,
	)

	if err != nil {
		return nil, nil, err
	}

	// get the genres, if any
	query = `SELECT g.id, g.genre from movies_genres mg LEFT JOIN genres g ON (g.id = mg.genre_id)WHERE mg.movie_id = $1 order by g.genre`

	rows, err := repo.DB.QueryContext(ctx, query, id)
	if err != nil && err != sql.ErrNoRows {
		return nil, nil, err
	}
	defer rows.Close()

	var genres []*models.Genre
	var genresArray []int

	for rows.Next() {
		var g models.Genre
		err := rows.Scan(
			&g.ID,
			&g.Genre,
		)
		if err != nil {
			return nil, nil, err
		}
		genres = append(genres, &g)
		genresArray = append(genresArray, g.ID)
	}
	movie.Genres = genres
	movie.GenresArray = genresArray

	var allGenres []*models.Genre

	query = `SELECT id, genre FROM genres ORDER BY genre`
	gRows, err := repo.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, nil, err
	}
	defer gRows.Close()

	for gRows.Next() {
		var g models.Genre
		err := gRows.Scan(
			&g.ID,
			&g.Genre,
		)
		if err != nil {
			return nil, nil, err
		}
		allGenres = append(allGenres, &g)
	}

	return &movie, allGenres, nil

}

func (repo *PostgresDBRepo) GetUserByID(id int) (*models.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `SELECT id, first_name, last_name, email, password, created_at, updated_at FROM users WHERE id =$1`

	var user models.User
	row := repo.DB.QueryRowContext(ctx, query, id)

	err := row.Scan(
		&user.ID,
		&user.FirstName,
		&user.LastName,
		&user.Email,
		&user.Password,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (repo *PostgresDBRepo) AllGenres() ([]*models.Genre, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `SELECT id, genre, created_at, updated_at FROM genres ORDER BY genre`

	rows, err := repo.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var genres []*models.Genre

	for rows.Next() {
		var g models.Genre
		err := rows.Scan(
			&g.ID,
			&g.Genre,
			&g.CreatedAt,
			&g.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		genres = append(genres, &g)
	}

	return genres, nil
}

func (m *PostgresDBRepo) InsertMovie(movie models.Movie) (int, error) {

	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `INSERT INTO movies (title, release_date, runtime, mpaa_rating, description, created_at, updated_at, image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`

	var newID int

	err := m.DB.QueryRowContext(ctx, query, movie.Title, movie.RealaseDate, movie.RunTime, movie.MPAARating, movie.Description, movie.CreatedAt, movie.UpdatedAt, movie.Image).Scan(&newID)

	if err != nil {
		return 0, err
	}

	return newID, nil

}

func (m *PostgresDBRepo) UpdateMovie(movie models.Movie) error {

	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `UPDATE movies SET title = $1, release_date = $2, runtime = $3, mpaa_rating = $4, description = $5, updated_at = $6, image = $7 WHERE id = $8`

	_, err := m.DB.ExecContext(ctx, query, movie.Title, movie.RealaseDate, movie.RunTime, movie.MPAARating, movie.Description, movie.UpdatedAt, movie.Image, movie.ID)

	if err != nil {
		return err
	}

	return nil
}

func (m *PostgresDBRepo) UpdateMovieGenres(id int, genreIDs []int) error {

	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `DELETE FROM movies_genres WHERE movie_id = $1`

	_, err := m.DB.ExecContext(ctx, query, id)
	if err != nil {
		return err
	}

	for _, g := range genreIDs {
		query = `INSERT INTO movies_genres (movie_id, genre_id) VALUES ($1, $2)`
		_, err = m.DB.ExecContext(ctx, query, id, g)
		if err != nil {
			return err
		}
	}

	return nil
}

func (m *PostgresDBRepo) DeleteMovie(id int) error {

	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `DELETE FROM movies WHERE id = $1`

	_, err := m.DB.ExecContext(ctx, query, id)
	if err != nil {
		return err
	}

	return nil
}
