import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { setEditingUser } from "../redux/userSlice";
import config from "../config/settings";
import UserForm from "./UserForm";
import Modal from "react-bootstrap/Modal";

const UserTable = () => {
  const users = useSelector((state) => state.user.users);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);

  const openModal = (user = null) => {
    dispatch(setEditingUser(user));
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    dispatch(setEditingUser(null));
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h4>User List</h4>
        <button className="btn btn-success" onClick={() => openModal()}>
          ADD
        </button>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Email</th>
            <th>LinkedIn</th>
            <th>Gender</th>
            <th>Address</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, idx) => (
            <React.Fragment key={user.email}>
              <tr>
                <td>{idx + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  Profile -
                  <a
                    href={user.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ms-2"
                  >
                    {user.linkedin}
                  </a>
                </td>
                <td>{user.gender}</td>
                <td>
                  <button
                    className="btn btn-link"
                    onClick={() =>
                      setExpandedRow(idx === expandedRow ? null : idx)
                    }
                  >
                    {idx === expandedRow ? "Hide" : "Show"}
                  </button>
                </td>
                <td>
                  <Button
                    className={
                      !config.editable
                        ? "btn btn-secondary btn-sm not-allowed"
                        : "btn btn-warning btn-sm"
                    }
                    onClick={() => openModal(user)}
                    disabled={!config.editable}
                  >
                    Edit
                  </Button>
                </td>
              </tr>
              {idx === expandedRow && (
                <tr>
                  <td colSpan="7">
                    <strong>Line 1:</strong> {user.address.line1} <br />
                    <strong>Line 2:</strong> {user.address.line2} <br />
                    <strong>State:</strong> {user.address.state} <br />
                    <strong>City:</strong> {user.address.city} <br />
                    <strong>PIN:</strong> {user.address.pin}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <Modal
        size="lg"
        show={showModal}
        onHide={closeModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>User Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UserForm closeForm={closeModal} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UserTable;
