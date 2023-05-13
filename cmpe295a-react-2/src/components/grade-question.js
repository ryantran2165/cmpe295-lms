import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Form from "react-bootstrap/Form";
import axios from "axios";

export default function GradeQuestion() {
  const [points, setPoints] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state === null) {
      navigate("/");
    }

    setPoints(answer.points);
  }, []);

  if (location.state === null) {
    return;
  }

  const user = location.state.user;
  const course = location.state.course;
  const assignmentQuiz = location.state.assignmentQuiz;
  const submission = location.state.submission;
  const question = location.state.question;
  const answer = location.state.answer;
  const i = location.state.i;

  const gradeQuestion = (e) => {
    e.preventDefault();

    answer.points = parseInt(points);
    let score = 0;
    for (const answer of submission.answers) {
      score += answer.points;
    }
    submission.score = score;

    axios
      .put(`http://localhost:3001/api/v1/assgs/grade/${submission._id}`, submission)
      .then(function (response) {
        toGradeSubmission();
      })
      .catch(function (e) {
        console.log(e);
      });
  };

  const toGradeSubmission = () => {
    navigate(`/grade-submission`, {
      state: {
        user: user,
        course: course,
        assignmentQuiz: assignmentQuiz,
        submission: submission,
      },
    });
  };

  return (
    <Container className="p-5" fluid>
      <Row className="justify-content-center">
        <Col xs={12} sm={10}>
          <div className="p-5 shadow rounded">
            <div className="text-center">
              <h1>Grade {question.name}</h1>
              <Button
                variant="primary"
                type="button"
                onClick={toGradeSubmission}
                className="width-200 mt-1"
              >
                Grade Submission
              </Button>
              <hr className="m-4" />
              <h2>
                {i + 1}. {question.name} ({answer.points}/{question.points} points)
              </h2>
              <h4>{question.description}</h4>
              <a href={answer.fileURL}>
                <Image src={answer.fileURL} className="max-height-200 mt-1" rounded fluid />
              </a>
            </div>
            <Form onSubmit={gradeQuestion}>
              <Form.Group>
                <Form.Label>Points</Form.Label>
                <Form.Control
                  type="number"
                  step={1}
                  min={0}
                  max={question.points}
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100 mt-3">
                Save
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
