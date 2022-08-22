import React, { Component } from 'react';
// import { Button } from 'antd';
// import moment from 'moment'

// import Filter from '../../../templates/Filter';
import { axios_xjd } from '../../../ajax/request';
import { host_xjd } from '../../../ajax/config';
import { vip_order_list , vip_order_export } from '../../../ajax/api';
import { page } from '../../../ajax/config';
import { format_table_data, bmd } from '../../../ajax/tool';
import Permissions from '../../../templates/Permissions';
import List from '../../templates/list';
class Loan extends Component{
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
                dataIndex: 'orderNo',
                render:e=>(e||"-")
            },
            {
                title: '订单时间',
                dataIndex:'orderTime',
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"orderTime",true)
                }
            },
            {
                title: '会员编号',
                dataIndex:"vipNo"
            },
            {
                title: '会员姓名',
                dataIndex:'borrower'
            },
            {
                title: '联系电话',
                dataIndex:'phoneNo'
            },
            {
                title: '会员卡类型',
                dataIndex:"vipName"
            },
            {
                title: '购买价格',
                dataIndex:'vipRealAmount',
                render:(data)=> bmd.money(data),
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"vipRealAmount")
                }
            },
            {
                title: '会员状态',
                dataIndex:'vipStatusStr'
            },
            {
                title: '是否支付',
                dataIndex:'payStatusStr'
            },
            {
                title: '借贷服务',
                dataIndex:'loanUseStatusStr'
            },
            {
                title: '操作',
                render:data=>{
                    return data.key!=="合计"?<Permissions size="small" onClick={(e)=>this.showDetail(data)} server={global.AUTHSERVER.bmdCashLoan.key} tag="button" permissions={global.AUTHSERVER.bmdCashLoan.access.vip_detail} src={"/vip/bmd/order/detail?vipInfoId="+data.vipInfoId}>查看</Permissions>:""
                }
            }
        ];
        this.filter = {
            time :{
                name: "订单时间",
                type: "range_date",
                placeHolder: ["开始时间", "结束时间"],
                feild_s: "startTime",
                feild_e: "endTime"
            },
            orderNo :{
                name:"订单编号",
                type:"text",
                placeHolder:"请输入订单编号"
            },
            borrower :{
                name:"会员姓名",
                type:"text",
                placeHolder:"请输入会员姓名"
            },
            vipNo :{
                name:"会员编号",
                type:"text",
                placeHolder:"请输入会员编号"
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
        // this.get_list();
    }
    get_sort(){
        this.setState({
            data:format_table_data(this.state.data)
        })
    }
    get_list(page_no=1,filter={}){
        let rqd = JSON.parse(JSON.stringify(filter));
        rqd.page = page_no;
        rqd.size = page.size;
        this.setState({
            loading:true
        })
        this.loader.push("list");
        axios_xjd.post(vip_order_list,rqd).then((data)=>{
            this.loader.splice(this.loader.indexOf("list"),1);
            let detail = format_table_data(data.data.list,page_no,page.size);
            this.setTotal(detail.length>0?data.data.statistics:false);
            this.setState({
                list:detail,
                loading:this.loader.length>0,
                pageCurrent:data.data.page,
                pageTotal:data.data.total
            });
            (this.loader.length<=0)&&this.refresh_tabel("list");
        });
    }
    // 获取统计数据
    // get_total(filter){
    //     this.loader.push("total");
    //     axios_repay.post(statistics_loan_total,filter).then(res=>{
    //         this.loader.splice(this.loader.indexOf("total"),1);
    //         let total = res.data;
    //         (this.loader.length<=0)&&this.refresh_tabel("total");
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
        (this.loader.length<=0)&&this.refresh_tabel("total");
    }
    // 刷新列表数据
    refresh_tabel(type){
        this.setState({
            data:this.state.list.concat(this.state.total)
        })
    }

    // 查看详情
    showDetail(data){
        bmd.navigate("/vip/bmd/order/detail",{vipInfoId:data.vipInfoId});
    }

    // 获取筛选数据
    get_filter(data){
        let filter = {};
        filter = JSON.parse(JSON.stringify(data));
        this.setState({
            filter:filter
        })
        this.get_list(this.state.listPage,filter);
        // axios_xjd.get("/test/dddd",{a:1});
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
        let url = host_xjd+vip_order_export+"?"+query.join("&");
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
            // rowKey:"key",
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
                "data-paths":this.props.location.pathname
            },
            tableInfo:table_props,
            tableTitle:{
                left:<span>金额单位：元</span>,
                right:<Permissions type="primary" onClick={this.exportList.bind(this)} server={global.AUTHSERVER.bmdCashLoan.key} tag="button" permissions={global.AUTHSERVER.bmdCashLoan.access.vip_export}>导出</Permissions>
            }
        }
        return(
            <List {...table} />
            // <div>
            //     <Filter data-get={this.get_filter.bind(this)} data-source={this.filter} defaultValue={this.state.filter} />
            //     <Row className="table-content">
            //         <div className="table-btns">
            //             <span style={{marginTop:"10px"}}>金额单位:元</span>
            //             <div className="text-right">
            //                 <Permissions type="primary" onClick={this.exportList.bind(this)} server={global.AUTHSERVER.bmdCashLoan.key} tag="button">导出</Permissions>
            //             </div>
            //         </div>
            //         <Table {...table_props} bordered />
            //     </Row>
            // </div>
        )
    }
}

export default Loan;
