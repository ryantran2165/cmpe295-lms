import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import logo from './logo.svg';
import SignupButton from './Buttons';
import styles from './Common.css';
import computer from './images/children-computer.svg';
import callout from './images/nicubunu_Callout_rounded_rectangle_center.svg';



function Header () {

    return(
        <>
            <div className="header">
                <a href='/' style={{ textDecoration: 'none' }}><div className='logo'><h1>LMS</h1></div></a>
                <div className='landingHeaderNav'>
                    <a href="/">Home</a>
                    <a href="/signup">Register</a>
                    <a href="/login">Login</a>
                </div>
                {/*Images from freesvg.org-->*/}
            </div> 
            <img className="bottomLeft" src={computer}/>
            <img className="speechBubble" src={callout}/>
            <div className="introText">
                <p>Hello There!</p>
                <p>Register/Login to experience automated grading</p>
            </div>
            {/*<div id='aboutSection' className='about'>
                <p>Welcome to our learning management system application. It has automated grading feature for python programming questions. Answers can be drawn using 
                    canvas or a picture of the answer can be uploaded. Automated grading is achieved using OCR and BIFI algorithms</p>
            </div>*/}
        </>
    )
      


}

export default Header;