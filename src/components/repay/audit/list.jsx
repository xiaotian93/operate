import React, { Component } from 'react';
import { Table, Input, Modal, message, Button, Row ,Col} from 'antd';
import moment from 'moment';
import {axios_loanMgnt} from '../../../ajax/request';
import { repay_discount_audit_list, repay_discount_audit ,repay_discount_audit_detail,repay_deduction_count} from '../../../ajax/api';
import { format_table_data ,format_time} from '../../../ajax/tool';
import {page } from '../../../ajax/config';
import DiscountTable from './table';
import Permissions from '../../../templates/Permissions';
import List from '../../templates/list';
import Btn from '../../templates/listBtn';
const { TextArea } = Input;
class Discount extends Component{
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            repayDate: moment().format("YYYY-MM-DD HH:mm:ss"),
            loading:false,
            filter:{}
        }
        this.domainNo = "";
        this.repayPhase = "";
    }
    componentWillMount(){
        this.get_list();
        this.columns=[
            {
                title:"序号",
                dataIndex:"key"
            },
            {
                title:"订单编号",
                dataIndex:"domainNo"
            },
            {
                title:"客户名称",
                dataIndex:"borrowerName"
            },
            {
                title:"申请人",
                dataIndex:"applicant"
            },
            {
                title:"申请时间",
                dataIndex:"createTime"
            },
            {
                title:"审批人",
                dataIndex:"auditor",
                render:e=>e||"--"
            },
            {
                title:"审批时间",
                dataIndex:"auditTime",
                render:e=>e||"--"
            },
            {
                title:"审批状态",
                dataIndex:"status",
                render:e=>{
                    var type={0:"待审批",800:"审批通过",900:"审批驳回"}
                    return type[e]
                }
            },
            {
                title:"操作",
                render:(e)=>{
                    var btn=[];
                    if(e.status){
                        btn.push(<Permissions size="small" onClick={()=>{this.audit(e),false}} server={global.AUTHSERVER.mgnt.key} permissions={global.AUTHSERVER.mgnt.access.discount_detail} tag="button">详情</Permissions>)
                    }else{
                        btn.push(<Permissions type="primary" size="small" onClick={()=>{this.audit(e,true)}} server={global.AUTHSERVER.mgnt.key} permissions={global.AUTHSERVER.mgnt.access.discount_audit} tag="button">审批</Permissions>);
                        btn.push(<Permissions size="small" onClick={()=>{this.audit(e),false}} server={global.AUTHSERVER.mgnt.key} permissions={global.AUTHSERVER.mgnt.access.discount_detail} tag="button">详情</Permissions>)
                    }
                    return <Btn btn={btn} />
                }
            },
        ]
        this.filter ={
            domainNo:{
                name: "订单编号",
                type: "text",
            },
            borrowerName:{
                name: "客户名称",
                type: "text",
            },
            status:{
                name: "审批状态",
                type: "select",
                values:[{val:0,name:"待审批"},{val:800,name:"审批通过"},{val:900,name:"审批驳回"}]
            },
        }
            
    }
    get_list(pages=1,filter=this.state.filter){
        var param=JSON.parse(JSON.stringify(filter));
        // param={
        //     page:pages,
        //     size:page.size,
        //     source:"DURING_LOAN"
        // }
        param.page=pages;
        param.size=page.size;
        param.source="DURING_LOAN"
        axios_loanMgnt.post(repay_discount_audit_list,param).then(e=>{
            if(!e.code){
                var data=e.data.list;
                // data=data.filter(item=>item.status===0);
                this.setState({data:format_table_data(data),current:e.data.current,total:e.data.total})

            }
        })
    }
    get_filter(data){
        let filter = {};
        filter = JSON.parse(JSON.stringify(data));console.log(filter)
        this.setState({
            filter:filter
        })
        this.get_list(this.state.listPage,filter);
    }
    showTotal(){
        return "共"+this.state.total+"条数据"
    }
    // 翻页
    page_up(page,pageSize){
        window.scrollTo(0,0);
        this.get_list(page,this.state.filter);
        this.setState({
            listPage:page
        })
    }
    audit(data,audit){
        this.setState({
            auditNo:data.auditNo,
            visible:true,
            applicant:data.applicant,
            createTime:data.createTime,
            audit:audit
        })
        axios_loanMgnt.post(repay_discount_audit_detail,{auditNo:data.auditNo}).then(e=>{
            if(!e.code){
                this.get_plan(e.data,data.appKey)
            }
        })
    }
    get_plan(data,appKey){
        // var param={
        //     appKey:appKey,
        //     contractNo:data[0].contractNo,
        //     // contractNo:"BMD_V2_20200922154022RAnuU9"
        // }
        var param={
            phaseStart: data[0].phase,
            phaseEnd: data[0].phase,
            contractNo: data[0].contractNo,
            clearingTime: format_time(new Date()),
            repayTriggerType: "USER"
        }
        axios_loanMgnt.post(repay_deduction_count,param).then(e=>{
            if(!e.code){
                e.data.forEach(item=>{
                    if(item.phase===data[0].phase){
                        item.discount=data;
                        this.setState({
                            discountData:[item]
                        })
                    }
                })
                
            }
        })
    }
    cancal(){
        this.setState({
            visible:false,
            opinion:''
        })
    }
    get_opinion(e){
        this.setState({
            opinion:e.target.value||""
        })
    }
    audit_submit(audit){
        if(!this.state.opinion){
            message.warn("请输入审批意见");
            return;
        }
        var param={
            auditNo:this.state.auditNo,
            opinion:this.state.opinion||"",
            approve:audit
        }
        axios_loanMgnt.post(repay_discount_audit,param).then(e=>{
            if(!e.code){
                message.success("审核成功");
                this.cancal();
                this.get_list()
            }
        })
    }
    render(){
        let pagination = {
            total : this.state.total,
            current : this.state.current,
            pageSize : page.size,
            showTotal:this.showTotal.bind(this),
            onChange : this.page_up.bind(this)
        }
        const table={
            tableInfo:{
                columns:this.columns,
                dataSource:this.state.data,
                bordered:true,
                pagination:pagination,
            },
            filter:{
                "data-get":this.get_filter.bind(this),
                "data-source":this.filter,
                "data-paths":this.props.location.pathname,
            },
            tableTitle:null
        }
        const modal={
            visible:this.state.visible,
            title:"订单审核",
            footer:this.state.audit?<div>
                <Button type="danger" size="small" onClick={()=>{this.audit_submit(false)}}>驳回</Button>
                <Button type="primary" size="small" onClick={()=>{this.audit_submit(true)}}>通过</Button>
            </div>:null,
            onCancel:this.cancal.bind(this),
            width:600
            
        }
        return <div style={{padding:20}}><div className="content" style={{background:"#fff"}}>
            <List {...table} />
            <Modal {...modal}>
                <DiscountTable data={this.state.discountData} />
                <Row className="row">
                    <Col span={3} className="rowTitle">申请人</Col>
                    <Col span={20}>{this.state.applicant||"无"}</Col>
                </Row>
                <Row className="row">
                    <Col span={3} className="rowTitle">申请时间</Col>
                    <Col span={20}>{this.state.createTime||"无"}</Col>
                </Row>
                {this.state.audit?<Row className="row">
                    <Col span={3} className="rowTitle">审批意见</Col>
                    <Col span={20}><TextArea placeholder="请输入审核意见" onChange={this.get_opinion.bind(this)} value={this.state.opinion} /></Col>
                </Row>:null}            
            </Modal>
            </div>
            <style>{`
                    .row{
                        margin-top:30px;
                        font-size:14px;
                        color:#000
                    }
                    .rowTitle{ 
                        opacity:0.5;
                        text-align:right;
                        margin-right:10px
                    }
                `}</style>
            </div>
    }
}
export default Discount