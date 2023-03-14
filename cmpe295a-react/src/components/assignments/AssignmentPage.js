import React, {useState,useRef} from 'react';
import Header from '../common/Header';
import UserHeader from '../common/UserHeader';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import { FaPencilAlt } from "react-icons/fa";
import Container from 'react-bootstrap/esm/Container';
import QAPage2 from './QAPage2';

function AssignmentPage(user, course) {

  const getAssignmentsButton = useRef(null);
  const createAssignmentButton = useRef(null);
  const createAssignmentForm = useRef(null);
  const currentAssignments = useRef(null);

  
  const history = useNavigate();
  const axios = require('axios').default || require('axios');
  const[name, setName] = useState('');
  const[points, setPoints] = useState('');
  const[dueDate, setDuedate] = useState('');
  const[solution, setSolution] = useState('');
  const[instruction, setInstruction] = useState('');
  const [assignmentList, setAssignmentList] = useState([]);
  


 {/*install axios package version 1.0.0 since latest is having problems */}
  const handleCancel = () => {
    setName('');
    setPoints('');
    setDuedate('');
    setSolution('');
    setInstruction('');
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

  const handleInstructionChange = (event) => {
    setInstruction(event.target.value);
  }

  const handleSolutionChange = (event) => {
    setSolution(event.target.value);
  }

  const getAssignments = () =>{
    console.log("user: ",user);
    console.log("course: ", course);
    axios.get('http://localhost:3001/api/v1/assgs/')
    .then(function (response) {
        setAssignmentList(response.data);
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
        axios.post('http://localhost:3001/api/v1/assgs/', {
          course: user.course.cid,
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
            if(user.user.role ==='teacher')
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
  const openQAPage = (assignmentId, assignmentInstructions, parentCourse, index) =>{
    history("/qapage2", {state:{userName:user.user.userName,
            email:user.user.email, 
            role:user.user.role,
            firstName:user.user.firstName,
            lastName:user.user.lastName,
            userId:user.user.userId,
            assignmentId: assignmentId,
            assignmentInstructions: assignmentInstructions,
            parentCourse:parentCourse,
            assignmentNumber: index+1}});
  }


  return (
    <>
    {/*
    form code reference https://react-bootstrap.github.io/forms/overview/ 
    */}
     <div className="listBackground">
     <span id="getAssignments" ref={getAssignmentsButton}><input type="button" value="See Current Assignments" onClick={getAssignments}/></span>
                    {user.user.role === 'teacher' && <span id="createAssignment" ref={createAssignmentButton}><input type="button" value="Create Assignment" onClick={showCreateAssignmentForm}/></span>}
   
                    <span style={{display:'none'}} ref={currentAssignments} className="currentAssignments">
                    <a id="backButton" href='' onClick={backHome}>Back to Assignment Home</a>
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
                                            <a href='' onClick={() => openQAPage(assignment._id, assignment.instructions, assignment.course._id, index)}>Submit</a>
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
    </>
  )
}

export default AssignmentPage;



