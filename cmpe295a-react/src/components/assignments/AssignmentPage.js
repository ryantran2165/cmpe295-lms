import React, {useState,useRef} from 'react';
import Header from '../common/Header';
import UserHeader from '../common/UserHeader';
import {useNavigate, useLocation} from 'react-router-dom';
import axios from 'axios';
import { FaPencilAlt } from "react-icons/fa";
import Container from 'react-bootstrap/esm/Container';
import QAPage2 from './QAPage2';
import { format, isPast } from "date-fns";

function AssignmentPage() {

  const getAssignmentsButton = useRef(null);
  const createAssignmentButton = useRef(null);
  const createAssignmentForm = useRef(null);
  const pastAssignments = useRef(null);
  const upcomingAssignments = useRef(null);
  const allSubmissionDetailsDiv = useRef(null);
  const studentSubmissionDetailsDiv = useRef(null);

  const location = useLocation();

  
  const history = useNavigate();
  const axios = require('axios').default || require('axios');
  const[name, setName] = useState('');
  const[points, setPoints] = useState('');
  const[dueDate, setDuedate] = useState('');
  const[solution, setSolution] = useState('');
  const[instruction, setInstruction] = useState('');
  const [assignmentList, setAssignmentList] = useState([]);
  const [pastAssignmentList, setPastAssignmentList] = useState([]);
  const [upcomingAssignmentList, setUpcomingAssignmentList] = useState([]);
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
  const [quizQuestions, setQuizQuestions] = useState([{ name: "",description: "", funcDef: "", points: "", solution: "", testCases: [{input: "", output: ""}]}]);

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
    setSolution('');
    setInstruction('');
    setQuizQuestions([{ name: "",description: "", funcDef: "", points: "", solution: "", testCases: [{input: "", output: ""}]}]);
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

  const handleInstructionChange = (event) => {
    setInstruction(event.target.value);
  }

  const handleSolutionChange = (event) => {
    setSolution(event.target.value);
  }

  var handleQuestionChange = (i, e) => {
    var newquizQuestions = [...quizQuestions];
    newquizQuestions[i][e.target.name] = e.target.value;
    setQuizQuestions(newquizQuestions);
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


  const getAssignments = () =>{
    axios.get(`http://localhost:3001/api/v1/assgs/courseassignments/${course.cid}`)
    .then(function (response) {
        setAssignmentList(response.data);
        var past = [];
        var upcoming = [];
        response.data.map((quiz, index) => {
          var dueDate = new Date(quiz.dueDate);
            if(isPast(dueDate))
            past.push(quiz);
            else
            upcoming.push(quiz);
        })
        setPastAssignmentList(past);
        setUpcomingAssignmentList(upcoming);
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
    console.log("questions", quizQuestions);
    if(points.trim().length === 0 || dueDate === null){
      alert("One or more form fields are empty, please fill out !");
    }
    else{
        axios.post('http://localhost:3001/api/v1/assgs/', {
          course: course.cid,
          type: 'assignment',
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
            alert("New assignment created successfully");
          }
          
          else{
            alert("Assignment creation failed! ");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      }
  }
  const openQAPage = (assignment, index) =>{
    history("/qapage", {state:{userName:user.userName,
      email:user.email, 
      role:user.role,
      firstName:user.firstName,
      lastName:user.lastName,
      userId: user.userId,
      assignmentId: assignment._id,
      assignmentName: assignment.name,
      assignmentDescription: assignment.description,
      questions: assignment.questions,
      parentCourse:course.cid,
      assignmentNumber: index+1,
      cname: course.cname,
      instructorFname: course.instructorFname,
      instructorLname: course.instructorLname,
      instructorEmail: course.instructorEmail,
      caller: 'assignmentPage'
    
    }});
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
      getAssignmentsButton.current.style.display = 'block';
      pastAssignments.current.style.display = 'none';
      upcomingAssignments.current.style.display = 'none';
      allSubmissionDetailsDiv.current.style.display = 'none';
      studentSubmissionDetailsDiv.current.style.display = 'none';
      if(user.role ==='teacher')
      createAssignmentButton.current.style.display='block';
}

const openQuizzes = () =>{

  history("/quizpage", {state:{userName:user.userName,
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

const getQuizDueDate = (rawDate) =>{
  var formattedDate = format(new Date(rawDate), "MMMM do, yyyy");
  return formattedDate;
}

const openSubmissionDetails = async(event,quizId) =>{
  var studentId = '6406547d2891c63dfee04af1';
  var quizIds = '64253188c45a333fbcd4d41e';
  event.preventDefault();
  event.stopPropagation();
  if(user.role === 'teacher'){
     await axios.get(`http://localhost:3001/api/v1/assgs/submissions/${quizId}`)
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

  else{
    await axios.get(`http://localhost:3001/api/v1/assgs/stusubmission/${quizId}/${user.userId}`)
    .then(function (response) {
      console.log("submission details");
      console.log(response);
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
     <span id="getQuizzes" ref={getAssignmentsButton}><input type="button" value="See Current Assignments" onClick={getAssignments}/></span>
                    {user.role === 'teacher' && <span id="createQuizzes" ref={createAssignmentButton}><input type="button" value="Create Assignment" onClick={showCreateAssignmentForm}/></span>}
   
                    <span style={{display:'none'}} ref={upcomingAssignments}>
                    <span className="currentAssignments">Upcoming Assignments </span>
                    <div className="item-list">
                          <ul>
                            {
                              upcomingAssignmentList.length === 0 ? (
                                <li>Currently there are no upcoming assignments</li>
                              ) : (
                               upcomingAssignmentList
                               .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)) // Sort by due date
                               .reverse()
                               .map((assignment,index) => 
                                        <li key={index}>
                                            <div className="list-area-header">
                                            <h4>Assignment {index+1}</h4>
                                            <p>Deadline: {getQuizDueDate(assignment.dueDate)}</p>
                                            <p>Points: {assignment.totalPoints} </p>
                                            </div>
                                            <div className="list-details">
                                            <p>{assignment.name}</p>
                                            <p>{assignment.description} </p>
                                          <a href='' style={{marginRight:10}} onClick={() => openQAPage(assignment, index)}>Attempt</a>
                                          <a href='' onClick={(event) => openSubmissionDetails(event,assignment._id)}>View Submissions</a>
                                            </div>
                                        </li>
                                        
                                )
                                
                            )}
                          </ul>
                    </div>
                    </span>
                    <span style={{display:'none'}} ref={pastAssignments}>
                    <span className="currentAssignments" style={{marginTop: 100}}>Past Assignments </span>
                    <div className="item-list">
                          <ul>
                            {
                              
                              pastAssignmentList.length === 0 ? (
                                <li>Currently there are no past assignments</li>
                              ) : (
                               pastAssignmentList
                               .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)) // Sort by due date
                               .reverse()
                               .map((assignment,index) => 
                                        <li key={index}>
                                            <div className="list-area-header">
                                            <h4>Assignment {index+1}</h4>
                                            <p>Deadline: {getQuizDueDate(assignment.dueDate)}</p>
                                            <p>Points: {assignment.totalPoints} </p>
                                            </div>
                                            <div className="list-details">
                                            <p>{assignment.name}</p>
                                            <p>{assignment.description} </p>
                                            <a href='' onClick={(event) => openSubmissionDetails(event,assignment._id)}>View Submission</a>
                                            </div>
                                        </li>
                                        
                                )
                                
                            )}
                          </ul>
                    </div>
                    </span>

                    <span style={{display:'none'}} ref={studentSubmissionDetailsDiv} > 
                    <span className="pastAssignments">Assignment Submission Details </span>
                    <div className="item-list">
                    <ul>
                    {
                    studentSubmissionDetails.length === 0 ? (
                      <li>Currently there are no submissions for this assignment</li>
                    ) : (
                    studentSubmissionDetails.map((submissionDetail) => (
                        <li>
                        <div key={submissionDetail._id}>
                          <h2>{submissionDetail.assignmentQuiz.name}</h2>
                          <p>{submissionDetail.assignmentQuiz.description}</p>
                          <ul>
                            
                          {submissionDetail.assignmentQuiz.questions.map((question) => (
                            <li style={{backgroundColor:'#a7e2ec'}}>
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
                    )))}
                    </ul>
                    </div>
                    </span>

                    <span style={{display:'none'}} ref={allSubmissionDetailsDiv} > 
                    <span className="pastAssignments">Assignment Submission Details </span>
                    <div className="item-list">
                        <ul>
                        {
                          allSubmissionDetails.length === 0 ? (
                            <li>Currently there are no submissions for this assignment</li>
                          ) : (
                         allSubmissionDetails.map((submissionDetail) => (
                          <li>
                          <div key={submissionDetail._id}>
                          <h2>{submissionDetail.assignmentQuiz.name}</h2>
                          <p>{submissionDetail.assignmentQuiz.description}</p>
                            <p>Submitted by: {submissionDetail.student}</p>
                            <ul>
                            {submissionDetail.assignmentQuiz.questions.map((question) => (
                              <li style={{backgroundColor:'#a7e2ec'}}>
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
                    )))}
                    </ul>
                    </div>
                    </span>

                    <span style={{display:'none'}} ref={createAssignmentForm} className="createCourse">
                        <div className="createQuizFormHeading"><h1>Create Assignment</h1></div>
                        <form className="createNewQuizForm" onSubmit={createAssignment}>
                        <input type="text" name="name" placeholder="Assignment Name" value = {name} onChange={handleNameChange} />
                            <input type="text" name="instructions" placeholder="Add description" value = {instruction} onChange={handleInstructionChange} />
                            <input type="text" name="points" placeholder="Assignment Points" value = {points} onChange={handlePointChange} />
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

export default AssignmentPage;



