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
  const [code, setCode] = useState("");
  const [results, setResults] = useState(null);
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
      .put(`api/v1/assgs/grade/${submission._id}`, submission)
      .then(function (response) {
        toGradeSubmission();
      })
      .catch(function (e) {
        console.log(e);
      });
  };

  const parse = () => {
    axios
      .post("http://localhost:5000/parse", {
        url: answer.fileURL,
      })
      .then(function (response) {
        setCode(response.data);
      })
      .catch(function (e) {
        console.log(e);
      });
  };

  const repair = () => {
    axios
      .post("http://localhost:5000/repair", {
        code: code,
      })
      .then(function (response) {
        setCode(response.data);
      })
      .catch(function (e) {
        console.log(e);
      });
  };

  const grade = () => {
    axios
      .post("http://localhost:5000/grade", {
        funcDef: question.funcDef,
        code: code,
        testCases: question.testCases,
      })
      .then(function (response) {
        setResults(response.data);
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
              <Form.Control
                as="textarea"
                value={question.solution}
                readOnly={true}
                className="mt-3"
              />
              <hr className="m-4" />
              <h2>
                {i + 1}. {question.name} ({answer.points}/{question.points} points)
              </h2>
              <h4>{question.description}</h4>
              <Form.Control type="text" value={question.funcDef} readOnly={true} />
              <a href={answer.fileURL}>
                <Image src={answer.fileURL} className="max-height-200 mt-3" rounded fluid />
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
            <hr className="m-4" />
            <h2 className="text-center">Automated Grading</h2>
            <Row className="justify-content-center">
              <Col xs="auto">
                <Button variant="primary" type="button" className="width-200 mt-1" onClick={parse}>
                  Parse
                </Button>
              </Col>
              <Col xs="auto">
                <Button variant="primary" type="button" className="width-200 mt-1" onClick={repair}>
                  Repair
                </Button>
              </Col>
              <Col xs="auto">
                <Button variant="primary" type="button" className="width-200 mt-1" onClick={grade}>
                  Grade
                </Button>
              </Col>
            </Row>
            <Form.Control
              as="textarea"
              rows={5}
              className="mt-3"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            {results !== null && (
              <div className="mt-3">
                <h3>
                  Test Cases Passed: {results.passed} (
                  {((results.passed / (results.passed + results.failed)) * 100).toFixed(2)}%)
                </h3>
                <h3>
                  Test Cases Failed: {results.failed} (
                  {((results.failed / (results.passed + results.failed)) * 100).toFixed(2)}%)
                </h3>
                <Form.Control
                  as="textarea"
                  rows={5}
                  className="mt-3"
                  value={JSON.stringify(results)}
                  readOnly={true}
                />
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
