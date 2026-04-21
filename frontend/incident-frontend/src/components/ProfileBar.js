import React, { useEffect, useState, useContext } from "react";
import { Dropdown, Image, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import api from "../api/axios";
import { getImageUrl } from "../utils/image";

const ProfileBar = () => {
  const { user, setUser } = useContext(UserContext);
  const token = localStorage.getItem("access");

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  


  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    fetchUser();
    // eslint-disable-next-line
  }, []);

  const fetchUser = async () => {
  try {
    const res = await api.get("/profile/");
    setUser(res.data);
    setLoading(false);
  } catch (err) {
    handleLogout();
  }
};


  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/login");
  };

  if (loading)
    return <Spinner animation="border" size="sm" className="me-2" />;

  return (
  <Dropdown align="end">

    {/* TOGGLE */}
    <Dropdown.Toggle
      variant="light"
      className="d-flex align-items-center"
      style={{
        border: "1px solid #e9ecef",
        borderRadius: "50px",
        padding: "6px 12px",
        background: "#fff",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
      }}
    >
      {getImageUrl(user?.profile_image) ? (
        <Image
      
          src={getImageUrl(user?.profile_image)}


          roundedCircle
          style={{
            width: 36,
            height: 36,
            objectFit: "cover",
            border: "2px solid #f1f1f1"
          }}
          className="me-2"
        />
      ) : (
        <div
          className="me-2"
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "#0d6efd",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "600"
          }}
        >
          {user?.username?.charAt(0).toUpperCase()}
        </div>
      )}

      <div style={{ lineHeight: "1.1" }}>
        <div style={{ fontWeight: "600", fontSize: "13px" }}>
          {user?.username}
        </div>
        <div style={{ fontSize: "11px", color: "#6c757d" }}>
          {user?.role || "Member"}
        </div>
      </div>
    </Dropdown.Toggle>

    {/* DROPDOWN */}
    <Dropdown.Menu
      style={{
        width: "260px",
        borderRadius: "12px",
        border: "none",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        padding: "10px"
      }}
    >

      {/* HEADER */}
      <div style={{ padding: "8px 10px" }}>
        <div style={{ fontWeight: "700" }}>
          {user?.username}
        </div>
        <div style={{ fontSize: "12px", color: "#6c757d" }}>
          {user?.email}
        </div>
      </div>

      <hr style={{ margin: "8px 0" }} />

      {/* PROFILE ACTION */}
      <Dropdown.Item
        onClick={() => navigate("/profile")}
        style={{
          borderRadius: "8px",
          padding: "8px 10px"
        }}
      >
        👤 View Profile
      </Dropdown.Item>

      {/* LOGOUT */}
      <Dropdown.Item
        onClick={handleLogout}
        style={{
          borderRadius: "8px",
          padding: "8px 10px",
          color: "#dc3545",
          fontWeight: "500"
        }}
      >
        🚪 Logout
      </Dropdown.Item>

    </Dropdown.Menu>

  </Dropdown>
);

};

export default ProfileBar;
