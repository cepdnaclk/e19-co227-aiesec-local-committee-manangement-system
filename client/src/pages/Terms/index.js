import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";

import ListingSkeleton from "../../components/Skeleton/Listing";
import SearchBar from "../../components/SearchBar";
import Table from "../../components/Table";
import ItemView from "./ItemView";

import { loadAll } from "./HttpUtils";

export default function Terms() {
  // ---------- DATA HANDLING ----------
  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["terms"],
    queryFn: loadAll,
  });

  // ---------- STATE MANAGEMENT ----------
  const [editMode, setEditMode] = useState();
  const [selectedItemKey, setSelectedItemKey] = useState();
  const [filteredData, setFilteredData] = useState();

  // ---------- VIEW RENDERING ----------
  if (isLoading) return <ListingSkeleton />;

  if (error) return <Alert severity="error">Error: {error.message}</Alert>;

  if (editMode)
    return (
      <>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <IconButton
            onClick={() => {
              setEditMode(null);
              setSelectedItemKey(null);
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <ItemView mode={editMode} selectedItemKey={selectedItemKey} />
      </>
    );

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <SearchBar
          initialData={data}
          setFilteredData={setFilteredData}
          searchProp="title"
          sx={{ flexGrow: 1 }}
        />
        <IconButton
          onClick={() => {
            refetch();
          }}
        >
          <RefreshIcon />
        </IconButton>
        <IconButton
          onClick={() => {
            setEditMode("add");
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
