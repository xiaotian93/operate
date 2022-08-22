import React, { Component } from 'react';
import { Layout } from 'antd';
import SiderMenu from '../../views/SiderMenu';
import PageWrapper from '../../views/PageWrapper';


class PayHome extends Component {
    siderData = [
        {
            title: "待放款",
            router: "/zf/pay",
            children: [
                {
                    title: "白猫贷业务",
                    router: "/zf/pay/bmd",
                    server: global.AUTHSERVER.bmdCashLoan.key,
                    permissions: global.AUTHSERVER.bmdCashLoan.access.pay_list
                },
                {
                    title: "员工贷业务",
                    router: "/zf/pay/ygd",
                    server: global.AUTHSERVER.ygd.key,
                    permissions: global.AUTHSERVER.ygd.access.ygd_wait_pay_list
                },
                {
                    title: "经营贷业务",
                    router: "/zf/pay/jyd",
                    server: global.AUTHSERVER.ygd.key,
                    permissions: global.AUTHSERVER.ygd.access.jyd_wait_pay_list
                },
                {
                    title: "供应链业务",
                    router: "/zf/pay/gyl",
                    server: global.AUTHSERVER.gyl.key,
                    permissions: global.AUTHSERVER.gyl.access.wait_pay_list
                },
                {
                    title: "智尊保业务",
                    router: "/zf/pay/zzb",
                    server: global.AUTHSERVER.bfq.key,
                    permissions: ""
                }
            ]
        },
        {
            title: "付款单查询",
            router: "/zf/trade/pay",
            server: global.AUTHSERVER.payGateway.key,
            permissions: global.AUTHSERVER.payGateway.access.trade_pay_list
        },
        {
            title: "收款单查询",
            router: "/zf/trade/repay",
            server: global.AUTHSERVER.payGateway.key,
            permissions: global.AUTHSERVER.payGateway.access.trade_repay_list
        }
    ]
    render() {
        return (
            <Layout className="ant-layout-has-sider">
                <SiderMenu menuData={this.siderData} defaultSelectedKey={this.props.location.pathname} />
                <PageWrapper routes={this.props.routes}>
                    {this.props.children}
                </PageWrapper>
            </Layout>
        )
    }
}
export default PayHome;