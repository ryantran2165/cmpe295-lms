import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import axios from "axios";

export default function Grades() {
  const [assignmentsQuizzes, setAssignmentsQuizzes] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state === null) {
      navigate("/");
    }

    axios
      .get(`http://localhost:3001/api/v1/assgs/course/${course._id}`)
      .then(function (response) {
        const assignmentsQuizzes = response.data;
        assignmentsQuizzes.sort((a, b) => {
          return new Date(a.dueDate) - new Date(b.dueDate);
        });

        const promises = [];
        for (const assignmentQuiz of assignmentsQuizzes) {
          const promise = axios
            .get(
              `http://localhost:3001/api/v1/assgs/stusubmission/${assignmentQuiz._id}/${user._id}`
            )
            .then(function (response) {
              const submissions = response.data;
              submissions.sort((a, b) => {
                return new Date(a.dateSubmitted) - new Date(b.dateSubmitted);
              });
              let lastSubmission =
                submissions.length > 0 ? submissions[submissions.length - 1] : null;
              assignmentQuiz["lastSubmission"] = lastSubmission;
            })
            .catch(function (e) {
              console.log(e);
            });
          promises.push(promise);
        }

        Promise.all(promises)
          .then(function (response) {
            setAssignmentsQuizzes(assignmentsQuizzes);

            let totalScore = 0;
            let totalPoints = 0;
            for (const assignmentQuiz of assignmentsQuizzes) {
              if (assignmentQuiz.lastSubmission !== null) {
                totalScore += assignmentQuiz.lastSubmission.score;
              }
              totalPoints += assignmentQuiz.totalPoints;
            }
            setTotalScore(totalScore);
            setTotalPoints(totalPoints);
          })
          .catch(function (e) {
            console.log(e);
          });
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

  const toCourse = () => {
    navigate("/course", {
      state: {
        user: user,
        course: course,
      },
    });
  };

  const createGrade = (assignmentQuiz) => {
    return (
      <tr key={assignmentQuiz._id}>
        <td>{assignmentQuiz.name}</td>
        <td>{assignmentQuiz.type.charAt(0).toUpperCase() + assignmentQuiz.type.slice(1)}</td>
        <td>{assignmentQuiz.dueDate}</td>
        <td>
          {assignmentQuiz.lastSubmission === null ? 0 : assignmentQuiz.lastSubmission.score}/
          {assignmentQuiz.totalPoints}
        </td>
      </tr>
    );
  };

  return (
    <Container className="p-5" fluid>
      <Row className="justify-content-center">
        <Col xs={12} sm={10}>
          <div className="p-5 shadow rounded">
            <div className="text-center">
              <h1>
                {course.name} Grades for {user.firstName} {user.lastName}
              </h1>
              <Button variant="primary" type="button" onClick={toCourse} className="width-200 mt-1">
                Course
              </Button>
            </div>
            <hr className="m-4" />
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Due Date</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {assignmentsQuizzes.map((assignmentQuiz) => createGrade(assignmentQuiz))}
              </tbody>
            </Table>
            {totalPoints > 0 && (
              <h2 className="text-center">
                Total: {totalScore}/{totalPoints} ({((totalScore / totalPoints) * 100).toFixed(2)}%)
              </h2>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
