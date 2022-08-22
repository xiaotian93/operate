import React, { Component } from 'react';
import { Row , Tabs } from 'antd';
// import moment from 'moment'

// import Card from '../../../templates/PreviewImg';
import TableCol from '../../../../templates/TableCol';
//import { host_cxfq } from '../../../ajax/config';
import { axios_bd } from '../../../../ajax/request'
import { bd_detail_hs ,bd_crawler_detail_hs} from '../../../../ajax/api';
import { format_date } from '../../../../ajax/tool';
const TabPane = Tabs.TabPane;
class Detail extends Component{
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            id:this.props.location.query.id,
            source:[],
            review:{}
        };
    }
    componentWillMount(){
        this.fields = {
            "name": {
                name:"企业名称",
                span_val:3
            },
            "shortName": {
                name:"企业简称"
            },
            "qyNo":{
                name:"企业ID"
            },
            "industry": {
                name:"所属行业",
                span_val:3
            },
            "scale": {
                name:"企业规模"
            },
            "type": {
                name:"产业类型"
            },

            "province": {
                name:"省份"
            },
            "city": {
                name:"城市"
            },
            "area": {
                name:"区/县",
                span_val:3
            },

            // "license": ["132gevw2rtg", "13gevwr2g3"],
            "creditCode": {
                name:"企业统一信用代码",
                span_val:3
            },
            "mobile": {
                name:"企业联系方式"
            },
            "expireDate": {
                name:"营业执照截止日期"
            },
            "frName": {
                name:"法人姓名"
            },
            "frPhone": {
                name:"法人手机号"
            },
            "frIdCard": {
                name:"法人身份证号",
                span_val:3
            },
            // "frIdCardStorageNo": ["13t2gwrb", "21f3ewge", "1f3egvbv"],
            "settleAccountName": {
                name:"结算账户名称"
            },
            "settleBankCard": {
                name:"结算账号"
            },
            "settleBankName": {
                name:"开户银行"
            },
            // "settleBankLic": ["13gwebvgrbv", "13gqevasv"],

            "settleSubBankName": {
                name:"开户行名称"
            },
            "agentName": {
                name:"经办人姓名"
            },
            "agentPhone": {
                name:"经办人手机号"
            },
            "agentIdCard": {
                name:"经办人身份证号",
                span_val:3
            },
            // "agentIdCardStorageNo": ["21g3webvcaf", "f3gvev"],
            "repayAccountName": {
                name:"还款账户名称"
            },
            "repayBankCard": {
                name:"还款银行卡号"
            },
            // "repayBankLic": ["123gevwsa","534gev"],
            "repayBankName": {
                name:"还款账户银行"
            },
            "repaySubBankName": {
                name:"还款账户开户行"
            }
        }
        this.review_fields={
            "insCompany":{
                name:"保险公司"
            },
            "signTime":{
                name:"签单日期",
                render:(e)=>{
                    return e.signTime?format_date(e.signTime):""
                }
            },
            "insType":{
                name:"险种名称"
            },
            "insStatus":{
                name:"保单状态",
                render:(e)=>{
                    return e.insStatus===0?"退保":"正常"
                }
            },
            "insNo":{
                name:"保单号"
            },
            "syxFee":{
                name:"保单金额（元）",
                render:e=>{
                    return e.syxFee?e.syxFee.money():""
                }
            },
            "insStartTime":{
                name:"开始日期",
                render:(e)=>{
                    return e.insStartTime?format_date(e.insStartTime):""
                }
            },
            "insEndTime":{
                name:"结束日期",
                render:(e)=>{
                    return e.insEndTime?format_date(e.insEndTime):""
                }
            },
            "insuredName":{
                name:"被保险人"
            },
            "insuredIdNo":{
                name:"被保险人证件号"
            },
            "holderName":{
                name:"投保人",
                span_val:3
            }
        };
        this.review_car={
            "licenseNo":{
                name:"车牌号"
            },
            "frameNo":{
                name:"车架号/VIN码"
            },
            "engineNo":{
                name:"发动机号"
            },
            "registerTime":{
                name:"车辆初登日期",
                render:(e)=>{
                    return e.registerTime?format_date(e.registerTime):""
                }
            },
            "carType":{
                name:"厂牌车型",
                span_val:7
            }
        };
        this.crawler_fields={
            "insCompany":{
                name:"保险公司",
                width_val:"15%"
            },
            "signTime":{
                name:"签单日期",
                render:(e)=>{
                    return e.signTime?format_date(e.signTime):""
                }
            },
            "insType":{
                name:"险种名称"
            },
            "insStatus":{
                name:"保单状态",
                render:(e)=>{
                    return e.insStatus===0?"退保":"正常"
                }
            },
            "insNo":{
                name:"保单号"
            },
            "insFee":{
                name:"保单金额（元）",
                render:e=>{
                    return e.insFee?e.insFee.money():""
                }
            },
            "insStartTime":{
                name:"开始日期",
                render:(e)=>{
                    return e.insStartTime?format_date(e.insStartTime):""
                }
            },
            "insEndTime":{
                name:"结束日期",
                render:(e)=>{
                    return e.insEndTime?format_date(e.insEndTime):""
                }
            },
            "insuredName":{
                name:"被保险人"
            },
            "insuredIdNo":{
                name:"被保险人证件号"
            },
            "holderName":{
                name:"投保人",
                span_val:3
            }
        };
        this.crawler_car={
            "carLicenseNo":{
                name:"车牌号"
            },
            "carFrameNo":{
                name:"车架号/VIN码"
            },
            "carEngineNo":{
                name:"发动机号"
            },
            "carRegisterTime":{
                name:"车辆初登日期",
                render:(e)=>{
                    return e.carRegisterTime?format_date(e.carRegisterTime):""
                }
            },
            "carModelName":{
                name:"厂牌车型"
            },
            "carType":{
                name:"车辆类型"
            },
            "carUseType":{
                name:"车辆使用性质"
            },
            "carSeatCount":{
                name:"核对载客数量"
            }
        };
        this.crawler_jf={
            "paymentAmount":{
                name:"实缴保费",
                render:e=>{
                    return e.paidAmount?e.paidAmount/100:""
                }
            },
            "paymentDate":{
                name:"缴费日期",
                render:(e)=>{
                    return e.paymentDate?format_date(e.paymentDate):""
                }
            },
            "paymentType":{
                name:"缴费方式"
            }
        };
        this.crawler_dl={
            "agentType":{
                name:"类型"
            },
            "agentName":{
                name:"代理机构/人名称"
            },
            "agentNo":{
                name:"代理机构代码"
            },
            "agentPaymentType":{
                name:"支付方式"
            }
        };
        this.crawler_other={
            "changeInfo":{
                name:"批单详细",
                width_key:"100px"
            },
            "specialInfo":{
                name:"特别约定",
                width_key:"100px"
            }
        };
        this.history=[
            {
                title:"修改类型",
                dataIndex:"type"
            },
            {
                title:"修改时间",
                dataIndex:"time"
            },
            {
                title:"操作员",
                dataIndex:"operator"
            },
            {
                title:"退保/批单发生额",
                dataIndex:"amount",
                render:(e=>{
                    return e.money()
                })
            },
            {
                title:"修改后保单剩余价值",
                dataIndex:"remainValue",
                render:(e=>{
                    return e.money()
                })
            }
        ]
    }


    componentDidMount(){
        this.show_customer(this.state.id);
    }
    // 详情
    show_customer(id){
        axios_bd.post(bd_detail_hs,{insuranceId:id}).then(data=>{
            let obj = data.data;
            //var crawler=obj.crawler;
            var review=obj.insurance;
            review.holderName=obj.holder.name;
            review.insuredName=obj.insured.name;
            review.insuredIdNo=obj.insured.idNo;
            this.setState({
                review:review,
                car:obj.car
            })
        })
        //修改记录
        //axios_bd.get(bd_modify_history+'?insuranceId='+id).then(e=>{
        //    if(!e.code){
        //        this.setState({
        //            historys:format_table_data(e.data)
        //        })
        //    }
        //})
        axios_bd.post(bd_crawler_detail_hs,{insuranceId:id}).then(data=>{
            let obj = data.data;
            this.setState({
                crawler:obj,
                failReason:data.err_msg
            })
        })
    }
    render (){
        return(
            <div>
                <Row className="contain">
                    <Tabs defaultActiveKey="2" >
                        <TabPane tab="爬虫详情" key="2">
                            {
                                this.state.crawler?<div>
                                    <div className="sub-title">保单基础信息</div>
                                    <TableCol data-columns={this.crawler_fields} data-source={this.state.crawler} />
                                    <div className="sub-title" style={{marginTop:"20px"}} >车辆信息</div>
                                    <TableCol data-columns={this.crawler_car} data-source={this.state.crawler} />
                                    <div className="sub-title" style={{marginTop:"20px"}} >缴费信息</div>
                                    <TableCol data-columns={this.crawler_jf} data-source={this.state.crawler} data-row="6" />
                                    <div className="sub-title" style={{marginTop:"20px"}} >代理信息</div>
                                    <TableCol data-columns={this.crawler_dl} data-source={this.state.crawler} />
                                    <div className="sub-title" style={{marginTop:"20px"}} />
                                    <TableCol data-columns={this.crawler_other} data-source={this.state.crawler} data-row="2" />
                                </div>:<div className="sub-title"><div>爬虫状态：爬虫失败</div><div>失败原因：{this.state.failReason}</div></div>
                            }

                        </TabPane>
                        <TabPane tab="进件详情" key="1">
                            <div className="sub-title">保单基础信息</div>
                            <TableCol data-columns={this.review_fields} data-source={this.state.review} />
                            <div className="sub-title" style={{marginTop:"20px"}} >车辆信息</div>
                            <TableCol data-columns={this.review_car} data-source={this.state.car} />
                        </TabPane>
                        {
                            //<TabPane tab="修改记录" key="3">
                            //    <Table columns={this.history} dataSource={this.state.historys} bordered pagination={false} rowKey="key" />
                            //</TabPane>
                        }

                    </Tabs>
                </Row>
            </div>
        )
    }
}

export default Detail;
