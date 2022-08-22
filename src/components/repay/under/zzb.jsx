import React, { Component } from 'react';
import Page from './page';
import ComponentRoute from './../../../templates/ComponentRoute';

class Hs extends Component{
    render (){
        let props = this.props;
        return(
            <Page {...props} title="智尊保业务" page_type="zzb" path={this.props.location.pathname} />
        )
    }
}

export default ComponentRoute(Hs);
