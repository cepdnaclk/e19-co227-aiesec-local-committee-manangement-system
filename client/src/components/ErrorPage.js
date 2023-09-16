import React from "react";

import Alert from "@mui/material/Alert";

const ErrorPage = ({ error }) => {
  return (
    <Alert severity="error">
      An Error has Occurred. Please Retry.
      <br />
      Message: {error?.message}
    </Alert>
  );
};

export default ErrorPage;
