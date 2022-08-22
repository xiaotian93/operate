import React, { Component } from 'react';
import { Row } from 'antd';

import TableLine from '../../../templates/TableLine';

class ContractInfo extends Component{
    constructor(props) {
        super(props);
        this.state = {
            contract:props["source"]
        };
    }
    componentWillMount(){
        let industryStrs = {"1":"居民服务和其他服务业","2":"建筑业","3":"交通运输、仓储和邮政业","4":"农、林、牧、渔业","5":"采矿业","6":"制造业","7":"电力、燃气及水的生产和供应业","8":"信息传输、计算机服务和软件业","9":"批发和零售业","10":"住宿和餐饮业","11":"房地产业","12":"租赁和商务服务业","13":"其他"}
        let purposeStrs = {"1":"流动资金贷款 ","2":"固定资产投资贷款 ","3":"其他"}
        let loan_typeStrs = {"1":"信用  ","2":"保证  ","3":"抵押   ","4":"质押  ","5":"其他"}
        let period_type = {1: "日", 2: "周", 3: "月", 4: "季度", 5: "年"}
        this.columns_contract = [
            {
                title: '产品名称',
                dataIndex: 'loanSystem.name'
            },
            {
                title: '订单编号',
                dataIndex: 'contactInfo.domainNo'
            },
            {
                title: '合同编号',
                dataIndex: 'contactInfo.contractNo'
            },
            {
                title: '合同状态',
                dataIndex: 'contactInfo.statusStr'
            },
            {
                title: '合同名称',
                dataIndex: 'mpDefault.loanContractName'
            },
            {
                title: '合同签订日期',
                dataIndex: 'mpDefault.signDate'
            },
            {
                title: '借款方',
                className: "grey",
                dataIndex: 'contactInfo.name'
            },
            {
                title: '客户类型',
                className: "grey",
                render:(data)=>{
                    return data.contactInfo.borrowType===0?"个人":"企业"
                }
            },
            {
                title: '借款金额',
                className: "grey",
                render:(data)=>{
                    return data.contactInfo.loanAmount.money()
                }
            },
            {
                title: '借款期限',
                render:(data) => {
                    return data.contactInfo.periodTerm+"("+ period_type[data.contactInfo.periodType] +")";
                }
            },
            {
                title: '借款开始日期',
                dataIndex: 'contactInfo.loanStartDate'
            },
            {
                title: '借款截止日期',
                dataIndex: 'contactInfo.loanEndDate'
            },
            {
                title: '年化利率',
                className: "grey",
                dataIndex: 'contactInfo.yearRate'
            },
            {
                title: '还款来源',
                className: "grey",
                render:(data)=>{
                    return data.contactInfo.borrowType===0?"工资":"营业收入"
                }
            },
            {
                title: '还款方式',
                className: "grey",
                dataIndex: 'mpDefault.lending_pay_type'
            },
            {
                title: '借款投向',
                render:(data)=>{
                    return industryStrs[data.mpDefault.industry];
                }
            },
            {
                title: '借款方式',
                render:(data)=>{
                    return loan_typeStrs[data.mpDefault.loanType];
                }
            },
            {
                title: '借款用途',
                render:(data)=>{
                    return purposeStrs[data.mpDefault.purpose];
                }
            },
            {
                title: '是否展期',
                className: "grey",
                render:(data)=>{
                    return data.mpDefault.isExtend===0?"否":"是"
                }
            },
            {
                title: '附件',
                className: "grey",
                render:(data)=>{
                    return (
                        <span>
                            <a target="_blank" href={"http://ot.baimaodai.com/contract/trust?contract_no="+data.contactInfo.contractNo}>《征信授权书》.pdf&emsp;</a> <br />
                            <a target="_blank" href={"http://ot.baimaodai.com/contract?contract_no="+data.contactInfo.contractNo}>《借款合同》.pdf</a> <br />
                            <a target="_blank" href={"http://res.baimaodai.com/web/ygd/file/4.0-bmd-xxsqxy.20180228.pdf"}>《信息授权书》.pdf</a><br />
                            <a target="_blank" href={"http://res.baimaodai.com/web/ygd/file/ygd-ygcnh.20180102.pdf"}>《承诺书》.pdf</a>
                        </span>
                    )
                }
            }
        ]
    }
    componentDidMount(){
    }
    componentWillReceiveProps(props){
        this.setState({
            contract:props.source
        })
    }

  
    render (){
        console.log(this.state.contract);
        return(
            <Row className="detail-content">
                <div className="detail-title">还款信息</div>
                <div className="detail-body">
                    <TableLine columns={this.columns_contract} dataSource={this.state.contract} />
                </div>
            </Row>
        )
    }
}

export default ContractInfo;
