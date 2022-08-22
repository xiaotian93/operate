import React, { Component } from 'react';
import Page from './page_cxfq';
import ComponentRoute from '../../../../templates/ComponentRoute';

class Hs extends Component{
    render (){
        let props = this.props;
        return(
            <Page {...props} title="车险分期出单" page_type="cxfq" path={this.props.location.pathname} />
        )
    }
}

export default ComponentRoute(Hs);
