import * as React from "react";
import LandingPage from "./components/common/Landing-page";
import SignupForm from "./components/user/Signup";
import LoginForm from "./components/user/Login";
import ReactCanvas from "./components/common/ReactCanvas";
import ReactSketch from "./components/common/ReactSketch";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./components/user/Home";

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
                    
                    <Route path="home" 
                        element={<HomePage />} /> 

                    <Route path="reactsketch" 
                        element={<ReactSketch />} />

                    <Route path="reactcanvas" 
                        element={<ReactCanvas />} />    
                </Routes>
            </BrowserRouter>
        );
}

export default App;
