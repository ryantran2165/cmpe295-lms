import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import books from "../images/books.jpg";

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state === null) {
      navigate("/");
    }
  }, []);

  if (location.state === null) {
    return;
  }

  const user = location.state.user;

  const logout = () => {
    navigate("/");
  };

  const enroll = () => {
    navigate("/enroll", { state: { user: user } });
  };

  const createCourse = () => {
    navigate("/create-course", { state: { user: user } });
  };

  const toCourse = (course) => {
    navigate("/course", { state: { user: user, course: course } });
  };

  return (
    <Container className="p-5" fluid>
      <Row className="justify-content-center">
        <Col xs={12} sm={10}>
          <div className="p-5 shadow rounded">
            <div className="text-center">
              <h1>
                Welcome, {user.firstName} {user.lastName}!
              </h1>
              <h4>
                {user.email} | {user.role}
              </h4>
              <Button variant="primary" type="button" onClick={logout} className="width-200 mt-1">
                Logout
              </Button>
              <hr className="m-4" />
              <h2>Courses</h2>
              {user.role === "student" && (
                <Button variant="primary" type="button" onClick={enroll} className="width-200 mt-1">
                  Enroll
                </Button>
              )}
              {user.role === "teacher" && (
                <Button
                  variant="primary"
                  type="button"
                  onClick={createCourse}
                  className="width-200 mt-1"
                >
                  Create
                </Button>
              )}
              <Row>
                {user.courses.map((course) => (
                  <Col xs={12} md={6} lg={4} key={course._id} className="mt-3">
                    <Card onClick={() => toCourse(course)} className="cursor-pointer h-100">
                      <Card.Img variant="top" src={books} className="max-height-200" />
                      <Card.Title className="p-3">{course.name}</Card.Title>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
