import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import SimpleNavbar from '../common/Simple-Navbar';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';

function SignupForm() {
  console.log("hi signup");
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
                        <Form.Control type="text" placeholder="Enter first name" />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formLastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter last name" />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" />
                      </Form.Group>
                      <ButtonToolbar className='mb-3'>
                        <Button className='formButtons' variant = "outline-success" onClick={''}>Register</Button>
                        <Button className='formButtons' variant = "outline-secondary" onClick={''}>Cancel</Button>
                      </ButtonToolbar>
                    </Form>
                 </div>
                 <div className='footer'>All rights reserved © 2022</div>
        </div>
    </>
  )
}

export default SignupForm;




