import React, { Component } from 'react';
import { Row, Form, Select, Input, Col, Button, message, Radio, Modal } from 'antd';
import { loan_manage_add, loan_manage_detail, loan_manage_update } from '../../../ajax/api';
import { axios_loan } from '../../../ajax/request';
import { browserHistory } from 'react-router';
import ComponentRoute from '../../../templates/ComponentRoute';
import {accMul,accDiv} from '../../../ajax/tool';
const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
class Product_cxfq extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            productId: props.location.query.code,
            isleave:false,
            error:{
                type:false,
                name:"",
                text:""
            },
            // raCollectType:"ALL"
        };
    }
    componentWillMount() {
        if (this.state.productId) {
            this.getDetail();
        }
        this.props.router.setRouteLeaveHook(
            this.props.route,
            this.routerWillLeave.bind(this)
    )
    }
    shouldComponentUpdate(props,state){
            this.props.router.setRouteLeaveHook(
                this.props.route,
                this.routerWillLeave.bind(this)
        )
        return true
        
    }
    routerWillLeave(nextLocation){
        if(this.state.isleave){
            return true
        }else{
            this.setState({
                leave:true,
                isleave:true,
                next:nextLocation.pathname
            })
            return false;
        }
    };
    leaveOk(){
        this.setState({
            leave:false,
            isleave:false
        })
    }
    leaveClose(){
        this.setState({
            leave:false,
            isleave:true
        })
        browserHistory.push(this.state.next)
    }
    getDetail() {
        axios_loan.get(loan_manage_detail + "?code=" + this.state.productId).then(e => {
            if (!e.code) {
                var data = e.data;
                var config=data.loanConfig;
                var product=data.product;
                var loanLimit=data.loanLimit;
                this.props.form.setFieldsValue({name:data.name,desc:data.desc})
                this.setState({
                    isRepay:config.canRepayAhead,
                    isEarly:config.canRepayAheadAll,
                    isEarly_money:config.hasPenaltyAheadFee,
                    isLate:config.hasOverdueFee,
                    isFalsity:config.hasPenaltyOverdueFee,
                    // raCollectType:config.raCollectType,
                    termType:config.loanPeriodUnit,
                    repayPlanTemplate:config.repayPlanTemplate||"",
                })
                this.props.form.setFieldsValue({name:product.name});
                this.props.form.setFieldsValue({desc:product.desc});
                for(var i in loanLimit){
                    if(i!=="createTime"&&i!=="id"&&i!=="productId"&&i!=="updateTime"&&loanLimit[i]!==null){
                        if(i.indexOf("Amount")!==-1){
                            this.props.form.setFieldsValue({[i]:accDiv(loanLimit[i],100)})
                        }else if(i.indexOf("Rate")!==-1){
                            this.props.form.setFieldsValue({[i]:accMul(loanLimit[i],100)})
                        }else{
                            this.props.form.setFieldsValue({[i]:loanLimit[i]})
                        }
                    }
                }
                for(var j in config){
                    if(j!=="createTime"&&j!=="id"&&j!=="productId"&&j!=="updateTime"&&config[j]!==null){
                        if(j.indexOf("Amount")!==-1){
                            this.props.form.setFieldsValue({[j]:accDiv(config[j],100)})
                        }else if(j.indexOf("Rate")!==-1){
                            if(j.indexOf("Type")!==-1){
                                this.props.form.setFieldsValue({[j]:config[j]})
                            }else{
                                this.props.form.setFieldsValue({[j]:accMul(config[j],100)})
                            }
                        }else{
                            this.props.form.setFieldsValue({[j]:config[j]})
                        }
                    }
                }
            }
        })
    }
    sure(e) {
        e.preventDefault();
        if(this.state.error.type){
            this.props.form.setFields({
                [this.state.error.name]: {
                    errors: [new Error(this.state.error.text)],
                    value:this.state.error.value
                },
            });
            return;
        }
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                var tem={};
                    for(var i in values){
                        // if(i==="penaltyAheadFeeMinAmount"||i==="penaltyAheadFeeMaxRate"||i==="overdueFeeMinAmount"||i==="overdueFeeMaxRate"||i==="penaltyOverdueFeeMinAmount"||i==="penaltyOverdueFeeMaxRate"){
                        //     tem[i]=values[i]?values[i]:0;
                        // }
                        // if(i!=="name"&&i!=="desc"){
                            if(i.indexOf("Amount")!==-1){
                                tem[i]=accMul(values[i],100);
                            }else if(i.indexOf("Rate")!==-1){
                                if(i.indexOf("Type")!==-1){
                                    tem[i]=values[i];
                                }else{
                                    tem[i]=accDiv(values[i],100);
                                }
                            }else{
                                tem[i]=values[i];
                            }
                        // }
                    }
                    tem.RepayPlanTemplate=this.state.repayPlanTemplate||"";
                    tem.penaltyAheadFeeMinAmount=tem.penaltyAheadFeeMinAmount||0;
                    tem.penaltyAheadFeeMaxRate=tem.penaltyAheadFeeMaxRate||0;
                    tem.overdueFeeMinAmount=tem.overdueFeeMinAmount||0;
                    tem.overdueFeeMaxRate=tem.overdueFeeMaxRate||0;
                    tem.penaltyOverdueFeeMinAmount=tem.penaltyOverdueFeeMinAmount||0;
                    tem.penaltyOverdueFeeMaxRate=tem.penaltyOverdueFeeMaxRate||0;
                    // tem.raCollectType=this.state.raCollectType;
                    // param.name=values.name;
                    // param.desc=values.desc;
                    // param.config=JSON.stringify(tem);
                if (this.state.productId) {
                    tem.code = this.state.productId;
                    // param.repayConfig=JSON.stringify(this.state.repayConfig);
                    // console.log(param);
                    // return;
                    axios_loan.post(loan_manage_update,tem).then(e => {
                        if (e.code === 0) {
                            this.setState({
                                isleave:true,
                            })
                            message.success('????????????');
                            this.reset();
                            browserHistory.push("/cp/total/list")
                        }
                    })
                } else {
                    axios_loan.post(loan_manage_add,tem).then(e => {
                        if (e.code === 0) {
                            this.setState({
                                isleave:true,
                            })
                            message.success('????????????');
                            this.reset();
                            browserHistory.push("/cp/total/list")
                        }
                    })
                }

            }
        });
    }
    reset() {
        this.props.form.resetFields();
        this.setState({
            isRepay:false,
            isEarly:false,
            isEarly_money:false,
            isLate:false,
            isFalsity:false
        })
    }
    clickReset() {
        this.setState({ visible: true })
    }
    onOk() {
        this.reset();
        this.setState({ visible: false })
    }
    onCancel() {
        this.setState({ visible: false })
    }
    //
    repay(e){
        this.setState({
            isRepay:e.target.value
        })
    }
    early(e){
        this.setState({
            isEarly:e.target.value
        })
    }
    early_money(e){
        this.setState({
            isEarly_money:e.target.value
        })
    }
    late(e){
        this.setState({
            isLate:e.target.value
        })
    }
    falsity(e){
        this.setState({
            isFalsity:e.target.value
        })
    }
    change_type(e){
        console.log(e)
        this.setState({
            termType:e.target.value
        })
    }
    //??????????????????
    check_val(e,name,val,type){
        this.setState({
            error:{
                type:false,
                name:"",
                text:""
            }
        })
        var val_get=this.props.form.getFieldValue(val);
        if(val_get===""||e.target.value===""){
            return;
        }
        if(type){
            if(Number(e.target.value)>Number(val_get)){
                this.props.form.setFields({
                    [name]: {
                        errors: [new Error('????????????????????????')],
                        value:e.target.value
                    },
                });
                this.setState({
                    error:{
                        type:true,
                        name:name,
                        text:"????????????????????????",
                        value:e.target.value
                    }
                })
            }else{
                this.props.form.setFields({
                    [val]: {
                        value:val_get
                    },
                });
            }
        }else{
            if(Number(e.target.value)<Number(val_get)){
                this.props.form.setFields({
                    [name]: {
                        errors: [new Error('????????????????????????')],
                        value: e.target.value
                    },
                });
                this.setState({
                    error:{
                        type:true,
                        name:name,
                        text:"????????????????????????",
                        value:e.target.value
                    }
                })
            }else{
                    this.props.form.setFields({
                        [val]: {
                            value:val_get
                        },
                    });
            }
        }
    }
    //cancel
    cancel(){
        browserHistory.push('/cp/total/list');
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const modalInfo = {
            title: "??????",
            visible: this.state.visible,
            onOk: this.onOk.bind(this),
            onCancel: this.onCancel.bind(this),
            maskClosable: false
        };
        let paths = ["????????????1"];
        if (this.state.productId) {
            paths.push("????????????");
        } else {
            paths.push("????????????");
        }
        const titleInfo = {
            span: 4,
            className: "text_margin"
        }
        const formInfoSmall = {
            labelCol: { span: 7 },
            wrapperCol: { span: 11 },
            colon: false,
            className: "tableForm text_left",
            labelAlign: "left"
        };
        const leave={
            visible:this.state.leave,
            maskClosable:false,
            closable:false,
            onOk:this.leaveClose.bind(this),
            onCancel:this.leaveOk.bind(this),
            cancelText:"????????????",
            okText:"????????????",
            title:"????????????"
        }
        const term={"DAY":"???","MONTH":"??????","YEAR":"???"}
        return (
            <div>
                <Form className="product_cxfq sh_add content" >
                    <Row style={{marginBottom:"50px"}}>

                        <div className="card_cx">
                            <div className="title">
                                <div className="icon" />
                                <span className="titleWord">????????????</span>
                            </div>
                            <div className="sh_add_card_product" style={{padding:"0"}}>
                                <Row className="product_card">
                                    <div className="sh_inner_box">
                                        <Col {...titleInfo}>
                                            <span className="product_card_title">????????????</span>
                                        </Col>
                                        <Col span={20}>
                                            {/* <FormItem label={<span style={{ width: "100%" }}>????????????</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} colon={false}>
                                                {getFieldDecorator("code", {
                                                    initialValue: "",
                                                })(
                                                    <div>CP-00001</div>
                                                )}
                                            </FormItem> */}
                                            <FormItem label={<span style={{ width: "100%" }}>????????????</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 10 }} colon={false}>
                                                {getFieldDecorator("name", {
                                                    initialValue: "",
                                                    rules: [{ required: true, message: "?????????????????????" },{max:20,message:"??????20?????????"},{pattern:/^[^ ]+$/,message:"?????????????????????"}]
                                                })(
                                                    <Input placeholder="????????????????????????????????????????????????20?????????" />
                                                )}
                                            </FormItem>
                                            <FormItem label={<span style={{ width: "100%"}}>????????????</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} colon={false}>
                                                {getFieldDecorator("desc", {
                                                    initialValue: "",
                                                    rules: [{ required: true, message: "?????????????????????" },{max:1000,message:"??????1000?????????"}]
                                                })(
                                                    <TextArea placeholder="??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????1000?????????" />
                                                )}
                                            </FormItem>
                                        </Col>
                                    </div>
                                </Row>
                                <Row className="product_card">
                                    <div className="sh_inner_box">
                                        <Col {...titleInfo}>
                                            <span className="product_card_title">????????????</span>
                                        </Col>
                                        <Col span={20}>
                                            <Row>
                                                <Col
                                                    span={4}
                                                    style={{ textAlign: "right", fontSize: "14px", color: "rgba(0,0,0,0.5)", paddingRight: "13px", marginBottom: "15px", lineHeight: "32px" }}
                                                >
                                                    <span>??????????????????</span>
                                                </Col>
                                                <Col span={8}>
                                                    <FormItem className="text_left" label="" {...formInfoSmall} >
                                                        {getFieldDecorator('minLoanAmount', {
                                                            initialValue: "",
                                                            rules: [{ pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "????????????" }, { required: true, message: "?????????????????????" }]
                                                        })(
                                                            <Input placeholder="?????????????????????" onBlur={(e)=>{this.check_val(e,"minLoanAmount","maxLoanAmount",true)}} />
                                                        )}
                                                        <div className="formIcon" >???</div>
                                                    </FormItem>
                                                </Col>
                                                <Col span={1} pull={4} style={{ lineHeight: "32px" }}>??????</Col>
                                                <Col span={8} pull={4} >
                                                    <FormItem className="" label="" {...formInfoSmall} >
                                                        {getFieldDecorator('maxLoanAmount', {
                                                            initialValue: "",
                                                            rules: [{ pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "????????????" }, { required: true, message: "?????????????????????" }]
                                                        })(
                                                            <Input placeholder="?????????????????????" onBlur={(e)=>{this.check_val(e,"maxLoanAmount","minLoanAmount",false)}} />
                                                        )}

                                                        <div className="formIcon" >???</div>
                                                    </FormItem>
                                                </Col>
                                            </Row>
                                            <FormItem label={<span style={{ width: "100%" }}>??????????????????</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} colon={false}>
                                                {getFieldDecorator("loanPeriodUnit", {
                                                    initialValue: "",
                                                    rules: [{ required: true, message: "???????????????????????????" }]
                                                })(
                                                    <RadioGroup onChange={this.change_type.bind(this)}>
                                                        <Radio value="DAY">???</Radio>
                                                        <Radio value="MONTH">???</Radio>
                                                        <Radio value="YEAR">???</Radio>
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                            <Row>
                                                <Col
                                                    span={4}
                                                    style={{ textAlign: "right", fontSize: "14px", color: "rgba(0,0,0,0.5)", paddingRight: "13px",marginBottom: "15px", lineHeight: "32px" }}
                                                >
                                                    <span>??????????????????</span>
                                                </Col>
                                                <Col span={8}>
                                                    <FormItem className="text_left" label="" {...formInfoSmall} >
                                                        {getFieldDecorator('minLoanPeriod', {
                                                            initialValue: "",
                                                            rules: [{ pattern: /^[1-9]\d*$/, message: "????????????" }, { required: true, message: "?????????????????????" }]
                                                        })(
                                                            <Input placeholder="?????????????????????" onBlur={(e)=>{this.check_val(e,"minLoanPeriod","maxLoanPeriod",true)}} />
                                                        )}
                                                        <div className="formIcon" >{term[this.state.termType]}</div>
                                                    </FormItem>
                                                </Col>
                                                <Col span={1} pull={4} style={{ lineHeight: "32px" }}>??????</Col>
                                                <Col span={8} pull={4} >
                                                    <FormItem className="" label="" {...formInfoSmall} >
                                                        {getFieldDecorator('maxLoanPeriod', {
                                                            initialValue: "",
                                                            rules: [{ pattern: /^[1-9]\d*$/, message: "????????????" }, { required: true, message: "?????????????????????" }]
                                                        })(
                                                            <Input placeholder="?????????????????????" onBlur={(e)=>{this.check_val(e,"maxLoanPeriod","minLoanPeriod",false)}} />
                                                        )}
                                                        <div className="formIcon" >{term[this.state.termType]}</div>
                                                    </FormItem>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col
                                                    span={4}
                                                    style={{ textAlign: "right", fontSize: "14px", color: "rgba(0,0,0,0.5)", paddingRight: "13px", marginBottom: "15px", lineHeight: "20px" }}
                                                >
                                                    <span>??????????????????????????????</span>
                                                </Col>
                                                <Col span={8}>
                                                    <FormItem className="text_left" label="" {...formInfoSmall} >
                                                        {getFieldDecorator('minYearRate', {
                                                            initialValue: "",
                                                            rules: [{ pattern: /^([1-9]\d?(\.\d{1,5})?|0\.\d{1,5}|100)$/, message: "????????????" }, { required: true, message: "?????????????????????" }]
                                                        })(
                                                            <Input placeholder="?????????????????????" onBlur={(e)=>{this.check_val(e,"minYearRate","maxYearRate",true)}} />
                                                        )}
                                                        <div className="formIcon" >%</div>
                                                    </FormItem>
                                                </Col>
                                                <Col span={1} pull={4} style={{ lineHeight: "32px" }}>??????</Col>
                                                <Col span={8} pull={4} >
                                                    <FormItem className="" label="" {...formInfoSmall} >
                                                        {getFieldDecorator('maxYearRate', {
                                                            initialValue: "",
                                                            rules: [{ pattern: /^([1-9]\d?(\.\d{1,5})?|0\.\d{1,5}|100)$/, message: "????????????" }, { required: true, message: "?????????????????????" }]
                                                        })(
                                                            <Input placeholder="?????????????????????" onBlur={(e)=>{this.check_val(e,"maxYearRate","minYearRate",false)}} />
                                                        )}
                                                        <div className="formIcon" >%</div>
                                                    </FormItem>
                                                </Col>
                                            </Row>
                                            <FormItem label={<span style={{ width: "100%" }}>??????????????????</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} colon={false}>
                                                {getFieldDecorator("rateUnit", {
                                                    initialValue: "",
                                                    rules: [{ required: true, message: "???????????????????????????" }]
                                                })(
                                                    <RadioGroup>
                                                        <Radio value="DAY">???</Radio>
                                                        <Radio value="MONTH">???</Radio>
                                                        <Radio value="YEAR">???</Radio>
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                            <FormItem label={<span style={{ width: "100%" }}>??????????????????</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} colon={false}>
                                                {getFieldDecorator("calRateType", {
                                                    initialValue: "",
                                                    rules: [{ required: true, message: "???????????????????????????" }]
                                                })(
                                                    <RadioGroup>
                                                        <Radio value="IRR">IRR</Radio>
                                                        <Radio value="APR">APR</Radio>
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                            <Row>
                                                <Col
                                                    span={4}
                                                    style={{ textAlign: "right", fontSize: "14px", color: "rgba(0,0,0,0.5)", paddingRight: "13px", marginBottom: "15px", lineHeight: "32px" }}
                                                >
                                                    <span>??????????????????</span>
                                                </Col>
                                                <Col span={8}>
                                                    <FormItem className="text_left" label="" {...formInfoSmall} >
                                                        {getFieldDecorator('minGeneralRate', {
                                                            initialValue: "",
                                                            rules: [{ pattern: /^([1-9]\d?(\.\d{1,5})?|0\.\d{1,5}|100)$/, message: "????????????" }, { required: true, message: "?????????????????????" }]
                                                        })(
                                                            <Input placeholder="?????????????????????" onBlur={(e)=>{this.check_val(e,"minGeneralRate","maxGeneralRate",true)}} />
                                                        )}
                                                        <div className="formIcon" >%</div>
                                                    </FormItem>
                                                </Col>
                                                <Col span={1} pull={4} style={{ lineHeight: "32px" }}>??????</Col>
                                                <Col span={8} pull={4} >
                                                    <FormItem className="" label="" {...formInfoSmall} >
                                                        {getFieldDecorator('maxGeneralRate', {
                                                            initialValue: "",
                                                            rules: [{ pattern: /^([1-9]\d?(\.\d{1,5})?|0\.\d{1,5}|100)$/, message: "????????????" }, { required: true, message: "?????????????????????" }]
                                                        })(
                                                            <Input placeholder="?????????????????????" onBlur={(e)=>{this.check_val(e,"maxGeneralRate","minGeneralRate",false)}} />
                                                        )}
                                                        <div className="formIcon" >%</div>
                                                    </FormItem>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </div>
                                </Row>
                                <Row className="product_card">
                                    <div className="sh_inner_box">
                                        <Col {...titleInfo}>
                                            <span className="product_card_title">????????????</span>
                                        </Col>
                                        <Col span={20}>
                                            <FormItem label={<span style={{ width: "100%" }}>????????????????????????</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} colon={false}>
                                                {getFieldDecorator("partRepayConfirm", {
                                                    initialValue: "",
                                                    rules: [{ required: true, message: "?????????????????????????????????" }]
                                                })(
                                                    <RadioGroup>
                                                        <Radio value>??????</Radio>
                                                        <Radio value={false}>?????????</Radio>
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                            <FormItem label={<div style={{ width: "100%",paddingRight:"13px",lineHeight:"20px",whiteSpace:"normal"}}>???????????????????????????????????????</div>} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} colon={false} className="formWhite">
                                                {getFieldDecorator("canRepayAhead", {
                                                    initialValue: "",
                                                    rules: [{ required: true, message: "?????????????????????????????????" }]
                                                })(
                                                    <RadioGroup onChange={this.repay.bind(this)}>
                                                        <Radio value>??????</Radio>
                                                        <Radio value={false}>?????????</Radio>
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                            {this.state.isRepay?<FormItem label={<div style={{ width: "100%",paddingRight:"13px",lineHeight:"20px",whiteSpace:"normal"}}>???????????????????????????????????????</div>} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} colon={false} className="formWhite">
                                                {getFieldDecorator("raCollectType", {
                                                    initialValue: "",
                                                    rules: [{ required: true, message: "?????????????????????" }]
                                                })(
                                                    <RadioGroup>
                                                        <Radio value="ALL">?????????????????????????????????</Radio>
                                                        <Radio value="CAL_DAY">????????????</Radio>
                                                        <Radio value="OTHER">????????????</Radio>
                                                    </RadioGroup>
                                                )}
                                            </FormItem>:null}
                                        </Col>
                                    </div>
                                </Row>
                                <Row className="product_card">
                                    <div className="sh_inner_box">
                                        <Col {...titleInfo}>
                                            <span className="product_card_title">??????????????????</span>
                                        </Col>
                                        <Col span={20}>
                                            <FormItem label={<span style={{ width: "100%" }}>????????????????????????</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} colon={false}>
                                                {getFieldDecorator("canRepayAheadAll", {
                                                    initialValue: "",
                                                    rules: [{ required: true, message: "?????????????????????????????????" }]
                                                })(
                                                    <RadioGroup onChange={this.early.bind(this)}>
                                                        <Radio value>??????</Radio>
                                                        <Radio value={false}>?????????</Radio>
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                            {this.state.isEarly?<div><FormItem label={<div style={{ width: "100%",paddingRight:"13px",lineHeight:"20px",whiteSpace:"normal"}}>???????????????????????????????????????</div>} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} colon={false} className="formWhite">
                                                {getFieldDecorator("raaCollectType", {
                                                    initialValue: "",
                                                    rules: [{ required: true, message: "?????????????????????" }]
                                                })(
                                                    <RadioGroup>
                                                        <Radio value="CURRENT">??????????????????????????????</Radio>
                                                        <Radio value="ALL">?????????????????????????????????</Radio>
                                                        <Radio value="CAL_DAY">????????????</Radio>
                                                        <Radio value="OTHER">????????????</Radio>
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                            <FormItem label={<div style={{ width: "100%",paddingRight:"13px",lineHeight:"20px",whiteSpace:"normal" }}>?????????????????????????????????</div>} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} colon={false} className="formWhite">
                                                {getFieldDecorator("hasPenaltyAheadFee", {
                                                    initialValue: "",
                                                    rules: [{ required: true, message: "??????????????????????????????" }]
                                                })(
                                                    <RadioGroup onChange={this.early_money.bind(this)}>
                                                        <Radio value>??????</Radio>
                                                        <Radio value={false}>?????????</Radio>
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                            {this.state.isEarly_money?<Row>
                                                <Col
                                                    span={4}
                                                    style={{ textAlign: "right", fontSize: "14px", color: "rgba(0,0,0,0.5)", paddingRight: "13px", marginBottom: "15px", lineHeight: "32px" }}
                                                >
                                                    <span>?????????????????????</span>
                                                </Col>
                                                <Col span={8}>
                                                    <FormItem className="text_left" label="" {...formInfoSmall} >
                                                        {getFieldDecorator('penaltyAheadFeeMinAmount', {
                                                            initialValue: "",
                                                            rules: [{ pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "????????????" }, { required: true, message: "?????????" }]
                                                        })(
                                                            <Input placeholder="?????????" />
                                                        )}
                                                        <div className="formIcon" >???</div>
                                                    </FormItem>
                                                </Col>
                                                <Col span={1} pull={4} style={{ lineHeight: "32px" }}>??????</Col>
                                                <Col span={8} pull={4} >
                                                    <FormItem className="" label="" {...formInfoSmall} >
                                                        {getFieldDecorator('penaltyAheadFeeMaxRate', {
                                                            initialValue: "",
                                                            rules: [{ pattern: /^(([1-9]\d{0,2}?(\.\d{1,5})?|0\.\d{1,5})|1000)$/, message: "????????????" }, { required: true, message: "?????????" }]
                                                        })(
                                                            <Input placeholder="?????????" />
                                                        )}
                                                        <div className="formIcon" >%</div>
                                                        <div className="formText" >*????????????</div>
                                                    </FormItem>
                                                </Col>
                                            </Row>:null}
                                            </div>:null}
                                            <FormItem label={<div style={{ width: "100%",paddingRight:"13px",lineHeight:"20px",whiteSpace:"normal" }}>????????????????????????????????????????????????</div>} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} colon={false} className="formWhite">
                                                {getFieldDecorator("onlyRepayLastPhaseAsRaa", {
                                                    initialValue: "",
                                                    rules: [{ required: true, message: "??????????????????????????????" }]
                                                })(
                                                    <RadioGroup>
                                                        <Radio value>???????????????</Radio>
                                                        <Radio value={false}>??????????????????</Radio>
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </div>
                                </Row>
                                <Row className="product_card">
                                    <div className="sh_inner_box">
                                        <Col {...titleInfo}>
                                            <span className="product_card_title">??????????????????</span>
                                        </Col>
                                        <Col span={20}>
                                            <FormItem label={<span style={{ width: "100%" }}>??????????????????</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} colon={false}>
                                                {getFieldDecorator("hasOverdueFee", {
                                                    initialValue: "",
                                                    rules: [{ required: true, message: "???????????????????????????" }]
                                                })(
                                                    <RadioGroup onChange={this.late.bind(this)}>
                                                        <Radio value>??????</Radio>
                                                        <Radio value={false}>?????????</Radio>
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                            {this.state.isLate?<div><FormItem label={<span style={{ width: "100%" }}>?????????????????????</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} colon={false}>
                                                {getFieldDecorator("hasOverdueFeeGrace", {
                                                    initialValue: "",
                                                    rules: [{ required: true, message: "??????????????????????????????" }]
                                                })(
                                                    <RadioGroup>
                                                        <Radio value>??????</Radio>
                                                        <Radio value={false}>?????????</Radio>
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                            <FormItem label={<span style={{ width: "100%" }}>????????????</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} colon={false}>
                                                {getFieldDecorator("overdueFeeBase", {
                                                    initialValue: "",
                                                    rules: [{ required: true, message: "?????????????????????" }]
                                                })(
                                                    <RadioGroup>
                                                        <Radio value="BALANCE">?????????????????????</Radio>
                                                        <Radio value="PHASE_PRINCIPAL_RATE">?????????????????????????????????</Radio>
                                                        <Radio value="PHASE_PRINCIPAL">?????????????????????????????????</Radio>
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                            <Row>
                                                <Col
                                                    span={4}
                                                    style={{ textAlign: "right", fontSize: "14px", color: "rgba(0,0,0,0.5)", paddingRight: "13px", marginBottom: "15px", lineHeight: "32px" }}
                                                >
                                                    <span>??????????????????</span>
                                                </Col>
                                                <Col span={8}>
                                                    <FormItem className="text_left" label="" {...formInfoSmall} >
                                                        {getFieldDecorator('overdueFeeMinAmount', {
                                                            initialValue: "",
                                                            rules: [{ pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "????????????" }, { required: true, message: "?????????" }]
                                                        })(
                                                            <Input placeholder="?????????" />
                                                        )}
                                                        <div className="formIcon" >???</div>
                                                    </FormItem>
                                                </Col>
                                                <Col span={1} pull={4} style={{ lineHeight: "32px" }}>??????</Col>
                                                <Col span={8} pull={4} >
                                                    <FormItem className="" label="" {...formInfoSmall} >
                                                        {getFieldDecorator('overdueFeeMaxRate', {
                                                            initialValue: "",
                                                            rules: [{ pattern: /^(([1-9]\d{0,2}?(\.\d{1,5})?|0\.\d{1,5})|1000)$/, message: "????????????" }, { required: true, message: "?????????" }]
                                                        })(
                                                            <Input placeholder="?????????" />
                                                        )}
                                                        <div className="formIcon" >%</div>
                                                        <div className="formText" >*????????????</div>
                                                    </FormItem>
                                                </Col>
                                            </Row></div>:null}
                                        </Col>
                                    </div>
                                </Row>
                                <Row className="product_card">
                                    <div className="sh_inner_box">
                                        <Col {...titleInfo}>
                                            <span className="product_card_title">???????????????</span>
                                        </Col>
                                        <Col span={20}>
                                            <FormItem label={<span style={{ width: "100%" }}>?????????????????????</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} colon={false}>
                                                {getFieldDecorator("hasPenaltyOverdueFee", {
                                                    initialValue: "",
                                                    rules: [{ required: true, message: "??????????????????????????????" }]
                                                })(
                                                    <RadioGroup onChange={this.falsity.bind(this)}>
                                                        <Radio value>??????</Radio>
                                                        <Radio value={false}>?????????</Radio>
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                            {this.state.isFalsity?<div><FormItem label={<span style={{ width: "100%" }}>?????????????????????</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} colon={false}>
                                                {getFieldDecorator("hasPenaltyOverdueFeeGrace", {
                                                    initialValue: "",
                                                    rules: [{ required: true, message: "??????????????????????????????" }]
                                                })(
                                                    <RadioGroup>
                                                        <Radio value>??????</Radio>
                                                        <Radio value={false}>?????????</Radio>
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                            <FormItem label={<span style={{ width: "100%" }}>????????????</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} colon={false}>
                                                {getFieldDecorator("penaltyOverdueFeeBase", {
                                                    initialValue: "",
                                                    rules: [{ required: true, message: "?????????????????????" }]
                                                })(
                                                    <RadioGroup placeholder="?????????">
                                                        <Radio value="PHASE_FIXED">????????????/???</Radio>
                                                        <Radio value="BALANCE">?????????????????????</Radio>
                                                        <Radio value="PHASE_PRINCIPAL_RATE">???????????????????????????</Radio>
                                                        <Radio value="PHASE_PRINCIPAL">???????????????????????????</Radio>
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                            <Row>
                                                <Col
                                                    span={4}
                                                    style={{ textAlign: "right", fontSize: "14px", color: "rgba(0,0,0,0.5)", paddingRight: "13px", marginBottom: "15px", lineHeight: "32px" }}
                                                >
                                                    <span>?????????????????????</span>
                                                </Col>
                                                <Col span={8}>
                                                    <FormItem className="text_left" label="" {...formInfoSmall} >
                                                        {getFieldDecorator('penaltyOverdueFeeMinAmount', {
                                                            initialValue: "",
                                                            rules: [{ pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "????????????" }, { required: true, message: "?????????" }]
                                                        })(
                                                            <Input placeholder="?????????" />
                                                        )}
                                                        <div className="formIcon" >???</div>
                                                    </FormItem>
                                                </Col>
                                                <Col span={1} pull={4} style={{ lineHeight: "32px"}}>??????</Col>
                                                <Col span={8} pull={4} >
                                                    <FormItem className="" label="" {...formInfoSmall} >
                                                        {getFieldDecorator('penaltyOverdueFeeMaxRate', {
                                                            initialValue: "",
                                                            rules: [{ pattern: /^(([1-9]\d{0,2}?(\.\d{1,5})?|0\.\d{1,5})|1000)$/, message: "????????????" }, { required: true, message: "?????????" }]
                                                        })(
                                                            <Input placeholder="?????????" />
                                                        )}
                                                        <div className="formIcon" >%</div>
                                                        <div className="formText" >*????????????</div>
                                                    </FormItem>
                                                </Col>
                                            </Row></div>:null}
                                        </Col>
                                    </div>
                                </Row>
                                <Row className="product_card">
                                    <div className="sh_inner_box">
                                        <Col {...titleInfo}>
                                            <span className="product_card_title">????????????</span>
                                        </Col>
                                        <Col span={20}>
                                            <FormItem label={<span style={{ width: "100%" }}>????????????</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 8 }} colon={false}>
                                                {getFieldDecorator("reportIndustry", {
                                                    rules: [{ required: true, message: "?????????????????????" }]
                                                })(
                                                    <Select placeholder="?????????">
                                                        <Option value="PERSONAL">??????????????????????????????</Option>
                                                        <Option value="CONSTRUCTION">?????????</Option>
                                                        <Option value="TRANSPORTATION">?????????????????????????????????</Option>
                                                        <Option value="AGRICULTURE_FORESTRY_ANIMAL_FISHERY">????????????????????????</Option>
                                                        <Option value="MINING_INDUSTRY">?????????</Option>
                                                        <Option value="MANUFACTURING_INDUSTRY">?????????</Option>
                                                        <Option value="ELECTRICITY_GAS_WATER">??????????????????????????????????????????</Option>
                                                        <Option value="SOFTWARE">??????????????????????????????????????????</Option>
                                                        <Option value="WHOLESALE_RETAIL">??????????????????</Option>
                                                        <Option value="ACCOMMODATION_CATERING">??????????????????</Option>
                                                        <Option value="REALTY">????????????</Option>
                                                        <Option value="RANT_SERVICE">????????????????????????</Option>
                                                        <Option value="OTHER">??????</Option>
                                                    </Select>
                                                )}
                                            </FormItem>
                                            <FormItem label={<span style={{ width: "100%" }}>????????????</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 8 }} colon={false}>
                                                {getFieldDecorator("reportLoanPurpose", {
                                                    rules: [{ required: true, message: "?????????????????????" }]

                                                })(
                                                    <Select placeholder="?????????">
                                                        <Option value="ACCRUED">??????????????????</Option>
                                                        <Option value="FIXED">????????????????????????</Option>
                                                        <Option value="OTHER">??????</Option>
                                                    </Select>
                                                )}
                                            </FormItem>
                                            <FormItem label={<span style={{ width: "100%" }}>????????????</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 8 }} colon={false}>
                                                {getFieldDecorator("reportLoanType", {
                                                    rules: [{ required: true, message: "?????????????????????" }]

                                                })(
                                                    <Select placeholder="?????????">
                                                        <Option value="CREDIT">??????</Option>
                                                        <Option value="GUARANTEE">??????</Option>
                                                        <Option value="MORTGAGE">??????</Option>
                                                        <Option value="PLEDGE">??????</Option>
                                                        <Option value="OTHER">??????</Option>
                                                    </Select>
                                                )}
                                            </FormItem>
                                            <FormItem label={<span style={{ width: "100%" }}>????????????</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 8 }} colon={false}>
                                                {getFieldDecorator("reportRepayType", {
                                                    rules: [{ required: true, message: "?????????????????????" }]

                                                })(
                                                    <Select placeholder="?????????">
                                                        <Option value="DEBX">????????????</Option>
                                                        <Option value="DEBJ">????????????</Option>
                                                        <Option value="XXHB">????????????</Option>
                                                        <Option value="LHHK">????????????</Option>
                                                    </Select>
                                                )}
                                            </FormItem>
                                            <FormItem label={<span style={{ width: "100%" }}>????????????</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 8 }} colon={false}>
                                                {getFieldDecorator("reportEntrusted", {
                                                    rules: [{ required: true, message: "???????????????????????????" }]

                                                })(
                                                    <RadioGroup placeholder="?????????">
                                                        <Radio value>???</Radio>
                                                        <Radio value={false}>???</Radio>
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </div>
                                </Row>
                            </div>
                        </div>

                    </Row>

                    <Row style={{height:"50px",background:"#fff",position:"fixed",bottom:"0",right:"0",lineHeight:"50px",textAlign:"center",width:"calc(100% - 170px)",boxShadow:"0px -2px 4px 0px rgba(0,0,0,0.1)"}}>
                        {/* <Button onClick={this.clickReset.bind(this)}>??????</Button> */}
                        <Button onClick={this.cancel.bind(this)}>??????</Button>
                        <Button type="primary" style={{ marginLeft: '30px' }} onClick={this.sure.bind(this)}>??????</Button>
                    </Row>
                </Form>
                <Modal {...modalInfo}><span style={{ fontSize: "14px" }}>???????????????????????????</span></Modal>
                <Modal {...leave}>
                    ?????????????????????,????????????????????????????????????
                </Modal>
                <style>
                    {`
                        .formWhite .ant-form-item-label label:after{
                            display:none
                        }
                        .ant-form-item-required:before{
                            display:none
                        }
                        .ant-form-item-required:after{
                            margin-right:11px!important;
                        }
                        .ant-select-selection__placeholder, .ant-select-search__field__placeholder{
                            color:#000!important;
                        }
                    `}
                </style>
            </div>
        )
    }
}
export default ComponentRoute(Form.create()(Product_cxfq));