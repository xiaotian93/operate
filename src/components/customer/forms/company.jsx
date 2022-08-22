import React, { Component } from 'react';
import { Row , Col , Form , Input , Select , DatePicker , Upload , Icon } from 'antd';
import moment from 'moment'

import { upload_image } from '../../../ajax/request'
import { gtask_img_url } from '../../../ajax/api';
import { host_cxfq } from '../../../ajax/config';
import { enterprise_scale , industry_type , trade_type } from '../../../ajax/config_sh';
import location_data from '../../../utils/province_city';

const FormItem = Form.Item;
const Option = Select.Option;

class Company extends Component{
    constructor(props) {
        super(props);
        this.state = {
            visible:true,
            upload_icon:true,
            province:[],
            city:[],
            county:[]
        };
        props['data-bind'](props['data-key'],this);
    }
    componentWillMount(){
        let random = parseInt(Math.random()*10000,10);
        this.qyNo = "QY"+moment().format("YYMMDD")+random;
    }
    componentDidMount(){
        this.set_select();
        this.set_province();
        this.props.form.setFieldsValue({location:"地址"});
        this.props.form.setFieldsValue({qyNo:this.qyNo});
        this.setState({
            qyNo:this.qyNo
        })
    }
    // 设置表单
    form_data_set(obj){
        let form_data = this.props.form.getFieldsValue();
        let form_info = {};
        this.set_city(obj.province);
        this.set_county(obj.city,obj.province);
        for(let f in form_data){
            if(f==="expireDate"){
                form_info[f] = moment(obj[f]||undefined);
                continue;
            }
            form_info[f] = obj[f];
        }
        this.props.form.setFieldsValue(form_info);
        this.props.form.setFieldsValue({qyNo:obj.qyNo||this.qyNo});
        this.props.form.setFieldsValue({location:"地址"});
        let storageNos = JSON.parse(obj.license);
        this.props.form.setFieldsValue({license:storageNos});
        let imgs = [];
        for(let s in storageNos){
            imgs.push({
                // key:s+"key",
                url:host_cxfq+gtask_img_url+"?storageNo="+storageNos[s],
                uid: s+"uid",     
                response:{
                    data:{storageNo:storageNos[s]}
                },
                status: 'done' 
            })
        }
        this.setState({
            fileList:imgs,
            qyNo:obj.qyNo||this.qyNo
        })
    }
    // 文件处理
    upload_image_back(key,res){
        this.props["data-upload"](this,key,res);
    }
    // 设置select待选项
    set_select(){
        let scale = [],industry = [],trade = [];
        for(let s in enterprise_scale){
            scale.push(<Option key={s} value={enterprise_scale[s].name}>{enterprise_scale[s].name}</Option>)
        }
        for(let s in industry_type){
            industry.push(<Option key={s} value={industry_type[s].name}>{industry_type[s].name}</Option>)
        }
        for(let s in trade_type){
            trade.push(<Option key={s} value={trade_type[s].name}>{trade_type[s].name}</Option>)
        }
        this.setState({
            enterprise_scale:scale,
            industry_type:industry,
            trade_type:trade
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
        const formItemLayout_upload = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: label_ratio },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
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
        let upload_props = upload_image("license",this.upload_image_back.bind(this));
        return(
            <Row className="card">
                <Row>
                    <Col span={24} className="card-title">
                        <div>企业信息</div>
                        <div onClick={this.fold_form.bind(this)}>
                            <Icon style={{display:display}} type="down" />
                            <Icon style={{display:display_up}} type="up" />
                        </div>
                    </Col>
                </Row>
                <Form style={{display:display}}>
                <Row className="form-nomal">
                    <Col span={24}>
                        <FormItem {...formItemLayout} className="des" label="企业ID" >
                            {getFieldDecorator('qyNo')(
                                <div>{this.state.qyNo}</div>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={24}>
                        <FormItem {...formItemLayout} label="企业规模">
                            {getFieldDecorator('scale', {
                                rules: [
                                    { required: true, message: '请选择企业规模' },
                                ],
                            })(
                                <Select placeholder="请选择企业规模">
                                    {this.state.enterprise_scale}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={24}>
                        <FormItem {...formItemLayout} label="产业类型">
                            {getFieldDecorator('type', {
                                rules: [
                                    { required: true, message: '请选择产业类型' },
                                ],
                            })(
                                <Select placeholder="请选择产业类型">
                                    {this.state.industry_type}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={24}>
                        <FormItem {...formItemLayout} label="企业名称" >
                            {getFieldDecorator('name',{
                                rules:[{required:true,message:'请输入企业名称'},{pattern:/^[\u4e00-\u9fa5（）()]{1,50}$/,message:"企业名称格式错误"}]
                            })(
                                <Input maxLength={"50"} onChange={this.change_name.bind(this)} placeholder="请输入企业名称" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={24}>
                        <FormItem {...formItemLayout} label="企业简称" >
                            {getFieldDecorator('shortName',{
                                rules:[{pattern:/^[\u4e00-\u9fa5]{0,15}$/,message:"企业简称格式错误"}]
                            })(
                                <Input maxLength={"15"} placeholder="请输入企业简称" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={24}>
                        <FormItem {...formItemLayout} label="企业统一信用代码" >
                            {getFieldDecorator('creditCode',{
                                rules:[{required:true,message:"请输入企业统一信用代码"},{pattern:/^[\w]{18}$/,message:"企业统一信用代码格式错误"}]
                            })(
                                <Input placeholder="请输入企业统一信用代码" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={24}>
                        <FormItem {...formItemLayout} label="所属行业">
                            {getFieldDecorator('industry', {
                                rules: [
                                    { required: true, message: '请选择所属行业' },
                                ],
                            })(
                                <Select placeholder="请选择所属行业">
                                    {this.state.trade_type}
                                </Select>
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
                    <Col span={item_ratio/2} style={{marginRight:"10px"}}>
                        <FormItem {...formItemLayout_item}>
                            {getFieldDecorator('area', {
                                rules: [
                                    { required: true, message: '区/县' },
                                ],
                            })(
                                <Select placeholder="区/县">
                                    {this.state.county}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={24}>
                        <FormItem {...formItemLayout} label="企业联系方式" >
                            {getFieldDecorator('mobile',{
                                rules:[{required:true,message:'请输入企业联系方式'},{pattern:/^\d{11,12}$/,message:"企业联系方式格式错误"}]
                            })(
                                <Input maxLength={"12"} placeholder="请输入企业联系方式" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={24}>
                        <FormItem {...formItemLayout} label="营业执照截止日期">
                            {getFieldDecorator('expireDate',{
                                rules:[{required:true,message:'请输入营业执照截止日期'}]
                            })(
                                <DatePicker placeholder="请选择截止日期" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={24}>
                        <FormItem {...formItemLayout_upload} label="营业执照影像(加盖公章)" extra="请上传清晰的营业执照影像。支持jpg、jepg、png格式，大小不超过10M。">
                            {getFieldDecorator('license',{
                                rules:[{required:true,message:'请上传营业执照影像'}]
                            })(
                                <div />
                            )}
                            <Upload fileList={this.state.fileList} {...upload_props} >
                                {this.state.upload_icon?<Icon type="plus" />:""}
                            </Upload>
                        </FormItem>
                    </Col>
                </Row>
                </Form>
            </Row>
        )
    }
}

export default Form.create()(Company);
