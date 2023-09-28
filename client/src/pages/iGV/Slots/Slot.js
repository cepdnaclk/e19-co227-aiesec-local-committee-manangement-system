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
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import Loading from "../../Loading";
import ErrorPage from "../../ErrorPage";
import InputField from "../../../components/InputField";
import FormSubmitButton from "../../../components/FormSubmitButton";
import { useNotify } from "../../../context/NotificationContext";

export default function Slot({ mode }) {
  const { expaId, slotId } = useParams();
  const navigate = useNavigate();
  const { notifySuccess, notifyError } = useNotify();
  const { user } = useContext(UserContext);
  const isAdmin = Boolean(user.roleId === "LCP" || user.roleId === "LCVP");
  const isFormDisabled = mode === "view";

  // ~~~~~~~~~~ HTTP Utilities ~~~~~~~~~~
  const url = `/igv/slots/${expaId}`;
  const updateQueryKey = ["igv-slots-list", expaId];
  const keyField = "slotId";
  const selectedSlot = useQuery({
    key: ["igv-selected-slot", expaId, slotId],
    url: `${url}/${slotId}`,
    enabled: mode !== "new",
  });
  const createSlot = usePostMutation({
    url,
    updateQueryKey,
    removeQueryKeys: [["igv-opportunity-list"]],
  });
  const updateSlot = usePutMutation({
    url: `${url}/${slotId}`,
    updateQueryKey,
    keyField,
    removeQueryKeys: [
      ["igv-selected-slot", expaId, slotId],
      ["igv-opportunity-list"],
    ],
  });
  const deleteSlot = useDeleteMutation({
    url: `${url}/${slotId}`,
    updateQueryKey,
    keyField,
    removeQueryKeys: [
      ["igv-selected-slot", expaId, slotId],
      ["igv-opportunity-list"],
    ],
  });

  // ~~~~~~~~~~ Form Utilities ~~~~~~~~~~

  const handleSubmit = (formData, { setSubmitting }) => {
    const handleError = (err) => {
      notifyError(err.response.data);
      setSubmitting(false);
    };
    setSubmitting(true);
    if (mode === "new")
      createSlot.mutate(formData, {
        onSuccess: (data) => {
          notifySuccess("Created");
          navigate(`../view/${data.slotId}`);
        },
        onError: handleError,
      });
    else if (mode === "edit")
      updateSlot.mutate(formData, {
        onSuccess: (data) => {
          notifySuccess("Updated");
          navigate(`../view/${data.slotId}`);
        },
        onError: handleError,
      });
    else if (mode === "view")
      deleteSlot.mutate(formData, {
        onSuccess: () => {
          notifySuccess("Deleted");
          navigate("..");
        },
        onError: handleError,
      });
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <IconButton
          onClick={() => {
            navigate(`..`);
          }}
        >
          <KeyboardBackspaceIcon />
        </IconButton>
      </Box>
      {selectedSlot.isInitialLoading ? (
        <Loading />
      ) : selectedSlot.isError ? (
        <ErrorPage error={selectedSlot.error} />
      ) : (
        <>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            {
              {
                view: (
                  <IconButton
                    onClick={() => {
                      navigate(`../edit/${slotId}`);
                    }}
                    disabled={!isAdmin}
                  >
                    <EditIcon />
                  </IconButton>
                ),
                edit: (
                  <IconButton
                    onClick={() => {
                      navigate(`../view/${slotId}`);
                    }}
                  >
                    <BackspaceIcon />
                  </IconButton>
                ),
              }[mode]
            }
          </Box>
          <Formik
            initialValues={mode === "new" ? initialState : selectedSlot.data}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
            validateOnChange
            enableReinitialize
          >
            {({ values, handleChange, setFieldValue }) => (
              <Form>
                <Grid container spacing={2}>
                  {/* {<pre>{JSON.stringify(values, null, 2)}</pre>} */}
                  <Grid item xs={12}>
                    <InputField name="slotName" disabled={isFormDisabled} />
                  </Grid>
                  <Grid item xs={4}>
                    <InputField
                      name="startDate"
                      type="date"
                      disabled={isFormDisabled}
                      onChange={(e) => {
                        // default behaviour
                        handleChange(e);

                        try {
                          // calculate end date 6 weeks from now
                          const endDate = new Date(values.startDate);
                          endDate.setMonth(endDate.getMonth() + 6);
                          // Convert the new date object to a string in 'YYYY-MM-DD' format
                          const endDateString = endDate
                            .toISOString()
                            .split("T")[0];
                          setFieldValue("endDate", endDateString);
                        } catch (err) {
                          console.log("Error setting end date: ", err);
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <InputField name="endDate" type="date" disabled={true} />
                  </Grid>
                  <Grid item xs={4}>
                    <InputField
                      name="numOpenings"
                      label="# Openings"
                      disabled={isFormDisabled}
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
      )}
    </>
  );
}

// ~~~~~~~~~~ Static Objects ~~~~~~~~~~
const initialState = {
  slotName: "",
  startDate: null,
  endDate: null,
  numOpenings: "",
};

const validationSchema = yup.object().shape({
  slotName: yup
    .string()
    .required("Required")
    .max(25, "Cannot exceed 25 characters"),
  startDate: yup.string().required("Required"),
  endDate: yup.string().required("Required"),
  numOpenings: yup
    .string()
    .matches(/^[0-9]+$/, "Num Openings should be a number")
    .required("Required")
    .max(2, "Cannot exceed 2 digits"),
});
