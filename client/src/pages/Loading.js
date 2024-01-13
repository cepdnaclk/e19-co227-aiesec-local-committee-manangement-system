import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function Loading() {
  return (
    <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
      <CircularProgress data-testid="loading" />
    </Box>
  );
}
