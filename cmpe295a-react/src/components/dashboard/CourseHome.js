import React, {useState, useRef} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import { FaRegUserCircle } from "react-icons/fa";
import UserHeader from '../common/UserHeader';
import AssignmentPage from '../assignments/AssignmentPage';
import QuizPage from '../assignments/QuizPage';




{/* Responsive card grid code reference from
https://www.quackit.com/css/grid/tutorial/create_a_responsive_grid.cfm  */}


function CourseHome() {

    const homeInfo = useRef(null);
    const assignmentInfo = useRef(null);
    const quizInfo = useRef(null);

    const openSettings = (event) => {
        document.getElementById("accountDetails").style.width = "250px";
    }

    const openAccountDetails = (event) => {
        document.getElementById("accountDetails").style.width = "250px";
    }
    const closeNav = (event) => {
        document.getElementById("accountDetails").style.width = "0";
      }

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
    }
    const openAssignments = () => {
        assignmentInfo.current.style.display = 'block';
        homeInfo.current.style.display = 'none';
        quizInfo.current.style.display = 'none';
    }
    const openQuizzes = () => {
        quizInfo.current.style.display = 'block';
        homeInfo.current.style.display = 'none';
        assignmentInfo.current.style.display = 'none';
        console.log("open quiz");
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
                    <div className="quizInfo" ref={quizInfo}> 
                    <QuizPage user={user} course={course}/>
                    </div>
                    <div  className="assignmentInfo" ref={assignmentInfo}>
                    <AssignmentPage user={user} course={course}/>
                    </div>

                {/*<div className='footer'>All rights reserved © 2022</div>*/}
      </div>
     </>
    )
  }
  
  export default CourseHome;

