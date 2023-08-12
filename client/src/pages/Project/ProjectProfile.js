import React, { useState, useEffect, useContext } from "react";
import axios from "../../api/axios";
import { UserContext } from "../../context/UserContext";
import { Formik, Form } from "formik";
import * as yup from "yup";
import ValidatedTextField from "../../components/ValidatedTextField";
import ValidatedPasswordField from "../../components/ValidatedPasswordField";
import ValidatedSelectField from "../../components/ValidatedSelectField";
import ValidatedDateField from "../../components/ValidatedDateField";
import { Grid, Button, Divider, Chip, InputAdornment } from "@mui/material";

import SlotView from "../Slot/SlotView";

const PROJECT_URL = "/project";

/* TODO: Implement modes
   [ ] - add
   [ ] - view
   [ ] - edit (delete)
*/

export default function ProjectProfile(props) {
  // TODO: Handle adding token to request globally
  const { token } = useContext(UserContext);

  const test = true;

  const [isLoading, setLoading] = useState(false);

  const {
    formState,
    setFormState,
    formIdleState,
    setSnackbarState,
    refreshParent,
    focusItem,
  } = props;

  const [areFieldsDisabled, disableFields] = useState(false);

  useEffect(() => {
    if (formState.mode === "view") disableFields(true);
    else disableFields(false);
  }, [formState.mode]);

  // Define initial formState of form
  const [initialState, setInitialState] = useState({
    expaId: "",
    projectName: "",
    sdg: "",
    jd: "",
    oppProvider: "",
    food: "",
    transportation: "",
    accommodation: "",
    notes: "",
  });

  const options = [
    { key: "Provided", value: "Provided" },
    { key: "Covered", value: "Covered" },
    { key: "Provided and Covered", value: "Provided and Covered" },
  ];

  useEffect(() => {
    if (test && formState.mode === "add") {
      setInitialState({
        expaId: "1234",
        projectName: "Test Project",
        sdg: "1",
        jd: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        oppProvider: "Test Provider",
        food: "Provided",
        transportation: "Covered",
        accommodation: "Provided and Covered",
        notes: "Test Notes",
      });
    }

    if (formState.mode === "view") {
      loadProject();
    }
  }, [formState.mode]);

  const loadProject = async () => {
    // TODO: Render error message if load fails on view mode
    try {
      setLoading(true);
      // //   console.log("From inside profile: ", focusItemId);
      // const response = await axios.get(PROJECT_URL, {
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: "Bearer " + token,
      //   },
      //   params: { expaId: focusItem.expaId },
      // });
      // console.log("Payload received: ", response);
      console.log(focusItem);
      setInitialState(focusItem);
      console.log(initialState);
    } catch (err) {
      // TODO: Better error handling
      console.log(err);
    }
    setLoading(false);
  };

  const formSchema = yup.object().shape({
    expaId: yup.number("Expa ID should be a number").required("Required"),
    projectName: yup.string().required("Required"),
    sdg: yup.number("SDG should be a number").required("Required"),
    jd: yup.string().required("Required"),
    oppProvider: yup.string().required("Required"),
    food: yup.string().required("Required"),
    transportation: yup.string().required("Required"),
    accommodation: yup.string().required("Required"),
    notes: yup.string(),
  });

  const handleAdd = async (formData) => {
    try {
      const response = await axios.post(PROJECT_URL, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      setSnackbarState({
        open: true,
        message: "Project Saved Successfully!",
        severity: "success",
      });
      refreshParent();
      setFormState({ open: true, mode: "view" });
    } catch (err) {
      // TODO: Create seperate error message for "Project already exists"
      console.log("Error: ", err);
      setSnackbarState({
        open: true,
        message: "Something Went Wrong",
        severity: "error",
      });
    }
  };

  const handleEdit = async (formData) => {
    try {
      const response = await axios.put(PROJECT_URL, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      setSnackbarState({
        open: true,
        message: "Project Updated Successfully!",
        severity: "success",
      });
      refreshParent();
      setFormState({
        open: true,
        mode: "view",
      });
    } catch (err) {
      console.log("Error: ", err);
      setSnackbarState({
        open: true,
        message: "Something Went Wrong",
        severity: "error",
      });
    }
  };

  const handleDelete = async (formData) => {
    try {
      const response = await axios.delete(PROJECT_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        params: {
          expaId: formData.expaId,
        },
      });
      setSnackbarState({
        open: true,
        message: "Project Deleted Successfully!",
        severity: "success",
      });
      refreshParent();
      setFormState(formIdleState);
    } catch (err) {
      console.log("Error: ", err);
      setSnackbarState({
        open: true,
        message: "Something Went Wrong",
        severity: "error",
      });
    }
  };

  return (
    <>
      <Formik
        initialValues={initialState}
        onSubmit={(formData, { setSubmitting }) => {
          setSubmitting(true);
          if (formState.mode.includes("add")) handleAdd(formData);
          else if (formState.mode.includes("edit")) handleEdit(formData);
          else handleDelete(formData);
          setSubmitting(false);
        }}
        validationSchema={formSchema}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          isSubmitting,
          resetForm,
          handleChange,
        }) => (
          <Form>
            <Grid container spacing={2}>
              {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
              <Grid item xs={5}>
                <ValidatedTextField
                  name="expaId"
                  label="Expa ID"
                  disabled={areFieldsDisabled}
                />
              </Grid>
              <Grid item xs={5}>
                <ValidatedTextField
                  name="projectName"
                  label="Project Name"
                  disabled={areFieldsDisabled}
                />
              </Grid>
              <Grid item xs={2}>
                <ValidatedTextField
                  name="sdg"
                  label="SDG"
                  disabled={areFieldsDisabled}
                />
              </Grid>
              <Grid item xs={12}>
                <ValidatedTextField
                  name="jd"
                  label="JD"
                  disabled={areFieldsDisabled}
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid item xs={12}>
                <ValidatedTextField
                  name="oppProvider"
                  label="Opp Provider"
                  disabled={areFieldsDisabled}
                />
              </Grid>
              <Grid item xs={4}>
                <ValidatedSelectField
                  name="food"
                  label="Food"
                  options={options}
                  disabled={areFieldsDisabled}
                />
              </Grid>
              <Grid item xs={4}>
                <ValidatedSelectField
                  name="transportation"
                  label="Transportation"
                  options={options}
                  disabled={areFieldsDisabled}
                />
              </Grid>
              <Grid item xs={4}>
                <ValidatedSelectField
                  name="accommodation"
                  label="Accommodation"
                  options={options}
                  disabled={areFieldsDisabled}
                />
              </Grid>
              <Grid item xs={12}>
                <ValidatedTextField
                  name="notes"
                  label="Notes"
                  disabled={areFieldsDisabled}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} textAlign="right">
                <Button
                  type="submit"
                  disabled={isSubmitting || formState.mode === "view"}
                  variant="contained"
                  color={formState.mode === "view" ? "error" : "primary"}
                >
                  {formState.mode === "view" ? "Delete" : "Submit"}
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
      {formState.mode === "view" || formState.mode === "edit" ? (
        <>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Divider textAlign="center">
                <Chip label="Slots"></Chip>
              </Divider>
            </Grid>
            <Grid item xs={12}>
              <SlotView project={focusItem} />
            </Grid>
          </Grid>
        </>
      ) : null}
    </>
  );
}
