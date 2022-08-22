import React, { Component } from 'react';
import { Form, Tabs } from 'antd';
import { page } from '../../../ajax/config';
import Basic from './basic';
import Rele from './relevance';
import ComponentRoute from '../../../templates/ComponentRoute';
const { TabPane } = Tabs;
class Product_cxfq extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filter: {},
            data: [],
            loading: false,
            pageSize: page.size,
            total: 1,
            current: 1,
            visiable: false,
            id: "",
            spin: false
        };
    }
    componentWillMount() {
        
    }
    render() {
        return (
            <div className="sh_add content">
                <Tabs defaultActiveKey="1" className="sh_tab">
                    <TabPane tab="基础信息" key="1">
                        <Basic merchantNo={this.props.location.query.accountId} />
                    </TabPane>
                    <TabPane tab="关联项目" key="2">
                        <Rele merchantNo={this.props.location.query.accountId} />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}
export default ComponentRoute(Form.create()(Product_cxfq));