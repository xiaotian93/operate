import React, { Component } from 'react';
import { axios_xjd } from '../../../ajax/request'
import { bmd_repay_discount_days } from '../../../ajax/api';
import { bmd, accMul, floatSub } from '../../../ajax/tool';
import {accDiv} from '../../../ajax/tool';
import { Radio, Input, Form ,Row} from 'antd';
const FormItem = Form.Item;
class Insurance extends Component {
    constructor(props) {
        super(props);
        props.onRef(this);
        this.state = {
            data: {
                principal: 0,
                interest: 0,
                serviceFee: 0,
                overdueFee: 0,
                penaltyFee: 0,
                serviceTechFee:0
            },
            total: "0.00",
            value: 1,
            // discountInterest: "0.00",
            // discountInterest:accDiv(this.props.data[this.props.father][this.props.param],100).toFixed(2),
            discountInterest:accDiv((this.props.data[this.props.father][this.props.param]-this.props.data["remainDiscount"][this.props.param]),100).toFixed(2),
            // discountServiceFee: "0.00",
            // discountOverdueFee: "0.00",
            // discountPenaltyFee: "0.00",
            // value_serviceFee: 1,
            // value_overdueFee: 1,
            // value_penaltyFee: 1,
            discountInterest_num: "0.00",
            // discountServiceFee_num: "0.00",
            // discountOverdueFee_num: "0.00",
            // discountPenaltyFee_num: "0.00",
            // discountInterest_day: "0.00",
        }
        this.money=accDiv(this.props.data["remainDiscount"][this.props.param],100)||0
    }
    componentWillMount() {
    }
    discount(){
        this.setState({
            discountInterest:accDiv((this.props.data[this.props.father][this.props.param]-this.props.data["remainDiscount"][this.props.param]),100).toFixed(2)
        })
        this.money=accDiv(this.props.data["remainDiscount"][this.props.param],100)||0
    }
    get_val() {
        if(this.state.discountInterest_num_type){
            return false
        }
        var param=this.props.param;
        return {
            amount: accMul(this.state.discountInterest_num, 100),
            phase:this.props.data.key,
            type:param
        }

    }
    onChange_interest (e) {
        this.setState({
            value: e.target.value,
            discountInterest: accDiv(this.state.data.interest,100).toFixed(2),
        });
        this.props.form.setFieldsValue({ "interestMoney": "", "interestDay": "" })
        
    };
    interest_change(e, type, feeType, discountType, feeTypeDay) {
        var value = e.target.value;
        if (value === "") {
            e.target.value=0.00;
            // return;
        }
        var father=this.props.father;
        var params=this.props.param;
        var interest = accDiv(this.props.data[father][params],100).toFixed(2);
        // var interest = 20;
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
            if (Number(value) <0||isNaN(Number(value))) {
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
            this.money=Number(value).toFixed(2);
            this.props.discount();
        } else {
            if (value < 0 || value.indexOf(".") !== -1||isNaN(Number(value))) {
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
    setVal(){
        this.props.form.setFieldsValue({"interestMoney":this.props.data.remainDiscount[this.props.param]>0?accDiv(this.props.data.remainDiscount[this.props.param],100).toFixed(2):""});
    }
    render() {
        const data = this.props.data;
        const param=this.props.param;
        const father=this.props.father;
        const { getFieldDecorator } = this.props.form;
        const row=this.props.row;
        return (                        
                        <tr>
                            {this.props.index?null:<td rowSpan={row}>{this.props.title}</td>}
                            <td>{data.key}</td>
                            <td>{accDiv(data[father][param],100).toFixed(2) || 0.00}</td>
                            <td>
                                {this.props.type==="none"?"--":<Row><Radio.Group onChange={this.onChange_interest} value={this.state.value}>
                                    <Radio value={1} style={{ width: "230px", lineHeight: "32px" }}><span>按金额</span>
                                        <FormItem label="" wrapperCol={{ span: 15 }} style={{ float: "right",marginLeft:"10px" }} >
                                            {getFieldDecorator('interestMoney', {
                                                rules: [{ pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "格式错误" }],
                                                // initialValue: accDiv(data.remainDiscount[param],100).toFixed(2)||"",
                                                validateTrigger: ["onChange"]
                                            })(
                                                <Input placeholder="0.00" className="input_text" onBlur={(e) => { this.interest_change(e, "money", "interest", "discountInterest") }} disabled={data[father][param]?false:true} />
                                            )}
                                        </FormItem>
                                    </Radio>
                                    {/* disabled={data[father][param]?false:true}  */}
                                    
                                    {/* {this.props.type==="money"?null:<Col span={12}><Radio value={0} style={{ width: "230px", lineHeight: "32px"}}><span>按天数</span>
                                        <FormItem label="" wrapperCol={{ span: 15 }} style={{ float: "right",marginLeft:"10px" }}>
                                            {getFieldDecorator('interestDay', {
                                                rules: [{ pattern: /^[0-9]*$/, message: "格式错误" }],
                                                validateTrigger: "onChange"
                                            })(
                                                <Input placeholder="请输入" disabled={!this.state.value ? false : true} className="input_text" onBlur={(e) => { this.interest_change(e, "day", "interest", "discountInterest", "INTEREST") }} />
                                            )}
                                            <div className="formText">天</div>
                                        </FormItem>
                                    </Radio></Col>} */}
                                </Radio.Group></Row>}
                            </td>
                            <td>{this.state.discountInterest}</td>
                        </tr>
        )
    }
}
export default Form.create()(Insurance);