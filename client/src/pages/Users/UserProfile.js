import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import axios from "../../api/axios";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import {
  Box,
  TextField,
  Grid,
  Button,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Divider,
  Chip,
  InputAdornment,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";

const FUNCTIONAL_AREA_URL = "/users/functional_area";
const DEPARTMENT_URL = "/users/department";
const USERS_URL = "/users";

/* no userId -> add new (ADD CANCEL)
    userId -> view + delete (EDIT DELETE CLOSE)
    edit -> (SAVE CANCEL -> view) 
*/

export default function UserProfile(props) {
  const test = true;

  const genders = [
    { value: "M", label: "Male" },
    { value: "F", label: "Female" },
  ];

  // Define initial state of form
  const initialState = test
    ? {
        email: "jane@example.com",
        passphrase: "456",
        fullName: "Jane Doe",
        preferredName: "Jane",
        functionalAreaId: "",
        departmentId: "",
        joinedDate: "",
        positionID: "",
        contactNo: "",
        aiesecEmail: "",
        gender: "",
        nic: "",
        birthDate: "",
        facebookLink: "",
        linkedinLink: "",
        instagramLink: "",
        facultyId: "",
        batch: "",
        registerNo: "",
        schoolName: "",
        homeAddress: "",
        homeContact: "",
        district: "",
        photoLink: "",
        boardingAddress: "",
      }
    : {
        email: "",
        passphrase: "",
        // fullName: "",
        // preferredName: "",
        // functionID: "",
        // deptID: "",
        // dateOfJoin: "",
        // positionID: "",
        // contactNumber: "",
        // aiesecEmail: "",
        // gender: "",
        // nicNumber: "",
        // birthdate: "",
        // facebookLink: "",
        // linkedInLink: "",
        // instagramLink: "",
        // facultyID: "",
        // batch: "",
        // uniRegNo: "",
        // schoolName: "",
        // homeAddress: "",
        // homeContactNumber: "",
        // district: "",
        // photoLink: "",
        // boardingAddress: "",
      };

  const [errMsg, setErrMsg] = useState("");

  const [enableSnackbar, setEnableSnackbar] = useState(false);

  const { token } = useContext(UserContext);

  // load profile data
  // const loadProfile = async () => {
  //   try {
  //     const response = await axios.get(USERS_URL, {
  //       params: { id: props.profileId },
  //     });

  //     console.log(response);
  //   } catch (err) {
  //     if (!err?.response) {
  //       setErrMsg("No Server Response");
  //     } else {
  //       setErrMsg("Something went wrong. Please refresh page");
  //     }
  //   }
  // };

  const [functionalAreas, setFunctionalAreas] = useState();

  useEffect(() => {
    loadFunctionalAreas();
  }, []);

  const loadFunctionalAreas = async (e) => {
    // e.preventDefault();
    try {
      const response = await axios.get(FUNCTIONAL_AREA_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      // console.log(response.data);
      setFunctionalAreas(response.data);
      console.log(functionalAreas);
    } catch (err) {
      // TODO: Add better error handling when loading functions
      console.log(err);
    }
  };

  const [departments, setDepartments] = useState([]);

  const loadDepartments = async (e) => {
    const currId = e.target.value;

    const currFunctionalArea = functionalAreas.find(
      (element) => element.id === currId
    );

    setDepartments(JSON.parse(currFunctionalArea.departments));
  };

  const [districts, setDistricts] = useState();

  useEffect(() => {
    loadDistricts();
  }, []);

  const loadDistricts = async () => {
    try {
      const response = await axios.get("/resource/district", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setDistricts(response.data);
    } catch (err) {
      // TODO: Add better error handling when loading functions
      console.log(err);
    }
  };

  // const [districts, setDistricts] = useState();

  // useEffect(() => {
  //   loadDistricts();
  // }, []);

  // const loadDistricts = async () => {
  //   try {
  //     const response = await axios.get("/resource/district", {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     setDistricts(response.data);
  //   } catch (err) {
  //     // TODO: Add better error handling when loading functions
  //     console.log(err);
  //   }
  // };

  const formSchema = yup.object().shape({
    email: yup.string().required("Email required").email("Invalid email"),
    passphrase: yup.string().required("Password required"),
    fullName: yup.string().required("Full name required"),
    preferredName: yup.string(),
    functionalAreaId: yup.string().required("Functional area required"),
    departmentId: yup.string().required("Department required"),
    joinedDate: yup.date(),
    positionID: yup.string(),
    contactNo: yup.string(),
    aiesecEmail: yup.string(),
    gender: yup.string().required("Gender required"),
    nic: yup.string(),
    birthDate: yup.string(),
    facebookLink: yup.string(),
    linkedinLink: yup.string(),
    instagramLink: yup.string(),
    facultyId: yup.string(),
    batch: yup.string(),
    registerNo: yup.string(),
    schoolName: yup.string(),
    homeAddress: yup.string(),
    homeContact: yup.string(),
    district: yup.string(),
    photoLink: yup.string(),
    boardingAddress: yup.string(),
  });

  const handleSubmit = async (formData, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    try {
      const response = await axios.post(USERS_URL, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      console.log(JSON.stringify(response.data));
      resetForm();
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 404) {
        setErrMsg("Missing User");
      } else if (err.response?.status === 401) {
        setErrMsg("Password Mismatch");
      } else {
        setErrMsg("Login Failed");
      }
    }
    setSubmitting(false);
  };

  return (
    // <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Grid>
      <Formik
        initialValues={initialState}
        onSubmit={handleSubmit}
        validationSchema={formSchema}
      >
        {({
          values,
          errors,
          touched,
          isSubmitting,
          resetForm,
          handleChange,
        }) => (
          <Form as={Box}>
            <pre>{JSON.stringify(values, null, 2)}</pre>
            <Box component="section" sx={{ width: "100%" }}>
              <Divider textAlign="center">
                <Chip label="Credentials"></Chip>
              </Divider>
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Field
                  name="email"
                  type="email"
                  as={TextField}
                  label="Email"
                  variant="outlined"
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  sm={12}
                  md={6}
                  sx={{ m: 1, width: "100%" }}
                  size="small"
                />
                <Field
                  name="passphrase"
                  type="password"
                  as={TextField}
                  label="Password"
                  variant="outlined"
                  error={touched.userPassword && Boolean(errors.userPassword)}
                  helperText={touched.userPassword && errors.userPassword}
                  sm={12}
                  md={6}
                  sx={{ m: 1, width: "100%" }}
                  size="small"
                />
              </Box>
            </Box>
            <Box component="section" sx={{ width: "100%" }}>
              <Divider textAlign="center">
                <Chip label="Personal Information"></Chip>
              </Divider>
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Field
                  name="fullName"
                  type="text"
                  as={TextField}
                  label="Full Name"
                  variant="outlined"
                  error={touched.fullName && Boolean(errors.fullName)}
                  helperText={touched.fullName && errors.fullName}
                  sx={{ m: 1, width: "100%" }}
                  size="small"
                />
                <Field
                  name="preferredName"
                  type="text"
                  as={TextField}
                  label="Preferred Name"
                  variant="outlined"
                  error={touched.preferredName && Boolean(errors.preferredName)}
                  helperText={touched.preferredName && errors.preferredName}
                  sx={{ m: 1, width: "100%" }}
                  size="small"
                />
              </Box>
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Field
                  as={TextField}
                  id="outlined-select-currency"
                  select
                  name="gender"
                  label="Gender"
                  error={touched.gender && Boolean(errors.gender)}
                  helperText={touched.gender && errors.gender}
                  sx={{ m: 1, width: "100%" }}
                  size="small"
                >
                  {genders.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Field>
                <Field
                  name="birthDate"
                  type="date"
                  as={TextField}
                  label="Birth Date"
                  variant="outlined"
                  error={touched.birthDate && Boolean(errors.birthDate)}
                  helperText={touched.birthDate && errors.birthDate}
                  sx={{ m: 1, width: "100%" }}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
                <Field
                  name="nic"
                  type="text"
                  as={TextField}
                  label="NIC"
                  variant="outlined"
                  error={touched.nic && Boolean(errors.nic)}
                  helperText={touched.nic && errors.nic}
                  sx={{ m: 1, width: "100%" }}
                  size="small"
                />
              </Box>
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Field
                  name="contactNo"
                  type="tel"
                  as={TextField}
                  label="Contact No"
                  variant="outlined"
                  error={touched.contactNo && Boolean(errors.contactNo)}
                  helperText={touched.contactNo && errors.contactNo}
                  sx={{ m: 1, width: "100%" }}
                  size="small"
                />
                <Field
                  name="homeContact"
                  type="tel"
                  as={TextField}
                  label="Home Contact"
                  variant="outlined"
                  error={touched.homeContact && Boolean(errors.homeContact)}
                  helperText={touched.homeContact && errors.homeContact}
                  sx={{ m: 1, width: "100%" }}
                  size="small"
                />
              </Box>
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Field
                  name="homeAddress"
                  type="text"
                  as={TextField}
                  label="Home Address"
                  variant="outlined"
                  error={touched.homeAddress && Boolean(errors.homeAddress)}
                  helperText={touched.homeAddress && errors.homeAddress}
                  // TODO fix weird misalignment with row above when set to 75%
                  sx={{ m: 1, width: "75%" }}
                  size="small"
                />
                <FormControl sx={{ m: 1, width: "25%" }}>
                  <InputLabel id="districtIdLabel" size="small">
                    District
                  </InputLabel>
                  <Field
                    as={Select}
                    labelId="districtIdLabel"
                    id="districtId"
                    label="District"
                    name="districtId"
                    size="small"
                  >
                    {districts?.map(({ id, title }, index) => (
                      <MenuItem value={id}>{title}</MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Field
                  name="facebookLink"
                  type="text"
                  as={TextField}
                  label="Facebook Link"
                  variant="outlined"
                  error={touched.facebookLink && Boolean(errors.facebookLink)}
                  helperText={touched.facebookLink && errors.facebookLink}
                  sx={{ m: 1, width: "100%" }}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FacebookIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Field
                  name="linkedinLink"
                  type="text"
                  as={TextField}
                  label="Linkedin Link"
                  variant="outlined"
                  error={touched.linkedinLink && Boolean(errors.linkedinLink)}
                  helperText={touched.linkedinLink && errors.linkedinLink}
                  sx={{ m: 1, width: "100%" }}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LinkedInIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Field
                  name="instagramLink"
                  type="text"
                  as={TextField}
                  label="Instagram Link"
                  variant="outlined"
                  error={touched.instagramLink && Boolean(errors.instagramLink)}
                  helperText={touched.instagramLink && errors.instagramLink}
                  sx={{ m: 1, width: "100%" }}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <InstagramIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Field
                  name="photoLink"
                  type="text"
                  as={TextField}
                  label="Photo Link"
                  variant="outlined"
                  error={touched.photoLink && Boolean(errors.photoLink)}
                  helperText={touched.photoLink && errors.photoLink}
                  sx={{ m: 1, width: "100%" }}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <InsertPhotoIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Box>
            <Box component="section" sx={{ width: "100%" }}>
              <Divider textAlign="center">
                <Chip label="Academic Details"></Chip>
              </Divider>
              <Box component="section" sx={{ width: "100%" }}>
                <Field
                  name="batch"
                  type="text"
                  as={TextField}
                  label="Batch"
                  variant="outlined"
                  error={touched.batch && Boolean(errors.batch)}
                  helperText={touched.batch && errors.batch}
                  sm={12}
                  md={6}
                  sx={{ m: 1, width: "100%" }}
                  size="small"
                />
              </Box>
            </Box>
            <Box component="section" sx={{ width: "100%" }}>
              <Divider textAlign="center">
                <Chip label="AIESEC Details"></Chip>
              </Divider>
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <FormControl sx={{ m: 1, width: "100%" }}>
                  <InputLabel id="functionalAreaLabel" size="small">
                    Functional Area
                  </InputLabel>
                  <Field
                    as={Select}
                    labelId="functionalAreaLabel"
                    id="functionalAreaId"
                    label="Functional Area"
                    name="functionalAreaId"
                    size="small"
                    onChange={(e) => {
                      // Call default Formik handleChange()
                      handleChange(e);
                      // Additionally load the related departments
                      loadDepartments(e);
                    }}
                  >
                    {functionalAreas?.map(
                      ({ id, title, abbreviation }, index) => (
                        <MenuItem value={id}>
                          {title} ({abbreviation})
                        </MenuItem>
                      )
                    )}
                  </Field>
                </FormControl>
                <FormControl sx={{ m: 1, width: "100%" }}>
                  <InputLabel id="departmentIdLabel" size="small">
                    Department
                  </InputLabel>
                  <Field
                    as={Select}
                    labelId="departmentIdLabel"
                    id="departmentId"
                    label="Department"
                    name="departmentId"
                    size="small"
                  >
                    {departments?.map(({ id, title, abbreviation }, index) => (
                      <MenuItem value={id}>
                        {title} ({abbreviation})
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
                <FormControl sx={{ m: 1, width: "100%" }}>
                  <InputLabel id="positionIdLabel" size="small">
                    Position
                  </InputLabel>
                  <Field
                    as={Select}
                    labelId="positionIdLabel"
                    id="positionId"
                    label="Position"
                    name="positionId"
                    size="small"
                  >
                    {departments?.map(({ id, title, abbreviation }, index) => (
                      <MenuItem value={id}>
                        {title} ({abbreviation})
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
                <Field
                  name="joinedDate"
                  type="date"
                  as={TextField}
                  label="Joined Date"
                  variant="outlined"
                  error={touched.joinedDate && Boolean(errors.joinedDate)}
                  helperText={touched.joinedDate && errors.joinedDate}
                  sx={{ m: 1, width: "100%" }}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Field
                  name="aisecEmail"
                  type="email"
                  as={TextField}
                  label="AISEC Email"
                  variant="outlined"
                  error={touched.aisecEmail && Boolean(errors.aisecEmail)}
                  helperText={touched.aisecEmail && errors.aisecEmail}
                  sx={{ m: 1, width: "100%" }}
                  size="small"
                />
              </Box>
            </Box>
            <Box textAlign="right">
              <Button
                type="submit"
                disabled={isSubmitting}
                variant="contained"
                sx={{ m: 2 }}
              >
                Submit
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
      <Snackbar open={enableSnackbar} autoHideDuration={4000}>
        <Alert severity="success" sx={{ width: "100%" }}>
          This is a success message!
        </Alert>
      </Snackbar>
    </Grid>
    // </LocalizationProvider>
  );
}
