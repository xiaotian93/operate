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
                    message.success("????????????");
                    this.cancel();
                    this.props.list();
                })
            }
        })
    }
    //????????????
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
            title:"????????????",
            visible:this.state.visible,
            footer:<div><Button size="small" onClick={this.cancel.bind(this)}>??????</Button><Button size="small" type="primary" onClick={this.save.bind(this)}>????????????</Button></div>,
            closable:false
        }
        return (
            <div><Modal {...modal}>
            <Form>
                <div style={{marginBottom:"10px"}}>?????????????????????????????????????????????</div>
                <FormItem {...formItemLayout} label="??????????????????">
                    {getFieldDecorator('login', {
                        rules: [
                            { message: '??????????????????' },
                        ],
                        initialValue: ""
                    })(
                        <Input placeholder="??????????????????????????????" />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="??????????????????">
                    {getFieldDecorator('password', {
                        rules: [
                            { message: '??????????????????' },
                        ],
                        initialValue: ""
                    })(
                        <Input placeholder="??????????????????????????????" />
                    )}
                </FormItem>
                <div style={{marginBottom:"10px"}}>???????????????????????????????????????????????????????????????????????????????????????</div>
                <FormItem {...formItemLayout} label="?????????????????????????????????">
                    {getFieldDecorator('bmdOpenMerchantNo', {
                        rules: [
                            { message: '?????????' }],
                        //initialValue:""
                    })(
                        <Select placeholder="?????????" onChange={this.changeMerchant.bind(this)}>
                            {this.state.merchant.map((i,k)=>{
                                return <Option value={i.merchantNo} key={k}>{i.name}</Option>
                            })}
                        </Select>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="????????????????????????">
                    {getFieldDecorator('expireDate', {
                        // rules: [
                            // { message: '?????????' }],
                        //initialValue:""
                    })(
                        <DatePicker placeholder="?????????????????????" showToday={false} />
                    )
                    }
                    <div style={{lineHeight:"20px",opacity:0.5}}>????????????????????????2099-12-31</div>
                </FormItem>
                <FormItem {...formItemLayout} label="??????????????????">
                    {getFieldDecorator('repayAccountName', {
                        rules: [
                            { message: '?????????' },
                        ],
                        initialValue: ""
                    })(
                        <Input placeholder="?????????" />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="??????????????????">
                    {getFieldDecorator('repayBankCard', {
                        rules: [
                            { message: '?????????' },
                        ],
                        initialValue: ""
                    })(
                        <Input placeholder="?????????" />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="????????????">
                    {getFieldDecorator('scale', {
                        rules: [
                            { message: '?????????' }],
                        //initialValue:""
                    })(
                        <Select placeholder="?????????">
                            {this.state.scale.map((i,k)=>{
                                return <Option value={i.val} key={k}>{i.name}</Option>
                            })}
                        </Select>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="????????????">
                    {getFieldDecorator('industryType', {
                        rules: [
                            { message: '?????????' }],
                        //initialValue:""
                    })(
                        <Select placeholder="?????????">
                            {this.state.industry_type.map((i,k)=>{
                                return <Option value={i.val} key={k}>{i.name}</Option>
                            })}
                        </Select>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="????????????">
                    {getFieldDecorator('industryInvolved', {
                        rules: [
                            { message: '?????????' }],
                        //initialValue:""
                    })(
                        <Select placeholder="?????????">
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