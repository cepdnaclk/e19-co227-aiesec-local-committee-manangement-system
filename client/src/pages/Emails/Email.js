import React, { useContext } from "react";
import { Editor } from "@tinymce/tinymce-react";
import Grid from "@mui/material/Grid";
import {
  useQuery,
  usePostMutation,
  usePutMutation,
  useDeleteMutation,
} from "../../api/reactQuery";
import { Formik, Form, FieldArray } from "formik";
import * as yup from "yup";
import { UserContext } from "../../context/UserContext";
import { useParams, useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import BackspaceIcon from "@mui/icons-material/Backspace";
import InputField from "../../components/InputField";
import FormSubmitButton from "../../components/FormSubmitButton";
import GuidelineAccordian from "./GuidelineAccordian";
import Loading from "../Loading";
import ErrorPage from "../ErrorPage";
import { useNotify } from "../../context/NotificationContext";

export default function Email({ officeId, mode }) {
  const { user } = useContext(UserContext);
  const isAdmin = user.roleId === "LCP" || user.roleId === "LCVP";
  const isFormDisabled = mode === "view" || !isAdmin;
  const navigate = useNavigate();
  const { id } = useParams();
  const { notifySuccess, notifyError } = useNotify();

  // ~~~~~~~~~~ HTTP Utilities ~~~~~~~~~~
  const url = "/email/template";
  const updateQueryKey = ["email-template-list", officeId];
  const keyField = "id";

  const selectedEmail = useQuery({
    key: ["selected-email", officeId, id],
    url: `${url}/${id}`,
    enabled: mode !== "new",
  });
  const createEmail = usePostMutation({
    url: `${url}/create`,
    updateQueryKey,
  });
  const updateEmail = usePutMutation({
    url: `${url}/${id}`,
    updateQueryKey,
    keyField,
    removeQueryKeys: [["selected-email", officeId, id]],
  });
  const deleteEmail = useDeleteMutation({
    url: `${url}/${id}`,
    updateQueryKey,
    keyField,
    removeQueryKeys: [["selected-email", officeId, id]],
  });

  // ~~~~~~~~~~ Form Utilities ~~~~~~~~~~

  const handleSubmit = (formData, { setSubmitting }) => {
    // console.log("I was invoked with mode: ", mode);
    const submitData = { officeId, ...formData };
    const handleError = (err) => {
      notifyError(err?.response?.data);
      setSubmitting(false);
    };
    setSubmitting(true);
    if (mode === "new")
      createEmail.mutate(submitData, {
        onSuccess: (data) => {
          notifySuccess("Created");
          navigate(`../view/${data.id}`);
        },
        onError: handleError,
      });
    else if (mode === "edit")
      updateEmail.mutate(submitData, {
        onSuccess: (data) => {
          notifySuccess("Updated");
          navigate(`../view/${data.id}`);
        },
        onError: handleError,
      });
    else if (mode === "view")
      deleteEmail.mutate(submitData, {
        onSuccess: () => {
          notifySuccess("Deleted");
          navigate("..");
        },
        onError: handleError,
      });
  };

  if (selectedEmail.isInitialLoading) return <Loading />;
  if (selectedEmail.isError) return <ErrorPage error={selectedEmail.error} />;

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        {
          {
            view: (
              <IconButton
                onClick={() => {
                  navigate(`../edit/${id}`);
                }}
                disabled={!isAdmin}
              >
                <EditIcon />
              </IconButton>
            ),
            edit: (
              <IconButton
                onClick={() => {
                  navigate(`../view/${id}`);
                }}
              >
                <BackspaceIcon />
              </IconButton>
            ),
          }[mode]
        }
        <IconButton
          onClick={() => {
            navigate(`..`);
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <EmailForm
        initialValues={mode === "new" ? initialState : selectedEmail.data}
        isFormDisabled={isFormDisabled}
        handleSubmit={handleSubmit}
        mode={mode}
      />
      <GuidelineAccordian officeId={officeId} />
    </>
  );
}

export function EmailForm({
  initialValues,
  isFormDisabled,
  handleSubmit,
  mode,
}) {
  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        // validationSchema={yup.object().shape({
        //   name: yup
        //     .string()
        //     .required("Required")
        //     .max(255, "Cannot exceed 255 characters"),
        //   cc: yup.array().of(yup.string().email()),
        //   bcc: yup.array().of(yup.string().email()),
        //   subject: yup
        //     .string()
        //     .required("Required")
        //     .max(255, "Cannot exceed 255 characters"),
        //   body: yup.string().required("Required"),
        // })}
        // validateOnChange
        // validateOnMount
        enableReinitialize
      >
        {({ values, touched, errors, handleChange }) => (
          <Form>
            {/* <>{JSON.stringify(values, null, 2)}</> */}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <InputField name="name" disabled={isFormDisabled} />
              </Grid>
              <Grid item xs={12}>
                <InputField name="subject" disabled={isFormDisabled} />
              </Grid>
              <Grid itex xs={12}>
                <FieldArray
                  name="cc"
                  render={(arrayHelpers) => (
                    <>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            mx: 3.5,
                            textAlign: "left",
                            alignSelf: "center",
                            flexGrow: 1,
                          }}
                        >
                          CC
                        </Typography>
                        <IconButton
                          onClick={() => arrayHelpers.push("")}
                          disabled={isFormDisabled}
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>
                      {values.cc?.map((cc, index) => (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                          key={index}
                        >
                          <InputField
                            name={`cc.${index}`}
                            label={`${index + 1}`}
                            sx={{
                              ml: 2.5,
                              flexGrow: 1,
                            }}
                            disabled={isFormDisabled}
                          />
                          <IconButton
                            onClick={() => arrayHelpers.remove(index)}
                            disabled={isFormDisabled}
                          >
                            <ClearIcon />
                          </IconButton>
                        </Box>
                      ))}
                    </>
                  )}
                />
              </Grid>
              <Grid itex xs={12}>
                <FieldArray
                  name="bcc"
                  render={(arrayHelpers) => (
                    <>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            mx: 3.5,
                            textAlign: "left",
                            alignSelf: "center",
                            flexGrow: 1,
                          }}
                        >
                          BCC
                        </Typography>
                        <IconButton
                          onClick={() => arrayHelpers.push("")}
                          disabled={isFormDisabled}
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>
                      {values.bcc?.map((bcc, index) => (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                          key={index}
                        >
                          <InputField
                            name={`bcc.${index}`}
                            label={`${index + 1}`}
                            sx={{
                              ml: 2.5,
                              flexGrow: 1,
                            }}
                            disabled={isFormDisabled}
                          />
                          <IconButton
                            onClick={() => arrayHelpers.remove(index)}
                            disabled={isFormDisabled}
                          >
                            <ClearIcon />
                          </IconButton>
                        </Box>
                      ))}
                    </>
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Editor
                  value={values.body}
                  onEditorChange={(e) => {
                    handleChange({ target: { name: "body", value: e } });
                  }}
                  init={{
                    height: 500,
                    menubar: false,
                    plugins: ["image"],
                    toolbar: "image",
                    content_style:
                      "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography sx={{ pl: 2 }} variant="body2" color="error">
                  {touched.body && errors.body}
                </Typography>
              </Grid>
              <Grid itex xs={12}>
                <FieldArray
                  name="attachments"
                  render={(arrayHelpers) => (
                    <>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            mx: 3.5,
                            textAlign: "left",
                            alignSelf: "center",
                            flexGrow: 1,
                          }}
                        >
                          Attachments
                        </Typography>
                        <IconButton
                          onClick={() => arrayHelpers.push("")}
                          disabled={isFormDisabled}
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>
                      {values.attachments?.map((attachment, index) => (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                          key={index}
                        >
                          <InputField
                            name={`attachments.${index}`}
                            label={`${index + 1}`}
                            sx={{
                              ml: 2.5,
                              flexGrow: 1,
                            }}
                            disabled={isFormDisabled}
                          />
                          <IconButton
                            onClick={() => arrayHelpers.remove(index)}
                            disabled={isFormDisabled}
                          >
                            <ClearIcon />
                          </IconButton>
                        </Box>
                      ))}
                    </>
                  )}
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

const initialState = {
  name: "",
  cc: [],
  bcc: [],
  subject: "",
  body: "",
  attachments: [],
};
