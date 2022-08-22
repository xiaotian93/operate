import React, { Component } from 'react';
import { Button, Form } from 'antd';
// import moment from 'moment'

// import Filter from '../ui/Filter_nomal';
// import { axios_postloan ,axios_loanMgnt} from '../../ajax/request';
import { axios_postloan ,axios_loanMgnt} from '../../ajax/request';
import { host_postloan } from '../../ajax/config';
import { afterloan_overdue , afterloan_overdue_export , afterloan_overdue_total ,repay_export_getAllLoanApp} from '../../ajax/api';
import { page } from '../../ajax/config';
import { format_table_data , bmd } from '../../ajax/tool';
import Permissions from '../../templates/Permissions';
import UrgeModal from './components/UrgeModal';
import List from '../templates/list';
import ListBtn from '../templates/listBtn';
import ComponentRoute from '../../templates/ComponentRoute';
class Overdue extends Component{
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            modalVisible:false,
            total:[],
            filter:{},
            pageSize:page.size,
            data:[],
            list:[],
            listPage:1
        };
        this.loader = [];
    }
    componentWillMount(){
        this.get_select();

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
                title: '订单编号',
                dataIndex: 'domainNo',
            },
            {
                title: '借款方',
                dataIndex: 'borrowerName',
            },
            // {
            //     title: '注册手机号',
            //     dataIndex:'phone'
            // },
            {
                title: '借款时间',
                dataIndex:'loanStartDate',
                render:e=>e?e.split(" ")[0]:e,
                sorter: (a, b) => {
                    // return Date.parse(a.loanStartDate)-Date.parse(b.loanStartDate)
                    return bmd.getSort(a,b,"loanStartDate",true)
                }
            },
            {
                title: '借款金额',
                dataIndex:'loanAmount',
                render:e=>{
                    return e?e.money():"--"
                },
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"loanAmount")
                }
            },
            {
                title: '剩余本金',
                dataIndex:'balance',
                render:e=>{
                    return e?e.money():"--"
                },
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"balance")
                }
            },
            // {
            //     title: '入催本金',
            //     dataIndex:"overdueFee",
            //     render:(data)=> data===undefined?"--":data.money()
            // },
            {
                title: '当前拖欠本金',
                dataIndex:'overdueAmount',
                render:(data)=> data?data.money():"0.00",
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"overdueAmount")
                }
            },
            {
                title: '本人催收状态',
                key:'remindResult',
                render:e=>{
                    if(e.key==="合计"){
                        return;
                    }
                    return e.remindResult||"--"
                }
            },
            {
                title: '承诺还款时间',
                key:'promiseRepayTime',
                render:e=>{
                    if(e.key==="合计"){
                        return;
                    }
                    if(e.promiseRepayTime){
                        return e.promiseRepayTime.split(" ")[0]
                    }else{
                        return "--"
                    }
                },
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"promiseRepayTime",true)
                }
            },
            {
                title:"最近跟催时间",
                key:'remindTime',
                render:e=>{
                    if(e.key==="合计"){
                        return;
                    }
                    return e.remindTime||"--"
                },
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"remindTime",true)
                }
            },
            {
                title: '分期期数',
                // dataIndex:'phaseCount',
                render:e=>{
                    if(e.key==="合计"){
                        return;
                    }
                    return e.key==="合计"?"":e.phaseCount
                }
            },
            {
                title: '已还期数',
                // dataIndex:'phaseCount',
                render:e=>{
                    if(e.key==="合计"){
                        return;
                    }
                    return e.key==="合计"?"":e.repaidPhase
                }
            },
            {
                title: '逾期天数',
                key:'overdueDays',
                render:e=>{
                    if(e.key==="合计"){
                        return;
                    }
                    return e.key==="合计"?"":e.overdueDays
                    
                },
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"overdueDays")
                }
            },
            {
                title: '逾期阶段',
                key:"overdueDayss",
                render:e=>{
                    if(e.key==="合计"){
                        return;
                    }
                    if(Number(e.overdueDays)===0){
                        return "--"
                    }else if(1<=Number(e.overdueDays)&&Number(e.overdueDays)<=30){
                        return "M1"
                    }else if(31<=Number(e.overdueDays)&&Number(e.overdueDays)<=60){
                        
                        return "M2"
                    }else if(61<=e.overdueDays&&Number(e.overdueDays)<=90){
                        return "M3"
                    }else if(91<=e.overdueDays&&Number(e.overdueDays)<=120){
                        return "M4"
                    }else if(121<=e.overdueDays&&Number(e.overdueDays)<=150){
                        return "M5"
                    }else if(151<=e.overdueDays&&Number(e.overdueDays)<=180){
                        return "M6"
                    }else if(181<=e.overdueDays){
                        return "M6+"
                    }
                },
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"overdueDays")
                }
            },
            {
                title: '业务名称',
                render:e=>{
                    if(e.key==="合计"){
                        return;
                    }
                    var domainType = { "bmd-cashloan": "白猫贷", "bmd-loancoop-capital": "自有资金", "bmd-gongyinglian": "供应链", "bmd-yuangongdai": "员工贷","bmd-loancoop-assist":"助贷" }
                    return e.domain?domainType[e.domain]:"--";
                }
            },
            {
                title: '项目名称',
                render:e=>{
                    if(e.key==="合计"){
                        return;
                    }
                    return e.cooperator||"--";
                }
                // render:e=>{
                //     var text={"xffq":"自有资金业务","cashloan":"白猫贷业务"};
                //     return text[e]||"--";
                // }
            },
            {
                title: '注册渠道',
                render:e=>{
                    if(e.key==="合计"){
                        return;
                    }
                    return e.borrowerChannel||"--";
                }
            },
            {
                title: '订单状态',
                render: data => {
                    if(data.key==="合计"){
                        return;
                    }
                    var type={
                        100:"待还款",
                        160:"逾期未还",
                        810:"提前结清",
                        830:"正常结清",
                        860:"逾期结清"
                    }
                    return type[data.manageCurrentRpStatus]||"--"
                }
            },
            // {
            //     title: '备注',
            //     render: data => {
            //         if(data.gracePeriod===null){
            //             return "--"
            //         }
            //         if(data.manageCurrentRpStatus===160||data.manageCurrentRpStatus===860){
            //             if (data.overdueDays<= data.gracePeriod) {
            //                 return data.manageCurrentRpStatus===160?"宽限期内待还款":"宽限期内还款"
            //             }else{
            //                 return "--"
            //             }
            //         }else{
            //             return "--"
            //         }
            //     }
            // },
            {
                title: '操作',
                className:"operate",
                render: (data) => {
                    if(data.key==="合计"){
                        return;
                    }
                    let content = [
                        <a href={"/dh/overdue/detail?contractNo="+data.contractNo+"&contractId="+data.contractId+"&productLine="+data.domain+"&domainNo="+data.domainNo+"&appKey="+data.appKey} target="blank"><Button key="show" size="small" onClick={()=>{this.showDetail(data)}}>查看</Button></a>
                    ]
                    return data.key==="合计"?<span />:<ListBtn btn={content} />
                }
            }
        ];
        // repay_status_select.unshift({name:"全部",val:""});
        this.filter = {
            
            domainNo :{
                name: "订单编号",
                type: "text",
                placeHolder: "请输入客户名称"
            },
            borrowerName :{
                name: "借款方",
                type: "text",
                placeHolder: "请输入客户名称"
            },
            phone :{
                name: "注册手机号",
                type: "text",
                placeHolder: "请输入客户名称"
            },
            domain: {
                name: "业务",
                type: "select",
                values: "domain",
                relevance: "parent",
                relevanceChild: "appKey",
                // all: "hidden"
            },
            appKey: {
                name: "项目",
                type: "select",
                values: "appKey",
                relevance: "domain",
                // all: "hidden"
            },
            time: {
                name: "借款时间",
                type: "range_date",
                placeHolder: ["开始时间", "结束时间"],
                feild_s: "startLoanDate",
                feild_e: "endLoanDate"
            },
            manageRpStatus :{
                name:"订单状态",
                type:"select",
                placeHolder:"全部",
                values:[{val:100,name:"待还款"},{val:830,name:"正常结清"},{val:160,name:"逾期未还"},{val:860,name:"逾期结清"},{val:810,name:"提前结清"}]
                // repay_status_select
            },
            sectionType :{
                name:"逾期阶段",
                type:"select",
                placeHolder:"全部",
                values:[{name:"M1（1~30天）",val:"[1,30]"},{name:"M2（31~60天）",val:"[31,60]"},{name:"M3（61~90天）",val:"[61,90]"},{name:"M4（91~120天）",val:"[91,120]"},{name:"M5（121~150天）",val:"[121,150]"},{name:"M6（151~180天）",val:"[151,180]"},{name:"M6+（181天及以上）",val:"[181]"},],
                section_s:"minOverdueDays",
                section_e:"maxOverdueDays"
            },
            borrowerChannel :{
                name: "渠道",
                type: "text",
            },
        }
    }
    componentDidMount(){
        var select=window.localStorage.getItem(this.props.location.pathname);
        if(select){
            if(JSON.stringify(JSON.parse(select).remberData)!=="{}"||JSON.parse(select).isRember){
                this.get_list(1,JSON.parse(select).remberData);
            }else{
                this.get_list(1,this.state.filter);
                // this.get_list(1,{manageRpStatus:"160"});
            }
        }else{
            this.get_list(1,this.state.filter);
        }
        // this.get_total();
    }
    get_list(page_no=1,filter={}){
        let rqd = JSON.parse(JSON.stringify(filter));
        rqd.page = page_no;
        rqd.size = page.size;
        this.setState({
            loading:true,
            filter:filter
        })
        this.loader.push("list");
        axios_postloan.post(afterloan_overdue,rqd).then((data)=>{
            let detail = data.data.list;
            if(!data.code&&detail){
                this.loader.splice(this.loader.indexOf("list"),1);
                this.setState({
                    list:format_table_data(detail,page_no,page.size),
                    loading:this.loader.length>0,
                    // total:detail.length>0?[total]:null,
                    pageTotal:data.data.total,
                    pageCurrent:data.data.current,
                    // current:detail.current
                });
                (this.loader.length<=0)&&this.refresh_tabel("list");
                console.log(detail.length)
                if(detail.length>0){
                    this.get_total(filter);
                }
            }else{
                this.setState({
                    loading:false
                })
            }
        }).catch(e=>{
            this.setState({
                loading:false
            })
        });
    }
    // 获取统计数据
    get_total(filter){
        this.loader.push("total");
        axios_postloan.post(afterloan_overdue_total,filter).then(res=>{
            this.loader.splice(this.loader.indexOf("total"),1);
            let total = res.data;
            total.key="合计";
            // var list=this.state.list;
            // list.push(total);
            this.setState({
                loading:this.loader.length>0,
                totalDes:this.state.list.length>0?"此合计是当前查询结果的合计":"",
                total:this.state.list.length>0?total:[]
            });
            (this.loader.length<=0)&&this.refresh_tabel("total");
        })
    }
    // 刷新列表数据
    refresh_tabel(type){
        this.setState({
            // data:this.state.list.length>0?this.state.list.concat(this.state.total):this.state.list
            data:this.state.list.concat(this.state.total)
        })
    }

    // 显示催记弹窗
    showUrgeModal(data){
        
        this.setState({
            modalUserId :data.userLoanId,
            modalVisible:true
        })
    }

    modalHide(data){
        this.setState({
            modalVisible:false
        })
    }

    // 查看详情页
    showDetail(data){
        window.localStorage.setItem("dhCallList",JSON.stringify({contractId:data.contractId,productLine:data.domain,domainNo:data.domainNo,appKey:data.appKey,contractNo:data.contractNo}))
        // bmd.navigate("/dh/overdue/detail?contractNo="+data.contractNo,{contractId:data.contractId,productLine:data.domain,domainNo:data.domainNo,appKey:data.appKey});
    }

    get_filter(data){
        // let paths = this.props.location.pathname;
        // window.localStorage.setItem(paths,JSON.stringify(data))
        let filter = {};
        filter = JSON.parse(JSON.stringify(data));
        this.setState({
            filter:filter
        })
        this.get_list(this.state.listPage,filter);
        this.get_total(filter);
    }

    // 获取下拉菜单
    get_select(){
        axios_loanMgnt.post(repay_export_getAllLoanApp, { usage: "CONTRACT_LIST" }).then(data => {
            if (!data.code) {
                var domainType = { "bmd-cashloan": "白猫贷", "bmd-loancoop-capital": "自有资金", "bmd-gongyinglian": "供应链", "bmd-yuangongdai": "员工贷","bmd-loancoop-assist":"助贷" }
                var list = data.data, domainArr = [], appArr = [], dataNew = {};
                for (var i = 0; i < list.length; i++) {
                    if (!dataNew[list[i].domain]) {
                        var json = {}
                        var arr = [];
                        json.name = domainType[list[i].domain];
                        json.val = list[i].domain
                        arr.push({ name: list[i].appName, val: list[i].appKey });
                        json.child = arr;
                        dataNew[list[i].domain] = json;
                    } else {
                        dataNew[list[i].domain].child.push({ name: list[i].appName, val: list[i].appKey })
                    }
                }
                this.setState({
                    domain: domainArr,
                    appKey: appArr,
                    select_data: dataNew
                })
            }
        })
    }
    // 翻页
    page_up(page,pageSize){
        window.scrollTo(0,0);
        this.setState({
            modalVisible:false
        })
        this.get_list(page, this.state.filter);
    }
    // 导出
    exportList(){
        let query = [];
        for(let f in this.state.filter){
            query.push(f+"="+this.state.filter[f]);
        }
        let url = host_postloan+afterloan_overdue_export+"?"+query.join("&");
        window.open(url);
    }
    showTotal(){
        return "共"+this.state.pageTotal+"条数据"
    }
    render (){
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
            pagination : pagination,
            loading:this.state.loading,
            footer:()=>this.state.totalDes,
            rowClassName:function(data){
            }
        }
        const table={
            filter:{
                "data-get":this.get_filter.bind(this),
                "data-source":this.filter,
                "phase":this.state.phase,
                // "productName":this.state.productName,
                "appKey": this.state.select_data,
                "domain": this.state.select_data,
                // "loanTerm":this.state.loanTerm,
                "data-paths":this.props.location.pathname,
                manageRpStatus:window.localStorage.getItem(this.props.location.pathname)?(JSON.parse(window.localStorage.getItem(this.props.location.pathname)).isRember&&JSON.parse(window.localStorage.getItem(this.props.location.pathname)).remberData.manageRpStatus!=="160"?JSON.parse(window.localStorage.getItem(this.props.location.pathname)).remberData.manageRpStatus:"160"):"160"
            },
            tableInfo:table_props,
            tableTitle:{
                left:<span>金额单位：元</span>,
                right:<Permissions type="primary" onClick={this.exportList.bind(this)} server={global.AUTHSERVER.postloan.key} permissions={global.AUTHSERVER.postloan.access.pl_contract_export} tag="button">导出</Permissions>
            }
        }
        return(
            
            <div>
                {/* <Filter data-get={this.get_filter.bind(this)} data-source={this.filter} phase={this.state.phase} productName={this.state.productName} merchantName={this.state.merchantName} loanTerm={this.state.loanTerm} />
                <Row className="table-content">
                    <div className="table-btns">
                        <span style={{marginTop:"10px"}}>金额单位:元</span>
                        <div className="text-right">
                        <Permissions type="primary" onClick={this.exportList.bind(this)} server={global.AUTHSERVER.loan.key} tag="button">导出</Permissions>
                        </div>
                    </div>
                    <Table {...table_props} bordered />
                </Row> */}
                <List {...table} />
                <UrgeModal userId={this.state.modalUserId} visible={this.state.modalVisible} bindcancel={this.modalHide.bind(this)} />
            </div>
        )
    }
}

export default ComponentRoute(Form.create()(Overdue));
