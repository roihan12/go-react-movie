import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
const Homepage = () => {
  const [jwtToken, setJwtToken] = React.useState("");

  const [alertMessage, setAlertMessage] = React.useState("");
  const [alertClassName, setAlertClassName] = React.useState("d-none");
  const navigate = useNavigate();

  const logOut = () => {
    setJwtToken("");
    navigate("/login");
  };
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
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
