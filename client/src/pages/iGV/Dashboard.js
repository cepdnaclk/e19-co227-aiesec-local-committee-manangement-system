import React, { useContext } from "react";
import { useQuery } from "../../api/reactQuery";
import { UserContext } from "../../context/UserContext";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Loading from "../Loading";
import ErrorPage from "../ErrorPage";

export default function Dashboard() {
  const { user } = useContext(UserContext);

  const url = `/igv/interviews/upcoming/${user.id}`;
  const interviewList = useQuery({ key: ["igv-upcoming-interviews"], url });

  if (interviewList.isLoading) return <Loading />;
  if (interviewList.isError) return <ErrorPage error={interviewList.error} />;

  return (
    <>
      <Paper
        sx={{
          maxHeight: "80vh",
          overflow: "auto",
          padding: 3,
          background: `linear-gradient(to bottom, #037Ef3BB, #00000000)`,
        }}
        variant="outlined"
      >
        <Typography variant="h6" component="p">
          You Have {interviewList.data.length} Upcoming Interviews
        </Typography>
        {interviewList.data ? (
          <List>
            {interviewList.data.map((interview, i) => {
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
}
