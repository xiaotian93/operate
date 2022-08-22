import React, { Component } from 'react';
import { Row, Col, Modal, Button, DatePicker, message } from 'antd';
import moment from 'moment'
// import Filter from '../../ui/Filter_nomal';
import { axios_repay,axios_loan } from '../../../ajax/request'
import { repay_plan_list, pre_pay, cal_sum_loan_amount_interest, repay_plan_list_export, statistics_select, repay_plan_total ,repay_plan_bmd_list,repay_plan_total_bmd,repay_plan_bmd_select_product,repay_plan_bmd_select_merchant,repay_plan_detail_export} from '../../../ajax/api';
import { page, host_repay, repay_status_select_map, repay_status_select ,host_loanmanage} from '../../../ajax/config';
import { format_table_data, bmd } from '../../../ajax/tool';
import Permissions from '../../../templates/Permissions';
import List from '../../templates/list';
import ListBtn from '../../templates/listBtn';
class Page extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            selectedRows: [],
            textValue: "",
            radioValue: "提前结清",
            dateValue: moment(),
            loading: false,
            current: 1,
            filter: {
                startLoanStartDate:moment().subtract(1,"weeks").format("YYYY-MM-DD")+" 00:00:00",
                endLoanStartDate:moment().format("YYYY-MM-DD")+" 23:59:59",
            },
            pageSize: page.size,
            data: [],
            nowPage: 1,
            productName: [],
            merchantName: [],
            pre_pay: {
                domainNo: "",
                pay_date: "",
                total_money: "",
                total_interest: 0,
                total_otherFee: 0,
                total_overdueFee: 0,
                total_penaltyFee: 0,
                total_principal: 0,
                total_serviceFee: 0,
                serial_number: "",
                show: false,
                contract_id: "",
                loading: false
            }
        };
        this.type={
            cxfq:{
                detail:"cxfq_contract_detail",
                export:"cxfq_repay_plan_export"
            },
            zzb:{
                detail:"zzb_contract_detail",
                export:"zzb_repay_plan_export",
                // repayBatch:"ygd_repay_batch"
                repayBatch:"zzb_repay_batch"
            },
            hs:{
                detail:"hs_contract_detail",
                export:"hs_repay_plan_export",
                repayBatch:"hs_repay_batch"
            },
            ygd:{
                detail:"ygd_contract_detail",
                export:"ygd_repay_plan_export",
                repayBatch:"ygd_repay_batch"
            },
            jyd:{
                detail:"jyd_contract_detail",
                export:"jyd_repay_plan_export",
                repayBatch:"jyd_repay_batch"
            },
            gyl:{
                detail:"gyl_contract_detail",
                export:"gyl_repay_plan_export",
                repayBatch:"gyl_repay_batch"
            },
            fdd:{
                detail:"fdd_contract_detail",
                export:"fdd_repay_plan_export",
                repayBatch:"fdd_repay_batch"
            },
            cashcoop:{
                detail:"bmd_offine_contract_detail",
                export:"bmd_offine_repay_plan_export",
                repayBatch:"bmd_offine_repay_batch"
            },
            loancoop_online:{
                detail:"bmd_online_contract_detail",
                export:"bmd_online_repay_plan_export",
                repayBatch:"bmd_online_repay_batch"
            },
            cashcoop_daiyunying:{
                detail:"lsdk_contract_detail",
                export:"lsdk_repay_plan_export",
                repayBatch:"lsdk_repay_batch"
            },
            zyzj:{
                detail:"bmd_zf_contract_detail",
                export:"repay_plan_export"
            },
            cashloan:{
                detail:"bmd_contract_detail",
                export:"repay_plan_export"
            }
        }
    }
    componentWillMount() {
        this.columns = [
            {
                title: '序号',
                width: 50,
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
                //width: 160,
                dataIndex: 'domainNo'
            },
            {
                title: '借款方',
                dataIndex: 'borrowerName'
            },
            {
                title: '产品名称',
                // dataIndex: 'productName',
                render: e => {
                    if (e.key === "合计") {
                        return;
                    }
                    return e.productName || "--"
                }
            },
            {
                title: '商户名称',
                // dataIndex: 'merchantName',
                render: e => {
                    if (e.key === "合计") {
                        return;
                    }
                    if(this.props.page_type==="cashloan"||this.props.page_type==="zyzj"){
                        return e.cooperator|| "--"
                    }else{
                        return e.merchantName || "--"
                    }
                    
                }
            },
            {
                title: '借款金额',
                //width: 90,
                dataIndex:"loanAmount",
                render: data => {
                    return data ? data.money() : "--"
                },
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"loanAmount")
                }
            },
            {
                title: '已还本金合计',
                //width: 90,
                dataIndex: 'sumRepayPrincipal',
                render: data => {
                    return data ? data.money() : "0.00"
                },
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"sumRepayPrincipal")
                }
            },
            {
                title: '已还期数',
                render: (data) => {
                    return data.repayPhase
                }
            },
            {
                title: '总期数',
                render: (data) => {
                    return data.totalPhase
                }
            },
            {
                title: '贷款开始时间',
                //width: 110,
                dataIndex: 'loanStartDate',
                render:e=>{
                    if(this.props.page_type==="cashloan"||this.props.page_type==="zyzj"){
                        var time=[];
                        if(e){
                            time=e.split(" ");
                        }
                        return time[0];
                    }else{
                        return e
                    }
                },
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"loanStartDate",true)
                }
            },
            {
                title: '贷款开始时间',
                //width: 110,
                dataIndex: 'loanEndDate',
                render:e=>{
                    if(this.props.page_type==="cashloan"||this.props.page_type==="zyzj"){
                        var time=[];
                        if(e){
                            time=e.split(" ");
                        }
                        return time[0];
                    }else{
                        return e
                    }
                },
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"loanEndDate",true)
                }
            },
            {
                title: '订单状态',
                dataIndex: this.props.page_type==="cashloan"||this.props.page_type==="zyzj"?"currentPhaseStatus":'status',
                render: data => repay_status_select_map[data]||"--"
            },
            {
                title: '操作',
                // width: 140,
                render: (data) => {
                    if(this.props.page_type==="cashloan"||this.props.page_type==="zyzj"){
                        return data.key === "合计"?"":(<span>
                            <Permissions size="small" server={this.props.page_type==="cashloan"||this.props.page_type==="zyzj"?global.AUTHSERVER.loan.key:global.AUTHSERVER.loanmanage.key} permissions={this.props.page_type==="cashloan"||this.props.page_type==="zyzj"?global.AUTHSERVER.loan.access[this.type[this.props.page_type].detail]:global.AUTHSERVER.loanmanage.access[this.type[this.props.page_type].detail]} tag="button" onClick={() => { this.detail(data) }}>查看</Permissions>
                        </span>)
                    }
                    if (data.key === "合计") {
                        return;
                    }
                    var btn=[];
                    if(data.status === 0){
                        btn.push(<Permissions server={this.props.page_type==="cashloan"||this.props.page_type==="zyzj"?global.AUTHSERVER.loan.key:global.AUTHSERVER.loanmanage.key} permissions={this.props.page_type==="cashloan"||this.props.page_type==="zyzj"?global.AUTHSERVER.loan.access[this.type[this.props.page_type].repayBatch]:global.AUTHSERVER.loanmanage.access[this.type[this.props.page_type].repayBatch]} tag="button" type="primary" size="small" onClick={() => (this.set_pre_pay(true, data))}>还款全部</Permissions>)
                        btn.push(<Permissions size="small" server={this.props.page_type==="cashloan"||this.props.page_type==="zyzj"?global.AUTHSERVER.loan.key:global.AUTHSERVER.loanmanage.key} permissions={this.props.page_type==="cashloan"||this.props.page_type==="zyzj"?global.AUTHSERVER.loan.access[this.type[this.props.page_type].detail]:global.AUTHSERVER.loanmanage.access[this.type[this.props.page_type].detail]} tag="button" onClick={() => { this.detail(data) }} src={"/hk/plan/" + this.props.page_type + "/detail?contract_no=" + data.contractId}>查看</Permissions>);
                    }else{
                        btn.push(<Permissions size="small" server={this.props.page_type==="cashloan"||this.props.page_type==="zyzj"?global.AUTHSERVER.loan.key:global.AUTHSERVER.loanmanage.key} permissions={this.props.page_type==="cashloan"||this.props.page_type==="zyzj"?global.AUTHSERVER.loan.access[this.type[this.props.page_type].detail]:global.AUTHSERVER.loanmanage.access[this.type[this.props.page_type].detail]} tag="button" onClick={() => { this.detail(data) }} src={"/hk/plan/" + this.props.page_type + "/detail?contract_no=" + data.contractId}>查看</Permissions>);
                    }
                    
                    return <ListBtn btn={btn} />;
                }
            }
        ];
        this.columns_bmd = [
            {
                title: '序号',
                width: 50,
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
                //width: 160,
                dataIndex: 'domainNo'
            },
            {
                title: '借款方',
                dataIndex: 'borrowerName'
            },
            {
                title: '产品名称',
                // dataIndex: 'productName',
                render: e => {
                    if (e.key === "合计") {
                        return;
                    }
                    return e.productName || "--"
                }
            },
            {
                title: '商户名称',
                // dataIndex: 'merchantName',
                render: e => {
                    if (e.key === "合计") {
                        return;
                    }
                    if(this.props.page_type==="cashloan"||this.props.page_type==="zyzj"){
                        return e.cooperator|| "--"
                    }else{
                        return e.merchantName || "--"
                    }
                    
                }
            },
            {
                title: '借款金额',
                //width: 90,
                dataIndex:"loanAmount",
                render: data => {
                    return data ? data.money() : "--"
                },
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"loanAmount")
                }
            },
            {
                title: '已还本金合计',
                //width: 90,
                render: data => {
                    var money=Number(data.loanAmount)-Number(data.balance)
                    return money ? money.money() : "0.00"
                },
                sorter: (a, b) => {
                    if(a.key==="合计"||b.key==="合计"){
                        return;
                    }
                    var money_a=Number(a.loanAmount)-Number(a.balance);
                    var money_b=Number(b.loanAmount)-Number(b.balance)

                    return (money_a||0)-(money_b||0)
                }
            },
            {
                title: '已还期数',
                render: (data) => {
                    if (data.key === "合计") {
                        return;
                    }
                    return data.repaidPhase
                }
            },
            {
                title: '总期数',
                render: (data) => {
                    if (data.key === "合计") {
                        return;
                    }
                    return data.phaseCount
                }
            },
            {
                title: '贷款开始时间',
                //width: 110,
                dataIndex: 'loanStartDate',
                render:e=>{
                    if(this.props.page_type==="cashloan"||this.props.page_type==="zyzj"){
                        var time=[];
                        if(e){
                            time=e.split(" ");
                        }
                        return time[0];
                    }else{
                        return e
                    }
                },
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"loanStartDate",true)
                }
            },
            {
                title: '贷款结束时间',
                //width: 110,
                dataIndex: 'loanEndDate',
                render:e=>{
                    if(this.props.page_type==="cashloan"||this.props.page_type==="zyzj"){
                        var time=[];
                        if(e){
                            time=e.split(" ");
                        }
                        return time[0];
                    }else{
                        return e
                    }
                },
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"loanEndDate",true)
                }
            },
            {
                title: '订单状态',
                dataIndex: this.props.page_type==="cashloan"||this.props.page_type==="zyzj"?"manageCurrentRpStatus":'status',
                render: data => {
                    var type={
                        100:"待还款",
                        160:"逾期未还",
                        810:"提前结清",
                        830:"正常结清",
                        860:"逾期结清"
                    }
                    return type[data]||"--"
                }
            },
            {
                title: '操作',
                render: (data) => {
                    if(data.contractNo==="BMD_V2_20200411173412098275"){
                        console.log(data.domainNo)
                    }
                    if(this.props.page_type==="cashloan"||this.props.page_type==="zyzj"){
                        return data.key === "合计"?"":(<span>
                            <Permissions size="small" server={this.props.page_type==="cashloan"||this.props.page_type==="zyzj"?global.AUTHSERVER.loan.key:global.AUTHSERVER.loanmanage.key} permissions={this.props.page_type==="cashloan"||this.props.page_type==="zyzj"?global.AUTHSERVER.loan.access[this.type[this.props.page_type].detail]:global.AUTHSERVER.loanmanage.access[this.type[this.props.page_type].detail]} tag="button" onClick={() => { this.detail(data) }}>查看</Permissions>
                        </span>)
                    }
                    if (data.key === "合计") {
                        return;
                    }
                    var btn=[];
                    if(data.status === 0){
                        btn.push(<Permissions server={this.props.page_type==="cashloan"||this.props.page_type==="zyzj"?global.AUTHSERVER.loan.key:global.AUTHSERVER.loanmanage.key} permissions={this.props.page_type==="cashloan"||this.props.page_type==="zyzj"?global.AUTHSERVER.loan.access[this.type[this.props.page_type].repayBatch]:global.AUTHSERVER.loanmanage.access[this.type[this.props.page_type].repayBatch]} tag="button" type="primary" size="small" onClick={() => (this.set_pre_pay(true, data))}>还款全部</Permissions>)
                        btn.push(<Permissions size="small" server={this.props.page_type==="cashloan"||this.props.page_type==="zyzj"?global.AUTHSERVER.loan.key:global.AUTHSERVER.loanmanage.key} permissions={this.props.page_type==="cashloan"||this.props.page_type==="zyzj"?global.AUTHSERVER.loan.access[this.type[this.props.page_type].detail]:global.AUTHSERVER.loanmanage.access[this.type[this.props.page_type].detail]} tag="button" onClick={() => { this.detail(data) }}>查看</Permissions>);
                    }else{
                        btn.push(<Permissions size="small" server={this.props.page_type==="cashloan"||this.props.page_type==="zyzj"?global.AUTHSERVER.loan.key:global.AUTHSERVER.loanmanage.key} permissions={this.props.page_type==="cashloan"||this.props.page_type==="zyzj"?global.AUTHSERVER.loan.access[this.type[this.props.page_type].detail]:global.AUTHSERVER.loanmanage.access[this.type[this.props.page_type].detail]} tag="button" onClick={() => { this.detail(data) }}>查看</Permissions>);
                    }
                    
                    return <ListBtn btn={btn} />;
                }
            }
        ];
        let status = repay_status_select;
        status.unshift({ name: "全部", val: "" })
        this.filter = {
            domain_no: {
                name: "订单编号",
                type: "text",
                placeHolder: "请输入订单号"
            },
            borrower: {
                name: "借款方",
                type: "text",
                placeHolder: "请输入借款方"
            },
            product_ame: {
                name: "产品名称",
                type: "select",
                placeHolder: "全部",
                values: "productName"
            },
            merchant_name: {
                name: "商户名称",
                type: "select",
                placeHolder: "全部",
                values: "merchantName"
            },
            borrow_time: {
                name: "借款时间",
                type: "range_date_day",
                placeHolder: ["开始时间", "结束时间"],
                feild_s: "start_date",
                feild_e: "end_date"
            },
            status: {
                name: "订单状态",
                type: "select",
                placeHolder: "全部",
                values: status
            }
        }
        this.filter_bmd = {
            domainNo: {
                name: "订单编号",
                type: "text",
                placeHolder: "请输入订单号"
            },
            borrowerName: {
                name: "借款方",
                type: "text",
                placeHolder: "请输入借款方"
            },
            productName: {
                name: "产品名称",
                type: "select",
                placeHolder: "全部",
                values: "productName"
            },
            cooperator: {
                name: "商户名称",
                type: "select",
                placeHolder: "全部",
                values: "merchantName"
            },
            time: {
                name: "借款时间",
                type: "range_date",
                placeHolder: ["开始时间", "结束时间"],
                feild_s: "startLoanStartDate",
                feild_e: "endLoanStartDate",
                default:[moment().subtract(1, "weeks"), moment()]
            },
            manageCurrentRpStatus: {
                name: "订单状态",
                type: "select",
                placeHolder: "全部",
                values:[{val:100,name:"待还款"},{val:830,name:"正常结清"},{val:160,name:"逾期未还"},{val:860,name:"逾期结清"},{val:810,name:"提前结清"}]
            }
        }
    }
    componentDidMount() {
        this.get_select();
        var select=window.localStorage.getItem(this.props.path);
        if(select&&JSON.parse(select).isRember){
            var params=JSON.parse(select).remberData;
            if(this.props.page_type==="cashloan"||this.props.page_type==="zyzj"){
                if(!params.startLoanStartDate){
                    params.startLoanStartDate=moment().subtract(1,"weeks").format("YYYY-MM-DD")+" 00:00:00";
                    params.endLoanStartDate=moment().format("YYYY-MM-DD")+" 23:59:59";
                }
                this.get_list(1,params);
            }else{
                this.get_list(1,params);
            }
        }else{
            if(this.props.page_type==="cashloan"||this.props.page_type==="zyzj"){
                this.get_list(1,this.state.filter);
            }else{
                this.get_list();
            }
        }
    }
    detail(data) {
        if(this.props.page_type==="cashloan"||this.props.page_type==="zyzj"){
            bmd.navigate("/hk/plan/" + this.props.page_type + "/detail?contract_no=" + data.contractNo+"&appKey="+data.appKey)
        }else{
            bmd.navigate("/hk/plan/" + this.props.page_type + "/detail?contract_no=" + data.contractId)
        }
        
    }
    get_list(page_no, filter = {}) {
        let data = JSON.parse(JSON.stringify(filter));
        data.page = page_no || 1;
        data.size = page.size;
        this.setState({
            loading: true,
            selectedRowKeys: []
        });
        if(this.props.page_type==="cashloan"||this.props.page_type==="zyzj"){
            if(this.props.page_type==="zyzj"){
                // data.productLine="xffq";
                data.domain="bmd-loancoop-capital";

            }else{
                // data.productLine="cashloan";
                data.domain="bmd-cashloan";

            }
            data.bkSubject=this.props.bkSubject||"";
            data.onlyPaySuccess=true;
            axios_loan.post(repay_plan_bmd_list, data).then((data) => {
                let list = data.data.list;
                if(!data.code&&list){
                    this.setState({
                        data: format_table_data(list, page_no, page.size),
                        loading: false,
                        totalDes: "",
                        total: data.data.total,
                        current: data.data.current
                    })
                    if (list.length > 0) {
                        this.get_total_bmd(filter)
                    }
                }else{
                    this.setState({
                        loading: false,
                    });
                }
            });
        }else{
            data.product_line = this.props.page_type;
            data.bkSubject=this.props.bkSubject||"";
            axios_repay.post(repay_plan_list, data).then((data) => {
                let list = data.data;
                this.setState({
                    data: format_table_data(list, page_no, page.size),
                    loading: false,
                    totalDes: "",
                    total: data.total,
                    current: data.current
                })
                if (list.length > 0) {
                    this.get_total(filter)
                }
                this.forceUpdate();
            });
        }
        
    }
    // 获取统计数据
    get_total(filter) {
        filter.product_line = this.props.page_type;
        filter.bkSubject=this.props.bkSubject||"";
        axios_repay.post(repay_plan_total, filter).then(data => {
            let detail = data.data;
            detail.key = "合计";
            let lists = JSON.parse(JSON.stringify(this.state.data));
            lists.push(detail)
            this.setState({
                totalDes: "此合计是当前查询结果的合计",
                data: lists
            })
        })
    }
    get_total_bmd(filter) {
        if(this.props.page_type==="zyzj"){
            // data.productLine="xffq";
            filter.domain="bmd-loancoop-capital";

        }else{
            // data.productLine="cashloan";
            filter.domain="bmd-cashloan";

        }
        filter.bkSubject=this.props.bkSubject||"";
        filter.onlyPaySuccess=true;
        axios_loan.post(repay_plan_total_bmd, filter).then(data => {
            let detail = data.data;
            detail.key = "合计";
            let lists = JSON.parse(JSON.stringify(this.state.data));
            lists.push(detail)
            this.setState({
                totalDes: "此合计是当前查询结果的合计",
                data: lists
            })
        })
    }
    get_filter(data) {
        this.setState({
            filter: data
        })
        this.get_list(1, data);
    }
    set_filter(filter) {
        this.filter = filter;
        if (this.props.page_type === "cashloan") {
            // filter.props.form.setFieldsValue({ merchant_name: "自有商户" });
        }
    }
    // 获取下拉菜单
    get_select() {
        if(this.props.page_type==="cashloan"||this.props.page_type==="zyzj"){
            var data={};
            if(this.props.page_type==="zyzj"){
                data.domain="bmd-loancoop-capital";
            }else{
                data.domain="bmd-cashloan";
            }
            axios_loan.post(repay_plan_bmd_select_product, data).then((data) => {
                let list = data.data,product=[];
                for(var i in list){
                    var tem={
                        val:list[i],
                        name:list[i]
                    }
                    product.push(tem)
                }
                this.setState({
                    productName:product
                })
            });
            axios_loan.post(repay_plan_bmd_select_merchant, data).then((data) => {
                let list = data.data,merchant=[];
                for(var i in list){
                    var tems={
                        val:list[i],
                        name:list[i]
                    }
                    merchant.push(tems)
                }
                this.setState({
                    merchantName:merchant
                })
            });
            
        }else{
            axios_repay.post(statistics_select, { product_line: this.props.page_type }).then(data => {
                let selects = data.data;
                let temp = {};
                for (let s in selects) {
                    if (!selects[s]) {
                        continue;
                    }
                    temp[s] = [];
                    for (let t in selects[s]) {
                        if (!selects[s][t]) continue;
                        temp[s].push({ name: selects[s][t], val: selects[s][t] })
                    }
                    let bmdStr = "自有商户";
                    if (s === "merchantName" && selects[s].indexOf(bmdStr) < 0) {
                        temp[s].push({ name: bmdStr, val: bmdStr })
                    }
                    if (temp[s].length > 0) {
                        temp[s].unshift({ name: "全部", val: "" })
                    }
    
                }
                this.setState({
                    ...temp
                })
            })
        }
        
    }
    // 提前还款弹窗
    set_pre_pay(show, data) {
        let pay_date = moment().format("YYYY-MM-DD");
        let status = {
            domainNo: data ? data.domainNo : "",
            pay_date: pay_date,
            total_money: data ? data.loanAmount : "",
            total_interest: 0,
            total_otherFee: 0,
            total_overdueFee: 0,
            total_penaltyFee: 0,
            total_principal: 0,
            total_serviceFee: 0,
            type: 2,
            serial_number: "",
            remark: "",
            show: show,
            contract_id: data ? data.contractId : "",
            loading: false
        };
        if (show) {
            this.get_principal_intersert(data.contractId, pay_date)
        }
        this.setState({
            pre_pay: status,
            textValue: "",
            radioValue: "提前结清",
            dateValue: moment()
        })
    }
    pre_pay() {
        let status = JSON.parse(JSON.stringify(this.state.pre_pay));
        status.loading = true;
        this.setState({
            pre_pay: status
        })
        let rqd = {
            remark: this.state.radioValue,
            repay_date: this.state.pre_pay.pay_date,
            refund_order_no: this.state.pre_pay.serial_number,
            contract_id: this.state.pre_pay.contract_id
        }
        axios_repay.post(pre_pay, rqd).then((data) => {
            this.get_list(this.state.nowPage, this.state.filter);
            status.loading = false;
            status.show = false;
            this.setState({
                pre_pay: status
            })
        })
    }
    // 获取提前还款本息合计  (此处吐槽两万字.......)
    get_principal_intersert(contractNo, date) {
        let rqd = {
            contract_id: contractNo,
            repay_date: date
        }
        axios_repay.post(cal_sum_loan_amount_interest, rqd).then((data) => {
            let status = JSON.parse(JSON.stringify(this.state.pre_pay));
            status.total_money = data.data.amount;
            status.total_interest = data.data.interest;
            status.total_otherFee = (data.data.otherFee + data.data.otherFeeTech);
            status.total_overdueFee = data.data.overdueFee;
            status.total_penaltyFee = data.data.penaltyFee;
            status.total_principal = data.data.principal;
            status.total_serviceFee = (data.data.serviceFee + data.data.serviceFeeTech);
            this.setState({
                pre_pay: status
            });
        })
    }
    textChange(e) {
        let value = e.target.value;
        if (value.length > 100) {
            message.warn("流水号最大长度不超过100", 3);
            value = value.slice(0, 100)
        }
        let status = JSON.parse(JSON.stringify(this.state.pre_pay));
        status.serial_number = value;
        this.setState({
            pre_pay: status,
            textValue: value
        })
    }
    radioChange(e) {
        let status = JSON.parse(JSON.stringify(this.state.pre_pay));
        status.type = e.target.value;
        this.setState({
            pre_pay: status,
            radioValue: e.target.value,
        });
    }
    dateChange(str) {
        let status = JSON.parse(JSON.stringify(this.state.pre_pay));
        status.pay_date = str;
        this.get_principal_intersert(status.contract_id, str)
        this.setState({
            pre_pay: status,
            dateValue: str === "" ? undefined : moment(str)
        })
    }
    disabledDate(curr) {
        curr = curr ? curr : moment();
        return curr.valueOf() > Date.now();
    }
    page_up(page, pageSize) {
        window.scrollTo(0,0);
        this.setState({
            nowPage: page
        })
        this.get_list(page, this.state.filter);
    }
    export_result() {
        if(this.props.page_type==="cashloan"||this.props.page_type==="zyzj"){
            var select=window.localStorage.getItem(this.props.path);
            var filter={};
            if(JSON.parse(select).isRember){
                filter=JSON.parse(select).remberData
            }else{
                filter=this.state.filter;
            }
            filter.startDate=filter.startLoanStartDate?filter.startLoanStartDate.split(" ")[0]:"";
            filter.endDate=filter.endLoanStartDate?filter.endLoanStartDate.split(" ")[0]:"";
            var startDate=filter.startDate;
            var endDate=filter.endDate
            if(!startDate||!endDate){
                message.warn("请选择借款时间，一次最多导出一个月信息");
                return;
            }
            if(((new Date(endDate).getTime()-new Date(startDate).getTime())/1000/60/60/24)>31){
                console.log(((new Date(endDate).getTime()-new Date(startDate).getTime())/1000/60/60/24))
                message.warn("每次只能导出1个月数据哦~");
                return;
            }
            
            let str = [];
            for (let f in filter) {
                if(f!=="startLoanStartDate"&&f!=="endLoanStartDate"){
                    str.push(f + "=" + filter[f]);
                }
            }
            if(JSON.parse(select).isRember){
                if(this.props.page_type==="zyzj"){
                    str.push("domain=bmd-loancoop-capital");
                }else{
                    str.push("domain=bmd-cashloan")
                }
                str.push("onlyPaySuccess=true")
            }
            str.push("bkSubject=ZHIDUXIAODAI")
            var export_url=host_loanmanage+repay_plan_detail_export+"?"+str.join("&");
            window.open(encodeURI(export_url));
        }else{
            let filter = this.state.filter;
            let str = [];
            let url = "";
            for (let f in filter) {
                str.push(f + "=" + filter[f]);
            }
            str.push("product_line="+this.props.page_type)
            url = host_repay + repay_plan_list_export + "?belongService=" + this.props.page_type + "&" + str.join("&");
            window.open(encodeURI(url));
        }
    }
    showTotal() {
        return `共${this.state.total}条数据`
    }
    render() {
        var page=parseInt(this.state.total/(this.state.pageSize + 1),10);
        let pagination = {
            total: this.state.total+page,
            // total:1601,
            current: this.state.current,
            pageSize: this.state.pageSize + 1,
            showTotal: this.showTotal.bind(this),
            onChange: this.page_up.bind(this)
        }
        const table_props = {
            columns: this.props.page_type==="cashloan"||this.props.page_type==="zyzj"?this.columns_bmd:this.columns,
            dataSource: this.state.data,
            pagination: pagination,
            footer: () => this.state.totalDes,
            loading: this.state.loading,
        }
        const footer = [
            <Button key="submit" type="primary" loading={this.state.pre_pay.loading} onClick={() => { this.pre_pay(2) }}>确认还款</Button>
        ]

        // 弹窗参数
        const prePay_props = {
            visible: this.state.pre_pay.show,
            title: "提前还款确认单",
            onCancel: () => { this.set_pre_pay(false) },
            footer: footer,
            className: "pay-plan"
        }
        const table={
            filter:{
                "data-get":this.get_filter.bind(this),
                "data-source":this.props.page_type==="cashloan"||this.props.page_type==="zyzj"?this.filter_bmd:this.filter,
                "data-set":this.set_filter.bind(this),
                "loanPeriod":this.state.loanPeriod,
                "merchantName":this.state.merchantName,
                "productName":this.state.productName,
                "data-paths":this.props.path,
                time:[moment().subtract(1, "weeks"), moment()]
            },
            tableInfo:table_props,
            tableTitle:{
                left:<span>
                    金额单位：元 
                </span>,
                right:<span>
                    {this.props.page_type==="cashloan"||this.props.page_type==="zyzj"?null:
                    <div className="text-right" style={{ marginBottom: "10px" }}>
                        <Permissions type="primary" onClick={(e) => (this.export_result())} server={this.props.page_type==="cashloan"||this.props.page_type==="zyzj"?global.AUTHSERVER.loan.key:global.AUTHSERVER.loanmanage.key} permissions={this.props.page_type==="cashloan"||this.props.page_type==="zyzj"?global.AUTHSERVER.loan.access[this.type[this.props.page_type].export]:global.AUTHSERVER.loanmanage.access[this.type[this.props.page_type].export]} tag="button">导出</Permissions>
                    </div>
                    }
                </span>
            },
            // isFilter:true
        }
        return (
            <div className="Component-body">
                <List {...table} />
                {/* <Filter data-set={this.set_filter.bind(this)} data-get={this.get_filter.bind(this)} data-source={this.filter} loanPeriod={this.state.loanPeriod} merchantName={this.state.merchantName} productName={this.state.productName} />
                <Row className="table-content">
                    {this.props.page_type==="cashloan"||this.props.page_type==="zyzj"?null:<div className="text-right" style={{ marginBottom: "10px" }}>
                        <Button type="primary" onClick={(e) => (this.export_result())}>导出</Button>
                    </div>}
                    <Table {...table_props} bordered />
                </Row> */}

                <Modal {...prePay_props}>
                    <Row>
                        <Col span={6}>
                            <div className="key">订单编号:</div>
                        </Col>
                        <Col span={16} offset={2}>
                            <div className="value">{this.state.pre_pay.domainNo}</div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <div className="key">提前还款日期:</div>
                        </Col>
                        <Col span={16} offset={2} className="value">
                            <DatePicker value={this.state.dateValue} disabledDate={this.disabledDate} placeholder="输入提前还款日期" onChange={(moment, str) => { this.dateChange(str) }} />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <div className="key">提前还款本息合计:</div>
                        </Col>
                        <Col span={16} offset={2}>
                            <div className="value">{this.state.pre_pay.total_money.money()}</div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={2}>
                            <div className="key">其中:</div>
                        </Col>
                        <Col span={4}>
                            <div className="key">应还本金合计:</div>
                        </Col>
                        <Col span={14} offset={2} className="value">
                            <div className="value">{this.state.pre_pay.total_principal.money()}</div>
                        </Col>
                        <Col span={6}>
                            <div className="key">应还利息合计:</div>
                        </Col>
                        <Col span={14} offset={2} className="value">
                            <div className="value">{this.state.pre_pay.total_interest.money()}</div>
                        </Col>
                        <Col span={6}>
                            <div className="key">应还其他费用合计:</div>
                        </Col>
                        <Col span={14} offset={2} className="value">
                            <div className="value">{this.state.pre_pay.total_otherFee.money()}</div>
                        </Col>
                        <Col span={6}>
                            <div className="key">应还服务费合计:</div>
                        </Col>
                        <Col span={14} offset={2} className="value">
                            <div className="value">{this.state.pre_pay.total_serviceFee.money()}</div>
                        </Col>
                        <Col span={6}>
                            <div className="key">应还逾期罚息合计:</div>
                        </Col>
                        <Col span={14} offset={2} className="value">
                            <div className="value">{this.state.pre_pay.total_overdueFee.money()}</div>
                        </Col>
                        <Col span={6}>
                            <div className="key">应还提前还款违约金:</div>
                        </Col>
                        <Col span={14} offset={2} className="value">
                            <div className="value">{this.state.pre_pay.total_penaltyFee.money()}</div>
                        </Col>
                    </Row>
                </Modal>
                <style>{`
                    .pay-plan .ant-model-body{
                        font-size:14px;
                    }
                    .pay-plan div.key{
                        line-height: 40px;
                        text-align: right;
                    }
                    .pay-plan div.value{
                        line-height: 40px;
                        text-align: left;
                    }
                    .pay-plan div.ant-modal-title,.pay-plan div.ant-modal-footer{
                        text-align:center
                    }
                `}</style>
            </div>
        )
    }
}

export default Page;