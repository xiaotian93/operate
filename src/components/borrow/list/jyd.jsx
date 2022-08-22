import React, { Component } from 'react';
import { message } from 'antd';
//import moment from 'moment'

// import Filter from '../../ui/Filter_obj8';
import { axios_ygd } from '../../../ajax/request';
import { get_pay_success_list_jyd , jyd_deny1 , jyd_approve1 } from '../../../ajax/api';
import { format_table_data,bmd} from '../../../ajax/tool';
import { page } from '../../../ajax/config';
import ComponentRoute from '../../../templates/ComponentRoute';
import List from '../../templates/list';
import Permissions from '../../../templates/Permissions';
// const status = 40;

class check_hs extends Component{
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
        let statusMap = {
            "0":"草稿",
            "20":"初审中",
            "21":"复审中",
            "30":"待付款",
            "31":"付款中",
            "40":"放款完成",
            "60":"已结清",
            "61":"审核未通过",
            "62":"放款失败"
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
                title: '订单编号',
                //width:360,
                dataIndex: 'orderNo',
            },
            {
                title: '订单时间',
                //width:160,
                dataIndex:"orderTime",
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"orderTime",true)
                }
            },
            {
                title: '借款方',
                dataIndex: 'borrowerName',
                render:(e)=>{
                    return e?e:"-"
                }
            },
            {
                title: '借款金额',
                //width:100,
                dataIndex:"amount",
                render:(data)=>{
                    return data?data.money():"-"
                },
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"amount")
                }
            },
            {
                title: '借款期限(月)',
                //width:100,
                dataIndex: 'period',
                render:(e)=>{
                    return e?e:"-"
                }
            },
            {
                title: '批次',
                //width:160,
                dataIndex:"series",
                render:(e)=>{
                    return e?e:"-"
                }
            },
            {
                title: '订单状态',
                //width:160,
                dataIndex:"status",
                render:(e)=>{
                    return statusMap[e]
                }
            },
            {
                title: '备注',
                //width:160,
                dataIndex:"remark",
                render:(e)=>{
                    return e?e:"-"
                }
            },
            {
                title: '操作',
                // width:80,
                //fixed: 'right',
                render: (data) => {
                    return (
                        <span>
                            <Permissions size="small" onClick={()=>(this.detail(data.orderNo))} server={global.AUTHSERVER.ygd.key} tag="button" permissions={global.AUTHSERVER.ygd.access.jyd_pay_success_detail} src={'/jk/list/jyd/detail?orderNo='+data.orderNo+'&audit=first&type=jk'}>查看</Permissions>
                        </span>
                    )}
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
                feild_s:"orderStartTime",
                feild_e:"orderEndTime",
                placeHolder:['开始日期',"结束日期"]
            },
            borrowerName :{
                name:"借款方",
                type:"text",
                placeHolder:"请输入借款方"
            },
            series :{
                name:"批次",
                type:"text",
                placeHolder:"请输入批次"
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
            size:page.size,
            // status:status,
            ...filter
        }
        axios_ygd.post(get_pay_success_list_jyd,rqd).then((data)=>{
            var list=data.data;
            this.setState({
                data:format_table_data(list.list,page_no,page.size),
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
        window.open('/jk/list/jyd/detail?orderNo='+orderNo+'&audit=first&type=jk');
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
        let rqd={};
        rqd.orderNo=orderNo;
        rqd.comment=comment;
        this.setState({
            loading:true
        });
        let api=approved?jyd_approve1:jyd_deny1;
        axios_ygd.post(api,rqd).then((res)=>{
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
    //export_excel(){
    //    let url = host_cxfq + cxfq_export_excel;
    //    let param = this.state.filter;
    //    let querys = [];
    //    querys.push("?status="+status)
    //    for(let p in param){
    //        querys.push(p+"="+param[p]);
    //    }
    //    window.open(url+querys.join("&"));
    //}
    render (){
        let pagination = {
            total : this.state.total,
            current : this.state.current,
            pageSize : page.size,
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
        //let table_height = window.innerHeight - 422;
        const table_props = {
            rowKey:"key",
            //scroll:{x:1700,y:table_height},
            rowSelection:rowSelection,
            columns:this.columns,
            dataSource:this.state.data,
            pagination : pagination,
            loading:this.state.loading
        }
        // const footer = [
        //     <Button key="back" onClick={this.handleCancel.bind(this)}>取消</Button>,
        //     <Button key="submit" type="primary" loading={this.state.loading_model} onClick={this.handleOk.bind(this)}>确认</Button>
        // ]
        // const model_props = {
        //     visible : this.state.model.visible,
        //     confirmLoading:false,
        //     title : this.state.model.title,
        //     onOk : this.handleOk.bind(this),
        //     onCancel : this.handleCancel.bind(this),
        //     loanNotingImageStorageNoList:this.state.model.loanNotingImageStorageNoList,
        //     mortageImageStorageNoList:this.state.model.mortageImageStorageNoList,
        //     footer : footer
        // }
        const table={
            filter:{
                "data-get":this.get_filter.bind(this),
                "data-source":this.filter,
                businessIds:this.state.businessIds,
                productIds:this.state.productIds,
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
            //     <Filter data-get={this.get_filter.bind(this)} data-source={this.filter} businessIds={this.state.businessIds} productIds={this.state.productIds} />
            //     <Row className="table-content">
            //         <Table {...table_props} bordered />
            //     </Row>
            //     <Modal {...model_props}>
            //         {
            //             <Input placeholder="请输入审批意见" value={this.state.model.text} onChange={this.textChange.bind(this)} />
            //         }
            //     </Modal>
            // </div>
        )
    }
}

export default ComponentRoute(check_hs);
