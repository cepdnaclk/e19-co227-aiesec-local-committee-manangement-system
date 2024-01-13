import React, { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../../../context/UserContext";
import { useQuery, usePutMutation } from "../../../api/reactQuery";
import { useParams } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Loading from "../../Loading";
import ErrorPage from "../../ErrorPage";
import { useNotify } from "../../../context/NotificationContext";

const InterviewLog = () => {
  const { user } = useContext(UserContext);
  const { notifySuccess, notifyError } = useNotify();
  const { appId } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const selectedApplication = useQuery({
    key: ["igv-selected-application", appId],
    url: `/igv/applications/item/${appId}`,
  });

  const isAdmin =
    user.roleId === "LCP" ||
    user.roleId === "LCVP" ||
    user.id === selectedApplication?.memberId;
  const fieldProps = { disabled: !isAdmin || isLoading };

  const url = `/igv/applications/log/${appId}`;
  const [log, setLog] = useState([]);
  // const logRef = useRef([]);
  const interviewLog = useQuery({
    key: ["igv-selected-interview-log", appId],
    url,
  });
  useEffect(() => {
    setLog(interviewLog.data);
    // if (interviewLog.data) logRef.current = interviewLog.data;
  }, [interviewLog.data]);

  const updateInterviewLog = usePutMutation({
    url,
    updateQueryKey: ["igv-selected-interview-log"],
  });

  if (interviewLog.isLoading || selectedApplication.isLoading)
    return <Loading />;
  if (interviewLog.isError || selectedApplication.isError)
    return (
      <ErrorPage error={interviewLog.error || selectedApplication.error} />
    );

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
                    value={
                      // log.find((obj) => obj.questionId === item.questionId)
                      //   ?.answer || ""
                      // logRef.current.find(
                      //   (obj) => obj.questionId === item.questionId
                      // )?.answer || ""
                      item.answer || []
                    }
                    size="small"
                    fullWidth
                    {...fieldProps}
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
                      // const updatedLog = [...log].map((object) => {
                      //   if (object.questionId === item.questionId) {
                      //     return {
                      //       ...object,
                      //       answer: e.target.value,
                      //     };
                      //   } else return object;
                      // });
                      // setLog(updatedLog);
                      // const updatedLog = logRef.current.map((object) => {
                      //   if (object.questionId === item.questionId) {
                      //     return {
                      //       ...object,
                      //       answer: e.target.value,
                      //     };
                      //   }
                      //   return object;
                      // });
                      // logRef.current = updatedLog;
                    }}
                  />
                </Grid>
              </>
            );
          })
        : null}
      <Grid item xs={12} textAlign="right">
        <Button
          variant="contained"
          sx={{ m: 2 }}
          {...fieldProps}
          onClick={() => {
            setIsLoading(true);
            updateInterviewLog.mutate(log, {
              onSuccess: () => {
                interviewLog.refetch();
                notifySuccess("Updated");
                setIsLoading(false);
              },
              onError: (err) => {
                notifyError(err?.data?.response);
                setIsLoading(false);
              },
            });
          }}
        >
          Submit
        </Button>
      </Grid>
    </Grid>
  );
};

export default InterviewLog;
