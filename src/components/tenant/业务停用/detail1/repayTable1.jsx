import React, { Component } from 'react';
import {Row,Col,Form} from 'antd';
const FormItem = Form.Item;
class RepayTable extends Component{
    constructor(props) {
        super(props);
        props.onRef(this);
        this.state = {
            product:props.product,
            interestUserPer:false,
            interestPayerPer:false,
            serviceFeeUserPer:false,
            serviceFeePayerPer:false,
            otherFeeUserPer:false,
            otherFeePayerPer:false,
            lateFeeUserPer:false,
            lateFeePayerPer:false,
            repayData:{},
            repayProduct:{}
        };
    }
    componentWillMount(){
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formInfoSmall={
            className:"textRight tableForm"
        };
        return (
                <table className="repayTable" cellSpacing="0" cellPadding="0" >
                    <thead>
                        <tr>
                            <td>产品名称</td>
                            <td>还款资金项</td>
                            <td>合同约定收益率</td>
                            <td>还款情况 合同约定收益率=用户还款利率+商户代偿利率</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td rowSpan={5} style={{borderBottom:"none"}} >{this.props.product.name}</td>
                            <td>本金</td>
                            <td>本金</td>
                            <td style={{width:"400px"}} >
                                <FormItem label="" style={{marginBottom:"0!important"}} className="bottom" >
                                    {getFieldDecorator('productId', {
                                        initialValue:this.props.product.productId
                                    })(
                                        <div />
                                    )}
                                </FormItem>
                                <FormItem className="tableForm" >
                                    {getFieldDecorator('principalType',{
                                        initialValue:""
                                    })(
                                        <div style={{fontSize:"14px"}}>{this.state.repayData.principalType?"商家代偿":"用户还款"}</div>
                                    )}

                                </FormItem>
                            </td>
                        </tr>
                        <tr>
                            <td>利息</td>
                            <td>{this.state.repayProduct.interestPer!==null?this.state.repayProduct.interestPer+"%":""}</td>
                            <td>
                                <Row>
                                    <Col span={12}>
                                        <FormItem className="" label="" {...formInfoSmall} >
                                            {getFieldDecorator('interestUserPer', {
                                                initialValue:""
                                            })(
                                                <div style={{fontSize:"14px"}}>{this.state.repayData.interestUserPer?"用户还款"+this.state.repayData.interestUserPer+"%":""}</div>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem className="" {...formInfoSmall} >
                                            {getFieldDecorator('interestPayerPer', {
                                                initialValue:""
                                            })(
                                                <div style={{fontSize:"14px"}}>{this.state.repayData.interestPayerPer?"商家代偿"+this.state.repayData.interestPayerPer+"%":""}</div>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>

                            </td>
                        </tr>
                        <tr>
                            <td>逾期罚息</td>
                            <td>{this.state.repayProduct.lateFeePer!==null?this.state.repayProduct.lateFeePer+"%":""}</td>
                            <td>
                                <Row>
                                    <Col span={12}>
                                        <FormItem className="" {...formInfoSmall} >
                                            {getFieldDecorator('lateFeeUserPer', {
                                                initialValue:""
                                            })(
                                                <div style={{fontSize:"14px"}}>{this.state.repayData.lateFeeUserPer?"用户还款"+this.state.repayData.lateFeeUserPer+"%":""}</div>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12} >
                                        <FormItem className="" {...formInfoSmall} >
                                            {getFieldDecorator('lateFeePayerPer', {
                                                initialValue:""
                                            })(
                                                <div style={{fontSize:"14px"}}>{this.state.repayData.lateFeePayerPer?"商家代偿"+this.state.repayData.lateFeePayerPer+"%":""}</div>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </td>
                        </tr>
                        <tr>
                            <td>服务费</td>
                            <td>{this.state.repayProduct.serviceFeePer!==null?this.state.repayProduct.serviceFeePer+"%":""}</td>
                            <td>
                                <Row>
                                    <Col span={12}>
                                        <FormItem className="" {...formInfoSmall} >
                                            {getFieldDecorator('serviceFeeUserPer', {
                                                initialValue:""
                                            })(
                                                <div style={{fontSize:"14px"}}>{this.state.repayData.serviceFeeUserPer?"用户还款"+this.state.repayData.serviceFeeUserPer+"%":""}</div>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12} >
                                        <FormItem className="" {...formInfoSmall} >
                                            {getFieldDecorator('serviceFeePayerPer', {
                                                initialValue:""
                                            })(
                                                <div style={{fontSize:"14px"}}>{this.state.repayData.serviceFeePayerPer?"商家代偿"+this.state.repayData.serviceFeePayerPer+"%":""}</div>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </td>
                        </tr>
                        <tr>
                            <td>其他费用</td>
                            <td>{this.state.repayProduct.otherFeePer!==null?this.state.repayProduct.otherFeePer+"%":""}</td>
                            <td>
                                <Row>
                                    <Col span={12}>
                                        <FormItem className="" {...formInfoSmall} >
                                            {getFieldDecorator('otherFeeUserPer', {
                                                initialValue:""
                                            })(
                                                <div style={{fontSize:"14px"}}>{this.state.repayData.otherFeeUserPer?"用户还款"+this.state.repayData.otherFeeUserPer+"%":""}</div>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12} >
                                        <FormItem className="" {...formInfoSmall} >
                                            {getFieldDecorator('otherFeePayerPer', {
                                                initialValue:""
                                            })(
                                                <div style={{fontSize:"14px"}}>{this.state.repayData.otherFeePayerPer?"商家代偿"+this.state.repayData.otherFeePayerPer+"%":""}</div>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </td>
                        </tr>
                    </tbody>
                </table>


        )

    }
}
export default Form.create()(RepayTable);