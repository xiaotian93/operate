import React, { Component } from 'react';
// import { Button } from 'antd';
import moment from 'moment';

// import Filter from '../../../templates/Filter';
import { axios_xjd_p } from '../../../ajax/request';
import { host_xjd } from '../../../ajax/config';
import { operation_rd_tdf_list , operation_rd_tdf_export } from '../../../ajax/api';
import { page } from '../../../ajax/config';
import { format_table_data, bmd } from '../../../ajax/tool';
import Permissions from '../../../templates/Permissions';
import List from '../../templates/list';
class Loan extends Component{
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            filter:{
                startRepayDate:moment().subtract(1,"week").format("YYYY-MM-DD"),
                endRepayDate:moment().format("YYYY-MM-DD")
            },
            pageTotal:1,
            pageCurrent:1,
            pageSize:page.size,
            data:[],
            total:{},
            list:[],
            listPage:1
        };
        this.loader = [];
    }
    componentWillMount(){
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
            // {
            //     title: '统计日期',
            //     dataIndex:'statDate',
            //     render: e => {
            //         return e?moment(e).format("YYYY-MM-DD"):"--"
            //     }
            // },
            {
                title: '订单编号',
                dataIndex: 'contractNo',
                render:e=>(e||"--")
            },
            {
                title: '应还款日',
                dataIndex: 'planRepayDate',
                render: e => {
                            return e?moment(e).format("YYYY-MM-DD"):"--"
                        }
            },
            {
                title: '借款人',
                dataIndex:"borrowerName",
                render:e=>(e||"--")
            },
            // {
            //     title: '借款日期',
            //     dataIndex:'loanDate',
            //     render:e=>e?moment(e).format("YYYY-MM-DD"):"--"
            // },
            {
                title: '借款金额',
                dataIndex:'contractAmount',
                render:e=>bmd.money(e)||"--"
            },
            {
                title: '借贷日期',
                dataIndex:'loanDate',
                render:e=>e||"--"
            },
            {
                title: '借款总期数',
                dataIndex:"phaseCount",
                render:e=>(e||"--")
            },
            {
                title: '本期期数',
                dataIndex:"phase",
                render:e=>(e||"--")
            },
            {
                title: '本期贷款余额',
                dataIndex:'remainAmount',
                render:(data)=> bmd.money(data),
            },
            {
                title: '融单服务费',
                dataIndex:'settlementFee',
                render:(data)=> bmd.money(data),
            },
        ];
        this.filter = {
            time :{
                name: "日期范围",
                type: "range_date_day",
                placeHolder: ["开始时间", "结束时间"],
                feild_s: "startRepayDate",
                feild_e: "endRepayDate",
                default:[moment().subtract(1,"week"),moment()]
            },
            contractNo:{
                name:"订单编号",
                type:"text"
            }
        }
    }
    componentDidMount(){
        var select=window.localStorage.getItem(this.props.location.pathname);
        if(select&&select.isRember){
            this.get_list(1,JSON.parse(select).remberData);
        }else{
            this.get_list();
        }
    }
    get_list(page_no=1,filter=this.state.filter){
        let rqd = JSON.parse(JSON.stringify(filter));
        rqd.page = page_no;
        rqd.size = page.size;
        this.setState({
            loading:true
        })
        this.loader.push("list");
        axios_xjd_p.post(operation_rd_tdf_list,rqd).then((data)=>{
            this.loader.splice(this.loader.indexOf("list"),1);
            var sum=data.data.statistics?data.data.statistics.sumStats:{};
            sum.key="合计";
            data.data.list.push(sum);
            let detail = format_table_data(data.data.list,page_no,page.size);
            this.setState({
                data:detail,
                loading:this.loader.length>0,
                pageCurrent:data.data.page,
                pageTotal:data.data.total
            });
        });
    }
    // 获取筛选数据
    get_filter(data){
        let filter = {};
        filter = JSON.parse(JSON.stringify(data));
        this.setState({
            filter:filter
        })
        this.get_list(this.state.listPage,filter);
        // axios_xjd_p.get("/test/dddd",{a:1});
        // this.get_total(filter);
    }

    // 翻页
    page_up(page,pageSize){
        window.scrollTo(0,0);
        this.setState({
            listPage:page
        })
        this.get_list(page,this.state.filter);
    }
    // 导出
    exportList(){
        let query = [];
        for(let f in this.state.filter){
            query.push(f+"="+this.state.filter[f]);
        }
        let url = host_xjd+operation_rd_tdf_export+"?"+query.join("&");
        window.open(url);
    }

    // 显示总数
    showTotal(){
        return "共"+this.state.pageTotal+"条数据"
    }

    render (){
        if(this.props.children){
            return this.props.children
        }
        var page=parseInt(this.state.pageTotal/(this.state.pageSize + 1),10);
        let pagination = {
            total : this.state.pageTotal+page,
            current : this.state.pageCurrent,
            pageSize : this.state.pageSize+1,
            showTotal:this.showTotal.bind(this),
            onChange : this.page_up.bind(this)
        }
        const table_props = {
            rowKey:"key",
            columns:this.columns ,
            dataSource:this.state.data,
            footer:()=>this.state.totalDes,
            pagination : pagination,
            loading:this.state.loading,
        }
        const table={
            filter:{
                "data-get":this.get_filter.bind(this),
                "data-source":this.filter,
                "defaultValue":this.state.filter,
                "data-paths":this.props.location.pathname,
                time:[moment().subtract(1,"week"),moment()]
            },
            tableInfo:table_props,
            tableTitle:{
                left:<span>金额单位：元</span>,
                right:<Permissions type="primary" onClick={this.exportList.bind(this)} server={global.AUTHSERVER.bmdCashLoan.key} tag="button" >导出</Permissions>
            }
        }
        return(
            <List {...table} />
        )
    }
}

export default Loan;
