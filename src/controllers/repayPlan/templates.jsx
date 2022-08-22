import React, { Component } from 'react';
// import moment from 'moment';
import { bmd } from '../../ajax/tool';
import ListCtrl from '../List';
import { axios_loanMgnt } from '../../ajax/request';
import Permissions from '../../templates/Permissions';
import orderStatus from './status';
import {repay_contract_apply,repay_contract_download} from '../../ajax/api';
import {Modal,Button, message} from 'antd';
import {host_loanmanageMgnt} from '../../ajax/config';
/**
 * 还款计划列表模板
 * @bindcolumns 列表表头事件绑定
 * @appKey
 * @domain 
 * @bkSubject
 */
class RepayListTemplate extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: '序号',
                width: 50,
                dataIndex: 'key'
            },
            {
                title: '订单编号',
                dataIndex: 'domainNo'
            },
            {
                title: '借款方',
                dataIndex: 'borrowerName'
            },
            {
                title: '产品名称',
                dataIndex: "productName"
            },
            {
                title: '项目名称',
                dataIndex:"appName"
            },
            {
                title: '借款金额',
                dataIndex: "loanAmount",
                render:data=>bmd.money(data),
                order: (a, b) => bmd.getSort(a, b, "loanAmount")
            },
            {
                title: '已还本金合计',
                render: data => {
                    var money = Number(data.loanAmount) - Number(data.balance)
                    return money ? money.money() : "0.00"
                },
                order: (a, b) => {
                    var money_a = Number(a.loanAmount) - Number(a.balance);
                    var money_b = Number(b.loanAmount) - Number(b.balance)
                    return (money_a || 0) - (money_b || 0)
                }
            },
            {
                title: '已还期数',
                dataIndex: "repaidPhase"
            },
            {
                title: '总期数',
                dataIndex: "phaseCount"
            },
            {
                title: '贷款开始时间',
                dataIndex: 'loanStartDate',
                render: e => e ? e.split(" ")[0] : "--",
                order: (a, b) => bmd.getSort(a, b, "loanStartDate", true)
            },
            {
                title: '贷款结束时间',
                dataIndex: 'loanEndDate',
                render: e => e ? e.split(" ")[0] : "--",
                order: (a, b) => bmd.getSort(a, b, "loanEndDate", true)
            },
            {
                title: '订单状态',
                dataIndex: "manageCurrentRpStatus",
                render: data => orderStatus.map[data] || "--"
            },
            {
                title: '最近还款日期',
                dataIndex: 'currentRpLastSettleTime',
                render: e => e ? e.split(" ")[0] : "--",
                order: (a, b) => bmd.getSort(a, b, "currentRpLastSettleTime", true)
            },
            {
                title: '备注',
                render: data => {
                    if(data.gracePeriod===null){
                        return "--"
                    }
                    if(data.manageCurrentRpStatus===160||data.manageCurrentRpStatus===860){
                        if (((new Date().getTime() - new Date(data.currentRpRepayDate).getTime()) / 1000 / 60 / 60 / 24) <= data.gracePeriod) {
                            return data.manageCurrentRpStatus===160?"宽限期内待还款":"宽限期内还款"
                        }else{
                            return "--"
                        }
                    }else{
                        return "--"
                    }
                }
            },
            {
                title: '操作',
                operate: data => <Permissions size="small" server={global.AUTHSERVER.mgnt.key} tag="button" onClick={() => { this.detail(data) }} src={window.location.pathname + "/detail?contract_no=" + data.contractNo + "&appKey=" + data.appKey + "&urlType=jk&repayBtn=" + (this.props.repayBtn || "")+"&contractId="+data.contractId+"&borrowerId="+data.borrowerId}>查看</Permissions>
            },
        ]
        props.bindcolumns(this.columns, this);
        this.state = {
            items: this.getItems(),
            domainNo: "",
            phaseArr: []
        }
    }
    componentDidMount() {
        this.getSelect()
    }
    getItems(products = [], appKey = []) {
        return [
            {
                name: "订单编号",
                key: "domainNo",
                type: "text",
                placeholder: "请输入订单编号"
            },
            {
                name: "借款方",
                key: "borrowerName",
                type: "text",
                placeholder: "请输入借款方"
            },
            {
                name: "借款方手机号",
                key: "borrowerPhone",
                type: "text",
                placeholder: "请输入借款方手机号"
            },
            {
                name: "借款方身份证号",
                key: "borrowerIdNo",
                type: "text",
                placeholder: "请输入借款方身份证号"
            },
            {
                name: "产品名称",
                key: "productName",
                default: null,
                type: "select",
                values: products
            },
            {
                name: "项目名称",
                key: "appKey",
                default: null,
                type: "select",
                values: appKey
            },
            {
                name: "借款时间",
                key: "time",
                withTime: true,
                type: "range_date",
                placeholder: ["开始时间", "结束时间"],
                feild_s: "startLoanStartDate",
                feild_e: "endLoanStartDate",
                // default: [moment().subtract(1, "weeks"), moment()]
            },
            {
                name: "订单状态",
                key: "manageCurrentRpStatus",
                default: null,
                type: "select",
                values: orderStatus.select
            }
        ]
    }
    detail(data) {
        bmd.navigate(window.location.pathname + "/detail?contract_no=" + data.contractNo + "&appKey=" + data.appKey + "&urlType=jk&repayBtn=" + (this.props.repayBtn || "")+"&contractId="+data.contractId+"&borrowerId="+data.borrowerId+"&labelName="+this.props.labelName+"&domainNo="+data.domainNo)
    }
    contractApplyShow(data){
        this.setState({
            visible:true,
            contractNo:data.contractNo
        })
    }
    contractApply(){
        axios_loanMgnt.post(repay_contract_apply,{contractNo:this.state.contractNo}).then(e=>{
            if(!e.code){
                message.success("申请成功，请稍后刷新页面下载");
                this.contractApplyCancel();
            }else{
                message.warn("申请失败");
                this.contractApplyCancel();
            }
        }).catch(e=>{
            message.warn("申请失败");
            this.contractApplyCancel();
        })
    }
    contractApplyCancel(){
        this.setState({
            visible:false
        })
    }
    contractDownload(data){
        window.open(host_loanmanageMgnt+repay_contract_download+"?storageId="+data.signStorageId)
    }
    listRequestor(listParam) {
        console.log(listParam)
        let data = {
            ...listParam,
            appKey: this.props.appKey||listParam.appKey||"",
            labelName: this.props.labelName,
            labelType: this.props.labelType,
            onlyPaySuccess: true
        };
        return axios_loanMgnt.post("/manage/contract/repayContract_list", data);
    }
    totalRequestor(totalParam) {
        let data = {
            ...totalParam,
            appKey: this.props.appKey||totalParam.appKey||"",
            labelName: this.props.labelName,
            labelType: this.props.labelType,
            onlyPaySuccess: true
        }
        return new Promise((resolve, reject) => {
            axios_loanMgnt.post("/manage/contract/repayContract_listSum", data).then(res => {
                let totalData = Object.assign({}, res.data);
                totalData.key = "合计";
                resolve(totalData);
            })
        });
    }
    getSelect() {
        var data = {
            labelName: this.props.labelName,
            labelType: this.props.labelType,
            usage: "CONTRACT_LIST",
            appKey: this.props.appKey
        };
        Promise.all([axios_loanMgnt.post("/manage/util/getProductOptions", data), axios_loanMgnt.post("/manage/util/getLoanAppOptions", data)]).then(datas => {
            let products = datas[0].data.filter(product => product).map(product => ({ val: product.name, name: product.name }));
            let merchants = datas[1].data.filter(merchant => merchant).map(merchant => ({ val: merchant.appKey, name: merchant.appName }));
            this.setState({ items: this.getItems(products, merchants) })
        })
    }
    render() {
        let listProps = {
            items: this.state.items,
            columns: this.columns,
            listRequestor: this.listRequestor.bind(this),
            totalRequestor: this.totalRequestor.bind(this),
            type:"repay"
        }
        const modal={
            visible:this.state.visible,
            title:"申请结清证明",
            footer:<div>
                <Button size="small" onClick={this.contractApplyCancel.bind(this)}>取消</Button>
                <Button size="small" type="primary" onClick={this.contractApply.bind(this)}>确认</Button>
            </div>,
            closable:false
        }
        return <ListCtrl {...listProps}>
            { this.props.children }
            <Modal {...modal}>确认申请结清证明</Modal>
        </ListCtrl>;
    }
}
RepayListTemplate.defaultProps = {
    bindcolumns: () => { },
    appKey: ""
}
export default RepayListTemplate;