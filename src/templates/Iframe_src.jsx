import React, { Component } from 'react';
import ComponentRoute from './ComponentRoute';

class BMD extends Component{
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }
    componentWillMount(){
    }
    
    render (){
        var height=document.body.clientHeight-108;
//         function test(){
//             // console.log(i.contentWindow.document.getElementsByTagName())
//             var x = document.getElementById('iframe').contentWindow;

// console.log(x) 
//         }
//         window.onload=function(){
//             var x = document.getElementById('iframe').contentWindow.document;

// console.log(x) 
//         }
        return(
            <div>
                <iframe id="iframe" src={this.props.src} style={{width:"98%",height:height+"px",border:"none",margin:"0 1%"}} title="kh" />
            </div>
        )
    }
}

export default ComponentRoute(BMD);