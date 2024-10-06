import React, { useCallback, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
const Homepage = () => {
  const [jwtToken, setJwtToken] = React.useState("");

  const [alertMessage, setAlertMessage] = React.useState("");
  const [alertClassName, setAlertClassName] = React.useState("d-none");

  const [tickInterval, setTickInterval] = React.useState(0);
  const navigate = useNavigate();

  const logOut = () => {
    const requestOptions = {
      method: "GET",
      credentials: "include",
    };

    fetch("/logout", requestOptions)
      .catch((error) => {
        console.log("error logging out", error);
      })
      .finally(() => {
        setJwtToken("");
        toggleRefresh(false);
      });

    navigate("/login");
  };

  const toggleRefresh = useCallback(
    (status) => {
      console.log("clicked");

      if (status) {
        console.log("turning on ticking");
        let i = setInterval(() => {
            const requestOptions = {
              method: "GET",
              credentials: "include",
            };
          console.log("this will run every second");
          fetch("/refresh", requestOptions)
            .then((response) => response.json())
            .then((data) => {
              if (data.access_token) {
                setJwtToken(data.access_token);
               
              }
            })
            .catch((error) => {
              console.log("user is not logged in", error);
            });
        }, 600000);
        setTickInterval(i);
        console.log("setting tick interval to", i);
      } else {
        console.log("turning off ticking");
        console.log("turning off tickInterval", tickInterval);
        setTickInterval(null);
        clearInterval(tickInterval);
      }
    },
    [tickInterval]
  );

  useEffect(() => {
    if (jwtToken === "") {
      const requestOptions = {
        method: "GET",
        credentials: "include",
      };

      fetch("/refresh", requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if (data.access_token) {
            setJwtToken(data.access_token);
            toggleRefresh(true);
          }
        })
        .catch((error) => {
          console.log("user is not logged in", error);
        });
    }
  }, [jwtToken, toggleRefresh]);

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h1>Go Watch a Movie</h1>
        </div>
        <div className="col text-end">
          {jwtToken === "" ? (
            <Link to="/login">
              <span className="badge bg-warning">Login</span>
            </Link>
          ) : (
            <a href="/#!">
              <span className="badge bg-danger" onClick={logOut}>
                Logout
              </span>
            </a>
          )}
        </div>
        <hr className="mb-3" />
      </div>

      <div className="row">
        <div className="col-md-2">
          <nav>
            <div className="list-group">
              <Link
                to="/"
                className="list-group-item list-group-item-action"
                aria-current="true"
              >
                Home
              </Link>{" "}
              <Link
                to="/movies"
                className="list-group-item list-group-item-action"
              >
                Movies
              </Link>
              <Link
                to="/genres"
                className="list-group-item list-group-item-action"
              >
                Genres
              </Link>
              {jwtToken !== "" && (
                <>
                  <Link
                    to="/admin/movie/0"
                    className="list-group-item list-group-item-action"
                  >
                    Add Movie
                  </Link>
                  <Link
                    to="/manage-catalog"
                    className="list-group-item list-group-item-action"
                  >
                    Manage Catalog
                  </Link>
                  <Link
                    to="/graphql"
                    className="list-group-item list-group-item-action"
                  >
                    GraphQl
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>

        <div className="col-md-10">
          <Alert message={alertMessage} className={alertClassName} />
          <Outlet
            context={{
              jwtToken,
              setJwtToken,
              setAlertMessage,
              setAlertClassName,
              toggleRefresh,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
