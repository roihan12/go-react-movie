import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Movies = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const requestOptions = {
      method: "GET",
      headers: headers,
    };

    fetch("http://localhost:8000/movies", requestOptions)
      .then((response) => response.json())
      .then((data) => setMovies(data))
      .catch((error) => console.log(error));


    
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
