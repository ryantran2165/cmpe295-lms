import React, {useState} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import SimpleNavbar from '../common/Simple-Navbar';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import {useNavigate} from 'react-router-dom';

function LoginForm() {
  const history = useNavigate();
  const axios = require('axios').default || require('axios');
  const[username, setUsername] = useState('');
  const[password, setPassword] = useState('');

 {/*install axios package version 1.0.0 since latest is having problems */}
  const handleLogin = async() => {

    axios.post('http://localhost:3001/api/v1/users/login', {
      username: username,
      password: password
    })
    .then(function (response) {
      if(response.data.status === true)
       history("/Home", {state:{userName:response.data.userData.username,
                                email:response.data.userData.email, 
                                role:response.data.userData.role,
                                firstName:response.data.userData.firstName,
                                lastName:response.data.userData.lastName}});
    })
    .catch(function (error) {
      console.log(error);
    });

    
  };

  const handleCancel = () => {
    setUsername('');
    setPassword('');
  };

  const handleUnameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };


  return (
    <>
    {/*
    form code reference https://react-bootstrap.github.io/forms/overview/ 
    */}
    <div className="backgroundDecoration">
                <SimpleNavbar />
                <div className='signupForm'>
                    <Form>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="email" name="username" placeholder="Enter user name" value = {username} onChange={handleUnameChange} />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" name="password" placeholder="Enter Password" value = {password} onChange={handlePasswordChange} />
                      </Form.Group>
                      <ButtonToolbar className='mb-3'>
                        <Button className='formButtons' variant = "outline-success" onClick={handleLogin}>Login</Button>
                        <Button className='formButtons' variant = "outline-secondary" onClick={handleCancel}>Cancel</Button>
                      </ButtonToolbar>
                    </Form>
                </div>
                <div className='footer'>All rights reserved © 2022</div>
    </div>
    </>
  )
}

export default LoginForm;



