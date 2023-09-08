import React from "react";
import Skeleton from "@mui/material/Skeleton";

const Listing = () => {
  return (
    <>
      <Skeleton animation="wave" variant="text" height="60px" />
      <Skeleton animation="wave" variant="text" height="40px" />
      <Skeleton animation="wave" variant="text" height="30px" />
      <Skeleton animation="wave" variant="text" height="30px" />
      <Skeleton animation="wave" variant="text" height="30px" />
      <Skeleton animation="wave" variant="text" height="30px" />
    </>
  );
};

export default Listing;
