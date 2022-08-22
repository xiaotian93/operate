import React, { Component } from 'react';
import { Row, Col, Form } from 'antd';
// import {merchant_tem} from '../../../ajax/api';
// import {host_cxfq} from '../../../ajax/config';
// import {axios_sh} from '../../../ajax/request';
const FormItem = Form.Item;
class Product extends Component {
    constructor(props) {
        super(props);
        props.onRef(this);
        this.state = {
            discount1: '',
            discount2: '',
            discount3: '',
            discount1Show: 1,
            discount2Show: 1,
            discount3Show: 1,
            product: props.product,
            id: props.id,
            productDetail: "",
            tem: [],
            repayData: {}
        };
    }
    componentWillMount() {
        if (this.state.id) {
            setTimeout(() => {
                this.detailData()
            }, 200)
        }
    }
    detailData() {
        var data = JSON.parse(window.localStorage.getItem("productList"));
        var repay_data = JSON.parse(window.localStorage.getItem("detail")).repaySettings;
        var tem = JSON.parse(window.localStorage.getItem("tem"));
        for (var i in data) {
            if (data[i].id === this.props.product.productId) {
                this.setState({
                    product: data[i]
                })
            }
        }
        for (var j in tem) {
            if (tem[j].id === this.props.product.protocolTemplateId) {
                this.setState({
                    protocolTemplate: tem[j].name
                })
            }
        }
        for (var r in repay_data) {
            if (repay_data[r].productId === this.props.product.productId) {
                this.setState({
                    repayData: repay_data[r]
                })
            }
        }
        // var productSettings=this.props.product;
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formInfo = {
            labelCol: { span: 8 },
            wrapperCol: { span: 8 },
            colon: false
        };
        const titleInfo = {
            span: 4,
            className: "text_margin"
        }
        const formInfoText = {
            labelCol: { span: 4 },
            wrapperCol: { span: 8 },
            colon: false
        };
        const formInfoSmall = {
            labelCol: { span: 8 },
            wrapperCol: { span: 9 },
            colon: false,
            className: "tableForm",
            labelAlign: "left"
        };
        var pay = { 1: "放款前一次性支付", 2: "首期还款日支付", 3: "按期支付" };
        var bzj = { 1: "渠道支付", 2: "商户支付", 3: "客户支付" }
        return (
            <div>
                <div className="sh_add_card_product">
                    <Row style={{ marginBottom: "20px", padding: "0 20px" }}>
                        <span style={{ fontSize: '14px', color: "rgba(0,0,0,0.5)", marginRight: "5px" }}>产品名称</span>
                        <span style={{ fontSize: '14px', color: "#000" }}>{this.state.product ? this.state.product.name : ""}</span>
                        <span style={{ fontSize: '14px', color: "rgba(0,0,0,0.5)", margin: "0 10px" }}>|</span>
                        <span style={{ fontSize: '14px', color: "rgba(0,0,0,0.5)", marginRight: "5px" }}>产品编号</span>
                        <span style={{ fontSize: '14px', color: "#000" }}>{this.state.product ? this.state.product.code : ""}</span>
                    </Row>
                    <Row className="product_card">
                    <div className="sh_inner_box">
                        <Col {...titleInfo}>
                            <span className="product_card_title">借款金额</span>
                        </Col>
                        <Col span={16}>
                            <FormItem label="借款金额" {...formInfoText} >
                                {getFieldDecorator('loanPer', {
                                })(
                                    <div style={{ fontSize: "14px" }}>{this.props.product.loanPer}%*商业险金额</div>
                                )}

                            </FormItem>
                            <FormItem label="还款配置" {...formInfoText} >
                                {getFieldDecorator('principalType', {
                                })(
                                    <div style={{ fontSize: "14px" }}>{this.state.repayData.principalType ? "商家代偿" : "客户还款"}</div>
                                )}

                            </FormItem>
                        </Col>
                    </div>
                    </Row>
                    {(this.state.product ? (
                        this.state.product.discount1Type
                    ) : (
                            ""
                        )) ? (
                            <Row className="product_card">
                                <div className="sh_inner_box">
                                <Col {...titleInfo}>
                                    <span className="product_card_title">保证金1</span>
                                </Col>
                                <Col span={16}>
                                    <FormItem label="支付金额" {...formInfoText} >
                                        {getFieldDecorator('discount1Per', {
                                        })(
                                            <div style={{ fontSize: "14px" }}> {this.props.product.discount1Per}%*商业险金额</div>
                                        )}

                                    </FormItem>
                                    <FormItem label="支付方" wrapperCol={{ span: 16 }} labelCol={{ span: 4 }} colon={false} >
                                        {getFieldDecorator('discount1Payer', {

                                        })(
                                            <div style={{ fontSize: "14px" }}>{bzj[this.props.product.discount1Payer]}</div>
                                        )}
                                    </FormItem>
                                </Col>
                                </div>
                            </Row>
                        ) : null}
                    {(this.state.product ? (
                        this.state.product.discount2Type
                    ) : (
                            ""
                        )) ? (
                            <Row className="product_card">
                                <div className="sh_inner_box">
                                <Col {...titleInfo}>
                                    <span className="product_card_title">保证金2</span>
                                </Col>
                                <Col span={16}>
                                    <FormItem label="支付金额" {...formInfoText} >
                                        {getFieldDecorator('discount2Per', {
                                        })(
                                            <div style={{ fontSize: "14px" }}>{this.props.product.discount2Per}%*商业险金额</div>
                                        )}

                                    </FormItem>
                                    <FormItem label="支付方" wrapperCol={{ span: 16 }} labelCol={{ span: 4 }} colon={false} >
                                        {getFieldDecorator('discount2Payer', {

                                        })(
                                            <div style={{ fontSize: "14px" }}>{bzj[this.props.product.discount2Payer]}</div>
                                        )}
                                    </FormItem>

                                </Col>
                                </div>
                            </Row>
                        ) : null}
                    {(this.state.product ? (
                        this.state.product.discount3Type
                    ) : (
                            ""
                        )) ? (
                            <Row className="product_card">
                                <div className="sh_inner_box">
                                <Col {...titleInfo}>
                                    <span className="product_card_title">保证金3</span>
                                </Col>
                                <Col span={16}>
                                    <FormItem label="支付金额" {...formInfoText} >
                                        {getFieldDecorator('discount3Per', {
                                        })(
                                            <div style={{ fontSize: "14px" }}>{this.props.product.discount3Per}%*商业险金额</div>
                                        )}

                                    </FormItem>
                                    <FormItem label="支付方" wrapperCol={{ span: 16 }} labelCol={{ span: 4 }} colon={false} >
                                        {getFieldDecorator('discount3Payer', {

                                        })(
                                            <div style={{ fontSize: "14px" }}>{bzj[this.props.product.discount3Payer]}</div>
                                        )}
                                    </FormItem>
                                </Col>
                                </div>
                            </Row>
                        ) : null}
                    <Row className="product_card">
                    <div className="sh_inner_box">
                        <Col {...titleInfo}>
                            <span className="product_card_title">利息</span>
                        </Col>
                        <Col span={16}>
                            <Row>
                                <Col span={4} style={{ textAlign: "right", fontSize: "14px", color: "rgba(0,0,0,0.5)", paddingRight: "10px", marginBottom: "15px" }}>
                                    <label>支付方式</label>
                                </Col>
                                <Col span={8} style={{ fontSize: "14px", color: "#000" }}>
                                    {this.state.product ? pay[this.state.product.interestType] : ""}
                                </Col>
                            </Row>
                            <FormItem label="支付金额" {...formInfoText} >
                                {getFieldDecorator('interestPer', {
                                })(
                                    <div style={{ fontSize: "14px" }}>{this.props.product.interestPer}%*商业险金额</div>
                                )}

                            </FormItem>
                            <Row>
                                <Col
                                    span={4}
                                    style={{ textAlign: "right", fontSize: "14px", color: "rgba(0,0,0,0.5)", paddingRight: "10px", marginBottom: "15px", lineHeight: "32px" }}
                                >
                                    <label>还款配置</label>
                                </Col>
                                <Col span={10}>
                                    <FormItem className="text_left" {...formInfoSmall} >
                                        {getFieldDecorator('interestUserPer', {
                                        })(
                                            <div style={{ fontSize: "14px" }}>{this.state.repayData.interestUserPer ? "客户还款" + this.state.repayData.interestUserPer + "%" : ""}</div>
                                        )}
                                    </FormItem>

                                </Col>
                                <Col span={10} pull={2}>
                                    <FormItem className="text_left" {...formInfoSmall} >
                                        {getFieldDecorator('interestPayerPer', {
                                        })(
                                            <div style={{ fontSize: "14px" }}>{this.state.repayData.interestPayerPer ? "商家代偿" + this.state.repayData.interestPayerPer + "%" : ""}</div>
                                        )}
                                    </FormItem>

                                </Col>
                            </Row>
                        </Col>
                    </div>
                    </Row>
                    <Row className="product_card">
                    <div className="sh_inner_box">
                        <Col {...titleInfo}>
                            <span className="product_card_title">服务费</span>
                        </Col>
                        <Col span={16}>
                            <Row>
                                <Col span={4} style={{ textAlign: 'right', fontSize: '14px', color: "rgba(0,0,0,0.5)", paddingRight: "10px", marginBottom: "15px" }}>支付方式</Col>
                                <Col span={8} style={{ fontSize: '14px', color: "#000" }}>{this.state.product ? pay[this.state.product.serviceFeeType] : ""}</Col>
                            </Row>
                            <FormItem label="支付金额" {...formInfoText}>
                                {getFieldDecorator('serviceFeePer', {
                                })(
                                    <div style={{ fontSize: "14px" }}>{this.props.product.serviceFeePer}%*商业险金额</div>
                                )}
                            </FormItem>
                            <FormItem label="收费方" {...formInfoText} >
                                {getFieldDecorator('serviceFeeReceiver', {
                                })(
                                    <div style={{ fontSize: "14px" }}>{this.props.product.serviceFeeReceiver}</div>
                                )}
                            </FormItem>

                            <Row>
                                <Col
                                    span={4}
                                    style={{ textAlign: "right", fontSize: "14px", color: "rgba(0,0,0,0.5)", paddingRight: "10px", marginBottom: "15px", lineHeight: "32px" }}
                                >
                                    <label>还款配置</label>
                                </Col>
                                <Col span={10}>
                                    <FormItem className="text_left" {...formInfoSmall}>
                                        {getFieldDecorator('serviceFeeUserPer', {
                                        })(
                                            <div style={{ fontSize: "14px" }}>{this.state.repayData.serviceFeeUserPer ? "客户还款" + this.state.repayData.serviceFeeUserPer + "%" : ""}</div>
                                        )}
                                    </FormItem>

                                </Col>
                                <Col span={10} pull={2} >
                                    <FormItem className="text_left" {...formInfoSmall}>
                                        {getFieldDecorator('serviceFeePayerPer', {
                                        })(
                                            <div style={{ fontSize: "14px" }}>{this.state.repayData.serviceFeePayerPer ? "商家代偿" + this.state.repayData.serviceFeePayerPer + "%" : ""}</div>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>

                        </Col>
                    </div>
                    </Row>

                    <Row className="product_card">
                    <div className="sh_inner_box">
                        <Col {...titleInfo}>
                            <span className="product_card_title">其他费用</span>
                        </Col>
                        <Col span={16}>
                            <Row>
                                <Col span={4} style={{ textAlign: 'right', fontSize: '14px', color: "rgba(0,0,0,0.5)", paddingRight: "10px", marginBottom: "15px" }}>支付方式</Col>
                                <Col span={8} style={{ fontSize: '14px', color: "#000" }}>{this.state.product ? pay[this.state.product.otherFeeType] : ""}</Col>
                            </Row>
                            <FormItem label="支付金额" {...formInfoText}>
                                {getFieldDecorator('otherFeePer', {
                                })(
                                    <div style={{ fontSize: "14px" }}>{this.props.product.otherFeePer}%*商业险金额</div>
                                )}
                            </FormItem>

                            <Row>
                                <Col
                                    span={4}
                                    style={{ textAlign: "right", fontSize: "14px", color: "rgba(0,0,0,0.5)", paddingRight: "10px", marginBottom: "15px", lineHeight: "32px" }}
                                >
                                    <label>还款配置</label>
                                </Col>
                                <Col span={10}>
                                    <FormItem className="text_left" {...formInfoSmall}>
                                        {getFieldDecorator('otherFeeUserPer', {
                                        })(
                                            <div style={{ fontSize: "14px" }}>{this.state.repayData.otherFeeUserPer ? "客户还款" + this.state.repayData.otherFeeUserPer + "%" : ""}</div>
                                        )}
                                    </FormItem>

                                </Col>
                                <Col span={10} pull={2} >
                                    <FormItem className="text_left" {...formInfoSmall}>
                                        {getFieldDecorator('otherFeePayerPer', {
                                        })(
                                            <div style={{ fontSize: "14px" }}>{this.state.repayData.otherFeePayerPer ? "商家代偿" + this.state.repayData.otherFeePayerPer + "%" : ""}</div>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>

                        </Col>
                    </div>
                    </Row>
                    <Row className="product_card">
                    <div className="sh_inner_box">
                        <Col {...titleInfo}>
                            <span className="product_card_title">逾期罚息</span>
                        </Col>
                        <Col span={16}>
                            <FormItem label="罚息金额" {...formInfoText} >
                                {getFieldDecorator('lateFeePer', {

                                })(
                                    <div style={{ fontSize: "14px" }}>{this.props.product.lateFeePer}%*应还金额</div>
                                )}
                            </FormItem>

                            <Row>
                                <Col
                                    span={4}
                                    style={{ textAlign: "right", fontSize: "14px", color: "rgba(0,0,0,0.5)", paddingRight: "10px", marginBottom: "15px", lineHeight: "32px" }}
                                >
                                    <label>还款配置</label>
                                </Col>
                                <Col span={10}>
                                    <FormItem className="" {...formInfoSmall} >
                                        {getFieldDecorator('lateFeeUserPer', {
                                        })(
                                            <div style={{ fontSize: "14px" }}>{this.state.repayData.lateFeeUserPer ? "客户还款" + this.state.repayData.lateFeeUserPer + "%" : ""}</div>
                                        )}
                                    </FormItem>

                                </Col>
                                <Col span={10} pull={2} >
                                    <FormItem {...formInfoSmall}>
                                        {getFieldDecorator('lateFeePayerPer', {
                                        })(
                                            <div style={{ fontSize: "14px" }}>{this.state.repayData.lateFeePayerPer ? "商家代偿" + this.state.repayData.lateFeePayerPer + "%" : ""}</div>
                                        )}
                                    </FormItem>

                                </Col>
                            </Row>

                        </Col>
                    </div>
                    </Row>
                    <Row className="product_card" >
                    <div className="sh_inner_box">
                        <Col {...titleInfo}>
                            <span className="product_card_title">提前还款违约金</span>
                        </Col>
                        <Col span={16}>
                            <FormItem label="违约金额" {...formInfoText} >
                                {getFieldDecorator('penaltyFeePer', {
                                })(
                                    <div style={{ fontSize: "14px" }}>{this.props.product.penaltyFeePer}%*应还金额</div>
                                )}
                            </FormItem>

                            <Row>
                                <Col
                                    span={4}
                                    style={{ textAlign: "right", fontSize: "14px", color: "rgba(0,0,0,0.5)", paddingRight: "10px", marginBottom: "15px", lineHeight: "32px" }}
                                >
                                    <label>还款配置</label>
                                </Col>
                                <Col span={10}>
                                    <FormItem className="" {...formInfoSmall}>
                                        {getFieldDecorator('penaltyFeeUserPer', {
                                        })(
                                            <div style={{ fontSize: "14px" }}>{this.state.repayData.penaltyFeeUserPer ? "客户还款" + this.state.repayData.penaltyFeeUserPer + "%" : ""}</div>
                                        )}
                                    </FormItem>

                                </Col>
                                <Col span={10} pull={2} >
                                    <FormItem className="" {...formInfoSmall}>
                                        {getFieldDecorator('penaltyFeePayerPer', {
                                        })(
                                            <div style={{ fontSize: "14px" }}>{this.state.repayData.penaltyFeePayerPer ? "商家代偿" + this.state.repayData.penaltyFeePayerPer + "%" : ""}</div>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>

                        </Col>
                    </div>
                    </Row>
                    <div className="product_card" style={{borderBottom:"none"}}>
                <div className="sh_inner_box">
                    <Col span={20}>
                    <FormItem label="是否代收代付交强险、车船税" {...formInfo} >
                        {getFieldDecorator('haveJqxccs', {
                        })(
                            <div style={{ fontSize: "14px" }}>{this.props.product.haveJqxccs ? "是" : "否"}</div>
                        )}
                    </FormItem>
                    <FormItem label="期数" {...formInfo} >
                        {getFieldDecorator('period', {
                        })(
                            <div style={{ fontSize: "14px" }}>{this.props.product.period}期</div>
                        )}
                    </FormItem>
                    <FormItem label="业务类型" {...formInfo} >
                        {getFieldDecorator('loanBasis', {
                        })(
                            <div style={{fontSize:"14px"}}>{this.props.product.loanBasis?"投保单":"保单"}</div>
                        )}
                    </FormItem>
                    <FormItem label="投保单/保单数量" {...formInfo} >
                        {getFieldDecorator('insuranceSize', {
                        })(
                            <div style={{fontSize:"14px"}}>{this.props.product.insuranceSize}</div>

                        )}
                    </FormItem>
                    <FormItem label="是否需商户审核" {...formInfo}>
                        {getFieldDecorator('enableAudit', {
                        })(
                            <div style={{fontSize:"14px"}}>{this.props.product.enableAudit?"需商户审核":"不需商户审核"}</div>

                        )}
                    </FormItem>
                    <FormItem label="签约是否前置" {...formInfo} >
                        {getFieldDecorator('preSign', {
                        })(
                            <div style={{fontSize:"14px"}}>{this.props.product.preSign?"是":"否"}</div>

                        )}
                    </FormItem>
                    <FormItem label="合同模版" {...formInfo} >
                        {getFieldDecorator('protocolTemplateId', {
                        })(
                            <div style={{fontSize:"14px"}}>{this.state.protocolTemplate}</div>

                        )}
                    </FormItem>
                    </Col>
                </div>
                </div>
                    <FormItem
                        label=""
                        style={{ marginBottom: "0!important" }}
                        className="bottom"
                    >
                        {getFieldDecorator("productId", {
                            initialValue: this.state.product ? this.state.product.id : ""
                        })(<div />)}
                    </FormItem>

                </div>
                
                <style>{`
        .ant-form-item-label{
          text-overflow:clip!important
        }
      `}</style>
            </div>
        )

    }
}
export default Form.create()(Product);