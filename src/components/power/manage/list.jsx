import React, { Component } from 'react';
import {Form, Tabs, Table} from 'antd';
import ComponentRoute from '../../../templates/ComponentRoute';
import dataInfo from "./data";
const { TabPane } = Tabs;
class Loan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkAll: true,
            activeKey:"test",
            list:[]
        };
        this.loader = [];
    }
    componentWillMount() {
        this.columns_modal = [
            // {
            //     title: "功能模块",
            //     dataIndex: "gnmk",
            //     render: (e, row, index) => {
            //         const obj = {
            //             children: 
            //                 e.title
            //             ,
            //             props: {
            //                 rowSpan: e.span || 0
            //             }
            //         }
            //         return obj
            //     }
            // },
            {
                title: "功能菜单",
                dataIndex: "gncd",
                render: (e, row, index) => {
                    const obj = {
                        children: e.title,
                        props: {
                            rowSpan: e.span || 0
                        }
                    }
                    return obj
                }
            },
            {
                title: "业务列表",
                dataIndex: "ywlb",
                render: (e, row, index) => {
                    if(!e.title){
                        return;
                    }
                    return e.title
                }
            },
            {
                title: "功能权限",
                dataIndex: "gnqx",
                render: (e, row, index) => {
                    var arr = [];
                    for (var i in e) {
                        arr.push(<span style={{marginRight:"20px"}} key={e[i].value}>{e[i].label}</span>)
                    }
                    if(e.length<1){
                        return "无"
                    }
                    return arr.length>0?arr:"无"
                }
            },
        ]
    }
    componentDidMount() {
    }
    
    render() {
        return (
            <div style={{padding: "20px"}}>
                <div className="content" style={{background:"#fff"}}>
                    <Tabs tabPosition="left">
                        <TabPane tab="待办管理" key="db">
                            <Table columns={this.columns_modal} dataSource={dataInfo.db} pagination={false} bordered />
                        </TabPane>
                        <TabPane tab="支付管理" key="zf">
                            <Table columns={this.columns_modal} dataSource={dataInfo.zf} pagination={false} bordered />
                        </TabPane>
                        <TabPane tab="借款管理" key="jk">
                            <Table columns={this.columns_modal} dataSource={dataInfo.jk} pagination={false} bordered />
                        </TabPane>
                        <TabPane tab="还款管理" key="hk">
                            <Table columns={this.columns_modal} dataSource={dataInfo.hk} pagination={false} bordered />
                        </TabPane>
                        <TabPane tab="资金管理" key="zj">
                            <Table columns={this.columns_modal} dataSource={dataInfo.zj} pagination={false} bordered />
                        </TabPane>
                        <TabPane tab="产品管理" key="cp">
                            <Table columns={this.columns_modal} dataSource={dataInfo.cp} pagination={false} bordered />
                        </TabPane>
                        <TabPane tab="客户管理" key="kh">
                            <Table columns={this.columns_modal} dataSource={dataInfo.kh} pagination={false} bordered />
                        </TabPane>
                        <TabPane tab="商户管理" key="sh">
                            <Table columns={this.columns_modal} dataSource={dataInfo.sh} pagination={false} bordered />
                        </TabPane>
                        <TabPane tab="保单管理" key="bd">
                            <Table columns={this.columns_modal} dataSource={dataInfo.bd} pagination={false} bordered />
                        </TabPane>
                        <TabPane tab="数据统计" key="tj">
                            <Table columns={this.columns_modal} dataSource={dataInfo.tj} pagination={false} bordered />
                        </TabPane>
                        <TabPane tab="贷后管理" key="dh">
                            <Table columns={this.columns_modal} dataSource={dataInfo.dh} pagination={false} bordered />
                        </TabPane>
                        <TabPane tab="会员管理" key="vip">
                            <Table columns={this.columns_modal} dataSource={dataInfo.vip} pagination={false} bordered />
                        </TabPane>
                        <TabPane tab="其他权限" key="other">
                            <Table columns={this.columns_modal} dataSource={dataInfo.other} pagination={false} bordered />
                        </TabPane>
                    </Tabs>
                    </div>
            </div>
        )
    }
}

export default ComponentRoute(Form.create()(Loan));
