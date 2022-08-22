import React, { Component } from 'react';
// import { Table , Row } from 'antd';

// import Filter from '../../ui/Filter_obj8';
import { axios_payState } from '../../../ajax/request'
import { trade_repay_list } from '../../../ajax/api';
import { page } from '../../../ajax/config';
import { format_table_data ,bmd} from '../../../ajax/tool';
import ComponentRoute from '../../../templates/ComponentRoute';
import List from '../../templates/list';
class Borrow extends Component{
    constructor(props) {
        super(props);
        this.state = {
            selectedRows: [],
            loading: false,
            total:1,
            current:1,
            filter:{},
            pageSize:page.size,
            data:[]            
        };
    }
    componentWillMount(){
        const status={
            10:"初始化",
            20:"待回调",
            30:"已成功",
            40:"发送中",
            41:"确认中",
            50:"本地错误",
            51:"本地错误",
            54:"已失败",
            55:"已拒绝",
            60:"已退款"
        }
        this.columns = [
            {
                title: '序号',
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
                dataIndex: 'buOrderId'
            },
            {
                title: '金额',
                dataIndex:"amount",
                render : (data) => {
                    return data?(data/100).toFixed(2):"--"
                },
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"amount")
                }
            },
            {
                title: '账户名',
                dataIndex:"accountName"
            },
            {
                title: '银行卡号',
                dataIndex:'bankCardNumber',

            },
            {
                title: '支付通道',
                dataIndex:'channelName',
            },
            {
                title: '支付商户号',
                dataIndex:'merchantId',

            },
            {
                title: '支付成功时间',
                dataIndex:'successTime',
                render: data => bmd.format_time(data) || "--",
                sorter: (at, bt) => bmd.getTimes(at) - bmd.getTimes(bt)
            },
            {
                title: '支付状态',
                dataIndex:'status',
                render:e=>{
                    return status[e]
                }
            },
            {
                title: '备注',
                dataIndex:'failReason',
                render:e=>{
                    return e||"--"
                }

            },
        ];
        this.filter = {
            buOrderId :{
                name:"订单编号",
                type:"text",
                placeHolder:"请输入订单编号"
            },
            accountName: {
                name: "账户名",
                type: "text",
            },
            channelName: {
                name: "支付通道",
                type: "select",
                values: [{ name: "全部", val: "" }, { name: "连连支付", val: "连连支付" }, { name: "宝付支付", val: "宝付支付" }, { name: "通联支付", val: "通联支付" }, { name: "富友支付", val: "富友支付" }, { name: "畅捷支付", val: "畅捷支付" }, { name: "易宝支付", val: "易宝支付" }, { name: "联动优势", val: "联动优势" }, { name: "快钱支付", val: "快钱支付" }, { name: "中金支付", val: "中金支付" }, { name: "趣店支付宝", val: "趣店支付宝" }, { name: "百信银行", val: "百信银行" },]
            },
            merchantId: {
                name: "商户号",
                type: "text",
            },
            status: {
                name: "支付状态",
                type: "select",
                values: [
                    { name: "全部", val: "" },
                    { name: "初始化", val: "10" },
                    { name: "待确认", val: "11" },
                    { name: "待回调", val: "20" },
                    { name: "成功", val: "30" },
                    { name: "发送中", val: "40" },
                    { name: "确认中", val: "41" },
                    { name: "本地初始错误", val: "50" },
                    { name: "本地支付错误", val: "51" },
                    { name: "失败", val: "54" },
                    { name: "已拒绝", val: "55" },
                    { name: "已退款", val: "60" },
                ]

            }
        }
    }
    componentDidMount(){
        var select=window.localStorage.getItem(this.props.location.pathname);
        if(select){
            this.get_list(1,JSON.parse(select).remberData);
        }else{
            this.get_list();
        }
    }
    get_list(page_no,filter={}){
        let data = JSON.parse(JSON.stringify(filter));
        data.page = page_no||1;
        data.size = page.size;
        this.setState({
            loading:true,
        })
        axios_payState.post(trade_repay_list,data).then((data)=>{
            let list = data.data;
            this.setState({
                data:format_table_data(list.list,page_no,page.size),
                loading:false,
                total:list.total,
                current:list.page,
            })
        });
    }
    get_filter(data){
        let filter = {};
        filter = JSON.parse(JSON.stringify(data));
        this.setState({
            filter:filter
        })
        this.get_list(1,filter);
    }
    page_up(page,pageSize){
        window.scrollTo(0,0);
        this.get_list(page,this.state.filter);
    }
    render (){
        let pagination = {
            total : this.state.total,
            current : this.state.current,
            pageSize : this.state.pageSize,
            onChange : this.page_up.bind(this),
            showTotal:total=>`共${total}条数据`
        }
        const table_props = {
            columns:this.columns ,
            dataSource:this.state.data,
            pagination : pagination,
            loading:this.state.loading,
        }
        const table={
            filter:{
                "data-get":this.get_filter.bind(this),
                "data-source":this.filter,
                "data-paths":this.props.location.pathname,
            },
            tableInfo:table_props,
            tableTitle:{
                left:<span>
                    金额单位：元 
                </span>,
                right:null
            }
        }
        return(
            <List {...table} />
            // <div className="Component-body">
            //     <Filter data-get={this.get_filter.bind(this)} data-source={this.filter} />
            //     <Row className="table-content">
            //         <span>金额单位：元</span>
            //         <Table {...table_props} bordered />
            //     </Row>
            // </div>
        )
    }
}

export default ComponentRoute(Borrow);