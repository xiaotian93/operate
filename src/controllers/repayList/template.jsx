import React, { Component } from 'react';
import moment from 'moment';
import { bmd, format_date } from '../../ajax/tool';
import ListCtrl from '../List';
import { axios_loanMgnt } from '../../ajax/request';
import Permissions from '../../templates/Permissions';
import Repay from '../../components/repay/elements/ygdDiscount';
import orderStatus from '../repayPlan/status';

/**
 * 还款计划列表模板
 * @bindcolumns 列表表头事件绑定
 * @appKey
 * @domain 
 * @bkSubject
 */
class RepayUnderTemplate extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: '序号',
                width: "50px",
                dataIndex: 'key'
            },
            {
                title: '订单编号',
                dataIndex: 'domainNo'
            },
            {
                title: '期数',
                dataIndex: 'phase'
            },
            {
                title: '应还款日期',
                dataIndex: 'repayDate',
                render: date => format_date(date) ,
                sorter: (a, b) => {
                    return bmd.getSort(a, b, "repayDate", true)
                }
            },
            {
                title: '借款方',
                dataIndex: 'borrowerName'
            },
            {
                title: '产品名称',
                dataIndex: 'productName'
            },
            {
                title: '项目名称',
                dataIndex:"appName"
            },
            {
                title: '应还本金',
                dataIndex: "principal",
                render: data => bmd.money(data) ,
                sorter: (a, b) => {
                    return bmd.getSort(a, b, "principal")
                }
            },
            {
                title: '应还利息',
                dataIndex: "interest",
                render: data =>bmd.money(data),
                sorter: (a, b) => {
                    return bmd.getSort(a, b, "interest")
                }
            },
            {
                title: '应还服务费',
                dataIndex: "serviceFee",
                render: data => bmd.money(data),
                sorter: (a, b) => {
                    return bmd.getSort(a, b, "serviceFee")
                }
            },
            {
                title: '应还其他费用',
                dataIndex: "otherFee",
                render: data => bmd.money(data) ,
                sorter: (a, b) => {
                    return bmd.getSort(a, b, "otherFee")
                }
            },
            {
                title: '应还合计',
                render: data => bmd.money(data.principal + data.interest + data.serviceFee + data.otherFee) 
            },
            {
                title: '还款状态',
                dataIndex:"manageRpStatus",
                render:(data)=> orderStatus.underRepayMap[data]||"--"
            },
            {
                title: '最近还款日期',
                dataIndex: 'lastSettleTime',
                render: e => e ? e.split(" ")[0] : "--",
                order: (a, b) => bmd.getSort(a, b, "lastSettleTime", true)
            },
            {
                title: '是否还款中',
                dataIndex:"processStatus",
                render:(data)=>{
                    var type={ 100:"是", 0:"否" }
                    return type[data]||"--"
                }
            },
            {
                title: '备注',
                render: data => {
                    if(data.gracePeriod===null){
                        return "--"
                    }
                    if(data.manageRpStatus===160||data.manageRpStatus===860){
                        if (((new Date().getTime() - new Date(data.repayDate).getTime()) / 1000 / 60 / 60 / 24) <= data.gracePeriod) {
                            return data.manageRpStatus===160?"宽限期内待还款":"宽限期内还款"
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
                operate: (data) => <Permissions size="small" onClick={() => { this.detail(data) }} server={global.AUTHSERVER.mgnt.key} tag="button" src={window.location.pathname + "/detail?contract_no=" + data.contractNo + "&appKey=" + data.appKey + "&urlType=jk&repayBtn=" + (this.props.repayBtn || "")+"&contractId="+data.contractId+"&borrowerId="+data.borrowerId}>查看</Permissions>
            }
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
    getItems( products = [], merchants = []) {
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
                default:null,
                type: "select",
                values: products
            },
            {
                name: "项目名称",
                key: "appKey",
                default:null,
                type: "select",
                values: merchants
            },
            {
                name: "还款时间",
                key: "time",
                withTime: true,
                type: "range_date",
                placeholder: ["开始时间", "结束时间"],
                feild_s: "startDate",
                feild_e: "endDate",
                default: [moment(), moment().add(6, "days")],
            },
            {
                name: "还款状态",
                key: "manageRpStatus",
                type: "select",
                default:null,
                values: orderStatus.underRepaySelect
            },
            {
                name: "是否还款中",
                type: "select",
                key:"processStatus",
                default:null,
                values:[{val:"100",name:"是"},{val:"0",name:"否"}]
            }
        ]
    }
    detail(data) {
        bmd.navigate(window.location.pathname + "/detail?contract_no=" + data.contractNo + "&appKey=" + data.appKey + "&urlType=jk&repayBtn=" + (this.props.repayBtn || "")+"&contractId="+data.contractId+"&borrowerId="+data.borrowerId+"&labelName="+this.props.labelName+"&domainNo="+data.domainNo)
    }
    listRequestor(listParam) {
        let data = {
            ...listParam,
            appKey: this.props.appKey||listParam.appKey||"",
            labelName: this.props.labelName,
            labelType: this.props.labelType,
            onlyUnRepay: false
        };
        return axios_loanMgnt.post("/manage/repayPlan/list", data);
    }
    totalRequestor(totalParam) {
        let data = {
            ...totalParam,
            appKey: this.props.appKey||totalParam.appKey||"",
            labelName: this.props.labelName,
            labelType: this.props.labelType,
            onlyUnRepay: false
        }
        return new Promise((resolve, reject) => {
            axios_loanMgnt.post("/manage/repayPlan/listSum", data).then(res => {
                let totalData = Object.assign({}, res.data);
                totalData.key = "合计";
                totalData.processStatus = "--";
                totalData.phase = "--";
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
            this.setState({ items: this.getItems( products, merchants) })
        })
    }
    repayShow(data){
        var phase=data.currentRpPhase,phaseArr=[];
        for(let i=phase;i<=data.phaseCount;i++){
            phaseArr.push(i)
        }
        this.setState({
            phaseArr:phaseArr,
            domainNo:data.domainNo
        })
        setTimeout(function(){
            this.repayAllModel.show();
        }.bind(this),10)
    }
    render() {
        let listProps = {
            items: this.state.items,
            columns: this.columns,
            listRequestor: this.listRequestor.bind(this),
            totalRequestor: this.totalRequestor.bind(this),
            type:"repay"
        }
        return <ListCtrl {...listProps}>
            <Repay onRef={model => this.repayAllModel = model} repayAll project={this.props.project} domainNo={this.state.domainNo} repayPhase={this.state.phaseArr} />
        </ListCtrl>;
    }
}
RepayUnderTemplate.defaultProps = {
    bindcolumns: () => { },
    appKey: ""
}
export default RepayUnderTemplate;