import React from "react";

import {
  Avatar,
  Grid,
  Card,
  CardHeader,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";

const MemberCard = (props) => {
  const { member, onClick } = props;

  const subheader = `${member.frontOfficeAbbreviation} | ${member.departmentAbbreviation} | ${member.roleAbbreviation}`;

  return (
    <Grid item xs={6} sm={5} md={4} lg={3}>
      <Card onClick={() => onClick(member.id)}>
        <CardActionArea>
          <CardHeader
            avatar={
              <Avatar
                // replace the drive link with a downloadable link
                src={member.photoLink
                  .replace(/file\/d\//g, "uc?id=")
                  .replace(/\/([^/]+)$/, "&export=download")}
                alt={member.preferredName}
                sx={{ width: 100, height: 100 }}
              />
            }
            title={member.preferredName}
            subheader={subheader}
          />
          <CardContent>
            <Typography variant="body2" color="textSecondary">
              {member.aiesecEmail}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
};

export default MemberCard;
