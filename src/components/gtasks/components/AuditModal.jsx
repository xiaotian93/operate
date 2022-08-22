import React, { Component } from 'react';
import { Button, Modal, Input } from 'antd';
// import moment from 'moment'


class BMD extends Component{
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            auditNos:false
        };
    }

    componentWillReceiveProps(props){
        this.setState({
            visible:Boolean(props.auditNos),
            auditNos:props.auditNos||"",
            auditType:props.auditType
        })
    }

    textChange(e){
        this.setState({
            msg:e.target.value||""
        })
    }
    clickBtn(){
        this.props.bindaudit({
            msg:this.state.msg,
            audit:this.state.auditType,
            auditNos:this.props.auditNos.join(",")
        })
    }
    cancelModal(){
        this.setState({
            visible:false
        })
    }
    render (){
        let footer = [
            <Button key="pass" type="primary" onClick={()=>{this.clickBtn(true)}}>确定</Button>,
            <Button key="back" type="danger" onClick={this.cancelModal.bind(this)}>取消</Button>
        ]
        const modalProps = {
            // title:`确定所选${this.state.auditNos}订单${this.state.auditType?"通过":"驳回"}`,
            title:`确定所选${this.state.auditNos.length<=1?"":(this.state.auditNos.length+"条")}订单${this.state.auditType?"通过":"驳回"}`,
            visible:this.state.visible,
            footer:footer,
            onCancel:this.cancelModal.bind(this)
        }
        return(
            <Modal {...modalProps}>
                <Input placeholder="请输入审核意见" onChange={this.textChange.bind(this)} />
            </Modal>
        )
    }
}

export default BMD;
