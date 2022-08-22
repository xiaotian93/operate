import React, { Component } from 'react';
import { Row, Col, Form, Input, Select, DatePicker, Upload } from 'antd';
import location_data from '../../../../utils/province_city';
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
            bank: [],
            licenseStorageList: []
        }
    }
    componentDidMount() {
        this.getCompany();
        this.set_province()
    }
    getCompany() {
        var data = JSON.parse(window.localStorage.getItem("dropdownList"));
        var industryInvolved = [], industryType = [], scale = [];
        for (var i in data.industryInvolved) {
            industryInvolved.push(<Option key={i} value={i}>{data.industryInvolved[i]}</Option>);
        }
        for (var j in data.industryType) {
            industryType.push(<Option key={j} value={j}>{data.industryType[j]}</Option>);
        }
        for (var k in data.scale) {
            scale.push(<Option key={k} value={k}>{data.scale[k]}</Option>);
        }
        this.setState({
            industryInvolved: industryInvolved,
            industryType: industryType,
            scale: scale
        })
    }
    // 设置省市区
    set_province() {
        let provinces = [];
        for (let p in location_data) {
            provinces.push(<Option key={p} value={p}>{p}</Option>);
        }
        this.setState({ province: provinces })
    }
    // 设置城市
    set_city(val) {
        let citys = [], citys_data = location_data[val];
        for (let c in citys_data) {
            citys.push(<Option key={c} value={c}>{c}</Option>)
        }
        this.setState({ city: citys })
    }
    // 设置区县
    set_county(val, pro) {
        if (!val) return;
        let province = pro || this.props.form.getFieldValue("addressProvince");
        let countys_data = location_data[province][val];
        let countys = [];
        for (let c in countys_data) {
            countys.push(<Option key={c} value={countys_data[c]}>{countys_data[c]}</Option>)
        }
        this.setState({
            county: countys
        })
    }
    licenseupload(e) {
        upload_more(e, 'licenseStorageNoList', 'licenseStorageList', this)
    }
    otherFileUpload(e) {
        upload_more(e, 'otherStorageNoList', 'otherStorageList', this)
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
        const formItemLayoutSmall = {
            labelCol: { span: 14 },
            wrapperCol: { span: 7 },
        };
        const license = {
            action: host_gyl + merchant_img_upload,
            // accept: 'image/*',
            // listType: "picture-card",
            className: "upload-list-inline imgChange",
            fileList: this.state.licenseStorageList,
            onChange: this.licenseupload.bind(this),
            withCredentials: true,
            data: { usage: 'LICENSE', companyId: this.props.companyId },
            name: "file",
            multiple: true,
            onPreview: this.handlePreview.bind(this)
        };
        const ohterInfoProps = {
            action: host_gyl + merchant_img_upload,
            className: "upload-list-inline imgChange",
            fileList: this.state.otherStorageList,
            onChange: this.otherFileUpload.bind(this),
            withCredentials: true,
            data: { usage: 'OTHER_INFO_IMAGE', companyId: this.props.companyId },
            name: "file",
            multiple: true,
            onPreview: this.handlePreview.bind(this)
        }
        return (
            <div className="card">
                <Form >
                    <Row>
                        <Row> <Col span={24} className="card-title"> <div>企业信息</div> </Col> </Row>
                        <Row className="form-nomal">
                            <Row>
                                <Col span={24}>
                                    <FormItem {...formItemLayout} label="企业名称">
                                        {getFieldDecorator('name', {
                                            rules: [
                                                { required: true, message: '请输入企业名称' }],
                                            //initialValue:""
                                        })(
                                            <Input placeholder="请输入企业名称" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem {...formItemLayout} label="企业统一信用代码">
                                        {getFieldDecorator('creditCode', {
                                            rules: [
                                                { required: true, message: '请输入企业统一信用代码' },
                                            ],
                                            initialValue: ""
                                        })(
                                            <Input placeholder="请输入企业统一信用代码" />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <FormItem {...formItemLayout} label="企业简称">
                                        {getFieldDecorator('shortName', {
                                            rules: [
                                                //{ required: true, message: '请输入企业简称' }
                                            ],
                                            initialValue: ""
                                        })(
                                            <Input placeholder="请输入企业简称" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem {...formItemLayout} label="企业联系方式">
                                        {getFieldDecorator('mobile', {
                                            rules: [
                                                { required: true, message: '请输入企业联系方式' },
                                                { pattern: /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/, message: '格式错误' }
                                            ],
                                            initialValue: ""
                                        })(<Input placeholder="请输入企业联系方式" />)}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <FormItem {...formItemLayout} label="产业类型">
                                        {getFieldDecorator('industryType', {
                                            rules: [
                                                { required: true, message: '请选择产业类型' }],
                                            //initialValue:""
                                        })(
                                            <Select placeholder="请选择产业类型">
                                                {
                                                    this.state.industryType
                                                }

                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem {...formItemLayout} label="所属行业">
                                        {getFieldDecorator('industryInvolved', {
                                            rules: [
                                                { required: true, message: '请选择所属行业' },
                                            ],
                                            //initialValue:""
                                        })(
                                            <Select placeholder="请选择所属行业">
                                                {
                                                    this.state.industryInvolved
                                                }

                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <FormItem {...formItemLayout} label="企业规模">
                                        {getFieldDecorator('scale', {
                                            rules: [
                                                { required: true, message: '请选择企业规模' }],
                                            //initialValue:""
                                        })(
                                            <Select placeholder="请选择企业规模">
                                                {
                                                    this.state.scale
                                                }

                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem {...formItemLayoutSmall} label="地址">
                                        {getFieldDecorator('addressProvince', {
                                            rules: [
                                                { message: '请选择省份' }],
                                            //initialValue:""
                                        })(
                                            <Select placeholder="请选择省份" onChange={this.set_city.bind(this)}>
                                                {this.state.province}
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={4} pull={1}>
                                    <FormItem wrapperCol={{ span: 20 }} label="">
                                        {getFieldDecorator('addressCity', {
                                            rules: [
                                                { message: '请选择市' },
                                            ],
                                            //initialValue:""
                                        })(
                                            <Select placeholder="请选择市" onChange={this.set_county.bind(this)}>
                                                {this.state.city}
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={4} pull={1}>
                                    <FormItem wrapperCol={{ span: 20 }} label="">
                                        {getFieldDecorator('addressDistrict', {
                                            rules: [
                                                { message: '请选择区县' },
                                            ],
                                            //initialValue:""
                                        })(
                                            <Select placeholder="请选择区县">
                                                {this.state.county}
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={4} pull={1}>
                                    <FormItem wrapperCol={{ span: 24 }} label="">
                                        {getFieldDecorator('addressDetail', {
                                            rules: [
                                                { message: '请输入详细联系地址' },
                                            ],
                                            initialValue: ""
                                        })(
                                            <Input placeholder="请输入详细联系地址" />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <FormItem {...formItemLayout} label="营业执照截止日期">
                                        {getFieldDecorator('expireDate', {
                                            rules: [
                                                { required: true, message: '请选择截止日期' }],
                                            //initialValue:""
                                        })(
                                            <DatePicker placeholder="请选择截止日期" showToday={false} />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem {...formItemLayout} label="营业执照影像(加盖公章)">
                                        {getFieldDecorator('licenseStorageNoList', { initialValue: [] })(<div />)}
                                        <Upload {...license}><div style={{ color: "#1B84FF", cursor: "pointer" }}>上传附件</div></Upload>
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem {...formItemLayout} label="其他附件">
                                        {getFieldDecorator('otherStorageNoList', { initialValue: [] })(<div />)}
                                        <Upload {...ohterInfoProps}><div style={{ color: "#1B84FF", cursor: "pointer" }}>上传附件</div></Upload>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Row>
                    </Row>

                </Form>
            </div>
        )
    }
}
export default Form.create()(Ygd);