import React, {useState,useRef} from 'react';
import Header from '../common/Header';
import UserHeader from '../common/UserHeader';
import {useNavigate, useLocation} from 'react-router-dom';
import axios from 'axios';
import { FaPencilAlt } from "react-icons/fa";
import Container from 'react-bootstrap/esm/Container';
import QAPage2 from './QAPage2';

function QuizPage() {

  {/*Adding and removing dynamic form fields code reference from 
   
  https://stackblitz.com/edit/react-vjfjzz?file=src%2FApp.js

  https://stackoverflow.com/questions/66469913/how-to-add-input-field-dynamically-when-user-click-on-button-in-react-js

  https://sadam-bapunawar.medium.com/add-and-remove-form-fields-dynamically-using-react-and-react-hooks-3b033c3c0bf5

  https://www.sjinnovation.com/add-and-remove-form-fields-dynamically-react-and-react-hooks

  */}  

  const getAssignmentsButton = useRef(null);
  const createAssignmentButton = useRef(null);
  const createAssignmentForm = useRef(null);
  const currentAssignments = useRef(null);
  const questions = useRef(null);

  
  const history = useNavigate();
  const axios = require('axios').default || require('axios');
  const[name, setName] = useState('');
  const[points, setPoints] = useState('');
  const[dueDate, setDuedate] = useState('');
  const [quizQuestions, setQuizQuestions] = useState([{ question: "", points: "", solution: "", testcases: [{testCaseInput: "", testCaseOutput: ""}]}]);
  const [quizList, setQuizList] = useState([]);
  const [quizQuestionsList, setQuizQuestionsList] = useState([]);
  

  const location = useLocation();
    const [user, setUser] = useState({
                firstName: location.state.firstName,
                lastName: location.state.lastName,
                userName: location.state.userName,
                email: location.state.email,
                role: location.state.role,
                userId: location.state.userId
        });
        const [course, setCourse] = useState({
            cname: location.state.cname,
            cid: location.state.parentCourse,
            instructorFname: location.state.instructorFname,
            instructorLname: location.state.instructorLname,
            instructorEmail:location.state.instructorEmail
    });


 {/*install axios package version 1.0.0 since latest is having problems */}
  const handleCancel = () => {
    setName('');
    setPoints('');
    setDuedate('');
    setQuizQuestions([{ question: "", points: "", solution: "", testcases: [{testCaseInput: "", testCaseOutput: ""}]}]);
    getAssignmentsButton.current.style.display = 'contents';
    createAssignmentForm.current.style.display = 'none';
    if(user.role ==='teacher')
    createAssignmentButton.current.style.display='contents';
    currentAssignments.current.style.display = 'none';
  };

  const backHome = () => {
    getAssignmentsButton.current.style.display = 'contents';
    createAssignmentForm.current.style.display = 'none';
    if(user.role ==='teacher')
    createAssignmentButton.current.style.display='contents';
    currentAssignments.current.style.display = 'none';
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handlePointChange = (event) => {
    setPoints(event.target.value);
  };

  const handleDateChange = (event) => {
    setDuedate(event.target.value);
  };

  var handleQuestionChange = (i, e) => {
    var newquizQuestions = [...quizQuestions];
    newquizQuestions[i][e.target.name] = e.target.value;
    setQuizQuestions(newquizQuestions);
  }

var addQuestion = () => {
    setQuizQuestions([...quizQuestions, { question: "", points: "", solution: "", testcases: [{testCaseInput: "", testCaseOutput: ""}]}]);
  }

var removeQuestion = (i) => {
    var newquizQuestions = [...quizQuestions];
    newquizQuestions.splice(i, 1);
    setQuizQuestions(newquizQuestions);
}

var handleTestcaseChange = (index1, index2, e) => {
  var newquizQuestions = [...quizQuestions];
  newquizQuestions[index1].testcases[index2][e.target.name] = e.target.value;
  setQuizQuestions(newquizQuestions);
}

var addTestCase = (index1) => {
  const newTestCase = { testCaseInput: "", testCaseOutput: "" };
  const updatedTestCases = [...quizQuestions[index1].testcases, newTestCase];
  const updatedQuizQuestions = {...quizQuestions[index1], testcases: updatedTestCases}
  const newQuizQuestions = [...quizQuestions];
  newQuizQuestions[index1] = updatedQuizQuestions;
  setQuizQuestions(newQuizQuestions);
}

var removeTestcase = (index1, index2) => {
  var newquizQuestions = [...quizQuestions];
  newquizQuestions[index1].testcases.splice(index2, 1);
  setQuizQuestions(newquizQuestions);
}


  const getAssignments = () =>{
    axios.get(`http://localhost:3001/api/v1/quizzes/bycourse/${course.cid}`)
    .then(function (response) {
        setQuizList(response.data);
        getAssignmentsButton.current.style.display = 'none';
        currentAssignments.current.style.display = 'contents';
        if(user.role ==='teacher')
        createAssignmentButton.current.style.display='none';
      })
      .catch(function (error) {
        console.log(error);
      });
}

const showCreateAssignmentForm = () =>{
    createAssignmentForm.current.style.display='block';
    getAssignmentsButton.current.style.display='none';
    if(user.role ==='teacher')
        createAssignmentButton.current.style.display='none';
}

const createAssignment = async(event) =>{
    event.preventDefault();
    event.stopPropagation();
    console.log(quizQuestions);
   if(points.trim().length === 0 || dueDate === null){
      alert("One or more form fields are empty, please fill out !");
    }
    else if(quizQuestions[0].question=== ''){
      alert("Quiz should have atleast one question!");
    }
    else{
        axios.post('http://localhost:3001/api/v1/quizzes/', {
          course: course.cid,
          points: points,
          dueDate: dueDate,
          name: name,
          questions: quizQuestions
        })
        .then(function (response) {
          if(response.data.status === true)
          {
            createAssignmentForm.current.style.display='none';
            getAssignmentsButton.current.style.display='block';
            if(user.role ==='teacher')
              createAssignmentButton.current.style.display='block';
            alert("New quiz created successfully");
          }
          
          else{
            alert("Quiz creation failed! ");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      }
  }
  const openQAPage = (quiz,index) =>{
    history("/qapage", {state:{userName:user.userName,
            email:user.email, 
            role:user.role,
            firstName:user.firstName,
            lastName:user.lastName,
            userId: user.userId,
            assignmentId: quiz.id,
            assignmentInstructions: quiz.name,
            parentCourse:course.cid,
            assignmentNumber: index+1,
            cname: course.cname,
            instructorFname: course.instructorFname,
            instructorLname: course.instructorLname,
            instructorEmail: course.instructorEmail}});
  }

  const openQuestionList = (quizId, parentCourse, index) =>{
    alert("open question list");
    getQuizQuestions();
    questions.current.style.display = 'contents';
  }

  const getQuizQuestions = async() =>{
    alert("get quiz question list");
    axios.get('http://localhost:3001/api/v1/quizzes/')
    .then(function (response) {
      alert("got questions");
      setQuizQuestionsList(response.data);
        getAssignmentsButton.current.style.display = 'none';
        currentAssignments.current.style.display = 'none';
        questions.current.style.display = 'contents';
      })
      .catch(function (error) {
        console.log(error);
      });
}

    const gotoDashBoard = (event) => {
            history("/UserDashBoard",{state:{userName:user.userName,
                email:user.email, 
                role:user.role,
                firstName:user.firstName,
                lastName:user.lastName,
                userId: user.userId}});
    }

    const openAssignments = () =>{
      history("/assignmentpage", {state:{userName:user.userName,
              email:user.email, 
              role:user.role,
              firstName:user.firstName,
              lastName:user.lastName,
              userId: user.userId,
              parentCourse:course.cid,
              cname: course.cname,
              instructorFname: course.instructorFname,
              instructorLname: course.instructorLname,
              instructorEmail:course.instructorEmail
          }});
    }

    const openQuizzes = () =>{
              getAssignmentsButton.current.style.display = 'block';
              currentAssignments.current.style.display = 'none';
              if(user.role ==='teacher')
              createAssignmentButton.current.style.display='block';
    }


  return (
    <>
    {/*
    form code reference https://react-bootstrap.github.io/forms/overview/ 
    */}
    <div className="backgroundDecoration">
    <div className="leftnav">
                        <a onClick={openAssignments}>Assignments</a>
                        <a onClick={openQuizzes}>Quizzes</a>
                        <a onClick={gotoDashBoard}>Dashboard</a>
    </div>
     <div className="listBackground">
     <span id="getQuizzes" ref={getAssignmentsButton}><input type="button" value="See Current Quizzes" onClick={getAssignments}/></span>
                    {user.role === 'teacher' && <span id="createQuizzes" ref={createAssignmentButton}><input type="button" value="Create Quiz" onClick={showCreateAssignmentForm}/></span>}
   
                    <span style={{display:'none'}} ref={currentAssignments} className="currentAssignments">
                    <div className="item-list">
                        <ul>
                        {
                            quizList.map((quiz,index) => 
                                    <li key={index}>
                                        <div className="list-area-header">
                                        <h4>Quiz {index+1}</h4>
                                        <p>Deadline: {quiz.dueDate}</p>
                                        </div>
                                        <div className="list-details">
                                        <p>{quiz.name} <span style={{display:'inline', marginLeft:194}}>Points: {quiz.points} </span></p>
                                        
                                        <a href='' onClick={() => openQAPage(quiz, index)}>Check out</a>
                                        </div>
                                    </li>
                            )
                            
                        }
                    </ul>
                    </div>
                    </span>

                    <span style={{display:'none'}} ref={createAssignmentForm} className="createCourse">
                        <div className="createQuizFormHeading"><h1>Create Quiz</h1></div>
                        <form className="createNewQuizForm" onSubmit={createAssignment}>
                            <input type="text" name="name" placeholder="Quiz Name" value = {name} onChange={handleNameChange} />
                            <input type="text" name="points" placeholder="Quiz Points" value = {points} onChange={handlePointChange} />
                            <input type="date" name="dueDate" placeholder="Select deadline" value = {dueDate} onChange={handleDateChange} />
                            <button type="button" className="addButton" onClick={() => addQuestion()}>Add Question</button>
                            {quizQuestions.map((element, index1) => (
                                <div className="form-inline" key={index1}>
                                <input type="text" name="question" placeholder="Add question" value={element.question || ""} onChange={e => handleQuestionChange(index1, e)} />
                                <input type="text" name="points" placeholder="Add points" value={element.points || ""} onChange={e => handleQuestionChange(index1, e)} />
                                <input type="text" name="solution" placeholder="Add solution" value={element.solution || ""} onChange={e => handleQuestionChange(index1, e)} />
                                {
                                    index1 ? 
                                    <button type="button" className="removeButton" onClick={() => removeQuestion(index1)}>Remove Question</button> 
                                    : null
                                }
                                <button type="button" className="addButton" onClick={() => addTestCase(index1)}>Add testcase</button>
                                
                                 { 
                                 element.testcases.map((tcase, index2) => (
                                   
                                  <div>
                                    <input type="text" name="testCaseInput" placeholder="Enter input" value={tcase.testCaseInput || ""} onChange={e => handleTestcaseChange(index1, index2, e)}/>
                                    <input type="text" name="testCaseOutput" placeholder="Enter output" value={tcase.testCaseOutput || ""} onChange={e => handleTestcaseChange(index1, index2, e)}/>
                                    {
                                    index2 ? 
                                    <button type="button" className="removeButton" onClick={() => removeTestcase(index1, index2)}>Remove Testcase</button> 
                                    : null
                                   }
                                  </div>

                                  
                                ))
                                }
                                </div>
                            ))}
                            <input type="submit" id='button1' value="Create"/>
                            <input type="reset" id='button2' value="Cancel" onClick={handleCancel}/>
                        </form>
                    </span>
    </div>
    </div>
    </>
  )
}

export default QuizPage;



