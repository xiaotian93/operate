import React, { Component } from 'react';
import {Row,Col,Form,Select,Input,Radio} from 'antd';
import {merchant_tem} from '../../../ajax/api';
import {host_cxfq} from '../../../ajax/config';
import {axios_sh} from '../../../ajax/request';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
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
            tem:[]
        };
    }
    componentDidMount(){
        // this.props.form.resetFields();
        if(this.state.id){
            setTimeout(()=>{
                this.detailData()
            },200)
        }
        axios_sh.get(host_cxfq+merchant_tem).then(e=>{
            this.setState({
                tem:e.data
            })
        })
    }
    componentWillReceiveProps(){
        // this.detailData()
    }
    componentWillUnmount(){
        // alert("del")
        // this.props.form.resetFields();
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
        // this.props.form.setFieldsValue({discount1Payer:e.target.value})
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
        // this.props.form.setFieldsValue({discount2Payer:e.target.value})
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
        // this.props.form.setFieldsValue({discount3Payer:e.target.value})
    }
    detailData(){
        var data=JSON.parse(window.localStorage.getItem("productList"));
        var productSettings=JSON.parse(window.localStorage.getItem("detail")).productSettings;
        for(var i in data){
            if(data[i].id===this.props.product.productId){
                this.setState({
                    product:data[i]
                })
            }
        }
        // alert(1)
        
        var product_id=this.props.product.id?this.props.product.id:this.props.product.productId;
        // var productSettings=data.productSettings;
        // for(var pp in productSettings){
            //console.log(productSettings[pp].productId+'=='+basic.productIds[pi])
            // if(this.state.product.id===productSettings[pp].productId){
                for(var j in productSettings){
                    if(Number(productSettings[j].productId)===Number(product_id)){
                        // alert(1)
                        for(var pj in productSettings[j]){
                            if(pj==="discount1Payer"&&productSettings[j][pj]){
                            // alert(1)
                        // var dis1="discount1Per_"+productSettings.discount1Payer;
                        this.setState({discount1:productSettings[j][pj].toString()});

                        this.props.form.setFieldsValue({[pj]:productSettings[j][pj].toString()})
                    }else if(pj==="discount2Payer"&&productSettings[j][pj]){
                        // var dis2="discount2Per_"+productSettings.discount2Payer;
                        this.setState({discount2:productSettings[j][pj].toString()});

                        this.props.form.setFieldsValue({[pj]:productSettings[j][pj].toString()})
                    }else if(pj==="discount3Payer"&&productSettings[j][pj]){
                        // var dis3="discount3Per_"+productSettings.discount3Payer;
                        this.setState({discount3:productSettings[j][pj].toString()});

                        this.props.form.setFieldsValue({[pj]:productSettings[j][pj].toString()})
                    }else if(pj==="haveJqxccs"||pj==="protocolTemplateId"||pj==="enableAudit"||pj==="preSign"||pj==="loanBasis"){
                        this.props.form.setFieldsValue({[pj]:productSettings[j][pj]!==null?productSettings[j][pj].toString():""})
                    }else 
                    // if(pj!=="discount1Per"&&pj!=="discount2Per"&&pj!=="discount3Per"&&pj!=="discount1Qudao"&&pj!=="discount2Qudao"&&pj!=="discount3Qudao"&&pj!=="discount1Payer"&&pj!=="discount2Payer"&&pj!=="discount3Payer")
                    {
                        this.props.form.setFieldsValue({[pj]:productSettings[j][pj]})
                    }
                        }
                        
                        
                    }else{
                        // alert(2)
                        // this.props.form.resetFields();
                    }
                    
                }

            // }
        // }
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formInfo={
            labelCol:{span:5},
            wrapperCol:{span:8},
            colon:false
        };
        
        var pay={1:"????????????????????????",2:"?????????????????????",3:"????????????"};
        return (
            <div className="sh_add_card">
                <Row style={{marginBottom:"20px"}}>
                 <span style={{fontSize:'14px',color:"#7F8FA4",marginRight:"5px"}}>????????????</span>
                 <span style={{fontSize:'14px',color:"#000"}}>{this.state.product?this.state.product.name:""}</span>
                 <span style={{fontSize:'14px',color:"#7F8FA4",margin:"0 10px"}}>|</span>
                 <span style={{fontSize:'14px',color:"#7F8FA4",marginRight:"5px"}}>????????????</span>
                 <span style={{fontSize:'14px',color:"#000"}}>{this.state.product?this.state.product.code:""}</span>
                </Row>
                <table className="sh_product_table" cellSpacing="0" cellPadding="0">
                    <tbody>
                        <tr>
                            <td className="table_title">
                                ???????????? 
                            </td>
                            <td>
                                <FormItem label="" {...formInfo} >
                                {getFieldDecorator('loanPer', {
                                rules:[{required:true,message:"?????????????????????"},{pattern:/^([1-9]\d?(\.\d{1,2})?|0\.\d{1,2}|100)$/,message:"????????????"}]
                                })(
                                <Input placeholder="??????????????????" />
                                )}
                                <Row className="formIcon" >%</Row>
                                <Row className="formText" >*???????????????</Row>
                                </FormItem>
                            </td>
                        </tr>
                        {
                            (this.state.product?this.state.product.discount1Type:"")?
                        
                        <tr>
                            <td className="table_title" rowSpan="2">
                                ?????????1 
                            </td>
                            <td>
                                <FormItem label="" wrapperCol={{span:24}} >
                                {getFieldDecorator('discount1Payer', {
                                    initialValue:this.state.discount1,
                                rules:[{required:true,message:"?????????"},{pattern:/^([1-9]\d?(\.\d{1,2})?|0\.\d{1,2}|100)$/,message:"????????????"}]
                                })(
                                    <RadioGroup style={{width:"100%"}} onChange={this.discount1.bind(this)} >
                                        <Radio value="1" disabled={this.state.discount1_1} >????????????</Radio>
                                        <Radio value="2" disabled={this.state.discount1_2} >????????????</Radio>
                                        <Radio value="3" disabled={this.state.discount1_3} >????????????</Radio>
                                    </RadioGroup>
                                )}
                                </FormItem>
                            </td>
                        </tr>:null
                        }
                        {
                            (this.state.product?this.state.product.discount1Type:"")?
                        
                        <tr>
                            <td>
                                <FormItem label="????????????" {...formInfo} >
                                            {getFieldDecorator('discount1Per', {
                                                rules:[{pattern:/^([1-9]\d?(\.\d{1,2})?|0\.\d{1,2}|100)$/,message:"????????????"},{required:true,message:"?????????????????????"}]
                                            })(
                                                <Input placeholder="??????????????????" />
                                            )}
                                            <Row className="formIcon" >%</Row>
                                            <Row className="formText" >*???????????????</Row>
                                </FormItem>
                            </td>
                        </tr>:null
                        }
                        {
                            (this.state.product?this.state.product.discount2Type:"")?
                        <tr>
                            <td className="table_title" rowSpan="2">
                                ?????????2 
                            </td>
                            <td>
                                <FormItem label="" wrapperCol={{span:24}} >
                                {getFieldDecorator('discount2Payer', {
                                    initialValue:this.state.discount2,
                                rules:[{required:true,message:"?????????"},{pattern:/^([1-9]\d?(\.\d{1,2})?|0\.\d{1,2}|100)$/,message:"????????????"}]
                                })(
                                    <RadioGroup style={{width:"100%"}} onChange={this.discount2.bind(this)} >
                                        <Radio value="1" disabled={this.state.discount2_1} >????????????</Radio>
                                        <Radio value="2" disabled={this.state.discount2_2} >????????????</Radio>
                                        <Radio value="3" disabled={this.state.discount2_3} >????????????</Radio>
                                    </RadioGroup>
                                )}
                                </FormItem>
                            </td>
                        </tr>:null
                        }
                        {
                            (this.state.product?this.state.product.discount2Type:"")?
                        
                        <tr>
                            <td>
                                <FormItem label="????????????" {...formInfo} >
                                            {getFieldDecorator('discount2Per', {
                                                rules:[{pattern:/^([1-9]\d?(\.\d{1,2})?|0\.\d{1,2}|100)$/,message:"????????????"},{required:true,message:"?????????????????????"}]
                                            })(
                                                <Input placeholder="??????????????????" />
                                            )}
                                            <div className="formIcon" >%</div>
                                            <div className="formText" >*???????????????</div>
                                </FormItem>
                            </td>
                        </tr>:null
                        }
                        {
                            (this.state.product?this.state.product.discount3Type:"")?
                        
                        <tr>
                            <td className="table_title" rowSpan="2">
                                ?????????3 
                            </td>
                            <td>
                                <FormItem label="" wrapperCol={{span:24}} >
                                {getFieldDecorator('discount3Payer', {
                                    initialValue:this.state.discount3,
                                rules:[{required:true,message:"?????????"},{pattern:/^([1-9]\d?(\.\d{1,2})?|0\.\d{1,2}|100)$/,message:"????????????"}]
                                })(
                                    <RadioGroup style={{width:"100%"}} onChange={this.discount3.bind(this)} >
                                        <Radio value="1" disabled={this.state.discount3_1} >????????????</Radio>
                                        <Radio value="2" disabled={this.state.discount3_2} >????????????</Radio>
                                        <Radio value="3" disabled={this.state.discount3_3} >????????????</Radio>
                                    </RadioGroup>
                                )}
                                </FormItem>
                            </td>
                        </tr>:null
                        }
                        {
                            (this.state.product?this.state.product.discount3Type:"")?
                        
                        <tr>
                            <td>
                                <FormItem label="????????????" {...formInfo} >
                                            {getFieldDecorator('discount3Per', {
                                                rules:[{pattern:/^([1-9]\d?(\.\d{1,2})?|0\.\d{1,2}|100)$/,message:"????????????"},{required:true,message:"?????????????????????"}]
                                            })(
                                                <Input placeholder="??????????????????" />
                                            )}
                                            <div className="formIcon" >%</div>
                                            <div className="formText" >*???????????????</div>
                                </FormItem>
                            </td>
                        </tr>:null
                        }
                        <tr>
                            <td className="table_title" rowSpan="2">
                                ?????? 
                            </td>
                            <td>
                            <Row>
                            <Col span={5} style={{textAlign:'left',fontSize:'14px',color:"#7F8FA4"}}><label>????????????</label></Col>
                            <Col span={8} style={{fontSize:'14px',color:"#000"}}>{this.state.product?pay[this.state.product.interestType]:""}</Col>
                        </Row>
                            </td>
                        </tr>
                        <tr>
                            <td>
                            <FormItem label="????????????" {...formInfo} >
                                {getFieldDecorator('interestPer', {
                                    rules:[{required:true,message:"?????????????????????"},{pattern:/^([0-9]\d?(\.\d{1,2})?|0\.\d{1,2}|100)$/,message:"????????????"}]
                                })(
                                    <Input placeholder="??????????????????" />
                                )}
                                <div className="formIcon" >%</div>
                                <div className="formText" >*???????????????</div>
                            </FormItem>
                            </td>
                        </tr>
                        <tr>
                            <td className="table_title" rowSpan="3">
                            ????????? 
                            </td>
                            <td>
                            <Row>
                            <Col span={5} style={{textAlign:'left',fontSize:'14px',color:"#7F8FA4"}}>????????????</Col>
                            <Col span={8} style={{fontSize:'14px',color:"#000"}}>{this.state.product?pay[this.state.product.serviceFeeType]:""}</Col>
                        </Row>
                            </td>
                        </tr>
                        <tr>
                            <td>
                            <FormItem label="????????????" {...formInfo}>
                                {getFieldDecorator('serviceFeePer', {
                                    rules:[{required:true,message:"?????????????????????"},{pattern:/^([0-9]\d?(\.\d{1,2})?|0\.\d{1,2}|100)$/,message:"????????????"}]
                                })(
                                    <Input placeholder="??????????????????" />
                                )}
                                <div className="formIcon" >%</div>
                                <div className="formText" >*???????????????</div>
                            </FormItem>
                            </td>
                        </tr>
                        <tr>
                            <td>
                            <FormItem label="?????????" {...formInfo} >
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
                            </td>
                        </tr>
                        <tr>
                            <td className="table_title" rowSpan="2">
                            ???????????? 
                            </td>
                            <td>
                            <Row>
                            <Col span={5} style={{textAlign:'left',fontSize:'14px',color:"#7F8FA4"}}>????????????</Col>
                            <Col span={8} style={{fontSize:'14px',color:"#000"}}>{this.state.product?pay[this.state.product.otherFeeType]:""}</Col>
                        </Row>
                            </td>
                        </tr>
                        <tr>
                            <td>
                            <FormItem label="????????????" {...formInfo}>
                                {getFieldDecorator('otherFeePer', {
                                    rules:[{required:true,message:"?????????????????????"},{pattern:/^([0-9]\d?(\.\d{1,2})?|0\.\d{1,2}|100)$/,message:"????????????"}]
                                })(
                                    <Input placeholder="??????????????????" />
                                )}
                                <div className="formIcon" >%</div>
                                <div className="formText" >*???????????????</div>
                            </FormItem>
                            </td>
                        </tr>
                        <tr>
                            <td className="table_title">
                            ???????????? 
                            </td>
                            <td>
                            <FormItem label="" {...formInfo} >
                    {getFieldDecorator('lateFeePer', {
                        rules:[{required:true,message:"?????????????????????"},{pattern:/^([0-9]\d?(\.\d{1,2})?|0\.\d{1,2}|100)$/,message:"????????????"}]

                    })(
                        <Input placeholder="??????????????????" />
                    )}
                    <div className="formIcon" >%</div>
                    <div className="formText" >*????????????</div>
                </FormItem>
                            </td>
                        </tr>
                        <tr>
                            <td className="table_title">
                            ????????????????????? 
                            </td>
                            <td>
                            <FormItem label="" {...formInfo} >
                    {getFieldDecorator('penaltyFeePer', {
                        rules:[{required:true,message:"??????????????????????????????"},{pattern:/^([0-9]\d?(\.\d{1,2})?|0\.\d{1,2}|100)$/,message:"????????????"}]

                    })(
                        <Input placeholder="??????????????????" />
                    )}
                    <div className="formIcon" >%</div>
                    <div className="formText" >*????????????</div>
                </FormItem>
                            </td>
                        </tr>
                        <tr>
                            <td className="table_title">
                            ??????????????????????????????????????? 
                            </td>
                            <td>
                            <FormItem label="" {...formInfo} className="texthh" >
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
                            </td>
                        </tr>
                        <tr>
                            <td className="table_title">
                            ?????? 
                            </td>
                            <td>
                            <FormItem label="" {...formInfo} >
                    {getFieldDecorator('period', {
                        rules:[{required:true,message:"???????????????"},{pattern:/^([1-9]|(1[0-9])|(2[0-4]))$/,message:"????????????"}]

                    })(
                        <Input placeholder="???????????????" />
                    )}
                    <div className="formText" >???</div>
                </FormItem>
                            </td>
                        </tr>
                        <tr>
                            <td className="table_title">
                            ???????????? 
                            </td>
                            <td>
                            <FormItem label="" {...formInfo} className="texthh" >
                    {getFieldDecorator('loanBasis', {
                        initialValue:"",
                        rules:[{required:true,message:"?????????????????????"}]
                    })(
                        <RadioGroup>
                            <Radio value="1" >?????????</Radio>
                            <Radio value="0" >??????</Radio>
                        </RadioGroup>
                    )}
                </FormItem>
                            </td>
                        </tr>
                        <tr>
                            <td className="table_title">
                            ?????????/???????????? 
                            </td>
                            <td>
                            <FormItem label="" {...formInfo} className="texthh" >
                    {getFieldDecorator('insuranceSize', {
                        rules:[{required:true,message:"??????????????????/????????????"}]
                    })(
                        <Select placeholder="??????????????????/????????????">
                            <Option value="1">1</Option>
                            <Option value="2">2</Option>
                            <Option value="3">3</Option>
                            <Option value="4">4</Option>
                            <Option value="5">5</Option>
                            <Option value="6">6</Option>
                            <Option value="7">7</Option>
                            <Option value="8">8</Option>
                            <Option value="9">9</Option>
                            <Option value="10">10</Option>
                        </Select>
                    )}
                </FormItem>
                            </td>
                        </tr>
                        <tr>
                            <td className="table_title">
                            ????????????????????? 
                            </td>
                            <td>
                            <FormItem label="" wrapperCol={{span:20}} className="texthh" >
                    {getFieldDecorator('enableAudit', {
                        initialValue:"",
                        rules:[{required:true,message:"??????????????????????????????"}]
                    })(
                        <RadioGroup>
                            <Radio value="1" >???????????????</Radio>
                            <Radio value="0" >??????????????????</Radio>
                        </RadioGroup>
                    )}
                </FormItem>
                            </td>
                        </tr>
                        <tr>
                            <td className="table_title">
                            ?????????????????? 
                            </td>
                            <td>
                            <FormItem label="" {...formInfo} className="texthh" >
                    {getFieldDecorator('preSign', {
                        initialValue:"",
                        rules:[{required:true,message:"???????????????????????????"}]
                    })(
                        <RadioGroup>
                            <Radio value="1" >???</Radio>
                            <Radio value="0" >???</Radio>
                        </RadioGroup>
                    )}
                </FormItem>
                            </td>
                        </tr>
                        <tr>
                            <td className="table_title">
                            ???????????? 
                            </td>
                            <td>
                            <FormItem label="" {...formInfo} className="texthh" >
                    {getFieldDecorator('protocolTemplateId', {
                        rules:[{required:true,message:"?????????????????????"}]
                    })(
                        <Select placeholder="?????????????????????">
                            {
                                this.state.tem.map((i,k)=>{
                                    return <Option value={i.id.toString()} key={k}>{i.name}</Option>
                                })
                            }
                        </Select>
                    )}
                </FormItem>
                            </td>
                        </tr>
                    </tbody>
                    <FormItem label="" style={{marginBottom:"0!important"}} className="bottom" >
                    {getFieldDecorator('productId', {
                        initialValue:this.state.product?this.state.product.id:""
                    })(
                        <div />
                    )}
                </FormItem>
                </table>
            </div>
        )

    }
}
export default Form.create()(Product);