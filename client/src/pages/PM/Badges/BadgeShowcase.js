import React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";

export default function BadgeShowcase({ badgeList }) {
  if (
    !badgeList ||
    // NOTE: MYSQL JSONARRAYS send array of the form [null] if there is no data instead
    // of an empty array []
    (badgeList.length === 1 && badgeList[0] === null)
  )
    return null;

  // TODO: A large number of badges will cause overflow and extra badges will not be displayed properly
  // Create a scrollable showcase feature or limit the number of badges which can be shown
  return (
    <>
      <Box
        sx={{ mt: 1, display: "flex", overflow: "hidden", overflowY: "scroll" }}
      >
        {badgeList.map((badge) => (
          <Avatar
            src={process.env.REACT_APP_API_SERVER + "/images/" + badge}
            sx={{ width: 24, height: 24 }}
          />
        ))}
      </Box>
    </>
  );
}
