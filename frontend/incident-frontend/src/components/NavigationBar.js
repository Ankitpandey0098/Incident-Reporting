import React, { useContext, useEffect, useState } from "react";
import { Navbar, Nav, Button, Container, Dropdown, Badge, Spinner } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ProfileBar from "./ProfileBar";
import { UserContext } from "../UserContext";
import axios from "axios";
import api from "../api/axios";
const NavigationBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(UserContext);
  const token = localStorage.getItem("access");

  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [hoveredNotification, setHoveredNotification] = useState(null);

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

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

 return (
  <Navbar
    fixed="top"
    expand="lg"
    style={{
      background: "rgba(255,255,255,0.75)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(0,0,0,0.05)",
      boxShadow: "0 2px 20px rgba(0,0,0,0.06)"
    }}
  >
    <Container fluid>

      {/* BRAND */}
      <Navbar.Brand
        as={Link}
        to="/"
        style={{
          fontWeight: "800",
          letterSpacing: "0.5px",
          color: "#0d6efd"
        }}
      >
        🚨 Incident Platform
      </Navbar.Brand>

      <Navbar.Toggle />

      <Navbar.Collapse className="pt-3 pt-lg-0">

        {/* LEFT NAV */}
        <Nav className="me-auto ms-lg-3 mt-2 mt-lg-0 flex-column flex-lg-row" style={{ gap: "6px" }}>
          {token && (
            <>
              {[
                { path: "/dashboard", label: "Dashboard" },
                { path: "/analytics", label: "Analytics" },
                { path: "/report", label: "Report" },
                { path: "/map", label: "City Map" }
              ].map((item) => (
                <Nav.Link
                  key={item.path}
                  as={Link}
                  to={item.path}
                  style={{
                    borderRadius: "10px",
                    padding: "6px 12px",
                    fontWeight: isActive(item.path) ? "600" : "400",
                    background: isActive(item.path)
                      ? "rgba(13,110,253,0.1)"
                      : "transparent",
                    color: isActive(item.path) ? "#0d6efd" : "#333"
                  }}
                >
                  {item.label}
                </Nav.Link>
              ))}

              {user?.role === "admin" && (
                <Nav.Link
                  as={Link}
                  to="/admin"
                  style={{
                    borderRadius: "10px",
                    padding: "6px 12px",
                    fontWeight: isActive("/admin") ? "600" : "400",
                    background: isActive("/admin")
                      ? "rgba(13,110,253,0.1)"
                      : "transparent",
                    color: isActive("/admin") ? "#0d6efd" : "#333"
                  }}
                >
                  Admin Panel
                </Nav.Link>
              )}
            </>
          )}
        </Nav>

        {/* RIGHT SIDE */}
        <Nav className="ms-auto mt-3 mt-lg-0 d-flex flex-row flex-lg-row align-items-center flex-wrap" style={{ gap: "10px" }}>

          {token ? (
            <>
              {/* DARK MODE */}
              <Button
                variant="light"
                onClick={() => setDarkMode(!darkMode)}
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  border: "1px solid #eee"
                }}
              >
                {darkMode ? "☀️" : "🌙"}
              </Button>

              {/* NOTIFICATIONS */}
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="light"
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

              <Button
                variant="outline-danger"
                size="sm"
                className="flex-fill flex-lg-grow-0"
                onClick={handleLogout}
                style={{ borderRadius: "10px" }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button as={Link} to="/login" variant="outline-primary">
                Login
              </Button>
              <Button as={Link} to="/signup" variant="primary">
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
