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
        if(this.props.children){
            return this.props.children
        }
        return <Bmd status={"0"} type="check" pathname={this.props.location.pathname} />
    }
}

export default ComponentRoute(BMD);
