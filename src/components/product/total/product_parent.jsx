import React, { Component } from 'react';
import { Row, Form, Col, Button, message } from 'antd';
import { loan_manage_detail,loan_manage_canEdit} from '../../../ajax/api';
import { axios_loan } from '../../../ajax/request';
import { browserHistory } from 'react-router';
import ComponentRoute from '../../../templates/ComponentRoute';
import {accDiv,accMul} from '../../../ajax/tool';
// const { TextArea } = Input;
const FormItem = Form.Item;
// const RadioGroup = Radio.Group;
class Product_cxfq extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: "",
            name:"",
            desc:"",
            config:{},
            productId: props.productId,
            loanLimit:{},
            loanConfig:{}
        };
        this.loanTermType={"DAY":"日","MONTH":"月","YEAR":"年"};
        this.support={"true":"允许","false":"不允许"};
        this.type={"CURRENT":"当期收取后续期数减免","ALL":"当期收取后续期数不减免","CAL_DAY":"按日计收","OTHER":"特殊配置"};
        this.base={"BALANCE":"贷款余额百分比","PHASE_PRINCIPAL_RATE":"当期逾期未还本息百分比","PHASE_PRINCIPAL":"当期逾期未还本金百分比","PHASE_FIXED":"固定金额/期"};
        this.reportIndustry={"PERSONAL":"居民服务和其他服务业","CONSTRUCTION":"建筑业","TRANSPORTATION":"交通运输、仓储和邮政业","AGRICULTURE_FORESTRY_ANIMAL_FISHERY":"农、林、牧、渔业","MINING_INDUSTRY":"采矿业","MANUFACTURING_INDUSTRY":"制造业","ELECTRICITY_GAS_WATER":"电力、燃气及水的生产和供应业","SOFTWARE":"信息传输、计算机服务和软件业","WHOLESALE_RETAIL":"批发和零售业","ACCOMMODATION_CATERING":"住宿和餐饮业","REALTY":"房地产业","RANT_SERVICE":"租赁和商务服务业","OTHER":"其他"};
        this.reportLoanPurpose={"ACCRUED":"流动资金贷款","FIXED":"固定资产投资贷款","OTHER":"其他"};
        this.reportLoanType={"CREDIT":"信用","GUARANTEE":"保证","MORTGAGE":"抵押","PLEDGE":"质押","OTHER":"其他"};
        this.reportRepayType={"DEBX":"等额本息","DEBJ":"等额本金","XXHB":"先息后本","LHHK":"灵活还款"}
    }
    componentWillMount() {
        this.getDetail()
    }
    getDetail() {
        axios_loan.get(loan_manage_detail + "?code=" + this.state.productId).then(e => {
            if (!e.code) {
                var data = e.data;
                var loanConfig=data.loanConfig;
                var loanLimit=data.loanLimit;
                this.setState({
                    code: data.product.code,
                    name:data.product.name,
                    desc:data.product.desc,
                    // isRepay:config.supportRAConfirm,
                    // isEarly:config.supportRepayAheadAll,
                    // isEarly_money:config.penaltyFeeAheadSupport,
                    // isLate:config.overdueFeeSupport,
                    // isFalsity:config.penaltyOverdueFeeSupport,
                    loanConfig:loanConfig,
                    loanLimit:loanLimit,
                    isRepay:data.loanConfig.partRepayConfirm,
                    isEarly:data.loanConfig.canRepayAheadAll,
                    isEarly_money:data.loanConfig.hasPenaltyAheadFee,
                    isLate:data.loanConfig.hasOverdueFee,
                    isFalsity:data.loanConfig.hasPenaltyOverdueFee,
                });
            }
        })
    }
    //编辑
    edit(){
        axios_loan.post(loan_manage_canEdit,{code:this.state.productId}).then(e=>{
            if(!e.code){
                if(!e.data){
                    message.warn("该产品已使用，无法进行编辑操作");
                    return;
                }
                browserHistory.push("/cp/total/list/edit?code="+this.state.productId);
            }
        })
    }
    
    render() {
        const { getFieldDecorator } = this.props.form;
        let paths = ["产品管理1"];
        if (this.state.productId) {
            paths.push("产品编辑");
        } else {
            paths.push("产品添加");
        }
        const titleInfo = {
            span: 4,
            className: "text_margin"
        }
        const formInfoSmall = {
            labelCol: { span: 7 },
            wrapperCol: { span: 11 },
            colon: false,
            className: "tableForm text_left",
            labelAlign: "left"
        };
        let {code,name,desc,loanLimit,loanConfig}=this.state;
        const term={"DAY":"日","MONTH":"个月","YEAR":"年"}
        return (
            <div>
                <Form className="product_cxfq sh_add" >
                    <Row>

                        <div className="card_cx" style={{marginTop:"0px"}}>
                            <div className="title">
                                <div className="icon" />
                                <span className="titleWord">产品信息</span>
                            </div>
                            <div className="sh_add_card_product" style={{padding:"0",marginBottom:"50px"}}>
                                <Row className="product_card">
                                    <div className="sh_inner_box">
                                        <Col {...titleInfo}>
                                            <span className="product_card_title">基础信息</span>
                                        </Col>
                                        <Col span={20}>
                                            <FormItem label={<span style={{ width: "100%" }}>产品编号</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} colon={false}>
                                                {getFieldDecorator("prepaymentType", {
                                                    initialValue: "",
                                                })(
                                                    <div>{code}</div>
                                                )}
                                            </FormItem>
                                            <FormItem label={<span style={{ width: "100%" }}>产品名称</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 10 }} colon={false}>
                                                {getFieldDecorator("prepaymentType", {
                                                    initialValue: "",
                                                })(
                                                    <div>{name}</div>
                                                )}
                                            </FormItem>
                                            <FormItem label={<span style={{ width: "100%"}}>产品描述</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} colon={false}>
                                                {getFieldDecorator("prepaymentType", {
                                                    initialValue: "",
                                                })(
                                                    <div style={{whiteSpace:"pre-wrap"}}>{desc}</div>
                                                    
                                                )}
                                            </FormItem>
                                        </Col>
                                    </div>
                                </Row>
                                <Row className="product_card">
                                    <div className="sh_inner_box">
                                        <Col {...titleInfo}>
                                            <span className="product_card_title">借款信息</span>
                                        </Col>
                                        <Col span={20}>
                                            <Row>
                                                <Col
                                                    span={4}
                                                    style={{ textAlign: "right", fontSize: "14px", color: "rgba(0,0,0,0.5)", paddingRight: "13px", marginBottom: "15px", lineHeight: "32px" }}
                                                >
                                                    <span>借款金额范围</span>
                                                </Col>
                                                <Col span={8}>
                                                    <FormItem className="text_left" label="" {...formInfoSmall} >
                                                        {getFieldDecorator('minAmount', {
                                                            rules: [{ pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "格式错误" }, { required: true, message: "请输入最低金额" }]
                                                        })(
                                                            <div>{loanLimit.minLoanAmount?(accDiv(loanLimit.minLoanAmount,100)+"-"+accDiv(loanLimit.maxLoanAmount,100)+"元"):""}</div>
                                                        )}

                                                    </FormItem>
                                                </Col>
                                            </Row>
                                            <FormItem label={<span style={{ width: "100%" }}>借款期限单位</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} colon={false}>
                                                {getFieldDecorator("prepaymentType", {
                                                    initialValue: "",
                                                })(
                                                    <div>{this.loanTermType[loanLimit.loanPeriodUnit]}</div>
                                                )}
                                            </FormItem>
                                            <Row>
                                                <Col
                                                    span={4}
                                                    style={{ textAlign: "right", fontSize: "14px", color: "rgba(0,0,0,0.5)", paddingRight: "13px", marginBottom: "15px", lineHeight: "32px" }}
                                                >
                                                    <span>借款期限范围</span>
                                                </Col>
                                                <Col span={8}>
                                                    <FormItem className="text_left" label="" {...formInfoSmall} >
                                                        {getFieldDecorator('minAmount', {
                                                            rules: [{ pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "格式错误" }, { required: true, message: "请输入最短期限" }]
                                                        })(
                                                            <div>{loanLimit.minLoanPeriod?(loanLimit.minLoanPeriod+term[loanLimit.loanPeriodUnit]+"-"+loanLimit.maxLoanPeriod+term[loanLimit.loanPeriodUnit]):""}</div>
                                                        )}

                                                    </FormItem>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col
                                                    span={4}
                                                    style={{ textAlign: "right", fontSize: "14px", color: "rgba(0,0,0,0.5)", paddingRight: "13px", marginBottom: "15px", lineHeight: "32px" }}
                                                >
                                                    <span>实际年化综合费率范围</span>
                                                </Col>
                                                <Col span={8}>
                                                    <FormItem className="text_left" label="" {...formInfoSmall} >
                                                        {getFieldDecorator('minAmount', {
                                                            rules: [{ pattern: /^[0-9]+(\.[0-9]{1,5})?$|100/, message: "格式错误" }, { required: true, message: "请输入最低利率" }]
                                                        })(
                                                            <div>{loanLimit.minYearRate||loanLimit.maxYearRate?(accMul(loanLimit.minYearRate,100)+"%-"+accMul(loanLimit.maxYearRate,100)+"%"):""}</div>
                                                        )}
                                                    </FormItem>
                                                </Col>
                                                
                                            </Row>
                                            <FormItem label={<span style={{ width: "100%" }}>费率计算单位</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} colon={false}>
                                                {getFieldDecorator("prepaymentType", {
                                                    initialValue: "",
                                                })(
                                                    <div>{this.loanTermType[loanLimit.rateUnit]}</div>
                                                )}
                                            </FormItem>
                                            <FormItem label={<span style={{ width: "100%" }}>费率计算类型</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} colon={false}>
                                                {getFieldDecorator("prepaymentType", {
                                                    initialValue: "",
                                                })(
                                                    <div>{loanConfig.calRateType}</div>
                                                )}
                                            </FormItem>
                                            <FormItem label={<span style={{ width: "100%" }}>综合费率范围</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} colon={false}>
                                                {getFieldDecorator("prepaymentType", {
                                                    initialValue: "",
                                                })(
                                                    <div>{loanLimit.minGeneralRate||loanLimit.maxGeneralRate?(accMul(loanLimit.minGeneralRate,100)+"%-"+accMul(loanLimit.maxGeneralRate,100)+"%"):""}</div>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </div>
                                </Row>
                                <Row className="product_card">
                                    <div className="sh_inner_box">
                                        <Col {...titleInfo}>
                                            <span className="product_card_title">还款信息</span>
                                        </Col>
                                        <Col span={20}>
                                            <FormItem label={<span style={{ width: "100%" }}>是否允许部分还款</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} colon={false}>
                                                {getFieldDecorator("prepaymentType11", {
                                                    initialValue: "",
                                                })(
                                                    <div>{this.support[loanConfig.partRepayConfirm]}</div>
                                                )}
                                            </FormItem>
                                            <FormItem label={<div style={{ width: "100%",paddingRight:"13px",lineHeight:"20px",whiteSpace:"normal"}}>是否允许提前还款（非结清）</div>} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} colon={false} className="formWhite">
                                                {getFieldDecorator("prepaymentType11", {
                                                    initialValue: "",
                                                })(
                                                    <div>{this.support[loanConfig.canRepayAhead]}</div>
                                                )}
                                            </FormItem>
                                            {loanConfig.canRepayAhead?<FormItem label={<div style={{ width: "100%",paddingRight:"8px",lineHeight:"20px",whiteSpace:"normal"}}>提前还款时综合费用收取方式</div>} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} colon={false} className="formWhite">
                                                {getFieldDecorator("prepaymentType", {
                                                    initialValue: "",
                                                })(
                                                    <div>{this.type[loanConfig.raCollectType]}</div>
                                                )}
                                            </FormItem>:null}
                                        </Col>
                                    </div>
                                </Row>
                                <Row className="product_card">
                                    <div className="sh_inner_box">
                                        <Col {...titleInfo}>
                                            <span className="product_card_title">提前结清信息</span>
                                        </Col>
                                        <Col span={20}>
                                            <FormItem label={<span style={{ width: "100%" }}>是否允许提前结清</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} colon={false}>
                                                {getFieldDecorator("prepaymentType12", {
                                                    initialValue: "",
                                                })(
                                                    <div>{this.support[loanConfig.canRepayAheadAll]}</div>
                                                )}
                                            </FormItem>
                                            {this.state.isEarly?<div><FormItem label={<div style={{ width: "100%",paddingRight:"8px",lineHeight:"20px",whiteSpace:"normal"}}>提前结清时综合费用收取方式</div>} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} colon={false} className="formWhite">
                                                {getFieldDecorator("prepaymentType", {
                                                    initialValue: "",
                                                })(
                                                    <div>{this.type[loanConfig.raaCollectType]}</div>
                                                )}
                                            </FormItem>
                                            <FormItem label={<div style={{ width: "100%",paddingRight:"8px",lineHeight:"20px",whiteSpace:"normal" }}>是否收取提前结清手续费</div>} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} colon={false} className="formWhite">
                                                {getFieldDecorator("prepaymentType121", {
                                                    initialValue: "",
                                                })(
                                                    <div>{loanConfig.hasPenaltyAheadFee?"收取":"不收取"}</div>
                                                )}
                                            </FormItem>
                                            {this.state.isEarly_money?<Row>
                                                <Col
                                                    span={4}
                                                    style={{ textAlign: "right", fontSize: "14px", color: "rgba(0,0,0,0.5)", paddingRight: "13px", marginBottom: "15px", lineHeight: "32px" }}
                                                >
                                                    <span>手续费收取范围</span>
                                                </Col>
                                                <Col span={8}>
                                                    <FormItem className="text_left" label="" {...formInfoSmall} >
                                                        {getFieldDecorator('minAmount', {
                                                            rules: [{ pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "格式错误" }, { required: true, message: "请输入" }]
                                                        })(
                                                            <div>{loanConfig.penaltyAheadFeeMinAmount||loanConfig.penaltyAheadFeeMaxRate?(accDiv(loanConfig.penaltyAheadFeeMinAmount,100)+"元-"+accMul(loanConfig.penaltyAheadFeeMaxRate,100)+"%*贷款余额"):""}</div>
                                                        )}
                                                    </FormItem>
                                                </Col>
                                            </Row>:null}
                                            </div>:null}
                                            <FormItem label={<div style={{ width: "100%",paddingRight:"13px",lineHeight:"20px",whiteSpace:"normal"}}>仅最后一期提前还款是否算提前结清</div>} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} colon={false} className="formWhite">
                                                {getFieldDecorator("prepaymentType121", {
                                                    initialValue: "",
                                                })(
                                                    <div>{loanConfig.onlyRepayLastPhaseAsRaa?"算提前结清":"不算提前结清"}</div>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </div>
                                </Row>
                                <Row className="product_card">
                                    <div className="sh_inner_box">
                                        <Col {...titleInfo}>
                                            <span className="product_card_title">逾期罚息信息</span>
                                        </Col>
                                        <Col span={20}>
                                            <FormItem label={<span style={{ width: "100%" }}>是否收取罚息</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} colon={false}>
                                                {getFieldDecorator("prepaymentType13", {
                                                    initialValue: "",
                                                })(
                                                    <div>{loanConfig.hasOverdueFee?"收取":"不收取"}</div>
                                                )}
                                            </FormItem>
                                            {this.state.isLate?<div><FormItem label={<span style={{ width: "100%" }}>是否允许宽限日</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} colon={false}>
                                                {getFieldDecorator("prepaymentType", {
                                                    initialValue: "",
                                                })(
                                                    <div>{loanConfig.hasOverdueFeeGrace?"允许":"不允许"}</div>
                                                )}
                                            </FormItem>
                                            <FormItem label={<span style={{ width: "100%" }}>收取基数</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} colon={false}>
                                                {getFieldDecorator("prepaymentType", {
                                                    initialValue: "",
                                                })(
                                                    <div>{this.base[loanConfig.overdueFeeBase]}</div>
                                                )}
                                            </FormItem>
                                            <Row>
                                                <Col
                                                    span={4}
                                                    style={{ textAlign: "right", fontSize: "14px", color: "rgba(0,0,0,0.5)", paddingRight: "13px", marginBottom: "15px", lineHeight: "32px" }}
                                                >
                                                    <span>罚息收取范围</span>
                                                </Col>
                                                <Col span={8}>
                                                    <FormItem className="text_left" label="" {...formInfoSmall} >
                                                        {getFieldDecorator('minAmount', {
                                                        })(
                                                            <div>{loanConfig.overdueFeeMinAmount||loanConfig.overdueFeeMaxRate?(accDiv(loanConfig.overdueFeeMinAmount,100)+"元-"+accMul(loanConfig.overdueFeeMaxRate,100)+"%*借款金额"):""}</div>
                                                        )}
                                                    </FormItem>
                                                </Col>
                                                
                                            </Row></div>:null}
                                        </Col>
                                    </div>
                                </Row>
                                <Row className="product_card">
                                    <div className="sh_inner_box">
                                        <Col {...titleInfo}>
                                            <span className="product_card_title">违约金信息</span>
                                        </Col>
                                        <Col span={20}>
                                            <FormItem label={<span style={{ width: "100%" }}>是否收取违约金</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} colon={false}>
                                                {getFieldDecorator("prepaymentType15", {
                                                    initialValue: "",
                                                })(
                                                    <div>{loanConfig.hasPenaltyOverdueFee?"收取":"不收取"}</div>
                                                )}
                                            </FormItem>
                                            {this.state.isFalsity?<div><FormItem label={<span style={{ width: "100%" }}>是否允许宽限日</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} colon={false}>
                                                {getFieldDecorator("prepaymentType14", {
                                                    initialValue: "",
                                                })(
                                                    <div>{loanConfig.hasPenaltyOverdueFeeGrace?"允许":"不允许"}</div>
                                                )}
                                            </FormItem>
                                            <FormItem label={<span style={{ width: "100%" }}>收取基数</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} colon={false}>
                                                {getFieldDecorator("prepaymentType", {
                                                })(
                                                    <div>{this.base[loanConfig.penaltyOverdueFeeBase]}</div>
                                                )}
                                            </FormItem>
                                            <Row>
                                                <Col
                                                    span={4}
                                                    style={{ textAlign: "right", fontSize: "14px", color: "rgba(0,0,0,0.5)", paddingRight: "13px", marginBottom: "15px", lineHeight: "32px" }}
                                                >
                                                    <span>违约金收取范围</span>
                                                </Col>
                                                <Col span={8}>
                                                    <FormItem className="text_left" label="" {...formInfoSmall} >
                                                        {getFieldDecorator('minAmount', {
                                                            
                                                        })(
                                                            <div>{loanConfig.penaltyOverdueFeeMinAmount||loanConfig.penaltyOverdueFeeMaxRate?(accDiv(loanConfig.penaltyOverdueFeeMinAmount,100)+"元-"+accMul(loanConfig.penaltyOverdueFeeMaxRate,100)+"%*借款金额"):""}</div>
                                                        )}
                                                    </FormItem>
                                                </Col>
                                            </Row></div>:null}
                                        </Col>
                                    </div>
                                </Row>
                                <Row className="product_card">
                                    <div className="sh_inner_box">
                                        <Col {...titleInfo}>
                                            <span className="product_card_title">上报信息</span>
                                        </Col>
                                        <Col span={20}>
                                            <FormItem label={<span style={{ width: "100%" }}>投向行业</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 8 }} colon={false}>
                                                {getFieldDecorator("prepaymentType1", {
                                                })(
                                                    <div>{this.reportIndustry[loanConfig.reportIndustry]}</div>
                                                )}
                                            </FormItem>
                                            <FormItem label={<span style={{ width: "100%" }}>贷款用途</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 8 }} colon={false}>
                                                {getFieldDecorator("prepaymentType2", {
                                                })(
                                                    <div>{this.reportLoanPurpose[loanConfig.reportLoanPurpose]}</div>
                                                )}
                                            </FormItem>
                                            <FormItem label={<span style={{ width: "100%" }}>贷款方式</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 8 }} colon={false}>
                                                {getFieldDecorator("prepaymentType3", {
                                                })(
                                                    <div>{this.reportLoanType[loanConfig.reportLoanType]}</div>
                                                )}
                                            </FormItem>
                                            <FormItem label={<span style={{ width: "100%" }}>还款方式</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 8 }} colon={false}>
                                                {getFieldDecorator("prepaymentType4", {
                                                })(
                                                    <div>{this.reportRepayType[loanConfig.reportRepayType]}</div>
                                                )}
                                            </FormItem>
                                            <FormItem label={<span style={{ width: "100%" }}>受托支付</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 8 }} colon={false}>
                                                {getFieldDecorator("prepaymentType5", {
                                                })(
                                                    <div>{loanConfig.reportEntrusted?"是":"否"}</div>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </div>
                                </Row>
                            </div>
                        </div>

                    </Row>
                    <Row style={{height:"50px",background:"#fff",position:"fixed",bottom:"0",right:"0",lineHeight:"50px",textAlign:"center",width:"calc(100% - 210px)",boxShadow:"0px -2px 4px 0px rgba(0,0,0,0.1)"}}>
                        <Button type="primary" onClick={this.edit.bind(this)}>编辑</Button>
                    </Row>
                </Form>
                <style>
                    {`
                        .formWhite .ant-form-item-label label:after{
                            display:none
                        }
                        div{
                            font-size:14px
                        }
                    `}
                </style>
            </div>
        )
    }
}
export default ComponentRoute(Form.create()(Product_cxfq));