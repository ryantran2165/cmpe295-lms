import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import axios from "axios";

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state === null) {
      navigate("/");
    }

    axios
      .get(`api/v1/assgs/courseassignments/${course._id}`)
      .then(function (response) {
        response.data.sort((a, b) => {
          return new Date(a.dueDate) - new Date(b.dueDate);
        });
        setAssignments(response.data);
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

  const createAssignment = () => {
    navigate("/create-assignment-quiz", {
      state: { user: user, course: course, type: "assignment" },
    });
  };

  const toCourse = () => {
    navigate("/course", {
      state: {
        user: user,
        course: course,
      },
    });
  };

  const toAttempt = (assignment) => {
    navigate("/attempt", {
      state: {
        user: user,
        course: course,
        assignmentQuiz: assignment,
      },
    });
  };

  const toSubmissions = (assignment) => {
    navigate("/submissions", {
      state: {
        user: user,
        course: course,
        assignmentQuiz: assignment,
      },
    });
  };

  const toGradeAssignmentQuiz = (assignment) => {
    navigate("/grade-assignment-quiz", {
      state: {
        user: user,
        course: course,
        assignmentQuiz: assignment,
      },
    });
  };

  return (
    <Container className="p-5" fluid>
      <Row className="justify-content-center">
        <Col xs={12} sm={10}>
          <div className="p-5 shadow rounded">
            <div className="text-center">
              <h1>{course.name} Assignments</h1>
              <Row className="justify-content-center">
                <Col xs="auto">
                  <Button
                    variant="primary"
                    type="button"
                    onClick={toCourse}
                    className="width-200 mt-1"
                  >
                    Course
                  </Button>
                </Col>
                {user.role === "teacher" && (
                  <Col xs="auto">
                    <Button
                      variant="primary"
                      type="button"
                      onClick={createAssignment}
                      className="width-200 mt-1"
                    >
                      Create Assignment
                    </Button>
                  </Col>
                )}
              </Row>
            </div>
            <hr className="m-4" />
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Assignment</th>
                  <th>Due Date</th>
                  <th>Points</th>
                  {user.role === "student" && <th>Attempt/Submissions</th>}
                  {user.role === "teacher" && <th>Grade</th>}
                </tr>
              </thead>
              <tbody>
                {assignments.map((assignment) => (
                  <tr key={assignment._id}>
                    <td>{assignment.name}</td>
                    <td>
                      {assignment.dueDate}
                      {new Date(assignment.dueDate) < Date.now() && <span> (PAST)</span>}
                    </td>
                    <td>{assignment.totalPoints}</td>
                    <td>
                      {user.role === "student" && (
                        <Row>
                          <Col xs="auto">
                            <Button
                              variant="primary"
                              type="button"
                              onClick={() => toAttempt(assignment)}
                              className="width-100"
                            >
                              Attempt
                            </Button>
                          </Col>
                          <Col xs="auto">
                            <Button
                              variant="primary"
                              type="button"
                              onClick={() => toSubmissions(assignment)}
                              className="width-150"
                            >
                              Submissions
                            </Button>
                          </Col>
                        </Row>
                      )}
                      {user.role === "teacher" && (
                        <Row>
                          <Col xs="auto">
                            <Button
                              variant="primary"
                              type="button"
                              onClick={() => toGradeAssignmentQuiz(assignment)}
                              className="width-100"
                            >
                              Grade
                            </Button>
                          </Col>
                        </Row>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
