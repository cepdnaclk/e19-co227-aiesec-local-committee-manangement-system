import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Outlet, Navigate } from "react-router-dom";

const AdminRoutes = () => {
  const { user } = useContext(UserContext);

  // 0 - LCP
  // 1 - LCVP
  console.log(user.roleId);
  return user?.roleId === 0 || user?.roleId === 1 ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
};

export default AdminRoutes;
