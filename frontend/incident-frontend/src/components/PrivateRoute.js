import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, role }) => {
  const token = localStorage.getItem("access");
  const userRole = localStorage.getItem("role");

  console.log("🛡️ PrivateRoute CHECK:");
  console.log("➡️ Required role:", role);
  console.log("➡️ Token exists:", !!token);
  console.log("➡️ Stored role:", userRole);
  console.log("➡️ Current path:", window.location.pathname);

  if (!token) {
    console.log("❌ No token → redirect to login");
    return <Navigate to="/login" replace />;
  }

  if (role && userRole !== role) {
    console.log("❌ Role mismatch → redirect to dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  console.log("✅ Access granted");
  return children;
};

export default PrivateRoute;