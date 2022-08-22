import React , { Component } from 'react';
import { Row , Form , Input , Select,Button,Radio} from 'antd';
import {product_create,product_detail,product_update} from '../../../ajax/api';
import {axios_ygd_json,axios_ygd} from '../../../ajax/request';
import {page_go} from '../../../ajax/tool';
// import { Link } from 'react-router';
// import Path from '../../../templates/Path';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
class Product extends Component{
    constructor(props){
        super(props);
        this.state = {
            businessArr:[],
            repayPlanTypeArr:[],
            repayTypeArr:[],
            productId:props.location.query.productId,
            project:props.location.query.project,
            productConfigId:props.location.query.configId,
            code:props.location.query.code
        }
    }
    componentWillMount () {
        this.getOption()
    }
    componentDidMount(){
        if(this.state.productId){
            this.getDetail();
        }

    }
    getOption(){
        var data=JSON.parse(window.localStorage.getItem("dropdownList"));
        var business=data.business;
        var repayPlanType=data.repayPlanType;
        var repayType=data.repayType;
        var businessArr=[],repayPlanTypeArr=[],repayTypeArr=[];
        for(var i in business){
            businessArr.push(<Option value={i} key={i+"business"}>{business[i]}</Option>)
        }
        for(var j in repayPlanType){
            repayPlanTypeArr.push(<Option value={j} key={j+"repayPlanType"}>{repayPlanType[j]}</Option>)
        }
        for(var k in repayType){
            repayTypeArr.push(<Option value={k} key={k}>{repayType[k]}</Option>)
        }
        this.setState({
            businessArr:businessArr,
            repayPlanTypeArr:repayPlanTypeArr,
            repayTypeArr:repayTypeArr
        })
    }
    //提交
    save(){
        this.props.form.validateFieldsAndScroll((err,val)=>{
            if(!err){
                val.overdueRate=0;
                val.penaltyRate=0;
                if(this.state.productId){
                    val.id=this.state.productId;
                    //val.project=this.state.project;
                    val.productConfigId=this.state.productConfigId;
                    val.code=this.state.code;

                    axios_ygd_json.post(product_update,val).then(e=>{
                        page_go("/cp/ygd/list")
                    })
                }else{
                    axios_ygd_json.post(product_create,val).then(e=>{
                        page_go("/cp/ygd/list")
                    })
                }

            }
        })
    }
    //获取详情
    getDetail(){
        var rqd={
            productId:this.state.productId
        }
        axios_ygd.post(product_detail,rqd).then(e=>{
            var data=e.data;
            var product=this.props.form.getFieldsValue();
            for(var i in product){
                if(i==="name"||i==="overdueRate"||i==="penaltyRate"||i==="project"||i==="code"||i==="repayPlanType"||i==="repayType"){
                    this.props.form.setFieldsValue({[i]:data[i]})
                }else{
                    this.props.form.setFieldsValue({[i]:data[i].toString()})
                }

            }
        })
    }
    overdueRate(e){
        if(e.target.value){

            if(e.target.value.indexOf(".")===-1){
                e.target.value=parseFloat(e.target.value).toFixed(2);
            }else if(e.target.value.split(".")[1].length<2){
                e.target.value=parseFloat(e.target.value).toFixed(2);
            }
            this.props.form.setFieldsValue({overdueRate:e.target.value})

        }
    }
    penaltyRate(e){
        if(e.target.value){

            if(e.target.value.indexOf(".")===-1){
                e.target.value=parseFloat(e.target.value).toFixed(2);
            }else if(e.target.value.split(".")[1].length<2){
                e.target.value=parseFloat(e.target.value).toFixed(2);
            }
            this.props.form.setFieldsValue({penaltyRate:e.target.value})

        }
    }
    repayPlanType(e){
        this.props.form.setFieldsValue({repayPlanType:e})
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout={
            labelCol: { span: 6 },
            wrapperCol: { span: 10 },
        };
        const path=["产品管理","员工贷产品管理"];
        if(this.state.productId){
            path.push("编辑")
        }else{
            path.push("新增")
        }
        return(
                <Row>
                    {/* <Row className="path">
                    
                    <Breadcrumb style={{width:'100%'}}>
                        <Breadcrumb.Item>产品管理</Breadcrumb.Item>
                        <Breadcrumb.Item><Link to="/cp/ygd/list">员工贷产品管理</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>{this.state.productId?"编辑":"新增"}</Breadcrumb.Item>
                    </Breadcrumb>
                </Row> */}
                    <Form className="product_cxfq">
                        <Row className="content_cx">
                        <div className="card_cx"> 
                        <div className="title">
                            <div className="icon" />
                            <span className="titleWord">产品信息</span>
                        </div>
                        <Row className="form_cx">
                            <FormItem {...formItemLayout} label="产品名称">
                                {getFieldDecorator('name', {
                                    rules: [
                                        { required: true, message: '请输入产品名称' }],
                                })(
                                    <Input placeholder="请输入产品名称" />
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="所属项目">
                                {getFieldDecorator('project', {
                                    rules: [
                                        { required: true, message: '请选择所属项目' }],
                                })(
                                    <Select placeholder="请选择所属项目" disabled={this.state.productId?true:false}>
                                        <Option value="ygd">员工贷</Option>
                                        <Option value="jyd">经营贷</Option>
                                    </Select>
                                )}
                            </FormItem>
                            
                                <FormItem {...formItemLayout} label="" style={{marginBottom:"0"}}>
                                {getFieldDecorator('repayPlanType', {
                                    // rules: [
                                    //     { required: true, message: '' }],
                                })(
                                    <div />
                                )}
                            </FormItem>
                            
                            
                            <FormItem {...formItemLayout} label="还款方式">
                                {getFieldDecorator('repayType', {
                                    rules: [
                                        { required: true, message: '请选择还款方式' }],
                                })(
                                    <Select placeholder="请选择还款方式" onChange={this.repayPlanType.bind(this)}>
                                        {this.state.repayTypeArr}
                                    </Select>
                                )}
                            </FormItem>
                            {
                            //    <FormItem {...formItemLayout} label="逾期利率">
                            //        {getFieldDecorator('overdueRate', {
                            //            rules: [
                            //                { required: true, message: '请输入逾期利率' },
                            //                { pattern :/^([0-9]{1,2}(\.[0-9]{1,2})?)$/ , message: '格式错误'}
                            //            ],
                            //
                            //        })(
                            //            <Input placeholder="请输入逾期利率" onBlur={this.overdueRate.bind(this)} />
                            //        )}
                            //        <span style={{position:"absolute",left:"101%"}}>%</span>
                            //    </FormItem>
                            //    <FormItem {...formItemLayout} label="罚息利率">
                            //{getFieldDecorator('penaltyRate', {
                            //    rules: [
                            //{ required: true, message: '请输入罚息利息' },
                            //{ pattern :/^([0-9]{1,2}(\.[0-9]{1,2})?)$/ , message: '格式错误'}
                            //    ],
                            //})(
                            //    <Input placeholder="请输入罚息利息" onBlur={this.penaltyRate.bind(this)} />
                            //    )}
                            //    <span style={{position:"absolute",left:"101%"}}>%</span>
                            //    </FormItem>
                            }

                            </Row>
                        </div>
                        </Row>
                        <Row className="content_cx">
                        <div className="card_cx">
                        <div className="title">
                            <div className="icon" />
                            <span className="titleWord">上报信息</span>
                        </div>
                        <Row className="form_cx">
                            <FormItem {...formItemLayout} label="还款方式">
                                {getFieldDecorator('reportRepayMethod', {
                                    rules: [
                                        { required: true, message: '请选择还款方式' }],
                                })(
                                    <Select placeholder="请选择还款方式">
                                        <Option value="1">等额本息</Option>
                                        <Option value="2">等额本金</Option>
                                        <Option value="3">先息后本</Option>
                                        <Option value="4">灵活还款</Option>
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="贷款方式">
                                {getFieldDecorator('reportLoanMethod', {
                                    rules: [
                                        { required: true, message: '请选择贷款方式' }],
                                })(
                                    <Select placeholder="请选择贷款方式">
                                        <Option value="1">信用</Option>
                                        <Option value="2">保证</Option>
                                        <Option value="3">抵押</Option>
                                        <Option value="4">质押</Option>
                                        <Option value="5">其他</Option>
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="贷款用途">
                                {getFieldDecorator('reportPurpose', {
                                    rules: [
                                        { required: true, message: '请选择贷款用途' }],
                                })(
                                    <Select placeholder="请选择贷款用途">
                                        <Option value="1">流动资金贷款</Option>
                                        <Option value="2">固定资产投资贷款</Option>
                                        <Option value="3">其他</Option>
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="贷款投向">
                                {getFieldDecorator('reportBusiness', {
                                    rules: [
                                        { required: true, message: '请选择还款方式' }],
                                })(
                                    <Select placeholder="请选择还款方式">
                                        {this.state.businessArr}
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="受托支付">
                                {getFieldDecorator('reportEntrust', {
                                    rules: [
                                        { required: true, message: '请选择是否受托支付' }],
                                })(
                                    <RadioGroup>
                                    <Radio value="1">是</Radio>
                                    <Radio value="0">否</Radio>
                                    </RadioGroup>
                                )}
                            </FormItem>
                        </Row>
                        </div>
                        </Row>
                        

                    </Form>
                    <Row style={{textAlign:"center",margin:"10px 0"}}>
                        {
                            //<Button type="primary">取消</Button>
                        }

                        <Button type="primary" style={{marginLeft:"20px"}} onClick={this.save.bind(this)}>提交</Button>
                    </Row>
                </Row>
        )

    }
}
export default Form.create()(Product);