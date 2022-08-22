import React, { Component } from 'react';

class Iframe extends Component{
    constructor(props) {
        super(props);
        this.state = {
            visible:true
        };
    }
    componentWillMount(){
        
    }
    componentDidMount(){

    }
    render (){
        return <iframe src="../htmls/test.html"></iframe>
    }
}

export default Iframe;