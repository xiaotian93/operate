import React, { Component } from 'react';
import { Form} from 'antd';
import { power_user_detail } from '../../../ajax/api';
// import Repay from './repayBank';
import { axios_auth } from '../../../ajax/request';
// import { browserHistory } from 'react-router';
// import {accMul,accDiv} from '../../../ajax/tool.js';
import ComponentRoute from '../../../templates/ComponentRoute';
const FormItem = Form.Item;
class Basic extends Component {
    constructor(props) {
        super(props);
        // props.onRef(this);
        this.state = {
            id: this.props.location.query.authAccountId,
            detail: {}
        };
    }
    componentWillMount() {
        this.detail();
        
    }
    detail(){
        axios_auth.post(power_user_detail,{authAccountId:this.state.id}).then(e=>{
            if(!e.code){
                this.setState({
                    detail:e.data
                })
            }
        })
    }
    submit(){

    }
    render() {
        window.form = this.props.form;
        const { getFieldDecorator } = this.props.form;
        const formInfo = {
            labelCol: { span: 5 },
            wrapperCol: { span: 6 },
            colon: false
        };
        const detail=this.state.detail;
        return (
            <Form className="sh_add content">
                <div className="sh_add_card">
                    <div className="sh_inner_box">
                        <FormItem label="用户姓名" {...formInfo} >
                            {getFieldDecorator('creditValidity', {
                            })(
                                <span style={{ fontSize: "14px" }}>{detail.name}</span>
                            )}
                        </FormItem>
                        <FormItem label="账号" {...formInfo} >
                            {getFieldDecorator('reCreditValidity', {
                            })(
                                <span style={{ fontSize: "14px" }}>{detail.login}</span>
                            )}
                        </FormItem>
                        <FormItem label="手机号" {...formInfo} >
                            {getFieldDecorator('resubmitValidity', {
                            })(
                                <span style={{ fontSize: "14px" }}>{detail.phoneNo}</span>
                            )}
                        </FormItem>
                        <FormItem label="账号ID" {...formInfo} >
                            {getFieldDecorator('loanResubmitValidity', {
                            })(
                                <span style={{ fontSize: "14px" }}>{detail.id}</span>
                            )}
                        </FormItem>
                        <FormItem label="添加时间" {...formInfo} >
                            {getFieldDecorator('identityValidity', {
                            })(
                                <span style={{ fontSize: "14px" }}>{detail.createTime}</span>
                            )}
                        </FormItem>
                    </div>
                </div>

                {/* <Row style={{ height: "50px", background: "#fff", position: "fixed", bottom: "0", right: "0", lineHeight: "50px", textAlign: "center", width: "calc(100% - 210px)", borderTop: "1px solid #CED0DA" }}>
                    <Button type="primary" onClick={this.submit.bind(this)} size="large" disabled={this.state.btn} >编辑</Button>
                </Row> */}
            </Form>
        )

    }
}
export default ComponentRoute(Form.create()(Basic));