import React , { Component } from 'react';
import { Col , Form , Button , Input , message } from 'antd';

import { axios_fdd } from '../../ajax/request';
import { create_account } from '../../ajax/api';

const FormItem = Form.Item;

// BMD_FDD_2018062015443695365696

class Indent extends Component {
    constructor(props){
        super(props);
        this.state = {
            
        }
    }
    componentWillMount () {
    }
    componentDidMount () {
        
    }
    // 提交表单
    submit(e){
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(err){
                return ;
            }
            this.create(values);
        })
    }
    create(values){
        axios_fdd.post(create_account,values).then(data=>{
            message.success(data.data.msg);
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const form_layout = {
            labelCol: { span: 0 },
            wrapperCol: { span: 24 }
        }
        const item_layout_left = {
            span:6,
            offset:9
        }
       

        return (
            <Form onSubmit={this.submit.bind(this)} style={{width:"100%"}}>
                <Col {...item_layout_left} style={{marginTop:50+"px"}}>
                    <div className="form-label-fdd">账号</div>
                    <FormItem {...form_layout}>
                        {getFieldDecorator("login",{
                            rules:[{required: true, message: '请输入账号'},{pattern:/^[0-9a-zA-Z]{1,8}$/,message:"账号格式错误"}]
                        })(
                            <Input placeholder="请输入账号" />
                        )}
                    </FormItem>
                </Col>
                <Col {...item_layout_left}>
                    <div className="form-label-fdd">账号密码</div>
                    <FormItem {...form_layout}>
                        {getFieldDecorator("password",{
                            rules:[{required: true, message: '请输入账号密码'}]
                        })(
                            <Input type="password" placeholder="请输入账号密码" />
                        )}
                    </FormItem>
                </Col>
                <Col {...item_layout_left}>
                    <div className="form-label-fdd">账号名称</div>
                    <FormItem {...form_layout}>
                        {getFieldDecorator("name",{
                            rules:[{required: true, message: '请输入账号名称'}]
                        })(
                            <Input placeholder="请输入账号名称" />
                        )}
                    </FormItem>
                </Col>
                <Col {...item_layout_left}>
                    <FormItem {...form_layout} style={{textAlign:"center"}}>
                        <Button type="success" size="large" htmlType="submit">确定</Button>
                    </FormItem>
                </Col>
            </Form>
        )
    }
}


export default Form.create()(Indent);