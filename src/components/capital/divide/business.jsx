import React, { Component } from 'react';
import { Row , Button , message , Modal, Input } from 'antd';

// import moment from 'moment';
import { axios_zj } from '../../../ajax/request';
import { capital_business , capital_business_deny , capital_account_stats} from '../../../ajax/api';
import { page } from '../../../ajax/config';
import { format_date , page_go ,bmd} from '../../../ajax/tool';
import ComponentRoute from '../../../templates/ComponentRoute';
import ListBtn from '../../templates/listBtn';
import List from '../../templates/list';
const TextArea = Input.TextArea;

class Business extends Component {
    //构造器
    constructor(props) {
        super(props);
        console.log(this)
        this.state = {
            selectedRowKeys: [],
            selectedRows: [],
            loading: false,
            total:1,
            current:1,
            pageSize:page.size,
            d1:[],
            companys:[],
            status:0,
            reason:"",
            modal_visible:false,
            modal_data:{}
        };

    }
    //页面加载前 固定的方法名
    componentWillMount(){
        this.columns = [
            {
                title: '业务类型',
                dataIndex: 'businessType',
            },
            {
                title: '业务ID',
                width:"25%",
                dataIndex: 'businessId',
            },
            {
                title: '创建时间',
                dataIndex: 'createTime',
                render:data=>{
                    return format_date(data)
                },
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"createTime")
                }
            },
            {
                title: '金额',
                dataIndex: 'amount',
                render: (data) => {
                    return data.money()
                },
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"amount")
                }
            },
            {
                title: '描述',
                width:"20%",
                dataIndex: 'desc'
            },
            {
                title: '操作',
                width:140,
                render: (data) => {
                    var btn=[<Button type="primary" size="small" onClick={(e)=>{this.divide_confirm(data)}}>确认</Button>,
                    <Button size="small" type="danger" data-id = {data.id} onClick={this.divide_refuse_confirm.bind(this)}>拒绝</Button>]
                    return <ListBtn btn={btn} />;
                }
            }
        ];
        this.columns_total=[
            {
                title:"入金统计",
                colSpan:3,
                dataIndex:"income.total",
                render:data=>{
                    return parseInt(data,10)?data.money():data
                }
            },
            {
                title:"入金统计",
                colSpan:0,
                dataIndex:"income.remain",
                render:data=>{
                    return parseInt(data,10)?data.money():data
                }
            },
            {
                title:"入金统计",
                colSpan:0,
                dataIndex:"income.suspend",
                render:data=>{
                    return parseInt(data,10)?data.money():data
                }
            },
            {
                title:"出金统计",
                colSpan:3,
                dataIndex:"outgo.total",
                render:data=>{
                    return parseInt(data,10)?data.money():data
                }
            },
            {
                title:"出金统计",
                colSpan:0,
                dataIndex:"outgo.remain",
                render:data=>{
                    return parseInt(data,10)?data.money():data
                }
            },
            {
                title:"出金统计",
                colSpan:0,
                dataIndex:"outgo.suspend",
                render:data=>{
                    return parseInt(data,10)?data.money():data
                }
            }
        ]
    }

    componentDidMount(){
        this.get_list();
        // this.capital_account_stats();
    }

    // 获取统计
    capital_account_stats(){
        axios_zj.post(capital_account_stats).then(data=>{
            let source = [];
            source.push({
                key:"title",
                "income": {
                    "total": "总额",
                    "remain": "未分账总额",
                    "suspend": "已挂起总额"
                    },
                "outgo": {
                    "total": "总额",
                    "remain": "未分账总额",
                    "suspend": "已挂起总额"
                }
            })
            data.data.key = "data";
            source.push(data.data);
            this.setState({
                total_source:source
            })
        })
    }

    //请求
    get_list(pageNo=1){
        let rqd = {
            page:pageNo,
            size:page.size
        }
        axios_zj.post(capital_business,rqd).then((d2)=>{
            this.setState({
                d1:d2.data.list,
                total:d2.data.total,
                current:d2.data.page
            })
        });
    }

    // 确认分账
    divide_confirm(details){
        var detail={
            type:details.type,
            amount:details.amount,
            id:details.id,
            businessType:details.businessType,
            businessId:details.businessId,
            desc:details.desc
        }
        page_go("/zj/business/undivide?detail="+encodeURI(JSON.stringify(detail)));
    }

    // 拒绝分账确认
    divide_refuse_confirm(e){
        // let businessAccountingId = e.target.getAttribute("data-id");
        // Modal.confirm({
        //     content:"确认拒绝吗？",
        //     okText:"确认",
        //     cancelText:"取消",
        //     onOk:()=>{
        //         this.divide_refuse(businessAccountingId);
        //     },
        //     onCancel:()=>{

        //     }
        // })
        this.setState({
            modal_visible:true,
            modal_data:{
                businessAccountingId:e.target.getAttribute("data-id")
            }
        })
    }

    // 拒绝分账
    divide_refuse(){
        let rqd = {
            businessAccountingId:this.state.modal_data.businessAccountingId,
            reason:this.state.reason
        }
        axios_zj.post(capital_business_deny,rqd).then(data=>{
            message.success("操作成功");
            this.get_list();
            this.modal_hide();
        })
    }

    // 隐藏弹窗
    modal_hide(){
        this.setState({
            modal_data:{},
            reason:"",
            modal_visible:false
        })
    }

    // 文本框变化
    text_change(e){
        let key = e.target.getAttribute("data-key");
        this.setState({
            [key]:e.target.value
        })
    }

    // 分页
    page_up(page){
        window.scrollTo(0,0);
        this.get_list(page)
    }

    render() {

        let pagination = {
            total : this.state.total,
            current : this.state.current,
            pageSize : this.state.pageSize,
            onChange : this.page_up.bind(this)
        }

        let table_props = {
            pagination:pagination,
            rowKey :"id",
            dataSource : this.state.d1,
            loading : false,
            columns : this.columns,
            rowClassName:function(data){
                if(data.warning){
                    return "bg-warn"
                }else{
                    return ''
                }
            }
        }

        // let table_total = {
        //     pagination:false,
        //     rowKey :"key",
        //     dataSource : this.state.total_source,
        //     loading : false,
        //     columns : this.columns_total
        // }

        let modal_props = {
            visible:this.state.modal_visible,
            title:"确认拒绝吗？",
            onOk:this.divide_refuse.bind(this),
            onCancel:this.modal_hide.bind(this)
        }
        const table={
            tableInfo:table_props,
            tableTitle:{
                left:null,
                right:null
            },
            padding:true
        }
        return(            
            <div className="Component-body">
                <Row className="table-content">
                    <List {...table} />
                </Row>
                <Modal {...modal_props}>
                    <TextArea placeholder="请输入拒绝原因" value={this.state.reason} onChange={this.text_change.bind(this)} data-key="reason" />
                </Modal>
            </div>
        );
    }
}

export default ComponentRoute(Business);