import React from "react";

import Alert from "@mui/material/Alert";

const ErrorPage = ({ error }) => {
  return (
    <Alert severity="error">
      An error has occurred. Please retry.
      <br />
      Message: {error?.message}
    </Alert>
  );
};

export default ErrorPage;
