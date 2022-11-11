import * as React from "react";
import LandingPage from "./components/common/Landing-page";
import SignupForm from "./components/user/Signup";
import LoginForm from "./components/user/Login";
import ReactCanvas from "./components/common/ReactCanvas";
import ReactSketch from "./components/common/ReactSketch";
import HomePage from "./components/user/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";

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

                    <Route path="reactsketch" 
                        element={<ReactSketch />} />

                    <Route path="reactcanvas" 
                        element={<ReactCanvas />} />  

                     <Route path="home" 
                        element={<HomePage />} />      
                </Routes>
            </BrowserRouter>
        );
}

export default App;
