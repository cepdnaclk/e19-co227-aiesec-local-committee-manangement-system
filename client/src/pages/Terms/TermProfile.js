import React, { useState, useEffect, useContext, useMemo } from "react";
import { UserContext } from "../../context/UserContext";

import { Formik, Form as FormikForm } from "formik";

// ---------- COMPONENTS IMPORTS ---------- //
import Form from "./Form";

import ValidationSchema from "./ValidationSchema";

export default function TermProfile(props) {
  // jwt authentication
  const { token } = useContext(UserContext);

  // define initial state of form
  const initialState = {
    title: "",
    startDate: "",
    endDate: "",
    newbieRecruitmentDate: "",
  };

  const savedState = props.opt !== "add" ? props.term : null;

  // define form validation schema
  const validationSchema = useMemo(ValidationSchema, []);

  const [snackbarState, setSnackbarState] = useState({
    open: false,
    severity: "info",
    message: "",
  });

  const handleSubmit = async (formData, { setSubmitting, resetForm }) => {
    // disable for while submitting
    setSubmitting(true);

    try {
      if (props.opt === "add") {
        // const response = await axios.post(TERM_URL, formData, {
        //   headers: {
        //     "Content-Type": "application/json",
        //     Authorization: "Bearer " + token,
        //   },
        // });

        setSnackbarState(() => ({
          open: true,
          severity: "success",
          message: "Added Successfully",
        }));

        resetForm(true);
      }

      if (props.opt === "edit") {
        // const response = await axios.put(TERM_URL, formData, {
        //   headers: {
        //     "Content-Type": "application/json",
        //     Authorization: "Bearer " + token,
        //   },
        // });

        setSnackbarState(() => ({
          open: true,
          severity: "success",
          message: "Edited Successfully",
        }));
      }
    } catch (err) {
      if (!err?.response) {
        setSnackbarState(() => ({
          open: true,
          severity: "error",
          message: "No Server Response",
        }));
      } else if (err.response?.status === 400) {
        setSnackbarState(() => ({
          open: true,
          severity: "error",
          message: "Invalid Submission",
        }));
      } else if (err.response?.status === 409) {
        setSnackbarState(() => ({
          open: true,
          severity: "error",
          message: "Term Already Exists",
        }));
      } else {
        setSnackbarState(() => ({
          open: true,
          severity: "error",
          message: "Submission Failed",
        }));
      }
    }

    // enable for while submitting
    setSubmitting(false);
  };

  return (
    <>
      <Formik
        initialValues={savedState || initialState}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        validateOnChange={false}
        validateOnMount
      >
        <Form mode={props.opt} />
      </Formik>
    </>
  );
}
