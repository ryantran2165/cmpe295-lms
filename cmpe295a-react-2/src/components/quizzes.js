import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import axios from "axios";

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state === null) {
      navigate("/");
    }

    axios
      .get(`http://localhost:3001/api/v1/assgs/coursequizzes/${course._id}`)
      .then(function (response) {
        response.data.sort((a, b) => {
          return new Date(a.dueDate) - new Date(b.dueDate);
        });
        setQuizzes(response.data);
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

  const createQuiz = () => {
    navigate("/create-assignment-quiz", {
      state: { user: user, course: course, type: "quiz" },
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

  const toAttempt = (quiz) => {
    navigate("/attempt", {
      state: {
        user: user,
        course: course,
        assignmentQuiz: quiz,
      },
    });
  };

  const toSubmissions = (quiz) => {
    navigate("/submissions", {
      state: {
        user: user,
        course: course,
        assignmentQuiz: quiz,
      },
    });
  };

  return (
    <Container className="p-5" fluid>
      <Row className="justify-content-center">
        <Col xs={12} sm={10}>
          <div className="p-5 shadow rounded">
            <div className="text-center">
              <h1>{course.name} Quizzes</h1>
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
                      onClick={createQuiz}
                      className="width-200 mt-1"
                    >
                      Create Quiz
                    </Button>
                  </Col>
                )}
              </Row>
            </div>
            <hr className="m-4" />
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Quiz</th>
                  <th>Due Date</th>
                  <th>Points</th>
                  <th>Attempt/Submissions</th>
                </tr>
              </thead>
              <tbody>
                {quizzes.map((quiz) => (
                  <tr key={quiz._id}>
                    <td>{quiz.name}</td>
                    <td>
                      {quiz.dueDate}
                      {new Date(quiz.dueDate) < Date.now() && <span> (PAST)</span>}
                    </td>
                    <td>{quiz.totalPoints}</td>
                    <td>
                      <Row>
                        <Col xs="auto">
                          <Button
                            variant="primary"
                            type="button"
                            onClick={() => toAttempt(quiz)}
                            className="width-100"
                          >
                            Attempt
                          </Button>
                        </Col>
                        <Col xs="auto">
                          <Button
                            variant="primary"
                            type="button"
                            onClick={() => toSubmissions(quiz)}
                            className="width-150"
                          >
                            Submissions
                          </Button>
                        </Col>
                      </Row>
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
