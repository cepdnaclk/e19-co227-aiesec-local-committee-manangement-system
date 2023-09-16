import React from "react";

import Button from "@mui/material/Button";

import { useFormikContext } from "formik";

const FormSubmitButton = ({ editMode, disabled }) => {
  const { isSubmitting, isValid, isValidating } = useFormikContext();

  const buttonText = () => {
    if (editMode.includes("add")) return "Add";
    else if (editMode.includes("view")) return "Delete";
    else if (editMode.includes("edit")) return "Save";
    else return "";
  };

  const buttonColor = () => {
    if (editMode.includes("view")) return "error";
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

export default FormSubmitButton;
