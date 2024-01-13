import React, { useState, useContext } from "react";
import { useQuery } from "../../api/reactQuery";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchBar from "../../components/SearchBar";
import Table from "../../components/Table";
import Loading from "../Loading";
import ErrorPage from "../ErrorPage";

export default function EmailList({ officeId }) {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const isAdmin = Boolean(user.roleId === "LCP" || user.roleId === "LCVP");
  const [filteredData, setFilteredData] = useState();

  const url = `/email/template`;
  const emailTemplates = useQuery({
    key: ["email-template-list", officeId],
    url,
    params: { officeId },
  });
  if (emailTemplates.isLoading) return <Loading />;
  if (emailTemplates.isError) return <ErrorPage error={emailTemplates.error} />;

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <SearchBar
          initialData={emailTemplates.data}
          setFilteredData={setFilteredData}
          searchProp="projectName"
          sx={{ flexGrow: 1 }}
        />
        <IconButton
          onClick={() => {
            emailTemplates.refetch();
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
        fields={["name"]}
        headers={["Name"]}
        keyField="id"
        handleRowClick={(id) => {
          navigate(`view/${id}`);
        }}
      />
    </>
  );
}
