import React, { Component } from 'react';
import {Row,Col,Form,message} from 'antd';
const FormItem = Form.Item;
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
            penaltyFeePayerPer:false,
            repayData:{},
            repayProduct:{}
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
            if((data.interestUserPer+data.interestPayerPer!==Number(this.props.product.interestPer))||(data.serviceFeeUserPer+data.serviceFeePayerPer!==Number(this.props.product.serviceFeePer))||(data.otherFeeUserPer+data.otherFeePayerPer!==Number(this.props.product.otherFeePer))||(data.lateFeeUserPer+data.lateFeePayerPer!==Number(this.props.product.lateFeePer))||(data.penaltyFeeUserPer+data.penaltyFeePayerPer!==Number(this.props.product.penaltyFeePer))){
                message.warn("??????????????????????????????????????????????????????????????????");
                return;
            }
            if(data.principalType===''){
                //message.warn("??????????????????????????????????????????");
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
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div style={{marginBottom:"30px"}}> 
                <div style={{marginBottom:"10px",color:"#7F8FA4"}}>????????????<span style={{marginLeft:"5px",color:"#393A3E"}}>{this.props.product.name?this.props.product.name:this.state.p_name}</span></div>
                <table className="repayTable" cellSpacing="0" cellPadding="0" >
                    <thead>
                        <tr>
                            {/* <td>????????????</td> */}
                            <td>???????????????</td>
                            <td>?????????????????????</td>
                            <td>???????????? ?????????????????????=??????????????????+??????????????????</td>
                        </tr>


                    </thead>
                    <tbody>
                        <tr>
                            {/* <td rowSpan={5} style={{borderBottom:"none"}} >{this.props.product.name?this.props.product.name:this.state.p_name}</td> */}
                            <td>??????</td>
                            <td>??????</td>
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
                                    })(
                                        <div style={{fontSize:"14px"}}>{this.state.repayData.principalType?"????????????":"????????????"}</div>
                                    )}

                                </FormItem>
                            </td>
                        </tr>
                        <tr>
                            <td>??????</td>
                            <td>{this.state.repayProduct.interestPer!==null?this.state.repayProduct.interestPer+"%":""}</td>
                            <td>
                                <Row>
                                    <Col span={12}>
                                        <FormItem className="tableForm" >
                                            {getFieldDecorator('interestUserPer', {
                                            })(
                                                <div style={{fontSize:"14px"}}>{this.state.repayData.interestUserPer?"????????????"+this.state.repayData.interestUserPer+"%":""}</div>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem className="tableForm" >
                                            {getFieldDecorator('interestPayerPer', {
                                            })(
                                                <div style={{fontSize:"14px"}}>{this.state.repayData.interestPayerPer?"????????????"+this.state.repayData.interestPayerPer+"%":""}</div>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>

                            </td>
                        </tr>
                        
                        <tr>
                            <td>?????????</td>
                            <td>{this.state.repayProduct.serviceFeePer!==null?this.state.repayProduct.serviceFeePer+"%":""}</td>
                            <td>
                                <Row>
                                    <Col span={12}>
                                        <FormItem className="tableForm">
                                            {getFieldDecorator('serviceFeeUserPer', {
                                            })(
                                                <div style={{fontSize:"14px"}}>{this.state.repayData.serviceFeeUserPer?"????????????"+this.state.repayData.serviceFeeUserPer+"%":""}</div>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12} >
                                        <FormItem className="tableForm">
                                            {getFieldDecorator('serviceFeePayerPer', {
                                            })(
                                                <div style={{fontSize:"14px"}}>{this.state.repayData.serviceFeePayerPer?"????????????"+this.state.repayData.serviceFeePayerPer+"%":""}</div>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </td>
                        </tr>
                        <tr>
                            <td>????????????</td>
                            <td>{this.state.repayProduct.otherFeePer!==null?this.state.repayProduct.otherFeePer+"%":""}</td>
                            <td>
                                <Row>
                                    <Col span={12}>
                                        <FormItem className="tableForm">
                                            {getFieldDecorator('otherFeeUserPer', {
                                            })(
                                                <div style={{fontSize:"14px"}}>{this.state.repayData.otherFeeUserPer?"????????????"+this.state.repayData.otherFeeUserPer+"%":""}</div>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12} >
                                        <FormItem className="tableForm">
                                            {getFieldDecorator('otherFeePayerPer', {
                                            })(
                                                <div style={{fontSize:"14px"}}>{this.state.repayData.otherFeePayerPer?"????????????"+this.state.repayData.otherFeePayerPer+"%":""}</div>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </td>
                        </tr>
                        <tr>
                            <td>????????????</td>
                            <td>{this.state.repayProduct.lateFeePer!==null?this.state.repayProduct.lateFeePer+"%":""}</td>
                            <td>
                                <Row>
                                    <Col span={12}>
                                        <FormItem className="tableForm" >
                                            {getFieldDecorator('lateFeeUserPer', {
                                            })(
                                                <div style={{fontSize:"14px"}}>{this.state.repayData.lateFeeUserPer?"????????????"+this.state.repayData.lateFeeUserPer+"%":""}</div>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12} className="tableForm">
                                        <FormItem >
                                            {getFieldDecorator('lateFeePayerPer', {
                                            })(
                                                <div style={{fontSize:"14px"}}>{this.state.repayData.lateFeePayerPer?"????????????"+this.state.repayData.lateFeePayerPer+"%":""}</div>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </td>
                        </tr>
                        <tr>
                            <td>?????????????????????</td>
                            <td>{this.state.repayProduct.penaltyFeePer!==null?this.state.repayProduct.penaltyFeePer+"%":""}</td>
                            <td>
                                <Row>
                                    <Col span={12}>
                                        <FormItem className="tableForm">
                                            {getFieldDecorator('penaltyFeeUserPer', {
                                            })(
                                                <div style={{fontSize:"14px"}}>{this.state.repayData.penaltyFeeUserPer?"????????????"+this.state.repayData.penaltyFeeUserPer+"%":""}</div>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12} >
                                        <FormItem className="tableForm">
                                            {getFieldDecorator('penaltyFeePayerPer', {
                                            })(
                                                <div style={{fontSize:"14px"}}>{this.state.repayData.penaltyFeePayerPer?"????????????"+this.state.repayData.penaltyFeePayerPer+"%":""}</div>
                                            )}
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