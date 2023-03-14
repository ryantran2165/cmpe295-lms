import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import SimpleNavbar from '../common/Simple-Navbar';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import {useNavigate} from 'react-router-dom';
import Header from '../common/Header';

function SignupForm() {
  
  const history = useNavigate();
  const axios = require('axios').default || require('axios');
  const[fname, setFname] = useState('');
  const[lname, setLname] = useState('');
  const[email, setEmail] = useState('');
  const[password, setPassword] = useState('');
  const[uname, setUname] = useState('');
  const[role, setRole] = useState('');
  

  const handleRegister = async(event) => {
    event.preventDefault();
    event.stopPropagation();
    var atPosition = email.lastIndexOf("@");
    var dotPosition = email.lastIndexOf(".");
    if(fname.trim().length === 0 || email.trim().length === 0 || password.trim().length === 0 || uname.trim().length === 0 || password.trim().length === 0){
         event.preventDefault();
         event.stopPropagation();
         console.log("role: ",role);
         alert("One or more form fields are empty, please fill out !");
    }
    else if (!( atPosition < dotPosition && atPosition > 0 && email.indexOf("@@") == -1 && dotPosition > 2 && email.length - dotPosition > 2)){
         event.preventDefault();
         event.stopPropagation();
         console.log("role: ",role);
         alert("Invalid email !");
    }
    else if(role !== "student" && role !== "teacher" ){
         event.preventDefault();
         event.stopPropagation();
         console.log("role: ",role);
         alert("Please select your correct role !");
    }
    else{
          console.log("Form submitted successfully !");
          console.log("role: ",role);
          axios.post('http://localhost:3001/api/v1/users/signup', {
            username: uname,
            firstName: fname,
            lastName: lname,
            email: email,
            password: password,
            role: role
          })
          .then(function (response) {
            if(response.data.status === true){
            alert("Hello " + response.data.user.username + ", your registration is successful!");
            history("/Login");
            }
            else{
              alert("User with this username already exists!!");
            }
          })
          .catch(function (error) {
            console.log(error);
          });
        }
  };

  const handleCancel = () => {
    setEmail('');
    setPassword('');
    setFname('');
    setLname('');
    setUname('');
    setRole('');
    history("/");
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleFnameChange = (event) => {
    setFname(event.target.value);
  };

  const handleLnameChange = (event) => {
    setLname(event.target.value);
  };

  const handleUnameChange = (event) => {
    setUname(event.target.value);
  };

  const handleRoleChange = (event) => {
    console.log("Role from select", event.target.value);
    setRole(event.target.value);
  };

  return (
    <>
        <div className="backgroundDecoration">
               <Header />
               <div className="registerFormHeading"><h1>Register</h1></div>
                <form onSubmit={handleRegister} className="registerForm">
                      <input type="text" placeholder="First name" name="fname" value={fname} onChange={handleFnameChange} />
                      <input type="text" placeholder="Last name" name="lname" value={lname} onChange={handleLnameChange} />
                      <input type="email" placeholder="Email" name="email" value={email} onChange={handleEmailChange} />
                      <input type="text" placeholder="Username" name="uname" value={uname} onChange={handleUnameChange} />
                      <input  type="password" placeholder="Password" name="password" value={password} onChange={handlePasswordChange}/>
                      <select name="role" value={role} onChange={handleRoleChange}>
                          <option value="noRole">Role</option>
                          <option value="student">Student</option>
                          <option value="teacher">Teacher</option>
                       </select>
                       <input type="submit" id='button1' value="Register"/>
                       <input type="reset" id='button2' value="Cancel" onClick={handleCancel}/>
                    </form>
        </div>
    </>
  )
}

export default SignupForm;




