import React, { useContext } from "react";
import EventSlider from "../../components/EventSlider";
// import UpcomingInterviewList from "../../components/UpcomingInterviewList";

import Grid from "@mui/material/Grid";
import { UserContext } from "../../context/UserContext";

const Home = () => {
  const { user } = useContext(UserContext);

  return <div></div>;

  // return user ? (
  //   <>
  //     <Grid container spacing={2}>
  //       <Grid item xs={6}>
  //         <EventSlider />
  //       </Grid>
  //       <Grid item xs={6}>
  //         <UpcomingInterviewList />
  //       </Grid>
  //     </Grid>
  //   </>
  // ) : (
  //   <>Please Login</>
  // );
};

export default Home;
