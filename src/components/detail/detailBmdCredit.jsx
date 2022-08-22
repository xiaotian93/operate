import React, { Component } from 'react';
import { Tabs ,Table , message } from 'antd';

import { axios_xjd } from '../../ajax/request';
import { xjd_order_credit_list_detail , xjd_credit_manual_approve , xjd_credit_manual_deny ,xjd_credit_manual_detail,xjd_credit_system_detail} from '../../ajax/api';
import { bmd } from '../../ajax/tool';
import Panel from '../../templates/Panel';
import TableLine from '../../templates/TableLine';
import QAList from '../../templates/QAList';
import FileShow from './components/fileShow';
import ImgTag from '../../templates/ImageTag_w';
import Audit from './components/AuditCredit';
import AuditLog from './components/AuditLog';
import CarrierReport from './components/ReportShort';

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
            type:props.location.query.type
        };
        this.requestId = props.requestId||props.location.query.requestId;
        this.auditShow = props.audit||props.location.query.audit;
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
            },
            {
                title:"APP名称",
                dataIndex:"registerApp"
            },
            {
                title:"订单时间",
                dataIndex:"requestTime"
            },
            {
                title:"订单编号",
                dataIndex:"requestId"
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
                dataIndex:"loanOrderTime"
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
    }
    componentDidMount(){
        this.getDetail();
    }
    // 获取基本信息
    getDetail(){
        var url={
            audit:xjd_credit_manual_detail,
            auto:xjd_credit_system_detail
        }
        axios_xjd.post(this.state.type?url[this.state.type]:xjd_order_credit_list_detail,{requestId:this.requestId}).then((data)=>{
            let files = [];
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
    
    // 提交审核
    auditRequest(data){
        axios_xjd.post(data.type==="pass"?xjd_credit_manual_approve:xjd_credit_manual_deny,
        {requestId:this.requestId,comment:data.comment,loanAmount:data.loanAmount})
        .then(res=>{
            this.setState({
                auditNos:false
            })
            message.success("操作成功");
            this.getDetail();
        })
    }

    render (){
        let AuditLogEle = (
            <Panel title="审核意见">
                <AuditLog dataSource={this.state.detail.auditLogList} />
                { this.state.detail.needAudit?<Audit maxAmount={this.state.detail.productMaxAmount} minAmount={this.state.detail.productMinAmount} bindsubmit={this.auditRequest.bind(this)} creditLimit={this.state.detail.creditLimit} />:""}
            </Panel>
        )
        let AuditEle = this.auditShow?AuditLogEle:"";
        return(
            <div className="detail-contain">
                { AuditEle }
                <Tabs defaultActiveKey="1" className="bmdTab">
                    <TabPane tab="基本信息" key="1">
                        <Panel title="实名信息">
                            <ImgTag imgs={this.state.images} />
                            <TableLine columns={this.columnsBaseInfo} dataSource={this.state.detail} />
                        </Panel>
                        <Panel title="个人资料">
                            <QAList dataSource={this.state.answerList} />
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
            </div>
        )
    }
}

export default BMDDetail;