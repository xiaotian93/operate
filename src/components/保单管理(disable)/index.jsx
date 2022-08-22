import React, { Component } from 'react';
import { Layout } from 'antd';
import SiderMenu from '../../views/SiderMenu';
import PageWrapper from '../../views/PageWrapper';

class InsuranceHome extends Component {
    siderData = [
        // {
        //     title: "保单管理-车险",
        //     router: "/bd/indent/cxfq",
        //     server: global.AUTHSERVER.cxfq.key,
        //     permissions: global.AUTHSERVER.cxfq.access.bd_list
        // },
        // {
        //     title: "投保单管理-车险",
        //     router: "/bd/tbd/cxfq",
        //     server: global.AUTHSERVER.cxfq.key,
        //     permissions: global.AUTHSERVER.cxfq.access.tbd_list
        // },
        {
            title: "保单管理-花生",
            router: "/bd/indent/hs",
            server: global.AUTHSERVER.insurance.key,
            permissions: global.AUTHSERVER.insurance.access.hs_insurance_list
        },
        {
            title: "保单管理-智尊保",
            router: "/bd/indent/zzb",
            server: global.AUTHSERVER.insurance.key,
            permissions: global.AUTHSERVER.insurance.access.zzb_insurance_list
        },
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

export default InsuranceHome;
