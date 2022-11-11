import React, {useState} from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../common/logo.svg';
import { FaRegUserCircle } from "react-icons/fa";
import Button from 'react-bootstrap/Button';
import UserProfile from '../user/UserProfile';

{/*install react-icons package*/}
export default function SimpleNavbarText (user) {

    const [state, setState] = useState({active:false});
    const openUserProfile = () => {
        setState({active: !state.active});
    }
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
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
                <span>
                        <Button variant="outline-info" className='usernameText' onClick={openUserProfile}><FaRegUserCircle/> {user.user.userName}</Button>
                        {state.active && <UserProfile user={user} />}
                </span>
         </Navbar.Text>
        </Navbar.Collapse>
        </Container>
        </Navbar>
    );

}