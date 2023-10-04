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

import { useNotify } from "../../../context/NotificationContext";

export default function Application({ mode }) {
  const { user } = useContext(UserContext);
  const { appId } = useParams();
  const navigate = useNavigate();
  const { notifySuccess, notifyError } = useNotify();

  // ~~~~~~~~~~ HTTP Utilities ~~~~~~~~~~
  const url = "/igv/applications/item";
  const opportunityList = useQuery({
    key: ["igv-opportunity-list"],
    url: "/igv/applications/opportunities",
  });

  const memberList = useQuery({
    key: ["igv-member-list"],
    url: "/igv/applications/members",
  });

  const selectedApplication = useQuery({
    key: ["igv-selected-application", appId],
    url: `${url}/${appId}`,
    enabled: mode !== "new",
  });

  const [currSlots, setCurrSlots] = useState([]);
  const setSlots = (currProjectKey) => {
    if (!opportunityList && !currProjectKey) return [];
    // TODO: there is a error here
    const currProject = opportunityList.data.find((obj) => {
      return obj.key === currProjectKey;
    });
    setCurrSlots(JSON.parse(currProject.slots) || []);
  };
  useEffect(() => {
    if (mode !== "new" && selectedApplication?.data?.projectExpaId)
      setSlots(selectedApplication.data.projectExpaId);
  }, [selectedApplication, opportunityList]);

  const isAdmin =
    user.roleId === "LCP" ||
    user.roleId === "LCVP" ||
    (mode !== "new" && user.id === selectedApplication?.memberId);
  const fieldProps = { disabled: mode === "view" || !isAdmin };

  const updateQueryKey = ["igv-application-list"];
  const keyField = "appId";
  const createApplication = usePostMutation({
    url,
    updateQueryKey,
  });
  const updateApplication = usePutMutation({
    url: `${url}/${appId}`,
    updateQueryKey,
    keyField,
    removeQueryKeys: [["igv-selected-application", appId]],
  });
  const deleteApplication = useDeleteMutation({
    url: `${url}/${appId}`,
    updateQueryKey,
    keyField,
    removeQueryKeys: [["igv-selected-application", appId]],
  });

  // ~~~~~~~~~~ Form Utilities ~~~~~~~~~~

  const handleSubmit = (formData, { setSubmitting }) => {
    const handleError = (err) => {
      notifyError(err?.response?.data);
      setSubmitting(false);
    };
    setSubmitting(true);
    if (mode === "new")
      createApplication.mutate(formData, {
        onSuccess: (data) => {
          notifySuccess("Created");
          navigate(`../view/${data.appId}/application`);
        },
        onError: handleError,
      });
    else if (mode === "edit")
      updateApplication.mutate(formData, {
        onSuccess: (data) => {
          notifySuccess("Updated");
          navigate(`../view/${data.appId}/application`);
        },
        onError: handleError,
      });
    else if (mode === "view")
      deleteApplication.mutate(formData, {
        onSuccess: () => {
          notifySuccess("Deleted");
          navigate("../..");
        },
        onError: handleError,
      });
  };

  const validationSchema =
    //   useMemo(() => {
    yup.object().shape({
      epId: yup
        .string()
        .matches(/^[0-9]+$/, "EP ID should be a number")
        .required("Required")
        .max(7, "Cannot exceed 7 digits"),
      appStatus: yup
        .string()
        .required("Required")
        .test("validNextStatus", "Invalid Application Status", (value) => {
          // ignore unset values by returning true for undefined values
          if (mode === "new") return true;

          return value
            ? applicationValidNextStatus[
                selectedApplication?.data?.appStatus
              ]?.includes(value)
            : true;
        }),
      epName: yup
        .string()
        .required("Required")
        .max(50, "Cannot exceed 50 Characters"),
      memberId: yup.string().required("Required"),
      team: yup.string().max(15, "Cannot exceed 15 Characters").notRequired(),
      appliedDate: yup.date().notRequired(),
      contactedDate: yup.date().notRequired(),
      slotId: yup.string().required("Required"),
      projectExpaId: yup.string().required("Required"),
      gender: yup.string().notRequired(),
      homeMc: yup.string().max(25, "Cannot exceed 25 Characters").notRequired(),
      homeLc: yup.string().max(25, "Cannot exceed 25 Characters").notRequired(),
      contactNumber: yup
        .string()
        .max(15, "Cannot exceed 15 Characters")
        .notRequired(),
      email: yup.string().email("Invalid").notRequired(),
      notes: yup
        .string()
        .max(150, "Cannot exceed 150 Characters")
        .notRequired(),
      interviewDate: yup.date().notRequired(),
      interviewTime: yup
        .string()
        .matches(
          /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,
          "Invalid Time Format (HH:MM:SSgit )"
        )
        .notRequired(),
      epMngName: yup
        .string()
        .max(20, "Cannot exceed 20 Characters")
        .notRequired(),
      epMngContact: yup
        .string()
        .max(15, "Cannot exceed 15 Characters")
        .notRequired(),
      epMngEmail: yup.string().email().notRequired(),
      abhDate: yup.date().notRequired(),
      acceptedDate: yup.date().notRequired(),
      approvedDate: yup.date().notRequired(),
      realizedDate: yup.date().notRequired(),
      paymentDate: yup.date().notRequired(),
      amount: yup
        .string()
        .notRequired()
        .test("maxDecimalPlaces", "Maximum Two Decimal Places", (value) =>
          value ? value.split(".")[1]?.length <= 2 : true
        )
        .test("maxValue", "Max Value Exceeded", (value) =>
          //  ignore unset values by returning true for undefined values
          value ? String(value).split(".")[0]?.length <= 10 : true
        ),
      proofLink: yup
        .string()
        .max(100, "Cannot exceed 100 Characters")
        .notRequired(),
      finishedDate: yup.date().notRequired(),
      completedDate: yup.date().notRequired(),
    });
  //   }, [selectedApplication]);

  if (
    opportunityList.isLoading ||
    memberList.isLoading ||
    selectedApplication.isInitialLoading
  )
    return <Loading />;

  if (
    opportunityList.isError ||
    memberList.isError ||
    selectedApplication.isError
  )
    <ErrorPage
      error={
        opportunityList.error || memberList.error || selectedApplication.error
      }
    />;

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        {
          {
            view: (
              <IconButton
                onClick={() => {
                  navigate(`../../edit/${appId}`);
                }}
                disabled={!isAdmin}
              >
                <EditIcon />
              </IconButton>
            ),
            edit: (
              <IconButton
                onClick={() => {
                  navigate(`../view/${appId}/application`);
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
        initialValues={mode === "new" ? initialState : selectedApplication.data}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        validateOnChange={false}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          isSubmitting,
          resetForm,
          handleChange,
        }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <pre>{JSON.stringify(values, null, 2)}</pre>
              </Grid>
              <Grid item xs={6}>
                <InputField name="epId" label="EP ID" {...fieldProps} />
              </Grid>
              <Grid item xs={6}>
                <InputField
                  name="appStatus"
                  label="Status"
                  type="select"
                  options={applicationStatus}
                  {...fieldProps}
                />
              </Grid>
              <Grid item xs={6}>
                <InputField name="epName" label="EP Name" {...fieldProps} />
              </Grid>
              <Grid item xs={6}>
                <InputField
                  name="memberId"
                  type="select"
                  label="In Charge Member"
                  options={memberList.data}
                  {...fieldProps}
                />
              </Grid>
              <Grid item xs={4}>
                <InputField
                  // TODO: Load Teams from DB
                  name="team"
                  label="Team"
                  {...fieldProps}
                />
              </Grid>
              <Grid item xs={4}>
                <InputField name="appliedDate" type="date" {...fieldProps} />
              </Grid>
              <Grid item xs={4}>
                <InputField name="contactedDate" type="date" {...fieldProps} />
              </Grid>
              <Grid item xs={6}>
                <InputField
                  name="projectExpaId"
                  label="Project"
                  type="select"
                  options={opportunityList.data}
                  {...fieldProps}
                  onChange={(e) => {
                    // Call default Formik handleChange()
                    handleChange(e);
                    // Additionally load the related slots
                    setSlots(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <InputField
                  name="slotId"
                  label="Slot"
                  type="select"
                  options={currSlots}
                  {...fieldProps}
                />
              </Grid>
              <Grid item xs={4}>
                <InputField
                  name="gender"
                  type="select"
                  options={genders}
                  {...fieldProps}
                />
              </Grid>
              <Grid item xs={4}>
                <InputField name="homeMc" label="Home MC" {...fieldProps} />
              </Grid>
              <Grid item xs={4}>
                <InputField name="homeLc" label="Home LC" {...fieldProps} />
              </Grid>
              <Grid item xs={6}>
                <InputField name="contactNumber" {...fieldProps} />
              </Grid>
              <Grid item xs={6}>
                <InputField name="email" {...fieldProps} />
              </Grid>
              <Grid item xs={12}>
                <InputField name="notes" {...fieldProps} />
              </Grid>
              <Grid item xs={6}>
                <InputField name="interviewDate" type="date" {...fieldProps} />
              </Grid>
              <Grid item xs={6}>
                <InputField name="interviewTime" {...fieldProps} />
              </Grid>
              <Grid item xs={4}>
                <InputField
                  name="epMngName"
                  label="EP Manager Name"
                  {...fieldProps}
                />
              </Grid>
              <Grid item xs={4}>
                <InputField
                  name="epMngContact"
                  label="EP Manager Contact"
                  {...fieldProps}
                />
              </Grid>
              <Grid item xs={4}>
                <InputField
                  name="epMngEmail"
                  label="EP Manager Email"
                  {...fieldProps}
                />
              </Grid>
              <Grid item xs={4}>
                <InputField
                  name="abhDate"
                  label="ABH Date"
                  type="date"
                  {...fieldProps}
                />
              </Grid>
              <Grid item xs={4}>
                <InputField name="acceptedDate" type="date" {...fieldProps} />
              </Grid>
              <Grid item xs={4}>
                <InputField name="approvedDate" type="date" {...fieldProps} />
              </Grid>
              <Grid item xs={4}>
                <InputField name="realizedDate" type="date" {...fieldProps} />
              </Grid>
              <Grid item xs={4}>
                <InputField name="paymentDate" type="date" {...fieldProps} />
              </Grid>
              <Grid item xs={4}>
                <InputField name="amount" {...fieldProps} />
              </Grid>
              <Grid item xs={12}>
                <InputField name="proofLink" {...fieldProps} />
              </Grid>
              <Grid item xs={4}>
                <InputField name="finishedDate" type="date" {...fieldProps} />
              </Grid>
              <Grid item xs={4}>
                <InputField name="completedDate" type="date" {...fieldProps} />
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
  epId: "",
  // appId: "",
  appStatus: "Open",
  epName: "",
  memberId: "",
  team: "",
  appliedDate: null,
  contactedDate: null,
  slotId: "",
  projectExpaId: "",
  gender: "",
  homeMc: "",
  homeLc: "",
  contactNumber: "",
  email: "",
  notes: "",
  interviewDate: "",
  interviewTime: "",
  epMngName: "",
  epMngContact: "",
  epMngEmail: "",
  abhDate: "",
  acceptedDate: "",
  approvedDate: "",
  realizedDate: "",
  paymentDate: "",
  amount: "",
  proofLink: "",
  finishedDate: "",
  completedDate: "",
};

const genders = [
  { key: "M", value: "Male" },
  { key: "F", value: "Female" },
];

const applicationStatus = [
  { key: "Open", value: "Open" },
  { key: "Withdrawn", value: "Withdrawn" },
  { key: "ABH", value: "ABH" },
  { key: "Rejected", value: "Rejected" },
  { key: "Accepted", value: "Accepted" },
  { key: "Approved", value: "Approved" },
];

const applicationValidNextStatus = {
  Open: ["Open", "Withdrawn", "ABH", "Rejected"],
  Withdrawn: ["Withdrawn"],
  Rejected: ["Rejected"],
  ABH: ["ABH", "Rejected", "Accepted"],
  Accepted: ["Accepted", "Rejected", "Approved"],
  Approved: ["Approved"],
};
