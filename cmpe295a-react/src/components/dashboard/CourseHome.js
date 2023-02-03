import React, {useState} from 'react';
import SimpleNavbarText from '../common/Simple-Navbar-Text';
import {BrowserRouter, useLocation} from 'react-router-dom';
import Card from './Card';
import { FaRegUserCircle } from "react-icons/fa";
import Button from 'react-bootstrap/Button';
import UserProfile from '../user/UserProfile';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from "@fortawesome/free-solid-svg-icons";


{/* Responsive card grid code reference from
https://www.quackit.com/css/grid/tutorial/create_a_responsive_grid.cfm  */}

{/*install below packages begore using font awesome icon
   https://fontawesome.com/v5/docs/web/use-with/react

    npm i --save @fortawesome/fontawesome-svg-core
    npm install --save @fortawesome/free-solid-svg-icons
    npm install --save @fortawesome/react-fontawesome
    npm i --save @fortawesome/free-solid-svg-icons
    npm i --save @fortawesome/free-regular-svg-icons
    npm i --save @fortawesome/react-fontawesome@latest




   

*/}


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
                    {/*<FontAwesomeIcon icon="user" />*/}
                    {user.userName}<br/>
                    {user.firstName}<br/>
                    {user.lastName}<br/>
                    {user.email}<br/>
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
                <div className="main">
                    <p>Inside course home</p>
                </div>

                {/*<div className='footer'>All rights reserved © 2022</div>*/}
      </div>
     </>
    )
  }
  
  export default CourseHome;

