import React, { Component } from 'react';

import { Table, Row, Col } from 'antd';
import { axios_xjd_p, axios_loan } from '../../../../../../ajax/request';
import { merchant_bmd_business_detail, merchant_bmd_business_info } from '../../../../../../ajax/api';
import {accMul} from '../../../../../../ajax/tool';
class Bus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            service_fee: "0",
            id: "",
            userEdit: [],
            userArr: [],
            rate: props.rate
        }
    }
    componentDidMount() {
        this.get_edit();
        setTimeout(function(){
            this.get_service();
        }.bind(this),2000)

    }
    get_service(){
        axios_loan.post(merchant_bmd_business_info,{rpTemplate:this.props.repayPlanTemplate}).then(e=>{
            if(!e.code){
                var serviceFeeCalType=e.data.serviceFeeCalType,type={NONE:"NEVER",GENERAL_SUB_INTEREST:"GENERAL_SUB_INTEREST",LOAN_AMOUNT_RATE:"FIX"};
                this.setState({
                    service_fee:type[serviceFeeCalType],
                    serviceFeeCalType:serviceFeeCalType
                })
            }
        })
    }
    get_edit() {
        axios_xjd_p.get(merchant_bmd_business_detail + "?code=" + this.props.productCode).then(e => {
            if (!e.code && e.data) {
                var productConfig = e.data.productConfig;
                for (var pro in productConfig) {
                    this.setState({
                        [pro]: productConfig[pro]
                    })
                }
                //用户群
                var arr = e.data.productUserGroupList;
                var map = {},
                    dest = [];
                for (var i = 0; i < arr.length; i++) {
                    var ai = arr[i];
                    ai.userLabel = ai["key"]//用户群名称
                    ai.periodCount = ai.period//期数
                    for(let j in ai){
                        if(j.indexOf("Rate")!==-1){
                            ai[j]=accMul(ai[j],100);
                        }
                    }
                    if (!map[ai.key]) {
                        dest.push({
                            id: ai.key,
                            data: [ai]
                        });
                        map[ai.key] = ai;
                    } else {
                        for (var j = 0; j < dest.length; j++) {
                            var dj = dest[j];
                            if (dj.id === ai.key) {
                                dj.data.push(ai);
                                break;
                            }
                        }
                    }
                }
                var userEdits = [];
                for (let p in dest) {
                    userEdits.push(Number(p))
                }
                this.setState({
                    userArr: dest,
                    userEdit: userEdits
                })
            }
        })
    }
    render() {
        const type = { FIX: "借款金额百分比/期", GENERAL_SUB_INTEREST: "综合费率-利息费率", NEVER: "不收取" };
        const titleInfo = {
            span: 6,
            className: "text_margin"
        }
        const columns = [
            {
                title: "期数",
                dataIndex: "period"
            },
            {
                title: "综合费率（" + this.props.rate + "利率）",
                dataIndex: "generalRate",
                render: e => {
                    if(e===null){
                        return '--'
                    }
                    return e + "%"
                    // if (this.state.rate) {
                    //     var val = e.split("-");
                    //     return val[0] + "%-" + val[1] + "%"
                    // } else {
                    //     return e + "%"
                    // }
                }
            },
            {
                title: "小贷利息费（" + this.props.rate + "利率）",
                dataIndex: "interestRate",
                render: e => {
                    if(e===null){
                        return '--'
                    }
                    return e + "%"
                }
            }
        ];
        if (this.state.service_fee === "FIX") {
            columns.push({ title: "小贷服务费收取金额", dataIndex: "feeRate", render: e => e + "%*借款金额/期" })
        }
        return (<div>
            <div className="sh_add_card_product">
                <div className="sh_add_title" style={{ marginLeft: "20px" }}>业务信息</div>
                <Row className="product_card">
                    <Row className="sh_inner_box" style={{ marginBottom: "10px" }}>
                        <Col {...titleInfo}>
                            <span className="product_card_title">是否允许自选借款金额</span>
                        </Col>
                        <Col span={16} pull={1}>
                            <span className="product_card_title">{this.state.allowInputLoanAmount ? "是" : "否"}</span>
                        </Col>
                    </Row>
                    <Row className="sh_inner_box" style={{ marginBottom: "10px" }}>
                        <Col {...titleInfo}>
                            <span className="product_card_title">小贷服务费</span>
                        </Col>
                        <Col span={16} pull={1}>
                            <span className="product_card_title">{type[this.state.service_fee]}</span>
                        </Col>
                    </Row>
                </Row>
            </div>
            <div className="sh_add_card_product">
                <div className="sh_add_title" style={{ marginLeft: "20px" }}>用户群配置</div>
                <Row className="product_card">
                    {this.state.userArr.map((i, k) => {
                        return <div style={{ marginBottom: "20px" }} key={k}>
                            <div style={{ marginBottom: "5px", fontSize: "14px" }}>用户群名称：{i.id}</div>
                            <Table dataSource={i.data} columns={columns} bordered pagination={false} rowKey="id" />
                        </div>
                    })}
                </Row>
            </div>
            <div className="sh_add_card_product">
                <div className="sh_add_title" style={{ marginLeft: "20px" }}>有效期配置</div>
                <Row className="product_card">
                    <Row className="sh_inner_box" style={{ marginBottom: "10px" }}>
                        <Col {...titleInfo}>
                            <span className="product_card_title">首借额度失效时间</span>
                        </Col>
                        <Col span={16} pull={1}>
                            <span className="product_card_title">{this.state.creditValidity?this.state.creditValidity+"天":""}</span>
                        </Col>
                    </Row>
                    <Row className="sh_inner_box" style={{ marginBottom: "10px" }}>
                        <Col {...titleInfo}>
                            <span className="product_card_title">复借额度失效时间</span>
                        </Col>
                        <Col span={16} pull={1}>
                            <span className="product_card_title">{this.state.reCreditValidity?this.state.reCreditValidity+"天":""}</span>
                        </Col>
                    </Row>
                    <Row className="sh_inner_box" style={{ marginBottom: "10px" }}>
                        <Col {...titleInfo}>
                            <span className="product_card_title">额度评估失败后重新提交时间</span>
                        </Col>
                        <Col span={16} pull={1}>
                            <span className="product_card_title">{this.state.resubmitValidity?this.state.resubmitValidity+"天":""}</span>
                        </Col>
                    </Row>
                    <Row className="sh_inner_box" style={{ marginBottom: "10px" }}>
                        <Col {...titleInfo}>
                            <span className="product_card_title">借款审核失败后重新提交时间</span>
                        </Col>
                        <Col span={16} pull={1}>
                            <span className="product_card_title">{this.state.loanResubmitValidity?this.state.loanResubmitValidity+"天":""}</span>
                        </Col>
                    </Row>
                    <Row className="sh_inner_box" style={{ marginBottom: "10px" }}>
                        <Col {...titleInfo}>
                            <span className="product_card_title">活体有效期</span>
                        </Col>
                        <Col span={16} pull={1}>
                            <span className="product_card_title">{this.state.identityValidity?this.state.identityValidity+"天":""}</span>
                        </Col>
                    </Row>
                </Row>
            </div>
        </div>)
    }
}
export default Bus