import React, { Component } from 'react';
import { axios_loanMgnt,axios_xjd ,axios_zyzj_json} from '../../../../ajax/request';
import { repay_contract_detail,repay_pay_detail ,repay_get_url,xjd_loan_detail,repay_zyzj_auditLog} from '../../../../ajax/api';
import Panel from '../../../../templates/Panel';
import LineTable from '../../../../templates/TableLine';
import {bmd} from '../../../../ajax/tool';
import FileShow from '../../../detail/components/fileShow';
import AuditLog from '../../../detail/components/AuditLog';
class Order extends Component {
    constructor(props) { 
        super(props);
        this.state={
            orderData:{},
            payData:{},
            files:[],
            auditLogList:[]
        }
        this.files=[]
        this.columns=[
            {
                title:"审核阶段",
                dataIndex:"auditPhaseChr"
            },
            {
                title:"开始时间",
                dataIndex:"startTime"
            },
            {
                title:"结束时间",
                dataIndex:"endTime",
                render:e=>e||"--"
            },
            {
                title:"审核状态",
                dataIndex:"statusChs"
            },
            {
                title:"操作人",
                dataIndex:"opName",
                render:e=>e||"--"
            },
        ]
    }
    componentWillMount() {
        this.contract=[
            {
                title:"借款金额（元）",
                dataIndex:"amount",
                render:e=>bmd.money(e.amount)
            },
            // {
            //     title:"借款期限",
            //     dataIndex:"term"
            // },
            {
                title:"借款期数",
                dataIndex:"phaseCount"
            },
            {
                title:"APP名称",
                dataIndex:"appName"
            },
            {
                title:"产品名称",
                dataIndex:"productName"
            },
            {
                title:"商户名称",
                dataIndex:"cooperator"
            },
            {
                title:"借款申请时间",
                dataIndex:"createTime"
            },
            {
                title:"白猫贷订单编号",
                dataIndex:"domainNo"
            },
            // {
            //     title:"审核时间",
            //     dataIndex:"time"
            // },
            // {
            //     title:"借款开始时间",
            //     dataIndex:"loanStartDate"
            // },
            // {
            //     title:"借款结束时间",
            //     dataIndex:"loanEndDate"
            // },
            {
                title:"预计借贷开始日期",
                // dataIndex:"extraParams.coopLoanStartDate",
                render:e=>{
                    if(e.extraParams){
                        return e.extraParams.coopLoanStartDate||"--"
                    }else{
                        return "--"
                    }
                }
            },
            {
                title:"还款日",
                dataIndex:"repayDay"
            },
            {
                title:"借款用途",
                dataIndex:"loanPurpose",
                
            },
            {
                title:"综合费率",
                // dataIndex:"contractLoanConfig.generalRate",
                render:e=>{
                    if(e.contractLoanConfig){
                        var data=e.contractLoanConfig.generalRate;
                        return data?(data*100).toFixed(2)+"%":"--"
                    }else{
                        return "--"
                    }
                    
                }
            },
            {
                title:"利息率",
                // dataIndex:"contractLoanConfig.interestRate"
                render:e=>{
                    if(e.contractLoanConfig){
                        var data=e.contractLoanConfig.interestRate;
                        return data?(data*100).toFixed(2)+"%":"--"
                    }else{
                        return "--"
                    }
                    
                }
            },
            {
                title:"服务费率",
                // dataIndex:"contractLoanConfig.serviceFeeRate"
                render:e=>{
                    if(e.contractLoanConfig){
                        var data=e.contractLoanConfig.serviceFeeRate;
                        return data?(data*100).toFixed(2)+"%":"--"
                    }else{
                        return "--"
                    }
                    
                }
            },
            {
                title:"其他费率",
                // dataIndex:"contractLoanConfig.otherFeeRate"
                render:e=>{
                    if(e.contractLoanConfig){
                        var data=e.contractLoanConfig.otherFeeRate;
                        return data?(data*100).toFixed(2)+"%":"--"
                    }else{
                        return "--"
                    }
                    
                }
            },
            {
                title:"科技服务费",
                // dataIndex:"contractLoanConfig.serviceTechFeeRate"
                render:e=>{
                    if(e.contractLoanConfig){
                        var data=e.contractLoanConfig.serviceTechFeeRate;
                        return data?(data*100).toFixed(2)+"%":"--"
                    }else{
                        return "--"
                    }
                    
                }
            },
            {
                title:"逾期罚息费率",
                // dataIndex:"contractLoanConfig.overdueInterestRate"
                render:e=>{
                    if(e.contractLoanConfig){
                        var data=e.contractLoanConfig.overdueInterestRate;
                        return data?(data*100).toFixed(2)+"%":"--"
                    }else{
                        return "--"
                    }
                    
                }
            },
            {
                title:"逾期违约金费率",
                // dataIndex:"contractLoanConfig.penaltyOverdueFeeRate"
                render:e=>{
                    if(e.contractLoanConfig){
                        var data=e.contractLoanConfig.penaltyOverdueFeeRate;
                        return data?(data*100).toFixed(2)+"%":"--"
                    }else{
                        return "--"
                    }
                    
                }
            },
            {
                title:"提前结清手续费率",
                // dataIndex:"contractLoanConfig.penaltyAheadFeeRate"
                render:e=>{
                    if(e.contractLoanConfig){
                        var data=e.contractLoanConfig.penaltyAheadFeeRate;
                        return data?(data*100).toFixed(2)+"%":"--"
                    }else{
                        return "--"
                    }
                    
                }
            },
            // {
            //     title:"付款模式",
            //     dataIndex:"payeeType",
            //     render:e=>e.payeeType==="PERSONAL"?"对私":"对公"
            // },
            
            {
                title:"利率类型",
                dataIndex:"contractLoanConfig.calRateType"
            },
            {
                title:"利率期限单位",
                // dataIndex:"contractLoanConfig.rateUnit",
                render:e=>{
                    var type={YEAR:"年",MONTH:"月",DAY:"日"};
                    return e.contractLoanConfig?type[e.contractLoanConfig.rateUnit]:"--"
                }
            },
            {
                title:"收款账户名",
                dataIndex:"payee.name"
            },
            {
                title:"收款账户号",
                dataIndex:"payee.accountCode"
            },
        ]
        this.pay=[
            {
                title:"放款金额",
                dataIndex:"actualAmount",
                render:e=>bmd.money(e.actualAmount)
            },
            {
                title:"放款状态",
                dataIndex:"status"
            },{
                title:"失败原因",
                dataIndex:"failReason"
            },{
                title:"放款交易编号",
                dataIndex:"lmSerialNo"
            },{
                title:"创建时间",
                dataIndex:"createTime"
            },{
                title:"回调业务状态",
                dataIndex:"notifyStatus"
            },{
                title:"借贷开始时间",
                dataIndex:"loanStartDate"
            },{
                title:"借贷结束时间",
                dataIndex:"loanEndDate"
            },
        ]
        this.getInfo();
    }
    getInfo() {
        axios_loanMgnt.post(repay_contract_detail, { contractNo: this.props.contract_no }).then(e=>{
            this.setState({
                orderData:e.data,
            })
            this.payInfo(e.data.loanStartDate,e.data.loanEndDate)
            if(this.props.title!=="保理业务"){
                if(e.data.loanAgreementStorageId){
                    this.getUrl("借款协议",e.data.loanAgreementStorageId);
                }
            }
            var storageItems=e.data.storageItems;
            storageItems.forEach(element => {
                if(element.storageId){
                    this.getUrl(element.name,element.storageId)
                }
            });
        })
        if(this.props.title==="白猫贷业务"){
            axios_xjd.post(xjd_loan_detail,{orderNo:this.props.domainNo}).then(e=>{
                if(!e.code){
                    this.setState({
                        auditLogList:e.data.auditLogList
                    })
                }
            })
        }else{
            if(this.props.title!=="助贷业务"){
                axios_zyzj_json.get(repay_zyzj_auditLog+"?lmContractNo="+this.props.contract_no).then(e=>{
                    if(!e.code){
                        this.setState({
                            auditLogList:e.data
                        })
                    }
                })
            }
        }
    }
    getUrl(title,id){
        axios_loanMgnt.post(repay_get_url,{storageId:id}).then(e=>{
            this.files.push({
                title:title,
                file:[
                    { name:title,src:e.data}
                ]
            })
            this.setState({
                files:this.files
            })
        })
    }
    payInfo(loanStartDate,loanEndDate){
        axios_loanMgnt.post(repay_pay_detail,{contractNo:this.props.contract_no}).then(e=>{
            if(!e.code){
                var data=e.data;
                data.loanStartDate=loanStartDate;
                data.loanEndDate=loanEndDate;
                this.setState({
                    payData:data
                })
            }
        })
    }
    render() {
        return <div className="bmd_detail">
            {this.state.auditLogList.length>0&&this.props.title!=="助贷业务"?<Panel title="订单审核记录">
                <AuditLog dataSource={this.state.auditLogList} columns={this.props.title==="白猫贷业务"?false:this.columns} />
            </Panel>:null}
            <Panel title="进件信息">
                <LineTable columns={this.contract} dataSource={this.state.orderData} />
            </Panel>
            <Panel title="放款信息">
                <LineTable columns={this.pay} dataSource={this.state.payData} />
            </Panel>
            <Panel title="协议相关">
                <FileShow source={this.state.files} />
            </Panel>
            
        </div>
    }
}
export default Order