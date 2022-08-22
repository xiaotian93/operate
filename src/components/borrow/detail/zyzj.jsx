import React, { Component } from 'react';
import { Tabs } from 'antd';
import UserInfo from '../../repay/plan/detail/userInfo';
import OrderInfo from '../../repay/plan/detail/orderInfo';
import ComponentRoute from '../../../templates/ComponentRoute';
const TabPane = Tabs.TabPane;
class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contract_no: this.props.location.query.contract_no,
            contractId: this.props.location.query.contractId,
            borrowerId: this.props.location.query.borrowerId,
            title: this.props.location.query.labelName,

        };
    }
    componentWillMount(){

    }
    render() {
        return <div className="content" style={{ marginBottom: "30px" }}>
            <Tabs defaultActiveKey="1" className="sh_tab">
                <TabPane tab="用户信息" key="detail3">
                    <UserInfo borrowerId={this.state.borrowerId} contract_no={this.state.contract_no} title={this.state.title} />
                </TabPane>
                <TabPane tab="进件详情" key="detail4" style={{ padding: "0px" }}>
                    <OrderInfo contract_no={this.state.contract_no} contractId={this.state.contractId} title={this.state.title} />
                </TabPane>
            </Tabs>
        </div>
    }
}
export default ComponentRoute(Detail)