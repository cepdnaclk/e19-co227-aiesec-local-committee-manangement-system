import React, { useEffect, useState } from "react";

import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

const SearchBar = ({
  initialData,
  setFilteredData,
  searchProp,
  size,
  ...rest
}) => {
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (searchText && initialData) {
      const filteredData = [];
      initialData?.forEach((data) => {
        if (data[searchProp].toLowerCase().includes(searchText.toLowerCase()))
          filteredData.push(data);
      });
      setFilteredData(filteredData);
    } else {
      setFilteredData(initialData);
    }
  }, [searchText, initialData, searchProp]);

  return (
    <TextField
      placeholder="Search"
      aria-label="Search Input"
      value={searchText}
      onChange={(e) => {
        setSearchText(e.target.value);
      }}
      size={size || "small"}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <IconButton disabled={true} edge="start">
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="Clear"
              onClick={() => {
                setSearchText("");
              }}
              disabled={!searchText}
              edge="end"
            >
              <CloseIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...rest}
    />
  );
};

export default SearchBar;
