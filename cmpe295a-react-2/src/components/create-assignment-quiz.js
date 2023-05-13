import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { format } from "date-fns";

export default function CreateAssignmentQuiz() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState(0);
  const [dueDate, setDueDate] = useState("");
  const [questions, setQuestions] = useState([
    {
      name: "",
      description: "",
      funcDef: "",
      points: 0,
      solution: "",
      testCases: [{ input: "", output: "" }],
    },
  ]);
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
  const type = location.state.type;

  const createAssignmentQuiz = (e) => {
    e.preventDefault();

    for (const question of questions) {
      question.points = parseInt(question.points);
    }
    axios
      .post("http://localhost:3001/api/v1/assgs/", {
        course: course._id,
        type: type,
        name: name,
        description: description,
        dueDate: format(new Date(dueDate), "MM-dd-yyyy"),
        totalPoints: parseInt(points),
        questions: questions,
      })
      .then(function (response) {
        if (response.data.status === true) {
          toAssignmentsQuizzes();
        } else {
          alert("Assignment creation failed! ");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const addQuestion = () => {
    questions.push({
      name: "",
      description: "",
      funcDef: "",
      points: 0,
      solution: "",
      testCases: [{ input: "", output: "" }],
    });
    setQuestions([...questions]);
  };

  const addTestCase = (question) => {
    question.testCases.push({
      input: "",
      output: "",
    });
    setQuestions([...questions]);
  };

  const setQuestionProperty = (question, property, e) => {
    question[property] = e.target.value;
    setQuestions([...questions]);
  };

  const toAssignmentsQuizzes = () => {
    navigate(`/${type === "assignment" ? "assignments" : "quizzes"}`, {
      state: {
        user: user,
        course: course,
      },
    });
  };

  return (
    <Container className="p-5" fluid>
      <Row className="justify-content-center">
        <Col xs={12} sm={10}>
          <div className="p-5 shadow rounded">
            <div className="text-center">
              <h1>Create {type.charAt(0).toUpperCase() + type.slice(1)}</h1>
              <Button
                variant="primary"
                type="button"
                onClick={toAssignmentsQuizzes}
                className="width-200 mt-1"
              >
                {type === "assignment" ? "Assignments" : "Quizzes"}
              </Button>
            </div>
            <hr className="m-4" />
            <Form onSubmit={createAssignmentQuiz}>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label>Points</Form.Label>
                <Form.Control
                  type="number"
                  step={1.0}
                  min={0}
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label>Due Date</Form.Label>
                <Form.Control
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </Form.Group>
              <div className="my-4">
                <h2>Questions</h2>
                {questions.map((question, i) => (
                  <div key={`q-${i}`} className="shadow rounded mt-3 p-4">
                    <Form.Group>
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={question.name}
                        onChange={(e) => setQuestionProperty(question, "name", e)}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mt-3">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        type="text"
                        value={question.description}
                        onChange={(e) => setQuestionProperty(question, "description", e)}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mt-3">
                      <Form.Label>Function Definition</Form.Label>
                      <Form.Control
                        type="text"
                        value={question.funcDef}
                        onChange={(e) => setQuestionProperty(question, "funcDef", e)}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mt-3">
                      <Form.Label>Points</Form.Label>
                      <Form.Control
                        type="number"
                        step={1.0}
                        min={0}
                        value={question.points}
                        onChange={(e) => setQuestionProperty(question, "points", e)}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mt-3">
                      <Form.Label>Solution</Form.Label>
                      <Form.Control
                        type="text"
                        value={question.solution}
                        onChange={(e) => setQuestionProperty(question, "solution", e)}
                      />
                    </Form.Group>
                    <h3 className="mt-3">Test Cases</h3>
                    {question.testCases.map((testCase, j) => (
                      <div key={`tc-${j}`} className="shadow rounded mt-3 p-4">
                        <Form.Group>
                          <Form.Label>Input</Form.Label>
                          <Form.Control
                            type="text"
                            value={testCase.input}
                            onChange={(e) => setQuestionProperty(testCase, "input", e)}
                            required
                          />
                        </Form.Group>
                        <Form.Group className="mt-3">
                          <Form.Label>Ouput</Form.Label>
                          <Form.Control
                            type="text"
                            value={testCase.output}
                            onChange={(e) => setQuestionProperty(testCase, "output", e)}
                            required
                          />
                        </Form.Group>
                      </div>
                    ))}
                    <Button
                      variant="primary"
                      type="button"
                      className="w-100 mt-3"
                      onClick={() => addTestCase(question)}
                    >
                      Add Test Case
                    </Button>
                  </div>
                ))}
                <Button
                  variant="primary"
                  type="button"
                  className="w-100 mt-3"
                  onClick={addQuestion}
                >
                  Add Question
                </Button>
              </div>
              <Button variant="primary" type="submit" className="w-100 mt-3">
                Create
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
