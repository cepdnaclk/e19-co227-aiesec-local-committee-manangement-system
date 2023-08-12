import React from "react";

import { Grid, Card, CardHeader, CardContent, Skeleton } from "@mui/material";

const MemberCardSkeleton = () => {
  return (
    <Grid item xs={6} sm={5} md={4} lg={3}>
      <Card>
        <CardHeader
          // TODO: circle prop doesn't work on the avatar skeleton
          avatar={<Skeleton variant="circle" width={100} height={100} />}
          title={<Skeleton />}
          subheader={<Skeleton />}
        />
        <CardContent>
          <Skeleton />
        </CardContent>
      </Card>
    </Grid>
  );
};

export default MemberCardSkeleton;
