import React, { Component } from 'react';
import { Row, Col, Form, Select, Input } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
class Basic extends Component {
    constructor(props) {
        super(props);
        props.onRef(this);
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const ModalformInfo = {
            labelCol: { span: 10 },
            wrapperCol: { span: 12 },
            colon: false,
            hideRequiredMark:true
        };
        return(
            <div>
                <Row>
                        <span>请输入用户群名称</span>
                    </Row>
                    <Row>
                        <FormItem label="" {...ModalformInfo} >
                            {getFieldDecorator('key', {
                                initialValue: "",
                                rules: [{ required: true, message: "请输入" }, { pattern: /^[0-9]{1,25}$/, message: "格式错误" }]
                            })(
                                <Input placeholder="请输入" />
                            )}
                        </FormItem>
                    </Row>
                    <Row>
                        <span>请选择服务费收取实际及基数</span>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem label="收取基数" {...ModalformInfo} >
                                {getFieldDecorator('serviceFeeType', {
                                    rules: [{ required: true, message: "请选择" }]
                                })(
                                    <Select placeholder="请选择" style={{width:"100%"}}>
                                        {/* <Option value="1">待选择</Option> */}
                                        <Option value="2">借款金额百分比/期</Option>
                                        <Option value="1">固定金额/期</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="收取时机" {...ModalformInfo} >
                                {getFieldDecorator('serviceFeeCollectType', {
                                    rules: [{ required: true, message: "请选择" }]
                                })(
                                    <Select placeholder="请选择" style={{width:"100%"}}>
                                        {/* <Option value="1">待选择</Option> */}
                                        <Option value="1">分期收取</Option>
                                        <Option value="2">首期收取</Option>
                                        <Option value="0">不收取</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>

                    </Row>
                    <Row>
                        <span>请选择会员费收取时机及基数</span>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem label="收取基数" {...ModalformInfo} >
                                {getFieldDecorator('vipType', {
                                    rules: [{ required: true, message: "请选择" }]
                                })(
                                    <Select placeholder="请选择" style={{width:"100%"}}>
                                        {/* <Option value="1">待选择</Option> */}
                                        <Option value="2">借款金额百分比/期</Option>
                                        <Option value="1">固定金额/期</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="收取时机" {...ModalformInfo} >
                                {getFieldDecorator('vipCollectType', {
                                    rules: [{ required: true, message: "请输入" }]
                                })(
                                    <Select placeholder="请选择" style={{width:"100%"}}>
                                        {/* <Option value="1">待选择</Option> */}
                                        <Option value="1">贷前收取</Option>
                                        <Option value="2">贷后收取</Option>
                                        <Option value="0">不收取</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
            </div>
        )
    }
}
export default Form.create()(Basic);