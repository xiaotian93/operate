import React, { Component } from 'react';
import Bmd from '../../gtasks/components/bmdContent';
import ComponentRoute from '../../../templates/ComponentRoute';

class BMD extends Component{
    constructor(props) {
        super(props);
        this.state = {
           
        };
    }

    render (){
        return <Bmd type="loan" pathname={this.props.location.pathname} />
    }
}

export default ComponentRoute(BMD);
