import * as React from "react";
import LandingPage from "./components/common/Landing-page";
import SignupForm from "./components/user/Signup";
import LoginForm from "./components/user/Login";
import ReactCanvas from "./components/common/ReactCanvas";
import ReactSketch from "./components/common/ReactSketch";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./components/user/Home";
import QAPage from "./components/assignments/QAPage";
import QAPage2 from "./components/assignments/QAPage2";
import CourseHome from "./components/dashboard/CourseHome";
import UserDashBoard from "./components/dashboard/UserDashBoard";

function App() {
        return(
          <BrowserRouter>
                <Routes>
                    <Route path="/" 
                        element={<LandingPage />} />
  
                    <Route path="login" 
                        element={<LoginForm />} />

                    <Route path="signup" 
                        element={<SignupForm />} />
                    
                    <Route path="userdashboard" 
                        element={<UserDashBoard />} /> 

                    <Route path="qapage" 
                        element={<QAPage />} />

                    <Route path="qapage2" 
                        element={<QAPage2 />} />
                    
                    <Route path="coursehome" 
                        element={<CourseHome />} />

                    <Route path="reactcanvas" 
                        element={<ReactCanvas />} />    

                    <Route path="reactsketch" 
                        element={<ReactSketch />} /> 
                </Routes>
            </BrowserRouter>
        );
}

export default App;
