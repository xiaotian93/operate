import React, { Component } from 'react';
import ComponentRoute from '../../../templates/ComponentRoute';
import Iframe from '../../../templates/Iframe_src';
import {host_xjdOnline} from '../../../ajax/config';
class BMD extends Component{
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }
    componentWillMount(){
    }
    
    render (){
        return(
            <div>
                <Iframe src={host_xjdOnline+"manage/order/list?sidebar=false"} />
            </div>
        )
    }
}

export default ComponentRoute(BMD);