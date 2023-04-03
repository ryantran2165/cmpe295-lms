import React, { useState, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import UserHeader from '../common/UserHeader';
import Styles from './assignment.css';
import { useLocation, useNavigate } from 'react-router-dom';
import {format} from 'date-fns';
{/*

run this to resolve peer dependencies

npm config set legacy-peer-deps true
after this
install package using 
npm install react-sketch-canvas */}
{/*code reference for color and brush

https://www.npmjs.com/package/react-sketch-canvas */}

{/*code reference for previous and next buttons

https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_next_prev 

dynamically hiding and showing divs based on ids

https://caseyyee.com/blog/react-ref-collections/


*/}
const QAPage = () => {
  const [pencolor, setPencolor] = useState("#e66465");
  const [pentype, setPentype] = useState(2);
  const [erasertype, setEraserType] = useState(12);
  const [width, setWidth] = useState(980);
  const [height, setHeight] = useState(560);

  

  


  const toggleVisibility = (index) => {
    if (index === visibleDiv) {
      setVisibleDiv(null);
      setCurrentDiv(0);
    } else {
      setVisibleDiv(index);
      setCurrentDiv(index);
    }
  };

  const goPrev = () => {
    const prevIndex = currentDiv - 1;
    setVisibleDiv(prevIndex);
    setCurrentDiv(prevIndex);
  };

  const goNext = () => {
    const nextIndex = currentDiv + 1;
    setVisibleDiv(nextIndex);
    setCurrentDiv(nextIndex);
  };

  var imageUrl = '';
  

  const location = useLocation();
  const history = useNavigate();
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
    assignmentName: location.state.assignmentName,
    questions: location.state.questions,
    instructions: location.state.assignmentDescription,
    assignmentNumber: location.state.assignmentNumber,
    cname: location.state.cname,
    cid: location.state.parentCourse,
    instructorFname: location.state.instructorFname,
    instructorLname: location.state.instructorLname,
    instructorEmail:location.state.instructorEmail,
    caller: location.state.caller
  });


  const questionDivRefs = useRef([]);
  const [visibleDiv, setVisibleDiv] = useState(null);
  const [currentDiv, setCurrentDiv] = useState(0);
  const disablePrevButton = currentDiv === 0;
  const disableNextButton = currentDiv === assignment.questions.length - 1;
  const [selectionStates, setSelectionStates] = useState(Array(assignment.questions.length).fill({
    isUploadSolution: false,
    isCanvasDisabled: false,
  }));

  const [answers, setAnswers] = useState([]);

  const updateAnswer = (index, answerFile, question) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = { question: question, answer: answerFile };
    setAnswers(updatedAnswers);
    alert("Answer Saved Succefully!");
  };

  const updateAnswerImage = (index, event, question) => {
    var id = 'answerImage'+index
    var file = document.getElementById(id).files[0]
    const updatedAnswers = [...answers];
    updatedAnswers[index] = { question: question, answer: file };
    setAnswers(updatedAnswers);
    alert("Answer Saved Succefully!");
  };

  const submitAnswer = async(event) =>{
        event.preventDefault();
        event.stopPropagation();
        console.log("answers array", answers);
        var submittedDate = format(new Date(), "MM-dd-yyyy");
        var questions = [];
        var formData = new FormData();
        formData.append('student', user.userId);
        formData.append('dateSubmitted', submittedDate);
        console.log("answers")
        answers.map((ans, index) => {
            formData.append('fileURL', ans.answer);
            questions.push({'question':ans.question});
            console.log(ans.answer);
        })
        console.log("questions", questions);
        console.log(typeof submittedDate);
        formData.append('answers', questions);
        for (var x of formData) console.log(x);
        axios.post(`http://localhost:3001/api/v1/assgs/submit/${assignment.assignmentId}`, formData)
        .then(function (response) {
          console.log(response.status);
          if(response.status === 200){
          alert("answer submitted successfully");
          goBackToList();
          }
          else
          alert("unable to submit answer");
        })
        .catch(function (error) {
          console.log(error.response);
        });
  }


  const goBackToList = () =>{

    if(assignment.caller === 'quizPage')
    goBackToQuizPage();
    else
    goBackToAssignmentPage();
    
  }

  const goBackToQuizPage = () =>{
    history("/quizpage", {state:{userName:user.userName,
        email:user.email, 
        role:user.role,
        firstName:user.firstName,
        lastName:user.lastName,
        userId: user.userId,
        parentCourse:assignment.courseId,
        cname: assignment.cname,
        instructorFname: assignment.instructorFname,
        instructorLname: assignment.instructorLname,
        instructorEmail:assignment.instructorEmail
        }});
  }

  const goBackToAssignmentPage = () =>{
    history("/assignmentpage", {state:{userName:user.userName,
        email:user.email, 
        role:user.role,
        firstName:user.firstName,
        lastName:user.lastName,
        userId: user.userId,
        parentCourse:assignment.courseId,
        cname: assignment.cname,
        instructorFname: assignment.instructorFname,
        instructorLname: assignment.instructorLname,
        instructorEmail:assignment.instructorEmail
        }});
  }



  return (
    <div className="backgroundDecoration">
      {/*<UserHeader user={user}/>*/}
      {
        assignment.questions.map((question, index) => 
      <div key={question._id}
      ref={(el) => (questionDivRefs.current[index] = el)}
      style={{ display: visibleDiv === index ? "block" : "none" }}>
      <div className="assignment-box">
        <div className="assignment-box-head">
          <h2>{index+1}.  {" "+question.name}</h2>
          <div className="navigationButtons">
          <Button style={{ marginRight: 50, height: 45, width: 120 }} variant="outline-success" onClick={(event)=>submitAnswer(event)} disabled={!disableNextButton}>Submit Quiz</Button>
            <button className="previousButton" onClick={goPrev} disabled={disablePrevButton}>Previous</button>
            <button className="nextButton" onClick={goNext} disabled={disableNextButton}>Next</button>
          </div>
        </div>
        <div className="questionSection">
          <p style={{ padding: 50 }}>{question.description}</p>
          <input type="radio" name={`solutionType-${index}`} value="upload" onClick={() => setSelectionStates(prevStates => {
            const newStates = [...prevStates];
            newStates[index] = {
              ...newStates[index],
              isUploadSolution: true,
              isCanvasDisabled: true,
            };
            return newStates;})} /> Upload Solution
          <input type="radio" name={`solutionType-${index}`} value="draw" onClick={() => setSelectionStates(prevStates => {
            const newStates = [...prevStates];
            newStates[index] = {
              ...newStates[index],
              isUploadSolution: false,
              isCanvasDisabled: false,
            };
            return newStates;})} /> Draw Solution
        </div>
        <div className="answerArea">
        {!selectionStates[index].isCanvasDisabled && (
          <ReactSketchCanvas
            ref={answerCanvas}
            width={width}
            height={height}
            strokeColor={pencolor}
            strokeWidth={pentype}
            eraserWidth={erasertype}
            hideGrid={true}
          />)}
          {!selectionStates[index].isCanvasDisabled && (
          <div className='canvasbuttons'>
            <Button style={{ marginRight: 50, marginTop: 15, width: 80 }} variant="outline-info" onClick={() => { answerCanvas.current.clearCanvas(); }}>Reset</Button><br/>
            <Button style={{ marginRight: 50, marginTop: 15, width: 80 }} variant="outline-info" onClick={() => { answerCanvas.current.undo(); }}>Undo</Button><br/>
            <Button style={{ marginRight: 50, marginTop: 15, width: 80 }} variant="outline-info" onClick={() => { answerCanvas.current.eraseMode(true); }}>Eraser</Button><br/>
            <Button style={{ marginRight: 50, marginTop: 15, width: 80 }} variant="outline-info" onClick={() => { answerCanvas.current.eraseMode(false); }}>Pen</Button><br/>
            <Button style={{ marginRight: 50, marginTop: 15, width: 80 }} variant="outline-info" onClick={() => 
                { answerCanvas.current.exportImage("png")
                  .then(
                     data => { 
                      //console.log(data); 
                        const base64String = data;
                        const decodedString = atob(base64String.split(",")[1]);
                        const byteArray = new Uint8Array(decodedString.length);
                        for (let i = 0; i < decodedString.length; i++) {
                        byteArray[i] = decodedString.charCodeAt(i);
                        }
                        var answerFile = null;
                        var answerImageName = "";
                        var qno = index+1;
                        answerImageName = user.userId+"_"+assignment.courseId+"_"+assignment.assignmentId+"_question"+qno+".png";
                        const blob = new Blob([byteArray], { type: "image/png" });
                        answerFile = new File([blob], answerImageName, { type: "image/png" });
                        updateAnswer(index, answerFile, question._id);

                     })
                  .catch(
                     e => { console.log(e); 
                     }); }}>Save</Button><br/>
          <Button style={{ marginRight: 50, marginTop: 15, width: 80 }} variant="outline-info" onClick={goBackToList}>Cancel</Button><br/>
          </div>)}
          {selectionStates[index].isUploadSolution && (
          <ReactSketchCanvas
            ref={answerCanvas}
            width={width}
            height={height}
            strokeColor={pencolor}
            strokeWidth={pentype}
            eraserWidth={erasertype}
            hideGrid={true}
            style={selectionStates[index].isUploadSolution ? {pointerEvents: "none", opacity: "0.4"} : {}}
          />)}
          {selectionStates[index].isUploadSolution && (
          <div className='canvasbuttons'>
            <Button style={{ marginRight: 50, marginTop: 15, width: 80 }} variant="outline-info" disabled>Reset</Button><br/>
            <Button style={{ marginRight: 50, marginTop: 15, width: 80 }} variant="outline-info" disabled>Undo</Button><br/>
            <Button style={{ marginRight: 50, marginTop: 15, width: 80 }} variant="outline-info" disabled>Eraser</Button><br/>
            <Button style={{ marginRight: 50, marginTop: 15, width: 80 }} variant="outline-info" disabled>Pen</Button><br/>
            <Button style={{ marginRight: 50, marginTop: 15, width: 80 }} variant="outline-info" disabled>Save</Button><br/>
          <Button style={{ marginRight: 50, marginTop: 15, width: 80 }} variant="outline-info" disabled>Cancel</Button><br/>
          </div>)}
        </div>
        <div className='brushcontrols'>
          <span style={{ marginRight: 100 }}> <input type="color" value={pencolor} onChange={e => setPencolor(e.target.value)} /> Pen color  </span>
          <span style={{ marginRight: 10 }}> <input type="range" min="1" max="12" value={pentype} onChange={e => setPentype(parseInt(e.target.value, 10))} /> Pen type </span>
        </div>
     </div>
     {selectionStates[index].isUploadSolution && (
     <div className="upload-box"><input type="file"  id={"answerImage"+index} /><button onClick={(event) => updateAnswerImage(index, event, question._id)}>Save answer image</button></div>)}
     </div>
     )}
     <div className='navigableQuestionList'>
        {assignment.questions.map((question, index) => (
          <button className="showHideQuestions" key={question.id} onClick={() => toggleVisibility(index)}>
            {index === visibleDiv ? "Hide" : "Show"} question {index + 1}
          </button>
        ))}
      </div>
     </div>
  )
}

export default QAPage;








