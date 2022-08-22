import React, { Component } from 'react';
import { Form, Input, Row, Col ,Button} from 'antd';
import {accMul,accDiv} from '../../../../../../ajax/tool';
const FormItem = Form.Item;
class FormInfo extends Component {
    constructor(props){
        super(props);
        props.onRef(this)
    }
    componentDidMount(){
        this.setValue()
    }
    setValue(){
        var data=this.props.defalut;
        for(var i in data){
            this.props.form.setFieldsValue({[i]:(data[i]===""||data[i]===null)?"":accDiv(data[i],100)})
        }
    }
    getValue(e) {
        var value=this.props.form.getFieldsValue();
        for(var i in value){
            value[i]=value[i]===""?"":accMul(value[i],100)
        }
        return value
    }
    delete(){
        this.props.del();
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return <Row>
            <Col span={6}>
    <FormItem label={<span style={{ width: "100%" }}>区间{this.props.num+1}</span>} labelCol={{ span: 16 }} wrapperCol={{ span: 7 }} colon={false}>
                    {getFieldDecorator("11", {
                        initialValue: "",
                        rules:[{ pattern: /^[0-9]+(\.[0-9]{1,4})?$/, message: "格式错误" }]
                    })(
                        <Input placeholder="请输入" />
                    )}
                    <div className="formText" style={{ width: "200px" }} >元</div>
                </FormItem>
            </Col>
            <Col span={1}>
                <span style={{ display: 'inline-block', width: '100%', lineHeight: '32px', textAlign: 'center' }}>——</span>
            </Col>
            <Col span={3} >
                <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 14 }} colon={false}>
                    {getFieldDecorator("22", {
                        initialValue: "",
                        rules:[{ pattern: /^[0-9]+(\.[0-9]{1,4})?$/, message: "格式错误" }]
                    })(
                        <Input placeholder="请输入" />
                    )}
                    <div className="formText" style={{ width: "200px" }} >元</div>
                </FormItem>
            </Col>
            <Col span={6}>
                <FormItem label={<span style={{ width: "100%" }}>协议代扣单笔</span>} labelCol={{ span: 9 }} wrapperCol={{ span: 9 }} colon={false}>
                    {getFieldDecorator("33", {
                        initialValue: "",
                    })(
                        <Input placeholder="请输入" />
                    )}
                    {/* <div className="formIcon" >元</div> */}
                    <div className="formText" style={{ width: "200px" }} >元/笔</div>
                </FormItem>
            </Col>
            <Col span={2} style={{lineHeight:"32px"}}>
                <Button type="danger" onClick={this.delete.bind(this)}>删除</Button>
            </Col>
        </Row>
    }
}
export default Form.create()(FormInfo);