import React, { Component } from 'react';
import { Input, Form, Row, Col, message, DatePicker } from 'antd';
import { accDiv } from '../../../ajax/tool';
import moment from 'moment';
const FormItem = Form.Item;
const { TextArea } = Input;
class FeeMore extends Component {
    constructor(props) {
        super(props);
        props.onRef(this);
        this.child = [];
        this.state = {
            amount: this.props.amount || 0,
            repayDate:moment()
        }
    }
    check(e) {
        if (e.target.value !== this.state.amount.money()) {
            message.warn("划扣金额应等于应还金额");
            e.target.value = "";
            this.props.form.setFieldsValue({ "amount": "" })
        }
    }
    //选择还款日
    changeDate(date, dateString) {
        this.setState({repayDate:date})
        this.props.repayDate(date)
    }
    render() {
        const { getFieldDecorator } = this.props.form; console.log(this.props.amount)
        return (
            <div className="sh_add">

                <Row style={{ marginBottom: "16px" }}>
                    <Col span={5}>
                        <span style={{ fontSize: "14px", color: "rgba(0,0,0,0.5)" }}>还款日期</span>
                    </Col>
                    <Col span={18}>
                        <DatePicker onChange={this.changeDate.bind(this)} showTime format="YYYY-MM-DD HH:mm:ss" showToday={false} value={this.state.repayDate} />
                    </Col>
                </Row>
                <Row style={{ marginBottom: "16px" }}>
                    <Col span={5}>
                        <span style={{ fontSize: "14px", color: "rgba(0,0,0,0.5)" }}>应还金额</span>
                    </Col>
                    <Col span={18}>
                        <span style={{ fontSize: "14px" }}>{this.props.amount.money() + "元"}</span>
                    </Col>
                </Row>
                <FormItem label="申请划扣金额" wrapperCol={{ span: 18 }} labelCol={{ span: 5 }} hideRequiredMark colon={false} required>
                    {getFieldDecorator('amount', {
                        rules: [{ required: true, message: '请填写申请划扣金额' }, { pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "格式错误" }],
                        validateTrigger: "onChange",
                        initialValue: accDiv(this.props.amount, 100).toFixed(2)
                        // initialValue:this.props.amount.money()
                    })(
                        <Input placeholder="请填写申请划扣金额" onBlur={this.check.bind(this)} disabled />
                    )
                    }
                    <div className="formText">元</div>
                </FormItem>

                <FormItem label="申请原因(选填)" wrapperCol={{ span: 18 }} labelCol={{ span: 5 }} hideRequiredMark colon={false} required>
                    {getFieldDecorator('purpose', {
                        initialValue: "",
                        validateTrigger: "onChange"
                    })(
                        <TextArea placeholder="请输入" />
                    )}
                </FormItem>
            </div>
        )
    }
}
export default Form.create()(FeeMore)