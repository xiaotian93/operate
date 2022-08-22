import React, { Component } from 'react';
import {Button,Modal, message} from 'antd';
import {loan_manage_list,loan_manage_list_enable,loan_manage_canEdit} from '../../../ajax/api';
import { axios_loan } from '../../../ajax/request';
// import Filter from '../../ui/Filter_obj';
import {format_table_data,bmd} from '../../../ajax/tool';
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
            visible:false
        };
    }
    componentWillMount(){
        window.localStorage.setItem("detail","");
        this.filter={
            code:{
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
                    return data||"--"
                },
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"createTime",true)
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
                dataIndex:'status',
                render:(data)=>{
                    return !data?<span className="text-danger">停用</span>:'正常';
                }

            },
            {
                title:'最近操作时间',
                dataIndex:'updateTime',
                render:(data)=>{
                    return data||"--"
                },
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"updateTime",true)
                }

            },
            {
                title:'操作',
                // width:180,
                render:(data)=>{
                    var btn=[];
                    if(!data.status){
                        btn.push(<Permissions type="primary" size="small" onClick={()=>{this.changeState(data,true)}} server={global.AUTHSERVER.loan.key} tag="button" permissions={global.AUTHSERVER.loan.access.product_enable}>启用</Permissions>)
                    }else{
                        btn.push(<Permissions type="danger" size="small" onClick={()=>{this.changeState(data,false)}} server={global.AUTHSERVER.loan.key} tag="button" permissions={global.AUTHSERVER.loan.access.product_enable}>停用</Permissions>)
                    }
                    btn.push(<Permissions type="primary" size="small" onClick={()=>{this.isEdit(data.code)}} server={global.AUTHSERVER.loan.key} tag="button" permissions={global.AUTHSERVER.loan.access.product_edit}>编辑</Permissions>);
                    btn.push(<Permissions size="small" onClick={()=>{this.edit(data,false)}} server={global.AUTHSERVER.loan.key} tag="button" permissions={global.AUTHSERVER.loan.access.product_detail} src={'/cp/total/list/detail?code='+data.code+"&id="+data.id}>查看</Permissions>);
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
        data.size = page.size;
        this.setState({
            loading:true,
        })
        axios_loan.post(loan_manage_list,data).then((data)=>{
            let list = data.data;
            this.setState({
                data:format_table_data(list.list,page_no,page.size),
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
        browserHistory.push('/cp/total/list/add');
    }
    isEdit(code){
        axios_loan.post(loan_manage_canEdit,{code:code}).then(e=>{
            if(!e.code){
                if(!e.data){
                    message.warn("该产品已使用，无法进行编辑操作");
                    return;
                }
                this.edit(code,true);
            }
        })
    }
    edit(id,edit){
        if(edit){
            browserHistory.push('/cp/total/list/edit?code='+id);
        }else{
            bmd.navigate('/cp/total/list/detail?code='+id.code+"&id="+id.id);
        }
    }
    changeState(data,status){
        this.setState({
            visible:true,
            product_id:data.code,
            product_status:status,
            product_name:data.name
        })
        
    }
    sure(){
        this.cancel();
        axios_loan.get(loan_manage_list_enable+"?code="+this.state.product_id+"&enable="+this.state.product_status).then((e)=>{
            if(!e.code){
                this.get_list()
            }
        });
    }
    cancel(){
        this.setState({
            visible:false,
        })
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
        const confirm={
            title:this.state.product_status?"启用确认":"停用确认",
            footer:<div>
                <Button onClick={this.cancel.bind(this)}>取消</Button>
                <Button onClick={this.sure.bind(this)} type="primary">确认</Button>
            </div>,
            visible:this.state.visible,
            closable:false
        }
        const table={
            filter:{
                "data-get":this.get_filter.bind(this),
                "data-source":this.filter,
                "data-paths":this.props.location.pathname
            },
            tableInfo:table_props,
            tableTitle:{
                left:null,
                right:<span>
                    <Permissions type="primary" onClick={this.add.bind(this)} server={global.AUTHSERVER.loan.key} tag="button">新增产品</Permissions>                
                </span>
            },
        }
        return (
            <div>
                {/* <Filter data-get={this.get_filter.bind(this)} data-source={this.filter} top="20px" />
                <Row className="table-content">
                    <div className="table-btns" style={{float:"right"}}>
                        <Permissions type="primary" onClick={this.add.bind(this)} server={global.AUTHSERVER.loanmanage.key} tag="button">新增产品</Permissions>
                    </div>
                    <Table {...table} bordered />
                </Row> */}
                <List {...table} />
                <Modal {...confirm}><p style={{fontSize:"14px"}}>{this.state.product_status?"确认启用【"+this.state.product_name+"】产品？":"确认停用【"+this.state.product_name+"】产品？停用后使用该产品的商户将无法进件"}</p></Modal>
            </div>
        )
    }
}
export default ComponentRoute(Product_cxfq);