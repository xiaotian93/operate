import React, { Component } from 'react';
import { Table, Row } from 'antd';

import { axios_zj } from '../../../ajax/request';
import { capital_bl_element } from '../../../ajax/api';
import { format_table_data } from '../../../ajax/tool';

class Element extends Component {
    //构造器
    constructor(props) {
        super(props);
        this.state = {
            base_info: [],
            relative_info: [],
            element_info_credit: [],
            element_info_debit: [],
            total_amount: 0,
            total_amount_debit: 0,
            total_amount_credit: 0,
            account_id: props.location.query.id,
            account_name: props.location.query.account_name
        };
    }
    componentWillMount() {
        this.columns_basic = [
            {
                title: '交易时间',
                dataIndex: 'date',
            },
            {
                title: '交易号',
                dataIndex: 'serialNumber',
            },
            {
                title: '交易方向',
                dataIndex: 'type',
                render: data => {
                    return data === 2 ? "收入" : "支出"
                }
            },
            {
                title: '交易金额（元）',
                dataIndex: 'amount',
                render: data => {
                    return data.money()
                }
            },
            {
                title: '已确认金额（元）',
                render: data => {
                    return (data.amount - data.remainAmount).money()
                }
            },
            {
                title: '未确认金额（元）',
                dataIndex: 'remainAmount',
                render: data => {
                    return data.money()
                }
            },
            {
                title: '手续费（元）',
                dataIndex: 'fee',
                render: data => {
                    return data.money()
                }
            },
            {
                title: '交易账户',
                key: "jyf",
                render: data => {
                    let info = JSON.parse(data.targetAccountDetail);
                    return info.accountName;
                }
            },
            {
                title: '交易银行账号',
                render: data => {
                    let info = JSON.parse(data.targetAccountDetail);
                    return info.bankCardNumber;
                }
            },
            {
                title: '交易银行',
                render: data => {
                    let info = JSON.parse(data.targetAccountDetail);
                    return info.bankName;
                }

            },
            {
                title: '支付账户',
                dataIndex: "accountId",
                render: () => {
                    return this.state.account_name
                }
            },
            {
                title: '备注',
                dataIndex: "desc"
            }
        ];
        this.columns_element = [
            {
                title: "成分",
                key: "element",
                width: "40%",
                dataIndex: "deAccount.groupDisplayName"
            },
            {
                title: "金额",
                key: "amount",
                dataIndex: "amount",
                render: data => {
                    return data.money()
                }
            },
            {
                title: "名称",
                key: "name",
                dataIndex: "deAccount.name"
            },
            {
                title: "项目名称",
                key: "appKey",
                dataIndex: "deAccount.appKey"
            },
            {
                title: "成分占比",
                key: "persenet",
                render: data => {
                    return data.amount ? (data.amount / this.state.total_amount_debit * 100).toFixed(2) + "%" : "0"
                }
            }
        ]
        this.columns_element_credit = [
            {
                title: "成分",
                key: "element",
                width: "40%",
                dataIndex: "deAccount.groupDisplayName"
            },
            {
                title: "金额",
                key: "amount",
                dataIndex: "amount",
                render: data => {
                    return data.money()
                }
            },
            {
                title: "名称",
                key: "name",
                dataIndex: "deAccount.name"
            },
            {
                title: "项目名称",
                key: "appKey",
                dataIndex: "deAccount.appKey"
            },
            {
                title: "成分占比",
                key: "persenet",
                render: data => {
                    return data.amount ? (data.amount / this.state.total_amount_credit * 100).toFixed(2) + "%" : "0"
                }
            }
        ]
    }

    componentDidMount() {
        this.get_list();
    }

    // 表格数据导入
    get_list() {
        let rqd = {
            accountingId: this.state.account_id
        }
        axios_zj.post(capital_bl_element, rqd).then((data) => {
            // let base_amount = data.data.accounting.amount;
            // let relative_amount = 0;
            // let relative_accounting = data.data.relatedAccounting;
            let credit_amount = data.data.creditAccountList;
            let debit_amount = data.data.debitAccountList;
            let total_debit = 0;
            let total_credit = 0;
            // for(let r in relative_accounting){
            //     relative_amount += relative_accounting[r].amount-relative_accounting[r].remainAmount;
            // }
            for (let j in credit_amount) {
                total_credit += credit_amount[j].amount;
            }
            for (let k in debit_amount) {
                total_debit += debit_amount[k].amount;
            }
            this.setState({
                base_info: [data.data.accounting],
                relative_info: data.data.relatedAccounting,
                // total_amount:base_amount+relative_amount,
                total_amount_debit: total_debit,
                total_amount_credit: total_credit,
                element_info_credit: format_table_data(data.data.creditAccountList),
                element_info_debit: format_table_data(data.data.debitAccountList)
            })
        });
    }

    // 下载凭证
    download_voucher(serialNumber) {
        window.open("http://pay.baimaodai.com/voucher/get?channel=连连支付&serialNumber=" + serialNumber);
    }

    render() {
        let table_basic_props = {
            rowKey: "id",
            dataSource: this.state.base_info,
            loading: false,
            pagination: false,
            columns: this.columns_basic
        }

        let table_element_props_relative = {
            rowKey: "id",
            dataSource: this.state.relative_info,
            loading: false,
            pagination: false,
            columns: this.columns_basic
        }
        let table_element_props_credit = {
            dataSource: this.state.element_info_credit,
            loading: false,
            pagination: false,
            columns: this.columns_element_credit
        }

        let table_element_props_debit = {
            dataSource: this.state.element_info_debit,
            loading: false,
            pagination: false,
            columns: this.columns_element
        }
        let relative = (
            <Row className="contain" style={{ marginTop: "10px" }}>
                <div style={{ textAlign: "center", marginBottom: "15px", fontWeight: "bold", fontSize: "18px" }}>关联流水</div>
                <Table {...table_element_props_relative} bordered />
            </Row>
        )
        let creadit = (
            <Row className="contain" style={{ marginTop: "10px" }}>
                <div style={{ textAlign: "center", marginBottom: "15px", fontWeight: "bold", fontSize: "18px" }}>成分列表(贷方)</div>
                <Table {...table_element_props_credit} bordered />
            </Row>
        )
        let debit = (
            <Row className="contain" style={{ marginTop: "10px" }}>
                <div style={{ textAlign: "center", marginBottom: "15px", fontWeight: "bold", fontSize: "18px" }}>成分列表(借方)</div>
                <Table {...table_element_props_debit} bordered />
            </Row>
        )

        return (
            <div>
                <Row className="contain">
                    <Table {...table_basic_props} bordered />
                </Row>
                {this.state.relative_info.length > 0 ? relative : ""}
                {this.state.element_info_debit.length > 0 ? debit : ""}
                {this.state.element_info_credit.length > 0 ? creadit : ""}
            </div>
        )
    }
}


export default Element;