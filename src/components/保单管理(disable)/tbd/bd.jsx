import React , { Component } from 'react';
import { Row , Form , Input , Button} from 'antd';
const FormItem = Form.Item;
class Tbdlist extends Component{
    constructor(props){
        super(props);
        props.onref(this);
        this.state={
            addClick:[],
            edit:true
        };
        this.addArr=[];
        this.tbdNum=1;
    }
    componentDidMount(){

    }
    editBd(){
        this.setState({
            edit:false
        })
    }
    render() {
        let {getFieldDecorator} = this.props.form;
        let form_layout = {
            labelCol: {
                xs: { span: 20 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 20 },
                sm: { span: 12 },
            }
        };
        let form_layouts = {
            labelCol: {
                xs: { span: 20 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 20 },
                sm: { span: 10 },
            }
        };
        let data=this.props.data;
        return (
            <Row>
                {
                    data.bdNo&&this.state.edit?<FormItem {...form_layouts} label="补填保单号">
                        {getFieldDecorator("bdNos",{
                            initialValue:data.bdNo,
                            rules:[{required: true, message: "1122"}]
                        })(
                            <div>{data.bdNo}</div>
                        )}
                        <div style={{position: "absolute",top: 0,left: "100%"}}><Button onClick={this.editBd.bind(this)}>修改</Button></div>
                    </FormItem>:<FormItem {...form_layout} label="补填保单号">
                        {getFieldDecorator("bdNo",{
                            initialValue:data.bdNo,
                            rules:[{required: true, message: "请填写正确保单号"},{pattern:/^[a-zA-Z0-9]{1,50}$/,message:"请填写正确保单号"}]
                        })(
                            <Input placeholder={"请输入保单号"} />
                        )}
                    </FormItem>
                }

                <FormItem style={{marginBottom:"0"}} wrapperCol={{ span: 10}}>
                    {getFieldDecorator('id', {
                        initialValue:data.id
                    })(
                        <div />
                    )}
                </FormItem>
                <FormItem style={{marginBottom:"0"}} wrapperCol={{ span: 10}}>
                    {getFieldDecorator('type', {
                        initialValue:data.type
                    })(
                        <div />
                    )}
                </FormItem>
                <FormItem style={{marginBottom:"0"}} wrapperCol={{ span: 10}}>
                    {getFieldDecorator('ordinal', {
                        initialValue:data.ordinal
                    })(
                        <div />

                    )}
                </FormItem>
                <style>{`
                    //.ant-form-item{margin-bottom:12px!important}
                `}</style>
            </Row>
        )
    }
}
export default Form.create()(Tbdlist);