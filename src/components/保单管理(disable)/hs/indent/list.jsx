import React, { Component } from 'react';
// import moment from 'moment'
import { Button , message } from 'antd';
// import Filter from '../../../ui/Filter_obj8';
import {axios_bd} from '../../../../ajax/request';
import {bd_company_list,bd_product_list,bd_customer_list,bd_list_hs,bd_retry_crawler} from '../../../../ajax/api';
import { format_table_data , format_date ,bmd} from '../../../../ajax/tool';
//import { host_bd } from '../../../../ajax/config';
import { browserHistory } from 'react-router';
import ComponentRoute from '../../../../templates/ComponentRoute';
import List from '../../../templates/list';
import Permissions from '../../../../templates/Permissions';
class Borrow extends Component{
    constructor(props) {
        super(props);
        this.state = {
            company_list:'',
            product_list:'',
            merchant_list:'',
            loading: false,
            total:1,
            current:1,
            pageSize:50,
            data:[],
            filter:{},
            button:false,
            more:true
        };
        this.idArr=[];
    }
    componentWillMount(){
        //this.getSelect();
        this.filter = {
            time:{
                name:"签单时间",
                type:"range_date",
                feild_s:"signStartTime",
                feild_e:"signEndTime",
                placeHolder:['开始日期',"结束日期"]
            },
            insureCompany :{
                name:"保险公司",
                type:"select",
                placeHolder:"全部",
                values:"companys"
            },
            insuranceStatus :{
                name:"保单状态",
                type:"select",
                placeHolder:"全部",
                values:[{name:"全部",val:""},{name:"正常",val:0},{name:"退保",val:-1}]
            },
            crawlerStatus :{
                name:"爬取状态",
                type:"select",
                placeHolder:"全部",
                values:[{name:"全部",val:""},{name:"未爬取",val:0},{name:"爬取中",val:1},{name:"爬取成功",val:2},{name:"爬取失败",val:-2},{name:"无此结果",val:-1},{name:"核对存疑",val:-3}]
            },
            holderType :{
                name:"投保人",
                type:"select",
                placeHolder:"全部",
                values:[{name:"全部",val:0},{name:"智度小贷",val:1},{name:"其他",val:2}]
            },
            productName :{
                name:"产品名称",
                type:"select",
                placeHolder:"全部",
                values:"products"
            },
            customerName :{
                name:"商户名称",
                type:"select",
                placeHolder:"全部",
                values:"merchants"
            },
            insuranceNo :{
                name:"保单号",
                type:"text",
                placeHolder:"请输入保单号"
            }
        };
        this.columns=[
            {
                title:"序号",
                dataIndex:"key",
                render:(text,record,index)=>{
                    if(text==="合计"){
                        return text;
                    }
                    return `${index+1}`
                }
                // width:"50px"
            },
            {
                title:"关联订单号",
                dataIndex:"businessOrderNo",
                //width:"150px"
            },
            {
                title:"保险公司",
                dataIndex:"insCompany",
                // width:"100px"
            },
            {
                title:"保单号",
                dataIndex:"insNo",
                // width:"100px"
            },
            {
                title:"签单日期",
                dataIndex:"signTime",
                // width:"100px",
                render:(e)=>{
                    return e?format_date(e):"-"
                },
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"signTime")
                }
            },
            {
                title:"起保日期",
                dataIndex:"insStartTime",
                // width:"100px",
                render:(e)=>{
                    return e?format_date(e):"-";
                },
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"insStartTime")
                }
            },
            {
                title:"终保日期",
                dataIndex:"insEndTime",
                // width:"120px",
                render:(e)=>{
                    return e?format_date(e):"-";
                },
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"insEndTime")
                }
            },
            {
                title:"投保人",
                dataIndex:"holderName",
                // width:"100px"
            },
            {
                title:"被保险人",
                // width:"80px",
                dataIndex:"insuredName"
            },
            {
                title:"商业险",
                dataIndex:"syxFee",
                // width:"80px",
                render:e=>{
                    return e?e.money():"-"
                },
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"syxFee")
                }
            },
            {
                title:"车船税",
                dataIndex:"ccsFee",
                // width:"80px",
                render:e=>{
                    return e?e.money():"-"
                },
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"ccsFee")
                }
            },
            {
                title:"交强险",
                dataIndex:"jqxFee",
                // width:"80px",
                render:e=>{
                    return e?e.money():"-"
                },
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"jqxFee")
                }
            },
            {
                title:"滞纳金",
                dataIndex:"znjFee",
                // width:"80px",
                render:e=>{
                    return e?e.money():"-"
                },
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"znjFee")
                }
            },
            {
                title:"保单状态",
                dataIndex:"insStatus",
                // width:"100px",
                render:e=>{
                    return e===0?'正常':'退保'
                }
            },
            {
                title:"爬取状态",
                dataIndex:"crawlerStatus",
                // width:"100px",
                render:e=>{
                    var status={'0':"未爬取",'1':"爬取中",'2':"爬取成功",'-1':"无此结果 ",'-2':"爬取失败","-3":"核对存疑"};
                    return status[e]
                }
            },
            //{
            //    title:"产品名称",
            //    dataIndex:"productName",
            //    width:"100px"
            //},
            {
                title:"商户名称",
                dataIndex:"customerName",
                // width:"100px"
            },
            {
                title:"操作",
                // fixed:"right",
                // width:"150px",
                render:(e)=>{
                    var btn='';
                    if(e.syx){
                        if(e.remainValue){
                            btn=<div>
                                <Button type="primary" size="small" onClick={()=>{this.tb(e.id)}} style={{marginTop:"5px",marginRight:"5px"}}>退保</Button>
                                <Button type="primary" size="small" onClick={()=>{this.pd(e.id)}} style={{marginTop:"5px"}}>批单</Button>
                            </div>
                        }else{
                            btn=<Button type="primary" size="small" onClick={()=>{this.pd(e.id)}} style={{marginTop:"5px"}}>批单</Button>
                        }
                    }
                    return (<div>
                        <Permissions size="small" onClick={()=>{this.detail(e.id)}} style={{marginRight:"5px"}} server={global.AUTHSERVER.insurance.key} permissions={global.AUTHSERVER.insurance.access.hs_insurance_detail} tag="button" src={"/bd/indent/hs/detail?id="+e.id}>查看</Permissions>
                        <Permissions type="success" size="small" onClick={()=>{this.start_crawl(e.id)}} disabled={this.state.button} server={global.AUTHSERVER.insurance.key} permissions={global.AUTHSERVER.insurance.access.hs_insurance_crawler} tag="button"style={{ marginTop: "5px" }} >爬取</Permissions>
                        {
                            e.status?null:btn
                        }




                    </div>)
                }
            }
        ]
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
    get_list(page_no,filter={}){
        this.setState({
            loading:true,
            selectedRowKeys:[],
            selectedRows:[]
        });
        let rqd = {
            page:page_no||1,
            size:50,
            businessName:"hs",
            ...filter
        }
        axios_bd.post(bd_list_hs,rqd).then((data)=>{
            var list=data.data;
            this.setState({
                data:format_table_data(list.list,page_no,50),
                total:list.total,
                current:list.page,
                loading:false
            })
        });
    }
    get_filter(data){
        this.get_list(1,data);
        this.setState({
            filter:data
        });
    }
    page_up(page,pageSize){
        window.scrollTo(0,0);
        this.get_list(page,this.state.filter);
    }
    filterValue(arr){
        let res = [{val:"",name:"全部"}];
        for(let a in arr){
            res.push({val:arr[a],name:arr[a]})
        }
        return res;
    }
    getSelect(){
        axios_bd.get(bd_company_list+'?businessName=hs').then(e=>{
            this.setState({company_list:this.filterValue(e.data)})
        });
        axios_bd.get(bd_product_list+'?businessName=hs').then(e=>{
            this.setState({product_list:this.filterValue(e.data)})
        });
        axios_bd.get(bd_customer_list+'?businessName=hs').then(e=>{
            this.setState({merchant_list:this.filterValue(e.data)})
        })
    }
    list_export(){
        let param = this.state.filter;
        let querys = [];
        for(let p in param){
            querys.push(p+"="+param[p]);
        }
        //window.open(host_cxfq+bd_export+"?"+querys.join("&"))
    }
    start_crawl(id){
        if(this.state[id]){
            message.warn('请勿重复操作，请1小时后再次操作。');
            return
        }
        message.success("爬取中");
        this.setState({button:true});
        var param={insuranceId:id};
        axios_bd.post(bd_retry_crawler,param).then(e=>{
            if(!e.code){
                message.success("爬取成功");
                this.idArr.push(id);
                this.get_list(1,this.state.filter);
                this.setState({[id]:true,button:false})
            }
        });
        setTimeout(()=>{this.setState({[id]:false})},3600000)
    }
    start_crawl_more(){
        var ids=this.state.selectedRowKeys;
        if(ids.length===0){
            message.warn('请先选择订单');
            return;
        }
        for(var i in ids){
            for(var j in this.idArr){
                if(ids[i]===this.idArr[j]){
                    message.warn("已选订单中有刚爬取过的订单，请检查！");
                    return;
                }
            }
        }
        var param=ids.join(",");
        axios_bd.get(bd_retry_crawler+"?ids="+param).then(e=>{
            if(!e.code){
                message.success("爬取成功");
                this.setState({selectedRowKeys:[]})

            }
        });
    }
    detail(id){
        bmd.navigate("/bd/indent/hs/detail?id="+id);
    }
    tb(id){
        browserHistory.push("/bd/indent/hs/tb?id="+id);
    }
    pd(id){
        browserHistory.push("/bd/indent/hs/pd?id="+id);
    }
    render (){
        let pagination = {
            total : this.state.total,
            current : this.state.current,
            pageSize : this.state.pageSize,
            onChange : this.page_up.bind(this),
            showTotal:total=>`共${total}条数据`

        };
        //const rowSelection = {
        //    selectedRowKeys:this.state.selectedRowKeys,
        //    onChange: (selectedRowKeys, selectedRows) => {
        //        this.setState({ selectedRowKeys , selectedRows });
        //    },
        //    getCheckboxProps: record => ({
        //        disabled: record.key === '总计',
        //        name: record.key
        //    })
        //};
        const table_info={
            rowKey:"id",
            // scroll:{x:1800},
            //rowSelection:rowSelection,
            columns:this.columns,
            dataSource:this.state.data,
            pagination : pagination,
            loading:this.state.loading
        };
        const table={
            filter:{
                "data-get":this.get_filter.bind(this),
                "data-source":this.filter,
                "companys":this.state.company_list,
                "merchants":this.state.merchant_list,
                "products":this.state.product_list,
                "data-paths":this.props.location.pathname,
            },
            tableInfo:table_info,
            tableTitle:{
                left:<span>金额单位：元</span>,
                right:null
            }
        }
        return(
            <List {...table} />
            // <div>
            //     <Filter data-get={this.get_filter.bind(this)} data-source={this.filter} companys={this.state.company_list} products={this.state.product_list} merchants={this.state.merchant_list} />


                
            //     <Row style={{padding:"20px"}}>
            //     <Row style={{background:"#fff"}}>
            //     <Row className="content">
            //         <Table {...table_info} bordered />
            //     </Row>
            //     </Row>
            //     </Row>
                
            // </div>
        )
    }
}

export default ComponentRoute(Borrow);
