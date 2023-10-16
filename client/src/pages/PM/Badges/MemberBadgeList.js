import React, { useContext, useState } from "react";
import { UserContext } from "../../../context/UserContext";
import { useQuery } from "../../../api/reactQuery";
import { useQueryClient } from "@tanstack/react-query";
import axios from "../../../api/axios";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Loading from "../../Loading";
import ErrorPage from "../../ErrorPage";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNotify } from "../../../context/NotificationContext";

export default function MemberBadgeList({ memberId }) {
  const { privileges } = useContext(UserContext);
  const { isPMAdmin } = privileges;
  const { notifySuccess, notifyError } = useNotify();
  const [isLoading, setIsLoading] = useState(false);
  // HTTP Utilities
  const queryClient = useQueryClient();
  const badgeList = useQuery({
    key: ["badge-list"],
    url: "/pm/badges",
    enabled: isPMAdmin,
  });
  const achievementList = useQuery({
    key: ["achievement-list", memberId],
    url: `/pm/achievements/${memberId}`,
  });

  if (badgeList.isInitialLoading || achievementList.isLoading)
    return <Loading />;
  if (badgeList.isError || achievementList.isError)
    return <ErrorPage error={badgeList.error || achievementList.error} />;

  // Filter badgeList to find items not in the achievementList
  const unachievedBadges = badgeList.data.filter(
    (badge) => !achievementList.data.some((ach) => ach.id === badge.id)
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <List>
        {achievementList.data.map((achievement) => (
          <ListItem
            key={achievement.id}
            sx={{
              border: "1px solid #ccc", // Rounded border
              borderRadius: "8px", // Rounded border
              marginBottom: "8px", // Spacing between list items
            }}
          >
            <Avatar
              src={
                process.env.REACT_APP_API_SERVER +
                "/images/" +
                achievement.image
              }
              alt={achievement.name}
              sx={{ width: 32, height: 32, mx: 1 }}
            />
            <ListItemText>{achievement.name}</ListItemText>
            {isPMAdmin && (
              <IconButton
                disabled={isLoading}
                onClick={async () => {
                  setIsLoading(true);
                  try {
                    await axios.delete(
                      `/pm/achievements/${memberId}/${achievement.id}`
                    );
                    await queryClient.setQueryData(
                      ["achievement-list", memberId],
                      (old) => {
                        return old.filter((item) => item.id !== achievement.id);
                      }
                    );
                    queryClient.invalidateQueries(["members"]);
                    notifySuccess("Deleted");
                  } catch (err) {
                    notifyError(err.message);
                  }
                  setIsLoading(false);
                }}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </ListItem>
        ))}
      </List>
      {isPMAdmin && (
        <>
          <Divider textAlign="center">
            <Chip label="Pending"></Chip>
          </Divider>
          <List>
            {unachievedBadges.map((badge) => (
              <ListItem
                key={badge.id}
                sx={{
                  border: "1px solid #ccc", // Rounded border
                  borderRadius: "8px", // Rounded border
                  marginBottom: "8px", // Spacing between list items
                }}
              >
                <Avatar
                  src={
                    process.env.REACT_APP_API_SERVER + "/images/" + badge.image
                  }
                  alt={badge.name}
                  sx={{ width: 32, height: 32, mx: 1 }}
                />
                <ListItemText>{badge.name}</ListItemText>
                <IconButton
                  onClick={async () => {
                    setIsLoading(true);
                    try {
                      await axios.post(
                        `/pm/achievements/${memberId}/${badge.id}`
                      );
                      await queryClient.setQueryData(
                        ["achievement-list", memberId],
                        (old) => [...old, badge]
                      );
                      queryClient.invalidateQueries(["members"]);
                      notifySuccess("Added");
                    } catch (err) {
                      notifyError(err.message);
                    }
                    setIsLoading(false);
                  }}
                >
                  <AddIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Box>
  );
}
