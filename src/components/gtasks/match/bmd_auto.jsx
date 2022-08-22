import React, { Component } from 'react';
// import { Button } from 'antd';
// import moment from 'moment'

// import Filter from '../../../templates/Filter';
import { axios_xjd } from '../../../ajax/request';
import { host_xjd } from '../../../ajax/config';
import { xjd_credit_system_list , vip_order_export ,xjd_select_channel} from '../../../ajax/api';
import { page } from '../../../ajax/config';
import { format_table_data, bmd } from '../../../ajax/tool';
import List from '../../templates/list';
import Permissions from '../../../templates/Permissions';
class Loan extends Component{
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            filter:{
                status:"0"
            },
            pageTotal:1,
            pageCurrent:1,
            pageSize:page.size,
            data:[],
            total:[],
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
                dataIndex: 'requestId',
            },
            {
                title: '订单时间',
                dataIndex:'requestTime',
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"requestTime",true)
                }
            },
            {
                title: '借款方',
                dataIndex:"name"
            },
            {
                title: '手机号',
                dataIndex:'phoneNo'
            },
            {
                title: '状态',
                dataIndex:'statusStr'
            },
            {
                title: '注册渠道',
                dataIndex:'clientChannel',
            },
            {
                title: '操作',
                render:data=>{
                    return data.key!=="合计"?<Permissions size="small" onClick={(e)=>this.showDetail(data)} tag="button" to={'/db/bmd/auto'} permissions={global.AUTHSERVER.bmdCashLoan.access.credit_system_detail} src={"/db/bmd/auto/detail?requestId="+data.requestId+"&audit=true&type=auto"}>查看</Permissions>:""
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
            requestId :{
                name:"订单编号",
                type:"text",
                placeHolder:"请输入订单编号"
            },
            borrower :{
                name:"借款方",
                type:"text",
                placeHolder:"请输入借款方"
            },
            phoneNo :{
                name:"手机号",
                type:"text",
                placeHolder:"请输入手机号"
            },
            status :{
                name:"状态",
                type:"select",
                resetValue:"0",
                placeHolder:"全部",
                defaultValue:"0,10,11",
                values:[{name:"全部",val:"0,10,11"},{name:"待机审评额",val:0},{name:"机审评额通过",val:10},{name:"机审评额未通过",val:11}]
            },
            clientChannel:{
                name:"注册渠道",
                type:"select",
                placeHolder:"全部",
                values:"channel"
            }
        }
        var select=window.localStorage.getItem(this.props.location.pathname);
        if(select){
            if(JSON.parse(select).remberData&&JSON.stringify(JSON.parse(select).remberData)!=="{}"){
                this.get_list(1,JSON.parse(select).remberData);
            }else{
                this.get_list(1,{status:0});
            }
        }else{
            this.get_list(1,{status:0});
        }
        this.get_select();
    }
    get_list(page_no=1,filter={}){
        let rqd = JSON.parse(JSON.stringify(filter));
        rqd.page = page_no;
        rqd.size = page.size;
        this.setState({
            loading:true
        })
        this.loader.push("list");
        axios_xjd.post(xjd_credit_system_list,rqd).then((data)=>{
            this.loader.splice(this.loader.indexOf("list"),1);
            let detail = format_table_data(data.data.list);
            // this.setTotal(detail.length>0?data.data.statistics:false);
            this.setState({
                list:detail,
                loading:this.loader.length>0,
                pageCurrent:data.data.page,
                pageTotal:data.data.total
            });
            (this.loader.length<=0)&&this.refresh_tabel("list");
        });
    }
    get_select(){
        axios_xjd.post(xjd_select_channel).then(res=>{
            this.setState({
                channel:res.data.map(item=>({name:item.name,val:item.val}))
            })
        })
    }
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
        bmd.navigate("/db/bmd/auto/detail",{requestId:data.requestId,audit:true,type:"auto"});
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
        let pagination = {
            total : this.state.pageTotal,
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
                status:"0",
                channel:this.state.channel,
                "data-paths":this.props.location.pathname,
            },
            tableInfo:table_props,
            tableTitle:{
                left:null,
                right:null
            }
        }
        return(
            <List {...table} />
            // <div>
            //     <Filter data-get={this.get_filter.bind(this)} data-source={this.filter} defaultValue={this.state.filter} />
            //     <Row className="table-content">
            //         {/* <div className="table-btns">
            //             <span style={{marginTop:"10px"}}>金额单位:元</span>
            //             <div className="text-right">
            //                 <Permissions type="primary" onClick={this.exportList.bind(this)} server={global.AUTHSERVER.loan.key} tag="button">导出</Permissions>
            //             </div>
            //         </div> */}
            //         <Table {...table_props} bordered />
            //     </Row>
            // </div>
        )
    }
}

export default Loan;
