import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Outlet, Navigate } from "react-router-dom";

const OGTRoutes: React.FC = () => {
  const { user } = useContext(UserContext);

  return user.frontOfficeId === "oGT" ? <Outlet /> : <Navigate to="/login" />;
};

export default OGTRoutes;
