import React, { Component } from 'react';
import Page from './page';
import ComponentRoute from './../../../templates/ComponentRoute';

class Hs extends Component{
    render (){
        let props = this.props;
        return(
            <Page {...props} title="小额贷" page_type="cashcoop_daiyunying" path={this.props.location.pathname} />
        )
    }
}

export default ComponentRoute(Hs);
