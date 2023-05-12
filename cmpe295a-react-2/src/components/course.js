import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import axios from "axios";

export default function Course() {
  const location = useLocation();
  const navigate = useNavigate();
  const [instructor, setInstructor] = useState(null);

  useEffect(() => {
    if (location.state === null) {
      navigate("/");
    }

    axios
      .get(`http://localhost:3001/api/v1/courses/byinstructor/${course.instructor}`)
      .then(function (response) {
        setInstructor(response.data[0].instructor);
      })
      .catch(function (e) {
        console.log(e);
      });
  }, []);

  if (location.state === null) {
    return;
  }

  const user = location.state.user;
  const course = location.state.course;

  const toDashboard = () => {
    navigate("/dashboard", { state: { user: user } });
  };

  const toAssignments = () => {
    navigate("/assignments", { state: { user: user, course: course } });
  };

  const toQuizzes = () => {
    navigate("/quizzes", { state: { user: user, course: course } });
  };

  const toGrades = () => {
    navigate("/grades", { state: { user: user, course: course } });
  };

  return (
    <Container className="p-5" fluid>
      <Row className="justify-content-center">
        <Col xs={12} sm={10}>
          <div className="p-5 shadow rounded">
            <div className="text-center">
              <h2>{course.name}</h2>
              <h4>
                by{" "}
                {instructor === null ? (
                  <span>TBD</span>
                ) : (
                  <span>
                    {instructor.firstName} {instructor.lastName} | {instructor.email}
                  </span>
                )}
              </h4>
              <Row className="justify-content-center">
                <Col xs="auto">
                  <Button
                    variant="primary"
                    type="button"
                    onClick={toDashboard}
                    className="width-200 mt-1"
                  >
                    Dashboard
                  </Button>
                </Col>
                <Col xs="auto">
                  <Button
                    variant="primary"
                    type="button"
                    onClick={toAssignments}
                    className="width-200 mt-1"
                  >
                    Assignments
                  </Button>
                </Col>
                <Col xs="auto">
                  <Button
                    variant="primary"
                    type="button"
                    onClick={toQuizzes}
                    className="width-200 mt-1"
                  >
                    Quizzes
                  </Button>
                </Col>
                <Col xs="auto">
                  <Button
                    variant="primary"
                    type="button"
                    onClick={toGrades}
                    className="width-200 mt-1"
                  >
                    Grades
                  </Button>
                </Col>
              </Row>
              <hr className="m-4" />
              {"description" in course && <h2>{course.description}</h2>}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
