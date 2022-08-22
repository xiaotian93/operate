import React, { Component } from 'react';
import { Table, Row, Button, Tabs, Col, Modal, message } from 'antd';
// import moment from 'moment'

import { axios_postloan, axios_repay, axios_loanMgnt, axios_loan } from '../../ajax/request';
import { repay_detail_by_domainNo, afterloan_overdue_reminder_list, afterloan_overdue_deduction, afterloan_overdue_repaylist, afterloan_overdue_discount, repay_contract_detail, repay_contract_plan, repay_contract_undiscount, repay_deduction_count, afterloan_borrower_detail,repay_contract_type ,repay_contract_list} from '../../ajax/api';
import { format_table_data, accMul, accDiv, format_time } from '../../ajax/tool';
// import { repay_status_select_map } from '../../ajax/config';
import UrgeModal from './components/UrgeModal';
// import ContractInfo from '../repay/elements/contractInfo';
import Particulars from '../particulars/particulars';
// import Card from '../../templates/Card';
// import DetailBmd from '../detail/detailBmd';
import Fee from '../repay/elements/discountFee';
import FeeMore from '../repay/elements/discountFeeMore';
import Deduction from './components/deduction';
// import Permissions from '../../templates/Permissions';
import LineTable from '../../templates/TableCol_4';
import ComponentRoute from '../../templates/ComponentRoute';
import Contact from "./components/contact";
import UserInfo from "../repay/plan/detail/userInfo";
const TabPane = Tabs.TabPane;
class Overdue extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            contractInfo: {},
            selectedRowKeys: [],
            discount_money: 0,
            totalRepayAmount: 0,
            contactList: [],
            contractRepayStatusList:[],
            repayTriggerTypeList:[]
        };
        this.loader = [];
        this.contractNo = props.location.query.contractNo;
        this.contractId = props.location.query.contractId;
        this.domainNo = props.location.query.domainNo;
        this.productLine = props.location.query.productLine;
        this.appKey = props.location.query.appKey;
    }
    componentWillMount() {
        window.scrollTo(0, 0);
        this.columnsRepay = [
            {
                title: '期数',
                width: 70,
                dataIndex: 'phase'
            },
            {
                title: '应还日期',
                width: 100,
                dataIndex: 'repayDate',
                render: e => {
                    var time = e.split(" ");
                    return time[0];
                }
            },
            {
                title: '应还本金',
                dataIndex: "principal",
                width: 100,
                render: data => {
                    return data ? data.money() : "0.00"
                }
            },
            {
                title: '应还利息',
                width: 100,
                dataIndex: "interest",
                render: data => {
                    return data ? data.money() : "0.00"
                }
            },
            {
                title: '应还服务费',
                width: 100,
                dataIndex: "serviceFee",
                render: data => {
                    return data ? data.money() : "0.00"
                }
            },
            {
                title: '应还其他费用',
                width: 100,
                dataIndex: "otherFee",
                render: data => {
                    return data ? data.money() : "0.00"
                }
            },
            {
                title: '应还逾期罚息',
                width: 100,
                // dataIndex:"expect.overdueFee",
                render: data => {
                    var num = data.clearOverdueInterest + data.settleOverdueInterest + data.discountOverdueInterest;
                    return num ? num.money() : "0.00"
                }
            },
            {
                title: '应还违约金',
                width: 100,
                // dataIndex:"expect.penaltyOverdueFee",
                render: data => {
                    var num = data.clearPenaltyOverdueFee + data.settlePenaltyOverdueFee + data.discountPenaltyOverdueFee;
                    return num ? num.money() : "0.00"
                }
            },
            {
                title: '应还提前结清手续费',
                width: 100,
                render: data => {
                    var num = data.clearPenaltyAheadFee + data.settlePenaltyAheadFee + data.discountPenaltyAheadFee;
                    return num ? num.money() : "0.00"
                }
            },
            {
                title: '应还科技服务费',
                width: 100,
                dataIndex: "serviceTechFee",
                render: data => {
                    return data ? data.money() : "0.00"
                }
            },
            {
                title: '应还合计',
                width: 100,
                render: data => {
                    return (data.principal + data.interest + data.serviceFee + data.otherFee + data.clearOverdueInterest + data.settleOverdueInterest + data.discountOverdueInterest + data.clearPenaltyOverdueFee + data.settlePenaltyOverdueFee + data.discountPenaltyOverdueFee + data.clearPenaltyAheadFee + data.settlePenaltyAheadFee + data.discountPenaltyAheadFee+data.serviceTechFee).money();
                }
            },
            {
                title: '已还合计',
                width: 100,
                // dataIndex:"actual.sum",
                render: data => {
                    return (data.settlePrincipal + data.settleInterest + data.settleServiceFee + data.settleOtherFee + data.settleOverdueInterest + data.settlePenaltyOverdueFee + data.settlePenaltyAheadFee+data.serviceTechFee).money()
                }
            },
            {
                title: '已还本金',
                width: 100,
                dataIndex: "settlePrincipal",
                render: data => {
                    return data ? data.money() : "0.00"
                }
            },
            {
                title: '已还利息',
                width: 100,
                dataIndex: "settleInterest",
                render: data => {
                    return data ? data.money() : "0.00"
                }
            },
            {
                title: '已还服务费',
                width: 100,
                dataIndex: "settleServiceFee",
                render: data => {
                    return data ? data.money() : "0.00"
                }
            },
            {
                title: '已还其他费用',
                dataIndex: "settleOtherFee",
                width: 100,
                render: data => {
                    return data ? data.money() : "0.00"
                }
            },
            {
                title: '已还逾期罚息',
                dataIndex: "settleOverdueInterest",
                width: 100,
                render: data => {
                    return data ? data.money() : "0.00"
                }
            },
            {
                title: '已还违约金',
                width: 100,
                dataIndex: "settlePenaltyOverdueFee",
                render: data => {
                    return data ? data.money() : "0.00"
                }
            },
            {
                title: '已还提前结清手续费',
                width: 100,
                dataIndex: "settlePenaltyAheadFee",
                render: data => {
                    return data ? data.money() : "0.00"
                }
            },
            {
                title: '已还科技服务费',
                width: 100,
                dataIndex: "settleServiceTechFee",
                render: data => {
                    return data ? data.money() : "0.00"
                }
            },
            {
                title: '减免利息',
                width: 100,
                render: data => {
                    if (data.undiscount && data.undiscount_other) {
                        return (data.discountInterest + data.undiscount.interest + data.undiscount_other.interest).money()
                    } else {
                        if (data.undiscount) {
                            return (data.discountInterest + data.undiscount.interest).money()
                        } else if (data.undiscount_other) {
                            return (data.discountInterest + data.undiscount_other.interest).money()
                        } else {
                            return (data.discountInterest).money()
                        }
                    }
                }
            },
            {
                title: '减免服务费',
                width: 100,
                render: data => {
                    if (data.undiscount && data.undiscount_other) {
                        return (data.discountServiceFee + data.undiscount.serviceFee + data.undiscount_other.serviceFee).money()
                    } else {
                        if (data.undiscount) {
                            return (data.discountServiceFee + data.undiscount.serviceFee).money()
                        } else if (data.undiscount_other) {
                            return (data.discountServiceFee + data.undiscount_other.serviceFee).money()
                        } else {
                            return (data.discountServiceFee).money()
                        }
                    }
                    // return (data.discountServiceFee+data.remainDiscount.serviceFee).money()
                }
            },
            {
                title: '减免其他费用',
                width: 100,
                render: data => {
                    if (data.undiscount && data.undiscount_other) {
                        return (data.discountOtherFee + data.undiscount.otherFee + data.undiscount_other.otherFee).money()
                    } else {
                        if (data.undiscount) {
                            return (data.discountOtherFee + data.undiscount.otherFee).money()
                        } else if (data.undiscount_other) {
                            return (data.discountOtherFee + data.undiscount_other.otherFee).money()
                        } else {
                            return (data.discountOtherFee).money()
                        }
                    }
                    // return (data.discountOtherFee+data.remainDiscount.otherFee).money()
                }
            },
            {
                title: '减免逾期罚息',
                width: 100,
                render: data => {
                    if (data.undiscount && data.undiscount_other) {
                        return (data.discountOverdueInterest + data.undiscount.overdueFee + data.undiscount_other.overdueFee).money()
                    } else {
                        if (data.undiscount) {
                            return (data.discountOverdueInterest + data.undiscount.overdueFee).money()
                        } else if (data.undiscount_other) {
                            return (data.discountOverdueInterest + data.undiscount_other.overdueFee).money()
                        } else {
                            return (data.discountOverdueInterest).money()
                        }

                    }
                    // return (data.discountOverdueInterest+data.remainDiscount.overdueFee).money()
                }
            },
            {
                title: '减免违约金',
                width: 100,
                render: data => {
                    if (data.undiscount && data.undiscount_other) {
                        return (data.discountPenaltyOverdueFee + data.undiscount.penaltyOverdueFee + data.undiscount_other.penaltyOverdueFee).money()
                    } else {
                        if (data.undiscount) {
                            return (data.discountPenaltyOverdueFee + data.undiscount.penaltyOverdueFee).money()
                        } else if (data.undiscount_other) {
                            return (data.discountPenaltyOverdueFee + data.undiscount_other.penaltyOverdueFee).money()
                        } else {
                            return (data.discountPenaltyOverdueFee).money()
                        }

                    }
                    // return (data.discountPenaltyOverdueFee+data.remainDiscount.penaltyOverdueFee).money()
                }
            },
            {
                title: '减免提前结清手续费',
                width: 100,
                render: data => {
                    if (data.undiscount && data.undiscount_other) {
                        return (data.discountPenaltyAheadFee + data.undiscount.penaltyAheadFee + data.undiscount_other.penaltyAheadFee).money()
                    } else {
                        if (data.undiscount) {
                            return (data.discountPenaltyAheadFee + data.undiscount.penaltyAheadFee).money()
                        } else if (data.undiscount_other) {
                            return (data.discountPenaltyAheadFee + data.undiscount_other.penaltyAheadFee).money()
                        } else {
                            return (data.discountPenaltyAheadFee).money()
                        }

                    }
                    // return (data.discountPenaltyAheadFee+data.remainDiscount.penaltyAheadFee).money()
                }
            },

            {
                title: '实际还款日期',
                width: 150,
                dataIndex: 'lastSettleTime'
            },
            {
                title: '还款状态',
                width: 100,
                render: (data) => {
                    if (data.phase === "合计") {
                        return;
                    }
                    const type = { 100: "当期待还款", 830: "当期正常还款", 110: "当期逾期未还", 860: "当期逾期还款", 810: "当期提前还款", 811: "当期提前还款", 850: "当期逾期还款" }
                    var status = data.repayPlanStatus;
                    if (status === 100 || status === 110) {
                        return data.overdueDays > 0 ? "当期逾期未还" : "当期待还款"
                    } else {
                        return type[status];
                    }
                    // const type={0:"当期未还",1:"当期正常还款",2:"当期逾期未还",3:"当期逾期还款",4:"当期提前还款"}
                    // return <span>{type[data.status]}</span>
                    // return <span className={pay_status_class[data.status]}>{data.statusStr}</span>
                }
            },
            {
                title: '逾期天数',
                width: 100,
                // dataIndex: 'overdueDays',
                render: e => {
                    if (e.phase === "合计") {
                        return;
                    }
                    return e.overdueDays >= 0 ? e.overdueDays : 0
                }
            },
            {
                title: '备注',
                width: 100,
                render: data => {
                    if (data.repayPlanStatus === 110 || data.repayPlanStatus === 100) {
                        if (data.overdueDays > 0) {
                            if (((new Date().getTime() - new Date(data.repayDate).getTime()) / 1000 / 60 / 60 / 24) <= this.state.contractInfo.gracePeriod) {
                                return "宽限期内待还款"
                            } else {
                                return "--"
                            }
                        } else {
                            return "--"
                        }

                    } else if (data.repayPlanStatus === 850) {
                        return "宽限期内还款"
                    } else {
                        return "--"
                    }
                }
            },
            {
                title: '操作',
                width: 200,
                // fixed:'right',
                render: (data) => {
                    if (data.phase === "合计") {
                        return;
                    }
                    var btn = [];
                    if (data.repayPlanStatus === 830 || data.repayPlanStatus === 860 || data.repayPlanStatus === 810 || data.repayPlanStatus === 811) {
                        return "--";
                    }
                    if (data.repayPlanStatus === 100 || data.repayPlanStatus === 110) {
                        // btn.push(<span key={data.repayPlanStatus}><Permissions server={global.AUTHSERVER.loan.key} tag="button" type="primary" size="small" className="f3 text-blue" onClick={()=>(this.discount_fee(data))} permissions={global.AUTHSERVER.loan.access.pl_discount_add}>减免</Permissions>&emsp;</span>)
                        // btn.push(<Permissions key={data.repayPlanStatus+"1"} server={global.AUTHSERVER.loan.key} tag="button" type="primary" size="small" className="f3 text-blue" onClick={()=>(this.deduction_show(data))} permissions={global.AUTHSERVER.loan.access.pl_repay_add}>人工划扣</Permissions>)
                        btn.push(<span key={data.repayPlanStatus}><Button type="primary" size="small" onClick={() => (this.discount_fee(data))} >减免</Button>&emsp;</span>)
                        btn.push(<Button key={data.repayPlanStatus + "1"} type="primary" size="small" onClick={() => (this.deduction_show(data))} >人工划扣</Button>)
                    }
                    return btn;
                }
            }
        ]
        this.columnsUrge = [
            {
                title: '序号',
                dataIndex: 'key',
            },
            {
                title: '记录时间',
                dataIndex: 'remindTime',
            },
            {
                title: '承诺还款时间',
                dataIndex: 'promiseRepayTime',
                render: e => {
                    return e ? e.split(" ")[0] : "--"
                }
            },
            {
                title: '关系',
                dataIndex: 'relation',
                render: e => {
                    var type = { SELF: "本人", SPOUSE: "配偶", SON: "儿子", DAUGHTER: "女儿", PARENT: "父母", BROTHER_OR_SISTER: "兄弟姐妹", FRIEND: "朋友", COLLEAGUE: "同事", OTHER: "其他" }
                    return type[e] || "--"
                }
            },
            {
                title: '姓名',
                dataIndex: 'contactsName',
                render: e => e || "--"
            },
            {
                title: '手机号',
                dataIndex: 'contactsPhone',
                render: e => e || "--"
            },
            {
                title: '催收员',
                dataIndex: 'operator',
                render: e => e || "--"
            },
            {
                title: '催收状态',
                dataIndex: 'result',
                render: e => e || "--"
            },
            {
                title: '逾期原因',
                dataIndex: 'overdueReason',
                render: e => e || "--"
            },
            {
                title: '备注',
                dataIndex: 'remark',
                render: e => e || "--"
            }
        ];
        this.columns_contract_bmd = {
            'productName': {
                name: '产品名称',
            },

            'domainNo': {
                name: '订单编号',
            },
            'contractNo': {
                name: '合同编号',
            },
            'blank1': {
                name: '合同状态',
            },
            'blank2': {
                name: '合同名称',
            },
            'blank3': {
                name: '合同签订日期',
            },
            'borrowerName': {
                name: '借款方',
            },
            'borrowerType': {
                name: '客户类型',
                // dataIndex:"borrowerType",
                render: (data) => {
                    return data.borrowerType === "PERSONAL" ? "个人" : "企业"
                }
            },
            'amount': {
                name: '借款金额',
                render: (data) => {
                    return data.amount?data.amount.money():"--";
                }
            },
            'term': {
                name: '借款期限',
                render: (data) => {
                    var type = { "DAY": "日", "MONTH": "个月", "YEAR": "年" };
                    return data.term?data.term + "(" + type[data.termType] + ")":"--";
                }
            },
            'loanStartDate': {
                name: '借款开始日期',
            },
            'loanEndDate': {
                name: '借款截止日期',
            },
            'yearRate': {
                name: '年化利率',
            },
            'ly': {
                name: '还款来源',
                render: (data) => {
                    // return data.contactInfo.borrowType===0?"工资":"营业收入"
                    return ""
                }
            },
            'reportRepayType': {
                name: '还款方式',
                render: (data) => {
                    return ""
                    // var reportRepayType={"DEBX":"等额本息","DEBJ":"等额本金","XXHB":"先息后本","LHHK":"灵活还款"};
                    // return reportRepayType[data.loanConfig.repayType];
                }
            },
            'tx': {
                name: '借款投向',
                render: (data) => {
                    // return industryStrs[data.mpDefault.industry];
                    return ""
                }
            },
            'fs': {
                name: '借款方式',
                render: (data) => {
                    // return loan_typeStrs[data.mpDefault.loanType];
                    return ""
                }
            },
            'yt': {
                name: '借款用途',
                render: (data) => {
                    // return purposeStrs[data.mpDefault.purpose];
                    return ""
                }
            },
            'zq': {
                name: '是否展期',
                render: (data) => {
                    // return data.mpDefault.isExtend===0?"否":"是"
                    return ""
                }
            },

            'fj': {
                name: '附件',
                render: (data) => {
                    // return (
                    //     <span>
                    //         <a target="_blank" href={"http://ot.baimaodai.com/contract/trust?contract_no="+this.state.contract_no}>《征信授权书》.pdf&emsp;</a> <br />
                    //         <a target="_blank" href={"http://ot.baimaodai.com/contract?contract_no="+this.state.contract_no}>《借款合同》.pdf</a> <br />
                    //         <a target="_blank" href={"http://res.baimaodai.com/web/ygd/file/4.0-bmd-xxsqxy.20180228.pdf"}>《信息授权书》.pdf</a><br />
                    //         <a target="_blank" href={"http://res.baimaodai.com/web/ygd/file/ygd-ygcnh.20180102.pdf"}>《承诺书》.pdf</a>
                    //     </span>
                    // )
                    return "无"
                }
            },
        }
        this.columnsRecord = [
            {
                title: "序号",
                dataIndex: "key"
            },

            {
                title: "发起扣款时间",
                dataIndex: "createTime",
                render: e => (e || "--")
            },
            {
                title: "还款时间",
                dataIndex: "repayTime",
                render: e => (e || "--")
            },
            {
                title: "还款金额",
                dataIndex: "amount",
                render: e => e ? e.money() : "0.00"
            },
            {
                title:"还款状态",
                dataIndex:"status",
                render:e=>{
                    var type=this.state.contractRepayStatusList,str="";
                    type.forEach(i=>{
                        if(i.name===e){
                            str=i.val
                        }
                    })
                    return str
                }
            },
            {
                title: "失败原因",
                dataIndex: "failReason",
                render: e => {
                    return e || "--";
                }
            },
            {
                title: "本金入账",
                dataIndex: "actualFee.principal",
                render: e => {
                    return e ? e.money() : 0.00;
                }
            },
            {
                title: "利息入账",
                dataIndex: "actualFee.interest",
                render: e => {
                    return e ? e.money() : "0.00";
                }
            },
            {
                title: "服务费入账",
                dataIndex: "actualFee.serviceFee",
                render: e => {
                    return e ? e.money() : "0.00";
                }
            },
            {
                title: "其他费用入账",
                dataIndex: "actualFee.otherFee",
                render: e => {
                    return e ? e.money() : "0.00";
                }
            },
            {
                title: "逾期罚息入账",
                dataIndex: "actualFee.overdueFee",
                render: e => {
                    return e ? e.money() : "0.00";
                }
            },
            {
                title: "违约金入账",
                dataIndex: "actualFee.penaltyOverdueFee",
                render: e => {
                    return e ? e.money() : "0.00";
                }
            },
            {
                title: "提前结清手续费入账",
                dataIndex: "actualFee.penaltyAheadFee",
                render: e => {
                    // var repayPhaseList=e.repayPhaseList;
                    // var money=0;
                    // repayPhaseList.map((i,k)=>{
                    //     var penaltyAheadFee=i.repayActual.penaltyAheadFee;
                    //     money+=penaltyAheadFee;
                    //     return true;
                    // })
                    return e ? e.money() : "0.00";
                }
            },
            {
                title: "科技服务费入账",
                dataIndex: "actualFee.serviceTechFee",
                render: e => {
                    return e ? e.money() : "0.00";
                }
            },
            {
                title:"还款方式",
                dataIndex:"repayTriggerType",
                render:e=>{
                    var type=this.state.repayTriggerTypeList,str="";
                    type.forEach(i=>{
                        if(i.name===e){
                            str=i.val
                        }
                    })
                    return str
                }
            },
        ]
    }
    componentDidMount() {
        this.getDetail();
        this.getReminder();
        // this.get_contactList(this.contractNo);

        // this.getContractInfo(this.domainName, this.domainNo);
    }
    getDetail() {
        // axios_postloan.post(repay_detail_bmd, { contractId: this.contractId }).then((data) => {
        //     let list = format_table_data(data.data.repayDetailList);
        //     list = this.set_total_bmd(list,data.data.repayDetailList)
        //     // list.push(total);
        //     this.setState({
        //         // dataUrge: format_table_data(data.data.collectionRecordList),
        //         dataRepay: list,
        //         contractInfo:data.data.contract
        //     });
        // });
        axios_loanMgnt.post(repay_contract_type).then(e=>{
            if(!e.code){
                this.setState({
                    contractRepayStatusList:e.data.contractRepayStatusList,
                    repayTriggerTypeList:e.data.repayTriggerTypeList
                })
            }
        })
        let rqd = {
            contractNo: this.contractNo,
            appKey: this.appKey || ""
        }
        axios_loanMgnt.post(repay_contract_detail, rqd).then((data) => {
            this.setState({
                contractInfo: data.data
            })
        })
        axios_loanMgnt.post(repay_contract_plan, rqd).then((data) => {
            axios_loanMgnt.post(repay_contract_undiscount, rqd).then((e) => {
                var undiscount = e.data;
                var list = data.data;
                list = this.get_newList(list, undiscount);
                list = this.set_total_bmd(list, list)
                this.setState({
                    dataRepay: list,
                })
            })

        })
        // axios_loan.post(afterloan_overdue_repaylist, { contractNo: this.contractNo }).then(e => {
        //     if (!e.code) {
        //         this.setState({
        //             dataRecord: format_table_data(e.data.list)
        //         })
        //     }
        // })
        this.get_repay_list();
    }
    get_repay_list(page=1){
        var param={
            page:page,
            size:10,
            contractNo:this.contractNo
        }
        axios_loanMgnt.post(repay_contract_list, param).then((data) => {
            this.setState({
                dataRecord: format_table_data(data.data.list),
                pageTotal:data.data.total,
                pageCurrent:data.data.current
            })
        })
    }
    // 还款记录翻页
    page_up(page,pageSize){
        // window.scrollTo(0,0);
        this.setState({
            page:page
        })
        this.get_repay_list(page);
    }
    get_contactList(id) {
        axios_loan.post(afterloan_borrower_detail, { contractNo: id }).then(e => {
            if (!e.code) {
                this.setState({
                    contactList: e.data
                })
            }
        })
    }
    get_newList(list, arr) {
        if (arr.length < 1) {
            return list
        }
        for (var i in list) {
            for (var j in arr) {
                if (list[i].phase === arr[j].phase) {
                    if (arr[j].creatorType === "ZD") {
                        list[i].undiscount = arr[j];
                    } else {
                        list[i].undiscount_other = arr[j];
                    }
                }
            }
        }
        return list;

    }
    set_total_bmd(list, data) {
        let total = {
            principal: 0,
            interest: 0,
            serviceFee: 0,
            otherFee: 0,
            clearOverdueInterest: 0,
            clearPenaltyOverdueFee: 0,
            clearPenaltyAheadFee: 0,
            settlePrincipal: 0,
            settleInterest: 0,
            settleServiceFee: 0,
            settleOtherFee: 0,
            settleOverdueInterest: 0,
            settlePenaltyOverdueFee: 0,
            settlePenaltyAheadFee: 0,
            discountInterest: 0,
            discountServiceFee: 0,
            discountOtherFee: 0,
            discountOverdueInterest: 0,
            discountPenaltyOverdueFee: 0,
            discountPenaltyAheadFee: 0,
            serviceTechFee:0,
            undiscount: {
                interest: 0,
                serviceFee: 0,
                otherFee: 0,
                overdueFee: 0,
                penaltyOverdueFee: 0,
                penaltyAheadFee: 0
            },
        };
        for (var i in data) {
            for (var j in total) {
                if (j === "undiscount") {
                    if (data[i][j]) {
                        total.undiscount.interest += data[i][j].interest;
                        total.undiscount.serviceFee += data[i][j].serviceFee;
                        total.undiscount.otherFee += data[i][j].otherFee;
                        total.undiscount.overdueFee += data[i][j].overdueFee;
                        total.undiscount.penaltyOverdueFee += data[i][j].penaltyOverdueFee;
                        total.undiscount.penaltyAheadFee += data[i][j].penaltyAheadFee
                    }
                } else {
                    total[j] += data[i][j];
                }
            }

        }
        total.key = "total";
        total.phase = "合计";
        total.repayDate = "";
        total.latestRepaidDate = "";
        total.statusStr = "";
        // total.phase = 0;
        list.push(total);
        return list;
    }
    getReminder() {
        axios_postloan.post(afterloan_overdue_reminder_list, { contractNo: this.contractNo }).then((data) => {
            this.setState({
                dataUrge: format_table_data(data.data.list)
            })
        })
    }

    // 获取合同信息
    getContractInfo(name, No) {
        axios_repay.post(repay_detail_by_domainNo, { domain_name: name, domain_no: No }).then(res => {
            this.setState({
                contractInfo: res.data
            })
        })
    }

    // 显示催记弹窗
    modalShow(e) {
        this.setState({
            visible: true
        })
    }

    // 关闭催记弹窗
    modalHide(e) {
        this.setState({
            visible: false
        })
        this.getDetail();
    }
    //减免
    ref_fee(e) {
        this.fee_child = e
    }
    discount_fee(data) {
        this.setState({
            discount_fee: true,
            fee_orderNo: this.contractNo,
            fee_period: data.phase
        })
        data.remainDiscount = {
            interest: data.undiscount ? (data.undiscount.creatorType === "ZD" ? (data.discountInterest + data.undiscount.interest) : data.discountInterest) : data.discountInterest,
            serviceFee: data.undiscount ? (data.undiscount.creatorType === "ZD" ? (data.discountServiceFee + data.undiscount.serviceFee) : data.discountServiceFee) : data.discountServiceFee,
            overdueFee: data.undiscount ? (data.undiscount.creatorType === "ZD" ? (data.discountOverdueInterest + data.undiscount.overdueFee) : data.discountOverdueInterest) : data.discountOverdueInterest,
            penaltyOverdueFee: data.undiscount ? (data.undiscount.creatorType === "ZD" ? (data.discountOverdueInterest + data.undiscount.penaltyOverdueFee) : data.discountOverdueInterest) : data.discountOverdueInterest,
            otherFee: data.undiscount ? (data.undiscount.creatorType === "ZD" ? (data.discountOtherFee + data.undiscount.otherFee) : data.discountOtherFee) : data.discountOtherFee,
            serviceTechFee: data.undiscount ? (data.undiscount.creatorType === "ZD" ? (data.discountServiceTechFee + data.undiscount.serviceTechFee) : data.discountServiceTechFee) : data.discountServiceTechFee,
        }
        var OverdueInterest = data.clearOverdueInterest + data.settleOverdueInterest + data.discountOverdueInterest;
        var PenaltyOverdueFee = data.clearPenaltyOverdueFee + data.settlePenaltyOverdueFee + data.discountPenaltyOverdueFee;
        var rqd = {
            phaseStart: data.phase,
            phaseEnd: data.phase,
            contractNo: this.contractNo,
            clearingTime: format_time(new Date()),
            repayTriggerType: "USER"
        }
        axios_loanMgnt.post(repay_deduction_count, rqd).then(e=>{
            if(!e.code){
                var e=e.data[0];
                setTimeout(()=>{
                    this.fee_child.setState({
                        data: e,
                        discountInterest: accDiv((e.interest - data.remainDiscount.interest), 100).toFixed(2),
                        discountServiceFee: accDiv((e.serviceFee - data.remainDiscount.serviceFee), 100).toFixed(2),
                        discountOverdueFee: accDiv((e.overdueInterest - data.remainDiscount.overdueFee), 100).toFixed(2),
                        discountPenaltyFee: accDiv((e.penaltyOverdueFee - data.remainDiscount.penaltyOverdueFee), 100).toFixed(2),
                        discountotherFee: accDiv((e.otherFee - data.remainDiscount.otherFee), 100).toFixed(2),
                        discountInterest_num: accDiv(data.remainDiscount.interest, 100).toFixed(2),
                        discountServiceFee_num: accDiv(data.remainDiscount.serviceFee, 100).toFixed(2),
                        discountOverdueFee_num: accDiv(data.remainDiscount.overdueFee, 100).toFixed(2),
                        discountPenaltyFee_num: accDiv(data.remainDiscount.penaltyOverdueFee, 100).toFixed(2),
                        discountotherFee_num: accDiv(data.remainDiscount.otherFee, 100).toFixed(2),
                        discountServiceTechFee: accDiv((e.serviceTechFee - data.remainDiscount.serviceTechFee), 100).toFixed(2),
                        discountServiceTechFee_num: accDiv(data.remainDiscount.serviceTechFee, 100).toFixed(2),
                    });
                },10)
                
            }
        })
        setTimeout(() => {
            // this.fee_child.setState({
            //     data: data,
            //     discountInterest: accDiv((data.interest - data.remainDiscount.interest), 100).toFixed(2),
            //     discountServiceFee: accDiv((data.serviceFee - data.remainDiscount.serviceFee), 100).toFixed(2),
            //     discountOverdueFee: accDiv((OverdueInterest - data.remainDiscount.overdueFee), 100).toFixed(2),
            //     discountPenaltyFee: accDiv((PenaltyOverdueFee - data.remainDiscount.penaltyOverdueFee), 100).toFixed(2),
            //     discountotherFee: accDiv((data.otherFee - data.remainDiscount.otherFee), 100).toFixed(2),
            //     discountInterest_num: accDiv(data.remainDiscount.interest, 100).toFixed(2),
            //     discountServiceFee_num: accDiv(data.remainDiscount.serviceFee, 100).toFixed(2),
            //     discountOverdueFee_num: accDiv(data.remainDiscount.overdueFee, 100).toFixed(2),
            //     discountPenaltyFee_num: accDiv(data.remainDiscount.penaltyOverdueFee, 100).toFixed(2),
            //     discountotherFee_num: accDiv(data.remainDiscount.otherFee, 100).toFixed(2),
            // });
            this.fee_child.props.form.setFieldsValue({ "interestMoney": data.remainDiscount.interest ? accDiv(data.remainDiscount.interest, 100).toFixed(2) : "", "interestDay": "" })
            this.fee_child.props.form.setFieldsValue({ "serviceFeeMoney": data.remainDiscount.serviceFee ? accDiv(data.remainDiscount.serviceFee, 100).toFixed(2) : "", "serviceFeeDay": "" })
            this.fee_child.props.form.setFieldsValue({ "overdueFeeMoney": data.remainDiscount.overdueFee ? accDiv(data.remainDiscount.overdueFee, 100).toFixed(2) : "", "overdueFeeDay": "" })
            this.fee_child.props.form.setFieldsValue({ "penaltyOverdueFeeMoney": data.remainDiscount.penaltyOverdueFee ? accDiv(data.remainDiscount.penaltyOverdueFee, 100).toFixed(2) : "" })
            this.fee_child.props.form.setFieldsValue({ "otherFeeMoney": data.remainDiscount.otherFee ? accDiv(data.remainDiscount.otherFee, 100).toFixed(2) : "" })
            this.fee_child.props.form.setFieldsValue({ "serviceTechFeeMoney": data.remainDiscount.serviceTechFee ? accDiv(data.remainDiscount.serviceTechFee, 100).toFixed(2) : "", "serviceTechFeeDay": "" })

        }, 10)

    }
    fee_save() {
        var param = this.fee_child.get_val();
        if (!param) {
            return;
        }
        var discountPhaseList = [];
        var child = {
            phase: this.state.fee_period,
            discountFee: param.amount
        }
        console.log(child);
        // alert(1)
        // return;
        discountPhaseList.push(child);
        var rqd = {};
        rqd.contractNo = this.state.fee_orderNo;
        rqd.discountPhaseList = discountPhaseList;
        var parammeters = {
            discountParams: JSON.stringify(rqd),
            purpose: param.purpose
        }
        axios_postloan.post(afterloan_overdue_discount, parammeters).then(e => {
            if (!e.code) {
                // message.success("减免申请成功");
                this.setState({
                    fee_visible: true,
                    text_type: "fee"
                })
                this.fee_cancel();
                this.getDetail();
            }
        })

    }
    fee_cancel() {

        this.fee_child.props.form.setFieldsValue({ "interestMoney": "", "interestDay": "" })
        this.fee_child.props.form.setFieldsValue({ "serviceFeeMoney": "", "serviceFeeDay": "" })
        this.fee_child.props.form.setFieldsValue({ "overdueFeeMoney": "", "overdueFeeDay": "" })
        this.fee_child.props.form.setFieldsValue({ "penaltyOverdueFeeMoney": "" })
        this.fee_child.props.form.setFieldsValue({ "otherFeeMoney": "" });
        this.fee_child.props.form.setFieldsValue({ "purpose": "" });
        this.fee_child.props.form.setFieldsValue({ "serviceTechFeeMoney": "", "serviceTechFeeDay": "" })
        this.fee_child.setState({
            discountInterest: "0.00",
            discountServiceFee: "0.00",
            discountServiceTechFee:"0.00",
            discountOverdueFee: "0.00",
            discountPenaltyFee: "0.00",
            discountotherFee: "0.00",
            discountInterest_num: "0.00",
            discountServiceFee_num: "0.00",
            discountOverdueFee_num: "0.00",
            discountPenaltyFee_num: "0.00",
            discountotherFee_num: "0.00",
            discountServiceTechFee_num:"0.00",
            data: {
                principal: 0,
                interest: 0,
                serviceFee: 0,
                otherFee: 0,
                clearOverdueInterest: 0,
                clearPenaltyOverdueFee: 0,
                clearPenaltyAheadFee: 0,
                settleOverdueInterest: 0,
                settlePenaltyOverdueFee: 0,
                settlePenaltyAheadFee: 0,
                discountOverdueInterest: 0,
                discountPenaltyOverdueFee: 0,
                discountPenaltyAheadFee: 0,
                discountInterest: 0,
                discountServiceFee: 0,
                discountServiceTechFee:0,
                discountOtherFee: 0,
                overdueInterest:0,
                penaltyOverdueFee:0,
                penaltyAheadFee:0,
                serviceTechFee:0
            },
            total: "0.00",
            value_serviceFee: 1,
            value_overdueFee: 1,
            value_penaltyFee: 1,
            value: 1,
            value_otherFee: 1,
        })
        this.setState({
            discount_fee: false
        })
    }
    isContinuationInteger(array) {
        array.sort(this.sortNumber);
        var i = array[0];
        var isContinuation = true;
        for (var e in array) {
            if (array[e] !== i) {
                isContinuation = false;
                break;
            }
            i++;
        }
        return isContinuation;
    }
    sortNumber(a, b) {//升序
        return a - b
    }
    onSelectChange(selectedRowKeys, selectedRow) {
        console.log('selectedRowKeys changed: ', selectedRowKeys, "row:", selectedRow);
        console.log(this.isContinuationInteger(selectedRowKeys))
        this.setState({ selectedRowKeys, selectedRow, isCont: this.isContinuationInteger(selectedRowKeys) });
    };
    getCheckboxProps(e) {
        return { disabled: e.repayPlanStatus === 100 || e.repayPlanStatus === 110 ? false : true }
    }
    //减免 批量
    fee_more_show1() {
        if (!this.isContinuationInteger(this.state.selectedRowKeys)) {
            message.warn("所选订单需为连续订单");
            return;
        }
        var planMoney = this.state.selectedRow, plan_money = 0, remainDiscoun = 0, newArr = [];
        for (var j in planMoney) {
            plan_money += (planMoney[j]["principal"] + planMoney[j]["interest"] + planMoney[j]["serviceFee"] + planMoney[j]["otherFee"] + planMoney[j]["clearOverdueInterest"] + planMoney[j]["settleOverdueInterest"] + planMoney[j]["discountOverdueInterest"] + planMoney[j]["clearPenaltyOverdueFee"] + planMoney[j]["settlePenaltyOverdueFee"] + planMoney[j]["discountPenaltyOverdueFee"] + planMoney[j]["clearPenaltyAheadFee"] + planMoney[j]["settlePenaltyAheadFee"] + planMoney[j]["discountPenaltyAheadFee"]+planMoney[j]["serviceTechFee"]);
            remainDiscoun += (planMoney[j].undiscount ? (planMoney[j].undiscount.creatorType === "ZD" ? (planMoney[j].undiscount.interest + planMoney[j].undiscount.serviceFee + planMoney[j].undiscount.otherFee + planMoney[j].undiscount.overdueFee + planMoney[j].undiscount.penaltyOverdueFee + planMoney[j].undiscount.penaltyAheadFee + planMoney[j].discountPenaltyAheadFee + planMoney[j].discountPenaltyOverdueFee + planMoney[j].discountOverdueInterest + planMoney[j].discountOtherFee + planMoney[j].discountServiceFee + planMoney[j].discountInterest) : (planMoney[j].discountPenaltyAheadFee + planMoney[j].discountPenaltyOverdueFee + planMoney[j].discountOverdueInterest + planMoney[j].discountOtherFee + planMoney[j].discountServiceFee + planMoney[j].discountInterest)) : (planMoney[j].discountPenaltyAheadFee + planMoney[j].discountPenaltyOverdueFee + planMoney[j].discountOverdueInterest + planMoney[j].discountOtherFee + planMoney[j].discountServiceFee + planMoney[j].discountInterest));
            var plan = {
                principal: planMoney[j]["principal"],
                interest: planMoney[j]["interest"],
                serviceFee: planMoney[j]["serviceFee"],
                otherFee: planMoney[j]["otherFee"],
                overdueFee: planMoney[j]["clearOverdueInterest"] + planMoney[j]["settleOverdueInterest"] + planMoney[j]["discountOverdueInterest"],
                penaltyOverdueFee: planMoney[j]["clearPenaltyOverdueFee"] + planMoney[j]["settlePenaltyOverdueFee"] + planMoney[j]["discountPenaltyOverdueFee"],
                penaltyAheadFee: planMoney[j]["clearPenaltyAheadFee"] + planMoney[j]["settlePenaltyAheadFee"] + planMoney[j]["discountPenaltyAheadFee"],
                serviceTechFee:planMoney[j]["serviceTechFee"],
            }
            var discount = {
                interest: planMoney[j].undiscount ? planMoney[j].discountInterest + planMoney[j].undiscount.interest : planMoney[j].discountInterest,
                serviceFee: planMoney[j].undiscount ? planMoney[j].discountServiceFee + planMoney[j].undiscount.serviceFee : planMoney[j].discountServiceFee,
                overdueFee: planMoney[j].undiscount ? planMoney[j].discountOverdueInterest + planMoney[j].undiscount.overdueFee : planMoney[j].discountOverdueInterest,
                penaltyOverdueFee: planMoney[j].undiscount ? planMoney[j].discountOverdueInterest + planMoney[j].undiscount.penaltyOverdueFee : planMoney[j].discountOverdueInterest,
                otherFee: planMoney[j].undiscount ? planMoney[j].discountOtherFee + planMoney[j].undiscount.otherFee : planMoney[j].discountOtherFee,
                penaltyAheadFee: planMoney[j].undiscount ? planMoney[j].discountPenaltyAheadFee + planMoney[j].undiscount.penaltyAheadFee : planMoney[j].discountPenaltyAheadFee,
                principal: 0,
                serviceTechFee:0
            }
            newArr.push({ plan: plan, remainDiscount: discount, key: planMoney[j].phase })
        }
        this.setState({
            discount_fee_more: true,
            plan_money: plan_money,
            discount_money: accDiv(remainDiscoun, 100),
            selectedRow: newArr
        })
        setTimeout(function () {
            var arr = this.child_fee_more.child;
            for (var i in arr) {
                arr[i].setVal();
                arr[i].discount();
            }
        }.bind(this), 100)
    }
    fee_more_show() {
        if (!this.isContinuationInteger(this.state.selectedRowKeys)) {
            message.warn("所选订单需为连续订单");
            return;
        }
        message.success("请稍等。。。")
        var planMoney = this.state.selectedRow, plan_money = 0, remainDiscoun = 0, newArr = [], phaseArr = [];
        for (var j in planMoney) {
            // plan_money += (planMoney[j]["principal"] + planMoney[j]["interest"] + planMoney[j]["serviceFee"] + planMoney[j]["otherFee"] + planMoney[j]["clearOverdueInterest"] + planMoney[j]["settleOverdueInterest"] + planMoney[j]["discountOverdueInterest"] + planMoney[j]["clearPenaltyOverdueFee"] + planMoney[j]["settlePenaltyOverdueFee"] + planMoney[j]["discountPenaltyOverdueFee"] + planMoney[j]["clearPenaltyAheadFee"] + planMoney[j]["settlePenaltyAheadFee"] + planMoney[j]["discountPenaltyAheadFee"]);
            remainDiscoun += (planMoney[j].undiscount ? (planMoney[j].undiscount.creatorType === "ZD" ? (planMoney[j].undiscount.interest + planMoney[j].undiscount.serviceFee + planMoney[j].undiscount.otherFee + planMoney[j].undiscount.overdueFee + planMoney[j].undiscount.penaltyOverdueFee + planMoney[j].undiscount.penaltyAheadFee + planMoney[j].discountPenaltyAheadFee + planMoney[j].discountPenaltyOverdueFee + planMoney[j].discountOverdueInterest + planMoney[j].discountOtherFee + planMoney[j].discountServiceFee + planMoney[j].discountInterest) : (planMoney[j].discountPenaltyAheadFee + planMoney[j].discountPenaltyOverdueFee + planMoney[j].discountOverdueInterest + planMoney[j].discountOtherFee + planMoney[j].discountServiceFee + planMoney[j].discountInterest)) : (planMoney[j].discountPenaltyAheadFee + planMoney[j].discountPenaltyOverdueFee + planMoney[j].discountOverdueInterest + planMoney[j].discountOtherFee + planMoney[j].discountServiceFee + planMoney[j].discountInterest));
            var plan = {
                principal: planMoney[j]["principal"],
                interest: planMoney[j]["interest"],
                serviceFee: planMoney[j]["serviceFee"],
                otherFee: planMoney[j]["otherFee"],
                overdueFee: planMoney[j]["clearOverdueInterest"] + planMoney[j]["settleOverdueInterest"] + planMoney[j]["discountOverdueInterest"],
                penaltyOverdueFee: planMoney[j]["clearPenaltyOverdueFee"] + planMoney[j]["settlePenaltyOverdueFee"] + planMoney[j]["discountPenaltyOverdueFee"],
                penaltyAheadFee: planMoney[j]["clearPenaltyAheadFee"] + planMoney[j]["settlePenaltyAheadFee"] + planMoney[j]["discountPenaltyAheadFee"],
                serviceTechFee:planMoney[j]["serviceTechFee"],
            }
            var discount = {
                interest: planMoney[j].undiscount ? planMoney[j].discountInterest + planMoney[j].undiscount.interest : planMoney[j].discountInterest,
                serviceFee: planMoney[j].undiscount ? planMoney[j].discountServiceFee + planMoney[j].undiscount.serviceFee : planMoney[j].discountServiceFee,
                overdueFee: planMoney[j].undiscount ? planMoney[j].discountOverdueInterest + planMoney[j].undiscount.overdueFee : planMoney[j].discountOverdueInterest,
                penaltyOverdueFee: planMoney[j].undiscount ? planMoney[j].discountOverdueInterest + planMoney[j].undiscount.penaltyOverdueFee : planMoney[j].discountOverdueInterest,
                otherFee: planMoney[j].undiscount ? planMoney[j].discountOtherFee + planMoney[j].undiscount.otherFee : planMoney[j].discountOtherFee,
                penaltyAheadFee: planMoney[j].undiscount ? planMoney[j].discountPenaltyAheadFee + planMoney[j].undiscount.penaltyAheadFee : planMoney[j].discountPenaltyAheadFee,
                principal: 0,
                serviceTechFee:0
            }
            newArr.push({ plan: plan, remainDiscount: discount, key: planMoney[j].phase })
            phaseArr.push(planMoney[j].phase)
        }
        var time = new Date();
        var rqd = {
            phaseStart: phaseArr[0],
            phaseEnd: phaseArr[phaseArr.length - 1],
            contractNo: this.contractNo,
            clearingTime: format_time(time),
            repayTriggerType: "USER"
        }
        axios_loanMgnt.post(repay_deduction_count, rqd).then(e => {
            if (!e.code) {
                var data = e.data;
                for (var i in data) {
                    newArr.forEach(item => {
                        if (item.key === data[i].phase) {
                            item.plan = {
                                principal: data[i]["principal"],
                                interest: data[i]["interest"],
                                serviceFee: data[i]["serviceFee"],
                                otherFee: data[i]["otherFee"],
                                overdueFee: data[i]["overdueInterest"],
                                penaltyOverdueFee: data[i]["penaltyOverdueFee"],
                                penaltyAheadFee: data[i]["penaltyAheadFee"],
                                serviceTechFee:data[i]["serviceTechFee"]
                            }
                        }
                    })
                    plan_money += Number(data[i].interest) + Number(data[i].principal) + Number(data[i].otherFee) + Number(data[i].overdueInterest) + Number(data[i].penaltyAheadFee) + Number(data[i].penaltyOverdueFee) + Number(data[i].serviceFee)+ Number(data[i].serviceTechFee)
                }
                this.setState({
                    discount_fee_more: true,
                    plan_money: plan_money,
                    discount_money: accDiv(remainDiscoun, 100),
                    selectedRow: newArr
                })
            }
        })
       
        setTimeout(function () {
            var arr = this.child_fee_more.child;
            for (var i in arr) {
                arr[i].setVal();
                arr[i].discount();
            }
        }.bind(this), 100)
    }
    fee_cancel_more() {
        this.setState({
            discount_fee_more: false,
            plan_money: 0,
            discount_money: 0,
            selectedRowKeys: [],
        })
        this.child_fee_more.props.form.setFieldsValue({ "purpose": "" });
        var arr = this.child_fee_more.child;
        for (var i in arr) {
            arr[i].props.form.setFieldsValue({ "interestMoney": "" });
            arr[i].discount();
        }
    }
    fee_moro_count() {
        var arr = this.child_fee_more.child, money = 0;
        // var money=this.state.discount_money;
        for (var i in arr) {
            money += Number(arr[i].money);
        }
        this.setState({
            discount_money: money
        })
    }
    fee_more_save() {
        // console.log(this.child_fee_more.child);
        // console.log(this.child_fee_more.child[1].get_val())
        var arr = this.child_fee_more.child, valArr = [];
        var purpose = this.child_fee_more.props.form.getFieldValue("purpose");
        if (!purpose) {
            message.warn("请填写申请原因");
            return;
        }
        for (var a in arr) {
            if (!arr[a].get_val()) {
                break;
            }
            valArr.push(arr[a].get_val())
        }
        console.log(arr.length, valArr.length);
        if (arr.length !== valArr.length) {
            return;
        }
        var map = {}, dest = [];
        for (var i = 0; i < valArr.length; i++) {
            var ai = valArr[i];
            if (!map[ai.phase]) {
                dest.push({
                    phase: ai.phase,
                    discountFee: {
                        [ai.type]: ai.amount
                    }
                });
                map[ai.phase] = ai.phase;
            } else {
                for (var j = 0; j < dest.length; j++) {
                    var dj = dest[j];
                    if (Number(dj.phase) === Number(ai.phase)) {
                        // dj.data.push(ai);
                        dj.discountFee[ai.type] = ai.amount
                        break;
                    }
                }
            }
        }
        var rqd = {};
        rqd.contractNo = this.contractNo;
        rqd.discountPhaseList = dest;
        var parammeters = {
            discountParams: JSON.stringify(rqd),
            purpose: purpose
        }
        axios_postloan.post(afterloan_overdue_discount, parammeters).then(e => {
            if (!e.code) {
                // message.success("减免申请成功");
                this.fee_cancel_more();
                this.getDetail();
                this.setState({
                    // selectedRowKeys:[],
                    fee_visible: true,
                    text_type: "fee"
                })
            }
        })
        // console.log(parammeters)
    }
    fee_more(e) {
        this.child_fee_more = e;
    }
    //划扣计算器
    deduction_count(phaseStart, phaseEnd, discount,repayTime) {
        var time = repayTime||new Date();
        var rqd = {
            phaseStart: phaseStart,
            phaseEnd: phaseEnd,
            contractNo: this.contractNo,
            clearingTime: format_time(time),
            repayTriggerType: "USER"
        }
        axios_loanMgnt.post(repay_deduction_count, rqd).then(e => {
            if (!e.code) {
                var data = e.data, money = 0;
                for (var i in data) {
                    money += Number(data[i].interest) + Number(data[i].principal) + Number(data[i].otherFee) + Number(data[i].overdueInterest) + Number(data[i].penaltyAheadFee) + Number(data[i].penaltyOverdueFee) + Number(data[i].serviceFee)+Number(data[i].serviceTechFee)
                }
                console.log(money + "-" + discount)
                this.setState({
                    totalRepayAmount: money - discount
                })
            }
        })
    }
    //选择还款日期
    change_deduction_time(time){
        this.setState({repayDate:time})
        this.deduction_count(this.state.deduction_start,this.state.deduction_end,this.state.deduction_remain,time)
    }
    //人工划扣
    deduction_show(data) {
        // var plan=(data["principal"]+data["interest"]+data["serviceFee"]+data["otherFee"]+data["clearOverdueInterest"]+data["settleOverdueInterest"]+data["discountOverdueInterest"]+data["clearPenaltyOverdueFee"]+data["settlePenaltyOverdueFee"]+data["discountPenaltyOverdueFee"]+data["clearPenaltyAheadFee"]+data["settlePenaltyAheadFee"]+data["discountPenaltyAheadFee"]);
        var remainDiscount = 0;
        // var remainDiscount=(data.undiscount?(data.undiscount.interest+data.undiscount.serviceFee+data.undiscount.otherFee+data.undiscount.overdueFee+data.undiscount.penaltyOverdueFee+data.undiscount.penaltyAheadFee+data.discountPenaltyAheadFee+data.discountPenaltyOverdueFee+data.discountOverdueInterest+data.discountOtherFee+data.discountServiceFee+data.discountInterest):(data.discountPenaltyAheadFee+data.discountPenaltyOverdueFee+data.discountOverdueInterest+data.discountOtherFee+data.discountServiceFee+data.discountInterest));
        if (data.undiscount && data.undiscount_other) {
            remainDiscount = data.undiscount.interest + data.undiscount.serviceFee + data.undiscount.otherFee + data.undiscount.overdueFee + data.undiscount.penaltyOverdueFee + data.undiscount.penaltyAheadFee + data.discountPenaltyAheadFee + data.discountPenaltyOverdueFee + data.discountOverdueInterest + data.discountOtherFee + data.discountServiceFee + data.discountInterest + data.undiscount_other.interest + data.undiscount_other.serviceFee + data.undiscount_other.otherFee + data.undiscount_other.overdueFee + data.undiscount_other.penaltyOverdueFee + data.undiscount_other.penaltyAheadFee+data.discountServiceTechFee+data.undiscount.serviceTechFee||0+data.undiscount_other.serviceTechFee||0
        } else {
            if (data.undiscount) {
                remainDiscount = data.undiscount.interest + data.undiscount.serviceFee + data.undiscount.otherFee + data.undiscount.overdueFee + data.undiscount.penaltyOverdueFee + data.undiscount.penaltyAheadFee + data.discountPenaltyAheadFee + data.discountPenaltyOverdueFee + data.discountOverdueInterest + data.discountOtherFee + data.discountServiceFee + data.discountInterest+data.discountServiceTechFee+data.undiscount.serviceTechFee||0
            } else if (data.undiscount_other) {
                remainDiscount = data.discountPenaltyAheadFee + data.discountPenaltyOverdueFee + data.discountOverdueInterest + data.discountOtherFee + data.discountServiceFee + data.discountInterest +data.discountServiceTechFee+ data.undiscount_other.interest + data.undiscount_other.serviceFee + data.undiscount_other.otherFee + data.undiscount_other.overdueFee + data.undiscount_other.penaltyOverdueFee + data.undiscount_other.penaltyAheadFee+data.undiscount_other.serviceTechFee||0
            } else {
                remainDiscount = data.discountPenaltyAheadFee + data.discountPenaltyOverdueFee + data.discountOverdueInterest + data.discountOtherFee + data.discountServiceFee + data.discountInterest+data.discountServiceTechFee
            }
        }
        this.setState({
            deduction_visible: true,
            applyPhases: [data.phase],
            // totalRepayAmount:plan-remainDiscount,
            deduction_start:data.phase,
            deduction_end:data.phase,
            deduction_remain:remainDiscount
        })
        this.deduction_count(data.phase, data.phase, remainDiscount)
    }
    deduction_more_show() {
        if (!this.isContinuationInteger(this.state.selectedRowKeys)) {
            message.warn("所选订单需为连续订单");
            return;
        }
        var planMoney = this.state.selectedRow; console.log(planMoney)
        var phaseArr = [], remainDiscount = 0;
        for (var j in planMoney) {
            // var add=(data[i].plan.principal+data[i].plan.interest+data[i].plan.serviceFee+data[i].plan.otherFee+data[i].expect.overdueFee+data[i].expect.penaltyOverdueFee+data[i].expect.penaltyAheadFee);
            // amount+=(planMoney[j]["principal"]+planMoney[j]["interest"]+planMoney[j]["serviceFee"]+planMoney[j]["otherFee"]+planMoney[j]["clearOverdueInterest"]+planMoney[j]["settleOverdueInterest"]+planMoney[j]["discountOverdueInterest"]+planMoney[j]["clearPenaltyOverdueFee"]+planMoney[j]["settlePenaltyOverdueFee"]+planMoney[j]["discountPenaltyOverdueFee"]+planMoney[j]["clearPenaltyAheadFee"]+planMoney[j]["settlePenaltyAheadFee"]+planMoney[j]["discountPenaltyAheadFee"]);;
            // remainDiscount+=(planMoney[j].undiscount?(planMoney[j].undiscount.interest+planMoney[j].undiscount.serviceFee+planMoney[j].undiscount.otherFee+planMoney[j].undiscount.overdueFee+planMoney[j].undiscount.penaltyOverdueFee+planMoney[j].undiscount.penaltyAheadFee+planMoney[j].discountPenaltyAheadFee+planMoney[j].discountPenaltyOverdueFee+planMoney[j].discountOverdueInterest+planMoney[j].discountOtherFee+planMoney[j].discountServiceFee+planMoney[j].discountInterest):(planMoney[j].discountPenaltyAheadFee+planMoney[j].discountPenaltyOverdueFee+planMoney[j].discountOverdueInterest+planMoney[j].discountOtherFee+planMoney[j].discountServiceFee+planMoney[j].discountInterest));

            if (planMoney[j].undiscount && planMoney[j].undiscount_other) {
                remainDiscount += planMoney[j].undiscount.interest + planMoney[j].undiscount.serviceFee + planMoney[j].undiscount.otherFee + planMoney[j].undiscount.overdueFee + planMoney[j].undiscount.penaltyOverdueFee + planMoney[j].undiscount.penaltyAheadFee + planMoney[j].discountPenaltyAheadFee + planMoney[j].discountPenaltyOverdueFee + planMoney[j].discountOverdueInterest + planMoney[j].discountOtherFee + planMoney[j].discountServiceFee + planMoney[j].discountInterest + planMoney[j].undiscount_other.interest + planMoney[j].undiscount_other.serviceFee + planMoney[j].undiscount_other.otherFee + planMoney[j].undiscount_other.overdueFee + planMoney[j].undiscount_other.penaltyOverdueFee + planMoney[j].undiscount_other.penaltyAheadFee+planMoney[j].discountServiceTechFee+planMoney[j].undiscount.serviceTechFee||0+planMoney[j].undiscount_other.serviceTechFee||0
            } else {
                if (planMoney[j].undiscount) {
                    remainDiscount += planMoney[j].undiscount.interest + planMoney[j].undiscount.serviceFee + planMoney[j].undiscount.otherFee + planMoney[j].undiscount.overdueFee + planMoney[j].undiscount.penaltyOverdueFee + planMoney[j].undiscount.penaltyAheadFee + planMoney[j].discountPenaltyAheadFee + planMoney[j].discountPenaltyOverdueFee + planMoney[j].discountOverdueInterest + planMoney[j].discountOtherFee + planMoney[j].discountServiceFee + planMoney[j].discountInterest+planMoney[j].discountServiceTechFee+planMoney[j].undiscount.serviceTechFee||0
                } else if (planMoney[j].undiscount_other) {
                    remainDiscount += planMoney[j].discountPenaltyAheadFee + planMoney[j].discountPenaltyOverdueFee + planMoney[j].discountOverdueInterest + planMoney[j].discountOtherFee + planMoney[j].discountServiceFee + planMoney[j].discountInterest + planMoney[j].undiscount_other.interest + planMoney[j].undiscount_other.serviceFee + planMoney[j].undiscount_other.otherFee + planMoney[j].undiscount_other.overdueFee + planMoney[j].undiscount_other.penaltyOverdueFee + planMoney[j].undiscount_other.penaltyAheadFee+planMoney[j].discountServiceTechFee+planMoney[j].undiscount_other.serviceTechFee||0
                    console.log("2"+remainDiscount)

                } else {
                    remainDiscount += planMoney[j].discountPenaltyAheadFee + planMoney[j].discountPenaltyOverdueFee + planMoney[j].discountOverdueInterest + planMoney[j].discountOtherFee + planMoney[j].discountServiceFee + planMoney[j].discountInterest+planMoney[j].discountServiceTechFee
                    console.log("3"+remainDiscount)

                }
            }
            phaseArr.push(planMoney[j].phase)
        }
        this.setState({
            deduction_visible: true,
            applyPhases: phaseArr,
            // totalRepayAmount:amount-remainDiscount
            deduction_start:phaseArr[0],
            deduction_end:phaseArr[phaseArr.length - 1],
            deduction_remain:remainDiscount
        })
        console.log(remainDiscount)
        this.deduction_count(phaseArr[0], phaseArr[phaseArr.length - 1], remainDiscount)
    }
    deduction_cancel() {
        this.setState({
            deduction_visible: false,
            totalRepayAmount: 0,
            repayDate:""
        })
        this.deduction_child.setState({
            repayDate:new Date()
        })
    }
    deduction_save() {
        this.deduction_child.props.form.validateFields((err, val) => {
            if (!err) {
                val.contractNo = this.contractNo;
                val.phases = this.state.applyPhases;
                val.amount = accMul(val.amount, 100); 
                val.repayTime=this.state.repayDate?format_time(this.state.repayDate):format_time(new Date());
                console.log(val);
                // return 
                axios_postloan.post(afterloan_overdue_deduction, val).then(e => {
                    if (!e.code) {
                        this.setState({
                            fee_visible: true,
                            text_type: "deduction",
                            selectedRowKeys: []
                        })
                        // message.warn("划扣申请成功");
                        this.deduction_cancel();
                        this.getDetail();
                    }
                })
            }
        })
    }
    ref_deduction(e) {
        this.deduction_child = e
    }
    //
    fee_suc_cancel() {
        this.setState({
            fee_visible: false
        })
    }
    setColor(data) {
        if (data.repayPlanStatus === 830 || data.repayPlanStatus === 860 || data.repayPlanStatus === 810 || data.repayPlanStatus === 811) {
            return "repay no_chose";
        }
        if (data.phase === "合计") {
            return "no_chose";
        }
    }
    showTotal(){
        return "共"+this.state.pageTotal+"条数据"
    }
    render() {
        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.onSelectChange.bind(this),
            getCheckboxProps: this.getCheckboxProps.bind(this)
        };
        const table_repay_props = {
            rowKey: "phase",
            columns: this.columnsRepay,
            dataSource: this.state.dataRepay,
            pagination: false,
            rowSelection: rowSelection,
            scroll: { x: 3800, y: window.innerHeight - 310 },
            rowClassName: this.setColor.bind(this)
        }
        const table_urge_props = {
            rowKey: "key",
            columns: this.columnsUrge,
            dataSource: this.state.dataUrge,
            pagination: false
        }
        let pagination = {
            total : this.state.pageTotal,
            current : this.state.pageCurrent,
            pageSize : 10,
            showTotal:this.showTotal.bind(this),
            onChange : this.page_up.bind(this),
            size:"small"
        }
        const table_repay_record = {
            rowKey: "key",
            columns: this.columnsRecord,
            dataSource: this.state.dataRecord,
            pagination: pagination
        }
        const fee = {
            title: "减免确认单",
            visible: this.state.discount_fee,
            footer: <Button type="primary" onClick={this.fee_save.bind(this)}>确认</Button>,
            onCancel: this.fee_cancel.bind(this),
            // width: 900,
            width: 650,
            maskClosable: false
        }
        const feeShow = {
            title: null,
            visible: this.state.fee_visible,
            footer: <Button size="small" type="primary" onClick={this.fee_suc_cancel.bind(this)}>我知道了</Button>,
            maskClosable: false,
            // onCancel:this.fee_suc_cancel.bind(this),
            closable: false
        }
        const feeMore = {
            title: "减免确认单",
            visible: this.state.discount_fee_more,
            footer: <Button type="primary" onClick={this.fee_more_save.bind(this)}>确认</Button>,
            onCancel: this.fee_cancel_more.bind(this),
            // width: 1000,
            width: 780,
            maskClosable: false,
            bodyStyle: {
                height: (document.body.clientHeight - 200) + "px",
                overflowY: "auto"
            }
        }
        const deduction = {
            title: "人工划扣申请",
            visible: this.state.deduction_visible,
            footer: <Button type="primary" onClick={this.deduction_save.bind(this)}>确认</Button>,
            onCancel: this.deduction_cancel.bind(this),
            maskClosable: false,
        }
        return (
            <div className="content" style={{ marginBottom: "0" }}>
                <Tabs defaultActiveKey="1" className="sh_tab">
                    <TabPane tab="还款&催收信息" key="1">
                        <Row className="detail-content">
                            <div className="detail-title"><div style={{ width: "100%" }}>还款信息&emsp;
                        {/* <Permissions type="primary" onClick={this.deduction_more_show.bind(this)} disabled={this.state.selectedRowKeys.length > 0 ? false : true} style={{float:"right"}} server={global.AUTHSERVER.loan.key} tag="button" permissions={global.AUTHSERVER.loan.access.pl_repay_add}>批量人工划扣</Permissions>&emsp;
                            <Permissions type="primary" onClick={this.fee_more_show.bind(this)} disabled={this.state.selectedRowKeys.length > 0 ? false : true} style={{float:"right",marginRight:"10px"}} server={global.AUTHSERVER.loan.key} tag="button" permissions={global.AUTHSERVER.loan.access.pl_discount_add}>批量减免申请</Permissions> */}

                                <Button type="primary" onClick={this.deduction_more_show.bind(this)} disabled={this.state.selectedRowKeys.length > 0 ? false : true} style={{ float: "right" }} >批量人工划扣</Button>&emsp;
                            <Button type="primary" onClick={this.fee_more_show.bind(this)} disabled={this.state.selectedRowKeys.length > 0 ? false : true} style={{ float: "right", marginRight: "10px" }} >批量减免申请</Button>

                            </div>
                            </div>
                            <div className="detail-body">

                                <Table {...table_repay_props} bordered />
                            </div>
                        </Row>
                        <Row><Contact contactList={this.state.contactList} contractNo={this.contractNo} gelist={this.getReminder.bind(this)} contractId={this.contractId} locations={this.props.location} /></Row>
                        <Row className="detail-content">
                            <div className="detail-title"><div style={{ width: "100%" }}>催收记录&emsp;
                        <div style={{ float: "right" }}>
                                    {/* <Permissions type="primary" onClick={this.modalShow.bind(this)} server={global.AUTHSERVER.loan.key} tag="button" permissions={global.AUTHSERVER.loan.access.pl_reminder_add}>添加催记</Permissions> */}
                                </div>

                            </div></div>
                            <Col className="detail-body">
                                <Table {...table_urge_props} bordered rowKey="id" />
                            </Col>
                        </Row>
                        <Row className="detail-content">
                            <div className="detail-title"><span>还款记录
                        </span></div>
                            <Col className="detail-body">
                                <Table {...table_repay_record} bordered />
                            </Col>
                        </Row>
                        <UrgeModal contractNo={this.contractNo} visible={this.state.visible} bindcancel={this.modalHide.bind(this)} gelist={this.getReminder.bind(this)} />
                        <Modal {...fee}>
                            <Fee orderNo={this.state.fee_orderNo} period={this.state.fee_period} onRef={this.ref_fee.bind(this)} serviceTechFee />

                        </Modal>
                        <Modal {...feeMore}>
                            <FeeMore data={this.state.selectedRow} onRef={this.fee_more.bind(this)} discount={this.fee_moro_count.bind(this)} discount_money={this.state.discount_money} plan_money={this.state.plan_money} />
                        </Modal>
                        <Modal {...feeShow}>
                            <p>{this.state.text_type === "fee" ? "减免申请已提交，审批人员审批通过后才生效。" : "人工划扣申请已提交，审批人员审批通过后才生效。"}</p>
                        </Modal>
                        <Modal {...deduction}>
                            <Deduction data={this.state.selectedRow} onRef={this.ref_deduction.bind(this)} amount={this.state.totalRepayAmount} repayDate={this.change_deduction_time.bind(this)} />
                        </Modal>
                    </TabPane>
                    <TabPane tab="合同信息" key="2">
                        <div className="detail-content">
                            <div className="detail-body">
                                <LineTable line={3} data-columns={this.columns_contract_bmd} data-source={this.state.contractInfo} />
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tab="进件详情" key="3" style={{ padding: "0px" }}>
                        <Particulars orderNo={this.domainNo} product={this.productLine === "bmd-loancoop-capital" ? "zyzj" : "cashloan"} />
                    </TabPane>
                    <TabPane tab="用户信息" key="4">
                        <UserInfo contract_no={this.contractNo} />
                    </TabPane>
                </Tabs>
                <style>{`
                .repay{
                    background:#fbfbfb
                }
                .no_chose .ant-table-selection-column span{
                    display:none
                }
            `}</style>
            </div>
        )
    }
}
export default ComponentRoute(Overdue);