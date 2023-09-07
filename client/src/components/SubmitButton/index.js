import React from "react";

import Button from "@mui/material/Button";

import { useFormikContext } from "formik";

const SubmitButton = ({ mode, disabled }) => {
  const { isSubmitting, isValid, isValidating } = useFormikContext();

  const buttonText = () => {
    if (mode.includes("add")) return "Add";
    else if (mode.includes("view")) return "Delete";
    else if (mode.includes("edit")) return "Save";
    else return "";
  };

  const buttonColor = () => {
    if (mode.includes("view")) return "error";
    else return "primary";
  };

  return (
    <Button
      type="submit"
      disabled={disabled || isSubmitting || !isValid || isValidating}
      variant="contained"
      sx={{ m: 2 }}
      color={buttonColor()}
    >
      {buttonText()}
    </Button>
  );
};

export default SubmitButton;
