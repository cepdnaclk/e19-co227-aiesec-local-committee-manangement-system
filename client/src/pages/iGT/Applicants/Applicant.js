import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  useQuery,
  usePostMutation,
  usePutMutation,
  useDeleteMutation,
} from "../../../api/reactQuery";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as yup from "yup";
import { UserContext } from "../../../context/UserContext";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import BackspaceIcon from "@mui/icons-material/Backspace";
import InputField from "../../../components/InputField";
import FormSubmitButton from "../../../components/FormSubmitButton";
import Loading from "../../Loading";
import ErrorPage from "../../ErrorPage";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import { useNotify } from "../../../context/NotificationContext";

export default function Applicant({ mode }) {
  const { user, privileges } = useContext(UserContext);
  const { isOGVAdmin } = privileges;
  const { id } = useParams();
  const navigate = useNavigate();
  const { notifySuccess, notifyError } = useNotify();

  // ~~~~~~~~~~ HTTP Utilities ~~~~~~~~~~
  const url = "/igt/applicants";
  const updateQueryKey = ["igt-applicant-list"];
  const removeQueryKeys = [["igt-selected-applicant", id]];
  const keyField = "id";
  const applicantSelected = useQuery({
    key: ["igt-selected-applicant", id],
    url: `${url}/item/${id}`,
    enabled: mode !== "new",
  });

  const inChargeMemberList = useQuery({
    key: ["igt-cxp-member-list"],
    url: `${url}/members`,
  });

  const createApplicant = usePostMutation({
    url: `${url}/item`,
    updateQueryKey,
  });

  const updateApplicant = usePutMutation({
    url: `${url}/item/${id}`,
    updateQueryKey,
    keyField,
    removeQueryKeys,
  });

  const deleteApplicant = useDeleteMutation({
    url: `${url}/item/${id}`,
    updateQueryKey,
    keyField,
    removeQueryKeys,
  });

  // ---------- VIEW RENDERING ----------
  if (
    inChargeMemberList.isLoading ||
    inChargeMemberList.isFetching ||
    applicantSelected.isInitialLoading ||
    applicantSelected.isFetching
  )
    return <Loading />;

  if (applicantSelected.error)
    return <ErrorPage error={applicantSelected.error} />;

  if (inChargeMemberList.isError)
    return <ErrorPage error={inChargeMemberList.error} />;

  // ~~~~~~~~~~ Form Utilities ~~~~~~~~~~

  const handleSubmit = (formData, { setSubmitting }) => {
    const handleError = (err) => {
      notifyError(err?.response?.data);
      setSubmitting(false);
    };
    setSubmitting(true);
    if (mode === "new")
      createApplicant.mutate(formData, {
        onSuccess: (data) => {
          notifySuccess("Created");
          navigate(`../view/${data.id}/applicant`);
        },
        onError: handleError,
      });
    else if (mode === "edit")
      updateApplicant.mutate(formData, {
        onSuccess: (data) => {
          notifySuccess("Updated");
          navigate(`../view/${data.id}/applicant`);
        },
        onError: handleError,
      });
    else if (mode === "view")
      deleteApplicant.mutate(formData, {
        onSuccess: () => {
          notifySuccess("Deleted");
          navigate("../..");
        },
        onError: handleError,
      });
  };

  const isEditable = user.id === applicantSelected.memberInChargeId;

  const fieldProps = {
    disabled: mode === "view" || (!isOGVAdmin && !isEditable),
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        {
          {
            view: (
              <IconButton
                onClick={() => {
                  navigate(`../../edit/${id}`);
                }}
                disabled={!isOGVAdmin && !isEditable}
              >
                <EditIcon />
              </IconButton>
            ),
            edit: (
              <IconButton
                onClick={() => {
                  navigate(`../view/${id}/applicant`);
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
        initialValues={mode === "add" ? initialData : applicantSelected.data}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        validateOnChange={false}
        validateOnMount={false}
        enableReinitialize
      >
        {({ values, errors, handleChange, resetForm }) => (
          <Form>
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
              disabled={fieldProps.disabled || mode === "add"}
            />
            <Grid container spacing={1} sx={{ mt: 1 }}>
              {/* ~~~~~~~~~~~~~~~ Pre-Signup ~~~~~~~~~~~~~~~ */}
              <Grid item xs={12}>
                <Divider textAlign="center">
                  <Chip label="Pre-Signup"></Chip>
                </Divider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputField name="firstName" {...fieldProps} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputField name="lastName" {...fieldProps} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputField name="phone" {...fieldProps} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputField name="email" {...fieldProps} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputField
                  type="select"
                  name="memberInChargeId"
                  label="Member In Charge"
                  options={inChargeMemberList.data}
                  {...fieldProps}
                />
              </Grid>
              <Grid item xs={6}>
                <InputField
                  name="campaignId"
                  label="Campaign ID"
                  {...fieldProps}
                />
              </Grid>
              {/* ~~~~~~~~~~~~~~~ Signup ~~~~~~~~~~~~~~~ */}
              <Grid item xs={12}>
                <Divider textAlign="center">
                  <Chip label="Signup"></Chip>
                </Divider>
              </Grid>
              <Grid item xs={12}>
                <InputField name="sentLinks" {...fieldProps} />
              </Grid>
              <Grid item xs={12}>
                <InputField name="signupNotes" multiline {...fieldProps} />
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
                  {...fieldProps}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputField name="opportunityName" {...fieldProps} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputField name="hostMc" label="Host MC" {...fieldProps} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputField name="hostLc" label="Host LC" {...fieldProps} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputField
                  type="date"
                  name="acceptedStartDate"
                  {...fieldProps}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputField type="date" name="acceptanceDate" {...fieldProps} />
              </Grid>
              <Grid item xs={12}>
                <InputField name="acceptedNotes" {...fieldProps} multiline />
              </Grid>
              {/* ~~~~~~~~~~~~~~~ Approved ~~~~~~~~~~~~~~~ */}
              <Grid item xs={12}>
                <Divider textAlign="center">
                  <Chip label="Approved"></Chip>
                </Divider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputField type="date" name="approvedDate" {...fieldProps} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputField type="date" name="paymentDate" {...fieldProps} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputField name="paymentAmount" {...fieldProps} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputField name="proofLink" {...fieldProps} />
              </Grid>
              <Grid item xs={12}>
                <InputField name="approvedNotes" multiline {...fieldProps} />
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
                  {...fieldProps}
                />
              </Grid>
              <Grid item xs={12}>
                <InputField name="realizedNotes" {...fieldProps} multiline />
              </Grid>
              {/* ~~~~~~~~~~~~~~~ Finished ~~~~~~~~~~~~~~~ */}
              <Grid item xs={12}>
                <Divider textAlign="center">
                  <Chip label="Finished"></Chip>
                </Divider>
              </Grid>
              <Grid item xs={12}>
                <InputField type="date" name="finishedDate" {...fieldProps} />
              </Grid>
              {/* ~~~~~~~~~~~~~~~ Completed ~~~~~~~~~~~~~~~ */}
              <Grid item xs={12}>
                <Divider textAlign="center">
                  <Chip label="Completed"></Chip>
                </Divider>
              </Grid>
              <Grid item xs={12}>
                <InputField type="date" name="completedDate" {...fieldProps} />
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
                  {...fieldProps}
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
                  {...fieldProps}
                  multiline
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

const initialData = {
  status: "Pre-Signup",
  // Pre-Signup
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  memberInChargeId: "",
  campaignId: "",
  // Signup
  sentLinks: "",
  signupNotes: "",
  // Accepted
  opportunityId: null,
  opportunityName: "",
  hostMc: "",
  hostLc: "",
  acceptedStartDate: "",
  acceptanceDate: "",
  isEseEmailSent: false,
  acceptedNotes: "",
  // Approved
  approvedDate: "",
  paymentDate: "",
  paymentAmount: "",
  proofLink: "",
  approvedNotes: "",
  // Realized
  realizedStartDate: "",
  realizedNotes: "",
  // Finished
  finishedDate: "",
  // Completed
  completedDate: "",
  // Approval-Broken
  approvalBreakNote: "",
  // Realization-Broken
  realizationBreakNote: "",
};

const validationSchema = yup.object().shape({
  status: yup.string().required("Required"),
  // Pre-Signup
  firstName: yup.string().required("Required").max(255),
  lastName: yup.string().required("Required").max(255),
  phone: yup.string().max(20).notRequired(),
  email: yup.string().email().required("Required"),
  memberInChargeId: yup.number().required("Required"),
  campaignId: yup.string().max(255).notRequired(),
  // Signup
  sentLinks: yup.string().max(1024).notRequired(),
  signupNotes: yup.string().max(255).notRequired(),
  // Accepted
  opportunityId: yup.string().notRequired().max(7),
  // .test("maxDigits", "Should Contain 7 Digits", (number) =>
  //   //  ignore unset values by returning true for undefined values
  //   number ? String(number).length === 7 : true
  // ),
  opportunityName: yup.string().max(255).notRequired(),
  hostMc: yup.string().max(255).notRequired(),
  hostLc: yup.string().max(255).notRequired(),
  acceptedStartDate: yup.date().notRequired(),
  acceptanceDate: yup.date().notRequired(),
  isEseEmailSent: yup.boolean().notRequired(),
  acceptedNotes: yup.string().max(255).notRequired(),
  // Approved
  approvedDate: yup
    .date()
    .notRequired()
    .min(yup.ref("acceptedStartDate"), "Cannot Predate Accepted Start Date"),
  paymentDate: yup.date().notRequired(),
  paymentAmount: yup.string().notRequired(),
  // .test("maxDecimalPlaces", "Maximum Two Decimal Places", (value) =>
  //   value ? value.split(".")[1]?.length <= 2 : true
  // )
  // .test("maxValue", "Max Value Exceeded", (value) =>
  //   //  ignore unset values by returning true for undefined values
  //   value ? String(value).split(".")[0]?.length <= 10 : true
  // ),
  proofLink: yup.string().max(1024).notRequired(),
  approvedNotes: yup.string().max(255).notRequired(),
  // Realized
  realizedStartDate: yup
    .date()
    .min(yup.ref("approvedDate"), "Cannot Predate Approved Date")
    .notRequired(),
  realizedNotes: yup.string().max(255).notRequired(),
  // Finished
  finishedDate: yup
    .date()
    .notRequired()
    .min(yup.ref("realizedStartDate"), "Cannot Predate Realized Date"),
  // Completed
  completedDate: yup
    .date()
    .notRequired()
    .min(yup.ref("finishedDate"), "Cannot Predate Finished Date"),
  // Approval-Broken
  approvalBreakNote: yup.string().notRequired(),
  // Realization-Broken
  realizationBreakNote: yup.string().notRequired(),
});
