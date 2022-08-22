import React, { Component } from 'react';
import { axios_ygd } from '../../../ajax/request';
import { get_pay_success_list_ygd } from '../../../ajax/api';
import { bmd} from '../../../ajax/tool';
import ComponentRoute from '../../../templates/ComponentRoute';
import Permissions from '../../../templates/Permissions';
import ListCtrl from '../../../controllers/List';

class check_hs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRows: [],
            loading: false,
            total: 1,
            current: 1,
            pageSize: 30,
            data: [],
            model: {
                visible: false,
                loading: false,
                title: '确认通过？',
                text: '',
                approved: true,
                id: 0
            },
            companys: []
        };
    }
    componentWillMount() {
        const status = {
            "0":"草稿",
            "20":"初审中",
            "21":"复审中",
            "30":"待付款",
            "31":"付款中",
            "40":"放款完成",
            "60":"已结清",
            "61":"审核未通过",
            "62":"放款失败"
        }
        this.columns = [
            {
                title: '序号',
                width: 50,
                dataIndex: 'key',
                render:(text,record,index)=>{
                    if(text==="合计"){
                        return text;
                    }
                    return `${index+1}`
                }
            },
            {
                title: '订单编号',
                //width:360,
                dataIndex: 'orderNo',
            },
            {
                title: '订单时间',
                //width:360,
                dataIndex: 'orderTime',
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"orderTime",true)
                }
            },
            {
                title: '借款方',
                dataIndex: 'borrowerName',
                render: (e) => {
                    return e ? e : "-"
                }
            },
            {
                title: '借款金额',
                //width:100,
                dataIndex:"amount",
                render: (data) => {
                    return data ? data.money() : "-"
                },
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"amount")
                }
            },
            {
                title: '借款期限(月)',
                //width:100,
                dataIndex: 'period',
                render: (e) => {
                    // var periodType={1:"日",2:"周",3:"月",4:"季",5:"年"};
                    return e ? e : "-"
                }
            },
            {
                title: '批次',
                //width:160,
                dataIndex: "series",
                render: (e) => {
                    return e ? e : "-"
                }
            },
            {
                title: '订单状态',
                //width:160,
                dataIndex: "status",
                render: (e) => {
                    return status[e]
                }
            },
            {
                title: '备注',
                //width:160,
                dataIndex: "remark",
                render: (e) => {
                    return e ? e : "-"
                }
            },
            {
                title: '操作',
                //fixed: 'right',
                render: (data) => {
                    return (
                        <span>
                            <Permissions size="small" onClick={() => (this.detail(data.orderNo))} server={global.AUTHSERVER.ygd.key} tag="button" permissions={global.AUTHSERVER.ygd.access.ygd_pay_success_detail} src={'/jk/list/ygd/detail?orderNo=' + data.orderNo + '&audit=first&type=jk'}>查看</Permissions>
                        </span>
                    )
                }
            }
        ];
        this.filter = {
            
        }

    }
    filters = [
        {
            name: "订单编号",
            key:"orderNo",
            type: "text",
            placeHolder: "请输入订单编号"
        },
        {
            name: "订单时间",
            key:"time",
            type: "range_date",
            feild_s: "orderStartTime",
            feild_e: "orderEndTime",
            placeHolder: ['开始日期', "结束日期"]
        },
        {
            name: "借款方",
            key:"borrowerName",
            type: "text",
            placeHolder: "请输入借款方"
        },
        {
            name: "批次",
            key:"series",
            type: "text",
            placeHolder: "请输入批次"
        }
    ]
    listRequestor(param){
        return axios_ygd.post(get_pay_success_list_ygd,param)
    }
   
    detail(orderNo) {
        window.open('/jk/list/ygd/detail?orderNo=' + orderNo + '&audit=first&type=jk');
    }
   
    render() {
        const listProps = {
            items: this.filters,
            columns: this.columns,
            listRequestor: this.listRequestor.bind(this)
        }
        return <ListCtrl {...listProps} />
    }
}

export default ComponentRoute(check_hs);
