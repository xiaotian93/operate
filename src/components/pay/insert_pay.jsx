import React, { Component } from 'react';
import { Row , Col , Form , Input , Select , Button , Icon } from 'antd';
import moment from 'moment'

import location_data from '../../utils/province_city';
import axios from '../../ajax/request'
import { insert_pay } from '../../ajax/api';
import { page_go , format_date} from '../../ajax/tool';

const FormItem = Form.Item;
const Option = Select.Option;

// 改名字

class Company extends Component{
    constructor(props) {
        super(props);
        this.state = {
            visible:true,
            upload_icon:true,
            label_name:"社会信用统一代码",
            province:[],
            city:[],
            county:[]
        };
    }
    componentWillMount(){
        let random = parseInt(Math.random()*10000,10);
        this.qyNo = "QY"+moment().format("YYMMDD")+random;
    }
    componentDidMount(){
        this.set_province();
        this.props.form.setFieldsValue({location:"地址"});
        // this.props.form.setFieldsValue({qyNo:this.qyNo});
        this.setState({
            qyNo:this.qyNo
        })
    }
    // 提交
    form_data_get(){
        this.props.form.validateFieldsAndScroll((err,data)=>{
            if(err){
                return;
            }
            console.log(data);
            this.form_save(data);
        })
    }

    // 重置
    reset_click(){

    }

    // 请求数据
    form_save(data){
        let rqd = {
            ...data
        }
        let time = new Date();
        rqd.businessId = format_date(time) + parseInt(Math.random()*1000000,10);
        axios.post(insert_pay,rqd).then(data=>{
            page_go("/zf/confirm");
        })
    }

    // 设置省市区
    set_province(){
        let provinces = [];
        for(let p in location_data){
            provinces.push(<Option key={p} value={p}>{p}</Option>);
        }
        this.setState({
            province:provinces
        })
        // this.props.form.setFieldsValue({"province":key});
        // this.set_city(key);
    }
    // 设置城市
    set_city(val){
        let citys = [],citys_data=location_data[val];
        for(let c in citys_data){
            
            citys.push(<Option key={c} value={c}>{c}</Option>)
        }
        this.setState({
            city:citys
        })
        this.props.form.setFieldsValue({"city":undefined});
        // this.set_county(key,val);
    }
    // 设置区县
    set_county(val,pro){
        if(!val){
            return;
        }
        console.log(val,pro)
        let province = pro||this.props.form.getFieldValue("province");
        let countys_data = location_data[province][val];
        let countys = [];
        for(let c in countys_data){
            countys.push(<Option key={c} value={countys_data[c]}>{countys_data[c]}</Option>)
        }
        this.setState({
            county:countys
        })
        this.props.form.setFieldsValue({"area":undefined})
    }
    // 选择账号类型
    accountType_change(val){
        this.setState({
            label_name:val==="1"?"身份证号":"社会信用统一代码"
        })
    }
    // 监听企业名称输入
    change_name(e){
        this.props['change-name'](e.target.value);
    }
    fold_form(){
        this.setState({
            visible:!this.state.visible
        })
    }
    render (){
        const { getFieldDecorator } = this.props.form;
        const label_ratio = 6;          // 名称宽度
        const item_ratio = 8;           // 元素宽度
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: label_ratio },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: item_ratio },
            },
        };
        const formItemLayout_label = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 24 }
            },
            wrapperCol: {
                xs: { span: 0 },
                sm: { span: 0 }
            }
        }
        const formItemLayout_item = {
            labelCol: {
                xs: { span: 0 },
                sm: { span: 0 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 24 }
            }
        }
        let display = this.state.visible?"block":"none";
        let display_up = this.state.visible?"none":"block";
        return(
            <Row className="card">
                <Row>
                    <Col span={24} className="card-title">
                        <div>新增放款</div>
                        <div onClick={this.fold_form.bind(this)}>
                            <Icon style={{display:display}} type="down" />
                            <Icon style={{display:display_up}} type="up" />
                        </div>
                    </Col>
                </Row>
                <Form style={{display:display}}>
                <Row className="form-nomal">
                    <Col span={24}>
                        <FormItem {...formItemLayout} label="业务类型">
                            {getFieldDecorator('businessType', {
                                rules: [
                                    { required: true, message: '请选择业务类型' },
                                ],
                            })(
                                <Select placeholder="请选择业务类型">
                                    <Option value="ygd">员工贷</Option>
                                    <Option value="jyd">经营贷</Option>
                                    <Option value="dsdf">代收代付</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={24}>
                        <FormItem {...formItemLayout} label="银行账号类型">
                            {getFieldDecorator('accountType', {
                                rules: [
                                    { required: true, message: '请选择银行账号类型' },
                                ],
                            })(
                                <Select onChange={this.accountType_change.bind(this)} placeholder="请选择银行账号类型">
                                    <Option value="1">个人</Option>
                                    <Option value="2">企业</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={24}>
                        <FormItem {...formItemLayout} label="银行账户名" >
                            {getFieldDecorator('accountName',{
                                rules:[{required:true,message:'请输入银行账户名'},{pattern:/^[\u4e00-\u9fa5（）()]{1,50}$/,message:"银行账户名格式错误"}]
                            })(
                                <Input maxLength={"50"} placeholder="请输入银行账户名" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={24}>
                        <FormItem {...formItemLayout} label="银行卡号" >
                            {getFieldDecorator('cardNumber',{
                                rules:[{required:true,message:'请输入银行卡号'},{pattern:/^\d{1,30}$/,message:"银行卡号格式错误"}]
                            })(
                                <Input maxLength={"30"} placeholder="请输入银行卡号" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={24}>
                        <FormItem {...formItemLayout} label="银行名称" >
                            {getFieldDecorator('bankName',{
                                rules:[{required:true,message:'请输入银行名称'},{pattern:/^[\u4e00-\u9fa5（）()]{1,50}$/,message:"银行名称格式错误"}]
                            })(
                                <Input maxLength={"50"} placeholder="请输入银行名称" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={24}>
                        <FormItem {...formItemLayout} label="银行全称" >
                            {getFieldDecorator('bankFullName',{
                                rules:[{required:true,message:'请输入银行全称'},{pattern:/^[\u4e00-\u9fa5（）()]{1,50}$/,message:"银行全称格式错误"}]
                            })(
                                <Input maxLength={"50"} placeholder="请输入银行全称" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={24}>
                        <FormItem {...formItemLayout} label={this.state.label_name} >
                            {getFieldDecorator('creditCode',{
                                rules:[{required:true,message:this.state.label_name},{pattern:/^[\w]{10,18}$/,message:this.state.label_name+"格式错误"}]
                            })(
                                <Input placeholder={"请输入"+this.state.label_name} />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={label_ratio}>
                        <FormItem {...formItemLayout_label} label="地址">
                            {getFieldDecorator('location',{
                                rules:[{required:true}]
                            })(
                                <Input placeholder="" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={item_ratio/2} style={{marginRight:"10px"}}>
                        <FormItem {...formItemLayout_item}>
                            {getFieldDecorator('province', {
                                rules: [
                                    { required: true, message: '请选择省份' },
                                ],
                            })(
                                <Select placeholder="省份" onChange={this.set_city.bind(this)}>
                                    {this.state.province}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={item_ratio/2} style={{marginRight:"10px"}}>
                        <FormItem {...formItemLayout_item}>
                            {getFieldDecorator('city', {
                                rules: [
                                    { required: true, message: '请选择城市' },
                                ],
                            })(
                                <Select placeholder="市" onChange={this.set_county.bind(this)}>
                                    {this.state.city}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={24}>
                        <FormItem {...formItemLayout} label="联系方式" >
                            {getFieldDecorator('mobile',{
                                rules:[{required:true,message:'请输入联系方式'},{pattern:/^\d{11,12}$/,message:"联系方式格式错误"}]
                            })(
                                <Input maxLength={"12"} placeholder="请输入联系方式" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={24}>
                        <FormItem {...formItemLayout} label="支付类型">
                            {getFieldDecorator('payChannel', {
                                rules: [
                                    { required: true, message: '请选择支付类型' },
                                ],
                            })(
                                <Select placeholder="请选择支付类型">
                                    <Option value="连连支付">连连支付</Option>
                                    <Option value="宝付支付">宝付支付</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={24}>
                        <FormItem {...formItemLayout} label="金额" >
                            {getFieldDecorator('amount',{
                                rules:[{required:true,message:'请输入金额'}]
                            })(
                                <Input placeholder="请输入金额" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={24}>
                        <FormItem {...formItemLayout} label="付款用途" >
                            {getFieldDecorator('usage',{
                                rules:[{required:true,message:'请输入付款用途'}]
                            })(
                                <Input placeholder="请输入付款用途" />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row className="submit-btns">
                    <Button onClick={this.reset_click.bind(this)}>&emsp;重&emsp;置&emsp;</Button>&emsp;&emsp;
                    <Button loading={this.state.loading} onClick={this.form_data_get.bind(this)} type="primary">&emsp;确&emsp;认&emsp;</Button>
                </Row>
                </Form>
            </Row>
        )
    }
}

export default Form.create()(Company);
