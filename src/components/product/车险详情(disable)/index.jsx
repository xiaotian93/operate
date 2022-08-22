import React, { Component } from 'react';
import {Row,Form,Col,Table,Button} from 'antd';
import {cx_product_detail,history_list,cxfq_repay_type} from '../../../ajax/api';
import { axios_cxfq } from '../../../ajax/request';
// import Path from './../../../templates/Path';
import {format_table_data} from '../../../ajax/tool';
import ComponentRoute from '../../../templates/ComponentRoute';
import { browserHistory } from 'react-router';
class Product_cxfq extends Component{
    constructor(props) {
        super(props);
        this.state = {
            productId:props.location.query.productId,
            data:{
                discount1Type:'',
                discount2Type:'',
                discount3Type:"",
                interestType:"",
                serviceFeeType:"",
                otherFeeType:"",
                loanUsage:"",
                loanType:"",
                repayType:"",
                haveDiscount:"",
                history:[],
                realRepayType:''
            },
            repay_type:[]
        };
    }
    componentWillMount(){
        this.get_repay();
        this.getDetail();
        this.getHistory();
        this.columns=[
            {
                title:"操作时间",
                dataIndex:"modifyTime"
            },
            {
                title:"操作员",
                dataIndex:"operator"
            },
            {
                title:"操作内容",
                dataIndex:"modifyAttr"
            },
            {
                title:"旧值",
                dataIndex:"oldValue"
            },
            {
                title:"新值",
                dataIndex:"newValue"
            }
        ]
    }
    get_repay(){
        axios_cxfq.get(cxfq_repay_type,'').then(e=>{
            
            var data={};
            for(var i in e.data){
                data[e.data[i].value]=e.data[i].desc

            }
            this.setState({repay_type:data})
        })
    }
    getDetail(){
        axios_cxfq.get(cx_product_detail+"?productId="+this.state.productId).then(e=>{
            if(!e.code){
                var data=e.data;
                this.setState({
                    data:data
                });
            }
        })
    }
    getHistory(){
        axios_cxfq.get(history_list+"?productId="+this.state.productId).then(e=>{
            if(!e.code){
                var data=e.data;
                this.setState({
                    history:format_table_data(data)
                });
            }
        })
    }
    edit(){
        browserHistory.push('/cp/cxfq/list/add?productId='+this.state.productId);
    }
    render() {
        const discount1Type={1:"退还保证金",2:"抵扣最后一期还款",3:"代收代付"};
        const payType={1:"放款前一次性支付",2:"首期还款日支付",3:"按期支付"};
        const loanUsage={1:"流动资金贷款",2:"固定资产投资贷款",3:"其他"};
        const loanType={1:"信用",2:"保证",3:"抵押",4:"质押" ,5:"其他"};
        // const loanBasis = {1:"投保单",0:"保单"};
        const repayType={1:"等额本息",2:"等额本金",3:"先息后本",4:"灵活还款"};
        return (

            <div>
                <Form className="product_cxfq" >
                    <Row className="content_cx">
                        <div className="card_cx">
                        <div className="title">
                            <div className="icon" />
                            <span className="titleWord">产品信息</span>
                        </div>
                        <Row className="form_cx">
                            <Row>
                                <Col style={{width:'80px',float:'left',lineHeight:'30px',fontSize:'14px',color:'#444'}}>产品编号：</Col>
                                <Col style={{width:'200px',float:'left'}}>
                                    <div style={{fontWeight:'bold!important',fontSize:'14px',lineHeight:"30px"}}>{this.state.data?this.state.data.code:null}</div>
                                </Col>
                            </Row>
                            <Row>
                                <Col style={{width:'80px',float:'left',lineHeight:'30px',fontSize:'14px',color:'#444'}}>产品名称：</Col>
                                <Col style={{width:'200px',float:'left'}}>
                                    <div style={{fontWeight:'bold!important',fontSize:'14px',lineHeight:"30px"}}>{this.state.data?this.state.data.name:null}</div>
                                </Col>
                            </Row>
                        </Row>
                        </div>
                    </Row>


                    <Row className="content_cx">
                    <div className="card_cx">
                        <div className="title">
                            <div className="icon" />
                            <span className="titleWord">借款信息</span>
                        </div>
                        <Row className="form_cx">
                            <Row>
                                <div style={{fontSize:"14px",color:'#444',marginBottom:"10px"}}>是否需要支付保证金：{this.state.data?(this.state.data.haveDiscount?"是":"否"):null}</div>
                            </Row>
                            {this.state.data.haveDiscount?<Row style={{background:'#F7F7F7',padding:'23px'}}>
                                {
                                    this.state.data.discount1Type?<Row>
                                        <Col>
                                            <div className="bzj"><span>保证金1</span></div>
                                        </Col>
                                        <Col >
                                            <div style={{fontSize:"14px",margin:"10px 0"}}>保证金处置方式：{discount1Type[this.state.data.discount1Type.toString()]}</div>
                                        </Col>
                                    </Row>:null
                                }
                                {
                                    this.state.data.discount2Type?<Row>
                                        <Col>
                                            <div className="bzj"><span>保证金2</span></div>
                                        </Col>
                                        <Col>
                                            <div style={{fontSize:"14px",margin:"10px 0"}}>保证金处置方式：{discount1Type[this.state.data.discount2Type.toString()]}</div>
                                        </Col>
                                    </Row>:null
                                }
                                {
                                    this.state.data.discount3Type?<Row>
                                        <Col>
                                            <div className="bzj"><span>保证金3</span></div>
                                        </Col>
                                        <Col>
                                            <div style={{fontSize:"14px",margin:"10px 0"}}>保证金处置方式：{discount1Type[this.state.data.discount3Type.toString()]}</div>
                                        </Col>
                                    </Row>:null
                                }


                            </Row>:null}



                        </Row>
                        </div>
                        <div className="card_cx">
                        <Row className="form_cx">
                            <span className="bold">综合费用支付方式</span>
                            <div style={{fontSize:"14px",marginTop:"10px"}}>{"利息 : "+payType[this.state.data.interestType.toString()]}</div>
                            <div style={{fontSize:"14px",marginTop:"10px"}}>{"服务费 : "+payType[this.state.data.serviceFeeType.toString()]}</div>
                            <div style={{fontSize:"14px",marginTop:"10px"}}>{"其他费用 : "+payType[this.state.data.otherFeeType.toString()]}</div>
                        </Row>
                        </div>
                        <div className="card_cx">
                        <Row className="form_cx">
                            <Row>
                                <Col style={{width:'80px',float:'left',lineHeight:'30px',fontSize:'14px',color:'#444'}}>贷款用途：</Col>
                                <Col style={{width:'200px',float:'left'}}>
                                    <div style={{fontSize:'14px',lineHeight:"30px"}}>{loanUsage[this.state.data.loanUsage.toString()]}</div>
                                </Col>
                            </Row>
                            <Row>
                                <Col style={{width:'80px',float:'left',lineHeight:'30px',fontSize:'14px',color:'#444'}}>贷款方式：</Col>
                                <Col style={{width:'200px',float:'left'}}>
                                        <div style={{fontSize:'14px',lineHeight:"30px"}}>{loanType[this.state.data.loanType.toString()]}</div>
                                </Col>
                            </Row>
                            {/* <Row>
                                <Col style={{width:'80px',float:'left',lineHeight:'30px',fontSize:'14px',color:'#444'}}>业务类型：</Col>
                                <Col style={{width:'200px',float:'left'}}>
                                    <div style={{fontSize:'14px',lineHeight:"30px"}}>{loanBasis[this.state.data.loanBasis]||"--"}</div>
                                </Col>
                            </Row> */}
                        </Row>
                        </div>
                    </Row>

                    <Row className="content_cx">
                    <div className="card_cx">
                        <div className="title">
                            <div className="icon" />
                            <span className="titleWord">还款信息</span>
                        </div>
                        <Row className="form_cx">
                            <Row>
                                <Col style={{width:'80px',float:'left',lineHeight:'30px',fontSize:'14px',color:'#444'}}>还款方式：</Col>
                                <Col style={{width:'200px',float:'left'}}>
                                    <div style={{fontSize:'14px',lineHeight:"30px"}}>{this.state.repay_type[this.state.data.realRepayType.toString()]}</div>
                                </Col>
                            </Row>
                            <Row>
                                <Col style={{width:'100px',float:'left',lineHeight:'30px',fontSize:'14px',color:'#444'}}>上报还款方式：</Col>
                                <Col style={{width:'200px',float:'left'}}>
                                    <div style={{fontSize:'14px',lineHeight:"30px"}}>{repayType[this.state.data.repayType.toString()]}</div>
                                </Col>
                            </Row>
                        </Row>
                        </div>
                        <div className="card_cx">
                        <Row className="form_cx">
                            <div className="bold">提前还款时费用是否退还</div>
                            <div style={{fontSize:"14px",marginTop:"10px"}}>利息 : {this.state.data.interestAdvance?"退还":"不退还"}</div>
                            <div style={{fontSize:"14px",marginTop:"10px"}}>服务费 : {this.state.data.serviceFeeAdvance?"退还":"不退还"}</div>
                            <div style={{fontSize:"14px",marginTop:"10px"}}>其他费用 : {this.state.data.otherFeeAdvance?"退还":"不退还"}</div>
                        </Row>
                        </div>
                    </Row>
                    <Row className="content_cx">
                        <div className="card_cx">
                        <div className="title">
                            <div className="icon" />
                            <span className="titleWord">操作记录</span>
                        </div>
                        <Row className="form_cx" style={{marginBottom:"10px"}}>
                            <Table columns={this.columns} dataSource={this.state.history} pagination={false} rowKey="key" locale={{emptyText:'暂无操作记录'}} />
                        </Row>
                        </div>
                    </Row>
                    <Row className="content_cx" style={{textAlign:"center",marginBottom:"10px"}}>
                        <Button onClick={this.edit.bind(this)} type="primary">编辑</Button>
                    </Row>
                </Form>
            </div>
        )
    }
}
export default ComponentRoute(Form.create()(Product_cxfq));