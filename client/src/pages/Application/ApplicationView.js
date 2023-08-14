import React, { useState, useEffect, useContext } from "react";
import axios from "../../api/axios";
import { UserContext } from "../../context/UserContext";

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Snackbar,
  Alert,
  Paper,
  Grid,
  Skeleton,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";

import Listing from "../../components/Listing";
import ApplicationProfile from "./ApplicationProfile";

const APPLICATION_URL = "/application/";

const ApplicationView = () => {
  // TODO: Handle adding token to request globally
  const { token } = useContext(UserContext);

  const [isLoading, setLoading] = useState(false);
  const snackbarIdleState = { open: false, message: "", severity: "info" };
  const [snackbarState, setSnackbarState] = useState(snackbarIdleState);

  const [searchText, setSearchText] = useState("");
  const [initialApplications, setInitialApplications] = useState([]);
  const [applications, setApplications] = useState([]);
  const [focusApplication, setFocusApplication] = useState({});

  const modalIdleState = { open: false, mode: "" };
  // member profile form visibility
  const [modalState, setModalState] = useState(modalIdleState);

  const loadApplications = async (e) => {
    setLoading(true);
    try {
      const response = await axios.get(APPLICATION_URL, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      console.log(response);

      setInitialApplications(response.data);
    } catch (err) {
      // TODO: Better error handling
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleRowClick = (id) => {
    console.log(id);
    setFocusApplication(id);
    setModalState({ open: true, mode: "view" });
  };

  const handleSearchTextChange = (e) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    if (searchText !== "" && initialApplications) {
      let newApplications = [];
      initialApplications?.forEach((application) => {
        if (application["epName"].toLowerCase().includes(searchText))
          newApplications.push(application);
      });
      setApplications(newApplications);
    } else {
      setApplications(initialApplications);
    }
  }, [searchText, initialApplications]);

  return (
    <>
      <Box component="main">
        <Box component="header" sx={{ width: "100%", my: 1 }}>
          {isLoading ? (
            <Skeleton
              variant="rectangular"
              height={48}
              sx={{ borderRadius: "10px" }}
            />
          ) : (
            <Box
              component={Paper}
              sx={{
                borderRadius: "10px",
                padding: 1,
                display: "flex",
                flexDirection: "row",
              }}
            >
              <TextField
                onChange={handleSearchTextChange}
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ flexGrow: 1 }}
              />
              <IconButton
                onClick={() => {
                  loadApplications();
                  setSearchText("");
                }}
              >
                <RefreshIcon />
              </IconButton>
              <Button
                onClick={() => {
                  setModalState({ open: true, mode: "add" });
                }}
              >
                New Application
              </Button>
            </Box>
          )}
        </Box>
        <Box component="section" sx={{ width: "100%", my: 2 }}>
          <Listing
            initialRows={applications}
            // TODO: Set the required columns
            fields={[
              "epId",
              "appStatus",
              "epName",
              "inchargeMember",
              "projectName",
              "slotName",
            ]}
            keyField="appId"
            handleRowClick={handleRowClick}
            searchField="epName"
            isLoading={isLoading}
          />
          <Dialog open={modalState.open} fullWidth maxWidth="md">
            <DialogContent dividers>
              <Box>
                <Box textAlign="right" sx={{ m: 1, width: "100%" }}>
                  {modalState.mode === "view" ? (
                    <IconButton
                      onClick={() => {
                        setModalState({ open: true, mode: "edit" });
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  ) : null}
                  <IconButton
                    onClick={() => {
                      setModalState(modalIdleState);
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              </Box>
              <ApplicationProfile
                setSnackbarState={setSnackbarState}
                formState={modalState}
                setFormState={setModalState}
                formIdleState={modalIdleState}
                refreshParent={loadApplications}
                focusItem={focusApplication}
              />
            </DialogContent>
          </Dialog>
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
      </Box>
    </>
  );
};

export default ApplicationView;
