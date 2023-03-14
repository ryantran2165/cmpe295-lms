import React from 'react';
import {useNavigate} from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';



export default function UserProfile (user) {

    const history = useNavigate();
    const handleLogout = () => {
      history("/");
    }
    
    return(
      <div class="profile">
        <div class="profile-details">
          <h2>Hello {user.user.user.userName} !</h2>
          <p>{user.user.user.firstName + "  "} {user.user.user.lastName}</p>
          <p>User ID: {user.user.user.userId}</p>
          <p>Role: {user.user.user.role}</p>
          <p>Email: {user.user.user.email}</p>
        </div>
        <Button variant = "secondary" size="lg" onClick={handleLogout}>Logout</Button>
     </div>
    );

}