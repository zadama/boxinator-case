import React from "react";
import Spinner from "react-bootstrap/Spinner";

function PageLoader(props) {
  console.log(props);
  return (
    <div style={{ padding: "2rem" }} className="d-flex justify-content-center">
      <Spinner animation="border" variant="primary"></Spinner>
    </div>
  );
}

export default PageLoader;
