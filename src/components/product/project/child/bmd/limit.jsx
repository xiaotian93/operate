import React,{Component} from 'react';
import { Button, Form ,Input,message} from 'antd';
import { xjd_product_loan_get,xjd_product_loan_set } from '../../../../../ajax/api';
import { axios_xjd_p,axios_xjd } from '../../../../../ajax/request';
import { accDiv,accMul } from '../../../../../ajax/tool';
import Permissions from '../../../../../templates/Permissions';
const FormItem = Form.Item;
class Limit extends Component{
    constructor(props) {
        super(props);
        this.state = {
            singleDayPaymentLimit:0,
            totalPaymentLimit:0,
            singleMonthPaymentLimit:0,
            error:{
                type:false,
                name:"",
                text:""
            }
        };
    }
    componentWillMount() {
        this.loan_get();
    }
    //输入范围判定
    check_val(e,name,val,type){
        this.setState({
            error:{
                type:false,
                name:"",
                text:""
            }
        })
        var val_get=this.props.form.getFieldValue(val);
        if(val_get===""||e.target.value===""){
            return;
        }
        if(type){
            if(Number(e.target.value)>Number(val_get)){
                this.props.form.setFields({
                    [name]: {
                        errors: [new Error('不能高于总放款额度')],
                        value:e.target.value
                    },
                });
                this.setState({
                    error:{
                        type:true,
                        name:name,
                        text:"不能大于最大范围",
                        value:e.target.value
                    }
                })
            }
        }else{
            if(Number(e.target.value)<Number(val_get)){
                this.props.form.setFields({
                    [name]: {
                        errors: [new Error('不能低于单日放款限额')],
                        value: e.target.value
                    },
                });
                this.setState({
                    error:{
                        type:true,
                        name:name,
                        text:"不能小于最小范围",
                        value:e.target.value
                    }
                })
            }
        }
    }
    cancelLimit(){
        this.setState({
            isSet:false
        });
    }
    editLimit(){
        this.setState({
            isSet:true
        });
        setTimeout(function(){
            this.props.form.setFieldsValue({singleDayPaymentLimit:this.state.singleDayPaymentLimit,totalPaymentLimit:this.state.totalPaymentLimit,singleMonthPaymentLimit:this.state.singleMonthPaymentLimit});
        }.bind(this),100)
    }
    loan_get(){
        axios_xjd_p.get(xjd_product_loan_get).then(e=>{
            if(!e.code){
                if(!e.data){
                    this.setState({
                        isSet:true,
                        isCancel:false
                    });
                    return;
                }
                this.setState({
                    isSet:false,
                    isCancel:true,
                    singleDayPaymentLimit:accDiv(e.data.singleDayPaymentLimit,1000000),
                    totalPaymentLimit:accDiv(e.data.totalPaymentLimit,1000000),
                    singleMonthPaymentLimit:accDiv(e.data.singleMonthPaymentLimit,1000000)
                })
            }
        })
    }
    save(){
        if(this.state.error.type){
            this.props.form.setFields({
                [this.state.error.name]:{
                    errors: [new Error(this.state.error.text)],
                    value:this.state.error.value
                },
            });
            return;
        }
        this.props.form.validateFields((err,val)=>{
            if(!err){
                var param={
                    totalPaymentLimit:accMul(val.totalPaymentLimit,1000000),
                    singleDayPaymentLimit:accMul(val.singleDayPaymentLimit,1000000),
                    singleMonthPaymentLimit:accMul(val.singleMonthPaymentLimit,1000000)
                }
                axios_xjd.post(xjd_product_loan_set,param).then(e=>{
                    if(!e.code){
                        message.success('操作成功');
                        this.loan_get();
                    }
                })
            }
        })
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const formInfo={
            labelCol:{md:{span:12},lg:{span:11},xl:{span:11}},
            wrapperCol:{md:{span:12},lg:{span:11},xl:{span:11}},
            colon:false
        };
        return <div className="sh_add" style={{ background: "#fff",marginBottom:"15px" }}>
        <div className="product_title">放款规模配置</div>
        {this.state.isSet?<Form layout="inline">
        <FormItem label="总放款量上限" {...formInfo} >
            {getFieldDecorator('totalPaymentLimit', {
                rules:[{required:true,message:"请输入"},{ pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "格式错误" }]
            })(
                <Input placeholder="请输入" onBlur={(e)=>{this.check_val(e,"totalPaymentLimit","singleDayPaymentLimit",false)}} />
            )}
            <div className="formIcon">万元</div>
        </FormItem>
        <FormItem label="月放款量上限" {...formInfo} >
            {getFieldDecorator('singleMonthPaymentLimit', {
                rules:[{required:true,message:"请输入"},{ pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "格式错误" }]
            })(
                <Input placeholder="请输入" onBlur={(e)=>{this.check_val(e,"singleMonthPaymentLimit","singleDayPaymentLimit",false)}} />
            )}
            <div className="formIcon">万元</div>
        </FormItem>
        <FormItem label="单日放款量上限" {...formInfo} >
            {getFieldDecorator('singleDayPaymentLimit', {
                rules:[{required:true,message:"请输入"},{ pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "格式错误" }]
            })(
                <Input placeholder="请输入" onBlur={(e)=>{this.check_val(e,"singleDayPaymentLimit","totalPaymentLimit",true)}} />
            )}
            <div className="formIcon">万元</div>
        </FormItem>
        {this.state.isCancel?<Button type="" onClick={this.cancelLimit.bind(this)} style={{marginRight:"10px"}}>取消</Button>:null}
        <Permissions tag="button" server={global.AUTHSERVER.bmdCashLoan.key} permissions={global.AUTHSERVER.bmdCashLoan.access.loan_config_update} type="primary" onClick={this.save.bind(this)}>保存</Permissions>
        </Form>:<Form layout="inline">
        <FormItem label="总放款量上限" {...formInfo} style={{width:"250px"}} >
            {getFieldDecorator('totalPaymentLimit1', {
                rules:[{required:true,message:"请输入"}]
            })(
            <span>{this.state.totalPaymentLimit+"万元"}</span>
            )}
        </FormItem>
        <FormItem label="月放款量上限" {...formInfo} style={{width:"250px"}} >
            {getFieldDecorator('singleMonthPaymentLimit1', {
                rules:[{required:true,message:"请输入"}]
            })(
            <span>{this.state.singleMonthPaymentLimit+"万元"}</span>
            )}
        </FormItem>
        <FormItem label="单日放款量上限" {...formInfo} style={{width:"260px"}} >
            {getFieldDecorator('singleDayPaymentLimit1', {
                rules:[{required:true,message:"请输入"}]
            })(
            <div>{this.state.singleDayPaymentLimit+"万元"}</div>
            )}
        </FormItem>
        
        <Permissions type="primary" onClick={this.editLimit.bind(this)} server={global.AUTHSERVER.bmdCashLoan.key} tag="button" permissions={global.AUTHSERVER.bmdCashLoan.access.loan_config_update} tag="button">编辑</Permissions>
        </Form>}
        
    </div>
    }
}
export default Form.create()(Limit);