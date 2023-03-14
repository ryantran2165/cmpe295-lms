import React, {useState,useRef} from 'react';
import Header from '../common/Header';
import UserHeader from '../common/UserHeader';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import { FaPencilAlt } from "react-icons/fa";
import Container from 'react-bootstrap/esm/Container';
import QAPage2 from './QAPage2';

function QuizPage(user, course) {

  const getAssignmentsButton = useRef(null);
  const createAssignmentButton = useRef(null);
  const createAssignmentForm = useRef(null);
  const currentAssignments = useRef(null);

  
  const history = useNavigate();
  const axios = require('axios').default || require('axios');
  const[name, setName] = useState('');
  const[points, setPoints] = useState('');
  const[dueDate, setDuedate] = useState('');
  const[newCourse, setNewCourse] = useState('');
  const [quizList, setQuizList] = useState([]);
  


 {/*install axios package version 1.0.0 since latest is having problems */}
  const handleCancel = () => {
    setName('');
    setPoints('');
    setDuedate('');
    setNewCourse('');
    getAssignmentsButton.current.style.display = 'contents';
    createAssignmentForm.current.style.display = 'none';
    if(user.user.role ==='teacher')
    createAssignmentButton.current.style.display='contents';
    currentAssignments.current.style.display = 'none';
  };

  const backHome = () => {
    getAssignmentsButton.current.style.display = 'contents';
    createAssignmentForm.current.style.display = 'none';
    if(user.user.role ==='teacher')
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

  const handleSolutionChange = (event) => {
    setNewCourse(event.target.value);
  }

  const getAssignments = () =>{
    axios.get('http://localhost:3001/api/v1/quizzes/')
    .then(function (response) {
        setQuizList(response.data);
        getAssignmentsButton.current.style.display = 'none';
        currentAssignments.current.style.display = 'contents';
        if(user.user.role ==='teacher')
        createAssignmentButton.current.style.display='none';
      })
      .catch(function (error) {
        console.log(error);
      });
}

const showCreateAssignmentForm = () =>{
    createAssignmentForm.current.style.display='block';
    getAssignmentsButton.current.style.display='none';
    if(user.user.role ==='teacher')
        createAssignmentButton.current.style.display='none';
}

const createAssignment = async(event) =>{
    event.preventDefault();
    event.stopPropagation();
    if(points.trim().length === 0 || dueDate === null){
      alert("One or more form fields are empty, please fill out !");
    }
    else{
        axios.post('http://localhost:3001/api/v1/quizzes/', {
          course: user.course.cid,
          points: points,
          dueDate: dueDate,
          name: name,
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
  const openQAPage = (quizId, parentCourse, index) =>{
    history("/qapage2", {state:{userName:user.user.userName,
            email:user.user.email, 
            role:user.user.role,
            firstName:user.user.firstName,
            lastName:user.user.lastName,
            userId: user.user.userId,
            assignmentId: quizId,
            assignmentInstructions: "<<Instructions>>",
            parentCourse:parentCourse,
            assignmentNumber: index+1}});
  }


  return (
    <>
    {/*
    form code reference https://react-bootstrap.github.io/forms/overview/ 
    */}
     <div className="listBackground">
     <span id="getAssignments" ref={getAssignmentsButton}><input type="button" value="See Current Quizzes" onClick={getAssignments}/></span>
                    {user.user.role === 'teacher' && <span id="createAssignment" ref={createAssignmentButton}><input type="button" value="Create Quiz" onClick={showCreateAssignmentForm}/></span>}
   
                    <span style={{display:'none'}} ref={currentAssignments} className="currentAssignments">
                    <a id="backButton" href='' onClick={backHome}>Back to Quiz Home</a>
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
                                        
                                        <a href='' onClick={() => openQAPage(quiz._id, quiz.course._id, index)}>Submit</a>
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
                            <input type="submit" id='button1' value="Create"/>
                            <input type="reset" id='button2' value="Cancel" onClick={handleCancel}/>
                        </form>
                    </span>
    </div>
    </>
  )
}

export default QuizPage;



