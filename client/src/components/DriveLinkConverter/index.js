import React, { useState, useEffect } from "react";
import Box from "@mui/system/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
const DriveLinkConverter = () => {
  const [value, setValue] = useState("");
  const [convertedValue, setConvertedValue] = useState("");
  useEffect(() => {
    try {
      setConvertedValue(
        value
          .replace(/file\/d\//g, "uc?id=")
          .replace(/\/([^/]+)$/, "&export=download")
      );
    } catch (e) {
      setConvertedValue("Invalid");
    }
  }, [value]);
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Typography variant="p">Insert Drive Link: </Typography>
      <TextField
        value={value}
        onChange={(e) => setValue(e.target.value)}
        variant="outlined"
        fullWidth
        size="small"
        sx={{ flexGrow: 1 }}
      />
      <Typography variant="p">Converted Link: </Typography>
      <Box sx={{ display: "flex" }}>
        <TextField
          value={convertedValue}
          variant="outlined"
          fullWidth
          size="small"
          disabled
          sx={{ flexGrow: 1 }}
        />
        <IconButton
          onClick={() => {
            navigator.clipboard.writeText(convertedValue);
          }}
        >
          <ContentPasteIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default DriveLinkConverter;
