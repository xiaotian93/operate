import React, { Component } from 'react';
import {Row,Col,Form,Input,Radio,Checkbox,message} from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
class RepayTable extends Component{
    constructor(props) {
        super(props);
        props.onRef(this);
        this.state = {
            product:props.product,
            interestUserPer:false,
            interestPayerPer:false,
            serviceFeeUserPer:false,
            serviceFeePayerPer:false,
            otherFeeUserPer:false,
            otherFeePayerPer:false,
            lateFeeUserPer:false,
            lateFeePayerPer:false,
            penaltyFeeUserPer:false,
            penaltyFeePayerPer:false
        };
    }
    componentWillMount(){
        this.getName()
    }
    interestUser(e){
        this.setState({
            interestUserPer:e.target.checked
        })
        if(!e.target.checked){
            this.props.form.setFieldsValue({interestUserPer:null})
        }
    }
    interestPayer(e){
        this.setState({
            interestPayerPer:e.target.checked
        })
        if(!e.target.checked){
            this.props.form.setFieldsValue({interestPayerPer:""})
        }
    }
    serviceFeeUser(e){
        this.setState({
            serviceFeeUserPer:e.target.checked
        })
        if(!e.target.checked){
            this.props.form.setFieldsValue({serviceFeeUserPer:""})
        }
    }
    serviceFeePayer(e){
        this.setState({
            serviceFeePayerPer:e.target.checked
        })
        if(!e.target.checked){
            this.props.form.setFieldsValue({serviceFeePayerPer:""})
        }
    }
    otherFeeUser(e){
        this.setState({
            otherFeeUserPer:e.target.checked
        })
        if(!e.target.checked){
            this.props.form.setFieldsValue({otherFeeUserPer:""})
        }
    }
    otherFeePayer(e){
        this.setState({
            otherFeePayerPer:e.target.checked
        })
        if(!e.target.checked){
            this.props.form.setFieldsValue({otherFeePayerPer:""})
        }
    }
    penaltyFeeUser(e){
        this.setState({
            penaltyFeeUserPer:e.target.checked
        })
        if(!e.target.checked){
            this.props.form.setFieldsValue({penaltyFeeUserPer:""})
        }
    }
    penaltyFeePayer(e){
        this.setState({
            penaltyFeePayerPer:e.target.checked
        })
        if(!e.target.checked){
            this.props.form.setFieldsValue({penaltyFeePayerPer:""})
        }
    }
    lateFeeUser(e){
        this.setState({
            lateFeeUserPer:e.target.checked
        })
        if(!e.target.checked){
            this.props.form.setFieldsValue({lateFeeUserPer:""})
        }
    }
    lateFeePayer(e){
        this.setState({
            lateFeePayerPer:e.target.checked
        })
        if(!e.target.checked){
            this.props.form.setFieldsValue({lateFeePayerPer:""})
        }
    }
    checkData(){
        var data=this.props.form.getFieldsValue();
        data.interestUserPer=data.interestUserPer?parseFloat(data.interestUserPer):0;
        data.interestPayerPer=data.interestPayerPer?parseFloat(data.interestPayerPer):0;
        data.serviceFeeUserPer=data.serviceFeeUserPer?parseFloat(data.serviceFeeUserPer):0;
        data.serviceFeePayerPer=data.serviceFeePayerPer?parseFloat(data.serviceFeePayerPer):0;
        data.otherFeeUserPer=data.otherFeeUserPer?parseFloat(data.otherFeeUserPer):0;
        data.otherFeePayerPer=data.otherFeePayerPer?parseFloat(data.otherFeePayerPer):0;
        data.lateFeeUserPer=data.lateFeeUserPer?parseFloat(data.lateFeeUserPer):0;
        data.lateFeePayerPer=data.lateFeePayerPer?parseFloat(data.lateFeePayerPer):0;
        data.penaltyFeeUserPer=data.penaltyFeeUserPer?parseFloat(data.penaltyFeeUserPer):0;
        data.penaltyFeePayerPer=data.penaltyFeePayerPer?parseFloat(data.penaltyFeePayerPer):0;
        //if((this.props.product.interestPer&&(this.state.interestUserPer||this.state.interestPayerPer))&&(this.props.product.serviceFeePer&&(this.state.serviceFeePayerPer||this.state.serviceFeeUserPer))&&(this.props.product.otherFeePer&&(this.state.otherFeePayerPer||this.state.otherFeeUserPer))&&(this.props.product.lateFeePer&&(this.state.lateFeePayerPer||this.state.lateFeeUserPer))){
            // if((data.interestUserPer+data.interestPayerPer!==Number(this.props.product.interestPer))||(data.serviceFeeUserPer+data.serviceFeePayerPer!==Number(this.props.product.serviceFeePer))||(data.otherFeeUserPer+data.otherFeePayerPer!==Number(this.props.product.otherFeePer))||(data.lateFeeUserPer+data.lateFeePayerPer!==Number(this.props.product.lateFeePer))||(data.penaltyFeeUserPer+data.penaltyFeePayerPer!==Number(this.props.product.penaltyFeePer))){
            //     message.warn("客户还款利率、商户代偿利率填写错误，请检查！");
            //     return;
            // }
            if(data.principalType===''){
                //message.warn("还款配置信息不完整，请检查！");
                return;

            }
            return data;
        //}
    }
    getName(){
        var productList=JSON.parse(window.localStorage.getItem("productList"));
        for(var i in productList){
            if(Number(productList[i].id)===Number(this.props.product.productId)){
                this.setState({
                    p_name:productList[i].name
                })
            }
        }
    }
    //还款情况输入利率判断
    check_interestUserPer(e){
        var val=this.props.form.getFieldValue("interestPayerPer")?this.props.form.getFieldValue("interestPayerPer"):0;
        if(Number(e.target.value)+Number(val)!==Number(this.props.product.interestPer)){
            message.warn("客户还款利率与商户代偿利率之和必须等于合同收益率",3)
        }
    }
    check_interestPayerPer(e){
        var val=this.props.form.getFieldValue("interestUserPer")?this.props.form.getFieldValue("interestUserPer"):0;
        if(Number(e.target.value)+Number(val)!==Number(this.props.product.interestPer)){
            message.warn("客户还款利率与商户代偿利率之和必须等于合同收益率",3)
        }
    }
    check_serviceFeeUserPer(e){
        var val=this.props.form.getFieldValue("serviceFeePayerPer")?this.props.form.getFieldValue("serviceFeePayerPer"):0;
        if(Number(e.target.value)+Number(val)!==Number(this.props.product.serviceFeePer)){
            message.warn("客户还款利率与商户代偿利率之和必须等于合同收益率",3)
        }
    }
    check_serviceFeePayerPer(e){
        var val=this.props.form.getFieldValue("serviceFeeUserPer")?this.props.form.getFieldValue("serviceFeeUserPer"):0;
        if(Number(e.target.value)+Number(val)!==Number(this.props.product.serviceFeePer)){
            message.warn("客户还款利率与商户代偿利率之和必须等于合同收益率",3)
        }
    }
    check_otherFeeUserPer(e){
        var val=this.props.form.getFieldValue("otherFeePayerPer")?this.props.form.getFieldValue("otherFeePayerPer"):0;
        if(Number(e.target.value)+Number(val)!==Number(this.props.product.otherFeePer)){
            message.warn("客户还款利率与商户代偿利率之和必须等于合同收益率",3)
        }
    }
    check_otherFeePayerPer(e){
        var val=this.props.form.getFieldValue("otherFeeUserPer")?this.props.form.getFieldValue("otherFeeUserPer"):0;
        if(Number(e.target.value)+Number(val)!==Number(this.props.product.otherFeePer)){
            message.warn("客户还款利率与商户代偿利率之和必须等于合同收益率",3)
        }
    }
    check_lateFeeUserPer(e){
        var val=this.props.form.getFieldValue("lateFeePayerPer")?this.props.form.getFieldValue("lateFeePayerPer"):0;
        if(Number(e.target.value)+Number(val)!==Number(this.props.product.lateFeePer)){
            message.warn("客户还款利率与商户代偿利率之和必须等于合同收益率",3)
        }
    }
    check_lateFeePayerPer(e){
        var val=this.props.form.getFieldValue("lateFeeUserPer")?this.props.form.getFieldValue("lateFeeUserPer"):0;
        if(Number(e.target.value)+Number(val)!==Number(this.props.product.lateFeePer)){
            message.warn("客户还款利率与商户代偿利率之和必须等于合同收益率",3)
        }
    }
    check_penaltyFeeUserPer(e){
        var val=this.props.form.getFieldValue("penaltyFeePayerPer")?this.props.form.getFieldValue("penaltyFeePayerPer"):0;
        if(Number(e.target.value)+Number(val)!==Number(this.props.product.penaltyFeePer)){
            message.warn("客户还款利率与商户代偿利率之和必须等于合同收益率",3)
        }
    }
    check_penaltyFeePayerPer(e){
        var val=this.props.form.getFieldValue("penaltyFeeUserPer")?this.props.form.getFieldValue("penaltyFeeUserPer"):0;
        if(Number(e.target.value)+Number(val)!==Number(this.props.product.penaltyFeePer)){
            message.warn("客户还款利率与商户代偿利率之和必须等于合同收益率",3)
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formInfoSmall={
            labelCol:{span:11},
            wrapperCol:{span:9},
            colon:false,
            className:"textRight tableForm"
        };
        return (
            <div style={{marginBottom:"30px"}}> 
                <div style={{marginBottom:"10px",color:"#7F8FA4"}}>产品名称<span style={{marginLeft:"5px",color:"#393A3E"}}>{this.props.product.name?this.props.product.name:this.state.p_name}</span></div>
                <table className="repayTable" cellSpacing="0" cellPadding="0" >
                    <thead>
                        <tr>
                            {/* <td>产品名称</td> */}
                            <td>还款资金项</td>
                            <td>合同约定收益率</td>
                            <td>还款情况 （合同约定收益率=客户还款利率+商户代偿利率）</td>
                        </tr>


                    </thead>
                    <tbody>
                        <tr>
                            {/* <td rowSpan={5} style={{borderBottom:"none"}} >{this.props.product.name?this.props.product.name:this.state.p_name}</td> */}
                            <td>本金</td>
                            <td>全额</td>
                            <td style={{width:"400px"}} >
                                <FormItem label="" style={{marginBottom:"0!important"}} className="bottom" >
                                    {getFieldDecorator('productId', {
                                        initialValue:this.props.product?this.props.product.productId:""
                                    })(
                                        <div />
                                    )}
                                </FormItem>
                                <FormItem className="tableForm" >
                                    {getFieldDecorator('principalType',{
                                        initialValue:""
                                    })(
                                        <RadioGroup>
                                            <Radio value="0" >客户还款</Radio>
                                            <Radio value="1" >商家代偿</Radio>
                                        </RadioGroup>
                                    )}

                                </FormItem>
                            </td>
                        </tr>
                        <tr>
                            <td>利息</td>
                            <td>{this.props.product?(this.props.product.interestPer!==null?this.props.product.interestPer+"%":""):""}</td>
                            <td>
                                <Row>
                                    <Col span={12}>
                                        <FormItem className="" label={<Checkbox onChange={this.interestUser.bind(this)} checked={this.state.interestUserPer} disabled={this.props.product?(this.props.product.interestPer!==null?false:true):true} >客户还款</Checkbox>} {...formInfoSmall}>
                                            {getFieldDecorator('interestUserPer', {
                                                rules:[{pattern:/^([0-9]\d?(\.\d{1,2})?|0\.\d{1,2}|100)$/,message:"格式错误"}]
                                            })(
                                                <Input disabled={!this.state.interestUserPer} onBlur={this.check_interestUserPer.bind(this)} />
                                            )}
                                            <div className="formIcon" >%</div>
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem className="" label={<Checkbox onChange={this.interestPayer.bind(this)} checked={this.state.interestPayerPer} disabled={this.props.product?(this.props.product.interestPer!==null?false:true):true} >商家代偿</Checkbox>} {...formInfoSmall} >
                                            {getFieldDecorator('interestPayerPer', {
                                                rules:[{pattern:/^([0-9]\d?(\.\d{1,2})?|0\.\d{1,2}|100)$/,message:"格式错误"}]
                                            })(
                                                <Input disabled={!this.state.interestPayerPer} onBlur={this.check_interestPayerPer.bind(this)} />
                                            )}
                                            <div className="formIcon" >%</div>
                                        </FormItem>
                                    </Col>
                                </Row>

                            </td>
                        </tr>
                        
                        <tr>
                            <td>服务费</td>
                            <td>{this.props.product?(this.props.product.serviceFeePer!==null?this.props.product.serviceFeePer+"%":""):""}</td>
                            <td>
                                <Row>
                                    <Col span={12}>
                                        <FormItem className="" label={<Checkbox onChange={this.serviceFeeUser.bind(this)} checked={this.state.serviceFeeUserPer} disabled={this.props.product?(this.props.product.serviceFeePer!==null?false:true):true} >客户还款</Checkbox>} {...formInfoSmall} >
                                            {getFieldDecorator('serviceFeeUserPer', {
                                                rules:[{pattern:/^([0-9]\d?(\.\d{1,2})?|0\.\d{1,2}|100)$/,message:"格式错误"}]
                                            })(
                                                <Input disabled={!this.state.serviceFeeUserPer} onBlur={this.check_serviceFeeUserPer.bind(this)} />
                                            )}
                                            <div className="formIcon" >%</div>
                                        </FormItem>
                                    </Col>
                                    <Col span={12} >
                                        <FormItem className="" label={<Checkbox onChange={this.serviceFeePayer.bind(this)} checked={this.state.serviceFeePayerPer} disabled={this.props.product?(this.props.product.serviceFeePer!==null?false:true):true} >商家代偿</Checkbox>} {...formInfoSmall} >
                                            {getFieldDecorator('serviceFeePayerPer', {
                                                rules:[{pattern:/^([0-9]\d?(\.\d{1,2})?|0\.\d{1,2}|100)$/,message:"格式错误"}]
                                            })(
                                                <Input disabled={!this.state.serviceFeePayerPer} onBlur={this.check_serviceFeePayerPer.bind(this)} />
                                            )}
                                            <div className="formIcon" >%</div>
                                        </FormItem>
                                    </Col>
                                </Row>
                            </td>
                        </tr>
                        <tr>
                            <td>其他费用</td>
                            <td>{this.props.product?(this.props.product.otherFeePer!==null?this.props.product.otherFeePer+"%":""):""}</td>
                            <td>
                                <Row>
                                    <Col span={12}>
                                        <FormItem className="" label={<Checkbox onChange={this.otherFeeUser.bind(this)} checked={this.state.otherFeeUserPer} disabled={this.props.product?(this.props.product.otherFeePer!==null?false:true):true} >客户还款</Checkbox>} {...formInfoSmall} >
                                            {getFieldDecorator('otherFeeUserPer', {
                                                rules:[{pattern:/^([0-9]\d?(\.\d{1,2})?|0\.\d{1,2}|100)$/,message:"格式错误"}]
                                            })(
                                                <Input disabled={!this.state.otherFeeUserPer} onBlur={this.check_otherFeeUserPer.bind(this)} />
                                            )}
                                            <div className="formIcon" >%</div>
                                        </FormItem>
                                    </Col>
                                    <Col span={12} >
                                        <FormItem className="" label={<Checkbox onChange={this.otherFeePayer.bind(this)} checked={this.state.otherFeePayerPer} disabled={this.props.product?(this.props.product.otherFeePer!==null?false:true):true} >商家代偿</Checkbox>} {...formInfoSmall} >
                                            {getFieldDecorator('otherFeePayerPer', {
                                                rules:[{pattern:/^([0-9]\d?(\.\d{1,2})?|0\.\d{1,2}|100)$/,message:"格式错误"}]
                                            })(
                                                <Input disabled={!this.state.otherFeePayerPer} onBlur={this.check_otherFeePayerPer.bind(this)} />
                                            )}
                                            <div className="formIcon" >%</div>
                                        </FormItem>
                                    </Col>
                                </Row>
                            </td>
                        </tr>
                        <tr>
                            <td>逾期罚息</td>
                            <td>{this.props.product?(this.props.product.lateFeePer!==null?this.props.product.lateFeePer+"%":""):""}</td>
                            <td>
                                <Row>
                                    <Col span={12}>
                                        <FormItem className="" label={<Checkbox onChange={this.lateFeeUser.bind(this)} checked={this.state.lateFeeUserPer} disabled={this.props.product?(this.props.product.lateFeePer!==null?false:true):true} >客户还款</Checkbox>} {...formInfoSmall} >
                                            {getFieldDecorator('lateFeeUserPer', {
                                                rules:[{pattern:/^([0-9]\d?(\.\d{1,2})?|0\.\d{1,2}|100)$/,message:"格式错误"}]
                                            })(
                                                <Input disabled={!this.state.lateFeeUserPer} onBlur={this.check_lateFeeUserPer.bind(this)} />
                                            )}
                                            <div className="formIcon" >%</div>
                                        </FormItem>
                                    </Col>
                                    <Col span={12} >
                                        <FormItem className="" label={<Checkbox onChange={this.lateFeePayer.bind(this)} checked={this.state.lateFeePayerPer} disabled={this.props.product?(this.props.product.lateFeePer!==null?false:true):true} >商家代偿</Checkbox>} {...formInfoSmall} >
                                            {getFieldDecorator('lateFeePayerPer', {
                                                rules:[{pattern:/^([0-9]\d?(\.\d{1,2})?|0\.\d{1,2}|100)$/,message:"格式错误"}]
                                            })(
                                                <Input disabled={!this.state.lateFeePayerPer} onBlur={this.check_lateFeePayerPer.bind(this)} />
                                            )}
                                            <div className="formIcon" >%</div>
                                        </FormItem>
                                    </Col>
                                </Row>
                            </td>
                        </tr>
                        <tr>
                            <td>提前还款违约金</td>
                            <td>{this.props.product?(this.props.product.penaltyFeePer!==null?this.props.product.penaltyFeePer+"%":""):""}</td>
                            <td>
                                <Row>
                                    <Col span={12}>
                                        <FormItem className="" label={<Checkbox onChange={this.penaltyFeeUser.bind(this)} checked={this.state.penaltyFeeUserPer} disabled={this.props.product?(this.props.product.penaltyFeePer!==null?false:true):true} >客户还款</Checkbox>} {...formInfoSmall} >
                                            {getFieldDecorator('penaltyFeeUserPer', {
                                                rules:[{pattern:/^([0-9]\d?(\.\d{1,2})?|0\.\d{1,2}|100)$/,message:"格式错误"}]
                                            })(
                                                <Input disabled={!this.state.penaltyFeeUserPer} onBlur={this.check_penaltyFeeUserPer.bind(this)} />
                                            )}
                                            <div className="formIcon" >%</div>
                                        </FormItem>
                                    </Col>
                                    <Col span={12} >
                                        <FormItem className="" label={<Checkbox onChange={this.penaltyFeePayer.bind(this)} checked={this.state.penaltyFeePayerPer} disabled={this.props.product?(this.props.product.penaltyFeePer!==null?false:true):true} >商家代偿</Checkbox>} {...formInfoSmall} >
                                            {getFieldDecorator('penaltyFeePayerPer', {
                                                rules:[{pattern:/^([0-9]\d?(\.\d{1,2})?|0\.\d{1,2}|100)$/,message:"格式错误"}]
                                            })(
                                                <Input disabled={!this.state.penaltyFeePayerPer} onBlur={this.check_penaltyFeePayerPer.bind(this)} />
                                            )}
                                            <div className="formIcon" >%</div>
                                        </FormItem>
                                    </Col>
                                </Row>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>


        )

    }
}
export default Form.create()(RepayTable);