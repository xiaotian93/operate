import React, { Component } from 'react';

import Report from './../table';

class Rate extends Component{
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }
    componentWillMount(){
        
    }
    componentDidMount(){
    }
    render(){
        return(
            <div>
                <Report index = {2} />
            </div>
        )
    }
}

export default Rate;
