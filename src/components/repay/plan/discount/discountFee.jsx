import React, { Component } from 'react';
import { Modal, message, Button, DatePicker, Form } from 'antd';
import moment from 'moment';
import { axios_loanMgnt } from '../../../../ajax/request';
import { repay_deduction_count, repay_discount_apply } from '../../../../ajax/api';
import { accDiv, format_time } from '../../../../ajax/tool';
import Fee from '../../elements/discountFee';
const FormItem = Form.Item;
class Discount extends Component {
    constructor(props) {
        super(props);
        props.onRef(this)
        this.state = {
            visible: false,
            repayDate: moment().format("YYYY-MM-DD HH:mm:ss"),
            loading: false
        }
        this.domainNo = "";
        this.repayPhase = "";
    }
    ref_fee(e) {
        this.fee_child = e
    }
    discount_fee(data, time = format_time(new Date())) {
        this.setState({
            discount_fee: true,
        })
        data.remainDiscount = {
            interest: data.undiscount ? (data.undiscount.creatorType === "ZD" ? (data.discountInterest + data.undiscount.interest) : data.discountInterest) : data.discountInterest,
            serviceFee: data.undiscount ? (data.undiscount.creatorType === "ZD" ? (data.discountServiceFee + data.undiscount.serviceFee) : data.discountServiceFee) : data.discountServiceFee,
            overdueFee: data.undiscount ? (data.undiscount.creatorType === "ZD" ? (data.discountOverdueInterest + data.undiscount.overdueFee) : data.discountOverdueInterest) : data.discountOverdueInterest,
            penaltyOverdueFee: data.undiscount ? (data.undiscount.creatorType === "ZD" ? (data.discountOverdueInterest + data.undiscount.penaltyOverdueFee) : data.discountOverdueInterest) : data.discountOverdueInterest,
            otherFee: data.undiscount ? (data.undiscount.creatorType === "ZD" ? (data.discountOtherFee + data.undiscount.otherFee) : data.discountOtherFee) : data.discountOtherFee
        }
        var rqd = {
            phaseStart: data.phase,
            phaseEnd: data.phase,
            contractNo: data.contractNo,
            clearingTime: time,
            repayTriggerType: "USER"
        }
        axios_loanMgnt.post(repay_deduction_count, rqd).then(e => {
            if (!e.code) {
                var e = e.data[0];
                setTimeout(() => {
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
                    });
                }, 10)

            }
        })
        setTimeout(() => {
            this.fee_child.props.form.setFieldsValue({ "interestMoney": data.remainDiscount.interest ? accDiv(data.remainDiscount.interest, 100).toFixed(2) : "", "interestDay": "" })
            this.fee_child.props.form.setFieldsValue({ "serviceFeeMoney": data.remainDiscount.serviceFee ? accDiv(data.remainDiscount.serviceFee, 100).toFixed(2) : "", "serviceFeeDay": "" })
            this.fee_child.props.form.setFieldsValue({ "overdueFeeMoney": data.remainDiscount.overdueFee ? accDiv(data.remainDiscount.overdueFee, 100).toFixed(2) : "", "overdueFeeDay": "" })
            this.fee_child.props.form.setFieldsValue({ "penaltyOverdueFeeMoney": data.remainDiscount.penaltyOverdueFee ? accDiv(data.remainDiscount.penaltyOverdueFee, 100).toFixed(2) : "" })
            this.fee_child.props.form.setFieldsValue({ "otherFeeMoney": data.remainDiscount.otherFee ? accDiv(data.remainDiscount.otherFee, 100).toFixed(2) : "" })
        }, 10)

    }
    fee_save() {
        var param = this.fee_child.get_val();
        if (!param) {
            return;
        }
        var discountPhaseList = [];
        var child = {
            phase: this.props.period,
            discountFee: param.amount
        }
        console.log(child);
        // alert(1)
        // return;
        discountPhaseList.push(child);
        var rqd = {};
        rqd.contractNo = this.props.orderNo;
        rqd.discountPhaseList = discountPhaseList;
        rqd.creatorType = "ZD";
        rqd.creator = "智度小贷";
        axios_loanMgnt.post(repay_discount_apply, { discountParam: JSON.stringify(rqd) }).then(e => {
            if (!e.code) {
                message.success("减免申请成功");
                this.setState({
                    fee_visible: true,
                    text_type: "fee"
                })
                this.fee_cancel();
                // this.getDetail();
            }
        })

    }
    fee_cancel() {

        this.fee_child.props.form.setFieldsValue({ "interestMoney": "", "interestDay": "" })
        this.fee_child.props.form.setFieldsValue({ "serviceFeeMoney": "", "serviceFeeDay": "" })
        this.fee_child.props.form.setFieldsValue({ "overdueFeeMoney": "", "overdueFeeDay": "" })
        this.fee_child.props.form.setFieldsValue({ "penaltyOverdueFeeMoney": "" })
        this.fee_child.props.form.setFieldsValue({ "otherFeeMoney": "" });
        this.fee_child.props.form.setFieldsValue({ "purpose": "" })
        this.fee_child.setState({
            discountInterest: "0.00",
            discountServiceFee: "0.00",
            discountOverdueFee: "0.00",
            discountPenaltyFee: "0.00",
            discountotherFee: "0.00",
            discountInterest_num: "0.00",
            discountServiceFee_num: "0.00",
            discountOverdueFee_num: "0.00",
            discountPenaltyFee_num: "0.00",
            discountotherFee_num: "0.00",
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
                discountOtherFee: 0,
                overdueInterest: 0,
                penaltyOverdueFee: 0,
                penaltyAheadFee: 0,
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
    //选择还款日
    changeDate(date, dateString) {
        console.log(date, dateString)
        var confirmDate = date.format("YYYY-MM-DD HH:mm:ss");
        this.discount_fee(this.props.fee_data, confirmDate);
    }
    render() {
        const fee = {
            title: "减免确认单",
            visible: this.state.discount_fee,
            footer: <Button type="primary" onClick={this.fee_save.bind(this)}>确认</Button>,
            onCancel: this.fee_cancel.bind(this),
            width: 900,
            maskClosable: false
        }
        return <Modal {...fee}>
            <div style={{marginBottom:10}}>
                <span>还款日期：</span>
                <DatePicker onChange={this.changeDate.bind(this)} showTime format="YYYY-MM-DD HH:mm:ss" showToday={false} />
            </div>


            <Fee orderNo={this.props.orderNo} period={this.props.period} onRef={this.ref_fee.bind(this)} noReason />
        </Modal>
    }
}
export default Discount