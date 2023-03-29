import React, { useState, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import UserHeader from '../common/UserHeader';
import Styles from './assignment.css';
import { useLocation, useNavigate } from 'react-router-dom';
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

  

  var answers = [];

  var questions = [
    {
      id: "quiz_123",
      parentQuiz: 2,
      questionName: "This is question 1",
      questionDescription: "This is question 1 description",
      points: 1,
      solution: "This is the solution for question 1",
      testCases: "Test cases",
    },
    {
        id: "quiz_223",
        parentQuiz: 2,
        questionName: "This is question 2",
        questionDescription: "This is question 2 description",
        points: 1,
        solution: "This is the solution for question 2",
        testCases: "Test cases",
      },
      {
        id: "quiz_323",
        parentQuiz: 2,
        questionName: "This is question 3",
        questionDescription: "This is question 3 description",
        points: 1,
        solution: "This is the solution for question 3",
        testCases: "Test cases",
      },
      {
        id: "quiz_423",
        parentQuiz: 2,
        questionName: "This is question 4",
        questionDescription: "This is question 4 description",
        points: 1,
        solution: "This is the solution for question 4",
        testCases: "Test cases",
      },
      {
        id: "quiz_523",
        parentQuiz: 2,
        questionName: "This is question 5",
        questionDescription: "This is question 5 description",
        points: 1,
        solution: "This is the solution for question 5",
        testCases: "Test cases",
      }
  ];

  const questionDivRefs = useRef([]);
  const [visibleDiv, setVisibleDiv] = useState(null);
  const [currentDiv, setCurrentDiv] = useState(0);
  const disablePrevButton = currentDiv === 0;
  const disableNextButton = currentDiv === questions.length - 1;


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
    instructions: location.state.assignmentInstructions,
    assignmentNumber: location.state.assignmentNumber,
    cname: location.state.cname,
    cid: location.state.parentCourse,
    instructorFname: location.state.instructorFname,
    instructorLname: location.state.instructorLname,
    instructorEmail:location.state.instructorEmail
  });

  const submitAnswer = async(answerFile) =>{
        console.log(answerFile.name);
        imageUrl = URL.createObjectURL(answerFile);
        var img = document.createElement('img');
        img.src=imageUrl;
        console.log(imageUrl);
        document.getElementsByClassName("upload-box")[0].appendChild(img);
        const formData = new FormData();
        formData.append("fileUpload", answerFile);
        axios.post('http://localhost:3001/api/v1/upload/upload', formData)
        .then(function (response) {
          if(response.data.status === 200){
          alert("answer submitted successfully");
          goBackToList();
          }
          else
          alert("unable to submit answer");
        })
        .catch(function (error) {
          console.log(error.response.data);
        });
  }


  const goBackToList = () =>{
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

  return (
    <div className="backgroundDecoration">
      {/*<UserHeader user={user}/>*/}
      {
        questions.map((question, index) => 
      <div key={question.id}
      ref={(el) => (questionDivRefs.current[index] = el)}
      style={{ display: visibleDiv === index ? "block" : "none" }}>
      <div className="assignment-box">
        <div className="assignment-box-head">
          <h2>Question {index+1} {question.questionName}</h2>
          <div className="navigationButtons">
          <Button style={{ marginRight: 50, height: 45, width: 120 }} variant="outline-success" onClick={goNext} disabled={!disableNextButton}>Submit Quiz</Button>
            <button className="previousButton" onClick={goPrev} disabled={disablePrevButton}>Previous</button>
            <button className="nextButton" onClick={goNext} disabled={disableNextButton}>Next</button>
          </div>
        </div>
        <div className="questionSection">
          <p style={{ padding: 50 }}>{question.questionDescription}</p>
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
                        var answerFile = null;
                        var answerImageName = "hi";
                        /*answerImageName = user.userId+"_"+assignment.courseId+"_"+assignment.assignmentId+".png";*/
                        const blob = new Blob([byteArray], { type: "image/png" });
                        answerFile = new File([blob], answerImageName, { type: "image/png" });
                        submitAnswer(answerFile);

                     })
                  .catch(
                     e => { console.log(e); 
                     }); }}>Save</Button><br/>
          <Button style={{ marginRight: 50, marginTop: 15, width: 80 }} variant="outline-info" onClick={goBackToList}>Cancel</Button><br/>
          </div>
        </div>
        <div className='brushcontrols'>
          <span style={{ marginRight: 100 }}> <input type="color" value={pencolor} onChange={e => setPencolor(e.target.value)} /> Pen color  </span>
          <span style={{ marginRight: 10 }}> <input type="range" min="1" max="12" value={pentype} onChange={e => setPentype(parseInt(e.target.value, 10))} /> Pen type </span>
        </div>
     </div>
     <div className="upload-box"><input type="file" name="answerImage"/>Upload Your answer</div>
     </div>)
     }
     <div className='navigableQuestionList'>
        {questions.map((question, index) => (
          <button className="showHideQuestions" key={question.id} onClick={() => toggleVisibility(index)}>
            {index === visibleDiv ? "Hide" : "Show"} question {index + 1}
          </button>
        ))}
      </div>
     </div>
  )
}

export default QAPage;








{/*class QAPage2 extends Component {

    state = {
        pencolor : "#e66465",
        pentype : 2,
        erasertype: 12,
        width : 980,
        height : 560
    };

    user= {
        firstName: this.location.firstName,
        lastName: this.location.lastName,
        userName: this.location.userName,
        email: this.location.email,
        role: this.location.role
    };
    assignment = {
        cname: this.location.parentCourse,
        cid: this.location.assignmentId,
        instructions: this.location.assignmentInstructions
    };

    
   
   render(){
        return (
            <div className="backgroundDecoration">
                <UserHeader/>
                <div className="assignment-box">
                    <div className="assignment-box-head">
                        <h2>Question 1</h2>
                        <div className="navigationButtons">
                            <button className="previousButton" disabled>Previous</button>
                            <button className="nextButton">Next</button>
                        </div>
                    </div>
                    <div className="questionSection">
                     <p style={{ padding: 50}}>{this.assignment.instructions}</p>
                    </div>
                    <div className="answerArea">
                        {/*<div className='canvasSpace'>*/}
                            {/*<div className='navButtons'>
                                <a href="#" className="previous">&#8249;Previous</a><br/>
                                <a href="#" className="next">Next&#8250;</a>
                            </div>*/}
                           {/* <ReactSketchCanvas
                                ref={canvasDraw => (this.answerCanvas = canvasDraw)}
                                width={this.state.width}
                                height={this.state.height}
                                strokeColor={this.state.pencolor}
                                strokeWidth={this.state.pentype}
                                eraserWidth={this.state.erasertype}
                                hideGrid={true}
                            />
                            <div className='canvasbuttons'>
                                <Button style={{ marginRight: 50, marginTop: 15, width: 80}} variant = "outline-info" onClick={() => {this.answerCanvas.clearCanvas();}}>Reset</Button><br/>
                                <Button style={{ marginRight: 50, marginTop: 15, width: 80}} variant = "outline-info" onClick={() => {this.answerCanvas.undo();}}>Undo</Button><br/>
                                <Button style={{ marginRight: 50, marginTop: 15, width: 80}} variant = "outline-info" onClick={() => {this.answerCanvas.eraseMode(true);}}>Eraser</Button><br/>
                                <Button style={{ marginRight: 50, marginTop: 15, width: 80}} variant = "outline-info" onClick={() => {this.answerCanvas.eraseMode(false);}}>Pen</Button><br/>
                                <Button style={{ marginRight: 50, marginTop: 15, width: 80}} variant = "outline-info" 
                                onClick={() => {this.answerCanvas.exportImage("png").then(data => {
                                    console.log(data);
                                    console.log(this.user.firstName, this.assignment.cname);
                                    })
                                    .catch(e => {
                                    console.log(e);
                                    });}}>Export</Button><br/>
                            </div>
                       {/*</div>*/}
                        {/*</div>
                        <div className='brushcontrols'>
                                <span style={{marginRight: 100}}> <input type="color" value={this.state.pencolor} onChange={e =>this.setState({ pencolor: e.target.value })}/> Pen color  </span>
                                <span style={{marginRight: 10}}> <input type="range" min="1" max="12" value={this.state.pentype}  onChange={e =>this.setState({ pentype: parseInt(e.target.value, 10) })}/> Pen type </span>
                        </div>
                </div>
                <div className="upload-box"><input type="file" name="answerImage"/>Upload Your answer</div>
                
               {/*<div className='fileUpload'>
                    <Form>
                      <Form.Group className="mb-3" controlId="formAnswer">
                        <Form.Label>Upload you answer</Form.Label>
                        <Form.Control type="file" name="answer"/>
                      </Form.Group>
                    </Form>
                            </div>*/}
                {/*<div className='footer'>All rights reserved © 2022</div>*/}
           {/* </div>
        )
   }
}

export default QAPage2;*/}

{/*

 <form  onSubmit={handleSubmit}>
          {formValues.map((element, index) => (
            <div className="form-inline" key={index}>
              <label>Name</label>
              <input type="text" name="name" value={element.name || ""} onChange={e => handleChange(index, e)} />
              <label>Email</label>
              <input type="text" name="email" value={element.email || ""} onChange={e => handleChange(index, e)} />
              {
                index ? 
                  <button type="button"  className="button remove" onClick={() => removeFormFields(index)}>Remove</button> 
                : null
              }
            </div>
          ))}
          <div className="button-section">
              <button className="button add" type="button" onClick={() => addFormFields()}>Add</button>
              <button className="button submit" type="submit">Submit</button>
          </div>
      </form>
      
*/}