import React, { Component } from 'react';
import { Tabs } from 'antd';
// import Filter from '../../ui/Filter_obj8';
import { page } from '../../../ajax/config';
import ComponentRoute from '../../../templates/ComponentRoute';
import Product from './product';
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
            <div className="content">
                <Tabs defaultActiveKey="1" className="sh_tab">
                    <TabPane tab="产品信息" key="1">
                        <Product />
                    </TabPane>
                    <TabPane tab="商户信息" key="2">
                        开发中。。。
                    </TabPane>
                </Tabs>
            </div>

        )
    }
}
export default ComponentRoute(Product_cxfq);