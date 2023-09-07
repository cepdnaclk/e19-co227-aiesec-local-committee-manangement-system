import React from "react";
import MuiTableContainer from "@mui/material/TableContainer";
import MuiTable from "@mui/material/Table";
import MuiTableBody from "@mui/material/TableBody";
import MuiTableHead from "@mui/material/TableHead";
import MuiTableRow from "@mui/material/TableRow";
import MuiTableCell from "@mui/material/TableCell";
import MuiTablePagination from "@mui/base/TablePagination";

const Table = ({ rows, fields, headers, keyField, handleRowClick }) => {
  // create table headers
  const tableHeader = (
    <MuiTableRow>
      {headers.map((header, currIndex, array) => (
        <MuiTableCell key={currIndex}>{header}</MuiTableCell>
      ))}
    </MuiTableRow>
  );

  // table row click handler
  const handleClick = (row) => {
    handleRowClick(row);
  };

  // create table rows
  const tableRows = rows
    ? rows.map((row) => {
        let key = row[keyField];
        return (
          <MuiTableRow key={key} hover onClick={() => handleClick(row)}>
            {fields.map((field, currIndex, array) => (
              <MuiTableCell key={currIndex}>{row[field]}</MuiTableCell>
            ))}
          </MuiTableRow>
        );
      })
    : null;

  return (
    <MuiTableContainer>
      <MuiTable>
        <MuiTableHead>{tableHeader}</MuiTableHead>
        <MuiTableBody>{tableRows}</MuiTableBody>
      </MuiTable>
    </MuiTableContainer>
  );
};

export default Table;
