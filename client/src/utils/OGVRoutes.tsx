import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Outlet, Navigate } from "react-router-dom";

const OGVRoutes: React.FC = () => {
  const { user } = useContext(UserContext);

  return user?.frontOfficeId === "oGV" ? <Outlet /> : <Navigate to="/login" />;
};

export default OGVRoutes;
