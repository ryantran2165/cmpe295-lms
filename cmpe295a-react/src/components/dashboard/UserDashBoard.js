import React, {useState,useRef} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import UserHeader from '../common/UserHeader';
import Book from '../common/images/book.svg';
import axios from 'axios';


{/* Responsive card grid code reference from
https://www.quackit.com/css/grid/tutorial/create_a_responsive_grid.cfm  */}


function UserDashBoard() {

    const already_enrolled_student_courses = [];
    const [dummy, setDummy] = useState([]);
    var checkCurrentCourseList = [];
    const[cname, setCname] = useState('');
    const[cdes, setCdes] = useState('');
    const getCoursesButton = useRef(null);
    const createCourseButton = useRef(null);
    const createCourseForm = useRef(null);
    const enrollCourseForm = useRef(null);
    const courseCards = useRef(null);
    const enrollCourseButton = useRef(null);
    const location = useLocation();
    const [availableCourses, setAvailableCourses] = useState([]);
    const [currentCourseList, setCurrentCourseList] = useState([]);
    const [user, setUser] = useState({
                firstName: location.state.firstName,
                lastName: location.state.lastName,
                userName: location.state.userName,
                email: location.state.email,
                role: location.state.role,
                userId:location.state.userId
        });

    const getCourses = () =>{
        if(user.role ==='teacher'){
        axios.get(`http://localhost:3001/api/v1/courses/byinstructor/${user.userId}`)
        .then(function (response) {
            setCurrentCourseList(response.data);
            getCoursesButton.current.style.display = 'none';
            createCourseButton.current.style.display='none';
            courseCards.current.style.display = 'contents';
          })
          .catch(function (error) {
            console.log(error);
          });
        }
        else{
        axios.get(`http://localhost:3001/api/v1/courses/bystudent/${user.userId}`)
        .then(function (response) {
            setCurrentCourseList(response.data);
            getCoursesButton.current.style.display = 'none';
            courseCards.current.style.display = 'contents';
            enrollCourseButton.current.style.display='none';
          })
          .catch(function (error) {
            console.log(error);
          });
        }
    }

    const showCreateCourseForm = () =>{
        createCourseForm.current.style.display='block';
        getCoursesButton.current.style.display='none';
        if(user.role ==='teacher')
            createCourseButton.current.style.display='none';
    }

    const backFromEnroll = (event) =>{
        event.preventDefault();
        enrollCourseButton.current.style.display='block';
        getCoursesButton.current.style.display='block';
        enrollCourseForm.current.style.display='none';
    }

    const verifyEnrollemnt = async() =>{
        await axios.get(`http://localhost:3001/api/v1/courses/bystudent/${user.userId}`)
        .then(function (response) {
            checkCurrentCourseList = response.data;
        })
        .catch(function (error) {
            console.log(error);
        });
        checkCurrentCourseList.map((course,index) => {
            already_enrolled_student_courses[index] = course._id;        
        });
        setDummy(already_enrolled_student_courses);
    }

    const showEnrollCourseForm = () =>{
        axios.get('http://localhost:3001/api/v1/courses/')
        .then(function (response) {
            setAvailableCourses(response.data);
          })
          .catch(function (error) {
            console.log(error);
          });
        
        enrollCourseForm.current.style.display='block';
        getCoursesButton.current.style.display='none';
        if(user.role ==='student')
            enrollCourseButton.current.style.display='none';
        verifyEnrollemnt();
    }

    const createCourse = (event) =>{
        event.preventDefault();
        event.stopPropagation();
        if(cname.trim().length === 0 || cdes.trim().length === 0 ){
          alert("One or more form fields are empty, please fill out !");
        }
        else{
            axios.post('http://localhost:3001/api/v1/courses/', {
              name: cname,
              instructor: user.userId,
              description: cdes
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

    const enrollCourse = async(course) =>{
            if(dummy.indexOf(course)>-1)
             alert("You have already enrolled for this course!");
            else{
            axios.put(`http://localhost:3001/api/v1/courses/enroll/${course}`, {
              student: user.userId
            })
            .then(function (response) {
              if(response.data.status === true)
              {
                enrollCourseForm.current.style.display='none';
                getCoursesButton.current.style.display='block';
                if(user.role ==='student')
                  enrollCourseButton.current.style.display='block';
                alert("Enrollment successfull");
              }
              else{
                alert("Course enrollment failed! ");
              }
            })
            .catch(function (error) {
              console.log(error.response.data);
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

      const gotoCourse = (course_name,course_id,course_description,course_instructor_firstName,course_instructor_lastName,course_instructor_email) =>{
        if(user.role === 'student'){
        history("/CourseHome",{state:{userName:user.userName,
            email:user.email, 
            role:user.role,
            firstName:user.firstName,
            lastName:user.lastName,
            userId: user.userId,
            cname:course_name,
            cdes:course_description,
            cid:course_id,
            instructorFname:course_instructor_firstName,
            instructorLname:course_instructor_lastName,
            instructorEmail:course_instructor_email}});
        }

        else{
            history("/CourseHome",{state:{userName:user.userName,
                email:user.email, 
                role:user.role,
                firstName:user.firstName,
                lastName:user.lastName,
                userId: user.userId,
                cname:course_name,
                cdes:course_description,
                cid:course_id,
                instructorFname:user.firstName,
                instructorLname:user.lastName,
                instructorEmail:user.email}});
            }
    }

    return (
     <>
        <div className="backgroundDecoration">
                    <UserHeader user={user}/>
                    <span id="getCourses" ref={getCoursesButton}><input type="button" value="See Current Courses" onClick={getCourses}/></span>
                    {user.role === 'teacher' && <span id="createCourse" ref={createCourseButton}><input type="button" value="Create Course" onClick={showCreateCourseForm}/></span>}
                    {user.role === 'student' && <span id="enrollCourse" ref={enrollCourseButton}><input type="button" value="Enroll for Course" onClick={showEnrollCourseForm}/></span>}
                    {/*looping array of objects code reference from
                    https://www.javatpoint.com/loop-array-in-reactjs

                    Book image from freesvg.org
                    */}
                    <span style={{display:'none'}} ref={courseCards}>
                    {
                        currentCourseList.map((course,index) => 
                            <div className="card">
                                <img src={Book} alt="Image"/>
                                <a href='' onClick={()=>gotoCourse(course.name,course._id,course.description,course.instructor.firstName,course.instructor.lastName,course.instructor.email)}><h1>{course.name}</h1></a>
                                <a href='' onClick={()=>gotoCourse(course.name,course._id,course.description,course.instructor.firstName,course.instructor.lastName,course.instructor.email)}><p>{course._id}</p></a>
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

                    <span style={{display:'none'}} ref={enrollCourseForm} className="enrollCourse">
                        <span><a id="enrollBackButton" onClick={backFromEnroll}>Back</a></span>
                        <div className="tableHeadingEnroll"><h3>Enroll for a Course</h3></div>
                    <table className="enroll-table">
                    <tbody>
                    <tr>
                        <th>Course ID</th>
                        <th>Course Name</th>
                        <th>Instructor</th>
                        <th>Enroll</th>
                    </tr>
                    
                        
                        {
                            availableCourses.map((acourse,index) => 
                                  <tr key={index}>
                                    <td>
                                        <p>{acourse._id}</p>
                                    </td>
                                    <td>
                                        <p>{acourse.name}</p>
                                    </td>
                                    <td>
                                        <p>{acourse.instructor ? acourse.instructor.firstName+ " " + acourse.instructor.lastName: 'Not Available'}</p>
                                    </td>
                                    <td>
                                    <p><button id="enrollButton" onClick={()=>enrollCourse(acourse._id)}>Enroll</button></p>
                                    </td>
                                 </tr>
                            )
                            
                        }
                    </tbody>
                    </table>
                    </span>
        </div>
     </>
    )
  }
  
  export default UserDashBoard;

