import React, { Component } from 'react';
import { Row, Col, Form, Input, Modal, Radio, Button, message, Select, Icon, Tooltip } from 'antd';
import { xjd_product, xjd_product_detail, xjd_product_update, xjd_product_detail_user, xjd_product_select } from '../../../ajax/api';
// import Repay from './repayBank';
import { axios_xjd_p } from '../../../ajax/request';
import Tag from './tag';
import Dynamic from './DynamicFieldSet';
import AddUser from './addUser';
import { browserHistory } from 'react-router';
import { accMul, accDiv } from '../../../ajax/tool.js';
const RadioGroup = Radio.Group;
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
            id: props.location.query.id,
            userEdit: [],
            userArr: { data: [] },
            product_sel: [],
            product_config: {
                minLoanAmount: 0,
                maxLoanAmount: 0
            },
            product_name: "",
            check_result: true
        };
        this.product = []
    }
    componentWillMount() {
        this.getSelect();
        if (this.state.id) {
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
        axios_xjd_p.get(xjd_product_select).then(e => {
            if (!e.code) {
                this.setState({
                    product_sel: e.data
                })
            }
        })
    }

    editData() {
        axios_xjd_p.get(xjd_product_detail + "?code=" + this.state.id).then(e => {
            if (!e.code) {
                // this.props.form.setFieldsValue({ code: e.data.code,desc:e.data.desc});
                this.product_info(e.data.code);
                var data = e.data.childConfig;
                if (this.state.product_del) {
                    message.warn("该产品不存在");
                    return;
                }
                for (var i in data) {
                    if (i === "advanceSettleFeePercent" || i === "maxRealYearRate" || i === "minRealYearRate" || i === "dailyOverdueRate" || i === "penaltyPercent") {
                        if (data[i] !== null) {
                            this.props.form.setFieldsValue({ [i]: accMul(data[i], 100) });
                        }

                    } else if (i === "minAmount" || i === "maxAmount" || i === "penaltyAmount") {
                        this.props.form.setFieldsValue({ [i]: accDiv(data[i], 100) });
                    } else if (i === "totalPeriodList") {
                        this.setState({
                            tagArr: JSON.parse(data[i])
                        });
                        this.tag_child.setState({
                            tags: JSON.parse(data[i])
                        })
                        this.props.form.setFieldsValue({ [i]: data[i] });
                    } else if (i === "creaperiodGapteTime" || i === "overdueDaysOfGrace" || i === "penaltyDaysOfGrace" || i === "creditValidity" || i === "identityValidity" || i === "loanResubmitValidity" || i === "reCreditValidity" || i === "resubmitValidity" || i === "allowInputLoanAmount" || i === "periodGap" || i === "desc" || i === "code") {

                        // if (data[i]) {
                        if (i === "allowInputLoanAmount") {
                            this.props.form.setFieldsValue({ [i]: data[i] });
                        } else {
                            this.props.form.setFieldsValue({ [i]: data[i].toString() });
                            this.setState({
                                periodUnit_type: e.data.parentConfig.loanTermType,
                                product_gap: data.periodGap
                            })
                        }

                        // }
                    }
                }
            }
        })
        axios_xjd_p.get(xjd_product_detail_user + "?code=" + this.state.id).then(e => {
            if (!e.code) {
                var arr = e.data;
                var map = {},
                    dest = [];
                for (var i = 0; i < arr.length; i++) {
                    var ai = arr[i];
                    if (!map[ai.key]) {
                        dest.push({
                            id: ai.key,
                            data: [ai]
                        });
                        map[ai.key] = ai;
                    } else {
                        for (var j = 0; j < dest.length; j++) {
                            var dj = dest[j];
                            if (dj.id === ai.key) {
                                dj.data.push(ai);
                                break;
                            }
                        }
                    }
                }

                var userEdits = [];
                for (let p in dest) {
                    userEdits.push(Number(p))
                }
                this.setState({
                    userArr: dest,
                    userEdit: userEdits
                })
            }
        })
    }

    imgCancel() {
        this.setState({
            previewVisible: false
        })
    }
    user(e) {
        this.user_child = e;
    }
    add() {
        this.user_child.add();
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
            visible_submit:false
        })
        var productUserGroupList = this.user_child.handleSubmit();
        if (productUserGroupList.length < 1) {
            message.warn("请先配置用户群");
            return;
        }
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
                console.log(values)
                // return;
                values.advanceSettleFeePercent = values.advanceSettleFeePercent ? values.advanceSettleFeePercent : 0;
                values.dailyOverdueRate = values.dailyOverdueRate ? values.dailyOverdueRate : 0;
                values.overdueDaysOfGrace = values.overdueDaysOfGrace ? values.overdueDaysOfGrace : 0;
                values.penaltyDaysOfGrace = values.penaltyDaysOfGrace ? values.penaltyDaysOfGrace : 0;
                // values.penaltyPercent = values.penaltyPercent ? values.penaltyPercent : 0;
                values.productUserGroupList = productUserGroupList;
                values.totalPeriodList = this.state.tagArr;
                values.minAmount = accMul(values.minAmount, 100);
                values.maxAmount = accMul(values.maxAmount, 100);
                values.penaltyAmount = accMul(values.penaltyAmount, 100);
                if (values.dailyOverdueRate) {
                    values.dailyOverdueRate = accDiv(values.dailyOverdueRate, 100)
                }
                if (values.advanceSettleFeePercent) {
                    values.advanceSettleFeePercent = accDiv(values.advanceSettleFeePercent, 100)
                }
                if (values.penaltyPercent) {
                    values.penaltyPercent = accDiv(values.penaltyPercent, 100)
                }
                if (values.minRealYearRate) {
                    values.minRealYearRate = accDiv(values.minRealYearRate, 100)
                }
                if (values.maxRealYearRate) {
                    values.maxRealYearRate = accDiv(values.maxRealYearRate, 100)
                }

                if (!this.state.id) {
                    axios_xjd_p.post(xjd_product, values).then(e => {
                        if (!e.code) {
                            // var id = e.data;
                            message.success("新增成功");
                            browserHistory.push("/sh/bmd/");
                        }
                    })
                } else {
                    // values.id = this.state.id;
                    axios_xjd_p.post(xjd_product_update, values).then(e => {
                        if (!e.code) {
                            // var id=e.data;
                            message.success("编辑成功");
                            browserHistory.push("/sh/bmd/");
                        }
                    })
                }



            }

        });
    }
    //选择产品
    change_product(val) {
        this.product_info(val);
    }
    product_info(val) {
        this.setState({
            product_del: true
        })
        for (var i in this.state.product_sel) {
            if (this.state.product_sel[i].code === val) {
                this.setState({
                    product_name: this.state.product_sel[i].name + "(" + this.state.product_sel[i].code + ")",
                    product_config: this.state.product_sel[i].config,
                    product_checked: val,
                    periodUnit_type: this.state.product_sel[i].config.loanTermType,
                    product_del: false,
                    product_desc: this.state.product_sel[i].desc
                })
            }
        }
    }
    //输入值检验
    check_val(input_val, str, valMin, valMax, type) {
        this.setState({
            check_result: true,
            error: {
                name: "",
                value: ""
            }
        });
        var check=false,checkText="";
        var type_str={
            minAmount:{
                text:"maxAmount",
                val:"max"
            },
            maxAmount:{
                text:"minAmount",
                val:"min"
            },
            minRealYearRate:{
                text:"maxRealYearRate",
                val:"max"
            },
            maxRealYearRate:{
                text:"minRealYearRate",
                val:"min"
            }
        }
        var getVal=this.props.form.getFieldValue(type_str[str]["text"]);
        if(type_str[str]){
            if(type_str[str].val==="max"&&getVal!==undefined&&Number(input_val.target.value)>Number(getVal)){
                check=true;
                checkText="不能高于最高值"
            }
            if(type_str[str].val==="min"&&getVal!==undefined&&Number(input_val.target.value)<Number(getVal)){
                check=true
                checkText="不能低于最低值"
            }
        }
        // var type = { "minAmount": "借款金额范围", "maxAmount": "借款金额范围", "minRealYearRate": "实际年化综合费率范围", "maxRealYearRate": "实际年化综合费率范围", "advanceSettleFeePercent": "提前结清金额范围", "dailyOverdueRate": "逾期罚息金额范围", "penaltyPercent": "违约金金额范围", "penaltyAmount": "违约金金额范围" }
        if (Number(input_val.target.value) < Number(valMin) || Number(input_val.target.value) > Number(valMax)||check) {
            this.props.form.setFields({
                [str]: {
                    errors: [new Error(check?checkText:'需在产品线限制内')],
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
        }else{
            this.props.form.setFields({
                [type_str[str]['text']]: {
                    value: Number(getVal)
                },
            });
        }

    }
    //获取间隔期限
    getGap(e) {
        this.setState({
            product_gap: e.target.value
        })
    }
    submit_cancel(){
        this.setState({
            visible_submit:false
        })
    }
    submit_sure(){
        this.setState({
            visible_submit:true
        })
    }
    back(){
        browserHistory.push("/sh/bmd");
    }
    render() {
        window.form = this.props.form;
        // var value=window.localStorage.getItem("detail")?JSON.parse(window.localStorage.getItem("detail")).basic.productIds:[];
        const { getFieldDecorator } = this.props.form;
        const formInfo = {
            labelCol: { span: 5 },
            wrapperCol: { span: 6 },
            colon: false
        };

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
        const modal = {
            title: "创建用户群",
            footer: <div><Button size="small" onClick={this.imgCancel.bind(this)}>取消</Button><Button size="small" type="primary" onClick={this.add.bind(this)}>确定</Button></div>
        }
        // const confirm = {
        //     title: "提交成功后后续订单将生效，请确认是否提交？",
        //     okText: "确定",
        //     cancelText: "取消",
        //     onConfirm: this.submit.bind(this),
        // }
        const type = { "DAY": "日", "MONTH": "月", "YEAR": "年" };
        const type_term = { "DAY": "日", "MONTH": "个月", "YEAR": "年" };
        const commissionRACollectType = { "CURRENT": "当期收取后续期数减免", "ALL": "当期收取后续期数不减免", "CAL_DAY": "按日计收" };
        const base = { "PHASE_FIXED": "元/期", "BALANCE": "贷款余额/日", "PHASE_PRINCIPAL_RATE": "未还本息/日", "PHASE_PRINCIPAL": "未还本金/日" }
        const baseOver = { "PHASE_FIXED": "元/期", "BALANCE": "贷款余额", "PHASE_PRINCIPAL_RATE": "未还本息", "PHASE_PRINCIPAL": "未还本金" };
        const leave = {
            visible: this.state.leave,
            maskClosable: false,
            closable: false,
            onOk: this.leaveClose.bind(this),
            onCancel: this.leaveOk.bind(this),
            cancelText: "取消",
            okText: "确认退出",
            title: "退出确认"
        }
        const submit={
            visible: this.state.visible_submit,
            maskClosable: false,
            closable: false,
            onOk: this.submit.bind(this),
            onCancel: this.submit_cancel.bind(this),
            cancelText: "取消",
            okText: "确认",
            title: "提交确认"
        }
        return (
            <div>

                <Form className="sh_add content">
                    <Row className="sh_add_product">
                        <div className="sh_inner_box">
                            <Col {...titleInfo} style={{ marginTop: "5px" }}>
                                <span className="product_card_title">开通产品</span>
                            </Col>
                            <Col span={16} pull={2}>
                                <FormItem wrapperCol={{ span: 6 }} >
                                    {getFieldDecorator('code', {
                                        rules: [{ required: true, message: "请选择要开通的产品名称" }],
                                        // initialValue:this.state.product_checked
                                    })(
                                        <Select placeholder="请选择要开通的产品名称" className="selectMore" style={{ width: '100%' }} onChange={this.change_product.bind(this)} >
                                            {this.state.product_sel.map((i, k) => {
                                                return <Option value={i.code} key={k} aa={i} disabled={i.config.repayType ? false : true}>{i.name}</Option>
                                            })}
                                        </Select>
                                    )}


                                </FormItem>
                            </Col>

                        </div>
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
                                        <Col span={8} style={{ lineHeight: "22px", color: "#000" }}>{this.state.product_name}<Tooltip title={this.state.product_desc}><Icon type="info-circle" style={{ marginLeft: "5px", cursor: "pointer",color:"#1B84FF" }} /></Tooltip></Col>
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
                                                {getFieldDecorator('minAmount', {
                                                    rules: [{ pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "格式错误" }, { required: true, message: "请输入最低额度" }]
                                                })(
                                                    <Input placeholder="请输入最低额度" onBlur={(e) => { this.check_val(e, "minAmount", accDiv(this.state.product_config.minLoanAmount, 100), accDiv(this.state.product_config.maxLoanAmount, 100), true) }} />
                                                )}

                                            </FormItem>
                                        </Col>
                                        <Col span={1} pull={4} style={{ lineHeight: "32px" }}>——</Col>
                                        <Col span={8} pull={4} >
                                            <FormItem className="" label="" {...formInfoSmall} >
                                                {getFieldDecorator('maxAmount', {
                                                    rules: [{ pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "格式错误" }, { required: true, message: "请输入最高额度" }]
                                                })(
                                                    <Input placeholder="请输入最高额度" onBlur={(e) => { this.check_val(e, "maxAmount", accDiv(this.state.product_config.minLoanAmount, 100), accDiv(this.state.product_config.maxLoanAmount, 100), false) }} />
                                                )}

                                                <div className="formText" >元</div>
                                                <div style={{ width: "300px", position: "absolute", left: "120%", top: "0" }}>{"（产品线范围：" + accDiv(this.state.product_config.minLoanAmount, 100) + "——" + accDiv(this.state.product_config.maxLoanAmount, 100) + "元）"}</div>
                                            </FormItem>
                                        </Col>

                                    </Row>
                                    <FormItem label={<span style={{ width: "100%" }}>是否允许自选借款金额</span>} labelCol={{ span: 6 }} wrapperCol={{ span: 8 }} colon={false}>
                                        {getFieldDecorator("allowInputLoanAmount", {
                                            initialValue: "",
                                            rules: [{ required: true, message: "请选择" }]
                                        })(
                                            <RadioGroup>
                                                <Radio value>允许</Radio>
                                                <Radio value={false}>不允许</Radio>
                                            </RadioGroup>
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
                                                {getFieldDecorator('minRealYearRate', {
                                                    rules: [{ pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "格式错误" }, { required: true, message: "请输入最低年化" }]
                                                })(
                                                    <Input placeholder="请输入最低年化" onBlur={(e) => { this.check_val(e, "minRealYearRate", accMul(this.state.product_config.minYearRate, 100), accMul(this.state.product_config.maxYearRate, 100), true) }} />
                                                )}

                                            </FormItem>
                                        </Col>
                                        <Col span={1} pull={4} style={{ lineHeight: "32px" }}>——</Col>
                                        <Col span={8} pull={4} >
                                            <FormItem className="" label="" {...formInfoSmall} >
                                                {getFieldDecorator('maxRealYearRate', {
                                                    rules: [{ pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "格式错误" }, { required: true, message: "请输入最高年化" }]
                                                })(
                                                    <Input placeholder="请输入最高年化" onBlur={(e) => { this.check_val(e, "maxRealYearRate", accMul(this.state.product_config.minYearRate, 100), accMul(this.state.product_config.maxYearRate, 100), false) }} />
                                                )}

                                                <div className="formText" >%</div>
                                                <div style={{ width: "300px", position: "absolute", left: "120%", top: "0" }}>{"（产品线范围：" + accMul(this.state.product_config.minYearRate, 100) + "——" + accMul(this.state.product_config.maxYearRate, 100) + "%）"}</div>
                                            </FormItem>
                                        </Col>

                                    </Row>
                                    <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                        <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>借款期限单位</span></Col>
                                        <Col span={8} style={{ lineHeight: "22px", color: "#000" }}>{type[this.state.product_config.loanTermType]}</Col>
                                    </Row>
                                    <FormItem label="每期间隔" labelCol={{ span: 6 }} wrapperCol={{ span: 8 }} colon={false}>
                                        {getFieldDecorator("periodGap", {
                                            initialValue: "",
                                            rules: [{ required: true, message: "请输入" }, { pattern: /^[1-9]\d*$/, message: "格式错误" }]
                                        })(
                                            <Input placeholder="请输入每期间隔" onChange={this.getGap.bind(this)} onBlur={(e) => { this.check_val(e, "periodGap", 1, this.state.product_config.maxLoanTerm) }} />
                                        )}
                                        <div className="formIcon">{type_term[this.state.product_config.loanTermType]}</div>
                                    </FormItem>
                                    <FormItem label={<span style={{ width: "100%", marginRight: "12px" }}>支持期数</span>} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} colon={false}>
                                        {getFieldDecorator("totalPeriodList", {
                                            initialValue: "",
                                            // rules: [{ required: true, message: "请输入" }]
                                        })(
                                            <Tag onRef={this.tag.bind(this)} get_tag={this.getTag.bind(this)} minLoanTerm={this.state.product_config.minLoanTerm} maxLoanTerm={this.state.product_config.maxLoanTerm} loanTermType={this.state.product_config.loanTermType} gap={this.state.product_gap} />
                                        )}
                                    </FormItem>

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
                                        <Col span={8} style={{ lineHeight: "22px", color: "#000" }}>{this.state.product_config.supportRAConfirm ? "允许" : "不允许"}</Col>
                                    </Row>
                                    <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                        <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>提前还款时综合费用收取方式</span></Col>
                                        <Col span={8} style={{ lineHeight: "40px", color: "#000" }}>{commissionRACollectType[this.state.product_config.commissionRACollectType]}</Col>
                                    </Row>
                                </Col>
                            </div>
                        </Row>

                        <Row className="product_card">
                            <div className="sh_inner_box">
                                <Col {...titleInfo}>
                                    <span className="product_card_title">提前结清信息</span>
                                </Col>
                                {this.state.product_config.supportRepayAheadAll ? <Col span={16}>
                                    <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                        <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>提前结清时综合费用收取方式</span></Col>
                                        <Col span={8} style={{ lineHeight: "40px", color: "#000" }}>{commissionRACollectType[this.state.product_config.commissionRAACollectType]}</Col>
                                    </Row>
                                    {this.state.product_config.penaltyFeeAheadSupport ? <FormItem label="手续费收取金额" {...formInfoText}>
                                        {getFieldDecorator('advanceSettleFeePercent', {
                                            rules: [{ required: true, message: "请输入手续费收取金额" }, { pattern: /^[0-9]+(\.[0-9]{1,5})?$|100$/, message: "格式错误" }]
                                        })(
                                            <Input placeholder="请输入" onBlur={(e) => { this.check_val(e, "advanceSettleFeePercent", 0, accMul(this.state.product_config.penaltyFeeAheadMaxRate, 100), false) }} />
                                        )}

                                        <div className="formIcon" >%</div>
                                        <div className="formText" style={{ width: "200px" }} >*贷款余额</div>
                                        <div style={{ width: "300px", position: "absolute", left: "160%", top: "0" }}>{"（产品线范围：" + (this.state.product_config.penaltyFeeAheadMinAmount ? accDiv(this.state.product_config.penaltyFeeAheadMinAmount, 100) : 0) + "元——" + accMul(this.state.product_config.penaltyFeeAheadMaxRate, 100) + "%*贷款余额）"}</div>
                                    </FormItem> : <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                            <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>手续费收取金额</span></Col>
                                            <Col span={8} style={{ lineHeight: "40px", color: "#000" }}>不收取</Col>
                                        </Row>}

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
                                {this.state.product_config.overdueFeeSupport ? <Col span={16}>
                                    {this.state.product_config.overdueFeeSupportFreeDay ? <FormItem label={<span style={{ width: "100%" }}>宽限天数</span>} labelCol={{ span: 6 }} wrapperCol={{ span: 4 }} colon={false}>
                                        {getFieldDecorator("overdueDaysOfGrace", {
                                            // initialValue: this.state.dailyOverdueRateType_val,
                                            rules: [{ required: true, message: "请输入宽限天数" }]
                                        })(
                                            <Input placeholder="请输入" />
                                        )}
                                        <div className="formIcon" >天</div>
                                    </FormItem> : null}
                                    <FormItem label="收取金额" {...formInfoText}>
                                        {getFieldDecorator('dailyOverdueRate', {
                                            rules: [{ required: true, message: "请输入收取金额" }, { pattern: /^[0-9]+(\.[0-9]{1,5})?$|100$/, message: "格式错误" }]
                                        })(
                                            <Input placeholder="请输入" onBlur={(e) => { this.check_val(e, "dailyOverdueRate", 0, accMul(this.state.product_config.overdueFeeMaxRate, 100), false) }} />
                                        )}
                                        <div className="formIcon" >%</div>
                                        <div className="formText" >*{base[this.state.product_config.overdueFeeBase]}</div>
                                        <div style={{ width: "300px", position: "absolute", left: "175%", top: "0" }}>{"（产品线范围：" + (this.state.product_config.overdueFeeMinAmount ? accDiv(this.state.product_config.overdueFeeMinAmount, 100) : 0) + "元——" + accMul(this.state.product_config.overdueFeeMaxRate, 100) + "%*贷款金额）"}</div>
                                    </FormItem>
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
                                {this.state.product_config.penaltyOverdueFeeSupport ? <Col span={16}>
                                    {this.state.product_config.penaltyOverdueFeeSupportFreeDay ? <FormItem label={<span style={{ width: "100%" }}>宽限天数</span>} labelCol={{ span: 6 }} wrapperCol={{ span: 4 }} colon={false}>
                                        {getFieldDecorator("penaltyDaysOfGrace", {
                                            // initialValue: this.state.penaltyType_val,
                                            rules: [{ required: true, message: "请输入宽限天数" }]
                                        })(
                                            <Input placeholder="请输入" />
                                        )}
                                        <div className="formIcon" >天</div>
                                    </FormItem> : null}
                                    {this.state.product_config.penaltyOverdueFeeBase === "PHASE_FIXED" ? <FormItem label="收取金额" {...formInfoText}>
                                        {getFieldDecorator('penaltyAmount', {
                                            rules: [{ required: true, message: "请输入收取金额" }, { pattern: /^[0-9]+(\.[0-9]{1,5})?$|100$/, message: "格式错误" }]
                                        })(
                                            <Input placeholder="请输入" onBlur={(e) => { this.check_val(e, "penaltyAmount", accDiv(this.state.product_config.penaltyOverdueFeeMinAmount, 100), 100000, false) }} />
                                        )}
                                        <div className="formIcon" >元</div>
                                        <div className="formText" >/期</div>
                                        <div style={{ width: "300px", position: "absolute", left: "120%", top: "0" }}>{"（产品线范围：" + (this.state.product_config.penaltyOverdueFeeMinAmount ? accDiv(this.state.product_config.penaltyOverdueFeeMinAmount, 100) : 0) + "元——" + accMul(this.state.product_config.penaltyOverdueFeeMaxRate, 100) + "%*贷款金额）"}</div>
                                    </FormItem> : <FormItem label="收取金额" {...formInfoText}>
                                            {getFieldDecorator('penaltyPercent', {
                                                rules: [{ required: true, message: "请输入收取金额" }, { pattern: /^[0-9]+(\.[0-9]{1,5})?$|100$/, message: "格式错误" }]
                                            })(
                                                <Input placeholder="请输入" onBlur={(e) => { this.check_val(e, "penaltyPercent", 0, accMul(this.state.product_config.penaltyOverdueFeeMaxRate, 100), false) }} />
                                            )}
                                            <div className="formIcon" >%</div>
                                            <div className="formText" >*{baseOver[this.state.product_config.penaltyOverdueFeeBase]}</div>
                                            <div style={{ width: "300px", position: "absolute", left: "165%", top: "0" }}>{"（产品线范围：" + (this.state.product_config.penaltyOverdueFeeMinAmount ? accDiv(this.state.product_config.penaltyOverdueFeeMinAmount, 100) : 0) + "元——" + accMul(this.state.product_config.penaltyOverdueFeeMaxRate, 100) + "%*贷款余额）"}</div>
                                        </FormItem>}
                                </Col> : <Col span={16}>
                                        <Row style={{ marginBottom: "10px", fontSize: "14px" }}>
                                            <Col span={6}><span style={{ width: "90%", paddingRight: "5px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>收取金额</span></Col>
                                            <Col span={8} style={{ lineHeight: "22px", color: "#000" }}>不收取</Col>
                                        </Row>
                                    </Col>}

                            </div>
                        </Row>
                    </div> : null}
                    {this.state.product_checked ? <div className="sh_add_card">
                        <div className="sh_inner_box">
                            <span className="sh_add_title">用户群配置</span>
                            <Button type="primary" onClick={this.add.bind(this)} style={{ marginLeft: "20px" }} icon="plus">新增用户群</Button>
                            <Dynamic onRef={this.user.bind(this)} periodUnit={this.state.periodUnit_type} tag={this.state.tagArr} id={this.state.id} user_key={this.state.userEdit} user_data={this.state.userArr} />
                        </div>
                    </div> : null}

                    {this.state.product_checked ? <div className="sh_add_card">
                        <div className="sh_inner_box">
                            <div className="sh_add_title">有效期配置</div>
                            <FormItem label="首借额度失效时间" {...formInfo} >
                                {getFieldDecorator('creditValidity', {
                                    initialValue: "",
                                    rules: [{ required: true, message: "请输入" }, { pattern: /^([1-9]\d{0,3}|10000)$/, message: "格式错误" }]
                                })(
                                    <Input placeholder="请输入" />
                                )}
                                <div className="formText" >天</div>
                            </FormItem>
                            <FormItem label="复借额度失效时间" {...formInfo} >
                                {getFieldDecorator('reCreditValidity', {
                                    initialValue: "",
                                    rules: [{ required: true, message: "请输入" }, { pattern: /^([1-9]\d{0,3}|10000)$/, message: "格式错误" }]
                                })(
                                    <Input placeholder="请输入" />
                                )}
                                <div className="formText" >天</div>
                            </FormItem>
                            <FormItem label="额度评估失败后重新提交时间" {...formInfo} >
                                {getFieldDecorator('resubmitValidity', {
                                    initialValue: "",
                                    rules: [{ required: true, message: "请输入" }, { pattern: /^([1-9]\d{0,3}|10000)$/, message: "格式错误" }]
                                })(
                                    <Input placeholder="请输入" />
                                )}
                                <div className="formText" >天</div>
                            </FormItem>
                            <FormItem label="借款审核失败后重新提交时间" {...formInfo} >
                                {getFieldDecorator('loanResubmitValidity', {
                                    initialValue: "",
                                    rules: [{ required: true, message: "请输入" }, { pattern: /^([1-9]\d{0,3}|10000)$/, message: "格式错误" }]
                                })(
                                    <Input placeholder="请输入" />
                                )}
                                <div className="formText" >天</div>
                            </FormItem>
                            <FormItem label="活体有效期" {...formInfo} >
                                {getFieldDecorator('identityValidity', {
                                    initialValue: "",
                                    rules: [{ required: true, message: "请输入" }, { pattern: /^([1-9]\d{0,3}|10000)$/, message: "格式错误" }]
                                })(
                                    <Input placeholder="请输入" />
                                )}
                                <div className="formText" >天</div>
                            </FormItem>
                        </div>
                    </div> : null}

                    <Row style={{height:"50px",background:"#fff",position:"fixed",bottom:"0",right:"0",lineHeight:"50px",textAlign:"center",width:"calc(100% - 170px)",boxShadow:"0px -2px 4px 0px rgba(0,0,0,0.1)"}}>
                        {/* <Popconfirm {...confirm}> */}
                            <Button style={{marginRight:"30px"}} onClick={this.back.bind(this)}>取消</Button>
                            <Button type="primary" onClick={this.submit_sure.bind(this)}>确认</Button>
                        {/* </Popconfirm> */}
                    </Row>
                    <Modal {...submit}>
                        提交成功后后续订单将生效，请确认是否提交？
                    </Modal>
                    <Modal visible={this.state.previewVisible} onCancel={this.imgCancel.bind(this)} {...modal}>
                        <AddUser onRef={this.addUser.bind(this)} />
                    </Modal>
                    <Modal {...leave}>
                        是否确认退出此页面？退出后您当前录入的信息将不可保存。
                </Modal>
                </Form>
            </div>
        )

    }
}
export default Form.create()(Basic);