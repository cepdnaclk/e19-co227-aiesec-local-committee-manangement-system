import React, { useState, useContext } from "react";
import { useQuery } from "../../../api/reactQuery";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/UserContext";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchBar from "../../../components/SearchBar";
import Table from "../../../components/Table";
import Loading from "../../Loading";
import ErrorPage from "../../ErrorPage";

export default function SlotList() {
  const { expaId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const isAdmin = Boolean(user.roleId === "LCP" || user.roleId === "LCVP");
  const [filteredData, setFilteredData] = useState();

  const url = `/igv/slots/${expaId}`;
  const slotData = useQuery({ key: ["igv-slots-list", expaId], url });
  if (slotData.isLoading) return <Loading />;
  if (slotData.isError) return <ErrorPage error={slotData.error} />;

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <SearchBar
          initialData={slotData.data}
          setFilteredData={setFilteredData}
          searchProp="slotName"
          sx={{ flexGrow: 1 }}
        />
        <IconButton
          onClick={() => {
            slotData.refetch();
          }}
        >
          <RefreshIcon />
        </IconButton>
        <IconButton
          onClick={() => {
            navigate("new");
          }}
          disabled={!isAdmin}
        >
          <AddIcon />
        </IconButton>
      </Box>
      <Table
        rows={filteredData}
        fields={["slotName", "startDate", "numOpenings"]}
        headers={["Slot Name", "Start Date", "Openings"]}
        keyField="slotId"
        handleRowClick={(slotId) => {
          navigate(`view/${slotId}`);
        }}
      />
    </>
  );
}
