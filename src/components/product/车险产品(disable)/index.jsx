import React, { Component } from 'react';
import {Row,Form,Select,Input,Col,Button,message,Radio,Checkbox,Modal} from 'antd';
import {product_gen_code,product_add,cx_product_detail,cx_product_update,cxfq_repay_type} from '../../../ajax/api';
import { axios_cxfq } from '../../../ajax/request';
import { browserHistory } from 'react-router';
import ComponentRoute from '../../../templates/ComponentRoute';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
class Product_cxfq extends Component{
    constructor(props) {
        super(props);
        this.state = {
            haveDiscount:1,
            discount1:false,
            discount2:false,
            discount3:false,
            code:'',
            visible:false,
            productId:props.location.query.productId,
            repay_type:[],
            isleave:false
        };
    }
    componentWillMount(){
        this.get_repay();
        if(this.state.productId){
            this.getDetail();
        }else{
            this.getCode();
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
    get_repay(){
        axios_cxfq.get(cxfq_repay_type,'').then(e=>{
            this.setState({repay_type:e.data})
        })
    }
    getCode() {
        axios_cxfq.get(product_gen_code,'','GET').then(e=>{
            this.setState({code:e.data})
        })
    }
    getDetail(){
        axios_cxfq.get(cx_product_detail+"?productId="+this.state.productId).then(e=>{
            if(!e.code){
                var data=e.data;
                this.setState({
                    code:data.code,
                    haveDiscount:data.haveDiscount,
                    discount1:data.discount1Type?true:false,
                    discount2:data.discount2Type?true:false,
                    discount3:data.discount3Type?true:false,
                });
                this.props.form.setFieldsValue({name:data.name,discount1Type:data.discount1Type,discount2Type:data.discount2Type,discount3Type:data.discount3Type,interestType:data.interestType,serviceFeeType:data.serviceFeeType,otherFeeType:data.otherFeeType,loanUsage:data.loanUsage.toString(),loanType:data.loanType.toString(),realRepayType:data.realRepayType.toString(),repayType:data.repayType.toString(),interestAdvance:data.interestAdvance,serviceFeeAdvance:data.serviceFeeAdvance,otherFeeAdvance:data.otherFeeAdvance})
            }
        })
    }
    discount1Change(e){
        if(!e.target.checked){
            this.props.form.setFieldsValue({'discount1Type':''})
        }
        this.setState({
            discount1:e.target.checked
        })
    }
    discount2Change(e){
        if(!e.target.checked){
            this.props.form.setFieldsValue({'discount2Type':''})
        }
        this.setState({
            discount2:e.target.checked
        })
    }
    discount3Change(e){
        if(!e.target.checked){
            this.props.form.setFieldsValue({'discount3Type':''})
        }
        this.setState({
            discount3:e.target.checked
        })
    }
    haveDiscount(e){
        this.setState({
            haveDiscount:e.target.value
        })
    }
    sure(e){
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                if(values.name.length>50){
                    message.warn('产品名称应小于50字');
                    return;
                }
                if(values.haveDiscount&&values.discount1Type===''&&values.discount2Type===''&&values.discount3Type===''){
                    message.warn('请选择保证金及处理方式');
                    return;
                }
                for(var i in values){
                    if(values[i]===''&&i!=='discount1Type'&&i!=='discount2Type'&&i!=='discount3Type'){
                        message.warn('必填项不能为空');
                        return;
                    }
                }
                if(values.loanUsage==='请选择'||values.loanType==='请选择'||values.repayType==='请选择'||values.realRepayType==='请选择'){
                    message.warn('必填项不能为空');
                    return;
                }
                if(this.state.productId){
                    values.productId=this.state.productId;
                    axios_cxfq.post(cx_product_update,JSON.stringify(values)).then(e=>{
                        if(e.code===0){
                            this.setState({
                                isleave:true,
                            })
                            message.success('修改成功');
                            this.reset();
                            browserHistory.push("/cp/cxfq/list")
                        }
                    })
                }else{
                    axios_cxfq.post(product_add,JSON.stringify(values)).then(e=>{
                        if(e.code===0){
                            this.setState({
                                isleave:true,
                            })
                            message.success('新增成功');
                            this.reset();
                            //this.getCode();
                            browserHistory.push("/cp/list")
                        }
                    })
                }

            }
        });
    }
    reset(){
        if(this.state.haveDiscount){
            this.props.form.setFieldsValue({discount1Type:'',discount2Type:'',discount3Type:''})
        }
        this.props.form.setFieldsValue({name:'',haveDiscount:1,interestType:'',serviceFeeType:'',otherFeeType:'',loanUsage:'请选择',loanType:'请选择',repayType:'请选择',realRepayType:'请选择',interestAdvance:'',serviceFeeAdvance:'',otherFeeAdvance:''});
        this.setState({
            discount1:false,
            discount2:false,
            discount3:false,
            haveDiscount:1
        });
    }
    clickReset(){
        // this.setState({visible:true})
        browserHistory.push('/cp/cxfq/list');
    }
    onOk(){
        this.reset();
        this.setState({visible:false})
    }
    onCancel(){
        this.setState({visible:false})
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const modalInfo={
            title:"重置",
            visible:this.state.visible,
            onOk:this.onOk.bind(this),
            onCancel:this.onCancel.bind(this),
            maskClosable:false
        };
        let paths = ["产品管理"];
        if(this.state.productId){
            paths.push("产品编辑");
        }else{
            paths.push("产品添加");
        }
        const leave={
            visible:this.state.leave,
            maskClosable:false,
            closable:false,
            onOk:this.leaveClose.bind(this),
            onCancel:this.leaveOk.bind(this),
            cancelText:"取消",
            okText:"确认退出",
            title:"退出确认"
        }
        return (
            <div>
                <Form className="product_cxfq" >
                    <Row className="content_cx">

                        <div className="card_cx">
                        <div className="title">
                            <div className="icon" />
                            <span className="titleWord">产品信息</span>
                        </div>
                        
                        <Row className="form_cx ">
                        
                            <Row>
                                <Col style={{width:'60px',float:'left',lineHeight:'30px',fontSize:'14px',color:'#444'}}>产品编号</Col>
                                <Col style={{width:'calc(100% - 75px)',float:'left',marginLeft:'15px'}}>
                                    <FormItem >
                                        {getFieldDecorator('code', {
                                            initialValue:this.state.code
                                        })(
                                            <div style={{fontWeight:'bold!important',fontSize:'14px'}}>{this.state.code}</div>
                                        )}

                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col style={{width:'60px',float:'left',lineHeight:'30px',fontSize:'14px',color:'#444'}}>产品名称</Col>
                                <Col style={{width:'calc(100% - 75px)',float:'left',marginLeft:'15px'}}>
                                    <FormItem>
                                        {getFieldDecorator('name', {
                                            initialValue:''
                                        })(
                                            <Input type="text" placeholder="支持数字、字母、汉字及组合，最长50字" />
                                        )}

                                    </FormItem>
                                </Col>
                            </Row>
                        </Row>
                        </div>

                    </Row>


                    <Row className="content_cx">
                        <div className="card_cx">
                        <div className="title">
                            <div className="icon" />
                            <span className="titleWord">借款信息</span>
                        </div>
                        <Row className="form_cx">
                            <Row>
                                <span className="bold">请选择是否需要支付保证金</span>
                                <FormItem >
                                    {getFieldDecorator('haveDiscount', {
                                        initialValue:this.state.haveDiscount
                                    })(
                                        <RadioGroup onChange={this.haveDiscount.bind(this)}>
                                            <Radio value={1}>是</Radio>
                                            <Radio value={0}>否</Radio>
                                        </RadioGroup>
                                    )}

                                </FormItem>

                            </Row>
                            {
                                this.state.haveDiscount?<Row style={{background:'#F7F7F7',padding:'23px'}}>
                                    <Col>
                                        <Checkbox onChange={this.discount1Change.bind(this)} checked={this.state.discount1} className="bzj">保证金1</Checkbox>
                                    </Col>
                                    <Col >
                                        <FormItem label="保证金处置方式" labelCol={{xl:{span:2},lg:{span:3}}} wrapperCol={{span:20}} colon={false} className="color">
                                            {getFieldDecorator('discount1Type', {
                                                initialValue:''
                                            })(
                                                <RadioGroup disabled={!this.state.discount1}>
                                                    <Radio value={1}>退还保证金</Radio>
                                                    <Radio value={2}>抵扣最后一期还款</Radio>
                                                    <Radio value={3}>代收代付</Radio>
                                                </RadioGroup>
                                            )}

                                        </FormItem>
                                    </Col>
                                    <Col>
                                        <Checkbox onChange={this.discount2Change.bind(this)} checked={this.state.discount2} className="bzj">保证金2</Checkbox>
                                    </Col>
                                    <Col>
                                        <FormItem label="保证金处置方式" labelCol={{xl:{span:2},lg:{span:3}}} wrapperCol={{span:20}} colon={false} className="color">
                                            {getFieldDecorator('discount2Type', {
                                                initialValue:''
                                            })(
                                                <RadioGroup disabled={!this.state.discount2}>
                                                    <Radio value={1}>退还保证金</Radio>
                                                    <Radio value={2}>抵扣最后一期还款</Radio>
                                                    <Radio value={3}>代收代付</Radio>
                                                </RadioGroup>
                                            )}

                                        </FormItem>
                                    </Col>
                                    <Col>
                                        <Checkbox onChange={this.discount3Change.bind(this)} checked={this.state.discount3} className="bzj">保证金3</Checkbox>
                                    </Col>
                                    <Col>
                                        <FormItem label="保证金处置方式" labelCol={{xl:{span:2},lg:{span:3}}} wrapperCol={{span:20}} colon={false} className="color">
                                            {getFieldDecorator('discount3Type', {
                                                initialValue:''
                                            })(
                                                <RadioGroup disabled={!this.state.discount3}>
                                                    <Radio value={1}>退还保证金</Radio>
                                                    <Radio value={2}>抵扣最后一期还款</Radio>
                                                    <Radio value={3}>代收代付</Radio>
                                                </RadioGroup>
                                            )}

                                        </FormItem>
                                    </Col>
                                </Row>:''
                            }

                        </Row>
                        </div>
                        <div className="card_cx">
                        <Row className="form_cx">
                            <span className="bold">请选择综合费用支付方式</span>
                            <FormItem label="利息" colon={false} className="color">
                                {getFieldDecorator('interestType', {
                                    initialValue:''
                                })(
                                    <RadioGroup >
                                        <Radio value={1}>放款前一次性支付</Radio>
                                        <Radio value={2}>首期还款日支付</Radio>
                                        <Radio value={3}>按期支付</Radio>
                                    </RadioGroup>
                                )}

                            </FormItem>
                            <FormItem label="服务费" colon={false} className="color">
                                {getFieldDecorator('serviceFeeType', {
                                    initialValue:''
                                })(
                                    <RadioGroup >
                                        <Radio value={1}>放款前一次性支付</Radio>
                                        <Radio value={2}>首期还款日支付</Radio>
                                        <Radio value={3}>按期支付</Radio>
                                    </RadioGroup>
                                )}

                            </FormItem>
                            <FormItem label="其他费用" colon={false} className="color">
                                {getFieldDecorator('otherFeeType', {
                                    initialValue:''
                                })(
                                    <RadioGroup >
                                        <Radio value={1}>放款前一次性支付</Radio>
                                        <Radio value={2}>首期还款日支付</Radio>
                                        <Radio value={3}>按期支付</Radio>
                                    </RadioGroup>
                                )}

                            </FormItem>
                        </Row>
                        </div>
                        <div className="card_cx">
                        <Row className="form_cx">
                            <Row>
                                <Col style={{width:'60px',float:'left',lineHeight:'30px',fontSize:'14px',color:'#444'}}>贷款用途</Col>
                                <Col style={{width:'200px',float:'left',marginLeft:'15px'}}>
                                    <FormItem>
                                        {getFieldDecorator('loanUsage', {
                                            initialValue:'请选择'
                                        })(
                                            <Select>
                                                <Option value="1">流动资金贷款</Option>
                                                <Option value="2">固定资产投资贷款</Option>
                                                <Option value="3">其他</Option>
                                            </Select>
                                        )}

                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col style={{width:'60px',float:'left',lineHeight:'30px',fontSize:'14px',color:'#444'}}>贷款方式</Col>
                                <Col style={{width:'200px',float:'left',marginLeft:'15px'}}>
                                    <FormItem>
                                        {getFieldDecorator('loanType', {
                                            initialValue:'请选择'
                                        })(
                                            <Select>
                                                <Option value="1">信用</Option>
                                                <Option value="2">保证</Option>
                                                <Option value="3">抵押</Option>
                                                <Option value="4">质押</Option>
                                                <Option value="5">其他</Option>
                                            </Select>
                                        )}

                                    </FormItem>
                                </Col>
                            </Row>
                            {/* <Row>
                                <Col style={{width:'60px',float:'left',lineHeight:'30px',fontSize:'14px',color:'#444'}}>业务类型</Col>
                                <Col style={{width:'200px',float:'left',marginLeft:'15px'}}>
                                    <FormItem>
                                        {getFieldDecorator('loanBasis', {
                                            initialValue:''
                                        })(
                                            <RadioGroup>
                                                <Radio value={1}>投保单</Radio>
                                                <Radio value={0}>保单</Radio>
                                            </RadioGroup>
                                        )}

                                    </FormItem>
                                </Col>
                            </Row> */}
                        </Row>
                        </div>
                    </Row>

                    <Row className="content_cx">
                        <div className="card_cx">
                        <div className="title">
                            <div className="icon" />
                            <span className="titleWord">还款信息</span>
                        </div>
                        <Row className="form_cx">
                        <Row>
                                <Col style={{width:'60px',float:'left',lineHeight:'30px',fontSize:'14px',color:'#444'}}>还款方式</Col>
                                <Col style={{width:'200px',float:'left',marginLeft:'15px'}}>
                                    <FormItem>
                                        {getFieldDecorator('realRepayType', {
                                            initialValue:'请选择'
                                        })(
                                            <Select>
                                                {
                                                    this.state.repay_type.map((i,k)=>{
                                                        return <Option value={i.value.toString()} key={k}>{i.desc}</Option>
                                                    })
                                                }
                                            </Select>
                                        )}

                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col style={{width:'60px',float:'left',lineHeight:'20px',fontSize:'14px',color:'#444'}}>上报还款方式</Col>
                                <Col style={{width:'200px',float:'left',marginLeft:'15px'}}>
                                    <FormItem>
                                        {getFieldDecorator('repayType', {
                                            initialValue:'请选择'
                                        })(
                                            <Select>
                                                <Option value="1">等额本息</Option>
                                                <Option value="2">等额本金</Option>
                                                <Option value="3">先息后本</Option>
                                                <Option value="4">灵活还款</Option>
                                            </Select>
                                        )}

                                    </FormItem>
                                </Col>
                            </Row>
                        </Row>
                        </div>
                        <div className="card_cx">
                        <Row className="form_cx">
                            <div className="bold">提前还款时费用是否退还</div>
                            <FormItem label="利息" colon={false} className="color">
                                {getFieldDecorator('interestAdvance', {
                                    initialValue:''
                                })(
                                    <RadioGroup>
                                        <Radio value={1}>退还</Radio>
                                        <Radio value={0}>不退还</Radio>
                                    </RadioGroup>
                                )}

                            </FormItem>
                            <FormItem label="服务费" colon={false} className="color">
                                {getFieldDecorator('serviceFeeAdvance', {
                                    initialValue:''
                                })(
                                    <RadioGroup>
                                        <Radio value={1}>退还</Radio>
                                        <Radio value={0}>不退还</Radio>
                                    </RadioGroup>
                                )}

                            </FormItem>
                            <FormItem label="其他费用" colon={false} className="color">
                                {getFieldDecorator('otherFeeAdvance', {
                                    initialValue:''
                                })(
                                    <RadioGroup>
                                        <Radio value={1}>退还</Radio>
                                        <Radio value={0}>不退还</Radio>
                                    </RadioGroup>
                                )}

                            </FormItem>
                        </Row>
                        </div>
                    </Row>
                    <Row style={{height:"50px",background:"#fff",position:"fixed",bottom:"0",right:"0",lineHeight:"50px",textAlign:"center",width:"calc(100% - 170px)",boxShadow:"0px -2px 4px 0px rgba(0,0,0,0.1)"}}>
                        {/* <Button onClick={this.clickReset.bind(this)}>重置</Button> */}
                        <Button onClick={this.clickReset.bind(this)}>取消</Button>
                        <Button type="primary" style={{marginLeft:'30px'}} onClick={this.sure.bind(this)}>确认</Button>
                    </Row>
                </Form>
                <Modal {...modalInfo}><span style={{fontSize:"14px"}}>确认清空当前内容？</span></Modal>
                <Modal {...leave}>
                    是否确认退出此页面？退出后您当前录入的信息将不可保存。
                </Modal>
            </div>
        )
    }
}
export default ComponentRoute(Form.create()(Product_cxfq));