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
                            message.success('修改成功');
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
                            message.success('新增成功');
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
    //输入范围判定
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
                        errors: [new Error('不能大于最大范围')],
                        value:e.target.value
                    },
                });
                this.setState({
                    error:{
                        type:true,
                        name:name,
                        text:"不能大于最大范围",
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
                        errors: [new Error('不能小于最小范围')],
                        value: e.target.value
                    },
                });
                this.setState({
                    error:{
                        type:true,
                        name:name,
                        text:"不能小于最小范围",
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
            title: "重置",
            visible: this.state.visible,
            onOk: this.onOk.bind(this),
            onCancel: this.onCancel.bind(this),
            maskClosable: false
        };
        let paths = ["产品管理1"];
        if (this.state.productId) {
            paths.push("产品编辑");
        } else {
            paths.push("产品添加");
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
            cancelText:"暂不取消",
            okText:"确认取消",
            title:"取消确认"
        }
        const term={"DAY":"日","MONTH":"个月","YEAR":"年"}
        return (
            <div>
                <Form className="product_cxfq sh_add content" >
                    <Row style={{marginBottom:"50px"}}>

                        <div className="card_cx">
                            <div className="title">
                                <div className="icon" />
                                <span className="titleWord">产品信息</span>
                            </div>
                            <div className="sh_add_card_product" style={{padding:"0"}}>
                                <Row className="product_card">
                                    <div className="sh_inner_box">
                                        <Col {...titleInfo}>
                                            <span className="product_card_title">基础信息</span>
                                        </Col>
                                        <Col span={20}>
                                            {/* <FormItem label={<span style={{ width: "100%" }}>产品编号</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} colon={false}>
                                                {getFieldDecorator("code", {
                                                    initialValue: "",
                                                })(
                                                    <div>CP-00001</div>
                                                )}
                                            </FormItem> */}
                                            <FormItem label={<span style={{ width: "100%" }}>产品名称</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 10 }} colon={false}>
                                                {getFieldDecorator("name", {
                                                    initialValue: "",
                                                    rules: [{ required: true, message: "请输入产品名称" },{max:20,message:"最多20个字符"},{pattern:/^[^ ]+$/,message:"不支持输入空格"}]
                                                })(
                                                    <Input placeholder="支持数字、字母、汉字及组合，最长20个字符" />
                                                )}
                                            </FormItem>
                                            <FormItem label={<span style={{ width: "100%"}}>产品描述</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} colon={false}>
                                                {getFieldDecorator("desc", {
                                                    initialValue: "",
                                                    rules: [{ required: true, message: "请输入产品描述" },{max:1000,message:"最多1000个字符"}]
                                                })(
                                                    <TextArea placeholder="请输入产品描述，例如还款方式生成方式、起息日规则、还款日定义、小数进位规则、补足方式等，最长1000个字符" />
                                                )}
                                            </FormItem>
                                        </Col>
                                    </div>
                                </Row>
                                <Row className="product_card">
                                    <div className="sh_inner_box">
                                        <Col {...titleInfo}>
                                            <span className="product_card_title">借款信息</span>
                                        </Col>
                                        <Col span={20}>
                                            <Row>
                                                <Col
                                                    span={4}
                                                    style={{ textAlign: "right", fontSize: "14px", color: "rgba(0,0,0,0.5)", paddingRight: "13px", marginBottom: "15px", lineHeight: "32px" }}
                                                >
                                                    <span>借款金额范围</span>
                                                </Col>
                                                <Col span={8}>
                                                    <FormItem className="text_left" label="" {...formInfoSmall} >
                                                        {getFieldDecorator('minLoanAmount', {
                                                            initialValue: "",
                                                            rules: [{ pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "格式错误" }, { required: true, message: "请输入最低金额" }]
                                                        })(
                                                            <Input placeholder="请输入最低金额" onBlur={(e)=>{this.check_val(e,"minLoanAmount","maxLoanAmount",true)}} />
                                                        )}
                                                        <div className="formIcon" >元</div>
                                                    </FormItem>
                                                </Col>
                                                <Col span={1} pull={4} style={{ lineHeight: "32px" }}>——</Col>
                                                <Col span={8} pull={4} >
                                                    <FormItem className="" label="" {...formInfoSmall} >
                                                        {getFieldDecorator('maxLoanAmount', {
                                                            initialValue: "",
                                                            rules: [{ pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "格式错误" }, { required: true, message: "请输入最高金额" }]
                                                        })(
                                                            <Input placeholder="请输入最高金额" onBlur={(e)=>{this.check_val(e,"maxLoanAmount","minLoanAmount",false)}} />
                                                        )}

                                                        <div className="formIcon" >元</div>
                                                    </FormItem>
                                                </Col>
                                            </Row>
                                            <FormItem label={<span style={{ width: "100%" }}>借款期限单位</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} colon={false}>
                                                {getFieldDecorator("loanPeriodUnit", {
                                                    initialValue: "",
                                                    rules: [{ required: true, message: "请选择借款期限单位" }]
                                                })(
                                                    <RadioGroup onChange={this.change_type.bind(this)}>
                                                        <Radio value="DAY">日</Radio>
                                                        <Radio value="MONTH">月</Radio>
                                                        <Radio value="YEAR">年</Radio>
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                            <Row>
                                                <Col
                                                    span={4}
                                                    style={{ textAlign: "right", fontSize: "14px", color: "rgba(0,0,0,0.5)", paddingRight: "13px",marginBottom: "15px", lineHeight: "32px" }}
                                                >
                                                    <span>借款期限范围</span>
                                                </Col>
                                                <Col span={8}>
                                                    <FormItem className="text_left" label="" {...formInfoSmall} >
                                                        {getFieldDecorator('minLoanPeriod', {
                                                            initialValue: "",
                                                            rules: [{ pattern: /^[1-9]\d*$/, message: "格式错误" }, { required: true, message: "请输入最短期限" }]
                                                        })(
                                                            <Input placeholder="请输入最短期限" onBlur={(e)=>{this.check_val(e,"minLoanPeriod","maxLoanPeriod",true)}} />
                                                        )}
                                                        <div className="formIcon" >{term[this.state.termType]}</div>
                                                    </FormItem>
                                                </Col>
                                                <Col span={1} pull={4} style={{ lineHeight: "32px" }}>——</Col>
                                                <Col span={8} pull={4} >
                                                    <FormItem className="" label="" {...formInfoSmall} >
                                                        {getFieldDecorator('maxLoanPeriod', {
                                                            initialValue: "",
                                                            rules: [{ pattern: /^[1-9]\d*$/, message: "格式错误" }, { required: true, message: "请输入最高期限" }]
                                                        })(
                                                            <Input placeholder="请输入最高期限" onBlur={(e)=>{this.check_val(e,"maxLoanPeriod","minLoanPeriod",false)}} />
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
                                                    <span>实际年化综合费率范围</span>
                                                </Col>
                                                <Col span={8}>
                                                    <FormItem className="text_left" label="" {...formInfoSmall} >
                                                        {getFieldDecorator('minYearRate', {
                                                            initialValue: "",
                                                            rules: [{ pattern: /^([1-9]\d?(\.\d{1,5})?|0\.\d{1,5}|100)$/, message: "格式错误" }, { required: true, message: "请输入最低利率" }]
                                                        })(
                                                            <Input placeholder="请输入最低利率" onBlur={(e)=>{this.check_val(e,"minYearRate","maxYearRate",true)}} />
                                                        )}
                                                        <div className="formIcon" >%</div>
                                                    </FormItem>
                                                </Col>
                                                <Col span={1} pull={4} style={{ lineHeight: "32px" }}>——</Col>
                                                <Col span={8} pull={4} >
                                                    <FormItem className="" label="" {...formInfoSmall} >
                                                        {getFieldDecorator('maxYearRate', {
                                                            initialValue: "",
                                                            rules: [{ pattern: /^([1-9]\d?(\.\d{1,5})?|0\.\d{1,5}|100)$/, message: "格式错误" }, { required: true, message: "请输入最高利率" }]
                                                        })(
                                                            <Input placeholder="请输入最高利率" onBlur={(e)=>{this.check_val(e,"maxYearRate","minYearRate",false)}} />
                                                        )}
                                                        <div className="formIcon" >%</div>
                                                    </FormItem>
                                                </Col>
                                            </Row>
                                            <FormItem label={<span style={{ width: "100%" }}>费率计算单位</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} colon={false}>
                                                {getFieldDecorator("rateUnit", {
                                                    initialValue: "",
                                                    rules: [{ required: true, message: "请选择借款期限单位" }]
                                                })(
                                                    <RadioGroup>
                                                        <Radio value="DAY">日</Radio>
                                                        <Radio value="MONTH">月</Radio>
                                                        <Radio value="YEAR">年</Radio>
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                            <FormItem label={<span style={{ width: "100%" }}>费率计算类型</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} colon={false}>
                                                {getFieldDecorator("calRateType", {
                                                    initialValue: "",
                                                    rules: [{ required: true, message: "请选择费率计算类型" }]
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
                                                    <span>综合费率范围</span>
                                                </Col>
                                                <Col span={8}>
                                                    <FormItem className="text_left" label="" {...formInfoSmall} >
                                                        {getFieldDecorator('minGeneralRate', {
                                                            initialValue: "",
                                                            rules: [{ pattern: /^([1-9]\d?(\.\d{1,5})?|0\.\d{1,5}|100)$/, message: "格式错误" }, { required: true, message: "请输入最低利率" }]
                                                        })(
                                                            <Input placeholder="请输入最低利率" onBlur={(e)=>{this.check_val(e,"minGeneralRate","maxGeneralRate",true)}} />
                                                        )}
                                                        <div className="formIcon" >%</div>
                                                    </FormItem>
                                                </Col>
                                                <Col span={1} pull={4} style={{ lineHeight: "32px" }}>——</Col>
                                                <Col span={8} pull={4} >
                                                    <FormItem className="" label="" {...formInfoSmall} >
                                                        {getFieldDecorator('maxGeneralRate', {
                                                            initialValue: "",
                                                            rules: [{ pattern: /^([1-9]\d?(\.\d{1,5})?|0\.\d{1,5}|100)$/, message: "格式错误" }, { required: true, message: "请输入最高利率" }]
                                                        })(
                                                            <Input placeholder="请输入最高利率" onBlur={(e)=>{this.check_val(e,"maxGeneralRate","minGeneralRate",false)}} />
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
                                            <span className="product_card_title">还款信息</span>
                                        </Col>
                                        <Col span={20}>
                                            <FormItem label={<span style={{ width: "100%" }}>是否允许部分还款</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} colon={false}>
                                                {getFieldDecorator("partRepayConfirm", {
                                                    initialValue: "",
                                                    rules: [{ required: true, message: "请选择是否允许部分还款" }]
                                                })(
                                                    <RadioGroup>
                                                        <Radio value>允许</Radio>
                                                        <Radio value={false}>不允许</Radio>
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                            <FormItem label={<div style={{ width: "100%",paddingRight:"13px",lineHeight:"20px",whiteSpace:"normal"}}>是否允许提前还款（非结清）</div>} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} colon={false} className="formWhite">
                                                {getFieldDecorator("canRepayAhead", {
                                                    initialValue: "",
                                                    rules: [{ required: true, message: "请选择是否允许部分还款" }]
                                                })(
                                                    <RadioGroup onChange={this.repay.bind(this)}>
                                                        <Radio value>允许</Radio>
                                                        <Radio value={false}>不允许</Radio>
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                            {this.state.isRepay?<FormItem label={<div style={{ width: "100%",paddingRight:"13px",lineHeight:"20px",whiteSpace:"normal"}}>提前还款时综合费用收取方式</div>} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} colon={false} className="formWhite">
                                                {getFieldDecorator("raCollectType", {
                                                    initialValue: "",
                                                    rules: [{ required: true, message: "请选择收取方式" }]
                                                })(
                                                    <RadioGroup>
                                                        <Radio value="ALL">当期收取后续期数不减免</Radio>
                                                        <Radio value="CAL_DAY">按日计收</Radio>
                                                        <Radio value="OTHER">特殊配置</Radio>
                                                    </RadioGroup>
                                                )}
                                            </FormItem>:null}
                                        </Col>
                                    </div>
                                </Row>
                                <Row className="product_card">
                                    <div className="sh_inner_box">
                                        <Col {...titleInfo}>
                                            <span className="product_card_title">提前结清信息</span>
                                        </Col>
                                        <Col span={20}>
                                            <FormItem label={<span style={{ width: "100%" }}>是否允许提前结清</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} colon={false}>
                                                {getFieldDecorator("canRepayAheadAll", {
                                                    initialValue: "",
                                                    rules: [{ required: true, message: "请选择是否允许提前结清" }]
                                                })(
                                                    <RadioGroup onChange={this.early.bind(this)}>
                                                        <Radio value>允许</Radio>
                                                        <Radio value={false}>不允许</Radio>
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                            {this.state.isEarly?<div><FormItem label={<div style={{ width: "100%",paddingRight:"13px",lineHeight:"20px",whiteSpace:"normal"}}>提前结清时综合费用收取方式</div>} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} colon={false} className="formWhite">
                                                {getFieldDecorator("raaCollectType", {
                                                    initialValue: "",
                                                    rules: [{ required: true, message: "请选择收取方式" }]
                                                })(
                                                    <RadioGroup>
                                                        <Radio value="CURRENT">当期收取后续期数减免</Radio>
                                                        <Radio value="ALL">当期收取后续期数不减免</Radio>
                                                        <Radio value="CAL_DAY">按日计收</Radio>
                                                        <Radio value="OTHER">特殊配置</Radio>
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                            <FormItem label={<div style={{ width: "100%",paddingRight:"13px",lineHeight:"20px",whiteSpace:"normal" }}>是否收取提前结清手续费</div>} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} colon={false} className="formWhite">
                                                {getFieldDecorator("hasPenaltyAheadFee", {
                                                    initialValue: "",
                                                    rules: [{ required: true, message: "请选择是否收取手续费" }]
                                                })(
                                                    <RadioGroup onChange={this.early_money.bind(this)}>
                                                        <Radio value>收取</Radio>
                                                        <Radio value={false}>不收取</Radio>
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                            {this.state.isEarly_money?<Row>
                                                <Col
                                                    span={4}
                                                    style={{ textAlign: "right", fontSize: "14px", color: "rgba(0,0,0,0.5)", paddingRight: "13px", marginBottom: "15px", lineHeight: "32px" }}
                                                >
                                                    <span>手续费收取范围</span>
                                                </Col>
                                                <Col span={8}>
                                                    <FormItem className="text_left" label="" {...formInfoSmall} >
                                                        {getFieldDecorator('penaltyAheadFeeMinAmount', {
                                                            initialValue: "",
                                                            rules: [{ pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "格式错误" }, { required: true, message: "请输入" }]
                                                        })(
                                                            <Input placeholder="请输入" />
                                                        )}
                                                        <div className="formIcon" >元</div>
                                                    </FormItem>
                                                </Col>
                                                <Col span={1} pull={4} style={{ lineHeight: "32px" }}>——</Col>
                                                <Col span={8} pull={4} >
                                                    <FormItem className="" label="" {...formInfoSmall} >
                                                        {getFieldDecorator('penaltyAheadFeeMaxRate', {
                                                            initialValue: "",
                                                            rules: [{ pattern: /^(([1-9]\d{0,2}?(\.\d{1,5})?|0\.\d{1,5})|1000)$/, message: "格式错误" }, { required: true, message: "请输入" }]
                                                        })(
                                                            <Input placeholder="请输入" />
                                                        )}
                                                        <div className="formIcon" >%</div>
                                                        <div className="formText" >*贷款余额</div>
                                                    </FormItem>
                                                </Col>
                                            </Row>:null}
                                            </div>:null}
                                            <FormItem label={<div style={{ width: "100%",paddingRight:"13px",lineHeight:"20px",whiteSpace:"normal" }}>仅最后一期提前还款是否算提前结清</div>} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} colon={false} className="formWhite">
                                                {getFieldDecorator("onlyRepayLastPhaseAsRaa", {
                                                    initialValue: "",
                                                    rules: [{ required: true, message: "请选择是否算提前结清" }]
                                                })(
                                                    <RadioGroup>
                                                        <Radio value>算提前结清</Radio>
                                                        <Radio value={false}>不算提前结清</Radio>
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </div>
                                </Row>
                                <Row className="product_card">
                                    <div className="sh_inner_box">
                                        <Col {...titleInfo}>
                                            <span className="product_card_title">逾期罚息信息</span>
                                        </Col>
                                        <Col span={20}>
                                            <FormItem label={<span style={{ width: "100%" }}>是否收取罚息</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} colon={false}>
                                                {getFieldDecorator("hasOverdueFee", {
                                                    initialValue: "",
                                                    rules: [{ required: true, message: "请选择是否收取罚息" }]
                                                })(
                                                    <RadioGroup onChange={this.late.bind(this)}>
                                                        <Radio value>收取</Radio>
                                                        <Radio value={false}>不收取</Radio>
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                            {this.state.isLate?<div><FormItem label={<span style={{ width: "100%" }}>是否允许宽限日</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} colon={false}>
                                                {getFieldDecorator("hasOverdueFeeGrace", {
                                                    initialValue: "",
                                                    rules: [{ required: true, message: "请选择是否允许宽限日" }]
                                                })(
                                                    <RadioGroup>
                                                        <Radio value>允许</Radio>
                                                        <Radio value={false}>不允许</Radio>
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                            <FormItem label={<span style={{ width: "100%" }}>收取基数</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} colon={false}>
                                                {getFieldDecorator("overdueFeeBase", {
                                                    initialValue: "",
                                                    rules: [{ required: true, message: "请选择收取基数" }]
                                                })(
                                                    <RadioGroup>
                                                        <Radio value="BALANCE">贷款余额百分比</Radio>
                                                        <Radio value="PHASE_PRINCIPAL_RATE">当期逾期未还本息百分比</Radio>
                                                        <Radio value="PHASE_PRINCIPAL">当期逾期未还本金百分比</Radio>
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                            <Row>
                                                <Col
                                                    span={4}
                                                    style={{ textAlign: "right", fontSize: "14px", color: "rgba(0,0,0,0.5)", paddingRight: "13px", marginBottom: "15px", lineHeight: "32px" }}
                                                >
                                                    <span>罚息收取范围</span>
                                                </Col>
                                                <Col span={8}>
                                                    <FormItem className="text_left" label="" {...formInfoSmall} >
                                                        {getFieldDecorator('overdueFeeMinAmount', {
                                                            initialValue: "",
                                                            rules: [{ pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "格式错误" }, { required: true, message: "请输入" }]
                                                        })(
                                                            <Input placeholder="请输入" />
                                                        )}
                                                        <div className="formIcon" >元</div>
                                                    </FormItem>
                                                </Col>
                                                <Col span={1} pull={4} style={{ lineHeight: "32px" }}>——</Col>
                                                <Col span={8} pull={4} >
                                                    <FormItem className="" label="" {...formInfoSmall} >
                                                        {getFieldDecorator('overdueFeeMaxRate', {
                                                            initialValue: "",
                                                            rules: [{ pattern: /^(([1-9]\d{0,2}?(\.\d{1,5})?|0\.\d{1,5})|1000)$/, message: "格式错误" }, { required: true, message: "请输入" }]
                                                        })(
                                                            <Input placeholder="请输入" />
                                                        )}
                                                        <div className="formIcon" >%</div>
                                                        <div className="formText" >*借款金额</div>
                                                    </FormItem>
                                                </Col>
                                            </Row></div>:null}
                                        </Col>
                                    </div>
                                </Row>
                                <Row className="product_card">
                                    <div className="sh_inner_box">
                                        <Col {...titleInfo}>
                                            <span className="product_card_title">违约金信息</span>
                                        </Col>
                                        <Col span={20}>
                                            <FormItem label={<span style={{ width: "100%" }}>是否收取违约金</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} colon={false}>
                                                {getFieldDecorator("hasPenaltyOverdueFee", {
                                                    initialValue: "",
                                                    rules: [{ required: true, message: "请选择是否收取违约金" }]
                                                })(
                                                    <RadioGroup onChange={this.falsity.bind(this)}>
                                                        <Radio value>收取</Radio>
                                                        <Radio value={false}>不收取</Radio>
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                            {this.state.isFalsity?<div><FormItem label={<span style={{ width: "100%" }}>是否允许宽限日</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} colon={false}>
                                                {getFieldDecorator("hasPenaltyOverdueFeeGrace", {
                                                    initialValue: "",
                                                    rules: [{ required: true, message: "请选择是否允许宽限日" }]
                                                })(
                                                    <RadioGroup>
                                                        <Radio value>允许</Radio>
                                                        <Radio value={false}>不允许</Radio>
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                            <FormItem label={<span style={{ width: "100%" }}>收取基数</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} colon={false}>
                                                {getFieldDecorator("penaltyOverdueFeeBase", {
                                                    initialValue: "",
                                                    rules: [{ required: true, message: "请选择收取基数" }]
                                                })(
                                                    <RadioGroup placeholder="请选择">
                                                        <Radio value="PHASE_FIXED">固定金额/期</Radio>
                                                        <Radio value="BALANCE">贷款余额百分比</Radio>
                                                        <Radio value="PHASE_PRINCIPAL_RATE">逾期未还本息百分比</Radio>
                                                        <Radio value="PHASE_PRINCIPAL">逾期未还本金百分比</Radio>
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                            <Row>
                                                <Col
                                                    span={4}
                                                    style={{ textAlign: "right", fontSize: "14px", color: "rgba(0,0,0,0.5)", paddingRight: "13px", marginBottom: "15px", lineHeight: "32px" }}
                                                >
                                                    <span>违约金收取范围</span>
                                                </Col>
                                                <Col span={8}>
                                                    <FormItem className="text_left" label="" {...formInfoSmall} >
                                                        {getFieldDecorator('penaltyOverdueFeeMinAmount', {
                                                            initialValue: "",
                                                            rules: [{ pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "格式错误" }, { required: true, message: "请输入" }]
                                                        })(
                                                            <Input placeholder="请输入" />
                                                        )}
                                                        <div className="formIcon" >元</div>
                                                    </FormItem>
                                                </Col>
                                                <Col span={1} pull={4} style={{ lineHeight: "32px"}}>——</Col>
                                                <Col span={8} pull={4} >
                                                    <FormItem className="" label="" {...formInfoSmall} >
                                                        {getFieldDecorator('penaltyOverdueFeeMaxRate', {
                                                            initialValue: "",
                                                            rules: [{ pattern: /^(([1-9]\d{0,2}?(\.\d{1,5})?|0\.\d{1,5})|1000)$/, message: "格式错误" }, { required: true, message: "请输入" }]
                                                        })(
                                                            <Input placeholder="请输入" />
                                                        )}
                                                        <div className="formIcon" >%</div>
                                                        <div className="formText" >*借款金额</div>
                                                    </FormItem>
                                                </Col>
                                            </Row></div>:null}
                                        </Col>
                                    </div>
                                </Row>
                                <Row className="product_card">
                                    <div className="sh_inner_box">
                                        <Col {...titleInfo}>
                                            <span className="product_card_title">上报信息</span>
                                        </Col>
                                        <Col span={20}>
                                            <FormItem label={<span style={{ width: "100%" }}>投向行业</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 8 }} colon={false}>
                                                {getFieldDecorator("reportIndustry", {
                                                    rules: [{ required: true, message: "请选择投向行业" }]
                                                })(
                                                    <Select placeholder="请选择">
                                                        <Option value="PERSONAL">居民服务和其他服务业</Option>
                                                        <Option value="CONSTRUCTION">建筑业</Option>
                                                        <Option value="TRANSPORTATION">交通运输、仓储和邮政业</Option>
                                                        <Option value="AGRICULTURE_FORESTRY_ANIMAL_FISHERY">农、林、牧、渔业</Option>
                                                        <Option value="MINING_INDUSTRY">采矿业</Option>
                                                        <Option value="MANUFACTURING_INDUSTRY">制造业</Option>
                                                        <Option value="ELECTRICITY_GAS_WATER">电力、燃气及水的生产和供应业</Option>
                                                        <Option value="SOFTWARE">信息传输、计算机服务和软件业</Option>
                                                        <Option value="WHOLESALE_RETAIL">批发和零售业</Option>
                                                        <Option value="ACCOMMODATION_CATERING">住宿和餐饮业</Option>
                                                        <Option value="REALTY">房地产业</Option>
                                                        <Option value="RANT_SERVICE">租赁和商务服务业</Option>
                                                        <Option value="OTHER">其他</Option>
                                                    </Select>
                                                )}
                                            </FormItem>
                                            <FormItem label={<span style={{ width: "100%" }}>贷款用途</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 8 }} colon={false}>
                                                {getFieldDecorator("reportLoanPurpose", {
                                                    rules: [{ required: true, message: "请选择贷款用途" }]

                                                })(
                                                    <Select placeholder="请选择">
                                                        <Option value="ACCRUED">流动资金贷款</Option>
                                                        <Option value="FIXED">固定资产投资贷款</Option>
                                                        <Option value="OTHER">其他</Option>
                                                    </Select>
                                                )}
                                            </FormItem>
                                            <FormItem label={<span style={{ width: "100%" }}>贷款方式</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 8 }} colon={false}>
                                                {getFieldDecorator("reportLoanType", {
                                                    rules: [{ required: true, message: "请选择贷款方式" }]

                                                })(
                                                    <Select placeholder="请选择">
                                                        <Option value="CREDIT">信用</Option>
                                                        <Option value="GUARANTEE">保证</Option>
                                                        <Option value="MORTGAGE">抵押</Option>
                                                        <Option value="PLEDGE">质押</Option>
                                                        <Option value="OTHER">其他</Option>
                                                    </Select>
                                                )}
                                            </FormItem>
                                            <FormItem label={<span style={{ width: "100%" }}>还款方式</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 8 }} colon={false}>
                                                {getFieldDecorator("reportRepayType", {
                                                    rules: [{ required: true, message: "请选择还款方式" }]

                                                })(
                                                    <Select placeholder="请选择">
                                                        <Option value="DEBX">等额本息</Option>
                                                        <Option value="DEBJ">等额本金</Option>
                                                        <Option value="XXHB">先息后本</Option>
                                                        <Option value="LHHK">灵活还款</Option>
                                                    </Select>
                                                )}
                                            </FormItem>
                                            <FormItem label={<span style={{ width: "100%" }}>受托支付</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 8 }} colon={false}>
                                                {getFieldDecorator("reportEntrusted", {
                                                    rules: [{ required: true, message: "请选择是否受托支付" }]

                                                })(
                                                    <RadioGroup placeholder="请选择">
                                                        <Radio value>是</Radio>
                                                        <Radio value={false}>否</Radio>
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
                        {/* <Button onClick={this.clickReset.bind(this)}>重置</Button> */}
                        <Button onClick={this.cancel.bind(this)}>取消</Button>
                        <Button type="primary" style={{ marginLeft: '30px' }} onClick={this.sure.bind(this)}>确认</Button>
                    </Row>
                </Form>
                <Modal {...modalInfo}><span style={{ fontSize: "14px" }}>确认清空当前内容？</span></Modal>
                <Modal {...leave}>
                    请确认是否取消,取消后填写的信息将消失。
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