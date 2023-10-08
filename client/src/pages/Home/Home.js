import React, { useContext } from "react";
import EventSlider from "../../components/EventSlider";
// import UpcomingInterviewList from "../../components/UpcomingInterviewList";

import Grid from "@mui/material/Grid";
import { UserContext } from "../../context/UserContext";
import EventsCarousel from "../CMS/EventsCarousel";
const Home = () => {
  const { user } = useContext(UserContext);

  return <EventsCarousel />;
};

export default Home;
