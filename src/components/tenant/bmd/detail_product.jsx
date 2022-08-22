import React, { Component } from 'react';
import { Row, Col, Form, Button, Table ,Tooltip,Icon} from 'antd';
import { xjd_product_detail_user, xjd_product_detail } from '../../../ajax/api';
// import Repay from './repayBank';
import { axios_xjd_p } from '../../../ajax/request';
import { browserHistory } from 'react-router';
import {accMul,accDiv} from '../../../ajax/tool.js';
const FormItem = Form.Item;
class Basic extends Component {
    constructor(props) {
        super(props);
        // props.onRef(this);
        this.state = {
            id: props.id,
            data: {
                childConfig:{},
                parentConfig:{}
            },
            userArr: []
        };
        this.product = []
    }
    componentWillMount() {
        
        this.columns = this.columns_type('');
        this.editData();
    }
    columns_type(type){
        // var typeJson={"DAY":"日","MONTH":"月","YEAR":"年"}
        console.log(type)
        return [
            {
                title: "用户群名称",
                dataIndex: "key",
                render: (e, row, index) => {
                    // return e+"期"
                    const obj = {
                        children: e,
                        props: {}
                    }
                    if (index === 0) {
                        obj.props.rowSpan = this.state.userArr.length > 0 ? this.state.userArr[0].data.length : 0
                    } else {
                        obj.props.rowSpan = 0
                    }
                    return obj
                }
            },
            {
                title: "期数",
                dataIndex: "period",
                render: (e) => {
                    return e + "期"
                }
            },
            {
                title: "利息",
                // title: "利息（"+typeJson[type]+"）",
                dataIndex: "interestRate",
                render: (e) => {
                    return accMul(e , 100) + "%";
                }
            },
            {
                title: "服务费收取时机",
                dataIndex: "serviceFeeCollectType",
                render: (e) => {
                    var type = { 0: "-", 1: "分期收取", 2: "首期收取" }
                    return type[e]
                }
            },
            {
                title: "服务费收取金额",
                render: (e) => {
                    return e.serviceFeeCollectType ? (e.serviceFeePercent ? accMul(e.serviceFeePercent, 100) + "%*借款金额/期" : accDiv(e.serviceFeePrice||0,100) + "元") : "-"
                }
            },
            {
                title: "会员费收取时机",
                dataIndex: "vipCollectType",
                render: (e) => {
                    var type = { 0: "-", 1: "贷前收取", 2: "贷后收取" }
                    return type[e]
                }
            },
            {
                title: "会员费收取金额",
                render: (e) => {
                    return e.vipCollectType ? (e.vipPercent ? accMul(e.vipPercent , 100) + "%*借款金额" : accDiv(e.vipPrice||0,100) + "元") : "-"
                }
            },
        ]
    }
    editData() {
        axios_xjd_p.get(xjd_product_detail + "?code=" + this.state.id).then(e => {
            if (!e.code) {
                this.setState({
                    data: e.data
                })
                this.columns=this.columns_type(e.data.parentConfig.loanTermType)
            }
        })
        axios_xjd_p.get(xjd_product_detail_user + "?code=" + this.state.id).then(e => {
            if (!e.code) {

                var arr = e.data;
                var map = {},
                    dest = [];
                for (var i = 0; i < arr.length; i++) {
                    var ai = arr[i];
                    if (!map[ai.key]) {
                        dest.push({
                            id: ai.key,
                            data: [ai]
                        });
                        map[ai.key] = ai;
                    } else {
                        // alert(1)
                        for (var j = 0; j < dest.length; j++) {
                            var dj = dest[j];
                            if (dj.id === ai.key) {
                                dj.data.push(ai);
                                break;
                            }
                        }
                    }
                }
                this.setState({
                    userArr: dest
                })
            }
        })
    }
    submit() {
        browserHistory.push("/sh/bmd/edit?id=" + this.state.id);
    }
    render() {
        window.form = this.props.form;
        const { getFieldDecorator } = this.props.form;
        const formInfo = {
            labelCol: { span: 5 },
            wrapperCol: { span: 6 },
            colon: false
        };
        const titleInfo = {
            span: 4,
            className: "text_margin"
        }
        const data = this.state.data;
        const child = this.state.data.childConfig;
        const parent = this.state.data.parentConfig;
        const type={"DAY":"日","MONTH":"月","YEAR":"年"};
        const type_trem={"DAY":"日","MONTH":"个月","YEAR":"年"};
        const commissionRACollectType = { "CURRENT": "当期收取后续期数减免", "ALL": "当期收取后续期数不减免", "CAL_DAY": "按日计收" };
        const base={"PHASE_FIXED":"元/期","BALANCE":"%*贷款余额/日","PHASE_PRINCIPAL_RATE":"%*未还本息/日","PHASE_PRINCIPAL":"%*未还本金/日"}
        const baseOver={"PHASE_FIXED":"元/期","BALANCE":"%*贷款余额","PHASE_PRINCIPAL_RATE":"%*未还本息","PHASE_PRINCIPAL":"%*未还本金"};
        return (
            <Form className="sh_add">
                <div className="sh_add_card_product">
                        {/* <div className="sh_inner_box"> */}
                        <div className="sh_add_title" style={{ marginLeft: "20px" }}>产品配置</div>
                        <Row className="product_card">
                            <div className="sh_inner_box">
                                <Col {...titleInfo}>
                                    <span className="product_card_title">基础信息</span>
                                </Col>
                                <Col span={16}>
                                    <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                        <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>产品名称</span></Col>
                                        <Col span={8} style={{ lineHeight: "22px", color: "#000" }}>{data.name+"("+data.code+")"}<Tooltip title={data.desc}><Icon type="info-circle" style={{marginLeft:"5px",cursor:"pointer",color:"#1B84FF"}} /></Tooltip></Col>
                                    </Row>
                                    <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                        <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>子产品编号</span></Col>
                                        <Col span={8} style={{ lineHeight: "22px", color: "#000" }}>{child.subCode}</Col>
                                    </Row>
                                    <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                        <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>子产品描述</span></Col>
                                        <Col span={8} style={{ lineHeight: "22px", color: "#000" }}>{child.desc}</Col>
                                    </Row>
                                </Col>
                            </div>
                        </Row>
                        <Row className="product_card">
                            <div className="sh_inner_box">
                                <Col {...titleInfo}>
                                    <span className="product_card_title">借贷信息</span>
                                </Col>
                                <Col span={16}>
                                    <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                        <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>借款金额范围</span></Col>
                                        <Col span={18} style={{ lineHeight: "22px", color: "#000" }}>{accDiv(child.minAmount,100)+"-"+accDiv(child.maxAmount,100)+"元（产品线范围：" + accDiv(parent.minLoanAmount, 100) + "——" + accDiv(parent.maxLoanAmount, 100) + "元）"}</Col>
                                    </Row>
                                    <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                        <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>是否允许自选借款金额</span></Col>
                                        <Col span={8} style={{ lineHeight: "22px", color: "#000" }}>{child.allowInputLoanAmount?"允许":"不允许"}</Col>
                                    </Row>
                                    <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                        <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>实际年化综合费率范围</span></Col>
                                        <Col span={18} style={{ lineHeight: "22px", color: "#000" }}>{accMul(child.minRealYearRate,100)+"%-"+accMul(child.maxRealYearRate,100)+"%（产品线范围：" + accMul(parent.minYearRate,100) + "——" + accMul(parent.maxYearRate,100) + "%）"}</Col>
                                    </Row>
                                    <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                        <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>借款期限单位</span></Col>
                                        <Col span={8} style={{ lineHeight: "22px", color: "#000" }}>{type[parent.loanTermType]}</Col>
                                    </Row>
                                    <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                        <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>每期间隔</span></Col>
                                        <Col span={8} style={{ lineHeight: "22px", color: "#000" }}>{child.periodGap+type_trem[parent.loanTermType]}</Col>
                                    </Row>
                                    <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                        <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>支持期数</span></Col>
                                        <Col span={18} style={{ lineHeight: "22px", color: "#000" }}>{child.totalPeriodList?JSON.parse(child.totalPeriodList).join(",")+"（产品期限范围："+parent.minLoanTerm+"——"+parent.maxLoanTerm+type_trem[parent.loanTermType]+"）":""}</Col>
                                    </Row>
                                </Col>
                            </div>
                        </Row>
                        <Row className="product_card">
                            <div className="sh_inner_box">
                                <Col {...titleInfo}>
                                    <span className="product_card_title">还款信息</span>
                                </Col>
                                <Col span={16}>
                                    <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                        <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>是否允许部分还款</span></Col>
                                        <Col span={8} style={{ lineHeight: "22px", color: "#000" }}>{parent.supportRAConfirm ? "允许" : "不允许"}</Col>
                                    </Row>
                                    <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                        <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>提前还款时综合费用收取方式</span></Col>
                                        <Col span={8} style={{ lineHeight: "22px", color: "#000" }}>{commissionRACollectType[parent.commissionRACollectType]}</Col>
                                    </Row>
                                </Col>
                            </div>
                        </Row>

                        <Row className="product_card">
                            <div className="sh_inner_box">
                                <Col {...titleInfo}>
                                    <span className="product_card_title">提前结清信息</span>
                                </Col>
                                {parent.supportRepayAheadAll?<Col span={16}>
                                    <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                        <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>提前结清时综合费用收取方式</span></Col>
                                        <Col span={8} style={{ lineHeight: "22px", color: "#000" }}>{commissionRACollectType[parent.commissionRAACollectType]}</Col>
                                    </Row>
                                    <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                        <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>手续费收取金额</span></Col>
                                        <Col span={18} style={{ lineHeight: "22px", color: "#000" }}>{parent.penaltyFeeAheadSupport?(accMul(child.advanceSettleFeePercent,100))+"%*贷款余额（产品线范围：" + (parent.penaltyFeeAheadMinAmount ? accDiv(parent.penaltyFeeAheadMinAmount, 100) : 0) + "元——" + accMul(parent.penaltyFeeAheadMaxRate,100) + "%*贷款余额）":"不收取"}</Col>
                                    </Row>
                                </Col>: <Col span={16}>
                                        <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                            <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>提前结清时综合费用收取方式</span></Col>
                                            <Col span={8} style={{ lineHeight: "40px", color: "#000" }}>不允许提前结清</Col>
                                        </Row>
                                    </Col>}
                            </div>
                        </Row>
                        <Row className="product_card">
                            <div className="sh_inner_box">
                                <Col {...titleInfo}>
                                    <span className="product_card_title">逾期罚息信息</span>
                                </Col>
                                {parent.overdueFeeSupport?<Col span={16}>
                                    <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                        <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>宽限天数</span></Col>
                                        <Col span={8} style={{ lineHeight: "22px", color: "#000" }}>{child.overdueDaysOfGrace+"天"}</Col>
                                    </Row>
                                    <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                        <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>收取金额</span></Col>
                                        <Col span={18} style={{ lineHeight: "22px", color: "#000" }}>{parent.overdueFeeBase?(accMul(child.dailyOverdueRate,100)+base[parent.overdueFeeBase]+"（产品线范围：" + (parent.overdueFeeMinAmount ? accDiv(parent.overdueFeeMinAmount, 100) : 0) + "元——" + accMul(parent.overdueFeeMaxRate,100) + "%*贷款金额）"):""}</Col>
                                    </Row>
                                </Col>: <Col span={16}>
                                        <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                            <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>收取金额</span></Col>
                                            <Col span={8} style={{ lineHeight: "22px", color: "#000" }}>不收取</Col>
                                        </Row>
                                    </Col>}
                            </div>
                        </Row>
                        <Row className="product_card">
                            <div className="sh_inner_box">
                                <Col {...titleInfo}>
                                    <span className="product_card_title">违约金信息</span>
                                </Col>
                                {parent.penaltyOverdueFeeSupport?<Col span={16}>
                                    <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                        <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>宽限天数</span></Col>
                                        <Col span={8} style={{ lineHeight: "22px", color: "#000" }}>{child.penaltyDaysOfGrace+"天"}</Col>
                                    </Row>
                                    <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                        <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>收取金额</span></Col>
                                        <Col span={18} style={{ lineHeight: "22px", color: "#000" }}>{(child.penaltyPercent?accMul(child.penaltyPercent,100):accDiv(child.penaltyAmount,100))+baseOver[parent.penaltyOverdueFeeBase]+"（产品线范围：" + (parent.penaltyOverdueFeeMinAmount ? accDiv(parent.penaltyOverdueFeeMinAmount, 100) : 0) + "元——" + accMul(parent.penaltyOverdueFeeMaxRate,100) + "%*贷款金额）"}</Col>
                                    </Row>
                                </Col>: <Col span={16}>
                                        <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                            <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>收取金额</span></Col>
                                            <Col span={8} style={{ lineHeight: "22px", color: "#000" }}>不收取</Col>
                                        </Row>
                                    </Col>}

                            </div>
                        </Row>
                    </div>
                <div className="sh_add_card">
                    <div className="sh_inner_box">
                        <span className="sh_add_title">用户群配置</span>
                        {
                            this.state.userArr.map((i, k) => {
                                return <div key={k} style={{ marginTop: "30px" }}>
                                    <Table columns={this.columns} dataSource={i.data} pagination={false} bordered rowKey="period" />
                                </div>
                            })
                        }
                    </div>
                </div>

                <div className="sh_add_card">
                    <div className="sh_inner_box">
                        <div className="sh_add_title">有效期配置</div>
                        <FormItem label="首借额度失效时间" {...formInfo} >
                            {getFieldDecorator('creditValidity', {
                            })(
                                <span style={{ fontSize: "14px" }}>{child.creditValidity + "天"}</span>
                            )}
                        </FormItem>
                        <FormItem label="复借额度失效时间" {...formInfo} >
                            {getFieldDecorator('reCreditValidity', {
                            })(
                                <span style={{ fontSize: "14px" }}>{child.reCreditValidity + "天"}</span>
                            )}
                        </FormItem>
                        <FormItem label="额度评估失败后重新提交时间" {...formInfo} >
                            {getFieldDecorator('resubmitValidity', {
                            })(
                                <span style={{ fontSize: "14px" }}>{child.resubmitValidity + "天"}</span>
                            )}
                        </FormItem>
                        <FormItem label="借款审核失败后重新提交时间" {...formInfo} >
                            {getFieldDecorator('loanResubmitValidity', {
                            })(
                                <span style={{ fontSize: "14px" }}>{child.loanResubmitValidity + "天"}</span>
                            )}
                        </FormItem>
                        <FormItem label="活体有效期" {...formInfo} >
                            {getFieldDecorator('identityValidity', {
                            })(
                                <span style={{ fontSize: "14px" }}>{child.identityValidity + "天"}</span>
                            )}
                        </FormItem>
                    </div>
                </div>

                <Row style={{ height: "50px", background: "#fff", position: "fixed", bottom: "0", right: "0", lineHeight: "50px", textAlign: "center", width: "calc(100% - 210px)", borderTop: "1px solid #CED0DA" }}>
                    <Button type="primary" onClick={this.submit.bind(this)} size="large" disabled={this.state.btn} >编辑</Button>
                </Row>
            </Form>
        )

    }
}
export default Form.create()(Basic);