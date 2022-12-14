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
                    message.warn('?????????????????????50???');
                    return;
                }
                if(values.haveDiscount&&values.discount1Type===''&&values.discount2Type===''&&values.discount3Type===''){
                    message.warn('?????????????????????????????????');
                    return;
                }
                for(var i in values){
                    if(values[i]===''&&i!=='discount1Type'&&i!=='discount2Type'&&i!=='discount3Type'){
                        message.warn('?????????????????????');
                        return;
                    }
                }
                if(values.loanUsage==='?????????'||values.loanType==='?????????'||values.repayType==='?????????'||values.realRepayType==='?????????'){
                    message.warn('?????????????????????');
                    return;
                }
                if(this.state.productId){
                    values.productId=this.state.productId;
                    axios_cxfq.post(cx_product_update,JSON.stringify(values)).then(e=>{
                        if(e.code===0){
                            this.setState({
                                isleave:true,
                            })
                            message.success('????????????');
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
                            message.success('????????????');
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
        this.props.form.setFieldsValue({name:'',haveDiscount:1,interestType:'',serviceFeeType:'',otherFeeType:'',loanUsage:'?????????',loanType:'?????????',repayType:'?????????',realRepayType:'?????????',interestAdvance:'',serviceFeeAdvance:'',otherFeeAdvance:''});
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
            title:"??????",
            visible:this.state.visible,
            onOk:this.onOk.bind(this),
            onCancel:this.onCancel.bind(this),
            maskClosable:false
        };
        let paths = ["????????????"];
        if(this.state.productId){
            paths.push("????????????");
        }else{
            paths.push("????????????");
        }
        const leave={
            visible:this.state.leave,
            maskClosable:false,
            closable:false,
            onOk:this.leaveClose.bind(this),
            onCancel:this.leaveOk.bind(this),
            cancelText:"??????",
            okText:"????????????",
            title:"????????????"
        }
        return (
            <div>
                <Form className="product_cxfq" >
                    <Row className="content_cx">

                        <div className="card_cx">
                        <div className="title">
                            <div className="icon" />
                            <span className="titleWord">????????????</span>
                        </div>
                        
                        <Row className="form_cx ">
                        
                            <Row>
                                <Col style={{width:'60px',float:'left',lineHeight:'30px',fontSize:'14px',color:'#444'}}>????????????</Col>
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
                                <Col style={{width:'60px',float:'left',lineHeight:'30px',fontSize:'14px',color:'#444'}}>????????????</Col>
                                <Col style={{width:'calc(100% - 75px)',float:'left',marginLeft:'15px'}}>
                                    <FormItem>
                                        {getFieldDecorator('name', {
                                            initialValue:''
                                        })(
                                            <Input type="text" placeholder="????????????????????????????????????????????????50???" />
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
                            <span className="titleWord">????????????</span>
                        </div>
                        <Row className="form_cx">
                            <Row>
                                <span className="bold">????????????????????????????????????</span>
                                <FormItem >
                                    {getFieldDecorator('haveDiscount', {
                                        initialValue:this.state.haveDiscount
                                    })(
                                        <RadioGroup onChange={this.haveDiscount.bind(this)}>
                                            <Radio value={1}>???</Radio>
                                            <Radio value={0}>???</Radio>
                                        </RadioGroup>
                                    )}

                                </FormItem>

                            </Row>
                            {
                                this.state.haveDiscount?<Row style={{background:'#F7F7F7',padding:'23px'}}>
                                    <Col>
                                        <Checkbox onChange={this.discount1Change.bind(this)} checked={this.state.discount1} className="bzj">?????????1</Checkbox>
                                    </Col>
                                    <Col >
                                        <FormItem label="?????????????????????" labelCol={{xl:{span:2},lg:{span:3}}} wrapperCol={{span:20}} colon={false} className="color">
                                            {getFieldDecorator('discount1Type', {
                                                initialValue:''
                                            })(
                                                <RadioGroup disabled={!this.state.discount1}>
                                                    <Radio value={1}>???????????????</Radio>
                                                    <Radio value={2}>????????????????????????</Radio>
                                                    <Radio value={3}>????????????</Radio>
                                                </RadioGroup>
                                            )}

                                        </FormItem>
                                    </Col>
                                    <Col>
                                        <Checkbox onChange={this.discount2Change.bind(this)} checked={this.state.discount2} className="bzj">?????????2</Checkbox>
                                    </Col>
                                    <Col>
                                        <FormItem label="?????????????????????" labelCol={{xl:{span:2},lg:{span:3}}} wrapperCol={{span:20}} colon={false} className="color">
                                            {getFieldDecorator('discount2Type', {
                                                initialValue:''
                                            })(
                                                <RadioGroup disabled={!this.state.discount2}>
                                                    <Radio value={1}>???????????????</Radio>
                                                    <Radio value={2}>????????????????????????</Radio>
                                                    <Radio value={3}>????????????</Radio>
                                                </RadioGroup>
                                            )}

                                        </FormItem>
                                    </Col>
                                    <Col>
                                        <Checkbox onChange={this.discount3Change.bind(this)} checked={this.state.discount3} className="bzj">?????????3</Checkbox>
                                    </Col>
                                    <Col>
                                        <FormItem label="?????????????????????" labelCol={{xl:{span:2},lg:{span:3}}} wrapperCol={{span:20}} colon={false} className="color">
                                            {getFieldDecorator('discount3Type', {
                                                initialValue:''
                                            })(
                                                <RadioGroup disabled={!this.state.discount3}>
                                                    <Radio value={1}>???????????????</Radio>
                                                    <Radio value={2}>????????????????????????</Radio>
                                                    <Radio value={3}>????????????</Radio>
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
                            <span className="bold">?????????????????????????????????</span>
                            <FormItem label="??????" colon={false} className="color">
                                {getFieldDecorator('interestType', {
                                    initialValue:''
                                })(
                                    <RadioGroup >
                                        <Radio value={1}>????????????????????????</Radio>
                                        <Radio value={2}>?????????????????????</Radio>
                                        <Radio value={3}>????????????</Radio>
                                    </RadioGroup>
                                )}

                            </FormItem>
                            <FormItem label="?????????" colon={false} className="color">
                                {getFieldDecorator('serviceFeeType', {
                                    initialValue:''
                                })(
                                    <RadioGroup >
                                        <Radio value={1}>????????????????????????</Radio>
                                        <Radio value={2}>?????????????????????</Radio>
                                        <Radio value={3}>????????????</Radio>
                                    </RadioGroup>
                                )}

                            </FormItem>
                            <FormItem label="????????????" colon={false} className="color">
                                {getFieldDecorator('otherFeeType', {
                                    initialValue:''
                                })(
                                    <RadioGroup >
                                        <Radio value={1}>????????????????????????</Radio>
                                        <Radio value={2}>?????????????????????</Radio>
                                        <Radio value={3}>????????????</Radio>
                                    </RadioGroup>
                                )}

                            </FormItem>
                        </Row>
                        </div>
                        <div className="card_cx">
                        <Row className="form_cx">
                            <Row>
                                <Col style={{width:'60px',float:'left',lineHeight:'30px',fontSize:'14px',color:'#444'}}>????????????</Col>
                                <Col style={{width:'200px',float:'left',marginLeft:'15px'}}>
                                    <FormItem>
                                        {getFieldDecorator('loanUsage', {
                                            initialValue:'?????????'
                                        })(
                                            <Select>
                                                <Option value="1">??????????????????</Option>
                                                <Option value="2">????????????????????????</Option>
                                                <Option value="3">??????</Option>
                                            </Select>
                                        )}

                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col style={{width:'60px',float:'left',lineHeight:'30px',fontSize:'14px',color:'#444'}}>????????????</Col>
                                <Col style={{width:'200px',float:'left',marginLeft:'15px'}}>
                                    <FormItem>
                                        {getFieldDecorator('loanType', {
                                            initialValue:'?????????'
                                        })(
                                            <Select>
                                                <Option value="1">??????</Option>
                                                <Option value="2">??????</Option>
                                                <Option value="3">??????</Option>
                                                <Option value="4">??????</Option>
                                                <Option value="5">??????</Option>
                                            </Select>
                                        )}

                                    </FormItem>
                                </Col>
                            </Row>
                            {/* <Row>
                                <Col style={{width:'60px',float:'left',lineHeight:'30px',fontSize:'14px',color:'#444'}}>????????????</Col>
                                <Col style={{width:'200px',float:'left',marginLeft:'15px'}}>
                                    <FormItem>
                                        {getFieldDecorator('loanBasis', {
                                            initialValue:''
                                        })(
                                            <RadioGroup>
                                                <Radio value={1}>?????????</Radio>
                                                <Radio value={0}>??????</Radio>
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
                            <span className="titleWord">????????????</span>
                        </div>
                        <Row className="form_cx">
                        <Row>
                                <Col style={{width:'60px',float:'left',lineHeight:'30px',fontSize:'14px',color:'#444'}}>????????????</Col>
                                <Col style={{width:'200px',float:'left',marginLeft:'15px'}}>
                                    <FormItem>
                                        {getFieldDecorator('realRepayType', {
                                            initialValue:'?????????'
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
                                <Col style={{width:'60px',float:'left',lineHeight:'20px',fontSize:'14px',color:'#444'}}>??????????????????</Col>
                                <Col style={{width:'200px',float:'left',marginLeft:'15px'}}>
                                    <FormItem>
                                        {getFieldDecorator('repayType', {
                                            initialValue:'?????????'
                                        })(
                                            <Select>
                                                <Option value="1">????????????</Option>
                                                <Option value="2">????????????</Option>
                                                <Option value="3">????????????</Option>
                                                <Option value="4">????????????</Option>
                                            </Select>
                                        )}

                                    </FormItem>
                                </Col>
                            </Row>
                        </Row>
                        </div>
                        <div className="card_cx">
                        <Row className="form_cx">
                            <div className="bold">?????????????????????????????????</div>
                            <FormItem label="??????" colon={false} className="color">
                                {getFieldDecorator('interestAdvance', {
                                    initialValue:''
                                })(
                                    <RadioGroup>
                                        <Radio value={1}>??????</Radio>
                                        <Radio value={0}>?????????</Radio>
                                    </RadioGroup>
                                )}

                            </FormItem>
                            <FormItem label="?????????" colon={false} className="color">
                                {getFieldDecorator('serviceFeeAdvance', {
                                    initialValue:''
                                })(
                                    <RadioGroup>
                                        <Radio value={1}>??????</Radio>
                                        <Radio value={0}>?????????</Radio>
                                    </RadioGroup>
                                )}

                            </FormItem>
                            <FormItem label="????????????" colon={false} className="color">
                                {getFieldDecorator('otherFeeAdvance', {
                                    initialValue:''
                                })(
                                    <RadioGroup>
                                        <Radio value={1}>??????</Radio>
                                        <Radio value={0}>?????????</Radio>
                                    </RadioGroup>
                                )}

                            </FormItem>
                        </Row>
                        </div>
                    </Row>
                    <Row style={{height:"50px",background:"#fff",position:"fixed",bottom:"0",right:"0",lineHeight:"50px",textAlign:"center",width:"calc(100% - 170px)",boxShadow:"0px -2px 4px 0px rgba(0,0,0,0.1)"}}>
                        {/* <Button onClick={this.clickReset.bind(this)}>??????</Button> */}
                        <Button onClick={this.clickReset.bind(this)}>??????</Button>
                        <Button type="primary" style={{marginLeft:'30px'}} onClick={this.sure.bind(this)}>??????</Button>
                    </Row>
                </Form>
                <Modal {...modalInfo}><span style={{fontSize:"14px"}}>???????????????????????????</span></Modal>
                <Modal {...leave}>
                    ?????????????????????????????????????????????????????????????????????????????????
                </Modal>
            </div>
        )
    }
}
export default ComponentRoute(Form.create()(Product_cxfq));