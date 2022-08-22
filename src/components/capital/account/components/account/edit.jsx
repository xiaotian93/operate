import React, { Component } from 'react';
import { Row, Form, Col, Button, message, Modal,Spin } from 'antd';
import { capital_account_detail_info, capital_account_edit_info, merchant_online_add_merchant } from '../../../../../ajax/api';
import { axios_zj } from '../../../../../ajax/request';
import { browserHistory } from 'react-router';
import ComponentRoute from '../../../../../templates/ComponentRoute';
import { accDiv,bmd } from '../../../../../ajax/tool';
import FormInfo from './formModal';
import Count from './template/add';
import Rate from './template/rate';
import moment from 'moment';
class Product_cxfq extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            accountId: props.location.query.accountId,
            isleave: false,
            error: {
                type: false,
                name: "",
                text: ""
            },
            withholdFeeType: "1",
            repayFeeType: "1",
            spin:false
        };
        this.value = {
            repayFeeType:"1",
            withholdFeeType:"1"
        }
        this.base = [
            {
                label: "账户号/商户号",
                type: "text",
                text: "",
                param: "merchantId",
                rules: ""
            },
            {
                label: "账户主体",
                type: "text",
                text: "",
                param: "subject",
                rules: ""
            },
            {
                label: "内部账户编号",
                type: "input",
                text: "",
                param: "innerName",
                rules: ""
            },
            {
                label: "账户用途",
                type: "input",
                text: "",
                param: "usage",
                rules: [{ max: 20, message: "最多20个字符" }]
            },
            {
                label: "账户类型",
                type: "select",
                text: "",
                param: "shareStatus",
                rules: "",
                value: [{ name: "自有账户", val: "1" }, { name: "共管账户", val: "2" }, { name: "待定账户", val: "0" }]
            },
            {
                label: "开通日期",
                type: "date",
                text: "",
                param: "openingDate",
                rules: ""
            },
            {
                label: "绑定手机号",
                type: "input",
                text: "",
                param: "bindPhone",
                rules: [{ max: 100, message: "最多100个字符" }]
            },
            {
                label: "绑定手机号对应员工姓名",
                type: "input",
                text: "",
                param: "bindUser",
                rules: [{ max: 100, message: "最多100个字符" }]
            },
            {
                label: "对私付款单笔限额",
                type: "input",
                text: "",
                param: "payPersonalLimit",
                rules: [{ pattern: /^[0-9]+(\.[0-9]{1,4})?$/, message: "格式错误" }],
                unit:"元"
            },
            {
                label: "对公付款单笔限额",
                type: "input",
                text: "",
                param: "payCompanyLimit",
                rules: [{ pattern: /^[0-9]+(\.[0-9]{1,4})?$/, message: "格式错误" }],
                unit:"元"
            },
            {
                label: "加款流程",
                type: "textArea",
                text: "",
                param: "depositInfo",
                rules: [{ max: 1000, message: "最多1000个字符" }]
            },
            {
                label: "其他备注",
                type: "textArea",
                text: "",
                param: "otherComment",
                rules: [{ max: 1000, message: "最多1000个字符" }]
            },
        ]
        this.rate = [
            {
                label: "对私付款手续费",
                type: "input",
                text: "",
                param: "payPersonalFee",
                rules: [{ pattern: /^[0-9]+(\.[0-9]{1,4})?$/, message: "格式错误" }],
                unit:"元/笔"
            },
            {
                label: "对公付款手续费",
                type: "input",
                text: "",
                param: "payCompanyFee",
                rules: [{ pattern: /^[0-9]+(\.[0-9]{1,4})?$/, message: "格式错误" }],
                unit:"元/笔"
            },
            {
                label: "充值手续费",
                type: "input",
                text: "",
                param: "depositFee",
                rules: [{ pattern: /^[0-9]+(\.[0-9]{1,4})?$/, message: "格式错误" }],
                unit:"元/笔"
            },
            {
                label: "鉴权绑卡手续费",
                type: "input",
                text: "",
                param: "authenticateFee",
                rules: [{ pattern: /^[0-9]+(\.[0-9]{1,4})?$/, message: "格式错误" }],
                unit:"元/次"
            },
            {
                label: "协议支付收费方式",
                type: "radio",
                text: "",
                param: "repayFeeType",
                value: [{ val: "1", name: "按固定费率收取" }, { val: "2", name: "按笔收取" }],
            },
        ]
    }
    componentWillMount() {
        window.scrollTo(0,0);
        this.props.router.setRouteLeaveHook(
            this.props.route,
            this.routerWillLeave.bind(this)
        )
    }
    componentDidMount() {
        this.get_detail();
    }
    shouldComponentUpdate(props, state) {
        this.props.router.setRouteLeaveHook(
            this.props.route,
            this.routerWillLeave.bind(this)
        )
        return true

    }
    get_detail() {
        this.setState({
            spin:true
        })
        axios_zj.post(capital_account_detail_info, { accountId: this.state.accountId }).then(e => {
            if (!e.code) {
                this.setState({
                    spin:false
                })
                var data = e.data;
                for (var i in data) {
                    this.value[i] = data[i] === null ? "" : data[i];
                    if (i === "repayFeeType" || i === "withholdFeeType") {
                        this.setState({
                            [i]: data[i] ? data[i].toString() : "1",
                        })
                        this.value[i]=data[i] ? data[i].toString() : "1"
                    } else if(i==="openingDate"){
                        this.setState({
                            [i]: data[i]||moment().format("YYYY-MM-DD 00:00:00"),
                        })
                        this.value[i]=data[i]||moment().format("YYYY-MM-DD 00:00:00")
                    }else{
                        this.setState({
                            [i]: data[i],
                        })
                    }
                    if (data["repayFeeType"] === 1 && (i === "repayFeeMax" || i === "repayFeeMin" || i === "repayFeeRate")) {
                        this.repayChild.props.form.setFieldsValue({ [i]: (data[i]===""||data[i]===null)?"":accDiv(data[i], 100) })
                    }
                    if (data["withholdFeeType"] === 1 && (i === "withholdFeeMax" || i === "withholdFeeMin" || i === "withholdFeeRate")) {
                        this.holdChild.props.form.setFieldsValue({ [i]: (data[i]===""||data[i]===null)?"":accDiv(data[i], 100) })
                    }
                    if(data["repayFeeType"] === 2){
                        this.setState({repayFeeType_count:true})
                    }
                    if(data["withholdFeeType"] === 2){
                        this.setState({withholdFeeType_count:true})
                    }

                }
            }
        })
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
        browserHistory.push(this.state.next+"?accountId="+this.state.accountId)
    }
    //输入范围判定
    check_val(e, name, val, type) {
        this.setState({
            error: {
                type: false,
                name: "",
                text: ""
            }
        })
        var val_get = this.props.form.getFieldValue(val);
        if (val_get === "" || e.target.value === "") {
            return;
        }
        if (type) {
            if (Number(e.target.value) > Number(val_get)) {
                this.props.form.setFields({
                    [name]: {
                        errors: [new Error('不能大于最大范围')],
                        value: e.target.value
                    },
                });
                this.setState({
                    error: {
                        type: true,
                        name: name,
                        text: "不能大于最大范围",
                        value: e.target.value
                    }
                })
            } else {
                this.props.form.setFields({
                    [val]: {
                        value: val_get
                    },
                });
            }
        } else {
            if (Number(e.target.value) < Number(val_get)) {
                this.props.form.setFields({
                    [name]: {
                        errors: [new Error('不能小于最小范围')],
                        value: e.target.value
                    },
                });
                this.setState({
                    error: {
                        type: true,
                        name: name,
                        text: "不能小于最小范围",
                        value: e.target.value
                    }
                })
            } else {
                this.props.form.setFields({
                    [val]: {
                        value: val_get
                    },
                });
            }
        }
    }
    //cancel
    cancel() {
        browserHistory.push('/zj/account');
    }
    getValue(name, val) {
        if(name==="repayFeeType"){
            if(val==="1"){
                this.setState({ "repayFeeSection": "[]" })
            }else{
                this.setState({ "repayFeeBankSpec": "" })
            }
        }
        if(name==="withholdFeeType"&&val==="1"){
            this.setState({ "withholdFeeSection": "[]" })
        }
        this.value[name] = val 
        this.setState({ [name]: val })
    }
    sure() {
        // console.log(this.bankChild.arr)
        //协议支付
        var bank = this.bankChild?this.bankChild.arr:[], bankStr = [], repayArr = [], holdArr = [];
        bank.forEach(i => {
            var bankName = i.props.form.getFieldsValue();
            var rate = i.getValue();
            rate = Object.assign(rate, bankName);
            if(JSON.stringify(rate)!=="{}"){
                bankStr.push(rate);
            }
        })
        const repayCount = this.count ? this.count.arr : [];
        repayCount.forEach(item => {
            var repayCountValue = item.getValue();
            if(JSON.stringify(repayCountValue)!=="{}"){
                repayArr.push(repayCountValue)
            }
        })
        var rate = this.repayChild?this.repayChild.getValue():[];
        //直接代扣
        var holdCount = this.withhold ? this.withhold.arr : [];
        holdCount.forEach(item => {
            var repayCountValue = item.getValue();
            if(JSON.stringify(repayCountValue)!=="{}"){
                holdArr.push(repayCountValue)
            }
        })
        var holdRate = this.holdChild.getValue();
        var param = Object.assign(this.value, rate, holdRate);
        param.repayFeeBankSpec = JSON.stringify(bankStr);
        param.repayFeeSection = JSON.stringify(repayArr);
        param.withholdFeeSection = JSON.stringify(holdArr);
        for(var p in param){
            if(param[p]===""||param[p]==="[]"){
                delete param[p]
            }
        }
        console.log(param)

        // return;
        axios_zj.post(capital_account_edit_info, param).then(e=>{
            if(!e.code){
                this.setState({
                    leave: false,
                    isleave: true
                })
                message.success("编辑成功")
                bmd.redirect("/zj/account/info?accountId="+this.state.accountId)
            }
        })
    }
    CountOnref(e) {
        this.count = e
    }
    addCount() {
        this.count.add();
    }
    bank(e) {
        this.bankChild = e
    }
    addBank() {
        this.bankChild.add();
    }
    //直接代扣
    addCount_withhold(e) {
        this.withhold.add();
    }
    CountOnref_withhold(e) {
        this.withhold = e
    }
    repayFee(e) {
        this.repayChild = e
    }
    holdFee(e) {
        this.holdChild = e
    }
    render() {
        const modalInfo = {
            title: "重置",
            visible: this.state.visible,
            // onOk: this.onOk.bind(this),
            // onCancel: this.onCancel.bind(this),
            maskClosable: false
        };
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
            <Spin spinning={this.state.spin}>
                <div>
                <Form className="product_cxfq sh_add content" >
                    <Row style={{ marginBottom: "50px" }}>
                        <div className="card_cx">
                            <div className="title">
                                <div className="icon" />
                                <span className="titleWord">基本信息</span>
                            </div>
                            <div className="sh_add_card_product" style={{ padding: "0" }}>
                                <Row className="product_card">
                                    <div className="sh_inner_box">
                                        {this.base.map((i, k) => {
                                            return <FormInfo label={i.label} type={i.type} getValue={this.getValue.bind(this)} param={i.param} text={i.text} value={i.value} key={k} rules={i.rules} defalut={this.state[i.param]} unit={i.unit} />
                                        })}
                                    </div>
                                </Row>
                            </div>
                        </div>
                        <div className="card_cx">
                            <div className="title">
                                <div className="icon" />
                                <span className="titleWord">费率信息</span>
                            </div>
                            <div className="sh_add_card_product" style={{ padding: "0" }}>
                                <Row className="product_card">
                                    <div className="sh_inner_box">
                                        {this.rate.map((i, k) => {
                                            return <FormInfo label={i.label} type={i.type} getValue={this.getValue.bind(this)} param={i.param} text={i.text} value={i.value} key={k} add={this.addCount.bind(this)} defalut={this.state[i.param]} rules={i.rules} count={this.state.repayFeeType_count} unit={i.unit} />
                                        })}
                                        {
                                            this.state.repayFeeType === "1" ? <div><Rate rate="repayFeeRate" max="repayFeeMax" min="repayFeeMin" onRef={this.repayFee.bind(this)} /><div>
                                                <Row style={{ marginBottom: 18 }}><Col span={4} style={{ fontSize: 14, color: "rgba(0,0,0,0.5)", textAlign: "right", paddingRight: 10 }}>特殊银行费率</Col><Col span={2}><Button onClick={this.addBank.bind(this)} type="primary">添加特殊银行</Button></Col></Row>
                                                <Count onRef={this.bank.bind(this)} type="bank" empty param="repayFeeBankSpec" defalut={this.state.repayFeeBankSpec||"[]"} />
                                            </div></div> : <Count onRef={this.CountOnref.bind(this)} defalut={this.state.repayFeeSection&&this.state.repayFeeSection!=="[]"?this.state.repayFeeSection:"[1]"} param="repayFeeSection" />
                                        }
                                        <FormInfo label="直接代扣收费方式" type="radio" getValue={this.getValue.bind(this)} param="withholdFeeType" value={[{ val: "1", name: "按固定费率收取" }, { val: "2", name: "按笔收取" }]} add={this.addCount_withhold.bind(this)} defalut={this.state.withholdFeeType} count={this.state.withholdFeeType_count} />
                                        {
                                            this.state.withholdFeeType === "1" ? <Rate rate="withholdFeeRate" min="withholdFeeMin" max="withholdFeeMax" onRef={this.holdFee.bind(this)} rateName="直接代扣费率" /> : <Count onRef={this.CountOnref_withhold.bind(this)} defalut={this.state.withholdFeeSection&&this.state.withholdFeeSection!=="[]"?this.state.withholdFeeSection:"[1]"} param="withholdFeeSection" />
                                        }
                                    </div>
                                </Row>
                            </div>
                        </div>
                        <div className="card_cx">
                            <div className="title">
                                <div className="icon" />
                                <span className="titleWord">账号信息</span>
                            </div>
                            <div className="sh_add_card_product" style={{ padding: "0" }}>
                                <Row className="product_card">
                                    <div className="sh_inner_box">
                                        <FormInfo label="账号信息" type="textArea" getValue={this.getValue.bind(this)} param="accountInfo" rules={[{ max: 200, message: "最多200个字符" }]} defalut={this.state.accountInfo} />
                                    </div>
                                </Row>
                            </div>
                        </div>
                    </Row>

                    <Row style={{ height: "50px", background: "#fff", position: "fixed", bottom: "0", right: "0", lineHeight: "50px", textAlign: "center", width: "calc(100% - 170px)", boxShadow: "0px -2px 4px 0px rgba(0,0,0,0.1)" }}>
                        {/* <Button onClick={this.clickReset.bind(this)}>重置</Button> */}
                        <Button onClick={this.cancel.bind(this)}>取消</Button>
                        <Button type="primary" style={{ marginLeft: '30px' }} onClick={this.sure.bind(this)}>保存</Button>
                    </Row>
                </Form>
                <Modal {...modalInfo}><span style={{ fontSize: "14px" }}>确认清空当前内容？</span></Modal>
                <Modal {...leave}>
                    请确认是否取消,取消后填写的信息将消失。
                </Modal>
                <style>
                    {`
                        .formWhite .ant-form-item-label label:after{
                            display:none
                        }
                        .ant-form-item-required:before{
                            display:none
                        }
                        .ant-form-item-required:after{
                            margin-right:11px!important;
                        }
                        .ant-select-selection__placeholder, .ant-select-search__field__placeholder{
                            color:#000!important;
                        }
                    `}
                </style>
                </div>
            </Spin>
        )
    }
}
export default ComponentRoute(Form.create()(Product_cxfq));