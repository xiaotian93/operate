import React, { Component } from 'react';
// import { Table , Row } from 'antd';
// import moment from 'moment'

// import Filter from '../ui/Filter_nomal';
import { axios_repay } from '../../ajax/request';
import { host_repay } from '../../ajax/config';
import { statistics_overdue_list , statistics_overdue_export , statistics_overdue_total , statistics_select } from '../../ajax/api';
import { page } from '../../ajax/config';
import { format_table_data ,bmd} from '../../ajax/tool';
import Permissions from '../../templates/Permissions';
import List from '../templates/list';
class Overdue extends Component{
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            filter:{},
            pageSize:page.size,
            data:[],
            list:[],
            listPage:1
        };
        this.loader = [];
    }
    componentWillMount(){
        this.columns = [
            {
                title: '逾期范围',
                dataIndex: 'overdueTerm',
            },
            {
                title: '逾期未还订单数',
                dataIndex:'overdueOrderCount'
            },
            {
                title: '逾期未还人数',
                dataIndex:"overduePersonCount"
            },
            {
                title: '逾期未还本金',
                dataIndex:'overdueAmount',
                render:(data)=> data.money(),
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"overdueAmount")
                }
            },
            {
                title: '借款金额',
                dataIndex:'loanAmount',
                render:(data)=> data.money(),
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"loanAmount")
                }
            },
            {
                title:"应还本金",
                render:(data)=> data.loanAmount.money(),
                
            },
            {
                title: '已还本金',
                dataIndex:'repayAmount',
                render:(data)=> data.money(),
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"repayAmount")
                }
            },
            {
                title: '贷款余额',
                dataIndex:'balanceAmount',
                render:(data)=> data.money(),
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"balanceAmount")
                }
            }
        ];
        this.filter = {
            time :{
                name: "日期",
                type: "range_date",
                placeHolder: ["开始时间", "结束时间"],
                feild_s: "start_date",
                feild_e: "end_date"
            },
            product_name :{
                name:"产品名称",
                type:"select",
                placeHolder:"全部",
                values:"productName"
            },
            merchant_name :{
                name:"商户名称",
                type:"select",
                placeHolder:"全部",
                values:"merchantName"
            },
            business_name :{
                name:"业务名称",
                type:"select",
                placeHolder:"全部",
                values:[{name:"全部",val:""},{name:"白猫贷",val:"白猫贷"},{name:"信用贷",val:"信用贷"},{name:"小额贷",val:"小额贷"},{name:"车险分期",val:"车险分期"},{name:"智尊保业务",val:"智尊保"},{name:"花生业务",val:"花生"},{name:"员工贷",val:"员工贷"},{name:"经营贷",val:"经营贷"},{name:"房抵贷",val:"房抵贷"}]
            }
        }
    }
    componentDidMount(){
        this.get_select();
        var select=window.localStorage.getItem(this.props.location.pathname);
        if(select){
            this.get_list(1,JSON.parse(select).remberData);
        }else{
            this.get_list();
        }
        this.get_total();
    }
    get_list(page_no=1,filter={}){
        let rqd = JSON.parse(JSON.stringify(filter));
        rqd.page = page_no;
        rqd.size = page.size;
        this.setState({
            loading:true
        })
        this.loader.push("list");
        axios_repay.post(statistics_overdue_list,rqd).then((data)=>{
            let detail = data.data;
            this.loader.splice(this.loader.indexOf("list"),1);
            this.setState({
                list:format_table_data(detail),
                loading:this.loader.length>0,
                current:detail.current
            });
            (this.loader.length<=0)&&this.refresh_tabel("list");
        });
    }
    // 获取统计数据
    get_total(filter){
        this.loader.push("total");
        axios_repay.post(statistics_overdue_total,filter).then(res=>{
            this.loader.splice(this.loader.indexOf("total"),1);
            let total = res.data;
            total.key="total";
            total.overdueTerm = "合计";
            this.setState({
                loading:this.loader.length>0,
                totalDes:"此合计是当前查询结果的合计",
                total:total
            });
            (this.loader.length<=0)&&this.refresh_tabel("total");
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
        this.get_total(filter);
    }

    // 获取下拉菜单
    get_select(){
        axios_repay.get(statistics_select).then(data=>{
            let selects = data.data;
            let temp = {};
            for(let s in selects){
                if(!selects){
                    continue;
                }
                temp[s] = [];
                for(let t in selects[s]){
                    // 商户名称没有 需要判断
                    if(!selects[s][t]){
                        continue;
                    }
                    temp[s].push({name:selects[s][t],val:selects[s][t]})
                }
                temp[s].unshift({name:"全部",val:""})
            }
            this.setState({
                ...temp
            })
        })
    }
    // 翻页
    page_up(page,pageSize){
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
        let url = host_repay+statistics_overdue_export+"?"+query.join("&");
        window.open(url);
    }
    render (){
        const table_props = {
            rowKey:"key",
            columns:this.columns ,
            dataSource:this.state.data,
            pagination : false,
            loading:this.state.loading,
            footer:()=>this.state.totalDes,
            rowClassName:function(data){
            }
        }
        const table={
            filter:{
                "data-get":this.get_filter.bind(this),
                "data-source":this.filter,
                "phase":this.state.phase,
                "productName":this.state.productName,
                "merchantName":this.state.merchantName,
                "data-paths":this.props.location.pathname,
                "loanTerm":this.state.loanTerm
            },
            tableInfo:table_props,
            tableTitle:{
                left:<span>金额单位：元</span>,
                right:<Permissions type="primary" onClick={this.exportList.bind(this)} server={global.AUTHSERVER.loanmanage.key} permissions={global.AUTHSERVER.loanmanage.access.overdue_stats_export} tag="button">导出</Permissions>
            }
        }
        return(
            <List {...table} />
            // <div>
            //     <Filter data-get={this.get_filter.bind(this)} data-source={this.filter} phase={this.state.phase} productName={this.state.productName} merchantName={this.state.merchantName} loanTerm={this.state.loanTerm} />
            //     <Row className="table-content">
            //         <div className="table-btns">
            //             <span style={{marginTop:"10px"}}>金额单位:元</span>
            //             <div className="text-right">
            //             <Permissions type="primary" onClick={this.exportList.bind(this)} server={global.AUTHSERVER.loan.key} tag="button">导出</Permissions>
            //             </div>
            //         </div>
            //         <Table {...table_props} bordered />
            //     </Row>
            // </div>
        )
    }
}

export default Overdue;
