import React, { useEffect, useState } from "react";
import { Formik, Form as FormikForm } from "formik";
import validationSchema from "./validationSchema";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import BackspaceIcon from "@mui/icons-material/Backspace";

import ListingSkeleton from "../../components/Skeleton/Listing";
import ErrorPage from "../../components/ErrorPage";
import SearchBar from "../../components/SearchBar";
import Table from "../../components/Table";
import FormSkeleton from "../../components/Skeleton/Form";
import InputField from "../../components/InputField";
import FormSubmitButton from "../../components/FormSubmitButton";

import { useNotify } from "../../context/NotificationContext";

import {
  TemplateList,
  TemplateSelected,
  CreateTemplate,
  // UpdateTemplate,
  // DeleteTemplate,
} from "./HttpUtils";

export default function Emails() {
  // ---------- DATA HANDLING ----------
  const templateList = TemplateList();

  // ---------- STATE MANAGEMENT ----------
  const [editMode, setEditMode] = useState();
  const [selectedItemKey, setSelectedItemKey] = useState();
  const [filteredData, setFilteredData] = useState();

  // ---------- VIEW RENDERING ----------
  if (templateList.isLoading || templateList.isFetching)
    return <ListingSkeleton />;

  if (templateList.isError) return <ErrorPage error={templateList.error} />;

  if (editMode)
    return (
      <Form
        editMode={editMode}
        setEditMode={setEditMode}
        selectedItemKey={selectedItemKey}
        setSelectedItemKey={setSelectedItemKey}
      />
    );

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <SearchBar
          initialData={templateList.data}
          setFilteredData={setFilteredData}
          searchProp="name"
          sx={{ flexGrow: 1 }}
        />
        <IconButton
          onClick={() => {
            templateList.refetch();
          }}
        >
          <RefreshIcon />
        </IconButton>
        <IconButton
          onClick={() => {
            setEditMode("add");
            setSelectedItemKey(null);
          }}
        >
          <AddIcon />
        </IconButton>
      </Box>
      <Table
        rows={filteredData}
        fields={["name", "subject"]}
        headers={["Name", "Subject"]}
        keyField="id"
        handleRowClick={(key) => {
          setSelectedItemKey(key);
          setEditMode("view");
        }}
      />
    </>
  );
}
function Form({ editMode, setEditMode, selectedItemKey, setSelectedItemKey }) {
  const { notifySuccess, notifyError } = useNotify();

  // ---------- DATA HANDLING ----------
  const templateSelected = TemplateSelected();
  const createTemplate = CreateTemplate();
  // const updateTemplate = UpdateTemplate();
  // const deleteTemplate = DeleteTemplate();

  useEffect(() => {
    templateSelected.refetch();
  }, [selectedItemKey]);

  // ---------- STATE MANAGEMENT ----------
  const [isFormDisabled, setIsFormDisable] = useState();
  useEffect(() => {
    setIsFormDisable(editMode === "view" ? true : false);
  }, [editMode]);

  // ---------- VIEW RENDERING ----------

  if (templateSelected.isInitialLoading) return <FormSkeleton />;

  if (templateSelected.error)
    return <ErrorPage error={templateSelected.error} />;

  /*
  return (
    <>
      <Formik
        initialValues={
          editMode === "add"
            ? { id: "", startDate: "", endDate: "", newbieRecruitmentDate: "" }
            : templateSelected.data
        }
        onSubmit={(formData, { setSubmitting }) => {
          setSubmitting(true);
          const handleError = (err) => {
            notifyError(err.response.data);
          };
          if (editMode === "add")
            createTerm.mutate(formData, {
              onSuccess: () => {
                notifySuccess("Created");
                setEditMode("view");
                setSelectedItemKey(formData.id);
              },
              onError: handleError,
            });
          else if (editMode === "edit")
            updateTerm.mutate(formData, {
              onSuccess: () => {
                notifySuccess("Updated");
                setEditMode("view");
              },
              onError: handleError,
            });
          else if (editMode === "view")
            deleteTerm.mutate(formData, {
              onSuccess: () => {
                notifySuccess("Deleted");
                setEditMode(null);
              },
              onError: handleError,
            });
          setSubmitting(false);
        }}
        validationSchema={validationSchema}
        enableReinitialize
      >
        {({ values, resetForm }) => (
          <>
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
                  setEditMode(null);
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <FormikForm>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <InputField
                    name="id"
                    label="ID"
                    disabled={isFormDisabled || editMode !== "add"}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <InputField
                    type="date"
                    name="startDate"
                    disabled={isFormDisabled}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <InputField
                    type="date"
                    name="endDate"
                    disabled={!values.startDate || isFormDisabled}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <InputField
                    type="date"
                    name="newbieRecruitmentDate"
                    disabled={
                      !values.startDate || !values.endDate || isFormDisabled
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormSubmitButton editMode={editMode} />
                </Grid>
              </Grid>
            </FormikForm>
          </>
        )}
      </Formik>
    </>
  );
  */
}
