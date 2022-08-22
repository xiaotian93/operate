import React, { Component } from 'react';
import { Row } from 'antd';

// import ImgTag from '../../templates/ImageTag_w';
// import TableCol from '../../templates/TableCol_4';
// import { host_cxfq } from '../../ajax/config';
// import { axios_xjdOffline } from '../../ajax/request'
// import { customer_company_show , gtask_img_url } from '../../ajax/api';
import Panel from '../../templates/Panel';
// import TableLine from '../../templates/TableLine';

class Detail extends Component{
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            id:this.props.location.query.id,
            source:[],
            storages:[]
        };
    }
    componentWillMount(){
        
    }
    componentDidMount(){

    }
    
    render (){
        return(
            <Row className="detail-contain">
                <Panel title="还款信息">
                    <div className="">待开发</div>
                </Panel>
            </Row>
        )
    }
}

export default Detail;
