import React, { Component } from 'react';
import { Row, Col, Form, Input, Modal, Button, message, Select, Icon, Tooltip } from 'antd';
import { merchant_zj_product_add, merchant_zj_product_detail, merchant_zj_product_update, merchant_zj_select_product, merchant_zj_product_detail_bycode } from '../../../../../ajax/api';
import { axios_loan } from '../../../../../ajax/request';
import Tag from '../../../../tenant/bmd/tag';
import { browserHistory } from 'react-router';
import { accMul, accDiv } from '../../../../../ajax/tool.js';
import Business from './business';
import BmdBusiness from './business/bmdBusiness';
import ProductDetail from './detail/productConfig';
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
class Basic extends Component {
    constructor(props) {
        super(props);
        // props.onRef(this);
        this.state = {
            principalType_val: "0",
            dailyOverdueRateType_val: "0",
            penaltyType_val: "0",
            penaltyType_str_val: "2",
            tagArr: [],  //借款期数
            configNo: props.location.query.configNo,
            domain: props.location.query.domain,
            cooperator: props.location.query.cooperator,
            appKey: props.location.query.appKey,
            appName: props.location.query.appName,
            id: "",
            loanAppId: "",
            productId: "",
            repayPlanTemplate: "",
            userEdit: [],
            userArr: { data: [] },
            product_sel: [],
            product_config: {
                minLoanAmount: 0,
                maxLoanAmount: 0
            },
            product_name: "",
            check_result: true,
            loanConfig: {},
            loanLimit: {},
            product: {}
        };
        this.product = []
    }
    componentWillMount() {
        this.getSelect();
        if (this.state.configNo) {
            setTimeout(function () {
                this.editData()
            }.bind(this), 1000)
        }
        this.props.router.setRouteLeaveHook(
            this.props.route,
            this.routerWillLeave.bind(this)
        )
    }
    shouldComponentUpdate(props, state) {
        this.props.router.setRouteLeaveHook(
            this.props.route,
            this.routerWillLeave.bind(this)
        )
        return true

    }
    routerWillLeave(nextLocation) {
        if (this.state.isleave) {
            return true
        } else {
            this.setState({
                leave: true,
                isleave: true,
                next: nextLocation.pathname
            })
            return false;
        }
    };
    leaveOk() {
        this.setState({
            leave: false,
            isleave: false
        })
    }
    leaveClose() {
        this.setState({
            leave: false,
            isleave: true
        })
        browserHistory.push(this.state.next)
    }
    getSelect() {
        axios_loan.post(merchant_zj_select_product).then(e => {
            if (!e.code) {
                this.setState({
                    product_sel: e.data
                })
            }
        })
    }

    editData() {
        axios_loan.post(merchant_zj_product_detail + "?configNo=" + this.state.configNo).then(e => {
            if (!e.code) {
                // this.props.form.setFieldsValue({ code: e.data.code,desc:e.data.desc});
                var data = e.data;

                this.product_info(data.productCode);
                this.setState({
                    product_checked: data.productCode,
                    id: data.id,
                    loanAppId: data.loanAppId,
                    productId: data.productId,
                    repayPlanTemplate: data.repayPlanTemplate,
                })

                this.props.form.setFieldsValue({ "productCode": data.productCode })

                setTimeout(function () {
                    this.setDetail(data)
                }.bind(this), 500)
            }
        })
    }
    setDetail(data) {
        if (this.state.product_del) {
            message.warn("该产品不存在");
            return;
        }
        for (var i in data) {
            if (i.indexOf("Rate") !== -1) {
                if (data[i] !== null) {
                    this.props.form.setFieldsValue({ [i]: accMul(data[i], 100) });
                }

            } else if (i.indexOf("Amount") !== -1) {
                this.props.form.setFieldsValue({ [i]: accDiv(data[i], 100) });
            } else if (i === "supportPhases" && data[i]) {
                this.setState({
                    tagArr: data[i].split(",")
                });
                this.tag_child.setState({
                    tags: data[i].split(",")
                })
                this.props.form.setFieldsValue({ [i]: data[i].split(",") });
            } else {

                // if (data[i]) {
                if (i === "allowInputLoanAmount") {
                    this.props.form.setFieldsValue({ [i]: data[i] });
                } else {
                    if (data[i] !== null) {
                        this.props.form.setFieldsValue({ [i]: data[i].toString() });
                    }
                    // this.setState({
                    //     periodUnit_type: e.data.parentConfig.loanTermType,
                    //     product_gap: data.periodGap
                    // })
                }

                // }
            }
        }
    }
    imgCancel() {
        this.setState({
            previewVisible: false
        })
    }

    addShow() {
        this.setState({
            previewVisible: true
        })
    }
    addUser(e) {
        this.addUser_child = e;
    }
    //百分比转浮点数
    val_change(e, name) {
        this.props.form.setFieldsValue({ [name]: e.target.value / 100 })
        console.log(this.props.form.getFieldValue("dailyOverdueRate"))
    }
    //金额转分
    money_change(e, name) {
        this.props.form.setFieldsValue({ [name]: e.target.value * 100 })
    }
    tag(e) {
        this.tag_child = e
    }
    getTag(e) {
        this.setState({
            tagArr: e
        })
    }
    //借款单位
    periodUnit_change(e) {
        this.setState({
            periodUnit_type: e.target.value
        })
    }
    submit() {
        this.setState({
            leave: false,
            isleave: true,
            visible_submit: false,
            product_config_finish: false
        })
        if (this.state.tagArr.length < 1) {
            this.tag_child.props.form.validateFieldsAndScroll((err, values) => { });
            return;
        }
        if (this.tag_child.state.error.type) {
            this.tag_child.props.form.setFields({
                totalPeriodList: {
                    errors: [new Error('需在产品期限范围内')],
                    value: this.tag_child.state.error.value
                },
            });
            return;
        }
        if (!this.state.check_result) {
            this.props.form.setFields({
                [this.state.error.name]: {
                    errors: [new Error('需在产品线限制内')],
                    value: this.state.error.value
                },
            });
            return;
        }
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log(values);
                values.supportPhases = this.state.tagArr.join(",");
                values.appKey = this.state.appKey;
                if (values.penaltyAheadFeeRate === ""||values.penaltyAheadFeeRate === undefined) {
                    delete values.penaltyAheadFeeRate
                }
                // return;
                for (var i in values) {
                    if (i.indexOf("Amount") !== -1) {
                        values[i] = accMul(values[i], 100)
                    } else if (i.indexOf("Rate") !== -1) {
                        values[i] = accDiv(values[i], 100)
                    }
                }
                if (!this.state.configNo) {
                    axios_loan.post(merchant_zj_product_add, values).then(e => {
                        if (!e.code) {
                            // var id = e.data;
                            message.success("新增成功");
                            this.setState({
                                product_config_finish: true,
                                product_config_detail: values,
                                configNo: e.data,
                                add: true
                            })
                        }
                    })
                } else {
                    values.id = this.state.id;
                    values.configNo = this.state.configNo;
                    values.loanAppId = this.state.loanAppId;
                    values.productId = this.state.productId;
                    values.repayPlanTemplate = this.state.repayPlanTemplate;
                    axios_loan.post(merchant_zj_product_update, values).then(e => {
                        if (!e.code) {
                            message.success("编辑成功");
                            this.setState({
                                product_config_finish: true
                            })
                        }
                    })
                }
            }
        });
    }
    //选择产品
    change_product(val) {
        this.product_info(val);
        this.props.form.resetFields();
        if (this.tag_child) {
            this.tag_child.setState({
                tags: []
            })
        }
    }
    product_info(val) {
        this.setState({
            product_del: true
        })
        axios_loan.post(merchant_zj_product_detail_bycode, { code: val }).then(e => {
            var data = e.data;
            if (!data.loanConfig || !data.loanConfig.repayPlanTemplate) {
                message.warn("该产品暂未配置还款计划模板，请选择其他产品");
                this.setState({
                    product_del: false,
                    product_checked: ""
                })
                return;
            }
            this.setState({
                product_name: data.product.name + "(" + data.product.code + ")",
                loanConfig: data.loanConfig,
                product_checked: val,
                periodUnit_type: data.loanLimit.loanPeriodUnit,
                product_del: false,
                product_desc: data.product.desc,
                loanLimit: data.loanLimit
            })
        })
    }
    //输入值检验
    check_val(input_val, str, valMin, valMax, type) {
        if (input_val.target.value === "") {
            return
        }
        this.setState({
            check_result: true,
            error: {
                name: "",
                value: ""
            }
        });
        var check = false, checkText = "";
        var type_str = {
            minLoanAmount: {
                text: "maxLoanAmount",
                val: "max"
            },
            maxLoanAmount: {
                text: "minLoanAmount",
                val: "min"
            },
            minGeneralYearRate: {
                text: "maxGeneralYearRate",
                val: "max"
            },
            maxGeneralYearRate: {
                text: "minGeneralYearRate",
                val: "min"
            },
            minLoanPeriod: {
                text: "maxLoanPeriod",
                val: "max"
            },
            maxLoanPeriod: {
                text: "minLoanPeriod",
                val: "min"
            },
            minGeneralRate: {
                text: "maxGeneralRate",
                val: "max"
            },
            maxGeneralRate: {
                text: "minGeneralRate",
                val: "min"
            }
        }
        if (type_str[str]) {
            var getVal = this.props.form.getFieldValue(type_str[str]["text"]); console.log(typeof getVal)
            if (type_str[str]) {
                if (type_str[str].val === "max" && getVal !== undefined && Number(input_val.target.value) > Number(getVal)) {
                    check = true;
                    checkText = "不能高于最高值"
                }
                if (type_str[str].val === "min" && getVal !== undefined && Number(input_val.target.value) < Number(getVal)) {
                    check = true
                    checkText = "不能低于最低值"
                }
            }
        }
        if (valMax === "" && Number(input_val.target.value) < Number(valMin)) {
            this.props.form.setFields({
                [str]: {
                    errors: [new Error('需在产品线限制内')],
                    value: Number(input_val.target.value)
                },
            });
            this.setState({
                error: {
                    name: str,
                    value: Number(input_val.target.value)
                }
            })
        }
        if (valMax === "") {
            return;
        }
        if (Number(input_val.target.value) < Number(valMin) || Number(input_val.target.value) > Number(valMax) || check) {
            this.props.form.setFields({
                [str]: {
                    errors: [new Error(check ? checkText : '需在产品线限制内')],
                    value: Number(input_val.target.value)
                },
            });
            this.setState({
                check_result: false,
                error: {
                    name: str,
                    value: Number(input_val.target.value)
                }
            })
        } else {
            if (type_str[str]) {
                this.props.form.setFields({
                    [type_str[str]['text']]: {
                        value: getVal !== undefined ? Number(getVal) : ""
                    },
                });
            }

        }

    }
    //获取间隔期限
    getGap(e) {
        this.setState({
            product_gap: e.target.value
        })
    }
    submit_cancel() {
        this.setState({
            visible_submit: false
        })
    }
    submit_sure() {
        this.setState({
            visible_submit: true
        })
    }
    product_detail(e) {
        this.product_child = e
    }
    get_product_detail(e) {
        this.setState({
            product_detail_info: e
        })
    }
    render() {
        window.form = this.props.form;
        // var value=window.localStorage.getItem("detail")?JSON.parse(window.localStorage.getItem("detail")).basic.productIds:[];
        const { getFieldDecorator } = this.props.form;
        const formInfoText = {
            labelCol: { span: 6 },
            wrapperCol: { span: 4 },
            colon: false
        };
        const formInfoSmall = {
            labelCol: { span: 7 },
            wrapperCol: { span: 11 },
            colon: false,
            className: "tableForm text_left",
            labelAlign: "left"
        };
        const titleInfo = {
            span: 4,
            className: "text_margin"
        }
        const type = { "DAY": "日", "MONTH": "月", "YEAR": "年" };
        const type_term = { "DAY": "日", "MONTH": "个月", "YEAR": "年" };
        const commissionRACollectType = { "CURRENT": "当期收取后续期数减免", "ALL": "当期收取后续期数不减免", "CAL_DAY": "按日计收", "OTHER": "特殊配置" };
        const base = { "PHASE_FIXED": "元/期", "BALANCE": "贷款余额/日", "PHASE_PRINCIPAL_RATE": "未还本息/日", "PHASE_PRINCIPAL": "未还本金/日" }
        const baseOver = { "PHASE_FIXED": "元/期", "BALANCE": "贷款余额", "PHASE_PRINCIPAL_RATE": "未还本息", "PHASE_PRINCIPAL": "未还本金" };
        const leave = {
            visible: this.state.leave,
            maskClosable: false,
            closable: false,
            onOk: this.leaveClose.bind(this),
            onCancel: this.leaveOk.bind(this),
            cancelText: "暂不取消",
            okText: "确认取消",
            title: "取消确认"
        }
        return (
            <div className="sh_add content">
                {!this.state.product_config_finish ? <Form >
                    <Row className="sh_add_product">
                        <Row className="sh_inner_box" style={{ marginBottom: "10px" }}>
                            <Col {...titleInfo}>
                                <span className="product_card_title">商户名称</span>
                            </Col>
                            <Col span={16} pull={1}>
                                <span className="product_card_title">{this.state.cooperator}</span>
                            </Col>
                        </Row>
                        <Row className="sh_inner_box" style={{ marginBottom: "10px" }}>
                            <Col {...titleInfo}>
                                <span className="product_card_title">所属项目</span>
                            </Col>
                            <Col span={16} pull={1}>
                                <span className="product_card_title">{this.state.appName}</span>
                            </Col>
                        </Row>
                        <Row className="sh_inner_box">
                            <Col {...titleInfo} style={{ marginTop: "5px" }}>
                                <span className="product_card_title">开通产品</span>
                            </Col>
                            <Col span={16} pull={1}>
                                <FormItem wrapperCol={{ span: 6 }} >
                                    {getFieldDecorator('productCode', {
                                        rules: [{ required: true, message: "请选择要开通的产品名称" }],
                                        // initialValue:this.state.product_checked
                                    })(
                                        <Select placeholder="请选择要开通的产品名称" className="selectMore" style={{ width: '100%' }} onChange={this.change_product.bind(this)} disabled={this.state.configNo ? true : false}>
                                            {this.state.product_sel.map((i, k) => {
                                                return <Option value={i.code} key={k} aa={i} disabled={!i.status ? true : false}><Tooltip title={!i.status ? "您所选择的产品已停用，请启用后选择" : ""}><div style={{ width: "100%" }}>{i.name}</div></Tooltip></Option>
                                            })}
                                        </Select>
                                    )}


                                </FormItem>
                            </Col>
                        </Row>
                    </Row>
                    {this.state.product_checked ? <div className="sh_add_card_product">
                        {/* <div className="sh_inner_box"> */}
                        <div className="sh_add_title" style={{ marginLeft: "20px" }}>产品配置</div>
                        <Row className="product_card">
                            <div className="sh_inner_box">
                                <Col {...titleInfo}>
                                    <span className="product_card_title">基础信息</span>
                                </Col>
                                <Col span={16}>
                                    <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                        <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>产品名称</span></Col>
                                        <Col span={8} style={{ lineHeight: "22px", color: "#000" }}>{this.state.product_name}<Tooltip title={this.state.product_desc}><Icon type="info-circle" style={{ marginLeft: "5px", cursor: "pointer", color: "#1B84FF" }} /></Tooltip></Col>
                                    </Row>
                                    <FormItem label={<span style={{ width: "100%" }}>子产品描述</span>} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} colon={false}>
                                        {getFieldDecorator("desc", {
                                            initialValue: "",
                                            rules: [{ required: true, message: "请输入子产品描述" }, { max: 500, message: "最多500字符" }]
                                        })(
                                            <TextArea placeholder="请输入子产品描述，最长500字符" />
                                        )}
                                    </FormItem>
                                </Col>
                            </div>
                        </Row>
                        <Row className="product_card">
                            <div className="sh_inner_box">
                                <Col {...titleInfo}>
                                    <span className="product_card_title">借贷信息</span>
                                </Col>
                                <Col span={16}>
                                    <Row>
                                        <Col
                                            span={6}
                                            style={{ textAlign: "right", fontSize: "14px", color: "rgba(0,0,0,0.5)", paddingRight: "20px", marginBottom: "15px", lineHeight: "32px" }}
                                        >
                                            <span>借款金额范围</span>
                                        </Col>
                                        <Col span={8}>
                                            <FormItem className="text_left" label="" {...formInfoSmall} >
                                                {getFieldDecorator('minLoanAmount', {
                                                    rules: [{ pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "格式错误" }, { required: true, message: "请输入最低额度" }]
                                                })(
                                                    <Input placeholder="请输入最低额度" onBlur={(e) => { this.check_val(e, "minLoanAmount", accDiv(this.state.loanLimit.minLoanAmount, 100), accDiv(this.state.loanLimit.maxLoanAmount, 100), true) }} />
                                                )}

                                            </FormItem>
                                        </Col>
                                        <Col span={1} pull={4} style={{ lineHeight: "32px" }}>——</Col>
                                        <Col span={8} pull={4} >
                                            <FormItem className="" label="" {...formInfoSmall} >
                                                {getFieldDecorator('maxLoanAmount', {
                                                    rules: [{ pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "格式错误" }, { required: true, message: "请输入最高额度" }]
                                                })(
                                                    <Input placeholder="请输入最高额度" onBlur={(e) => { this.check_val(e, "maxLoanAmount", accDiv(this.state.loanLimit.minLoanAmount, 100), accDiv(this.state.loanLimit.maxLoanAmount, 100), false) }} />
                                                )}

                                                <div className="formText" >元</div>
                                                <div style={{ width: "300px", position: "absolute", left: "120%", top: "0" }}>{"（产品线范围：" + accDiv(this.state.loanLimit.minLoanAmount, 100) + "——" + accDiv(this.state.loanLimit.maxLoanAmount, 100) + "元）"}</div>
                                            </FormItem>
                                        </Col>

                                    </Row>
                                    <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                        <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>借款期限单位</span></Col>
                                        <Col span={8} style={{ lineHeight: "22px", color: "#000" }}>{type[this.state.periodUnit_type]}</Col>
                                    </Row>
                                    <Row>
                                        <Col
                                            span={6}
                                            style={{ textAlign: "right", fontSize: "14px", color: "rgba(0,0,0,0.5)", paddingRight: "20px", marginBottom: "15px", lineHeight: "32px" }}
                                        >
                                            <span>借款期限范围</span>
                                        </Col>
                                        <Col span={8}>
                                            <FormItem className="text_left" label="" {...formInfoSmall} >
                                                {getFieldDecorator('minLoanPeriod', {
                                                    rules: [{ pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "格式错误" }, { required: true, message: "请输入最低期限" }]
                                                })(
                                                    <Input placeholder="请输入最低期限" onBlur={(e) => { this.check_val(e, "minLoanPeriod", this.state.loanLimit.minLoanPeriod, this.state.loanLimit.maxLoanPeriod, true) }} />
                                                )}

                                            </FormItem>
                                        </Col>
                                        <Col span={1} pull={4} style={{ lineHeight: "32px" }}>——</Col>
                                        <Col span={8} pull={4} >
                                            <FormItem className="" label="" {...formInfoSmall} >
                                                {getFieldDecorator('maxLoanPeriod', {
                                                    rules: [{ pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "格式错误" }, { required: true, message: "请输入最高期限" }]
                                                })(
                                                    <Input placeholder="请输入最高期限" onBlur={(e) => { this.check_val(e, "maxLoanPeriod", this.state.loanLimit.minLoanPeriod, this.state.loanLimit.maxLoanPeriod, false) }} />
                                                )}

                                                <div style={{ width: "300px", position: "absolute", left: "120%", top: "0" }}>{"（产品线范围：" + this.state.loanLimit.minLoanPeriod + "——" + this.state.loanLimit.maxLoanPeriod + type_term[this.state.periodUnit_type] + "）"}</div>
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <FormItem label={<span style={{ width: "100%", marginRight: "12px" }}>支持期数</span>} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} colon={false}>
                                        {getFieldDecorator("supportPhases", {
                                            initialValue: "",
                                            // rules: [{ required: true, message: "请输入" }]
                                        })(
                                            <Tag onRef={this.tag.bind(this)} get_tag={this.getTag.bind(this)} minLoanTerm={this.state.loanLimit.minLoanPeriod} maxLoanTerm={this.state.loanLimit.maxLoanPeriod} loanTermType={this.state.periodUnit_type} gap={this.state.product_gap} limitCancel />
                                        )}
                                    </FormItem>
                                    <Row>
                                        <Col
                                            span={6}
                                            style={{ textAlign: "right", fontSize: "14px", color: "rgba(0,0,0,0.5)", paddingRight: "20px", marginBottom: "15px", lineHeight: "32px" }}
                                        >
                                            <span>实际年化综合费率范围</span>
                                        </Col>
                                        <Col span={8}>
                                            <FormItem className="text_left" label="" {...formInfoSmall} >
                                                {getFieldDecorator('minGeneralYearRate', {
                                                    rules: [{ pattern: /^[0-9]+(\.[0-9]{1,5})?$/, message: "格式错误" }, { required: true, message: "请输入最低年化" }]
                                                })(
                                                    <Input placeholder="请输入最低年化" onBlur={(e) => { this.check_val(e, "minGeneralYearRate", accMul(this.state.loanLimit.minYearRate, 100), accMul(this.state.loanLimit.maxYearRate, 100), true) }} />
                                                )}

                                            </FormItem>
                                        </Col>
                                        <Col span={1} pull={4} style={{ lineHeight: "32px" }}>——</Col>
                                        <Col span={8} pull={4} >
                                            <FormItem className="" label="" {...formInfoSmall} >
                                                {getFieldDecorator('maxGeneralYearRate', {
                                                    rules: [{ pattern: /^[0-9]+(\.[0-9]{1,5})?$/, message: "格式错误" }, { required: true, message: "请输入最高年化" }]
                                                })(
                                                    <Input placeholder="请输入最高年化" onBlur={(e) => { this.check_val(e, "maxGeneralYearRate", accMul(this.state.loanLimit.minYearRate, 100), accMul(this.state.loanLimit.maxYearRate, 100), false) }} />
                                                )}

                                                <div className="formText" >%</div>
                                                <div style={{ width: "300px", position: "absolute", left: "120%", top: "0" }}>{"（产品线范围：" + accMul(this.state.loanLimit.minYearRate, 100) + "%——" + accMul(this.state.loanLimit.maxYearRate, 100) + "%）"}</div>
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                        <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>费率计算单位</span></Col>
                                        <Col span={8} style={{ lineHeight: "22px", color: "#000" }}>{type[this.state.loanLimit.rateUnit]}</Col>
                                    </Row>
                                    <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                        <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>费率计算类型</span></Col>
                                        <Col span={8} style={{ lineHeight: "22px", color: "#000" }}>{this.state.loanConfig.calRateType}</Col>
                                    </Row>
                                    <Row>
                                        <Col
                                            span={6}
                                            style={{ textAlign: "right", fontSize: "14px", color: "rgba(0,0,0,0.5)", paddingRight: "20px", marginBottom: "15px", lineHeight: "32px" }}
                                        >
                                            <span>综合费率范围</span>
                                        </Col>
                                        <Col span={8}>
                                            <FormItem className="text_left" label="" {...formInfoSmall} >
                                                {getFieldDecorator('minGeneralRate', {
                                                    rules: [{ pattern: /^[0-9]+(\.[0-9]{1,5})?$/, message: "格式错误" }, { required: true, message: "请输入最低费率" }]
                                                })(
                                                    <Input placeholder="请输入最低费率" onBlur={(e) => { this.check_val(e, "minGeneralRate", accMul(this.state.loanLimit.minGeneralRate, 100), accMul(this.state.loanLimit.maxGeneralRate, 100), true) }} />
                                                )}

                                            </FormItem>
                                        </Col>
                                        <Col span={1} pull={4} style={{ lineHeight: "32px" }}>——</Col>
                                        <Col span={8} pull={4} >
                                            <FormItem className="" label="" {...formInfoSmall} >
                                                {getFieldDecorator('maxGeneralRate', {
                                                    rules: [{ pattern: /^[0-9]+(\.[0-9]{1,5})?$/, message: "格式错误" }, { required: true, message: "请输入最高费率" }]
                                                })(
                                                    <Input placeholder="请输入最高费率" onBlur={(e) => { this.check_val(e, "maxGeneralRate", accMul(this.state.loanLimit.minGeneralRate, 100), accMul(this.state.loanLimit.maxGeneralRate, 100), false) }} />
                                                )}

                                                <div className="formText" >%</div>
                                                <div style={{ width: "300px", position: "absolute", left: "120%", top: "0" }}>{"（产品线范围：" + accMul(this.state.loanLimit.minGeneralRate, 100) + "%——" + accMul(this.state.loanLimit.maxGeneralRate, 100) + "%）"}</div>
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <FormItem label={<span style={{ width: "100%" }}>借款协议模板</span>} labelCol={{ span: 6 }} wrapperCol={{ span: 10 }} colon={false}>
                                            {getFieldDecorator("loanAgreementSignTemplate", {
                                                initialValue: "",
                                            })(
                                                <Input placeholder="请输入借款协议模板" />
                                            )}
                                        </FormItem>
                                    </Row>
                                </Col>
                            </div>
                        </Row>
                        <Row className="product_card">
                            <div className="sh_inner_box">
                                <Col {...titleInfo}>
                                    <span className="product_card_title">还款信息</span>
                                </Col>
                                <Col span={16}>
                                    <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                        <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>是否允许部分还款</span></Col>
                                        <Col span={8} style={{ lineHeight: "22px", color: "#000" }}>{this.state.loanConfig.partRepayConfirm ? "允许" : "不允许"}</Col>
                                    </Row>
                                    <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                        <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>是否允许提前还款（非结清）</span></Col>
                                        <Col span={8} style={{ lineHeight: "40px", color: "#000" }}>{this.state.loanConfig.canRepayAhead ? "允许" : "不允许"}</Col>
                                    </Row>
                                    {this.state.loanConfig.canRepayAhead ? <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                        <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>提前还款时综合费用收取方式</span></Col>
                                        <Col span={8} style={{ lineHeight: "40px", color: "#000" }}>{commissionRACollectType[this.state.loanConfig.raCollectType]}</Col>
                                    </Row> : null}
                                </Col>
                            </div>
                        </Row>

                        <Row className="product_card">
                            <div className="sh_inner_box">
                                <Col {...titleInfo}>
                                    <span className="product_card_title">提前结清信息</span>
                                </Col>
                                {this.state.loanConfig.canRepayAheadAll ? <Col span={16}>
                                    <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                        <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>提前结清时综合费用收取方式</span></Col>
                                        <Col span={8} style={{ lineHeight: "40px", color: "#000" }}>{commissionRACollectType[this.state.loanConfig.raaCollectType]}</Col>
                                    </Row>
                                    {this.state.loanConfig.hasPenaltyAheadFee ? <div><FormItem label="手续费收取比例（选填）" {...formInfoText}>
                                        {getFieldDecorator('penaltyAheadFeeRate', {
                                            rules: [{ pattern: /^([1-9]\d{0,3}?(\.\d{1,5})?|0\.\d{1,5})$/, message: "格式错误" }]
                                        })(
                                            <Input placeholder="请输入" />
                                        )}
                                        <div className="formIcon" >%</div>
                                        <div className="formText" style={{ width: "200px" }} >*贷款余额</div>
                                    </FormItem>
                                        <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                            <Col span={6}>
                                                <span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>提前结清手续费收取上下限</span>
                                            </Col>
                                            <Col span={8}>
                                                <FormItem className="text_left" label="" {...formInfoSmall} >
                                                    {getFieldDecorator('penaltyAheadFeeMinAmount', {
                                                        rules: [{ pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "格式错误" }, { required: true, message: "请输入最低金额" }]
                                                    })(
                                                        <Input placeholder="请输入最低金额" onBlur={(e) => { this.check_val(e, "penaltyAheadFeeMinAmount", accDiv(this.state.loanConfig.penaltyAheadFeeMinAmount, 100), "", true) }} />
                                                    )}

                                                </FormItem>
                                            </Col>
                                            <Col span={1} pull={4} style={{ lineHeight: "32px" }}>——</Col>
                                            <Col span={8} pull={4} >
                                                <FormItem className="" label="" {...formInfoSmall} >
                                                    {getFieldDecorator('penaltyAheadFeeMaxRate', {
                                                        rules: [{ pattern: /^([1-9]\d{0,3}?(\.\d{1,5})?|0\.\d{1,5})$/, message: "格式错误" }, { required: true, message: "请输入最高百分比" }]
                                                    })(
                                                        <Input placeholder="请输入最高百分比" onBlur={(e) => { this.check_val(e, "penaltyAheadFeeMaxRate", 0, accMul(this.state.loanConfig.penaltyAheadFeeMaxRate, 100), false) }} />
                                                    )}

                                                    <div className="formText" >%*贷款余额</div>
                                                    <div style={{ width: "300px", position: "absolute", left: "175%", top: "0" }}>{"（产品线范围：" + (this.state.loanConfig.penaltyAheadFeeMinAmount ? accDiv(this.state.loanConfig.penaltyAheadFeeMinAmount, 100) : 0) + "元——" + accMul(this.state.loanConfig.penaltyAheadFeeMaxRate, 100) + "%*贷款余额）"}</div>
                                                </FormItem>
                                            </Col>
                                        </Row>

                                    </div> : <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                        <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "40px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>手续费收取金额</span></Col>
                                        <Col span={8} style={{ lineHeight: "40px", color: "#000" }}>不收取</Col>
                                    </Row>}
                                    <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                        <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>仅最后一期提前还款是否算提前结清</span></Col>
                                        <Col span={8} style={{ lineHeight: "40px", color: "#000" }}>{this.state.loanConfig.onlyRepayLastPhaseAsRaa ? "算提前结清" : "不算提前结清"}</Col>
                                    </Row>

                                </Col> : <Col span={16}>
                                    <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                        <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>提前结清时综合费用收取方式</span></Col>
                                        <Col span={8} style={{ lineHeight: "40px", color: "#000" }}>不允许提前结清</Col>
                                    </Row>
                                </Col>}
                            </div>
                        </Row>
                        <Row className="product_card">
                            <div className="sh_inner_box">
                                <Col {...titleInfo}>
                                    <span className="product_card_title">逾期罚息信息</span>
                                </Col>
                                {this.state.loanConfig.hasOverdueFee ? <Col span={16}>
                                    {this.state.loanConfig.hasOverdueFeeGrace ? <FormItem label={<span style={{ width: "100%" }}>宽限天数</span>} labelCol={{ span: 6 }} wrapperCol={{ span: 4 }} colon={false}>
                                        {getFieldDecorator("periodGrace", {
                                            // initialValue: this.state.dailyOverdueRateType_val,
                                            rules: [{ required: true, message: "请输入宽限天数" }, { pattern: /^[0-9]{1,10}$/, message: "格式错误" }]
                                        })(
                                            <Input placeholder="请输入" />
                                        )}
                                        <div className="formIcon" >天</div>
                                    </FormItem> : null}
                                    <FormItem label="收取金额" {...formInfoText}>
                                        {getFieldDecorator('overdueInterestRate', {
                                            rules: [{ required: true, message: "请输入收取金额" }, { pattern: /^([1-9]\d{0,3}?(\.\d{1,5})?|0\.\d{1,5})$/, message: "格式错误" }]
                                        })(
                                            <Input placeholder="请输入" onBlur={(e) => { this.check_val(e, "overdueInterestRate", 0, accMul(this.state.product_config.overdueFeeMaxRate, 100), false) }} />
                                        )}
                                        <div className="formIcon" >%</div>
                                        <div className="formText" >*{base[this.state.loanConfig.overdueFeeBase]}</div>
                                    </FormItem>
                                    <Row>
                                        <Col
                                            span={6}
                                            style={{ textAlign: "right", fontSize: "14px", color: "rgba(0,0,0,0.5)", paddingRight: "20px", marginBottom: "15px", lineHeight: "32px" }}
                                        >
                                            <span>罚息收取上下限</span>
                                        </Col>
                                        <Col span={8}>
                                            <FormItem className="text_left" label="" {...formInfoSmall} >
                                                {getFieldDecorator('overdueInterestMinAmount', {
                                                    rules: [{ pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "格式错误" }, { required: true, message: "请输入最低金额" }]
                                                })(
                                                    <Input placeholder="请输入最低金额" onBlur={(e) => { this.check_val(e, "overdueInterestMinAmount", accDiv(this.state.loanConfig.overdueFeeMinAmount, 100), "", true) }} />
                                                )}

                                            </FormItem>
                                        </Col>
                                        <Col span={1} pull={4} style={{ lineHeight: "32px" }}>——</Col>
                                        <Col span={8} pull={4} >
                                            <FormItem className="" label="" {...formInfoSmall} >
                                                {getFieldDecorator('overdueInterestMaxRate', {  // /^([1-9]+(\.\d{1,5})?|0\.\d{1,5})$/
                                                    rules: [{ pattern: /^([1-9]\d{0,3}(\.\d{1,5})?|0\.\d{1,5})$/, message: "格式错误" },
                                                    { required: true, message: "请输入最高百分比" }]
                                                })(
                                                    <Input placeholder="请输入最高百分比" onBlur={(e) => { this.check_val(e, "overdueInterestMaxRate", 0, accMul(this.state.loanConfig.overdueFeeMaxRate, 100), false) }} />
                                                )}

                                                <div className="formText" >%*借款金额</div>
                                                <div style={{ width: "300px", position: "absolute", left: "175%", top: "0" }}>{"（产品线范围：" + (this.state.loanConfig.overdueFeeMinAmount ? accDiv(this.state.loanConfig.overdueFeeMinAmount, 100) : 0) + "元——" + accMul(this.state.loanConfig.overdueFeeMaxRate, 100) + "%*借款金额）"}</div>
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </Col> : <Col span={16}>
                                    <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                        <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>收取金额</span></Col>
                                        <Col span={8} style={{ lineHeight: "22px", color: "#000" }}>不收取</Col>
                                    </Row>
                                </Col>}
                            </div>
                        </Row>
                        <Row className="product_card">
                            <div className="sh_inner_box">
                                <Col {...titleInfo}>
                                    <span className="product_card_title">违约金信息</span>
                                </Col>
                                {this.state.loanConfig.hasPenaltyOverdueFee ? <Col span={16}>
                                    {/* {this.state.loanConfig.hasPenaltyOverdueFeeGrace ? 
                                    <FormItem label={<span style={{ width: "100%" }}>宽限天数</span>} labelCol={{ span: 6 }} wrapperCol={{ span: 4 }} colon={false}>
                                        {getFieldDecorator("penaltyDaysOfGrace", {
                                            // initialValue: this.state.penaltyType_val,
                                            rules: [{ required: true, message: "请输入宽限天数" },{ pattern: /^[1-9]/, message: "格式错误" }]
                                        })(
                                            <Input placeholder="请输入" />
                                        )}
                                        <div className="formIcon" >天</div>
                                    </FormItem> : null} */}
                                    {this.state.loanConfig.penaltyOverdueFeeBase === "PHASE_FIXED" ? <FormItem label="收取金额" {...formInfoText}>
                                        {getFieldDecorator('penaltyOverdueFeePrePhaseAmount', {
                                            rules: [{ required: true, message: "请输入收取金额" }, { pattern: /^([0-9]+(\.[0-9]{1,2})?)$/, message: "格式错误" }]
                                        })(
                                            <Input placeholder="请输入" />
                                        )}
                                        <div className="formIcon" >元</div>
                                        <div className="formText" >/期</div>
                                    </FormItem> : <FormItem label="收取金额" {...formInfoText}>
                                        {getFieldDecorator('penaltyOverdueFeeRate', {
                                            rules: [{ required: true, message: "请输入收取金额" }, { pattern: /^([1-9]\d{0,3}?(\.\d{1,5})?|0\.\d{1,5})$/, message: "格式错误" }]
                                        })(
                                            <Input placeholder="请输入" />
                                        )}
                                        <div className="formIcon" >%</div>
                                        <div className="formText" >*{baseOver[this.state.loanConfig.penaltyOverdueFeeBase]}</div>
                                    </FormItem>}
                                    <Row>
                                        <Col
                                            span={6}
                                            style={{ textAlign: "right", fontSize: "14px", color: "rgba(0,0,0,0.5)", paddingRight: "20px", marginBottom: "15px", lineHeight: "32px" }}
                                        >
                                            <span>违约金收取上下限</span>
                                        </Col>
                                        <Col span={8}>
                                            <FormItem className="text_left" label="" {...formInfoSmall} >
                                                {getFieldDecorator('penaltyOverdueFeeMinAmount', {
                                                    rules: [{ pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "格式错误" }, { required: true, message: "请输入最低金额" }]
                                                })(
                                                    <Input placeholder="请输入最低金额" onBlur={(e) => { this.check_val(e, "penaltyOverdueFeeMinAmount", accDiv(this.state.loanConfig.penaltyOverdueFeeMinAmount, 100), "", true) }} />
                                                )}

                                            </FormItem>
                                        </Col>
                                        <Col span={1} pull={4} style={{ lineHeight: "32px" }}>——</Col>
                                        <Col span={8} pull={4} >
                                            <FormItem className="" label="" {...formInfoSmall} >
                                                {getFieldDecorator('penaltyOverdueFeeMaxRate', {
                                                    rules: [{ pattern: /^([1-9]\d{0,3}?(\.\d{1,5})?|0\.\d{1,5})$/, message: "格式错误" }, { required: true, message: "请输入最高百分比" }]
                                                })(
                                                    <Input placeholder="请输入最高百分比" onBlur={(e) => { this.check_val(e, "penaltyOverdueFeeMaxRate", 0, accMul(this.state.loanConfig.penaltyOverdueFeeMaxRate, 100), false) }} />
                                                )}

                                                <div className="formText" >%*借款金额</div>
                                                <div style={{ width: "300px", position: "absolute", left: "175%", top: "0" }}>{"（产品线范围：" + accDiv(this.state.loanConfig.penaltyOverdueFeeMinAmount, 100) + "元——" + accMul(this.state.loanConfig.penaltyOverdueFeeMaxRate, 100) + "%*借款金额）"}</div>
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </Col> : <Col span={16}>
                                    <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                        <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>收取金额</span></Col>
                                        <Col span={8} style={{ lineHeight: "22px", color: "#000" }}>不收取</Col>
                                    </Row>
                                </Col>}

                            </div>
                        </Row>

                    </div> : null}

                </Form> : <ProductDetail configNo={this.state.configNo} cooperator={this.state.cooperator} appKey={this.state.appKey} onRef={this.product_detail.bind(this)} detail={this.get_product_detail.bind(this)} appName={this.state.appName} />}

                {!this.state.product_config_finish && this.state.product_checked ? <Row style={{ textAlign: "center" }}>
                    <Button type="primary" onClick={this.submit.bind(this)}>确认，请填写业务信息</Button>
                </Row> : null}
                {this.state.product_config_finish ? <Row style={{ marginTop: "10px" }}>
                    {this.state.appKey === "cashloan" ? <BmdBusiness phase={this.state.tagArr} unit={type[this.state.loanLimit.rateUnit]} detail={this.state.product_detail_info} periodUnit_type={this.state.periodUnit_type} rate_type={this.state.loanLimit.rateUnit} configNo={this.state.configNo} domain={this.state.domain} appKey={this.state.appKey} configDetail={this.state.product_config_detail} isAdd={this.state.add} appName={this.state.appName} repayPlanTemplate={this.state.repayPlanTemplate} /> : <Business phase={this.state.tagArr} unit={type[this.state.loanLimit.rateUnit]} detail={this.state.product_detail_info} periodUnit_type={this.state.periodUnit_type} rate_type={this.state.loanLimit.rateUnit} configNo={this.state.configNo} domain={this.state.domain} appKey={this.state.appKey} configDetail={this.state.product_config_detail} isAdd={this.state.add} appName={this.state.appName} />}

                </Row> : null}
                {/* <Row style={{height:"50px",background:"#fff",position:"fixed",bottom:"0",right:"0",lineHeight:"50px",textAlign:"center",width:"calc(100% - 170px)",boxShadow:"0px -2px 4px 0px rgba(0,0,0,0.1)"}}>
                            <Button style={{marginRight:"30px"}} onClick={this.back.bind(this)}>取消</Button>
                            <Button type="primary" onClick={this.submit_sure.bind(this)}>确认</Button>
                    </Row> */}
                {/* <Modal {...submit}>
                        提交成功后后续订单将生效，请确认是否提交？
                    </Modal>
                    <Modal visible={this.state.previewVisible} onCancel={this.imgCancel.bind(this)} {...modal}>
                        <AddUser onRef={this.addUser.bind(this)} />
                    </Modal> */}
                <Modal {...leave}>
                    请确认是否取消，取消后填写的信息将消失
                </Modal>
            </div>
        )

    }
}
export default Form.create()(Basic);