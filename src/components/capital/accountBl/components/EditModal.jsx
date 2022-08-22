import React, { Component } from 'react';
import { subjectMap } from './map';
import { Row ,Button, Modal , Col , Form, Input, Select} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class EditModal extends Component{
    submit(e){
        let data = this.props.form.getFieldsValue();
        data.accountId = this.props.info.accountId;
        this.props.bindsubmit(data);
        this.props.form.resetFields();
    }
    cancel(e){
        this.props.bindcancel();
        this.props.form.resetFields();
    }
    render(){
        let { getFieldDecorator } = this.props.form;
        const modalProps = {
            visible:this.props.visible,
            title:"编辑账户",
            footer:[<Button key="sure" type="primary" onClick={this.submit.bind(this)}>确定</Button>],
            onCancel:this.cancel.bind(this)
        }
        const formItemLayout = {
            style:{
                marginBottom:"12px"
            },
            labelCol: {
              xs: { span: 24 },
              sm: { span: 6 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 14 },
            },
          };
          let { info } = this.props;
        return(            
        <Modal {...modalProps}>
            <Row>
                <Col>
                    <FormItem {...formItemLayout} label="内部账户编号">{this.props.info.innerName}</FormItem>
                    <FormItem {...formItemLayout} label="商户号">{this.props.info.merchantId}</FormItem>
                    <FormItem {...formItemLayout} label="账户主体">{subjectMap(info.subject).short}</FormItem>
                    <FormItem {...formItemLayout} label="用途">
                        {getFieldDecorator('usage',{initialValue:this.props.info.usage,rules:[{require:true}]})(<Input placeholder="用户哪个业务" />)}
                    </FormItem>
                    <FormItem {...formItemLayout} label="账户类型">
                        {getFieldDecorator('shareStatus',{initialValue:this.props.info.shareStatus?(this.props.info.shareStatus+""):undefined,rules:[{require:true}]})(<Select style={{width:"100%"}} placeholder="请选择账户类型">
                            <Option value="1">自有账户</Option>
                            <Option value="2">共管账户</Option>
                            <Option value="0">待定账户</Option>
                        </Select>)}
                    </FormItem>
                </Col>
            </Row>
        </Modal>
    );      
    }
}

export default Form.create()(EditModal);