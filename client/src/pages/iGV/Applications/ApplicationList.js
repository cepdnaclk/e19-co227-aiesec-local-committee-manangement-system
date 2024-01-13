import React, { useState, useContext } from "react";
import { useQuery } from "../../../api/reactQuery";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/UserContext";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import SearchBar from "../../../components/SearchBar";
import Table from "../../../components/Table";
import Loading from "../../Loading";
import ErrorPage from "../../ErrorPage";
import FilterTagBar from "../../../components/FilterTagBar";
const Applications = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const isAdmin = Boolean(user.roleId === "LCP" || user.roleId === "LCVP");
  const [filteredData, setFilteredData] = useState();
  const [groupedData, setGroupedData] = useState();

  const url = isAdmin
    ? `/igv/applications/all/admin`
    : `/igv/applications/all/${user.id}`;
  const applicationList = useQuery({ key: ["igv-application-list"], url });
  if (applicationList.isLoading) return <Loading />;
  if (applicationList.isError)
    return <ErrorPage error={applicationList.error} />;

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <SearchBar
          initialData={applicationList.data}
          setFilteredData={setFilteredData}
          searchProp="epName"
          sx={{ flexGrow: 1 }}
        />
        <IconButton
          onClick={() => {
            applicationList.refetch();
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
      <Box sx={{ p: 1, mt: 1, overflow: "scroll" }}>
        <FilterTagBar
          initialData={filteredData}
          setGroupedData={setGroupedData}
          searchProp="appStatus"
          tags={[
            "Open",
            "Withdrawn",
            "Rejected",
            "ABH",
            "Accepted",
            "Approved",
          ]}
        />
      </Box>
      <Table
        rows={groupedData}
        fields={[
          "appStatus",
          "epName",
          "inChargeMember",
          "projectName",
          "slotName",
        ]}
        headers={[
          "Status",
          "EP Name",
          "In Charge Member",
          "Project Name",
          "Slot Name",
        ]}
        keyField="appId"
        handleRowClick={(appId) => {
          navigate(`view/${appId}/application`);
        }}
      />
    </>
  );
};

export default Applications;
