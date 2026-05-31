import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, role }) => {
  const token = localStorage.getItem("access");
  const userRole = localStorage.getItem("role");

  // 🔥 SAFE: no instant redirect glitch
  if (token === null) {
    return <div>Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role && role !== userRole) {
    if (userRole === "admin") return <Navigate to="/admin" replace />;
    if (userRole === "department") return <Navigate to="/department" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PrivateRoute;