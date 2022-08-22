import React, { Component } from 'react';
import {Row,Col,Form,Input,message,Button,DatePicker} from 'antd';
import {bd_detail,bd_endorsement} from '../../../ajax/api';
import {axios_sh} from '../../../ajax/request';
import moment from 'moment';
import { browserHistory } from 'react-router';
const FormItem = Form.Item;
class Tb extends Component{
    constructor(props) {
        super(props);
        this.state = {
            id:props.location.query.id,
            detail:{
                syx:0
            },
            syx:0,
            jqx:0,
            ccs:0,
            total:0,
            requestId:''
        };
        this.idArr=[];
    }
    componentWillMount(){
        this.getDetail();
    }
    componentWillUnmount(){
        clearInterval(this.timer);
    }
    getDetail(){
        axios_sh.get(bd_detail+'?id='+this.state.id).then(e=>{
            this.setState({
                detail:e.data.review
            })
        })
    }
    onOk(){
        if(Number(this.state.syx)>Number(this.state.detail.syx)){
            message.warn("批单金额不得大于商业险原始金额");
            return
        }
        if(this.state.total<=0){
            message.warn("批单金额金额应大于0");
            return
        }
        if(this.state.amountErr){
            message.warn("批单金额最多支持保留两位小数");
            return;
        }
        var value=this.props.form.getFieldsValue();
        var amount=value.amount?value.amount.replace(".",""):0;
        value.date=decodeURI(value.date.format("YYYY-MM-DD HH:MM:SS"));
        axios_sh.get(bd_endorsement+"?amount="+amount+"&date="+value.date+"&remark="+value.remark+"&requestId="+this.state.id).then(e=>{
            if(!e.code){
                browserHistory.push('/bd/indent/cxfq')

            }
        })
    }
    onChange(date, dateString) {
        console.log(date, dateString);
    }
    amount(e){
        this.setState({
            total:Number(e.target.value)
        });
        var syx=this.state.detail?this.state.detail.syx/100:0;
        if(e.target.value>syx){
            this.setState({
                amountExtra:true
            });
        }else{
            this.setState({
                amountExtra:false
            });
        }
    }
    back(){
        browserHistory.push('/bd/indent/cxfq')
    }
    getValue(e){
        //e.target.value=Number(e.target.value).toFixed(2)
        if(e.target.value){

            if(e.target.value.indexOf(".")===-1){
                e.target.value=parseFloat(e.target.value).toFixed(2);
                this.setState({
                    amountErr:false
                })
            }else if(e.target.value.split(".")[1].length<=2){
                e.target.value=parseFloat(e.target.value).toFixed(2);
                this.setState({
                    amountErr:false
                })
            }else if(e.target.value.split(".")[1].length>2){
                this.setState({
                    amountErr:true
                })
            }
            this.props.form.setFieldsValue({amount:e.target.value});
            //this.setState({
            //    ccs:e.target.value
            //});
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formInfo={
            labelCol:{span:8},
            wrapperCol:{span:12},
            colon:false
        };
        return(
            <Row>
                <Row>
                    <div style={{padding:"10px 20px"}}>请据实填写批单信息</div>
                </Row>
                <Row style={{background:"#fff",margin:"0 20px",padding:"10px 0"}}>
                    <Col span={12}>
                        <FormItem label="保单号" {...formInfo} className="paddingRight" >
                            {getFieldDecorator('insurNo', {
                            })(
                                <div style={{fontSize:"14px"}}>{this.state.detail?this.state.detail.insurNo:""}</div>
                            )}

                        </FormItem>
                        <FormItem label="签单日期" {...formInfo} className="paddingRight" >
                            {getFieldDecorator('signDate', {
                            })(
                                <div style={{fontSize:"14px"}}>{this.state.detail?this.state.detail.signDate:""}</div>
                            )}

                        </FormItem>
                        <FormItem label="商业险金额" {...formInfo} className="paddingRight" >
                            {getFieldDecorator('syx', {
                            })(
                                <div style={{fontSize:"14px"}}>{this.state.detail?(this.state.detail.syx/100).toFixed(2):""}</div>
                            )}

                        </FormItem>
                        <FormItem label="批单金额" {...formInfo} className="paddingRight" >
                            {getFieldDecorator('amount', {
                                rules: [{ required: true, message: '请输入批单变化的金额' },{pattern:/^[0-9]{1,6}(\.[0-9]{1,2})?$/,message:"请输入正确批单金额"}],
                            })(
                                <Input placeholder="请输入批单变化的金额" onChange={this.amount.bind(this)} onBlur={this.getValue.bind(this)} />
                            )}
                            {
                                this.state.amountExtra?<span style={{color:"red"}}>批单金额不得大于原保单金额</span>:null
                            }
                        </FormItem>
                        <FormItem label="批单合计" {...formInfo} className="paddingRight" >
                            {getFieldDecorator('total', {
                            })(
                                <div style={{fontSize:"14px"}}>{(this.state.total).toFixed(2)}</div>
                            )}

                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="保险公司" {...formInfo} className="paddingRight" >
                            {getFieldDecorator('insurCompany', {
                            })(
                                <div style={{fontSize:"14px"}}>{this.state.detail?this.state.detail.insurCompany:""}</div>
                            )}

                        </FormItem>
                        <FormItem label="批单日期" {...formInfo} className="paddingRight" >
                            {getFieldDecorator('date', {
                                initialValue:moment(new Date())
                            })(
                                <DatePicker onChange={this.onChange.bind(this)} showToday={false} />
                            )}

                        </FormItem>
                        <FormItem label="批单类型" {...formInfo} className="paddingRight" >
                            {getFieldDecorator('returnJqx', {
                            })(
                                <div style={{fontSize:"14px"}}>批减</div>
                            )}

                        </FormItem>
                        <FormItem label="备注" {...formInfo} className="paddingRight" >
                            {getFieldDecorator('remark', {
                                initialValue:''
                            })(
                                <Input placeholder="请输入备注" />
                            )}

                        </FormItem>
                    </Col>
                </Row>
                <Row style={{textAlign:"center",marginTop:"20px"}}>
                    <Button style={{marginRight:"10px"}} onClick={this.back.bind(this)}>返回</Button>
                    <Button type="primary" onClick={this.onOk.bind(this)}>确认</Button>
                </Row>
            </Row>
        )
    }
}
export default Form.create()(Tb);