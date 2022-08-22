import React, { Component } from 'react';
import { Form, Input, Row, Col } from 'antd';
import {accMul} from '../../../../../../ajax/tool';
const FormItem = Form.Item;
class FormInfo extends Component {
    constructor(props){
        super(props);
        props.onRef(this)
    }
    getValue(e) {
        var value=this.props.form.getFieldsValue();console.log(value)
        for(var i in value){
            value[i]=value[i]===""?"":accMul(value[i],100)
        }
        return value
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return <Row>
            <Col span={8}>
                <FormItem label={<span style={{ width: "100%" }}>{this.props.rateName||"协议代扣费率"}</span>} labelCol={{ span: 12 }} wrapperCol={{ span: 10 }} colon={false}>
                    {getFieldDecorator(this.props.rate, {
                        initialValue: "",
                        rules:[{ pattern: /^[0-9]+(\.[0-9]{1,4})?$/, message: "格式错误" }]
                    })(
                        <Input placeholder="请输入" />
                    )}
                    {/* <div className="formIcon" >%</div> */}
                    <div className="formText" style={{ width: "200px" }} >%</div>
                </FormItem>
            </Col>
            <Col span={6} >
            <FormItem label={<span style={{ width: "100%" }}>单笔下限</span>} labelCol={{ span: 7 }} wrapperCol={{ span: 10 }} colon={false}>
                    {getFieldDecorator(this.props.min, {
                        initialValue: "",
                        rules:[{ pattern: /^[0-9]+(\.[0-9]{1,4})?$/, message: "格式错误" }]
                    })(
                        <Input placeholder="请输入" />
                    )}
                    <div className="formText" style={{ width: "200px" }} >元</div>
                </FormItem>
            </Col>
            <Col span={8}>
            <FormItem label={<span style={{ width: "100%" }}>单笔上限</span>} labelCol={{ span: 5 }} wrapperCol={{ span: 7 }} colon={false}>
                    {getFieldDecorator(this.props.max, {
                        initialValue: "",
                        rules:[{ pattern: /^[0-9]+(\.[0-9]{1,4})?$/, message: "格式错误" }]
                    })(
                        <Input placeholder="请输入" />
                    )}
                    <div className="formText" style={{ width: "200px" }} >元</div>
                </FormItem>
            </Col>
        </Row>
    }
}
export default Form.create()(FormInfo);