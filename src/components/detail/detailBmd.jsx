import React, { Component } from 'react';
import { Tabs ,Table , message } from 'antd';

import { axios_xjd ,axios_zyzj} from '../../ajax/request';
import { xjd_audit0_approve , xjd_audit1_approve ,xjd_audit0_deny,xjd_audit1_deny,repay_zyzj,xjd_audit0_detail,xjd_audit1_detail,xjd_pay_detail,xjd_loan_detail} from '../../ajax/api';
import { bmd } from '../../ajax/tool';
import Panel from '../../templates/Panel';
import TableLine from '../../templates/TableLine';
import QAList from '../../templates/QAList';
import FileShow from './components/fileShow';
import ImgTag from '../../templates/ImageTag_w';
import Audit from './components/Audit';
import AuditLog from './components/AuditLog';
import CarrierReport from './components/ReportShort';
import moment from "moment";
const TabPane = Tabs.TabPane;

class BMDDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
            visible:false,
            answerList:[],
            friendData:[],
            images:[],
            detail:{
                auditLogList:[]
            },
            files:[],
            contractInfo:{},
            type:props.location?props.location.query.type:""
        };
        this.loader = [];
        this.auditShow = props.auditShow===undefined?true:props.auditShow;
        this.orderNo = props.orderNo||(props.location?props.location.query.orderNo:"");
    }
    componentWillMount(){
        this.columnsBaseInfo = [
            {
                title:"借款方",
                dataIndex:"borrower"
            },
            {
                title:"性别",
                dataIndex:"gender"
            },
            {
                title:"年龄",
                dataIndex:"age"
            },
            {
                title:"身份证号",
                dataIndex:"idCardNo"
            },
            {
                title:"有效期截止日",
                dataIndex:"idCardExpireTime"
            },
            {
                title:"通讯地址",
                dataIndex:"idCardAddress"
            },
            {
                title:"注册手机号",
                dataIndex:"phoneNo"
            },
            {
                title:"运营商认证手机号",
                dataIndex:"operatorPhoneNo"
            },
            {
                title:"银行卡号",
                dataIndex:"bankCardNo"
            },
            {
                title:"所属银行",
                dataIndex:"bankName"
            },
            {
                title:"银行卡绑定手机号",
                dataIndex:"bankPhoneNo"
            },
            {
                title:"注册时间",
                dataIndex:"registerTime"
            },
            {
                title:"注册终端",
                dataIndex:"clientPlatform"
            },
            {
                title:"注册渠道",
                dataIndex:"clientChannel"
            }
        ]
        this.columnsBorrowInfo = [
            {
                title:"借款金额(元)",
                dataIndex:"loanAmount",
                render:data=> bmd.money(data.loanAmount)
            },
            {
                title:"年化综合费率",
                dataIndex:"yearInterestRate",
                render:data=> bmd.percent(data.yearInterestRate)
            },
            {
                title:"借款期限",
                dataIndex:"loanTerm"
            },
            {
                title:"借款期数",
                dataIndex:"totalPeriods"
            },
            {
                title:"APP名称",
                dataIndex:"registerApp"
            },
            {
                title:"产品名称",
                dataIndex:"productName"
            },
            {
                title:"商户名称",
                dataIndex:"merchantName"
            },
            {
                title:"订单时间",
                dataIndex:"orderTime"
            },
            {
                title:"订单编号",
                dataIndex:"orderNo"
            },
            {
                title:"提交借款时间",
                dataIndex:"orderTime"
            },
            {
                title:"借款开始时间",
                dataIndex:"loanStartDate"
            },
            {
                title:"借款结束时间",
                dataIndex:"loanEndDate"
            }
        ]
        this.columnsFriendInfo = [
            {
                title:"姓名",
                dataIndex:"name"
            },
            {
                title:"手机号",
                dataIndex:"phoneNo"
            },
            {
                title:"与本人关系",
                dataIndex:"type"
            },
        ]
        this.columnsBaseInfo_zy = [
            {
                title:"借款方",
                dataIndex:"userName",
                // render:e=>(e.copOrderInfo.userName)
            },
            {
                title:"性别",
                dataIndex:"gender"
            },
            {
                title:"年龄",
                dataIndex:"age"
            },
            {
                title:"身份证号",
                dataIndex:"idcardNo",
                // render:e=>(e.copOrderInfo.payeeIdcardNo)
            },
            {
                title:"有效期截止日",
                dataIndex:"idCardExpireTime"
            },
            {
                title:"通讯地址",
                dataIndex:"branchFullName",
                render:e=>(e.branchFullName||"--")
            },
            {
                title:"注册手机号",
                dataIndex:"copRegPhoneNo"
            },
            {
                title:"运营商认证手机号",
                dataIndex:"operatorPhoneNo"
            },
            {
                title:"银行卡号",
                dataIndex:"bankAccountNo"
            },
            {
                title:"所属银行",
                dataIndex:"bankName",
                render:e=>(e.bankName||"--")
            },
            {
                title:"银行卡绑定手机号",
                dataIndex:"bankCardPhoneNo"
            },
            {
                title:"注册时间",
                dataIndex:"registerTime"
            },
            {
                title:"注册终端",
                dataIndex:"clientPlatform"
            },
            {
                title:"注册渠道",
                dataIndex:"clientChannel"
            }
        ]
        this.columnsBorrowInfo_zy = [
            {
                title:"借款金额(元)",
                dataIndex:"amount",
                render:data=> {return bmd.money(data.amount)||"--";}
            },
            {
                title:"年化综合费率",
                dataIndex:"yearInterestRate",
                render:data=> bmd.percent(data.yearInterestRate)
            },
            {
                title:"借款期限",
                dataIndex:"loanTerm"
            },
            {
                title:"借款期数",
                dataIndex:"periodCount"
            },
            {
                title:"APP名称",
                dataIndex:"registerApp"
            },
            {
                title:"产品名称",
                dataIndex:"productName"
            },
            {
                title:"商户名称",
                dataIndex:"merchantName"
            },
            {
                title:"订单时间",
                dataIndex:"orderTime"
            },
            {
                title:"订单编号",
                dataIndex:"bmdLoanOrderNo"
            },
            {
                title:"提交借款时间",
                dataIndex:"orderTime"
            },
            {
                title:"借款开始时间",
                dataIndex:"loanStartDate",
                render:e=>e.loanStartDate?moment(e.loanStartDate).format("YYYY-MM-DD"):"--"
            },
            {
                title:"借款结束时间",
                dataIndex:"loanEndDate",
                render:e=>e.loanEndDate?moment(e.loanEndDate).format("YYYY-MM-DD"):"--"
            }
        ]
        this.user_zyzj=[
            {
                title:"婚否",
                dataIndex:"maritalStatus"
            },
            {
                title:"教育程度",
                dataIndex:"education"
            },
            {
                title:"薪资范围(元)",
                dataIndex:"salaryScale"
            },
            {
                title:"发薪日",
                dataIndex:"fxr"
            },
            {
                title:"从事行业",
                dataIndex:"cshy"
            },
            {
                title:"所在单位类别",
                dataIndex:"industryInvolved"
            },
            {
                title:"单位名称",
                dataIndex:"dwmc"
            },
            {
                title:"毕业学校",
                dataIndex:"school"
            },
            {
                title:"院系专业",
                dataIndex:"major"
            },
            {
                title:"现居住地/联系地址",
                render:e=>{
                    var data=(e.province?e.province:"")+(e.city?e.city:"")+(e.district?e.district:"")+(e.address?e.address:"");
                    return data||"--"
                }
            },
        ]
    }
    componentDidMount(){
        if(this.props.type==="zyzj"||this.props.type==="bl"){
            this.getDetail_zyzj()
        }else{
            this.getDetail();
        }
        // this.getContractInfo(this.domainName,this.domainNo);
    }
    // 获取基本信息
    getDetail(){
        var url={
            check:xjd_audit0_detail,
            review:xjd_audit1_detail,
            pay:xjd_pay_detail,
            loan:xjd_loan_detail,
        }
        axios_xjd.post(this.state.type?url[this.state.type]:xjd_loan_detail,{orderNo:this.orderNo}).then((data)=>{
            let files = [];
            files.push({
                title:"借款协议",
                file:[
                    { name:"借款协议",src:data.data.loanProtocolUrl}
                ]
            })
            let otherItem = {
                title:"其他协议",
                file:[]
            }
            let others = data.data.otherProtocolUrl;
            for(let o in others){
                otherItem.file.push({
                    name:o,
                    src:others[o]
                })
            }
            files.push(otherItem)
            let imgs = [];
            data.data.idCardFrontItem&&imgs.push({
                src:data.data.idCardFrontItem.originUrl,
                des:"身份证正面"
            })
            data.data.idCardBackItem&&imgs.push({
                src:data.data.idCardBackItem.originUrl,
                des:"身份证反面"
            })
            data.data.liveCheckBestImageItem&&imgs.push({
                src:data.data.liveCheckBestImageItem.originUrl,
                des:"人脸识别"
            });
            this.setState({
                detail:data.data,
                files:files,
                images:imgs,
                answerList:data.data.answerList,
                friendData:data.data.userContactInfoList,
            });
        });
    }
    getDetail_zyzj(){
        axios_zyzj.post(repay_zyzj,{bmdLoanOrderNo:this.orderNo}).then(data=>{
            let files = [];
            files.push({
                title:"借款协议",
                file:[
                    { name:"借款协议",src:data.data.contractFileStorageUrl}
                ]
            })
            let otherItem = {
                title:"其他协议",
                file:[
                    { name:"个人信息授权",src:data.data.infoAuthorizeStorageUrl}
                ]
            }
            files.push(otherItem)
            let imgs = [];
            data.data.idcardFrontImgStorageUrl&&imgs.push({
                src:data.data.idcardFrontImgStorageUrl,
                des:"身份证正面"
            })
            data.data.idcardBackImgStorageUrl&&imgs.push({
                src:data.data.idcardBackImgStorageUrl,
                des:"身份证反面"
            })
            data.data.liveCheckImgStorageUrl&&imgs.push({
                src:data.data.liveCheckImgStorageUrl,
                des:"人脸识别"
            });
            data.data.copOrderInfo.age=data.data.age;
            data.data.copOrderInfo.gender=data.data.gender;
            data.data.copOrderInfo.copRegPhoneNo=data.data.user.copRegPhoneNo;
            data.data.copOrderInfo.bankCardPhoneNo=data.data.bindCardInfos.length>0?data.data.bindCardInfos[0].bankCardPhoneNo:"";
            var temp={},result=[];
            if(data.data.riskControlInfo.userRCBaseInfo){
                var contact1List=data.data.riskControlInfo.userRCBaseInfo.contact1List||[];
                var topContactList=data.data.riskControlInfo.userRCBaseInfo.topContactList||[];
                var contactArr=contact1List.concat(topContactList);
                // contactArr.map((i,k)=>{
                //     if((!temp[i.type+i.name+i.phoneNo])){
                //         result.push(i);
                //         temp[i.type+i.name+i.phoneNo]=true;
                //     }
                // })
                for(var co in contactArr){
                    if((!temp[contactArr[co].type+contactArr[co].name+contactArr[co].phoneNo])){
                        result.push(contactArr[co]);
                        temp[contactArr[co].type+contactArr[co].name+contactArr[co].phoneNo]=true;
                    }
                }
            }
            this.setState({
                detail:Object.assign(data.data.copOrderInfo,data.data.payee),
                files:files,
                images:imgs,
                detail_user:data.data.riskControlInfo.userRCBaseInfo||{},
                friendData:result,
            });
        })
    }
    // 提交审核
    auditRequest(data){
        var pass={
            check:xjd_audit0_approve,
            review:xjd_audit1_approve,
        }
        var deny={
            check:xjd_audit0_deny,
            review:xjd_audit1_deny,
        }
        // 当前业务情况 固定复审  20210118
        axios_xjd.post(data.type==="pass"?pass.review:deny.review,{orderNos:this.orderNo,comment:data.comment||""}).then(res=>{
            message.success("操作成功");
            this.auditShow = false;
            this.getDetail();
        })
    }

    render (){
        let AuditLogEle = (
            <Panel title="审核意见">
                {this.state.detail.auditLogList?<AuditLog dataSource={this.state.detail.auditLogList} />:null}
                { this.state.detail.needAudit?<Audit bindsubmit={this.auditRequest.bind(this)} />:""}
            </Panel>
        )
        let AuditEle = this.auditShow?AuditLogEle:"";
        return(
            <div className="detail-contain">
                { AuditEle }
                <Tabs defaultActiveKey="1" type="card" className="bmd_detail" style={{marginBottom:"0"}}>
                    <TabPane tab="基本信息" key="1">
                        <Panel title="实名信息">
                            <ImgTag imgs={this.state.images} />
                            <TableLine columns={this.props.type==="zyzj"||this.props.type==="bl"?this.columnsBaseInfo_zy:this.columnsBaseInfo} dataSource={this.state.detail} />
                        </Panel>
                        <Panel title="借款信息">
                            <TableLine columns={this.props.type==="zyzj"||this.props.type==="bl"?this.columnsBorrowInfo_zy:this.columnsBorrowInfo} dataSource={this.state.detail} />
                        </Panel>
                        <Panel title="个人资料">
                            {
                                this.props.type==="zyzj"||this.props.type==="bl"?<TableLine columns={this.user_zyzj} dataSource={this.state.detail_user} />:<QAList dataSource={this.state.answerList} />
                            }
                        </Panel>
                        <Panel title="联系人信息">
                            <Table rowKey="id" columns={this.columnsFriendInfo} dataSource={this.state.friendData} pagination={false} bordered />
                        </Panel>
                        <Panel title="协议">
                            <FileShow source={this.state.files} />
                        </Panel>
                    </TabPane>
                    <TabPane tab="规则报告" key="2">
                        <Panel>
                            暂无数据
                        </Panel>
                    </TabPane>
                    <TabPane tab="通讯录" key="3">
                        <Panel>
                            暂无数据
                        </Panel>
                    </TabPane>
                    <TabPane tab="运营商报告" key="4">
                        <CarrierReport appKey={this.state.detail.appKey} appTaskId={this.state.detail.appTaskId} carrierReportUrl={this.state.detail.carrierReportUrl} />
                    </TabPane>
                </Tabs>
        <style>{`
            .bmd_detail .ant-tabs-bar{
                background:none!important;
                padding:0!important
            }
            .bmd_detail .ant-tabs-tabpane{
                padding-top:0!important
            }
        `
        }</style>
            </div>
        )
    }
}

export default BMDDetail;