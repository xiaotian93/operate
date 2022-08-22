import React, { Component } from 'react';
import Page from './page';
import ComponentRoute from './../../../templates/ComponentRoute';

class Ygd extends Component{
    render (){
        return(
            <Page routes={this.props.routes} params={this.props.params} title="小额贷" page_type="cashcoop_daiyunying" path={this.props.location.pathname} />
        )
    }
}
export default ComponentRoute(Ygd);
