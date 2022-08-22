import React, { Component } from 'react';
import { Form, Select, Input,Row,Col } from 'antd';
// import {accMul} from '../../../../../../../ajax/tool.js';
const FormItem = Form.Item;
const Option = Select.Option;
class Basic extends Component {
    constructor(props) {
        super(props);
        props.onRef(this);
        this.state = {
            support: "true",
            id:""
        }
    }
    componentDidMount(){
        if(this.props.configNo){
            this.edit()
        }
    }
    edit(){
        var data=this.props.edit_data;console.log(data)
        this.setState({
            id:data.id
        })
        setTimeout(function(){
            if(JSON.stringify(data)!=="{}"){
                this.setState({
                    support:"true",
                })
                    for(var i in data){
                        if(i==="periodCount"){
                            if(data[i]){
                                this.props.form.setFieldsValue({[i]:data[i]});
                            }
                        }else {
                            if(data[i]){
                                if(this.props.calRateType==="APR"){
                                    if(this.props.rate&&i==="aprGeneralRate"){
                                        var val=data[i];
                                        val=val.split("-");
                                        this.props.form.setFieldsValue({generalRateMin:val[0],generalRateMax:val[1]});
                                    }else{
                                        this.props.form.setFieldsValue({[i]:data[i]});
                                    }
                                }else{
                                    if(this.props.rate&&i==="generalRate"){
                                        var vals=data[i];
                                        vals=vals.split("-");
                                        this.props.form.setFieldsValue({generalRateMin:vals[0],generalRateMax:vals[1]});
                                    }else{
                                        this.props.form.setFieldsValue({[i]:data[i]});
                                    }
                                }
                                
                            }
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
        const formInfoSmall={
            wrapperCol: { span: 24 },
            colon: false,
        }
        var calRateType=this.props.calRateType;
        return (
            <tr>
                <td>
                    <FormItem label="" {...ModalformInfo}>
                        {getFieldDecorator('periodCount', {
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
                <td style={{width:"30%"}}>
                    {this.state.support === "true" ? (!this.props.rate?<FormItem label="" {...ModalformInfo}>
                        {getFieldDecorator(calRateType==="APR"?"aprGeneralRate":'generalRate', {
                            rules: [{ required: true, message: '请输入' },{ pattern: /^([1-9]\d?(\.\d{1,5})?|0\.\d{1,5}|100)$/, message: "格式错误" }]
                        })(
                            <Input placeholder="请输入" />
                        )}
                         <div className="formIcon" >%</div>

                    </FormItem> :<Row>
                        <Col span={10}>
                            <FormItem className="text_left" label="" {...formInfoSmall} >
                                {getFieldDecorator('generalRateMin', {
                                    rules: [{ pattern: /^([1-9]\d?(\.\d{1,5})?|0\.\d{1,5}|100)$/, message: "格式错误" }, { required: true, message: "请输入" }]
                                })(
                                    <Input placeholder="请输入" />
                                )}

                            </FormItem>
                        </Col>
                        <Col span={1} style={{ lineHeight: "32px" }}>——</Col>
                        <Col span={10} >
                            <FormItem className="" label="" {...formInfoSmall} >
                                {getFieldDecorator('generalRateMax', {
                                    rules: [{ pattern: /^([1-9]\d?(\.\d{1,5})?|0\.\d{1,5}|100)$/, message: "格式错误" }, { required: true, message: "请输入" }]
                                })(
                                    <Input placeholder="请输入" />
                                )}

                                <div className="formText" >%</div>
                            </FormItem>
                        </Col>
                    </Row>): "——"}
                </td>
                <td>
                    {this.state.support === "true" ? <FormItem label="" {...ModalformInfo}>
                        {getFieldDecorator(calRateType==="APR"?"aprInterestRate":'interestRate', {
                            rules: [{ required: true, message: '请输入' },{ pattern: /^([1-9]\d?(\.\d{1,5})?|0\.\d{1,5}|100)$/, message: "格式错误" }]
                        })(
                            <Input placeholder="请输入" />
                        )}
                         <div className="formIcon" >%</div>

                    </FormItem> : "——"}
                    {/* {this.state.support === "true" ? <FormItem label="" {...ModalformInfo}>
                        {getFieldDecorator('insurCompanyId', {
                            rules: [{ required: true, message: '请输入' }]
                        })(
                            <Input />
                        )}
                        <div className="formIcon" >%</div>

                    </FormItem> : "——"} */}
                </td>
                {this.props.serve==="FIX"?<td>
                    {this.state.support === "true" ? <FormItem label="" {...ModalformInfo}>
                        {getFieldDecorator(calRateType==="APR"?"aprFeeRate":'feeRate', {
                            rules: [{ required: true, message: '请输入' },{ pattern: /^([1-9]\d?(\.\d{1,5})?|0\.\d{1,5}|100)$/, message: "格式错误" }]
                        })(
                            <Input placeholder="请输入" />
                        )}
                         <div className="formIcon" >%</div>
                         <div className="formText">*借款金额/期</div>

                    </FormItem> : "——"}
                </td>:null}
            </tr>
        )
    }
}
export default Form.create()(Basic);
