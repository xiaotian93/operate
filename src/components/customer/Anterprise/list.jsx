import React, { Component } from 'react';
import ListCtrl from '../../../controllers/List';
import { axios_loanMgnt } from '../../../ajax/request';
import MgntProjectCtrl from '../../../request/mgnt/project';

class AnterpriseList extends Component {
    columns = [
        { title: "序号", dataIndex: "key" },
        { title: "创建时间", dataIndex: "createTime", order: (a, b) => (new Date(a).getTime() - new Date(b).getTime()) > 0 ? 0 : -1 },
        { title: "企业ID", dataIndex: "id" },
        { title: "企业名称", dataIndex: "name" },
        { title: "统一社会信用代码", dataIndex: "idNo" },
        { title: "联系方式", dataIndex: "phone" },
        { title: "业务", dataIndex: "businessLabelName" },
        { title: "项目", dataIndex: "appKeyName" },
        { title: "渠道", dataIndex: "channel" },
    ]
    listRequestor(listParam) {
        return new Promise((resolve, reject) => {
            axios_loanMgnt.post("/manage/borrower/list", { ...listParam, type: "COMPANY" }).then(data => {
                data.data.list.forEach(record => {
                    record.appKeyName = MgntProjectCtrl.nameMap(record.appKey);
                })
                resolve(data);
            }).catch(e => reject(e));
        });
    }
    render() {
        const listProps = {
            // items:this.items,
            columns: this.columns,
            listRequestor: this.listRequestor.bind(this)
        }
        return <ListCtrl {...listProps} />
    }
}

export default AnterpriseList;