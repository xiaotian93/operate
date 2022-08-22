import React, { Component } from 'react';
import Page from '../page';
import ComponentRoute from '../../../../templates/ComponentRoute';

class Cashcoop extends Component{
    render (){
        let props = this.props;
        return <Page {...props} title="信用贷实时" page_type="loancoop_online" path={this.props.location.pathname} />
    }
}

export default ComponentRoute(Cashcoop);
