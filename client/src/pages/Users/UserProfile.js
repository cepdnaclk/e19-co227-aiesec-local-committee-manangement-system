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
} from "@mui/material";

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

  const districts = [
    "Ampara",
    "Anuradhapura",
    "Badulla",
    "Batticaloa",
    "Colombo",
    "Galle",
    "Gampaha",
    "Hambantota",
    "Jaffna",
    "Kalutara",
    "Kandy",
    "Kegalle",
    "Kilinochchi",
    "Kurunegala",
    "Mannar",
    "Matale",
    "Matara",
    "Monaragala",
    "Mullaitivu",
    "Nuwara Eliya",
    "Polonnaruwa",
    "Puttalam",
    "Ratnapura",
    "Trincomalee",
    "Vavuniya",
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

  const [functionalAreas, setFunctionalAreas] = useState([]);

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

      setFunctionalAreas(response.data);
      // console.log(functionalAreas);
    } catch (err) {
      // TODO: Add better error handling when loading functions
      console.log(err);
    }
  };

  const [departments, setDepartments] = useState([]);

  // useEffect(() => {
  //   console.log(formRef.current.values);
  // }, [formRef.current.values]);

  const loadDepartments = async (e) => {
    // The original handler
    // handleChange(e);

    const functionalAreaId = e.target.value;
    try {
      const response = await axios.get(DEPARTMENT_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        params: {
          functionalAreaId: functionalAreaId,
        },
        //,
        // data: [
        //   {
        //     functionalAreaId: functionalAreaId,
        //   },
        // ],
      });
      setDepartments(response.data);
      console.log(response.data);
    } catch (err) {
      // TODO: Add better error handling when loading functions
      console.log(err);
    }
  };

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
        // innerRef={formRef}
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
            <Field
              name="email"
              type="email"
              as={TextField}
              label="Email"
              variant="outlined"
              error={touched.personalEmail && Boolean(errors.personalEmail)}
              helperText={touched.personalEmail && errors.personalEmail}
              sx={{ m: 1, width: "90%" }}
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
              sx={{ m: 1, width: "90%" }}
              size="small"
            />
            <Field
              name="fullName"
              type="text"
              as={TextField}
              label="Full Name"
              variant="outlined"
              error={touched.fullName && Boolean(errors.fullName)}
              helperText={touched.fullName && errors.fullName}
              sx={{ m: 1, width: "90%" }}
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
              sx={{ m: 1, width: "90%" }}
              size="small"
            />
            <FormControl sx={{ width: "45%" }}>
              <InputLabel id="functionalArea">Functional Area</InputLabel>
              <Field
                as={Select}
                id="functionalAreaId"
                label="Functional"
                name="functionalAreaId"
                sx={{ m: 1, width: "45%" }}
                size="small"
                onChange={(e) => {
                  // Call default Formik handleChange()
                  handleChange(e);
                  // Additionally set the new frequencyDayValues state variable
                  // based on e.target.value
                  loadDepartments(e);
                }}
              >
                {functionalAreas?.map(({ id, title, abbreviation }, index) => (
                  <MenuItem value={id}>
                    {title} ({abbreviation})
                  </MenuItem>
                ))}
              </Field>
            </FormControl>
            <FormControl sx={{ width: "45%" }}>
              <InputLabel id="departmentId">Department</InputLabel>
              <Field
                as={Select}
                id="departmentId"
                label="Department"
                name="departmentId"
                sx={{ m: 1, width: "45%" }}
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
              // id="outlined-helperText"
              name="joinedDate"
              type="date"
              as={TextField}
              label="Joined Date"
              variant="outlined"
              error={touched.joinedDate && Boolean(errors.joinedDate)}
              helperText={touched.joinedDate && errors.joinedDate}
              sx={{ m: 1, width: "75%" }}
              size="small"
              InputLabelProps={{ shrink: true }}
            />
            <Field
              name="contactNo"
              type="tel"
              as={TextField}
              label="Contact No"
              variant="outlined"
              error={touched.contactNo && Boolean(errors.contactNo)}
              helperText={touched.contactNo && errors.contactNo}
              sx={{ m: 1, width: "90%" }}
              size="small"
            />
            <Field
              name="aisecEmail"
              type="email"
              as={TextField}
              label="AISEC Email"
              variant="outlined"
              error={touched.aisecEmail && Boolean(errors.aisecEmail)}
              helperText={touched.aisecEmail && errors.aisecEmail}
              sx={{ m: 1, width: "90%" }}
              size="small"
            />
            <Field
              as={TextField}
              id="outlined-select-currency"
              select
              name="gender"
              label="Gender"
              error={touched.gender && Boolean(errors.gender)}
              helperText={touched.gender && errors.gender}
            >
              {genders.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Field>
            <Field
              name="nic"
              type="text"
              as={TextField}
              label="NIC"
              variant="outlined"
              error={touched.nic && Boolean(errors.nic)}
              helperText={touched.nic && errors.nic}
              sx={{ m: 1, width: "90%" }}
              size="small"
            />
            <Field
              // id="outlined-helperText"
              name="birthDate"
              type="date"
              as={TextField}
              label="Birth Date"
              variant="outlined"
              error={touched.birthDate && Boolean(errors.birthDate)}
              helperText={touched.birthDate && errors.birthDate}
              sx={{ m: 1, width: "75%" }}
              size="small"
              InputLabelProps={{ shrink: true }}
            />
            <Field
              name="facebookLink"
              type="text"
              as={TextField}
              label="Facebook Link"
              variant="outlined"
              error={touched.facebookLink && Boolean(errors.facebookLink)}
              helperText={touched.facebookLink && errors.facebookLink}
              sx={{ m: 1, width: "90%" }}
              size="small"
            />
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
