import React, { Component } from 'react';
import { Form, Radio ,Select} from 'antd';
// import Dynamic from "../addTemplate/add";
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;
class Business extends Component {
    constructor(props) {
        super(props);
        props.onref(this);
        this.state = {
            collection:""
        }
        this.arr=[];
    }
    account(e){
        this.account_child=e;
    }
    addAccount(){
        this.account_child.add()
    }
    change(e){
        this.setState({
            collection:e.target.value
        })
    }
    get_val(){
        var value=false;
        this.props.form.validateFieldsAndScroll((err,val)=>{
            if(!err){
                val.isFixedRate=!val.isFixedRate
                value=val
            }
        })
        return value
    }
    //服务费
    serviceFeeCollectType_change(e){
        this.props.service(e)
    }
    //综合费率
    rate_change(e){
        this.props.rate(e.target.value)
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formInfo = {
            labelCol: { span: 5 },
            wrapperCol: { span: 6 },
            colon: false
        };
        var type={FIX:"借款金额百分比/期",GENERAL_SUB_INTEREST:"综合费率-利息费率",NEVER:"不收取"};
        return (<div className="sh_add_card">
            <div className="sh_inner_box">
                <span className="sh_add_title">业务信息</span>
                {this.props.cashloan?<FormItem label="是否允许自选借款金额" {...formInfo} >
                    {getFieldDecorator('allowInputLoanAmount', {
                        initialValue: "",
                        rules: [{ required: true, message: '请选择' }]
                    })(
                        <RadioGroup>
                            <Radio value>是</Radio>
                            <Radio value={false}>否</Radio>
                        </RadioGroup>
                    )}
                </FormItem>:
                <FormItem label="综合费率是否浮动" {...formInfo} >
                    {getFieldDecorator('isFixedRate', {
                        initialValue: "",
                        rules: [{ required: true, message: '请选择' }]
                    })(
                        <RadioGroup onChange={this.rate_change.bind(this)}>
                            <Radio value>是</Radio>
                            <Radio value={false}>否</Radio>
                        </RadioGroup>
                    )}
                </FormItem>}
                {this.props.cashloan?<FormItem label="小贷服务费收取方式" {...formInfo}>
                    {getFieldDecorator('feeRateCalMode', {
                    })(
                        <div>{type[this.props.service]}</div>
                    )}
                </FormItem>:<FormItem label="小贷服务费收取方式" {...formInfo}>
                    {getFieldDecorator('feeRateCalMode', {
                        rules: [{ required: true, message: "请选择收取方式" }]
                    })(
                        <Select placeholder="请选择收取方式" style={{ width: "100%" }} onChange={this.serviceFeeCollectType_change.bind(this)}>
                            <Option value="FIX">借款金额百分比/期</Option>
                            <Option value="GENERAL_SUB_INTEREST">综合费率-利息费率</Option>
                            <Option value="NEVER">不收取</Option>
                        </Select>
                    )}
                </FormItem>}
                
                
                {/* <FormItem label="是否代偿" {...formInfo} >
                    {getFieldDecorator('creditValidity2', {
                        initialValue: "",
                    })(
                        <RadioGroup>
                            <Radio value>是</Radio>
                            <Radio value={false}>否</Radio>
                        </RadioGroup>
                    )}
                </FormItem> */}
                {/* <FormItem label="是否回购" {...formInfo} >
                    {getFieldDecorator('creditValidity3', {
                        initialValue: "",
                    })(
                        <RadioGroup>
                            <Radio value>是</Radio>
                            <Radio value={false}>否</Radio>
                        </RadioGroup>
                    )}
                </FormItem> */}
                {/* <FormItem label="是否代收" {...formInfo} >
                    {getFieldDecorator('creditValidity4', {
                        initialValue: "",
                    })(
                        <RadioGroup onChange={this.change.bind(this)}>
                            <Radio value>是</Radio>
                            <Radio value={false}>否</Radio>
                        </RadioGroup>
                    )}
                    {this.state.collection?<Button type="primary" onClick={this.addAccount.bind(this)} style={{ marginLeft: "20px" }} icon="plus" size="small">新增账户</Button>:null}
                </FormItem> */}
                {/* {this.state.collection?<Dynamic onRef={this.account.bind(this)} />:null} */}
            </div>
        </div>)
    }

}
export default Form.create()(Business)