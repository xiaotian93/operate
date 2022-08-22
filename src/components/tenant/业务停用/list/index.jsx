import React, { Component } from 'react';
import {Button,Modal} from 'antd';
import {merchant_list,transfer_status,merchant_detail,sh_product_list,merchant_insur_company_list,merchant_tem,qudao_list,customer_business} from '../../../../ajax/api';
import { axios_sh } from '../../../../ajax/request';
// import Filter from '../../ui/Filter_obj8';
import {format_table_data,bmd} from '../../../../ajax/tool';
import {page} from '../../../../ajax/config';
import { browserHistory } from 'react-router';
import Permissions from '../../../../templates/Permissions';
import ComponentRoute from '../../../../templates/ComponentRoute';
import List from '../../../templates/list';
import ListBtn from '../../../templates/listBtn';
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
            sh_no:{
                name:'商户ID',
                type:'text',
                placeHolder:'请输入商户ID'
            },
            name:{
                name:'商户全称/简称',
                type:'text',
                width:4,
                placeHolder:'请输入商户名称/简称'
            },
            qudao:{
                name:'所属渠道',
                type:'select',
                placeHolder:'请选择所属渠道',
                values:"qudao",
            },
            product_id:{
                name:'开通产品',
                type:'select',
                placeHolder:'请选择开通产品',
                values:"product"
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
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"createTime",true)
                }
                //width:'16%'
            },
            {
                title:'商户ID',
                dataIndex:'shNo'

            },
            {
                title:'商户简称',
                dataIndex:'name'

            },
            {
                title:'所属渠道',
                dataIndex:'qudao'

            },
            {
                title:'开通产品',
                dataIndex:'product'

            },
            {
                title:'管理员手机号',
                dataIndex:'adminPhone'

            },
            {
                title:'管理员姓名',
                dataIndex:'adminName'

            },
            {
                title:'状态',
                dataIndex:'enable',
                render:(data)=>{
                    return data?'停用':'正常';
                }

            },
            {
                title:'操作',
                // width:180,
                render:(data)=>{
                    var btn=[];
                    if(data.enable){
                        btn.push(<Permissions type="primary" size="small" onClick={()=>{this.changeState(data.id,0)}} server={global.AUTHSERVER.cxfq.key} permissions={global.AUTHSERVER.cxfq.access.merchant_transfer_status} tag="button">启用</Permissions>)
                    }else{
                        btn.push(<Permissions type="danger" size="small" onClick={()=>{this.sure(data.id)}} server={global.AUTHSERVER.cxfq.key} permissions={global.AUTHSERVER.cxfq.access.merchant_transfer_status} tag="button">停用</Permissions>)
                    }
                    btn.push(<Permissions type="primary" size="small" onClick={()=>{this.edit(data.id,true)}} server={global.AUTHSERVER.cxfq.key} permissions={global.AUTHSERVER.cxfq.access.merchant_update} tag="button">编辑</Permissions>);
                    btn.push(<Permissions size="small" onClick={()=>{this.edit(data.id,false)}} server={global.AUTHSERVER.cxfq.key} permissions={global.AUTHSERVER.cxfq.access.merchant_detail} tag="button">查看</Permissions>);
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
        
        this.getSelect();
    }
    filterValue(arr,id){
        let res = [{val:"",name:"全部"}];
        for(let a in arr){
            res.push({val:id?arr[a].id:arr[a].name,name:arr[a].name})
        }
        return res;
    }
    getSelect(){
        axios_sh.get(sh_product_list).then(e=>{
            this.setState({product_list:this.filterValue(e.data,true)})
        });
        axios_sh.get(qudao_list).then(e=>{
            this.setState({qudao_list:this.filterValue(e.data,false)})
        });
        
    }
    get_filter(data){
        let paths = this.props.location.pathname;
        window.localStorage.setItem(paths,JSON.stringify(data))
        this.setState({
            filter:data
        })
        this.get_list(1,data)
    }
    get_list(page_no , filter={}){
        let data = JSON.parse(JSON.stringify(filter));
        data.page = page_no||1;
        data.page_size = page.size;
        this.setState({
            loading:true,
        })
        axios_sh.post(merchant_list,data).then((data)=>{
            let list = data.data;
            this.setState({
                data:format_table_data(list,page_no,page.size),
                loading:false,
                total:data.totalData,
                current:data.current,
            })
        });
    }
    page_up(page,pageSize){
        window.scrollTo(0,0);
        this.get_list(page,this.state.filter);
    }
    add(){
        axios_sh.get(sh_product_list).then(e=>{
            var data=e.data;
            window.localStorage.setItem('productList',JSON.stringify(data));
            browserHistory.push('/sh/list/add');
        });

    }
    edit(id,edit){
        axios_sh.get(sh_product_list+'?merchantId='+id).then(e=>{
            var data=e.data;
            window.localStorage.setItem('productList',JSON.stringify(data));
        });
        axios_sh.get(merchant_insur_company_list).then(e=>{
            if(!e.code){
                var data=format_table_data(e.data);
                window.localStorage.setItem('companyList',JSON.stringify(data));
            }
        })
        axios_sh.get(customer_business).then(e=>{
            if(!e.code){
                var data=format_table_data(e.data);
                window.localStorage.setItem('customer_business',JSON.stringify(data));
            }
        })
        if(!edit){
            axios_sh.get(merchant_tem).then(e=>{
                window.localStorage.setItem('tem',JSON.stringify(e.data));
            })
        }
        this.setState({
            spin:true
        })
        axios_sh.get(merchant_detail+"?id="+id).then((e)=>{
            if(!e.code){
                this.setState({
                    spin:false
                })
                window.localStorage.setItem("detail",JSON.stringify(e.data));
                if(edit){
                    browserHistory.push('/sh/list/edit?id='+id);
                }else{
                    browserHistory.push('/sh/list/detail?id='+id);
                }
            }
        });



    }
    changeState(id,status){
        axios_sh.get(transfer_status+"?id="+id+"&targetStatus="+status).then((e)=>{
            if(!e.code){
                this.setState({
                    visiable:false
                })
                this.get_list()
            }
        });

    }
    cancel(){
        this.setState({
            visiable:false
        })
    }
    sure(id){
        this.setState({
            visiable:true,
            id:id
        })
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
        const modalInfo={
            title:"确认",
            footer:[
                <Button onClick={this.cancel.bind(this)} key="cancel">取消</Button>,
                <Button type="primary" onClick={()=>{this.changeState(this.state.id,1)}} key="sure">停用</Button>
            ],
            visible:this.state.visiable,
            maskClosable:false
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
                right:<Permissions type="primary" onClick={this.add.bind(this)} server={global.AUTHSERVER.cxfq.key} permissions={global.AUTHSERVER.cxfq.access.merchant_add} tag="button">新增商户</Permissions>
            }
        }
        return (
            <div>
                {/* <Filter data-get={this.get_filter.bind(this)} data-source={this.filter} top="20px" qudao={this.state.qudao_list} product={this.state.product_list} data-paths={paths} />
                <Row style={{padding:"20px"}}>
                <Spin spinning={this.state.spin}>
                <Row style={{background:"#fff"}}>
                <Row style={{padding:"15px 22px 0 22px"}}>
                <Permissions type="primary" onClick={this.add.bind(this)} server={global.AUTHSERVER.cxfq.key} roleKey={global.AUTHSERVER.cxfq.role.config} tag="button" style={{padding:'0 30px'}}>新增</Permissions>
                </Row>
                <Row className="content">
                    <Table {...table} bordered />
                </Row>
                </Row>
                </Spin>
                </Row> */}
                <List {...table} />
                <Modal {...modalInfo}>停用后，信息不再展示到分期进件系统，确认停用？</Modal>                
            </div>
        )
    }
}
export default ComponentRoute(Product_cxfq);