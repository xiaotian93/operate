import React, { Component } from 'react';
import { Button, Form, Input, message, Modal, Checkbox, Row, Col } from 'antd';
import { project_limit_get, project_limit_edit } from '../../../../../../ajax/api';
import { axios_loan } from '../../../../../../ajax/request';
import { accDiv, accMul } from '../../../../../../ajax/tool';
import Permissions from '../../../../../../templates/Permissions';
const FormItem = Form.Item;
class Limit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            singleDayPaymentLimit: 0,
            totalPaymentLimit: 0,
            singleMonthPaymentLimit: 0,
            error: {
                type: false,
                name: "",
                text: ""
            },
            totalLimitType: true,
            monthLimitType: true,
            dayLimitType: true,
            loanBalanceLimitType: true
        };
    }
    componentWillMount() {
        this.loan_get();
    }
    //输入范围判定
    check_val(e, name, val, type) {
        this.setState({
            error: {
                type: false,
                name: "",
                text: ""
            }
        })
        var val_get = this.props.form.getFieldValue(val);
        if (val_get === "" || e.target.value === "") {
            return;
        }
        if (type) {
            if (Number(e.target.value) > Number(val_get)) {
                this.props.form.setFields({
                    [name]: {
                        errors: [new Error('不能高于总放款额度')],
                        value: e.target.value
                    },
                });
                this.setState({
                    error: {
                        type: true,
                        name: name,
                        text: "不能大于最大范围",
                        value: e.target.value
                    }
                })
            }
        } else {
            if (Number(e.target.value) < Number(val_get)) {
                this.props.form.setFields({
                    [name]: {
                        errors: [new Error('不能低于单日放款限额')],
                        value: e.target.value
                    },
                });
                this.setState({
                    error: {
                        type: true,
                        name: name,
                        text: "不能小于最小范围",
                        value: e.target.value
                    }
                })
            }
        }
    }
    cancelLimit() {
        this.setState({
            isSet: false
        });
    }
    editLimit() {
        this.setState({
            isSet: true
        });
        setTimeout(function () {
            this.props.form.setFieldsValue({ dayLimit: this.state.dayLimit, monthLimit: this.state.monthLimit, totalLimit: this.state.totalLimit, loanBalanceLimit: this.state.loanBalanceLimit });
        }.bind(this), 100)
    }
    loan_get() {
        axios_loan.post(project_limit_get, { appKey: this.props.appKey, page: 1, size: 100 }).then(e => {
            if (!e.code) {
                if (!e.data) {
                    this.setState({
                        isSet: true,
                        isCancel: false
                    });
                    return;
                }
                var data = e.data.list, type = { TOTAL_LOAN: "totalLimit", MONTH_LOAN: "monthLimit", DAY_LOAN: "dayLimit", LOAN_BALANCE: "loanBalanceLimit" };
                data.forEach(item => {
                    // console.log(item.amount)
                    this.setState({
                        [type[item.limitType]]: item.amount >= 0 ? accDiv(item.amount, 1000000) : "",
                        [type[item.limitType] + "Type"]: item.amount >= 0 ? false : true
                    })
                })
                this.setState({
                    isSet: false,
                    isCancel: true,
                })
            }
        })
    }
    save() {
        if (this.state.error.type) {
            this.props.form.setFields({
                [this.state.error.name]: {
                    errors: [new Error(this.state.error.text)],
                    value: this.state.error.value
                },
            });
            return;
        }
        this.props.form.validateFields((err, val) => {
            console.log(val)
            if (!err) {
                var param = {
                    dayLimit: this.state.dayLimitType ? -1 : accMul(val.dayLimit, 1000000),
                    monthLimit: this.state.monthLimitType ? -1 : accMul(val.monthLimit, 1000000),
                    totalLimit: this.state.totalLimitType ? -1 : accMul(val.totalLimit, 1000000),
                    loanBalanceLimit: this.state.loanBalanceLimitType ? -1 : accMul(val.loanBalanceLimit, 1000000),
                    appKey: this.props.appKey
                }
                if (param.totalLimit !== -1) {
                    if ((param.monthLimit !== -1 && param.totalLimit < param.monthLimit) || (param.dayLimit !== -1 && param.totalLimit < param.dayLimit)) {
                        message.warn("总放款量 ≥ 月放款量  ≥日放款量,请检查所填金额");
                        return
                    }
                }
                if (param.monthLimit !== -1) {
                    if ((param.dayLimit !== -1 && param.monthLimit < param.dayLimit)) {
                        message.warn("总放款量 ≥ 月放款量  ≥日放款量,请检查所填金额");
                        return
                    }
                }
                if (param.loanBalanceLimit !== -1) {
                    if ((param.dayLimit !== -1 && param.loanBalanceLimit < param.dayLimit) || (param.monthLimit !== -1 && param.loanBalanceLimit < param.monthLimit) || (param.totalLimit !== -1 && param.loanBalanceLimit < param.totalLimit)) {
                        message.warn("总放款量 ≥ 月放款量  ≥日放款量,请检查所填金额");
                        return
                    }
                }
                axios_loan.post(project_limit_edit, param).then(e => {
                    if (!e.code) {
                        message.success('操作成功');
                        this.loan_get();
                        this.cancel();
                    }
                })
            }
        })
    }
    //无限制
    noLimit(e, state) {
        this.setState({
            [state]: e.target.checked
        })
    }
    cancel() {
        this.setState({
            isSet: false
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const modal = {
            visible: this.state.isSet,
            title: "放款限制修改",
            footer: <div>
                <Button size="small" onClick={this.cancel.bind(this)}>取消</Button>
                <Button size="small" type="primary" onClick={this.save.bind(this)}>确定</Button>
            </div>,
            closable: false
        }
        const limitType = [{ name: "单日放款量上限", val: "dayLimit" }, { name: "月放款量上限", val: "monthLimit" }, { name: "总放款量上限", val: "totalLimit" }, { name: "贷款余额上限", val: "loanBalanceLimit" }]
        return <div className="sh_add" style={{ background: "#fff", marginBottom: "15px" }}>
            <div className="product_title">放款规模配置</div>
            <Modal {...modal}>
                {limitType.map((item, k) => {
                    return <Row>
                        <Col span={16}>
                            <FormItem label={item.name} labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} >
                                {getFieldDecorator(item.val, {
                                    rules: [{ pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "格式错误" }]
                                })(
                                    <Input placeholder="请输入" onBlur={(e) => { this.check_val(e, "totalPaymentLimit", "singleDayPaymentLimit", false) }} disabled={this.state[item.val + "Type"]} />
                                )}
                                <div style={{ position: "absolute", top: 0, right: 10 }}>万元</div>
                            </FormItem>
                        </Col>
                        <Col span={4}>
                            <Checkbox style={{ lineHeight: "32px" }} onChange={(e) => { this.noLimit(e, item.val + "Type") }} checked={this.state[item.val + "Type"]}>无限制</Checkbox>

                        </Col>
                    </Row>
                })}
            </Modal>

            <Row style={{ fontSize: 14, lineHeight: "28px" }}>
                <Col span={5}>
                    <span style={{ color: 'rgba(0,0,0,0.5)' }}>单日放款量上限</span> {this.state.dayLimitType ? "无限制" : this.state.dayLimit + "万元"}
                </Col>
                <Col span={5}>
                    <span style={{ color: 'rgba(0,0,0,0.5)' }}>月放款量上限</span> {this.state.monthLimitType ? "无限制" : this.state.monthLimit + "万元"}
                </Col>
                <Col span={5}>
                    <span style={{ color: 'rgba(0,0,0,0.5)' }}>总放款量上限</span> {this.state.totalLimitType ? "无限制" : this.state.totalLimit + "万元"}
                </Col>
                <Col span={5}>
                    <span style={{ color: 'rgba(0,0,0,0.5)' }}>贷款余额上限</span> {this.state.loanBalanceLimitType ? "无限制" : this.state.loanBalanceLimit + "万元"}
                </Col>
                <Col span={4}>
                    <Permissions type="primary" onClick={this.editLimit.bind(this)} server={global.AUTHSERVER.loan.key} tag="button" permissions={global.AUTHSERVER.loan.access.loan_limit_edit} tag="button">编辑</Permissions>
                </Col>
            </Row>
        </div>
    }
}
export default Form.create()(Limit);