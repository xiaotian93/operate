import React, { Component } from 'react';
import { Row , Col , Form , Input , Upload , Icon } from 'antd';
// import moment from 'moment'

import { upload_image } from '../../../ajax/request'
import { gtask_img_url } from '../../../ajax/api';
import { host_cxfq } from '../../../ajax/config';

const FormItem = Form.Item;

class Legal extends Component{
    constructor(props) {
        super(props);
        this.state = {
            upload_icon:true,
            visible:true
        };
        props['data-bind'](props['data-key'],this);
    }
    componentWillMount(){
        
    }
    componentDidMount(){

    }
    form_data_set(obj){
        let form_data = this.props.form.getFieldsValue();
        let form_info = {};
        for(let f in form_data){
            form_info[f] = obj[f];
        }
        this.props.form.setFieldsValue(form_info);
        let storageNos = JSON.parse(obj.frIdCardStorageNo);
        this.props.form.setFieldsValue({frIdCardStorageNo:storageNos});
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
            fileList:imgs
        })
    }
    upload_image_back(key,res){
        this.props["data-upload"](this,key,res);
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
        let display = this.state.visible?"block":"none";
        let display_up = this.state.visible?"none":"block";
        let upload_props = upload_image("frIdCardStorageNo",this.upload_image_back.bind(this));
        return(
            <Row className="card">
                <Row>
                    <Col span={24} className="card-title">
                        <div>法人信息</div>
                        <div onClick={this.fold_form.bind(this)}>
                            <Icon style={{display:display}} type="down" />
                            <Icon style={{display:display_up}} type="up" />
                        </div>
                    </Col>
                </Row>
                <Form style={{display:display}}>
                <Row className="form-nomal">
                    <Col span={24}>
                        <FormItem {...formItemLayout} label="法人姓名" >
                            {getFieldDecorator('frName',{
                                rules:[{required:true,message:'请输入法人姓名'},{pattern:/^[\u4e00-\u9fa5]{1,15}$/,message:"法人姓名格式错误"}]
                            })(
                                <Input placeholder="请输入法人姓名" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={24}>
                        <FormItem {...formItemLayout} label="法人身份证号" >
                            {getFieldDecorator('frIdCard',{
                                rules:[{required:true,message:"请输入法人身份证号"},{pattern:/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,message:"法人身份证号格式错误"}]
                            })(
                                <Input placeholder="请输入法人身份证号" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={24}>
                        <FormItem {...formItemLayout} label="法人手机号" >
                            {getFieldDecorator('frPhone',{
                                rules:[{required:true,message:"请输入法人手机号"},{pattern:/^\d{11}$/,message:"法人手机号格式错误"}]
                            })(
                                <Input maxLength={"11"} placeholder="请输入法人手机号" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={24}>
                        <FormItem {...formItemLayout_upload} label="法人身份证影像" extra="请上传清晰的法人身份证影像。支持jpg、jepg、png格式，大小不超过10M。">
                            {getFieldDecorator('frIdCardStorageNo',{
                                rules:[{required:true,message:'请上传法人身份证影像'}]
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

export default Form.create()(Legal);