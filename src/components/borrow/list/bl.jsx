import React, { Component } from 'react';
// import { Button, Select } from 'antd';
// import moment from 'moment'
// import Filter from '../../ui/Filter_obj8';
import { axios_loanMgnt } from '../../../ajax/request'
import { jk_zyzj_list , jk_zyzj_select } from '../../../ajax/api';
import { page } from '../../../ajax/config';
import { order_status_select } from '../../../ajax/config_sh';
import { format_table_data ,bmd} from '../../../ajax/tool';
import ComponentRoute from '../../../templates/ComponentRoute';
import List from '../../templates/list';
import Permissions from '../../../templates/Permissions';
class Borrow extends Component{
    constructor(props) {
        super(props);
        this.state = {
            auditStatus: [],
            manageStatus: [],
            paymentStatus:[],
            loading: false,
            total:1,
            current:1,
            pageSize:page.size,
            data:[],
            filter:{},
            total_money:0,
        };
    }
    componentWillMount(){
        this.columns = [
            {
                title: '序号',
                width:50,
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
                dataIndex: 'domainNo',
                render:(e)=>{
                    return e
                }
            },
            {
                title: '借款方',
                dataIndex: 'borrowerName'
            },
            {
                title: '借款方手机号',
                dataIndex: 'borrowerPhone',
            },
            {
                title: '产品名称',
                //width:80,
                dataIndex: 'productName'
            },
            {
                title:'项目名称',
                dataIndex:'appName'
            },
            {
                title: '借款金额',
                dataIndex:"loanAmount",
                //width:100,
                render:(data)=>(bmd.money(data))
            },
            {
                title:'借款期数',
                dataIndex:'phaseCount',
                render:e=>e||"--"
            },
            {
                title:'借款申请时间',
                dataIndex:'createTime',
                render:e=>e||"--"
            },
            {
                title:'放款成功时间',
                dataIndex:'successTime',
                render:e=>e||"--"
            },
            {
                title:'订单状态',
                dataIndex:'manageContractStatus',
                render:e=>{
                    var type=this.state.manageStatus,str="";
                    type.forEach(i=>{
                        if(i.val===e){
                            str=i.name
                        }
                    })
                    return str||"--"
                }
            },
            {
                title:'审核状态',
                dataIndex:'auditStatus',
                render:e=>{
                    var type=this.state.auditStatus,str="";
                    type.forEach(i=>{
                        if(i.val===e){
                            str=i.name
                        }
                    })
                    return str||"--"
                }
            },
            {
                title:'付款状态',
                dataIndex:'paymentStatus',
                render:e=>{
                    var type=this.state.paymentStatus,str="";
                    type.forEach(i=>{
                        if(i.val===e){
                            str=i.name
                        }
                    })
                    return str||"--"
                }
            },
            {
                title:'失败原因',
                dataIndex:'failReason',
                render:e=>e||"--"
            },

            {
                title: '操作',
                // width:100,
                render: (data) => (
                    data.key==="合计"?null:<Permissions size="small" server={global.AUTHSERVER.mgnt.key} permissions={global.AUTHSERVER.mgnt.access.contract_detail} tag="button" onClick={()=>(this.detail(data))} src={'/jk/list/zyzj/detail?borrowerId='+data.borrowerId+"&contract_no="+data.contractNo+"&contractId="+data.contractId}>查看</Permissions>
                )
            }
        ];
        let borrow_filter = order_status_select;
        borrow_filter.unshift({
            name:"全部",val:""
        })
        this.filter = {
            
            domainNo :{
                name:"订单号",
                type:"text",
                placeHolder:"请输入订单编号"
            },
            borrowerName :{
                name:"借款方",
                type:"text",
                placeHolder:"请输入借款方"
            },
            borrowerPhone:{
                name:"借款方手机号",
                type:"text",
                placeHolder:"请输入车牌号/发动机号"
            },
            borrowerIdNo:{
                name:"借款方身份证号",
                type:"text",
                placeHolder:"请输入车牌号/发动机号"
            },
            productName: {
                name: "产品名称",
                type: "select",
                values: "appKey",
                // relevance: "domain",
                all: "hidden"
            },
            appKey: {
                name: "项目名称",
                type: "select",
                values: "domain",
                all: "hidden",
                // getAppkey:true
            },
            time:{
                name:"借款时间",
                type:"range_date",
                feild_s:"startLoanStartDate",
                feild_e:"endLoanStartDate",
                placeHolder:['开始日期',"结束日期"]
            },
            manageContractStatus :{
                name:"订单状态",
                type:"select",
                values:"manageContractStatus"
            },
            auditStatus:{
                name:"审核状态",
                type:"select",
                placeHolder:"全部",
                values:"auditStatus"
            },
            paymentStatus:{
                name:"付款状态",
                type:"select",
                placeHolder:"全部",
                values:"paymentStatus"
            }
        }
    }

    componentDidMount(){
        var select=window.localStorage.getItem(this.props.location.pathname);
        console.log(select)
        if(select){
            this.get_list(1,JSON.parse(select).remberData);
        }else{
            this.get_list();
        }
        this.get_select();
    }
    get_list(page_no , filter={}){
        let data = JSON.parse(JSON.stringify(filter));
        data.page = page_no||1;
        data.size = page.size;
        data.labelName="保理业务";
        data.labelType="BUSINESS";
        this.setState({
            loading:true,
        })
        axios_loanMgnt.post(jk_zyzj_list,data).then((data)=>{
            if(!data.code){
                let list = data.data.list;
                if(list.length>0){
                    this.get_total(list,filter);
                }
                this.setState({
                    data:format_table_data(list,page_no,page.size),
                    loading:false,
                    total:data.data.total,
                    current:data.data.current,
                    total_money:data.extra?data.extra.money():"0"
                })
            }
        }).catch(e=>{
            this.setState({
                loading:false
            })
        });
    }
    get_total(list,filter){
        let data = JSON.parse(JSON.stringify(filter));
        data.labelName="保理业务";
        data.labelType="BUSINESS";
        axios_loanMgnt.post("/manage/contract/loanContract_listSum",data).then(e=>{
            var data=e.data;
            data.key="合计"
            list.push(data);
            this.setState({
                data:format_table_data(list),
            })
        })
    }
    get_filter(data){
        this.setState({
            filter:data
        })
        this.get_list(1,data);
    }
    get_select(){
        axios_loanMgnt.get(jk_zyzj_select).then(data=>{
            this.setState({
                auditStatus:this.filter_value(data.data.auditStatus),
                manageStatus:this.filter_value(data.data.manageStatus),
                paymentStatus:this.filter_value(data.data.paymentStatus)
            })
        });
        axios_loanMgnt.post("/manage/util/getLoanAppOptions",{labelType:"BUSINESS",labelName:"保理业务",usage:"CONTRACT_LIST"}).then(e=>{
            if(!e.code){
                var domain=[];
                for(var i in e.data){
                    domain.push({name:e.data[i].appName,val:e.data[i].appKey})
                }
                this.setState({
                    doamin:domain
                })
            }
        })
        axios_loanMgnt.post("/manage/util/getProductOptions",{labelType:"BUSINESS",labelName:"保理业务",usage:"CONTRACT_LIST"}).then(e=>{
            if(!e.code){
                var appKey=[];
                for(var i in e.data){
                    appKey.push({name:e.data[i].name,val:e.data[i].name})
                }
                this.setState({
                    appKey:appKey
                })
            }
        })
    }
    filter_value(arr){
        let res = [];
        res.push({val:"",name:"全部"})
        for(let a in arr){
            res.push({val:Number(arr[a].name),name:arr[a].val})
        }
        return res;
    }
    detail(data){
        window.open('/jk/list/bl/detail?borrowerId='+data.borrowerId+"&contract_no="+data.contractNo+"&contractId="+data.contractId+"&labelName=保理业务&domainNo="+data.domainNo);
    }
    page_up(page,pageSize){
        window.scrollTo(0,0);
        this.get_list(page,this.state.filter);
    }
    render (){
        var page=parseInt(this.state.total/(this.state.pageSize + 1),10);
        let pagination = {
            total : this.state.total+page,
            current : this.state.current,
            pageSize : this.state.pageSize+1,
            onChange : this.page_up.bind(this),
            showTotal:total=>`共${this.state.total}条数据`
        }
        
        const table_props = {
            columns:this.columns ,
            dataSource:this.state.data,
            pagination : pagination,
            loading:this.state.loading,
            footer:()=>this.state.data.length>0?"此合计是当前查询结果的合计":""
        }
        const table={
            filter:{
                "data-get":this.get_filter.bind(this),
                "data-source":this.filter,
                "data-paths":this.props.location.pathname,
                manageContractStatus:this.state.manageStatus,
                auditStatus:this.state.auditStatus,
                paymentStatus:this.state.paymentStatus,
                // getAppkey:this.getAppkey.bind(this),
                "domain": this.state.doamin,
                "appKey":this.state.appKey
            },
            tableInfo:table_props,
            tableTitle:{
                left:<span>
                    金额单位：元 
                </span>,
                right:null
            },
        }
        
        return(
            <List {...table} />
        )
    }
}

export default ComponentRoute(Borrow);
