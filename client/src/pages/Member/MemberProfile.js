import React, { useState, useEffect, useContext, useRef } from "react";
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
  Box,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";

import InputField from "../../components/InputField";

import { useNotify } from "../../context/NotificationContext";

const MEMBERS_URL = "/member/";
const RESOURCES_URL = "/member/resources/";

/* TODO: Implement modes
   [x] admin-add
   [x] admin-view (admin-delete)
   [x] admin-edit
   [ ] user-view
   [ ] user-edit
*/

export default function MemberProfile(props) {
  // TODO: Handle adding token to request globally
  // const { token } = useContext(UserContext);

  const { notifySuccess, notifyError } = useNotify();

  const test = false;

  const [isLoading, setLoading] = useState(false);

  const {
    formState,
    setFormState,
    formIdleState,
    setSnackbarState,
    refreshParent,
    focusItemId,
  } = props;

  const [areFieldsDisabled, disableFields] = useState(false);

  useEffect(() => {
    if (formState.mode === "admin-view" || formState.mode === "user-view")
      disableFields(true);
    else disableFields(false);
  }, [formState.mode]);

  // Define initial formState of form
  const [initialState, setInitialState] = useState({
    email: "",
    passphrase: "",
    fullName: "",
    preferredName: "",
    frontOfficeId: "",
    departmentId: "",
    backOfficeId: "",
    joinedDate: "",
    roleId: "",
    contactNo: "",
    aiesecEmail: "",
    gender: "",
    nic: "",
    birthDate: "",
    facebookLink: "",
    linkedinLink: "",
    instagramLink: "",
    registerNo: "",
    schoolName: "",
    homeAddress: "",
    homeContact: "",
    districtId: "",
    photoLink: "",
    boardingAddress: "",
  });

  // TODO: create a global store for storing global data
  const genders = [
    { key: "M", value: "Male" },
    { key: "F", value: "Female" },
  ];

  // const [departments, setDepartments] = useState([]);
  const departments = useRef([]);

  // const [resources, setResources] = useState({
  //   districts: [],
  //   frontOffices: [],
  //   backOffices: [],
  //   roles: [],
  // });
  const resources = useRef({
    districts: [{ "": "" }],
    frontOffices: [{ "": "" }],
    backOffices: [{ "": "" }],
    roles: [{ "": "" }],
  });

  useEffect(() => {
    loadResources();

    // if (test && formState.mode === "admin-add") {
    //   setInitialState({
    //     email: "jane@example.com",
    //     passphrase: "456",
    //     fullName: "Jane Doe",
    //     preferredName: "Jane",
    //     frontOfficeId: "0",
    //     departmentId: "0",
    //     backOfficeId: "1",
    //     joinedDate: "2020-01-01",
    //     roleId: "1",
    //     contactNo: "1234567890",
    //     aiesecEmail: "jane@example.com",
    //     gender: "F",
    //     nic: "1234567890",
    //     birthDate: "2000-01-01",
    //     facebookLink: "jane@facebook.com",
    //     linkedinLink: "jane@linkedin.com",
    //     instagramLink: "jane@instagram.com",
    //     registerNo: "E/01/001",
    //     schoolName: "School",
    //     homeAddress: "No.1 Kings Street, Kandy",
    //     homeContact: "1234567890",
    //     districtId: "1",
    //     photoLink: "jane.photo.com",
    //     boardingAddress: "No.2 Kings Street, Kandy",
    //   });
    // }
  }, []);

  const loadResources = async (e) => {
    console.log("Member id: ", focusItemId);
    setLoading(true);
    try {
      const response = await axios.get(RESOURCES_URL, {
        headers: {
          "Content-Type": "application/json",
          // Authorization: "Bearer " + token,
        },
      });
      console.log("Payload received: ", response.data);
      resources.current = response.data;

      if (formState.mode === "admin-view" || formState.mode === "user-view") {
        const response = await axios.get(MEMBERS_URL, {
          headers: {
            "Content-Type": "application/json",
            // Authorization: "Bearer " + token,
          },
          params: {
            id: focusItemId,
          },
        });

        console.log(response.data);
        let currFrontOffice = resources.current.frontOffices.find(
          (element) => element.key == response.data.frontOfficeId
        );
        // console.log(currFrontOffice.departments);
        if (currFrontOffice) {
          departments.current = JSON.parse(currFrontOffice.departments);
        }
        setInitialState(response.data);
      }
    } catch (err) {
      // TODO: Better error handling
      console.log(err);
    }
    setLoading(false);
  };

  // TODO: Validate dates
  const formSchema = yup.object().shape({
    email: yup.string().required("Email required").email("Invalid email"),
    passphrase: yup.string().required("Password required"),
    fullName: yup.string(),
    preferredName: yup.string(),
    frontOfficeId: yup.string().required("Front office required"),
    departmentId: yup.string().required("Department required"),
    backOfficeId: yup.string().notRequired(),
    joinedDate: yup.date().required("Joined Date"),
    roleId: yup.string().required("Role required"),
    contactNo: yup.string(),
    aiesecEmail: yup.string(),
    gender: yup.string(),
    nic: yup.string().max(12, "NIC too long"),
    birthDate: yup.string(),
    facebookLink: yup.string(),
    linkedinLink: yup.string(),
    instagramLink: yup.string(),
    registerNo: yup.string(),
    schoolName: yup.string(),
    homeAddress: yup.string(),
    homeContact: yup.string(),
    districtId: yup.string().required("Required"),
    photoLink: yup.string(),
    boardingAddress: yup.string(),
  });

  const handleAdd = async (formData) => {
    try {
      const response = await axios.post(MEMBERS_URL, formData, {
        headers: {
          "Content-Type": "application/json",
          // Authorization: "Bearer " + token,
        },
      });
      setSnackbarState({
        open: true,
        message: "Member Saved Successfully!",
        severity: "success",
      });
      refreshParent();
      setFormState(formIdleState);
    } catch (err) {
      // TODO: Create seperate error message for "User already exists"
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
      const response = await axios.put(MEMBERS_URL, formData, {
        headers: {
          "Content-Type": "application/json",
          // Authorization: "Bearer " + token,
        },
      });
      setSnackbarState({
        open: true,
        message: "Member Updated Successfully!",
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

  const handleDelete = async (formData) => {
    try {
      const response = await axios.delete(MEMBERS_URL, {
        headers: {
          "Content-Type": "application/json",
          // Authorization: "Bearer " + token,
        },
        params: {
          id: focusItemId,
        },
      });
      setSnackbarState({
        open: true,
        message: "Member Deleted Successfully!",
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
    <>
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
                <Divider textAlign="center">
                  <Chip label="Credentials"></Chip>
                </Divider>
              </Grid>
              <Grid item xs={6}>
                <ValidatedTextField
                  name="email"
                  label="Email"
                  disabled={
                    areFieldsDisabled || formState.mode === "admin-edit"
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <ValidatedPasswordField
                  name="passphrase"
                  label="Password"
                  disabled={
                    areFieldsDisabled || formState.mode === "admin-edit"
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Divider textAlign="center">
                  <Chip label="Personal Information"></Chip>
                </Divider>
              </Grid>
              <Grid item xs={6}>
                <ValidatedTextField
                  name="fullName"
                  label="Full Name"
                  disabled={areFieldsDisabled}
                />
              </Grid>
              <Grid item xs={6}>
                <ValidatedTextField
                  name="preferredName"
                  label="Preferred Name"
                  disabled={areFieldsDisabled}
                />
              </Grid>
              <Grid item xs={4}>
                {/* <ValidatedSelectField
                name="gender"
                label="Gender"
                options={genders}
                disabled={areFieldsDisabled}
              /> */}
                <InputField
                  type="select"
                  name="gender"
                  options={genders}
                  disabled={areFieldsDisabled}
                />
              </Grid>
              <Grid item xs={4}>
                <ValidatedDateField
                  name="birthDate"
                  label="Birth Date"
                  disabled={areFieldsDisabled}
                />
              </Grid>
              <Grid item xs={4}>
                <ValidatedTextField
                  name="nic"
                  label="NIC"
                  disabled={areFieldsDisabled}
                />
              </Grid>
              <Grid item xs={4}>
                <ValidatedTextField
                  name="contactNo"
                  label="Contact No"
                  disabled={areFieldsDisabled}
                />
              </Grid>
              <Grid item xs={4}>
                <ValidatedTextField
                  name="homeContact"
                  label="Home Contact"
                  disabled={areFieldsDisabled}
                />
              </Grid>
              <Grid item xs={4}>
                <ValidatedSelectField
                  name="districtId"
                  label="District"
                  options={resources.current.districts}
                  disabled={areFieldsDisabled}
                />
              </Grid>
              <Grid item xs={6}>
                <ValidatedTextField
                  name="homeAddress"
                  label="Home Address"
                  disabled={areFieldsDisabled}
                />
              </Grid>
              <Grid item xs={6}>
                <ValidatedTextField
                  name="boardingAddress"
                  label="Boarding Address"
                  disabled={areFieldsDisabled}
                />
              </Grid>
              <Grid item xs={12}>
                <ValidatedTextField
                  name="facebookLink"
                  label="Facebook Link"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FacebookIcon />
                      </InputAdornment>
                    ),
                  }}
                  disabled={areFieldsDisabled}
                />
              </Grid>
              <Grid item xs={12}>
                <ValidatedTextField
                  name="linkedinLink"
                  label="Linkedin Link"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LinkedInIcon />
                      </InputAdornment>
                    ),
                  }}
                  disabled={areFieldsDisabled}
                />
              </Grid>
              <Grid item xs={12}>
                <ValidatedTextField
                  name="instagramLink"
                  label="Instagram Link"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <InstagramIcon />
                      </InputAdornment>
                    ),
                  }}
                  disabled={areFieldsDisabled}
                />
              </Grid>
              <Grid item xs={12}>
                <ValidatedTextField
                  name="photoLink"
                  label="Photo Link"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <InsertPhotoIcon />
                      </InputAdornment>
                    ),
                  }}
                  disabled={areFieldsDisabled}
                />
              </Grid>
              <Grid item xs={12}>
                <Divider textAlign="center">
                  <Chip label="Academic Details"></Chip>
                </Divider>
              </Grid>
              <Grid item xs={6}>
                <ValidatedTextField
                  name="registerNo"
                  label="Register No"
                  disabled={areFieldsDisabled}
                />
              </Grid>
              <Grid item xs={6}>
                <ValidatedTextField
                  name="schoolName"
                  label="School Name"
                  disabled={areFieldsDisabled}
                />
              </Grid>
              <Grid item xs={12}>
                <Divider textAlign="center">
                  <Chip label="AIESEC Details"></Chip>
                </Divider>
              </Grid>
              <Grid item xs={3}>
                <ValidatedSelectField
                  name="frontOfficeId"
                  label="Front Office"
                  options={resources.current.frontOffices}
                  onChange={(e) => {
                    // Call default Formik handleChange()
                    handleChange(e);
                    // Additionally load the related departments
                    const currFrontOffice = resources.current.frontOffices.find(
                      (element) => element.key === e.target.value
                    );
                    // setDepartments(JSON.parse(currFrontOffice.departments));
                    departments.current = JSON.parse(
                      currFrontOffice.departments
                    );
                  }}
                  disabled={areFieldsDisabled || formState.mode === "user-edit"}
                />
              </Grid>
              <Grid item xs={3}>
                {/* TODO: Department doesn't load on view */}
                <ValidatedSelectField
                  name="departmentId"
                  label="Department"
                  options={departments.current}
                  disabled={areFieldsDisabled || formState.mode === "user-edit"}
                />
              </Grid>
              <Grid item xs={3}>
                <ValidatedSelectField
                  name="backOfficeId"
                  label="Back Office"
                  options={resources.current.backOffices}
                  disabled={areFieldsDisabled || formState.mode === "user-edit"}
                />
              </Grid>
              <Grid item xs={3}>
                <ValidatedSelectField
                  name="roleId"
                  label="Role"
                  options={resources.current.roles}
                  disabled={areFieldsDisabled || formState.mode === "user-edit"}
                />
              </Grid>
              <Grid item xs={6}>
                <ValidatedDateField
                  name="joinedDate"
                  label="Joined Date"
                  disabled={areFieldsDisabled || formState.mode === "user-edit"}
                />
              </Grid>
              <Grid item xs={6}>
                <ValidatedTextField
                  name="aiesecEmail"
                  label="AISEC Email"
                  disabled={areFieldsDisabled}
                />
              </Grid>
              <Grid item xs={12} textAlign="right">
                <Button
                  type="submit"
                  disabled={isSubmitting || formState.mode === "user-view"}
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
      {formState.mode === "user-view" ? (
        <Box>
          <Button
            color="success"
            onClick={() => {
              axios
                .get("email/auth")
                .then((response) => {
                  // console.log(response);
                  window.open(response.data.url);
                })
                .catch((err) => {
                  console.log(err);
                  notifyError("Error: ", err.message);
                });
            }}
          >
            Authenticate Email
          </Button>
        </Box>
      ) : null}
    </>
  );
}
