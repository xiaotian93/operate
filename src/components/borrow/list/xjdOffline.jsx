import React, { Component } from 'react';
// import { Table , Row } from 'antd';

// import Filter from '../../../templates/Filter';
import { axios_xjdOffline } from '../../../ajax/request';
import { host_xjdOffline } from '../../../ajax/config';
import { xjdOffline_borrow_list , xjdOffline_borrow_list_export , xjdOffline_borrow_select_cop } from '../../../ajax/api';
import { page } from '../../../ajax/config';
import { format_table_data, bmd } from '../../../ajax/tool';
import Permissions from '../../../templates/Permissions';
import List from '../../templates/list';
class XjdOffline extends Component{
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            filter:{},
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
                title: '接受日期',
                dataIndex: 'receiveDate',
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"receiveDate",true)
                }
            },
            {
                title: '合作方代号',
                dataIndex:'copKey'
            },
            {
                title: '合作方订单号',
                dataIndex:"copOrderNo"
            },
            {
                title: '白猫贷订单号',
                dataIndex:'bmdOrderNo'
            },
            {
                title: '身份证',
                dataIndex:'borrowerIdNo'
            },
            {
                title: '姓名',
                dataIndex:"borrowerName"
            },
            {
                title: '手机号',
                dataIndex:'borrowerPhone'
            },
            {
                title: '借款金额',
                dataIndex:'amount',
                render:(data)=> bmd.money(data),
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"amount")
                }
            },
            {
                title: '借款天数',
                dataIndex:'period'
            },
            {
                title: '借款时间',
                dataIndex:'loanStartTime',
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"loanStartTime",true)
                }
            },
            {
                title: '借款结束日期',
                dataIndex:'loanEndDate',
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"loanEndDate",true)
                }
            },
            {
                title: '利息利率',
                dataIndex:'interestRate'
            },
            {
                title: '罚息利率',
                dataIndex:'penaltyRate'
            },
            {
                title: '借贷管理状态',
                dataIndex:'loanManageStatus'
            },
            {
                title: 'createTime',
                dataIndex:'createTime',
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"createTime",true)
                }
            },
            {
                title: '合作方流水号',
                dataIndex:'clientOrderNo'
            },
            {
                title: '支付渠道流水号',
                dataIndex:'payChannelSerialNumber'
            },
            {
                title: '交易日期',
                dataIndex:'tradeTime',
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"tradeTime",true)
                }
            },
            {
                title: '支付渠道',
                dataIndex:'payChannel'
            },
            {
                title: '银行卡号',
                dataIndex:'bankCardNo'
            }
        ];
        this.filter = {
            copKey :{
                name: "合作方代号",
                type: "select",
                placeHolder: "全部",
                values:"copKey"
            },
            loanStartDate :{
                name:"借款日期",
                type:"text",
                placeHolder:"请选择借款日期"
            },
            bmdOrderNo :{
                name:"白猫贷订单号",
                type:"text",
                placeHolder:"请输入白猫贷订单号"
            },
            borrowerIdNo :{
                name:"身份证",
                type:"text",
                placeHolder:"请输入身份证"
            },
            borrowerName :{
                name:"姓名",
                type:"text",
                placeHolder:"请输入姓名"
            },
            clientOrderNo :{
                name:"合作方流水号",
                type:"text",
                placeHolder:"请输入身份证"
            },
            payChannelSerialNumber :{
                name:"支付渠道流水号",
                type:"text",
                placeHolder:"请输入支付渠道流水号"
            },
            loanManageStatus :{
                name: "借贷管理状态",
                type: "select",
                placeHolder: "全部",
                values:[
                    {name: "全部", val: ""},
                    {name: "SEND_FINISH", val: "SEND_FINISH"},
                    {name: "INIT", val: "INIT"},
                    {name: "SEND_FAIL", val: "SEND_FAIL"},
                    {name: "NO_NEED_SEND", val: "NO_NEED_SEND"}
                ]
            },
            orderBy :{
                name: "排序",
                type: "select",
                placeHolder: "全部",
                resetValue:"receive_date-desc",
                values:[
                    {name: "接收日期倒序", val: "receive_date-desc"},
                    {name: "接收日期正序", val: "receive_date-asc"},
                    {name: "借款日期倒序", val: "loan_start_time-desc"},
                    {name: "借款日期正序", val: "loan_start_time-asc"}
                ]
            }
        }
    }
    componentDidMount(){
        this.getSelect();
        var select=window.localStorage.getItem(this.props.location.pathname);
        if(select){
            this.get_list(1,JSON.parse(select).remberData);
        }else{
            this.get_list();
        }
    }
    // 获取列表
    get_list(page_no=1,filter={}){
        let rqd = JSON.parse(JSON.stringify(filter));
        rqd.page = page_no;
        rqd.size = page.size;
        this.setState({
            loading:true
        });
        this.loader.push("list");
        axios_xjdOffline.post(xjdOffline_borrow_list,rqd).then((data)=>{
            this.loader.splice(this.loader.indexOf("list"),1);
            let detail = format_table_data(data.data.list);
            this.setTotal(false);
            this.setState({
                list:detail,
                loading:this.loader.length>0,
                pageCurrent:data.data.page,
                pageTotal:data.data.total
            });
            (this.loader.length<=0)&&this.refreshTabel("list");
        });
    }
    // 获取下拉菜单
    getSelect(){
        axios_xjdOffline.get(xjdOffline_borrow_select_cop).then(res=>{
            this.setState({
                copKey:res.data.list
            })
        })
    }
    // 获取统计数据
    // get_total(filter){
    //     this.loader.push("total");
    //     axios_repay.post(statistics_loan_total,filter).then(res=>{
    //         this.loader.splice(this.loader.indexOf("total"),1);
    //         let total = res.data;
    //         (this.loader.length<=0)&&this.refreshTabel("total");
    //         total.key = "合计";
    //         if(!total.loanOrderCount&&!total.overdueOrderCount&&!total.repayOrderCount){
    //             total=[]
    //         }
    //         this.setState({
    //             loading:this.loader.length>0,
    //             totalDes:total.loanAmount?"此合计是当前查询结果的合计":"",
    //             total:total
    //         });
    //     })
    // }
    // 设置统计数据
    setTotal(totalData){
        let totalInfo = {};
        totalInfo.key="合计";
        totalInfo.vipRealAmount = totalData.sumVipRealAmount;
        this.setState({
            loading:this.loader.length>0,
            totalDes:"此合计是当前查询结果的合计",
            total:[totalInfo]
        });
        if(!totalData){
            this.setState({
                loading:this.loader.length>0,
                totalDes:"",
                total:[]
            });
        }
        (this.loader.length<=0)&&this.refreshTabel("total");
    }
    // 刷新列表数据
    refreshTabel(type){
        this.setState({
            data:this.state.list.concat(this.state.total)
        })
    }

    // 查看详情
    showDetail(data){
        bmd.redirect("/vip/bmd/order/detail",{vipInfoId:data.vipInfoId});
    }

    // 获取筛选数据
    getFilter(data){
        let filter = {};
        filter = JSON.parse(JSON.stringify(data));
        this.setState({
            filter:filter
        })
        this.get_list(1,filter);
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
        let url = host_xjdOffline+xjdOffline_borrow_list_export+"?"+query.join("&");
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
        let pagination = {
            total : this.state.pageTotal,
            current : this.state.pageCurrent,
            pageSize : this.state.pageSize,
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
        // const defaultValue = {
        //     orderBy:"receive_date-desc"
        // }
        const table={
            filter:{
                "data-get":this.getFilter.bind(this),
                "data-source":this.filter,
                copKey:this.state.copKey,
                orderBy:"receive_date-desc",
                "data-paths":this.props.location.pathname,
            },
            tableInfo:table_props,
            tableTitle:{
                left:<span>
                    金额单位：元 
                </span>,
                right:<span>
                    <Permissions type="primary" onClick={this.exportList.bind(this)} server={global.AUTHSERVER.loan.key} tag="button">导出</Permissions>
                </span>
            },
            
        }
        return(
            <List {...table} />
            // <div>
            //     <Filter defaultValue={defaultValue} data-get={this.getFilter.bind(this)} data-source={this.filter} copKey={this.state.copKey} />
            //     <Row className="table-content">
            //         <div className="table-btns">
            //         <span style={{marginTop:"10px"}}>金额单位:元</span>

            //             <div className="text-right">
            //                 <Permissions type="primary" onClick={this.exportList.bind(this)} server={global.AUTHSERVER.loan.key} tag="button">导出</Permissions>
                            
            //             </div>
            //         </div>
            //         <Table {...table_props} bordered />
            //     </Row>
            // </div>
        )
    }
}

export default XjdOffline;
