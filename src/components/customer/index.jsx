import React, { Component } from 'react';
import { Layout } from 'antd';
import SiderMenu from '../../views/SiderMenu';
import PageWrapper from '../../views/PageWrapper';
import MgntProjectCtrl from '../../request/mgnt/project';

class CustomerHome extends Component {
    constructor(props) {
        super(props);
        this.state = { ready:false }
    }
    
    componentDidMount(){
        MgntProjectCtrl.ready().finally(data=>{
            this.setState({ready:true});
        })
    }
    selectKey = this.props.location.pathname;
    openKey = this.selectKey.split("/").slice(0, 3).join("/")
    siderData = [
        {
            title: "个人客户",
            router: "/kh/private/list",
            server: global.AUTHSERVER.mgnt.key,
            permissions: global.AUTHSERVER.mgnt.access.borrower_list
        },
        {
            title: "企业客户",
            router: "/kh/anterprise/list",
            server: global.AUTHSERVER.mgnt.key,
            permissions: global.AUTHSERVER.mgnt.access.borrower_list
        },
        {
            title: "供应链业务",
            router: "/kh/gyl/list",
            server: global.AUTHSERVER.gyl.key,
            permissions: ""
        },
        {
            title: "经营贷业务",
            router: "/kh/jyd/list",
            server: global.AUTHSERVER.ygd.key,
            permissions: global.AUTHSERVER.ygd.access.default
        },
        {
            title: "审批管理",
            router: "/kh/approve/list",
            server: global.AUTHSERVER.mgnt.key,
            permissions: global.AUTHSERVER.mgnt.access.borrower_phone_change_list
        }
    ]
    render() {
        return (
            <Layout className="ant-layout-has-sider">
                <SiderMenu menuData={this.siderData} defaultSelectedKey={this.selectKey} defaultOpenKey={this.openKey} />
                <PageWrapper routes = { this.props.routes } ready={this.state.ready}>
                    {this.props.children}
                </PageWrapper>
            </Layout>
        )
    }
}

export default CustomerHome;