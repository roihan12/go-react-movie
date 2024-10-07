import React, { useEffect, useState } from "react";
import Input from "./form/Input";
import { Link } from "react-router-dom";

const GraphQL = () => {
  // set up stateful variabels
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [fullList, setFullList] = useState([]);

  // perform a search
  const performSearch = () => {
    const payload = `
    {
    search(titleContains: "${searchTerm}") {
    id
    title
    runtime
    release_date
    mpaa_rating
    description
    }
    }
    `;

    const headers = new Headers();
    headers.append("Content-Type", "application/graphql");

    const requestOptions = {
      method: "POST",
      headers: headers,
      body: payload,
    };

    fetch("/graphql", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        
        let theList = Object.values(data.data.search);
        console.log("list", theList);
        setMovies(theList);
      })
      .catch((error) => console.log(error));
  };

  const handleChange = (e) => {
    e.preventDefault();

    // let term = e.target.value;
    // setSearchTerm(term);
    console.log("searchTerm", searchTerm);

    if (searchTerm.length > 0) {
      performSearch();
    } else {
      setMovies(fullList);
    }
  };

  // useefect
  useEffect(() => {
    const payload = `
  {
  list {
  id
  title
  runtime
  release_date
  mpaa_rating
  description
  }
  }
  `;

    const headers = new Headers();
    headers.append("Content-Type", "application/graphql");

    const requestOptions = {
      method: "POST",
      headers: headers,
      body: payload,
    };

    fetch("/graphql", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        let theList = Object.values(data.data.list);
        setMovies(theList);
        setFullList(theList);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div>
      <h2>GraphQL</h2>
      <hr />
      <form onSubmit={handleChange}>
        <Input
          type="search"
          title="Search"
          name="search"
          className="form-control"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>

      {movies ? (
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Movie</th>
              <th>Realease Date</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie) => (
              <tr key={movie.id}>
                <td>
                  <Link to={`/movies/${movie.id}`}>{movie.title}</Link>
                </td>
                <td>{new Date(movie.release_date).toLocaleDateString}</td>
                <td>{movie.mpaa_rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No movies found</p>
      )}
    </div>
  );
};

export default GraphQL;
