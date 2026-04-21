import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, role }) => {
  const token = localStorage.getItem("access");
  const userRole = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (role && role !== userRole) {
    // Redirect based on role
    if (userRole === "admin") return <Navigate to="/admin" />;
    if (userRole === "department") return <Navigate to="/department" />;
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default PrivateRoute;
