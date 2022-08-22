import React, { Component } from 'react';
import { Form ,Input} from 'antd';
const FormItem = Form.Item;
class Business extends Component {
    account(e){
        this.account_child=e;
    }
    addAccount(){
        this.account_child.add()
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formInfo = {
            labelCol: { span: 5 },
            wrapperCol: { span: 6 },
            colon: false
        };
        return (
            <div className="sh_add_card">
                        <div className="sh_inner_box">
                            <div className="sh_add_title">有效期配置</div>
                            <FormItem label="首借额度失效时间" {...formInfo} >
                                {getFieldDecorator('creditValidity', {
                                    initialValue: "",
                                    rules: [{ required: true, message: "请输入" }, { pattern: /^([1-9]\d{0,3}|10000)$/, message: "格式错误" }]
                                })(
                                    <Input placeholder="请输入" />
                                )}
                                <div className="formText" >天</div>
                            </FormItem>
                            <FormItem label="复借&结清后额度失效时间" {...formInfo} >
                                {getFieldDecorator('reCreditValidity', {
                                    initialValue: "",
                                    rules: [{ required: true, message: "请输入" }, { pattern: /^([1-9]\d{0,3}|10000)$/, message: "格式错误" }]
                                })(
                                    <Input placeholder="请输入" />
                                )}
                                <div className="formText" >天</div>
                            </FormItem>
                            <FormItem label="授信被拒封禁时间" {...formInfo} >
                                {getFieldDecorator('resubmitValidity', {
                                    initialValue: "",
                                    rules: [{ required: true, message: "请输入" }, { pattern: /^([1-9]\d{0,3}|10000)$/, message: "格式错误" }]
                                })(
                                    <Input placeholder="请输入" />
                                )}
                                <div className="formText" >天</div>
                            </FormItem>
                            <FormItem label="提现被拒封禁时间" {...formInfo} >
                                {getFieldDecorator('loanResubmitValidity', {
                                    initialValue: "",
                                    rules: [{ required: true, message: "请输入" }, { pattern: /^([1-9]\d{0,3}|10000)$/, message: "格式错误" }]
                                })(
                                    <Input placeholder="请输入" />
                                )}
                                <div className="formText" >天</div>
                            </FormItem>
                        </div>
                    </div>
        )
    }

}
export default Form.create()(Business)