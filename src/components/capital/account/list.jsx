import React, { Component } from 'react';
import { Tooltip } from 'antd';
import Modal from './components/EditModal';
import Permissions from '../../../templates/Permissions';
import { subjectMap, shareStatusMap } from './components/map';
import { axios_zj } from '../../../ajax/request';
import { capital_account_edit } from '../../../ajax/api';
import { page } from '../../../ajax/config';
import { bmd } from '../../../ajax/tool';
import ComponentRoute from '../../../templates/ComponentRoute';
import ListBtn from '../../templates/listBtn';
import ListCtrl from '../../../controllers/List';
class Account extends Component {
    //构造器
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            total: 1,
            current: 1,
            pageSize: page.size,
            source: [],
            modalVisible: false,
            modalInfo: {},
            status: 0
        };

    }
    //页面加载前 固定的方法名
    componentWillMount() {
        let tipAmount = "账户总额=可用余额+未结算余额+手续费余额+冻结金额";
        this.columns = [
            {
                title: "序号",
                dataIndex: "key"
            },
            {
                title: "内部账户编号",
                dataIndex: "innerName"
            },
            {
                title: '账号/商户号',
                dataIndex: 'merchantId',
            },
            {
                title: "账户主体",
                dataIndex: "subject",
                render: data => !data ? "--" : <Tooltip placement="topLeft" title={subjectMap(data).name}><div>{subjectMap(data).short}</div></Tooltip>
            },
            {
                title: "用途",
                dataIndex: "usage"
            },
            {
                title: "账户类型",
                dataIndex: "shareStatus",
                render: data => shareStatusMap[data] || "--"
            },
            {
                title: "更新时间",
                dataIndex: 'updateTime',
                sorter: (a, b) => {
                    return bmd.getSort(a, b, "updateTime", true)
                }
            },
            {
                title: <Tooltip placement="topLeft" title={tipAmount}><span>账户总额</span></Tooltip>,
                dataIndex: 'totalAmount',
                render: (data) => {
                    return data.money()
                },
                sorter: (a, b) => {
                    return bmd.getSort(a, b, "totalAmount")
                }
            },
            {
                title: '可用余额（元）',
                dataIndex: 'available',
                render: data => {
                    return data.money()
                },
                sorter: (a, b) => {
                    return bmd.getSort(a, b, "available")
                }
            },
            {
                title: '未结算余额',
                dataIndex: 'unsettle',
                render: data => {
                    return data.money()
                },
                sorter: (a, b) => {
                    return bmd.getSort(a, b, "unsettle")
                }
            },
            {
                title: '手续费余额',
                dataIndex: 'fee',
                render: data => data.money(),
                sorter: (a, b) => bmd.getSort(a, b, "fee")
            },
            {
                title: '冻结余额',
                dataIndex: 'freeze',
                render: data => data.money(),
                sorter: (a, b) => bmd.getSort(a, b, "freeze")
            },
            {
                title: '操作',
                // className:"operate",
                operate: (data) => {
                    let content = [
                        <Permissions server={global.AUTHSERVER.account.key} permissions={global.AUTHSERVER.account.access.balance_edit} tag="button" key="edit" size="small" type="primary" onClick={() => { this.edit_account(data) }}>编辑</Permissions>,
                        <Permissions server={global.AUTHSERVER.account.key} permissions={global.AUTHSERVER.account.access.balance_list} tag="button" key="edit" size="small" type="primary" onClick={() => { this.detail_account(data) }}>账户信息</Permissions>,
                        <Permissions server={global.AUTHSERVER.account.key} permissions={global.AUTHSERVER.account.access.balance_detail} tag="button" key="show" size="small" onClick={() => { this.get_detail(data) }}>账户明细</Permissions>
                    ]
                    return data.key === "总计" ? <span /> : <ListBtn btn={content} />
                }
            }
        ];
    }
    get_detail(data) {
        bmd.redirect("/zj/account/detail?accountId=" + data.accountId)
    }
    detail_account(data) {
        bmd.redirect("/zj/account/info?accountId=" + data.accountId)
    }
    edit_account(data) {
        bmd.redirect("/zj/account/edit?accountId=" + data.accountId)
    }
    cancelModal() {
        this.setState({
            modalVisible: false,
            modalInfo: {}
        })
    }
    accountSubmit(data) {
        axios_zj.post(capital_account_edit, data).then(res => {
            this.cancelModal();
            this.get_list();
        })
    }
    initTotal(key = "合计", id = -1,) {
        return { id, key, totalAmount: 0, available: 0, unsettle: 0, fee: 0, freeze: 0 }
    }
    countTotal(source, target) {
        source.totalAmount += target.totalAmount
        source.available += target.available
        source.unsettle += target.unsettle
        source.fee += target.fee
        source.freeze += target.freeze
    }
    requestList(param) {
        return new Promise((resolve, reject) => {
            axios_zj.post("/bmd_accounting/balance/all").then(data => {
                let accountInfo = data.data;
                if (accountInfo.list.length <= 0) return resolve(data);
                let list = accountInfo.list;
                let stat = { total: this.initTotal() };
                for (let l in list) {
                    let account = list[l];
                    if (!stat[account.subject]) stat[account.subject] = this.initTotal(subjectMap(account.subject).short + "合计", account.subject);
                    this.countTotal(stat[account.subject], list[l]);
                    this.countTotal(stat.total, list[l]);
                }
                Object.keys(stat).reverse().forEach(key => list.push(stat[key]));
                resolve(data);
            })
        })
    }
    render() {
        let modalProps = {
            visible: this.state.modalVisible,
            info: this.state.modalInfo,
            bindsubmit: this.accountSubmit.bind(this),
            bindcancel: this.cancelModal.bind(this)
        }
        const listProps = {
            columns: this.columns,
            listRequestor: this.requestList.bind(this),
            listTip: <p>账户总额=可用余额+未结算余额+手续费余额+冻结余额<br />注：该页面金额是支付通道/银行账户的实时余额（每十分钟刷新一次），如与账务统计的余额不一致，所在行会标红，请及时核查！</p>,
            tableInfo: {
                rowClassName: function (data) {
                    return data.warning ? "bg-warn" : ""
                }
            }
        }
        return <div>
            <ListCtrl {...listProps} />
            <Modal {...modalProps} />
        </div>
    }
}

export default ComponentRoute(Account);