import React, { Component } from 'react';
import { Form, Select, Input } from 'antd';
import {accMul,accDiv} from '../../../ajax/tool.js';
const FormItem = Form.Item;
const Option = Select.Option;
class Basic extends Component {
    constructor(props) {
        super(props);
        props.onRef(this);
        this.state = {
            support: "true"
        }
    }
    componentDidMount(){
        if(this.props.id){
            this.edit()
        }
    }
    edit(){
        var data=this.props.edit_data;
        setTimeout(function(){
            if(JSON.stringify(data)!=="{}"){
                this.setState({
                    support:"true"
                })
                    for(var i in data){
                        if(i==="serviceFeePercent"||i==="vipPercent"){
                            if(data[i]){
                                this.setState({
                                    [i]:accMul(data[i],100)
                                })
                                this.props.form.setFieldsValue({[i]:accMul(data[i],100)});
                            }
                        }else if(i==="serviceFeePrice"||i==="vipPrice"){
                            if(data[i]){
                                this.setState({
                                    [i]:accDiv(data[i],100)
                                })
                                this.props.form.setFieldsValue({[i]:accDiv(data[i],100)});
                            }
                        }else if(i==="interestRate"){
                            this.props.form.setFieldsValue({[i]:accMul(data[i],100)});
                        }
                    }    
            }else{
                if(!this.props.support){
                    this.setState({
                        support:"false"
                    })
                }
                
            }
        }.bind(this),100)
    }
    get_val(e) {
        this.setState({
            support: e
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const ModalformInfo = {
            wrapperCol: { span: 15 },
            colon: false,
            hideRequiredMark: true
        };
        const serve = {
            "0": ()=>{return "——"},
            "2": ()=>{return <FormItem label="" {...ModalformInfo}>
                {getFieldDecorator('serviceFeePercent', {
                    rules: [{ required: true, message: '请输入' },{ pattern: /^[0-9]+(\.[0-9]{1,5})?$|100$/, message: "格式错误" }],
                })(
                    <Input placeholder="请输入" />
                )}
                <div className="formIcon" >%</div>
                <div className="formText" >*借款金额/期</div>
                </FormItem>},
            "1": ()=>{return <FormItem label="" {...ModalformInfo}>
                {getFieldDecorator('serviceFeePrice', {
                    rules: [{ required: true, message: '请输入' },{ pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "格式错误" }]
                })(
                    <Input placeholder="请输入" />
                )}
                
                <div className="formText">元</div>
            </FormItem>}
        };
        const vip = {
            "0": ()=>{return "——"},
            "2": ()=>{return <FormItem label="" {...ModalformInfo}>
                {getFieldDecorator('vipPercent', {
                    rules: [{ required: true, message: '请输入' },{ pattern: /^[0-9]+(\.[0-9]{1,5})?$|100$/, message: "格式错误" }]
                })(
                    <Input placeholder="请输入" />

                )}
                <div className="formIcon" >%</div>
                <div className="formText" >*借款金额</div>
                </FormItem>},
            "1": ()=>{return <FormItem label="" {...ModalformInfo}>
                {getFieldDecorator('vipPrice', {
                    rules: [{ required: true, message: '请输入' },{ pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "格式错误" }]
                })(
                    <Input placeholder="请输入" />
                )}
                <div className="formText">元</div>
            </FormItem>}
        }
        return (
            <tr>
                <td>
                    <FormItem label="" {...ModalformInfo}>
                        {getFieldDecorator('period', {
                            initialValue:this.props.num
                        })(
                            <div style={{ fontSize: "14px" }}>{this.props.num+"期"}</div>
                        )}
                        {/* <div className="formText" style={{ left: "5%" }}>期</div> */}
                    </FormItem>
                </td>
                <td>

                    <Select placeholder="请选择" style={{ width: "100%" }} dropdownStyle={{ zIndex: 4000 }} onChange={this.get_val.bind(this)} value={this.state.support}>
                        <Option value="true">支持</Option>
                        <Option value="false">不支持</Option>

                    </Select>

                </td>
                <td>
                    {this.state.support === "true" ? <FormItem label="" {...ModalformInfo}>
                        {getFieldDecorator('interestRate', {
                            rules: [{ required: true, message: '请输入' },{ pattern: /^[0-9]+(\.[0-9]{1,5})?$|100$/, message: "格式错误" }]
                        })(
                            <Input placeholder="请输入" />
                        )}
                         <div className="formIcon" >%</div>

                    </FormItem> : "——"}
                </td>
                <td>
                    {this.state.support === "true" ? serve[this.props.serve]() : "——"}
                    {/* {this.state.support === "true" ? <FormItem label="" {...ModalformInfo}>
                        {getFieldDecorator('insurCompanyId', {
                            rules: [{ required: true, message: '请输入' }]
                        })(
                            <Input />
                        )}
                        <div className="formIcon" >%</div>

                    </FormItem> : "——"} */}
                </td>
                <td>
                    {this.state.support === "true" ? vip[this.props.vip]() : "——"}
                </td>
            </tr>
        )
    }
}
export default Form.create()(Basic);