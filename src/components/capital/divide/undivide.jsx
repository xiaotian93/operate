import React, { Component } from 'react';
import { Row, Button, Input, Modal, message, Table } from 'antd';
import TableCol from './../../../templates/TableCol';
import { axios_zj } from '../../../ajax/request';
import { capital_undivide, capital_confirm, capital_hangup } from '../../../ajax/api';
import ListCtrl from '../../../controllers/List';
import AccountCtrl from '../../../request/capital/Account';
import { bmd } from '../../../ajax/tool';
import { ListTip } from '../../../views/List';
// import Table from '../../../views/Table';
import Permissions from '../../../templates/Permissions';
import moment from "moment";
class Undivide extends Component {
    //构造器
    constructor(props) {
        super(props);
        let detail = {};
        try {
            detail = JSON.parse(decodeURI(props.location.query.detail))
        } catch (e) {
            console.error(e);
        }
        this.state = {
            allSelectedRowKeys: [],
            allSelectedRows: [],
            detail: detail
        };
        this.page = 1;
    }
    //页面加载前 固定的方法名
    componentWillMount() {
        this.detail = {
            "businessType": { name: "业务类型" },
            "businessId": { name: "业务ID" },
            "amount": { name: "金额", render: data => data.amount ? data.amount.money() : "--" },
            "desc": { name: "描述" }
        }
        this.items = [
            {
                key: "serialNumber",
                name: "流水单号",
                type: "text",
                placeHolder: "请输入流水单号",
            },
            {
                key: "type",
                name: "账户类型",
                type: "select",
                placeHolder: "请选择账户类型",
                values: [{ val: "2", name: "收入" }, { val: "1", name: "支出" }]
            },
            {
                key: "accountId",
                name: "内部账户编号",
                type: "select",
                placeHolder: "请选择内部账户编号",
                values: AccountCtrl.getSelect()
            },
            {
                key: "time",
                name: "流水日期",
                type: "range_date",
                feild_s: "startDate",
                feild_e: "endDate",
                withTime:true,
                placeHolder: ['开始日期', "结束日期"],
            },
            {
                key: "targetAccountName",
                name: "账户名称",
                type: "text",
                placeHolder: "请输入账户名称"
            }
        ]
    }
    columns = [];
    getColumns(type) {
        let columns = [
            {
                title: '账户名称',
                dataIndex: 'targetAccountDetail',
                render: data => {
                    return data ? JSON.parse(data).accountName : "--"
                }
            },
            {
                title: "流水编号",
                dataIndex: "serialNumber"
            },
            {
                title: "总额",
                dataIndex: "amount",
                render: data => data.money()
            },
            {
                title: '余额',
                dataIndex: 'remainAmount',
                render: data => data.money()
            },
            {
                title: '交易类型',
                dataIndex: 'subType'
            },
            {
                title: '日期',
                dataIndex: 'date'
            },
            {
                title: '描述',
                width: "20%",
                dataIndex: 'desc'
            }
        ]
        // 列表表头
        if (type === "list") {
            columns.push({
                title: "操作", className: "operate",
                render: data => <Button type="warn" size="small" onClick={() => { this.hangup_confirm(data.id) }}>挂起</Button>
            })
        }
        // 弹窗表头
        if (type === "select") {
            columns.push({
                title: "分账金额",
                render: data => <Input placeholder="分账金额" defaultValue={bmd.money(data.divide)} onChange={e => this.changeInput(e, data)} />
            })
            columns.push({
                title: "操作", className: "operate",
                render: (data,r,index) => <Button type="danger" size="small" onClick={() => { this.removeSelectRow(index) }}>移除</Button>
            })
        }
        return columns;
    }
    changeInput(e, data) {
        let value = e.target.value.split(",").join("");
        if (value.remoney() > data.amount) {
            message.warn(`金额不能超过${bmd.money(data.amount)}`);
        }
        data.divide = value.remoney();
    }

    listRequestor(rqd) {
        this.page = rqd.page;
        return axios_zj.post(capital_undivide, { ...rqd, type: this.state.detail.type });
    }

    // 确认分账弹窗
    confirm_divide(datas) {
        let source = datas;
        if (!Array.isArray(source)) {
            source = Object.values(datas).reduce((total, current) => (total.concat(current)), []);
        }
        if (!this.validDivideData(source)) return;
        Modal.confirm({
            content: '确认分账？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                this.confirm_request(source);
            }
        });
    }
    validDivideData(datas = []) {
        let money = 0;
        let single = datas.every(item => {
            if (!item.divide) {
                message.warn(`流水号：${item.serialNumber}的金额不能为空~`);
                return false
            };
            if (item.divide > item.amount) {
                message.warn(`流水号：${item.serialNumber}的金额不能超过总额~`);
                return false
            }
            money += item.divide;
            return true;
        });
        // 总额
        if (money > this.state.detail.amount) {
            message.warn(`分账金额不能超过${bmd.money(this.state.detail.amount)}`);
            return false;
        }
        return single
    }
    // 确认分账请求
    confirm_request(datas) {
        let rqd = {
            businessAccountingId: this.state.detail.id,
            mapDetail: []
        }
        for (let s in datas) {
            rqd.mapDetail.push(datas[s].id + "_" + datas[s].divide);
        }
        rqd.mapDetail = rqd.mapDetail.join(",");
        axios_zj.post(capital_confirm, rqd).then(data => {
            message.success("操作成功~");
            this.setState({ allSelectedRows:[], allSelectedRowKeys:[] })
            this.get_list(1, this.state.filter);
        })
    }
    removeSelectRow(index){
        let { allSelectedRows, allSelectedRowKeys } = this.state;
        allSelectedRows.splice(index,1);
        allSelectedRowKeys.splice(index,1);
        this.setState({ allSelectedRows, allSelectedRowKeys })
    }
    // 分账挂起弹窗
    hangup_confirm(id) {
        Modal.confirm({
            content: '确认挂起？',
            okText: '挂起',
            cancelText: '取消',
            onOk: () => {
                this.hangup_divide(id);
            }
        });
    }
    // 分账挂起
    hangup_divide(id) {
        axios_zj.post(capital_hangup, { accountingId: id }).then(data => {
            this.get_list(1, this.state.filter);
        })
    }
    render() {
        const listProps = {
            items: this.items,
            listTips: false,
            columns: this.getColumns("list"),
            tableInfo: {
                rowKey: "id",
                rowSelection: {
                    selectedRowKeys: this.state.allSelectedRowKeys,
                    onSelect: (record, selected) => {
                        if(!selected) return;
                        let selectItem = Object.assign({},record);
                        selectItem.divide = selectItem.amount;
                        let { allSelectedRowKeys, allSelectedRows } = this.state;
                        allSelectedRowKeys.push(selectItem.id);
                        allSelectedRows.push(selectItem);
                        this.setState({ allSelectedRowKeys, allSelectedRows });

                    }
                }
            },
            listRequestor: this.listRequestor.bind(this),
            defaultFilter: {
                startDate:moment().subtract(1,"month").format("YYYY-MM-DD"),
                endDate:moment().format("YYYY-MM-DD")
            }
        }
        const selectTableProps = {
            columns: this.getColumns("select"),
            dataSource: this.state.allSelectedRows,
            pagination: false,
            rowKey:"id"
        }
        return (
            <div className="Component-body">
                <Row className="content">
                    <h2>业务流水信息</h2>
                    <TableCol data-source={this.state.detail} data-columns={this.detail} />
                </Row>
                <ListCtrl {...listProps}>
                    <div style={{ width: "100%" }}>
                        <span style={{ display: "flex", marginBottom: "10px" }}><ListTip text="待确认列表" /></span>
                        <Table {...selectTableProps} bordered />
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "10px" }}>
                            <ListTip />
                            {/* <Button type="primary" onClick={(e) => { this.confirm_divide(this.state.allSelectedRows) }}>确认分账</Button> */}
                            <Permissions server={global.AUTHSERVER.account.key} permissions={global.AUTHSERVER.account.access.accounting_divide_operate} type="primary" onClick={(e) => { this.confirm_divide(this.state.allSelectedRows) }} tag="button">确认分账</Permissions>
                        </div>
                    </div>
                </ListCtrl>
            </div>
        );
    }
}

export default Undivide;