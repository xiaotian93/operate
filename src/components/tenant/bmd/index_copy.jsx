import React, { Component } from 'react';
import { Row, Col, Form, Input, Modal, Radio, Button ,message,Popconfirm} from 'antd';
import { xjd_product, xjd_product_detail ,xjd_product_update,xjd_product_detail_user} from '../../../ajax/api';
// import Repay from './repayBank';
import { axios_xjd_p } from '../../../ajax/request';
import Tag from './tag';
import Dynamic from './DynamicFieldSet';
import AddUser from './addUser';
import { browserHistory } from 'react-router';
import {accMul,accDiv} from '../../../ajax/tool.js';
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const { TextArea } = Input;
class Basic extends Component {
    constructor(props) {
        super(props);
        // props.onRef(this);
        this.state = {
            principalType_val: "0",
            dailyOverdueRateType_val: "0",
            penaltyType_val: "0",
            penaltyType_str_val: "2",
            tagArr:[],  //借款期数
            id:props.location.query.id,
            userEdit:[],
            userArr:{data:[]}
        };
        this.product = []
    }
    componentWillMount() {
        if (this.state.id) {
            setTimeout(function(){
                this.editData()
            }.bind(this),1000)
                
        }
    }
    
    editData() {
        axios_xjd_p.get(xjd_product_detail+"?id="+this.state.id).then(e=>{
            if(!e.code){
                var data=e.data;
                for(var i in data){
                    if(i==="advanceSettleFeePercent"){
                        if(data[i]){
                            this.setState({
                                principalType_val: "1",
                            })
                            this.props.form.setFieldsValue({[i]:accMul(data[i],100),"principalType1":"1"});
                            // this.props.form.setFieldsValue({"principalType1":"1"});
                            
                        }else{
                            this.setState({
                                principalType_val: "0"
                            })
                            this.props.form.setFieldsValue({"principalType1":"0"});
                            
                        }
                    }else if(i==="dailyOverdueRate"){
                        if(data[i]){
                            this.setState({
                                dailyOverdueRateType_val: "1",
                            })
                            this.props.form.setFieldsValue({[i]:accMul(data[i],100),"dailyOverdueRateType":"1"});
                            
                        }else{
                            this.setState({
                                dailyOverdueRateType_val: "0"
                            })
                            this.props.form.setFieldsValue({"dailyOverdueRateType":"0"});
                            
                        }
                    }else if(i==="penaltyType"){
                        if(data[i]){
                            this.setState({
                                penaltyType_str_val:data[i].toString(),
                                penaltyType_val:"1"
                            })
                            this.props.form.setFieldsValue({"penaltyType":data[i].toString()});
                            if(data[i]===1){
                                this.props.form.setFieldsValue({"penaltyAmount":accDiv(data["penaltyAmount"],100)});
                                
                            }else{
                                this.props.form.setFieldsValue({"penaltyPercent":accMul(data["penaltyPercent"],100)});
                                
                            }
                        }else{
                            this.setState({
                                penaltyType_val:"0"
                            })
                            this.props.form.setFieldsValue({"penaltyType":"0"});
                        }
                    }else if(i==="minAmount"||i==="maxAmount"){
                        this.props.form.setFieldsValue({[i]:accDiv(data[i],100)});
                    }else if(i==="totalPeriodList"){
                        this.setState({
                            tagArr:data[i]
                        });
                        this.tag_child.setState({
                            tags:data[i]
                        })
                        this.props.form.setFieldsValue({[i]:data[i]});
                    }else if(i!=="createTime"&&i!=="creatorId"&&i!=="id"&&i!=="updateTime"&&i!=="uniqStatus"&&i!=="maxTotalPeriods"&&i!=="penaltyPercent"&&i!=="penaltyAmount"){
                        
                        if(data[i]){  
                            if(i==="allowInputLoanAmount"){
                                this.props.form.setFieldsValue({[i]:data[i]});
                            }else{
                                this.props.form.setFieldsValue({[i]:data[i].toString()});
                                this.setState({
                                    periodUnit_type:data["periodUnit"]
                                })
                            }                         
                            
                        }
                    }
                }
            }
        })
        axios_xjd_p.get(xjd_product_detail_user + "?productConfigId=" + this.state.id).then(e => {
            if (!e.code) {
                var arr = e.data;
                var map = {},
                    dest = [];
                for (var i = 0; i < arr.length; i++) {
                    var ai = arr[i];
                    if (!map[ai.key]) {
                        dest.push({
                            id: ai.key,
                            data: [ai]
                        });
                        map[ai.key] = ai;
                    } else {
                        for (var j = 0; j < dest.length; j++) {
                            var dj = dest[j];
                            if (dj.id === ai.key) {
                                dj.data.push(ai);
                                break;
                            }
                        }
                    }
                }
                
                var userEdits=[];
                for(let p in dest){
                    userEdits.push(Number(p))
                }
                this.setState({
                    userArr: dest,
                    userEdit:userEdits
                })
            }
        })
    }

    imgCancel() {
        this.setState({
            previewVisible: false
        })
    }
    user(e) {
        this.user_child = e;
    }
    add() {
        this.user_child.add();
    }
    addShow() {
        this.setState({
            previewVisible: true
        })
    }
    addUser(e) {
        this.addUser_child = e;
    }
    principalType_change(e) {
        this.setState({
            principalType_val: e.target.value
        })
        if (e.target.value === "0") {
            this.props.form.setFieldsValue({ advanceSettleFeePercent: 0 })
        } 
    }
    dailyOverdueRateType_change(e) {
        console.log(e)
        this.setState({
            dailyOverdueRateType_val: e.target.value
        })
        if (e.target.value === "0") {
            this.props.form.setFieldsValue({ dailyOverdueRate: 0 })
        } 
    }
    penaltyType_change(e) {
        this.setState({
            penaltyType_val: e.target.value
        })
        if (e.target.value === "0") {
            this.props.form.setFieldsValue({ penaltyType: 0 })
        }
    }
    penaltyType_str(e) {
        this.setState({
            penaltyType_str_val: e.target.value
        })
    }
    //百分比转浮点数
    val_change(e,name){
        this.props.form.setFieldsValue({ [name]: e.target.value/100 })
        console.log(this.props.form.getFieldValue( "dailyOverdueRate"))
    }
    //金额转分
    money_change(e,name){
        this.props.form.setFieldsValue({ [name]: e.target.value*100 })
    }
    tag(e){
        this.tag_child=e
    }
    getTag(e){
        this.setState({
            tagArr:e
        })
    }
    //借款单位
    periodUnit_change(e){
        this.setState({
            periodUnit_type:e.target.value
        })
    }
    submit(){
        var productUserGroupList=this.user_child.handleSubmit();
        if(productUserGroupList.length<1){
            message.warn("请先配置用户群");
            return;
        }
        if(this.state.tagArr.length<1){
            this.tag_child.props.form.validateFields((err, values) => {});
            return;
        }
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                
                delete(values.principalType);
                delete(values.dailyOverdueRateType);
                delete(values.principalType1);
                values.advanceSettleFeePercent=values.advanceSettleFeePercent?values.advanceSettleFeePercent:0;
                values.dailyOverdueRate=values.dailyOverdueRate?values.dailyOverdueRate:0;
                values.penaltyType=values.penaltyType?values.penaltyType:0;
                values.productUserGroupList=productUserGroupList;
                values.totalPeriodList=this.state.tagArr;
                values.minAmount=accMul(values.minAmount,100);
                values.maxAmount=accMul(values.maxAmount,100);
                if(values.dailyOverdueRate){
                    values.dailyOverdueRate=accDiv(values.dailyOverdueRate,100)
                }
                if(values.advanceSettleFeePercent){
                    values.advanceSettleFeePercent=accDiv(values.advanceSettleFeePercent,100)
                }
                if(values.penaltyPercent){
                    values.penaltyPercent=accDiv(values.penaltyPercent,100)
                }
                if(values.penaltyAmount){
                    values.penaltyAmount=accMul(values.penaltyAmount,100)
                }
                console.log(values)
                // return;
                if(!this.state.id){
                    axios_xjd_p.post(xjd_product,values).then(e=>{
                        if(!e.code){
                            var id=e.data;
                            browserHistory.push("/sh/bmd/detail?id="+id);
                        }
                    })
                }else{
                    values.id=this.state.id;
                    axios_xjd_p.post(xjd_product_update,values).then(e=>{
                        if(!e.code){
                            // var id=e.data;
                            browserHistory.push("/sh/bmd/detail?id="+this.state.id);
                        }
                    })
                }
                
                

            }

        });
    }
    render() {
        window.form=this.props.form;
        // var value=window.localStorage.getItem("detail")?JSON.parse(window.localStorage.getItem("detail")).basic.productIds:[];
        const { getFieldDecorator } = this.props.form;
        const formInfo = {
            labelCol: { span: 5 },
            wrapperCol: { span: 6 },
            colon: false
        };
        
        const formInfoText = {
            labelCol: { span: 6 },
            wrapperCol: { span: 4 },
            colon: false
        };
        const formInfoSmall = {
            labelCol: { span: 7 },
            wrapperCol: { span: 11 },
            colon: false,
            className: "tableForm text_left",
            labelAlign: "left"
        };
        const titleInfo = {
            span: 4,
            className: "text_margin"
        }
        const modal = {
            title: "创建用户群",
            footer: <div><Button size="small" onClick={this.imgCancel.bind(this)}>取消</Button><Button size="small" type="primary" onClick={this.add.bind(this)}>确定</Button></div>
        }
        const confirm={
            title:"提交成功后后续订单将生效，请确认是否提交？",
            okText:"确定",
            cancelText:"取消",
            onConfirm:this.submit.bind(this),
        }
        return (
            <Form className="sh_add content">
                <div className="sh_add_card">
                    <div className="sh_inner_box">
                        <div className="sh_add_title">产品信息</div>
                        <FormItem label="产品编号" {...formInfo} className="" >
                            {getFieldDecorator('loanConfigNo', {
                                initialValue: "",
                                rules: [{ required: true, message: "请输入产品编号" }, { max: 100, message: "最高可输入100字" }]
                            })(
                                <Input placeholder="请输入产品编号" />
                            )}

                        </FormItem>

                        <FormItem label="产品名称" {...formInfo} >
                            {getFieldDecorator('name', {
                                initialValue: "",
                                rules: [{ required: true, message: "请输入产品名称" }, { pattern: /^[a-zA-Z\u4e00-\u9fa5（）()]{1,50}$/, message: "格式错误" }]
                            })(
                                <Input placeholder="请输入产品名称" />
                            )}

                        </FormItem>
                        <FormItem label="产品描述" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} colon={false} >
                            {getFieldDecorator('desc', {
                                initialValue: "",
                                rules: [{ required: true, message: "请输入产品描述" }, { max: 100, message: "最高可输入100字" }]
                            })(
                                <TextArea placeholder="请输入产品描述" />
                            )}

                        </FormItem>
                    </div>
                </div>
                <div className="sh_add_card_product">
                    {/* <div className="sh_inner_box"> */}
                    <div className="sh_add_title" style={{ marginLeft: "20px" }}>借款信息配置</div>
                    <Row className="product_card">
                        <div className="sh_inner_box">
                            <Col {...titleInfo}>
                                <span className="product_card_title">借贷信息</span>
                            </Col>
                            <Col span={16}>
                                <Row>
                                    <Col
                                        span={6}
                                        style={{ textAlign: "right", fontSize: "14px", color: "rgba(0,0,0,0.5)", paddingRight: "20px", marginBottom: "15px", lineHeight: "32px" }}
                                    >
                                        <span>借款金额范围</span>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem className="text_left" label="" {...formInfoSmall} >
                                            {getFieldDecorator('minAmount', {
                                                rules: [{ pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "格式错误" },{ required: true, message: "请输入最低额度" }]
                                            })(
                                                <Input placeholder="请输入最低额度" />
                                            )}
                                            
                                        </FormItem>
                                    </Col>
                                    <Col span={1} pull={4} style={{ lineHeight: "32px" }}>——</Col>
                                    <Col span={8} pull={4} >
                                        <FormItem className="" label="" {...formInfoSmall} >
                                            {getFieldDecorator('maxAmount', {
                                                rules: [{ pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "格式错误" },{ required: true, message: "请输入最高额度" }]
                                            })(
                                                <Input placeholder="请输入最高额度" />
                                            )}
                                            
                                            <div className="formText" >元</div>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <FormItem label={<span style={{ width: "100%" }}>是否允许自选借款金额</span>} labelCol={{ span: 6 }} wrapperCol={{ span: 8 }} colon={false}>
                                    {getFieldDecorator("allowInputLoanAmount", {
                                        initialValue: "",
                                        rules: [{ required: true, message: "请选择" }]
                                    })(
                                        <RadioGroup>
                                            <Radio value>允许</Radio>
                                            <Radio value={false}>不允许</Radio>
                                        </RadioGroup>
                                    )}
                                </FormItem>
                                <FormItem label={<span style={{ width: "100%" }}>借款时间单位</span>} labelCol={{ span: 6 }} wrapperCol={{ span: 8 }} colon={false}>
                                    {getFieldDecorator("periodUnit", {
                                        initialValue: "",
                                        rules: [{ required: true, message: "请选择" }]
                                    })(
                                        <RadioGroup onChange={this.periodUnit_change.bind(this)}>
                                            <Radio value="DAY">自然日</Radio>
                                            <Radio value="MONTH">自然月</Radio>
                                        </RadioGroup>
                                    )}
                                </FormItem>
                                <FormItem label={<span style={{ width: "100%" }}>借款期数</span>} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} colon={false}>
                                    {getFieldDecorator("totalPeriodList", {
                                        initialValue: "",
                                        rules: [{ required: true, message: "请输入" }]
                                    })(
                                        <Tag onRef={this.tag.bind(this)} get_tag={this.getTag.bind(this)} />
                                    )}
                                </FormItem>
                                <FormItem label="每期间隔" labelCol={{ span: 6 }} wrapperCol={{ span: 8 }} colon={false}>
                                    {getFieldDecorator("periodGap", {
                                        initialValue: "",
                                        rules: [{ required: true, message: "请输入" }, { pattern: /^[1-9]\d*$/, message: "格式错误" }]
                                    })(
                                        <Input placeholder="请输入每期间隔" />
                                    )}
                                </FormItem>
                            </Col>
                        </div>
                    </Row>
                    <Row className="product_card">
                        <div className="sh_inner_box">
                            <Col {...titleInfo}>
                                <span className="product_card_title">提前还款信息</span>
                            </Col>
                            <Col span={16}>
                                <FormItem label={<span style={{ width: "100%" }}>利息收取方式</span>} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} colon={false}>
                                    {getFieldDecorator("prepaymentType", {
                                        initialValue: "",
                                        rules: [{ required: true, message: "请选择" }]
                                    })(
                                        <RadioGroup>
                                            <Radio value="1">收取当期</Radio>
                                            <Radio value="2">收取还款期数</Radio>
                                        </RadioGroup>
                                    )}
                                </FormItem>
                            </Col>
                        </div>
                    </Row>

                    <Row className="product_card">
                        <div className="sh_inner_box">
                            <Col {...titleInfo}>
                                <span className="product_card_title">提前结清信息</span>
                            </Col>
                            <Col span={16}>
                                <FormItem label={<span style={{ width: "100%" }}>利息收取方式</span>} labelCol={{ span: 6 }} wrapperCol={{ span: 8 }} colon={false}>
                                    {getFieldDecorator("advanceSettleType", {
                                        initialValue: "",
                                        rules: [{ required: true, message: "请选择" }]
                                    })(
                                        <RadioGroup>
                                            <Radio value="1">收取当期</Radio>
                                            <Radio value="2">收取全部</Radio>
                                        </RadioGroup>
                                    )}
                                </FormItem>
                                <FormItem label={<span style={{ width: "100%" }}>是否收取手续费</span>} labelCol={{ span: 6 }} wrapperCol={{ span: 8 }} colon={false}>
                                    {getFieldDecorator("principalType1", {
                                        initialValue: this.state.principalType_val,
                                        rules: [{ required: true, message: "请选择" }]
                                    })(
                                        <RadioGroup onChange={this.principalType_change.bind(this)}>
                                            <Radio value="1">收取</Radio>
                                            <Radio value="0">不收取</Radio>
                                        </RadioGroup>
                                    )}
                                </FormItem>
                                {this.state.principalType_val === "1" ? <FormItem label="手续费收取标准" {...formInfoText}>
                                    {getFieldDecorator('advanceSettleFeePercent', {
                                        rules: [{ required: true, message: "请输入手续费收取标准" }, { pattern: /^[0-9]+(\.[0-9]{1,5})?$|100$/, message: "格式错误" }]
                                    })(
                                        <Input placeholder="请输入" />
                                    )}
                                    
                                    <div className="formIcon" >%</div>
                                    <div className="formText" >*贷款余额</div>
                                </FormItem> : null}
                                
                            </Col>
                        </div>
                    </Row>
                    <Row className="product_card">
                        <div className="sh_inner_box">
                            <Col {...titleInfo}>
                                <span className="product_card_title">逾期罚息</span>
                            </Col>
                            <Col span={16}>
                                <FormItem label={<span style={{ width: "100%" }}>是否收取</span>} labelCol={{ span: 6 }} wrapperCol={{ span: 8 }} colon={false}>
                                    {getFieldDecorator("dailyOverdueRateType", {
                                        initialValue: this.state.dailyOverdueRateType_val,
                                        rules: [{ required: true, message: "请选择" }]
                                    })(
                                        <RadioGroup onChange={this.dailyOverdueRateType_change.bind(this)}>
                                            <Radio value="1">收取</Radio>
                                            <Radio value="0">不收取</Radio>
                                        </RadioGroup>
                                    )}
                                </FormItem>
                                {this.state.dailyOverdueRateType_val === "1" ? <FormItem label="收取金额" {...formInfoText}>
                                    {getFieldDecorator('dailyOverdueRate', {
                                        rules: [{ required: true, message: "请输入收取金额" }, { pattern: /^[0-9]+(\.[0-9]{1,5})?$|100$/, message: "格式错误" }]
                                    })(
                                        <Input placeholder="请输入" />
                                    )}
                                    <div className="formIcon" >%</div>
                                    <div className="formText" >*未还本息/日</div>
                                </FormItem> : null}
                            </Col>
                        </div>
                    </Row>
                    <Row className="product_card">
                        <div className="sh_inner_box">
                            <Col {...titleInfo}>
                                <span className="product_card_title">逾期违约金</span>
                            </Col>
                            <Col span={16}>
                                <FormItem label={<span style={{ width: "100%" }}>是否收取</span>} labelCol={{ span: 6 }} wrapperCol={{ span: 8 }} colon={false}>
                                    {getFieldDecorator("principalType", {
                                        initialValue: this.state.penaltyType_val,
                                        rules: [{ required: true, message: "请选择" }]
                                    })(
                                        <RadioGroup onChange={this.penaltyType_change.bind(this)}>
                                            <Radio value="1">收取</Radio>
                                            <Radio value="0">不收取</Radio>
                                        </RadioGroup>
                                    )}
                                </FormItem>
                                {this.state.penaltyType_val === "1" ?
                                    <div>
                                        <FormItem label={<span style={{ width: "100%" }}>收取基数</span>} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} colon={false}>
                                            {getFieldDecorator("penaltyType", {
                                                initialValue: this.state.penaltyType_str_val,
                                                rules: [{ required: true, message: "请选择" }]
                                            })(
                                                <RadioGroup onChange={this.penaltyType_str.bind(this)}>
                                                    <Radio value="2">贷款余额百分比</Radio>
                                                    <Radio value="1">固定金额</Radio>
                                                </RadioGroup>
                                            )}
                                        </FormItem>
                                        {
                                            this.state.penaltyType_str_val === "2" ?
                                                <FormItem label="收取金额" {...formInfoText}>
                                                    {getFieldDecorator('penaltyPercent', {
                                                        rules: [{ required: true, message: "请输入收取金额" }, { pattern: /^[0-9]+(\.[0-9]{1,5})?$|100$/, message: "格式错误" }]
                                                    })(
                                                        <Input placeholder="请输入" />
                                                    )}
                                                    
                                                    <div className="formIcon" >%</div>
                                                    <div className="formText" >*未还本息</div>
                                                </FormItem> :
                                                <FormItem label="收取金额" {...formInfoText}>
                                                    {getFieldDecorator('penaltyAmount', {
                                                        rules: [{ required: true, message: "请输入收取金额" }, { pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "格式错误" }]
                                                    })(
                                                        <Input placeholder="请输入" />
                                                    )}
                                                    
                                                    <div className="formText" >元</div>
                                                </FormItem>
                                        }

                                    </div> : null
                                }
                            </Col>

                        </div>
                    </Row>
                    <Row className="product_card">
                        <div className="sh_inner_box">
                            <Col {...titleInfo}>
                                <span className="product_card_title">还款计划</span>
                            </Col>
                            <Col span={16}>
                                <FormItem label={<span style={{ width: "100%" }}>还款计划计算方式</span>} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} colon={false}>
                                    {getFieldDecorator("repayPlanType", {
                                        initialValue: "",
                                        rules: [{ required: true, message: "请选择" }]
                                    })(
                                        <RadioGroup>
                                            <Radio value="2">等额本金</Radio>
                                            <Radio value="1">等额本息</Radio>
                                            <Radio value="3">等本等息</Radio>
                                        </RadioGroup>
                                    )}
                                </FormItem>
                            </Col>
                        </div>
                    </Row>

                    {/* </div> */}
                </div>
                <div className="sh_add_card">
                    <div className="sh_inner_box">
                        <span className="sh_add_title">用户群配置</span>
                        <Button type="primary" onClick={this.add.bind(this)} style={{marginLeft:"20px"}} icon="plus">新增用户群</Button>
                        <Dynamic onRef={this.user.bind(this)} periodUnit={this.state.periodUnit_type} tag={this.state.tagArr} id={this.state.id} user_key={this.state.userEdit} user_data={this.state.userArr} />
                    </div>
                </div>

                <div className="sh_add_card">
                    <div className="sh_inner_box">
                        <div className="sh_add_title">有效期配置</div>
                        <FormItem label="首借额度失效时间" {...formInfo} >
                            {getFieldDecorator('creditValidity', {
                                initialValue: "",
                                rules: [{ required: true, message: "请输入" }, { pattern: /^[1-9]\d*$/, message: "格式错误" }]
                            })(
                                <Input placeholder="请输入" />
                            )}
                            <div className="formText" >天</div>
                        </FormItem>
                        <FormItem label="复借额度失效时间" {...formInfo} >
                            {getFieldDecorator('reCreditValidity', {
                                initialValue: "",
                                rules: [{ required: true, message: "请输入" }, { pattern: /^[1-9]\d*$/, message: "格式错误" }]
                            })(
                                <Input placeholder="请输入" />
                            )}
                            <div className="formText" >天</div>
                        </FormItem>
                        <FormItem label="额度评估失败后重新提交时间" {...formInfo} >
                            {getFieldDecorator('resubmitValidity', {
                                initialValue: "",
                                rules: [{ required: true, message: "请输入" }, { pattern: /^[1-9]\d*$/, message: "格式错误" }]
                            })(
                                <Input placeholder="请输入" />
                            )}
                            <div className="formText" >天</div>
                        </FormItem>
                        <FormItem label="借款审核失败后重新提交时间" {...formInfo} >
                            {getFieldDecorator('loanResubmitValidity', {
                                initialValue: "",
                                rules: [{ required: true, message: "请输入" }, { pattern: /^[1-9]\d*$/, message: "格式错误" }]
                            })(
                                <Input placeholder="请输入" />
                            )}
                            <div className="formText" >天</div>
                        </FormItem>
                        <FormItem label="活体有效期" {...formInfo} >
                            {getFieldDecorator('identityValidity', {
                                initialValue: "",
                                rules: [{ required: true, message: "请输入" }, { pattern: /^[1-9]\d*$/, message: "格式错误" }]
                            })(
                                <Input placeholder="请输入" />
                            )}
                            <div className="formText" >天</div>
                        </FormItem>
                        <FormItem label="运营商认证有效期" {...formInfo} >
                            {getFieldDecorator('operatorValidity', {
                                initialValue: "",
                                rules: [{ required: true, message: "请输入" }, { pattern: /^[1-9]\d*$/, message: "格式错误" }]
                            })(
                                <Input placeholder="请输入" />
                            )}
                            <div className="formText" >天</div>
                        </FormItem>
                    </div>
                </div>

                <Row style={{ height: "50px", background: "#fff", position: "fixed", bottom: "0", right: "0", lineHeight: "50px", textAlign: "center", width: "calc(100% - 210px)", borderTop: "1px solid #CED0DA" }}>
                    <Popconfirm {...confirm}>
                        <Button type="primary" size="large" disabled={this.state.btn} >提交</Button>
                    </Popconfirm>
                </Row>
                <Modal visible={this.state.previewVisible} onCancel={this.imgCancel.bind(this)} {...modal}>
                    <AddUser onRef={this.addUser.bind(this)} />
                </Modal>
            </Form>
        )

    }
}
export default Form.create()(Basic);