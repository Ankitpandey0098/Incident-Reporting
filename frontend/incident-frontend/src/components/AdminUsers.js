import React, { useEffect, useState, useCallback } from "react";

import {
  Card,
  Table,
  Spinner,
  Button,
  Badge,
  Form,
  Row,
  Col,
  Modal,
  Alert,
} from "react-bootstrap";

import {
  PencilFill,
  TrashFill,
  PersonXFill,
  PersonCheckFill,
} from "react-bootstrap-icons";

import AdminHeader from "./AdminHeader";
import api from "../api/axios";

const AdminUsers = () => {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [message, setMessage] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  const [editData, setEditData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    role: "",
  });

  // ================= FETCH USERS =================

  const fetchUsers = useCallback(async () => {

    setLoading(true);

    try {

      const params = {};

      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      if (statusFilter) params.status = statusFilter;

      const res = await api.get("/admin/users/", {
        params,
      });

      setUsers(res.data);

    } catch (err) {

      console.error(err);
      setMessage("Failed to load users");

    } finally {

      setLoading(false);

    }

  }, [search, roleFilter, statusFilter]);

  useEffect(() => {

    fetchUsers();

  }, [fetchUsers]);

  // ================= DELETE USER =================

  const deleteUser = async (id) => {

    const confirmDelete = window.confirm(
      "Delete this user?"
    );

    if (!confirmDelete) return;

    try {

      await api.delete(`/admin/users/${id}/delete/`);

      setUsers(users.filter((u) => u.id !== id));

      setMessage("User deleted successfully");

    } catch (err) {

      console.error(err);

      setMessage(
        err.response?.data?.error ||
        "Delete failed"
      );

    }
  };

  // ================= TOGGLE STATUS =================

  const toggleStatus = async (id) => {

    try {

      const res = await api.patch(
        `/admin/users/${id}/toggle-status/`
      );

      setUsers(
        users.map((u) =>
          u.id === id
            ? {
                ...u,
                is_active: res.data.is_active,
                status: res.data.is_active
                  ? "Active"
                  : "Suspended",
              }
            : u
        )
      );

      setMessage("User status updated");

    } catch (err) {

      console.error(err);

      setMessage(
        err.response?.data?.error ||
        "Status update failed"
      );

    }
  };

  // ================= OPEN EDIT =================

  const openEditModal = (user) => {

    setSelectedUser(user);

    setEditData({
      username: user.username || "",
      email: user.email || "",
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      role: user.role || "user",
    });

    setShowModal(true);
  };

  // ================= UPDATE USER =================

  const updateUser = async () => {

    try {

      const res = await api.patch(
        `/admin/users/${selectedUser.id}/update/`,
        editData
      );

      setUsers(
        users.map((u) =>
          u.id === selectedUser.id
            ? res.data
            : u
        )
      );

      setMessage("User updated successfully");

      setShowModal(false);

    } catch (err) {

      console.error(err);

      setMessage(
        err.response?.data?.error ||
        "Update failed"
      );

    }
  };

  // ================= STATUS BADGE =================

  const statusBadge = (status) => {

    if (status === "Suspended") {
      return <Badge bg="danger">Suspended</Badge>;
    }

    if (status === "Admin") {
      return <Badge bg="dark">Admin</Badge>;
    }

    if (status === "Department") {
      return <Badge bg="primary">Department</Badge>;
    }

    return <Badge bg="success">Active</Badge>;
  };

  return (

    <div className="container-fluid mt-3">

      <AdminHeader />

      {/* MESSAGE */}

      {message && (
        <Alert
          variant="info"
          dismissible
          onClose={() => setMessage("")}
        >
          {message}
        </Alert>
      )}

      {/* FILTERS */}

      <Card className="shadow-sm border-0 mb-3">

        <Card.Body>

          <Row className="g-2">

            <Col md={4}>
              <Form.Control
                placeholder="Search username..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </Col>

            <Col md={3}>
              <Form.Select
                value={roleFilter}
                onChange={(e) =>
                  setRoleFilter(e.target.value)
                }
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="department">
                  Department
                </option>
                <option value="user">User</option>
              </Form.Select>
            </Col>

            <Col md={3}>
              <Form.Select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
              >
                <option value="">All Status</option>
                <option value="active">
                  Active
                </option>
                <option value="suspended">
                  Suspended
                </option>
              </Form.Select>
            </Col>

          </Row>

        </Card.Body>

      </Card>

      {/* USERS TABLE */}

      <Card className="shadow-sm border-0">

        <Card.Header className="bg-white">
          <h5 className="mb-0">
            👥 Users Management
          </h5>
        </Card.Header>

        <Card.Body>

          {loading ? (

            <div className="text-center py-5">
              <Spinner animation="border" />
            </div>

          ) : (

            <Table
              responsive
              hover
              className="align-middle"
            >

              <thead className="table-light">

                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>

              </thead>

              <tbody>

                {users.map((user) => (

                  <tr key={user.id}>

                    <td>{user.id}</td>

                    <td>{user.username}</td>

                    <td>{user.email}</td>

                    <td>{user.role}</td>

                    <td>
                      {user.department || "N/A"}
                    </td>

                    <td>
                      {statusBadge(user.status)}
                    </td>

                    <td>
                      {new Date(
                        user.date_joined
                      ).toLocaleDateString()}
                    </td>

                    <td>

                      <div className="d-flex gap-2 flex-wrap">

                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() =>
                            openEditModal(user)
                          }
                        >
                          <PencilFill />
                        </Button>

                        <Button
                          size="sm"
                          variant={
                            user.is_active
                              ? "outline-warning"
                              : "outline-success"
                          }
                          onClick={() =>
                            toggleStatus(user.id)
                          }
                        >
                          {user.is_active ? (
                            <PersonXFill />
                          ) : (
                            <PersonCheckFill />
                          )}
                        </Button>

                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() =>
                            deleteUser(user.id)
                          }
                        >
                          <TrashFill />
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

      {/* EDIT MODAL */}

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
      >

        <Modal.Header closeButton>
          <Modal.Title>
            Edit User
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>

          <Form>

            <Form.Group className="mb-3">
              <Form.Label>
                Username
              </Form.Label>

              <Form.Control
                value={editData.username}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    username: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Email
              </Form.Label>

              <Form.Control
                value={editData.email}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    email: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                First Name
              </Form.Label>

              <Form.Control
                value={editData.first_name}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    first_name: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Last Name
              </Form.Label>

              <Form.Control
                value={editData.last_name}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    last_name: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>
                Role
              </Form.Label>

              <Form.Select
                value={editData.role}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    role: e.target.value,
                  })
                }
              >
                <option value="user">
                  User
                </option>

                <option value="department">
                  Department
                </option>

                <option value="admin">
                  Admin
                </option>

              </Form.Select>
            </Form.Group>

          </Form>

        </Modal.Body>

        <Modal.Footer>

          <Button
            variant="secondary"
            onClick={() =>
              setShowModal(false)
            }
          >
            Cancel
          </Button>

          <Button
            variant="dark"
            onClick={updateUser}
          >
            Save Changes
          </Button>

        </Modal.Footer>

      </Modal>

    </div>
  );
};

export default AdminUsers;