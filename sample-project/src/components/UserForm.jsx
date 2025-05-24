import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { addUser, updateUser, setEditingUser } from "../redux/userSlice";
import statesCities from "../data/stateAndCities.json";
import config from "../config/settings";

const UserForm = ({ closeForm }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    linkedin: "",
    gender: "",
    address: {
      line1: "",
      line2: "",
      state: "",
      city: "",
      pin: "",
    },
  });
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);
  const editingUser = useSelector((state) => state.user.editingUser);
  const isEditing = !!editingUser;

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingUser) setFormData(editingUser);
  }, [editingUser]);

  const validateForm = () => {
    const err = {};
    const name = formData.name?.trim() || "";
    const email = formData.email?.trim() || "";
    const linkedin = formData.linkedin?.trim() || "";
    const pin = formData.address?.pin?.trim() || "";
    const gender = formData.gender;
    const existingUser = users.find((user) => user.email === email);

    if (!name) {
      err.name = "Name is required";
    } else if (name.length < config.nameMinCharLength) {
      err.name = `Name must be at least ${config.nameMinCharLength} characters`;
    } else if (name.length > config.nameMaxCharLength) {
      err.name = `Name must be less than ${config.nameMaxCharLength} characters`;
    }

    const emailPattern = /^\S+@\S+\.\S+$/;
    if (!email) {
      err.email = "Email is required";
    } else if (!emailPattern.test(email)) {
      err.email = "Invalid email";
    } else if (!isEditing && existingUser) {
      err.email = "Email already exists";
    }

    const linkedInPattern = /^https:\/\/(www\.)?linkedin\.com\/.+$/;
    if (!linkedin) {
      err.linkedin = "LinkedIn URL is required";
    } else if (!linkedInPattern.test(linkedin)) {
      err.linkedin = "Invalid LinkedIn URL";
    }

    if (!gender) {
      err.gender = "Gender is required";
    }

    const pinPattern = /^\d{6}$/;
    if (!pin) {
      err.pin = "PIN is required";
    } else if (!pinPattern.test(pin)) {
      err.pin = "PIN must be 6 digits";
    }

    if (!formData.address?.state) {
      err.state = "State is required";
    }
    if (!formData.address?.city) {
      err.city = "City is required";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("address.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    console.log(formData, "Form Data");
    if (!validateForm()) return;
    if (isEditing) {
      dispatch(updateUser(formData));
    } else {
      dispatch(addUser(formData));
    }
    dispatch(setEditingUser(null));
    closeForm();
  };

  const stateOptions = Object.keys(statesCities.states);
  const cityOptions = formData.address.state
    ? statesCities.states[formData.address.state]
    : [];

  return (
    <div className="p-3 mb-3">
      <Container>
        <h5>{isEditing ? "Edit" : "Add"} User</h5>
        <Form>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Label>
                Enter Name <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              {errors.name && (
                <Form.Text className="text-danger">{errors.name}</Form.Text>
              )}
            </Col>

            <Col md={6} className="mb-3">
              <Form.Label>
                Enter Email <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                disabled={isEditing}
              />
              {errors.email && (
                <Form.Text className="text-danger">{errors.email}</Form.Text>
              )}
            </Col>
          </Row>

          <Row>
            <Col md={6} className="mb-3">
              <Form.Label>
                Enter LinkedIn URL <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="linkedin"
                placeholder="LinkedIn URL"
                value={formData.linkedin}
                onChange={handleChange}
              />
              {errors.linkedin && (
                <Form.Text className="text-danger">{errors.linkedin}</Form.Text>
              )}
            </Col>

            <Col md={6} className="mb-3">
              <Form.Label>
                Gender <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
              </Form.Select>
              {errors.gender && (
                <Form.Text className="text-danger">{errors.gender}</Form.Text>
              )}
            </Col>
          </Row>

          <h6 className="mt-3">Address</h6>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Label>Enter Address 1</Form.Label>
              <Form.Control
                type="text"
                name="address.line1"
                placeholder="Line 1"
                value={formData.address.line1}
                onChange={handleChange}
              />
            </Col>

            <Col md={6} className="mb-3">
              <Form.Label>Enter Address 2</Form.Label>
              <Form.Control
                type="text"
                name="address.line2"
                placeholder="Line 2"
                value={formData.address.line2}
                onChange={handleChange}
              />
            </Col>

            <Col md={6} className="mb-3">
              <Form.Label>
                State <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Select
                name="address.state"
                value={formData.address.state}
                onChange={handleChange}
              >
                <option value="">Select State</option>
                {stateOptions.map((state) => (
                  <option key={state}>{state}</option>
                ))}
              </Form.Select>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Label>
                City <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Select
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
              >
                <option value="">Select City</option>
                {cityOptions.map((city) => (
                  <option key={city}>{city}</option>
                ))}
              </Form.Select>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Label>
                Enter Pincode <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="address.pin"
                placeholder="Pincode"
                value={formData.address.pin}
                onChange={handleChange}
              />
              {errors.pin && (
                <Form.Text className="text-danger">{errors.pin}</Form.Text>
              )}
            </Col>
          </Row>

          <Row className="mt-2">
            <Col>
              <Button variant="primary" onClick={handleSubmit}>
                Save
              </Button>
              <Button variant="secondary" className="ms-2" onClick={closeForm}>
                Cancel
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </div>
  );
};
export default UserForm;
