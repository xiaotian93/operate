import React, { Component } from 'react';
// import {Button} from 'antd';
import {merchant_total_list} from '../../../ajax/api';
import { axios_merchant } from '../../../ajax/request';
// import Filter from '../../ui/Filter_obj8';
import {format_table_data,format_time,bmd} from '../../../ajax/tool';
import {page} from '../../../ajax/config';
import { browserHistory } from 'react-router';
import Permissions from '../../../templates/Permissions';
import ComponentRoute from '../../../templates/ComponentRoute';
import List from '../../templates/list';
import ListBtn from '../../templates/listBtn';
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
            
            time:{
                name:"新增时间",
                type:"range_date_day",
                feild_s:"createTimeStart",
                feild_e:"createTimeEnd",
                placeHolder:['开始日期',"结束日期"]
            },
            merchantName:{
                name:'商户全称/简称',
                type:'text',
                placeHolder:'请输入商户名称/简称'
            },
            // businessLineId:{
            //     name:'业务类型',
            //     type:'select',
            //     placeHolder:'请选择审核状态',
            //     values:"product"
            // },
            // channelId:{
            //     name:'所属渠道',
            //     type:'select',
            //     placeHolder:'请选择审核状态',
            //     values:"product"
            // }
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
                title:'商户ID',
                dataIndex:'merchantNo'

            },
            {
                title:'新增时间',
                dataIndex:'createTime',
                render:e=>{
                    return format_time(e)
                },
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"createTime")
                }
            },
            
            {
                title:'商户简称',
                dataIndex:"shortName",

            },
            {
                title:'业务类型',
                dataIndex:'commitTime',
                render:e=>{
                    return format_time(e)
                }

            },
            {
                title:'所属渠道',
                dataIndex:'status',
                render:e=>{
                    var val={1:"待审核",2:"通过",3:"不通过"};
                    return val[e]||"--";
                }

            },
            {
                title:'操作',
                // width:180,
                render:(data)=>{
                    var btn=[<Permissions type="primary" size="small" onClick={()=>{this.audit(data.accountId,data,data.id,true)}} server={global.AUTHSERVER.merchant.key} tag="button" permissions={global.AUTHSERVER.merchant.access.merchant_contract_detail}>编辑</Permissions>,
                    <Permissions size="small" onClick={()=>{this.audit(data.accountId,data,data.id,false)}} server={global.AUTHSERVER.merchant.key} tag="button" permissions={global.AUTHSERVER.merchant.access.merchant_detail} src={"/sh/total/detail?accountId="+data.accountId+"&edit=false&id="+data.id}>查看</Permissions>]
                    return <ListBtn btn={btn} />;
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
    filterValue(arr,id){
        let res = [{val:"",name:"全部"}];
        for(let a in arr){
            res.push({val:id?arr[a].id:arr[a].name,name:arr[a].name})
        }
        return res;
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
        this.setState({
            loading:true,
        })
        axios_merchant.post(merchant_total_list,data).then((data)=>{
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
    audit(accountId,data,id,audits){
        if(!audits){
            window.localStorage.setItem("total_sh",JSON.stringify(data));
            bmd.navigate("/sh/total/detail?accountId="+accountId+"&edit="+audits+"&id="+id);
        }else{
            browserHistory.push("/sh/total/edit?accountId="+accountId+"&edit="+audits+"&id="+id);
        
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
            rowKey:"id"
        }
        
        let paths = this.props.location.pathname;
        const table={
            filter:{
                "data-get":this.get_filter.bind(this),
                "data-source":this.filter,
                "data-paths":paths,
                "qudao":this.state.qudao_list,
                "product":this.state.product_list
            },
            tableInfo:table_props,
            tableTitle:{
                left:null,
                right:null
            }
        }
        return (
            <List {...table} />
            // <div>
            //     <Filter data-get={this.get_filter.bind(this)} data-source={this.filter} top="20px" qudao={this.state.qudao_list} product={this.state.product_list} data-paths={paths} />
            //     <Row style={{padding:"20px"}}>
            //     <Spin spinning={this.state.spin}>
            //     <Row style={{background:"#fff"}}>
            //     <Row className="content">
            //         <Table {...table} bordered />
            //     </Row>
                
            //     </Row>
            //     </Spin>
            //     </Row>
            // </div>
        )
    }
}
export default ComponentRoute(Product_cxfq);