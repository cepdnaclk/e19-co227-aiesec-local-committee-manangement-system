import React, { useState, useContext } from "react";
import { useQuery } from "../../../api/reactQuery";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/UserContext";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchBar from "../../../components/SearchBar";
import Table from "../../../components/Table";
import Loading from "../../Loading";
import ErrorPage from "../../ErrorPage";

export default function ProjectList() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const isAdmin = Boolean(user.roleId === "LCP" || user.roleId === "LCVP");
  const [filteredData, setFilteredData] = useState();

  const url = "/igv/projects";
  const projectData = useQuery({ key: ["igv-projects-list"], url });
  if (projectData.isLoading) return <Loading />;
  if (projectData.isError) return <ErrorPage error={projectData.error} />;

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <SearchBar
          initialData={projectData.data}
          setFilteredData={setFilteredData}
          searchProp="projectName"
          sx={{ flexGrow: 1 }}
        />
        <IconButton
          onClick={() => {
            projectData.refetch();
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
        fields={["expaId", "projectName"]}
        headers={["Expa ID", "Project Name"]}
        keyField="expaId"
        handleRowClick={(expaId) => {
          navigate(`view/${expaId}/project`);
        }}
      />
    </>
  );
}
