import React, { useMemo, useState } from "react";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TablePagination from "@mui/base/TablePagination";
import Skeleton from "@mui/material/Skeleton";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { TableContainer } from "@mui/material";

function Listing(props) {
  const { initialRows, fields, keyField, isLoading, handleRowClick } = props;

  const [searchText, setSearchText] = useState("");

  // update rows with search text
  const rows = useMemo(() => {
    if (searchText !== "") {
      let newRows = [];
      initialRows?.forEach((row) => {
        if (row[props.searchField].toLowerCase().includes(searchText))
          newRows.push(row);
      });

      return newRows;
    }
    // TODO: figure out why initialRows becomes null at times
    // FIX: for now an empty array is passed if initialRows is falsy
    return initialRows || [];
  }, [searchText, initialRows]);

  // render skeleton table while loading
  if (isLoading) {
    return (
      <>
        <Skeleton animation="wave" variant="text" height="80px" />
        <Skeleton animation="wave" variant="text" height="40px" />
        <Skeleton animation="wave" variant="text" height="40px" />
        <Skeleton animation="wave" variant="text" height="40px" />
      </>
    );
  }

  // render error alert if loading fails
  if (!initialRows && !isLoading) {
    return <Alert severity="error">Something went wrong!</Alert>;
  }

  // convert fields (camelCase) to headers (Proper Case)
  const headers = fields.map((field) =>
    field.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
      return str.toUpperCase();
    })
  );

  // create table headers
  const tableHeader = (
    <TableRow>
      {headers.map((header, currIndex, array) => (
        <TableCell key={currIndex}>{header}</TableCell>
      ))}
    </TableRow>
  );

  // table row click handler
  const handleClick = (key) => {
    handleRowClick(key);
  };

  // create table rows
  const tableRows = rows
    ? rows.map((row) => {
        let key = row[keyField];
        return (
          <TableRow key={key} hover onClick={() => handleClick(key)}>
            {fields.map((field, currIndex, array) => (
              <TableCell key={currIndex}>{row[field]}</TableCell>
            ))}
          </TableRow>
        );
      })
    : null;

  // handle search bar text value change
  const handleChange = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer>
        <TextField
          variant="outlined"
          size="small"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          onChange={handleChange}
        />
        <Table>
          <TableHead>{tableHeader}</TableHead>
          <TableBody>{tableRows}</TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default Listing;
