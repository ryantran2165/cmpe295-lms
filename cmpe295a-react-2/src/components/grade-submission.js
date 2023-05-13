import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Form from "react-bootstrap/Form";

export default function GradeSubmission() {
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
  const course = location.state.course;
  const assignmentQuiz = location.state.assignmentQuiz;
  const submission = location.state.submission;

  const toGradeAssignmentQuiz = () => {
    navigate(`/grade-assignment-quiz`, {
      state: {
        user: user,
        course: course,
        assignmentQuiz: assignmentQuiz,
      },
    });
  };

  const toGradeQuestion = (question, answer, i) => {
    navigate(`/grade-question`, {
      state: {
        user: user,
        course: course,
        assignmentQuiz: assignmentQuiz,
        submission: submission,
        question: question,
        answer: answer,
        i: i,
      },
    });
  };

  const createQuestion = (question, i) => {
    let answer = null;
    for (const ans of submission.answers) {
      if (ans.question === question._id) {
        answer = ans;
        break;
      }
    }
    return (
      <Row key={question._id} className={(i > 0 ? "mt-5" : "") + " justify-content-center"}>
        <Col>
          <h2>
            {i + 1}. {question.name} ({answer === null ? 0 : answer.points}/{question.points}{" "}
            points)
          </h2>
          <h4>{question.description}</h4>
          <Form.Control type="text" value={question.funcDef} readOnly={true} />
          {(answer === null || !("fileURL" in answer)) && <h5 className="mt-3">No answer</h5>}
          {answer !== null && (
            <>
              <Row>
                <Col>
                  <a href={answer.fileURL}>
                    <Image src={answer.fileURL} className="max-height-200 mt-3" rounded fluid />
                  </a>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button
                    variant="primary"
                    type="button"
                    onClick={() => toGradeQuestion(question, answer, i)}
                    className="mt-3 width-200"
                  >
                    Grade
                  </Button>
                </Col>
              </Row>
            </>
          )}
        </Col>
      </Row>
    );
  };

  return (
    <Container className="p-5" fluid>
      <Row className="justify-content-center">
        <Col xs={12} sm={10}>
          <div className="p-5 shadow rounded">
            <div className="text-center">
              <h1>Grade {assignmentQuiz.name}</h1>
              <h4>
                submitted {submission.dateSubmitted} | {submission.score}/
                {assignmentQuiz.totalPoints} points
              </h4>
              <Button
                variant="primary"
                type="button"
                onClick={toGradeAssignmentQuiz}
                className="width-200 mt-1"
              >
                Submissions
              </Button>
              <hr className="m-4" />
              {assignmentQuiz.questions.map((question, i) => createQuestion(question, i))}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
