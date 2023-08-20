import React, { useState, useEffect, useContext } from "react";
import axios from "../../api/axios";
import MemberProfile from "./MemberProfile";
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
import { UserContext } from "../../context/UserContext";

import Listing from "../../components/Listing";

import MemberCard from "./MemberCard";
import MemberCardSkeleton from "./MemberCardSkeleton";
import SearchBar from "../../components/SearchBar/index";

const MEMBERS_URL = "/member/";

export default function MemberView() {
  // TODO: Handle adding token to request globally
  const { token } = useContext(UserContext);

  const [isLoading, setLoading] = useState(true);

  const snackbarIdleState = { open: false, message: "", severity: "info" };

  const [snackbarState, setSnackbarState] = useState(snackbarIdleState);

  const [initialMembers, setInitialMembers] = useState([]);

  const [members, setMembers] = useState([]);

  const [focusMemberId, setFocusMemberId] = useState({});

  const modalIdleState = { open: false, mode: "" };
  // member profile form visibility
  const [modalState, setModalState] = useState(modalIdleState);

  const loadMembers = async (e) => {
    setLoading(true);
    try {
      const response = await axios.get(MEMBERS_URL, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      console.log(response);

      setInitialMembers(response.data);
    } catch (err) {
      // TODO: Better error handling
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const handleRowClick = (id) => {
    console.log(id);
    setFocusMemberId(id);
    setModalState({ open: true, mode: "admin-view" });
  };

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
              <SearchBar
                initialData={initialMembers}
                setFilteredData={setMembers}
                searchProp="preferredName"
                sx={{ flexGrow: 1 }}
              />
              <IconButton
                onClick={() => {
                  loadMembers();
                }}
              >
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
          )}
        </Box>
        <Box component="section" sx={{ width: "100%", my: 2 }}>
          {/* <Listing
              initialRows={members}
              // TODO: Set the required columns
              fields={["email", "preferredName", "fullName"]}
              keyField="id"
              handleRowClick={handleRowClick}
              searchField="email"
              isLoading={isLoading}
            /> */}
          <Grid container spacing={2}>
            {isLoading ? (
              <>
                <MemberCardSkeleton />
                <MemberCardSkeleton />
                <MemberCardSkeleton />
                <MemberCardSkeleton />
                <MemberCardSkeleton />
              </>
            ) : (
              members.map((member, i) => (
                <MemberCard member={member} onClick={handleRowClick} key={i} />
              ))
            )}
          </Grid>
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
                formState={modalState}
                setFormState={setModalState}
                formIdleState={modalIdleState}
                refreshParent={loadMembers}
                focusItemId={focusMemberId}
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
