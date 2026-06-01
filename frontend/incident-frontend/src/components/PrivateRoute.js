import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, role }) => {
  const token = localStorage.getItem("access");
  const userRole = localStorage.getItem("role");

  // ❗ IMPORTANT: wait until auth is ready
  if (!token || !userRole) {
    return <div>Loading...</div>;
  }

  if (role && userRole !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PrivateRoute;