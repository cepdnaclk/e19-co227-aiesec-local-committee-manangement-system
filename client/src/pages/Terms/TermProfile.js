import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import axios from "../../api/axios";
import { Formik, Form as FormikForm } from "formik";
import * as yup from "yup";
import { Snackbar, Alert } from "@mui/material";
import SubmitButton from "../../components/SubmitButton";

// ---------- COMPONENTS IMPORTS ---------- //
import Form from "./Form";

const TERM_URL = "/term";
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
  const formSchema = yup.object().shape({
    title: yup
      .string()
      .required("Required")
      .matches(/^[0-9]{2}-(Summer|Winter)$/, "Enter a valid id"),
    startDate: yup.date().required("Required"),
    endDate: yup
      .date()
      .required("Required")
      .min(yup.ref("startDate"), "End date cannot predate the start date"),
    newbieRecruitmentDate: yup
      .date()
      .required("Required")
      .min(
        yup.ref("startDate"),
        "Recruitment date cannot predate the start date"
      )
      .max(yup.ref("endDate"), "Recruitment date cannot postdate the end date"),
  });

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
        const response = await axios.post(TERM_URL, formData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });

        setSnackbarState(() => ({
          open: true,
          severity: "success",
          message: "Added Successfully",
        }));

        resetForm(true);
      }

      if (props.opt === "edit") {
        const response = await axios.put(TERM_URL, formData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });

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
        validationSchema={formSchema}
        validateOnChange={false}
        validateOnMount
      >
        {({ values, errors, touched, isSubmitting, resetForm }) => {
          return (
            <FormikForm>
              <pre>{JSON.stringify(values, null, 2)}</pre>
              <pre>{JSON.stringify(touched, null, 2)}</pre>
              <pre>{JSON.stringify(errors, null, 2)}</pre>
              <Form values={values} />
              <SubmitButton />
            </FormikForm>
          );
        }}
      </Formik>
      <Snackbar
        open={snackbarState.open}
        autoHideDuration={3000}
        onClose={() =>
          setSnackbarState({ open: false, severity: "info", message: "" })
        }
      >
        <Alert severity={snackbarState.severity} sx={{ width: "100%" }}>
          {snackbarState.message}
        </Alert>
      </Snackbar>
    </>
  );
}
