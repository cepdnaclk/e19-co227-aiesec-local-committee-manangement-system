import React, { useState, useEffect, useContext } from "react";

import axios from "../../api/axios";
import ProjectProfile from "./ProjectProfile";
import { Box, Button, IconButton, Snackbar, Alert, Paper } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { UserContext } from "../../context/UserContext";

import Listing from "../../components/Listing";

const PROJECT_URL = "/project/";

export default function ProjectView() {
  const { token } = useContext(UserContext);

  const [isLoading, setLoading] = useState(true);

  const snackbarIdleState = { open: false, message: "", severity: "info" };

  const [snackbarState, setSnackbarState] = useState(snackbarIdleState);

  const [projects, setProjects] = useState([]);

  const [focusProject, setFocusProject] = useState({});

  const formIdleState = { open: false, mode: "" };

  const [formState, setFormState] = useState(formIdleState);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async (e) => {
    setLoading(true);
    try {
      const response = await axios.get(PROJECT_URL, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      console.log(response);

      setProjects(response.data);
    } catch (err) {
      // TODO: Better error handling
      console.log(err);
    }
    setLoading(false);
  };

  const handleRowClick = (row) => {
    console.log("Current item: ", row);
    setFocusProject(row);
    setFormState({ open: true, mode: "view" });
  };

  return (
    <>
      <Box component="main">
        <Paper sx={{ borderRadius: "10px", p: 3 }}>
          <Box
            component="header"
            sx={{ width: "100%", my: 1 }}
            textAlign="right"
          >
            {formState.mode === "" ? (
              <IconButton onClick={loadProjects}>
                <RefreshIcon />
              </IconButton>
            ) : null}
            {formState.mode === "" ? (
              <Button
                onClick={() => {
                  setFormState({ open: true, mode: "add" });
                }}
              >
                New Project
              </Button>
            ) : null}
            {formState.mode === "view" ? (
              <IconButton
                onClick={() => {
                  setFormState({ open: true, mode: "edit" });
                }}
              >
                <EditIcon />
              </IconButton>
            ) : null}
            {formState.mode !== "" ? (
              <IconButton
                onClick={() => {
                  setFormState(formIdleState);
                }}
              >
                <CloseIcon />
              </IconButton>
            ) : null}
          </Box>
          <Box
            component="section"
            sx={{ width: "100%", my: 1 }}
            textAlign="center"
          >
            <Box display={formState.mode === "" ? "block" : "none"}>
              <Listing
                initialRows={projects}
                // TODO: Set the required columns
                fields={[
                  "expaId",
                  "projectName",
                  "sdg",
                  "jd",
                  "oppProvider",
                  "food",
                  "transportation",
                  "accommodation",
                  "notes",
                ]}
                keyField="expaId"
                handleRowClick={handleRowClick}
                searchField="projectName"
                isLoading={isLoading}
              />
            </Box>
            <Box display={formState.mode !== "" ? "block" : "none"}>
              <ProjectProfile
                setSnackbarState={setSnackbarState}
                formState={formState}
                setFormState={setFormState}
                formIdleState={formIdleState}
                refreshParent={loadProjects}
                focusItem={focusProject}
                setFocusItem={setFocusProject}
              />
            </Box>
          </Box>
          <Snackbar
            open={snackbarState.open}
            autoHideDuration={4000}
            onClose={() => {
              setSnackbarState(snackbarIdleState);
            }}
          >
            <Alert severity={snackbarState.severity}>
              {snackbarState.message}
            </Alert>
          </Snackbar>
        </Paper>
      </Box>
    </>
  );
}
