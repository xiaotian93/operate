import React, { Component } from 'react';
import { Radio,Input,Button,message } from 'antd';


var RadioGroup=Radio.Group;
var {TextArea}=Input;
class Audit extends Component{
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
        if(this.state.inputValue.length>500){
            message.warn("审核意见已超出500字");
            return;
        }
        if(!this.state.radioValue){
            message.warn("请选择审核意见类型");
            return;
        }
        var data={
            type:this.state.radioValue,
            comment:this.state.inputValue
        };
        this.props['bindsubmit'](data);
    };

    render() {
        return (
            <div style={{marginTop:"30px"}}>
                <RadioGroup onChange={this.radioChange.bind(this)} value={this.state.radioValue}>
                    <Radio value={"pass"}>同意</Radio>
                    <Radio value={"nopass"}>驳回</Radio>
                </RadioGroup>
                <TextArea onChange={this.inputChange.bind(this)} className="view" value={this.state.inputValue} />
                <Button type="primary" onClick={this.onSubmit.bind(this)}>提交</Button>
            </div>
        )
    }
}
export default Audit
