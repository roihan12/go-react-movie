import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Movie = () => {
  const [movie, setMovie] = useState({});

  console.log(movie);
  let { id } = useParams();

  console.log(id);
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

    const movie = moviesList.find((movie) => movie.id === parseInt(id));

    setMovie(movie);
  }, [id]);

  return (
    <div>
      <h2>Movie: {movie.title}</h2>
      <small>
       {movie.genre}, {movie.release_date},
        {movie.runtime} minutes, Rated {movie.mpaa_rating}
      </small>
      <hr />

      <p>{movie.description}</p>
    </div>
  );
};

export default Movie;
