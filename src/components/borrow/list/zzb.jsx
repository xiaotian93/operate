import React, { Component } from 'react';
import {Button} from 'antd';
// import moment from 'moment'

// import Filter from '../../ui/Filter_8.jsx';
import axios from '../../../ajax/request'
import { zzb_borrow_list } from '../../../ajax/api';
import { page } from '../../../ajax/config';
import { format_table_data ,bmd} from '../../../ajax/tool';
import ComponentRoute from '../../../templates/ComponentRoute';
import List from '../../templates/list';
class Borrow extends Component{
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            selectedRows: [],
            loading: false,
            total:1,
            current:1,
            pageSize:page.size,
            data:[],
            total_money:"0",
            filter:{},
            loanPeriod:JSON.parse(localStorage.getItem("select")).zzb_loan_period
        };
    }
    componentWillMount(){
        let borrow_status = {
            "-3":"删除",
            "-2":"审核未通过",
            "-1":"审核未通过",
            "-4":"发送放款失败",
            "0":"准备提交审核",
            "1":"审核中",
            "2":"审核成功",
            "3":"待放款",
            "4":"放款失败",
            "5":"放款成功",
            "6":"支付中"
        }
        let borrow_filter = [
            {val:"",name:"全部"},
            {val:"-2",name:"审核未通过"},
            {val:"1",name:"审核中"},
            {val:"2",name:"审核成功"},
            {val:"3",name:"待放款"},
            {val:"4",name:"放款失败"},
            {val:"5",name:"放款成功"}
        ]
        this.columns = [
            {
                title: '序号',
                width:60,
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
                //width:160,
                dataIndex: 'orderId',
            },
            {
                title: '订单时间',
                //width:100,
                dataIndex: 'dataObj.createTime',
                sorter: (a, b) => {
                    if(a.key==="合计"||b.key==="合计"){
                        return;
                    }
                    return bmd.getTimes(a.dataObj.createTime)-bmd.getTimes(b.dataObj.createTime)
                }
            },
            {
                title: '借款方',
                render : (data) => {
                    if(!data.dataObj.showVo||data.key==="合计"){
                        return '';
                    }
                    if(data.dataObj.showVo.borrowType===1){
                        return data.dataObj.showVo.borrowInfo.company.name
                    }else{
                        return data.dataObj.showVo.borrowInfo.person.name
                    }
                }
            },
            {
                title: '借款金额',
                //width:100,
                dataIndex: 'dataObj.showVo.borrowInfo.amount',
                sorter: (a, b) => {
                    if(a.key==="合计"||b.key==="合计"){
                        return;
                    }
                    return a.dataObj.showVo.borrowInfo.amount-b.dataObj.showVo.borrowInfo.amount
                }
            },
            // {
            //     title: '借款期限(月)',
            //     //width:60,
            //     dataIndex: 'dataObj.showVo.borrowInfo.loanPeriod'
            // },
            {
                title: '产品名称',
                //width:140,
                dataIndex: 'dataObj.showVo.projectName'
            },
            {
                title:'商户名称',
                // dataIndex:'dataObj.showVo.businessName',
                render:(e)=>{
                    if(e.key==="合计"){
                        return;
                    }
                    return e.dataObj.showVo.businessName?e.dataObj.showVo.businessName:"-"
                }
            },
            {
                title: '借款状态',
                //width:100,
                render:(data)=>(data.key==="合计"?"":borrow_status[data.status])
            },
            {
                title: '操作',
                // width:100,
                // fixed: 'right',
                render: (data) => (
                    
                    data.key==="合计"?"":<span>
                        <a href={'/jk/list/zzb/detail?id='+data.id} target="blank"><Button size="small" onClick={()=>(this.detail(data.id))}>查看</Button></a>
                    </span>
                )
            }
        ];
        let products = JSON.parse(localStorage.getItem("select")).zzb_project_name;
        this.filter = {
            time:{
                name:"订单时间",
                type:"range_date",
                feild_s:"start_time",
                feild_e:"end_time",
                placeHolder:['开始日期',"结束日期"]
            },
            order_id:{
                name:"订单号",
                type:"text",
                placeHolder:"请输入订单号"
            },
            name:{
                name:"借款方",
                type:"text",
                placeHolder:"请输入借款方"
            },
            // car_license_no:{
            //     name:"车牌号",
            //     type:"text",
            //     placeHolder:"请输入车牌号"
            // },
            // insur_no:{
            //     name:"保单号",
            //     type:"text",
            //     placeHolder:"请输入保单号"
            // },
            project_name:{
                name:"产品名称",
                type:"select",
                placeHolder:"全部",
                values:products
            },
            business_name:{
                name:"商户名称",
                type:"text",
                placeHolder:"请输入商户名称"
            },
            status:{
                name:"状态",
                type:"select",
                placeHolder:"全部",
                values:borrow_filter
            }
        }
        var select=window.localStorage.getItem(this.props.location.pathname);
        if(select){
            this.get_list(1,JSON.parse(select).remberData);
        }else{
            this.get_list();
        }
    }
    get_list(page_no , filter={}){
        let data = JSON.parse(JSON.stringify(filter));
        data.page = page_no||1;
        data.size = page.size;
        this.setState({
            loading:true,
            selectedRowKeys:[]
        })
        axios.post(zzb_borrow_list,data).then((data)=>{
            let list = data.data;
            var total={
                key:"合计",
                dataObj:{showVo:{borrowInfo:{amount:data.extra1.realAmount}}}
            }
            list.push(total);
            this.setState({
                data:format_table_data(list,page_no,page.size),
                total_money:data.extra1.realAmount,
                loading:false,
                total:data.total,
                current:data.current
            })
        });
    }
    get_filter(data){
        // console.log(data);
        // let filter = {};
        // for(let d in data){
        //     filter[data[d].key] = data[d].value
        // }
        this.setState({
            filter:data
        })
        this.get_list(1,data);
    }
    detail(id){
        // window.open('/jk/list/zzb/detail?id='+id)
    }
    page_up(page,pageSize){
        window.scrollTo(0,0);
        this.get_list(page,this.state.filter);
    }
    render(){
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
                loanPeriod:this.state.loanPeriod,
                "data-paths":this.props.location.pathname,
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
            // <div className="Component-body">
                // <Filter data-get={this.get_filter.bind(this)} data-source={this.filter} loanPeriod={this.state.loanPeriod} />
            //     <Row className="table-content">
            //         <div className="text-orange">当前查询结果借款合计：<span className="total-bold">{this.state.total_money}</span>元</div>
            //         <Table {...table_props} bordered />
            //     </Row>
                
            // </div>
        )
    }
}

export default ComponentRoute(Borrow);