import React, { Component } from 'react';
import { axios_gyl } from '../../../ajax/request';
import { bmd } from '../../../ajax/tool';
import ComponentRoute from '../../../templates/ComponentRoute';
import Permissions from '../../../templates/Permissions';
import ListCtrl from '../../../controllers/List';

class BorrowListGyl extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lmLoanConfigNo: [],
            ready:false
        };
    }
    componentWillMount() {
        this.columns = [
            {
                title: '序号',
                width: 50,
                dataIndex: 'key',
                render: (text, record, index) => {
                    if (text === "合计") {
                        return text;
                    }
                    return `${index + 1}`
                }
            },
            {
                title: '订单编号',
                dataIndex: 'orderNo',
            },
            {
                title: '订单时间',
                dataIndex: "createTime",
                sorter: (a, b) => bmd.getSort(a, b, "createTime", true)
            },
            {
                title: '借款方',
                dataIndex: 'borrowerCompanyName',
                render: (e) => e || "-"
            },
            {
                title: '债权人',
                dataIndex: 'payeeCompanyName',
                render: data => data || "-"
            },
            {
                title: '债务方',
                dataIndex: 'debtorCompanyName',
                render: data => data || "-"
            },
            {
                title: '借款金额',
                dataIndex: "amount",
                render: (data) => {
                    return data ? data.money() : "-"
                },
                sorter: (a, b) => {
                    return bmd.getSort(a, b, "amount")
                }
            },
            {
                title: '借款期限(日)',
                dataIndex: 'period',
                render: (e) => e ? e : "-"
            },
            {
                title: '智单号',
                dataIndex: 'serialNo'
            },
            {
                title: '综合费率',
                dataIndex: 'yearGeneralRate',
                render:data=>data+"%"
            },
            {
                title: '预计借款开始日期',
                dataIndex: 'loanStartDate'
            },
            {
                title: '预计借款结束日期',
                dataIndex: 'loanEndDate'
            },
            {
                title: '产品名称',
                dataIndex: 'appLoanConfigName'
            },
            {
                title: '订单状态',
                dataIndex: "status"
            },
            {
                title: '备注',
                dataIndex: "remark",
                render: (e) => e ? e : "-"
            },
            {
                title: '操作',
                render: (data) => <Permissions size="small" onClick={() => (this.detail(data.orderNo))} server={global.AUTHSERVER.gyl.key} tag="button" permissions={global.AUTHSERVER.gyl.access.pay_success_detail} src={'/jk/list/gyl/detail?orderNo=' + data.orderNo + '&audit=first&type=jk'}>查看</Permissions>
            }
        ];
        this.items = [
            {
                key: "orderNo",
                name: "订单编号",
                type: "text",
                placeHolder: "请输入订单编号"
            },
            {
                key: "borrowerCompanyName",
                name: "借款方",
                type: "text",
                placeHolder: "请输入借款方"
            },
            {
                key: "payeeCompanyName",
                name: "债权方",
                type: "text",
                placeHolder: "请输入债权方"
            },
            {
                key: "debtorCompanyName",
                name: "债务方",
                type: "text",
                placeHolder: "请输入债务方"
            },
            {
                key: "lmLoanConfigNo",
                name: "产品名称",
                type: "select",
                default: null,
                placeHolder: "请选择产品名称"
            },
            {
                key: "createTime",
                name: "申请时间",
                type: "range_date",
                feild_s: "createTimeMin",
                feild_e: "createTimeMax",
                withTime:true,
                placeHolder: ["开始时间", "结束时间"]
            },
            {
                key: "loanStartDate",
                name: "预计借款日期",
                type: "range_date",
                feild_s:"loanStartDateMin",
                feild_e:"loanStartDateMax",
                placeHolder: "预计借款开始日期"
            },
            {
                key: "status",
                name: "订单状态",
                type: "select",
                placeHolder: "请选择订单状态",
            }
        ]
    }
    componentDidMount() {
        axios_gyl.post("manage/dropdown/lm_loan_config_no",{allLabelFlag:false}).then(data => {
            this.setState({ lmLoanConfigNo: data.data.list })
        });
        axios_gyl.post("manage/dropdown/order_status",{allLabelFlag:false}).then(data=>{
            this.status = data.data.list;
            this.setState({ready:true});
        })
    }
    getStatusName(val){
        if(val === null || val === undefined) return '-';
        let status = this.status.find(item=>item.val === val+"")||{};
        return status.name || "-"
    }
    listRequestor(param) {
        return new Promise((resolve,reject)=>{
            axios_gyl.post("/manage/order/gyl/submit_success_list", param).then(data=>{
                let response = JSON.parse(JSON.stringify(data));
                response.data.list.forEach(item=>{
                    item.status = this.getStatusName(item.status)
                })
                resolve({...response})
            }).catch(e=>reject(e))
        })
    }
    detail(orderNo) {
        window.open('/jk/list/gyl/detail?orderNo=' + orderNo + '&audit=first&type=jk');
    }
    render() {
        const listProps = {
            items: this.items,
            columns: this.columns,
            filterOptions: { lmLoanConfigNo: this.state.lmLoanConfigNo , status:this.status },
            listRequestor: this.listRequestor.bind(this)
        }
        if(!this.state.ready) return <span />
        return <ListCtrl {...listProps} />
    }
}

export default ComponentRoute(BorrowListGyl);