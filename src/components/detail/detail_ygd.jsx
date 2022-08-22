import React, { Component } from 'react';
import { Row,Col } from 'antd';
// import moment from 'moment';

// import ImgTag from '../../templates/ImageTag';
import ImgTag from '../../templates/ImageTag_w';
//import Audit from "./auditingView_cxfq";
import { axios_ygd } from "../../ajax/request";
import { ygd_detail,ygd_detail_approve0,ygd_detail_approve1 ,get_wait_pay_detail,get_pay_success_detail_ygd,defq_pay_success_detail} from "../../ajax/api";
import TimeLine from "./timeLine_ygd";
import TableCol from "./table-col";


class LineTable extends Component {
    constructor (props){
        super(props);
        // 识别参数来源   地址栏or属性
        let audit = false , orderNo , schedule,type;
        if(props.location){
            audit = props.location.query.audit==="false"?false:props.location.query.audit;
            orderNo = props.location.query.orderNo;
            schedule = true;
            type=props.location.query.type
        }else{
            orderNo = props.orderNo;
            schedule = false;
        }
        this.state={
            audit:audit,
            schedule:schedule,
            base_info:{},
            product_info:{},
            money_info:{},
            repay_account:{},
            repay_info:{},
            car_info:{},
            orderNo:orderNo,
            orderStatus:0,
            guaranteeStorageList:[],
            frameStorageList:[],
            loanContractStorageList:[],
            serviceStorageList:[],
            personPromiseStorageList:[],
            personWageStorageList:[],
            otherInfoImageStorageList:[],
            additionStorageList:[],
            idCard:[],
            data:{},
            type:type||props.urlType||""
        }
    }
    componentWillMount (){

    }
    componentDidMount(){
        this.getDetail();
        this.col={
            borrowerName:{
                name:"姓名"
            },
            borrowerPhone:{
                name:"联系手机号"
            },
            borrowerIdNo:{
                name:"身份证号码"
            },
            companyName:{
                name:"所属公司"
            },
            borrowerAddressProvince:{
                name:"联系地址",
                span_val:3,
                render:(e)=>{
                    return e.borrowerAddressProvince+e.borrowerAddressCity+e.borrowerAddressDistrict+e.borrowerAddressDetail
                }
            },
            bankCardNo:{
                name:"银行卡号"
            },
            bankName:{
                name:"开户行名"
            },
        }
        this.jk={
            amount:{
                name:"借款金额",
                render:e=>{
                    return e.amount?e.amount.money():"--"
                }
            },
            period:{
                name:"借款期限",
                render:e=>{
                    const periodType={1:"日",2:"周",3:"个月",4:"季",5:"年"};
                    return e.period+periodType[e.periodType]
                }
            },
            yearInterestRate:{
                name:"借款利率",
                render:e=>{
                    return e.yearInterestRate+"%"
                }
            },
            yearServiceRate:{
                name:"服务费率",
                render:e=>{
                    return e.yearServiceRate+"%"
                }
            },
            loanStartDate:{
                name:"借款开始时间"
            },
            loanEndDate:{
                name:"借款结束时间"
            },
            repayType:{
                name:"还款方式",
                render:e=>{
                    const repayType={PHASE1:"到期还本付息",PHASE2:"半期付息"};
                    return repayType[e.repayType]
                }
            },
            remark:{
                name:"备注",
                render:e=>{
                    return e.remark?e.remark:"--"
                }
            }
        }
    }
    getDetail (){
        console.log(this.state.type)
        var url={
            check:ygd_detail_approve0,
            review:ygd_detail_approve1,
            jk:get_pay_success_detail_ygd,
            pay:get_wait_pay_detail,
            defq:defq_pay_success_detail,
        }
        axios_ygd.post((this.state.type?url[this.state.type]:ygd_detail),{orderNo:this.state.orderNo}).then((data)=>{
            let idcardArr = [];
            let detail=data.data;
            for(var de in detail){
                if(de==="borrowerIdentificationBackImageStorageList"||de==="borrowerIdentificationFrontImageStorageList"){
                    for(var i in detail[de]){
                        var idCard={};
                        idCard.src=detail[de][i].url;
                        idCard.des=(de==="borrowerIdentificationBackImageStorageList"?"身份证背面":"身份证正面")
                        idcardArr.push(idCard);
                    }
                    this.setState({
                        idCard:idcardArr
                    })
                }else if(de==="guaranteeStorageList"||de==="frameStorageList"||de==="loanContractStorageList"||de==="serviceStorageList"||de==="personPromiseStorageList"||de==="personWageStorageList"||de==="otherInfoImageStorageList"||de==="additionStorageList"){
                    var arr=[];
                    for(var pd in detail[de]){
                        arr.push(detail[de][pd].url);
                    }
                    this.setState({
                        [de]:arr
                    })

                }
            else{
                    this.setState({
                        [de]:detail[de],
                        data:detail
                    })
                }
            }
        });

    }

    render (){
        //let audit_dom = (
        //    <Row>
        //        <Audit orderNo={this.state.orderNo} type={this.state.audit} />
        //    </Row>
        //);
        
        
        return (
            <div>
                <Row>
                    {this.state.schedule?<TimeLine pild={this.state.orderNo} />:""}
                </Row>
                <div className="detail_card">
                    <div className="title">
                        <div className="icon" />
                        <span className="titleWord">借款方信息</span>
                    </div>
                    {
                        <div className="" style={{width:"50%",padding:"15px 22px 0 22px"}}>
                            <ImgTag imgs={this.state.idCard} />
                        </div>
                    }
                    <div className="content query-sh ygdInfo" style={{marginTop:"0px"}}>
                        {/* <Row>
                            <Col span={12}>姓名：{this.state.borrowerName}</Col>
                            <Col span={12}>联系手机号：{this.state.borrowerPhone}</Col>
                        </Row>
                        <Row>身份证号码：{this.state.borrowerIdNo}</Row>
                        <Row>联系地址：{this.state.borrowerAddressProvince+this.state.borrowerAddressCity+this.state.borrowerAddressDistrict+this.state.borrowerAddressDetail}</Row>
                        <Row>所属公司：{this.state.companyName}</Row>
                        <Row>
                            <Col span={12}>银行卡号：{this.state.bankCardNo}</Col>
                            <Col span={12}>开户行名：{this.state.bankName}</Col>
                        </Row> */}
                        <TableCol data-columns={this.col} data-source={this.state.data} />

                    </div>
                </div>
                <div className="detail_card">
                    <div className="title">
                        <div className="icon" />
                        <span className="titleWord">借款信息</span>
                    </div>
                    <div className ="content query-sh ygdInfo">
                        {/* <Row>
                            <Col span={12}>借款金额：{this.state.amount?this.state.amount.money():""}</Col>
                            <Col span={12}>借款期限：{this.state.period+periodType[this.state.periodType]}</Col>
                        </Row>
                        <Row>
                            <Col span={12}>借款利率：{this.state.yearInterestRate+"%"}</Col>
                            <Col span={12}>服务费率：{this.state.yearServiceRate+"%"}</Col>
                        </Row>
                        <Row>
                            <Col span={12}>借款开始时间：{this.state.loanStartDate}</Col>
                            <Col span={12}>借款结束时间：{this.state.loanEndDate}</Col>
                        </Row>
                        <Row>
                            <Col span={12}>还款方式：{repayType[this.state.repayType]}</Col>
                            <Col span={12}>备注：{this.state.remark}</Col>
                        </Row> */}
                        <TableCol data-columns={this.jk} data-source={this.state.data} />
                    </div>
                </div>
                <div className="detail_card">
                    <div className="title">
                        <div className="icon" />
                        <span className="titleWord">申请资料</span>
                    </div>
                    <div className ="content query-sh ygdInfo">
                        <Row>
                            <Col span={8}>担保合同：
                                {
                                    this.state.guaranteeStorageList.length>0?this.state.guaranteeStorageList.map((i,k)=>{
                                        return <a style={{marginRight:"8px"}} href={i} key={k}>担保合同{Number(k)+1}</a>
                                    }):"暂无"
                                }

                            </Col>
                            <Col span={8}>合同框架协议：
                                {
                                    this.state.frameStorageList.length>0?this.state.frameStorageList.map((i,k)=>{
                                        return <a style={{marginRight:"8px"}} href={i} key={k}>合同框架协议{Number(k)+1}</a>
                                    }):"暂无"
                                }
                            </Col>
                            <Col span={8}>借款协议：
                                {
                                    this.state.loanContractStorageList.length>0?this.state.loanContractStorageList.map((i,k)=>{
                                        return <a style={{marginRight:"8px"}} href={i} key={k}>借款协议{Number(k)+1}</a>
                                    }):"暂无"
                                }
                                </Col>
                        </Row>
                        <Row>
                        <Col span={8}>技术服务协议：
                                {
                                    this.state.serviceStorageList.length>0?this.state.serviceStorageList.map((i,k)=>{
                                        return <a style={{marginRight:"8px"}} href={i} key={k}>技术服务协议{Number(k)+1}</a>
                                    }):"暂无"
                                }
                                </Col>
                            <Col span={8}>员工承诺函：
                                {
                                    this.state.personPromiseStorageList.length>0?this.state.personPromiseStorageList.map((i,k)=>{
                                        return <a style={{marginRight:"8px"}} href={i} key={k}>员工承诺函{Number(k)+1}</a>
                                    }):"暂无"
                                }
                                </Col>
                            <Col span={8}>工作收入证明：
                                {
                                    this.state.personWageStorageList.length>0?this.state.personWageStorageList.map((i,k)=>{
                                        return <a style={{marginRight:"8px"}} href={i} key={k}>工作收入证明{Number(k)+1}</a>
                                    }):"暂无"
                                }
                                </Col>
                        </Row>
                        <Row>
                            <Col span={8}>其他资料：
                                {
                                    this.state.otherInfoImageStorageList.length>0?this.state.otherInfoImageStorageList.map((i,k)=>{
                                        return <a style={{marginRight:"8px"}} href={i} key={k}>其他资料{Number(k)+1}</a>
                                    }):"暂无"
                                }
                                </Col>
                                <Col span={8}>后补资料：
                                {
                                    this.state.additionStorageList.length>0?this.state.additionStorageList.map((i,k)=>{
                                        return <a style={{marginRight:"8px"}} href={i} key={k}>后补资料{Number(k)+1}</a>
                                    }):"暂无"
                                }
                                </Col>
                        </Row>
                        
                    </div>
                </div>
                
                <style>{`
                    .ygdInfo div{
                        font-size:14px;line-height:28px
                    }
                `}</style>
            </div>
        )
    }

}
export default LineTable;