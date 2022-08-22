import React, { Component } from 'react';
import ListCtrl from '../../../controllers/List';
import { axios_zj } from '../../../ajax/request';
import { bmd } from '../../../ajax/tool';
import ModalForm from '../../../views/form/Modal';
import Permissions from '../../../templates/Permissions';
import ValueMap from '../../../model/ValueMap';
import { capital_account_bank_list, capital_account_bank_manual_confirmation } from "../../../ajax/api";
import { message } from 'antd';

class ParticularsList extends Component {
    status = [{ name: "已匹配", val: true }, { name: "未匹配", val: false }]
    subTypeMap = new ValueMap([{ key: "DEPOSIT", value: "加款" }, { key: "WITHDRAW", value: "提现" }])
    items = [
        { name: "主体", key: "subject", type: "select", values: [{ name: "智度小贷", val: "ZHIDUXIAODAI" }, { name: "智度保理", val: "ZHIDUBAOLI" }] },
        { name: "通道", key: "channelName" },
        { name: "交易类型", key: "subType", values: this.subTypeMap.getSelect(), type: "select" },
        { name: "对账结果", key: "equal", type: "select", values: this.status, default: "false" },
        { name: "时间", key: "date", feild_s: "localDateStart", feild_e: "localDateEnd", withTime: true, type: "range_date" },
        { name: "出款⽅账户名称", key: "outAccountName" },
        { name: "出款⽅账户号", key: "outMerchant" },
        { name: "交易⾦额", key: "amount" },
        { name: "⼊款⽅账户名称", key: "inAccountName" },
        { name: "⼊款⽅账户号", key: "inMerchant" },
    ]
    columns = [
        {
            title: "银行账户交易信息", children: [
                { title: "交易号", dataIndex: "serialNumber" },
                { title: "出款方账户名称", dataIndex: "outAccountName" },
                { title: "出款方账户号", dataIndex: "outMerchant" },
                { title: "交易金额", dataIndex: "amount", render: data => bmd.money(data) },
                { title: "入账方账户名称", dataIndex: "inAccountName" },
                { title: "入款方账户号", dataIndex: "inMerchant" }, { title: "交易时间", dataIndex: "transactionDate" },]
        },
        {
            title: "三方账户交易信息", children: [
                { title: "交易号", dataIndex: "TpSerialNumber" },
                { title: "出款方账户名称", dataIndex: "tpOutAccountName",render:(data,record)=>record.subType === "WITHDRAW"?record.inner_name:record.tpOutAccountName   },
                { title: "出款方账户号", dataIndex: "tpOutMerchant" },
                { title: "交易金额", dataIndex: "tpAmount", render: data => bmd.money(data) },
                { title: "入账方账户名称", dataIndex: "tpInAccountName",render:(data,record)=>record.subType === "DEPOSIT"?record.inner_name:record.tpInAccountName },
                { title: "入款方账户号", dataIndex: "tpInMerchant" },
                { title: "交易时间", dataIndex: "tpTransactionDate" }
            ]
        },
        { title: "对账结果", dataIndex: "equal", render: data => data ? "对平" : "单边差异" },
        { title: "备注", dataIndex: "comment" },
        {
            title: "操作", render: data => {
                if (data.equal) {
                    return "--";
                }
                return <Permissions
                    server={global.AUTHSERVER.account.key}
                    permissions="default"
                    type="primary"
                    size="small"
                    onClick={e => this.showModal_confirm(this.getModalItems(data), data.id)}
                >人工确认</Permissions>
            }
        }
    ]
    getModalItems(data) {
        return [
            { name: "备注", key: "comment", type: "textArea", default: data.comment }
        ]
    }
    listRequestor(param) {
        return axios_zj.post(capital_account_bank_list, param)
    }
    saveComment(comment, id) {
        if (JSON.stringify(comment) === "{}") {
            message.warn("请填写备注信息");
            return;
        }
        return new Promise((resolve, reject) => {
            axios_zj.post(capital_account_bank_manual_confirmation, { ...comment, id }).then(data => {
                resolve(true);
                this.getList()
            }).catch(e => reject(e));
        })
    }
    render() {
        const listProps = {
            items: this.items,
            columns: this.columns,
            bindsetFilter: set => this.setFilter = set,
            listRequestor: this.listRequestor.bind(this),
            bindrefresh: get => this.getList = get
        }
        return <ListCtrl {...listProps}>
            <ModalForm title={"人工确认"} bindshow={show => this.showModal_confirm = show} bindSubmit={this.saveComment.bind(this)} />
        </ListCtrl>
    }
}

export default ParticularsList;