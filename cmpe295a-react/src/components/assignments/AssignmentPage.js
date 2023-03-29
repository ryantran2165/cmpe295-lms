import React, {useState,useRef} from 'react';
import Header from '../common/Header';
import UserHeader from '../common/UserHeader';
import {useNavigate, useLocation} from 'react-router-dom';
import axios from 'axios';
import { FaPencilAlt } from "react-icons/fa";
import Container from 'react-bootstrap/esm/Container';
import QAPage2 from './QAPage2';

function AssignmentPage() {

  const getAssignmentsButton = useRef(null);
  const createAssignmentButton = useRef(null);
  const createAssignmentForm = useRef(null);
  const currentAssignments = useRef(null);

  const location = useLocation();

  
  const history = useNavigate();
  const axios = require('axios').default || require('axios');
  const[name, setName] = useState('');
  const[points, setPoints] = useState('');
  const[dueDate, setDuedate] = useState('');
  const[solution, setSolution] = useState('');
  const[instruction, setInstruction] = useState('');
  const [assignmentList, setAssignmentList] = useState([]);

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

  const handleInstructionChange = (event) => {
    setInstruction(event.target.value);
  }

  const handleSolutionChange = (event) => {
    setSolution(event.target.value);
  }

  const getAssignments = () =>{
    axios.get(`http://localhost:3001/api/v1/assgs/bycourse/${course.cid}`)
    .then(function (response) {
        setAssignmentList(response.data);
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
    if(points.trim().length === 0 || dueDate === null){
      alert("One or more form fields are empty, please fill out !");
    }
    else{
        axios.post('http://localhost:3001/api/v1/assgs/', {
          course: course.cid,
          name: name,
          points: points,
          dueDate: dueDate,
          solution: solution,
          instructions: instruction
        })
        .then(function (response) {
          if(response.data.status === true)
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
      assignmentId: assignment.id,
      assignmentInstructions: assignment.name,
      parentCourse:course.cid,
      assignmentNumber: index+1,
      cname: course.cname,
      instructorFname: course.instructorFname,
      instructorLname: course.instructorLname,
      instructorEmail: course.instructorEmail
    
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
      currentAssignments.current.style.display = 'none';
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
   
                    <span style={{display:'none'}} ref={currentAssignments} className="currentAssignments">
                    <div className="item-list">
                          <ul>
                            {
                                assignmentList.map((assignment,index) => 
                                    
                                        <li key={index}>
                                            <div className="list-area-header">
                                            <h4>Assignment {index+1}</h4>
                                            <p>Deadline: {assignment.dueDate}</p>
                                            </div>
                                            <div className="list-details">
                                            <p>{assignment.name} <span style={{display:'inline', marginLeft:194}}>Points: {assignment.points} </span></p>
                                            <a href='' onClick={() => openQAPage(assignment, index)}>Check out</a>
                                            </div>
                                        </li>
                                        
                                )
                                
                            }
                          </ul>
                    </div>
                    </span>
                    <span style={{display:'none'}} ref={createAssignmentForm} className="createCourse">
                        <div className="createCourseFormHeading"><h1>Create Assignment</h1></div>
                        <form className="createNewAssignmentForm" onSubmit={createAssignment}>
                            <input type="text" name="name" placeholder="Assignment Name" value = {name} onChange={handleNameChange} />
                            <input type="text" name="points" placeholder="Assignment Points" value = {points} onChange={handlePointChange} />
                            <input type="date" name="dueDate" placeholder="Select deadline" value = {dueDate} onChange={handleDateChange} />
                            <input type="text" name="solution" placeholder="Add solution" value = {solution} onChange={handleSolutionChange} />
                            <input type="text" name="instructions" placeholder="Add instructions" value = {instruction} onChange={handleInstructionChange} />
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



