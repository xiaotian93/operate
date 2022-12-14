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
                            <div>??????????????????</div>
                        </Col>
                    </Row>
                    <Row className="form-nomal">
                        <Row>
                            <Col span={24}>
                                <FormItem {...formItemLayout} label="???????????????">
                                    {getFieldDecorator('settleAccountName', {
                                        rules: [
                                            { required: true, message: '????????????????????????' }],
                                        //initialValue:""
                                    })(
                                        <Input placeholder="????????????????????????" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem {...formItemLayout} label="????????????">
                                    {getFieldDecorator('settleBankCard', {
                                        rules: [
                                            { required: true, message: '?????????????????????' },
                                            { pattern: /^[0-9]*$/, message: '????????????' }
                                        ],
                                        //initialValue:""
                                    })(
                                        <Input placeholder="?????????????????????" />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem {...formItemLayoutBank} label="???????????????">
                                    {getFieldDecorator('settleBankProvince', {
                                        rules: [{ message: '????????????????????????' }]
                                    })(
                                        <Input placeholder="????????????????????????" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={11} >
                                <FormItem {...formItemLayoutBank} label="">
                                    {getFieldDecorator('settleBankCity', {
                                        rules: [{ message: '???????????????' }],
                                    })(
                                        <Input placeholder="????????????????????????" />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem {...formItemLayoutBank} label="???????????????">
                                    {getFieldDecorator('settleBankName', {
                                        rules: [{ required: true, message: '?????????????????????' }]
                                    })(
                                        <Input placeholder="?????????????????????" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={11} >
                                <FormItem {...formItemLayoutBank} label="">
                                    {getFieldDecorator('settleSubBankName', {
                                        rules: [
                                            { required: true, message: '???????????????????????????' }],
                                    })(
                                        <Input placeholder="???????????????????????????" />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <FormItem {...formItemLayout} label="?????????????????????">
                                    {getFieldDecorator('settleBankLicStorageNoList', {
                                        initialValue: []
                                    })(
                                        <div />

                                    )}
                                    <Upload {...license}>
                                        {
                                            <div style={{ color: "#1B84FF", cursor: "pointer" }}>????????????</div>
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