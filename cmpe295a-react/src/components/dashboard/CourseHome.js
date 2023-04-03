import React, {useState, useRef} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import { FaRegUserCircle } from "react-icons/fa";
import UserHeader from '../common/UserHeader';
import AssignmentPage from '../assignments/AssignmentPage';
import QuizPage from '../assignments/QuizPage';
import { format } from "date-fns";




{/* Responsive card grid code reference from
https://www.quackit.com/css/grid/tutorial/create_a_responsive_grid.cfm  

Table reference from
https://www.w3schools.com/css/tryit.asp?filename=trycss_table_fancy

*/}


function CourseHome() {

    const homeInfo = useRef(null);
    const assignmentInfo = useRef(null);
    const quizInfo = useRef(null);
    const gradesInfo = useRef(null);

    const [quizList, setQuizList] = useState([]);
    const [assignmentList, setAssignmentList] = useState([]);

    const axios = require('axios').default || require('axios');

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
            cid: location.state.cid,
            instructorFname: location.state.instructorFname,
            instructorLname: location.state.instructorLname,
            instructorEmail:location.state.instructorEmail
    });

    
    const history = useNavigate();
    const gotoDashBoard = (event) => {
            history("/UserDashBoard",{state:{userName:user.userName,
                email:user.email, 
                role:user.role,
                firstName:user.firstName,
                lastName:user.lastName,
                userId: user.userId}});
    }

    const openHomeInfo = () => {
        homeInfo.current.style.display = 'block';
        assignmentInfo.current.style.display = 'none';
        quizInfo.current.style.display = 'none';
        gradesInfo.current.style.display = 'none';
    }

    const openGrades = () => {
        homeInfo.current.style.display = 'none';
        gradesInfo.current.style.display = 'block';
        console.log("open grades");
        getQuizzes();
        getAssignments();

    }

    const getQuizzes = () =>{
        axios.get(`http://localhost:3001/api/v1/assgs/coursequizzes/${course.cid}`)
        .then(function (response) {
            setQuizList(response.data);
          })
          .catch(function (error) {
            console.log(error);
          });
    }

    const getAssignments = () =>{
        console.log("user: ",user);
        console.log("course: ", course);
        axios.get(`http://localhost:3001/api/v1/assgs/courseassignments/${course.cid}`)
        .then(function (response) {
            setAssignmentList(response.data);
          })
          .catch(function (error) {
            console.log(error);
          });
    }

    const gotoQAPage = () =>{
        history("/qapage", {state:{userName:user.user.userName,
            email:user.user.email, 
            role:user.user.role,
            firstName:user.user.firstName,
            lastName:user.user.lastName,
            userId: user.user.userId,
            assignmentId: '6401cc2f361137550ceb01ac',
            assignmentInstructions: "<<Instructions>>",
            parentCourse:'6401c3a4d05124e7122b2e02',
            assignmentNumber: 1}});
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

    return (
     <>
     <div className="backgroundDecoration">
                <UserHeader user={user}/>
      {/*side bar code, overlay code and style references 
       https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_sidenav_fixed
       https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_sidenav
      */}
                   <div className="leftnav">
                        <a onClick={openHomeInfo}>Home</a>
                        <a onClick={openAssignments}>Assignments</a>
                        <a onClick={openQuizzes}>Quizzes</a>
                        <a onClick={gotoDashBoard}>Dashboard</a>
                        <a onClick={openGrades}>Grades</a>
                    </div>
                    <div className="courseinfo-list" ref={homeInfo}>
                                <ul>
                                <li>
                                    <div className="list-area-header">
                                    <h4>{course.cname}</h4><br/>
                                    <p>Welcome to {course.cname}. This course helps to build you programming and data analysis skills</p>
                                    </div>
                                    <div className="list-details">
                                    <p>Course ID: {course.cid}</p>
                                    <p>Instructor: {course.instructorFname} {course.instructorLname}</p>
                                    <p>Instructor Email: {course.instructorEmail}</p>
                                    </div>
                                </li>
                                </ul>
                            </div>
                    <div  className="gradesInfo" ref={gradesInfo} style={{display:'none'}}>
                    <div className="createCourseFormHeading"><h1>Grades for {course.cname}</h1></div>
                    <table className="grade-table">
                    <tbody>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Due</th>
                        <th>Status</th>
                        <th>Score</th>
                    </tr>
                    
                        
                        {
                            quizList.map((quiz,index) => 
                                  <tr key={index}>
                                    <td>
                                        <p>{quiz.name}</p>
                                    </td>
                                    <td>
                                        <p>Quiz</p>
                                    </td>
                                    <td>
                                        <p>{getQuizDueDate(quiz.dueDate)}</p>
                                    </td>
                                    <td>
                                        <p>Submitted</p>
                                    </td>
                                    <td>
                                        <p>{quiz.points}</p>
                                    </td>
                                 </tr>
                            )
                            
                        }
                    
                    
                    
                    {
                        assignmentList.map((assignment,index) => 
                                        
                             <tr key={index}>
                                <td>
                                    <p>{assignment.name}</p>
                                </td>
                                <td>
                                    <p>Assignment</p>
                                </td>
                                <td>
                                    <p>{getQuizDueDate(assignment.dueDate)}</p>
                                </td>
                                <td>
                                    <p>Submitted</p>
                                </td>
                                <td>
                                    <p>{assignment.points}</p>
                                </td>
                            </tr>
                                        
                                )
                    }
                    
                    </tbody>
                    </table>
                    </div>

                {/*<div className='footer'>All rights reserved © 2022</div>*/}
      </div>
     </>
    )
  }
  
  export default CourseHome;

