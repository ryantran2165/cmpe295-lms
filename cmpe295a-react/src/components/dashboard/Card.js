import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useNavigate } from "react-router-dom";
import logo from '../common/logo.svg';

{/*card component code reference
https://react-bootstrap.github.io/components/cards/
*/}

function CourseCard(user) {

    console.log("inside card");
    console.log(user.user.firstName);
    const history = useNavigate();
    const gotoCourse = (event) => {
        history("/CourseHome",{state:{userName:user.user.userName,
            email:user.user.email, 
            role:user.user.role,
            firstName:user.user.firstName,
            lastName:user.user.lastName}});
      };

    

    return (
      <Card style={{ width: '23.5rem' }}>
        <Card.Img variant="top" src={logo} />
        <Card.Body>
          <Card.Title>CMPE 295A</Card.Title>
          <Card.Text>
            CMPE 295A Master's project - MSSE
          </Card.Text>
          <Button variant="primary" onClick={gotoCourse}>Go to course</Button>
        </Card.Body>
      </Card>
    );
  }
  
  export default CourseCard;