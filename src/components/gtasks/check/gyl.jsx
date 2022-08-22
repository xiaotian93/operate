import React, { Component } from 'react';
import { Input , Button , message } from 'antd';
import { axios_gyl } from '../../../ajax/request';
import { gyl_list_approve0 , gyl_deny0 , gyl_approve0 } from '../../../ajax/api';
import { format_table_data ,bmd} from '../../../ajax/tool';
import Permissions from '../../../templates/Permissions';
import ComponentRoute from '../../../templates/ComponentRoute';
import List from '../../templates/list';
import ListBtn from '../../templates/listBtn';
const status = 20;

class check_gyl extends Component{
    constructor(props) {
        super(props);
        this.state = {
            selectedRows: [],
            loading: false,
            total:1,
            current:1,
            pageSize:30,
            data:[],
            model:{
                visible:false,
                loading:false,
                title:'确认通过？',
                text:'',
                approved:true,
                id:0
            },
            companys:[]
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
                dataIndex: 'orderNo',
            },
            {
                title: '订单时间',
                dataIndex:"createTime",
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"createTime",true)
                }
            },
            {
                title: '借款方',
                dataIndex: 'borrowerCompanyName',
            },
            {
                title: '产品名称',
                dataIndex: 'appLoanConfigName',
            },
            {
                title: '借款金额',
                dataIndex:"amount",
                render:(data)=>{
                    return data?data.money():""
                },
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"amount",true)
                }
            },
            {
                title: '借款期限',
                render:(e)=>{
                    var periodType={1:"日",2:"周",3:"月",4:"季",5:"年"};
                    return e.period?(e.period+"("+periodType[e.periodType]+")"):"";
                }
            },
            {
                title: '备注',
                dataIndex:"remark",
                render:(e)=>{
                    return e?e:"-"
                }
            },
            {
                title: '操作',
                render: (data) => {
                    var btn=[<Permissions server={global.AUTHSERVER.gyl.key} tag="button" type="primary" size="small" onClick={()=>(this.approved([data.orderNo],true))} permissions={global.AUTHSERVER.gyl.access.approve0}>通过</Permissions>,<Permissions server={global.AUTHSERVER.gyl.key} tag="button" type="danger" size="small" onClick={()=>(this.approved([data.orderNo],false))} permissions={global.AUTHSERVER.gyl.access.reject0}>驳回</Permissions>,<Permissions server={global.AUTHSERVER.gyl.key} tag="button" size="small" onClick={()=>(this.detail([data.orderNo]))} permissions={global.AUTHSERVER.gyl.access.approve0_detail} src={'/db/check/gyl/detail?orderNo='+data.orderNo+'&audit=first&type=check'}>查看</Permissions>]
                    return <ListBtn btn={btn} />;
                }
            }
        ];
        this.filter = {
            orderNo :{
                name:"订单编号",
                type:"text",
                placeHolder:"请输入订单编号"
            },
            time:{
                name:"订单时间",
                type:"range_date",
                feild_s:"createTimeMin",
                feild_e:"createTimeMax",
                placeHolder:['开始日期',"结束日期"]
            },
            borrowerCompanyName :{
                name:"借款方",
                type:"text",
                placeHolder:"请输入借款方"
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
    get_list(page_no=1,filter={}){
        this.setState({
            loading:true,
            selectedRowKeys:[],
            selectedRows:[]
        });
        let rqd = {
            page:page_no,
            size:30,
            status:status,
            ...filter
        }
        axios_gyl.post(gyl_list_approve0,rqd).then((data)=>{
            var list=data.data;
            this.setState({
                data:format_table_data(list.list,page_no,30),
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
    filter_value(arr){
        let res = [];
        for(let a in arr){
            res.push({val:arr[a].id,name:arr[a].name})
        }
        return res;
    }
    detail(orderNo){
        window.open('/db/check/gyl/detail?orderNo='+orderNo+'&audit=first&type=check');
    }
    batch_operation(pass){
        let ids = [];
        let rows = this.state.selectedRows;
        for(let r in rows){
            ids.push(rows[r].orderNo);
        }
        this.approved(ids,pass);
    }
    approved(nos,pass){
        let length = nos.length;
        this.setState({
            model:{
                approved:pass,
                visible:true,
                title:pass?('确认所选'+length+'条订单通过？'):('确认所选'+length+'条订单驳回？'),
                text:'',
                id:nos.join(",")
            }
        })
    }
    handleOk(){
        this.approve_post(this.state.model.id,this.state.model.approved,this.state.model.text);
        this.handleCancel();
    }
    approve_post(orderNo,approved,comment){
        if(!approved&&!comment){
            message.warn("驳回意见不能为空");
            return;
        }
        let rqd={};
        rqd.orderNo=orderNo;
        rqd.comment=comment;
        this.setState({
            loading:true
        });
        let api=approved?gyl_approve0:gyl_deny0;
        axios_gyl.post(api,rqd).then((res)=>{
            this.setState({
                loading:false
            });
            message.success(res.msg);
            this.get_list(1,this.state.filter);
        });
    }
    handleCancel(){
        this.setState({
            model:{
                approved:this.state.model.approved,
                text:this.state.model.text,
                id:this.state.model.id,
                title:this.state.model.title,
                visible:false,
                loanNotingImageStorageNoList:this.state.model.loanNotingImageStorageNoList,
                mortageImageStorageNoList:this.state.model.mortageImageStorageNoList
            }
        })
    }
    textChange(e){
        this.setState({
            model:{
                approved:this.state.model.approved,
                text:e.target.value,
                visible:this.state.model.visible,
                title:this.state.model.title,
                id:this.state.model.id,
            }
        })
    }
    page_up(page,pageSize){
        window.scrollTo(0,0);
        this.get_list(page,this.state.filter);
    }
    render (){
        let pagination = {
            total : this.state.total,
            current : this.state.current,
            pageSize : this.state.pageSize+1,
            onChange : this.page_up.bind(this),
            showTotal:total=>`共${total}条数据`
        }
        const rowSelection = {
            selectedRowKeys:this.state.selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({ selectedRowKeys , selectedRows });
            },
            getCheckboxProps: record => ({
                disabled: record.key === '总计',
                name: record.key
            }),
        };
        const table_props = {
            rowKey:"key",
            rowSelection:rowSelection,
            columns:this.columns,
            dataSource:this.state.data,
            pagination : pagination,
            loading:this.state.loading
        }
        const footer = [
            <Button key="back" onClick={this.handleCancel.bind(this)}>取消</Button>,
            <Button key="submit" type="primary" loading={this.state.loading_model} onClick={this.handleOk.bind(this)}>确认</Button>
        ]
        const model_props = {
            visible : this.state.model.visible,
            confirmLoading:false,
            title : this.state.model.title,
            onOk : this.handleOk.bind(this),
            onCancel : this.handleCancel.bind(this),
            loanNotingImageStorageNoList:this.state.model.loanNotingImageStorageNoList,
            mortageImageStorageNoList:this.state.model.mortageImageStorageNoList,
            footer : footer
        }
        const filter={
            "data-get":this.get_filter.bind(this),
            "data-source":this.filter,
            "businessIds":this.state.businessIds,
            "productIds":this.state.productIds,
            "data-paths":this.props.location.pathname,
        }
        const tableTitle={left:<span>金额单位：元</span>,right:null}
        const modalContext=<Input placeholder="请输入审批意见" value={this.state.model.text} onChange={this.textChange.bind(this)} />
        return(
            <List filter={filter} tableInfo={table_props} tableTitle={tableTitle} modalInfo={model_props} modalContext={modalContext} />   
        )
    }
}

export default ComponentRoute(check_gyl);
