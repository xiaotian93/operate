import React, { Component } from 'react';
import ListCtrl from '../../../controllers/List';
import { axios_zj } from '../../../ajax/request';
import Permissions from '../../../templates/Permissions';
import ModalForm from '../../../views/form/Modal';
import { message } from 'antd';
import { bmd } from '../../../ajax/tool';

class DifferenceList extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    status = [{ name: "有业务无资金", val: 2 }, { name: "有资金无业务", val: 3 }]
    items = [
        { name: "商户", key: "channelName" },
        { name: "商户号", key: "merchantId" },
        { name: "商户订单号", key: "bmdOrderId" },
        { name: "业务订单号", key: "lmSerialNo" },
        { name: "对账差异类型", key: "status", type: "select", values: this.status },
        { name: "所属项目", key: "appKey" },
        { name: "是否处理", key: "processed", type: "select", values: [{ name: "是", val: true }, { name: "否", val: false }] },
        { name: "对账时间", key: "localDateStart", feild_s: "localDateStart", feild_e: "localDateEnd", withTime: true, type: "range_date" },
        { name: "处理时间", key: "operDate", feild_s: "operTimeStart", feild_e: "operTimeEnd", withTime: true, type: "range_date" },
    ]
    columns = [
        { title: "ID", dataIndex: "id" },
        { title: "商户订单号", dataIndex: "bmdOrderId" },
        { title: "交易金额", dataIndex: "total", render: data => bmd.money(data) },
        { title: "三方时间", dataIndex: "billDate", render: data => bmd.formatObjTime(data) },
        { title: "商户", dataIndex: "channelName" },
        { title: "商户号", dataIndex: "merchantId" },
        { title: "业务订单号", dataIndex: "lmSerialNo" },
        { title: "交易金额", dataIndex: "lmAmount", render: data => bmd.money(data) },
        { title: "业务时间", dataIndex: "lmBillDate", render: data => bmd.formatObjTime(data) },
        { title: "所属项目", dataIndex: "appName" },
        { title: "对账差异类型", dataIndex: "status", render: data => this.getStatus(data) },
        { title: "对账时间", dataIndex: "date", render: data => bmd.formatObjDate(data) },
        { title: "是否处理", dataIndex: "processed", render: data => data ? "是" : "否" },
        { title: "备注", dataIndex: "operComment" },
        { title: "处理时间", dataIndex: "operTime", render: data => bmd.formatObjTime(data) },
        { title: "交易方向", dataIndex: "type", render: data => this.getDealType(data) },
        {
            title: "操作", render: data => {
                if (data.processed) return '--'
                return <Permissions tag="button" type="primary" size="small" permissions="lm_reconcile_process" onClick={e => this.showModal(this.getItems(), data.id)}>处理</Permissions>
            }
        },
    ]
    getDealType(type) {
        let types = ["", "支出", "收入"]
        return types[type] || "--"
    }
    getStatus(status) {
        if (status === 0) return "未知状态";
        if (status === 1) return "匹配";
        if (status === 2) return "有业务无资金";
        if (status === 3) return "有资金无业务";
    }
    getItems(defaultInfo) {
        return [{ name: "备注", key: "comment", type: "text", required: true }]
    }
    listRequestor(param) {
        return axios_zj.post("/bmd_accounting/lm_reconcile/list", param)
    }
    // 处理订单
    process(info, id) {
        return axios_zj.post("/bmd_accounting/lm_reconcile/process", { id, ...info }).then(data => {
            message.success("处理成功~");
            this.getList();
        })
    }
    render() {
        const listProps = {
            items: this.items,
            columns: this.columns,
            filterOptions: { appKey: this.state.appKeys },
            bindsetFilter: set => this.setFilter = set,
            listRequestor: this.listRequestor.bind(this),
            bindrefresh: get => this.getList = get
        }
        return <div>
            <ListCtrl {...listProps} />
            <ModalForm title="处理订单" bindSubmit={this.process.bind(this)} bindshow={show => this.showModal = show} />
        </div>
    }
}

export default DifferenceList;