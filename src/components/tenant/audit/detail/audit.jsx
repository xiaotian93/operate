import React, { Component } from 'react';
import { Radio,Input,Button,message ,Form,Checkbox,Select,Col} from 'antd';
import { browserHistory } from 'react-router';
import { axios_merchant } from '../../../../ajax/request';
import { merchant_audit_handle } from '../../../../ajax/api';

var RadioGroup=Radio.Group;
var {TextArea}=Input;
const FormItem = Form.Item;

class Auditingview extends Component{
    constructor(props) {
        super(props);
        this.state={
            radioValue:"",
            inputValue:"",
            xyd:false,
            cxfq:false
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
        if(e.target.value.length>80){
            message.warn("审核意见已超出80字");
            return;
        }
        this.setState({
            inputValue:e.target.value,
        })
    }
    onSubmit(){
        var data={};
        if(this.state.inputValue.length>80){
            message.warn("审核意见已超出80字");
            return;
        }
        if(!this.state.radioValue){
            message.warn("请选择审核结果");
            return;
        }
        if(this.state.radioValue==='3'&&!this.state.inputValue){
            message.warn("驳回意见不能为空");
            return;
        }
        data={
            auditId:this.props.auditId,
            status:this.state.radioValue,
            opinion:this.state.inputValue
        }
        axios_merchant.post(merchant_audit_handle,data).then((e)=>{
            if(!e.code){
                message.success("审核成功");
                browserHistory.push("/sh/audit");

            }
            
        });
    };
    xyd_change(e){
        this.setState({
            xyd:e.target.checked
        })
    }
    cxfq_change(e){
        this.setState({
            cxfq:e.target.checked
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formInfo={
            // labelCol:{span:3},
            // wrapperCol:{span:9},
            colon:false
        };
        return (
            <div>
                {/* <div className="title">
                    <div className="icon" />
                    <span className="titleWord">审核意见</span>
                </div> */}
                <div className="sh_add_card">
                <div className="sh_add_title">审核操作</div>
                <div>
                <span style={{fontSize:"14px",color:"rgba(0,0,0,0.5)",marginRight:"10px"}}>审核结果</span>
                
                <span style={{width:"90%",display:"inline-block"}}>
                <FormItem label="" {...formInfo} >
                        {getFieldDecorator('name4', {
                        })(
                            <RadioGroup onChange={this.radioChange.bind(this)} >
                        <Radio value="2">同意</Radio>
                        <Radio value="3">驳回</Radio>
                    </RadioGroup>
                        )
                        
                        }
                    </FormItem>
                </span>
                </div>
                <div>
                <div style={{fontSize:"14px",color:"rgba(0,0,0,0.5)",marginRight:"10px",float:"left"}}>审核意见</div>
                <span style={{width:"90%",display:"inline-block"}}>
                    <FormItem label="" wrapperCol={{span:19}} colon={false} >
                        {getFieldDecorator('name3', {
                        })(
                            <TextArea onChange={this.inputChange.bind(this)} className="" maxLength="80" placeholder="审核意见最多80字" />
                        )
                        
                        }
                        <div style={{textAlign:"right"}}>{this.state.inputValue.length}/80</div>
                    </FormItem>
                </span>
                </div>
                    {this.state.radioValue==="pass"?<div style={{background:"#F7F7F7",padding:"20px 20px 5px 20px",overflow:"hidden"}}>
                        <FormItem label="业务类型及归属渠道" {...formInfo} >
                        {getFieldDecorator('name2', {
                        })(
                            <div>
                                <Checkbox checked={this.state.xyd} onChange={this.xyd_change.bind(this)}>信用贷</Checkbox>
                            </div>
                            
                        )
                        }
                        {this.state.xyd?<Select style={{position:"absolute",left:"30%",top:"0"}} placeholder="请选择对应渠道" />:null}
                    </FormItem>
                    <Col push={5} span={24}>
                    <FormItem label="" {...formInfo} >
                        {getFieldDecorator('name1', {
                        })(
                            <div>
                                <Checkbox checked={this.state.cxfq} onChange={this.cxfq_change.bind(this)}>车险分期</Checkbox>
                            </div>
                            
                        )
                        }
                        {this.state.cxfq?<Select style={{position:"absolute",left:"30%",top:"0"}} placeholder="请选择对应渠道" />:null}
                    </FormItem>
                    </Col>
                    
                        </div>:null}
                        <Button type="primary" onClick={this.onSubmit.bind(this)}>提交</Button>
                </div>
            </div>
        )
    }
}
export default Form.create()(Auditingview)
