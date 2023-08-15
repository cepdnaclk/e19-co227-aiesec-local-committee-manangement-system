import React, { useState, useContext, useEffect } from "react";
import axios from "../../api/axios";
import { UserContext } from "../../context/UserContext";

import { TextField, Typography, Grid, Button } from "@mui/material";

const LOG_URL = "/application/log/";

const InterviewLog = ({ disabled, appId, setSnackbarState, ...rest }) => {
  // TODO: Handle adding token to request globally
  const { token } = useContext(UserContext);
  const [isLoading, setLoading] = useState(false);

  const [log, setLog] = useState([]);
  const loadData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(LOG_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        params: {
          appId: appId,
        },
      });
      console.log("Interview Log Received: ", response.data);
      setLog(response.data);
    } catch (err) {
      // TODO: Better error handling
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.put(LOG_URL, log, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        params: {
          appId: appId,
        },
      });
      console.log(response);
      setSnackbarState({
        open: true,
        message: "Interview Log Updated Successfully!",
        severity: "success",
      });
    } catch (err) {
      // TODO: Better error handling
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <Grid container spacing={2}>
      {log
        ? log.map((item, i) => {
            return (
              <>
                <Grid item xs={5} key={item.questionId}>
                  <Typography variant="p" component="p">
                    {item.question}
                  </Typography>
                </Grid>
                <Grid item xs={7} key={i}>
                  <TextField
                    value={item.answer || ""}
                    size="small"
                    fullWidth
                    disabled={disabled}
                    onChange={(e) => {
                      setLog(
                        [...log].map((object) => {
                          if (object.questionId === item.questionId) {
                            return {
                              ...object,
                              answer: e.target.value,
                            };
                          } else return object;
                        })
                      );
                    }}
                  />
                </Grid>
              </>
            );
          })
        : null}
      <Grid item xs={12} textAlign="right">
        <Button
          disabled={disabled || isLoading}
          onClick={() => {
            handleSubmit();
          }}
        >
          Submit
        </Button>
      </Grid>
    </Grid>
  );
};

export default InterviewLog;
