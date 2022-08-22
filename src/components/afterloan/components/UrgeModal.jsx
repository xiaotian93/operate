import React, { Component } from 'react';
import { Button, Modal , Form , Input , DatePicker , message,Row,Col,Select } from 'antd';
import moment from 'moment'

import { axios_postloan } from '../../../ajax/request';
import { afterloan_overdue_insert_collection } from '../../../ajax/api';
// import { format_date } from '../../../ajax/tool';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
class UrgeModal extends Component{
    constructor(props) {
        super(props);
        this.state = {
            visible:false,
            userId :"",
            time:moment().format("YYYY-MM-DD HH:mm:ss")
        };
        this.today = moment()
    }

    componentWillReceiveProps(props){
        this.setState({
            visible:props.visible,
            userId:props.userId
        })
    }
    
    // 显示催记弹窗
    insertUrge(e){
        this.props.form.validateFields((err,val)=>{
            if(!err){
                val.contractNo=this.props.contractNo;
                // val.remindTime=val.remindTime.format("YYYY-MM-DD hh:mm:ss");
                val.remindTime=this.state.time;
                val.promiseRepayTime=val.promiseRepayTime?val.promiseRepayTime.format("YYYY-MM-DD HH:mm:ss"):"";
                val.overdueReason=val.overdueReason||"";
                console.log(val);
                // return;
                axios_postloan.post(afterloan_overdue_insert_collection,val).then(res=>{
                    message.success(res.msg);
                    this.setState({
                        modalVisible:false
                    })
                    this.cancelModal();
                    // this.props.gelist?this.props.gelist():null;
                    if(this.props.gelist){
                        this.props.gelist()
                    }
                })
            }
        })
    }

    // 关闭弹窗
    cancelModal(){
        this.setState({
            visible:false
        })
        this.props.bindcancel();
        this.props.form.resetFields()
    }
    disableDate(current){
        return current&&current<moment().startOf("day");
    }
    render (){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            }
        };
        const modalProps = {
            title:"添加催记",
            visible:this.state.visible,
            onCancel:this.cancelModal.bind(this),
            footer:false,
            maskClosable:false,
            colon:false
        }
        return(
            <Modal {...modalProps}>
                <Form>
                    <Row style={{marginBottom:"24px"}}>
                        <Col span={6} style={{textAlign:"right",paddingRight:"8px",color:"rgba(0,0,0,0.5)"}}>记录时间:</Col>
                        <Col span={14}>{this.state.time}</Col>
                    </Row>
                    {/* <FormItem {...formItemLayout} label="跟催时间">
                        {getFieldDecorator('remindTime', {
                            // initialValue:this.today,
                            rules: [{ required: true, message: '请选择日期' }],
                        })(
                            <DatePicker disabledDate={this.disableDate.bind(this)} />
                        )}
                    </FormItem> */}
                    <FormItem {...formItemLayout} label="催收状态">
                        {getFieldDecorator('result', {
                            // initialValue:this.today,
                            rules: [{ required: true, message: '请选择催收状态' }],
                        })(
                            <Select placeholder="请选择">
                                <Option value="无人接听">无人接听</Option>
                                <Option value="跳票">跳票</Option>
                                <Option value="承诺还款">承诺还款</Option>
                                <Option value="第三人代缴">第三人代缴</Option>
                                <Option value="无诚意">无诚意</Option>
                                <Option value="电话设置">电话设置</Option>
                                <Option value="转告">转告</Option>
                                <Option value="不认识本人">不认识本人</Option>
                                <Option value="不配合">不配合</Option>
                                <Option value="关机">关机</Option>
                                <Option value="停机">停机</Option>
                                <Option value="空号">空号</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="承诺还款时间(选填)">
                        {getFieldDecorator('promiseRepayTime', {
                            // initialValue:this.today,
                            // rules: [{ required: true, message: '请选择日期' }],
                        })(
                            <DatePicker disabledDate={this.disableDate.bind(this)} />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="逾期原因(选填)">
                        {getFieldDecorator('overdueReason',{
                            // initialValue:""
                        })(
                            <Select placeholder="请选择">
                                <Option value="经济困难">经济困难</Option>
                                <Option value="中介办理">中介办理</Option>
                                <Option value="忘记还款">忘记还款</Option>
                                <Option value="名义借贷">名义借贷</Option>
                                <Option value="卡片原因">卡片原因</Option>
                                <Option value="还款原因">还款原因</Option>
                                <Option value="交通原因">交通原因</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="备注(选填)">
                        {getFieldDecorator('remark',{
                            initialValue:""
                        })(
                            <TextArea rows={4} placeholder="请输入" />
                        )}
                    </FormItem>
                    <FormItem wrapperCol = {{span:"4",offset:"10"}}>
                        <Button type="primary" onClick={this.insertUrge.bind(this)}>确定</Button>
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

export default Form.create()(UrgeModal);
