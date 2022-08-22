import React, { Component } from 'react';
import Page from '../page';
import ComponentRoute from '../../../../templates/ComponentRoute';

class Hs extends Component{
    render (){
        let props = this.props;
        return(
            <Page {...props} title="花生" page_type="hs" path={this.props.location.pathname} />
        )
    }
}

export default ComponentRoute(Hs);
