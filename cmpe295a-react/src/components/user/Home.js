import React, {useState} from 'react';
import SimpleNavbarText from '../common/Simple-Navbar-Text';
import {useLocation} from 'react-router-dom';


function HomePage () {
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
                <div className='footer'>All rights reserved © 2022</div>
    </div>
     </>
    )
}

export default HomePage;