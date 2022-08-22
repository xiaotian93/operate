import React , { Component } from 'react';
import { Row , Button , Modal , message} from 'antd';
import { browserHistory } from 'react-router';
import {axios_ygd} from '../../../ajax/request';
import { product_list_ygd , custom_del ,dropdown_list} from '../../../ajax/api';
import { page } from '../../../ajax/config';
import { format_table_data ,bmd} from '../../../ajax/tool';
import ComponentRoute from '../../../templates/ComponentRoute';
// import Path from './../../../templates/Path';
import List from '../../templates/list';
import ListBtn from '../../templates/listBtn';
class Indent extends Component {
    constructor(props){
        super(props);
        this.state = {
            source:[],
            loading:true,
            modal:{
                id:null,
                visible:false
            }
        }
    }
    componentWillMount () {
        this.dropdownList();
    }
    componentDidMount () {
        this.columns = [
            {
                title:"序号",
                dataIndex:"key",
                width:50,
                render:(text,record,index)=>{
                    if(text==="合计"){
                        return text;
                    }
                    return `${index+1}`
                }
            },
             {
                 title:"新增时间",
                 dataIndex:"createTime",
                 sorter: (a, b) => {
                    return bmd.getSort(a,b,"createTime",true)
                }
             },
            {
                title:"产品名称",
                //width:160,
                dataIndex:"name"
            },
            {
                title:"产品编号",
                dataIndex:"code",
                //width:100
            },
            {
                title:"所属项目",
                //width:160,
                dataIndex:"project",
                render:(e)=>{
                    var name="";
                    if(e==="ygd"){
                        name="员工贷"
                    }else if(e==="jyd"){
                        name="经营贷"
                    }
                    return name;
                }
            },
            {
                title:"操作",
                // width:150,
                render:(data)=>{
                    var btn=[<Button type="primary" size="small" onClick={()=>{this.go_edit(data)}}>编辑</Button>,
                    <Button type="" size="small" onClick={()=>{this.go_detail(data)}} src={"/cp/ygd/list/detail?productId="+data.id+"&project="+data.project+"&configId="+data.productConfigId+"&code="+data.code}>查看</Button>]
                    return <ListBtn btn={btn} />;
                }
            }
        ]
        this.get_list();
    }
    go_detail(data){
        bmd.navigate("/cp/ygd/list/detail?productId="+data.id+"&project="+data.project+"&configId="+data.productConfigId+"&code="+data.code);
    }
    go_edit(data){
        browserHistory.push("/cp/ygd/list/edit?productId="+data.id+"&project="+data.project+"&configId="+data.productConfigId+"&code="+data.code);
    }

    go_insert(){
        browserHistory.push('/cp/ygd/list/edit');
    }
    dropdownList(){
        axios_ygd.post(dropdown_list).then((e)=>{
            window.localStorage.setItem("dropdownList",JSON.stringify(e.data))
        })
    }
    get_list(pageNow=1){
        let rqd = "?";
        rqd += "page="+ pageNow +"&";
        rqd += "size="+ page.size;
        //let rqd={};
        //rqd.page=pageNow;
        //rqd.size=page.size
        axios_ygd.get(product_list_ygd+rqd).then((data)=>{
            console.log(data)
            this.setState({
                source:format_table_data(data.data.list,pageNow,page.size),
                total:data.data.total,
                loading:false,
                current:pageNow
            })
        })
    }
    // 删除订单
    delete(){
        let rqd = {
            companyId:this.state.modal.id
        };
        axios_ygd.post(custom_del,rqd).then(data=>{
            message.success(data.msg);
            this.set_modal(false);
            this.get_list();
        })
    }
    set_modal(data){
        if(data){
            this.setState({
                modal:{
                    visible:true,
                    id:data.id
                }
            })
        }else{
            this.setState({
                modal:{
                    visible:false,
                    id:null
                }
            })
        }
    }
    page_up(page,pageSize){
        window.scrollTo(0,0);
        this.get_list(page);
    }
    render() {
        let pagination = {
            total : this.state.total,
            current : this.state.current,
            pageSize : page.size,
            onChange : this.page_up.bind(this),
            showTotal:total=>`共${total}条数据`
        }
        let table_props = {
            columns : this.columns,
            className : "table-sh lg",
            loading : this.state.loading,
            pagination : pagination,
            rowKey:"key",
            dataSource : this.state.source
        }
        let modal_props = {
            title:"删除确认",
            visible:this.state.modal.visible,
            onOk:()=>{ this.delete(); },
            onCancel:()=>{ this.set_modal(false); }
        }
        const table={
            filter:null,
            tableInfo:table_props,
            tableTitle:{
                left:null,
                right:<span>
                    <Button type="primary" onClick={this.go_insert.bind(this)}>新增产品</Button>
                </span>
            },
        }
        return (
            <Row>
                {/* <Row className="table-content">
                    <div className="table-btns">
                        <Button type="primary" onClick={this.go_insert.bind(this)}>新增产品</Button>
                    </div>
                    <Table bordered {...table_props} />
                </Row> */}
                <List {...table} />
                <Modal {...modal_props}>
                    <p>确定删除订单吗？</p>
                </Modal>
            </Row>
        )
    }
}


export default ComponentRoute(Indent);