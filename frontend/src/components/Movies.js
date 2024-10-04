import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Movies = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    let moviesList = [
      {
        id: 1,
        title: "Spiderman",
        genre: "Action",
        release_date: "2022-01-01",
        runtime: 120,
        mpaa_rating: "PG-13",
        description: "spiderman movie",
      },
      {
        id: 2,
        title: "Batman",
        genre: "Action",
        release_date: "2022-01-01",
        runtime: 140,
        mpaa_rating: "PG-13",
        description: "batman movie",
      },
    ];

    setMovies(moviesList);
  }, []);

  return (
    <div>
      <h2>Movies</h2>
      <hr />
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Movie</th>
            <th>Genre</th>
            <th>Release Date</th>
            <th>Rating</th>
          </tr>
        </thead>

        <tbody>
          {movies.map((movie) => (
            <tr key={movie.id}>
              <td>
                <Link to={`/movies/${movie.id}`}>{movie.title} </Link>
              </td>
              <td>{movie.genre}</td>
              <td>{movie.release_date}</td>
              <td>{movie.mpaa_rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Movies;
