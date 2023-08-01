import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Outlet, Navigate } from "react-router-dom";

const AdminRoutes = () => {
  const { user } = useContext(UserContext);

  return user?.role === "admin" ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoutes;
