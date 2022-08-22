import React, { Component } from 'react';
import { Layout } from 'antd';
import SiderMenu from '../../views/SiderMenu';
import PageWrapper from '../../views/PageWrapper';

class RepayHome extends Component {
    selectedKey = this.props.location.pathname;
    siderData = [
        {
            title: "还款查询",
            router: "/hk/under",
            children: [
                {
                    title: "自有资金业务",
                    router: "/hk/under/zyzj",
                    server: global.AUTHSERVER.mgnt.key,
                    permissions: global.AUTHSERVER.mgnt.access.repay_contract_list
                },
                {
                    title: "白猫贷业务",
                    router: "/hk/under/cashloan",
                    server: global.AUTHSERVER.mgnt.key,
                    permissions: global.AUTHSERVER.mgnt.access.repay_contract_list
                },
                {
                    title: "助贷业务",
                    router: "/hk/under/zd",
                    server: global.AUTHSERVER.mgnt.key,
                    permissions: global.AUTHSERVER.mgnt.access.repay_contract_list
                },
                {
                    title: "保理业务",
                    router: "/hk/under/bl",
                    server: global.AUTHSERVER.mgnt.key,
                    permissions: global.AUTHSERVER.mgnt.access.repay_contract_list
                },
                {
                    title: "员工贷业务",
                    router: "/hk/under/ygd",
                    server: global.AUTHSERVER.mgnt.key,
                    permissions: global.AUTHSERVER.mgnt.access.repay_contract_list
                },
                {
                    title: "经营贷业务",
                    router: "/hk/under/jyd",
                    server: global.AUTHSERVER.mgnt.key,
                    permissions: global.AUTHSERVER.mgnt.access.repay_contract_list
                },
                {
                    title: "供应链业务",
                    router: "/hk/under/gyl",
                    server: global.AUTHSERVER.mgnt.key,
                    permissions: global.AUTHSERVER.mgnt.access.repay_contract_list
                },
                
                {
                    title: "小额贷业务",
                    router: "/hk/under/cashcoop_daiyunying",
                    server: global.AUTHSERVER.loanmanage.key,
                    permissions: global.AUTHSERVER.loanmanage.access.lsdk_under_repay_list
                },
                {
                    title: "智尊保业务",
                    router: "/hk/under/zzb",
                    server: global.AUTHSERVER.loanmanage.key,
                    permissions: global.AUTHSERVER.loanmanage.access.zzb_under_repay_list
                }
            ]
        },
        {
            title: "还款计划",
            router: "/hk/plan",
            children: [
                {
                    title: "自有资金业务",
                    router: "/hk/plan/zyzj",
                    server: global.AUTHSERVER.mgnt.key,
                    permissions: global.AUTHSERVER.mgnt.access.repay_contract_list
                },
                {
                    title: "白猫贷业务",
                    router: "/hk/plan/cashloan",
                    server: global.AUTHSERVER.mgnt.key,
                    permissions: global.AUTHSERVER.mgnt.access.repay_contract_list
                },
                {
                    title: "助贷业务",
                    router: "/hk/plan/zd",
                    server: global.AUTHSERVER.mgnt.key,
                    permissions: global.AUTHSERVER.mgnt.access.repay_contract_list
                },
                {
                    title: "保理业务",
                    router: "/hk/plan/bl",
                    server: global.AUTHSERVER.mgnt.key,
                    permissions: global.AUTHSERVER.mgnt.access.repay_contract_list
                },
                {
                    title: "员工贷业务",
                    router: "/hk/plan/ygd",
                    server: global.AUTHSERVER.mgnt.key,
                    permissions: global.AUTHSERVER.mgnt.access.repay_contract_list
                },
                {
                    title: "经营贷业务",
                    router: "/hk/plan/jyd",
                    server: global.AUTHSERVER.mgnt.key,
                    permissions: global.AUTHSERVER.mgnt.access.repay_contract_list
                },
                {
                    title: "供应链业务",
                    router: "/hk/plan/gyl",
                    server: global.AUTHSERVER.mgnt.key,
                    permissions: global.AUTHSERVER.mgnt.access.repay_contract_list
                },
                
                {
                    title: "小额贷业务",
                    router: "/hk/plan/cashcoop_daiyunying",
                    server: global.AUTHSERVER.loanmanage.key,
                    permissions: global.AUTHSERVER.loanmanage.access.lsdk_repay_plan_list
                },
                {
                    title: "智尊保业务",
                    router: "/hk/plan/zzb",
                    server: global.AUTHSERVER.loanmanage.key,
                    permissions: global.AUTHSERVER.loanmanage.access.zzb_repay_plan_list
                }
            ]
        },
        {
            title: "减免审批",
            router: "/hk/audit",
            server: global.AUTHSERVER.mgnt.key,
            permissions: global.AUTHSERVER.mgnt.access.discount_list
        },
        {
            title: "导出数据",
            router: "/hk/export",
            server: global.AUTHSERVER.mgnt.key,
            permissions: global.AUTHSERVER.mgnt.access.repay_detail_export
        },
    ]
    render() {
        return <Layout className="ant-layout-has-sider">
            <SiderMenu menuData={this.siderData} defaultSelectedKey={this.selectedKey} />
            <PageWrapper routes={this.props.routes}>
                {this.props.children}
            </PageWrapper>
        </Layout>
    }
}


export default RepayHome;