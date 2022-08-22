import React, { Component } from 'react';
import { Modal, Input, Form, message, Button, DatePicker ,Spin,Select} from 'antd';
import moment from 'moment';
import { repay_ygd_estimate, repay_ygd_and_claim ,repay_directRepay} from '../../../ajax/api';
import { axios_loanMgnt} from '../../../ajax/request';
import { accDiv, accMul ,floatSub,floatAdd} from '../../../ajax/tool';
const FormItem = Form.Item;
const {Option}=Select;
class YgdDiscount extends Component {
    constructor(props) {
        super(props);
        props.onRef(this)
        this.state = {
            visible: false,
            repayDate: moment().format("YYYY-MM-DD HH:mm:ss"),
            loading:false,
            agentTotal:"0.00"
        }
        this.err = {
            type: false,
            name: "",
            errors: "",
            value: ""
        }
        this.domainNo = "";
        this.repayPhase = "";

    }
    componentWillMount() {
        this.type = [
            {
                name: "应还本金",
                formText: "remainPrincipal",
                plan: "expectPrincipal",
                discount: "",
                id: "principal"
            },
            {
                name: "应还利息",
                formText: "remainInterest",
                plan: "expectInterest",
                discount: "remainInterestDiscount",
                id: "interest"
            },
            {
                name: "应还服务费",
                formText: "remainServiceFee",
                plan: "expectServiceFee",
                discount: "remainServiceFeeDiscount",
                id: "serviceFee"
            },
            {
                name: "应还其他费用",
                formText: "remainOtherFee",
                plan: "expectOtherFee",
                discount: "remainOtherFeeDiscount",
                id: "otherFee"
            },
            {
                name: "应还逾期罚息",
                formText: "remainOverdueInterest",
                plan: "expectOverdueInterest",
                discount: "remainOverdueInterestDiscount",
                id: "overdueFee"
            },
            {
                name: "应还违约金",
                formText: "remainPenaltyOverdueFee",
                plan: "expectPenaltyOverdueFee",
                discount: "remainPenaltyOverdueFeeDiscount",
                id: "penaltyOverdueFee"
            },
            {
                name: "应还提前结清手续费",
                formText: "remainPenaltyAheadFee",
                plan: "expectPenaltyAheadFee",
                discount: "remainPenaltyAheadFeeDiscount",
                id: "penaltyAheadFee"
            },
            {
                name: "应还科技服务费",
                formText: "remainServiceTechFee",
                plan: "expectServiceTechFee",
                discount: "remainServiceTechFeeDiscount",
                id: "serviceTechFee"
            },
            {
                name: "小计",
                formText: "formTextTotal",
                total: true,
                plan: "planTotal",
                discount: "discountTotal"
            }
        ]
    }
    //还款预览
    repay_estimate(confirmDate) {
        var param = {
            project: this.props.project,
            orderNo: this.domainNo,
            confirmDate: confirmDate || this.state.repayDate,
        }
        if (typeof this.repayPhase === "object") {
            var phaseArr = []
            this.repayPhase.forEach(j => {
                phaseArr.push({ phase: j })
            })
            param.repayReqItems = phaseArr
        } else {
            param.repayReqItems = [{ "phase": this.repayPhase }]
        }
        this.setState({ loading:true })
        this.axios.post(repay_ygd_estimate, param).then(e => {
            if (!e.code) {
                var data = e.data.list;
                this.setState({
                    repayData: data,
                    loading:false
                })
                var planTotal = 0, formTextTotal = 0, discountTotal = 0;
                this.type.forEach(item => {
                    item.planMoney = 0;
                    item.discountMoney = 0;
                    item.formTextMoney = 0
                    data.forEach(data => {
                        if (!item.total) {
                            planTotal += data.repayPlanItem[item.plan];
                            formTextTotal += data[item.formText];
                            discountTotal += (data[item.discount] ? data[item.discount] : 0)
                            item.planMoney += item.plan ? data.repayPlanItem[item.plan] : 0;
                            item.discountMoney += item.discount ? data[item.discount] : 0
                            item.formTextMoney += item.formText ? data[item.formText] : 0
                        }
                    })
                    if (!item.total) {
                        this.setState({
                            [item.plan]: accDiv(item.planMoney, 100).toFixed(2),
                            [item.discount]: item.discount ? accDiv(item.discountMoney, 100).toFixed(2) : "",
                            [item.formText]: accDiv(item.formTextMoney, 100),
                        })
                        this.props.form.setFieldsValue({ [item.id]: accDiv(item.formTextMoney, 100).toFixed(2) })
                    } else {
                        this.setState({
                            [item.plan]: accDiv(planTotal, 100).toFixed(2),
                            [item.formText]: accDiv(formTextTotal, 100).toFixed(2),
                            [item.discount]: accDiv(discountTotal, 100).toFixed(2),
                            total:accDiv(planTotal, 100).toFixed(2),
                            repayTotal:accDiv(formTextTotal, 100).toFixed(2)
                        })
                    }
                })

            }
        }).catch(data=>{
            this.setState({
                loading:false
            })
        })
    }
    interest_change(e, max, formText) {
        this.err = {
            type: false,
            name: "",
            errors: "",
            value: ""
        }
        var val = e.target.value;
        if (val === "") {
            e.target.value = 0.00;
            return;
        }
        console.log(val,max)
        if (Number(val) > Number(max)) {
            this.props.form.setFields({
                [formText]: {
                    errors: [new Error('不能大于应还金额-减免金额')],
                    value: Number(val).toFixed(2)
                },
            });
            this.err = {
                type: true,
                name: formText,
                errors: "不能大于应还金额-减免金额",
                value: val
            }
            return;
        }
        this.props.form.setFieldsValue({ [formText]: Number(e.target.value).toFixed(2) })
        var getForm = this.props.form.getFieldsValue(); console.log(getForm)
        var repayTotal = 0;
        for (var i in getForm) {
            if (i !== "confirmDate"&&i !== "cost"&&i !== "income"&&i!=="repayTriggerType") {
                repayTotal += (getForm[i] ? Number(getForm[i]) : 0);
            }
        }
        this.setState({
            formTextTotal: repayTotal.toFixed(2),
            repayTotal:floatSub(floatAdd(Number(repayTotal),Number(this.state.income||0)),Number(this.state.cost||0))
        })
    }
    show({axios,domainNo,repayPhase,contract_no}) {
        this.domainNo = domainNo;
        this.repayPhase = repayPhase;
        this.axios = axios;
        this.setState({
            visible: true,
            contract_no:contract_no
        })
        this.repay_estimate()
    }
    cancel() {
        this.domainNo = "";
        this.repayPhase = "";
        this.axios = null;
        this.setState({
            visible: false,
            agentTotal:"0.00"
        })
        this.props.form.setFieldsValue({ income: "" })
        this.props.form.setFieldsValue({ cost:"" })
    }
    submit_gyl() {
        if (this.err.type) {
            this.props.form.setFields({
                [this.err.name]: {
                    errors: [new Error('不能大于应还金额-减免金额')],
                    value: Number(this.err.value).toFixed(2)
                },
            });
            return;
        }
        this.props.form.validateFields((err, val) => {
            if (!err) {
                var confirmDate = "", repay = { phase: this.repayPhase, serviceTechFee: 0 },cost=0,income=0;
                for (var i in val) {
                    if (i === "confirmDate") {
                        confirmDate = val[i].format("YYYY-MM-DD HH:mm:ss")
                    }else if(i==="cost") {
                        cost=val[i]?accMul(Number(val[i]),100):0
                    }else if(i==="income") {
                        income=val[i]?accMul(Number(val[i]),100):0
                    }else if(i!=="repayTriggerType"){
                        repay[i] = val[i] ? accMul(Number(val[i]), 100) : 0
                    }
                }
                var param = {
                    project: this.props.project,
                    orderNo: this.domainNo,
                    confirmDate: confirmDate,
                    extraFee:cost,
                    extraIncome:income,
                }
                if (this.props.repayAll) {
                    var data = this.state.repayData, repayReqItems = [];
                    data.forEach(item => {
                        repayReqItems.push({
                            phase: item.repayPlanItem.phase,
                            principal: item.remainPrincipal,
                            interest: item.remainInterest,
                            serviceFee: item.remainServiceFee,
                            serviceTechFee: item.remainServiceTechFee,
                            otherFee: item.remainOtherFee,
                            overdueFee: item.remainOverdueInterest,
                            penaltyOverdueFee: item.remainPenaltyOverdueFee,
                            penaltyAheadFee: item.remainPenaltyAheadFee
                        })
                    })
                    param.repayReqItems = repayReqItems;
                } else {
                    param.repayReqItems = [repay]
                }
                console.log(param);
                // return;
                this.axios.post(repay_ygd_and_claim, param).then(e => {
                    if (!e.code) {
                        message.success("发送认领成功");
                        this.cancel();
                    }
                })
            }
        })


    }
    submit() {
        if (this.err.type) {
            this.props.form.setFields({
                [this.err.name]: {
                    errors: [new Error('不能大于应还金额-减免金额')],
                    value: Number(this.err.value).toFixed(2)
                },
            });
            return;
        }
        this.props.form.validateFields((err, val) => {
            if (!err) {
                var confirmDate = "", repayData=this.state.repayData,cost=0,income=0,repayTriggerType="";
                console.log(val)
                for (var i in val) {
                    if (i === "confirmDate") {
                        confirmDate = val[i].format("YYYY-MM-DD HH:mm:ss")
                    } else if(i==="cost") {
                        cost=val[i]?accMul(Number(val[i]),100):0
                    }else if(i==="income") {
                        income=val[i]?accMul(Number(val[i]),100):0
                    }else if(i==="repayTriggerType"){
                        repayTriggerType=val[i]
                    }
                }
                var param = {
                    contractNo: this.props.contract_no||this.state.contract_no,
                    repayTime:confirmDate,
                    repayTriggerType:repayTriggerType,
                    phaseStart:repayData[0].repayPlanItem.phase,
                    phaseEnd:repayData[repayData.length-1].repayPlanItem.phase,
                    extraFee:cost,
                    extraIncome:income,
                    gwType:"APPLY"
                }
                if (this.props.repayAll) {
                    param.repayPhaseList=null;
                } else {
                    var repayPhaseList={phase: this.repayPhase},actualFee={serviceTechFee:0};
                    this.type.forEach(item=>{
                        if(!item.total){
                            actualFee[item.id]=this.state[item.formText]?accMul(this.state[item.formText],100):0;
                        }else{
                            repayPhaseList.partialRepay=floatAdd(Number(this.state[item.formText]),Number(this.state[item.discount]))===floatAdd(Number(this.state[item.plan]),0)?false:true
                        }
                    })
                    repayPhaseList.actualFee=actualFee;
                    param.repayPhaseList=JSON.stringify([repayPhaseList]);
                }
                
                // console.log(param);
                // return;
                axios_loanMgnt.post(repay_directRepay, param).then(e => {
                    if (!e.code) {
                        message.success("发送认领成功");
                        this.cancel();
                    }
                })
            }
        })
    }
    //选择还款日
    changeDate(date, dateString) {
        console.log(date, dateString)
        var confirmDate = date.format("YYYY-MM-DD HH:mm:ss");
        this.repay_estimate(confirmDate);
    }
    //发送还款认领
    send() {

    }
    //代账项目
    get_other(e,type){
        this.setState({[type]:e.target.value});
        var money=this.state.planTotal||0;
        var repay=this.state.formTextTotal||0;
        if(type==="cost"){
            this.setState({"agentTotal":(Number(e.target.value)+Number((this.state.income||0))).toFixed(2),total:floatAdd(floatSub(Number(money),Number(e.target.value)),Number(this.state.income||0)),repayTotal:floatAdd(floatSub(Number(repay),Number(e.target.value)),Number(this.state.income||0))});
        }else{
            this.setState({"agentTotal":(Number(e.target.value)+Number(this.state.cost||0)).toFixed(2),total:floatSub(floatAdd(Number(money),Number(e.target.value)),Number(this.state.cost||0)),repayTotal:floatSub(floatAdd(Number(repay),Number(e.target.value)),Number(this.state.cost||0))});
        }
        this.props.form.setFieldsValue({ [type]: Number(e.target.value).toFixed(2) })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const modal = {
            visible: this.state.visible,
            title: "还款确认单",
            footer: <Button type="primary" onClick={this.props.repayType==="供应链金融"||this.props.repayType==="员工贷"?this.submit_gyl.bind(this):this.submit.bind(this)}>发送还款认领</Button>,
            onCancel: this.cancel.bind(this),
            width: "60%"
        }
        return (
            
            <Modal {...modal}>
                <Spin spinning={this.state.loading}>
                <FormItem label="还款日期" wrapperCol={{ span: 12 }} labelCol={{ span: 2 }} >
                    {getFieldDecorator("confirmDate", {
                        initialValue: moment()
                    })(
                        <DatePicker onChange={this.changeDate.bind(this)} showTime format="YYYY-MM-DD HH:mm:ss" showToday={false} />
                    )}
                </FormItem>
                {this.props.repayType==="供应链金融"||this.props.repayType==="员工贷"?null:<FormItem label="还款方式" wrapperCol={{ span: 12 }} labelCol={{ span: 2 }} >
                    {getFieldDecorator("repayTriggerType", {
                        initialValue: "USER"
                    })(
                        <Select>
                            <Option value="USER">用户主动还款</Option>
                            <Option value="CRON">用户被动扣款</Option>
                            <Option value="CP_SYNC">代收</Option>
                            <Option value="CP_REPAY">代偿</Option>
                            <Option value="CP_BUYBACK">回购</Option>
                        </Select>
                    )}
                </FormItem>}
                <Form className="sh_add">
                    <table className="sh_product_table" cellSpacing="0" cellPadding="0" style={{ fontSize: "14px" }}>
                        <thead style={{ background: "#f7f7f7" }}>
                            <tr>
                                {!this.props.repayAll ? <th style={{ background: "#f7f7f7" }}>期数</th> : null}
                                <th style={{ background: "#f7f7f7" }}>费用类别</th>
                                <th style={{ background: "#f7f7f7" }}>剩余应还金额</th>
                                <th style={{ background: "#f7f7f7" }}>减免金额</th>
                                <th style={{ background: "#f7f7f7" }}>本次还款金额</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.type.map((i, k) => {
                                    return <tr key={k}>
                                        {!this.props.repayAll ? <td>{!i.total ? this.repayPhase : ""}</td> : null}
                                        <td>{i.name}</td>
                                        <td>{!i.total ? this.state[i.plan] : this.state[i.plan]}</td>
                                        <td>{i.name === "应还本金"||i.name==="应还科技服务费" ? "——" : this.state[i.discount]}</td>
                                        <td>
                                            {!i.total && !this.props.repayAll ? <FormItem label="" wrapperCol={{ span: 24 }} >
                                                {getFieldDecorator(i.id, {
                                                    rules: [{ pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "格式错误" }],
                                                    // initialValue:accDiv(remainDiscount.interest,100).toFixed(2)||"",
                                                    validateTrigger: ["onChange"]
                                                })(
                                                    <Input placeholder="0.00" className="input_text" onBlur={(e) => { this.interest_change(e, (i.discount?floatSub(Number(this.state[i.plan]),Number(this.state[i.discount])):this.state[i.plan]), i.id) }} />
                                                )}
                                            </FormItem> : this.state[i.formText]}
                                        </td>
                                    </tr>
                                })
                            }
                            {this.props.repayType==="员工贷"?null:<tr>
                                {!this.props.repayAll ?<td>{this.repayPhase}</td>:null}
                                <td colSpan={4}>代账项目</td>
                            </tr>}
                            {this.props.repayType==="员工贷"?null:<tr>
                                {!this.props.repayAll ?<td>{this.repayPhase}</td>:null}
                                <td>-额外成本</td>
                                <td>
                                <FormItem label="" wrapperCol={{ span: 24 }} >
                                                {getFieldDecorator("cost", {
                                                    rules: [{ pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "格式错误" }],
                                                    // initialValue:accDiv(remainDiscount.interest,100).toFixed(2)||"",
                                                    validateTrigger: ["onChange"]
                                                })(
                                                    <Input placeholder="0.00" className="input_text" onBlur={(e)=>{this.get_other(e,"cost")}} />
                                                )}
                                            </FormItem> 
                                </td>
                                <td colSpan={2}></td>
                            </tr>}
                            {this.props.repayType==="员工贷"?null:<tr>
                                {!this.props.repayAll ?<td>{this.repayPhase}</td>:null}
                                <td>+额外收入</td>
                                <td>
                                <FormItem label="" wrapperCol={{ span: 24 }} >
                                                {getFieldDecorator("income", {
                                                    rules: [{ pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "格式错误" }],
                                                    // initialValue:accDiv(remainDiscount.interest,100).toFixed(2)||"",
                                                    validateTrigger: ["onChange"]
                                                })(
                                                    <Input placeholder="0.00" className="input_text" onBlur={(e)=>{this.get_other(e,"income")}}  />
                                                )}
                                            </FormItem> 
                                </td>
                                <td colSpan={2}></td>
                            </tr>}
                            {/* <tr>
                                {!this.props.repayAll ?<td></td>:null}
                                <td>小计</td>
                                <td>
                                {this.state.agentTotal}
                                </td>
                                <td colSpan={2}></td>
                            </tr> */}
                            {this.props.repayType==="员工贷"?null:<tr>
                                {!this.props.repayAll ?<td></td>:null}
                                <td>合计</td>
                                <td>
                                {this.state.total}
                                </td>
                                <td>{this.state.discountTotal}</td>
                                <td>{this.state.repayTotal}</td>
                            </tr>}
                        </tbody>
                    </table>
                </Form>
                </Spin>
            </Modal>
            
        )
    }
}
export default Form.create()(YgdDiscount)