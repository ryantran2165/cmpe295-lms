import React, {useState} from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import logo from './logo.svg';
import SignupButton from './Buttons';
import styles from './Common.css';
import UserProfile from '../user/UserProfile';
import { FaRegUserCircle } from "react-icons/fa";
import {useNavigate} from 'react-router-dom';
import computer from './images/children-computer.svg';
import callout from './images/nicubunu_Callout_rounded_rectangle_center.svg';



function UserHeader (user) {

    const [state, setState] = useState({active:false});
    const openUserProfile = () => {
        setState({active: !state.active});
    }
    const history = useNavigate();
    const openDashboard = () => {
        history("/userdashboard", {state:{userName:user.user.userName,
            email:user.user.email, 
            role:user.user.role,
            firstName:user.user.firstName,
            lastName:user.user.lastName}});
    }

    return(
        <>
            <div className="header">
                <a href='/' style={{ textDecoration: 'none' }}><div className='logo'><h1>LMS</h1></div></a>
                <div className='landingHeaderNav'>
                 {/*<a onClick={openDashboard}>Dashboard</a>*/}
                    <span>
                            <a className='usernameText' onClick={openUserProfile}><FaRegUserCircle size={30}/></a>
                            {state.active && <UserProfile user={user} />}
                    </span>
                </div>
            </div> 
            <div id='aboutSection' className='about'></div>
        </>
    )
      


}

export default UserHeader;