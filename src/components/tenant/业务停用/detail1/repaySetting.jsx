import React, { Component } from 'react';
import {Row,Col,Form,Table} from 'antd';
// import RepayTable from './repayTable';
import {axios_sh} from '../../../../ajax/request';
import {bank_list} from '../../../../ajax/api';
const FormItem = Form.Item;
class Basic extends Component{
    constructor(props) {
        super(props);
        props.onRef(this);
        this.state = {
            bank:[],
            productList:props.productList,
            id:props.id,
            repayData:{},
            cus_data:[]
        };
        this.refArr=[];
    }
    componentWillMount(){
        this.getShNo();
        if(this.state.id){
            setTimeout(()=>{
                this.editData()
            },100)

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
        // var productSetting=data.productSettings;
        var customer_business=JSON.parse(window.localStorage.getItem("customer_business"));
        var repay_data=JSON.parse(window.localStorage.getItem("detail")).repaySettings[0];
        // var tableArr=this.refArr;
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
            cus_data:cus_arr,
            repayData:repay_data
        })
       
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
            <Row className="sh_add">
                {/* <Row className="sh_add_card">
                    <Row style={{fontSize:'14px',color:"#000000",marginBottom:"20px"}}>还款方配置</Row>
                    <Row >
                        {this.state.productList.length>0?this.state.productList.map((i,k)=>{
                            return <RepayTable key={k} product={i} onRef={this.reTable.bind(this)} />
                        }):"请先进行产品配置"}
                        </Row>
                </Row> */}
                <Row className="sh_add_card">
                    {/* <Row style={{fontSize:'14px',color:"#000000",marginBottom:"20px"}}>还款账户</Row> */}
                    <Row className="sh_inner_box">
                        <Col span={20}>
                        <Row style={{marginBottom:"15px"}}>
                            <Col span={8} style={{textAlign:'right',fontSize:'14px',color:"rgba(0,0,0,0.5)",paddingRight:"10px"}}>客户还款账户</Col>
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
                            <Col span={8} style={{textAlign:'right',fontSize:'14px',color:"rgba(0,0,0,0.5)",marginTop:"5px",paddingRight:"10px"}}>商户还款账户</Col>
                            <Col span={10}>
                                <FormItem {...formInfoSmall} label="账户名" >
                                    {getFieldDecorator('merchantRepayBankAccount', {
                                    })(
                                        <div style={{fontSize:"14px"}}>{this.state.repayData.merchantRepayBankAccount}</div>
                                    )}

                                </FormItem>
                            </Col>
                        </Row>
                        <Row style={{marginBottom:"15px"}} >
                            <Col span={10} push={8}>
                                <FormItem {...formInfoSmall} label="银行账号" className="after tableForm textLeft" >
                                    {getFieldDecorator('merchantRepayBankCard', {
                                    })(
                                        <div style={{fontSize:"14px"}}>{this.state.repayData.merchantRepayBankCard}</div>
                                    )}

                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={10} push={8}>
                                <FormItem {...formInfoSmall} label="开户行" >
                                    {getFieldDecorator('bankName', {
                                    })(
                                        <div style={{fontSize:"14px"}}>{this.state.repayData.bankName+this.state.repayData.subBankName}</div>
                                    )}

                                </FormItem>
                            </Col>
                            {/* <Col span={10} push={3} style={{marginLeft:"5px"}}>
                                <FormItem {...formInfoSmall} label="" >
                                    {getFieldDecorator('subBankName', {
                                    })(
                                        <div style={{fontSize:"14px"}}>{this.state.repayData.subBankName}</div>                                    
                                    )}

                                </FormItem>
                            </Col> */}
                        </Row>
                        <Row>
                            <Col span={8} style={{textAlign:'right',fontSize:'14px',color:"rgba(0,0,0,0.5)",marginTop:"5px",paddingRight:"10px"}}>客户还款日</Col>
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
                </Row>
                {/* <Row className="sh_add_card">
                    <Row style={{fontSize:'14px',color:"#000",marginBottom:"20px"}}>还款日</Row>
                    <Row>
                        <Row>
                            <Col span={3} style={{textAlign:'left',fontSize:'14px',color:"rgba(0,0,0,0.5)",marginTop:"5px"}}>客户还款日</Col>
                            <Col span={10}>
                                <FormItem {...formInfoSmall} label="" >
                                    {getFieldDecorator('repayDayType', {
                                    })(
                                        <div style={{fontSize:"14px"}}>{repayDay[this.state.repayData.repayDayType]}</div>
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