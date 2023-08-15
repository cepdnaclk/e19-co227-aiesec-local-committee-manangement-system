import React from "react";
import EventSlider from "../../components/EventSlider";
import UpcomingInterviewList from "../../components/UpcomingInterviewList";

import { Grid } from "@mui/material";

const Home = () => {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <EventSlider />
        </Grid>
        <Grid item xs={12}>
          <UpcomingInterviewList />
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
