import React , { Component } from 'react';
import { Form, Icon, Input, Button , Row , Col , message } from 'antd';
import CryptoJS from "crypto-js";

import { aesKey , captcha , login , login_free} from '../../ajax/api';
import { host_auth } from '../../ajax/config';
import { axios_auth } from '../../ajax/request';
const FormItem = Form.Item;

class NormalLoginForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            name:""
        }
    }
    login(e) {
        let rqd = {
            login:this.state.name,
            checkCode:"",
            checkCodeId:"",
            checkCodeKey:""
        }
        axios_auth.post(login,rqd).then((data)=>{
            console.log("登录结果",data);
            localStorage.setItem("isLogin","true")
        })
    }
    login_free(){
        axios_auth.get(login_free,null).then((data)=>{
            console.log("登录结果",data);
            localStorage.setItem("isLogin","true");
            // window.location.reload();
        })
    }
    padString(source) {
        let paddingChar = ' ';
        let size = 16;
        let x = source.length % size;
        let padLength = size - x;

        for (let i = 0; i < padLength; i++) source += paddingChar;

        return source;
    }
    captcha(e){
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
            this.setState({
                name:values.userName
            })
            this.send_data(values.userName,values.password)
        });
    }
    send_data(name,pwd){
        axios_auth.get(aesKey).then((data)=>{
            if(data.status!==1){
                return;
            }
            let key = CryptoJS.enc.Latin1.parse(data.data.aes_key);
            let iv = CryptoJS.enc.Latin1.parse(data.data.aes_iv);
            let padMsg = this.padString(pwd);
            let encrypted = CryptoJS.AES.encrypt(padMsg, key, {
                iv: iv,
                padding: CryptoJS.pad.NoPadding,
                mode: CryptoJS.mode.CBC
            });
            let aes_passwd = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
            let rqd = {
                login:name,
                aes_passwd:aes_passwd
            }
            host_auth.post(captcha,{...rqd}).then((data)=>{
                console.log(data);
                message.error(data.msg);
            })
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const window_height = window.innerHeight;
        return (
            <Row className="hxyw">
                <Col span={6} offset={10}>
                    <Form onSubmit={this.captcha.bind(this)} className="login-form" style={{marginTop:(window_height-206)/2+'px'}}>
                        <FormItem>
                            {getFieldDecorator('userName', {
                                rules: [{ required: true, message: '请输入账户名' }],
                            })(
                                <Input prefix={<Icon type="user" />} placeholder="账号" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码' }],
                            })(
                                <Input prefix={<Icon type="lock" />} type="password" placeholder="密码" />
                            )}
                        </FormItem>
                        <FormItem >
                            <Col span={17}>
                                { getFieldDecorator('captcha',{
                                    rules:[{required:false,message:"请输入验证码"}]
                                })(
                                    <Input prefix={<Icon type="edit" />} placeholder="输入验证码" />
                                )}
                            </Col>
                            <Col span={6} offset={1}>
                                <Button type="primary" htmlType="submit" className="login-form-button">获取</Button>
                            </Col>
                        </FormItem>
                        <FormItem >
                            <Col span={10}>
                                <Button type="primary" htmlType="button" onClick={this.login.bind(this)} className="login-form-button">登录</Button>
                            </Col>
                            <Col span={10} offset={4}>
                                <Button type="primary" htmlType="button" onClick={this.login_free.bind(this)} className="login-form-button">临时登录</Button>
                            </Col>
                        </FormItem>
                    </Form>
                </Col>
            </Row>
        );
    }
}


export default Form.create()(NormalLoginForm);