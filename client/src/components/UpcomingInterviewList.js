import React, { useState, useContext, useEffect } from "react";
import axios from "./../api/axios";
import { UserContext } from "./../context/UserContext";

import {
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  Skeleton,
} from "@mui/material";

const INTERVIEWS_URL = "/application/upcoming/";

const UpcomingInterviewList = () => {
  // TODO: Handle adding token to request globally
  const { token, user } = useContext(UserContext);

  const [isLoading, setLoading] = useState(false);

  const [interviews, setInterviews] = useState([]);

  const loadInterviews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(INTERVIEWS_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        params: {
          id: user.id,
        },
      });
      console.log("Payload received: ", response.data);
      setInterviews(response.data);
    } catch (err) {
      // TODO: Better error handling
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadInterviews();
  }, []);

  useEffect(() => {
    loadInterviews();
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

  return (
    <>
      <Paper
        sx={{
          maxHeight: 500,
          overflow: "auto",
          padding: 3,
          background: `linear-gradient(to bottom, #037Ef3BB, #00000000)`,
        }}
        variant="outlined"
      >
        <Typography variant="h6" component="p">
          You Have {interviews.length} Upcoming Interviews
        </Typography>
        {interviews ? (
          <List>
            {interviews.map((interview, i) => {
              return (
                <ListItem key={i}>
                  <ListItemText>
                    {interview.epName} on {interview.interviewDate} at{" "}
                    {interview.interviewTime}
                  </ListItemText>
                </ListItem>
              );
            })}
          </List>
        ) : null}
      </Paper>
    </>
  );
};

export default UpcomingInterviewList;
