import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import axios from "axios";

export default function ToGradeAssignmentQuiz() {
  const [students, setStudents] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state === null) {
      navigate("/");
    }

    const promises = [];
    for (const student of course.students) {
      const promise = axios
        .get(
          `api/v1/assgs/stusubmission/${assignmentQuiz._id}/${student._id}`
        )
        .then(function (response) {
          const submissions = response.data;
          submissions.sort((a, b) => {
            return new Date(a.dateSubmitted) - new Date(b.dateSubmitted);
          });
          let lastSubmission = submissions.length > 0 ? submissions[submissions.length - 1] : null;
          student["lastSubmission"] = lastSubmission;
        })
        .catch(function (e) {
          console.log(e);
        });
      promises.push(promise);
    }

    Promise.all(promises)
      .then(function (response) {
        const s = course.students.filter((student) => student.lastSubmission !== null);
        setStudents(s);
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
  const assignmentQuiz = location.state.assignmentQuiz;

  const toAssignmentsQuizzes = () => {
    navigate(`/${assignmentQuiz.type === "assignment" ? "assignments" : "quizzes"}`, {
      state: {
        user: user,
        course: course,
      },
    });
  };

  const toGradeSubmission = (lastSubmission) => {
    navigate("/grade-submission", {
      state: {
        user: user,
        course: course,
        assignmentQuiz: assignmentQuiz,
        submission: lastSubmission,
      },
    });
  };

  return (
    <Container className="p-5" fluid>
      <Row className="justify-content-center">
        <Col xs={12} sm={10}>
          <div className="p-5 shadow rounded">
            <div className="text-center">
              <h1>Grade {assignmentQuiz.name}</h1>
              <h4>
                due {assignmentQuiz.dueDate} | {assignmentQuiz.totalPoints} points
              </h4>
              <Button
                variant="primary"
                type="button"
                onClick={toAssignmentsQuizzes}
                className="width-200 mt-1"
              >
                {assignmentQuiz.type === "assignment" ? "Assignments" : "Quizzes"}
              </Button>
            </div>
            <hr className="m-4" />
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Date Submitted</th>
                  <th>Score</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td>
                      {student.firstName} {student.lastName} ({student.username})
                    </td>
                    <td>
                      {student.lastSubmission.dateSubmitted}
                      {new Date(student.lastSubmission.dateSubmitted) >
                        new Date(assignmentQuiz.dueDate) && <span> (LATE)</span>}
                    </td>
                    <td>
                      {student.lastSubmission.score}/{assignmentQuiz.totalPoints}
                    </td>
                    <td>
                      <Button
                        variant="primary"
                        type="button"
                        onClick={() => toGradeSubmission(student.lastSubmission)}
                        className="width-100"
                      >
                        Grade
                      </Button>
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
