import React, { Component } from 'react';
import { Button, DatePicker, Select, Input, Modal, Form, message } from 'antd';
import { axios_ygd,axios_merchant,axios_ygd_json} from '../../../ajax/request';
import {customer_jyd_dropdown_scale,customer_jyd_dropdown_industry_type,customer_jyd_dropdown_industry_involved,merchant_list,customer_jyd_account_create,customer_jyd_company_create,merchant_detail_uesr} from "../../../ajax/api";
const FormItem = Form.Item;
const Option = Select.Option;
class ModalJyd extends Component {
    constructor(props) {
        super(props);
        props.onRef(this);
        this.state = {
            scale: [],
            industry_type:[],
            industry_involved:[],
            visible: false,
            merchant:[],
            merchantInfo:{}
        }
    }
    componentWillMount(){
        this.get_dropdown();
    }
    get_dropdown(){
        let param="?allLabelFlag=false";
        axios_ygd.get(customer_jyd_dropdown_scale+param).then(e=>{
            if(!e.code){
                this.setState({scale:e.data.list})
            }
        })
        axios_ygd.get(customer_jyd_dropdown_industry_type+param).then(e=>{
            if(!e.code){
                this.setState({industry_type:e.data.list})
            }
        })
        axios_ygd.get(customer_jyd_dropdown_industry_involved+param).then(e=>{
            if(!e.code){
                this.setState({industry_involved:e.data.list})
            }
        })
        axios_merchant.post(merchant_list,{page:1,size:1000}).then(e=>{
            if(!e.code){
                this.setState({merchant:e.data.list})
            }
        })
    }
    cancel(){
        this.setState({visible:false})
    }
    show(){
        this.setState({visible:true})
    }
    save(){
        this.props.form.validateFieldsAndScroll((err,val)=>{
            if(!err){
                let login={
                    login:val.login,
                    password:val.password,
                    bmdOpenMerchantNo:val.bmdOpenMerchantNo
                }
                delete val.login;
                delete val.password;
                delete val.bmdOpenMerchantNo;
                const merchant=Object.assign(this.state.merchantInfo,val)
                console.log(merchant);
                // return;
                Promise.all([axios_ygd_json.post(customer_jyd_account_create,login),axios_ygd_json.post(customer_jyd_company_create,merchant)]).then(val=>{
                    message.success("创建成功");
                    this.cancel();
                    this.props.list();
                })
            }
        })
    }
    //商户选择
    changeMerchant(e){
        const merchant=this.state.merchant.filter(item=>item.merchantNo===e);
        const merchantInfo={
            name:"name",
            creditCode:"licenseNo",
            "legalManName": "legalName",
            "legalPersonPhone": "legalPhone",
            "settleAccountName": "name",
            "settleBankCard": "bankNo",
            "settleBankName": "bankName",
            "settleSubBankName": "bankSubName",
            "addressDetail":"address",
            "agentName":"contactsName",
            "agentIdCard":"contactsIdNo",
            "agentPhone":"contactsPhone",
            "agentEmail":"contactsMail"
            
        }
        const merchantEdit={};
        axios_merchant.post(merchant_detail_uesr,{accountId:merchant[0].accountId}).then(e=>{
            if(!e.code){
                for(var i in merchantInfo){
                    merchantEdit[i]=e.data[merchantInfo[i]];
                }
            }
        })
        this.setState({merchantInfo:merchantEdit});

    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 10 },
        };
        const modal={
            title:"导入客户",
            visible:this.state.visible,
            footer:<div><Button size="small" onClick={this.cancel.bind(this)}>取消</Button><Button size="small" type="primary" onClick={this.save.bind(this)}>确认导入</Button></div>,
            closable:false
        }
        return (
            <div><Modal {...modal}>
            <Form>
                <div style={{marginBottom:"10px"}}>第一步：为商户开通进件系统账号</div>
                <FormItem {...formItemLayout} label="进件系统账号">
                    {getFieldDecorator('login', {
                        rules: [
                            { message: '进件系统账号' },
                        ],
                        initialValue: ""
                    })(
                        <Input placeholder="同商户的开放平台账号" />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="进件系统密码">
                    {getFieldDecorator('password', {
                        rules: [
                            { message: '进件系统密码' },
                        ],
                        initialValue: ""
                    })(
                        <Input placeholder="同商户的开放平台密码" />
                    )}
                </FormItem>
                <div style={{marginBottom:"10px"}}>第二步：从开放平台已认证商户中选择转为客户，并补充客户信息</div>
                <FormItem {...formItemLayout} label="选择已认证商户转为客户">
                    {getFieldDecorator('bmdOpenMerchantNo', {
                        rules: [
                            { message: '请选择' }],
                        //initialValue:""
                    })(
                        <Select placeholder="请选择" onChange={this.changeMerchant.bind(this)}>
                            {this.state.merchant.map((i,k)=>{
                                return <Option value={i.merchantNo} key={k}>{i.name}</Option>
                            })}
                        </Select>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="营业执照截止时间">
                    {getFieldDecorator('expireDate', {
                        // rules: [
                            // { message: '请选择' }],
                        //initialValue:""
                    })(
                        <DatePicker placeholder="请选择截止日期" showToday={false} />
                    )
                    }
                    <div style={{lineHeight:"20px",opacity:0.5}}>若永久有效，填写2099-12-31</div>
                </FormItem>
                <FormItem {...formItemLayout} label="还款账户名称">
                    {getFieldDecorator('repayAccountName', {
                        rules: [
                            { message: '请输入' },
                        ],
                        initialValue: ""
                    })(
                        <Input placeholder="请输入" />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="还款银行卡号">
                    {getFieldDecorator('repayBankCard', {
                        rules: [
                            { message: '请输入' },
                        ],
                        initialValue: ""
                    })(
                        <Input placeholder="请输入" />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="企业规模">
                    {getFieldDecorator('scale', {
                        rules: [
                            { message: '请选择' }],
                        //initialValue:""
                    })(
                        <Select placeholder="请选择">
                            {this.state.scale.map((i,k)=>{
                                return <Option value={i.val} key={k}>{i.name}</Option>
                            })}
                        </Select>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="产业类型">
                    {getFieldDecorator('industryType', {
                        rules: [
                            { message: '请选择' }],
                        //initialValue:""
                    })(
                        <Select placeholder="请选择">
                            {this.state.industry_type.map((i,k)=>{
                                return <Option value={i.val} key={k}>{i.name}</Option>
                            })}
                        </Select>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="所属行业">
                    {getFieldDecorator('industryInvolved', {
                        rules: [
                            { message: '请选择' }],
                        //initialValue:""
                    })(
                        <Select placeholder="请选择">
                            {this.state.industry_involved.map((i,k)=>{
                                return <Option value={i.val} key={k}>{i.name}</Option>
                            })}
                        </Select>
                    )}
                </FormItem>
            </Form>
            </Modal>
            </div>
        )
    }
}
export default Form.create()(ModalJyd)