import React, { Component } from 'react';
import {Row,Col,Form,Select,Input,Radio} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
class Product extends Component{
    constructor(props) {
        super(props);
        // props.onRef(this);
        this.state = {
            discount1:'',
            discount2:'',
            discount3:'',
            discount1Show:1,
            discount2Show:1,
            discount3Show:1,
            product:props.product,
            id:props.id,
            productDetail:""
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
        for(var i=1;i<4;i++){
            if(i.toString()===e.target.value||i.toString()===this.state.discount2||i.toString()===this.state.discount3){
                this.setState({
                    ["discount2_"+e.target.value]:true,
                    ["discount3_"+e.target.value]:true
                });
            }else{
                this.setState({
                    ["discount2_"+i]:false,
                    ["discount3_"+i]:false
                });
            }
        }
        this.setState({
            discount1:e.target.value
        });
        this.props.form.setFieldsValue({discount1Payer:e.target.value})
    }
    discount2(e){
        for(var i=1;i<4;i++){
            if(i.toString()===e.target.value||i.toString()===this.state.discount1||i.toString()===this.state.discount3){
                this.setState({
                    ["discount1_"+e.target.value]:true,
                    ["discount3_"+e.target.value]:true
                });
            }else{
                this.setState({
                    ["discount1_"+i]:false,
                    ["discount3_"+i]:false
                });
            }
        }
        this.setState({
            discount2:e.target.value
        });
        this.props.form.setFieldsValue({discount2Payer:e.target.value})
    }
    discount3(e){
        for(var i=1;i<4;i++){
            if(i.toString()===e.target.value||i.toString()===this.state.discount1||i.toString()===this.state.discount2){
                this.setState({
                    ["discount2_"+e.target.value]:true,
                    ["discount1_"+e.target.value]:true
                });
            }else{
                this.setState({
                    ["discount2_"+i]:false,
                    ["discount1_"+i]:false
                });
            }
        }
        this.setState({
            discount3:e.target.value
        });
        this.props.form.setFieldsValue({discount3Payer:e.target.value})
    }
    detailData(){
        var data=JSON.parse(window.localStorage.getItem("detail"));
        var productSettings=data.productSettings;
        for(var pp in productSettings){
            //console.log(productSettings[pp].productId+'=='+basic.productIds[pi])
            if(this.state.product.id===productSettings[pp].productId){
                for(var pj in productSettings[pp]){
                    if(pj==="discount1Payer"&&productSettings[pp][pj]){
                        var dis1="discount1Per_"+productSettings[pp].discount1Payer;
                        this.setState({discount1:productSettings[pp][pj].toString()});

                        this.props.form.setFieldsValue({"discount1Payer":productSettings[pp][pj],[dis1]:productSettings[pp].discount1Per})
                    }else if(pj==="discount2Payer"&&productSettings[pp][pj]){
                        var dis2="discount2Per_"+productSettings[pp].discount2Payer;
                        this.setState({discount2:productSettings[pp][pj].toString()});

                        this.props.form.setFieldsValue({"discount2Payer":productSettings[pp][pj],[dis2]:productSettings[pp].discount2Per})
                    }else if(pj==="discount3Payer"&&productSettings[pp][pj]){
                        var dis3="discount3Per_"+productSettings[pp].discount3Payer;
                        this.setState({discount3:productSettings[pp][pj].toString()});

                        this.props.form.setFieldsValue({"discount3Payer":productSettings[pp][pj],[dis3]:productSettings[pp].discount3Per})
                    }else if(pj==="haveJqxccs"){
                        this.props.form.setFieldsValue({"haveJqxccs":productSettings[pp].haveJqxccs.toString()})
                    }else if(pj!=="discount1Per"&&pj!=="discount2Per"&&pj!=="discount3Per"&&pj!=="discount1Qudao"&&pj!=="discount2Qudao"&&pj!=="discount3Qudao"&&pj!=="discount1Payer"&&pj!=="discount2Payer"&&pj!=="discount3Payer"){
                        this.props.form.setFieldsValue({[pj]:productSettings[pp][pj]})
                    }
                }

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
            colon:false,
            className:"textRight"
        };
        const jqx="???????????????????????????????????????";
        var pay={1:"????????????????????????",2:"?????????????????????",3:"????????????"};
        return (
            <div className="sh_add_card">
                <Row style={{marginBottom:"30px"}}  >
                    <Col span={12}>
                        <Row>
                            <Col span={8} style={{paddingRight:'20px',textAlign:'right',fontSize:'14px',color:"#7F8FA4"}}>????????????</Col>
                            <Col span={8} style={{fontSize:'14px',color:"#000"}}>{this.state.product?this.state.product.name:""}</Col>
                        </Row>
                    </Col>
                    <Col span={12} pull={8}>
                        <Row>
                            <Col span={8} style={{paddingRight:'15px',textAlign:'right',fontSize:'14px',color:"#7F8FA4"}}>????????????</Col>
                            <Col span={8} style={{fontSize:'14px',color:"#000"}}>{this.state.product?this.state.product.code:""}</Col>
                        </Row>
                    </Col>
                </Row>
                <table>
                    <tr>
                        <td>
                        ???????????? 
                        </td>
                        <td>
                        <FormItem label="" {...formInfoSmall} >
                    {getFieldDecorator('loanPer', {
                        initialValue:"",
                        rules:[{required:true,message:"?????????????????????"},{pattern:/^([1-9]\d?(\.\d{1,2})?|0\.\d{1,2}|100)$/,message:"????????????"}]
                    })(
                        <Input />
                    )}
                    <div className="formIcon" >%</div>
                    <div className="formText" >*???????????????</div>
                </FormItem>
                        </td>
                    </tr>
                </table>
                <FormItem label="" style={{marginBottom:"0!important"}} className="bottom" >
                    {getFieldDecorator('name', {
                        initialValue:this.state.product?this.state.product.name:""
                    })(
                        <div />
                    )}
                </FormItem>
                <FormItem label="????????????" {...formInfoSmall} >
                    {getFieldDecorator('loanPer', {
                        initialValue:"",
                        rules:[{required:true,message:"?????????????????????"},{pattern:/^([1-9]\d?(\.\d{1,2})?|0\.\d{1,2}|100)$/,message:"????????????"}]
                    })(
                        <Input />
                    )}
                    <div className="formIcon" >%</div>
                    <div className="formText" >*???????????????</div>
                </FormItem>
                {(this.state.product?this.state.product.discount1Type:"")?<Row style={{marginBottom:this.state.discount1==="3"?"0":"15px"}} >
                    <Col span={4} style={{paddingRight:'20px',textAlign:'right',fontSize:'14px',color:"#7F8FA4",marginTop:"5px"}} >?????????1<span style={{color:"#f04134"}}>*</span></Col>
                    <Col span={20} >
                        <FormItem label="" style={{marginBottom:"0!important"}} className="bottom" >
                            {getFieldDecorator('discount1Payer', {
                                rules:[{required:true,message:"??????????????????1????????????"}]
                            })(
                                <div />
                            )}
                        </FormItem>
                        <RadioGroup style={{width:"100%"}} onChange={this.discount1.bind(this)} value={this.state.discount1} >
                            <Row>
                                <Col span={3} style={{marginTop:"5px"}} className="radioText" >
                                    <Radio value="1" disabled={this.state.discount1_1} >????????????</Radio>
                                </Col>
                                {
                                    this.state.discount1==="1"?<Col>
                                        <Col span={7} >
                                            <FormItem label="????????????" labelCol={{span:10}} wrapperCol={{span:12}} colon={false} className="textRight" >
                                                {getFieldDecorator('discount1Per_1', {
                                                    initialValue:"",
                                                    rules:[{pattern:/^([1-9]\d?(\.\d{1,2})?|0\.\d{1,2}|100)$/,message:"????????????"},{required:true,message:"?????????????????????"}]
                                                })(
                                                    <Input />
                                                )}
                                                <div className="formIcon" >%</div>
                                                <div className="formText" >*???????????????</div>
                                            </FormItem>
                                        </Col>
                                    </Col>:null
                                }

                            </Row>
                            <Row>
                                <Col span={3} style={{marginTop:"5px"}} className="radioText" >
                                    <Radio value="2" disabled={this.state.discount1_2} >????????????</Radio>
                                </Col>
                                {
                                    this.state.discount1==="2"?<Col span={7} disabled="true" >
                                        <FormItem label="????????????" labelCol={{span:10}} wrapperCol={{span:12}} colon={false} className="textRight" >
                                            {getFieldDecorator('discount1Per_2', {
                                                initialValue:"",
                                                rules:[{pattern:/^([1-9]\d?(\.\d{1,2})?|0\.\d{1,2}|100)$/,message:"????????????"},{required:true,message:"?????????????????????"}]
                                            })(
                                                <Input />
                                            )}
                                            <div className="formIcon" >%</div>
                                            <div className="formText" >*???????????????</div>
                                        </FormItem>
                                    </Col>:null
                                }

                            </Row>
                            <Row style={{marginTop:this.state.discount1==="3"?"15px":"0px"}}>
                                <Col span={3} style={{marginTop:this.state.discount1==="3"?"5px":"5px"}} className="radioText" >
                                    <Radio value="3" disabled={this.state.discount1_3} >????????????</Radio>
                                </Col>
                                {
                                    this.state.discount1==="3"?<Col span={7} disabled="true" >
                                        <FormItem label="????????????" labelCol={{span:10}} wrapperCol={{span:12}} colon={false} className="textRight" >
                                            {getFieldDecorator('discount1Per_3', {
                                                initialValue:"",
                                                rules:[{pattern:/^([1-9]\d?(\.\d{1,2})?|0\.\d{1,2}|100)$/,message:"????????????"},{required:true,message:"?????????????????????"}]
                                            })(
                                                <Input />
                                            )}
                                            <div className="formIcon" >%</div>
                                            <div className="formText" >*???????????????</div>
                                        </FormItem>
                                    </Col>:null
                                }

                            </Row>
                        </RadioGroup>
                    </Col>
                </Row>:null}
                {(this.state.product?this.state.product.discount2Type:"")?<Row style={{marginBottom:this.state.discount2==="3"?"0":"15px"}} >
                    <Col span={4} style={{paddingRight:'20px',textAlign:'right',fontSize:'14px',color:"#7F8FA4",marginTop:"5px"}} >?????????2<span style={{color:"#f04134"}}>*</span></Col>
                    <Col span={20} >
                        <FormItem label="" style={{marginBottom:"0!important"}} className="bottom" >
                            {getFieldDecorator('discount2Payer', {
                                initialValue:"",
                                rules:[{required:true,message:"??????????????????2????????????"}]
                            })(
                                <div />
                            )}
                        </FormItem>
                        <RadioGroup style={{width:"100%"}} onChange={this.discount2.bind(this)} value={this.state.discount2} >
                            <Row>
                                <Col span={3} style={{marginTop:"5px"}} className="radioText" >
                                    <Radio value="1" disabled={this.state.discount2_1} >????????????</Radio>
                                </Col>
                                {
                                    this.state.discount2==="1"?<Col>
                                        <Col span={7} >
                                            <FormItem label="????????????" labelCol={{span:10}} wrapperCol={{span:12}} colon={false} className="textRight" >
                                                {getFieldDecorator('discount2Per_1', {
                                                    initialValue:"",
                                                    rules:[{pattern:/^([1-9]\d?(\.\d{1,2})?|0\.\d{1,2}|100)$/,message:"????????????"},{required:true,message:"?????????????????????"}]
                                                })(
                                                    <Input />
                                                )}
                                                <div className="formIcon" >%</div>
                                                <div className="formText" >*???????????????</div>
                                            </FormItem>
                                        </Col>
                                    </Col>:null
                                }

                            </Row>
                            <Row>
                                <Col span={3} style={{marginTop:"5px"}} className="radioText" >
                                    <Radio value="2" disabled={this.state.discount2_2} >????????????</Radio>
                                </Col>
                                {
                                    this.state.discount2==="2"?<Col span={7} disabled="true" >
                                        <FormItem label="????????????" labelCol={{span:10}} wrapperCol={{span:12}} colon={false} className="textRight" >
                                            {getFieldDecorator('discount2Per_2', {
                                                initialValue:"",
                                                rules:[{pattern:/^([1-9]\d?(\.\d{1,2})?|0\.\d{1,2}|100)$/,message:"????????????"},{required:true,message:"?????????????????????"}]
                                            })(
                                                <Input />
                                            )}
                                            <div className="formIcon" >%</div>
                                            <div className="formText" >*???????????????</div>
                                        </FormItem>
                                    </Col>:null
                                }

                            </Row>
                            <Row style={{marginTop:this.state.discount2==="3"?"15px":"0px"}}>
                                <Col span={3} style={{marginTop:"5px"}} className="radioText" >
                                    <Radio value="3" disabled={this.state.discount2_3} >????????????</Radio>
                                </Col>
                                {
                                    this.state.discount2==="3"?<Col span={7} disabled="true" >
                                        <FormItem label="????????????" labelCol={{span:10}} wrapperCol={{span:12}} colon={false} className="textRight" >
                                            {getFieldDecorator('discount2Per_3', {
                                                initialValue:"",
                                                rules:[{pattern:/^([1-9]\d?(\.\d{1,2})?|0\.\d{1,2}|100)$/,message:"????????????"},{required:true,message:"?????????????????????"}]
                                            })(
                                                <Input />
                                            )}
                                            <div className="formIcon" >%</div>
                                            <div className="formText" >*???????????????</div>
                                        </FormItem>
                                    </Col>:null
                                }

                            </Row>
                        </RadioGroup>
                    </Col>
                </Row>:null}
                {(this.state.product?this.state.product.discount3Type:"")?<Row style={{marginBottom:this.state.discount3==="3"?"0":"15px"}}>
                    <Col span={4} style={{paddingRight:'20px',textAlign:'right',fontSize:'14px',color:"#7F8FA4",marginTop:"5px"}} >?????????3<span style={{color:"#f04134"}}>*</span></Col>
                    <Col span={20} >
                        <FormItem label="" style={{marginBottom:"0!important"}} className="bottom" >
                            {getFieldDecorator('discount3Payer', {
                                initialValue:"",
                                rules:[{required:true,message:"??????????????????3????????????"}]
                            })(
                                <div />
                            )}
                        </FormItem>
                        <RadioGroup style={{width:"100%"}} onChange={this.discount3.bind(this)} value={this.state.discount3} >
                            <Row>
                                <Col span={3} style={{marginTop:"5px"}} className="radioText" >
                                    <Radio value="1" disabled={this.state.discount3_1} >????????????</Radio>
                                </Col>
                                {
                                    this.state.discount3==="1"?<Col>
                                        <Col span={7} >
                                            <FormItem label="????????????" labelCol={{span:10}} wrapperCol={{span:12}} colon={false} className="textRight" >
                                                {getFieldDecorator('discount3Per_1', {
                                                    initialValue:"",
                                                    rules:[{pattern:/^([1-9]\d?(\.\d{1,2})?|0\.\d{1,2}|100)$/,message:"????????????"},{required:true,message:"?????????????????????"}]
                                                })(
                                                    <Input />
                                                )}
                                                <div className="formIcon" >%</div>
                                                <div className="formText" >*???????????????</div>
                                            </FormItem>
                                        </Col>
                                    </Col>:null
                                }

                            </Row>
                            <Row>
                                <Col span={3} style={{marginTop:"5px"}} className="radioText" >
                                    <Radio value="2" disabled={this.state.discount3_2} >????????????</Radio>
                                </Col>
                                {
                                    this.state.discount3==="2"?<Col span={7} disabled="true" >
                                        <FormItem label="????????????" labelCol={{span:10}} wrapperCol={{span:12}} colon={false} className="textRight" >
                                            {getFieldDecorator('discount3Per_2', {
                                                initialValue:"",
                                                rules:[{pattern:/^([1-9]\d?(\.\d{1,2})?|0\.\d{1,2}|100)$/,message:"????????????"},{required:true,message:"?????????????????????"}]
                                            })(
                                                <Input />
                                            )}
                                            <div className="formIcon" >%</div>
                                            <div className="formText" >*???????????????</div>
                                        </FormItem>
                                    </Col>:null
                                }

                            </Row>
                            <Row style={{marginTop:this.state.discount3==="3"?"15px":"0px"}}>
                                <Col span={3} style={{marginTop:this.state.discount1==="3"?"5px":"5px"}} className="radioText" >
                                    <Radio value="3" disabled={this.state.discount3_3} >????????????</Radio>
                                </Col>
                                {
                                    this.state.discount3==="3"?<Col span={7} disabled="true" >
                                        <FormItem label="????????????" labelCol={{span:10}} wrapperCol={{span:12}} colon={false} className="textRight" >
                                            {getFieldDecorator('discount3Per_3', {
                                                initialValue:"",
                                                rules:[{pattern:/^([1-9]\d?(\.\d{1,2})?|0\.\d{1,2}|100)$/,message:"????????????"},{required:true,message:"?????????????????????"}]
                                            })(
                                                <Input />
                                            )}
                                            <div className="formIcon" >%</div>
                                            <div className="formText" >*???????????????</div>
                                        </FormItem>
                                    </Col>:null
                                }

                            </Row>
                        </RadioGroup>
                    </Col>
                </Row>:null}
                <Row>
                    <Col span={4} style={{paddingRight:'20px',textAlign:'right',fontSize:'14px',color:"#7F8FA4",marginTop:"5px"}} >??????<span style={{color:"#f04134"}}>*</span></Col>
                    <Col span={20} >
                        <Row style={{marginBottom:"10px"}}>
                            <Col span={2} style={{textAlign:'left',fontSize:'14px',color:"#7F8FA4"}}>????????????</Col>
                            <Col span={8} style={{fontSize:'14px',color:"#000"}}>{this.state.product?pay[this.state.product.interestType]:""}</Col>
                        </Row>
                        <Row>
                            <Col span={2} style={{textAlign:'left',fontSize:'14px',color:"#7F8FA4",marginTop:"5px"}}>????????????</Col>
                            <FormItem label="" wrapperCol={{span:3}} colon={false} className="textRight" >
                                {getFieldDecorator('interestPer', {
                                    initialValue:"",
                                    rules:[{required:true,message:"?????????????????????"},{pattern:/^([0-9]\d?(\.\d{1,2})?|0\.\d{1,2}|100)$/,message:"????????????"}]
                                })(
                                    <Input />
                                )}
                                <div className="formIcon" >%</div>
                                <div className="formText" >*???????????????</div>
                            </FormItem>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col span={4} style={{paddingRight:'20px',textAlign:'right',fontSize:'14px',color:"#7F8FA4",marginTop:"5px"}} >?????????<span style={{color:"#f04134"}}>*</span></Col>
                    <Col span={20} >
                        <Row style={{marginBottom:"10px"}}>
                            <Col span={2} style={{textAlign:'left',fontSize:'14px',color:"#7F8FA4"}}>????????????</Col>
                            <Col span={8} style={{fontSize:'14px',color:"#000"}}>{this.state.product?pay[this.state.product.serviceFeeType]:""}</Col>
                        </Row>
                        <Row>
                            <Col span={2} style={{textAlign:'left',fontSize:'14px',color:"#7F8FA4",marginTop:"5px"}}>????????????</Col>
                            <FormItem label="" wrapperCol={{span:3}} colon={false} className="textRight" >
                                {getFieldDecorator('serviceFeePer', {
                                    initialValue:"",
                                    rules:[{required:true,message:"?????????????????????"},{pattern:/^([0-9]\d?(\.\d{1,2})?|0\.\d{1,2}|100)$/,message:"????????????"}]
                                })(
                                    <Input />
                                )}
                                <div className="formIcon" >%</div>
                                <div className="formText" >*???????????????</div>
                            </FormItem>
                        </Row>
                        <Row>
                            <Col span={2} style={{textAlign:'left',fontSize:'14px',color:"#7F8FA4",marginTop:"5px"}}>?????????</Col>
                            <FormItem label="" wrapperCol={{span:3}} colon={false} className="textLeft" >
                                {getFieldDecorator('serviceFeeReceiver', {
                                    rules:[{required:true,message:"??????????????????"}]
                                })(
                                    <Select placeholder="??????????????????">
                                        <Option value="????????????" >????????????</Option>
                                        <Option value="????????????" >????????????</Option>
                                        <Option value="????????????" >????????????</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col span={4} style={{paddingRight:'20px',textAlign:'right',fontSize:'14px',color:"#7F8FA4",marginTop:"5px"}} >????????????<span style={{color:"#f04134"}}>*</span></Col>
                    <Col span={20} >
                        <Row style={{marginBottom:"10px"}}>
                            <Col span={2} style={{textAlign:'left',fontSize:'14px',color:"#7F8FA4"}}>????????????</Col>
                            <Col span={8} style={{fontSize:'14px',color:"#000"}}>{this.state.product?pay[this.state.product.otherFeeType]:""}</Col>
                        </Row>
                        <Row>
                            <Col span={2} style={{textAlign:'left',fontSize:'14px',color:"#7F8FA4",marginTop:"5px"}}>????????????</Col>
                            <FormItem label="" wrapperCol={{span:3}} colon={false} className="textRight" >
                                {getFieldDecorator('otherFeePer', {
                                    initialValue:"",
                                    rules:[{required:true,message:"?????????????????????"},{pattern:/^([0-9]\d?(\.\d{1,2})?|0\.\d{1,2}|100)$/,message:"????????????"}]
                                })(
                                    <Input />
                                )}
                                <div className="formIcon" >%</div>
                                <div className="formText" >*???????????????</div>
                            </FormItem>
                        </Row>
                    </Col>
                </Row>
                <FormItem label="????????????" {...formInfoSmall} >
                    {getFieldDecorator('lateFeePer', {
                        initialValue:"",
                        rules:[{required:true,message:"?????????????????????"},{pattern:/^([0-9]\d?(\.\d{1,2})?|0\.\d{1,2}|100)$/,message:"????????????"}]

                    })(
                        <Input />
                    )}
                    <div className="formIcon" >%</div>
                </FormItem>
                <FormItem label={jqx} {...formInfo} className="texthh" >
                    {getFieldDecorator('haveJqxccs', {
                        initialValue:"",
                        rules:[{required:true,message:"?????????"}]
                    })(
                        <RadioGroup>
                            <Radio value="1" >???</Radio>
                            <Radio value="0" >???</Radio>
                        </RadioGroup>
                    )}
                </FormItem>
                <FormItem label="??????" {...formInfoSmall} >
                    {getFieldDecorator('period', {
                        initialValue:"",
                        rules:[{required:true,message:"???????????????"},{pattern:/^([1-9]|(1[0-9])|(2[0-4]))$/,message:"????????????"}]

                    })(
                        <Input />
                    )}
                    <div className="formText" >???</div>
                </FormItem>
                <FormItem label="" style={{marginBottom:"0!important"}} className="bottom" >
                    {getFieldDecorator('productId', {
                        initialValue:this.state.product?this.state.product.id:""
                    })(
                        <div />
                    )}
                </FormItem>
            </div>
        )

    }
}
export default Form.create()(Product);