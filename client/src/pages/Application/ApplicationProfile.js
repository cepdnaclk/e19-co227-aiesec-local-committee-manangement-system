import React, { useState, useEffect, useContext } from "react";
import axios from "../../api/axios";
import { UserContext } from "../../context/UserContext";
import { Formik, Form } from "formik";
import * as yup from "yup";
import ValidatedTextField from "../../components/ValidatedTextField";
import ValidatedPasswordField from "../../components/ValidatedPasswordField";
import ValidatedSelectField from "../../components/ValidatedSelectField";
import ValidatedDateField from "../../components/ValidatedDateField";
import {
  Grid,
  Button,
  Divider,
  Chip,
  InputAdornment,
  Skeleton,
} from "@mui/material";

const APPLICATION_URL = "/application/";
const RESOURCES_URL = "/application/resources/";
const MEMBERS_URL = "/application/members/";

const ApplicationProfile = (props) => {
  const {
    setSnackbarState,
    formState,
    setFormState,
    formIdleState,
    refreshParent,
    focusItem,
  } = props;
  const test = true;

  // TODO: Handle adding token to request globally
  const { token } = useContext(UserContext);

  const [isLoading, setLoading] = useState(false);

  const [areFieldsDisabled, disableFields] = useState(false);

  useEffect(() => {
    if (formState.mode === "view") disableFields(true);
    else disableFields(false);
  }, [formState.mode]);

  // Define initial formState of form
  const [initialState, setInitialState] = useState({
    epId: "",
    // appId: "",
    appStatus: "OPEN",
    epName: "",
    inchargeMemberId: "",
    team: "",
    appliedDate: "",
    contactedDate: "",
    slotId: "",
    projectExpaId: "",
    gender: "",
    homeMc: "",
    homeLc: "",
    contactNumber: "",
    email: "",
    notes: "",
    interviewDate: "",
    interviewTime: "",
    epMngName: "",
    epMngContact: "",
    epMngEmail: "",
    abhDate: "",
    acceptedDate: "",
    approvedDate: "",
  });

  // TODO: Validate dates
  const formSchema = yup.object().shape({
    epId: yup.string().required("Required"),
    // appId: "",
    appStatus: yup.string().required("Required"),
    epName: yup.string().required("Required"),
    inchargeMemberId: yup.string().required("Required"),
    team: yup.string(),
    appliedDate: yup.string().required("Required"),
    contactedDate: yup.string().required("Required"),
    slotId: yup.string().required("Required"),
    projectExpaId: yup.string().required("Required"),
    gender: yup.string().required("Required"),
    homeMc: yup.string().required("Required"),
    homeLc: yup.string().required("Required"),
    contactNumber: yup.string(),
    email: yup.string(),
    notes: yup.string(),
    interviewDate: yup.string(),
    interviewTime: yup.string(),
    epMngName: yup.string(),
    epMngContact: yup.string(),
    epMngEmail: yup.string(),
    abhDate: yup.string(),
    acceptedDate: yup.string(),
    approvedDate: yup.string(),
  });

  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [slots, setSlots] = useState([]);

  const applicationStatus = {
    OPEN: [
      { key: "OPEN", value: "OPEN" },
      { key: "WITHDRAWN", value: "WITHDRAWN" },
      { key: "ABH", value: "ABH" },
      { key: "REJECTED", value: "REJECTED" },
    ],
    WITHDRAWN: [{ key: "WITHDRAWN", value: "WITHDRAWN" }],
    REJECTED: [{ key: "REJECTED", value: "REJECTED" }],
    ABH: [
      { key: "ABH", value: "ABH" },
      { key: "REJECTED", value: "REJECTED" },
      { key: "ACCEPTED", value: "ACCEPTED" },
    ],

    ACCEPTED: [
      { key: "ACCEPTED", value: "ACCEPTED" },
      { key: "REJECTED", value: "REJECTED" },
      { key: "APPROVED", value: "APPROVED" },
    ],
  };

  // TODO: create a global store for storing global data
  const genders = [
    { key: "M", value: "Male" },
    { key: "F", value: "Female" },
  ];

  useEffect(() => {
    loadData();

    if (test && formState.mode === "add") {
      setInitialState({
        epId: "123",
        // appId: "",
        appStatus: "OPEN",
        epName: "Name",
        inchargeMemberId: "1",
        team: "Team 1",
        appliedDate: "2020-01-01",
        contactedDate: "2020-01-01",
        slotId: "1",
        projectExpaId: "1234567",
        gender: "M",
        homeMc: "test",
        homeLc: "test",
        contactNumber: "1234567890",
        email: "email@example.com",
        notes: "Notes",
        interviewDate: "2020-01-01",
        interviewTime: "2:00",
        epMngName: "Name",
        epMngContact: "1234567890",
        epMngEmail: "email@example.com",
        abhDate: "2020-01-01",
        acceptedDate: "2020-01-01",
        approvedDate: "2020-01-01",
      });
    }
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const projectsResponse = await axios.get(RESOURCES_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      console.log("Payload received: ", projectsResponse.data);
      setProjects(projectsResponse.data);

      const memberResponse = await axios.get(MEMBERS_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      console.log("Payload received: ", memberResponse.data);
      setMembers(memberResponse.data);
      console.log("Payload set: ", members);

      if (formState.mode === "view") {
        const response = await axios.get(APPLICATION_URL, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          params: {
            appId: focusItem.appId,
          },
        });
        console.log(response.data);
        const currProject = projects.find(
          (element) => element.key === response.data.projectExpaId
        );
        console.log(currProject);
        if (currProject) {
          setSlots(JSON.parse(currProject.slots));
        }
        // remove app id before setting form state
        delete response.data.appId;
        setInitialState(response.data);
      }
    } catch (err) {
      // TODO: Better error handling
      console.log(err);
    }
    setLoading(false);
  };

  const handleAdd = async (formData) => {
    try {
      const response = await axios.post(APPLICATION_URL, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      setSnackbarState({
        open: true,
        message: "Application Saved Successfully!",
        severity: "success",
      });
      refreshParent();
      setFormState(formIdleState);
    } catch (err) {
      // TODO: Create seperate error message for "Application already exists"
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
      const response = await axios.put(APPLICATION_URL, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        params: {
          appId: focusItem.appId,
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
        mode: formState.mode.replace("edit", "view"),
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
  const handleDelete = async () => {
    try {
      const response = await axios.delete(APPLICATION_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        params: {
          appId: focusItem.appId,
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

  // TODO: skeleton is not rendered during load
  return isLoading ? (
    <>
      <Skeleton variant="text" animation="wave" />
      <Skeleton variant="text" animation="wave" />
      <Skeleton variant="text" animation="wave" />
    </>
  ) : (
    <Formik
      initialValues={initialState}
      onSubmit={(formData, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        if (formState.mode.includes("add")) handleAdd(formData);
        else if (formState.mode.includes("edit")) handleEdit(formData);
        else handleDelete(formData);
        setSubmitting(false);
      }}
      validationSchema={formSchema}
      enableReinitialize
    >
      {({ values, errors, touched, isSubmitting, resetForm, handleChange }) => (
        <Form>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <pre>{JSON.stringify(values, null, 2)}</pre>
            </Grid>
            <Grid item xs={6}>
              <ValidatedTextField
                name="epId"
                label="EP ID"
                disabled={areFieldsDisabled}
              />
            </Grid>
            <Grid item xs={6}>
              <ValidatedSelectField
                name="appStatus"
                label="Status"
                options={applicationStatus[values["appStatus"]]}
                disabled={
                  areFieldsDisabled ||
                  values.appStatus === "REJECTED" ||
                  values.appStatus === "WITHDRAWN" ||
                  values.appStatus === "APPROVED"
                }
              />
            </Grid>
            <Grid item xs={6}>
              <ValidatedTextField
                name="epName"
                label="EP Name"
                disabled={areFieldsDisabled}
              />
            </Grid>
            <Grid item xs={6}>
              <ValidatedSelectField
                name="inchargeMemberId"
                label="In Charge Member"
                options={members}
                disabled={areFieldsDisabled}
              />
            </Grid>
            <Grid item xs={4}>
              <ValidatedTextField
                // TODO: Load Teams from DB
                name="team"
                label="Team"
                disabled={areFieldsDisabled}
              />
            </Grid>
            <Grid item xs={4}>
              <ValidatedDateField
                name="appliedDate"
                label="Applied Date"
                disabled={areFieldsDisabled}
              />
            </Grid>
            <Grid item xs={4}>
              <ValidatedDateField
                name="contactedDate"
                label="Contacted Date"
                disabled={areFieldsDisabled}
              />
            </Grid>
            <Grid item xs={6}>
              <ValidatedSelectField
                name="projectExpaId"
                label="Project"
                options={projects}
                disabled={areFieldsDisabled}
                onChange={(e) => {
                  // Call default Formik handleChange()
                  handleChange(e);
                  // Additionally load the related slots
                  const currProject = projects.find((obj) => {
                    return obj.key === e.target.value;
                  });
                  console.log(currProject);
                  setSlots(JSON.parse(currProject.slots));
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <ValidatedSelectField
                name="slotId"
                label="Slot"
                options={slots || []}
                disabled={areFieldsDisabled}
              />
            </Grid>
            <Grid item xs={4}>
              <ValidatedSelectField
                name="gender"
                label="Gender"
                options={genders}
                disabled={areFieldsDisabled}
              />
            </Grid>
            <Grid item xs={4}>
              <ValidatedTextField
                name="homeMc"
                label="Home MC"
                disabled={areFieldsDisabled}
              />
            </Grid>
            <Grid item xs={4}>
              <ValidatedTextField
                name="homeLc"
                label="Home LC"
                disabled={areFieldsDisabled}
              />
            </Grid>
            <Grid item xs={6}>
              <ValidatedTextField
                name="contactNumber"
                label="Contact Number"
                disabled={areFieldsDisabled}
              />
            </Grid>
            <Grid item xs={6}>
              <ValidatedTextField
                name="email"
                label="Email"
                disabled={areFieldsDisabled}
              />
            </Grid>
            <Grid item xs={12}>
              <ValidatedTextField
                name="notes"
                label="Notes"
                disabled={areFieldsDisabled}
              />
            </Grid>
            <Grid item xs={6}>
              <ValidatedDateField
                name="interviewDate"
                label="Interview Date"
                disabled={areFieldsDisabled}
              />
            </Grid>
            <Grid item xs={6}>
              <ValidatedTextField
                name="interviewTime"
                label="Interview Time"
                disabled={areFieldsDisabled}
              />
            </Grid>
            <Grid item xs={4}>
              <ValidatedTextField
                name="epMngName"
                label="EP Manager Name"
                disabled={areFieldsDisabled}
              />
            </Grid>
            <Grid item xs={4}>
              <ValidatedTextField
                name="epMngContact"
                label="EP Manager Contact"
                disabled={areFieldsDisabled}
              />
            </Grid>
            <Grid item xs={4}>
              <ValidatedTextField
                name="epMngEmail"
                label="EP Manager Email"
                disabled={areFieldsDisabled}
              />
            </Grid>
            <Grid item xs={4}>
              <ValidatedDateField
                name="abhDate"
                label="ABH Date"
                disabled={areFieldsDisabled}
              />
            </Grid>
            <Grid item xs={4}>
              <ValidatedDateField
                name="acceptedDate"
                label="Accepted Date"
                disabled={areFieldsDisabled}
              />
            </Grid>
            <Grid item xs={4}>
              <ValidatedDateField
                name="approvedDate"
                label="approved Date"
                disabled={areFieldsDisabled}
              />
            </Grid>
            <Grid item xs={12} textAlign="right">
              <Button
                type="submit"
                disabled={isSubmitting}
                variant="contained"
                color={formState.mode.includes("view") ? "error" : "primary"}
              >
                {formState.mode.includes("view") ? "Delete" : "Submit"}
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default ApplicationProfile;
