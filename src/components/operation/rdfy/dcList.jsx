import React, { Component } from 'react';
import { Modal , Button } from 'antd';
import moment from 'moment';

// import Filter from '../../../templates/Filter';
import { axios_xjd_p } from '../../../ajax/request';
import { host_xjd } from '../../../ajax/config';
import { operation_rd_dc_list , operation_rd_dc_export , operation_rd_dc_status } from '../../../ajax/api';
import { page } from '../../../ajax/config';
import { format_table_data, bmd } from '../../../ajax/tool';
import Permissions from '../../../templates/Permissions';
import List from '../../templates/list';
class Loan extends Component{
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            filter:{
                startStatDate:moment().subtract(1,"month").format("YYYY-MM-DD"),
                endStatDate:moment().format("YYYY-MM-DD")
            },
            pageTotal:1,
            pageCurrent:1,
            pageSize:page.size,
            data:[],
            total:{},
            list:[],
            listPage:1,
            selectId:[]
        };
        this.loader = [];
    }
    componentWillMount(){
        this.columns = [
            {
                title: '序号',
                dataIndex: 'key',
                render:(text,record,index)=>{
                    if(text==="合计"){
                        return text;
                    }
                    return `${index+1}`
                }
            },
            {
                title: '统计日期',
                dataIndex:'statDate',
                render: e => {
                    return e?moment(e).format("YYYY-MM-DD"):"--"
                }
            },
            {
                title: '订单编号',
                dataIndex: 'contractNo',
                render:e=>(e||"-")
            },
            
            {
                title: '借款人',
                dataIndex:"borrowerName",
                render:e=>(e||"-")
            },
            {
                title: '借款金额',
                dataIndex:'contractAmount',
                render:e=>e>0?bmd.money(e):"--"
            },
            {
                title: '借款总期数',
                dataIndex:'totalPeriods',
                render:e=>(e||"-")
            },
            {
                title: '本期还款期数',
                dataIndex:"currentRepayPhase",
                render:e=>(e||"-")
            },
            {
                title: '应还款日',
                dataIndex:"planRepayDate",
                render:e=>e?moment(e).format("YYYY-MM-DD"):"--"
            },
            {
                title: '触发代偿日期（逾期30日）',
                dataIndex:"triggerCompensatoryDate",
                render:e=>e?moment(e).format("YYYY-MM-DD"):"--"
            },
            {
                title: '应还本金',
                dataIndex:'planRepayPrincipal',
                render:(data)=> bmd.money(data),
            },
            {
                title: '应还利息',
                dataIndex:'planRepayInterest',
                render:(data)=> bmd.money(data),
            },
            {
                title: '应还服务费',
                dataIndex:'planRepayServiceFee',
                render:(data)=> bmd.money(data),
            },
            {
                title: '应还三方代收费',
                dataIndex:'planRepayGuaranteeFee',
                render:(data)=> bmd.money(data),
            },
            {
                title: '应还罚息',
                dataIndex:'planRepayOverdueInterest',
                render:(data)=> bmd.money(data),
            },
            {
                title: '应还总额',
                dataIndex:'planRepayAmount',
                render:(data)=> bmd.money(data),
            },
            {
                title: '状态',
                dataIndex:'compensatoryType',
                render:e=>{
                    var type={PAY:"已代偿",NOT_PAY:"未代偿",REPAY_BACK:"代偿后还款"};
                    return type[e]||"--"
                }
            },
            {
                title: '操作',
                render:data=>{
                    if(data.key==="合计"){
                        return;
                    }
                    if(data.compensatoryType==="REPAY_BACK"){
                        return;
                    }
                    return data.compensatoryType==="PAY"?<Permissions size="small" onClick={(e)=>this.selectRow(data)} server={global.AUTHSERVER.bmdCashLoan.key} tag="button">未代偿</Permissions>:<Permissions size="small" onClick={(e)=>this.selectRow(data)} server={global.AUTHSERVER.bmdCashLoan.key} tag="button" type="primary">已代偿</Permissions>
                }
            }
        ];
        this.filter = {
            time :{
                name: "日期范围",
                type: "range_date_day",
                placeHolder: ["开始时间", "结束时间"],
                feild_s: "startStatDate",
                feild_e: "endStatDate",
                default:[moment().subtract(1,"month"),moment()]
            },
            contractNo :{
                name:"订单编号",
                type:"text",
                placeHolder:"请输入订单编号"
            },
            compensatoryType :{
                name:"代偿类型",
                type:"select",
                values:[{name:"已代偿",val:"PAY"},{name:"未代偿",val:"NOT_PAY"}]
            },
        }
    }
    componentDidMount(){
        var select=window.localStorage.getItem(this.props.location.pathname);
        if(select&&select.isRember){
            this.get_list(1,JSON.parse(select).remberData);
        }else{
            this.get_list();
        }
    }
    get_sort(){
        this.setState({
            data:format_table_data(this.state.data)
        })
    }
    get_list(page_no=1,filter=this.state.filter){
        let rqd = JSON.parse(JSON.stringify(filter));
        rqd.page = page_no;
        rqd.size = page.size;
        this.setState({
            loading:true
        })
        this.loader.push("list");
        axios_xjd_p.post(operation_rd_dc_list,rqd).then((data)=>{
            this.loader.splice(this.loader.indexOf("list"),1);
            var sum=data.data.statistics?data.data.statistics.sumStats:{};
            sum.key="合计";
            data.data.list.push(sum);
            let detail = format_table_data(data.data.list,page_no,page.size);
            this.setState({
                data:detail,
                loading:this.loader.length>0,
                pageCurrent:data.data.page,
                pageTotal:data.data.total
            });
        });
    }
    // 查看详情
    selectRow(data){
        this.setState({selectId:[data.id],compensatoryType:data.compensatoryType,visible:true})
    }

    // 获取筛选数据
    get_filter(data){
        let filter = {};
        filter = JSON.parse(JSON.stringify(data));
        this.setState({
            filter:filter
        })
        this.get_list(this.state.listPage,filter);
        // axios_xjd_p.get("/test/dddd",{a:1});
        // this.get_total(filter);
    }

    // 翻页
    page_up(page,pageSize){
        window.scrollTo(0,0);
        this.setState({
            listPage:page
        })
        this.get_list(page,this.state.filter);
    }
    // 导出
    exportList(){
        let query = [];
        for(let f in this.state.filter){
            query.push(f+"="+this.state.filter[f]);
        }
        let url = host_xjd+operation_rd_dc_export+"?"+query.join("&");
        window.open(url);
    }

    // 显示总数
    showTotal(){
        return "共"+this.state.pageTotal+"条数据"
    }
    //表格选择
    rowSelect(selectedRowKeys, selectedRows){
        var arrId=[];
        selectedRows.forEach(item=>{
            arrId.push(item.id)
        })
        this.setState({
            selectId:arrId,
            selectedRowKeys:selectedRowKeys
        })
        console.log(arrId)
    }
    sure(){
        var param={
            ids:this.state.selectId,
            compensatoryType:this.state.compensatoryType
        }
        axios_xjd_p.post(operation_rd_dc_status,param).then(e=>{
            this.setState({
                visible:false,
                selectId:[]
            });
            this.get_list();
        })
    }
    cancel(){
        this.setState({
            visible:false,
            id:[]
        });
    }
    selectRowModal(){
        this.setState({
            visible:true,
            compensatoryType:"NOT_PAY"
        });
    }
    render (){
        if(this.props.children){
            return this.props.children
        }
        const rowSelection={
            onChange:this.rowSelect.bind(this),
            getCheckboxProps:record=>({
                disabled:record.compensatoryType!=="NOT_PAY"
            }),
            selectedRowKeys:this.state.selectedRowKeys
        }
        var page=parseInt(this.state.pageTotal/(this.state.pageSize + 1),10);
        let pagination = {
            total : this.state.pageTotal+page,
            current : this.state.pageCurrent,
            pageSize : this.state.pageSize+1,
            showTotal:this.showTotal.bind(this),
            onChange : this.page_up.bind(this)
        }
        const table_props = {
            rowKey:"key",
            columns:this.columns ,
            dataSource:this.state.data,
            footer:()=>this.state.totalDes,
            pagination : pagination,
            loading:this.state.loading,
            rowSelection:rowSelection
        }
        const table={
            filter:{
                "data-get":this.get_filter.bind(this),
                "data-source":this.filter,
                "defaultValue":this.state.filter,
                "data-paths":this.props.location.pathname,
                time:[moment().subtract(1,"month"),moment()],
            },
            tableInfo:table_props,
            tableTitle:{
                left:<span>金额单位：元</span>,
                right:<div><Permissions type="primary" onClick={this.selectRowModal.bind(this)} server={global.AUTHSERVER.bmdCashLoan.key} tag="button" style={{marginRight:"5px"}} disabled={!this.state.selectId.length}>批量已代偿</Permissions><Permissions type="primary" onClick={this.exportList.bind(this)} server={global.AUTHSERVER.bmdCashLoan.key} tag="button">导出</Permissions></div>
            }
        }
        const modalInfo={
            title:"",
            footer:<div>
                <Button onClick={this.cancel.bind(this)}>取消</Button>
                <Button onClick={this.sure.bind(this)} type="primary">确认</Button>
            </div>,
            visible:this.state.visible,
            closable:false
        }
        return(
            <div>
                <Modal {...modalInfo} >{this.state.compensatoryType==="PAY"?"确定未代偿吗？":"确定已代偿吗？"}</Modal>
                <List {...table} />
            </div>
            
        )
    }
}

export default Loan;
