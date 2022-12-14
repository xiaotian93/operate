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
        var pay = { 1: "????????????????????????", 2: "?????????????????????", 3: "????????????" };
        var bzj = { 1: "????????????", 2: "????????????", 3: "????????????" }
        return (
            <div>
                <div className="sh_add_card_product">
                    <Row style={{ marginBottom: "20px", padding: "0 20px" }}>
                        <span style={{ fontSize: '14px', color: "rgba(0,0,0,0.5)", marginRight: "5px" }}>????????????</span>
                        <span style={{ fontSize: '14px', color: "#000" }}>{this.state.product ? this.state.product.name : ""}</span>
                        <span style={{ fontSize: '14px', color: "rgba(0,0,0,0.5)", margin: "0 10px" }}>|</span>
                        <span style={{ fontSize: '14px', color: "rgba(0,0,0,0.5)", marginRight: "5px" }}>????????????</span>
                        <span style={{ fontSize: '14px', color: "#000" }}>{this.state.product ? this.state.product.code : ""}</span>
                    </Row>
                    <Row className="product_card">
                    <div className="sh_inner_box">
                        <Col {...titleInfo}>
                            <span className="product_card_title">????????????</span>
                        </Col>
                        <Col span={16}>
                            <FormItem label="????????????" {...formInfoText} >
                                {getFieldDecorator('loanPer', {
                                })(
                                    <div style={{ fontSize: "14px" }}>{this.props.product.loanPer}%*???????????????</div>
                                )}

                            </FormItem>
                            <FormItem label="????????????" {...formInfoText} >
                                {getFieldDecorator('principalType', {
                                })(
                                    <div style={{ fontSize: "14px" }}>{this.state.repayData.principalType ? "????????????" : "????????????"}</div>
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
                                    <span className="product_card_title">?????????1</span>
                                </Col>
                                <Col span={16}>
                                    <FormItem label="????????????" {...formInfoText} >
                                        {getFieldDecorator('discount1Per', {
                                        })(
                                            <div style={{ fontSize: "14px" }}> {this.props.product.discount1Per}%*???????????????</div>
                                        )}

                                    </FormItem>
                                    <FormItem label="?????????" wrapperCol={{ span: 16 }} labelCol={{ span: 4 }} colon={false} >
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
                                    <span className="product_card_title">?????????2</span>
                                </Col>
                                <Col span={16}>
                                    <FormItem label="????????????" {...formInfoText} >
                                        {getFieldDecorator('discount2Per', {
                                        })(
                                            <div style={{ fontSize: "14px" }}>{this.props.product.discount2Per}%*???????????????</div>
                                        )}

                                    </FormItem>
                                    <FormItem label="?????????" wrapperCol={{ span: 16 }} labelCol={{ span: 4 }} colon={false} >
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
                                    <span className="product_card_title">?????????3</span>
                                </Col>
                                <Col span={16}>
                                    <FormItem label="????????????" {...formInfoText} >
                                        {getFieldDecorator('discount3Per', {
                                        })(
                                            <div style={{ fontSize: "14px" }}>{this.props.product.discount3Per}%*???????????????</div>
                                        )}

                                    </FormItem>
                                    <FormItem label="?????????" wrapperCol={{ span: 16 }} labelCol={{ span: 4 }} colon={false} >
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
                            <span className="product_card_title">??????</span>
                        </Col>
                        <Col span={16}>
                            <Row>
                                <Col span={4} style={{ textAlign: "right", fontSize: "14px", color: "rgba(0,0,0,0.5)", paddingRight: "10px", marginBottom: "15px" }}>
                                    <label>????????????</label>
                                </Col>
                                <Col span={8} style={{ fontSize: "14px", color: "#000" }}>
                                    {this.state.product ? pay[this.state.product.interestType] : ""}
                                </Col>
                            </Row>
                            <FormItem label="????????????" {...formInfoText} >
                                {getFieldDecorator('interestPer', {
                                })(
                                    <div style={{ fontSize: "14px" }}>{this.props.product.interestPer}%*???????????????</div>
                                )}

                            </FormItem>
                            <Row>
                                <Col
                                    span={4}
                                    style={{ textAlign: "right", fontSize: "14px", color: "rgba(0,0,0,0.5)", paddingRight: "10px", marginBottom: "15px", lineHeight: "32px" }}
                                >
                                    <label>????????????</label>
                                </Col>
                                <Col span={10}>
                                    <FormItem className="text_left" {...formInfoSmall} >
                                        {getFieldDecorator('interestUserPer', {
                                        })(
                                            <div style={{ fontSize: "14px" }}>{this.state.repayData.interestUserPer ? "????????????" + this.state.repayData.interestUserPer + "%" : ""}</div>
                                        )}
                                    </FormItem>

                                </Col>
                                <Col span={10} pull={2}>
                                    <FormItem className="text_left" {...formInfoSmall} >
                                        {getFieldDecorator('interestPayerPer', {
                                        })(
                                            <div style={{ fontSize: "14px" }}>{this.state.repayData.interestPayerPer ? "????????????" + this.state.repayData.interestPayerPer + "%" : ""}</div>
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
                            <span className="product_card_title">?????????</span>
                        </Col>
                        <Col span={16}>
                            <Row>
                                <Col span={4} style={{ textAlign: 'right', fontSize: '14px', color: "rgba(0,0,0,0.5)", paddingRight: "10px", marginBottom: "15px" }}>????????????</Col>
                                <Col span={8} style={{ fontSize: '14px', color: "#000" }}>{this.state.product ? pay[this.state.product.serviceFeeType] : ""}</Col>
                            </Row>
                            <FormItem label="????????????" {...formInfoText}>
                                {getFieldDecorator('serviceFeePer', {
                                })(
                                    <div style={{ fontSize: "14px" }}>{this.props.product.serviceFeePer}%*???????????????</div>
                                )}
                            </FormItem>
                            <FormItem label="?????????" {...formInfoText} >
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
                                    <label>????????????</label>
                                </Col>
                                <Col span={10}>
                                    <FormItem className="text_left" {...formInfoSmall}>
                                        {getFieldDecorator('serviceFeeUserPer', {
                                        })(
                                            <div style={{ fontSize: "14px" }}>{this.state.repayData.serviceFeeUserPer ? "????????????" + this.state.repayData.serviceFeeUserPer + "%" : ""}</div>
                                        )}
                                    </FormItem>

                                </Col>
                                <Col span={10} pull={2} >
                                    <FormItem className="text_left" {...formInfoSmall}>
                                        {getFieldDecorator('serviceFeePayerPer', {
                                        })(
                                            <div style={{ fontSize: "14px" }}>{this.state.repayData.serviceFeePayerPer ? "????????????" + this.state.repayData.serviceFeePayerPer + "%" : ""}</div>
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
                            <span className="product_card_title">????????????</span>
                        </Col>
                        <Col span={16}>
                            <Row>
                                <Col span={4} style={{ textAlign: 'right', fontSize: '14px', color: "rgba(0,0,0,0.5)", paddingRight: "10px", marginBottom: "15px" }}>????????????</Col>
                                <Col span={8} style={{ fontSize: '14px', color: "#000" }}>{this.state.product ? pay[this.state.product.otherFeeType] : ""}</Col>
                            </Row>
                            <FormItem label="????????????" {...formInfoText}>
                                {getFieldDecorator('otherFeePer', {
                                })(
                                    <div style={{ fontSize: "14px" }}>{this.props.product.otherFeePer}%*???????????????</div>
                                )}
                            </FormItem>

                            <Row>
                                <Col
                                    span={4}
                                    style={{ textAlign: "right", fontSize: "14px", color: "rgba(0,0,0,0.5)", paddingRight: "10px", marginBottom: "15px", lineHeight: "32px" }}
                                >
                                    <label>????????????</label>
                                </Col>
                                <Col span={10}>
                                    <FormItem className="text_left" {...formInfoSmall}>
                                        {getFieldDecorator('otherFeeUserPer', {
                                        })(
                                            <div style={{ fontSize: "14px" }}>{this.state.repayData.otherFeeUserPer ? "????????????" + this.state.repayData.otherFeeUserPer + "%" : ""}</div>
                                        )}
                                    </FormItem>

                                </Col>
                                <Col span={10} pull={2} >
                                    <FormItem className="text_left" {...formInfoSmall}>
                                        {getFieldDecorator('otherFeePayerPer', {
                                        })(
                                            <div style={{ fontSize: "14px" }}>{this.state.repayData.otherFeePayerPer ? "????????????" + this.state.repayData.otherFeePayerPer + "%" : ""}</div>
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
                            <span className="product_card_title">????????????</span>
                        </Col>
                        <Col span={16}>
                            <FormItem label="????????????" {...formInfoText} >
                                {getFieldDecorator('lateFeePer', {

                                })(
                                    <div style={{ fontSize: "14px" }}>{this.props.product.lateFeePer}%*????????????</div>
                                )}
                            </FormItem>

                            <Row>
                                <Col
                                    span={4}
                                    style={{ textAlign: "right", fontSize: "14px", color: "rgba(0,0,0,0.5)", paddingRight: "10px", marginBottom: "15px", lineHeight: "32px" }}
                                >
                                    <label>????????????</label>
                                </Col>
                                <Col span={10}>
                                    <FormItem className="" {...formInfoSmall} >
                                        {getFieldDecorator('lateFeeUserPer', {
                                        })(
                                            <div style={{ fontSize: "14px" }}>{this.state.repayData.lateFeeUserPer ? "????????????" + this.state.repayData.lateFeeUserPer + "%" : ""}</div>
                                        )}
                                    </FormItem>

                                </Col>
                                <Col span={10} pull={2} >
                                    <FormItem {...formInfoSmall}>
                                        {getFieldDecorator('lateFeePayerPer', {
                                        })(
                                            <div style={{ fontSize: "14px" }}>{this.state.repayData.lateFeePayerPer ? "????????????" + this.state.repayData.lateFeePayerPer + "%" : ""}</div>
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
                            <span className="product_card_title">?????????????????????</span>
                        </Col>
                        <Col span={16}>
                            <FormItem label="????????????" {...formInfoText} >
                                {getFieldDecorator('penaltyFeePer', {
                                })(
                                    <div style={{ fontSize: "14px" }}>{this.props.product.penaltyFeePer}%*????????????</div>
                                )}
                            </FormItem>

                            <Row>
                                <Col
                                    span={4}
                                    style={{ textAlign: "right", fontSize: "14px", color: "rgba(0,0,0,0.5)", paddingRight: "10px", marginBottom: "15px", lineHeight: "32px" }}
                                >
                                    <label>????????????</label>
                                </Col>
                                <Col span={10}>
                                    <FormItem className="" {...formInfoSmall}>
                                        {getFieldDecorator('penaltyFeeUserPer', {
                                        })(
                                            <div style={{ fontSize: "14px" }}>{this.state.repayData.penaltyFeeUserPer ? "????????????" + this.state.repayData.penaltyFeeUserPer + "%" : ""}</div>
                                        )}
                                    </FormItem>

                                </Col>
                                <Col span={10} pull={2} >
                                    <FormItem className="" {...formInfoSmall}>
                                        {getFieldDecorator('penaltyFeePayerPer', {
                                        })(
                                            <div style={{ fontSize: "14px" }}>{this.state.repayData.penaltyFeePayerPer ? "????????????" + this.state.repayData.penaltyFeePayerPer + "%" : ""}</div>
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
                    <FormItem label="???????????????????????????????????????" {...formInfo} >
                        {getFieldDecorator('haveJqxccs', {
                        })(
                            <div style={{ fontSize: "14px" }}>{this.props.product.haveJqxccs ? "???" : "???"}</div>
                        )}
                    </FormItem>
                    <FormItem label="??????" {...formInfo} >
                        {getFieldDecorator('period', {
                        })(
                            <div style={{ fontSize: "14px" }}>{this.props.product.period}???</div>
                        )}
                    </FormItem>
                    <FormItem label="????????????" {...formInfo} >
                        {getFieldDecorator('loanBasis', {
                        })(
                            <div style={{fontSize:"14px"}}>{this.props.product.loanBasis?"?????????":"??????"}</div>
                        )}
                    </FormItem>
                    <FormItem label="?????????/????????????" {...formInfo} >
                        {getFieldDecorator('insuranceSize', {
                        })(
                            <div style={{fontSize:"14px"}}>{this.props.product.insuranceSize}</div>

                        )}
                    </FormItem>
                    <FormItem label="?????????????????????" {...formInfo}>
                        {getFieldDecorator('enableAudit', {
                        })(
                            <div style={{fontSize:"14px"}}>{this.props.product.enableAudit?"???????????????":"??????????????????"}</div>

                        )}
                    </FormItem>
                    <FormItem label="??????????????????" {...formInfo} >
                        {getFieldDecorator('preSign', {
                        })(
                            <div style={{fontSize:"14px"}}>{this.props.product.preSign?"???":"???"}</div>

                        )}
                    </FormItem>
                    <FormItem label="????????????" {...formInfo} >
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