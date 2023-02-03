import SimpleNavbar from '../common/Simple-Navbar';
import Button from 'react-bootstrap/Button';
import React,{Component} from 'react';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import Form from 'react-bootstrap/Form';
import Styles from './assignment.css'


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

class QAPage extends Component {

    state = {
        pencolor : "#e66465",
        pentype : 2,
        erasertype: 12,
        width : 600,
        height : 500
    };
   
   render(){
        return (
            <div className="backgroundDecoration">
                <SimpleNavbar />
                    <div className='navButtons'>
                        <a href="#" class="previous">&laquo; Previous</a>
                        <a href="#" class="next">Next &raquo;</a>
                    </div> 
                    <div className='questionArea'>
                        <p style={{ padding: 50}}>Q1.You will se sample Questions here</p>
                    </div>
                    <div className='canvasSpace'>
                        <ReactSketchCanvas
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
                                })
                                .catch(e => {
                                console.log(e);
                                });}}>Export</Button><br/>
                        </div>
                        <div className='brushcontrols'>
                            <span style={{marginRight: 30}}> <input type="color" value={this.state.pencolor} onChange={e =>this.setState({ pencolor: e.target.value })}/> Pen color  </span>
                            <span style={{marginRight: 10}}> <input type="range" min="1" max="12" value={this.state.pentype}  onChange={e =>this.setState({ pentype: parseInt(e.target.value, 10) })}/> Pen type </span>
                        </div>
                    </div>
                
               <div className='fileUpload'>
                    <Form>
                      <Form.Group className="mb-3" controlId="formAnswer">
                        <Form.Label>Upload you answer</Form.Label>
                        <Form.Control type="file" name="answer"/>
                      </Form.Group>
                    </Form>
               </div>
                {/*<div className='footer'>All rights reserved © 2022</div>*/}
            </div>
        )
   }
}

export default QAPage;