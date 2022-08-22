import React, { Component } from 'react';
import { Row , Col , Form , Input , Select , Upload , Icon } from 'antd';
// import moment from 'moment'

import { axios_sh , upload_image } from '../../../ajax/request'
import { get_all_banks , gtask_img_url } from '../../../ajax/api';
import { host_cxfq } from '../../../ajax/config';

const FormItem = Form.Item;
const Option = Select.Option;

class Clearing extends Component{
    constructor(props) {
        super(props);
        this.state = {
            upload_icon:true,
            settleAccountName:"",
            visible:true
        };
        props['data-bind'](props['data-key'],this);
    }
   
    componentDidMount(){
        this.get_banks();
        this.props.form.setFieldsValue({khhmc:"label"});
    }
    form_data_set(obj){
        let form_data = this.props.form.getFieldsValue();
        let form_info = {};
        for(let f in form_data){
            form_info[f] = obj[f];
        }
        this.props.form.setFieldsValue(form_info);
        this.props.form.setFieldsValue({khhmc:"label"});
        let storageNos = JSON.parse(obj.settleBankLic);
        this.props.form.setFieldsValue({settleBankLic:storageNos});
        let imgs = [];
        for(let s in storageNos){
            imgs.push({
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
            settleAccountName:obj.settleAccountName
        })
    }
    upload_image_back(key,res){
        this.props["data-upload"](this,key,res);
    }
    // 获取所有银行
    get_banks(){
        axios_sh.get(get_all_banks).then(data=>{
            let res = data.data;
            let banks = [];
            for(let r in res){
                banks.push(<Option key={r} value={res[r].name}>{res[r].name}</Option>)
            }
            this.setState({
                banks:banks
            })
        })
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
        let upload_props = upload_image("settleBankLic",this.upload_image_back.bind(this));
        return(
            <Row className="card">
                <Row>
                    <Col span={24} className="card-title">
                        <div>结算账户信息</div>
                        <div onClick={this.fold_form.bind(this)}>
                            <Icon style={{display:display}} type="down" />
                            <Icon style={{display:display_up}} type="up" />
                        </div>
                    </Col>
                </Row>
                <Form style={{display:display}}>
                <Row className="form-nomal">
                <Col span={24}>
                        <FormItem {...formItemLayout} label="结算账户名" >
                            {getFieldDecorator('settleAccountName',{
                                rules:[{required:true,message:'请输入结算账户名'},{pattern:/^[\u4e00-\u9fa5]{1,50}$/,message:"结算账户名格式错误"}]
                            })(
                                <div>{this.state.settleAccountName}</div>
                                // <Input placeholder="请输入结算账户名" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={24}>
                        <FormItem {...formItemLayout} label="结算账号" >
                            {getFieldDecorator('settleBankCard',{
                                rules:[{required:true,message:'请输入结算账号'},{pattern:/^\d{1,30}$/,message:"结算账号格式错误"}]
                            })(
                                <Input maxLength={"30"} placeholder="请输入结算账号" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={label_ratio}>
                        <FormItem {...formItemLayout_label} label="开户行名称">
                            {getFieldDecorator('khhmc',{
                                rules:[{required:true }]
                            })(<span />)}
                        </FormItem>
                    </Col>
                    <Col span={item_ratio} style={{marginRight:"10px"}}>
                        <FormItem {...formItemLayout_item}>
                            {getFieldDecorator('settleBankName', {
                                rules: [
                                    { required: true, message: '请选择银行' },
                                ],
                            })(
                                <Select placeholder="请选择银行">
                                    {this.state.banks}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={item_ratio}>
                        <FormItem {...formItemLayout_item} >
                            {getFieldDecorator('settleSubBankName',{
                                rules:[{required:true,message:'请输入开户支行名称'},{pattern:/^[\u4e00-\u9fa5]{1,25}$/,message:"开户支行名称格式错误"}]
                            })(
                                <Input maxLength={"25"} placeholder="请输入开户支行名称" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={24}>
                        <FormItem {...formItemLayout_upload} label="开户许可证影像" extra="请上传清晰的开户许可证影像。支持jpg、jepg、png格式，大小不超过10M。">
                            {getFieldDecorator('settleBankLic',{
                                // rules:[{required:true,message:'请上传开户许可证影像'}]
                            })(
                                <div />
                            )}
                            <Upload fileList={this.state.fileList} {...upload_props}>
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

export default Form.create()(Clearing);
