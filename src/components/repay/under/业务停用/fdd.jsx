import React, { Component } from 'react';
import Page from '../page';
import ComponentRoute from '../../../../templates/ComponentRoute';

// 产品说要加一个房抵贷模块...  （不知道为啥）

class Fdd extends Component{
    render (){
        let props = this.props;
        return(
            <Page {...props} title="房抵贷业务" page_type="fdd" path={this.props.location.pathname} />
        )
    }
}

export default ComponentRoute(Fdd);
