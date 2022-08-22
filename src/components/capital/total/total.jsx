import React, { Component } from 'react';
import { Card, Modal, Select, Form, Row, Col, Button, Input, DatePicker, message } from 'antd';

import moment from 'moment';
import { axios_zj } from '../../../ajax/request';
import { capital_account_detail, capital_account_stat, capital_account_web_add, capital_account_web_sub, capital_account_total, capital_account_export, capital_hangup, capital_account_user_list } from '../../../ajax/api';
import { host_zj, page } from '../../../ajax/config';
import { bmd } from '../../../ajax/tool';
import Permissions from '../../../templates/Permissions';
import ComponentRoute from '../../../templates/ComponentRoute';
import ListCtrl from '../../../controllers/List';
import AccountCtrl from '../../../request/capital/Account';
const Option = Select.Option;
const FormItem = Form.Item;
class Detail extends Component {
    //构造器
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            loading_table: true,
            loading_total: true,
            targetAccountIdValue: "",
            account_map: {},
            accountId: props.accountId,
            targetAccountIds: [],
            total: 1,
            current: 1,
            pageSize: page.size,
            total_money: "",
            total_fee: "",
            income: { count: 0, totalAmount: 0 },
            expend: { count: 0, totalAmount: 0 },
            factorage: { count: 0, totalAmount: 0 },
            targetAccountId:""
        };
        this.accountId = props.accountId;
    }
    componentWillMount() {
        this.columns = [
            {
                title: '序号',
                dataIndex: 'key',
                render: (text, record, index) => {
                    if (text === "合计") {
                        return text;
                    }
                    return `${index + 1}`
                }

            },
            {
                title: '交易时间',
                dataIndex: 'date',
                sorter: (a, b) => bmd.getSort(a, b, "date", true)
            },
            {
                title: '交易号',
                width: "7%",
                dataIndex: 'serialNumber',
                render: e => (e || "--")
            },
            {
                title: '交易方向',
                dataIndex: 'type',
                render: data => {
                    return data === 2 ? "收入" : "支出"
                }
            },
            {
                title: '交易金额',
                dataIndex: 'amount',
                render: data => data.money(),
                sorter: (a, b) => bmd.getSort(a, b, "amount")
            },
            // {
            //     title: '未确认金额',
            //     dataIndex: 'remainAmount',
            //     render: data => bmd.money(data)
            // },
            {
                title: '交易类型',
                dataIndex: 'subType',
            },
            {
                title: '手续费',
                dataIndex: 'fee',
                render: data => data.money(),
                sorter: (a, b) => bmd.getSort(a, b, "fee")
            },
            {
                title: '交易账户',
                render: data => {
                    let info = JSON.parse(data.targetAccountDetail);
                    return info.accountName || "--";
                }
            },
            {
                title: '交易银行账号',
                render: data => {
                    let info = JSON.parse(data.targetAccountDetail);
                    return info.bankCardNumber || "--";
                }
            },
            {
                title: '交易银行',
                render: data => {
                    let info = JSON.parse(data.targetAccountDetail);
                    return info.bankName || "--";
                }

            },
            {
                title: '内部账户编号',
                dataIndex: "accountId",
                render: data => AccountCtrl.mapName(data)
            },
            {
                title: '备注',
                dataIndex: "desc"
            },
            {
                title: '入账状态',
                dataIndex: "entryStatus"
            },
            {
                title: '确认状态',
                dataIndex: "confirmStatus",
            },
            {
                title: '操作',
                className: "operate",
                render: data => {
                    if (data.remainAmount === data.amount) return <Permissions tag="button" permissions="accounting_divide" key="refuse" type="primary" size="small" onClick={(e) => { this.account_refuse_confirm(data) }} disabled={data.confirmStatus==="已确认"}>人工确认</Permissions>
                    if (data.remainAmount < data.amount) return <Permissions key="show" size="small" onClick={(e) => { this.element_show(data) }} server={global.AUTHSERVER.account.key} permissions={global.AUTHSERVER.account.access.accounting_detail} tag="button" src={"/zj/total/element"}>查看</Permissions>
                }
            }
        ];

        let pay_type = [{ name: "支出", val: "1" }, { name: "收入", val: "2" }]
        let deal_type = [
            { name: "加款", val: "加款" },
            { name: "收款", val: "收款" },
            { name: "提现", val: "提现" },
            { name: "付款", val: "付款" }
        ]
        this.items = [
            { name: "交易日期", key: "date", feild_s: "startDate", feild_e: "endDate", placeHolder: ['开始日期', "结束日期"], type: "range_date", withTime: true },
            { name: "交易方向", key: "type", type: "select", values: pay_type, default: null },
            { name: "交易类型", key: "subType", type: "select", values: deal_type, default: null },
            { name: "内部账户编号", key: "accountId", type: "select", values: AccountCtrl.getSelect(), default: this.accountId },
            { name: "交易账户", key: "accountName", type: "text" },
            { name: "交易号", key: "serialNumber", type: "text" },
            { name: "确认状态", key: "confirmStatus", type: "select", values: [{ name: "已确认", val: "已确认" }, { name: "待确认", val: "待确认" }], default: null },
            { name: "入账状态", key: "entryStatus", type: "select", values: [{ name: "全部入账", val: "全部入账" }, { name: "部分入账", val: "部分入账" }, { name: "未入账", val: "未入账" }], default: null }
        ]
    }

    // 统计接口导入
    get_total_info(param = {}) {
        axios_zj.post(capital_account_stat, param).then((data) => {
            let state = {
                income: data.data['收入'],
                expend: data.data['支出'],
                factorage: data.data['手续费'],
                total_money: 0,
            }
            state.total_money = state.income.totalAmount - state.expend.totalAmount - state.factorage.totalAmount;
            this.setState(state)
        });
    }

    // 获取总额
    get_total_money(param = {}) {
        var account={};
        if(param.accountId){
            account.accountId=param.accountId;
        }
        axios_zj.post(capital_account_total, { ...account }).then(data => {
            this.setState({
                loading_total: false,
                total_fee: data.data.fee
            })
            this.get_total_info(param);
        })
    }

    // 导出
    table_export() {
        let str = [];
        let filters = this.getFilter();
        for (let f in filters) {
            str.push(f + "=" + filters[f]);
        }
        let params = "?" + str.join("&");
        window.open(host_zj + capital_account_export + params);
    }

    // 查看成分
    element_show(data) {
        bmd.navigate("/zj/total/element?id=" + data.id + "&account_name=" + AccountCtrl.mapName(data.accountId))
    }

    // 账单挂起确认
    account_refuse_confirm(data) {
        Modal.confirm({
            content: "确认挂起吗？",
            okText: "确认",
            cancelText: "取消",
            onOk: () => {
                this.account_refuse(data.id);
            },
            onCancel: () => {

            }
        })
    }

    // 账单挂起
    account_refuse(accountingId) {
        axios_zj.post(capital_hangup, { accountingId: accountingId }).then(data => {
            message.success("操作成功");
            this.getList();
        })
    }

    // 人工录入充值
    person_charge(param) {
        let rqd = {
            ...param
        }
        axios_zj.post(capital_account_web_add, rqd).then(data => {
            this.getList();
            message.success("保存成功~");
            this.hideModal();
            this.props.form.resetFields();
        })
    }

    // 人工录入提现
    person_withdraw(param) {
        let rqd = {
            ...param
        }
        axios_zj.post(capital_account_web_sub, rqd).then(data => {
            this.getList();
            message.success("保存成功~");
            this.hideModal();
            this.props.form.resetFields();
        })
    }
    submitModal(values){
        if (this.state.modal_type === "cz") {
            this.person_charge(values);
        }
        if (this.state.modal_type === "tx") {
            this.person_withdraw(values);
        }
    }
    // 提交表单
    recharge(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) {
                console.log('Received values of form: ', values);
                return;
            }
            values.date = moment(values.date).format("YYYY-MM-DD HH:mm:ss");
            values.amount = values.amount.replaceAll(",","")
            values.amount = bmd.remoney(values.amount);
            values.fee = bmd.remoney(values.fee);
            values.desc = values.desc || "";
            let accountName = AccountCtrl.mapName(parseInt(values.accountId,10));
            Modal.confirm({
                title:"提交确认?",
                width:600,
                content:<div style={{lineHeight:2}}>
                    支付通道ID：{accountName}<br />
                    资金到账时间：{values.date}<br />
                    交易号：{values.serialNumber}<br />
                    金额(分)：{ values.amount } <br />
                    手续费(分)：{ values.fee } <br />
                    {/* 账户ID：{ values.targetAccountId } <br /> */}
                    备注：{ values.desc } <br />
                </div>,
                onOk:e=>Promise.resolve(this.submitModal(values))
            })
        });
    }

    // 显示弹窗
    showModal(e) {
        let type = e.target.getAttribute("data-type");
        this.props.form.resetFields();
        this.setState({
            modal_type: type,
            targetAccountId:"",
            visible: true
        });
    }
    // 隐藏弹窗
    hideModal(type) {
        this.setState({
            visible: false
        });
    }
    // 搜索交易账户
    targetAccountIdChangeEvent(val) {
        this.setState({
            targetAccountIdValue: val,
            targetAccountId:val
        })
        if (this.selectStatus) {
            this.selectStatus = false;
            return;
        }
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            axios_zj.post(capital_account_user_list, { accountName: val }).then(res => {
                // this.props.form.setFieldsValue({targetAccountId:""});
                this.setState({ targetAccountIds: res.data.list || [] })
            })
        }, 800)
    }
    // 选择账户
    targetAccountIdSelectEvent(val, data) {
        this.selectStatus = true;
        this.setState({ targetAccountId:val });
        this.props.form.setFieldsValue({ targetAccountId: data.props["data-id"] });
    }
    requestList(param) {
        this.get_total_money(param);
        return axios_zj.post(capital_account_detail, { ...param })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const listProps = {
            items: this.items,
            columns: this.columns,
            bindrefresh:get=>this.getList = get,
            listRequestor: this.requestList.bind(this),
            bindgetFilter: get => this.getFilter = get
        }

        let modal_props = {
            title: "加款至账户",
            className: "pay-plan",
            visible: this.state.visible,
            okText: "确认",
            width: 780,
            footer: null,
            onCancel: this.hideModal.bind(this)
        }
        let modal_text = {
            date: "资金到账时间：",
            serialNumber: "交易号：",
            targetAccount: "加款账户",
            amount: "加款金额(元)：",
            accountName: "打款方名称：",
            bankCardNumber: "打款方银行账号：",
            bankName: "打款方银行：",
            desc: "备注：",
            fee: "手续金额(元)："
        }
        if (this.state.modal_type === "tx") {
            modal_props.title = "从账户提现";
            modal_text.date = "提现时间：";
            modal_text.targetAccount = "提现账户";
            modal_text.serialNumber = "交易号：";
            modal_text.amount = "提现金额(元)：";
            modal_text.accountName = "收款方";
            modal_text.bankCardNumber = "收款方银行账号";
            modal_text.bankName = "收款银行";
            modal_text.desc = "备注：";
        }
        let typeMap = {
            "100": "银行卡账户",
            "1000": "默认主体账户"
        }
        let targetAccountId_option = this.state.targetAccountIds.map(accountInfo => {
            let name = "(" + typeMap[accountInfo.type] + ") 主体:" + accountInfo.entity;
            if (accountInfo.type === 100) {
                name += " 卡号：" + accountInfo.key;
            }
            return <Option key={accountInfo.id} data-id={accountInfo.id} value={name}>{name}</Option>
        });
        return (
            <div>
                <Row gutter={16} className="total-cards" style={{ background: "#FBFBFB" }}>
                    <Col span={6}>
                        <Card className="total-card">
                            <h2 className="text-center">总额统计</h2>
                            <h3>&nbsp;&nbsp;</h3>
                            <h3 className="text-center">{this.state.total_money.money()}</h3>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card className="total-card">
                            <h2>收入统计</h2>
                            <h3>笔数：{this.state.income.count}</h3>
                            <h3>金额（元）：{this.state.income.totalAmount.money()}</h3>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card className="total-card">
                            <h2>支出统计</h2>
                            <h3>笔数：{this.state.expend.count}</h3>
                            <h3>金额（元）：{this.state.expend.totalAmount.money()}</h3>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card className="total-card">
                            <h2>手续费统计</h2>
                            <h3>笔数：{this.state.factorage.count}</h3>
                            <h3>消耗（元）：{this.state.factorage.totalAmount.money()}</h3>
                            <h3>余额（元）：{this.state.total_fee.money()}</h3>
                        </Card>
                    </Col>
                </Row>
                <ListCtrl {...listProps}>
                    <div />
                    <div>
                        <Permissions server={global.AUTHSERVER.account.key} permissions={global.AUTHSERVER.account.access.add} tag="button" type="primary" data-type="cz" onClick={this.showModal.bind(this)}>&emsp;新增加款&emsp;</Permissions>&emsp;
                        <Permissions server={global.AUTHSERVER.account.key} permissions={global.AUTHSERVER.account.access.add} tag="button" type="primary" data-type="tx" onClick={this.showModal.bind(this)}>&emsp;新增提现&emsp;</Permissions>&emsp;
                        <Permissions type="primary" onClick={this.table_export.bind(this)} server={global.AUTHSERVER.account.key} permissions={global.AUTHSERVER.account.access.accounting_export} tag="button">&emsp;导出&emsp;</Permissions>
                    </div>
                </ListCtrl>
                <Modal {...modal_props}>
                    <Form onSubmit={this.recharge.bind(this)}>
                        <Row>
                            <Col span={4}>
                                <div className="key">支付通道</div>
                            </Col>
                            <Col span={19} offset={1} className="value">
                                <FormItem>
                                    {getFieldDecorator('accountId', {
                                        rules: [{ required: true, message: '请选择支付通道' }],
                                    })(
                                        <Select placeholder="请选择支付通道">
                                            {AccountCtrl.getSelect().map(account => <Option key={account.val} value={account.val}>{account.name}</Option>)}
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={4}>
                                <div className="key">{modal_text.date}</div>
                            </Col>
                            <Col span={19} offset={1} className="value">
                                <FormItem>
                                    {getFieldDecorator('date', {
                                        rules: [{ required: true, message: '请选择日期' }],
                                    })(
                                        <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder="请选择日期" />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={4}>
                                <div className="key">{modal_text.serialNumber}</div>
                            </Col>
                            <Col span={19} offset={1} className="value">
                                <FormItem>
                                    {getFieldDecorator('serialNumber', {
                                        rules: [{ required: true, message: '请输入交易号' }],
                                    })(
                                        <Input placeholder="请填写支付通道后台显示的交易号" />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={4}>
                                <div className="key">{modal_text.amount}</div>
                            </Col>
                            <Col span={19} offset={1} className="value">
                                <FormItem>
                                    {getFieldDecorator('amount', {
                                        rules: [{ required: true, message: '请输入加款金额' }],
                                    })(
                                        <Input placeholder="请填写支付通道后台显示的加款金额" />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={4}>
                                <div className="key">{modal_text.fee}</div>
                            </Col>
                            <Col span={19} offset={1} className="value">
                                <FormItem>
                                    {getFieldDecorator('fee', {
                                        rules: [{ required: true, message: '请输入手续金额' }],
                                    })(
                                        <Input placeholder="请填写支付通道后台显示的手续金额" />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Col span={4}>
                            <div className="key">{modal_text.targetAccount}</div>
                        </Col>
                        <Col span={19} offset={1} className="value">
                            <FormItem>
                                {getFieldDecorator('targetAccountId', {
                                    rules: [{ required: true, message: '请选择交易账户' }],
                                })(
                                    <div />
                                )}
                                <Select mode="combobox" showArrow={false} filterOption={false} defaultActiveFirstOption={false} placeholder="请选择交易账户" onChange={this.targetAccountIdChangeEvent.bind(this)} value={this.state.targetAccountId} onSelect={this.targetAccountIdSelectEvent.bind(this)}>
                                    {targetAccountId_option}
                                </Select>
                            </FormItem>
                        </Col>
                        <Row>
                            <Col span={4}>
                                <div className="key">{modal_text.desc}</div>
                            </Col>
                            <Col span={19} offset={1} className="value">
                                <FormItem>
                                    {getFieldDecorator('desc')(
                                        <Input placeholder="请输入备注" />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24} className="text-center">
                                <FormItem>
                                    <Button type="primary" htmlType="submit">确定</Button>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
                <style>{`
                    .pay-plan .ant-model-body{
                        font-size:14px;
                    }
                    .pay-plan div.key{
                        line-height: 40px;
                        text-align: right;
                    }
                    .pay-plan div.value{
                        line-height: 40px;
                        text-align: left;
                    }
                    .pay-plan div.ant-modal-title,.pay-plan div.ant-modal-footer{
                        text-align:center
                    }
                `}</style>
            </div>
        );
    }
}


export default ComponentRoute(Form.create()(Detail));