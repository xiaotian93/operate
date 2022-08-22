import React, { Component } from 'react';

import Report from './../table';

class Amount extends Component{
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
                <Report index = {3} />
            </div>
        )
    }
}

export default Amount;
