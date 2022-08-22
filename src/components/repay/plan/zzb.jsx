import React, { Component } from 'react';
import Page from './page';
import ComponentRoute from './../../../templates/ComponentRoute';

class Zzb extends Component{
    render (){
        let paths = this.props.location.pathname;
        return(
            <Page routes={this.props.routes} params={this.props.params} title="智尊保" page_type="zzb" path={paths} />
        )
    }
}

export default ComponentRoute(Zzb);
