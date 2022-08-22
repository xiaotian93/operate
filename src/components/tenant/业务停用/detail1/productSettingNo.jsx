import React, { Component } from 'react';
import {Row,Col,Form} from 'antd';
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
            productSetting:{}
        };
    }
    componentWillMount(){
        if(this.state.id){
            setTimeout(()=>{
                this.detailData()
            },200)
        }
    }
    discount1(e){
        this.setState({
            discount1:e.target.value
        });
        this.props.form.setFieldsValue({discount1Payer:e.target.value})
    }
    discount2(e){
        this.setState({
            discount2:e.target.value
        });
        this.props.form.setFieldsValue({discount2Payer:e.target.value})
    }
    discount3(e){
        this.setState({
            discount3:e.target.value
        });
        this.props.form.setFieldsValue({discount3Payer:e.target.value})
    }
    detailData(){
        var data=JSON.parse(window.localStorage.getItem("detail"));
        var productSettings=data.productSettings;
        for(var pp in productSettings){
            if(this.state.product.id===productSettings[pp].productId){
                this.setState({
                    productSetting:productSettings[pp]
                })

            }
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formInfo={
            labelCol:{span:4},
            wrapperCol:{span:6},
            colon:false
        };
        const formInfoSmall={
            labelCol:{span:4},
            wrapperCol:{span:3},
            colon:true,
            className:"textRight"
        };
        const jqx="是否代收代付交强税、车船税";
        var bzj={1:"渠道支付",2:"商户支付",3:"客户支付"};
        var pay={1:"放款前一次性支付",2:"首期还款日支付",3:"按期支付"};
        return (
            <Form className="sh_add">

                <Row style={{marginBottom:"30px"}} >
                    <Col span={12}>
                        <Row>
                            <Col span={8} style={{paddingRight:'10px',textAlign:'right',fontSize:'14px',color:"#7F8FA4"}}>产品名称:</Col>
                            <Col span={8} style={{fontSize:'14px',color:"#000"}}>{this.state.product.name}</Col>
                        </Row>
                    </Col>
                    <Col span={12} pull={8}>
                        <Row>
                            <Col span={8} style={{paddingRight:'10px',textAlign:'right',fontSize:'14px',color:"#7F8FA4"}}>产品编号:</Col>
                            <Col span={8} style={{fontSize:'14px',color:"#000"}}>{this.state.product.code}</Col>
                        </Row>
                    </Col>
                </Row>
                <FormItem label="借款金额" {...formInfoSmall} >
                    {getFieldDecorator('loanPer', {
                    })(
                        <div style={{fontSize:"14px"}}>{this.state.productSetting.loanPer}%*商业险金额</div>
                    )}
                </FormItem>
                {this.state.product.discount1Type?<Row style={{marginBottom:this.state.discount1==="3"?"0":"15px"}} >
                    <Col span={4} style={{paddingRight:'10px',textAlign:'right',fontSize:'14px',color:"#7F8FA4",marginTop:"5px"}} >保证金1:</Col>
                    <Col span={20} >
                        <Row>
                            <Col span={4} style={{marginTop:"5px"}} className="radioText" >
                                <div style={{fontSize:"14px"}}>{bzj[this.state.productSetting.discount1Payer]}</div>
                            </Col>
                            {
                                this.state.productSetting.discount1Qudao?<Col>
                                    <Col span={7} pull={2} >
                                        <FormItem label="支付账户" labelCol={{span:10}} wrapperCol={{span:12}} colon={false} >
                                            {getFieldDecorator('discount1Qudao', {
                                            })(
                                                <div style={{fontSize:"14px"}}>{this.state.productSetting.discount1Qudao}</div>
                                            )}
                                        </FormItem>
                                    </Col>

                                </Col>:null
                            }
                            <Col span={7} pull={2} >
                                <FormItem label="支付金额" labelCol={{span:10}} wrapperCol={{span:12}} colon={false} >
                                    {getFieldDecorator('discount1Per', {
                                    })(
                                        <div style={{fontSize:"14px"}}>{this.state.productSetting.discount1Per}%*商业险金额</div>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>
                </Row>:null}
                {this.state.product.discount2Type?<Row style={{marginBottom:this.state.discount2==="3"?"0":"15px"}} >
                    <Col span={4} style={{paddingRight:'10px',textAlign:'right',fontSize:'14px',color:"#7F8FA4",marginTop:"5px"}} >保证金2:</Col>
                    <Col span={20} >
                        <Row>
                            <Col span={4} style={{marginTop:"5px"}} className="radioText" >
                                <div style={{fontSize:"14px"}}>{bzj[this.state.productSetting.discount2Payer]}</div>
                            </Col>
                            {
                                this.state.productSetting.discount2Qudao?<Col>
                                    <Col span={7} pull={2} >
                                        <FormItem label="支付账户" labelCol={{span:10}} wrapperCol={{span:12}} colon={false} >
                                            {getFieldDecorator('discount2Qudao', {
                                            })(
                                                <div style={{fontSize:"14px"}}>{this.state.productSetting.discount2Qudao}</div>
                                            )}
                                        </FormItem>
                                    </Col>

                                </Col>:null
                            }
                            <Col span={7} pull={2} >
                                <FormItem label="支付金额" labelCol={{span:10}} wrapperCol={{span:12}} colon={false} >
                                    {getFieldDecorator('discount2Per', {
                                    })(
                                        <div style={{fontSize:"14px"}}>{this.state.productSetting.discount2Per}%*商业险金额</div>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>
                </Row>:null}
                {this.state.product.discount3Type?<Row style={{marginBottom:this.state.discount3==="3"?"0":"15px"}}>
                    <Col span={4} style={{paddingRight:'10px',textAlign:'right',fontSize:'14px',color:"#7F8FA4",marginTop:"5px"}} >保证金3:</Col>
                    <Col span={20} >
                        <Row>
                            <Col span={4} style={{marginTop:"5px"}} className="radioText" >
                                <div style={{fontSize:"14px"}}>{bzj[this.state.productSetting.discount3Payer]}</div>
                            </Col>
                            {
                                this.state.productSetting.discount3Qudao?<Col>
                                    <Col span={7} pull={2} >
                                        <FormItem label="支付账户" labelCol={{span:10}} wrapperCol={{span:12}} colon={false} >
                                            {getFieldDecorator('discount3Qudao', {
                                            })(
                                                <div style={{fontSize:"14px"}}>{this.state.productSetting.discount3Qudao}</div>
                                            )}
                                        </FormItem>
                                    </Col>

                                </Col>:null
                            }
                            <Col span={7} pull={2} >
                                <FormItem label="支付金额" labelCol={{span:10}} wrapperCol={{span:12}} colon={false} >
                                    {getFieldDecorator('discount3Per', {
                                    })(
                                        <div style={{fontSize:"14px"}}>{this.state.productSetting.discount3Per}%*商业险金额</div>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>
                </Row>:null}
                <Row>
                    <Col span={4} style={{paddingRight:'10px',textAlign:'right',fontSize:'14px',color:"#7F8FA4",marginTop:"0"}} >利息:</Col>
                    <Col span={20} >
                        <Row style={{marginBottom:"10px"}}>
                            <Col span={2} style={{textAlign:'left',fontSize:'14px',color:"#7F8FA4"}}>支付方式</Col>
                            <Col span={8} style={{fontSize:'14px',color:"#000"}}>{pay[this.state.product.interestType]}</Col>
                        </Row>
                        <Row>
                            <Col span={2} style={{textAlign:'left',fontSize:'14px',color:"#7F8FA4",marginTop:"5px"}}>支付金额</Col>
                            <FormItem label="" wrapperCol={{span:5}} colon={false} className="textLeft" >
                                {getFieldDecorator('interestPer', {
                                })(
                                    <div style={{fontSize:"14px"}}>{this.state.productSetting.interestPer}%*商业险金额</div>
                                )}
                            </FormItem>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col span={4} style={{paddingRight:'10px',textAlign:'right',fontSize:'14px',color:"#7F8FA4",marginTop:"0"}} >服务费:</Col>
                    <Col span={20} >
                        <Row style={{marginBottom:"10px"}}>
                            <Col span={2} style={{textAlign:'left',fontSize:'14px',color:"#7F8FA4"}}>支付方式</Col>
                            <Col span={8} style={{fontSize:'14px',color:"#000"}}>{pay[this.state.product.serviceFeeType]}</Col>
                        </Row>
                        <Row>
                            <Col span={2} style={{textAlign:'left',fontSize:'14px',color:"#7F8FA4",marginTop:"5px"}}>支付金额</Col>
                            <FormItem label="" wrapperCol={{span:5}} colon={false} className="textLeft" >
                                {getFieldDecorator('serviceFeePer', {
                                })(
                                    <div style={{fontSize:"14px"}}>{this.state.productSetting.serviceFeePer}%*商业险金额</div>
                                )}
                            </FormItem>
                        </Row>
                        <Row>
                            <Col span={2} style={{textAlign:'left',fontSize:'14px',color:"#7F8FA4",marginTop:"5px"}}>收费方</Col>
                            <FormItem label="" wrapperCol={{span:5}} colon={false} className="textLeft" >
                                {getFieldDecorator('serviceFeeReceiver', {
                                })(
                                    <div style={{fontSize:"14px"}}>{this.state.productSetting.serviceFeeReceiver}</div>
                                )}
                            </FormItem>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col span={4} style={{paddingRight:'10px',textAlign:'right',fontSize:'14px',color:"#7F8FA4",marginTop:"0"}} >其他费用:</Col>
                    <Col span={20} >
                        <Row style={{marginBottom:"10px"}}>
                            <Col span={2} style={{textAlign:'left',fontSize:'14px',color:"#7F8FA4"}}>支付方式</Col>
                            <Col span={8} style={{fontSize:'14px',color:"#000"}}>{pay[this.state.product.otherFeeType]}</Col>
                        </Row>
                        <Row>
                            <Col span={2} style={{textAlign:'left',fontSize:'14px',color:"#7F8FA4",marginTop:"5px"}}>支付金额</Col>
                            <FormItem label="" wrapperCol={{span:5}} colon={false} className="textLeft" >
                                {getFieldDecorator('otherFeePer', {
                                })(
                                    <div style={{fontSize:"14px"}}>{this.state.productSetting.otherFeePer}%*商业险金额</div>
                                )}
                            </FormItem>
                        </Row>
                    </Col>
                </Row>
                <FormItem label="逾期罚息" {...formInfoSmall} >
                    {getFieldDecorator('lateFeePer', {
                    })(
                        <div style={{fontSize:"14px"}}>{this.state.productSetting.lateFeePer}%</div>
                    )}
                </FormItem>
                <FormItem label={jqx} {...formInfo} className="texthh" >
                    {getFieldDecorator('haveJqxccs', {
                    })(
                        <div style={{fontSize:"14px"}}>{this.state.productSetting.haveJqxccs?"是":"否"}</div>
                    )}
                </FormItem>
                <FormItem label="期数" {...formInfoSmall} >
                    {getFieldDecorator('period', {
                    })(
                        <div style={{fontSize:"14px"}}>{this.state.productSetting.period}期</div>

                    )}
                </FormItem>
            </Form>
        )

    }
}
export default Form.create()(Product);