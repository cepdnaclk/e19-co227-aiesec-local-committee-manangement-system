import React, { useContext, useRef, useState } from "react";
import { UserContext } from "../../context/UserContext";
import axios from "../../api/axios";
import { Formik, Form, Field } from "formik";
import { TextField, Button, Typography, Grid, Paper, Box } from "@mui/material";
import * as yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
// import loginBanner from "../../assets/login-banner.jpg";
const LOGIN_URL = "/login";

/* TODO
 * [x] Integrate Formik to form
 * [x] Define validation scheme using Yup
 * [ ] Handle errors after form submission using hooks
 * [ ] JWT Authorization
 * [x] Redirect to homepage after login
 * [x] Show "You are already logged in" with homepage link or logout if ever redirected to this page after login
 * [ ] Complete page design with MUI
 */

export default function Login() {
  // const { setAuth } = useContext(AuthContext);

  const {
    user,
    setUser,
    // token, setToken
  } = useContext(UserContext);

  // Define initial state of login
  const initialState = {
    email: "",
    password: "",
  };

  // Define validation schema with yup
  const loginSchema = yup.object().shape({
    email: yup.string().required("Email required").email("Invalid email"),
    password: yup.string().required("Password required"),
  });

  const errRef = useRef();

  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (credentials, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    try {
      const response = await axios.post(LOGIN_URL, credentials, {
        headers: { "Content-Type": "application/json" },
        //   withCredentials: true,
      });
      console.log(JSON.stringify(response.data));

      setUser({
        email: credentials.email,
      });
      // const accessToken = response?.data?.accessToken;
      // const roles = response?.data?.roles;
      // setAuth({ response.data.email, response.data,password, roles, accessToken });

      // redirect to homepage
      navigate("/");
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
      errRef.current.focus();
    }
    setSubmitting(false);
  };

  const handleLogout = (event) => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <>
      {user ? (
        <Grid container component="main" justifyContent="center" my={24}>
          <Grid
            item
            sm={6}
            md={5}
            lg={4}
            xl={3}
            component={Paper}
            sx={{ borderRadius: "16px" }}
          >
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography component="h1" variant="h5">
                Logout
              </Typography>
              <Typography mt={3} variant="p">
                Are you sure you want to logout?
              </Typography>
              <Box textAlign="center">
                <Button
                  type="submit"
                  onClick={handleLogout}
                  variant="contained"
                  sx={{ mt: 3 }}
                >
                  Logout
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      ) : (
        <Grid container component="main" justifyContent="center" my={24}>
          {/* <Grid
            item
            sm={false}
            md={4}
            lg={3}
            xl={3}
            sx={{
              backgroundImage: `url(${loginBanner})`,
              backgroundRepeat: "no-repeat",
              bgcolor: "background.default",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          /> */}
          <Grid
            item
            sm={6}
            md={5}
            lg={4}
            xl={3}
            component={Paper}
            sx={{ borderRadius: "16px" }}
          >
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography component="h1" variant="h5">
                Login
              </Typography>
              <Typography component="p" ref={errRef} color="error">
                {errMsg}
              </Typography>
              <Formik
                initialValues={initialState}
                onSubmit={handleSubmit}
                validationSchema={loginSchema}
              >
                {({ values, errors, touched, isSubmitting }) => (
                  <Form as={Box}>
                    <Field
                      name="email"
                      type="email"
                      as={TextField}
                      label="Email"
                      variant="outlined"
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                      margin="normal"
                      fullWidth
                      autoFocus
                    />
                    <Field
                      name="password"
                      type="password"
                      as={TextField}
                      label="Password"
                      variant="outlined"
                      error={touched.password && Boolean(errors.password)}
                      helperText={touched.password && errors.password}
                      margin="normal"
                      fullWidth
                    />
                    <Box textAlign="center">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        variant="contained"
                        sx={{ mt: 3 }}
                      >
                        Submit
                      </Button>
                    </Box>
                  </Form>
                )}
              </Formik>
            </Box>
          </Grid>
        </Grid>
      )}
    </>
  );
}
