import React, { useEffect, useState } from "react";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";

import FilterTagBar from "../../../components/FilterTagBar";
import ListingSkeleton from "../../../components/Skeleton/Listing";
import ErrorPage from "../../../components/ErrorPage";
import SearchBar from "../../../components/SearchBar";
import Table from "../../../components/Table";
import Form from "./Form";
import Mail from "./Mail";

import { ApplicantList } from "./HttpUtils";

export default function Applicants() {
  // ---------- DATA HANDLING ----------
  const applicantList = ApplicantList();

  // ---------- STATE MANAGEMENT ----------
  const [editMode, setEditMode] = useState();
  const [selectedItemKey, setSelectedItemKey] = useState();
  const [filteredData, setFilteredData] = useState();
  const [groupedData, setGroupedData] = useState();
  const [emailModalState, setEmailModalState] = useState(false);

  // const [currTabValue, setCurrTabValue] = React.useState(0);

  // ---------- VIEW RENDERING ----------
  if (applicantList.isLoading || applicantList.isFetching)
    return <ListingSkeleton />;

  if (applicantList.isError) return <ErrorPage error={applicantList.error} />;

  if (editMode)
    return (
      // <Form
      //   editMode={editMode}
      //   setEditMode={setEditMode}
      //   selectedItemKey={selectedItemKey}
      //   setSelectedItemKey={setSelectedItemKey}
      // />
      <>
        {/* <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
            value={currTabValue}
            onChange={(event, newValue) => {
              setCurrTabValue(newValue);
            }}
            aria-label="tabs"
            >
            <Tab label="Applicant" />
            <Tab label="Mail" />
            </Tabs>
          <TabPanel value={currTabValue} index={0}> */}
        <Box textAlign="right" sx={{ m: 1, width: "100%" }}>
          <Button
            onClick={() => {
              setEmailModalState(true);
            }}
            variant="contained"
            color="success"
            disabled={editMode !== "view" ? true : false}
          >
            E-Mail
          </Button>
        </Box>
        <Form
          editMode={editMode}
          setEditMode={setEditMode}
          selectedItemKey={selectedItemKey}
          setSelectedItemKey={setSelectedItemKey}
        />
        <Dialog open={emailModalState} fullWidth maxWidth="md">
          <DialogContent dividers>
            <Box>
              <Box textAlign="right" sx={{ m: 1, width: "100%" }}>
                <IconButton
                  onClick={() => {
                    setEmailModalState(false);
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
            <Mail setEmailModalState={setEmailModalState} />
          </DialogContent>
        </Dialog>
        {/* </TabPanel>
          <TabPanel value={currTabValue} index={1}>
            <div>EMAILS</div>
          </TabPanel> 
        </Box> */}
      </>
    );

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <SearchBar
          initialData={applicantList.data}
          setFilteredData={setFilteredData}
          searchProp="firstName"
          sx={{ flexGrow: 1 }}
        />
        <IconButton
          onClick={() => {
            applicantList.refetch();
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
      <Box sx={{ p: 1, mt: 1, overflow: "scroll" }}>
        <FilterTagBar
          initialData={filteredData}
          setGroupedData={setGroupedData}
          searchProp="status"
          tags={[
            "Pre-Signup",
            "Signup",
            "Accepted",
            "Approved",
            "Realized",
            "Finished",
            "Completed",
            "Approval-Broken",
            "Realization-Broken",
          ]}
        />
      </Box>
      <Table
        rows={groupedData}
        fields={[
          "firstName",
          "lastName",
          "status",
          "phone",
          "campaignId",
          "memberInCharge",
        ]}
        headers={[
          "First Name",
          "Last Name",
          "Status",
          "Phone",
          "Campaign ID",
          "Member in Charge",
        ]}
        keyField="id"
        handleRowClick={(key) => {
          setSelectedItemKey(key);
          setEditMode("view");
        }}
      />
    </>
  );
}

// function TabPanel(props) {
//   const { children, value, index, ...other } = props;

//   return (
//     <Box
//       role="tabpanel"
//       hidden={value !== index}
//       id={`tabpanel-${index}`}
//       aria-labelledby={`tab-${index}`}
//       {...other}
//     >
//       {children}
//     </Box>
//   );
// }
