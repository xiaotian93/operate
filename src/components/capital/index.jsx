import React, { Component } from 'react';
import { Form, Layout } from 'antd';
import SiderMenu from '../../views/SiderMenu';
import PageWrapper from '../../views/PageWrapper';
import AccountCtrl from '../../request/capital/Account';
import AccountBlCtrl from '../../request/capital/AccountBl';
import { hasPermission } from '../../auth/AuthUtil';

class BasicForms extends Component {
    constructor(props) {
        super(props);
        this.state = { ready: false }
    }
    componentDidMount() {
        if (hasPermission(global.AUTHSERVER.account.key, global.AUTHSERVER.account.access.balance_list)) {
            AccountCtrl.ready().then(data => {
                this.setState({ ready: true });
            }).catch(e => this.setState({ ready: true }))
        } else {
            this.setState({ ready: true });
        }
        if (hasPermission(global.AUTHSERVER.account.key, global.AUTHSERVER.account.access.gj_oper)) {
            AccountBlCtrl.ready().then(data => {
                this.setState({ ready: true });
            }).catch(e => this.setState({ ready: true }))
        } else {
            this.setState({ ready: true });
        }
    }
    siderData = [
        {
            title: "账户一览",
            router: "/zj/account",
            server: global.AUTHSERVER.account.key,
            permissions: global.AUTHSERVER.account.access.balance_list
        },
        {
            title: "明细汇总",
            router: "/zj/total",
            server: global.AUTHSERVER.account.key,
            permissions: global.AUTHSERVER.account.access.accounting_list
        },
        {
            title: "业务分账",
            router: "/zj/business",
            server: global.AUTHSERVER.account.key,
            permissions: global.AUTHSERVER.account.access.divide
        },
        {
            title: "业务与三方对账差异",
            router: "/zj/difference",
            server: global.AUTHSERVER.account.key,
            permissions: "lm_reconcile"
        },
        {
            title: "银行与三方对账结果",
            router: "/zj/bank",
            server: global.AUTHSERVER.account.key,
            permissions: "inner_reconcile"
        },
        {
            title: "保理账户一览",
            router: "/zj/blaccount",
            server: global.AUTHSERVER.account.key,
            permissions: global.AUTHSERVER.account.access.gj_oper
        },
        {
            title: "保理明细汇总",
            router: "/zj/bltotal",
            server: global.AUTHSERVER.account.key,
            permissions: global.AUTHSERVER.account.access.gj_oper
        },
        {
            title: "保理业务分账",
            router: "/zj/blbusiness",
            server: global.AUTHSERVER.account.key,
            permissions: global.AUTHSERVER.account.access.gj_oper
        }
    ]
    render() {
        return (
            <Layout className="ant-layout-has-sider">
                <SiderMenu menuData={this.siderData} defaultSelectedKey={this.props.location.pathname} keyLength={3} />
                <PageWrapper routes={this.props.routes} ready={this.state.ready}>
                    {this.props.children}
                </PageWrapper>
            </Layout>
        )
    }
}

const BasicForm = Form.create()(BasicForms);

export default BasicForm;