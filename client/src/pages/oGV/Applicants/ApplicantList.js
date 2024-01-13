import React, { useState, useContext } from "react";
import { useQuery } from "../../../api/reactQuery";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/UserContext";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import FilterTagBar from "../../../components/FilterTagBar";
import Loading from "../../Loading";
import ErrorPage from "../../ErrorPage";
import SearchBar from "../../../components/SearchBar";
import Table from "../../../components/Table";

export default function Applicants() {
  const navigate = useNavigate();
  const { user, privileges } = useContext(UserContext);
  const { isOGVAdmin } = privileges;

  const url = isOGVAdmin
    ? `/ogv/applicants/all/admin`
    : `/ogv/applicants/all/${user.id}`;
  const applicantList = useQuery({ key: ["ogv-applicant-list"], url });

  const [filteredData, setFilteredData] = useState();
  const [groupedData, setGroupedData] = useState();

  if (applicantList.isLoading || applicantList.isFetching) return <Loading />;

  if (applicantList.isError) return <ErrorPage error={applicantList.error} />;

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
            navigate("new");
          }}
          disabled={!isOGVAdmin}
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
        handleRowClick={(id) => {
          navigate(`view/${id}/applicant`);
        }}
      />
    </>
  );
}
