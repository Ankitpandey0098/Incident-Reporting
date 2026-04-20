import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Spinner,
  Alert,
  Button,
  Form,
  Badge,
  Image,
} from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    city: "",
    profile_image: null,
  });
  const [preview, setPreview] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    axios.get("https://incident-reporting-rjwi.onrender.com/api/profile/", {
  headers: { Authorization: `Bearer ${token}` },
})
      .then((res) => {
        setProfile(res.data);
        setFormData({
          email: res.data.email || "",
          first_name: res.data.first_name || "",
          last_name: res.data.last_name || "",
          phone: res.data.phone || "",
          city: res.data.city || "",
          profile_image: null,
        });
        setPreview(res.data.profile_image || null);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load profile");
        setLoading(false);
      });
  }, [navigate, token]);

  /* ================= INPUT HANDLERS ================= */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profile_image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  /* ================= SAVE PROFILE ================= */
  const handleSave = () => {
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) data.append(key, formData[key]);
    });

    axios.patch(
  "https://incident-reporting-rjwi.onrender.com/api/profile/",
  data,
  {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  }
)
      .then((res) => {
        setProfile({ ...profile, ...res.data });
        setEditMode(false);
        setFormData({ ...formData, profile_image: null });
      })
      .catch(() => setError("Failed to update profile"));
  };

  /* ================= UI STATES ================= */
  if (loading)
    return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  /* ================= RENDER ================= */
  return (
  <div
    style={{
      minHeight: "100vh",
      background: "#f4f7fb",
      padding: "40px 20px"
    }}
  >
    <div className="container" style={{ maxWidth: "900px" }}>

      {/* HEADER */}
      <div className="mb-4">
        <h3 style={{ fontWeight: "800" }}>My Profile</h3>
        <p className="text-muted">
          Manage your account information and preferences
        </p>
      </div>

      <Card
        className="shadow-sm"
        style={{
          borderRadius: "16px",
          border: "none",
          overflow: "hidden"
        }}
      >

        <Card.Body className="p-4">

          <Row>

            {/* LEFT PANEL */}
            <Col md={4} className="text-center border-end">

              <div
                style={{
                  width: 110,
                  height: 110,
                  borderRadius: "50%",
                  overflow: "hidden",
                  margin: "0 auto",
                  border: "3px solid #e9ecef",
                  position: "relative",
                  background: "#f8f9fa"
                }}
              >
                <Image
                  src={preview || "/default-avatar.png"}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                />

                {editMode && (
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{
                      position: "absolute",
                      inset: 0,
                      opacity: 0,
                      cursor: "pointer"
                    }}
                  />
                )}
              </div>

              <h5 className="mt-3 mb-1 fw-bold">
                {profile.username}
              </h5>

              <Badge bg="primary" pill className="mb-3">
                {profile.role}
              </Badge>

              <p className="text-muted small">
                {editMode
                  ? "Click image to update profile photo"
                  : "Account profile"}
              </p>

              {/* ACTION BUTTONS */}
              {editMode ? (
                <>
                  <Button
                    size="sm"
                    className="w-100 mb-2"
                    onClick={handleSave}
                  >
                    Save Changes
                  </Button>

                  <Button
                    size="sm"
                    variant="outline-secondary"
                    className="w-100"
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  className="w-100"
                  onClick={() => setEditMode(true)}
                >
                  Edit Profile
                </Button>
              )}

            </Col>

            {/* RIGHT PANEL */}
            <Col md={8}>

              <h6 className="mb-3 fw-bold">Account Information</h6>

              {["email", "first_name", "last_name", "phone", "city"].map(
                (field) => (
                  <Row className="mb-3 align-items-center" key={field}>
                    <Col md={4} className="text-muted text-capitalize">
                      {field.replace("_", " ")}
                    </Col>

                    <Col md={8}>
                      <Form.Control
                        name={field}
                        value={
                          editMode
                            ? formData[field]
                            : profile[field] || ""
                        }
                        onChange={handleChange}
                        disabled={!editMode}
                        style={{
                          padding: "10px",
                          borderRadius: "10px",
                          background: editMode ? "#fff" : "#f1f3f5",
                          border: "1px solid #e9ecef"
                        }}
                      />
                    </Col>
                  </Row>
                )
              )}

            </Col>

          </Row>

        </Card.Body>

      </Card>

    </div>
  </div>
);

};

export default Profile;
