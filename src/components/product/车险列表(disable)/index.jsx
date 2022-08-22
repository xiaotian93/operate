import React, { Component } from 'react';
// import {Button} from 'antd';
import {cx_product_list,cx_product_status} from '../../../ajax/api';
import { axios_sh } from '../../../ajax/request';
// import Filter from '../../ui/Filter_obj';
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
            current:1
        };
    }
    componentWillMount(){
        window.localStorage.setItem("detail","");
        this.filter={
            product_no:{
                name:'产品编号',
                type:'text',
                placeHolder:'请输入产品编号'
            },
            name:{
                name:'产品名称',
                type:'text',
                placeHolder:'请输入产品名称'
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
                title:'新增时间',
                dataIndex:'createTime',
                render:(data)=>{
                    return format_time(data)
                },
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"createTime")
                }
            },
            {
                title:'产品编号',
                dataIndex:'code'

            },
            {
                title:'产品名称',
                dataIndex:'name'

            },
            {
                title:'状态',
                dataIndex:'enable',
                render:(data)=>{
                    return data?'停用':'正常';
                }

            },
            {
                title:'最近修改时间',
                dataIndex:'updateTime',
                render:(data)=>{
                    return format_time(data)
                },
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"updateTime")
                }

            },
            {
                title:'操作',
                // width:180,
                render:(data)=>{
                    var btn=[];
                    if(data.enable){
                        btn.push(<Permissions type="primary" size="small" onClick={()=>{this.changeState(data.id,0)}} server={global.AUTHSERVER.cxfq.key} permissions={global.AUTHSERVER.cxfq.access.product_transfer_status} tag="button">启用</Permissions>)
                    }else{
                        btn.push(<Permissions type="danger" size="small" onClick={()=>{this.changeState(data.id,1)}} server={global.AUTHSERVER.cxfq.key} permissions={global.AUTHSERVER.cxfq.access.product_transfer_status} tag="button">停用</Permissions>)
                    }
                    btn.push(<Permissions type="primary" size="small" onClick={()=>{this.edit(data.id,true)}} server={global.AUTHSERVER.cxfq.key} permissions={global.AUTHSERVER.cxfq.access.product_update} tag="button">编辑</Permissions>);
                    btn.push(<Permissions size="small" server={global.AUTHSERVER.cxfq.key} permissions={global.AUTHSERVER.cxfq.access.product_detail} tag="button" onClick={()=>{this.edit(data.id,false)}} src={'/cp/cxfq/list/detail?productId='+data.id}>查看</Permissions>);
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
    get_filter(data){
        this.setState({
            filter:data
        });
        this.get_list(1,data)
    }
    get_list(page_no , filter={}){
        let data = JSON.parse(JSON.stringify(filter));
        data.page = page_no||1;
        data.page_size = page.size;
        this.setState({
            loading:true,
        })
        axios_sh.post(cx_product_list,data).then((data)=>{
            let list = data.data;
            this.setState({
                data:format_table_data(list,page_no,page.size),
                loading:false,
                total:data.totalData,
                current:data.current
            })
        });
    }
    page_up(page,pageSize){
        window.scrollTo(0,0);
        this.get_list(page,this.state.filter);
    }
    add(){
        browserHistory.push('/cp/cxfq/list/add');
    }
    edit(id,edit){
        if(edit){
            browserHistory.push('/cp/cxfq/list/add?productId='+id);
        }else{
            bmd.navigate('/cp/cxfq/list/detail?productId='+id);
        }
    }
    changeState(id,status){
        axios_sh.get(cx_product_status+"?productId="+id+"&targetStatus="+status).then((e)=>{
            if(!e.code){
                this.get_list()
            }
        });
    }
    render() {
        let pagination = {
            total : this.state.total,
            current : this.state.current,
            pageSize : this.state.pageSize,
            onChange : this.page_up.bind(this),
            showTotal:total=>`共${total}条数据`

        }
        const table_props={
            columns:this.columns,
            dataSource:this.state.data,
            loading:this.state.loading,
            pagination:pagination,
            rowKey:"id"
        }
        const table={
            filter:{
                "data-get":this.get_filter.bind(this),
                "data-source":this.filter,
                "data-paths":this.props.location.pathname,
            },
            tableInfo:table_props,
            tableTitle:{
                left:null,
                right:<span>
                    <Permissions type="primary" onClick={this.add.bind(this)} server={global.AUTHSERVER.cxfq.key} permissions={global.AUTHSERVER.cxfq.access.product_add} tag="button">新增产品</Permissions>
                </span>
            },
        }
        return (
            <List {...table} />
            // <div>
            //     <Filter data-get={this.get_filter.bind(this)} data-source={this.filter} top="20px" />
            //     <Row className="table-content">
            //         <div className="table-btns">
            //             <Permissions type="primary" onClick={this.add.bind(this)} server={global.AUTHSERVER.cxfq.key} roleKey={global.AUTHSERVER.cxfq.role.config} tag="button">新增</Permissions>
            //         </div>
            //         <Table {...table} bordered />
            //     </Row>
            // </div>
        )
    }
}
export default ComponentRoute(Product_cxfq);