import React, { Component } from 'react';
import {Row,Col,Form,Select,Input,Table} from 'antd';
// import RepayTable from './repayTable';
import {axios_sh} from '../../../ajax/request';
import {bank_list} from '../../../ajax/api';
const FormItem = Form.Item;
const Option = Select.Option;
class Basic extends Component{
    constructor(props) {
        super(props);
        props.onRef(this);
        this.state = {
            bank:[],
            productList:[],
            id:props.id,
            cus_data:[]
        };
        this.refArr=[];
    }
    componentWillMount(){
        this.getShNo();
        if(this.state.id){
            // setTimeout(()=>{
                // this.editData()
            // },300)

        }
        this.columns=[
            {
                title:"账户名",
                dataIndex:"repayAccountName"
            },
            {
                title:"账号",
                dataIndex:"repayBankCard"
            }
        ]
    }
    getShNo(){
        axios_sh.get(bank_list).then(e=>{
            if(!e.code){
                this.setState({
                    bank:e.data
                })
            }
        })
    }
    reTable(e){
        this.refArr.push(e)
    }
    editData(){
        // var data=JSON.parse(window.localStorage.getItem("detail"));
        // var repaySettings=data.repaySettings;
        // var tableArr=this.refArr;
        var customer_business=JSON.parse(window.localStorage.getItem("customer_business"));
        var cus=JSON.parse(window.localStorage.getItem("detail")).basic.customerBusinessIds;
        var cus_arr=[];
        for(var cu in customer_business){
            for(var c in cus){
                if(Number(cus[c])===Number(customer_business[cu].id)){
                    cus_arr.push(customer_business[cu])
                }
            }
        }
        this.setState({
            cus_data:cus_arr
        })
        // for(var rt in tableArr){
        //     for(var r in repaySettings){
        //         if(Number(tableArr[rt].props.product.productId)===Number(repaySettings[r].productId)){
        //             for(var rd in repaySettings[r]){
        //                 if(rd==="bankName"||rd==="merchantRepayBankCard"||rd==="subBankName"||rd==="merchantRepayBankAccount"){
        //                     this.props.form.setFieldsValue({[rd]:repaySettings[r][rd]})
        //                 }else if(rd==="repayDayType"){
        //                     this.props.form.setFieldsValue({[rd]:repaySettings[r][rd].toString()})
        //                 }else if(rd==="principalType"){
        //                     tableArr[rt].props.form.setFieldsValue({[rd]:repaySettings[r][rd].toString()})
        //                 }else{
        //                     tableArr[rt].setState({[rd]:repaySettings[r][rd]?true:false})
        //                     tableArr[rt].props.form.setFieldsValue({[rd]:repaySettings[r][rd]?repaySettings[r][rd]:''})
        //                 }

        //             }
        //         }
        //     }
        // }
    }
    getRepay(){

        var repaySettings=[];
        var aa=[];
        for(var k in this.state.productList){
            aa.push(this.state.productList[k].productId)
        }
        for(var j in this.refArr){
            if(aa.indexOf(Number(this.refArr[j].state.product.productId))<0){
                this.refArr.splice(j,1)
            }
        }
        this.props.form.validateFieldsAndScroll((err,infoData)=>{
            if(!err){
                for(var i in this.refArr){
                    if(!this.refArr[i].checkData()){
                        return;
                    }
                    var repayData=this.refArr[i].checkData();
                    repayData.bankName=infoData.bankName;
                    repayData.merchantRepayBankCard=infoData.merchantRepayBankCard;
                    repayData.repayDayType=infoData.repayDayType;
                    repayData.subBankName=infoData.subBankName;
                    repayData.merchantRepayBankAccount=infoData.merchantRepayBankAccount;
                    repaySettings.push(repayData);

                }
            }
        });
        return repaySettings;
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formInfoSmall={
            labelCol:{span:6},
            wrapperCol:{span:18},
            colon:false,
            className:"tableForm textLeft"
        };
        return (
            <Row className="sh_add">
                {/* <Row className="sh_add_card">
                    <Row className="sh_add_title">还款方配置</Row>
                    <Row >
                        {this.state.productList.length>0?this.state.productList.map((i,k)=>{
                            return JSON.stringify(i)!=='{}'?<RepayTable key={i.productId} product={i} onRef={this.reTable.bind(this)} />:null
                            
                        }):"请先进行产品配置"}
                        </Row>
                </Row> */}
                <Row className="sh_add_card">
                    {/* <Row className="sh_add_title">还款账户</Row> */}
                    <Row className="sh_inner_box">
                        <Col span={20}>
                        <Row style={{marginBottom:"15px"}}>
                            <Col span={8} style={{textAlign:'right',fontSize:'14px',color:"rgba(0,0,0,0.5)",paddingRight:"20px"}}>客户还款账户</Col>
                            <Col span={12} style={{fontSize:'14px',color:"#000"}}>绑定银行卡（个人客户）/对公还款账户（企业客户）
                            {
                                this.state.cus_data.length>0?<div>
                                <div style={{marginBottom:"5px",marginTop:"10px"}}>其中，对公账户如下</div>
                                <Table columns={this.columns} dataSource={this.state.cus_data} bordered pagination={false} />
                            </div>:null
                            }
                            
                            
                            </Col>
                        </Row>
                        <Row style={{marginBottom:"15px"}}>
                            <Col span={8} style={{textAlign:'right',fontSize:'14px',color:"rgba(0,0,0,0.5)",marginTop:"5px",paddingRight:"20px"}}>商户还款账户</Col>
                            <Col span={10}>
                                <FormItem {...formInfoSmall} label="账户名" >
                                    {getFieldDecorator('merchantRepayBankAccount', {
                                        initialValue:"",
                                        rules:[{pattern:/^[0-9a-zA-Z\u4e00-\u9fa5（）()]{1,50}$/,message:"格式错误"},{required:true,message:"请输入账户名"}]
                                    })(
                                        <Input placeholder="请输入账户名" />
                                    )}

                                </FormItem>
                            </Col>
                        </Row>
                        <Row style={{marginBottom:"15px"}} >
                            <Col span={10} push={8}>
                                <FormItem {...formInfoSmall} label="银行账号" className="after tableForm textLeft" >
                                    {getFieldDecorator('merchantRepayBankCard', {
                                        initialValue:"",
                                        rules:[{pattern:/^[0-9]{1,25}$/,message:"格式错误"},{required:true,message:"请输入收款银行账号"}]
                                    })(
                                        <Input placeholder="请输入收款银行账号" />
                                    )}

                                </FormItem>
                            </Col>
                        </Row>
                        <Row style={{marginBottom:"15px"}}>
                            <Col span={10} push={8}>
                                <FormItem {...formInfoSmall} label="开户行" >
                                    {getFieldDecorator('bankName', {
                                        rules:[{required:true,message:"请选择银行"}]
                                    })(
                                        <Select placeholder="请选择银行">
                                            {
                                                this.state.bank.map((i,k)=>{
                                                    return <Option value={i.name} key={k} >{i.name}</Option>
                                                })
                                            }
                                        </Select>
                                    )}

                                </FormItem>
                            </Col>
                            <Col span={10} push={8} style={{marginLeft:"5px"}}>
                                <FormItem {...formInfoSmall} label="" >
                                    {getFieldDecorator('subBankName', {
                                        initialValue:"",
                                        rules:[{pattern:/^[\u4e00-\u9fa5]{1,25}$/,message:"格式错误"},{required:true,message:"请输入开户支行名称"}]
                                    })(
                                        <Input placeholder="请输入开户支行名称" />
                                    )}

                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8} style={{textAlign:'right',fontSize:'14px',color:"rgba(0,0,0,0.5)",marginTop:"5px",paddingRight:"20px"}}>客户还款日</Col>
                            <Col span={10}>
                                <FormItem {...formInfoSmall} label="" >
                                    {getFieldDecorator('repayDayType', {
                                        rules:[{required:true,message:"请选择还款日"}]
                                    })(
                                        <Select placeholder="请选择还款日">
                                            <Option value="1" >灵活还款日</Option>
                                            <Option value="2" >固定还款日（10号）</Option>
                                            <Option value="3" >固定还款日（15号）</Option>
                                            <Option value="4" >固定还款日（20号）</Option>
                                            <Option value="5" >10/20日还款</Option>
                                        </Select>
                                    )}

                                </FormItem>
                            </Col>
                        </Row>
                        </Col>
                    </Row>
                </Row>
                {/* <Row className="sh_add_card">
                    <Row className="sh_add_title">还款日</Row>
                    <Row>
                        <Row>
                            <Col span={3} style={{textAlign:'left',fontSize:'14px',color:"rgba(0,0,0,0.5)",marginTop:"5px"}}>客户还款日</Col>
                            <Col span={10}>
                                <FormItem {...formInfoSmall} label="" >
                                    {getFieldDecorator('repayDayType', {
                                        rules:[{required:true,message:"请选择还款日"}]
                                    })(
                                        <Select placeholder="请选择还款日">
                                            <Option value="1" >灵活还款日</Option>
                                            <Option value="2" >固定还款日（10号）</Option>
                                            <Option value="3" >固定还款日（15号）</Option>
                                            <Option value="4" >固定还款日（20号）</Option>
                                            <Option value="5" >10/20日还款</Option>
                                        </Select>
                                    )}

                                </FormItem>
                            </Col>
                        </Row>
                    </Row>

                </Row> */}

            </Row>
        )

    }
}
export default Form.create()(Basic);