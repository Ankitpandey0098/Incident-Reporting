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

import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { getImageUrl } from "../utils/image";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [success, setSuccess] = useState("");

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


  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
  api.get("/profile/")
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

      setPreview(getImageUrl(res.data.profile_image));







      setLoading(false);
    })
    .catch(() => {
      setError("Failed to load profile");
      setLoading(false);
    });
}, []);

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
  useEffect(() => {
  return () => {
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
  };
}, []);



  /* ================= SAVE PROFILE ================= */
  const handleSave = () => {
    const data = new FormData();
    

// ✅ Combine first + last name
data.append(
  "full_name",
  `${formData.first_name} ${formData.last_name}`.trim()
);

// ✅ Other fields
data.append("email", formData.email);
data.append("phone", formData.phone);
data.append("city", formData.city);

// ✅ Image
if (formData.profile_image instanceof File) {
  data.append("profile_image", formData.profile_image);
}

    console.log("Sending Data:", formData);

    api.patch("/profile/", data, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
})

      .then((res) => {
  console.log("Success:", res.data);

  // Reload profile after update
  api.get("/profile/").then((res) => {
  setProfile(res.data);

  setPreview(getImageUrl(res.data.profile_image));



  setFormData({
    email: res.data.email || "",
    first_name: res.data.first_name || "",
    last_name: res.data.last_name || "",
    phone: res.data.phone || "",
    city: res.data.city || "",
    profile_image: null,
  });
});


  setEditMode(false);
  setFormData({ ...formData, profile_image: null });
  setSuccess("Profile updated successfully");
  setTimeout(() => setSuccess(""), 3000);
})

      .catch((err) => {
      console.log("Error:", err.response);   // ADD THIS
      setError("Failed to update profile");
    });
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
      padding: "20px 10px"
    }}
  >
    <div className="container-fluid px-2 px-md-3" style={{ maxWidth: "900px" }}>

      {/* HEADER */}
      <div className="mb-4">
        <h3 style={{ fontWeight: "800" }}>My Profile</h3>
        <p className="text-muted">
          Manage your account information and preferences
        </p>
      </div>
      {success && (
  <Alert
    variant="success"
    dismissible
    onClose={() => setSuccess("")}
  >
    {success}
  </Alert>
)}

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
            <Col md={4} className="text-center border-md-end mb-4 mb-md-0">

              <div
                style={{
                  width: "clamp(80px, 20vw, 110px)",
                  height: "clamp(80px, 20vw, 110px)",
                  borderRadius: "50%",
                  overflow: "hidden",
                  margin: "0 auto",
                  border: "3px solid #e9ecef",
                  position: "relative",
                  background: "#f8f9fa"
                }}
              >
                <Image
                    src={preview || "https://via.placeholder.com/150"}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/150";
                    }}
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
                {profile?.username}

              </h5>

              <Badge bg="primary" pill className="mb-3">
                {profile?.role}
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
  onClick={() => {
  setEditMode(false);

  setFormData({
    email: profile.email || "",
    first_name: profile.first_name || "",
    last_name: profile.last_name || "",
    phone: profile.phone || "",
    city: profile.city || "",
    profile_image: null,
  });

  setPreview(getImageUrl(profile?.profile_image));

}}




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
            <Col xs={12} md={8}>

              <h6 className="mb-3 fw-bold">Account Information</h6>

              {["email", "first_name", "last_name", "phone", "city"].map(
                (field) => (
                  <Row className="mb-3 align-items-center" key={field}>
                    <Col md={4} className="text-muted text-capitalize">
                      {field.replace("_", " ")}
                    </Col>

                    <Col xs={12} md={8}>
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
