// 确认还款逻辑不通
import React, { Component } from 'react';
import { Row , Col , Button , Modal , Input , message , Radio , Form } from 'antd';

import { axios_sh } from '../../../ajax/request';
import { repay_confirm_days, repay_confirm_money , repay_confirm_info } from '../../../ajax/api';

const RadioGroup = Radio.Group;


class Detail extends Component{
    constructor(props) {
        super(props);
        this.state = {
            value:'',
            remark:"",
            total_money:0,
            total_principal:0,
            total_interest:0,
            total_defautInterest:0,
            total_serviceCharge:0,
            total_overdueFee:0,
            total_otherFee : 0,
            total_disCount : 0,
            serial_number:"",
            discountAmount:"",
            discountDay:"",
            show:false,
            ids:[],
            loading:false
        };
        props["bindmain"](this);
    }
    // 获取统计数据
    get_cofirm_info(orderNo,period){
        let rqd = {
            orderNo:orderNo,
            period:period
        }
        // this.show();
        axios_sh.post(repay_confirm_info,rqd).then(data=>{
            let info = data.data;
            let config = {
                orderNo:orderNo,
                period:period,
                lateDay:info.lateDay,
                total_money:info.repayAmount,
                total_principal : info.principal,
                total_interest : info.interest,
                total_serviceCharge : info.serviceFee,
                total_overdueFee : info.repayLateFee,
                total_otherFee : info.otherFee,
                total_disCount : info.discountLateFee,
                overdueType:info.repayLateFee>0?1:0,
                loading:false,
                show:true 
            }
            this.setState({
                ...config
            })
        })
    }
    // 显示弹窗
    show(){
        let config = {
            orderNo:"orderNo",
            period:1,
            lateDay:5,
            total_money:"10000",
            total_principal : "500",
            total_interest : "3",
            total_serviceCharge : "600",
            total_overdueFee : "300",
            total_otherFee : "200",
            total_disCount : "300",
            overdueType:1,
            loading:false,
            show:true 
        }
        this.setState({
            ...config
        })
    }

    // 提交表单
    pay_confirm(){
        let orderNo = this.state.orderNo;
        let period = this.state.period;
        if(this.state.overdueType===1){
            this.confirm_repay_money(orderNo,period);
        }
        if(this.state.overdueType===2){
            this.confirm_repay_days(orderNo,period);
        }
    }

    // 根据金额确认
    confirm_repay_money(orderNo,period){
        let rqd = {
            orderNo:orderNo,
            period:period,
            discountAmount:this.state.discountAmount.remoney()
        }
        axios_sh.post(repay_confirm_money,rqd).then((data)=>{
            this.get_data();
            message.success(data.msg);
            this.modal_hide();
        })
    }
    // 根据天数确认
    confirm_repay_days(orderNo,period){
        let rqd = {
            orderNo:orderNo,
            period:period,
            discountDay:this.state.discountDay 
        }
        axios_sh.post(repay_confirm_days,rqd).then((data)=>{
            this.get_data();
            message.success(data.msg);
            this.modal_hide();
        })
    }

    // 隐藏弹窗
    modal_hide(){
        let init_data = {
            total_money:0,
            total_principal : 0,
            total_interest : 0,
            total_serviceCharge : 0,
            total_overdueFee : 0,
            total_otherFee : 0,
            total_disCount : 0,
            loading:false,
            show:false 
        }
        this.setState({
            ...init_data
        })
    }
    

    // 调整逾期
    radioChange(e){
        this.setState({
            overdueType:e.target.value
        })
    }

    // 修改天数
    daysChange(e){
        let days = parseInt(e.target.value||0,10);
        let overdueDay = parseInt(this.state.lateDay,10);
        this.setState({
            discountDay:e.target.value===""?"":(overdueDay>=days?days:overdueDay)
        })
    }

    // 修改金额
    amountChange(e){
        this.setState({
            discountAmount:e.target.value
        })
    }

    render (){
        const footer = [
            <Button key="submit" type="primary" disabled={this.state.overdueType===0} loading={this.state.loading} onClick={this.pay_confirm.bind(this)}>确认还款请求</Button>
        ]
        const payConfirm_props = {
            visible : this.state.show, 
            title : "还款确认单",
            // onOk : this.handleOk.bind(this), 
            onCancel : ()=>{ this.modal_hide() },
            footer : footer,
            className:"pay-plan"
        }
        // 逾期罚息
        let overdue = {
            1:<span>
                <Col span={6}>
                    <div className="key">优惠金额：</div>
                </Col>
                <Col span={4} offset={1} className="value">
                    <Input placeholder="金额" value={this.state.discountAmount} onChange={this.amountChange.bind(this)} />
                </Col>
                <Col span={1} className="value">
                    <span>元</span>
                </Col>
                <Col span={11} className="value">
                    <span>需要收取罚息：{ (this.state.total_overdueFee-this.state.discountAmount.remoney()).money() }元</span>
                </Col>
            </span>,
            2:<span>
                <Col span={6}>
                    <div className="key">优惠天数：</div>
                </Col>
                <Col span={3} offset={1} className="value">
                    <Input placeholder="天数" value={this.state.discountDay} onChange={this.daysChange.bind(this)} />
                </Col>
                <Col span={1} className="value">
                    <span>天</span>
                </Col>
                <Col span={11} className="value">
                    <span>(已逾期天数：{ this.state.lateDay }天，
                    需要收取天数：{ parseInt(this.state.lateDay,10) - parseInt(this.state.discountDay||0,10) }天)</span>
                </Col>
            </span>
        }
        return(
            <div>
                <Modal {...payConfirm_props}>
                    <Row>
                        <Col span={6}>
                            <div className="key">本次还款笔数</div>
                        </Col>
                        <Col span={17} offset={1}>
                            <div className="value">1</div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <div className="key">本次应还款金额合计</div>
                        </Col>
                        <Col span={17} offset={1} className="value">
                            <div className="value">{this.state.total_money.money()}</div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={2}>
                            <div className="key">其中:</div>
                        </Col>
                        <Col span={4}>
                            <div className="key">应还本金合计:</div>
                        </Col>
                        <Col span={17} offset={1} className="value">
                            <div className="value">{this.state.total_principal.money()}</div>
                        </Col>
                        <Col span={6}>
                            <div className="key">应还利息合计:</div>
                        </Col>
                        <Col span={17} offset={1} className="value">
                            <div className="value">{this.state.total_interest.money()}</div>
                        </Col>
                        <Col span={6}>
                            <div className="key">应还服务费合计:</div>
                        </Col>
                        <Col span={17} offset={1} className="value">
                            <div className="value">{this.state.total_serviceCharge.money()}</div>
                        </Col>
                        <Col span={6}>
                            <div className="key">应还其他费用合计:</div>
                        </Col>
                        <Col span={17} offset={1} className="value">
                            <div className="value">{this.state.total_otherFee.money()}</div>
                        </Col>
                        <Col span={6}>
                            <div className="key">应还逾期合计:</div>
                        </Col>
                        <Col span={17} offset={1} className="value">
                            <div className="value">{this.state.total_overdueFee.money()}</div>
                        </Col>
                        <Col span={6}>
                            <div className="key">逾期优惠:</div>
                        </Col>
                        <Col span={17} offset={1} className="value">
                            <div className="value">{this.state.total_disCount.money()}</div>
                        </Col>
                        <Col span={6}>
                            <div className="key">调整逾期:</div>
                        </Col>
                        <Col span={17} offset={1} className="value">
                            <RadioGroup disabled={this.state.overdueType===0} onChange={this.radioChange.bind(this)} value={this.state.overdueType}>
                                <Radio value={1}>按金额</Radio>
                                <Radio value={2}>按天数</Radio>
                            </RadioGroup>
                        </Col>
                        { overdue[this.state.overdueType] }
                    </Row>
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
                        text-align:center
                    }
                `}</style>
            </div>
        )
    }
}

export default Form.create()(Detail);
