import { useRouteError } from "react-router-dom";
import React from "react";

const ErrorPage = () => {
  const error = useRouteError();
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h1>Oops!</h1>
          <p>Sorry, an unexpected error has occurred.</p>

          <p>
            <em>{error.statusText || error.message}</em>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
