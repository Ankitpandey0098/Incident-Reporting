import React from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import {
  GridFill,
  Building,
  ShieldLockFill
} from "react-bootstrap-icons";

const AdminHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check active route
  const isActive = (path) => location.pathname.startsWith(path);


  return (
    <Card className="mb-4 shadow-sm border-0">

      <Card.Body>

        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center flex-wrap mb-3">

          <div>
            <h2 className="mb-1">
              <ShieldLockFill className="me-2 text-primary" />
              Admin Control Panel
            </h2>

            <small className="text-muted">
              Manage incidents, departments and system operations
            </small>
          </div>

          <div className="mt-2 mt-md-0">
            <Badge bg="dark" className="me-2">
              Admin
            </Badge>

            <Badge bg="primary">
            {location.pathname.includes("departments")
              ? "Departments"
              : "Dashboard"}
          </Badge>

          </div>

        </div>

        {/* Navigation Section */}

        <div className="d-flex gap-2 flex-wrap">

          <Button
            variant={isActive("/admin") ? "dark" : "outline-dark"}
            onClick={() => navigate("/admin")}
          >
            <GridFill className="me-2" />
            Incidents
          </Button>

          <Button
            variant={
              isActive("/admin/departments")
                ? "dark"
                : "outline-dark"
            }
            onClick={() => navigate("/admin/departments")}
          >
            <Building className="me-2" />
            Departments
          </Button>

        </div>

      </Card.Body>

    </Card>
  );
};

export default AdminHeader;
