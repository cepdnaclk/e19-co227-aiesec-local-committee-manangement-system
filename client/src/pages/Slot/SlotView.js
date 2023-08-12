import React, { useState, useEffect, useContext } from "react";

import axios from "../../api/axios";
import SlotProfile from "./SlotProfile";
import { Box, Button, IconButton, Snackbar, Alert, Paper } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { UserContext } from "../../context/UserContext";

import Listing from "../../components/Listing";

const SLOT_URL = "/slot";

export default function SlotView(props) {
  const { token } = useContext(UserContext);

  const [isLoading, setLoading] = useState(true);

  const snackbarIdleState = { open: false, message: "", severity: "info" };

  const [snackbarState, setSnackbarState] = useState(snackbarIdleState);

  const [slots, setSlots] = useState([]);

  const [focusSlot, setFocusSlot] = useState({});

  const formIdleState = { open: false, mode: "" };

  const [formState, setFormState] = useState(formIdleState);

  useEffect(() => {
    loadSlots();
  }, []);

  const loadSlots = async (e) => {
    setLoading(true);
    try {
      const response = await axios.get(SLOT_URL, {
        headers: {
          Authorization: "Bearer " + token,
        },
        params: {
          expaId: props.project.expaId,
        },
      });

      console.log(response);

      setSlots(response.data);
    } catch (err) {
      // TODO: Better error handling
      console.log(err);
    }
    setLoading(false);
  };

  const handleRowClick = (row) => {
    console.log("Current item: ", row);
    setFocusSlot(row);
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
              <IconButton onClick={loadSlots}>
                <RefreshIcon />
              </IconButton>
            ) : null}
            {formState.mode === "" ? (
              <Button
                onClick={() => {
                  setFormState({ open: true, mode: "add" });
                }}
              >
                New Slot
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
                initialRows={slots}
                // TODO: Set the required columns
                fields={["title", "startDate", "endDate", "numOpenings"]}
                keyField="slotId"
                handleRowClick={handleRowClick}
                searchField="title"
                isLoading={isLoading}
              />
            </Box>
            <Box display={formState.mode !== "" ? "block" : "none"}>
              <SlotProfile
                setSnackbarState={setSnackbarState}
                formState={formState}
                setFormState={setFormState}
                formIdleState={formIdleState}
                refreshParent={loadSlots}
                focusItem={focusSlot}
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
