import React, { Component } from 'react';
import {Form,Input,Select,DatePicker,Radio, Button} from 'antd';
import moment from "moment";
import {accMul,accDiv} from '../../../../../ajax/tool';
const FormItem = Form.Item;
const Option=Select.Option;
const { TextArea } = Input;
class FormInfo extends Component{
    constructor(props){
        super(props);
        this.state={
            count:props.count||false,
            value:props.defalut
        }
    }
    componentDidMount(){
    }
    componentWillReceiveProps(props){
        this.setState({value:props.defalut});
    }
    getValue(e){
        // var value=this.props.form.getFieldValue(this.props.param);
        if(this.props.type==="date"){
            e=e.format("YYYY-MM-DD 00:00:00");
        }else if(this.props.type==="input"||this.props.type==="textArea"||this.props.type==="radio"){
            e=e.target.value
            if(this.props.type==="radio"&&e==="2"){
                this.setState({
                    count:true
                })
            }else{
                this.setState({
                    count:false
                })
            }
            if(this.props.type==="input"&&(this.props.param.indexOf("Fee")!==-1||this.props.param.indexOf("Limit")!==-1)){
                e=accMul(e,100)
                if(this.props.param==="authenticateFee"){
                    console.log(e)
                }
            }
        }
        this.props.getValue(this.props.param,e)
    }
    add(){
        this.props.add()
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        let type=this.props.type,child="";
        var value=(this.state.value===""||this.state.value===null)?"":this.state.value;
        if((this.props.type==="input"||this.props.type==="text")&&(this.props.param.indexOf("Fee")!==-1||this.props.param.indexOf("Limit")!==-1)&&value&&this.props.param.indexOf("FeeType")===-1){
            value=accDiv(value,100);
        }else if(this.props.param==="openingDate"&&this.props.type==="date"){
            value=value?moment(value):moment();
        }else if(this.props.param==="shareStatus"&&this.props.type==="select"){
            value=value?(value+""):"";
        }
        switch(type){
            case "text":
                child=<div style={{whiteSpace:"pre-wrap"}}>{(value!=="")?(value+(this.props.unitText||"")):"--"}</div>
                break;
            case "input":
                child=<Input onChange={this.getValue.bind(this)} placeholder={"请输入"+this.props.label} />
                break;
            case "textArea":
                child=<TextArea onChange={this.getValue.bind(this)} placeholder={"请输入"+this.props.label} />
                break;
            case "select":
                child=<Select onChange={this.getValue.bind(this)} placeholder={"请选择"+this.props.label} >
                    {this.props.value.map((i,k)=>{
                        return <Option value={i.val} key={k}>{i.name}</Option>
                    })}
                </Select>;
                break
            case "date":
                child=<DatePicker onChange={this.getValue.bind(this)} />
                break
            case "radio":
                child=<Radio.Group onChange={this.getValue.bind(this)}>
                    {this.props.value.map((i,k)=>{
                        return <Radio value={i.val} key={k}>{i.name}</Radio>
                    })}
                </Radio.Group>
                break
            default:
                child=<div />
            }
        return <div>
            <FormItem label={<span style={{ width: "100%" }}>{this.props.label}</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 8 }} colon={false}>
        {getFieldDecorator(this.props.param, {
            initialValue: value,
            rules:this.props.rules||[]
        })(
            child
        )}
        {(this.state.count||value==="2")&&this.props.type==="radio"?<Button type="primary" size="small" onClick={this.add.bind(this)}>添加区间</Button>:null} 
        {this.props.unit?<div className="formText" style={{ width: "200px" }} >{this.props.unit}</div>:null}
    </FormItem>
        <style>{`
        .ant-select-selection__placeholder{
            color:#bfbfbf!important
        }
        `}</style>    
        </div>
    }
}
export default Form.create()(FormInfo);