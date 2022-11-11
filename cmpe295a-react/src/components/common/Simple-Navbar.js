import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../common/logo.svg';


export default function SimpleNavbar () {

    return(
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
    );

}