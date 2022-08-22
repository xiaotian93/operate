import React, { Component } from 'react';
import { Row, Form, Input, Col, Button, Popconfirm } from 'antd';
// import axios from '../../../../ajax/request.js';
// import api from '../../../../ajax/api.js';
import Tbodys from './table';
// import {accDiv} from '../../../../../../../ajax/tool';
const FormItem = Form.Item;
//const {  RangePicker } = DatePicker;
//let clickNum=1,clickArr=[],refArr=[];
class Insurance extends Component {
    constructor(props) {
        super(props);
        props.onRef(this);
        this.state = {
            childId: []
        }
        this.arr = [];
    }
    componentWillMount() {
        //clickArr=[];
        //refArr=[]

    }
    componentDidMount() {
        if (this.props.configNo) {
            this.edit();
        }
    }
    edit() {
        if (this.props.edit_data) {
            var data = this.props.edit_data.id; console.log(data)
            this.props.form.setFieldsValue({ userLabel: data });
            var child = this.props.edit_data.data;
            var arr = [];
            child.forEach(e => {
                arr.push(e.id)
            });
            this.setState({
                childId: arr
            })
        }

    }
    delete() {
        var remove = this.props.del();
        if (remove) {
            this.props.remove_arr(this)
        }
    }

    get_val(e) {
        this.arr.push(e);
    }
    sub() {
        var productUserGroupList = [], userBasic = {};
        this.props.form.validateFields((err, val) => {
            if (!err) {
                // val.interestRateUnit=this.props.periodUnit;
                userBasic = val;
            } else {
                return []
            }
        })
        for (var i in this.arr) {
            if (this.arr[i].state.support === "true") {
                this.form_val(this.arr[i], userBasic, productUserGroupList)
            }
        }
        return productUserGroupList;
    }
    form_val(data, userBasic, productUserGroupList) {
        if (JSON.stringify(userBasic) === "{}") {
            return
        }
        data.props.form.validateFields((err, val) => {
            if (!err) {
                if (this.props.calRateType === "APR") {
                    val.aprInterestRate = val.aprInterestRate;
                    if (this.props.rate) {
                        val.aprGeneralRate = val.generalRateMin + "-" + val.generalRateMax;
                        delete val.generalRateMin;
                        delete val.generalRateMax;
                    } else {
                        val.aprGeneralRate = val.aprGeneralRate;
                    }
                    if (val.aprFeeRate) {
                        val.aprFeeRate = val.aprFeeRate;
                    }
                } else {
                    val.interestRate = val.interestRate;
                    if (this.props.rate) {
                        val.generalRate = val.generalRateMin + "-" + val.generalRateMax;
                        delete val.generalRateMin;
                        delete val.generalRateMax;
                    } else {
                        val.generalRate = val.generalRate;
                    }
                    if (val.feeRate) {
                        val.feeRate = val.feeRate;
                    }
                }
                if (data.state.id) {
                    val.id = data.state.id;
                }
                var newJson = Object.assign({}, userBasic, val)
                if (newJson.periodCount) {
                    productUserGroupList.push(newJson)
                }
            }
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formInit = {
            // labelCol: { span: 6 },
            // wrapperCol: { span: 12 },
            colon: false
        };
        const confirm = {
            title: "确认要删除该用户群？",
            okText: "确定",
            cancelText: "取消",
            onConfirm: this.delete.bind(this),
            placement: "topRight"
        }
        console.log(this.props.tag)
        console.log(this.props.edit_data)

        return (
            //<Form className='fqsq'>
            <Row className="modal_box_border" style={{ marginBottom: "15px", borderBottom: "1px solid #F4F6F7" }}>
                <Row id={this.props.id}>
                    <Row style={{ margin: "0 auto 15px auto", padding: "25px 0 0 0" }}>
                        <Row>
                            <Col span={12}>
                                <FormItem label="" {...formInit} wrapperCol={{ span: 20 }}>
                                    {getFieldDecorator('userLabel', {
                                        rules: [{ required: true, message: '请输入用户群名称' }],
                                    })(
                                        <Input type="text" placeholder="请输入用户群名称" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12} style={{ textAlign: "right" }}>
                                <Popconfirm {...confirm}>
                                    <Button type="danger" icon="minus" >删除</Button>
                                </Popconfirm>
                            </Col>
                        </Row>
                        <table className="sh_product_table" cellSpacing="0" cellPadding="0">
                            <thead>
                                <tr style={{ border: "1px solid red" }}>
                                    <th>期数</th>
                                    <th>是否支持</th>
                                    <th>综合费率({this.props.unit}利率)</th>
                                    <th>小贷利息费率({this.props.unit}利率)</th>
                                    {this.props.service === "FIX" ? <th>小贷服务费收取金额</th> : null}
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.props.tag.length > 0 ? this.props.tag.map((i, k) => {
                                        if (this.props.edit_data) {
                                            var data = this.props.edit_data.data, rowData = {};
                                            for (var j in data) {
                                                if (Number(data[j]["periodCount"]) === Number(i)) {
                                                    rowData = data[j]
                                                }
                                            }
                                        }
                                        return <Tbodys key={k} num={i} serve={this.props.service} onRef={this.get_val.bind(this)} edit_data={this.props.edit_data ? rowData : {}} support={this.props.support} configNo={this.props.configNo} rate={this.props.rate} calRateType={this.props.calRateType} />
                                    }) : <tr style={{ textAlign: "center", color: "rgba(0,0,0,0.43)", fontSize: "12px" }}><td colSpan={5} style={{ padding: "16px 8px" }}>暂无数据</td></tr>
                                }
                            </tbody>
                        </table>
                    </Row>
                </Row>
            </Row>
            //</Form>
        )
    }
}
export default Form.create()(Insurance);
