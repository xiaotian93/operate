import React, { Component } from 'react';
import moment from 'moment'
import { axios_loanMgnt } from '../../../ajax/request'
import { under_repay_plan_bmd, repay_plan_bmd_select_product, repay_plan_bmd_select_merchant, under_repay_total_bmd } from '../../../ajax/api';
import { page, under_repay_status_select } from '../../../ajax/config';
import { format_table_data, bmd } from '../../../ajax/tool';
import Permissions from '../../../templates/Permissions';
import List from '../../templates/list';


class UnderRepayModel extends Component {
    constructor(props) {
        super(props);
        // let endDate = moment();
        // let day = endDate.date();
        // if (day <= 10) {
        //     endDate.date(10);
        // } else if (day > 10 && day <= 20) {
        //     endDate.date(20);
        // } else {
        //     endDate.add(1, "month");
        //     endDate.date(10);
        // }
        this.state = {
            loading: false,
            totalDes: "",
            total: 1,
            current: 1,
            filter: {
                startDate:moment().format("YYYY-MM-DD")+" 00:00:00",
                endDate:moment().add(6, "day").format("YYYY-MM-DD")+" 23:59:59"
            },
            pageSize: page.size,
            data: [],
            total_info: {
                amount: 0
            },
            nowPage: 1,
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
                new: true,
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
                new: true,
                domain: "bmd-loancoop-capital",
                detail: "",
                export: ""
            },
            cashloan: {
                new: true,
                domain: "bmd-cashloan",
                detail: "",
                export: ""
            }
        }
        this.pageOptions = this.type[props.page_type];
    }
    componentWillMount() {
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
                dataIndex: 'domainNo'
            },
            {
                title: '期数',
                dataIndex: 'phase'
            },
            {
                title: '应还款日期',
                dataIndex: 'repayDate',
                render: e => {
                    var date = e ? e.split(" ")[0] : "--"
                        return date
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
                    return e.cooperator || "--"
                }
            },
            {
                title: '应还本金',
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
                render: data => {
                    var val = data.principal + data.interest + data.serviceFee + data.otherFee;
                    return val.money()
                }
            },
            {
                title: '还款状态',
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
                render: (data) => {
                    return <Permissions size="small" onClick={() => { this.get_detail(data) }} server={global.AUTHSERVER.mgnt.key} tag="button">查看</Permissions>
                }
            }
        ]
        let pay_status = under_repay_status_select;
        pay_status.unshift({ name: "全部", val: "" })
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
        this.form_init_data = {
            repay_order_no: "",
            date: undefined,
            remark: "",
            repay_type: undefined
        }
        this.get_select();
    }
    componentDidMount() {
        var select = window.localStorage.getItem(this.props.path);
        if(select){
            var params=JSON.parse(select).remberData;
            if(JSON.parse(select).isRember){
                this.get_list(1,params);
            }else{
                this.get_list(1,this.state.filter);
            }
        }else{
            this.get_list(1,this.state.filter);
        }

    }

    get_detail(data) {
        bmd.redirect("/hk/under/" + this.props.page_type + "/detail?contract_no=" + data.contractNo + "&type=" + this.props.page_type + "&appKey=" + data.appKey+"&urlType=jk")
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
        data.domain = this.props.domain;
        data.bkSubject=this.props.bkSubject||"";
        data.appKey=this.props.appKey||"";
        data.onlyUnRepay = true;
        axios_loanMgnt.post(under_repay_plan_bmd, data).then((data) => {
            let list = data.data.list;
            if(!data.code&&list){
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
                    loading:false
                })
            }
        }).catch(e=>{
            this.setState({
                loading:false
            })
        });
    }
    // 获取下拉菜单
    get_select() {
        var data = { domain: this.props.domain ,bkSubject:this.props.bkSubject,usage:"WAIT_REPAY_LIST",appKey:this.props.appKey||""};
        axios_loanMgnt.post(repay_plan_bmd_select_product, data).then((data) => {
            this.setState({
                productName: data.data.filter(coo=>coo).map(coo=>({val:coo.name,name:coo.name}))
            })
        });
        axios_loanMgnt.post(repay_plan_bmd_select_merchant, data).then((data) => {
            this.setState({
                merchantName: data.data.filter(coo=>coo).map(coo=>({val:coo.cooperator,name:coo.cooperator}))
            })
        });

    }
    // 获取全部统计数据
    get_total_bmd(filter) {
        filter.domain = this.props.domain;
        filter.onlyUnRepay = true;
        filter.bkSubject=this.props.bkSubject||"";
        filter.appKey=this.props.appKey||"";
        axios_loanMgnt.post(under_repay_total_bmd, filter).then(data => {
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
        // let filter = {};
        // for (let d in data) {
        //     filter[data[d].key] = data[d].value
        // }
        this.setState({
            filter: data
        })
        this.get_list(1, data);
    }
    set_filter(filter) {
        // return [{ key: "time", value: [moment(this.state.filter.startDate), moment(this.state.filter.endDate)] }]
        this.filter = filter;
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
    render() {
        var page = parseInt(this.state.total / (this.state.pageSize + 1), 10);
        let pagination = {
            total: this.state.total + page,
            current: this.state.current,
            pageSize: this.state.pageSize + 1,
            showTotal: this.showTotal.bind(this),
            onChange: this.page_up.bind(this)
        }
        const table_props = {
            columns: this.columns_bmd,
            dataSource: this.state.data,
            pagination: pagination,
            loading: this.state.loading,
            footer: () => this.state.totalDes
        }
        var select = window.localStorage.getItem(this.props.path);
        const table = {
            filter: {
                "data-get": this.get_filter.bind(this),
                "data-source": this.filter_bmd,
                "data-set": this.set_filter.bind(this),
                "merchantName": this.state.merchantName,
                "productName": this.state.productName,
                "data-paths": this.props.path,
                time:select?(JSON.parse(select).isRember?[]:[moment(), moment().add(6, "day")]):[moment(), moment().add(6, "day")]
            },
            tableInfo: table_props,
            tableTitle: { left: <span> 金额单位：元 </span> },
            // isFilter: true
        }

        return (
            <div className="Component-body">
                <List {...table} />
            </div>
        )
    }
}

export default UnderRepayModel;
