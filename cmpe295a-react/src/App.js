import * as React from "react";
import Button from "@mui/material/Button";
import LandingPage from "./components/common/Landing-page";
import SignupForm from "./components/user/Signup";
import LoginForm from "./components/user/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  console.log("hi app.js");
        return(
          <BrowserRouter>
                <Routes>
                    <Route path="/" 
                        element={<LandingPage />} />
  
                    <Route path="login" 
                        element={<LoginForm />} />

                    <Route path="signup" 
                        element={<SignupForm />} />
                </Routes>
            </BrowserRouter>
        );
}

export default App;
