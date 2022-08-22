import React, { Component } from 'react';
import { Row, Col, Modal, Button, Input, message, Select, DatePicker, Form } from 'antd';
import moment from 'moment'

// import Filter from '../../ui/Filter';
import { axios_repay, axios_xjd, axios_loan } from '../../../ajax/request'
import { under_repay_plan, under_repay_plan_total, under_repay_plan_select_total, under_repay_total_confirm, repay, under_repay_export, under_repay_plan_all_total, bmd_repay_discount_confirm, under_repay_plan_bmd, repay_plan_bmd_select_product, repay_plan_bmd_select_merchant, under_repay_total_bmd } from '../../../ajax/api';
import { page, under_repay_status_select, host_repay, repay_status_select_map } from '../../../ajax/config';
import { format_table_data, format_date, bmd } from '../../../ajax/tool';
import Permissions from '../../../templates/Permissions';
import Fee from '../elements/discountFee';
import List from '../../templates/list';
import ListBtn from '../../templates/listBtn';

const Option = Select.Option;
const FormItem = Form.Item;

class Page extends Component {
    constructor(props) {
        super(props);
        let endDate = moment();
        let day = endDate.date();
        if (day <= 10) {
            endDate.date(10);
        } else if (day > 10 && day <= 20) {
            endDate.date(20);
        } else {
            endDate.add(1, "month");
            endDate.date(10);
        }
        this.state = {
            selectedRowKeys: [],
            selectedRows: [],
            loading: false,
            totalDes: "",
            total: 1,
            current: 1,
            filter: this.props.page_type === "cashloan" || this.props.page_type === "zyzj"||this.props.page_type==="bl" ? {
                startDate:moment().format("YYYY-MM-DD")+" 00:00:00",
                endDate:moment().add(6, "day").format("YYYY-MM-DD")+" 23:59:59"
            } : {
                repay_start_date: moment().add(-1, "years").format("YYYY-MM-DD"),
                repay_end_date: (props.page_type === "hs" ? endDate.format("YYYY-MM-DD") : moment().add(1, "month").format("YYYY-MM-DD"))
            },
            remark: "",
            selectValue: "",
            repay_date: undefined,
            pageSize: page.size,
            data: [],
            total_info: {
                amount: 0
            },
            nowPage: 1,
            pre_pay: {
                value: '',
                total_money: 0,
                total_principal: 0,
                total_interest: 0,
                total_defautInterest: 0,
                total_serviceCharge: 0,
                total_overdueFee: 0,
                show: false,
                ids: [],
                loading: false
            },
            totalMoney: 0,
            fee_orderNo: "",   //白猫贷减免
            fee_period: "",    //白猫贷减免
            productName: [],
            merchantName: [],
        };
        this.type = {
            zzb: {
                detail: "zzb_contract_detail",
                export: "zzb_under_repay_export",
                repay: "zzb_repay",
                repayBatch: "zzb_repay_batch"
            },
            hs: {
                detail: "hs_contract_detail",
                export: "hs_under_repay_export",
                repay: "hs_repay",
                repayBatch: "hs_repay_batch"
            },
            ygd: {
                detail: "ygd_contract_detail",
                export: "ygd_under_repay_export",
                repay: "ygd_repay",
                repayBatch: "ygd_repay_batch"
            },
            jyd: {
                detail: "jyd_contract_detail",
                export: "jyd_under_repay_export",
                repay: "jyd_repay",
                repayBatch: "jyd_repay_batch"
            },
            gyl: {
                new:true,
                domain: "bmd-gongyinglian",
                detail: "bmd-gongyinglian_contract_detail",
                export: "bmd-gongyinglian_under_repay_export",
                repay: "bmd-gongyinglian_repay",
                repayBatch: "bmd-gongyinglian_repay_batch"
            },
            fdd: {
                detail: "fdd_contract_detail",
                export: "fdd_under_repay_export",
                repay: "fdd_repay",
                repayBatch: "fdd_repay_batch"
            },
            cashcoop: {
                detail: "bmd_offine_contract_detail",
                export: "bmd_offine_under_repay_export",
                repay: "bmd_offine_repay",
                repayBatch: "bmd_offine_repay_batch"
            },
            loancoop_online: {
                detail: "bmd_online_contract_detail",
                export: "bmd_online_under_repay_export",
                repay: "bmd_online_repay",
                repayBatch: "bmd_online_repay_batch"
            },
            cashcoop_daiyunying: {
                detail: "lsdk_contract_detail",
                export: "lsdk_under_repay_export",
                repay: "lsdk_repay",
                repayBatch: "lsdk_repay_batch"
            },
            zyzj: {
                new:true,
                domain:"bmd-loancoop-capital",
                detail: "",
                export: ""
            },
            bl: {
                new:true,
                domain:"bmd-loancoop-capital",
                detail: "",
                export: ""
            },
            cashloan: {
                new:true,
                domain:"bmd-cashloan",
                detail: "",
                export: ""
            }
        }
        this.pageOptions = this.type[props.page_type];
    }

    componentWillMount() {
        this.columns = [
            {
                title: '序号',
                width: "50px",
                dataIndex: 'key',
                render: (text, record, index) => {
                    if (text === "合计") {
                        return text;
                    }
                    return `${index + 1}`
                }
            },
            {
                title: '订单编号',
                // width:"19%",
                dataIndex: 'domainNo'
            },
            {
                title: '期数',
                // width:"3%",
                dataIndex: 'phase'
            },
            {
                title: '应还款日期',
                // width:"5%",
                dataIndex: 'repayDate',
                render: e => {
                    if (this.props.page_type === "cashloan" || this.props.page_type === "zyzj"||this.props.page_type==="bl") {
                        var date = e ? e.split(" ")[0] : "--"
                        return date
                    } else {
                        return e
                    }
                },
                sorter: (a, b) => {
                    return bmd.getSort(a, b, "repayDate", true)
                }
            },
            {
                title: '借款方',
                dataIndex: 'borrowerName'
            },
            {
                title: '产品名称',
                // width:"4%",
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
                // width:"4%",
                // dataIndex: 'merchantName',
                render: e => {
                    if (e.key === "合计") {
                        return;
                    }
                    if (this.props.page_type === "cashloan" || this.props.page_type === "zyzj"||this.props.page_type==="bl") {
                        return e.cooperator || "--"
                    } else {
                        return e.merchantName || "--"
                    }
                }
            },
            {
                title: '应还本金',
                // width:"5%",
                dataIndex: "principal",
                render: data => {
                    return data ? bmd.money(data) : "--"
                },
                sorter: (a, b) => {
                    return bmd.getSort(a, b, "principal")
                }
            },
            {
                title: '应还利息',
                // width:"5%",
                dataIndex: "interest",
                render: data => {
                    return data ? bmd.money(data) : "--"
                },
                sorter: (a, b) => {
                    return bmd.getSort(a, b, "interest")
                }
            },
            {
                title: '应还服务费',
                // width:"5%",
                dataIndex: "serviceFee",
                render: data => {
                    return data ? bmd.money(data) : "--"
                },
                sorter: (a, b) => {
                    return bmd.getSort(a, b, "serviceFee")
                }
            },
            {
                title: '应还其他费用',
                // width:"5%",
                dataIndex: "otherFee",
                render: data => {
                    return data ? bmd.money(data) : "--"
                },
                sorter: (a, b) => {
                    return bmd.getSort(a, b, "otherFee")
                }
            },
            {
                title: '应还逾期罚息',
                // width:"5%",
                dataIndex: "overdueFee",
                render: data => {
                    return data ? bmd.money(data) : "--"
                },
                sorter: (a, b) => {
                    return bmd.getSort(a, b, "overdueFee")
                }
            },
            {
                title: '应还合计',
                // width:"5%",
                render: data => {
                    if (this.props.page_type === "cashloan" || this.props.page_type === "zyzj"||this.props.page_type==="bl") {
                        var val = data.principal + data.interest + data.serviceFee + data.otherFee;
                        return val.money()
                    } else {
                        return bmd.money(data.needPayMoney)
                    }
                }
            },
            {
                title: '还款状态',
                // width:"8%",
                render: (data) => {
                    if (data.key === "合计") {
                        return;
                    }
                    if (this.props.page_type === "cashloan" || this.props.page_type === "zyzj"||this.props.page_type==="bl") {
                        return repay_status_select_map[data.status]
                    } else {
                        if (data.repayStatus === 2) {
                            return <span className="text-danger">{data.repayStatusStr}</span>
                        }
                        return data.repayStatusStr || "--"
                    }

                }
            },
            {
                title: '操作',
                // fixed:"right",
                // width:170,
                render: (data) => {
                    if (this.props.page_type === "cashloan" || this.props.page_type === "zyzj"||this.props.page_type==="bl") {
                        return <Permissions size="small" onClick={() => { this.get_detail(data) }} server={this.props.page_type === "cashloan" || this.props.page_type === "zyzj"||this.props.page_type==="bl" ? global.AUTHSERVER.loan.key : global.AUTHSERVER.loanmanage.key} permissions={this.props.page_type === "cashloan" || this.props.page_type === "zyzj"||this.props.page_type==="bl" ? global.AUTHSERVER.loan.access[this.type[this.props.page_type].detail] : global.AUTHSERVER.loanmanage.access[this.type[this.props.page_type].detail]} tag="button" src={"/hk/under/"+ this.props.page_type +"/detail?contract_no="+data.contractId}>查看</Permissions>
                    }
                    var btn = [];
                    if (data.repayStatus === 2) {
                        btn.push(<Permissions server={this.props.page_type === "cashloan" || this.props.page_type === "zyzj"||this.props.page_type==="bl" ? global.AUTHSERVER.loan.key : global.AUTHSERVER.loanmanage.key} permissions={this.props.page_type === "cashloan" || this.props.page_type === "zyzj"||this.props.page_type==="bl" ? global.AUTHSERVER.loan.access[this.type[this.props.page_type].repay] : global.AUTHSERVER.loanmanage.access[this.type[this.props.page_type].repay]} tag="button" type="primary" size="small" onClick={() => (this.batch_pay(data))}>还款确认</Permissions>)
                    }
                    // if(this.props.page_type==="cashloan"&&data.key!=="合计"){
                    //     btn.push(<Permissions server={global.AUTHSERVER.loan.key} permissions={global.AUTHSERVER.loan.access.repayConfirm} tag="button" type="primary" size="small" onClick={()=>(this.discount_fee(data))}>减免</Permissions>)
                    // }
                    btn.push(<Permissions size="small" onClick={() => { this.get_detail(data) }} server={this.props.page_type === "cashloan" || this.props.page_type === "zyzj"||this.props.page_type==="bl" ? global.AUTHSERVER.loan.key : global.AUTHSERVER.loanmanage.key} permissions={this.props.page_type === "cashloan" || this.props.page_type === "zyzj"||this.props.page_type==="bl" ? global.AUTHSERVER.loan.access[this.type[this.props.page_type].detail] : global.AUTHSERVER.loanmanage.access[this.type[this.props.page_type].detail]} tag="button" src={"/hk/under/"+ this.props.page_type +"/detail?contract_no="+data.contractId}>查看</Permissions>);
                    return data.key !== "合计" ? <ListBtn btn={btn} /> : ""

                }


            }
        ]
        this.columns_bmd = [
            {
                title: '序号',
                width: "50px",
                dataIndex: 'key',
                render: (text, record, index) => {
                    if (text === "合计") {
                        return text;
                    }
                    return `${index + 1}`
                }
            },
            {
                title: '订单编号',
                // width:"19%",
                dataIndex: 'domainNo'
            },
            {
                title: '期数',
                // width:"3%",
                dataIndex: 'phase'
            },
            {
                title: '应还款日期',
                // width:"5%",
                dataIndex: 'repayDate',
                render: e => {
                    if (this.props.page_type === "cashloan" || this.props.page_type === "zyzj"||this.props.page_type==="bl") {
                        var date = e ? e.split(" ")[0] : "--"
                        return date
                    } else {
                        return e
                    }
                },
                sorter: (a, b) => {
                    return bmd.getSort(a, b, "repayDate", true)
                }
            },
            {
                title: '借款方',
                dataIndex: 'borrowerName'
            },
            {
                title: '产品名称',
                // width:"4%",
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
                // width:"4%",
                // dataIndex: 'merchantName',
                render: e => {
                    if (e.key === "合计") {
                        return;
                    }
                    if (this.props.page_type === "cashloan" || this.props.page_type === "zyzj"||this.props.page_type==="bl") {
                        return e.cooperator || "--"
                    } else {
                        return e.merchantName || "--"
                    }
                }
            },
            {
                title: '应还本金',
                // width:"5%",
                dataIndex: "principal",
                render: data => {
                    return data ? bmd.money(data) : "--"
                },
                sorter: (a, b) => {
                    return bmd.getSort(a, b, "principal")
                }
            },
            {
                title: '应还利息',
                // width:"5%",
                dataIndex: "interest",
                render: data => {
                    return data ? bmd.money(data) : "--"
                },
                sorter: (a, b) => {
                    return bmd.getSort(a, b, "interest")
                }
            },
            {
                title: '应还服务费',
                // width:"5%",
                dataIndex: "serviceFee",
                render: data => {
                    return data ? bmd.money(data) : "--"
                },
                sorter: (a, b) => {
                    return bmd.getSort(a, b, "serviceFee")
                }
            },
            {
                title: '应还其他费用',
                // width:"5%",
                dataIndex: "otherFee",
                render: data => {
                    return data ? bmd.money(data) : "--"
                },
                sorter: (a, b) => {
                    return bmd.getSort(a, b, "otherFee")
                }
            },
            {
                title: '应还合计',
                // width:"5%",
                render: data => {
                    if (this.props.page_type === "cashloan" || this.props.page_type === "zyzj"||this.props.page_type==="bl") {
                        var val = data.principal + data.interest + data.serviceFee + data.otherFee;
                        return val.money()
                    } else {
                        return bmd.money(data.needPayMoney)
                    }
                }
            },
            {
                title: '还款状态',
                // width:"8%",
                // dataIndex:"manageRpStatus",
                render:(data)=>{
                    if(data.key==="合计"){
                        return;
                    }
                    var type={
                        100:"当期待还款",
                        160:"当期逾期未还",
                        810:"当期提前结清",
                        830:"当期正常结清",
                        860:"当期逾期结清"
                    }
                    return type[data.manageRpStatus]||"--"
                    
                }
            },
            {
                title: '是否还款中',
                // width:"8%",
                // dataIndex:"processStatus",
                render:(data)=>{
                    if(data.key==="合计"){
                        return;
                    }
                    var type={
                        100:"是",
                        0:"否"
                    }
                    return type[data.processStatus]||"--"
                    
                }
            },
            {
                title: '操作',
                // fixed:"right",
                // width:170,
                render: (data) => {
                    if (this.props.page_type === "cashloan" || this.props.page_type === "zyzj"||this.props.page_type==="bl") {
                        return <Permissions size="small" onClick={() => { this.get_detail(data) }} server={this.props.page_type === "cashloan" || this.props.page_type === "zyzj"||this.props.page_type==="bl" ? global.AUTHSERVER.loan.key : global.AUTHSERVER.loanmanage.key} permissions={this.props.page_type === "cashloan" || this.props.page_type === "zyzj"||this.props.page_type==="bl" ? global.AUTHSERVER.loan.access[this.type[this.props.page_type].detail] : global.AUTHSERVER.loanmanage.access[this.type[this.props.page_type].detail]} tag="button">查看</Permissions>
                    }

                }


            }
        ]
        let pay_status = under_repay_status_select;
        pay_status.unshift({
            name: "全部", val: ""
        })
        this.filter = {
            time: {
                name: "还款日期",
                type: "range_date_notime",
                feild_s: "repay_start_date",
                feild_e: "repay_end_date",
                default: [moment().subtract(1, "days"), moment()],
                placeHolder: ['开始日期', "结束日期"]
            },
            borrower: {
                name: "借款方",
                type: "text",
                placeHolder: "请输入借款方"
            },
            "--": {
                name: "",
                type: "blank"
            },
            status: {
                name: "还款状态",
                type: "select",
                placeHolder: "全部",
                values: pay_status
            },
            domain_no: {
                name: "订单编号",
                type: "text",
                placeHolder: "请输入订单编号"
            }
        }
        this.form_init_data = {
            repay_order_no: "",
            date: undefined,
            remark: "",
            repay_type: undefined
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
                values: "merchantName",
            },
            time: {
                name: "还款时间",
                type: "range_date",
                placeHolder: ["开始时间", "结束时间11"],
                feild_s: "startDate",
                feild_e: "endDate",
                default: [moment(), moment().add(6, "days")],
            },
            manageRpStatus: {
                name: "还款状态",
                type: "select",
                placeHolder: "全部",
                values:[{val:100,name:"当期待还款"},{val:160,name:"当期逾期未还款"},{val:810,name:"当期提前还款"},{val:830,name:"当期正常还款"},{val:860,name:"当期逾期还款"}]
            },
            processStatus: {
                name: "是否还款中",
                type: "select",
                // all:"hidden",
                // placeHolder: "全部",
                values:[{val:100,name:"是"},{val:0,name:"否"}]
            }
        }

    }
    componentDidMount() {
        if (this.props.page_type === "cashloan" || this.props.page_type === "zyzj"||this.props.page_type==="bl") {
            this.get_select();
        }
        var select = window.localStorage.getItem(this.props.path);
        if(select&&JSON.parse(select).isRember){
            var params=JSON.parse(select).remberData;
            if(this.props.page_type==="cashloan"||this.props.page_type==="zyzj"||this.props.page_type==="bl"){
                if(!params.startDate){
                    params.startDate=moment().subtract(1,"weeks").format("YYYY-MM-DD")+" 00:00:00";
                    params.endDate=moment().format("YYYY-MM-DD")+" 23:59:59";
                }
                this.get_list(1,params);
            }else{
                this.get_list(1,params);
            }
        }else{
            this.get_list(1,this.state.filter);
        }
    }
    get_detail(data){
        if(this.props.page_type==="cashloan"||this.props.page_type==="zyzj"||this.props.page_type==="bl"){
            bmd.navigate("/hk/under/"+ this.props.page_type +"/detail?contract_no="+data.contractNo+"&type="+this.props.page_type+"&appKey="+data.appKey)
        }else{
            bmd.navigate("/hk/under/"+ this.props.page_type +"/detail?contract_no="+data.contractId)
        }
    }
    get_list(page_no, filter = {}) {
        let data = JSON.parse(JSON.stringify(filter));
        data.page = page_no || 1;
        data.size = page.size;
        this.setState({
            loading: true,
            selectedRowKeys: [],
            selectedRows: []
        });
        data.bkSubject=this.props.bkSubject||"";
        // 业务配置
        if (this.pageOptions.new) {
            data.domain = this.pageOptions.domain;
            data.onlyUnRepay = true;
            axios_loan.post(under_repay_plan_bmd, data).then((data) => {
                let list = data.data.list;
                if(list){
                    this.setState({
                        data: format_table_data(list, page_no, page.size),
                        loading: false,
                        totalDes: "",
                        total: data.data.total,
                        current: data.data.current
                    })
                    if (list.length > 0) this.get_total_bmd(filter);
                }else{
                    this.setState({
                        loading: false,
                    });
                }
                
            });
        } else {
            data.product_line = this.props.page_type;
            axios_repay.post(under_repay_plan, data).then((data) => {
                let list = data.data;
                this.setState({
                    data: format_table_data(list, page_no, page.size),
                    loading: false,
                    totalDes: "",
                    total: data.total,
                    current: data.current
                })
                if (list.length > 0) this.get_total(filter);
            });
        }

    }
    // 获取下拉菜单
    get_select() {
        var data = { domain:this.pageOptions.domain };
        axios_loan.post(repay_plan_bmd_select_product, data).then((data) => {
            let list = data.data, product = [];
            for (var i in list) {
                var tem = {
                    val: list[i],
                    name: list[i]
                }
                product.push(tem)
            }
            console.log(product)
            this.setState({
                productName: product
            })
        });
        axios_loan.post(repay_plan_bmd_select_merchant, data).then((data) => {
            let list = data.data, merchant = [];
            for (var i in list) {
                var tems = {
                    val: list[i],
                    name: list[i]
                }
                merchant.push(tems)
            }
            this.setState({
                merchantName: merchant
            })
        });

    }
    // 获取全部统计数据
    get_total(filter = {}) {
        let data = {
            product_line: this.props.page_type,
            bkSubject:this.props.bkSubject||"",
            ...filter
        }
        axios_repay.post(under_repay_plan_total, data).then((data) => {
            let info = data.data;
            for (let d in this.state.data[0]) {
                info[d] = info[d] ? info[d] : ""
            }
            info.key = "合计";
            let temp = JSON.parse(JSON.stringify(this.state.data));
            temp.push(info);
            this.setState({
                data: temp,
                totalDes: "此合计是当前查询结果的合计",
                total_info: info
            })
        })
    }
    get_total_bmd(filter) {
        if (this.props.page_type === "zyzj"||this.props.page_type==="bl") {
            filter.domain = "bmd-loancoop-capital";
        } else {
            filter.domain = "bmd-cashloan";
        }
        filter.onlyUnRepay = true;
        filter.bkSubject=this.props.bkSubject||"";
        axios_loan.post(under_repay_total_bmd, filter).then(data => {
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
        let filter = {};
        for (let d in data) {
            filter[data[d].key] = data[d].value
        }
        this.setState({
            filter: filter
        })
        this.get_list(1, filter);
    }
    set_filter() {
        if(this.props.page_type === "cashloan" || this.props.page_type === "zyzj"||this.props.page_type==="bl"){
            return [{ key: "time", value: [moment(this.state.filter.startDate), moment(this.state.filter.endDate)] }]
        }else{
            return [{ key: "time", value: [moment(this.state.filter.repay_start_date), moment(this.state.filter.repay_end_date)] }]
        }
    }
    // 导出数据
    export_list() {
        let filter = this.state.filter;
        let filterStr = [];
        for (let f in filter) {
            filterStr.push(f + '=' + filter[f])
        }
        filterStr.push("product_line=" + this.props.page_type)
        let url = host_repay + under_repay_export + "?" + filterStr.join("&");
        window.open(url);
    }
    
    set_pre_pay(config, init = true) {
        this.setState({
            pre_pay: config
        })
        if (init) {
            this.props.form.setFieldsValue(this.form_init_data);
        }
    }
    // 勾选数据确认还款
    pre_pay(repay_info) {
        let rqd = {
            repay_info: JSON.stringify(repay_info),
            contract_and_phase: JSON.stringify(this.state.pre_pay.ids)
        }
        axios_repay.post(repay, rqd).then((data) => {
            this.get_list(this.state.nowPage, this.state.filter);
            this.get_total(this.state.filter);
            message.success(data.msg);
            this.modal_hide();
        })
    }
    // 全部数据确认还款
    pay_all(repay_info) {
        let data = {
            ...this.state.filter,
            product_line: this.props.page_type,
            repay_info: JSON.stringify(repay_info)
        }
        axios_repay.post(under_repay_total_confirm, data).then((data) => {
            this.get_list(this.state.nowPage, this.state.filter);
            this.get_total(this.state.filter);
            message.success(data.msg);
            this.modal_hide()
        })
    }
    // 显示确认弹窗
    batch_pay(data) {
        let datas = data ? [data] : this.state.selectedRows;
        if (datas.length <= 0) {
            message.warn("请选择订单");
            return;
        }
        let ids = [];
        for (let d in datas) {
            ids.push({ domain_no: datas[d].domainNo, domain_name: datas[d].domainName, phase: datas[d].phase });
        }
        this.select_total_get(ids);
    }
    // 获取勾选数据统计数据
    select_total_get(ids, date) {
        let rqd = {
            contract_and_phase: JSON.stringify(ids),
            repay_date: format_date(moment(date))
        }
        axios_repay.post(under_repay_plan_select_total, rqd).then(data => {
            let info = data.data;
            let config = {
                ids: ids,
                discountInterestFee: info.discountInterestFee,
                discountServiceFee: info.discountServiceFee,
                discountOtherFee: info.discountOtherFee,
                discountOverdueFee: info.discountOverdueFee,
                discountPenaltyFee: info.discountPenaltyFee,
                total_money: info.amount,
                total_principal: info.principal,
                total_interest: info.interest,
                total_defautInterest: info.otherFee,
                total_serviceCharge: info.serviceFee,
                total_overdueFee: info.overdueFee,
                value: `${info.unPayCount}笔（正常${info.normalCount || "0"}笔；逾期${info.overdueCount || "0"}笔）`,
                type: "list",
                loading: false,
                show: true
            }
            this.set_pre_pay(config, date ? false : true);
        })
    }

    total_pay() {
        let filter = this.state.filter;
        let data = {
            product_line: this.props.page_type,
            ...filter
        }
        axios_repay.post(under_repay_plan_all_total, data).then(res => {
            if (!res.data.amount) {
                message.warn("当前无需还款");
                return;
            }
            let total_info = res.data;
            let count = total_info.unPayCount + total_info.overdueCount;
            let config = {
                discountInterestFee: total_info.discountInterestFee,
                discountServiceFee: total_info.discountServiceFee,
                discountOtherFee: total_info.discountOtherFee,
                discountOverdueFee: total_info.discountOverdueFee,
                discountPenaltyFee: total_info.discountPenaltyFee,
                total_money: total_info.amount,
                total_principal: total_info.principal,
                total_interest: total_info.interest,
                total_defautInterest: total_info.otherFee,
                total_serviceCharge: total_info.serviceFee,
                total_overdueFee: total_info.overdueFee,
                value: `${count}笔（正常${total_info.unPayCount || "0"}笔；逾期${total_info.overdueCount || "0"}笔）`,
                type: "total",
                loading: false,
                show: true
            }
            this.set_pre_pay(config);
        })
    }

    // 提交表单
    pay_confirm() {
        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }
            let info = JSON.parse(JSON.stringify(this.state.pre_pay));
            info.loading = true;
            this.setState({
                pre_pay: info
            })
            let form_data = values;
            form_data.date = form_data.date.format("YYYY-MM-DD");
            let repay_info = {
                "repayType": form_data.repay_type,
                "repayOrderNo": form_data.repay_order_no,  // 没有用 向凯大哥说都传一样的
                "repayDate": form_data.date,
                "confirmRepayDate": form_data.date,  // 没有用 向凯大哥说都传一样的
                "accountName": "",                   // 没有用 向凯大哥说都传空的
                "remark": form_data.remark,
                "amount": info.total_money,
                "discountInterestFee": info.discountInterestFee,
                "discountServiceFee": info.discountServiceFee,
                "discountOtherFee": info.discountOtherFee,
                "discountOverdueFee": info.discountOverdueFee,
                "discountPenaltyFee": info.discountPenaltyFee
            }
            if (this.state.pre_pay.type === "list") {
                this.pre_pay(repay_info)
            } else {
                this.pay_all(repay_info)
            }
        });
    }
    detail(id) {
        window.open('/zf/pay/hs/detail?id=' + id)
    }
    // 隐藏弹窗
    modal_hide() {
        let init_data = {
            ids: [],
            discountInterestFee: 0,
            discountServiceFee: 0,
            discountOtherFee: 0,
            discountOverdueFee: 0,
            discountPenaltyFee: 0,
            total_money: 0,
            total_principal: 0,
            total_interest: 0,
            total_defautInterest: 0,
            total_serviceCharge: 0,
            total_overdueFee: 0,
            value: `0笔（正常0笔；逾期0笔）`,
            type: "list",
            loading: false,
            show: false
        }
        this.setState({
            pre_pay: init_data
        })
    }
    // 改变还款日期
    repay_date_change(date, str) {
        if (this.state.pre_pay.type === "total") {
            // this.total_pay(str)
            return;
        }
        let ids = this.state.pre_pay.ids;
        this.select_total_get(ids, str);
    }
    textChange(e) {
        let value = e.target.value;
        if (value.length > 100) {
            message.warn("流水号最大长度不超过100", 3);
            value = value.slice(0, 100)
        }
        let key = e.target.getAttribute("data-key");
        this.setState({
            [key]: value
        })
    }
    selectChange(val) {
        this.setState({
            selectValue: val
        })
    }
    dateChange(val, valStr) {
        this.setState({
            repay_date: val
        })
    }
    page_up(page, pageSize) {
        window.scrollTo(0, 0);
        this.setState({
            nowPage: page
        })
        this.get_list(page, this.state.filter);
    }
    showTotal() {
        return `共${this.state.total}条数据`
    }
    //白猫贷减免
    ref_fee(e) {
        this.fee_child = e
    }
    discount_fee(data) {
        this.setState({
            discount_fee: true,
            fee_orderNo: data.domainNo,
            fee_period: data.phase
        })
        setTimeout(() => {
            this.fee_child.discount_fee_info();
        }, 10)

    }
    fee_save() {
        var param = this.fee_child.get_val();
        if (!param) {
            return;
        }
        param.orderNo = this.state.fee_orderNo;
        param.period = this.state.fee_period;
        axios_xjd.post(bmd_repay_discount_confirm, param).then(e => {
            if (!e.code) {
                message.success("减免成功");
                this.fee_cancel();
            }
        })

    }
    fee_cancel() {

        this.fee_child.props.form.setFieldsValue({ "interestMoney": "0", "interestDay": "" })
        this.fee_child.props.form.setFieldsValue({ "serviceFeeMoney": "0", "serviceFeeDay": "" })
        this.fee_child.props.form.setFieldsValue({ "overdueFeeMoney": "0", "overdueFeeDay": "" })
        this.fee_child.props.form.setFieldsValue({ "penaltyFeeMoney": "0" })
        this.fee_child.setState({
            discountInterest: "0.00",
            discountServiceFee: "0.00",
            discountOverdueFee: "0.00",
            discountPenaltyFee: "0.00",
            discountInterest_num: "0.00",
            discountServiceFee_num: "0.00",
            discountOverdueFee_num: "0.00",
            discountPenaltyFee_num: "0.00",
            data: {
                principal: 0,
                interest: 0,
                serviceFee: 0,
                overdueFee: 0,
                penaltyFee: 0
            },
            total: "0.00",
            value_serviceFee: 1,
            value_overdueFee: 1,
            value_penaltyFee: 1,
            value: 1,
        })
        this.setState({
            discount_fee: false
        })
    }
    render() {
        const { selectedRowKeys } = this.state;
        const { getFieldDecorator } = this.props.form;
        var page = parseInt(this.state.total / (this.state.pageSize + 1), 10);
        let pagination = {
            total: this.state.total + page,
            current: this.state.current,
            pageSize: this.state.pageSize + 1,
            showTotal: this.showTotal.bind(this),
            onChange: this.page_up.bind(this)
        }
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({ selectedRowKeys, selectedRows });
            },
            getCheckboxProps: record => ({
                disabled: record.key === '合计',
                name: record.name
            }),
        };
        // let table_height = window.innerHeight - 470;
        const table_props = {
            rowSelection: this.props.page_type === "cashloan" || this.props.page_type === "zyzj"||this.props.page_type==="bl" ?null:rowSelection,
            columns: this.props.page_type === "cashloan" || this.props.page_type === "zyzj"||this.props.page_type==="bl" ? this.columns_bmd : this.columns,
            // scroll:{x:1600,y:table_height},
            dataSource: this.state.data,
            pagination: pagination,
            loading: this.state.loading,
            footer: () => this.state.totalDes
        }
        const footer = [
            <Button key="submit" type="primary" loading={this.state.pre_pay.loading} onClick={this.pay_confirm.bind(this)}>确认还款</Button>
        ]
        const payConfirm_props = {
            visible: this.state.pre_pay.show,
            title: "还款确认单",
            // onOk : this.handleOk.bind(this), 
            onCancel: this.modal_hide.bind(this),
            footer: footer,
            className: "pay-plan",
            maskClosable: false
        }
        const fee = {
            title: "减免确认单",
            visible: this.state.discount_fee,
            footer: <Button type="primary" onClick={this.fee_save.bind(this)}>确认</Button>,
            onCancel: this.fee_cancel.bind(this),
            width: 900,
            maskClosable: false
        }
        const table = {
            filter: {
                "data-get": this.get_filter.bind(this),
                "data-source": this.props.page_type === "cashloan" || this.props.page_type === "zyzj"||this.props.page_type==="bl" ? this.filter_bmd : this.filter,
                "data-set": this.set_filter.bind(this),
                "merchantName": this.state.merchantName,
                "productName": this.state.productName,
                "data-paths": this.props.path,
                "manageRpStatus":"160",
                time:this.props.page_type === "cashloan" || this.props.page_type === "zyzj"||this.props.page_type==="bl" ?[moment().subtract(1, "weeks"), moment()]:[moment().subtract(1, "weeks"), moment()]
            },
            tableInfo: table_props,
            tableTitle: {
                left: <span>
                    金额单位：元
                </span>,
                right: <span>{
                    this.props.page_type === "cashloan" || this.props.page_type === "zyzj"||this.props.page_type==="bl" ? null : <div>
                        <Permissions type="primary" onClick={(e) => (this.batch_pay())} server={this.props.page_type === "cashloan" || this.props.page_type === "zyzj"||this.props.page_type==="bl" ? global.AUTHSERVER.loan.key : global.AUTHSERVER.loanmanage.key} permissions={this.props.page_type === "cashloan" || this.props.page_type === "zyzj"||this.props.page_type==="bl" ? global.AUTHSERVER.loan.access[this.type[this.props.page_type].repay] : global.AUTHSERVER.loanmanage.access[this.type[this.props.page_type].repay]} tag="button">勾选数据批量还款</Permissions>&emsp;
                    <Permissions type="primary" onClick={(e) => (this.total_pay())} server={this.props.page_type === "cashloan" || this.props.page_type === "zyzj"||this.props.page_type==="bl" ? global.AUTHSERVER.loan.key : global.AUTHSERVER.loanmanage.key} permissions={this.props.page_type === "cashloan" || this.props.page_type === "zyzj"||this.props.page_type==="bl" ? global.AUTHSERVER.loan.access[this.type[this.props.page_type].repayBatch] : global.AUTHSERVER.loanmanage.access[this.type[this.props.page_type].repayBatch]} tag="button">全部数据批量还款</Permissions>&emsp;
                    <Permissions type="primary" onClick={(e) => (this.export_list())} server={this.props.page_type === "cashloan" || this.props.page_type === "zyzj"||this.props.page_type==="bl" ? global.AUTHSERVER.loan.key : global.AUTHSERVER.loanmanage.key} permissions={this.props.page_type === "cashloan" || this.props.page_type === "zyzj"||this.props.page_type==="bl" ? global.AUTHSERVER.loan.access[this.type[this.props.page_type].export] : global.AUTHSERVER.loanmanage.access[this.type[this.props.page_type].export]} tag="button">导出</Permissions>
                    </div>
                }
                </span>
            },
            isFilter: true
        }

        return (
            <div className="Component-body">
                <List {...table} />
                {/* <Filter data-get={this.get_filter.bind(this)} data-set={this.set_filter.bind(this)} data-source={this.filter} />
                <Row className="table-content">
                    {this.props.page_type==="cashloan"?null:<div className="table-btns">
                        <div>
                            <Button type="primary" onClick={(e)=>(this.batch_pay())}>勾选数据批量还款</Button>&emsp;
                            <Button type="primary" onClick={(e)=>(this.total_pay())}>全部数据批量还款</Button>&emsp;
                        </div>
                        <div>
                            <Button type="primary" onClick={(e)=>(this.export_list())}>导出</Button>
                        </div>                        
                    </div>}
                    <Table {...table_props} bordered />
                </Row> */}

                <Modal {...payConfirm_props}>
                    <Row>
                        <Col span={8}>
                            <div className="key">本次还款笔数</div>
                        </Col>
                        <Col span={14} offset={2}>
                            <div className="value">{this.state.pre_pay.value}</div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <div className="key">本次应还款金额合计</div>
                        </Col>
                        <Col span={14} offset={2} className="value">
                            <div className="value">{this.state.pre_pay.total_money.money()}</div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={2}>
                            <div className="key">其中:</div>
                        </Col>
                        <Col span={6}>
                            <div className="key">应还本金合计:</div>
                        </Col>
                        <Col span={14} offset={2} className="value">
                            <div className="value">{this.state.pre_pay.total_principal.money()}</div>
                        </Col>
                        <Col span={8}>
                            <div className="key">应还利息合计:</div>
                        </Col>
                        <Col span={14} offset={2} className="value">
                            <div className="value">{this.state.pre_pay.total_interest.money()}</div>
                        </Col>
                        <Col span={8}>
                            <div className="key">应还其他费用合计:</div>
                        </Col>
                        <Col span={14} offset={2} className="value">
                            <div className="value">{this.state.pre_pay.total_defautInterest.money()}</div>
                        </Col>
                        <Col span={8}>
                            <div className="key">应还服务费合计:</div>
                        </Col>
                        <Col span={14} offset={2} className="value">
                            <div className="value">{this.state.pre_pay.total_serviceCharge.money()}</div>
                        </Col>
                        <Col span={8}>
                            <div className="key">应还逾期合计(优惠后):</div>
                        </Col>
                        <Col span={14} offset={2} className="value">
                            <div className="value">{this.state.pre_pay.total_overdueFee.money()}</div>
                        </Col>
                    </Row>
                    <Form>
                        <Row>
                            <Col span={8}>
                                <div className="key">还款日期:</div>
                            </Col>
                            <Col span={14} offset={2} className="value">
                                <FormItem>
                                    {getFieldDecorator("date", {
                                        rules: [{ required: true, message: '请选择日期' }]
                                    })(
                                        <DatePicker onChange={this.repay_date_change.bind(this)} />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <div className="key">收款流水号:</div>
                            </Col>
                            <Col span={14} offset={2} className="value">
                                <FormItem>
                                    {getFieldDecorator("repay_order_no", {
                                        rules: [{ required: true, message: "请输入流水号" }]
                                    })(
                                        <Input placeholder="输入收款流水号" />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <div className="key">还款来源:</div>
                            </Col>
                            <Col span={14} offset={2} className="value">
                                <FormItem>
                                    {getFieldDecorator("repay_type", {
                                        rules: [{ required: true, message: "选择还款来源" }]
                                    })(
                                        <Select placeholder="请选择还款来源">
                                            <Option value="连连">连连</Option>
                                            <Option value="宝付">宝付</Option>
                                            <Option value="中信基本户">中信基本户</Option>
                                            <Option value="微信">微信</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <div className="key">备注:</div>
                            </Col>
                            <Col span={14} offset={2} className="value">
                                <FormItem>
                                    {getFieldDecorator("remark")(
                                        <Input placeholder="输入备注" />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
                <Modal {...fee}>
                    <Fee orderNo={this.state.fee_orderNo} period={this.state.fee_period} onRef={this.ref_fee.bind(this)} />
                </Modal>
                <style>{`
                    .pay-plan {
                        font-size:14px;
                    }
                    .pay-plan .ant-form-item {
                        margin-bottom:10px;
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

export default Form.create()(Page);
