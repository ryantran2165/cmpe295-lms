import React, {useState} from 'react';
import SimpleNavbarText from '../common/Simple-Navbar-Text';
import {BrowserRouter, useLocation} from 'react-router-dom';
import Card from './Card';
import { FaUserGraduate, FaUserTie, FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";




{/* Responsive card grid code reference from
https://www.quackit.com/css/grid/tutorial/create_a_responsive_grid.cfm  */}


function CourseHome() {

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
                role: location.state.role
        });

    const history = useNavigate();
    const gotoDashBoard = (event) => {
            history("/UserDashBoard",{state:{userName:user.userName,
                email:user.email, 
                role:user.role,
                firstName:user.firstName,
                lastName:user.lastName}});
    }

    console.log("coursehome",user);

    return (
     <>
     <div className="backgroundDecoration">
     {/*<SimpleNavbarText user={user}/>*/}
      {/*side bar code, overlay code and style references 
       https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_sidenav_fixed
       https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_sidenav
      */}
                <div className="sidenav">
                        <a onClick={openAccountDetails}>Account</a>
                        <a onClick={gotoDashBoard}>Dashboard</a>
                        <a onClick={openSettings}>Settings</a>
                </div>
                <div id="accountDetails" className="sidenavOverlay">
                    <a className="closebtn" onClick={closeNav}>&times;</a>
                    <p className="profileDetails">
                    {user.userName}<br/>
                    {user.firstName}<br/>
                    {user.lastName}<br/>
                    {user.email}<br/>
                    {user.role === "student" && <FaUserGraduate />}
                    {user.role === "teacher" && <FaUserTie />}
                    {user.role}<br/>
                    </p>
                    
                </div>
                <div id="settings" className="sidenavOverlay">
                    <a className="closebtn" onClick={closeNav}>&times;</a>
                    <a href="#">About</a>
                    <a href="#">Services</a>
                    <a href="#">Clients</a>
                    <a href="#">Contact</a>
                </div>
                <div className="sidenavSections">
                    <a href="#">Home</a>
                    <a href="#">Assignments</a>
                    <a href="#">Files</a>
                    <a href="#">Grades</a>
                    <a href="#">Quizzes</a>
                </div>
                <div className="main">
                    <p>Inside course home</p>
                </div>

                {/*<div className='footer'>All rights reserved © 2022</div>*/}
      </div>
     </>
    )
  }
  
  export default CourseHome;

