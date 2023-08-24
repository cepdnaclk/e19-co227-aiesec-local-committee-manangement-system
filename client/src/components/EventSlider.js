import React, { useState, useContext, useEffect } from "react";
import axios from "./../api/axios";
import { UserContext } from "./../context/UserContext";

import {
  Skeleton,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";

import eventSlider from "../styles/eventSlider.css";
// SELECT title, post_link, event_date FROM lc_event

const EVENTS_URL = "/event/";

const EventSlider = () => {
  // TODO: Handle adding token to request globally
  const { token } = useContext(UserContext);

  const [isLoading, setLoading] = useState(false);

  const [events, setEvents] = useState([]);

  const [currIndex, setCurrentIndex] = useState(0);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(EVENTS_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      console.log("Payload received: ", response.data);
      setEvents(response.data);
    } catch (err) {
      // TODO: Better error handling
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  if (isLoading) {
    return (
      <>
        <Skeleton animation="wave" variant="text" height="80px" />
        <Skeleton animation="wave" variant="text" height="50px" />
        <Skeleton animation="wave" variant="text" height="50px" />
        <Skeleton animation="wave" variant="text" height="50px" />
      </>
    );
  }

  // TODO: dynamic background gradient depending on the image
  return (
    <>
      {/* <Color
        src="url"
      >
        {({ data, loading, error }) => ( */}
      <Paper
        sx={{
          // background: `linear-gradient(to right, #CACCD1, #52565E)`
          maxHeight: "80vh",
          overflow: "auto",
          padding: 2,
        }}
        variant="outlined"
      >
        {/* <Grid item xs={6} textAlign="center">
          <Box
            component="img"
            alt="poster"
            sx={{
              width: "450px",
              // height: "auto",
              objectFit: "fill",
            }}
            // replace the drive link with a downloadable link
            src={events[0]?.postLink
              .replace(/file\/d\//g, "uc?id=")
              .replace(/\/([^/]+)$/, "&export=download")}
          />
        </Grid>
        <Grid item xs={6} textAlign="center" justifyContent="center">
          <Typography variant="h6">{events[0].title}</Typography>
          <Typography variant="h6">{events[0].event_date}</Typography>
        </Grid> */}
        {events ? (
          <Grid container spacing={2}>
            {events.map((event, i) => {
              return (
                <Grid item xs={12}>
                  <Card key={i}>
                    <CardMedia
                    // component="img"
                    // sx={{
                    //   height: 300,
                    //   display: "block",
                    //   marginLeft: "auto",
                    //   marginRight: "auto",
                    // }}
                    // src={event.postLink
                    //   .replace(/file\/d\//g, "uc?id=")
                    //   .replace(/\/([^/]+)$/, "&export=download")}
                    // alt="poster"
                    >
                      <div className="img-container">
                        <img
                          className="img"
                          src={event.postLink
                            .replace(/file\/d\//g, "uc?id=")
                            .replace(/\/([^/]+)$/, "&export=download")}
                          alt="poster"
                        ></img>
                        <img
                          className="img-bg"
                          src={event.postLink
                            .replace(/file\/d\//g, "uc?id=")
                            .replace(/\/([^/]+)$/, "&export=download")}
                          alt="backdrop"
                        ></img>
                      </div>
                    </CardMedia>
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="div">
                        {event.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {event.eventDate} : {event.eventDescription}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        ) : null}
      </Paper>
      {/* )}
      </Color> */}
    </>
  );
};

export default EventSlider;
