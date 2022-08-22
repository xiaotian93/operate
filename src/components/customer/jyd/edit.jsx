import React, { Component } from 'react';
import { Row, Col, Form, Button, Modal, Input, Select, DatePicker } from 'antd';
import { axios_ygd, axios_ygd_json } from '../../../ajax/request';
import { custom_detail, custom_update_detail, gyl_img_get } from '../../../ajax/api';
import { page_go } from '../../../ajax/tool';
import moment from 'moment';
import ComponentRoute from '../../../templates/ComponentRoute';
import UploadFile from '../../../model/staticModel/uploadFileList';
import { host_gyl } from '../../../ajax/config';
const FormItem = Form.Item;
const Option = Select.Option;
class Ygd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companyId: props.location.query.companyId,
            statusMsg: "",
            visible: false,
            industryInvolved: [],
            industryType: [],
            scale: []
        }
        this.uploadFile = new UploadFile(host_gyl + gyl_img_get);
    }
    componentWillMount() {
        this.getCompany();
        this.getDetail();
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
    //编辑订单
    getDetail() {
        var param = {
            companyId: this.state.companyId
        };
        axios_ygd.post(custom_detail, param).then(e => {
            var detail = e.data;
            for (var i in detail) {
                if (detail[i]) {
                    if (i === "expireDate") {
                        this.props.form.setFieldsValue({ [i]: detail[i] ? moment(detail[i]) : "" })
                    } else {
                        this.props.form.setFieldsValue({ [i]: detail[i] + "" })

                    }
                }
            }
            this.setState({ companyId: e.data.id })
        })

    }
    //提交审核
    audit() {
        var saveData = {
            id: this.state.companyId
        };
        this.setState({
            visible: false
        })
        this.props.form.validateFieldsAndScroll((err, val) => {
            if (!err) {
                for (var i in val) {
                    if (i === "expireDate") {
                        saveData[i] = val[i].format("YYYY-MM-DD") + " 00:00:00";
                    } else {
                        saveData[i] = val[i]
                    }
                }
            }
        })
        axios_ygd_json.post(custom_update_detail, saveData).then(e => {
            if (!e.code) { page_go("/kh/jyd/list") }
        })
    }
    //取消
    cancel() {
        this.setState({
            visible: true
        });
    }
    modalCancel() {
        this.setState({ visible: false });
        page_go("/kh/jyd/list");
    }
    render() {
        const foot = <div>
            <Button type="primary" onClick={this.audit.bind(this)}>不，我要提交</Button>
            <Button type="primary" onClick={this.modalCancel.bind(this)}>是，我要离开</Button>
        </div>;
        const modal = {
            title: null,
            visible: this.state.visible,
            footer: foot,
            closable: false
        };
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 10 },
        };
        const formItemLayoutBank = {
            labelCol: { span: 14 },
            wrapperCol: { span: 10 },
        };
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <div className="content" style={{ marginBottom: "60px" }}>
                    <Form >
                        <div className="card">
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
                                                    <Input placeholder="请输入企业名称" disabled />
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
                                                    <Input placeholder="请输入企业统一信用代码" disabled />
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={24}>
                                            <FormItem {...formItemLayout} label="详细地址">
                                                {getFieldDecorator('addressDetail', {
                                                    rules: [
                                                        { required: true, message: '请输入企业统一信用代码' },
                                                    ],
                                                    initialValue: ""
                                                })(
                                                    <Input placeholder="请输入企业统一信用代码" disabled />
                                                )}
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
                                    </Row>
                                </Row>
                            </Row>

                        </div>
                        <div className="card">
                            <Row>
                                <Col span={24} className="card-title">
                                    <div>法人信息</div>
                                </Col>
                            </Row>
                            <Row className="form-nomal">
                                <Row>
                                    <Col span={24}>
                                        <FormItem {...formItemLayout} label="法人姓名">
                                            {getFieldDecorator('legalManName', {
                                                rules: [
                                                    { required: true, message: '请输入法人姓名' },
                                                    { pattern: /^[\u4e00-\u9fa5A-Za-z ]{1,10}$/, message: '格式错误' }
                                                ],
                                                //initialValue:""
                                            })(
                                                <Input placeholder="请输入法人姓名" disabled />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <FormItem {...formItemLayout} label="法人手机号">
                                            {getFieldDecorator('legalPersonPhone', {
                                                rules: [
                                                    { message: '请输入法人手机号' },
                                                    { pattern: /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/, message: '格式错误' }
                                                ],
                                                //initialValue:""
                                            })(
                                                <Input placeholder="请输入法人手机号" disabled />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Row>
                        </div>
                        <div className="card">
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
                                                <Input placeholder="请输入结算账户名" disabled />
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
                                                <Input placeholder="请输入结算账号" disabled />
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
                                                <Input placeholder="请输入开户名称" disabled />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={11} >
                                        <FormItem {...formItemLayoutBank} label="">
                                            {getFieldDecorator('settleSubBankName', {
                                                rules: [
                                                    { required: true, message: '请输入开户支行名称' }],
                                            })(
                                                <Input placeholder="请输入开户支行名称" disabled />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>

                            </Row>
                        </div>
                        <div className="card">
                            <Row>
                                <Col span={24} className="card-title">
                                    <div>还款账户信息</div>
                                </Col>
                            </Row>
                            <Row className="form-nomal">
                                <Row>
                                    <Col span={24}>
                                        <FormItem {...formItemLayout} label="还款账户名">
                                            {getFieldDecorator('repayAccountName', {
                                                rules: [
                                                    { required: true, message: '请输入还款账户名' }],
                                                //initialValue:""
                                            })(
                                                <Input placeholder="请输入还款账户名" />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={24}>
                                        <FormItem {...formItemLayout} label="还款账号">
                                            {getFieldDecorator('repayBankCard', {
                                                rules: [
                                                    { required: true, message: '请输入还款账号' }],
                                                //initialValue:""
                                            })(
                                                <Input placeholder="请输入还款账号" />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Row>
                        </div><div className="card">
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
                                                    { required: true, message: '请输入法人姓名' },
                                                    { pattern: /^[\u4e00-\u9fa5A-Za-z ]{1,10}$/, message: '格式错误' }
                                                ],
                                                //initialValue:""
                                            })(
                                                <Input placeholder="请输入法人姓名" disabled />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <FormItem {...formItemLayout} label="联系人手机号">
                                            {getFieldDecorator('agentPhone', {
                                                rules: [
                                                    { message: '请输入法人手机号' },
                                                    { pattern: /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/, message: '格式错误' }
                                                ],
                                                //initialValue:""
                                            })(
                                                <Input placeholder="请输入法人手机号" disabled />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <FormItem {...formItemLayout} label="联系人身份证号">
                                            {getFieldDecorator('agentIdCard', {
                                                rules: [
                                                    { required: true, message: '请输入法人姓名' },
                                                    { pattern: /^[\u4e00-\u9fa5A-Za-z ]{1,10}$/, message: '格式错误' }
                                                ],
                                                //initialValue:""
                                            })(
                                                <Input placeholder="请输入法人姓名" disabled />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <FormItem {...formItemLayout} label="联系人邮箱">
                                            {getFieldDecorator('agentEmail', {
                                                rules: [
                                                    { required: true, message: '请输入法人姓名' },
                                                    { pattern: /^[\u4e00-\u9fa5A-Za-z ]{1,10}$/, message: '格式错误' }
                                                ],
                                                //initialValue:""
                                            })(
                                                <Input placeholder="请输入法人姓名" disabled />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Row>
                        </div>
                    </Form>
                </div>

                <Row style={{ height: "50px", background: "#fff", position: "fixed", bottom: "0", right: "0", lineHeight: "50px", textAlign: "center", width: "calc(100% - 170px)", boxShadow: "0px -2px 4px 0px rgba(0,0,0,0.1)" }}>
                    <Button onClick={this.cancel.bind(this)}>取消</Button>
                    <Button type="primary" style={{ marginLeft: "30px" }} onClick={this.audit.bind(this)}>提交</Button>
                </Row>
                <Modal {...modal}><span style={{ fontSize: "16px" }}>是否放弃保存当前信息？</span></Modal>
                <style>{`
                    .ant-upload.ant-upload-select-picture-card{
                        border: none!important;
                        width: auto!important;
                        height:auto!important;
                        margin-bottom: 0!important;
                        background-color:#fff!important;
                      }
                      .ant-upload.ant-upload-select-picture-card > .ant-upload{
                        padding: 0!important;
                      }
                `}</style>
            </div>
        )
    }
}
export default Form.create()(ComponentRoute(Ygd));