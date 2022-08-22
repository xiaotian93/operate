import React, { Component } from 'react';
import { Button, Modal, Input,message } from 'antd';
// import moment from 'moment'

// import Filter from '../../../templates/Filter';
import { axios_xjd } from '../../../ajax/request';
import { xjd_credit_manual_list , xjd_credit_manual_approve , xjd_credit_manual_deny ,xjd_select_channel} from '../../../ajax/api';
import { page } from '../../../ajax/config';
import { format_table_data, bmd } from '../../../ajax/tool';
import Permissions from '../../../templates/Permissions';
import List from '../../templates/list';
import ListBtn from '../../templates/listBtn';
const TextArea = Input.TextArea;

class Loan extends Component{
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            filter:{
                status:"20"
            },
            auditVisible:false,
            pageTotal:1,
            pageCurrent:1,
            maxAmount:0,
            minAmount:0,
            pageSize:page.size,
            data:[],
            total:[],
            list:[],
            listPage:1
        };
        this.loader = [];
        this.requestId = props.location.query.requestId;
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
                className:"operate",
                render:data=>{
                    let ops = [];
                    if(data.status===20){
                        ops.push(<Permissions key="pass" size="small" type="primary" onClick={()=>{this.auditOrdersEvent(data,true)}} server={global.AUTHSERVER.bmdCashLoan.key} permissions={global.AUTHSERVER.bmdCashLoan.access.credit_manual_approve} tag="button">通过</Permissions>);
                        ops.push(<Permissions key="deny" size="small" type="danger" onClick={()=>{this.auditOrdersEvent(data,false)}} server={global.AUTHSERVER.bmdCashLoan.key} permissions={global.AUTHSERVER.bmdCashLoan.access.credit_manual_deny} tag="button">驳回</Permissions>);
                    }
                    ops.push(<Permissions key="show" size="small" onClick={(e)=>this.showDetail(data)} server={global.AUTHSERVER.bmdCashLoan.key} permissions={global.AUTHSERVER.bmdCashLoan.access.credit_manual_detail} tag="button" src={"/db/bmd/audit/detail?requestId="+data.requestId+"&audit=true&type=audit"}>查看</Permissions>);
                    return <ListBtn btn={ops} />
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
                placeHolder:"全部",
                resetValue:"20",
                defaultValue:"20,30,31",
                values:[{name:"全部",val:"20,30,31"},{name:"待人工评额",val:20},{name:"人工评额通过",val:30},{name:"人工评额未通过",val:31}]
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
                this.get_list(1,{...this.state.filter});
            }
        }else{
            this.get_list(1,{...this.state.filter});
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
        axios_xjd.post(xjd_credit_manual_list,rqd).then((data)=>{
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
        bmd.navigate("/db/bmd/audit/detail",{requestId:data.requestId,audit:true,type:"audit"});
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

    // 显示总数
    showTotal(){
        return "共"+this.state.pageTotal+"条数据"
    }

    // 审核订单 
    auditOrdersEvent(data,type){
        this.setState({
            auditVisible:true,
            auditType:type,
            maxAmount:(data.productMaxAmount/100).toLocaleString(),
            minAmount:(data.productMinAmount/100).toLocaleString(),
            auditId:data.requestId,
            loanAmount:data.creditLimit?(data.creditLimit/100).toLocaleString():0,
            maxAmountNum:(data.productMaxAmount/100),
            minAmountNum:(data.productMinAmount/100),
            loanAmountNum:data.creditLimit?(data.creditLimit/100):0,
        })
    }

    // 审核订单 请求
    auditOrdersRequest(){
        if((Number(this.state.loanAmountNum)<Number(this.state.minAmountNum)||Number(this.state.loanAmountNum)>Number(this.state.maxAmountNum))&&this.state.auditType){
            message.warn("评估额度需在可配额度范围内");
            return;
        }
        let rqd = {
            requestId:this.state.auditId,
            comment:this.state.comment||""
        }
        if(this.state.auditType){
            if(this.state.loanAmount&&this.state.loanAmount.indexOf(",")!==-1){
                rqd.loanAmount = bmd.remoney(this.state.loanAmount.replace(",",""))
            }else{
                rqd.loanAmount = bmd.remoney(this.state.loanAmount||0)
            }
        }
        console.log(rqd);
        axios_xjd.post(this.state.auditType?xjd_credit_manual_approve:xjd_credit_manual_deny,rqd).then(res=>{
            this.get_list(1,this.state.filter);
            this.hideModal();

        })
    }

    // 隐藏弹窗
    hideModal(){
        this.setState({
            auditVisible:false,
            loanAmount:0,
            loanAmountNum:0,
            comment:""
        })
    }
    // 金额输入事件
    amountChangeEvent(e){
        let num = e.target.value;
        num = isNaN(num)?this.state.loanAmount:num;
        console.log((num))
        this.setState({
            loanAmount:num,
            loanAmountNum:num
        })
    }
    // 意见输入时间
    commentChangeEvent(e){
        this.setState({
            comment:e.target.value
        })
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
        const modalProps = {
            // visible:true,
            visible:this.state.auditVisible,
            maskClosable:false,
            title:"额度审核",
            onCancel:this.hideModal.bind(this),
            footer:<Button onClick={(e)=>{this.auditOrdersRequest()}} type="primary">确定</Button>
        }
        const table={
            filter:{
                "data-get":this.get_filter.bind(this),
                "data-source":this.filter,
                status:"20",
                channel:this.state.channel,
                "data-paths":this.props.location.pathname
            },
            tableInfo:table_props,
            tableTitle:{
                left:null,
                right:null
            }
        }
        return(
            <div>
                {/* <Filter data-get={this.get_filter.bind(this)} data-source={this.filter} defaultValue={this.state.filter} />
                <Row className="table-content">
                    <Table {...table_props} bordered />
                </Row> */}
                <List {...table} />
                <Modal {...modalProps}>
                    <div style={{display:this.state.auditType?"flex":"none",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"}}>
                        {/* <Input placeholder="请输入评估额度" onChange={this.amountChangeEvent.bind(this)} addonAfter={`可配额度${this.state.minAmount}元-${this.state.maxAmount}元`} value={this.state.loanAmount} /> */}
                        <span style={{lineHeight:"28px"}}>评估额度为：</span>
                        <Input placeholder="请输入评估额度" style={{width:"85%"}} onChange={this.amountChangeEvent.bind(this)} addonAfter={this.state.creditLimit?`建议值:${this.state.creditLimit}元;可配额度${this.state.minAmount}元-${this.state.maxAmount}元`:`可配额度${this.state.minAmount}元-${this.state.maxAmount}元`} value={this.state.loanAmount} />
                    </div>
                    <TextArea placeholder="请输入审核意见" onChange={this.commentChangeEvent.bind(this)} value={this.state.comment} />
                </Modal>
            </div>
        )
    }
}

export default Loan;
