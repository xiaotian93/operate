import React, { Component } from 'react';
import { Table , Row , Col , Tabs , Button , Modal , Input , message , Select , DatePicker , Form } from 'antd';
import moment from 'moment'

// import LineTable from '../../ui/Line_Table';
import Particulars from '../../particulars/particulars';
import { axios_repay ,axios_xjd,axios_loan} from '../../../ajax/request';
import { repay_detail , repay , under_repay_plan_select_total ,bmd_repay_discount_confirm,repay_contract_detail,repay_contract_plan,repay_contract_undiscount} from '../../../ajax/api';
import { format_table_data , format_date } from '../../../ajax/tool';
import Permissions from '../../../templates/Permissions';
import Panel from '../../../templates/Panel';
import Fee from '../elements/discountFee';
import LineTable from '../../../templates/TableCol_4';
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

class Detail extends Component{
    constructor(props) {
        super(props);
        let paths = this.props.location.pathname.split("/");
        this.state = {
            plan:[],
            selectValue:"",
            dateValue:undefined,
            contract_no:this.props.location.query.contract_no,
            appKey:this.props.location.query.appKey,
            type:this.props.location.query.type,
            pay_type:paths[2],
            title:paths[3],
            pre_pay:{
                value:'',
                remark:"",
                total_money:0,
                total_principal:0,
                total_interest:0,
                total_defautInterest:0,
                total_serviceCharge:0,
                total_overdueFee:0,
                serial_number:"",
                show:false,
                ids:[],
                loading:false
            },
            loading:false
        };
    }
    componentWillMount(){
        let industryStrs = {"1":"居民服务和其他服务业","2":"建筑业","3":"交通运输、仓储和邮政业","4":"农、林、牧、渔业","5":"采矿业","6":"制造业","7":"电力、燃气及水的生产和供应业","8":"信息传输、计算机服务和软件业","9":"批发和零售业","10":"住宿和餐饮业","11":"房地产业","12":"租赁和商务服务业","13":"其他"}
        let purposeStrs = {"1":"流动资金贷款 ","2":"固定资产投资贷款 ","3":"其他"}
        let loan_typeStrs = {"1":"信用  ","2":"保证  ","3":"抵押   ","4":"质押  ","5":"其他"}
        let pay_status_class = {"0":"","1":"text-success","2":"text-danger","3":"text-orange","4":"text-success"}
        this.columns = [
            {
                title: '期数',
                width:70,
                dataIndex: 'phase'
            },
            {
                title: '应还日期',
                width:100,
                dataIndex: 'repayDate'
            },
            {
                title: '应还本金',
                width:100,
                render:data=>{
                    return data.principal.money()
                }
            },
            {
                title: '应还利息',
                width:100,
                render:data=>{
                    return data.interest.money()
                }
            },
            {
                title: '应还服务费',
                width:100,
                render:data=>{
                    return data.serviceFee.money()
                }
            },
            {
                title: '应还其他费用',
                width:100,
                render:data=>{
                    return data.otherFee.money()
                }
			},
			{
                title: '应还逾期罚息',
                width:100,
                render:data=>{
                    return data.overdueFee.money()
                }
            },
            {
                title: '应还违约金',
                width:100,
                render:data=>{
                    return data.penaltyFee.money()
                }
			},
            {
                title: '应还提前结清手续费',
                width:100,
                render:data=>{
                    return data.repayAheadPenaltyFee.money()
                }
			},
			{
                title: '应还合计',
                width:100,
                render:data=>{
                    return data.needPayMoney.money()
                }
            },
            {
                title: '已还合计',
                width:100,
                render:data=>{
                    return data.returnMoney.money()
                }
            },
            {
                title: '已还本金',
                width:100,
                render:data=>{
                    return data.returnPrincipal.money()
                }
            },
            {
                title: '已还利息',
                width:100,
                render:data=>{
                    return data.returnInterest.money()
                }
            },
            {
                title: '已还服务费',
                width:100,
                render:data=>{
                    return data.returnServiceFee.money()
                }
            },
            {
                title: '已还其他费用',
                width:100,
                render:data=>{
                    return data.returnOtherFee.money()
                }
			},
			{
                title: '已还逾期罚息',
                width:100,
                render:data=>{
                    return data.returnOverdueFee.money()
                }
            },
            {
                title: '减免逾期罚息',
                width:100,	
                render:data=>{
                    return data.discountOverdueFee.money()
                }
			},
            {
                title: '已还违约金',
                width:100,
                render:data=>{
                    return data.returnPenaltyFee.money()
                }
			},
            {
                title: '已还提前结清手续费',
                width:100,
                render:data=>{
                    return data.returnRepayAheadPenaltyFee.money()
                }
			},
            {
                title: '实际还款日期',
                width:100,
                dataIndex: 'returnDate'
            },
            {
                title: '还款状态',
                width:100,
                render:(data)=>{
                    return <span className={pay_status_class[data.status]}>{data.statusStr}</span>
                }
            },
            {
                title: '操作',
                width:100,
                render:(data)=>{
                    var btn=[];
                    if(!data.phaseStr){
                        return;
                    }
                    if(!data.returnDate&&this.state.type==="cashloan"){
                        btn.push(<span key={data.phaseStr}><Permissions server={global.AUTHSERVER.loan.key} tag="button" type="primary" size="small" className="f3 text-blue" onClick={()=>(this.discount_fee(data))}>减免</Permissions>&emsp;</span>)
                    }
                    if(data.phase===(this.show_pay+1)){
                        btn.push(<Permissions key={data.phaseStr+"1"} server={global.AUTHSERVER.loan.key} tag="button" type="primary" size="small" className="f3 text-blue" onClick={()=>(this.pay_click(data))}>确认还款</Permissions>)
                    }else{
                        return btn
                    }
                    return btn;
                }
            }
        ]
        this.columns_bmd = [
            {
                title: '期数',
                width:70,
                dataIndex: 'phase'
            },
            {
                title: '应还日期',
                width:100,
                dataIndex: 'repayDate',
                render:e=>{
                    var time=e.split(" ");
                    return time[0];
                }
            },
            {
                title: '应还本金',
                dataIndex:"principal",
                width:100,
                render:data=>{
                    return data?data.money():"0.00"
                }
            },
            {
                title: '应还利息',
                width:100,
                dataIndex:"interest",
                render:data=>{
                    return data?data.money():"0.00"
                }
            },
            {
                title: '应还服务费',
                width:100,
                dataIndex:"serviceFee",
                render:data=>{
                    return data?data.money():"0.00"
                }
            },
            {
                title: '应还其他费用',
                width:100,
                dataIndex:"otherFee",
                render:data=>{
                    return data?data.money():"0.00"
                }
			},
			{
                title: '应还逾期罚息',
                width:100,
                // dataIndex:"expect.overdueFee",
                render:data=>{
                    var num=data.clearOverdueInterest+data.settleOverdueInterest+data.discountOverdueInterest;
                    return num?num.money():"0.00"
                }
            },
            {
                title: '应还违约金',
                width:100,
                // dataIndex:"expect.penaltyOverdueFee",
                render:data=>{
                    var num=data.clearPenaltyOverdueFee+data.settlePenaltyOverdueFee+data.discountPenaltyOverdueFee;
                    return num?num.money():"0.00"
                }
			},
            {
                title: '应还提前结清手续费',
                width:100,
                // dataIndex:"expect.penaltyAheadFee",
                render:data=>{
                    var num=data.clearPenaltyAheadFee+data.settlePenaltyAheadFee+data.discountPenaltyAheadFee;
                    return num?num.money():"0.00"
                }
			},
			{
                title: '应还合计',
                width:100,
                render:data=>{
                    return (data.principal+data.interest+data.serviceFee+data.otherFee+data.clearOverdueInterest+data.settleOverdueInterest+data.discountOverdueInterest+data.clearPenaltyOverdueFee+data.settlePenaltyOverdueFee+data.discountPenaltyOverdueFee+data.clearPenaltyAheadFee+data.settlePenaltyAheadFee+data.discountPenaltyAheadFee).money();
                }
            },
            {
                title: '已还合计',
                width:100,
                // dataIndex:"actual.sum",
                render:data=>{
                    return (data.settlePrincipal+data.settleInterest+data.settleServiceFee+data.settleOtherFee+data.settleOverdueInterest+data.settlePenaltyOverdueFee+data.settlePenaltyAheadFee).money()
                }
            },
            {
                title: '已还本金',
                width:100,
                dataIndex:"settlePrincipal",
                render:data=>{
                    return data?data.money():"0.00"
                }
            },
            {
                title: '已还利息',
                width:100,
                dataIndex:"settleInterest",
                render:data=>{
                    return data?data.money():"0.00"
                }
            },
            {
                title: '已还服务费',
                width:100,
                dataIndex:"settleServiceFee",
                render:data=>{
                    return data?data.money():"0.00"
                }
            },
            {
                title: '已还其他费用',
                dataIndex:"settleOtherFee",
                width:100,
                render:data=>{
                    return data?data.money():"0.00"
                }
			},
			{
                title: '已还逾期罚息',
                dataIndex:"settleOverdueInterest",
                width:100,
                render:data=>{
                    return data?data.money():"0.00"
                }
            },
            {
                title: '已还违约金',
                width:100,
                dataIndex:"settlePenaltyOverdueFee",
                render:data=>{
                    return data?data.money():"0.00"
                }
			},
            {
                title: '已还提前结清手续费',
                width:100,
                dataIndex:"settlePenaltyAheadFee",
                render:data=>{
                    return data?data.money():"0.00"
                }
			},
            {
                title: '减免利息',
                width:100,
                render:data=>{
                    if(data.undiscount&&data.undiscount_other){
                        return (data.discountInterest+data.undiscount.interest+data.undiscount_other.interest).money()
                    }else{
                        if(data.undiscount){
                            return (data.discountInterest+data.undiscount.interest).money()
                        }else if(data.undiscount_other){
                            return (data.discountInterest+data.undiscount_other.interest).money()
                        }else{
                            return (data.discountInterest).money()
                        }
                    }
                }
            },
            {
                title: '减免服务费',
                width:100,
                render:data=>{
                    if(data.undiscount&&data.undiscount_other){
                        return (data.discountServiceFee+data.undiscount.serviceFee+data.undiscount_other.serviceFee).money()
                    }else{
                        if(data.undiscount){
                            return (data.discountServiceFee+data.undiscount.serviceFee).money()
                        }else if(data.undiscount_other){
                            return (data.discountServiceFee+data.undiscount_other.serviceFee).money()
                        }else{
                            return (data.discountServiceFee).money()
                        }
                    }
                }
            },
            {
                title: '减免其他费用',
                width:100,
                render:data=>{
                    if(data.undiscount&&data.undiscount_other){
                        return (data.discountOtherFee+data.undiscount.otherFee+data.undiscount_other.otherFee).money()
                    }else{
                        if(data.undiscount){
                            return (data.discountOtherFee+data.undiscount.otherFee).money()
                        }else if(data.undiscount_other){
                            return (data.discountOtherFee+data.undiscount_other.otherFee).money()
                        }else{
                            return (data.discountOtherFee).money()
                        }
                    }
                }
            },
            {
                title: '减免逾期罚息',
                width:100,
                render:data=>{
                    if(data.undiscount&&data.undiscount_other){
                        return (data.discountOverdueInterest+data.undiscount.overdueFee+data.undiscount_other.overdueFee).money()
                    }else{
                        if(data.undiscount){
                            return (data.discountOverdueInterest+data.undiscount.overdueFee).money()
                        }else if(data.undiscount_other){
                            return (data.discountOverdueInterest+data.undiscount_other.overdueFee).money()
                        }else{
                            return (data.discountOverdueInterest).money()
                        }
                        
                    }
                }
            },
            {
                title: '减免违约金',
                width:100,
                render:data=>{
                    if(data.undiscount&&data.undiscount_other){
                        return (data.discountPenaltyOverdueFee+data.undiscount.penaltyOverdueFee+data.undiscount_other.penaltyOverdueFee).money()
                    }else{
                        if(data.undiscount){
                            return (data.discountPenaltyOverdueFee+data.undiscount.penaltyOverdueFee).money()
                        }else if(data.undiscount_other){
                            return (data.discountPenaltyOverdueFee+data.undiscount_other.penaltyOverdueFee).money()
                        }else{
                            return (data.discountPenaltyOverdueFee).money()
                        }
                        
                    }
                }
            },
            {
                title: '减免提前结清手续费',
                width:100,
                render:data=>{
                    if(data.undiscount&&data.undiscount_other){
                        return (data.discountPenaltyAheadFee+data.undiscount.penaltyAheadFee+data.undiscount_other.penaltyAheadFee).money()
                    }else{
                        if(data.undiscount){
                            return (data.discountPenaltyAheadFee+data.undiscount.penaltyAheadFee).money()
                        }else if(data.undiscount_other){
                            return (data.discountPenaltyAheadFee+data.undiscount_other.penaltyAheadFee).money()
                        }else{
                            return (data.discountPenaltyAheadFee).money()
                        }
                        
                    }
                }
			},
            
            {
                title: '实际还款日期',
                width:100,
                dataIndex: 'lastSettleTime'
            },
            {
                title: '还款状态',
                width:100,
                render:(data)=>{
                    if(data.phase==="合计"){
                        return;
                    }
                    const type={100:"当期待还款",830:"当期正常还款",110:"当期逾期未还",860:"当期逾期还款",810:"当期提前还款",811:"当期提前还款"}
                    var status=data.repayPlanStatus;
                    if(status===100||status===110){
                        return data.overdueDays>0?"当期逾期未还":"当期待还款"
                    }else{
                        return type[status];
                    }
                }
            },
           
        ]
        let period_type = {1: "日", 2: "周", 3: "月", 4: "季度", 5: "年"}
        // this.columns_contract = [
        //     {
        //         title: '产品名称',
        //         dataIndex: 'loanSystem.name'
        //     },
        //     {
        //         title: '',
        //         dataIndex: 'blank1'
        //     },
        //     {
        //         title: '订单编号',
        //         dataIndex: 'contactInfo.domainNo'
        //     },
        //     {
        //         title: '合同编号',
        //         dataIndex: 'contactInfo.contractNo'
        //     },
        //     {
        //         title: '',
        //         dataIndex: 'blank1'
        //     },
        //     {
        //         title: '合同状态',
        //         dataIndex: 'contactInfo.statusStr'
        //     },
        //     {
        //         title: '合同名称',
        //         dataIndex: 'mpDefault.loanContractName'
        //     },
        //     {
        //         title: '',
        //         dataIndex: 'blank1'
        //     },
        //     {
        //         title: '合同签订日期',
        //         dataIndex: 'mpDefault.signDate'
        //     },
        //     {
        //         title: '借款方',
        //         className: "grey",
        //         dataIndex: 'contactInfo.name'
        //     },
        //     {
        //         title: '客户类型',
        //         className: "grey",
        //         render:(data)=>{
        //             if(this.state.title==="cashloan"){
        //                 return "个人"
        //             }else{
        //                 return data.contactInfo.borrowType===0?"个人":"企业"
        //             }
        //         }
        //     },
        //     {
        //         title: '借款金额',
        //         className: "grey",
        //         render:(data)=>{
        //             if(this.state.title==="cashloan"){
        //                 return data.amount.money();
        //             }else{
        //                 return data.contactInfo.loanAmount.money()
        //             }
        //         }
        //     },
        //     {
        //         title: '借款期限',
        //         render:(data) => {
        //             if(this.state.title==="cashloan"){
        //                 var type={"DAY":"日","MONTH":"个月","YEAR":"年"};
        //                 return data.term+"("+type[data.termType]+")";
        //             }
        //             return data.contactInfo.periodTerm+"("+ period_type[data.contactInfo.periodType] +")";
        //         }
        //     },
        //     {
        //         title: '借款开始日期',
        //         dataIndex: 'contactInfo.loanStartDate'
        //     },
        //     {
        //         title: '借款截止日期',
        //         dataIndex: 'contactInfo.loanEndDate'
        //     },
        //     {
        //         title: '年化利率',
        //         className: "grey",
        //         dataIndex: 'contactInfo.yearRate'
        //     },
        //     {
        //         title: '还款来源',
        //         className: "grey",
        //         render:(data)=>{
        //             return data.contactInfo.borrowType===0?"工资":"营业收入"
        //         }
        //     },
        //     {
        //         title: '还款方式',
        //         className: "grey",
        //         dataIndex: 'mpDefault.lending_pay_type'
        //     },
        //     {
        //         title: '借款投向',
        //         render:(data)=>{
        //             return industryStrs[data.mpDefault.industry];
        //         }
        //     },
        //     {
        //         title: '借款方式',
        //         render:(data)=>{
        //             return loan_typeStrs[data.mpDefault.loanType];
        //         }
        //     },
        //     {
        //         title: '借款用途',
        //         render:(data)=>{
        //             return purposeStrs[data.mpDefault.purpose];
        //         }
        //     },
        //     {
        //         title: '是否展期',
        //         className: "grey",
        //         render:(data)=>{
        //             return data.mpDefault.isExtend===0?"否":"是"
        //         }
        //     },
        //     {
        //         title: '',
        //         className: "grey",
        //         dataIndex: 'blank1'
        //     },
        //     {
        //         title: '',
        //         className: "grey",
        //         dataIndex: 'blank1'
        //     },
        //     {
        //         title: '附件',
        //         className: "grey",
        //         render:(data)=>{
        //             return (
        //                 <span>
        //                     <a target="_blank" href={"http://ot.baimaodai.com/contract/trust?contract_no="+this.state.contract_no}>《征信授权书》.pdf&emsp;</a> <br />
        //                     <a target="_blank" href={"http://ot.baimaodai.com/contract?contract_no="+this.state.contract_no}>《借款合同》.pdf</a> <br />
        //                     <a target="_blank" href={"http://res.baimaodai.com/web/ygd/file/4.0-bmd-xxsqxy.20180228.pdf"}>《信息授权书》.pdf</a><br />
        //                     <a target="_blank" href={"http://res.baimaodai.com/web/ygd/file/ygd-ygcnh.20180102.pdf"}>《承诺书》.pdf</a>
        //                 </span>
        //             )
        //         }
        //     },
        //     {
        //         title: '',
        //         className: "grey",
        //         dataIndex: 'blank1'
        //     },
        //     {
        //         title: '',
        //         className: "grey",
        //         dataIndex: 'blank1'
        //     }
        // ]
        // this.columns_contract_bmd = [
        //     {
        //         title: '产品名称',
        //         dataIndex: 'productName'
        //     },
        //     {
        //         title: '',
        //         dataIndex: 'blank1'
        //     },
        //     {
        //         title: '订单编号',
        //         dataIndex: 'domainNo'
        //     },
        //     {
        //         title: '合同编号',
        //         dataIndex: 'contractNo'
        //     },
        //     {
        //         title: '',
        //         dataIndex: 'blank1'
        //     },
        //     {
        //         title: '合同状态',
        //         dataIndex: 'blank1'
        //     },
        //     {
        //         title: '合同名称',
        //         dataIndex: 'blank1'
        //     },
        //     {
        //         title: '',
        //         dataIndex: 'blank1'
        //     },
        //     {
        //         title: '合同签订日期',
        //         dataIndex: 'blank1'
        //     },
        //     {
        //         title: '借款方',
        //         className: "grey",
        //         dataIndex: 'borrowerName'
        //     },
        //     {
        //         title: '客户类型',
        //         className: "grey",
        //         // dataIndex:"borrowerType",
        //         render:(data)=>{
        //             return data.borrowerType==="PERSONAL"?"个人":"企业"
        //         }
        //     },
        //     {
        //         title: '借款金额',
        //         className: "grey",
        //         render:(data)=>{
        //             return data.amount.money();
        //         }
        //     },
        //     {
        //         title: '借款期限',
        //         render:(data) => {
        //                 var type={"DAY":"日","MONTH":"个月","YEAR":"年"};
        //                 return data.term+"("+type[data.termType]+")";
        //         }
        //     },
        //     {
        //         title: '借款开始日期',
        //         dataIndex: 'loanStartDate'
        //     },
        //     {
        //         title: '借款截止日期',
        //         dataIndex: 'loanEndDate'
        //     },
        //     {
        //         title: '年化利率',
        //         className: "grey",
        //         dataIndex: 'yearRate'
        //     },
        //     {
        //         title: '还款来源',
        //         className: "grey",
        //         render:(data)=>{
        //             // return data.contactInfo.borrowType===0?"工资":"营业收入"
        //             return ""
        //         }
        //     },
        //     {
        //         title: '还款方式',
        //         className: "grey",
        //         render:(data)=>{
        //             return ""
        //             var reportRepayType={"DEBX":"等额本息","DEBJ":"等额本金","XXHB":"先息后本","LHHK":"灵活还款"};
        //             return reportRepayType[data.loanConfig.repayType];
        //         }
        //     },
        //     {
        //         title: '借款投向',
        //         render:(data)=>{
        //             // return industryStrs[data.mpDefault.industry];
        //             return ""
        //         }
        //     },
        //     {
        //         title: '借款方式',
        //         render:(data)=>{
        //             // return loan_typeStrs[data.mpDefault.loanType];
        //             return ""
        //         }
        //     },
        //     {
        //         title: '借款用途',
        //         render:(data)=>{
        //             // return purposeStrs[data.mpDefault.purpose];
        //             return ""
        //         }
        //     },
        //     {
        //         title: '是否展期',
        //         className: "grey",
        //         render:(data)=>{
        //             // return data.mpDefault.isExtend===0?"否":"是"
        //             return ""
        //         }
        //     },
        //     {
        //         title: '',
        //         className: "grey",
        //         dataIndex: 'blank1'
        //     },
        //     {
        //         title: '',
        //         className: "grey",
        //         dataIndex: 'blank1'
        //     },
        //     {
        //         title: '附件',
        //         className: "grey",
        //         render:(data)=>{
        //             // return (
        //             //     <span>
        //             //         <a target="_blank" href={"http://ot.baimaodai.com/contract/trust?contract_no="+this.state.contract_no}>《征信授权书》.pdf&emsp;</a> <br />
        //             //         <a target="_blank" href={"http://ot.baimaodai.com/contract?contract_no="+this.state.contract_no}>《借款合同》.pdf</a> <br />
        //             //         <a target="_blank" href={"http://res.baimaodai.com/web/ygd/file/4.0-bmd-xxsqxy.20180228.pdf"}>《信息授权书》.pdf</a><br />
        //             //         <a target="_blank" href={"http://res.baimaodai.com/web/ygd/file/ygd-ygcnh.20180102.pdf"}>《承诺书》.pdf</a>
        //             //     </span>
        //             // )
        //             return "无"
        //         }
        //     },
        //     {
        //         title: '',
        //         className: "grey",
        //         dataIndex: 'blank1'
        //     },
        //     {
        //         title: '',
        //         className: "grey",
        //         dataIndex: 'blank1'
        //     }
        // ]
        this.columns_contract = {
            "name1":{
                name: '产品名称',
                render:e=>{
                    return e.loanSystem.name
                }
            },
            'domainNo':{
                name: '订单编号',
                render:e=>{
                    return e.contactInfo.domainNo
                }
            },
            'contractNo':{
                name: '合同编号',
                render:e=>{
                    return e.contactInfo.contractNo
                }
            },
            
            'statusStr':{
                name: '合同状态',
                render:e=>{
                    return e.contactInfo.statusStr
                }
            },
            'loanContractName':{
                name: '合同名称',
                render:e=>{
                    return e.mpDefault.loanContractName
                }
            },
            
            'signDate':{
                name: '合同签订日期',
                render:e=>{
                    return e.mpDefault.signDate
                }
            },
            'name':{
                name: '借款方',
                render:e=>{
                    return e.contactInfo.name
                }
            },
            "borrowType1":{
                name: '客户类型',
                className: "grey",
                render:(data)=>{
                    if(this.state.title==="cashloan"){
                        return "个人"
                    }else{
                        return data.contactInfo.borrowType===0?"个人":"企业"
                    }
                }
            },
            "loanAmount":{
                name: '借款金额',
                className: "grey",
                render:(data)=>{
                    if(this.state.title==="cashloan"){
                        return data.amount.money();
                    }else{
                        return data.contactInfo.loanAmount.money()
                    }
                }
            },
            "periodTerm":{
                name: '借款期限',
                render:(data) => {
                    if(this.state.title==="cashloan"){
                        var type={"DAY":"日","MONTH":"个月","YEAR":"年"};
                        return data.term+"("+type[data.termType]+")";
                    }
                    return data.contactInfo.periodTerm+"("+ period_type[data.contactInfo.periodType] +")";
                }
            },
            'loanStartDate':{
                name: '借款开始日期',
                render:e=>{
                    return e.contactInfo.loanStartDate
                }
            },
            'loanEndDate':{
                name: '借款截止日期',
                render:e=>{
                    return e.contactInfo.loanEndDate
                }
            },
            'yearRate':{
                name: '年化利率',
                render:e=>{
                    return e.contactInfo.yearRate
                }
            },
            "borrowType":{
                name: '还款来源',
                className: "grey",
                render:(data)=>{
                    return data.contactInfo.borrowType===0?"工资":"营业收入"
                }
            },
            'lending_pay_type':{
                name: '还款方式',
                render:e=>{
                    return e.mpDefault.lending_pay_type
                }
            },
            'industry':{
                name: '借款投向',
                render:(data)=>{
                    return industryStrs[data.mpDefault.industry];
                }
            },
            'loanType':{
                name: '借款方式',
                render:(data)=>{
                    return loan_typeStrs[data.mpDefault.loanType];
                }
            },
            'purpose':{
                name: '借款用途',
                render:(data)=>{
                    return purposeStrs[data.mpDefault.purpose];
                }
            },
            'isExtend':{
                name: '是否展期',
                className: "grey",
                render:(data)=>{
                    return data.mpDefault.isExtend===0?"否":"是"
                }
            },
            'fj':{
                name: '附件',
                className: "grey",
                render:(data)=>{
                    return (
                        <span>
                            <a target="_blank" href={"http://ot.baimaodai.com/contract/trust?contract_no="+this.state.contract_no}>《征信授权书》.pdf&emsp;</a> <br />
                            <a target="_blank" href={"http://ot.baimaodai.com/contract?contract_no="+this.state.contract_no}>《借款合同》.pdf</a> <br />
                            <a target="_blank" href={"http://res.baimaodai.com/web/ygd/file/4.0-bmd-xxsqxy.20180228.pdf"}>《信息授权书》.pdf</a><br />
                            <a target="_blank" href={"http://res.baimaodai.com/web/ygd/file/ygd-ygcnh.20180102.pdf"}>《承诺书》.pdf</a>
                        </span>
                    )
                }
            }
        }
        this.columns_contract_bmd = {
            'productName':{
                name: '产品名称',
            },
            
            'domainNo':{
                name: '订单编号',
            },
            'contractNo':{
                name: '合同编号',
            },
            'blank1':{
                name: '合同状态',
            },
            'blank2':{
                name: '合同名称',
            },
            'blank3':{
                name: '合同签订日期',
            },
            'borrowerName':{
                name: '借款方',
            },
            'borrowerType':{
                name: '客户类型',
                // dataIndex:"borrowerType",
                render:(data)=>{
                    return data.borrowerType==="PERSONAL"?"个人":"企业"
                }
            },
            'amount':{
                name: '借款金额',
                render:(data)=>{
                    return data.amount.money();
                }
            },
            'term':{
                name: '借款期限',
                render:(data) => {
                        var type={"DAY":"日","MONTH":"个月","YEAR":"年"};
                        return data.term+"("+type[data.termType]+")";
                }
            },
            'loanStartDate':{
                name: '借款开始日期',
                render:(data)=>{
                    return data.loanStartDate.split(" ")[0]
                }
            },
            'loanEndDate':{
                name: '借款截止日期',
                render:(data)=>{
                    return data.loanEndDate.split(" ")[0]
                }
            },
            'yearRate':{
                name: '年化利率',
            },
            'ly':{
                name: '还款来源',
                render:(data)=>{
                    // return data.contactInfo.borrowType===0?"工资":"营业收入"
                    return ""
                }
            },
            'reportRepayType':{
                name: '还款方式',
                render:(data)=>{
                    return ""
                    // var reportRepayType={"DEBX":"等额本息","DEBJ":"等额本金","XXHB":"先息后本","LHHK":"灵活还款"};
                    // return reportRepayType[data.loanConfig.repayType];
                }
            },
            'tx':{
                name: '借款投向',
                render:(data)=>{
                    // return industryStrs[data.mpDefault.industry];
                    return ""
                }
            },
            'fs':{
                name: '借款方式',
                render:(data)=>{
                    // return loan_typeStrs[data.mpDefault.loanType];
                    return ""
                }
            },
            'yt':{
                name: '借款用途',
                render:(data)=>{
                    // return purposeStrs[data.mpDefault.purpose];
                    return ""
                }
            },
            'zq':{
                name: '是否展期',
                render:(data)=>{
                    // return data.mpDefault.isExtend===0?"否":"是"
                    return ""
                }
            },
            
            'fj':{
                name: '附件',
                render:(data)=>{
                    return "无"
                }
            },
        }
        // 初始化数据
        this.form_init_data = {
            repay_order_no:"",
            date:undefined,
            remark:"",
            repay_type:undefined
        }
    }
    componentDidMount(){
        this.get_data();
    }
    tab_change(e){

    }
    get_data(){
        if(this.state.title==="cashloan"||this.state.title==="zyzj"||this.state.title==="bl"){
            let rqd = {
                contractNo:this.state.contract_no,
                appKey:this.state.appKey
            }
            axios_loan.post(repay_contract_detail,rqd).then((data)=>{
                this.setState({
                    contract : data.data
                })
            })
            axios_loan.post(repay_contract_plan,rqd).then((data)=>{
                // this.show_pay = data.data.repayPlanTotal.repayPhase;
                // let list = format_table_data(data.data.repayDetailList);
                // list = this.set_total_bmd(list,data.data.repayDetailList)
                axios_loan.post(repay_contract_undiscount,rqd).then((e)=>{
                    var undiscount=e.data;
                    var list=data.data;
                    list=this.get_newList(list,undiscount);
                    list=this.set_total_bmd(list,list)
                    this.setState({
                        plan : list,
                    })
                })
                
            })
        }else{
            let rqd = {
                contract_id:this.state.contract_no
            }
            axios_repay.post(repay_detail,rqd).then((data)=>{
                this.show_pay = data.data.repayPlanTotal.repayPhase;
                let list = format_table_data(data.data.lstRepayPlan);
                list = this.set_total(list,data.data.repayPlanTotal)
                this.setState({
                    plan : list,
                    contract : data.data
                })
            })
        }
        
    }
    get_newList(list,arr){
        if(arr.length<1){
            return list
        }
        for(var i in list){
            for(var j in arr){
                if(list[i].phase===arr[j].phase){
                    if(arr[j].creatorType==="ZD"){
                        list[i].undiscount=arr[j];
                    }else{
                        list[i].undiscount_other=arr[j];
                    }
                }
            }
        }
        return list;

    }
    set_total(list,data){
        let total = {
            principal : 0,
            interest : 0,
            serviceFee : 0,
            penaltyFee :0,
            returnPenaltyFee :0,
            overdueMoney : 0,
            returnMoney : 0,
            returnPrincipal : 0,
            returnInterest : 0,
            returnOverdueMoney : 0,
            returnServiceFee : 0,
            repayAheadPenaltyFee:0,
            returnRepayAheadPenaltyFee:0
        };
        total.repayAheadPenaltyFee=data.repayAheadPenaltyFee||0;
        total.returnRepayAheadPenaltyFee=data.returnRepayAheadPenaltyFee||0;
        total.principal = data.principal;
        total.interest = data.interest;
        total.serviceFee = data.serviceFee;
        total.penaltyFee = data.penaltyFee||0;
        total.returnPenaltyFee = data.returnPenaltyFee||0;
        total.overdueMoney = data.overdueMoney;
        total.returnMoney = data.returnMoney;
        total.returnPrincipal = data.returnPrincipal;
        total.returnInterest = data.returnInterest;
        total.returnOverdueMoney = data.returnOverdueMoney;
        total.returnServiceFee = data.returnServiceFee;
        total.otherFee = data.otherFee;
        total.overdueFee = data.overdueFee;
        total.returnOtherFee = data.returnOtherFee||0;
        total.returnOverdueFee = data.returnOverdueFee||0;
        total.discountOverdueFee = data.discountOverdueFee||0;
        total.needPayMoney = data.needPayMoney||0;
        total.overdueFee = data.overdueFee||0;
        total.key = "total";
        total.phaseStr = "";
        total.repayDate = "";
        total.returnDate = "";
        total.statusStr = "";
        total.phase = "合计";
        list.push(total);
        return list;
    }
    set_total_bmd1(list,data){
        let total = {
            plan:{
                principal : 0,
                interest : 0,
                serviceFee : 0,
                otherFee:0,

            },
            expect:{
                overdueFee:0,
                penaltyOverdueFee:0,
                penaltyAheadFee:0,
            },
            actual:{
                sum:0,
                principal:0,
                interest:0,
                serviceFee:0,
                otherFee:0,
                overdueFee:0,
                penaltyOverdueFee:0,
                penaltyAheadFee:0
            },
            repaidDiscount:{
                interest:0,
                serviceFee:0,
                otherFee:0,
                overdueFee:0,
                penaltyOverdueFee:0,
                penaltyAheadFee:0
            },
            remainDiscount:{
                interest:0,
                serviceFee:0,
                otherFee:0,
                overdueFee:0,
                penaltyOverdueFee:0,
                penaltyAheadFee:0
            },
        };
        for(var i in data){
            for(var j in total){
                for(var m in total[j]){
                    total[j][m]+=data[i][j][m]||0
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
    set_total_bmd(list,data){
        let total = {
            principal : 0,
            interest : 0,
            serviceFee : 0,
            otherFee:0,
            clearOverdueInterest:0,
            clearPenaltyOverdueFee:0,
            clearPenaltyAheadFee:0,
            settlePrincipal:0,
            settleInterest:0,
            settleServiceFee:0,
            settleOtherFee:0,
            settleOverdueInterest:0,
            settlePenaltyOverdueFee:0,
            settlePenaltyAheadFee:0,
            discountInterest:0,
            discountServiceFee:0,
            discountOtherFee:0,
            discountOverdueInterest:0,
            discountPenaltyOverdueFee:0,
            discountPenaltyAheadFee:0,
            undiscount:{
                interest:0,
                serviceFee:0,
                otherFee:0,
                overdueFee:0,
                penaltyOverdueFee:0,
                penaltyAheadFee:0
            },
        };
        for(var i in data){
            for(var j in total){
                if(j==="undiscount"){
                    if(data[i][j]){
                        total.undiscount.interest+=data[i][j].interest;
                        total.undiscount.serviceFee+=data[i][j].serviceFee;
                        total.undiscount.otherFee+=data[i][j].otherFee;
                        total.undiscount.overdueFee+=data[i][j].overdueFee;
                        total.undiscount.penaltyOverdueFee+=data[i][j].penaltyOverdueFee;
                        total.undiscount.penaltyAheadFee+=data[i][j].penaltyAheadFee
                    }
                }else{
                    total[j]+=data[i][j];
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
    pay_click(data){
        this.select_total_get({domain_no:data.domainNo,domain_name:data.domainName,phase:data.phase});
    }
    // 获取统计数据
    select_total_get(id,date){
        let rqd = {
            contract_and_phase:JSON.stringify([id]),
            repay_date:format_date(moment(date))
        }
        axios_repay.post(under_repay_plan_select_total,rqd).then(data=>{
            let info = data.data;
            let config = {
                ids:[id],
                discountInterestFee:info.discountInterestFee,
                discountServiceFee:info.discountServiceFee,
                discountOtherFee:info.discountOtherFee,
                discountOverdueFee:info.discountOverdueFee,
                discountPenaltyFee:info.discountPenaltyFee,
                total_money:info.amount,
                total_principal : info.principal,
                total_interest : info.interest,
                total_defautInterest : info.otherFee,
                total_serviceCharge : info.serviceFee,
                total_overdueFee : info.overdueFee,
                value : `${info.unPayCount}笔（正常${info.normalCount||"0"}笔；逾期${info.overdueCount||"0"}笔）`,
                type : "list",
                loading:false,
                show:true 
            }
            this.set_pre_pay(config,date?false:true);
        })
    }
    set_pre_pay(config,init){
        this.setState({
            pre_pay:config
        })
        if(init){
            this.props.form.setFieldsValue(this.form_init_data);
        }
    }

    // 提交表单
    pay_confirm(){
        this.props.form.validateFields((err,values)=>{
            if(err){
                return;
            }
            let info = JSON.parse(JSON.stringify(this.state.pre_pay));
            info.loading = true;
            this.setState({
                pre_pay:info
            })
            let form_data = values;
            form_data.date = form_data.date.format("YYYY-MM-DD");
            let repay_info = {
                "repayType":form_data.repay_type,
                "repayOrderNo":form_data.repay_order_no,  // 没有用 向凯大哥说都传一样的
                "repayDate":form_data.date,     
                "confirmRepayDate":form_data.date,  // 没有用 向凯大哥说都传一样的
                "accountName":"",                   // 没有用 向凯大哥说都传空的
                "remark":form_data.remark,
                "amount":info.total_money,
                "discountInterestFee":info.discountInterestFee,
                "discountServiceFee":info.discountServiceFee,
                "discountOtherFee":info.discountOtherFee,
                "discountOverdueFee":info.discountOverdueFee,
                "discountPenaltyFee":info.discountPenaltyFee
            }

            this.pre_pay(repay_info)
        });
    }

    // 确认还款
    pre_pay(repay_info){
        console.log(repay_info)
        let rqd = {
            repay_info : JSON.stringify(repay_info),
            contract_and_phase:JSON.stringify(this.state.pre_pay.ids)
        }
        axios_repay.post(repay,rqd).then((data)=>{
            this.get_data();
            message.success(data.msg);
            this.modal_hide();
        })
    }
    // 隐藏弹窗
    modal_hide(){
        let init_data = {
            ids:[],
            discountInterestFee:0,
            discountServiceFee:0,
            discountOtherFee:0,
            discountOverdueFee:0,
            discountPenaltyFee:0,
            total_money:0,
            total_principal : 0,
            total_interest : 0,
            total_defautInterest : 0,
            total_serviceCharge : 0,
            total_overdueFee : 0,
            value : `0笔（正常0笔；逾期0笔）`,
            type : "list",
            loading:false,
            show:false 
        }
        this.setState({
            pre_pay:init_data
        })
    }
    textChange(e){
        let value = e.target.value;
        if(value.length>100){
            message.warn("流水号最大长度不超过100",3);
            value = value.slice(0,100)
        }
        let type = e.target.getAttribute("data-type");
        let key = e.target.getAttribute("data-key");
        let status = JSON.parse(JSON.stringify(this.state[type]));
        status[key] = value;
        this.setState({
            [type]:status,
            textValue:value
        })
    }
    selectChange(val){
        this.setState({
            selectValue:val
        })
    }
    // 改变还款日期
    repay_date_change(date,str){
        let ids = this.state.pre_pay.ids;
        this.select_total_get(ids[0],str);
    }

    //白猫贷减免
    ref_fee(e){
        this.fee_child=e
    }
    discount_fee(data){
        this.setState({
            discount_fee:true,
            fee_orderNo:data.domainNo,
            fee_period:data.phase
        })
        setTimeout(()=>{
            this.fee_child.discount_fee_info();
        },10)
        
    }
    fee_save(){
        var param=this.fee_child.get_val();console.log(param)
        if(!param){
            return;
        }
        param.orderNo=this.state.fee_orderNo;
        param.period=this.state.fee_period;
        axios_xjd.post(bmd_repay_discount_confirm,param).then(e=>{
            if(!e.code){
                message.success("减免成功");
                this.fee_cancel();
            }
        })

    }
    fee_cancel(){
        
        this.fee_child.props.form.setFieldsValue({"interestMoney":"0","interestDay":""})
        this.fee_child.props.form.setFieldsValue({"serviceFeeMoney":"0","serviceFeeDay":""})
        this.fee_child.props.form.setFieldsValue({"overdueFeeMoney":"0","overdueFeeDay":""})
        this.fee_child.props.form.setFieldsValue({"penaltyFeeMoney":"0"})
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
                principal:0,
                interest:0,
                serviceFee:0,
                overdueFee:0,
                penaltyFee:0
            },
            total: "0.00",
            value_serviceFee: 1,
            value_overdueFee: 1,
            value_penaltyFee: 1,
            value: 1
        })
        this.setState({
            discount_fee:false
        })
    }
    render (){
        const table_props = {
            columns:this.state.title==="cashloan"||this.state.title==="zyzj"||this.state.title==="bl"?this.columns_bmd:this.columns ,
            dataSource:this.state.plan,
            pagination : false,
            loading:this.state.loading,
            scroll:{x:2400,y:window.innerHeight-310}
        }
        const { getFieldDecorator } = this.props.form;
        const footer = [
            <Button key="submit" type="primary" loading={this.state.pre_pay.loading} onClick={this.pay_confirm.bind(this)}>确认还款</Button>
        ]
        const payConfirm_props = {
            visible : this.state.pre_pay.show, 
            title : "还款确认单",
            // onOk : this.handleOk.bind(this), 
            onCancel : ()=>{ this.modal_hide() },
            footer : footer,
            className:"pay-plan",
            maskClosable:false
        }
        const fee={
            title:"减免确认单",
            visible:this.state.discount_fee,
            footer:<Button type="primary" onClick={this.fee_save.bind(this)}>确认</Button>,
            onCancel:this.fee_cancel.bind(this),
            width:900,
            maskClosable:false
        }
        let order_detail = '';
        const products = ["zzb","hs","cxfq","fdd","cashloan"];
        if(this.state.title==="cashloan"||this.state.title==="zyzj"||this.state.title==="bl"){
            // let product = this.state.contract.loanSystem.productLine;
            let orderNo = this.state.contract?this.state.contract.domainNo:"";
                order_detail = (
                    <TabPane tab="进件详情" key="detail4" style={{padding:"0px"}}>
                        <Particulars orderNo={orderNo} product={this.state.title} />
                    </TabPane>
                )
        }else{
            if(this.state.contract){
                let product = this.state.contract.loanSystem.productLine;
                let orderNo = this.state.contract.contactInfo.domainNo;
                if(products.indexOf(product)>=0){
                    order_detail = (
                        <TabPane tab="进件详情" key="detail4" style={{padding:"0px"}}>
                            <Particulars orderNo={orderNo} product={product} />
                        </TabPane>
                    )
                }
            }
        }
        
        // 逾期罚息
        let overdue = [];
        overdue.push(
            <Col key="key" span={8}>
                <div className="key">应还逾期合计(优惠后):</div>
            </Col>
        )
        overdue.push(
            <Col key="val" span={14} offset={2} className="value">
                <div className="value">{this.state.pre_pay.total_overdueFee.money()}</div>
            </Col>
        )
        return(
            <div className="content" style={{marginBottom:"30px"}}>
                <Tabs defaultActiveKey="1" onChange={this.tab_change} className="sh_tab">
                    <TabPane tab="还款计划" key="detail1">
                        <Panel>
                            <Table {...table_props} bordered />
                        </Panel>
                    </TabPane>
                    <TabPane tab="合同信息" key="detail2">
                        {this.state.contract?<div className="detail-content">
                            <div className="detail-body">
                            {this.state.title==="cashloan"||this.state.title==="zyzj"||this.state.title==="bl"?<LineTable line={3} data-columns={this.columns_contract_bmd} data-source={this.state.contract} />:<LineTable line={3} data-columns={this.columns_contract} data-source={this.state.contract} />}
                            </div>
                        </div>:null}
                        
                        
                    </TabPane>
                    { order_detail }
                    <TabPane tab="操作记录" key="detail3">
                        <h3>待开发</h3>
                    </TabPane>
                </Tabs>
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
                        {
                            overdue
                        }
                    </Row>
                    <Form>
                        <Row>
                            <Col span={8}>
                                <div className="key">还款日期:</div>
                            </Col>
                            <Col span={14} offset={2} className="value">
                                <FormItem>
                                    {getFieldDecorator("date",{
                                        rules:[{ type: 'object', required: true, message: '请选择日期' }]
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
                                    {getFieldDecorator("repay_order_no",{
                                        rules:[{required:true,message:"请输入流水号"}]
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
                                    {getFieldDecorator("repay_type",{
                                        rules:[{required:true,message:"选择还款来源"}]
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
                    .pay-plan div.key{
                        line-height: 40px;
                        text-align: right;
                    }
                    .pay-plan div.value{
                        line-height: 40px;
                        text-align: left;
                    }
                    .pay-plan div.ant-modal-title,.pay-plan div.ant-modal-footer{
                        // text-align:center
                    }
                `}</style>
            </div>
        )
    }
}

export default Form.create()(Detail);
