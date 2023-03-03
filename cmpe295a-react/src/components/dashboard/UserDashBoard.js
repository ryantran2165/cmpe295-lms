import React, {useState,useRef} from 'react';
import {useLocation} from 'react-router-dom';
import UserHeader from '../common/UserHeader';
import Book from '../common/images/book.svg';
import axios from 'axios';


{/* Responsive card grid code reference from
https://www.quackit.com/css/grid/tutorial/create_a_responsive_grid.cfm  */}


function UserDashBoard() {
    const accountOverlay = useRef(null);
    const settingsOverlay = useRef(null);
    const getCoursesButton = useRef(null);
    const courseCards = useRef(null);
    const location = useLocation();
    const [courseList, setCourseList] = useState([]);
    const [user, setUser] = useState({
                firstName: location.state.firstName,
                lastName: location.state.lastName,
                userName: location.state.userName,
                email: location.state.email,
                role: location.state.role
        });

    const getCourses = () =>{
        axios.get('http://localhost:3001/api/v1/courses/')
        .then(function (response) {
            setCourseList(response.data);
            getCoursesButton.current.style.display = 'none';
            courseCards.current.style.display = 'contents';
          })
          .catch(function (error) {
            console.log(error);
          });
    }

    

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
    return (
     <>
        <div className="backgroundDecoration">
                    <UserHeader user={user}/>
                    <span id="getCourses" ref={getCoursesButton}><input type="button" value="See current courses" onClick={getCourses}/></span>
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
                    <span style={{display:'none'}} ref={courseCards}>
                    {
                        courseList.map((course,index) => 
                            <div className="card">
                                <img src={Book} alt="Image"/>
                                <a href='#'><h1>{course.name}</h1></a>
                                <a href='#'><p>{course._id}</p></a>
                            </div>
                        )
                        
                    }
                    </span>
        </div>
     </>
    )
  }
  
  export default UserDashBoard;

