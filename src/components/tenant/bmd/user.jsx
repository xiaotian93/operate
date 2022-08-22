import React, { Component } from 'react';
import { Row, Form, Select, Input, Col, Button ,Popconfirm} from 'antd';
// import axios from '../../../../ajax/request.js';
// import api from '../../../../ajax/api.js';
import Tbodys from './tbody';
import {accDiv,accMul} from '../../../ajax/tool';
const FormItem = Form.Item;
const Option = Select.Option;
//const {  RangePicker } = DatePicker;
//let clickNum=1,clickArr=[],refArr=[];
class Insurance extends Component {
    constructor(props) {
        super(props);
        props.onRef(this);
        this.state = {
            serviceFeeType_val:"0",
            vipType_val:"0",
            serviceFeeCollectType_val:"0",
            vipCollectType_val:"0"
        }
        this.arr=[];
    }
    componentWillMount() {
        //clickArr=[];
        //refArr=[]

    }
    componentDidMount() {
        if(this.props.id){
            this.edit();
        }
    }
    edit(){
        if(this.props.edit_data){
            var data=this.props.edit_data.data;
            if(data){
                for(var i in data[0]){
                    this.props.form.setFieldsValue({key:data[0]["key"]});
                    // this.props.form.setFieldsValue({serviceFeeType:data[0]["serviceFeeType"]});
                    if(i==="serviceFeeCollectType"){
                        if(data[0][i]){
                            this.setState({
                                serviceFeeCollectType_val:data[0][i].toString(),
                                serviceFeeType_val:data[0]["serviceFeeType"].toString()
                            })
                            this.props.form.setFieldsValue({[i]:data[0][i].toString()});
                            setTimeout(function(){
                                this.props.form.setFieldsValue({serviceFeeType:data[0]["serviceFeeType"].toString()});
                            }.bind(this),100)
                        }else{
                            this.setState({
                                serviceFeeCollectType_val:"0",
                                serviceFeeType_val:"0"
                            })
                        }
                    }else if(i==="vipCollectType"){
                        if(data[0][i]){
                            this.setState({
                                vipCollectType_val:data[0][i].toString(),
                                vipType_val:data[0]["vipType"].toString()
                            })
                            this.props.form.setFieldsValue({[i]:data[0][i].toString()});
                            setTimeout(function(){
                                this.props.form.setFieldsValue({vipType:data[0]["vipType"].toString()});
                            }.bind(this),100)
                        }else{
                            this.setState({
                                vipCollectType_val:"0",
                                vipType_val:"0"
                            })
                        }
                    }
                }
            }
        }
        
    }
    delete() {
        this.props.del()
    }
    //服务费
    serviceFeeCollectType_change(e){
        this.setState({
            serviceFeeCollectType_val:e 
        })
        if(e==="0"){
            this.setState({
                serviceFeeType_val:e 
            })
        }
    }
    serviceFeeType_change(e){
        this.setState({
            serviceFeeType_val:e 
        })
    }
    //vip
    vipCollectType_change(e){
        this.setState({
            vipCollectType_val:e 
        })
        if(e==="0"){
            this.setState({
                vipType_val:e 
            })
        }
    }
    vipType_change(e){
        this.setState({
            vipType_val:e 
        })
    }
    get_val(e){
        this.arr.push(e);
    }
    sub(){
        var productUserGroupList=[],userBasic={};
        this.props.form.validateFields((err,val)=>{
            if(!err){
                // val.interestRateUnit=this.props.periodUnit;
                userBasic=val;
            }
        })
        for(var i in this.arr){
            if(this.arr[i].state.support==="true"){
                this.form_val(this.arr[i],userBasic,productUserGroupList)
            }
            
        }
        console.log(this.arr)
        console.log(productUserGroupList)
        return productUserGroupList;
    }
    form_val(data,userBasic,productUserGroupList){
        data.props.form.validateFields((err,val)=>{
            if(!err){
                val.interestRate=accDiv(val.interestRate||0,100);
                // val.interestRate=val.interestRate/100;
                if(val.serviceFeePercent){
                    val.serviceFeePercent=accDiv(val.serviceFeePercent||0,100)
                }
                if(val.vipPercent){
                    val.vipPercent=accDiv(val.vipPercent||0,100)
                }
                if(val.serviceFeePrice){
                    val.serviceFeePrice=accMul(val.serviceFeePrice,100)
                }
                if(val.vipPrice){
                    val.vipPrice=accMul(val.vipPrice,100)
                }
                var newJson=Object.assign({},userBasic,val)
                if(newJson.period){
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
        var type={"DAY":"自然日","MONTH":"自然月","YEAR":"年"};
        const confirm={
            title:"确认要删除该用户群？",
            okText:"确定",
            cancelText:"取消",
            onConfirm:this.delete.bind(this),
            placement:"topRight"
        }
        return (
            //<Form className='fqsq'>
            <Row className="modal_box_border" style={{ marginBottom: "15px",borderBottom:"1px solid #F4F6F7" }}>
                <Row id={this.props.id}>
                    <Row style={{ margin: "0 auto 15px auto", padding: "25px 0 0 0" }}>
                        <Row>
                            <Col span={12}>
                                <FormItem label="" {...formInit} wrapperCol={{span:20}}>
                                    {getFieldDecorator('key', {
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
                        <Row>
                            {this.state.vipCollectType_val==="0"?<Col span={11}>
                                <Row>
                                <Col span={3}>
                                    <span style={{fontSize:"14px",color:"rgba(0,0,0,0.5)",lineHeight:"32px"}}>服务费</span>
                                </Col>
                                
                                <Col span={10}>
                                <FormItem label="" {...formInit} wrapperCol={{span:23}}>
                                    {getFieldDecorator('serviceFeeCollectType', {
                                        rules: [{ required: true, message: "请选择" }]
                                    })(
                                        <Select placeholder="请选择收取时机" style={{ width: "100%" }} onChange={this.serviceFeeCollectType_change.bind(this)} disabled={this.state.vipCollectType_val==="0"?false:true}>
                                            <Option value="1">分期收取</Option>
                                            <Option value="2">首期收取</Option>
                                            <Option value="0">不收取</Option>
                                        </Select>
                                    )}
                                </FormItem>
                                </Col>
                                <Col span={10}>
                                {this.state.serviceFeeCollectType_val!=="0"?<FormItem label="" {...formInit} wrapperCol={{span:23}} >
                                    {getFieldDecorator('serviceFeeType', {
                                        rules: [{ required: true, message: "请选择" }]
                                    })(
                                        <Select placeholder="请选择收取基数" style={{ width: "100%" }} onChange={this.serviceFeeType_change.bind(this)}>
                                            <Option value="2">借款金额百分比/期</Option>
                                            <Option value="1">固定金额/期</Option>
                                        </Select>
                                    )}
                                </FormItem>:null}
                                
                                </Col>
                                </Row>
                                
                            </Col>:null}
                            {this.state.serviceFeeCollectType_val==="0"?<Col span={11} push={this.state.serviceFeeCollectType_val==="0"?0:2}>
                                <Row>
                                <Col span={3}>
                                    <span style={{fontSize:"14px",color:"rgba(0,0,0,0.5)",lineHeight:"32px"}}>会员费</span>
                                </Col>

                                <Col span={10}>
                                <FormItem label="" {...formInit} wrapperCol={{span:23}} >
                                    {getFieldDecorator('vipCollectType', {
                                        rules: [{ required: true, message: "请选择" }]
                                    })(
                                        <Select placeholder="请选择收取时机" style={{ width: "100%" }} onChange={this.vipCollectType_change.bind(this)} disabled={this.state.serviceFeeCollectType_val==="0"?false:true}>
                                            {/* <Option value="1">待选择</Option> */}
                                            <Option value="1">贷前收取</Option>
                                            <Option value="2">贷后收取</Option>
                                            <Option value="0">不收取</Option>
                                        </Select>
                                    )}
                                </FormItem>
                                </Col>
                                <Col span={10}>
                                {this.state.vipCollectType_val!=="0"?<FormItem label="" {...formInit} wrapperCol={{span:23}} >
                                    {getFieldDecorator('vipType', {
                                        rules: [{ required: true, message: "请选择" }]
                                    })(
                                        <Select placeholder="请选择收取基数" style={{ width: "100%" }} onChange={this.vipType_change.bind(this)}>
                                            {/* <Option value="1">待选择</Option> */}
                                            <Option value="2">借款金额百分比</Option>
                                            <Option value="1">固定金额</Option>
                                        </Select>
                                    )}
                                </FormItem>:null}
                                </Col>
                                </Row>
                                
                                
                            </Col>:null}
                        </Row>
                        <table className="sh_product_table" cellSpacing="0" cellPadding="0">
                            <thead>
                                <tr style={{ border: "1px solid red" }}>
                                    <th>期数</th>
                                    <th>是否支持</th>
                                    <th>利息({type[this.props.periodUnit]})</th>
                                    <th>服务费</th>
                                    <th>会员费</th>

                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.props.tag.length>0?this.props.tag.map((i,k)=>{
                                        if(this.props.edit_data){
                                            var data=this.props.edit_data.data,rowData={};
                                            for(var j in data){
                                                if(Number(data[j]["period"])===Number(i)){
                                                    rowData=data[j]
                                                }
                                            }
                                        }
                                        return <Tbodys key={k} num={i} serve={this.state.serviceFeeType_val} vip={this.state.vipType_val} onRef={this.get_val.bind(this)} edit_data={this.props.edit_data?rowData:{}} support={this.props.support} id={this.props.id} />
                                    }):<tr style={{textAlign:"center",color:"rgba(0,0,0,0.43)",fontSize:"12px"}}><td colSpan={5} style={{padding:"16px 8px"}}>暂无数据</td></tr>
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