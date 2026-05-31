import React, { useContext, useEffect, useState } from "react";
import { Navbar, Nav, Button, Container, Dropdown, Badge, Spinner } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ProfileBar from "./ProfileBar";
import { UserContext } from "../UserContext";
import axios from "axios";

import "./NavigationBar.css";
import { FaShieldAlt } from "react-icons/fa";

const NavigationBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(UserContext);
  const token = localStorage.getItem("access");

  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (token) fetchNotifications();
    const interval = setInterval(() => {
      if (token) fetchNotifications();
    }, 15000);
    return () => clearInterval(interval);
  }, [token]);

  const fetchNotifications = async () => {
    setLoadingNotifications(true);
    try {
      const res = await axios.get(
  "https://incident-reporting-rjwi.onrender.com/api/notifications/",
  {
    headers: { Authorization: `Bearer ${token}` },
  }
);

      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.post(
  "https://incident-reporting-rjwi.onrender.com/api/notifications/mark_read/",
  { notification_id: id },
  { headers: { Authorization: `Bearer ${token}` } }
);

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;


  const isActive = (path) => location.pathname === path;

 return (
  <Navbar
  fixed="top"
  expand="lg"
  className="premium-navbar"
>
    <Container fluid>

      {/* BRAND */}
      <Navbar.Brand
  as={Link}
  to="/"
  className="navbar-brand-custom d-flex align-items-center"
>
  <div className="brand-icon">
    <FaShieldAlt />
  </div>

  <div className="brand-text">
    <div className="brand-title">
      Incident Platform
    </div>

    <div className="brand-subtitle">
      Smart Incident Management
    </div>
  </div>
</Navbar.Brand>

      <Navbar.Toggle />

      <Navbar.Collapse className="pt-3 pt-lg-0">

        {/* LEFT NAV */}
        <Nav
  className="me-auto ms-lg-4 mt-2 mt-lg-0 flex-column flex-lg-row"
  style={{ gap: "10px" }}
>
          {token && (
            <>
              {[
  { path: "/dashboard", label: "Dashboard" },
  { path: "/analytics", label: "Analytics" },
  { path: "/report", label: "Report Incident" },
  { path: "/map", label: "City Map" },
].map((item) => (
  <Nav.Link
    key={item.path}
    as={Link}
    to={item.path}
    className={
      isActive(item.path)
        ? "nav-link-custom nav-link-active"
        : "nav-link-custom"
    }
  >
    {item.label}
  </Nav.Link>
))}

              {user?.role === "admin" && (
                <Nav.Link
  as={Link}
  to="/admin"
  className={
    isActive("/admin")
      ? "nav-link-custom nav-link-active"
      : "nav-link-custom"
  }
>
  Admin Panel
</Nav.Link>
              )}
                {user?.role === "department" && (
      <Nav.Link
  as={Link}
  to="/department"
  className={
    isActive("/department")
      ? "nav-link-custom nav-link-active"
      : "nav-link-custom"
  }
>
  Department Dashboard
</Nav.Link>
    )}
            </>
          )}
          {!token && (
  <>
    <Nav.Link
  as={Link}
  to="/"
  className={
    isActive("/")
      ? "nav-link-custom nav-link-active"
      : "nav-link-custom"
  }
>
  Home
</Nav.Link>

    <Nav.Link
  as={Link}
  to="/about"
  className={
    isActive("/about")
      ? "nav-link-custom nav-link-active"
      : "nav-link-custom"
  }
>
  About
</Nav.Link>

    <Nav.Link
  as={Link}
  to="/contact"
  className={
    isActive("/contact")
      ? "nav-link-custom nav-link-active"
      : "nav-link-custom"
  }
>
  Contact
    </Nav.Link>
  </>
)}
        </Nav>

        {/* RIGHT SIDE */}
        <Nav className="ms-auto mt-3 mt-lg-0 d-flex flex-row flex-lg-row align-items-center flex-wrap" style={{ gap: "10px" }}>

          {token ? (
            <>
              {/* DARK MODE */}
              <Button
  className="nav-icon-btn"
  onClick={() => setDarkMode(!darkMode)}
>
  {darkMode ? "☀️" : "🌙"}
</Button>

              {/* NOTIFICATIONS */}
              <Dropdown align="end">
                <Dropdown.Toggle
                  className="nav-icon-btn"
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    border: "1px solid #eee",
                    position: "relative"
                  }}
                >
                  🔔
                  {unreadCount > 0 && (
                    <Badge
                      bg="danger"
                      pill
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        fontSize: "0.6rem"
                      }}
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Dropdown.Toggle>

                <Dropdown.Menu
                  style={{
                    width: "min(340px, 95vw)",
                    maxHeight: "420px",
                    overflowY: "auto",
                    borderRadius: "12px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
                  }}
                >
                  <Dropdown.Header style={{ fontWeight: "700" }}>
                    Notifications
                  </Dropdown.Header>

                  {loadingNotifications && (
                    <div className="text-center p-2">
                      <Spinner size="sm" />
                    </div>
                  )}

                  {!loadingNotifications && notifications.length === 0 && (
                    <div className="px-3 py-2 text-muted">
                      No notifications
                    </div>
                  )}

                  {!loadingNotifications &&
                    notifications.map((n) => (
                      <Dropdown.Item
                        key={n.id}
                        style={{
                          fontWeight: n.is_read ? "400" : "600",
                          whiteSpace: "normal",
                          padding: "10px",
                          borderBottom: "1px solid #f1f1f1"
                        }}
                      >
                        {n.message}

                        {!n.is_read && (
                          <span
                            onClick={() => markAsRead(n.id)}
                            style={{
                              float: "right",
                              cursor: "pointer"
                            }}
                          >
                            👁️
                          </span>
                        )}
                      </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
              </Dropdown>

              <ProfileBar />

              
            </>
          ) : (
            <>
              <Button
  as={Link}
  to="/login"
  className="login-btn"
>
                Login
              </Button>
              <Button as={Link} to="/signup" className="signup-btn">
                Sign Up
              </Button>
            </>
          )}
        </Nav>

      </Navbar.Collapse>
    </Container>
  </Navbar>
  );
};

export default NavigationBar;
