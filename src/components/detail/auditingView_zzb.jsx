import React, { Component } from 'react';
import { Radio,Input,Button,message } from 'antd';
import axios from '../../ajax/request';
var RadioGroup=Radio.Group;
var {TextArea}=Input;
class Auditingview extends Component{
    constructor(props) {
        super(props);
        this.state={
            radioValue:"",
            inputValue:""
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
    onSubmit(){
        var data={};
        if(this.state.inputValue.length>500){
            alert("审核意见已超出500字");
            return;
        }
        if(this.state.radioValue!=="true"&&this.state.radioValue!=="false"){
            alert("请选择审核意见类型");
            return;
        }
        if(this.state.radioValue==='false'&&!this.state.inputValue){
            message.warn("驳回意见不能为空");
            return;
        }
        data.taskId=this.props.id;
        data.comment=this.state.inputValue;
        data.approved=this.state.radioValue;
        axios.post("/api/zhizunbao/task/approve",data).then((e)=>{
            message.success(e.msg);
            window.history.back(-1);
        });
    };

    render() {
        return (
            <div>
                <div className="title">
                    <div className="icon" />
                    <span className="titleWord">审核意见</span>
                </div>
                <div className="content">
                    <RadioGroup onChange={this.radioChange.bind(this)} value={this.state.radioValue} style={{"marginTop":"20px"}}>
                        <Radio value={"true"}>同意</Radio>
                        <Radio value={"false"}>驳回</Radio>
                    </RadioGroup>
                    <TextArea onChange={this.inputChange.bind(this)} className="view" value={this.state.inputValue} />
                    <Button type="primary" onClick={this.onSubmit.bind(this)}>提交</Button>
                </div>
            </div>
        )
    }
}
export default Auditingview
