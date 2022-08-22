import React, { Component } from 'react';
// import { Button } from 'antd';
// import moment from 'moment'
// import Filter from '../../ui/Filter_obj8';
import { axios_sh } from '../../../ajax/request'
import { customer_person_list , customer_person_edit_status } from '../../../ajax/api';
import { page } from '../../../ajax/config';
import { format_table_data ,bmd} from '../../../ajax/tool';
import Permissions from '../../../templates/Permissions';
import ComponentRoute from '../../../templates/ComponentRoute';
import List from '../../templates/list';
import ListBtn from '../../templates/listBtn';
class Borrow extends Component{
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            filter:{},
            pageSize:page.size,
            data:[],
            modal:{
                title:"是否确认？",
                text:"",
                visible:false,
                id:"",
                status:0
            }
        };
    }
    componentWillMount(){
        let statusMap = {
            "1":"白名单",
            "0":"正常",
            "-1":"黑名单"               
        }
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
                title: '用户ID',
                dataIndex: 'personNo',
            },
            {
                title: '姓名',
                dataIndex:'name'
            },
            {
                title: '手机号',
                dataIndex:"phone",
                render:data=>( data||"-" )
            },
            {
                title: '身份证号码',
                // width:120,
                dataIndex:'idCard',
                render:data=>( data||"-" )
            },
            {
                title: '银行卡',
                // width:120,
                dataIndex:'bankCard',
                render:data=>( data||"-" )
            },
            {
                title: '绑卡状态',
                dataIndex:'bindCardStatusStr'
            },
            {
                title: '注册时间',
                // width:100,
                dataIndex:'createTime',
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"createTime",true)
                }
            },
            {
                title: '用户来源',
                dataIndex:'source'
            },
            {
                title: '状态',
                dataIndex:'status',
                render:(data)=>(
                    statusMap[data]
                )
            },
            {
                title: '操作',
                // width:190,
                className:"operate",
                render: (data) => {
                    let obtns = [];
                    if(data.status===0){
                        // <Permissions type="primary" size="small" onClick={this.unset_whitelist.bind(this)} server={global.AUTHSERVER.cxfq.key} roleKey={global.AUTHSERVER.cxfq.role.config} tag="button" data-id={data.id} key="qb">取消白名单</Permissions>
                        obtns.push(<Permissions type="primary" size="small" onClick={this.set_blacklist.bind(this)} server={global.AUTHSERVER.cxfq.key} permissions={global.AUTHSERVER.cxfq.access.customer_person_transfer_status} tag="button" data-id={data.id} key="h">设为黑名单</Permissions>)
                        // obtns.push(<span key="k">&nbsp;</span>)
                        obtns.push(<Permissions type="primary" size="small" onClick={this.set_whitelist.bind(this)} server={global.AUTHSERVER.cxfq.key} permissions={global.AUTHSERVER.cxfq.access.customer_person_transfer_status} tag="button" data-id={data.id} key="b">设为白名单</Permissions>)
                    }
                    if(data.status===-1){
                        obtns.push(<Permissions type="primary" size="small" onClick={this.unset_blacklist.bind(this)} server={global.AUTHSERVER.cxfq.key} permissions={global.AUTHSERVER.cxfq.access.customer_person_transfer_status} tag="button" data-id={data.id} key="qh">取消黑名单</Permissions>)
                    }
                    if(data.status===1){
                        obtns.push(<Permissions type="primary" size="small" onClick={this.unset_whitelist.bind(this)} server={global.AUTHSERVER.cxfq.key} permissions={global.AUTHSERVER.cxfq.access.customer_person_transfer_status} tag="button" data-id={data.id} key="qb">取消白名单</Permissions>)
                    }
                    obtns.push(<Permissions size="small" data-id={data.id} onClick={this.show_customer.bind(this)} server={global.AUTHSERVER.cxfq.key} permissions={global.AUTHSERVER.cxfq.access.customer_person_detail} tag="button" src={"/kh/cxfq/person/detail?id="+data.id}>查看</Permissions>);
                    return <ListBtn btn={obtns} />;
                   
                }
            }
        ];
        this.filter = {
            name :{
                name:"姓名",
                type:"text",
                placeHolder:"请输入姓名"
            },
            phone :{
                name:"用户手机号",
                type:"text",
                placeHolder:"请输入手机号"
            },
            id_card :{
                name:"身份证号码",
                type:"text",
                placeHolder:"请输入身份证号码"
            },
            status :{
                name:"状态",
                type:"select",
                // placeHolder:"全部",
                values:[{name:"全部",val:''},{name:"正常",val:0},{name:"白名单成员",val:1},{name:"黑名单成员",val:-1}]
            }
        }
    }
    componentDidMount(){
        var select=window.localStorage.getItem(this.props.location.pathname);
        if(select){
            this.get_list(1,JSON.parse(select).remberData);
        }else{
            this.get_list();
        }
    }
    // 获取客户列表
    get_list(page_no=1,filter={}){
        let rqd = JSON.parse(JSON.stringify(filter));
        rqd.page = page_no;
        rqd.page_size = page.size;
        this.setState({
            loading:true
        })
        axios_sh.post(customer_person_list,rqd).then((data)=>{
            let list = data.data;
            console.log(list)
            this.setState({
                data:format_table_data(list,page_no,page.size),
                loading:false,
                total:data.totalData,
                current:data.current
            })
        });
    }
    // 获取筛选值
    get_filter(data){
        let filter = {};
        filter = JSON.parse(JSON.stringify(data));
        this.setState({
            filter:filter
        })
        this.get_list(1,filter);
    }

    // 查看客户信息
    show_customer(e){
        let id = e.target.getAttribute("data-id");
        bmd.navigate("/kh/cxfq/person/detail?id="+id);
    }
    // 设为黑名单
    set_blacklist(e){
        let modal = this.state.modal;
        modal.title = "确认操作";
        modal.id = e.target.getAttribute("data-id");
        modal.status = -1;
        modal.text = "确认将该客户加入黑名单？";
        modal.visible = true;
        this.setState({
            modal:modal
        })
    }
    // 取消黑名单
    unset_blacklist(e){
        let modal = this.state.modal;
        modal.title = "确认操作";
        modal.id = e.target.getAttribute("data-id");
        modal.status = 0;
        modal.text = "确认将该客户取消黑名单？";
        modal.visible = true;
        this.setState({
            modal:modal
        })
    }
    // 设为白名单
    set_whitelist(e){
        let modal = this.state.modal;
        modal.title = "确认操作";
        modal.id = e.target.getAttribute("data-id");
        modal.status = 1;
        modal.text = "确认将该客户加入白名单？";
        modal.visible = true;
        this.setState({
            modal:modal
        })
    }
    // 取消白名单
    unset_whitelist(e){
        let modal = this.state.modal;
        modal.title = "确认操作";
        modal.id = e.target.getAttribute("data-id");
        modal.status = 0;
        modal.text = "确认将该客户取消白名单？";
        modal.visible = true;
        this.setState({
            modal:modal
        })
    }
    // 修改客户状态
    edit_customer(id,status){
        let rqd = {
            id:id,
            targetStatus:status
        }
        axios_sh.post(customer_person_edit_status,rqd).then(data=>{
            this.get_list(1,this.state.filter);
            this.hide_modal();
        })
    }
    // 关闭弹窗
    hide_modal(){
        this.setState({
            modal:{
                visible:false
            }
        })
    }
    // 翻页
    page_up(page,pageSize){
        window.scrollTo(0,0);
        this.get_list(page,this.state.filter);
    }
    render (){
        let pagination = {
            total : this.state.total,
            current : this.state.current,
            pageSize : this.state.pageSize,
            onChange : this.page_up.bind(this),
            showTotal:total=>`共${total}条数据`

        }
        const table_props = {
            columns:this.columns ,
            dataSource:this.state.data,
            pagination : pagination,
            loading:this.state.loading,
        }
        let modal_props = {
            title:this.state.modal.title,
            visible:this.state.modal.visible,
            onOk:()=>{
                this.edit_customer(this.state.modal.id,this.state.modal.status)
            },
            onCancel:()=>{
                this.hide_modal();
            }
        }
        const table={
            filter:{
                "data-get":this.get_filter.bind(this),
                "data-source":this.filter,
                status:"",
                "data-paths":this.props.location.pathname,
            },
            tableInfo:table_props,
            tableTitle:{
                left:null,
                right:null
            },
            modalInfo:modal_props,
            modalContext:<p>{this.state.modal.text}</p>
        }
        return(
            <List {...table} />
            // <div>
            //     <Filter data-get={this.get_filter.bind(this)} data-source={this.filter} status="" />
            //     <Row className="table-content">
            //         <Table {...table_props} bordered />
            //     </Row>
                
            //     <Modal {...modal_props}>
            //         <p>{this.state.modal.text}</p>
            //     </Modal>
            // </div>
        )
    }
}

export default ComponentRoute(Borrow);
