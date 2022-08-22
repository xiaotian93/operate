import React, { Component } from 'react';
import ListCtrl from '../../../controllers/List';
import { axios_zj } from '../../../ajax/request';
import { bmd } from '../../../ajax/tool';
import { subjectMap, subjectSelect } from '../account/components/map';
import ModalForm from '../../../views/form/Modal';
import Permissions from '../../../templates/Permissions';
import ValueMap from '../../../model/ValueMap';

class ParticularsList extends Component {
    status = [{ name: "已匹配", val: true }, { name: "未匹配", val: false }]
    subTypeMap = new ValueMap([{ key: "DEPOSIT", value: "加款" }, { key: "WITHDRAW", value: "提现" }])
    items = [
        { name: "主体", key: "subject", type: "select", values: subjectSelect() },
        { name: "通道", key: "channelName" },
        { name: "交易类型", key: "subType" , values:this.subTypeMap.getMap(),type:"select"},
        { name: "对账结果", key: "equal", type: "select", values: this.status, default: "false" },
        { name: "时间", key: "date", feild_s: "localDateStart", feild_e: "localDateEnd", withTime: true, type: "range_date" },
    ]
    columns = [
        { title: "日期", dataIndex: "date", render: data => bmd.formatObjDate(data) },
        { title: "主体", dataIndex: "subject", render: data => subjectMap(data).short },
        { title: "通道", dataIndex: "channelName" },
        { title: "交易类型", dataIndex: "subType", render: data => this.subTypeMap.getValue(data) },
        { title: "三方交易额", dataIndex: "tpAmount", render: data => bmd.money(data) },
        { title: "银行交易额", dataIndex: "bankAmount", render: data => bmd.money(data) },
        { title: "对账结果", dataIndex: "equal", render: data => data ? "一致" : "有差异" },
        { title: "备注", dataIndex: "comment" },
        {
            title: "操作", render: data => {
                return <Permissions
                    server={global.AUTHSERVER.account.key}
                    permissions="default"
                    type="primary"
                    size="small"
                    onClick={e => this.showModal(this.getModalItems(data), data.id)}
                >备注</Permissions>
            }
        }
    ]
    getStatus(status) {
        if (status === 0) return "未知状态";
        if (status === 1) return "匹配";
        if (status === 2) return "有业务无资金";
        if (status === 3) return "有资金无业务";
    }
    getModalItems(data) {
        return [
            { name: "备注", key: "comment", type: "textArea", default: data.comment }
        ]
    }
    listRequestor(param) {
        return axios_zj.post("/bmd_accounting/inner_reconcile/list", param)
    }
    saveComment(data, id) {
        return new Promise((resolve, reject) => {
            axios_zj.post("/bmd_accounting/inner_reconcile/comment", { ...data, id }).then(data => {
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
            <ModalForm title={"编辑备注"} bindshow={show => this.showModal = show} bindSubmit={this.saveComment.bind(this)} />
        </ListCtrl>
    }
}

export default ParticularsList;