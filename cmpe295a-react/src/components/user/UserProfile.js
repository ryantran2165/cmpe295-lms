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
       <div>
          <Card
          bg="outline-info"
          key="info"
          text="Profile"
          className="profileCard"
          >
          <Card.Header>Hello {user.user.user.userName} !</Card.Header>
          <Card.Body>
            <Card.Title style={{ textAlign: 'center' }}> Profile Info</Card.Title>
            <Card.Text>
            <Table striped>
                <tbody>
                    <tr>
                    <td>Name</td>
                    <td>{user.user.user.firstName + "  "}{user.user.user.lastName} </td>
                    </tr>
                    <tr>
                    <td>Role</td>
                    <td>{user.user.user.role}</td>
                    </tr>
                    <tr>
                    <td>Email</td>
                    <td>{user.user.user.email}</td>
                    </tr>
                </tbody>
            </Table>
            <div className="d-grid gap-2">
                <Button variant = "secondary" size="lg" onClick={handleLogout}>Logout</Button>
            </div>
            </Card.Text>
          </Card.Body>
        </Card>
       </div>
    );

}