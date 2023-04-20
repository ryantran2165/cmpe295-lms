import React, {useState,useRef} from 'react';
import Header from '../common/Header';
import UserHeader from '../common/UserHeader';
import {useNavigate, useLocation} from 'react-router-dom';
import axios from 'axios';
import { FaPencilAlt } from "react-icons/fa";
import Container from 'react-bootstrap/esm/Container';
import QAPage2 from './QAPage2';
import {format, isPast} from 'date-fns';

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
  const pastAssignments = useRef(null);
  const upcomingAssignments = useRef(null);
  const questions = useRef(null);
  const allSubmissionDetailsDiv = useRef(null);
  const studentSubmissionDetailsDiv = useRef(null);

  
  const history = useNavigate();
  const axios = require('axios').default || require('axios');
  const[name, setName] = useState('');
  const[points, setPoints] = useState('');
  const[dueDate, setDuedate] = useState('');
  const [quizQuestions, setQuizQuestions] = useState([{ name: "",description: "", funcDef: "", points: "", solution: "", testCases: [{input: "", output: ""}]}]);
  const [quizList, setQuizList] = useState([]);
  const [pastQuizList, setPastQuizList] = useState([]);
  const [upcomingQuizList, setUpcomingQuizList] = useState([]);
  const [allSubmissionDetails, setAllSubmissionDetails] = useState([
    { _id: "",
      assignmentQuiz: {
        _id: "",
        course: "",
        type: "",
        name: "",
        description:"",
        dueDate: "",
        totalPoints: "",
        questions: [{
          _id: "",
          name: "",
          description:"",
          funcDef: "",
          solution: "",
          points: "",
          testCases: [
            {
              _id: "",
               input: "",
               output:""
            }
          ]
        }
        ],
        __v: ""
      }, 
      student: "", 
      score: "",
      dateSubmitted: "", 
      answers: [
        {
        _id: "",  
        question: "", 
        fileURL: "",
        points: ""
      }
    ],
    __v: ""
    }
  ]);
  const [studentSubmissionDetails, setStudentSubmissionDetails] = useState([
    { _id: "",
      assignmentQuiz: {
        _id: "",
        course: "",
        type: "",
        name: "",
        description:"",
        dueDate: "",
        totalPoints: "",
        questions: [{
          _id: "",
          name: "",
          description:"",
          funcDef: "",
          solution: "",
          points: "",
          testCases: [
            {
              _id: "",
               input: "",
               output:""
            }
          ]
        }
        ],
        __v: ""
      }, 
      student: "", 
      score: "",
      dateSubmitted: "", 
      answers: [
        {
        _id: "",  
        question: "", 
        fileURL: "",
        points: ""
      }
    ],
    __v: ""
    }
  ]);  
  const[instruction, setInstruction] = useState('');
  

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
    setQuizQuestions([{ name: "",description: "", funcDef: "", points: "", solution: "", testCases: [{input: "", output: ""}]}]);
    getAssignmentsButton.current.style.display = 'contents';
    createAssignmentForm.current.style.display = 'none';
    if(user.role ==='teacher')
    createAssignmentButton.current.style.display='contents';
    pastAssignments.current.style.display = 'none';
    upcomingAssignments.current.style.display = 'none';
  };

  const backHome = () => {
    getAssignmentsButton.current.style.display = 'contents';
    createAssignmentForm.current.style.display = 'none';
    if(user.role ==='teacher')
    createAssignmentButton.current.style.display='contents';
    pastAssignments.current.style.display = 'none';
    upcomingAssignments.current.style.display = 'none';
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

  const handleInstructionChange = (event) => {
    setInstruction(event.target.value);
  }

var addQuestion = () => {
    setQuizQuestions([...quizQuestions, { name: "",description: "", funcDef: "", points: "", solution: "", testCases: [{input: "", output: ""}]}]);
  }

var removeQuestion = (i) => {
    var newquizQuestions = [...quizQuestions];
    newquizQuestions.splice(i, 1);
    setQuizQuestions(newquizQuestions);
}

var handleTestcaseChange = (index1, index2, e) => {
  var newquizQuestions = [...quizQuestions];
  newquizQuestions[index1].testCases[index2][e.target.name] = e.target.value;
  setQuizQuestions(newquizQuestions);
}

var addTestCase = (index1) => {
  const newTestCase = { input: "", output: "" };
  const updatedTestCases = [...quizQuestions[index1].testCases, newTestCase];
  const updatedQuizQuestions = {...quizQuestions[index1], testCases: updatedTestCases}
  const newQuizQuestions = [...quizQuestions];
  newQuizQuestions[index1] = updatedQuizQuestions;
  setQuizQuestions(newQuizQuestions);
}

var removeTestcase = (index1, index2) => {
  var newquizQuestions = [...quizQuestions];
  newquizQuestions[index1].testCases.splice(index2, 1);
  setQuizQuestions(newquizQuestions);
}


const arrangeQuizzes = () => {
   var past = [];
   var upcoming = [];
   console.log("response length",quizList.length);
   quizList.map((quiz, index) => {
      if(new Date(quiz.dueDate).isBefore(new Date()))
      past.push(quiz);
      else
      upcoming.push(quiz);
   })

   setPastQuizList(past);
   setUpcomingQuizList(upcoming);

   console.log("sorted", past, upcoming);
}

  const getAssignments = () =>{
    axios.get(`http://localhost:3001/api/v1/assgs/coursequizzes/${course.cid}`)
    .then(function (response) {
        setQuizList(response.data);
        var past = [];
        var upcoming = [];
        response.data.map((quiz, index) => {
          var dueDate = new Date(quiz.dueDate);
            if(isPast(dueDate))
            past.push(quiz);
            else
            upcoming.push(quiz);
        })
        setPastQuizList(past);
        setUpcomingQuizList(upcoming);
        getAssignmentsButton.current.style.display = 'none';
        pastAssignments.current.style.display = 'contents';
        upcomingAssignments.current.style.display = 'contents';
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
        axios.post('http://localhost:3001/api/v1/assgs/', {
          course: course.cid,
          type: 'quiz',
          name: name,
          description: instruction,
          dueDate: format(new Date(dueDate), "MM-dd-yyyy"),
          totalPoints: points,
          questions: quizQuestions
        })
        .then(function (response) {
          if(response.status === 200)
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
            assignmentId: quiz._id,
            assignmentName: quiz.name,
            assignmentDescription: quiz.description,
            questions: quiz.questions,
            parentCourse:course.cid,
            assignmentNumber: index+1,
            cname: course.cname,
            instructorFname: course.instructorFname,
            instructorLname: course.instructorLname,
            instructorEmail: course.instructorEmail,
            caller: 'quizPage'}});
  }

  

  const openSubmissionDetails = async(event,quizId) =>{
    var studentId = '6406547d2891c63dfee04af1';
    var quizIds = '64253188c45a333fbcd4d41e';
    event.preventDefault();
    event.stopPropagation();
    if(user.role === 'teacher'){
        axios.get(`http://localhost:3001/api/v1/assgs/submissions/${quizId}`)
        .then(function (response) {
          setAllSubmissionDetails(response.data);
            getAssignmentsButton.current.style.display = 'none';
            pastAssignments.current.style.display = 'none';
            upcomingAssignments.current.style.display = 'none';
            allSubmissionDetailsDiv.current.style.display = 'contents';
            createAssignmentButton.current.style.display='none';
            createAssignmentForm.current.style.display='none';
          })
          .catch(function (error) {
            console.log(error);
          });
    }

    if(user.role === 'student'){
      axios.get(`http://localhost:3001/api/v1/assgs/stusubmission/${quizId}/${user.userId}`)
      .then(function (response) {
        setStudentSubmissionDetails(response.data);
          getAssignmentsButton.current.style.display = 'none';
          pastAssignments.current.style.display = 'none';
          upcomingAssignments.current.style.display = 'none';
          studentSubmissionDetailsDiv.current.style.display = 'contents';
        })
        .catch(function (error) {
          console.log(error);
        });
  }
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
              pastAssignments.current.style.display = 'none';
              upcomingAssignments.current.style.display = 'none';
              allSubmissionDetailsDiv.current.style.display = 'none';
              studentSubmissionDetailsDiv.current.style.display = 'none';
              if(user.role ==='teacher')
              createAssignmentButton.current.style.display='block';
    }

    const getQuizDueDate = (rawDate) =>{
      var formattedDate = format(new Date(rawDate), "MMMM do, yyyy");
      return formattedDate;
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
   
                    <span style={{display:'none'}} ref={upcomingAssignments}> 
                    <span className="currentAssignments">Upcoming Quizzes </span>
                    <div className="item-list">
                        <ul>
                        {
                            upcomingQuizList.map((quiz,index) => 
                                    <li key={index}>
                                        <div className="list-area-header">
                                        <h4>Quiz {index+1}</h4>
                                        <p>Deadline: {getQuizDueDate(quiz.dueDate)}</p>
                                        </div>
                                        <div className="list-details">
                                        <p>{quiz.name} <span style={{display:'inline', marginLeft:194}}>Points: {quiz.totalPoints} </span></p>
                                        <p>{quiz.description} </p>
                                        <a href='' style={{marginRight:10}}  onClick={() => openQAPage(quiz, index)}>Attemp</a>
                                        <a href='' onClick={(event) => openSubmissionDetails(event,quiz._id)}>View Submission</a>
                                        </div>
                                    </li>
                            )
                            
                        }
                    </ul>
                    </div>
                    </span>
                    <span style={{display:'none'}} ref={pastAssignments} > 
                    <span className="pastAssignments">Past Quizzes </span>
                    <div className="item-list">
                        <ul>
                        {
                            pastQuizList.map((quiz,index) => 
                                    <li key={index}>
                                        <div className="list-area-header">
                                        <h4>Quiz {index+1}</h4>
                                        <p>Deadline: {getQuizDueDate(quiz.dueDate)}</p>
                                        </div>
                                        <div className="list-details">
                                        <p>{quiz.name} <span style={{display:'inline', marginLeft:194}}>Points: {quiz.totalPoints} </span></p>
                                        <p>{quiz.description} </p>
                                        <a href='' onClick={(event) => openSubmissionDetails(event,quiz._id)}>View Submission</a>
                                        </div>
                                    </li>
                            )
                            
                        }
                    </ul>
                    </div>
                    </span>

                    <span style={{display:'none'}} ref={studentSubmissionDetailsDiv} > 
                    <span className="pastAssignments">Quiz Submission Details </span>
                    <div className="item-list">
                    {studentSubmissionDetails.length === 0  &&(<span>Currently there are no submissions for this quiz</span>)}
                    <ul>
                    {studentSubmissionDetails.map((submissionDetail) => (
                        <li>
                        <div key={submissionDetail._id}>
                          <h2>{submissionDetail.assignmentQuiz.name}</h2>
                          <p>{submissionDetail.assignmentQuiz.description}</p>
                          <ul>
                            
                          {submissionDetail.assignmentQuiz.questions.map((question) => (
                            <li>
                                  <div key={question._id}>
                                    <h3>{question.name}</h3>
                                    <p>{question.description}</p>
                                    <p>{question.solution}</p>
                                    {submissionDetail.answers.map((answer) => {
                                      if (answer.question === question._id) {
                                        return (
                                        <a key={answer._id} href={answer.fileURL}>
                                          Download answer image
                                        </a>
                                        );
                                      } else {
                                        return null;
                                      }
                                    })}
                                
                                  </div>
                                  </li>
                            ))}
                          </ul>
                        </div>
                        </li>
                    ))}
                    </ul>
                    </div>
                    </span>

                    <span style={{display:'none'}} ref={allSubmissionDetailsDiv} > 
                    <span className="pastAssignments"> Quiz Submission Details </span>
                    <div className="item-list">
                    {allSubmissionDetails.length === 0  &&(<span>Currently there are no submissions for this quiz</span>)}
                    <ul>
                        {allSubmissionDetails.map((submissionDetail) => (
                          <li>
                          <div key={submissionDetail._id}>
                          <h2>{submissionDetail.assignmentQuiz.name}</h2>
                          <p>{submissionDetail.assignmentQuiz.description}</p>
                            <p>Submitted by: {submissionDetail.student}</p>
                            <ul>
                            {submissionDetail.assignmentQuiz.questions.map((question) => (
                              <li>
                              <div key={question._id}>
                                <h3>{question.name}</h3>
                                <p>{question.description}</p>
                                <p>{question.solution}</p>
                                {submissionDetail.answers.map((answer) => {
                                  if (answer.question === question._id) {
                                    return (
                                      <a key={answer._id} href={answer.fileURL}>
                                        Download answer image
                                      </a>
                                    );
                                  } else {
                                    return null;
                                  }
                                })}
                              </div>
                              </li>
                              ))}
                              </ul>
                          </div>
                          </li>
                    ))}
                    </ul>
                    </div>
                    </span>

                    <span style={{display:'none'}} ref={createAssignmentForm} className="createCourse">
                        <div className="createQuizFormHeading"><h1>Create Quiz</h1></div>
                        <form className="createNewQuizForm" onSubmit={createAssignment}>
                            <input type="text" name="name" placeholder="Quiz Name" value = {name} onChange={handleNameChange} />
                            <input type="text" name="instructions" placeholder="Add description" value = {instruction} onChange={handleInstructionChange} />
                            <input type="text" name="points" placeholder="Quiz Points" value = {points} onChange={handlePointChange} />
                            <input type="date" name="dueDate" placeholder="Select deadline" value = {dueDate} onChange={handleDateChange} />
                            <button type="button" className="addButton" onClick={() => addQuestion()}>Add Question</button>
                            {quizQuestions.map((element, index1) => (
                                <div className="form-inline" key={index1}>
                                <input type="text" name="name" placeholder="Add question name" value={element.name || ""} onChange={e => handleQuestionChange(index1, e)} />
                                <input type="text" name="description" placeholder="Add question description" value={element.description || ""} onChange={e => handleQuestionChange(index1, e)} />
                                <input type="text" name="funcDef" placeholder="Add Function definition" value={element.funcDef || ""} onChange={e => handleQuestionChange(index1, e)} />
                                <input type="text" name="points" placeholder="Add points" value={element.points || ""} onChange={e => handleQuestionChange(index1, e)} />
                                <input type="text" name="solution" placeholder="Add solution" value={element.solution || ""} onChange={e => handleQuestionChange(index1, e)} />
                                {
                                    index1 ? 
                                    <button type="button" className="removeButton" onClick={() => removeQuestion(index1)}>Remove Question</button> 
                                    : null
                                }
                                <button type="button" className="addButton" onClick={() => addTestCase(index1)}>Add testcase</button>
                                
                                 { 
                                 element.testCases.map((tcase, index2) => (
                                   
                                  <div>
                                    <input type="text" name="input" placeholder="Enter input" value={tcase.input || ""} onChange={e => handleTestcaseChange(index1, index2, e)}/>
                                    <input type="text" name="output" placeholder="Enter output" value={tcase.output || ""} onChange={e => handleTestcaseChange(index1, index2, e)}/>
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



