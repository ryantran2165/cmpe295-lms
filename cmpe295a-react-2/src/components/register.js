import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import books from "../images/books.jpg";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const register = (e) => {
    e.preventDefault();

    axios
      .post("api/v1/users/signup", {
        firstName: firstName,
        lastName: lastName,
        email: email,
        username: username,
        password: password,
        role: role,
      })
      .then(function (response) {
        if (response.data.status === true) {
          setMessage("");
          navigate("/");
        } else {
          setMessage("Username or email already taken.");
        }
      })
      .catch(function (e) {
        console.log(e);
      });
  };

  return (
    <Container className="p-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6}>
          <div className="p-5 shadow rounded">
            <div className="text-center">
              <Link to="/">
                <Image src={books} className="max-height-200" rounded fluid />
              </Link>
              <h1 className="mt-3">CMPE 295 LMS</h1>
              <h4 className="mt-3">Register a new student or teacher.</h4>
              <h4 className="mt-3">
                Already have an account? <Link to="/">Login</Link>
              </h4>
            </div>
            <Form onSubmit={register} className="mt-5">
              <Form.Group>
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label>Role</Form.Label>
                <Form.Select onChange={(e) => setRole(e.target.value)} required>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </Form.Select>
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100 mt-3">
                Register
              </Button>
            </Form>
            {message !== "" && (
              <Alert variant="danger" className="mt-3 mb-0">
                {message}
              </Alert>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
