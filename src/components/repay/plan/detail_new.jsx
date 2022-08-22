import React, { Component } from 'react';
import { Table, Tabs, Form } from 'antd';
import Permissions from '../../../templates/Permissions';
import { axios_loanMgnt , axios_ygd_json , axios_gyl_json } from '../../../ajax/request';
import { repay_contract_list, repay_contract_plan, repay_contract_undiscount,repay_contract_type } from '../../../ajax/api';
import Panel from '../../../templates/Panel';
import UserInfo from './detail/userInfo';
import Repay from '../elements/zyzjRepay';
import OrderInfo from './detail/orderInfo';
import {bmd} from '../../../ajax/tool';
import Fee from './discount/discountFee';
const TabPane = Tabs.TabPane;
class Detail extends Component {
    constructor(props) {
        super(props);
        let paths = this.props.location.pathname.split("/");
        this.state = {
            plan: [],
            contract_no: this.props.location.query.contract_no,
            type: this.props.location.query.type,
            urlType:this.props.location.query.urlType||"",
            pay_type: paths[2],
            // title: paths[3],
            appKey:this.props.location.query.appKey,
            repayBtn:this.props.location.query.repayBtn||"",
            loading: false,
            contract:{
                domainNo:""
            },
            contractId:this.props.location.query.contractId,
            borrowerId:this.props.location.query.borrowerId,
            repayTriggerTypeList:[],
            contractRepayStatusList:[],
            current:1,
            title:this.props.location.query.labelName,
            domainNo:this.props.location.query.domainNo,
            contract:[]
        };
    }
    componentWillMount() {
        this.columns_bmd = [
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
                // dataIndex:"expect.penaltyAheadFee",
                render: data => {
                    var num = data.clearPenaltyAheadFee + data.settlePenaltyAheadFee + data.discountPenaltyAheadFee;
                    return num ? num.money() : "0.00"
                }
            },
            {
                title: '应还三方代收费',
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
                    return (data.settlePrincipal + data.settleInterest + data.settleServiceFee + data.settleOtherFee + data.settleOverdueInterest + data.settlePenaltyOverdueFee + data.settlePenaltyAheadFee+data.settleServiceTechFee).money()
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
                title: '已还三方代收费',
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
                }
            },

            {
                title: '还款日期',
                width: 100,
                dataIndex: 'lastSettleTime'
            },
            {
                title: '还款状态',
                width: 100,
                render: (data) => {
                    if (data.repayDate === "合计") {
                        return;
                    }
                    const type = { 100: "当期待还款", 830: "当期正常还款", 110: "当期逾期未还", 860: "当期逾期还款", 810: "当期提前还款", 811: "当期提前还款",850: "当期逾期还款" }
                    var status = data.repayPlanStatus;
                    if (status === 100 || status === 110) {
                        return data.overdueDays > 0 ? "当期逾期未还" : "当期待还款"
                    } else {
                        return type[status];
                    }
                }
            },
            {
                title: '备注',
                width: 100,
                render: data => {
                    if(data.repayPlanStatus===110||data.repayPlanStatus===100){
                        if(data.overdueDays > 0){
                            if (((new Date().getTime() - new Date(data.repayDate).getTime()) / 1000 / 60 / 60 / 24) <= this.state.contract.gracePeriod) {
                                return "宽限期内待还款"
                            }else{
                                return "--"
                            }
                        }else{
                            return "--"
                        }
                        
                    }else if(data.repayPlanStatus===850){
                        return "宽限期内还款"
                    }else{
                        return "--"
                    }
                }
            },
            {
                title:"操作",
                width:100,
                render:e=>{
                    var btn=[];
                    if(e.repayDate==="合计"){
                        return;
                    }
                    if(e.repayPlanStatus===100||e.repayPlanStatus===110){
                        btn.push([<Permissions size="small" type="primary" onClick={()=>(this.discount_fee(e))} style={{marginBottom:5}} server={global.AUTHSERVER.mgnt.key} permissions={global.AUTHSERVER.mgnt.access.discount_apply} tag="button">减免</Permissions>]);
                    }
                    if (this.state.repayBtn==="true"&&(e.repayPlanStatus === 100 || e.repayPlanStatus === 110)){
                        btn.push(<Permissions size="small" type="primary" server={global.AUTHSERVER.mgnt.key} permissions={global.AUTHSERVER.mgnt.access.repay_apply} tag="button" onClick={() => { this.repayShow(e) }}>确认还款</Permissions>)
                    }
                    return btn.length<1?"--":btn;
                }
            }
        ]
        this.columns_contract=[
            {
                title:"操作时间",
                dataIndex:"createTime"
            },
            {
                title:"还款日期",
                dataIndex:"repayTime"
            },
            {
                title:"入账时间",
                dataIndex:"successTime"
            },
            {
                title:"还款金额",
                dataIndex:"amount",
                render:e=>bmd.money(e)
            },
            {
                title:"减免金额",
                dataIndex:"discountAmount",
                render:e=>bmd.money(e)
            },
            {
                title:"支付任务编号",
                dataIndex:"lmSerialNo"
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
            // {
            //     title:"支付通道",
            //     dataIndex:"payChannelKey"
            // },
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
                title:"涉及期数",
                // dataIndex:"phases",
                render:e=>{
                    var str=[];
                    if(e.startPhase&&e.endPhase){
                        for(var i=e.startPhase;i<=e.endPhase;i++){
                            str.push(i)
                        }
                    }
                    return str.join(",")
                }
            },
            {
                title:"失败原因",
                dataIndex:"failReason",
                render:e=>e||"--"
            },
        ]
        // 初始化数据
        this.form_init_data = {
            repay_order_no: "",
            date: undefined,
            remark: "",
            repay_type: undefined
        }
        // if(this.state.repayBtn==="true"){
        //     this.columns_bmd.push({
        //         title:"操作",
        //         width:100,
        //         render:e=>{
        //             if(e.repayDate==="合计"){
        //                 return;
        //             }
        //             if (e.repayPlanStatus === 100 || e.repayPlanStatus === 110){
        //                 return <Permissions size="small" type="primary" server={global.AUTHSERVER.ygd.key} permissions={global.AUTHSERVER.ygd.access.ygd_repay} tag="button" onClick={() => { this.repayShow(e) }}>确认还款</Permissions>
        //             }
        //         }
        //     })
        // }
    }
    componentDidMount() {
        this.get_data();
        this.get_repay_list()
    }
    //还款全部
    repay(e){
        this.repay_child=e
    }
    repayShow(e){
        let axiosMap = {
            "yuangongdai":axios_ygd_json,
            "gongyinglian":axios_gyl_json
        }
        setTimeout(function(){
            this.repay_child.show({contract_no:e.contractNo,phaseStart:e.phase,phaseEnd:e.phase,appKey:this.state.appKey});
        }.bind(this),10)
    }
    get_repay_list(page=1){
        var param={
            page:page,
            size:10,
            contractNo:this.state.contract_no
        }
        axios_loanMgnt.post(repay_contract_list, param).then((data) => {
            this.setState({
                contract: data.data.list,
                current:data.data.current,
                total:data.data.total
            })
        })
    }
    get_data() {
        let rqd = {
            contractNo: this.state.contract_no,
            appKey:this.state.appKey||""
        }
        axios_loanMgnt.post(repay_contract_type).then(e=>{
            if(!e.code){
                this.setState({
                    contractRepayStatusList:e.data.contractRepayStatusList,
                    repayTriggerTypeList:e.data.repayTriggerTypeList
                })
            }
        })
        
        axios_loanMgnt.post(repay_contract_plan, rqd).then((data) => {
            axios_loanMgnt.post(repay_contract_undiscount, rqd).then((e) => {
                var undiscount = e.data;
                var list = data.data;
                list = this.get_newList(list, undiscount);
                list = this.set_total_bmd(list, list)
                this.setState({
                    plan: list,
                })
            })

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
    set_total(list, data) {
        let total = {
            principal: 0,
            interest: 0,
            serviceFee: 0,
            penaltyFee: 0,
            returnPenaltyFee: 0,
            overdueMoney: 0,
            returnMoney: 0,
            returnPrincipal: 0,
            returnInterest: 0,
            returnOverdueMoney: 0,
            returnServiceFee: 0,
            repayAheadPenaltyFee: 0,
            returnRepayAheadPenaltyFee: 0
        };
        total.repayAheadPenaltyFee = data.repayAheadPenaltyFee || 0;
        total.returnRepayAheadPenaltyFee = data.returnRepayAheadPenaltyFee || 0;
        total.principal = data.principal;
        total.interest = data.interest;
        total.serviceFee = data.serviceFee;
        total.penaltyFee = data.penaltyFee || 0;
        total.returnPenaltyFee = data.returnPenaltyFee || 0;
        total.overdueMoney = data.overdueMoney;
        total.returnMoney = data.returnMoney;
        total.returnPrincipal = data.returnPrincipal;
        total.returnInterest = data.returnInterest;
        total.returnOverdueMoney = data.returnOverdueMoney;
        total.returnServiceFee = data.returnServiceFee;
        total.otherFee = data.otherFee;
        total.overdueFee = data.overdueFee;
        total.returnOtherFee = data.returnOtherFee || 0;
        total.returnOverdueFee = data.returnOverdueFee || 0;
        total.discountOverdueFee = data.discountOverdueFee || 0;
        total.needPayMoney = data.needPayMoney || 0;
        total.overdueFee = data.overdueFee || 0;
        total.key = "total";
        total.phaseStr = "";
        total.repayDate = "合计";
        total.returnDate = "";
        total.statusStr = "";
        total.phase = "";
        list.push(total);
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
            settleServiceTechFee: 0,
            discountInterest: 0,
            discountServiceFee: 0,
            discountOtherFee: 0,
            discountOverdueInterest: 0,
            discountPenaltyOverdueFee: 0,
            discountPenaltyAheadFee: 0,
            discountServiceTechFee: 0,
            serviceTechFee:0,
            undiscount: {
                interest: 0,
                serviceFee: 0,
                otherFee: 0,
                overdueFee: 0,
                penaltyOverdueFee: 0,
                penaltyAheadFee: 0,
                serviceTechFee: 0
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
                        total.undiscount.penaltyAheadFee += data[i][j].penaltyAheadFee;
                        total.undiscount.serviceTechFee += data[i][j].serviceTechFee
                    }
                } else {
                    total[j] += data[i][j];
                }
            }

        }
        total.key = "total";
        total.phase = "";
        total.repayDate = "合计";
        total.latestRepaidDate = "";
        total.statusStr = "";
        // total.phase = 0;
        list.push(total);
        return list;
    }
    page_up(page, pageSize) {
        window.scrollTo(0, 0);
        this.setState({
            nowPage: page
        })
        this.get_repay_list(page);
    }
    showTotal() {
        return `共${this.state.total}条数据`
    }
    //白猫贷减免
ref_fee(e){
    this.fee_child=e
}
discount_fee(data) {
    setTimeout(function(){
        this.fee_child.discount_fee(data);
    }.bind(this),10)
    this.setState({
        // discount_fee: true,
        fee_orderNo: data.contractNo,
        fee_period: data.phase,
        fee_data:data
    })
}
    render() {
        const table_props = {
            columns: this.columns_bmd,
            dataSource: this.state.plan,
            pagination: false,
            loading: this.state.loading,
            scroll: { x: 2900, y: window.innerHeight - 310 }
        }
        let pagination = {
            total: this.state.total,
            current: this.state.current,
            pageSize: 10,
            showTotal: this.showTotal.bind(this),
            onChange: this.page_up.bind(this),
        }
        // var borrower_detail=true,contract_detail=true;
        // var permissions=JSON.parse(window.localStorage.getItem("permissions"));
        // permissions.forEach(item=>{
        //     if(item.applicationKey==="bmd-loanmanage-mgnt"){
        //         var list=item.permissionList;
        //         list.forEach(per=>{
        //             if(per.key==="borrower_detail"){
        //                 borrower_detail=per.hasPermission
        //             }
        //             if(per.key==="contract_detail"){
        //                 contract_detail=per.hasPermission
        //             }
        //         })
        //     }
        // })
        return (
            <div className="content" style={{ marginBottom: "30px" }}>
                <Tabs defaultActiveKey="1" className="sh_tab">
                    <TabPane tab="还款计划" key="detail1">
                        <Panel>
                            <Table {...table_props} bordered />
                        </Panel>
                    </TabPane>
                    <TabPane tab="还款记录" key="detail2">
                    <Panel>
                        <Table dataSource={this.state.contract} columns={this.columns_contract} pagination={pagination} bordered />
                    </Panel>
                    </TabPane>
                    <TabPane tab="进件详情" key="detail4" style={{ padding: "0px" }}>
                        <OrderInfo contract_no={this.state.contract_no} contractId={this.state.contractId} domainNo={this.state.domainNo} title={this.state.title} />
                    </TabPane>
                    <TabPane tab="用户信息" key="detail3">
                        <UserInfo borrowerId={this.state.borrowerId} contract_no={this.state.contract_no} />
                    </TabPane>
                </Tabs>
                <Repay onRef={this.repay.bind(this)} domainNo={this.state.contract.domainNo} repayPhase={this.state.repayPhase} project={this.state.title} />
                <Fee orderNo={this.state.fee_orderNo} period={this.state.fee_period} onRef={this.ref_fee.bind(this)} fee_data={this.state.fee_data} />
            </div>
        )
    }
}

export default Form.create()(Detail);