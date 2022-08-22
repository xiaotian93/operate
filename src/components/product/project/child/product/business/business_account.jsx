import React, { Component } from 'react';
import { Form ,Input,Button} from 'antd';
const FormItem = Form.Item;
class Account extends Component {
    constructor(props) {
        super(props);
        props.onRef(this);
        this.arr=[];
    }
    delete(){
        this.props.del();
    }
    sub(){
        var value=[];
        this.props.form.validateFieldsAndScroll((err,val)=>{
            if(!err){
                value.push(val)
            }
        })
        return value;
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formInfo = {
            labelCol: { span: 5 },
            wrapperCol: { span: 6 },
            colon: false
        };
        const num=Number(this.props.num)+1;
        return (<div>
                <FormItem label={"线下打款账户名"+num} {...formInfo} >
                    {getFieldDecorator('creditValidity', {
                        initialValue: "",
                        rules: [{ required: true, message: "请输入" }, { pattern: /^([1-9]\d{0,3}|10000)$/, message: "格式错误" }]
                    })(
                        <Input placeholder="请输入" />
                    )}
                </FormItem>
                <FormItem label={"线下打款账户号"+num} {...formInfo} >
                    {getFieldDecorator('creditValidity12', {
                        initialValue: "",
                        rules: [{ required: true, message: "请输入" }, { pattern: /^([1-9]\d{0,3}|10000)$/, message: "格式错误" }]
                    })(
                        <Input placeholder="请输入" />
                    )}
                    <Button type="danger" style={{position:"absolute",left:"105%"}} onClick={this.delete.bind(this)}>删除</Button>
                </FormItem>
        </div>)
    }

}
export default Form.create()(Account)