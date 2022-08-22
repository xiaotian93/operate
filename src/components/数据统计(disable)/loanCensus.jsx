import React, { Component } from 'react';
// import { Table , Row } from 'antd';
import moment from 'moment'

// import Filter from '../ui/Filter_nomal';
import { axios_bi } from '../../ajax/request';
import { host_repay } from '../../ajax/config';
import { statistics_loan_list_export , statistics_loan_total , app_config ,repay_apply_list} from '../../ajax/api';
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
                title: '进件日期',
                dataIndex: 'statDate',
                render:e=>e?e.split(" ")[0]:"--",
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"statDate",true)
                }
            },
            // {
            //     title: '商户名称',
            //     dataIndex:'loanOrderCount',
            //     width:70
            // },
            {
                title: '进件笔数',
                dataIndex:"applyCount",
            },
            {
                title: '进件总额',
                dataIndex:'applyAmount',
                render:(data)=> data.money(),
            },
            {
                title: '放款笔数',
                dataIndex:'loanCount',
                
            },
            {
                title: '放款总额',
                dataIndex:"loanAmount",
                render:(data)=> data.money(),
            },
            {
                title: '笔数通过率',
                render:e=>{
                    if(e.loanCount===0||e.applyCount===0){
                        return 0
                    }
                    return ((e.loanCount/e.applyCount)*100).toFixed(2)+"%"
                }
            },
            {
                title: '金额通过率',
                render:e=>{
                    if(e.loanAmount===0||e.applyAmount===0){
                        return 0
                    }
                    return ((e.loanAmount/e.applyAmount)*100).toFixed(2)+"%"
                }
            },
            {
                title: '进件件均',
                render:e=>{
                    if(e.applyAmount===0||e.applyCount===0){
                        return 0
                    }
                    return bmd.money(e.applyAmount/e.applyCount)
                },
            },
            {
                title: '放款件均',
                render:e=>{
                    if(e.loanAmount===0||e.loanCount===0){
                        return 0
                    }
                    return bmd.money(e.loanAmount/e.loanCount)
                },
            },
            {
                title: '进件加权平均期数',
                render:e=>e.toFixed(2),
                dataIndex:'weightedApplyPhaseCount'
            },
            {
                title: '放款加权平均期数',
                render:e=>e.toFixed(2),
                dataIndex:'weightedLoanPhaseCount'
            },
            {
                title: '进件加权平均费率',
                dataIndex:'weightedApplyGeneralRate',
                render:e=>(e*100).toFixed(2)+"%"
            },
            {
                title: '放款加权平均费率',
                dataIndex:'weightedLoanGeneralRate',
                render:e=>(e*100).toFixed(2)+"%"
            }
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
    }
    componentDidMount(){
        this.get_select();
        var select=JSON.parse(window.localStorage.getItem(this.props.location.pathname));
        if(select&&select.isRember){
            this.get_list(1,select.remberData);
        }else{
            this.get_list(1,this.state.filter);
        }
        // this.get_total();
    }
    get_list(page_no=1,filter={}){
        var param={}
        let rqd = JSON.parse(JSON.stringify(filter));
        param.start = page_no!==1?((page_no-1)*page.size):0;;
        param.size = page.size;
        param.filter=JSON.stringify(rqd);
        this.setState({
            loading:true
        })
        this.loader.push("list");
        
        axios_bi.post(repay_apply_list,param).then((data)=>{
            // setTimeout(function(){
                this.loader.splice(this.loader.indexOf("list"),1);
                let detail = data.data.list;
                 detail = format_table_data(data.data.list,page_no,page.size);
                let sum=data.data.sum;
                sum.key="合计";
                if(detail.length>0){
                    detail.push(sum)
                }
                // detail.push(sum);
                // this.get_list_other(detail,sum,param);
                this.setState({
                    list:detail,
                    loading:this.loader.length>0,
                    pageCurrent:parseInt((data.data.start/page.size),10)+1,
                    pageTotal:data.data.total
                });
                (this.loader.length<=0)&&this.refresh_tabel("list");
            // }.bind(this),3000)
        });
    }

    // 获取统计数据
    get_total(filter){
        this.loader.push("total");
        axios_bi.post(statistics_loan_total,filter).then(res=>{
            this.loader.splice(this.loader.indexOf("total"),1);
            let total = res.data;
            (this.loader.length<=0)&&this.refresh_tabel("total");
            total.key = "合计";
            if(!total.loanOrderCount&&!total.overdueOrderCount&&!total.repayOrderCount){
                total={}
            }
            this.setState({
                loading:this.loader.length>0,
                totalDes:total.loanAmount?"此合计是当前查询结果的合计":"",
                total:[total]
            });
        })
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
        // alert(page)
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

    render (){
        var page=parseInt(this.state.pageTotal/(this.state.pageSize + 1),10);
        let pagination = {
            total : this.state.pageTotal+page,
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
            },
            tableInfo:table_props,
            tableTitle:{
                left:<span>金额单位：元</span>,
                right:null
            }
        }
        return(
            <List {...table} />
        )
    }
}

export default Loan;
