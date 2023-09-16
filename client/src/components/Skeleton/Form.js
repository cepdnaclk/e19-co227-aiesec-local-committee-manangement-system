import React from "react";
import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

const Form = () => {
  return (
    <>
      <Skeleton animation="wave" variant="text" height="50px" />
      <Skeleton animation="wave" variant="text" height="50px" />
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Skeleton animation="wave" variant="text" height="50px" />
        </Grid>
        <Grid item xs={6}>
          <Skeleton animation="wave" variant="text" height="50px" />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Skeleton animation="wave" variant="text" height="50px" />
        </Grid>
        <Grid item xs={4}>
          <Skeleton animation="wave" variant="text" height="50px" />
        </Grid>
        <Grid item xs={4}>
          <Skeleton animation="wave" variant="text" height="50px" />
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Skeleton animation="wave" variant="text" width="80px" height="50px" />
      </Box>
    </>
  );
};

export default Form;
