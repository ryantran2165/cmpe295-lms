import React, {useState} from 'react';
import SimpleNavbarText from '../common/Simple-Navbar-Text';
import {useLocation} from 'react-router-dom';
import Card from './Card';


{/* Responsive card grid code reference from
https://www.quackit.com/css/grid/tutorial/create_a_responsive_grid.cfm  */}


function UserDashBoard() {
    const location = useLocation();
    const [user, setUser] = useState({
                firstName: location.state.firstName,
                lastName: location.state.lastName,
                userName: location.state.userName,
                email: location.state.email,
                role: location.state.role
        });
    return (
     <>
        <div className="backgroundDecoration">
                    <SimpleNavbarText user={user}/>
                    <div id="grid">
                        <div><Card user={user}/></div>
                        <div><Card user={user}/></div>
                        <div><Card user={user}/></div>
                        <div><Card user={user}/></div>
                    </div>
                    <div className='footer'>All rights reserved © 2022</div>
        </div>
     </>
    )
  }
  
  export default UserDashBoard;

