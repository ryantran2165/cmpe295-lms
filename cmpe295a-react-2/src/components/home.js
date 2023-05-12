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

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const login = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:3001/api/v1/users/login", {
        username: username,
        password: password,
      })
      .then(function (response) {
        if (response.data.status === true) {
          setMessage("");
          navigate("/dashboard", {
            state: {
              userData: response.data.userData,
            },
          });
        } else {
          setMessage("Invalid username or password.");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <Container className="p-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6}>
          <div className="p-5 shadow">
            <div className="text-center">
              <Link to="/">
                <Image src={books} className="max-height-200" rounded fluid />
              </Link>
              <h1 className="mt-3">CMPE 295 LMS</h1>
              <h4 className="mt-3">
                Welcome to the world's first learning management system with support for automated
                handwritten and open-ended solutions grading!
              </h4>
              <h4 className="mt-3">
                Login or <Link to="register">register</Link> to get started.
              </h4>
            </div>
            <Form onSubmit={login} className="mt-5">
              <Form.Group>
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
              <Button variant="primary" type="submit" className="w-100 mt-3">
                Login
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
