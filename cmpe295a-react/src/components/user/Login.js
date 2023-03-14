import React, {useState} from 'react';
import Header from '../common/Header';
import UserHeader from '../common/UserHeader';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

function LoginForm() {
  const history = useNavigate();
  const axios = require('axios').default || require('axios');
  const[username, setUsername] = useState('');
  const[password, setPassword] = useState('');


 {/*install axios package version 1.0.0 since latest is having problems */}
  const handleLogin = async(event) => {
    event.preventDefault();
    event.stopPropagation();
    if(username.trim().length === 0 || password.trim().length === 0 ){
      alert("One or more form fields are empty, please fill out !");
    }
    else{
        axios.post('http://localhost:3001/api/v1/users/login', {
          username: username,
          password: password
        })
        .then(function (response) {
          if(response.data.status === true)
          history("/userdashboard", {state:{userName:response.data.userData.username,
                                    email:response.data.userData.email, 
                                    role:response.data.userData.role,
                                    firstName:response.data.userData.firstName,
                                    lastName:response.data.userData.lastName,
                                    userId:response.data.userData._id}});
          
          else{
            alert("Username and password does not match!!");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      }
    
  };

  const handleCancel = () => {
    setUsername('');
    setPassword('');
    history("/");
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
                <Header/>
                <div className="loginFormHeading"><h1>Login</h1></div>
                    <form className="loginForm" onSubmit={handleLogin}>
                        <input type="text" name="username" placeholder="Username" value = {username} onChange={handleUnameChange} />
                        <input type="password" name="password" placeholder="Password" value = {password} onChange={handlePasswordChange} />
                        <input type="submit" id='button1' value="Login"/>
                        <input type="reset" id='button2' value="Cancel" onClick={handleCancel}/>
                    </form>
    </div>
    </>
  )
}

export default LoginForm;



