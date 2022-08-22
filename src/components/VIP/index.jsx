import React, { Component } from 'react';
import { Form, Layout } from 'antd';
import SiderMenu from '../../views/SiderMenu';
import PageWrapper from '../../views/PageWrapper';

class BasicForms extends Component {
    siderData = [
        {
            title: "白猫贷业务",
            router: "/vip/bmd",
            children: [
                {
                    title: "会员订单管理",
                    router: "/vip/bmd/order",
                    server: global.AUTHSERVER.bmdCashLoan.key,
                    permissions: global.AUTHSERVER.bmdCashLoan.access.vip_list
                },
            ]
        },
    ]
    render() {
        return (
            <Layout className="ant-layout-has-sider">
                <SiderMenu menuData={this.siderData} defaultSelectedKey={this.props.location.pathname} />
                <PageWrapper routes = { this.props.routes }>
                    { this.props.children }
                </PageWrapper>
            </Layout>
        )
    }
}

const BasicForm = Form.create()(BasicForms);

export default BasicForm;