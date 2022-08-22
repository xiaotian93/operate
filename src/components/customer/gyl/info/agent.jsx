import React , { Component } from 'react';
import { Row , Col , Form , Input ,Upload} from 'antd';
import {merchant_img_upload,gyl_img_get} from '../../../../ajax/api';
import {host_gyl} from '../../../../ajax/config';
import {upload_more} from '../../../../ajax/tool';
const FormItem = Form.Item;
class Ygd extends Component {
    constructor(props){
        super(props);
        props.onRef(this);
        this.state = {
            legalPersonIdCardStorageListStr:[]
        }
    }
    licenseupload(e){
        upload_more(e,'agentIdCardStorageNoList','agentIdCardStorageList',this)
    }
    handlePreview(e){
        var urls=e.response?e.response.data.storageNo:e.storageNo;
        window.open(host_gyl+gyl_img_get+"?storageNo="+urls);
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout={
            labelCol: { span: 7 },
            wrapperCol: { span: 10 },
        };
        const license={
            action:host_gyl+merchant_img_upload,
            // accept:'image/*',
            // listType:"picture-card",
            className:"upload-list-inline imgChange",
            fileList:this.state.agentIdCardStorageList,
            onChange:this.licenseupload.bind(this),
            withCredentials:true,
            data:{usage:'AGENT_ID_CARD',companyId:this.props.companyId},
            name:"file",
            multiple:true,
            onPreview:this.handlePreview.bind(this)
        };
        return (
            <div className="card">
                <Form>
                <Row>
                        <Col span={24} className="card-title">
                            <div>联系人信息</div>
                        </Col>
                    </Row>
                    <Row className="form-nomal">
                        <Row>
                            <Col span={24}>
                                <FormItem {...formItemLayout} label="联系人姓名">
                                    {getFieldDecorator('agentName', {
                                        rules: [
                                            { required: true, message: '请输入联系人姓名' },
                                            { pattern :/^[\u4e00-\u9fa5A-Za-z ]{1,10}$/ , message: '格式错误'}
                                        ],
                                    })(
                                        <Input placeholder="请输入联系人姓名" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem {...formItemLayout} label="联系人身份证号">
                                    {getFieldDecorator('agentIdCard', {
                                        rules: [
                                            { required: true, message: '请输入联系人身份证号' },
                                            { pattern :/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/ , message: '格式错误'}
                                        ],
                                        //initialValue:""
                                    })(
                                        <Input placeholder="请输入联系人身份证号" />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <FormItem {...formItemLayout} label="联系人手机号">
                                    {getFieldDecorator('agentPhone', {
                                        rules: [
                                            { required: true, message: '请输入联系人手机号' },
                                            { pattern :/((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/ , message: '格式错误'}
                                        ],
                                        //initialValue:""
                                    })(
                                        <Input placeholder="请输入联系人手机号" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem {...formItemLayout} label="联系人邮箱">
                                    {getFieldDecorator('agentEmail', {
                                        rules: [
                                            { required: true, message: '请输入联系人邮箱' },
                                        ],
                                        initialValue:""
                                    })(
                                        <Input placeholder="请输入联系人邮箱" />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <FormItem {...formItemLayout} label="联系人身份证影像">
                                    {getFieldDecorator('agentIdCardStorageNoList', {
                                        rules: [
                                            { required: true, message: '请上传联系人身份证影像' },
                                        ],
                                        initialValue:""
                                    })(
                                        <div />

                                    )}
                                    <Upload {...license}>
                                        {
                                            <div style={{color:"#1B84FF",cursor:"pointer"}}>上传附件</div>
                                        }
                                    </Upload>
                                </FormItem>
                            </Col>
                        </Row>
                    </Row>
                </Form>
            </div>
        )
    }
}
export default Form.create()(Ygd);