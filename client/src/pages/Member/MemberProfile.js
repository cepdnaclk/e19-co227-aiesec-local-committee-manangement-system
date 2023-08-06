import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import axios from "../../api/axios";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import ValidatedTextField from "../../components/ValidatedTextField";
import ValidatedPasswordField from "../../components/ValidatedPasswordField";
import ValidatedSelectField from "../../components/ValidatedSelectField";
import ValidatedDateField from "../../components/ValidatedDateField";
import {
  Box,
  Grid,
  Button,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  TextField,
  Divider,
  Chip,
  InputAdornment,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";

const MEMBERS_URL = "/member";
const RESOURCES_URL = "/member/resources";

/* MODES:
   [x] admin-add
   [ ] admin-view
   [ ] admin-edit
   [ ] user-view
   [ ] user-edit
   -> admin-delete
*/

export default function MemberProfile(props) {
  const test = true;

  // ~~~~~~~~~~~~~~~ FORM CONTROLS ~~~~~~~~~~~~~~~
  const [isLoading, setLoading] = useState(false);

  const {
    modalState,
    setModalState,
    modalIdleState,
    setSnackbarState,
    refreshParent,
    focusMemberId,
  } = props;

  const [areFieldsDisabled, disableFields] = useState(false);

  useEffect(() => {
    if (modalState.mode === "admin-view" || modalState.mode === "user-view")
      disableFields(true);
    else disableFields(false);
  }, [modalState.mode]);

  const [departments, setDepartments] = useState([]);

  // define initial state of form
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

  // ~~~~~~~~~~~~~~~ STATIC DATA ~~~~~~~~~~~~~~~
  const { token } = useContext(UserContext);

  const genders = [
    { key: "M", value: "Male" },
    { key: "F", value: "Female" },
  ];

  const [resources, setResources] = useState({
    districts: [],
    frontOffices: [],
    backOffices: [],
    roles: [],
  });

  useEffect(() => {
    loadResources();

    if (test) {
      setInitialState({
        email: "jane@example.com",
        passphrase: "456",
        fullName: "Jane Doe",
        preferredName: "Jane",
        frontOfficeId: "0",
        departmentId: "0",
        backOfficeId: "1",
        joinedDate: "2020-01-01",
        roleId: "1",
        contactNo: "1234567890",
        aiesecEmail: "jane@example.com",
        gender: "F",
        nic: "1234567890",
        birthDate: "2000-01-01",
        facebookLink: "jane@facebook.com",
        linkedinLink: "jane@linkedin.com",
        instagramLink: "jane@instagram.com",
        registerNo: "E/01/001",
        schoolName: "School",
        homeAddress: "No.1 Kings Street, Kandy",
        homeContact: "1234567890",
        districtId: "1",
        photoLink: "jane.photo.com",
        boardingAddress: "No.2 Kings Street, Kandy",
      });
    }
  }, []);

  const loadResources = async (e) => {
    setLoading(true);
    try {
      const response = await axios.get(RESOURCES_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      console.log("Payload received: ", response.data);
      setResources(response.data);

      if (modalState.mode === "admin-view") {
        const response = await axios.get(MEMBERS_URL, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          params: { id: focusMemberId },
        });
        console.log("Payload received: ", response);
        // TODO
        setInitialState(response.data);
      }
    } catch (err) {
      // TODO: Add better error handling when loading functions
      console.log(err);
    }
    setLoading(false);
  };

  const formSchema = yup.object().shape({
    email: yup.string().required("Email required").email("Invalid email"),
    passphrase: yup.string().required("Password required"),
    fullName: yup.string().required("Full name required"),
    preferredName: yup.string(),
    frontOfficeId: yup.string().required("Functional area required"),
    departmentId: yup.string().required("Department required"),
    backOfficeId: yup.string(),
    joinedDate: yup.date(),
    roleId: yup.string(),
    contactNo: yup.string(),
    aiesecEmail: yup.string(),
    gender: yup.string().required("Gender required"),
    nic: yup.string(),
    birthDate: yup.string(),
    facebookLink: yup.string(),
    linkedinLink: yup.string(),
    instagramLink: yup.string(),
    registerNo: yup.string(),
    schoolName: yup.string(),
    homeAddress: yup.string(),
    homeContact: yup.string(),
    districtId: yup.string(),
    photoLink: yup.string(),
    boardingAddress: yup.string(),
  });

  const handleAdd = async (formData) => {
    try {
      const response = await axios.post(MEMBERS_URL, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      setSnackbarState({
        open: true,
        message: "Member Saved Successfully!",
        severity: "success",
      });
      refreshParent();
      setModalState(modalIdleState);
    } catch (err) {
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
          Authorization: "Bearer " + token,
        },
      });
      setSnackbarState({
        open: true,
        message: "Member Updated Successfully!",
        severity: "success",
      });
      refreshParent();
      setModalState({
        open: true,
        mode: modalState.mode.replace("edit", "view"),
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
          Authorization: "Bearer " + token,
        },
        params: {
          id: formData.id,
        },
      });
      setSnackbarState({
        open: true,
        message: "Member Deleted Successfully!",
        severity: "success",
      });
      refreshParent();
      setModalState(modalIdleState);
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
    <Formik
      initialValues={initialState}
      onSubmit={(formData, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        if (modalState.mode.includes("add")) handleAdd(formData);
        else if (modalState.mode.includes("edit")) handleEdit(formData);
        else handleDelete(formData);
        setSubmitting(false);
      }}
      validationSchema={formSchema}
      enableReinitialize
    >
      {({ values, errors, touched, isSubmitting, resetForm, handleChange }) => (
        <Form>
          <Grid container spacing={2}>
            <pre>{JSON.stringify(values, null, 2)}</pre>
            <Grid item xs={12}>
              <Divider textAlign="center">
                <Chip label="Credentials"></Chip>
              </Divider>
            </Grid>
            <Grid item xs={6}>
              <ValidatedTextField
                name="email"
                label="Email"
                disabled={areFieldsDisabled || modalState.mode === "admin-edit"}
              />
            </Grid>
            <Grid item xs={6}>
              <ValidatedPasswordField
                name="passphrase"
                label="Password"
                disabled={areFieldsDisabled || modalState.mode === "admin-edit"}
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
              <ValidatedSelectField
                name="gender"
                label="Gender"
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
                options={resources.districts}
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
                options={resources.frontOffices}
                onChange={(e) => {
                  // Call default Formik handleChange()
                  handleChange(e);
                  // Additionally load the related departments
                  const currFrontOffice = resources.frontOffices.find(
                    (element) => element.key === e.target.value
                  );
                  setDepartments(JSON.parse(currFrontOffice.departments));
                }}
                disabled={areFieldsDisabled || modalState.mode === "user-edit"}
              />
            </Grid>
            <Grid item xs={3}>
              <ValidatedSelectField
                name="departmentId"
                label="Department"
                options={departments}
                disabled={areFieldsDisabled || modalState.mode === "user-edit"}
              />
            </Grid>
            <Grid item xs={3}>
              <ValidatedSelectField
                name="backOfficeId"
                label="Back Office"
                options={resources.backOffices}
                disabled={areFieldsDisabled || modalState.mode === "user-edit"}
              />
            </Grid>
            <Grid item xs={3}>
              <ValidatedSelectField
                name="roleId"
                label="Role"
                options={resources.roles}
                disabled={areFieldsDisabled || modalState.mode === "user-edit"}
              />
            </Grid>
            <Grid item xs={6}>
              <ValidatedDateField
                name="joinedDate"
                label="Joined Date"
                disabled={areFieldsDisabled || modalState.mode === "user-edit"}
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
                disabled={isSubmitting}
                variant="contained"
                color={modalState.mode.includes("view") ? "error" : "primary"}
              >
                {modalState.mode.includes("view") ? "Delete" : "Submit"}
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}
