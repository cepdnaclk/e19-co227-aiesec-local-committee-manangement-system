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

const SLOTS_URL = "/slot/";

export default function SlotProfile(props) {
  const { token } = useContext(UserContext);

  const test = false;

  const [isLoading, setLoading] = useState(false);

  const {
    formState,
    setFormState,
    formIdleState,
    setSnackbarState,
    refreshParent,
    focusItem,
    focusParent,
  } = props;

  const [areFieldsDisabled, disableFields] = useState(false);

  useEffect(() => {
    if (formState.mode === "view") disableFields(true);
    else disableFields(false);
  }, [formState.mode]);

  // Define initial formState of form
  const [initialState, setInitialState] = useState({
    title: "",
    startDate: "",
    endDate: "",
    numOpenings: "",
  });

  useEffect(() => {
    if (test && formState.mode === "add") {
      setInitialState({
        title: "Dummy Slot",
        startDate: "2019-01-01",
        endDate: "2019-06-01",
        numOpenings: "3",
      });
    }

    if (formState.mode === "view") {
      loadSlot();
    }
  }, [formState.mode]);

  const loadSlot = async () => {
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

      // console.log(focusItem);
      setInitialState(focusItem);
      // console.log(initialState);
    } catch (err) {
      // TODO: Better error handling
      console.log(err);
    }
    setLoading(false);
  };

  const formSchema = yup.object().shape({
    title: yup.string().required("Required"),
    startDate: yup.string().required("Required"),
    endDate: yup.string().required("Required"),
    numOpenings: yup.string().required("Required"),
  });

  const handleAdd = async (formData) => {
    try {
      const submitData = { expaId: focusParent.expaId, ...formData };
      const response = await axios.post(SLOTS_URL, submitData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      setSnackbarState({
        open: true,
        message: "Slot Saved Successfully!",
        severity: "success",
      });
      refreshParent();
      // FIXME: Form doesn't load on view properly
      // setFormState({ open: true, mode: "view" });
      // console.log(formData);
      // setInitialState(formData);
      setFormState(formIdleState);
    } catch (err) {
      // TODO: Create seperate error message for "Slot already exists"
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
      const submitData = {
        expaId: focusParent.expaId,
        slotId: focusItem.slotId,
        ...formData,
      };
      const response = await axios.put(SLOTS_URL, submitData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      setSnackbarState({
        open: true,
        message: "Slot Updated Successfully!",
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
      console.log();
      const response = await axios.delete(SLOTS_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        params: {
          expaId: focusParent.expaId,
          slotId: focusItem.slotId,
        },
      });
      setSnackbarState({
        open: true,
        message: "Slot Deleted Successfully!",
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
          setFieldValue,
        }) => (
          <Form>
            <Grid container spacing={2}>
              {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
              <Grid item xs={12}>
                <ValidatedTextField
                  name="title"
                  label="Title"
                  disabled={areFieldsDisabled}
                />
              </Grid>
              <Grid item xs={4}>
                <ValidatedDateField
                  name="startDate"
                  label="Start Date"
                  disabled={areFieldsDisabled}
                  onChange={(e) => {
                    // default behaviour
                    handleChange(e);

                    try {
                      // calculate end date 6 weeks from now
                      const startDateString = values.startDate; // input date string
                      const startDate = new Date(startDateString);
                      const endDate = new Date(startDate);
                      endDate.setDate(endDate.getDate() + 6 * 7); // adding 6 weeks in days
                      // Convert the new date object to a string in 'YYYY-MM-DD' format
                      const endDateString = endDate.toISOString().split("T")[0];
                      setFieldValue("endDate", endDateString);
                    } catch (err) {
                      console.log(
                        "Error: ",
                        err,
                        "Tried Start Date: ",
                        values.startDate
                      );
                    }
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <ValidatedDateField
                  name="endDate"
                  label="End Date"
                  disabled={true}
                />
              </Grid>
              <Grid item xs={4}>
                <ValidatedTextField
                  name="numOpenings"
                  label="# Openings"
                  disabled={areFieldsDisabled}
                />
              </Grid>
              <Grid item xs={12} textAlign="right">
                <Button
                  type="submit"
                  disabled={isSubmitting}
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
    </>
  );
}
