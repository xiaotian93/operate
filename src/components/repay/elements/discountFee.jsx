import React, { Component } from 'react';
import { axios_xjd } from '../../../ajax/request'
import { bmd_repay_get_info, bmd_repay_discount_days } from '../../../ajax/api';
import { bmd, accMul, floatSub, accDiv } from '../../../ajax/tool';
import { Radio, Input, Form, message } from 'antd';
const FormItem = Form.Item;
const { TextArea } = Input;
class Insurance extends Component {
    constructor(props) {
        super(props);
        props.onRef(this);
        this.state = {
            data: {
                principal: 0,
                interest: 0,
                serviceFee: 0,
                otherFee: 0,
                clearOverdueInterest: 0,
                clearPenaltyOverdueFee: 0,
                clearPenaltyAheadFee: 0,
                settleOverdueInterest: 0,
                settlePenaltyOverdueFee: 0,
                settlePenaltyAheadFee: 0,
                discountOverdueInterest: 0,
                discountPenaltyOverdueFee: 0,
                discountPenaltyAheadFee: 0,
                discountInterest: 0,
                discountServiceFee: 0,
                discountServiceTechFee: 0,
                discountOtherFee: 0,
                overdueInterest: 0,
                penaltyOverdueFee: 0,
                penaltyAheadFee: 0,
                serviceTechFee: 0
            },
            total: "0.00",
            value: 1,
            discountInterest: "0.00",
            discountServiceFee: "0.00",
            discountServiceTechFee: "0.00",
            discountOverdueFee: "0.00",
            discountPenaltyFee: "0.00",
            discountotherFee: "0.00",
            value_serviceFee: 1,
            value_overdueFee: 1,
            value_penaltyFee: 1,
            value_otherFee: 1,
            discountInterest_num: "0.00",
            discountServiceFee_num: "0.00",
            discountOverdueFee_num: "0.00",
            discountPenaltyFee_num: "0.00",
            discountInterest_day: "0.00",
            discountotherFee_num: "0.00",
            discountServiceTechFee_num: "0.00"
        }
        this.aaa = 0;
    }
    componentWillMount() {
        // this.discount_fee_info();
        // this.onChange_interest();
    }
    componentDidMount() {
        console.log(this.state.data)
        this.setState({
            discountInterest: this.state.data.interest
        })
    }
    get_val() {
        if (this.state.discountServiceFee_num_type || this.state.discountInterest_num_type || this.state.discountOverdueFee_num_type ||
            this.state.discountotherFee_num_type || this.state.discountPenaltyFee_num_type || this.state.discountServiceTechFee_num_type) {
            return false
        }
        if (!this.props.noReason && !this.props.form.getFieldValue("purpose")) {
            message.warn("请填写申请原因");
            return false
        }
        return {
            amount: {
                interest: accMul(this.state.discountInterest_num, 100),
                serviceFee: accMul(this.state.discountServiceFee_num, 100),
                overdueFee: accMul(this.state.discountOverdueFee_num, 100),
                penaltyOverdueFee: accMul(this.state.discountPenaltyFee_num, 100),
                otherFee: accMul(this.state.discountotherFee_num, 100),
                // principal:this.state.data.plan.principal,
                penaltyAheadFee: 0,
                serviceTechFee: accMul(this.state.discountServiceTechFee_num, 100)
            },
            purpose: this.props.form.getFieldValue("purpose")

        }

    }

    onChange_interest(e) {
        this.setState({
            value: e.target.value,
            discountInterest: accDiv(this.state.data.plan.interest, 100).toFixed(2),
        });
        this.props.form.setFieldsValue({ "interestMoney": "", "interestDay": "" })
        // this.props.form.setFields({
        //     interestMoney: {
        //         errors: "",
        //         value: ""
        //     },
        // });
    };
    onChange_serviceFee(e) {
        this.setState({
            value_serviceFee: e.target.value,
            discountServiceFee: accDiv(this.state.data.plan.serviceFee, 100).toFixed(2),
            serviceFeeMoney_status: "",
            serviceFeeDay_status: ""
        });
        this.props.form.setFieldsValue({ "serviceFeeMoney": "", "serviceFeeDay": "" })
    }
    onChange_overdueFee(e) {
        this.setState({
            value_overdueFee: e.target.value,
            discountOverdueFee: accDiv(this.state.data.plan.overdueFee, 100).toFixed(2),
            overdueFeeMoney_status: "",
            overdueFeeDay_status: ""
        });
        this.props.form.setFieldsValue({ "overdueFeeMoney": "", "overdueFeeDay": "" })
    }
    onChange_otherFee(e) {
        this.setState({
            value_otherFee: e.target.value,
            discountotherFee: accDiv(this.state.data.plan.otherFee, 100).toFixed(2),
            otherFeeMoney_status: "",
            otherFeeDay_status: ""
        });
        this.props.form.setFieldsValue({ "otherFeeMoney": "", "otherFeeDay": "" })
    }
    onChange_penaltyFee(e) {
        this.setState({
            value_penaltyFee: e.target.value,
            discountPenaltyFee: accDiv(this.state.data.plan.penaltyFee, 100).toFixed(2)
        });
        this.props.form.setFieldsValue({ "penaltyFeeMoney": "" })
    }
    onChange_serviceTechFee(e) {
        this.setState({
            value_serviceTechFee: e.target.value,
            discountServiceTechFee: accDiv(this.state.data.plan.serviceTechFee, 100).toFixed(2)
        });
        this.props.form.setFieldsValue({ "serviceTechFeeMoney": "" })
    }
    interest_change(e, type, feeType, discountType, feeTypeDay) {
        var value = e.target.value;
        if (value === "") {
            // return;
            e.target.value = 0.00;
        }
        // var interest = this.state.data.plan[feeType]?accDiv(this.state.data.plan[feeType],100).toFixed(2):accDiv(this.state.data.expect[feeType],100).toFixed(2);
        var interest = accDiv(this.state.data[feeType], 100).toFixed(2);
        if (type === "money") {
            if (Number(value) > Number(interest)) {
                setTimeout(() => {
                    this.props.form.setFields({
                        [feeType + "Money"]: {
                            errors: [new Error('不能大于原始金额')],
                            value: Number(value).toFixed(2)
                        },
                    });
                }, 10)
                this.setState({
                    [discountType + '_num_type']: true,
                })
                return
            }
            if (Number(value) < 0 || isNaN(Number(value))) {
                this.setState({
                    [discountType + '_num_type']: true,
                })
                return
            }
            this.props.form.setFieldsValue({ [feeType + "Money"]: Number(value).toFixed(2) })
            var discount = floatSub(Number(interest), Number(value));
            this.setState({
                [discountType]: Number(discount).toFixed(2),
                [discountType + '_num']: Number(value).toFixed(2),
                [discountType + '_num_type']: false
            })

        } else {
            if (value < 0 || value.indexOf(".") !== -1 || isNaN(Number(value))) {
                this.setState({
                    [discountType + '_num_type']: true,
                })
                return;
            }
            var param = {
                orderNo: this.props.orderNo,
                period: this.props.period,
                discountDays: value,
                feeType: feeTypeDay
            }
            axios_xjd.post(bmd_repay_discount_days, param).then(e => {
                if (!e.code) {
                    var discount = floatSub(Number(interest), Number(bmd.money(e.data)));
                    if (discount < 0) {
                        this.props.form.setFields({
                            [feeType + "Day"]: {
                                errors: [new Error('不能大于原始金额')],
                                value: value
                            },
                        });
                        this.setState({
                            [discountType + '_num_type']: true,
                        })
                        return;
                    }
                    this.setState({
                        [discountType]: Number(discount).toFixed(2),
                        [discountType + '_num']: bmd.money(e.data),
                        [discountType + '_num_type']: false
                    })
                }
            })
        }

    }
    render() {
        const amount = this.state.data;
        const data = amount;
        data.overdueFee = amount.overdueInterest;
        // data.penaltyOverdueFee = amount.clearPenaltyOverdueFee + amount.settlePenaltyOverdueFee + amount.discountPenaltyOverdueFee;
        // data.penaltyAheadFee = amount.clearPenaltyAheadFee + amount.settlePenaltyAheadFee + amount.discountPenaltyAheadFee;
        // const remainDiscount=amount.remainDiscount;
        const { getFieldDecorator } = this.props.form;
        return (
            <Form className="sh_add">
                <table className="sh_product_table" cellSpacing="0" cellPadding="0" style={{ fontSize: "14px" }}>
                    <thead style={{ background: "#f7f7f7" }}>
                        <tr>
                            <th style={{ background: "#f7f7f7" }}>费用类别</th>
                            <th style={{ background: "#f7f7f7" }}>原始金额</th>
                            <th style={{ background: "#f7f7f7" }}>减免</th>
                            <th style={{ background: "#f7f7f7" }}>减免后</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>应还本金</td>
                            <td>{accDiv(data.principal, 100).toFixed(2) || 0.00}</td>
                            <td>——</td>
                            <td>{accDiv(data.principal, 100).toFixed(2) || 0.00}</td>
                        </tr>
                        <tr>
                            <td>应还利息</td>
                            <td>{accDiv(data.interest, 100).toFixed(2) || 0.00}</td>
                            <td>
                                {<Radio.Group onChange={this.onChange_interest} value={this.state.value}>
                                    <Radio value={1} style={{ width: "200px", lineHeight: "32px" }}>按金额
                                        <FormItem label="" wrapperCol={{ span: 15 }} style={{ float: "right", marginLeft: "10px" }} >
                                            {getFieldDecorator('interestMoney', {
                                                rules: [{ pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "格式错误" }],
                                                // initialValue:accDiv(remainDiscount.interest,100).toFixed(2)||"",
                                                validateTrigger: ["onChange"]
                                            })(
                                                <Input placeholder="0.00" className="input_text" onBlur={(e) => { this.interest_change(e, "money", "interest", "discountInterest") }} disabled={data.interest ? false : true} />
                                            )}
                                        </FormItem>
                                    </Radio>
                                    {/* <Radio value={0} style={{ width: "200px", lineHeight: "32px", marginLeft: "30px" }}>按天数
                                        <FormItem label="" wrapperCol={{ span: 15 }} style={{ float: "right", marginLeft: "10px" }}>
                                            {getFieldDecorator('interestDay', {
                                                rules: [{ pattern: /^[0-9]*$/, message: "格式错误" }],
                                                validateTrigger: "onChange"
                                            })(
                                                <Input placeholder="请输入" disabled={!this.state.value ? false : true} className="input_text" onBlur={(e) => { this.interest_change(e, "day", "interest", "discountInterest", "INTEREST") }} />
                                            )}
                                            <div className="formText">天</div>
                                        </FormItem>
                                    </Radio> */}
                                </Radio.Group>}
                            </td>
                            <td>{this.state.discountInterest}</td>
                        </tr>
                        <tr>
                            <td>应还服务费</td>
                            <td>{accDiv(data.serviceFee, 100).toFixed(2) || 0.00}</td>
                            <td>
                                {
                                    <Radio.Group onChange={this.onChange_serviceFee.bind(this)} value={this.state.value_serviceFee}>
                                        <Radio value={1} style={{ width: "200px", lineHeight: "32px" }}>按金额
                                            <FormItem label="" wrapperCol={{ span: 15 }} style={{ float: "right", marginLeft: "10px" }}>
                                                {getFieldDecorator('serviceFeeMoney', {
                                                    rules: [{ pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "格式错误" }],
                                                    // initialValue: 0.00,
                                                    validateTrigger: "onChange"
                                                })(
                                                    <Input placeholder="0.00" className="input_text" onBlur={(e) => { this.interest_change(e, "money", "serviceFee", "discountServiceFee") }} disabled={data.serviceFee ? false : true} />
                                                )}
                                            </FormItem>
                                        </Radio>
                                        {/* <Radio value={0} style={{ width: "200px", lineHeight: "32px", marginLeft: "30px" }}>按天数
                                    <FormItem label="" wrapperCol={{ span: 15 }} style={{ float: "right", marginLeft: "10px" }}>
                                                {getFieldDecorator('serviceFeeDay', {
                                                    rules: [{ pattern: /^[0-9]*$/, message: "格式错误" }],
                                                    validateTrigger: "onChange"
                                                })(
                                                    <Input placeholder="请输入" disabled={!this.state.value_serviceFee ? false : true} className="input_text" onBlur={(e) => { this.interest_change(e, "day", "serviceFee", "discountServiceFee", "SERVICE_FEE") }} />
                                                )}
                                                <div className="formText">天</div>
                                            </FormItem>
                                        </Radio> */}
                                    </Radio.Group>
                                }
                            </td>
                            <td>{this.state.discountServiceFee}</td>
                        </tr>
                        <tr>
                            <td>应还其他费用</td>
                            <td>{accDiv(data.otherFee, 100).toFixed(2) || 0.00}</td>
                            <td>
                                {
                                    <Radio.Group onChange={this.onChange_otherFee.bind(this)} value={this.state.value_otherFee}>
                                        <Radio value={1} style={{ width: "200px", lineHeight: "32px" }}>按金额
                                            <FormItem label="" wrapperCol={{ span: 15 }} style={{ float: "right", marginLeft: "10px" }}>
                                                {getFieldDecorator('otherFeeMoney', {
                                                    rules: [{ pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "格式错误" }],
                                                    // initialValue: 0.00,
                                                    validateTrigger: "onChange"
                                                })(
                                                    <Input placeholder="0.00" className="input_text" onBlur={(e) => { this.interest_change(e, "money", "otherFee", "discountotherFee") }} disabled={data.otherFee ? false : true} />
                                                )}
                                            </FormItem>
                                        </Radio>
                                        {/* <Radio value={0} style={{ width: "200px", lineHeight: "32px", marginLeft: "30px" }}>按天数
                                    <FormItem label="" wrapperCol={{ span: 15 }} style={{ float: "right", marginLeft: "10px" }}>
                                                {getFieldDecorator('overdueFeeDay', {
                                                    rules: [{ pattern: /^[0-9]*$/, message: "格式错误" }],
                                                    validateTrigger: "onChange"
                                                })(
                                                    <Input placeholder="请输入" disabled={!this.state.value_overdueFee ? false : true} className="input_text" onBlur={(e) => { this.interest_change(e, "day", "overdueFee", "discountOverdueFee", "OVERDUE_FEE") }} />
                                                )}
                                                <div className="formText">天</div>
                                            </FormItem>
                                        </Radio> */}
                                    </Radio.Group>
                                }
                            </td>
                            <td>{this.state.discountotherFee}</td>
                        </tr>
                        <tr>
                            <td>应还逾期罚息</td>
                            <td>{accDiv(data.overdueFee, 100).toFixed(2) || 0.00}</td>
                            <td>
                                {
                                    <Radio.Group onChange={this.onChange_overdueFee.bind(this)} value={this.state.value_overdueFee}>
                                        <Radio value={1} style={{ width: "200px", lineHeight: "32px" }}>按金额
                                            <FormItem label="" wrapperCol={{ span: 15 }} style={{ float: "right", marginLeft: "10px" }}>
                                                {getFieldDecorator('overdueFeeMoney', {
                                                    rules: [{ pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "格式错误" }],
                                                    // initialValue: 0.00,
                                                    validateTrigger: "onChange"
                                                })(
                                                    <Input placeholder="0.00" className="input_text" onBlur={(e) => { this.interest_change(e, "money", "overdueFee", "discountOverdueFee") }} disabled={data.overdueFee ? false : true} />
                                                )}
                                            </FormItem>
                                        </Radio>
                                        {/* <Radio value={0} style={{ width: "200px", lineHeight: "32px", marginLeft: "30px" }}>按天数
                                    <FormItem label="" wrapperCol={{ span: 15 }} style={{ float: "right", marginLeft: "10px" }}>
                                                {getFieldDecorator('overdueFeeDay', {
                                                    rules: [{ pattern: /^[0-9]*$/, message: "格式错误" }],
                                                    validateTrigger: "onChange"
                                                })(
                                                    <Input placeholder="请输入" disabled={!this.state.value_overdueFee ? false : true} className="input_text" onBlur={(e) => { this.interest_change(e, "day", "overdueFee", "discountOverdueFee", "OVERDUE_FEE") }} />
                                                )}
                                                <div className="formText">天</div>
                                            </FormItem>
                                        </Radio> */}
                                    </Radio.Group>
                                }
                            </td>
                            <td>{this.state.discountOverdueFee}</td>
                        </tr>
                        <tr>
                            <td>应还违约金</td>
                            <td>{accDiv(data.penaltyOverdueFee, 100).toFixed(2) || 0.00}</td>
                            <td>
                                {
                                    <Radio.Group onChange={this.onChange_penaltyFee.bind(this)} value={this.state.value_penaltyFee}>
                                        <Radio value={1} style={{ width: "200px", lineHeight: "32px" }}>按金额
                                            <FormItem label="" wrapperCol={{ span: 15 }} style={{ float: "right", marginLeft: "10px" }}>
                                                {getFieldDecorator('penaltyOverdueFeeMoney', {
                                                    rules: [{ pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "格式错误" }],
                                                    // initialValue: 0.00,
                                                    validateTrigger: "onChange"
                                                })(
                                                    <Input placeholder="0.00" className="input_text" onBlur={(e) => { this.interest_change(e, "money", "penaltyOverdueFee", "discountPenaltyFee") }} disabled={data.penaltyOverdueFee ? false : true} />
                                                )}
                                            </FormItem>
                                        </Radio>
                                    </Radio.Group>
                                }
                            </td>
                            <td>{this.state.discountPenaltyFee}</td>
                        </tr>
                        <tr>
                            <td>应还提前结清手续费</td>
                            <td>0.00</td>
                            <td>——</td>
                            <td>0.00</td>
                        </tr>
                        {this.props.serviceTechFee?<tr>
                            <td>应还科技服务费</td>
                            <td>{accDiv(data.serviceTechFee, 100).toFixed(2) || 0.00}</td>
                            <td>{
                                <Radio.Group onChange={this.onChange_serviceTechFee.bind(this)} value={this.state.value_penaltyFee}>
                                    <Radio value={1} style={{ width: "200px", lineHeight: "32px" }}>按金额
                                        <FormItem label="" wrapperCol={{ span: 15 }} style={{ float: "right", marginLeft: "10px" }}>
                                            {getFieldDecorator('serviceTechFeeMoney', {
                                                rules: [{ pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "格式错误" }],
                                                // initialValue: 0.00,
                                                validateTrigger: "onChange"
                                            })(
                                                <Input placeholder="0.00" className="input_text" onBlur={(e) => { this.interest_change(e, "money", "serviceTechFee", "discountServiceTechFee") }} disabled={data.serviceTechFee ? false : true} />
                                            )}
                                        </FormItem>
                                    </Radio>
                                </Radio.Group>
                            }</td>
                            <td>{this.state.discountServiceTechFee}</td>
                        </tr>:<tr>
                        <td>应还科技服务费</td>
                        <td>{accDiv(data.serviceTechFee, 100).toFixed(2) || 0.00}</td>
                        <td>——</td>
                        <td>{accDiv(data.serviceTechFee, 100).toFixed(2) || 0.00}</td>
                            </tr>}
                        <tr>
                            <td>合计</td>
                            <td>{accDiv(Number(data.principal) + Number(data.interest) + Number(data.serviceFee) + Number(data.otherFee) + Number(data.overdueFee) + Number(data.penaltyOverdueFee) + Number(data.serviceTechFee), 100).toFixed(2)}</td>
                            <td>{((Number(this.state.discountInterest_num) + Number(this.state.discountServiceFee_num) + Number(this.state.discountOverdueFee_num) + Number(this.state.discountPenaltyFee_num)) + Number(this.state.discountotherFee_num) + Number(this.state.discountServiceTechFee_num)).toFixed(2)}</td>
                            <td>{(Number(this.state.discountInterest) + Number(this.state.discountServiceFee) + Number(this.state.discountOverdueFee) + Number(this.state.discountPenaltyFee) + Number(accDiv(this.state.data.principal, 100)) + Number(this.state.discountServiceTechFee) + Number(this.state.discountotherFee)).toFixed(2)}</td>

                        </tr>
                    </tbody>
                </table>
                {this.props.noReason ? null : <div style={{ marginTop: "30px" }}>
                    <FormItem label="申请原因" wrapperCol={{ span: 21 }} labelCol={{ span: 3 }} hideRequiredMark colon={false} required>
                        {getFieldDecorator('purpose', {
                            // rules: [{ pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "格式错误" }],
                            validateTrigger: "onChange",
                            initialValue: ""
                        })(
                            <TextArea placeholder="请输入" />
                        )}
                    </FormItem>
                </div>}
                <style>{`   
                    .input_text{
                        width:80px;
                    }
                    .ant-radio-wrapper span{
                        display:inline-block
                    }
                `}</style>
            </Form>
        )
    }
}
export default Form.create()(Insurance);