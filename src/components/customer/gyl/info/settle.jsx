import React, { Component } from 'react';
import { Row, Col, Form, Input, Select, Upload } from 'antd';
import { merchant_img_upload, gyl_img_get } from '../../../../ajax/api';
import { host_gyl } from '../../../../ajax/config';
import { upload_more } from '../../../../ajax/tool';
const FormItem = Form.Item;
const Option = Select.Option;
class Ygd extends Component {
    constructor(props) {
        super(props);
        props.onRef(this);
        this.state = {
            legalPersonIdCardStorageListStr: []
        }
    }
    componentDidMount() {
        this.companys();
    }
    companys() {
        var data = JSON.parse(window.localStorage.getItem("dropdownList"));
        var bank = [];
        for (var i in data.bank) {
            bank.push(<Option key={i} value={i}>{data.bank[i]}</Option>);
        }
        this.setState({
            bank: bank
        })
    }
    licenseupload(e) {
        upload_more(e, 'settleBankLicStorageNoList', 'settleBankLicStorageList', this)
    }
    handlePreview(e) {
        var urls = e.response ? e.response.data.storageNo : e.storageNo;
        window.open(host_gyl + gyl_img_get + "?storageNo=" + urls);
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 10 },
        };
        const formItemLayoutBank = {
            labelCol: { span: 14 },
            wrapperCol: { span: 10 },
        };
        const license = {
            action: host_gyl + merchant_img_upload,
            // accept: 'image/*',
            // listType: "picture-card",
            className: "upload-list-inline imgChange",
            fileList: this.state.settleBankLicStorageList,
            onChange: this.licenseupload.bind(this),
            withCredentials: true,
            data: { usage: 'SETTLE_BANK_LIC', companyId: this.props.companyId },
            name: "file",
            multiple: true,
            onPreview: this.handlePreview.bind(this)
        };
        return (
            <div className="card">
                <Form >
                    <Row>
                        <Col span={24} className="card-title">
                            <div>结算账户信息</div>
                        </Col>
                    </Row>
                    <Row className="form-nomal">
                        <Row>
                            <Col span={24}>
                                <FormItem {...formItemLayout} label="结算账户名">
                                    {getFieldDecorator('settleAccountName', {
                                        rules: [
                                            { required: true, message: '请输入结算账户名' }],
                                        //initialValue:""
                                    })(
                                        <Input placeholder="请输入结算账户名" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem {...formItemLayout} label="结算账号">
                                    {getFieldDecorator('settleBankCard', {
                                        rules: [
                                            { required: true, message: '请输入结算账号' },
                                            { pattern: /^[0-9]*$/, message: '格式错误' }
                                        ],
                                        //initialValue:""
                                    })(
                                        <Input placeholder="请输入结算账号" />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem {...formItemLayoutBank} label="银行所在省">
                                    {getFieldDecorator('settleBankProvince', {
                                        rules: [{ message: '请输入银行所在省' }]
                                    })(
                                        <Input placeholder="请输入银行所在省" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={11} >
                                <FormItem {...formItemLayoutBank} label="">
                                    {getFieldDecorator('settleBankCity', {
                                        rules: [{ message: '银行所在市' }],
                                    })(
                                        <Input placeholder="请输入银行所在市" />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem {...formItemLayoutBank} label="开户行名称">
                                    {getFieldDecorator('settleBankName', {
                                        rules: [{ required: true, message: '请输入开户名称' }]
                                    })(
                                        <Input placeholder="请输入开户名称" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={11} >
                                <FormItem {...formItemLayoutBank} label="">
                                    {getFieldDecorator('settleSubBankName', {
                                        rules: [
                                            { required: true, message: '请输入开户支行名称' }],
                                    })(
                                        <Input placeholder="请输入开户支行名称" />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <FormItem {...formItemLayout} label="开户许可证影像">
                                    {getFieldDecorator('settleBankLicStorageNoList', {
                                        initialValue: []
                                    })(
                                        <div />

                                    )}
                                    <Upload {...license}>
                                        {
                                            <div style={{ color: "#1B84FF", cursor: "pointer" }}>上传附件</div>
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