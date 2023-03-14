import React, {useState,useRef} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import UserHeader from '../common/UserHeader';
import Book from '../common/images/book.svg';
import axios from 'axios';


{/* Responsive card grid code reference from
https://www.quackit.com/css/grid/tutorial/create_a_responsive_grid.cfm  */}


function UserDashBoard() {

    const[cname, setCname] = useState('');
    const[cdes, setCdes] = useState('');
    const getCoursesButton = useRef(null);
    const createCourseButton = useRef(null);
    const createCourseForm = useRef(null);
    const courseCards = useRef(null);
    const location = useLocation();
    const [currentCourse, setCurrentCourse] = useState();
    const [courseList, setCourseList] = useState([]);
    const [user, setUser] = useState({
                firstName: location.state.firstName,
                lastName: location.state.lastName,
                userName: location.state.userName,
                email: location.state.email,
                role: location.state.role,
                userId:location.state.userId
        });

    const getCourses = () =>{
        axios.get('http://localhost:3001/api/v1/courses/')
        .then(function (response) {
            setCourseList(response.data);
            getCoursesButton.current.style.display = 'none';
            if(user.role ==='teacher')
                createCourseButton.current.style.display='none';
            courseCards.current.style.display = 'contents';
          })
          .catch(function (error) {
            console.log(error);
          });
    }

    const showCreateCourseForm = () =>{
        createCourseForm.current.style.display='block';
        getCoursesButton.current.style.display='none';
        if(user.role ==='teacher')
            createCourseButton.current.style.display='none';
    }

    const createCourse = async(event) =>{
        event.preventDefault();
        event.stopPropagation();
        if(cname.trim().length === 0 || cdes.trim().length === 0 ){
          alert("One or more form fields are empty, please fill out !");
        }
        else{
            axios.post('http://localhost:3001/api/v1/courses/', {
              name: cname,
              instructor: user.userId
            })
            .then(function (response) {
              if(response.data.status === true)
              {
                createCourseForm.current.style.display='none';
                getCoursesButton.current.style.display='block';
                if(user.role ==='teacher')
                  createCourseButton.current.style.display='block';
                alert("New course created successfully");
              }
              
              else{
                alert("Course creation failed! ");
              }
            })
            .catch(function (error) {
              console.log(error);
            });
          }
    }

    const handleCancel = () => {
        setCname('');
        setCdes('');
        createCourseForm.current.style.display='none';
        getCoursesButton.current.style.display='block';
        createCourseButton.current.style.display='block';
      };
    
      const handleCnameChange = (event) => {
        setCname(event.target.value);
      };
    
      const handleCdesChange = (event) => {
        setCdes(event.target.value);
      };

     const history = useNavigate();

      const gotoCourse = (course_name,course_id,course_instructor_firstName,course_instructor_lastName,course_instructor_email) =>{
        history("/CourseHome",{state:{userName:user.userName,
            email:user.email, 
            role:user.role,
            firstName:user.firstName,
            lastName:user.lastName,
            userId: user.userId,
            cname:course_name,
            cid:course_id,
            instructorFname:course_instructor_firstName,
            instructorLname:course_instructor_lastName,
            instructorEmail:course_instructor_email}});
    }

    return (
     <>
        <div className="backgroundDecoration">
                    <UserHeader user={user}/>
                    <span id="getCourses" ref={getCoursesButton}><input type="button" value="See Current Courses" onClick={getCourses}/></span>
                    {user.role === 'teacher' && <span id="createCourse" ref={createCourseButton}><input type="button" value="Create Course" onClick={showCreateCourseForm}/></span>}
                    {/*looping array of objects code reference from
                    https://www.javatpoint.com/loop-array-in-reactjs

                    Book image from freesvg.org
                    */}
                    <span style={{display:'none'}} ref={courseCards}>
                    {
                        courseList.map((course,index) => 
                            <div className="card">
                                <img src={Book} alt="Image"/>
                                <a href='' onClick={()=>gotoCourse(course.name,course._id,course.instructor.firstName,course.instructor.lastName,course.instructor.email)}><h1>{course.name}</h1></a>
                                <a href='' onClick={()=>gotoCourse(course.name,course._id,course.instructor.firstName,course.instructor.lastName,course.instructor.email)}><p>{course._id}</p></a>
                            </div>
                        )
                        
                    }
                    </span>
                    <span style={{display:'none'}} ref={createCourseForm} className="createCourse">
                        <div className="createCourseFormHeading"><h1>Add New Course</h1></div>
                        <form className="loginForm" onSubmit={createCourse}>
                            <input type="text" name="cname" placeholder="Course name" value = {cname} onChange={handleCnameChange} />
                            <input type="text" name="cdes" placeholder="Course Decsription" value = {cdes} onChange={handleCdesChange} />
                            <input type="submit" id='button1' value="Create"/>
                            <input type="reset" id='button2' value="Cancel" onClick={handleCancel}/>
                        </form>
                    </span>
        </div>
     </>
    )
  }
  
  export default UserDashBoard;

