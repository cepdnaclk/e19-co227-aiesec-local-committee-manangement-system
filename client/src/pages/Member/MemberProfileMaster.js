import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import MemberProfile from "./MemberProfile";
import MemberBadgeList from "../PM/Badges/MemberBadgeList";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function MemberProfileMaster(props) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="member-profile-tabs"
        >
          <Tab label="Details" />
          <Tab label="Achievements" />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <MemberProfile {...props} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <MemberBadgeList memberId={props.focusItemId} />
      </CustomTabPanel>
    </Box>
  );
}
