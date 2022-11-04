import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import { useNavigate } from "react-router-dom";


function SignupButton () {
  const history = useNavigate();
  const handleLoginClick = () => {
    console.log("hi login");
     history("Login");
  };

  const handleSignupClick = () => {
    console.log("hi signup");
    history("Signup");
  };

  const handleCanvasClick = () => {
    console.log("hi canvas");
    history("ReactCanvas");
  };

  const handleSketchClick = () => {
    console.log("hi sketch");
    history("ReactSketch");
  };

    return (
      <div className='buttons'>
        <ButtonToolbar className='mb-3'>
          <Button style={{ marginRight: 50, width: 100}} variant = "outline-info" onClick={handleLoginClick}>Login</Button>
          <Button style={{ marginRight: 50, width: 100}} variant = "outline-info" onClick={handleSignupClick}>New User</Button>
          <Button style={{ marginRight: 50, width: 100}} variant = "outline-info" onClick={handleSketchClick}>React-Sketch</Button>
          <Button style={{ marginRight: 50, width: 100}} variant = "outline-info" onClick={handleCanvasClick}>React-Canvas</Button>
        </ButtonToolbar>
      </div>
    );
}

export default SignupButton;