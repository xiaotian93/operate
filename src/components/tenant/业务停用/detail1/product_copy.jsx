import React, { Component } from 'react';
import {Row,Col,Form} from 'antd';
// import {merchant_tem} from '../../../ajax/api';
// import {host_cxfq} from '../../../ajax/config';
// import {axios_sh} from '../../../ajax/request';
const FormItem = Form.Item;
class Product extends Component{
    constructor(props) {
        super(props);
        props.onRef(this);
        this.state = {
            discount1:'',
            discount2:'',
            discount3:'',
            discount1Show:1,
            discount2Show:1,
            discount3Show:1,
            product:props.product,
            id:props.id,
            productDetail:"",
            tem:[],
            repayData:{}
        };
    }
    componentWillMount(){
        if(this.state.id){
            setTimeout(()=>{
                this.detailData()
            },200)
        }
    }
    detailData(){
        var data=JSON.parse(window.localStorage.getItem("productList"));
        var repay_data=JSON.parse(window.localStorage.getItem("detail")).repaySettings;
        var tem=JSON.parse(window.localStorage.getItem("tem"));
        for(var i in data){
            if(data[i].id===this.props.product.productId){
                this.setState({
                    product:data[i]
                })
            }
        }
        for(var j in tem){
            if(tem[j].id===this.props.product.protocolTemplateId){
                this.setState({
                    protocolTemplate:tem[j].name
                })
            }
        }
        for(var r in repay_data){
            if(repay_data[r].productId===this.props.product.productId){
                this.setState({
                    repayData:repay_data[r]
                })
            }
        }
        // var productSettings=this.props.product;
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formInfo={
            labelCol:{span:5},
            wrapperCol:{span:8},
            colon:false
        };
        var pay={1:"放款前一次性支付",2:"首期还款日支付",3:"按期支付"};
        var bzj={1:"渠道支付",2:"商户支付",3:"客户支付"}
        return (
            <div className="sh_add_card">
                <Row style={{marginBottom:"20px"}} >
                 <span style={{fontSize:'14px',color:"#7F8FA4",marginRight:"5px"}}>产品名称</span>
                 <span style={{fontSize:'14px',color:"#000"}}>{this.state.product?this.state.product.name:""}</span>
                 <span style={{fontSize:'14px',color:"#7F8FA4",margin:"0 10px"}}>|</span>
                 <span style={{fontSize:'14px',color:"#7F8FA4",marginRight:"5px"}}>产品编号</span>
                 <span style={{fontSize:'14px',color:"#000"}}>{this.state.product?this.state.product.code:""}</span>
                </Row>
                <table className="sh_product_table" cellSpacing="0" cellPadding="0">
                    <tbody>
                        <tr>
                            <td colSpan="2" style={{textAlign:"center",fontSize:"14px",background:"#F4F6F7"}}>产品配置</td>
                            <td style={{textAlign:"center",fontSize:"14px",background:"#F4F6F7"}}>还款比例配置</td>
                        </tr>
                        <tr>
                            <td className="table_title">
                                借款金额 
                            </td>
                            <td>
                                <FormItem label="" {...formInfo} >
                                {getFieldDecorator('loanPer', {
                                })(
                                <div style={{fontSize:"14px"}}>{this.props.product.loanPer}%*商业险金额</div>
                                )}
                                
                                </FormItem>
                            </td>
                            <td>
                                <FormItem className="tableForm" >
                                    {getFieldDecorator('principalType',{
                                    })(
                                        <div style={{fontSize:"14px"}}>{this.state.repayData.principalType?"商家代偿":"客户还款"}</div>
                                    )}

                                </FormItem>
                            </td>
                        </tr>
                        {
                            (this.state.product?this.state.product.discount1Type:"")?
                        
                        <tr>
                            <td className="table_title" rowSpan="2">
                                保证金1 
                            </td>
                            <td>
                                <FormItem label="支付方式" wrapperCol={{span:19}} labelCol={{span:5}} colon={false} >
                                {getFieldDecorator('discount1Payer', {
                                   
                                })(
                                    <div style={{fontSize:"14px"}}>{bzj[this.props.product.discount1Payer]}</div>
                                )}
                                </FormItem>
                            </td>
                            <td />
                        </tr>:null
                        }
                        {
                            (this.state.product?this.state.product.discount1Type:"")?
                        
                        <tr>
                            <td>
                                <FormItem label="支付金额" {...formInfo} >
                                            {getFieldDecorator('discount1Per', {
                                            })(
                                                <div style={{fontSize:"14px"}}> {this.props.product.discount1Per}%*商业险金额</div>
                                            )}
                                            
                                </FormItem>
                            </td>
                            <td />
                        </tr>:null
                        }
                        {
                            (this.state.product?this.state.product.discount2Type:"")?
                        <tr>
                            <td className="table_title" rowSpan="2">
                                保证金2 
                            </td>
                            <td>
                                <FormItem label="支付方式" wrapperCol={{span:19}} labelCol={{span:5}} colon={false} >
                                {getFieldDecorator('discount2Payer', {
                                    
                                })(
                                    <div style={{fontSize:"14px"}}>{bzj[this.props.product.discount2Payer]}</div>
                                )}
                                </FormItem>
                            </td>
                            <td />
                        </tr>:null
                        }
                        {
                            (this.state.product?this.state.product.discount2Type:"")?
                        
                        <tr>
                            <td>
                                <FormItem label="支付金额" {...formInfo} >
                                            {getFieldDecorator('discount2Per', {
                                            })(
                                                <div style={{fontSize:"14px"}}>{this.props.product.discount2Per}%*商业险金额</div>
                                            )}
                                           
                                </FormItem>
                            </td>
                            <td />
                        </tr>:null
                        }
                        {
                            (this.state.product?this.state.product.discount3Type:"")?
                        
                        <tr>
                            <td className="table_title" rowSpan="2">
                                保证金3 
                            </td>
                            <td>
                                <FormItem label="支付方式" wrapperCol={{span:19}} labelCol={{span:5}} colon={false} >
                                {getFieldDecorator('discount3Payer', {
                                    
                                })(
                                    <div style={{fontSize:"14px"}}>{bzj[this.props.product.discount3Payer]}</div>
                                )}
                                </FormItem>
                            </td>
                            <td />
                        </tr>:null
                        }
                        {
                            (this.state.product?this.state.product.discount3Type:"")?
                        
                        <tr>
                            <td>
                                <FormItem label="支付金额" {...formInfo} >
                                            {getFieldDecorator('discount3Per', {
                                            })(
                                                <div style={{fontSize:"14px"}}>{this.props.product.discount3Per}%*商业险金额</div>
                                            )}
                                            
                                </FormItem>
                            </td>
                            <td />
                        </tr>:null
                        }
                        <tr>
                            <td className="table_title" rowSpan="2">
                                利息 
                            </td>
                            <td>
                            <Row style={{marginBottom:"10px"}}>
                            <Col span={5} style={{textAlign:'left',fontSize:'14px',color:"#7F8FA4"}}>支付方式</Col>
                            <Col span={8} style={{fontSize:'14px',color:"#000"}}>{this.state.product?pay[this.state.product.interestType]:""}</Col>
                        </Row>
                            </td>
                            <td />
                        </tr>
                        <tr>
                            <td>
                            <FormItem label="支付金额" {...formInfo} >
                                {getFieldDecorator('interestPer', {
                                })(
                                    <div style={{fontSize:"14px"}}>{this.props.product.interestPer}%*商业险金额</div>
                                )}
                               
                            </FormItem>
                            </td>
                            <td>
                                <Row>
                                    <Col span={12}>
                                        <FormItem className="tableForm" >
                                            {getFieldDecorator('interestUserPer', {
                                            })(
                                                <div style={{fontSize:"14px"}}>{this.state.repayData.interestUserPer?"客户还款"+this.state.repayData.interestUserPer+"%":""}</div>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem className="tableForm" >
                                            {getFieldDecorator('interestPayerPer', {
                                            })(
                                                <div style={{fontSize:"14px"}}>{this.state.repayData.interestPayerPer?"商家代偿"+this.state.repayData.interestPayerPer+"%":""}</div>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>

                            </td>
                        </tr>
                        <tr>
                            <td className="table_title" rowSpan="3">
                            服务费 
                            </td>
                            <td>
                            <Row style={{marginBottom:"10px"}}>
                            <Col span={5} style={{textAlign:'left',fontSize:'14px',color:"#7F8FA4"}}>支付方式</Col>
                            <Col span={8} style={{fontSize:'14px',color:"#000"}}>{this.state.product?pay[this.state.product.serviceFeeType]:""}</Col>
                        </Row>
                            </td>
                            <td />
                        </tr>
                        <tr>
                            <td>
                            <FormItem label="支付金额" {...formInfo}>
                                {getFieldDecorator('serviceFeePer', {
                                })(
                                    <div style={{fontSize:"14px"}}>{this.props.product.serviceFeePer}%*商业险金额</div>
                                )}
                            </FormItem>
                            </td>
                            <td>
                                <Row>
                                    <Col span={12}>
                                        <FormItem className="tableForm">
                                            {getFieldDecorator('serviceFeeUserPer', {
                                            })(
                                                <div style={{fontSize:"14px"}}>{this.state.repayData.serviceFeeUserPer?"客户还款"+this.state.repayData.serviceFeeUserPer+"%":""}</div>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12} >
                                        <FormItem className="tableForm">
                                            {getFieldDecorator('serviceFeePayerPer', {
                                            })(
                                                <div style={{fontSize:"14px"}}>{this.state.repayData.serviceFeePayerPer?"商家代偿"+this.state.repayData.serviceFeePayerPer+"%":""}</div>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </td>
                        </tr>
                        <tr>
                            <td>
                            <FormItem label="收费方" {...formInfo} >
                                {getFieldDecorator('serviceFeeReceiver', {
                                })(
                                    <div style={{fontSize:"14px"}}>{this.props.product.serviceFeeReceiver}</div>
                                )}
                            </FormItem>
                            </td>
                            <td />
                        </tr>
                        <tr>
                            <td className="table_title" rowSpan="2">
                            其他费用 
                            </td>
                            <td>
                            <Row style={{marginBottom:"10px"}}>
                            <Col span={5} style={{textAlign:'left',fontSize:'14px',color:"#7F8FA4"}}>支付方式</Col>
                            <Col span={8} style={{fontSize:'14px',color:"#000"}}>{this.state.product?pay[this.state.product.otherFeeType]:""}</Col>
                        </Row>
                            </td>
                            <td />
                        </tr>
                        <tr>
                            <td>
                            <FormItem label="支付金额" {...formInfo}>
                                {getFieldDecorator('otherFeePer', {
                                })(
                                    <div style={{fontSize:"14px"}}>{this.props.product.otherFeePer}%*商业险金额</div>
                                )}
                            </FormItem>
                            </td>
                            <td>
                                <Row>
                                    <Col span={12}>
                                        <FormItem className="tableForm">
                                            {getFieldDecorator('otherFeeUserPer', {
                                            })(
                                                <div style={{fontSize:"14px"}}>{this.state.repayData.otherFeeUserPer?"客户还款"+this.state.repayData.otherFeeUserPer+"%":""}</div>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12} >
                                        <FormItem className="tableForm">
                                            {getFieldDecorator('otherFeePayerPer', {
                                            })(
                                                <div style={{fontSize:"14px"}}>{this.state.repayData.otherFeePayerPer?"商家代偿"+this.state.repayData.otherFeePayerPer+"%":""}</div>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </td>
                        </tr>
                        <tr>
                            <td className="table_title">
                            逾期罚息 
                            </td>
                            <td>
                            <FormItem label="" {...formInfo} >
                    {getFieldDecorator('lateFeePer', {

                    })(
                        <div style={{fontSize:"14px"}}>{this.props.product.lateFeePer}%*应还金额</div>
                    )}
                </FormItem>
                            </td>
                            <td>
                                <Row>
                                    <Col span={12}>
                                        <FormItem className="tableForm" >
                                            {getFieldDecorator('lateFeeUserPer', {
                                            })(
                                                <div style={{fontSize:"14px"}}>{this.state.repayData.lateFeeUserPer?"客户还款"+this.state.repayData.lateFeeUserPer+"%":""}</div>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12} className="tableForm">
                                        <FormItem >
                                            {getFieldDecorator('lateFeePayerPer', {
                                            })(
                                                <div style={{fontSize:"14px"}}>{this.state.repayData.lateFeePayerPer?"商家代偿"+this.state.repayData.lateFeePayerPer+"%":""}</div>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </td>
                        </tr>
                        <tr>
                            <td className="table_title">
                            提前还款违约金 
                            </td>
                            <td>
                            <FormItem label="" {...formInfo} >
                    {getFieldDecorator('penaltyFeePer', {
                    })(
                        <div style={{fontSize:"14px"}}>{this.props.product.penaltyFeePer}%*应还金额</div>
                    )}
                </FormItem>
                            </td>
                            <td>
                                <Row>
                                    <Col span={12}>
                                        <FormItem className="tableForm">
                                            {getFieldDecorator('penaltyFeeUserPer', {
                                            })(
                                                <div style={{fontSize:"14px"}}>{this.state.repayData.penaltyFeeUserPer?"客户还款"+this.state.repayData.penaltyFeeUserPer+"%":""}</div>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12} >
                                        <FormItem className="tableForm">
                                            {getFieldDecorator('penaltyFeePayerPer', {
                                            })(
                                                <div style={{fontSize:"14px"}}>{this.state.repayData.penaltyFeePayerPer?"商家代偿"+this.state.repayData.penaltyFeePayerPer+"%":""}</div>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </td>
                        </tr>
                        <tr>
                            <td className="table_title">
                            是否代收代付交强险、车船税 
                            </td>
                            <td>
                            <FormItem label="" {...formInfo} className="texthh" >
                    {getFieldDecorator('haveJqxccs', {
                    })(
                        <div style={{fontSize:"14px"}}>{this.props.product.haveJqxccs?"是":"否"}</div>
                    )}
                </FormItem>
                            </td>
                            <td />
                        </tr>
                        <tr>
                            <td className="table_title">
                            期数 
                            </td>
                            <td>
                            <FormItem label="" {...formInfo} >
                    {getFieldDecorator('period', {
                    })(
                        <div style={{fontSize:"14px"}}>{this.props.product.period}期</div>
                    )}
                </FormItem>
                            </td>
                            <td />
                        </tr>
                        <tr>
                            <td className="table_title">
                            业务类型 
                            </td>
                            <td>
                            <FormItem label="" {...formInfo} className="texthh" >
                    {getFieldDecorator('loanBasis', {
                    })(
                        <div style={{fontSize:"14px"}}>{this.props.product.loanBasis?"投保单":"保单"}</div>
                    )}
                </FormItem>
                            </td>
                            <td />
                        </tr>
                        <tr>
                            <td className="table_title">
                            投保单/保单数量 
                            </td>
                            <td>
                            <FormItem label="" {...formInfo} className="texthh" >
                    {getFieldDecorator('insuranceSize', {
                        rules:[{required:true,message:"请选择"}]
                    })(
                        <div style={{fontSize:"14px"}}>{this.props.product.insuranceSize}</div>
                    )}
                </FormItem>
                            </td>
                            <td />
                        </tr>
                        <tr>
                            <td className="table_title">
                            是否需商户审核 
                            </td>
                            <td>
                            <FormItem label="" wrapperCol={{span:12}} className="texthh" >
                    {getFieldDecorator('enableAudit', {
                    })(
                        
                        <div style={{fontSize:"14px"}}>{this.props.product.enableAudit?"需商户审核":"不需商户审核"}</div>
                    )}
                </FormItem>
                            </td>
                            <td />
                        </tr>
                        <tr>
                            <td className="table_title">
                            签约是否前置 
                            </td>
                            <td>
                            <FormItem label="" {...formInfo} className="texthh" >
                    {getFieldDecorator('preSign', {
                    })(
                        <div style={{fontSize:"14px"}}>{this.props.product.preSign?"是":"否"}</div>
                    )}
                </FormItem>
                            </td>
                            <td />
                        </tr>
                        <tr>
                            <td className="table_title">
                            合同模版 
                            </td>
                            <td>
                            <FormItem label="" className="texthh" >
                    {getFieldDecorator('protocolTemplateId', {
                    })(
                        <div style={{fontSize:"14px"}}>{this.state.protocolTemplate}</div>
                    )}
                </FormItem>
                            </td>
                            <td />
                        </tr>
                    </tbody>
                    
                </table>
            </div>
        )

    }
}
export default Form.create()(Product);