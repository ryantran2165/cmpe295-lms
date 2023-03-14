import React, { useState, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import UserHeader from '../common/UserHeader';
import Styles from './assignment.css';
import { useLocation } from 'react-router-dom';
{/*

run this to resolve peer dependencies

npm config set legacy-peer-deps true
after this
install package using 
npm install react-sketch-canvas */}
{/*code reference for color and brush

https://www.npmjs.com/package/react-sketch-canvas */}

{/*code reference for previous and next buttons

https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_next_prev */}
const QAPage2 = () => {
  const [pencolor, setPencolor] = useState("#e66465");
  const [pentype, setPentype] = useState(2);
  const [erasertype, setEraserType] = useState(12);
  const [width, setWidth] = useState(980);
  const [height, setHeight] = useState(560);
  var answerFile = null;
  var answerImageName = null;

  const location = useLocation();
  const answerCanvas = useRef(null);
  const axios = require('axios').default || require('axios');
  
  const [user, setUser] = useState({
    firstName: location.state.firstName,
    lastName: location.state.lastName,
    userName: location.state.userName,
    email: location.state.email,
    role: location.state.role,
    userId: location.state.userId
  });
  
  const [assignment, setAssignment] = useState({
    courseId: location.state.parentCourse,
    assignmentId: location.state.assignmentId,
    instructions: location.state.assignmentInstructions,
    assignmentNumber: location.state.assignmentNumber
  });

  const submitAnswer = async() =>{
        axios.post('http://localhost:3001/api/v1/upload/upload', {
         fileUpload: answerFile
        })
        .then(function (response) {
          if(response.data.status === 200)
          alert("answer submitted successfully");
          else
          alert("unable to submit answer");
        })
        .catch(function (error) {
          console.log(error);
        });
  }

  return (
    <div className="backgroundDecoration">
      <UserHeader user={user}/>
      <div className="assignment-box">
        <div className="assignment-box-head">
          <h2>Question {assignment.assignmentNumber}</h2>
          {/*<div className="navigationButtons">
            <button className="previousButton" disabled>Previous</button>
            <button className="nextButton">Next</button>
            </div>*/}
        </div>
        <div className="questionSection">
          <p style={{ padding: 50 }}>{assignment.instructions}</p>
        </div>
        <div className="answerArea">
          <ReactSketchCanvas
            ref={answerCanvas}
            width={width}
            height={height}
            strokeColor={pencolor}
            strokeWidth={pentype}
            eraserWidth={erasertype}
            hideGrid={true}
          />
          <div className='canvasbuttons'>
            <Button style={{ marginRight: 50, marginTop: 15, width: 80 }} variant="outline-info" onClick={() => { answerCanvas.current.clearCanvas(); }}>Reset</Button><br/>
            <Button style={{ marginRight: 50, marginTop: 15, width: 80 }} variant="outline-info" onClick={() => { answerCanvas.current.undo(); }}>Undo</Button><br/>
            <Button style={{ marginRight: 50, marginTop: 15, width: 80 }} variant="outline-info" onClick={() => { answerCanvas.current.eraseMode(true); }}>Eraser</Button><br/>
            <Button style={{ marginRight: 50, marginTop: 15, width: 80 }} variant="outline-info" onClick={() => { answerCanvas.current.eraseMode(false); }}>Pen</Button><br/>
            <Button style={{ marginRight: 50, marginTop: 15, width: 80 }} variant="outline-info" onClick={() => 
                { answerCanvas.current.exportImage("png")
                  .then(
                     data => { console.log(data); 
                        const base64String = data;
                        const decodedString = atob(base64String.split(",")[1]);

                        const byteArray = new Uint8Array(decodedString.length);
                        for (let i = 0; i < decodedString.length; i++) {
                        byteArray[i] = decodedString.charCodeAt(i);
                        }
                        answerImageName = user.userId+assignment.courseId+assignment.assignmentId+assignment.parentCourse+".png";
                        const blob = new Blob([byteArray], { type: "image/png" });
                        answerFile = new File([blob], answerImageName, { type: "image/png" });
                        submitAnswer();

                     })
                  .catch(
                     e => { console.log(e); 
                     }); }}>Submit</Button><br/>
          </div>
        </div>
        <div className='brushcontrols'>
          <span style={{ marginRight: 100 }}> <input type="color" value={pencolor} onChange={e => setPencolor(e.target.value)} /> Pen color  </span>
          <span style={{ marginRight: 10 }}> <input type="range" min="1" max="12" value={pentype} onChange={e => setPentype(parseInt(e.target.value, 10))} /> Pen type </span>
        </div>
     </div>
     <div className="upload-box"><input type="file" name="answerImage"/>Upload Your answer</div>
     </div>
  )
}

export default QAPage2;






