import React, { Component } from 'react';
import {Row,Col,Form,Input,message,Button} from 'antd';
import {bd_detail,bd_return,bd_return_get} from '../../../../ajax/api';
import {axios_sh} from '../../../../ajax/request';
import { browserHistory } from 'react-router';
const FormItem = Form.Item;
class Tb extends Component{
    constructor(props) {
        super(props);
        this.state = {
            id:props.location.query.id,
            detail:{},
            syx:0,
            jqx:0,
            ccs:0,
            total:0,
            requestId:'',
            syxErr:false
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
    getValue(e){
        e.target.value=Number(e.target.value).toFixed(2)
    }
    changeSyx(e){
        if(e.target.value){

            if(e.target.value.indexOf(".")===-1){
                e.target.value=parseFloat(e.target.value).toFixed(2);
                this.setState({
                    syxErr:false
                })
            }else if(e.target.value.split(".")[1].length<=2){
                e.target.value=parseFloat(e.target.value).toFixed(2);
                this.setState({
                    syxErr:false
                })
            }else if(e.target.value.split(".")[1].length>2){
                this.setState({
                    syxErr:true
                })
            }
            this.props.form.setFieldsValue({returnSyx:e.target.value});
            this.setState({
                syx:e.target.value
            });
        }
    }
    changeJqx(e){
        if(e.target.value){

            if(e.target.value.indexOf(".")===-1){
                e.target.value=parseFloat(e.target.value).toFixed(2);
                this.setState({
                    jqxErr:false
                })
            }else if(e.target.value.split(".")[1].length<=2){
                e.target.value=parseFloat(e.target.value).toFixed(2);
                this.setState({
                    jqxErr:false
                })
            }else if(e.target.value.split(".")[1].length>2){
                this.setState({
                    jqxErr:true
                })
            }
            this.props.form.setFieldsValue({returnJqx:e.target.value});
            this.setState({
                jqx:e.target.value
            });
        }
    }
    changeCcs(e){
        if(e.target.value){

            if(e.target.value.indexOf(".")===-1){
                e.target.value=parseFloat(e.target.value).toFixed(2);
                this.setState({
                    ccsErr:false
                })
            }else if(e.target.value.split(".")[1].length<=2){
                e.target.value=parseFloat(e.target.value).toFixed(2);
                this.setState({
                    ccsErr:false
                })
            }else if(e.target.value.split(".")[1].length>2){
                this.setState({
                    ccsErr:true
                })
            }
            this.props.form.setFieldsValue({returnCcs:e.target.value});
            this.setState({
                ccs:e.target.value
            });
        }
    }
    getSyx(e){


        this.setState({
            syx:e.target.value
        });
        var total=Number(e.target.value)+Number(this.state.jqx)+Number(this.state.ccs);
        this.setState({
            total:total
        });
        var syx=this.state.detail?this.state.detail.syx/100:0;
        if(e.target.value>syx){
            this.setState({
                syxExtra:true
            });
        }else{
            this.setState({
                syxExtra:false
            });
        }
    }
    getJqx(e){
        this.setState({
            jqx:e.target.value
        });
        var total=Number(this.state.syx)+Number(e.target.value)+Number(this.state.ccs);
        this.setState({
            total:total
        });
        var jqx=this.state.detail?this.state.detail.jqx/100:0;
        if(e.target.value>jqx){
            this.setState({
                jqxExtra:true
            });
        }else{
            this.setState({
                jqxExtra:false
            });
        }
    }
    getCcs(e){
        this.setState({
            ccs:e.target.value
        });
        var total=Number(this.state.syx)+Number(this.state.jqx)+Number(e.target.value);
        this.setState({
            total:total
        });
        var ccs=this.state.detail?this.state.detail.ccs/100:0;
        if(e.target.value>ccs){
            this.setState({
                ccsExtra:true
            });
        }else{
            this.setState({
                ccsExtra:false
            });
        }
    }
    onOk(){
        //this.props.form.validateFields((err,value)=>{
        //    if(!err){
                if(Number(this.state.syx)>Number(this.state.detail.syx)){
                    message.warn("??????????????????????????????????????????????????????");
                    return
                }
                if(Number(this.state.jqx)>Number(this.state.detail.jqx)){
                    message.warn("??????????????????????????????????????????????????????");
                    return
                }
                if(Number(this.state.ccs)>Number(this.state.detail.ccs)){
                    message.warn("??????????????????????????????????????????????????????");
                    return
                }
                if(this.state.total<=0){
                    message.warn("???????????????????????????0");
                    return
                }
        if(this.state.syxErr){
            message.warn("?????????????????????????????????????????????");
            return;
        }
        if(this.state.jqxErr){
            message.warn("?????????????????????????????????????????????");
            return;
        }
        if(this.state.ccsErr){
            message.warn("?????????????????????????????????????????????");
            return;
        }
                var value=this.props.form.getFieldsValue();
                var returnSyx=value.returnSyx?value.returnSyx.replace(".",""):0;
                var returnJqx=value.returnJqx?value.returnJqx.replace(".",""):0;
                var returnCcs=value.returnCcs?value.returnCcs.replace(".",""):0;
                console.log(returnSyx,returnJqx,returnCcs)
                axios_sh.get(bd_return+"?returnSyx="+returnSyx+"&returnJqx="+returnJqx+"&returnCcs="+returnCcs+"&remark="+value.remark+"&requestId="+this.state.id).then(e=>{
                    if(!e.code){
                        browserHistory.push('/bd/indent/cxfq');
                    }
                })
            //}
        //})

    }
    getReturnstatus(){
        axios_sh.get(bd_return_get+'?id='+this.state.requestId).then(e=>{
            if(!e.code){
                if(e.data.accountingStatus){
                    alert(1)
                    clearInterval(this.timer);
                }

            }
        })
    }
    back(){
        browserHistory.push('/bd/indent/cxfq');
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
                    <div style={{padding:"10px 20px"}}>???????????????????????????</div>
                </Row>
                <Row style={{background:"#fff",margin:"0 20px",padding:"10px 0"}}>
                    <Col span={12}>
                        <FormItem label="?????????" {...formInfo} className="paddingRight" >
                            {getFieldDecorator('insurNo', {
                            })(
                                <div style={{fontSize:"14px"}}>{this.state.detail?this.state.detail.insurNo:""}</div>
                            )}

                        </FormItem>
                        <FormItem label="???????????????" {...formInfo} className="paddingRight" >
                            {getFieldDecorator('syx', {
                            })(
                                <div style={{fontSize:"14px"}}>{this.state.detail?(this.state.detail.syx/100).toFixed(2):""}</div>
                            )}

                        </FormItem>
                        <FormItem label="???????????????" {...formInfo} className="paddingRight" >
                            {getFieldDecorator('jqx', {
                            })(
                                <div style={{fontSize:"14px"}}>{this.state.detail?(this.state.detail.jqx/100).toFixed(2):""}</div>
                            )}

                        </FormItem>
                        <FormItem label="???????????????" {...formInfo} className="paddingRight" >
                            {getFieldDecorator('ccs', {
                            })(
                                <div style={{fontSize:"14px"}}>{this.state.detail?(this.state.detail.ccs/100).toFixed(2):""}</div>
                            )}

                        </FormItem>
                        <FormItem label="??????" {...formInfo} className="paddingRight" >
                            {getFieldDecorator('remark', {
                                initialValue:''
                            })(
                                <Input placeholder="???????????????" />
                            )}

                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="????????????" {...formInfo} className="paddingRight" >
                            {getFieldDecorator('insurCompany', {
                            })(
                                <div style={{fontSize:"14px"}}>{this.state.detail?this.state.detail.insurCompany:""}</div>
                            )}

                        </FormItem>
                        <FormItem label="?????????????????????" {...formInfo} className="paddingRight">
                            {getFieldDecorator('returnSyx', {
                                rules: [{ required: true, message: '??????????????????????????????' },{pattern:/^[0-9]{1,6}(\.[0-9]{1,2})?$/,message:"???????????????????????????"}],
                            })(
                                <Input placeholder="??????????????????????????????" onChange={this.getSyx.bind(this)} disabled={this.state.detail.syx?false:true} onBlur={this.changeSyx.bind(this)} />
                            )}
                            {
                                this.state.syxExtra?<span style={{color:"red"}}>???????????????????????????????????????</span>:null
                            }

                        </FormItem>
                        <FormItem label="?????????????????????" {...formInfo} className="paddingRight" >
                            {getFieldDecorator('returnJqx', {
                                rules: [{ required: true, message: '??????????????????????????????' },{pattern:/^[0-9]{1,6}(\.[0-9]{1,2})?$/,message:"???????????????????????????"}],
                            })(
                                <Input placeholder="??????????????????????????????" onChange={this.getJqx.bind(this)} disabled={this.state.detail.syx?true:false} onBlur={this.changeJqx.bind(this)} />
                            )}
                            {
                                this.state.jqxExtra?<span style={{color:"red"}}>???????????????????????????????????????</span>:null
                            }
                        </FormItem>
                        <FormItem label="?????????????????????" {...formInfo} className="paddingRight" >
                            {getFieldDecorator('returnCcs', {
                                rules: [{ required: true, message: '??????????????????????????????' },{pattern:/^[0-9]{1,6}(\.[0-9]{1,2})?$/,message:"???????????????????????????"}],
                            })(
                                <Input placeholder="??????????????????????????????" onChange={this.getCcs.bind(this)} disabled={this.state.detail.syx?true:false} onBlur={this.changeCcs.bind(this)} />
                            )}
                            {
                                this.state.ccsExtra?<span style={{color:"red"}}>???????????????????????????????????????</span>:null
                            }
                        </FormItem>
                        <FormItem label="??????????????????" {...formInfo} className="paddingRight" >
                            {getFieldDecorator('total', {
                                initialValue:this.state.total
                            })(
                                <div>{(this.state.total).toFixed(2)}</div>
                            )}

                        </FormItem>
                    </Col>
                </Row>
                <Row style={{textAlign:"center",marginTop:"20px"}}>
                    <Button style={{marginRight:"10px"}} onClick={this.back.bind(this)}>??????</Button>
                    <Button type="primary" onClick={this.onOk.bind(this)}>??????</Button>
                </Row>
            </Row>
        )
    }
}
export default Form.create()(Tb);