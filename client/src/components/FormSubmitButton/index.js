import React from "react";

import Button from "@mui/material/Button";
import { useFormikContext } from "formik";

const FormSubmitButton = ({ mode, disabled }) => {
  const { isSubmitting, isValid, isValidating } = useFormikContext();

  const buttonText = () => {
    if (mode.includes("add") || mode.includes("new")) return "Add";
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
      disabled={disabled || isSubmitting || isValidating}
      variant="contained"
      sx={{ m: 2 }}
      color={buttonColor()}
    >
      {buttonText()}
    </Button>
  );
};

export default FormSubmitButton;
