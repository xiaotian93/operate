import React, { Component } from 'react';
import { message } from 'antd';
// import moment from 'moment'

// import Filter from '../../../templates/Filter';
import { axios_xjd } from '../../../ajax/request';
import { order_status_select,order_status_map } from '../../../ajax/config_bmd';
import { xjd_audit0_approve , xjd_audit1_approve ,xjd_audit0_deny,xjd_audit1_deny, xjd_select_product , xjd_select_app,xjd_select_channel,xjd_audit0_list,xjd_audit1_list,xjd_pay_list,xjd_loan_list} from '../../../ajax/api';
import { page } from '../../../ajax/config';
import { format_table_data, bmd } from '../../../ajax/tool';
import Permissions from '../../../templates/Permissions';
import AuditModal from "../components/AuditModal";
import List from '../../templates/list';
import ListBtn from '../../templates/listBtn';
class BMD extends Component{
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            filter:{},
            pageTotal:1,
            pageCurrent:1,
            pageSize:page.size,
            data:[],
            total:[],
            list:[],
            listPage:1,
            modalOrderNo:""
        };
        this.loader = [];
        this.status = this.props.status;
        this.type = this.props.type;
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
                    // var j=(this.state.listPage-1)*this.state.pageSize+Number(index);
                    // return `${j+1}`
                    return `${index+1}`
                }
            },
            {
                title: '订单编号',
                dataIndex: 'orderNo',
            },
            {
                title: '订单时间',
                dataIndex:'orderTime',
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"orderTime",true)
                }
            },
            {
                title: '借款方',
                dataIndex:"borrower"
            },
            {
                title: '借款金额',
                dataIndex:'loanAmount',
                render:(data)=> data?bmd.money(data):"--",
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"loanAmount")
                }
            },
            {
                title: '借款期限',
                dataIndex:'loanTerm',
                render:(data)=> data||"--"
            },
            {
                title: '渠道',
                dataIndex:"clientChannel"
            },
            {
                title: '产品名称',
                dataIndex:'productName',
            },
            {
                title: '操作',
                className:"operate",
                render:data=>{
                    var type={
                        check:"audit0_detail",
                        review:"audit1_detail",
                        pay:"pay_detail",
                        loan:"loan_detail"
                    }
                    if(data.key === "合计"){
                        return "";
                    }
                    return <Permissions size="small" onClick={(e)=>{this.showDetail(data)}} server={global.AUTHSERVER.bmdCashLoan.key} tag="button" permissions={global.AUTHSERVER.bmdCashLoan.access[type[this.type]]} src={window.location.pathname+"/detail?orderNo="+data.orderNo+"&type="+this.type}>查看</Permissions>
                }
            }
        ];
        this.columnsAudit = [
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
            },
            {
                title: '订单时间',
                dataIndex:'orderTime',
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"orderTime",true)
                }
            },
            {
                title: '借款方',
                dataIndex:"borrower"
            },
            {
                title: '借款金额',
                dataIndex:'loanAmount',
                render:(data)=> data?bmd.money(data):"--",
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"loanAmount")
                }
            },
            {
                title: '借款期限',
                dataIndex:'loanTerm',
                render:(data)=> data||"--"
            },
            {
                title: '注册渠道',
                dataIndex:"clientChannel"
            },
            {
                title: '产品名称',
                dataIndex:'productName',
            },
            {
                title: '操作',
                width:160,
                className:"operate",
                render:data=>{
                    if(data.key === "合计"){
                        return "";
                    }
                    var btn=[<Permissions server={global.AUTHSERVER.bmdCashLoan.key} tag="button" type="primary" size="small" onClick={(e)=>{this.auditClick(data,true)}} permissions={global.AUTHSERVER.bmdCashLoan.access.audit1_approve}>通过</Permissions>,
                    <Permissions server={global.AUTHSERVER.bmdCashLoan.key} tag="button" type="danger" size="small" onClick={(e)=>{this.auditClick(data,false)}} permissions={global.AUTHSERVER.bmdCashLoan.access.audit1_deny}>驳回</Permissions>,
                    <Permissions size="small" onClick={(e)=>{this.showDetail(data)}} server={global.AUTHSERVER.bmdCashLoan.key} tag="button" permissions={global.AUTHSERVER.bmdCashLoan.access.audit1_detail} src={window.location.pathname+"/detail?orderNo="+data.orderNo+"&type="+this.type}>查看</Permissions>]
                    return <ListBtn btn={btn} />;
                }
            }
        ];
        this.filter = {
            orderNo :{
                name:"订单编号",
                type:"text",
                placeHolder:"请输入订单编号"
            },
            time :{
                name: "订单时间",
                type: "range_date",
                placeHolder: ["开始时间", "结束时间"],
                feild_s: "startTime",
                feild_e: "endTime"
            },
            borrower :{
                name:"借款方",
                type:"text",
                placeHolder:"请输入借款方"
            },
            // registerApp :{
            //     name:"APP名称",
            //     type:"select",
            //     placeHolder:"全部",
            //     values:"registerApp"
            // },
            code :{
                name:"产品名称",
                type:"select",
                placeHolder:"全部",
                values:"loanConfigNo"
            },
            clientChannel:{
                name:"注册渠道",
                type:"select",
                placeHolder:"全部",
                values:"channel"
            }
        }
        if(!this.status){
            this.filter.status = {
                name:"订单状态",
                type:"select",
                placeHolder:"请输入订单状态",
                values:order_status_select
            }
            this.columns.splice(8,0,{
                title: '状态',
                dataIndex:'loanStatus',
                render:data=>order_status_map[data]||"--"
            })
        }
    }
    componentDidMount() {
        this.getSelect();
        var select=window.localStorage.getItem(this.props.pathname);
        if(select&&JSON.parse(select).isRember===true){
            this.get_list(1,JSON.parse(select).remberData);
        }else{
            if(this.props.type!=="loan") this.get_list();
        }
    }
    
    get_list(page_no=1,filter={}){
        var url={
            check:xjd_audit0_list,
            review:xjd_audit1_list,
            pay:xjd_pay_list,
            loan:xjd_loan_list
        }
        let params = JSON.parse(JSON.stringify(filter));
        let rqd = {
            page:page_no,
            size:page.size,
            // status:this.status||"",
            ...params
        };
        this.setState({
            loading:true
        })
        this.loader.push("list");
        axios_xjd.post(url[this.type],rqd).then((data)=>{
            if(data.code){
                return;
            }
            this.loader.splice(this.loader.indexOf("list"),1);
            var detail = format_table_data(data.data.list,page_no,page.size);
            this.setTotal(data.data.list.length>0?data.data.statistics:false);
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
        totalInfo.orderNo = "";
        totalInfo.loanAmount = totalData.sumLoanAmount;
        if(!totalData){
            this.setState({
                loading:this.loader.length>0,
                totalDes:"",
                total:[]
            });
        }else{
            this.setState({
                loading:this.loader.length>0,
                totalDes:"此合计是当前查询结果的合计",
                total:[totalInfo]
            });
        }
        (this.loader.length<=0)&&this.refresh_tabel("total");
    }
    // 刷新列表数据
    refresh_tabel(type){
        // console.log(this.state.list.concat(this.state.total))
        this.setState({
            data:this.state.list.concat(this.state.total)
            // data:this.state.list
        })
    }

    // 查看详情
    showDetail(data){
        bmd.navigate(window.location.pathname+"/detail",{orderNo:data.orderNo,type:this.type});
    }

    // 获取筛选数据
    get_filter(data){
        let filter = {};
        filter = JSON.parse(JSON.stringify(data));
        this.setState({
            filter:filter
        })
        this.get_list(this.state.listPage,filter);
    }

    // 获取下拉菜单数据
    getSelect(){
        axios_xjd.post(xjd_select_app).then(res=>{
            res.data.unshift("全部");
            this.setState({
                registerApp:res.data.map(item=>({name:item,val:item}))
            })
        })
        axios_xjd.post(xjd_select_product).then(res=>{
            res.data.unshift({name:"全部",loanConfigNo:""})
            this.setState({
                loanConfigNo:res.data.map(item=>({name:item.name,val:item.code}))
            })
        })
        axios_xjd.post(xjd_select_channel).then(res=>{
            this.setState({
                channel:res.data.map(item=>({name:item.name,val:item.val}))
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
        // let query = [];
        // for(let f in this.state.filter){
        //     query.push(f+"="+this.state.filter[f]);
        // }
        // let url = host_xjd+vip_order_export+"?"+query.join("&");
        // window.open(url);
    }

    // 点击审核
    auditClick(data,type){
        let Nos = Array.isArray(data)?data:[data.orderNo];
        this.setState({
            auditType:type,
            auditNos:Nos
        })
    }

    // 审核
    orderAudit(res){
        var pass={
            check:xjd_audit0_approve,
            review:xjd_audit1_approve,
        }
        var deny={
            check:xjd_audit0_deny,
            review:xjd_audit1_deny,
        }
        axios_xjd.post(res.audit?pass[this.type]:deny[this.type],{orderNos:res.auditNos,comment:res.msg}).then(res=>{
            this.get_list(1,this.state.filter);
            message.success("操作成功");
            this.setState({
                auditNos:false
            })
        })
    }

    // 显示总数
    showTotal(){
        return "共"+this.state.pageTotal+"条数据"
    }

    // 列表选择
    onSelectChange(selectedRowKeys,selectedRows){
        this.setState({
            selectedRowKeys
        })
    }

    render (){
        var page=parseInt(this.state.pageTotal/(this.state.pageSize + 1),10);
        let pagination = {
            total : this.state.pageTotal+page,
            current : this.state.pageCurrent,
            pageSize : this.state.pageSize+1,
            showTotal:this.showTotal.bind(this),
            onChange : this.page_up.bind(this)
        }
        let rowSelection = {
            selectedRowKeys:this.state.selectedRowKeys,
            onChange: this.onSelectChange.bind(this),
          };
        let table_props = {
            rowKey:"orderNo",
            columns:this.columns ,
            dataSource:this.state.data,
            footer:()=>this.state.totalDes,
            pagination : pagination,
            loading:this.state.loading,
        }
        let auditBtn = "";
        if(this.status === "10"){
            table_props.columns = this.columnsAudit;
            table_props.rowSelection = rowSelection;
            auditBtn =(
                <div>
                    <Permissions server={global.AUTHSERVER.bmdCashLoan.key} tag="button" type="primary" onClick={(e)=>{this.auditClick(this.state.selectedRowKeys||[],true)}} permissions={global.AUTHSERVER.bmdCashLoan.access.audit1_approve}>批量通过</Permissions>&emsp;
                    <Permissions server={global.AUTHSERVER.bmdCashLoan.key} tag="button" type="danger" onClick={(e)=>{this.auditClick(this.state.selectedRowKeys||[],false)}} permissions={global.AUTHSERVER.bmdCashLoan.access.audit1_deny}>批量驳回</Permissions>
                </div>
            )
        }
        const table={
            filter:{
                "data-get":this.get_filter.bind(this),
                "data-source":this.filter,
                defaultValue:this.state.filter,
                loanConfigNo:this.state.loanConfigNo,
                registerApp:this.state.registerApp,
                channel:this.state.channel,
                "data-paths":this.props.pathname,
            },
            tableInfo:table_props,
            tableTitle:{
                left:<span>金额单位：元</span>,
                right: <div>{auditBtn}</div> 
            }
        }
        return(
            <div>
                <List {...table} />
                {/* <Filter data-get={this.get_filter.bind(this)} data-source={this.filter} defaultValue={this.state.filter} loanConfigNo={this.state.loanConfigNo} registerApp={this.state.registerApp} />
                <Row className="table-content">
                    <div className="table-btns text-right" style={{justifyContent:"flex-end"}}>
                        { auditBtn }
                        <div>
                            <Permissions type="primary" onClick={this.exportList.bind(this)} server={global.AUTHSERVER.bmdCashLoan.key} tag="button">导出查询结果</Permissions>
                        </div>
                    </div>
                    <Table {...table_props} bordered />
                </Row> */}
                <AuditModal auditNos={this.state.auditNos} auditType={this.state.auditType} bindaudit={this.orderAudit.bind(this)} />
            </div>
        )
    }
}

export default BMD;
