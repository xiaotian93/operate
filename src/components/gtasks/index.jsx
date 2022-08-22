import React, { Component } from 'react';
import { Layout } from 'antd';
import SiderMenu from '../../views/SiderMenu';
import PageWrapper from '../../views/PageWrapper';

class GtasksHome extends Component {
    siderData = [
        {
            title: "白猫贷评额",
            router: "/db/bmd",
            children: [
                {
                    title: "机审评额",
                    router: "/db/bmd/auto",
                    server: global.AUTHSERVER.bmdCashLoan.key,
                    permissions: global.AUTHSERVER.bmdCashLoan.access.credit_system_list
                },
                {
                    title: "人工评额",
                    router: "/db/bmd/audit",
                    server: global.AUTHSERVER.bmdCashLoan.key,
                    permissions: global.AUTHSERVER.bmdCashLoan.access.credit_manual_list
                },
            ]
        },
        {
            title: "待初审",
            router: "/db/check",
            children: [
                {
                    title: "白猫贷业务",
                    router: "/db/check/bmd",
                    server: global.AUTHSERVER.bmdCashLoan.key,
                    permissions: global.AUTHSERVER.bmdCashLoan.access.audit0_list
                },
                {
                    title: "员工贷业务",
                    router: "/db/check/ygd",
                    server: global.AUTHSERVER.ygd.key,
                    permissions: global.AUTHSERVER.ygd.access.ygd_approve0_list
                },
                {
                    title: "经营贷业务",
                    router: "/db/check/jyd",
                    server: global.AUTHSERVER.ygd.key,
                    permissions: global.AUTHSERVER.ygd.access.jyd_approve0_list
                },
                {
                    title: "供应链业务",
                    router: "/db/check/gyl",
                    server: global.AUTHSERVER.gyl.key,
                    permissions: global.AUTHSERVER.gyl.access.approve0_list
                },
                {
                    title: "智尊保业务",
                    router: "/db/check/zzb",
                    server: global.AUTHSERVER.bfq.key,
                    permissions: ""
                },
            ]
        },
        {
            title: "待复审",
            router: "/db/review",
            children: [
                {
                    title: "白猫贷业务",
                    router: "/db/review/bmd",
                    server: global.AUTHSERVER.bmdCashLoan.key,
                    permissions: global.AUTHSERVER.bmdCashLoan.access.audit1_list
                },
                {
                    title: "员工贷业务",
                    router: "/db/review/ygd",
                    server: global.AUTHSERVER.ygd.key,
                    permissions: global.AUTHSERVER.ygd.access.ygd_approve1_list
                },
                {
                    title: "经营贷业务",
                    router: "/db/review/jyd",
                    server: global.AUTHSERVER.ygd.key,
                    permissions: global.AUTHSERVER.ygd.access.jyd_approve1_list
                },
                {
                    title: "供应链业务",
                    router: "/db/review/gyl",
                    server: global.AUTHSERVER.gyl.key,
                    permissions: global.AUTHSERVER.gyl.access.approve1_list
                },
                {
                    title: "智尊保业务",
                    router: "/db/review/zzb",
                    server: global.AUTHSERVER.bfq.key,
                    permissions: ""
                },
            ]
        },
        {
            title: "支付待审核",
            router: "/db/pay/audit",
            server: global.AUTHSERVER.payGateway.key,
            permissions: global.AUTHSERVER.payGateway.access.api_trade_pay_list
        },
    ]
    render() {
        return (
            <Layout className="ant-layout-has-sider" >
                <SiderMenu menuData={this.siderData} defaultSelectedKey={this.props.location.pathname} />
                <PageWrapper routes={this.props.routes}>
                    { this.props.children }
                </PageWrapper>
            </Layout>
        )
    }
}


export default GtasksHome;