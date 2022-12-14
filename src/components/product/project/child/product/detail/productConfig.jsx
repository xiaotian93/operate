import React, { Component } from 'react';
import { Row, Col, Form, Icon, Tooltip } from 'antd';
import { merchant_zj_product_detail, merchant_zj_product_detail_bycode } from '../../../../../../ajax/api';
import { axios_loan } from '../../../../../../ajax/request';
import { accMul, accDiv } from '../../../../../../ajax/tool.js';
class Basic extends Component {
    constructor(props) {
        super(props);
        // props.onRef(this);
        this.state = {
            configNo: props.configNo,
            product_name: "",
            loanConfig:{},
            loanLimit:{},
            product:{}
        };
    }
    componentWillMount() {
        this.editData()
    }
    editData() {
        axios_loan.post(merchant_zj_product_detail + "?configNo=" + this.state.configNo).then(e => {
            if (!e.code) {
                var data = e.data;
                this.product_info(data.productCode);
                this.setState({
                    config:data
                })
                if(this.props.detail){
                    this.props.detail(data)
                }
            }
        })
    }
    product_info(val) {
        this.setState({
            product_del: true
        })
        axios_loan.post(merchant_zj_product_detail_bycode,{code:val}).then(e=>{
            var data=e.data;
            this.setState({
                product_name: data.product.name + "(" + data.product.code + ")",
                loanConfig: data.loanConfig,
                product_checked: val,
                periodUnit_type: data.loanLimit.loanPeriodUnit,
                product_del: false,
                product_desc: data.product.desc,
                loanLimit:data.loanLimit
            })
        })
    }
    render() {
        window.form = this.props.form;
        // var value=window.localStorage.getItem("detail")?JSON.parse(window.localStorage.getItem("detail")).basic.productIds:[];
        const titleInfo = {
            span: 4,
            className: "text_margin"
        }
        const type = { "DAY": "???", "MONTH": "???", "YEAR": "???" };
        const type_term = { "DAY": "???", "MONTH": "??????", "YEAR": "???" };
        const commissionRACollectType = { "CURRENT": "??????????????????????????????", "ALL": "?????????????????????????????????", "CAL_DAY": "????????????","OTHER":"????????????" };
        const base = { "PHASE_FIXED": "???/???", "BALANCE": "????????????/???", "PHASE_PRINCIPAL_RATE": "????????????/???", "PHASE_PRINCIPAL": "????????????/???" }
        const baseOver = { "PHASE_FIXED": "???/???", "BALANCE": "????????????", "PHASE_PRINCIPAL_RATE": "????????????", "PHASE_PRINCIPAL": "????????????" };
        const config=this.state.config;
        return (
            <div>
                <Form>
                    <Row className="sh_add_product">
                        <Row className="sh_inner_box" style={{ marginBottom: "10px" }}>
                            <Col {...titleInfo}>
                                <span className="product_card_title">????????????</span>
                            </Col>
                            <Col span={16} pull={1}>
                                <span className="product_card_title">{this.props.cooperator}</span>
                            </Col>
                        </Row>
                        <Row className="sh_inner_box" style={{ marginBottom: "10px" }}>
                            <Col {...titleInfo}>
                                <span className="product_card_title">????????????</span>
                            </Col>
                            <Col span={16} pull={1}>
                                <span className="product_card_title">{this.props.appName}</span>
                            </Col>
                        </Row>
                        <Row className="sh_inner_box">
                            <Col {...titleInfo} style={{ marginTop: "5px" }}>
                                <span className="product_card_title">????????????</span>
                            </Col>
                            <Col span={16} pull={1}>
                                <span className="product_card_title">{this.state.product_name}</span>
                            </Col>
                        </Row>
                    </Row>
                    {this.state.product_checked ? <div className="sh_add_card_product">
                        {/* <div className="sh_inner_box"> */}
                        <div className="sh_add_title" style={{ marginLeft: "20px" }}>????????????</div>
                        <Row className="product_card">
                            <div className="sh_inner_box">
                                <Col {...titleInfo}>
                                    <span className="product_card_title">????????????</span>
                                </Col>
                                <Col span={16}>
                                    <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                        <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>????????????</span></Col>
                                        <Col span={8} style={{ lineHeight: "22px", color: "#000" }}>{this.state.product_name}<Tooltip title={this.state.product_desc}><Icon type="info-circle" style={{ marginLeft: "5px", cursor: "pointer",color:"#1B84FF" }} /></Tooltip></Col>
                                    </Row>
                                    <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                        <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>???????????????</span></Col>
                                        <Col span={8} style={{ lineHeight: "22px", color: "#000" }}>{config.desc}</Col>
                                    </Row>
                                </Col>
                            </div>
                        </Row>
                        <Row className="product_card">
                            <div className="sh_inner_box">
                                <Col {...titleInfo}>
                                    <span className="product_card_title">????????????</span>
                                </Col>
                                <Col span={16}>
                                    <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                        <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>??????????????????</span></Col>
                                        <Col span={18} style={{ lineHeight: "22px", color: "#000" }}>{accDiv(config.minLoanAmount,100)+"?????????"+accDiv(config.maxLoanAmount,100)+"???"}<span style={{ fontSize:"12px"}}>{"?????????????????????" + accDiv(this.state.loanLimit.minLoanAmount, 100) + "??????" + accDiv(this.state.loanLimit.maxLoanAmount, 100) + "??????"}</span></Col>
                                    </Row>
                                    <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                        <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>??????????????????</span></Col>
                                        <Col span={18} style={{ lineHeight: "22px", color: "#000" }}>{type[this.state.periodUnit_type]}</Col>
                                    </Row>
                                    <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                        <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>??????????????????</span></Col>
                                        <Col span={18} style={{ lineHeight: "22px", color: "#000" }}>{config.minLoanPeriod+"??????"+config.maxLoanPeriod}<span style={{ fontSize:"12px"}}>{"?????????????????????" + this.state.loanLimit.minLoanPeriod + "??????" + this.state.loanLimit.maxLoanPeriod + type_term[this.state.periodUnit_type]+"???"}</span></Col>
                                    </Row>
                                    <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                        <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>????????????</span></Col>
                                        <Col span={18} style={{ lineHeight: "22px", color: "#000" }}>{config.supportPhases}</Col>
                                    </Row>
                                    <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                        <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>??????????????????????????????</span></Col>
                                        <Col span={18} style={{ lineHeight: "22px", color: "#000" }}>{accMul(config.minGeneralYearRate,100)+"%??????"+accMul(config.maxGeneralYearRate,100)+"%"}<span style={{ fontSize:"12px"}}>{"?????????????????????" + accMul(this.state.loanLimit.minYearRate, 100) + "%??????" + accMul(this.state.loanLimit.maxYearRate, 100) + "%???"}</span></Col>
                                    </Row>
                                    <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                        <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>??????????????????</span></Col>
                                        <Col span={18} style={{ lineHeight: "22px", color: "#000" }}>{type[this.state.loanLimit.rateUnit]}</Col>
                                    </Row>
                                    <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                        <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>??????????????????</span></Col>
                                        <Col span={8} style={{ lineHeight: "22px", color: "#000" }}>{this.state.loanConfig.calRateType}</Col>
                                    </Row>
                                    <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                        <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>??????????????????</span></Col>
                                        <Col span={18} style={{ lineHeight: "22px", color: "#000" }}>{accMul(config.minGeneralRate,100)+"%??????"+accMul(config.maxGeneralRate,100)+"%"}<span style={{ fontSize:"12px"}}>{"?????????????????????" + accMul(this.state.loanLimit.minGeneralRate, 100) + "%??????" + accMul(this.state.loanLimit.maxGeneralRate, 100) + "%???"}</span></Col>
                                    </Row>
                                    <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                        <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>??????????????????</span></Col>
                                        <Col span={18} style={{ lineHeight: "22px", color: "#000" }}>{config.loanAgreementSignTemplate}</Col>
                                    </Row>
                                </Col>
                            </div>
                        </Row>
                        <Row className="product_card">
                            <div className="sh_inner_box">
                                <Col {...titleInfo}>
                                    <span className="product_card_title">????????????</span>
                                </Col>
                                <Col span={16}>
                                    <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                        <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>????????????????????????</span></Col>
                                        <Col span={8} style={{ lineHeight: "22px", color: "#000" }}>{this.state.loanConfig.partRepayConfirm ? "??????" : "?????????"}</Col>
                                    </Row>
                                    <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                        <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>???????????????????????????????????????</span></Col>
                                        <Col span={8} style={{ lineHeight: "40px", color: "#000" }}>{this.state.loanConfig.canRepayAhead ? "??????" : "?????????"}</Col>
                                    </Row>
                                    {this.state.loanConfig.canRepayAhead?<Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                        <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>???????????????????????????????????????</span></Col>
                                        <Col span={8} style={{ lineHeight: "40px", color: "#000" }}>{commissionRACollectType[this.state.loanConfig.raCollectType]}</Col>
                                    </Row>:null}
                                </Col>
                            </div>
                        </Row>

                        <Row className="product_card">
                            <div className="sh_inner_box">
                                <Col {...titleInfo}>
                                    <span className="product_card_title">??????????????????</span>
                                </Col>
                                {this.state.loanConfig.canRepayAheadAll ? <Col span={16}>
                                    <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                        <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>???????????????????????????????????????</span></Col>
                                        <Col span={18} style={{ lineHeight: "40px", color: "#000" }}>{commissionRACollectType[this.state.loanConfig.raaCollectType]}</Col>
                                    </Row>
                                    {this.state.loanConfig.hasPenaltyAheadFee ? <div>
                                        <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                        <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>?????????????????????</span></Col>
                                        <Col span={18} style={{ lineHeight: "40px", color: "#000" }}>{config.penaltyAheadFeeRate!==undefined?(accMul(config.penaltyAheadFeeRate,100)+"%*????????????"):""}</Col>
                                    </Row>
                                    <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                        <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>????????????????????????????????????</span></Col>
                                        <Col span={18} style={{ lineHeight: "22px", color: "#000" }}>{config.penaltyAheadFeeMinAmount===null?"":(accDiv(config.penaltyAheadFeeMinAmount,100)+"?????????"+accMul(config.penaltyAheadFeeMaxRate,100)+"%*????????????")}
                                        {
                                            config.penaltyAheadFeeMinAmount===null?"":<span style={{ fontSize:"12px"}}>{"?????????????????????" + (this.state.loanConfig.penaltyAheadFeeMinAmount ? accDiv(this.state.loanConfig.penaltyAheadFeeMinAmount, 100) : 0) + "?????????" + accMul(this.state.loanConfig.penaltyAheadFeeMaxRate, 100) + "%*???????????????"}</span>
                                        }
                                        </Col>
                                    </Row>
                                    <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                        <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>????????????????????????????????????????????????</span></Col>
                                        <Col span={8} style={{ lineHeight: "40px", color: "#000" }}>{this.state.loanConfig.onlyRepayLastPhaseAsRaa?"???????????????":"??????????????????"}</Col>
                                    </Row>
                                    </div>: <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                            <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "40px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>?????????????????????</span></Col>
                                            <Col span={8} style={{ lineHeight: "40px", color: "#000" }}>?????????</Col>
                                        </Row>}

                                </Col> : <Col span={16}>
                                        <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                            <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>???????????????????????????????????????</span></Col>
                                            <Col span={8} style={{ lineHeight: "40px", color: "#000" }}>?????????????????????</Col>
                                        </Row>
                                    </Col>}
                            </div>
                        </Row>
                        <Row className="product_card">
                            <div className="sh_inner_box">
                                <Col {...titleInfo}>
                                    <span className="product_card_title">??????????????????</span>
                                </Col>
                                {this.state.loanConfig.hasOverdueFee ? <Col span={16}>
                                    {this.state.loanConfig.hasOverdueFeeGrace ? 
                                    <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                    <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>????????????</span></Col>
                                    <Col span={18} style={{ lineHeight: "22px", color: "#000" }}>{config.periodGrace}</Col>
                                </Row> : null}
                                <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                    <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>????????????</span></Col>
                                    <Col span={18} style={{ lineHeight: "22px", color: "#000" }}>{accMul(config.overdueInterestRate,100)+"%*"+base[this.state.loanConfig.overdueFeeBase]}</Col>
                                </Row>
                                    <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                        <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>?????????????????????</span></Col>
                                        <Col span={18} style={{ lineHeight: "22px", color: "#000" }}>{config.overdueInterestMinAmount===null?"":(accDiv(config.overdueInterestMinAmount,100)+"?????????"+accMul(config.overdueInterestMaxRate,100)+"%*????????????")}
                                        {
                                            config.overdueInterestMinAmount===null?"":<span style={{ fontSize:"12px"}}>{"?????????????????????" + (this.state.loanConfig.overdueFeeMinAmount ? accDiv(this.state.loanConfig.overdueFeeMinAmount, 100) : 0) + "?????????" + accMul(this.state.loanConfig.overdueFeeMaxRate, 100) + "%*???????????????"}</span>

                                        }</Col>
                                    </Row>
                                    
                                </Col> : <Col span={16}>
                                        <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                            <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>????????????</span></Col>
                                            <Col span={8} style={{ lineHeight: "22px", color: "#000" }}>?????????</Col>
                                        </Row>
                                    </Col>}
                            </div>
                        </Row>
                        <Row className="product_card">
                            <div className="sh_inner_box">
                                <Col {...titleInfo}>
                                    <span className="product_card_title">???????????????</span>
                                </Col>
                                {this.state.loanConfig.hasPenaltyOverdueFee ? <Col span={16}>
                                    {/* {this.state.loanConfig.hasPenaltyOverdueFeeGrace ? 
                                    <FormItem label={<span style={{ width: "100%" }}>????????????</span>} labelCol={{ span: 6 }} wrapperCol={{ span: 4 }} colon={false}>
                                        {getFieldDecorator("penaltyDaysOfGrace", {
                                            // initialValue: this.state.penaltyType_val,
                                            rules: [{ required: true, message: "?????????????????????" },{ pattern: /^[1-9]/, message: "????????????" }]
                                        })(
                                            <Input placeholder="?????????" />
                                        )}
                                        <div className="formIcon" >???</div>
                                    </FormItem> : null} */}
                                    {this.state.loanConfig.penaltyOverdueFeeBase === "PHASE_FIXED" ? 
                                    <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                    <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>????????????</span></Col>
                                    <Col span={18} style={{ lineHeight: "22px", color: "#000" }}>{accDiv(config.penaltyOverdueFeePrePhaseAmount,100)}</Col>
                                    </Row> : <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                    <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>????????????</span></Col>
                                    <Col span={18} style={{ lineHeight: "22px", color: "#000" }}>{accMul(config.penaltyOverdueFeeRate,100)+"%*"+baseOver[this.state.loanConfig.penaltyOverdueFeeBase]}</Col>
                                    </Row>}
                                    <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                        <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>????????????????????????</span></Col>
                                        <Col span={18} style={{ lineHeight: "22px", color: "#000" }}>{config.penaltyOverdueFeeMinAmount!==null?(accDiv(config.penaltyOverdueFeeMinAmount,100)+"?????????"+accMul(config.penaltyOverdueFeeMaxRate,100)+"%*????????????"):""}
                                        {
                                            config.penaltyOverdueFeeMinAmount!==null?<span style={{ fontSize:"12px"}}>{"?????????????????????" + accDiv(this.state.loanConfig.penaltyOverdueFeeMinAmount, 100) + "?????????" + accMul(this.state.loanConfig.penaltyOverdueFeeMaxRate, 100) + "%*???????????????"}</span>:""
                                        }
                                        </Col>
                                    </Row>
                                </Col> : <Col span={16}>
                                        <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                            <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>????????????</span></Col>
                                            <Col span={8} style={{ lineHeight: "22px", color: "#000" }}>?????????</Col>
                                        </Row>
                                    </Col>}

                            </div>
                        </Row>
                        
                    </div> : null}
                    
                </Form>
            </div>
        )

    }
}
export default Basic;