import React, { Component } from 'react';
import { Radio,Input,Button,message } from 'antd';
import { bmd } from '../../../ajax/tool';
// import Permissions from '../../../templates/Permissions';



var RadioGroup=Radio.Group;
var {TextArea}=Input;
class Audit extends Component{
    constructor(props) {
        super(props);
        this.state={
            radioValue:"",
            inputValue:"",
            amount:(this.props.creditLimit/100).toLocaleString()||0
        }
    }
    componentWillMount() {
        this.setState({
            radioValue:this.props.view
        })
    }
    radioChange(e) {
        this.setState({
            radioValue:e.target.value
        })
    }
    inputChange(e) {
        this.setState({
            inputValue:e.target.value
        })
    }
    amountChange(e){
        let num = e.target.value;
        num = isNaN(num)?this.state.amount:num;
        this.setState({
            amount:num
        })
    }
    onSubmit(){
        if(this.state.inputValue.length>500){
            message.warn("审核意见已超出500字");
            return;
        }
        if(!this.state.radioValue){
            message.warn("请选择审核意见类型");
            return;
        }
        if(!this.state.amount&&this.state.radioValue==='pass'){
            message.warn("请输入评估额度");
            return;
        }
        let maxAmount = (this.props.maxAmount/100);
        let minAmount = (this.props.minAmount/100);
        if((Number(this.state.amount)<Number(minAmount)||Number(this.state.amount)>Number(maxAmount))&&this.state.radioValue==='pass'){
            message.warn("评估额度需在可配额度范围内");
            return;
        }
        var data={
            type:this.state.radioValue,
            comment:this.state.inputValue||""
        };
        if(this.state.radioValue==='pass'){
            data.loanAmount = bmd.remoney(this.state.amount);
        }
        this.props['bindsubmit'](data);
    };
    render() {
        const style = {
            input:{
                margin:"25px 0px 0px 0px"
            },
            textarea:{
                margin:"10px 0px 18px 0px"
            }
        }
        let maxAmount = (this.props.maxAmount/100).toLocaleString();
        let minAmount = (this.props.minAmount/100).toLocaleString();
        let creditLimit = (this.props.creditLimit/100).toLocaleString()||0;
        return (
            <div style={{marginTop:"30px"}}>
                <RadioGroup onChange={this.radioChange.bind(this)} value={this.state.radioValue}>
                    <Radio value={"pass"}>同意</Radio>
                    <Radio value={"nopass"}>驳回</Radio>
                </RadioGroup>
                { this.state.radioValue==='pass'? 
                    <div style={{marginTop:"10px"}}><span style={{lineHeight:"28px"}}>评估额度为：</span>
                    <Input value={this.state.amount} onChange={this.amountChange.bind(this)} style={{width:"30%"}} placeholder="请输入评估额度" addonAfter={creditLimit?`可配额度${minAmount}元-${maxAmount}元`:`可配额度${minAmount}元-${maxAmount}元`} /></div>:"" }
                <TextArea onChange={this.inputChange.bind(this)} style={style.textarea} placeholder="请输入审核意见" />
                <Button type="primary" onClick={this.onSubmit.bind(this)}>提交</Button>
                {/* <Permissions permissions={"creditAudit"} server={global.AUTHSERVER.bmdCashLoan.key}>确定</Permissions> */}
            </div>
        )
    }
}
export default Audit
