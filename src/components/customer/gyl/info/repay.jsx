import React , { Component } from 'react';
import { Row , Col , Form , Input } from 'antd';
const FormItem = Form.Item;
class Ygd extends Component {
    constructor(props){
        super(props);
        props.onRef(this);
        this.state = {
            legalPersonIdCardStorageNoListStr:[]
        }
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout={
            labelCol: { span: 7 },
            wrapperCol: { span: 10 },
        };
        return (
            <div className="card">
                <Form>
                    <Row>
                        <Col span={24} className="card-title">
                            <div>还款账户信息</div>
                        </Col>
                    </Row>
                    <Row className="form-nomal">
                        <Row>
                            <Col span={24}>
                                <FormItem {...formItemLayout} label="还款账户名">
                                    {getFieldDecorator('repayAccountName', {
                                        rules: [
                                            { required: true, message: '请输入还款账户名' }],
                                        //initialValue:""
                                    })(
                                        <Input placeholder="请输入还款账户名" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem {...formItemLayout} label="还款账号">
                                    {getFieldDecorator('repayBankCard', {
                                        rules: [
                                            { required: true, message: '请输入还款账号' }],
                                        //initialValue:""
                                    })(
                                        <Input placeholder="请输入还款账号" />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Row>
                </Form>
            </div>
        )
    }
}
export default Form.create()(Ygd);