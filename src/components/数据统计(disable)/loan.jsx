import React, { Component } from 'react';
import { Tooltip } from 'antd';
import moment from 'moment'

// import Filter from '../ui/Filter_nomal';
import { axios_bi } from '../../ajax/request';
import { host_repay } from '../../ajax/config';
import { loan_census_list , statistics_loan_list_export , app_config ,bussiness_list,repay_census_list} from '../../ajax/api';
import { page } from '../../ajax/config';
import { format_table_data ,bmd} from '../../ajax/tool';
import List from '../templates/list';
class Loan extends Component{
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            // filter:{},
            pageTotal:1,
            pageCurrent:1,
            pageSize:page.size,
            data:[],
            total:[],
            list:[],
            listPage:1,
            filter:{
                startDate:moment().subtract(1,"months").format("YYYY-MM-DD"),
                endDate:moment().format("YYYY-MM-DD")
            },
            set_select:"test",
            monthAmount:0,
            monthCount:0,
            last_monthAmount:0,
            last_monthCount:0
        };
        this.loader = [];
    }
    componentWillMount(){
        this.columns = [
            {
                title: '序号',
                dataIndex: 'key',
                width:50,
                render:(text,record,index)=>{
                    if(text==="合计"){
                        return text;
                    }
                    return `${index+1}`
                }
            },
            {
                title: '日期',
                dataIndex: 'statDate',
                render:e=>e?e.split(" ")[0]:"--",
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"statDate",true)
                }
            },
            {
                title: '借贷笔数',
                dataIndex:'loanCount',
                render:e=>e?e:"0"
            },
            {
                title: '借贷金额',
                dataIndex:"loanAmount",
                render:e=>e?e.money():"0"
            },
            {
                title: <Tooltip title="当日应还未还金额=还款计划应还金额-已还金额"><span>当日应还未还金额</span></Tooltip>,
                render:(e)=> {
                    var data=e.bussiness.money;
                    var money=data.planLeftPrincipal+data.planLeftInterest+data.planLeftServiceFee+data.planLeftOtherFee;
                    return money.money();
                },
            },
            {
                title: <Tooltip title="当日应还未还对应实还金额即当日应还未还在当日实还金额"><span>当日应还未还对应实还金额</span></Tooltip>,
                render:(e)=> {
                    var data=e.bussiness.money;
                    var money=data.planLeftRepayInterest+data.planLeftRepayOverdueInterest+data.planLeftRepayOtherFee+data.planLeftRepayPenaltyAheadFee+data.planLeftRepayPenaltyOverdueFee+data.planLeftRepayPrincipal+data.planLeftRepayServiceFee;
                    return money.money();
                },
            },
            // {
            //     title: '总借贷笔数',
            //     // dataIndex:"bussiness.totalLoanCount",
            //     render:e=>{
            //         return e.key==="合计"?"--":e.bussiness.totalLoanCount
            //     }
            // },
            // {
            //     title: '总借贷金额',
            //     // dataIndex:"bussiness.totalLoanAmount",
            //     render:e=>{return e.key==="合计"?"--":e.bussiness.totalLoanAmount.money()}
            // },
            {
                title: '当前累计逾期本金',
                render:e=>{
                    var sum=e.bussiness;
                    var overdue=sum.overdue_1_principal+sum.overdue_2_3_principal+sum.overdue_4_7_principal+sum.overdue_8_14_principal+sum.overdue_15_21_principal+sum.overdue_22_30_principal+sum.overdue_31_60_principal+sum.overdue_61_90_principal+sum.overdue_91_120_principal+sum.overdue_121_150_principal+sum.overdue_151_180_principal+sum.overdue_180p_principal;
                    return e.key==="合计"?"--":overdue.money()
                }
            },
            {
                title: '贷款余额',
                // dataIndex:"bussiness.balance",
                render:e=>{return e.key==="合计"?"--":e.bussiness.balance.money()}
            },
        ];
        this.filter = {
            time :{
                name: "日期",
                type: "range_date_day",
                placeHolder: ["开始时间", "结束时间"],
                feild_s: "startDate",
                feild_e: "endDate",
                default:[moment().subtract(1,"months"),moment()],
                no_clear:true
            },
            domain :{
                name:"业务",
                type:"select",
                placeHolder:"全部",
                values:"domain",
                relevance:"parent",
                relevanceChild:"appKey"
            },
            appKey :{
                name:"项目",
                type:"select",
                placeHolder:"全部",
                values:"appKey",
                relevance:"domain"
            },
            channel :{
                name:"渠道",
                type:"text",
                placeHolder:"全部",
            },
        }
        this.get_select();

    }
    componentDidMount(){
        var select=JSON.parse(window.localStorage.getItem(this.props.location.pathname));
        if(select&&select.isRember){
            this.get_list(1,select.remberData);
        }else{
            this.get_list(1,this.state.filter);
        }
        // this.get_total();
    }
    get_list(page_no=1,filter={}){
        var param={};
        let rqd = JSON.parse(JSON.stringify(filter));
        param.start = page_no!==1?((page_no-1)*page.size):0;
        param.size = page.size;
        // param.size=30;
        param.filter=JSON.stringify(rqd)
        this.setState({
            loading:true
        })
        this.loader.push("list");
        axios_bi.post(repay_census_list,param).then((data)=>{
                this.loader.splice(this.loader.indexOf("list"),1);
                let detail = format_table_data(data.data.list,page_no,page.size);
                let sum=data.data.sum;
                sum.key="合计";
                this.get_list_bussiness(detail,sum,param);
        });
        this.get_total(filter);
    }
    get_list_bussiness(detail,sum,rqd){
        axios_bi.post(bussiness_list,rqd).then(e=>{  //repay_apply_list
            var apply_data=format_table_data(e.data.list);
            var apply_sum=e.data.sum;
            for(var i in apply_data){
                for(var j in detail){
                    if(apply_data[i].statDate===detail[j].statDate){
                        apply_data[i].money=detail[j];
                    }
                }
            }
            apply_sum.key="合计";
            apply_sum.money=sum;
            if(apply_data.length>0){
                apply_data.push(apply_sum);
            }
            this.get_list_other(apply_data,apply_sum,rqd);
        })
    }
    get_list_other(detail,sum,rqd){
        axios_bi.post(loan_census_list,rqd).then(e=>{
            var apply_data=format_table_data(e.data.list);
            var apply_sum=e.data.sum;
            for(var i in apply_data){
                for(var j in detail){
                    if(apply_data[i].statDate===detail[j].statDate){
                        apply_data[i].bussiness=detail[j];
                    }
                }
            }
            apply_sum.key="合计";
            apply_sum.bussiness=sum;
            if(apply_data.length>0){
                apply_data.push(apply_sum);
            }
            console.log(apply_data)
            this.setState({
                list:apply_data,
                loading:this.loader.length>0,
                pageCurrent:parseInt((e.data.start/page.size),10)+1,
                pageTotal:e.data.total
            });
        })
    }
    // 获取统计数据
    get_total(filter){
        var month={
            startDate:moment().startOf('month').format("YYYY-MM-DD"),
            endDate:moment().format("YYYY-MM-DD")
        }
        var last_month={
            startDate:moment().month(moment().month() - 1).startOf('month').format("YYYY-MM-DD"),
            endDate:moment().month(moment().month() - 1).endOf('month').format("YYYY-MM-DD")
        }
        //本月数据
        let month_rqd = JSON.parse(JSON.stringify(filter));
        month_rqd.startDate=month.startDate;
        month_rqd.endDate=month.endDate;
        var month_param={
            start : 0,
            size : page.size,
            filter:JSON.stringify(month_rqd)
        }
        axios_bi.post(loan_census_list,month_param).then((data)=>{
            var sum=data.data.sum;
            this.setState({
                monthAmount:sum.loanAmount,
                monthCount:sum.loanCount
            })
        });
        //上月数据
        let last_month_rqd = JSON.parse(JSON.stringify(filter));
        last_month_rqd.startDate=last_month.startDate;
        last_month_rqd.endDate=last_month.endDate;
        var last_month_param={
            start : 0,
            size : page.size,
            filter:JSON.stringify(last_month_rqd)
        }
        axios_bi.post(loan_census_list,last_month_param).then((data)=>{
            var sum=data.data.sum;
            this.setState({
                last_monthAmount:sum.loanAmount,
                last_monthCount:sum.loanCount
            })
        });
    }
    // 刷新列表数据
    refresh_tabel(type){
        this.setState({
            data:this.state.list.concat(this.state.total)
        })
    }
    get_filter(data){
        let paths = this.props.location.pathname;
        window.localStorage.setItem(paths,JSON.stringify(data))
        let filter = {};
        filter = JSON.parse(JSON.stringify(data));
        this.setState({
            filter:filter
        })
        this.get_list(this.state.listPage,filter);
        // this.get_total(filter);
    }

    // 获取下拉菜单
    get_select(){
        axios_bi.post(app_config).then(data=>{
            var list=data.data.list,domainArr=[],appArr=[],dataNew={};
            for(var i = 0; i < list.length; i++) {
                
                if(!dataNew[list[i].domain]) {
                    var json={}
                    var arr = [];
                    json.name=list[i].domainName;
                    json.val=list[i].domain
                    arr.push({name:list[i].appName,val:list[i].appKey});
                    json.child=arr;
                    dataNew[list[i].domain] = json;
                }else {
                    dataNew[list[i].domain].child.push({name:list[i].appName,val:list[i].appKey})
                }
            }
            this.setState({
                domain:domainArr,
                appKey:appArr,
                select_data:dataNew
            })
        })
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
        let url = host_repay+statistics_loan_list_export+"?"+query.join("&");
        window.open(url);
    }

    // 
    showTotal(){
        return "共"+this.state.pageTotal+"条数据"
    }
    select_val(e){
        this.setState({
            set_select:e
        })
    }
    render (){
        var page=parseInt(this.state.pageTotal/(this.state.pageSize + 1),10);
        let pagination = {
            total : this.state.pageTotal+page+1,
            current : this.state.pageCurrent,
            pageSize : Number(Number(this.state.pageSize)+1),
            showTotal:this.showTotal.bind(this),
            onChange : this.page_up.bind(this)
        }
        const table_props = {
            rowKey:"key",
            columns:this.columns ,
            dataSource:this.state.list,
            footer:()=>this.state.totalDes,
            pagination : pagination,
            loading:this.state.loading,
            // scroll:{y:window.innerHeight-310},

        }
        const table={
            filter:{
                "data-get":this.get_filter.bind(this),
                "data-source":this.filter,
                "domain":this.state.select_data,
                "appKey":this.state.select_data,
                "data-paths":this.props.location.pathname,
                time:[moment().subtract(1,"months"),moment()],
                "set-select":this.select_val.bind(this)
            },
            tableInfo:table_props,
            tableTitle:{
            left:<span>金额单位：元<div style={{fontSize:"14px"}}>本月放款金额：{bmd.money(this.state.monthAmount)}元；本月放款笔数：{this.state.monthCount}；上月放款金额：{bmd.money(this.state.last_monthAmount)}元；上月放款笔数：{this.state.last_monthCount}；</div></span>,
                right:null
            }
        }
        return(
            <List {...table} />
        )
    }
}

export default Loan;
