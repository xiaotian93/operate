import React, { Component } from 'react';
import {Row,Col,Form,message} from 'antd';
import RepayTable from '../detail/repayTable1';
import {axios_sh} from '../../../../ajax/request';
import {bank_list} from '../../../../ajax/api';
const FormItem = Form.Item;
class Basic extends Component{
    constructor(props) {
        super(props);
        props.onRef(this);
        this.state = {
            bank:[],
            productList:[],
            id:props.id,
            repayData:{}
        };
        this.refArr=[];
    }
    componentWillMount(){
        this.getShNo();
        if(this.state.id){
            setTimeout(()=>{
                this.editData()
            },200)

        }
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
        var data=JSON.parse(window.localStorage.getItem("detail"));
        var repaySettings=data.repaySettings;
        var productSetting=data.productSettings;
        var tableArr=this.refArr;
        for(var rt in tableArr){
            for(var r in repaySettings){
                //alert(tableArr[rt].props.product.id)
                if(Number(tableArr[rt].props.product.id)===Number(repaySettings[r].productId)){
                    this.setState({
                        repayData:repaySettings[r]
                    })
                    tableArr[rt].setState({
                        repayData:repaySettings[r]
                    })
                }
            }
            for(var j in productSetting){
                //alert(tableArr[rt].props.product.id)
                if(Number(tableArr[rt].props.product.id)===Number(productSetting[j].productId)){
                    tableArr[rt].setState({
                        repayProduct:productSetting[j]
                    })
                }
            }
        }
    }
    getRepay(){
        var repaySettings=[];
        var infoData=this.props.form.getFieldsValue();
        if(infoData.bankName!=="请选择银行"&&infoData.merchantRepayBankCard!==""&&infoData.repayDayType!=="请输入收款银行账号"&&infoData.subBankName!==""){
            for(var i in this.refArr){
                if(this.refArr[i].checkData()){
                    var repayData=this.refArr[i].checkData();
                    repayData.bankName=infoData.bankName;
                    repayData.merchantRepayBankCard=infoData.merchantRepayBankCard;
                    repayData.repayDayType=infoData.repayDayType;
                    repayData.subBankName=infoData.subBankName;
                    repaySettings.push(repayData);
                }
            }
        }else{
            message.warn("还款配置信息不完整，请检查！");
            return
        }

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
        var repayDay={1:"灵活还款日",2:"固定还款日（10号）",3:"固定还款日（15号）",4:"固定还款日（20号）",5:"10/20日还款"};
        return (
            <Form className="sh_add">
                <Row>
                    <Col span={4} style={{paddingRight:'20px',textAlign:'right',fontSize:'14px',color:"#7F8FA4"}}>还款方:</Col>
                    <Col span={20}>
                        {this.state.productList.length>0?this.state.productList.map((i,k)=>{
                            return <RepayTable key={k} product={i} onRef={this.reTable.bind(this)} />
                        }):"请先完成产品配置"}
                        </Col>
                </Row>
                <Row style={{marginTop:"30px"}}>
                    <Col span={4} style={{paddingRight:'20px',textAlign:'right',fontSize:'14px',color:"#7F8FA4"}}>还款账户:</Col>
                    <Col span={20}>
                        <Row style={{marginBottom:"15px"}}>
                            <Col span={4} style={{paddingRight:'20px',textAlign:'right',fontSize:'14px',color:"#7F8FA4"}}>客户还款账户</Col>
                            <Col span={12} style={{fontSize:'14px',color:"#000"}}>绑定银行卡/对公账户还款</Col>
                        </Row>
                        <Row style={{marginBottom:"15px"}}>
                            <Col span={4} style={{paddingRight:'20px',textAlign:'right',fontSize:'14px',color:"#7F8FA4",marginTop:"5px"}}>商户还款账户</Col>
                            <Col span={10}>
                                <FormItem {...formInfoSmall} label="账户名" >
                                    {getFieldDecorator('merchantRepayBankAccount', {
                                    })(
                                        <div style={{fontSize:"14px"}}>{this.state.repayData.merchantRepayBankAccount}</div>
                                    )}

                                </FormItem>
                            </Col>

                        </Row>
                        <Row style={{marginBottom:"15px"}}>
                            <Col span={10} push={4}>
                                <FormItem {...formInfoSmall} label="银行账号" >
                                    {getFieldDecorator('merchantRepayBankCard', {
                                        initialValue:""
                                    })(
                                        <div style={{fontSize:"14px"}}>{this.state.repayData.merchantRepayBankCard}</div>
                                    )}

                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={10} push={4}>
                                <FormItem {...formInfoSmall} label="开户行" >
                                    {getFieldDecorator('bankName', {
                                    })(
                                        <div style={{fontSize:"14px"}}>{this.state.repayData.bankName}</div>
                                    )}

                                </FormItem>
                            </Col>
                            <Col span={10} style={{marginLeft:"5px"}}>
                                <FormItem {...formInfoSmall} label="" >
                                    {getFieldDecorator('subBankName', {
                                        initialValue:""
                                    })(
                                        <div style={{fontSize:"14px"}}>{this.state.repayData.subBankName}</div>
                                    )}

                                </FormItem>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row style={{marginTop:"30px"}}>
                    <Col span={4} style={{paddingRight:'20px',textAlign:'right',fontSize:'14px',color:"#7F8FA4",marginTop:"5px"}}>还款日:</Col>
                    <Col span={20}>
                        <Row>
                            <Col span={4} style={{paddingRight:'20px',textAlign:'right',fontSize:'14px',color:"#7F8FA4",marginTop:"5px"}}>客户还款日</Col>
                            <Col span={10}>
                                <FormItem {...formInfoSmall} label="" >
                                    {getFieldDecorator('repayDayType', {
                                    })(
                                        <div style={{fontSize:"14px"}}>{repayDay[this.state.repayData.repayDayType]}</div>
                                    )}

                                </FormItem>
                            </Col>
                        </Row>
                    </Col>

                </Row>

            </Form>
        )

    }
}
export default Form.create()(Basic);