import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Outlet, Navigate } from "react-router-dom";

const IGVRoutes: React.FC = () => {
  const { user } = useContext(UserContext);

  return user?.frontOfficeId === "iGT" ? <Outlet /> : <Navigate to="/login" />;
};

export default IGVRoutes;
