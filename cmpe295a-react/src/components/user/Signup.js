import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import SimpleNavbar from '../common/Simple-Navbar';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import {useNavigate} from 'react-router-dom';

function SignupForm() {
  
  const history = useNavigate();
  const axios = require('axios').default || require('axios');
  const[fname, setFname] = useState('');
  const[lname, setLname] = useState('');
  const[email, setEmail] = useState('');
  const[password, setPassword] = useState('');
  const[uname, setUname] = useState('');
  const[role, setRole] = useState('');

  const handleRegister = async() => {

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
    })
    .catch(function (error) {
      console.log(error);
    });

  };

  const handleCancel = () => {
    setEmail('');
    setPassword('');
    setFname('');
    setLname('');
    setUname('');
    setRole('');
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
    setRole(event.target.value);
  };

  return (
    <>
    {/*
    form code reference
    https://react-bootstrap.github.io/forms/overview/
    */}
        <div className="backgroundDecoration">
               <SimpleNavbar />
                <div className='signupForm'>
                <Form>
                      <Form.Group className="mb-3" controlId="formFirstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter first name" name="fname" value={fname} onChange={handleFnameChange} />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formLastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter last name" name="lname" value={lname} onChange={handleLnameChange} />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" name="email" value={email} onChange={handleEmailChange} />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formBasicUname">
                        <Form.Label>User Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter username" name="uname" value={uname} onChange={handleUnameChange} />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Enter Password" name="password" value={password} onChange={handlePasswordChange}/>
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formBasicRole">
                        <Form.Label>Role</Form.Label>
                        <Form.Select aria-label="Select your role" name="role" value={role} onChange={handleRoleChange}>
                          <option>Select Role</option>
                          <option value="student">Student</option>
                          <option value="teacher">Teacher</option>
                       </Form.Select>
                      </Form.Group>

                      <ButtonToolbar className='mb-3'>
                        <Button className='formButtons' variant = "outline-success" onClick={handleRegister}>Register</Button>
                        <Button className='formButtons' variant = "outline-secondary" onClick={handleCancel}>Cancel</Button>
                      </ButtonToolbar>
                    </Form>
                 </div>
                 <div className='footer'>All rights reserved © 2022</div>
        </div>
    </>
  )
}

export default SignupForm;




