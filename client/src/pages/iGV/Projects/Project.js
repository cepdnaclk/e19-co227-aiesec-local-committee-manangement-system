import React, { useContext } from "react";
import {
  useQuery,
  usePostMutation,
  usePutMutation,
  useDeleteMutation,
} from "../../../api/reactQuery";
import { Formik, Form } from "formik";
import * as yup from "yup";
import { UserContext } from "../../../context/UserContext";
import { useParams, useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import BackspaceIcon from "@mui/icons-material/Backspace";
import InputField from "../../../components/InputField";
import FormSubmitButton from "../../../components/FormSubmitButton";
import Loading from "../../Loading";
import ErrorPage from "../../ErrorPage";
import { useNotify } from "../../../context/NotificationContext";

export default function Project({ mode }) {
  const { user } = useContext(UserContext);
  const isAdmin = user.roleId === "LCP" || user.roleId === "LCVP";
  const isFormDisabled = mode === "view";
  const navigate = useNavigate();
  const { expaId } = useParams();
  const { notifySuccess, notifyError } = useNotify();

  // ~~~~~~~~~~ HTTP Utilities ~~~~~~~~~~
  const url = "/igv/projects";
  const updateQueryKey = ["igv-projects-list"];
  const keyField = "expaId";

  const selectedProject = useQuery({
    key: ["igv-selected-projected", expaId],
    url: `${url}/${expaId}`,
    enabled: mode !== "new",
  });
  const createProject = usePostMutation({
    url,
    updateQueryKey,
    removeQueryKeys: [["igv-opportunity-list"]],
  });
  const updateProject = usePutMutation({
    url: `${url}/${expaId}`,
    updateQueryKey,
    keyField,
    removeQueryKeys: [
      ["igv-selected-projected", expaId],
      ["igv-opportunity-list"],
    ],
  });
  const deleteProject = useDeleteMutation({
    url: `${url}/${expaId}`,
    updateQueryKey,
    keyField,
    removeQueryKeys: [
      ["igv-selected-projected", expaId],
      ["igv-opportunity-list"],
    ],
  });

  // ~~~~~~~~~~ Form Utilities ~~~~~~~~~~

  const handleSubmit = (formData, { setSubmitting }) => {
    const handleError = (err) => {
      notifyError(err?.response?.data);
      setSubmitting(false);
    };
    setSubmitting(true);
    if (mode === "new")
      createProject.mutate(formData, {
        onSuccess: (data) => {
          notifySuccess("Created");
          navigate(`../view/${data.expaId}/project`);
        },
        onError: handleError,
      });
    else if (mode === "edit")
      updateProject.mutate(formData, {
        onSuccess: (data) => {
          notifySuccess("Updated");
          navigate(`../view/${data.expaId}/project`);
        },
        onError: handleError,
      });
    else if (mode === "view")
      deleteProject.mutate(formData, {
        onSuccess: () => {
          notifySuccess("Deleted");
          navigate("../..");
        },
        onError: handleError,
      });
  };

  if (selectedProject.isInitialLoading) return <Loading />;
  if (selectedProject.isError)
    return <ErrorPage error={selectedProject.error} />;
  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        {
          {
            view: (
              <IconButton
                onClick={() => {
                  navigate(`../../edit/${expaId}`);
                }}
                disabled={!isAdmin}
              >
                <EditIcon />
              </IconButton>
            ),
            edit: (
              <IconButton
                onClick={() => {
                  navigate(`../view/${expaId}/project`);
                }}
              >
                <BackspaceIcon />
              </IconButton>
            ),
            new: (
              <IconButton
                onClick={() => {
                  navigate(`..`);
                }}
              >
                <BackspaceIcon />
              </IconButton>
            ),
          }[mode]
        }
      </Box>
      <Formik
        initialValues={mode === "new" ? initialState : selectedProject.data}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        validateOnChange
        enableReinitialize
      >
        {() => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={5}>
                <InputField
                  name="expaId"
                  label="Expa ID"
                  disabled={isFormDisabled}
                />
              </Grid>
              <Grid item xs={5}>
                <InputField name="projectName" disabled={isFormDisabled} />
              </Grid>
              <Grid item xs={2}>
                <InputField name="sdg" label="SDG" disabled={isFormDisabled} />
              </Grid>
              <Grid item xs={12}>
                <InputField
                  name="jd"
                  label="JD"
                  disabled={isFormDisabled}
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid item xs={12}>
                <InputField
                  name="oppProvider"
                  label="Opp Provider"
                  disabled={isFormDisabled}
                />
              </Grid>
              <Grid item xs={4}>
                <InputField
                  name="food"
                  type="select"
                  options={options}
                  disabled={isFormDisabled}
                />
              </Grid>
              <Grid item xs={4}>
                <InputField
                  name="transportation"
                  type="select"
                  options={options}
                  disabled={isFormDisabled}
                />
              </Grid>
              <Grid item xs={4}>
                <InputField
                  name="accommodation"
                  type="select"
                  options={options}
                  disabled={isFormDisabled}
                />
              </Grid>
              <Grid item xs={12}>
                <InputField
                  name="notes"
                  disabled={isFormDisabled}
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <FormSubmitButton mode={mode} />
            </Box>
          </Form>
        )}
      </Formik>
    </>
  );
}

// ~~~~~~~~~~ Static Objects ~~~~~~~~~~
const initialState = {
  expaId: "",
  projectName: "",
  sdg: "",
  jd: "",
  oppProvider: "",
  food: "",
  transportation: "",
  accommodation: "",
  notes: "",
};

const options = [
  { key: "Provided", value: "Provided" },
  { key: "Covered", value: "Covered" },
  { key: "Provided & Covered", value: "Provided & Covered" },
];

const validationSchema = yup.object().shape({
  expaId: yup
    .string()
    .matches(/^[0-9]+$/, "Expa ID should be a number")
    .required("Required")
    .max(7, "Cannot exceed 7 digits"),
  projectName: yup
    .string()
    .required("Required")
    .max(50, "Cannot exceed 50 characters"),
  sdg: yup
    .string()
    .matches(/^[0-9]+$/, "SDG should be a number")
    .required("Required")
    .max(2, "Cannot exceed 2 digits"),
  jd: yup
    .string()
    .required("Required")
    .max(350, "Cannot exceed 350 characters"),
  oppProvider: yup
    .string()
    .required("Required")
    .max(50, "Cannot exceed 50 characters"),
  food: yup.string().required("Required"),
  transportation: yup.string().required("Required"),
  accommodation: yup.string().required("Required"),
  notes: yup.string().max(100, "Cannot exceed 100 characters"),
});
