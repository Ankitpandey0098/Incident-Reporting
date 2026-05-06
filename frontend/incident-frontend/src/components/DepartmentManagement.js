import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Card,
  Button,
  Modal,
  Form,
  Alert,
  Spinner,
  Row,
  Col
} from "react-bootstrap";
import AdminHeader from "./AdminHeader";

const DepartmentManagement = () => {

  const token = localStorage.getItem("access");
  console.log("ACCESS TOKEN:", token);

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [showEdit, setShowEdit] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    description: ""
  });

  const [showAdd, setShowAdd] = useState(false);

  const [addForm, setAddForm] = useState({
    name: "",
    email: "",
    phone: "",
    description: ""
  });

  // ================= FETCH ALL DEPARTMENTS =================
  const fetchDepartments = async () => {
    setLoading(true);

    try {
     console.log("CALLING API...");
const res = await axios.get(
  "https://incident-reporting-rjwi.onrender.com/api/departments/",
  { headers: { Authorization: `Bearer ${token}` } }
);


      setDepartments(res.data);

    } catch (err) {
      console.error("FETCH ERROR:", err);

      setMessage(
        err.response?.status === 401
          ? "Unauthorized: Token missing or expired"
          : "Failed to fetch departments"
      );

    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE DEPARTMENT =================
  const deleteDepartment = async (id) => {
    try {
      await axios.delete(
  `https://incident-reporting-rjwi.onrender.com/api/departments/delete/${id}/`,
  { headers: { Authorization: `Bearer ${token}` } }
);


      setMessage("Department deleted successfully");
      fetchDepartments();

    } catch (err) {
      setMessage(err.response?.data?.error || "Delete failed");
    }
  };

  // ================= OPEN EDIT MODAL =================
  const openEdit = (dept) => {
    setSelectedDept(dept);
    setEditForm({
      name: dept.name,
      email: dept.email,
      phone: dept.phone,
      description: dept.description
    });
    setShowEdit(true);
  };

  // ================= UPDATE =================
  const updateDepartment = async () => {
    try {
      await axios.patch(
  `https://incident-reporting-rjwi.onrender.com/api/departments/update/${selectedDept.id}/`,
  editForm,
  { headers: { Authorization: `Bearer ${token}` } }
);


      setMessage("Department updated successfully");
      setShowEdit(false);
      fetchDepartments();

    } catch (err) {
      setMessage(err.response?.data?.error || "Update failed");
    }
  };

  // ================= CREATE =================
  const createDepartment = async () => {
    try {

      axios.post(
  "https://incident-reporting-rjwi.onrender.com/api/departments/add/",
  addForm,
  { headers: { Authorization: `Bearer ${token}` } }
);


      setMessage("Department added successfully");

      setShowAdd(false);

      setAddForm({
        name: "",
        email: "",
        phone: "",
        description: ""
      });

      fetchDepartments();

    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to add department");
    }
  };

  useEffect(() => {
    if (token) {
      fetchDepartments();
    }
  }, []);

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#f8f9fa",
        paddingTop: "15px",
        paddingBottom: "30px",
        paddingLeft: "6px",
        paddingRight: "6px"
      }}
      className="container px-2 px-md-3"
    >

      <AdminHeader />

      {/* Page Title */}
      <div className="mb-3">
        <h3 className="fw-bold mb-1 fs-5 fs-md-4 text-break">
          🏛️ Department Management
        </h3>
        <small className="text-muted d-block">
          Create, update and manage departments
        </small>
      </div>

      {message && (
        <Alert
          variant="info"
          onClose={() => setMessage(null)}
          dismissible
        >
          {message}
        </Alert>
      )}

      <Card className="shadow-sm border-0 rounded-3">

        <Card.Header className="bg-white border-0 py-3">

          <Row className="align-items-center g-2">

            <Col>
              <h5 className="mb-0 fw-semibold">
                All Departments
              </h5>
            </Col>

            <Col xs={12} md="auto" className="text-md-end">
              <Button
                variant="primary"
                className="w-100 w-md-auto"
                onClick={() => setShowAdd(true)}
              >
                + Add Department
              </Button>
            </Col>

          </Row>

        </Card.Header>

        <Card.Body className="p-2 p-md-3" style={{ overflowX: "auto", overflowY: "auto", maxHeight: "600px" }}>

          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" />
            </div>
          ) : (

            <Table
              hover
              responsive
              className="align-middle small"
              style={{ minWidth: "800px" }}
            >

              <thead className="table-light text-nowrap">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {departments.map((dept) => (

                  <tr key={dept.id}>

                    <td>{dept.id}</td>

                    <td className="fw-semibold text-break">
                      {dept.name}
                    </td>

                    <td className="text-break">{dept.email}</td>
                    <td className="text-break">{dept.phone || "N/A"}</td>
                    <td className="text-break">
                      {dept.description || "N/A"}
                    </td>

                    <td>

                      <div className="d-flex gap-2 flex-wrap">

                        <Button
                          size="sm"
                          variant="warning"
                          onClick={() => openEdit(dept)}
                        >
                          Edit
                        </Button>

                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() =>
                            deleteDepartment(dept.id)
                          }
                        >
                          Delete
                        </Button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </Table>

          )}

        </Card.Body>

      </Card>

      {/* ================= EDIT MODAL ================= */}

      <Modal show={showEdit} onHide={() => setShowEdit(false)} centered size="md">

        <Modal.Header closeButton>
          <Modal.Title>
            Edit Department
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>

          <Form>

            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    name: e.target.value
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                value={editForm.email}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    email: e.target.value
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                value={editForm.phone}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    phone: e.target.value
                  })
                }
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    description: e.target.value
                  })
                }
              />
            </Form.Group>

          </Form>

        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowEdit(false)}
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            className="w-100 w-md-auto"
            onClick={updateDepartment}
          >
            Update
          </Button>
        </Modal.Footer>

      </Modal>


      {/* ================= ADD MODAL ================= */}

      <Modal show={showAdd} onHide={() => setShowAdd(false)} centered size="md">

        <Modal.Header closeButton>
          <Modal.Title>
            Add Department
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>

          <Form>

            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={addForm.name}
                onChange={(e) =>
                  setAddForm({
                    ...addForm,
                    name: e.target.value
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                value={addForm.email}
                onChange={(e) =>
                  setAddForm({
                    ...addForm,
                    email: e.target.value
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                value={addForm.phone}
                onChange={(e) =>
                  setAddForm({
                    ...addForm,
                    phone: e.target.value
                  })
                }
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={addForm.description}
                onChange={(e) =>
                  setAddForm({
                    ...addForm,
                    description: e.target.value
                  })
                }
              />
            </Form.Group>

          </Form>

        </Modal.Body>

        <Modal.Footer>

          <Button
            variant="secondary"
            onClick={() => setShowAdd(false)}
          >
            Cancel
          </Button>

          <Button
            variant="success"
            onClick={createDepartment}
          >
            Add Department
          </Button>

        </Modal.Footer>

      </Modal>

    </div>
  );
};

export default DepartmentManagement;
