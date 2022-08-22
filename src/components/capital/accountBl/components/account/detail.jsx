import React, { Component } from 'react';
import { Row, Form, Col, Table } from 'antd';
import { capital_bl_account_detail_info } from '../../../../../ajax/api';
import { axios_zj } from '../../../../../ajax/request';
import ComponentRoute from '../../../../../templates/ComponentRoute';
import { accDiv, bmd, format_table_data } from '../../../../../ajax/tool';
import FormInfo from './formModal';
import Permissions from '../../../../../templates/Permissions';
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
            authenticateFees: "1",
            repayFeeBankSpec: "[]",
            withholdFeeSection: "[]",
            repayFeeSection: "[]"
        };
        this.value = {}
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
                type: "text",
                text: "",
                param: "innerName",
                rules: ""
            },
            {
                label: "账户用途",
                type: "text",
                text: "",
                param: "usage",
                rules: [{ max: 20, message: "最多20个字符" }]
            },
            {
                label: "账户类型",
                type: "text",
                text: "",
                param: "shareStatus",
                rules: "",
                value: { 1: "自有账户", 2: "共管账户", 0: "待定账户" }
            },
            {
                label: "开通日期",
                type: "text",
                text: "",
                param: "openingDate",
                rules: ""
            },
            {
                label: "绑定手机号",
                type: "text",
                text: "",
                param: "bindPhone",
                rules: [{ max: 100, message: "最多100个字符" }]
            },
            {
                label: "绑定手机号对应员工姓名",
                type: "text",
                text: "",
                param: "bindUser",
                rules: [{ max: 100, message: "最多100个字符" }]
            },
            {
                label: "对私付款单笔限额",
                type: "text",
                text: "",
                param: "payPersonalLimit",
                rules: [{ pattern: /^[0-9]+(\.[0-9]{1,4})?$/, message: "格式错误" }],
                unit: "元"
            },
            {
                label: "对公付款单笔限额",
                type: "text",
                text: "",
                param: "payCompanyLimit",
                rules: [{ pattern: /^[0-9]+(\.[0-9]{1,4})?$/, message: "格式错误" }],
                unit: "元"
            },
            {
                label: "加款流程",
                type: "text",
                text: "",
                param: "depositInfo",
                rules: [{ max: 1000, message: "最多1000个字符" }]
            },
            {
                label: "其他备注",
                type: "text",
                text: "",
                param: "otherComment",
                rules: [{ max: 1000, message: "最多1000个字符" }]
            },
        ]
        this.rate = [
            {
                label: "对私付款手续费",
                type: "text",
                text: "",
                param: "payPersonalFee",
                rules: [{ pattern: /^[0-9]+(\.[0-9]{1,4})?$/, message: "格式错误" }],
                unit: "元/笔"
            },
            {
                label: "对公付款手续费",
                type: "text",
                text: "",
                param: "payCompanyFee",
                rules: [{ pattern: /^[0-9]+(\.[0-9]{1,4})?$/, message: "格式错误" }],
                unit: "元/笔"
            },
            {
                label: "充值手续费",
                type: "text",
                text: "",
                param: "depositFee",
                rules: [{ pattern: /^[0-9]+(\.[0-9]{1,4})?$/, message: "格式错误" }],
                unit: "元/笔"
            },
            {
                label: "鉴权绑卡手续费",
                type: "text",
                text: "",
                param: "authenticateFee",
                rules: [{ pattern: /^[0-9]+(\.[0-9]{1,4})?$/, message: "格式错误" }],
                unit: "元/次"
            },
            {
                label: "协议支付收费方式",
                type: "text",
                text: "",
                param: "repayFeeType",
                value: [{ val: "1", name: "按固定费率收取" }, { val: "2", name: "按笔收取" }],
            },
        ]
    }
    componentWillMount() {

        this.bankColumns = [
            {
                title: "序号",
                dataIndex: "key"
            },
            {
                title: "适用银行",
                dataIndex: "bank"
            },
            {
                title: "协议代扣费率",
                dataIndex: "rate",
                render: e => (e !== "" && e !== null) ? accDiv(e, 100) + "%" : "--"
            },
            {
                title: "单笔下限",
                dataIndex: "min",
                render: e => (e !== "" && e !== null) ? accDiv(e, 100) + "元" : "--"
            },
            {
                title: "单笔上限",
                dataIndex: "max",
                render: e => (e !== "" && e !== null) ? accDiv(e, 100) + "元" : "--"
            },
        ]
        this.countColumns = [
            {
                title: "序号",
                dataIndex: "key"
            },
            {
                title: "单笔下限",
                dataIndex: "11",
                render: e => (e !== "" && e !== null) ? accDiv(e, 100) + "元" : "--"
            },
            {
                title: "单笔上限",
                dataIndex: "22",
                render: e => (e !== "" && e !== null) ? accDiv(e, 100) + "元" : "--"
            },
            {
                title: "协议代扣单笔",
                dataIndex: "33",
                render: e => (e !== "" && e !== null) ? accDiv(e, 100) + "元" : "--"
            },
        ]
    }
    componentDidMount() {
        this.get_detail();
    }
    get_detail() {
        axios_zj.post(capital_bl_account_detail_info, { accountId: this.state.accountId }).then(e => {
            if (!e.code) {
                var data = e.data;
                var shareStatus = { 1: "自有账户", 2: "共管账户", 0: "待定账户" }
                for (var i in data) {
                    for (var j in this.base) {
                        if (this.base[j].param === "shareStatus") {
                            this.base[j].text = this.base[j].value[data[i]]
                        }
                    }
                    this.value[i] = data[i] === null ? "" : data[i];
                    if (i === "repayFeeType" || i === "withholdFeeType") {
                        this.setState({
                            [i]: data[i] ? (data[i] === 1 ? "按固定费率收取" : "按笔收取") : "",
                            [i + "status"]: data[i] ? data[i].toString() : "1",
                        })
                    } else if (i === "shareStatus") {
                        this.setState({
                            [i]: shareStatus[data[i]],
                        })
                    } else {
                        this.setState({
                            [i]: data[i],
                        })
                    }
                }
            }
        })
    }
    //cancel
    getValue(name, val) {
        this.value[name] = val || ""
        this.setState({ [name]: val })
    }
    sure() {
        bmd.redirect("/zj/blaccount/edit?accountId=" + this.state.accountId)
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
        return (
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
                                            return <FormInfo label={i.label} type={i.type} getValue={this.getValue.bind(this)} param={i.param} text={i.text} value={i.value} key={k} rules={i.rules} defalut={this.state[i.param]} unitText={i.unit} />
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
                                            return <FormInfo label={i.label} type={i.type} getValue={this.getValue.bind(this)} param={i.param} text={i.text} value={i.value} key={k} add={this.addCount.bind(this)} defalut={this.state[i.param]} rules={i.rules} count={this.state.repayFeeType_count} unitText={i.unit} />
                                        })}
                                        {
                                            this.state.repayFeeTypestatus === "1" ? <div><Row style={{ marginBottom: 18 }}><Col span={4} style={{ fontSize: 14, color: "rgba(0,0,0,0.5)", textAlign: "right", paddingRight: 10 }}>协议代扣费率</Col><Col span={2}>{(this.state.repayFeeRate !== "" && this.state.repayFeeRate !== null) ? (accDiv(this.state.repayFeeRate, 100) + "%") : "--"}</Col><Col span={2} style={{ fontSize: 14, color: "rgba(0,0,0,0.5)", textAlign: "right", paddingRight: 10 }}>单笔下限</Col><Col span={2}>{(this.state.repayFeeMin !== "" && this.state.repayFeeMin !== null) ? (accDiv(this.state.repayFeeMin, 100) + "元") : "--"}</Col><Col span={2} style={{ fontSize: 14, color: "rgba(0,0,0,0.5)", textAlign: "right", paddingRight: 10 }}>单笔上限</Col><Col span={2}>{(this.state.repayFeeMax !== "" && this.state.repayFeeMax !== null) ? (accDiv(this.state.repayFeeMax, 100) + "元") : "--"}</Col></Row><div>
                                                <Row style={{ marginBottom: 18 }}><Col span={4} style={{ fontSize: 14, color: "rgba(0,0,0,0.5)", textAlign: "right", paddingRight: 10 }}>特殊银行费率</Col><Col span={12}>{(this.state.repayFeeBankSpec === "[]" || this.state.repayFeeBankSpec === null) ? "无" : <Table columns={this.bankColumns} dataSource={format_table_data(JSON.parse(this.state.repayFeeBankSpec))} bordered pagination={false} rowKey="key" />}</Col></Row>
                                            </div></div> : <Row><Col span={12} push={4}><Table columns={this.countColumns} dataSource={format_table_data(JSON.parse(this.state.repayFeeSection))} bordered pagination={false} rowKey="key" /></Col></Row>
                                        }
                                        <Row>
                                            <FormInfo label="直接代扣收费方式" type="text" getValue={this.getValue.bind(this)} param="withholdFeeType" add={this.addCount_withhold.bind(this)} defalut={this.state.withholdFeeType} count={this.state.withholdFeeType_count} />
                                            {
                                                this.state.withholdFeeTypestatus === "1" ? <Row style={{ marginBottom: 18 }}><Col span={4} style={{ fontSize: 14, color: "rgba(0,0,0,0.5)", textAlign: "right", paddingRight: 10 }}>直接代扣费率</Col><Col span={2}>{(this.state.withholdFeeRate !== "" && this.state.withholdFeeRate !== null) ? (accDiv(this.state.withholdFeeRate, 100) + "%") : "--"}</Col><Col span={2} style={{ fontSize: 14, color: "rgba(0,0,0,0.5)", textAlign: "right", paddingRight: 10 }}>单笔下限</Col><Col span={2}>{(this.state.withholdFeeMin !== "" && this.state.withholdFeeMin !== null) ? (accDiv(this.state.withholdFeeMin, 100) + "元") : "--"}</Col><Col span={2} style={{ fontSize: 14, color: "rgba(0,0,0,0.5)", textAlign: "right", paddingRight: 10 }}>单笔上限</Col><Col span={2}>{(this.state.withholdFeeMax !== "" && this.state.withholdFeeMax !== null) ? (accDiv(this.state.withholdFeeMax, 100) + "元") : "--"}</Col></Row> : <Col span={12} push={4}><Table columns={this.countColumns} dataSource={format_table_data(JSON.parse(this.state.withholdFeeSection))} bordered pagination={false} rowKey="key" /></Col>
                                            }
                                        </Row>
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
                                        <FormInfo label="账号信息" type="text" getValue={this.getValue.bind(this)} param="accountInfo" rules={[{ max: 200, message: "最多200个字符" }]} defalut={this.state.accountInfo} />
                                    </div>
                                </Row>
                            </div>
                        </div>
                    </Row>

                    <Row style={{ height: "50px", background: "#fff", position: "fixed", bottom: "0", right: "0", lineHeight: "50px", textAlign: "center", width: "calc(100% - 170px)", boxShadow: "0px -2px 4px 0px rgba(0,0,0,0.1)" }}>
                        {/* <Button type="primary" style={{ marginLeft: '30px' }} onClick={this.sure.bind(this)}>编辑</Button> */}
                        <Permissions server={global.AUTHSERVER.account.key} permissions={global.AUTHSERVER.account.access.gj_oper} tag="button" key="edit" type="primary" style={{ marginLeft: '30px' }} onClick={this.sure.bind(this)}>编辑</Permissions>
                    </Row>
                </Form>

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
        )
    }
}
export default ComponentRoute(Form.create()(Product_cxfq));