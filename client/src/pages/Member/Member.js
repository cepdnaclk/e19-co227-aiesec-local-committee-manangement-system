import React, { useState, useEffect, useContext } from "react";
import axios from "../../api/axios";
import MemberProfile from "./MemberProfile";
import {
  Paper,
  Box,
  Button,
  IconButton,
  Dialog,
  DialogContent,
  Snackbar,
  Alert,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { UserContext } from "../../context/UserContext";

import Listing from "../../components/Listing";

const MEMBERS_URL = "/member";

export default function Users() {
  const { token } = useContext(UserContext);

  const [isLoading, setLoading] = useState(true);

  const snackbarIdleState = { open: false, message: "", severity: "info" };

  const [snackbarState, setSnackbarState] = useState(snackbarIdleState);

  const [members, setMembers] = useState(null);

  const [focusMemberId, setFocusMemberId] = useState("");

  const modalIdleState = { open: false, mode: "" };
  // member profile form visibility
  const [modalState, setModalState] = useState(modalIdleState);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async (e) => {
    setLoading(true);
    try {
      const response = await axios.get(MEMBERS_URL, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      console.log(response);

      setMembers(response.data);
    } catch (err) {
      // TODO: Add better error handling when loading users
      console.log(err);
    }
    setLoading(false);
  };

  const handleRowClick = (id) => {
    setFocusMemberId(id);
    setModalState({ open: true, mode: "admin-view" });
  };

  return (
    <>
      <Box component="main" sx={{ m: 1 }}>
        <Box component="header" sx={{ width: "100%", my: 1 }} textAlign="right">
          <IconButton onClick={loadMembers}>
            <RefreshIcon />
          </IconButton>
          <Button
            onClick={() => {
              setModalState({ open: true, mode: "admin-add" });
            }}
          >
            New User
          </Button>
        </Box>
        <Box
          component="section"
          sx={{ width: "100%", my: 1 }}
          textAlign="center"
        >
          <Listing
            initialRows={members}
            fields={["email"]}
            keyField="id"
            handleRowClick={handleRowClick}
            searchField="email"
            isLoading={isLoading}
          />
          <Dialog open={modalState.open} fullWidth maxWidth="md">
            <DialogContent dividers>
              <Box>
                <Box textAlign="right" sx={{ m: 1, width: "100%" }}>
                  {modalState.mode === "admin-view" ? (
                    <IconButton
                      onClick={() => {
                        setModalState({ open: true, mode: "admin-edit" });
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
              <MemberProfile
                setSnackbarState={setSnackbarState}
                modalState={modalState}
                setModalState={setModalState}
                modalIdleState={modalIdleState}
                refreshParent={loadMembers}
                focusMemberId={focusMemberId}
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
}
