import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Outlet, Navigate } from "react-router-dom";

const AdminRoutes: React.FC = () => {
  const { user } = useContext(UserContext);

  return user?.roleId === "LCP" || user?.roleId === "VP" ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
};

export default AdminRoutes;
