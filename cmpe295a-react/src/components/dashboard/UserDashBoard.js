import React, {useState, useRef, createRef} from 'react';
import SimpleNavbarText from '../common/Simple-Navbar-Text';
import {useLocation} from 'react-router-dom';
import Card from './Card';
import { FaRegUserCircle } from "react-icons/fa";
import UserHeader from '../common/UserHeader';
import Book from '../common/images/book.svg';


{/* Responsive card grid code reference from
https://www.quackit.com/css/grid/tutorial/create_a_responsive_grid.cfm  */}


function UserDashBoard() {
    const location = useLocation();
    const [user, setUser] = useState({
                firstName: location.state.firstName,
                lastName: location.state.lastName,
                userName: location.state.userName,
                email: location.state.email,
                role: location.state.role
        });

    const accountOverlay = useRef(null);
    const settingsOverlay = useRef(null);

    const closeAccountOverlay = () => {
        accountOverlay.current.style.display = 'none';
        console.log("close  account");
    }
    const openAccountOverlay = () => {
        accountOverlay.current.style.display = 'block';
        console.log("open account");
    }
    const closeSettingsOverlay = () => {
        settingsOverlay.current.style.display = 'none';
        console.log("close setting");
    }
    const openSettingsOverlay = () => {
        settingsOverlay.current.style.display = 'block';
        console.log("open setting");
    }

        const courses = [  
            {  
               'courseId': 1,   
               'courseName': 'CMPE 202',   
               'courseDes': 'Software Systems Engineering'  
            },  
            {  
                'courseId': 2,   
                'courseName': 'CMPE 281',   
                'courseDes': 'Cloud technologies'
            },  
            {  
                'courseId': 3,   
                'courseName': 'CMPE 277',   
                'courseDes': 'Smartphone Application Development'
            },  
            {  
                'courseId': 4,   
                'courseName': 'CMPE 255',   
                'courseDes': 'Data Mining'
            }
        ];  
    return (
     <>
        <div className="backgroundDecoration">
                    <UserHeader user={user}/>
                    {/*<div className="leftnav">
                        <a onClick={openAccountOverlay}>Account</a>
                        <a href='/userdashboard'>Dashboard</a>
                        <a onClick={openSettingsOverlay}>Settings</a>
                        <a href='/'>Home</a>
                    </div>
                    <div  className="leftnavOverlay" ref={accountOverlay}>
                        <a className="crossmark" onClick={closeAccountOverlay}>&times;</a>
                            <FaRegUserCircle size={70}/> 
                        <p>Name: {user.firstName} {user.lastName}<br/>
                        Username: {user.userName}<br/>
                        Role: {user.role}<br/>
                        Email: {user.email}<br/></p>
                    </div>
                    <div  className="leftnavOverlay" ref={settingsOverlay}>
                        <a className="crossmark" onClick={closeSettingsOverlay}>&times;</a>
                        <FaRegUserCircle/>
                    </div>*/}
                    {/*looping array of objects code reference from
                    https://www.javatpoint.com/loop-array-in-reactjs

                    Book image from freesvg.org
                    */}
                    {
                        courses.map((course,index) => 
                        <div className="card">
                            <img src={Book} alt="Image"/>
                            <a href='#'><h1>{course.courseName}</h1></a>
                            <a href='#'><p>{course.courseDes}</p></a>
                        </div>
                    )}
        </div>
     </>
    )
  }
  
  export default UserDashBoard;

