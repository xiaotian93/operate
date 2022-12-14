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
            fee_orderNo: "",   //???????????????
            fee_period: "",    //???????????????
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
                title: '??????',
                width: "50px",
                dataIndex: 'key',
                render: (text, record, index) => {
                    if (text === "??????") {
                        return text;
                    }
                    return `${index + 1}`
                }
            },
            {
                title: '????????????',
                // width:"19%",
                dataIndex: 'domainNo'
            },
            {
                title: '??????',
                // width:"3%",
                dataIndex: 'phase'
            },
            {
                title: '???????????????',
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
                title: '?????????',
                dataIndex: 'borrowerName'
            },
            {
                title: '????????????',
                // width:"4%",
                // dataIndex: 'productName',
                render: e => {
                    if (e.key === "??????") {
                        return;
                    }
                    return e.productName || "--"
                }
            },
            {
                title: '????????????',
                // width:"4%",
                // dataIndex: 'merchantName',
                render: e => {
                    if (e.key === "??????") {
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
                title: '????????????',
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
                title: '????????????',
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
                title: '???????????????',
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
                title: '??????????????????',
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
                title: '??????????????????',
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
                title: '????????????',
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
                title: '????????????',
                // width:"8%",
                render: (data) => {
                    if (data.key === "??????") {
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
                title: '??????',
                // fixed:"right",
                // width:170,
                render: (data) => {
                    if (this.props.page_type === "cashloan" || this.props.page_type === "zyzj"||this.props.page_type==="bl") {
                        return <Permissions size="small" onClick={() => { this.get_detail(data) }} server={this.props.page_type === "cashloan" || this.props.page_type === "zyzj"||this.props.page_type==="bl" ? global.AUTHSERVER.loan.key : global.AUTHSERVER.loanmanage.key} permissions={this.props.page_type === "cashloan" || this.props.page_type === "zyzj"||this.props.page_type==="bl" ? global.AUTHSERVER.loan.access[this.type[this.props.page_type].detail] : global.AUTHSERVER.loanmanage.access[this.type[this.props.page_type].detail]} tag="button" src={"/hk/under/"+ this.props.page_type +"/detail?contract_no="+data.contractId}>??????</Permissions>
                    }
                    var btn = [];
                    if (data.repayStatus === 2) {
                        btn.push(<Permissions server={this.props.page_type === "cashloan" || this.props.page_type === "zyzj"||this.props.page_type==="bl" ? global.AUTHSERVER.loan.key : global.AUTHSERVER.loanmanage.key} permissions={this.props.page_type === "cashloan" || this.props.page_type === "zyzj"||this.props.page_type==="bl" ? global.AUTHSERVER.loan.access[this.type[this.props.page_type].repay] : global.AUTHSERVER.loanmanage.access[this.type[this.props.page_type].repay]} tag="button" type="primary" size="small" onClick={() => (this.batch_pay(data))}>????????????</Permissions>)
                    }
                    // if(this.props.page_type==="cashloan"&&data.key!=="??????"){
                    //     btn.push(<Permissions server={global.AUTHSERVER.loan.key} permissions={global.AUTHSERVER.loan.access.repayConfirm} tag="button" type="primary" size="small" onClick={()=>(this.discount_fee(data))}>??????</Permissions>)
                    // }
                    btn.push(<Permissions size="small" onClick={() => { this.get_detail(data) }} server={this.props.page_type === "cashloan" || this.props.page_type === "zyzj"||this.props.page_type==="bl" ? global.AUTHSERVER.loan.key : global.AUTHSERVER.loanmanage.key} permissions={this.props.page_type === "cashloan" || this.props.page_type === "zyzj"||this.props.page_type==="bl" ? global.AUTHSERVER.loan.access[this.type[this.props.page_type].detail] : global.AUTHSERVER.loanmanage.access[this.type[this.props.page_type].detail]} tag="button" src={"/hk/under/"+ this.props.page_type +"/detail?contract_no="+data.contractId}>??????</Permissions>);
                    return data.key !== "??????" ? <ListBtn btn={btn} /> : ""

                }


            }
        ]
        this.columns_bmd = [
            {
                title: '??????',
                width: "50px",
                dataIndex: 'key',
                render: (text, record, index) => {
                    if (text === "??????") {
                        return text;
                    }
                    return `${index + 1}`
                }
            },
            {
                title: '????????????',
                // width:"19%",
                dataIndex: 'domainNo'
            },
            {
                title: '??????',
                // width:"3%",
                dataIndex: 'phase'
            },
            {
                title: '???????????????',
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
                title: '?????????',
                dataIndex: 'borrowerName'
            },
            {
                title: '????????????',
                // width:"4%",
                // dataIndex: 'productName',
                render: e => {
                    if (e.key === "??????") {
                        return;
                    }
                    return e.productName || "--"
                }
            },
            {
                title: '????????????',
                // width:"4%",
                // dataIndex: 'merchantName',
                render: e => {
                    if (e.key === "??????") {
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
                title: '????????????',
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
                title: '????????????',
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
                title: '???????????????',
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
                title: '??????????????????',
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
                title: '????????????',
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
                title: '????????????',
                // width:"8%",
                // dataIndex:"manageRpStatus",
                render:(data)=>{
                    if(data.key==="??????"){
                        return;
                    }
                    var type={
                        100:"???????????????",
                        160:"??????????????????",
                        810:"??????????????????",
                        830:"??????????????????",
                        860:"??????????????????"
                    }
                    return type[data.manageRpStatus]||"--"
                    
                }
            },
            {
                title: '???????????????',
                // width:"8%",
                // dataIndex:"processStatus",
                render:(data)=>{
                    if(data.key==="??????"){
                        return;
                    }
                    var type={
                        100:"???",
                        0:"???"
                    }
                    return type[data.processStatus]||"--"
                    
                }
            },
            {
                title: '??????',
                // fixed:"right",
                // width:170,
                render: (data) => {
                    if (this.props.page_type === "cashloan" || this.props.page_type === "zyzj"||this.props.page_type==="bl") {
                        return <Permissions size="small" onClick={() => { this.get_detail(data) }} server={this.props.page_type === "cashloan" || this.props.page_type === "zyzj"||this.props.page_type==="bl" ? global.AUTHSERVER.loan.key : global.AUTHSERVER.loanmanage.key} permissions={this.props.page_type === "cashloan" || this.props.page_type === "zyzj"||this.props.page_type==="bl" ? global.AUTHSERVER.loan.access[this.type[this.props.page_type].detail] : global.AUTHSERVER.loanmanage.access[this.type[this.props.page_type].detail]} tag="button">??????</Permissions>
                    }

                }


            }
        ]
        let pay_status = under_repay_status_select;
        pay_status.unshift({
            name: "??????", val: ""
        })
        this.filter = {
            time: {
                name: "????????????",
                type: "range_date_notime",
                feild_s: "repay_start_date",
                feild_e: "repay_end_date",
                default: [moment().subtract(1, "days"), moment()],
                placeHolder: ['????????????', "????????????"]
            },
            borrower: {
                name: "?????????",
                type: "text",
                placeHolder: "??????????????????"
            },
            "--": {
                name: "",
                type: "blank"
            },
            status: {
                name: "????????????",
                type: "select",
                placeHolder: "??????",
                values: pay_status
            },
            domain_no: {
                name: "????????????",
                type: "text",
                placeHolder: "?????????????????????"
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
                name: "????????????",
                type: "text",
                placeHolder: "??????????????????"
            },
            borrowerName: {
                name: "?????????",
                type: "text",
                placeHolder: "??????????????????"
            },
            productName: {
                name: "????????????",
                type: "select",
                placeHolder: "??????",
                values: "productName"
            },
            cooperator: {
                name: "????????????",
                type: "select",
                placeHolder: "??????",
                values: "merchantName",
            },
            time: {
                name: "????????????",
                type: "range_date",
                placeHolder: ["????????????", "????????????11"],
                feild_s: "startDate",
                feild_e: "endDate",
                default: [moment(), moment().add(6, "days")],
            },
            manageRpStatus: {
                name: "????????????",
                type: "select",
                placeHolder: "??????",
                values:[{val:100,name:"???????????????"},{val:160,name:"?????????????????????"},{val:810,name:"??????????????????"},{val:830,name:"??????????????????"},{val:860,name:"??????????????????"}]
            },
            processStatus: {
                name: "???????????????",
                type: "select",
                // all:"hidden",
                // placeHolder: "??????",
                values:[{val:100,name:"???"},{val:0,name:"???"}]
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
        // ????????????
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
    // ??????????????????
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
    // ????????????????????????
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
            info.key = "??????";
            let temp = JSON.parse(JSON.stringify(this.state.data));
            temp.push(info);
            this.setState({
                data: temp,
                totalDes: "???????????????????????????????????????",
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
            detail.key = "??????";
            let lists = JSON.parse(JSON.stringify(this.state.data));
            lists.push(detail)
            this.setState({
                totalDes: "???????????????????????????????????????",
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
    // ????????????
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
    // ????????????????????????
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
    // ????????????????????????
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
    // ??????????????????
    batch_pay(data) {
        let datas = data ? [data] : this.state.selectedRows;
        if (datas.length <= 0) {
            message.warn("???????????????");
            return;
        }
        let ids = [];
        for (let d in datas) {
            ids.push({ domain_no: datas[d].domainNo, domain_name: datas[d].domainName, phase: datas[d].phase });
        }
        this.select_total_get(ids);
    }
    // ??????????????????????????????
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
                value: `${info.unPayCount}????????????${info.normalCount || "0"}????????????${info.overdueCount || "0"}??????`,
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
                message.warn("??????????????????");
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
                value: `${count}????????????${total_info.unPayCount || "0"}????????????${total_info.overdueCount || "0"}??????`,
                type: "total",
                loading: false,
                show: true
            }
            this.set_pre_pay(config);
        })
    }

    // ????????????
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
                "repayOrderNo": form_data.repay_order_no,  // ????????? ??????????????????????????????
                "repayDate": form_data.date,
                "confirmRepayDate": form_data.date,  // ????????? ??????????????????????????????
                "accountName": "",                   // ????????? ???????????????????????????
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
    // ????????????
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
            value: `0????????????0????????????0??????`,
            type: "list",
            loading: false,
            show: false
        }
        this.setState({
            pre_pay: init_data
        })
    }
    // ??????????????????
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
            message.warn("??????????????????????????????100", 3);
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
        return `???${this.state.total}?????????`
    }
    //???????????????
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
                message.success("????????????");
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
                disabled: record.key === '??????',
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
            <Button key="submit" type="primary" loading={this.state.pre_pay.loading} onClick={this.pay_confirm.bind(this)}>????????????</Button>
        ]
        const payConfirm_props = {
            visible: this.state.pre_pay.show,
            title: "???????????????",
            // onOk : this.handleOk.bind(this), 
            onCancel: this.modal_hide.bind(this),
            footer: footer,
            className: "pay-plan",
            maskClosable: false
        }
        const fee = {
            title: "???????????????",
            visible: this.state.discount_fee,
            footer: <Button type="primary" onClick={this.fee_save.bind(this)}>??????</Button>,
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
                    ??????????????????
                </span>,
                right: <span>{
                    this.props.page_type === "cashloan" || this.props.page_type === "zyzj"||this.props.page_type==="bl" ? null : <div>
                        <Permissions type="primary" onClick={(e) => (this.batch_pay())} server={this.props.page_type === "cashloan" || this.props.page_type === "zyzj"||this.props.page_type==="bl" ? global.AUTHSERVER.loan.key : global.AUTHSERVER.loanmanage.key} permissions={this.props.page_type === "cashloan" || this.props.page_type === "zyzj"||this.props.page_type==="bl" ? global.AUTHSERVER.loan.access[this.type[this.props.page_type].repay] : global.AUTHSERVER.loanmanage.access[this.type[this.props.page_type].repay]} tag="button">????????????????????????</Permissions>&emsp;
                    <Permissions type="primary" onClick={(e) => (this.total_pay())} server={this.props.page_type === "cashloan" || this.props.page_type === "zyzj"||this.props.page_type==="bl" ? global.AUTHSERVER.loan.key : global.AUTHSERVER.loanmanage.key} permissions={this.props.page_type === "cashloan" || this.props.page_type === "zyzj"||this.props.page_type==="bl" ? global.AUTHSERVER.loan.access[this.type[this.props.page_type].repayBatch] : global.AUTHSERVER.loanmanage.access[this.type[this.props.page_type].repayBatch]} tag="button">????????????????????????</Permissions>&emsp;
                    <Permissions type="primary" onClick={(e) => (this.export_list())} server={this.props.page_type === "cashloan" || this.props.page_type === "zyzj"||this.props.page_type==="bl" ? global.AUTHSERVER.loan.key : global.AUTHSERVER.loanmanage.key} permissions={this.props.page_type === "cashloan" || this.props.page_type === "zyzj"||this.props.page_type==="bl" ? global.AUTHSERVER.loan.access[this.type[this.props.page_type].export] : global.AUTHSERVER.loanmanage.access[this.type[this.props.page_type].export]} tag="button">??????</Permissions>
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
                            <Button type="primary" onClick={(e)=>(this.batch_pay())}>????????????????????????</Button>&emsp;
                            <Button type="primary" onClick={(e)=>(this.total_pay())}>????????????????????????</Button>&emsp;
                        </div>
                        <div>
                            <Button type="primary" onClick={(e)=>(this.export_list())}>??????</Button>
                        </div>                        
                    </div>}
                    <Table {...table_props} bordered />
                </Row> */}

                <Modal {...payConfirm_props}>
                    <Row>
                        <Col span={8}>
                            <div className="key">??????????????????</div>
                        </Col>
                        <Col span={14} offset={2}>
                            <div className="value">{this.state.pre_pay.value}</div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <div className="key">???????????????????????????</div>
                        </Col>
                        <Col span={14} offset={2} className="value">
                            <div className="value">{this.state.pre_pay.total_money.money()}</div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={2}>
                            <div className="key">??????:</div>
                        </Col>
                        <Col span={6}>
                            <div className="key">??????????????????:</div>
                        </Col>
                        <Col span={14} offset={2} className="value">
                            <div className="value">{this.state.pre_pay.total_principal.money()}</div>
                        </Col>
                        <Col span={8}>
                            <div className="key">??????????????????:</div>
                        </Col>
                        <Col span={14} offset={2} className="value">
                            <div className="value">{this.state.pre_pay.total_interest.money()}</div>
                        </Col>
                        <Col span={8}>
                            <div className="key">????????????????????????:</div>
                        </Col>
                        <Col span={14} offset={2} className="value">
                            <div className="value">{this.state.pre_pay.total_defautInterest.money()}</div>
                        </Col>
                        <Col span={8}>
                            <div className="key">?????????????????????:</div>
                        </Col>
                        <Col span={14} offset={2} className="value">
                            <div className="value">{this.state.pre_pay.total_serviceCharge.money()}</div>
                        </Col>
                        <Col span={8}>
                            <div className="key">??????????????????(?????????):</div>
                        </Col>
                        <Col span={14} offset={2} className="value">
                            <div className="value">{this.state.pre_pay.total_overdueFee.money()}</div>
                        </Col>
                    </Row>
                    <Form>
                        <Row>
                            <Col span={8}>
                                <div className="key">????????????:</div>
                            </Col>
                            <Col span={14} offset={2} className="value">
                                <FormItem>
                                    {getFieldDecorator("date", {
                                        rules: [{ required: true, message: '???????????????' }]
                                    })(
                                        <DatePicker onChange={this.repay_date_change.bind(this)} />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <div className="key">???????????????:</div>
                            </Col>
                            <Col span={14} offset={2} className="value">
                                <FormItem>
                                    {getFieldDecorator("repay_order_no", {
                                        rules: [{ required: true, message: "??????????????????" }]
                                    })(
                                        <Input placeholder="?????????????????????" />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <div className="key">????????????:</div>
                            </Col>
                            <Col span={14} offset={2} className="value">
                                <FormItem>
                                    {getFieldDecorator("repay_type", {
                                        rules: [{ required: true, message: "??????????????????" }]
                                    })(
                                        <Select placeholder="?????????????????????">
                                            <Option value="??????">??????</Option>
                                            <Option value="??????">??????</Option>
                                            <Option value="???????????????">???????????????</Option>
                                            <Option value="??????">??????</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <div className="key">??????:</div>
                            </Col>
                            <Col span={14} offset={2} className="value">
                                <FormItem>
                                    {getFieldDecorator("remark")(
                                        <Input placeholder="????????????" />
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
