import React, { Component } from 'react';
import Bmd from '../components/bmdContent';
import ComponentRoute from '../../../templates/ComponentRoute';

class BMD extends Component{
    constructor(props) {
        super(props);
        this.state = {
           
        };
    }
    render (){
        return <Bmd status={"10"} type="review" pathname={this.props.location.pathname} />
    }
}

export default ComponentRoute(BMD);
