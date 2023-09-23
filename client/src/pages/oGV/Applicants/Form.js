import React, { useState, useEffect } from "react";
import { Formik, Form as FormikForm } from "formik";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import BackspaceIcon from "@mui/icons-material/Backspace";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputField from "../../../components/InputField";
import FormSubmitButton from "../../../components/FormSubmitButton";
import {
  InChargeMemberList,
  ApplicantSelected,
  CreateApplicant,
  UpdateApplicant,
  DeleteApplicant,
} from "./HttpUtils";
import FormSkeleton from "../../../components/Skeleton/Form";
import ErrorPage from "../../../components/ErrorPage";
import validationSchema from "./validationSchema";
import initialData from "./initialData";
import { useNotify } from "../../../context/NotificationContext";

const Form = ({
  editMode,
  setEditMode,
  selectedItemKey,
  setSelectedItemKey,
}) => {
  const { notifySuccess, notifyError } = useNotify();
  // ---------- DATA HANDLING ----------
  const applicantSelected = ApplicantSelected(selectedItemKey, editMode);

  useEffect(() => {
    applicantSelected.refetch();
  }, [selectedItemKey]);

  const inChargeMemberList = InChargeMemberList();
  const createApplicant = CreateApplicant(
    setEditMode,
    setSelectedItemKey,
    notifySuccess,
    notifyError
  );
  const updateApplicant = UpdateApplicant(
    setEditMode,
    notifySuccess,
    notifyError
  );
  const deleteApplicant = DeleteApplicant(
    setEditMode,
    notifySuccess,
    notifyError
  );

  // ---------- STATE MANAGEMENT ----------

  const [isFormDisabled, setIsFormDisable] = useState();
  useEffect(() => {
    setIsFormDisable(editMode === "view" ? true : false);
  }, [editMode]);

  // ---------- VIEW RENDERING ----------
  if (
    inChargeMemberList.isLoading ||
    inChargeMemberList.isFetching ||
    applicantSelected.isInitialLoading ||
    applicantSelected.isFetching
  )
    return <FormSkeleton />;

  if (applicantSelected.error)
    return <ErrorPage error={applicantSelected.error} />;

  if (inChargeMemberList.isError)
    return <ErrorPage error={inChargeMemberList.error} />;

  return (
    <Formik
      initialValues={editMode === "add" ? initialData : applicantSelected.data}
      onSubmit={(formData, { setSubmitting }) => {
        const handleError = (err) => {
          notifyError(err.response.data);
        };
        setSubmitting(true);
        if (editMode === "add") {
          createApplicant.mutate(formData, {
            onSuccess: (data, variables, context) => {
              notifySuccess("Created");
              setEditMode("view");
              setSelectedItemKey(data.id);
            },
            onError: handleError,
          });
        } else if (editMode === "edit") {
          updateApplicant.mutate(
            { id: selectedItemKey, formData },
            {
              onSuccess: (data, variables, context) => {
                notifySuccess("Updated");
                setEditMode("view");
                setSelectedItemKey(data.id);
              },
              onError: handleError,
            }
          );
        } else if (editMode === "view") {
          deleteApplicant.mutate(selectedItemKey, {
            onSuccess: (data, variables, context) => {
              notifySuccess("Deleted");
              setEditMode(null);
            },
            onError: handleError,
          });
        }

        setSubmitting(false);
      }}
      validationSchema={validationSchema}
      validateOnChange={false}
      validateOnMount={false}
      enableReinitialize
    >
      {({ values, errors, handleChange, resetForm }) => (
        <>
          {/* {JSON.stringify(values, null, 2)}
          {JSON.stringify(errors, null, 2)} */}
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            {editMode === "view" ? (
              <IconButton
                onClick={() => {
                  setEditMode("edit");
                }}
              >
                <EditIcon />
              </IconButton>
            ) : (
              <IconButton
                onClick={() => {
                  setEditMode(editMode === "edit" ? "view" : "add");
                  resetForm();
                }}
              >
                <BackspaceIcon />
              </IconButton>
            )}
            <IconButton
              onClick={() => {
                setSelectedItemKey(null);
                setEditMode(null);
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <FormikForm>
            <InputField
              type="select"
              name="status"
              options={[
                { key: "Pre-Signup", value: "Pre-Signup" },
                { key: "Signup", value: "Signup" },
                { key: "Accepted", value: "Accepted" },
                { key: "Approved", value: "Approved" },
                { key: "Realized", value: "Realized" },
                { key: "Finished", value: "Finished" },
                { key: "Completed", value: "Completed" },
                { key: "Approval-Broken", value: "Approval-Broken" },
                { key: "Realization-Broken", value: "Realization-Broken" },
              ]}
              disabled={isFormDisabled || editMode === "add"}
            />
            <Grid container spacing={1} sx={{ mt: 1 }}>
              {/* ~~~~~~~~~~~~~~~ Pre-Signup ~~~~~~~~~~~~~~~ */}
              <Grid item xs={12}>
                <Divider textAlign="center">
                  <Chip label="Pre-Signup"></Chip>
                </Divider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputField
                  name="firstName"
                  disabled={isFormDisabled || values.status !== "Pre-Signup"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputField
                  name="lastName"
                  disabled={isFormDisabled || values.status !== "Pre-Signup"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputField
                  name="phone"
                  disabled={isFormDisabled || values.status !== "Pre-Signup"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputField
                  name="email"
                  disabled={isFormDisabled || values.status !== "Pre-Signup"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputField
                  type="select"
                  name="memberInChargeId"
                  label="Member In Charge"
                  options={inChargeMemberList.data}
                  disabled={isFormDisabled || values.status !== "Pre-Signup"}
                />
              </Grid>
              <Grid item xs={6}>
                <InputField
                  name="campaignId"
                  label="Campaign ID"
                  disabled={isFormDisabled || values.status !== "Pre-Signup"}
                />
              </Grid>
              {/* ~~~~~~~~~~~~~~~ Signup ~~~~~~~~~~~~~~~ */}
              <Grid item xs={12}>
                <Divider textAlign="center">
                  <Chip label="Signup"></Chip>
                </Divider>
              </Grid>
              <Grid item xs={12}>
                <InputField
                  name="sentLinks"
                  disabled={isFormDisabled || values.status !== "Signup"}
                />
              </Grid>
              <Grid item xs={12}>
                <InputField
                  name="signupNotes"
                  disabled={isFormDisabled || values.status !== "Signup"}
                  multiline
                />
              </Grid>
              {/* ~~~~~~~~~~~~~~~ Accepted ~~~~~~~~~~~~~~~ */}
              <Grid item xs={12}>
                <Divider textAlign="center">
                  <Chip label="Accepted"></Chip>
                </Divider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputField
                  name="opportunityId"
                  label="Opportunity ID"
                  disabled={isFormDisabled || values.status !== "Accepted"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputField
                  name="opportunityName"
                  disabled={isFormDisabled || values.status !== "Accepted"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputField
                  name="hostMc"
                  label="Host MC"
                  disabled={isFormDisabled || values.status !== "Accepted"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputField
                  name="hostLc"
                  label="Host LC"
                  disabled={isFormDisabled || values.status !== "Accepted"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputField
                  type="date"
                  name="acceptedStartDate"
                  disabled={isFormDisabled || values.status !== "Accepted"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputField
                  type="date"
                  name="acceptanceDate"
                  disabled={isFormDisabled || values.status !== "Accepted"}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox checked={values.isEseEmailSent} />}
                  label="Is ESE Email Sent?"
                  name="isEseEmailSent"
                  onChange={handleChange}
                  disabled={isFormDisabled || values.status !== "Accepted"}
                />
              </Grid>
              <Grid item xs={12}>
                <InputField
                  name="acceptedNotes"
                  disabled={isFormDisabled || values.status !== "Accepted"}
                  multiline
                />
              </Grid>
              {/* ~~~~~~~~~~~~~~~ Approved ~~~~~~~~~~~~~~~ */}
              <Grid item xs={12}>
                <Divider textAlign="center">
                  <Chip label="Approved"></Chip>
                </Divider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputField
                  type="date"
                  name="approvedDate"
                  disabled={isFormDisabled || values.status !== "Approved"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputField
                  type="date"
                  name="paymentDate"
                  disabled={isFormDisabled || values.status !== "Approved"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputField
                  name="paymentAmount"
                  disabled={isFormDisabled || values.status !== "Approved"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputField
                  name="proofLink"
                  disabled={isFormDisabled || values.status !== "Approved"}
                />
              </Grid>
              <Grid item xs={12}>
                <InputField
                  name="approvedNotes"
                  disabled={isFormDisabled || values.status !== "Approved"}
                  multiline
                />
              </Grid>
              {/* ~~~~~~~~~~~~~~~ Realized ~~~~~~~~~~~~~~~ */}
              <Grid item xs={12}>
                <Divider textAlign="center">
                  <Chip label="Realized"></Chip>
                </Divider>
              </Grid>
              <Grid item xs={12}>
                <InputField
                  type="date"
                  name="realizedStartDate"
                  disabled={isFormDisabled || values.status !== "Realized"}
                />
              </Grid>
              <Grid item xs={12}>
                <InputField
                  name="realizedNotes"
                  disabled={isFormDisabled || values.status !== "Realized"}
                  multiline
                />
              </Grid>
              {/* ~~~~~~~~~~~~~~~ Finished ~~~~~~~~~~~~~~~ */}
              <Grid item xs={12}>
                <Divider textAlign="center">
                  <Chip label="Finished"></Chip>
                </Divider>
              </Grid>
              <Grid item xs={12}>
                <InputField
                  type="date"
                  name="finishedDate"
                  disabled={isFormDisabled || values.status !== "Finished"}
                />
              </Grid>
              {/* ~~~~~~~~~~~~~~~ Completed ~~~~~~~~~~~~~~~ */}
              <Grid item xs={12}>
                <Divider textAlign="center">
                  <Chip label="Completed"></Chip>
                </Divider>
              </Grid>
              <Grid item xs={12}>
                <InputField
                  type="date"
                  name="completedDate"
                  disabled={isFormDisabled || values.status !== "Completed"}
                />
              </Grid>
              {/* ~~~~~~~~~~~~~~~ Approval-Broken ~~~~~~~~~~~~~~~ */}
              <Grid item xs={12}>
                <Divider textAlign="center">
                  <Chip label="Approval-Broken"></Chip>
                </Divider>
              </Grid>
              <Grid item xs={12}>
                <InputField
                  name="approvalBreakNote"
                  disabled={
                    isFormDisabled || values.status !== "Approval-Broken"
                  }
                  multiline
                />
              </Grid>
              {/* ~~~~~~~~~~~~~~~ Realization-Broken ~~~~~~~~~~~~~~~ */}
              <Grid item xs={12}>
                <Divider textAlign="center">
                  <Chip label="Realization-Broken"></Chip>
                </Divider>
              </Grid>
              <Grid item xs={12}>
                <InputField
                  name="realizationBreakNote"
                  disabled={
                    isFormDisabled || values.status !== "Realization-Broken"
                  }
                  multiline
                />
              </Grid>
            </Grid>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <FormSubmitButton editMode={editMode} />
            </Box>
          </FormikForm>
        </>
      )}
    </Formik>
  );
};

export default Form;
