import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import logo from './logo.svg';
import SignupButton from './Buttons';
import styles from './Common.css';


function Header () {

    return(
        <>
            <div className="backgroundDecoration">
                <Navbar sticky='top' className='navbarLanding' expand="lg">
                    <Container>
                    <Navbar.Brand href="/">
                        <img
                        alt="logo"
                        src={logo}
                        width="100"
                        height="100"
                        className="d-inline-block align-top"
                        />{' '}
                    </Navbar.Brand>
                    </Container>
                </Navbar>
                 <Container>
                        <SignupButton />
                    </Container>
                <div className='headerText'>
                  <p>Welcome to LMS</p>
                </div>
                <div className='footer'>All rights reserved © 2022</div>
            </div> 
        </>
    )
      


}

export default Header;