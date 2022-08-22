import React, { Component } from 'react';
import { Input , Button , message } from 'antd';
// import moment from 'moment'

// import Filter from '../../ui/Filter';
import axios from '../../../ajax/request'
import { zzb_audit_second , zzb_tast_approve , zzb_audit_second_export } from '../../../ajax/api';
import { host , page } from '../../../ajax/config';
import { format_table_data ,bmd} from '../../../ajax/tool';
import ComponentRoute from '../../../templates/ComponentRoute';
import List from '../../templates/list';
import ListBtn from '../../templates/listBtn';

class review_hs extends Component{
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            selectedRows: [],
            loading: false,
            total:1,
            current:1,
            pageSize:page.size,
            data:[],
            filter:[],
            model:{
                visible:false,
                title:'确认通过？',
                text:'',
                approved:true,
                id:0
            },
            loanPeriod:JSON.parse(localStorage.getItem("select")).zzb_loan_period
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
                // width:290,
                dataIndex: 'orderId',
            },
            {
                title: '订单生成时间',
                // width:170,
                dataIndex: 'showVo.signTime',
                sorter: (a, b) => {
                    if(a.key==="合计"||b.key==="合计"){
                        return;
                    }
                    return bmd.getTimes(a.showVo.signTime)-bmd.getTimes(b.showVo.signTime)
                }
            },
            {
                title: '借款方',
                render(data){
                    if(!data.showVo){
                        return '';
                    }
                    if(data.showVo.borrowType===1){
                        return data.showVo.borrow_info.company.name
                    }else{
                        return data.showVo.borrow_info.person.name
                    }
                }
            },
            {
                title: '借款金额',
                // width:100,
                dataIndex: 'showVo.borrow_info.amount',
                sorter: (a, b) => {
                    if(a.key==="合计"||b.key==="合计"){
                        return;
                    }
                    return a.showVo.borrow_info.amount-b.showVo.borrow_info.amount
                }
            },
            // {
            //     title: '借款期限(月)',
            //     width:110,
            //     dataIndex: 'showVo.borrow_info.loan_period'
            // },
            {
                title: '操作',
                // width:220,
                // fixed: 'right',
                render: (data) => {
                    var btn=[<Button type="primary" size="small" onClick={()=>(this.approved(data,true))}>通过</Button>,<Button type="danger" size="small" onClick={()=>(this.approved(data,false))}>驳回</Button>,<Button size="small" onClick={()=>(this.detail(data.taskId,data.bussiness))}>查看</Button>];
                    return <ListBtn btn={btn} />;
                }
            }
        ];
        this.filter = {
            time:{
                name:"订单时间",
                type:"range_date",
                feild_s:"__SignTime",
                feild_e:"__SignTime",
                placeHolder:['开始日期',"结束日期"]
            },
            __OrderId:{
                name:"订单编号",
                type:"text",
                placeHolder:"请输入订单编号"
            },
            __Borrower :{
                name:"借款方",
                type:"text",
                placeHolder:"请输入借款方"
            },
            // __LoanPeriod:{
            //     name:"借款期限",
            //     type:"multi_select",
            //     placeHolder:"请选择",
            //     values:'loanPeriod',
            //     op:"in"
            // }
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
    get_list(page_no,filter=[]){
        let data = {
            page:page_no||1,
            size:page.size,
            filter:JSON.stringify(filter)
        }
        this.setState({
            loading:true,
            selectedRowKeys:[]
        })
        axios.post(zzb_audit_second,data).then((data)=>{
            let list = this.extract_data(data);
            this.setState({
                data:format_table_data(list,page_no,page.size),
                loading:false,
                total:data.totalPage*page.size,
                current:data.currentPage
            })
        });
    }
    extract_data(data){
        let list = data.data;
        let res = [];
        for(let l in list){
            let item = {};
            try{
                item = JSON.parse(list[l].processVariables.detail);
            }catch(e){
                item = {};
            }
            item.taskId = list[l].id;
            item.bussiness = list[l].processVariables.id;
            if(item.matchDetailList&&item.matchDetailList.length>0){
                console.log("id："+item.id,"taskId："+item.taskId)
            }
            res.push(item);
        }
        return res;
    }
    get_filter(data){
        this.setState({
            filter:data
        })
        this.get_list(1,data);
    }
    approved(data,pass){
        this.setState({
            model:{
                approved:pass,
                visible:true,
                title:pass?'确认通过？':'确认驳回',
                text:'',
                id:[data.taskId]
            }
        })
    }
    detail(taskId,bussiness){
        window.open('/db/review/zzb/detail?taskId='+taskId+'&id='+bussiness);
    }
    handleOk(){
        this.setState({
            model:{
                approved:this.state.model.approved,
                loading:true,
                text:this.state.model.text,
                visible:this.state.model.visible,
                title:this.state.model.title,
                id:this.state.model.id,
            }
        })
        let ids = this.state.model.id;
        this.approve_post(ids,this.state.model.approved,this.state.model.text);
    }
    batch_operation(pass){
        let rows = this.state.selectedRows;
        let ids = [];
        for(let r in rows){
            ids.push(rows[r].taskId);
        }
        this.setState({
            model:{
                approved:pass,
                visible:true,
                title:pass?'确认通过？':'确认驳回',
                text:'',
                loading:false,
                id:ids
            }
        })
    }
    approve_post(taskIds,approved,comment){
        let rqd = [];
        if(!approved){
            if(!comment){
                message.warn("驳回意见不能为空");
                return;
            }
        }
        rqd.push("approved="+approved);
        rqd.push("comment="+comment);
        for(let t in taskIds){
            rqd.push("taskId="+taskIds[t]);
        }
        axios.post(zzb_tast_approve,rqd.join("&")).then((res)=>{
            this.handleCancel();
            message.success(res.msg)
            this.get_list();
        });
    }
    handleCancel(){
        this.setState({
            model:{
                approved:this.state.model.approved,
                text:this.state.model.text,
                loading:false,
                id:this.state.model.id,
                title:this.state.model.title,
                visible:false
            }
        })
    }
    textChange(e){
        this.setState({
            model:{
                approved:this.state.model.approved,
                loading:false,
                text:e.target.value,
                visible:this.state.model.visible,
                title:this.state.model.title,
                id:this.state.model.id,
            }
        })
    }
    table_export(){
        window.open(host + zzb_audit_second_export+"?filter="+encodeURI(JSON.stringify(this.state.filter||[])))
    }
    page_up(page,pageSize){
        window.scrollTo(0,0);
        this.get_list(page,this.state.filter);
    }
    render (){
        const { selectedRowKeys } = this.state;
        let pagination = {
            total : this.state.total,
            current : this.state.current,
            pageSize : this.state.pageSize,
            onChange : this.page_up.bind(this),
            showTotal:total=>`共${total}条数据`
        }
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(selectedRowKeys,selectedRows);
                this.setState({ selectedRowKeys , selectedRows });
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User',
                name: record.name
            }),
        };
        // let table_height = window.innerHeight - 422;
        const table_props = {
            rowSelection:rowSelection,
            // scroll:{x:1150,y:table_height},
            columns:this.columns ,
            dataSource:this.state.data,
            pagination : pagination,
            loading:this.state.loading,
        }
        const footer = [
            <Button key="back" onClick={this.handleCancel.bind(this)}>取消</Button>,
            <Button key="submit" type="primary" loading={this.state.model.loading} onClick={this.handleOk.bind(this)}>确认</Button>
        ]
        const model_props = {
            visible : this.state.model.visible, 
            title : this.state.model.title,
            onOk : this.handleOk.bind(this), 
            onCancel : this.handleCancel.bind(this),
            footer : footer
        }
        const filter = {
            "data-get": this.get_filter.bind(this),
            "data-source": this.filter,
            "loanPeriod": this.state.loanPeriod,
            "data-paths":this.props.location.pathname,
        }
        const tableTitle = {
            left: <span>金额单位：元</span>,
            right:<span>
                <Button type="primary" onClick={(e)=>(this.batch_operation(true))}>批量通过</Button>&emsp;
                <Button type="danger" onClick={(e)=>(this.batch_operation(false))}>批量驳回</Button>&emsp;
                <Button type="primary" onClick={this.table_export.bind(this)}>&emsp;导出&emsp;</Button>
            </span>
        }
        const modalContext=<Input placeholder="请输入审批意见" value={this.state.model.text} onChange={this.textChange.bind(this)} />
        return(
            <List filter={filter} tableInfo={table_props} tableTitle={tableTitle} modalInfo={model_props} modalContext={modalContext} isFilter />   
            // <div className="Component-body">
            //     <Filter data-get={this.get_filter.bind(this)} data-source={this.filter} loanPeriod={this.state.loanPeriod} />
            //     <Row style={{padding:"20px"}}>
            //     <Row style={{background:"#fff"}}>
            //         <Row style={{padding:"15px 22px 0 22px"}}>
            //         <Col span={18}>
            //             <Button type="primary" onClick={(e)=>(this.batch_operation(true))}>批量通过</Button>&emsp;
            //             <Button type="danger" onClick={(e)=>(this.batch_operation(false))}>批量驳回</Button>
            //         </Col>
            //         <Col span={6} className="text-right">
            //             <Button type="primary" onClick={this.table_export.bind(this)}>&emsp;导出&emsp;</Button>&emsp;
            //         </Col>
            //     </Row>
            //     <Row className="content">
            //         <Table {...table_props} bordered />
            //     </Row>
            //     </Row>
            //     </Row>
                
            //     <Modal {...model_props}>
            //         <Input placeholder="请输入审批意见" value={this.state.model.text} onChange={this.textChange.bind(this)} />
            //     </Modal>
            // </div>
        )
    }
}

export default ComponentRoute(review_hs);
