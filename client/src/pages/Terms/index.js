import React, { useEffect, useState } from "react";
import { Formik, Form as FormikForm } from "formik";
import ValidationSchema from "./ValidationSchema";

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

import { TermList, CreateTerm, UpdateTerm, DeleteTerm } from "./HttpUtils";

export default function Terms() {
  // ---------- DATA HANDLING ----------
  const termList = TermList();

  // ---------- STATE MANAGEMENT ----------
  const [editMode, setEditMode] = useState();
  const [selectedItemKey, setSelectedItemKey] = useState();
  const [filteredData, setFilteredData] = useState();

  // ---------- VIEW RENDERING ----------
  if (termList.isLoading || termList.isFetching) return <ListingSkeleton />;

  if (termList.isError) return <ErrorPage error={termList.error} />;

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
          initialData={termList.data}
          setFilteredData={setFilteredData}
          searchProp="id"
          sx={{ flexGrow: 1 }}
        />
        <IconButton
          onClick={() => {
            termList.refetch();
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
        fields={["id", "startDate", "endDate", "newbieRecruitmentDate"]}
        headers={["ID", "Start Date", "End Date", "Newbie Recruitment Date"]}
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
  const termList = TermList();
  const createTerm = CreateTerm();
  const updateTerm = UpdateTerm();
  const deleteTerm = DeleteTerm();

  // ---------- STATE MANAGEMENT ----------
  const [isFormDisabled, setIsFormDisable] = useState();
  useEffect(() => {
    setIsFormDisable(editMode === "view" ? true : false);
  }, [editMode]);

  // ---------- VIEW RENDERING ----------

  if (termList.isLoading || termList.isFetching) return <FormSkeleton />;

  if (termList.error) return <ErrorPage error={termList.error} />;

  return (
    <>
      <Formik
        initialValues={
          editMode === "add"
            ? { id: "", startDate: "", endDate: "", newbieRecruitmentDate: "" }
            : termList.data.find((item) => item.id === selectedItemKey)
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
        validationSchema={ValidationSchema}
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
                  <FormSubmitButton mode={editMode} />
                </Grid>
              </Grid>
            </FormikForm>
          </>
        )}
      </Formik>
    </>
  );
}
