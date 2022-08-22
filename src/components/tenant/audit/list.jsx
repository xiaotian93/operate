import React, { Component } from 'react';
import {Button} from 'antd';
import {merchant_audit_list} from '../../../ajax/api';
import { axios_merchant } from '../../../ajax/request';
// import Filter from '../../ui/Filter_obj8';
import {format_table_data,format_time,bmd} from '../../../ajax/tool';
import {page} from '../../../ajax/config';
import { browserHistory } from 'react-router';
import Permissions from '../../../templates/Permissions';
import ComponentRoute from '../../../templates/ComponentRoute';
import List from '../../templates/list';
// import FormInfo from '../../templates/form';
class Product_cxfq extends Component{
    constructor(props) {
        super(props);
        this.state = {
            filter:{},
            data:[],
            loading:false,
            pageSize:page.size,
            total:1,
            current:1,
            visiable:false,
            id:"",
            spin:false
        };
    }
    componentWillMount(){
        window.localStorage.setItem("detail","");
        this.filter={
            merchantName:{
                name:'商户全称/简称',
                type:'text',
                placeHolder:'请输入商户名称/简称'
            },
            time:{
                name:"最新提交审核时间",
                type:"range_date_day",
                feild_s:"commitTimeStart",
                feild_e:"commitTimeEnd",
                placeHolder:['开始日期',"结束日期"]
            },
            
            status:{
                name:'审核状态',
                type:'select',
                placeHolder:'请选择审核状态',
                values:[{val:"",name:"全部"},{val:"0",name:"未提交"},{val:"1",name:"待审核"},{val:"2",name:"通过"},{val:"3",name:"不通过"}]
            }
        };
        this.columns=[
            {
                title:'序号',
                dataIndex:'key',
                render:(text,record,index)=>{
                    if(text==="合计"){
                        return text;
                    }
                    return `${index+1}`
                }

            },
            {
                title:'账号注册时间',
                dataIndex:'registerTime',
                render:e=>{
                    return format_time(e)
                },
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"registerTime")
                }
            },
            {
                title:'注册账号',
                dataIndex:'accountName'

            },
            {
                title:'商户简称',
                render:e=>{
                    var data=JSON.parse(e.data);
                    return data?data.shortName:"-";
                }

            },
            {
                title:'最新提交审核时间',
                dataIndex:'commitTime',
                render:e=>{
                    return e?format_time(e):"-"
                },
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"commitTime")
                }

            },
            {
                title:'审核状态',
                dataIndex:'status',
                render:e=>{
                    var val={1:"待审核",2:"通过",3:"不通过",0:"未提交"};
                    return val[e];
                }

            },
            {
                title:'操作',
                // width:180,
                render:(data)=>{
                    if(data.status===1){
                        return <Permissions type="primary" size="small" onClick={()=>{this.audit(data.accountId,data.data,true,data.id)}} server={global.AUTHSERVER.merchant.key} tag="button" permissions={global.AUTHSERVER.merchant.access.merchant_audit}>审核</Permissions>
                    }else{
                        return <a href={"/sh/audit/detail?accountId="+data.accountId+"&audits=false&id="+data.id} onClick={(e)=>{this.default(e)}}><Button size="small" onClick={()=>{this.audit(data.accountId,data.data,false,data.id)}}>查看</Button></a>

                    }
                }

            }
        ];
        var select=window.localStorage.getItem(this.props.location.pathname);
        if(select){
            this.get_list(1,JSON.parse(select).remberData);
        }else{
            this.get_list();
        }
    }
    default(e){
        if(e.preventDefault){
            e.preventDefault();
        }else{
            window.event.returnValue = false;
        }
    }
    get_filter(data){
        // let paths = this.props.location.pathname;
        // window.localStorage.setItem(paths,JSON.stringify(data))
        this.setState({
            filter:data
        })
        this.get_list(1,data)
    }
    get_list(page_no , filter={}){
        let data = JSON.parse(JSON.stringify(filter));
        data.page = page_no||1;
        data.size = page.size;
        if(JSON.stringify(filter)==="{}"){
            // data.status="1";
        }
        this.setState({
            loading:true,
        })
        axios_merchant.post(merchant_audit_list,data).then((data)=>{
            let list = data.data.list;
            this.setState({
                data:format_table_data(list,page_no,page.size),
                loading:false,
                total:data.data.total,
                current:data.data.current
            })
        });
    }
    page_up(page,pageSize){
        window.scrollTo(0,0);
        this.get_list(page,this.state.filter);
    }
    audit(accountId,data,audits,id){
        window.localStorage.setItem("audit_sh",data);
        if(audits){
            browserHistory.push("/sh/audit/edit?accountId="+accountId+"&audits="+audits+"&id="+id);
        }else{
            bmd.navigate("/sh/audit/detail?accountId="+accountId+"&audits="+audits+"&id="+id);
        }
        
        
    }
    render() {
        let pagination = {
            total : this.state.total,
            current : this.state.current,
            pageSize : this.state.pageSize,
            onChange : this.page_up.bind(this),
            showTotal:total => `共${total}条数据`
        }
        const table_props={
            columns:this.columns,
            dataSource:this.state.data,
            loading:this.state.loading,
            pagination:pagination,
            rowKey:"accountName"
        }
        let paths = this.props.location.pathname;
        const table={
            filter:{
                "data-get":this.get_filter.bind(this),
                "data-source":this.filter,
                "data-paths":paths,
                "status":""
            },
            tableInfo:table_props,
            tableTitle:{
                left:null,
                right:null
            }
        }
        return (
            <List {...table} />
            // <FormInfo />
            // <div>
            //     <Filter data-get={this.get_filter.bind(this)} data-source={this.filter} top="20px" data-paths={paths} status="" />
            //     <Row style={{padding:"20px"}}>
            //     <Spin spinning={this.state.spin}>
            //     <Row style={{background:"#fff"}}>
                
            //     <Row className="content">
            //         <Table {...table} bordered />
            //     </Row>
                
            //     </Row>
            //     </Spin>
            //     </Row>
            //     <Modal {...modalInfo}>停用后，信息不再展示到分期进件系统，确认停用？</Modal>                
            // </div>
        )
    }
}
export default ComponentRoute(Product_cxfq);