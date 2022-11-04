import CanvasDraw from "react-canvas-draw";
import SimpleNavbar from '../common/Simple-Navbar';
import Button from 'react-bootstrap/Button';
import React,{Component} from 'react';


{/*

run this to resolve peer dependencies

npm config set legacy-peer-deps true
after this
install package using 
npm install react-canvas-draw --save */}
{/*code reference for color and brush

https://codesandbox.io/s/0sh2f?file=/src/Diagram.js and 
https://github.com/embiem/react-canvas-draw/blob/master/demo/src/index.js */}

class ReactCanvas extends Component {

    state = {
        pencolor : "#e66465",
        pentype : 2,
        lazypentype : 4,
        width : 600,
        height : 500
    };
   
   render(){
        return (
            <div className="backgroundDecoration">
                <SimpleNavbar />
                    <div className='canvasSpace'>
                        <CanvasDraw
                            ref={canvasDraw => (this.answerCanvas = canvasDraw)}
                            canvasWidth={this.state.width}
                            canvasHeight={this.state.height}
                            brushColor={this.state.pencolor}
                            brushRadius={this.state.pentype}
                            lazyRadius={this.state.lazypentype}
                            hideGrid={true}
                            enablePanAndZoom
                            clampLinesToDocument
                        />
                    </div>
                <div className='canvasbuttons'>
                    <Button style={{ marginRight: 50, marginTop: 15, width: 80}} variant = "outline-info" onClick={() => {this.answerCanvas.clear();}}>Reset</Button><br/>
                    <Button style={{ marginRight: 50, marginTop: 15, width: 80}} variant = "outline-info" onClick={() => {this.answerCanvas.undo();}}>Undo</Button><br/>
                    <Button style={{ marginRight: 50, marginTop: 15, width: 80}} variant = "outline-info" 
                    onClick={() => {console.log(this.answerCanvas.getDataURL()); alert("Exported data url is written to console");}}>Export</Button><br/>
                </div>
                <div className='brushcontrols'>
                    <span style={{marginRight: 30}}> <input type="color" value={this.state.pencolor} onChange={e =>this.setState({ pencolor: e.target.value })}/> Pen color  </span>
                    <span style={{marginRight: 10}}> <input type="range" min="1" max="12" value={this.state.pentype}  onChange={e =>this.setState({ pentype: parseInt(e.target.value, 10) })}/> Pen type </span>
                </div>

                <div className='footer'>All rights reserved © 2022</div>
            </div>
        )
   }
}

export default ReactCanvas;