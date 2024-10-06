import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import Input from "./form/Input";
import Select from "./form/Select";
import TextArea from "./form/TextArea";
import CheckBox from "./form/Checkbox";
import Swal from "sweetalert2";

const EditMovie = () => {
  const navigate = useNavigate();

  const { jwtToken } = useOutletContext();

  const [error, setError] = useState(null);
  const [errors, setErrors] = useState([]);

  const mpaaOptions = [
    { id: "G", value: "G" },
    { id: "PG", value: "PG" },
    { id: "PG13", value: "PG13" },
    { id: "R", value: "R" },
    { id: "NC17", value: "NC17" },
    { id: "18A", value: "18A" },
  ];
  const hasError = (key) => {
    return errors.indexOf(key) !== -1;
  };

  const [movie, setMovie] = useState({
    id: 0,
    title: "",
    release_date: "",
    runtime: "",
    mpaa_rating: "",
    description: "",
    genres: [],
    genres_array: [Array(13).fill(false)],
  });

  // get id from url
  let { id } = useParams();

  if (id === undefined) {
    id = 0;
  }
  useEffect(() => {
    if (jwtToken === "") {
      navigate("/login");
      return;
    }
    if (id === 0) {
      // adding movie
      setMovie({
        id: 0,
        title: "",
        release_date: "",
        runtime: "",
        mpaa_rating: "",
        description: "",
        genres: [],
        genres_array: [Array(13).fill(false)],
      });
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      const requestOptions = {
        method: "GET",
        headers: headers,
      };
      fetch(`/genres`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          const checks = [];

          data.forEach((g) => {
            checks.push({ id: g.id, genre: g.genre, checked: false });
          });
          setMovie((m) => ({
            ...m,
            genres: checks,
            genres_array: [],
          }));
        })
        .catch((error) => console.log(error));
    } else {
      //updating movie

      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("Authorization", `Bearer ${jwtToken}`);

      const requestOptions = {
        method: "GET",
        headers: headers,
      };
      fetch(`/admin/movies/${id}`, requestOptions)
        .then((response) => {
          if (response.status !== 200) {
            setError("Invalid response code: " + response.status);
          }
          return response.json();
        })
        .then((data) => {
          // fix release date
          data.movie.release_date = new Date(data.movie.release_date)
            .toISOString()
            .split("T")[0];

          const checks = [];

          data.genres.forEach((g) => {
            if (data.movie.genres_array.indexOf(g.id) !== -1) {
              checks.push({ id: g.id, genre: g.genre, checked: true });
            } else {
              checks.push({ id: g.id, genre: g.genre, checked: false });
            }

            // set state
            setMovie({
              ...data.movie,
              genres: checks,
            });
          });
        })
        .catch((error) => console.log(error));
    }
  }, [id, jwtToken, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    let errors = [];

    let required = [
      { field: movie.title, name: "title" },
      { field: movie.release_date, name: "release_date" },
      { field: movie.runtime, name: "runtime" },
      { field: movie.description, name: "description" },
      { field: movie.mpaa_rating, name: "mpaa_rating" },
    ];

    required.forEach(function (obj) {
      if (obj.field === "") {
        errors.push(obj.name);
      }
    });

    if (movie.genres_array.length === 0) {
      Swal.fire({
        title: "Error",
        text: "Please select at least one genre",
        icon: "error",
        confirmButtonText: "OK",
      });
      errors.push("genres");
    }

    setErrors(errors);

    if (errors.length > 0) {
      return false;
    }

    // pass data to backend
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", `Bearer ${jwtToken}`);
    let method = "PUT";

    if (movie.id > 0) {
      method = "PATCH";
    }

    const requestBody = movie;
    // we need to convert the values in JSON for release_date and for runtime to int

    requestBody.release_date = new Date(movie.release_date);
    requestBody.runtime = parseInt(movie.runtime, 10);

    let requestOptions = {
      method: method,
      headers: headers,
      body: JSON.stringify(requestBody),
      credentials: "include",
    };

    fetch(`/admin/movies/${movie.id}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          navigate("/manage-catalog");
        }
      })
      .catch((error) => console.log(error));
  };

  const handleChange = () => (e) => {
    let value = e.target.value;
    let name = e.target.name;

    setMovie({ ...movie, [name]: value });
  };

  const handleCheck = (e, position) => {
    console.log(position);
    console.log("Value in handleCheck", e.target.value);
    console.log("checked", e.target.checked);
    console.log("position is", position);

    let tmpArr = movie.genres;

    tmpArr[position].checked = !tmpArr[position].checked;

    let tmpIDs = movie.genres_array;
    if (!e.target.checked) {
      tmpIDs.splice(tmpIDs.indexOf(e.target.value));
    } else {
      tmpIDs.push(parseInt(e.target.value, 10));
    }

    setMovie({
      ...movie,
      genres_array: tmpIDs,
    });
  };

  const confirmDelete = () => {
    Swal.fire({
      title: "Delete movie?",
      text: "You cannot undo this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        let headers = new Headers();
        headers.append("Authorization", `Bearer ${jwtToken}`);

        const requestOptions = {
          method: "DELETE",
          headers: headers,
          credentials: "include",
        };
        
        fetch(`/admin/movies/${movie.id}`, requestOptions).then((response) => response.json()).then((data) => {
          if (data.error) {
            console.log(data.error);
          } else {
            navigate("/manage-catalog");
          }
        }).catch((error) => console.log(error));
      }
    });
  };

  if (error !== null) {
    return <div>Error : {error.message}</div>;
  } else {
    return (
      <div>
        <h2>Add/Edit Movie</h2>
        <hr />
        {/* <pre>{JSON.stringify(movie, null, 3)}</pre> */}

        <form onSubmit={handleSubmit}>
          <input type="hidden" name="id" value={movie.id} id="id" />

          <Input
            title="Title"
            type="text"
            className="form-control"
            name="title"
            value={movie.title}
            onChange={handleChange("title")}
            errorDiv={hasError("title") ? "text-danger" : "d-none"}
            errorMsg={"Please enter a title"}
          />

          <Input
            title="Release Date"
            type="date"
            name="release_date"
            className="form-control"
            value={movie.release_date}
            onChange={handleChange("realase_date")}
            errorDiv={hasError("release_date") ? "text-danger" : "d-none"}
            errorMsg={"Please enter a release date"}
          />

          <Input
            title="Runtime"
            type="text"
            className="form-control"
            name="runtime"
            value={movie.runtime}
            onChange={handleChange("runtime")}
            errorDiv={hasError("runtime") ? "text-danger" : "d-none"}
            errorMsg={"Please enter a runtime"}
          />

          <Select
            title="MPAA Rating"
            name="mpaa_rating"
            options={mpaaOptions}
            value={movie.mpaa_rating}
            onChange={handleChange("mpaa_rating")}
            placeholder="Select MPAA Rating"
            errorMsg={"Please select a MPAA Rating"}
            errorDiv={hasError("mpaa_rating") ? "text-danger" : "d-none"}
          />

          <TextArea
            title="Description"
            name="description"
            className="form-control"
            value={movie.description}
            rows="3"
            onChange={handleChange("description")}
            errorDiv={hasError("description") ? "text-danger" : "d-none"}
            errorMsg={"Please enter a description"}
          />

          <hr />

          <h3>Genres</h3>

          {movie.genres && movie.genres.length > 1 && (
            <>
              {Array.from(movie.genres).map((g, index) => (
                <CheckBox
                  title={g.genre}
                  name={"genres"}
                  id={"genre-" + index}
                  onChange={(event) => handleCheck(event, index)}
                  checked={movie.genres[index].checked}
                  value={g.id}
                />
              ))}
            </>
          )}

          <hr />
          <button className="btn btn-primary">Save</button>
          {movie.id > 0 && (
            <a href="#!" className="btn btn-danger ms-2" onClick={confirmDelete}>
              Delete Movie
            </a>
          )}
        </form>
      </div>
    );
  }
};

export default EditMovie;
