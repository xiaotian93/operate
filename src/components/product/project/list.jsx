import React, { Component } from 'react';
import {Button,Modal} from 'antd';
import {merchant_zj_list,merchant_zj_enable,merchant_zj_select_appkey} from '../../../ajax/api';
import { axios_loan } from '../../../ajax/request';
// import Filter from '../../ui/Filter_obj8';
import {format_table_data,bmd} from '../../../ajax/tool';
import {page} from '../../../ajax/config';
// import { browserHistory } from 'react-router';
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
            spin:false,
            appKeyArr:[]
        };
    }
    componentWillMount(){
        window.localStorage.setItem("detail","");
        this.filter={
            cooperatorNo:{
                name:'商户ID',
                type:'text',
                placeHolder:'请输入商户ID'
            },
            cooperator:{
                name:'商户全称/简称',
                type:'text',
                width:4,
                placeHolder:'请输入商户名称/简称'
            },
            appKey:{
                name:'项目名称',
                type:'select',
                placeHolder:'请选择项目',
                values:"appKey",
            },
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
                title:'项目新增时间',
                dataIndex:'createTime',
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"createTime",true)
                }
                //width:'16%'
            },
            {
                title:'项目名称',
                dataIndex:'appName'

            },
            {
                title:'所属商户ID',
                dataIndex:'cooperatorNo',
                render:e=>e||"--"

            },
            {
                title:'所属商户名称',
                dataIndex:'cooperator',
                render:e=>e||"--"

            },
            {
                title:'项目状态',
                dataIndex:'status',
                render:(data)=>{
                    return !data?'停用':'正常';
                }

            },
            {
                title:'操作',
                // width:180,
                render:(data)=>{
                    var btn=[];
                    if(!data.status){
                        btn.push(<Permissions type="primary" size="small" onClick={()=>{this.sure(data.appKey,true)}} server={global.AUTHSERVER.loan.key} permissions={global.AUTHSERVER.loan.access.app_status_update} tag="button">启用</Permissions>)
                    }else{
                        btn.push(<Permissions type="danger" size="small" onClick={()=>{this.sure(data.appKey,false)}} server={global.AUTHSERVER.loan.key} permissions={global.AUTHSERVER.loan.access.app_status_update} tag="button">停用</Permissions>)
                    }
                    btn.push(<Permissions size="small" onClick={()=>{this.edit(data,false)}} server={global.AUTHSERVER.loan.key} permissions={global.AUTHSERVER.loan.access.default} tag="button" src={'/cp/project/list/product?appKey='+data.appKey+"&domain="+data.domain+"&appName="+data.appName}>查看</Permissions>);
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
    getSelect(){
        axios_loan.post(merchant_zj_select_appkey).then(e=>{
            var data=e.data,arr=[];
            data.forEach(val=>{
                var json={
                    name:val.appName,
                    val:val.appKey
                }
                arr.push(json)
            })
            this.setState({
                appKeyArr:arr
            })
        })
    }
    filterValue(arr,id){
        let res = [{val:"",name:"全部"}];
        for(let a in arr){
            res.push({val:id?arr[a].id:arr[a].name,name:arr[a].name})
        }
        return res;
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
        data.size = page.size;
        this.setState({
            loading:true,
        })
        axios_loan.post(merchant_zj_list,data).then((data)=>{
            let list = data.data.list;
            this.setState({
                data:format_table_data(list,page_no,page.size),
                loading:false,
                total:data.data.total,
                current:data.data.current,
            })
        });
    }
    page_up(page,pageSize){
        window.scrollTo(0,0);
        this.get_list(page,this.state.filter);
    }
    edit(data,edit){
        this.setState({
            spin:true
        })
        bmd.navigate('/cp/project/list/product?appKey='+data.appKey+"&domain="+data.domain+"&appName="+data.appName);
    }
    changeState(id,status){
        axios_loan.get(merchant_zj_enable+"?appKey="+id+"&enable="+status).then((e)=>{
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
    sure(id,type){
        this.setState({
            visiable:true,
            appKey:id,
            type:type
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
                <Button type="primary" onClick={()=>{this.changeState(this.state.appKey,this.state.type)}} key="sure">确定</Button>
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
                "appKey":this.state.appKeyArr,
            },
            tableInfo:table_props,
            tableTitle:{
                left:null,
                right:null
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
                <Modal {...modalInfo}>{this.state.type?"确认后该项目变为启用状态可开始进件":"确认停用后该项目下订单将无法进件"}</Modal>                
            </div>
        )
    }
}
export default ComponentRoute(Product_cxfq);