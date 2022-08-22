import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { axios_gyl } from "../../ajax/request";
import { gyl_detail, gyl_detail_approve0, gyl_detail_approve1, get_pay_success_detail_gyl, get_wait_pay_detail_gyl } from "../../ajax/api";
import TimeLine from "./timeLine_gyl";
import TableCol from "./table-col";
import Card from '../../views/Card';
import { bmd } from '../../ajax/tool';
import FileView from '../../views/FileView';


class LineTable extends Component {
    constructor(props) {
        super(props);
        // 识别参数来源   地址栏or属性
        let audit = false, orderNo, schedule, type = "jk";
        if (props.location) {
            audit = props.location.query.audit === "false" ? false : props.location.query.audit;
            orderNo = props.location.query.orderNo;
            schedule = true;
            type = props.location.query.type
        } else {
            orderNo = props.orderNo;
            schedule = false;
        }
        this.state = {
            audit: audit,
            schedule: schedule,
            payeeCompanyDetail: {},
            orderNo: orderNo,
            guaranteeStorageList: [],
            otherInfoImageStorageList: [],
            additionStorageList:[],
            loanContractStorageList: [],
            serviceStorageList: [],
            data: {},
            type: type
        }
    }
    componentWillMount() {
        this.borrowerFeilds = {
            borrowerName: { name: "企业名称" },
            borrowerIdNo: { name: "营业执照号" },
            borrowerIdNoExpireDate: {
                name: "营业执照截止日期", span_val: 3,
                render: e => e.borrowerIdNoExpireDate ? e.borrowerIdNoExpireDate.split(" ")[0] : "--"
            },
            borrowerAddressProvince: {
                name: "联系地址",
                span_val: 3,
                render: e => `${e.borrowerAddressProvince || ""}${e.borrowerAddressCity || ""}${e.borrowerAddressDistrict || ""}${e.borrowerAddressDetail || ""}`
            },
            borrowerPhone: {
                name: "联系手机号",
                span_val: 3
            }
        }
        this.payeeFeilds = {
            name: { name: "企业名称" },
            creditCode: { name: "营业执照号" },
            createTime: {
                name: "营业执照截止日期", span_val: 3,
                render: data => `${data.createTime || ""}${data.expireDate || ""}`
            },
            addressCity: {
                name: "联系地址",
                span_val: 3,
                render: e => `${e.addressProvince || ""}${e.addressCity || ""}${e.addressDistrict || ""}${e.addressDetail || ""}`
            },
            mobile: { name: "联系手机号", span_val: 3 },
            settleAccountName: { name: "结算账户名称" },
            settleBankCard: { name: "结算账号" },
            settleBankName: { name: "开户银行" },
            settleSubBankName: { name: "开户行名称" },
        }
        this.borrowFeilds = {
            amount: { name: "借款金额", render: e => bmd.money(e.amount) },
            period: { name: "借款期限(天)" },
            yearInterestRate: {
                name: "借款利率",
                render: e => {
                    return e.yearInterestRate + "%"
                }
            },
            yearServiceRate: {
                name: "服务费率",
                render: e => {
                    return e.yearServiceRate + "%"
                }
            },
            plainAmount: { name: "原始应收账款", render: data => bmd.money(data.plainAmount) },
            gylLoanSerialNo: { name: "智单号" },
            general: { name: "综合费用", render: data => bmd.money(data.general) },
            payAmount: { name: "放款金额", render: data => bmd.money(data.payAmount) },
            loanStartDate: {
                name: "借款开始时间"
            },
            loanEndDate: {
                name: "借款结束时间"
            },
            feeCollectModeChs: { name: "借款模式" },
            remark: { name: "备注" }
        }
    }
    componentDidMount() {
        this.getDetail();
    }
    getDetail() {
        var url = {
            check: gyl_detail_approve0,
            review: gyl_detail_approve1,
            jk: get_pay_success_detail_gyl,
            pay: get_wait_pay_detail_gyl
        }
        axios_gyl.post((this.state.type ? url[this.state.type] : gyl_detail),{orderNo:this.state.orderNo}).then((data) => {
            let detail = data.data;
            let {
                payeeCompanyDetail,
                guaranteeStorageList = [],
                serviceStorageList = [],
                loanContractStorageList = [],
                otherInfoImageStorageList = [],
                additionStorageList = []
            } = detail;
            this.setState({
                payeeCompanyDetail,
                guaranteeStorageList,
                serviceStorageList,
                loanContractStorageList,
                otherInfoImageStorageList,
                additionStorageList,
                data: detail
            })
        });
    }
    renderFile(storageList = []) {
        if (storageList.length === 0) return "暂无";
        return storageList.map((i, k) => <a style={{ marginRight: "8px" }} href={i.url} key={k} target="_blank" download>{i.fileOriginName}</a>)
    }
    render() {
        return (
            <div>
                <Row>
                    {this.state.schedule ? <TimeLine pild={this.state.orderNo} /> : ""}
                </Row>
                <Card title="债务方信息">
                    <TableCol data-columns={this.borrowerFeilds} data-source={this.state.data} />
                </Card>
                <Card title="债权方信息">
                    <TableCol data-columns={this.payeeFeilds} data-source={this.state.payeeCompanyDetail} />
                </Card>
                <Card title="借款信息">
                    <TableCol data-columns={this.borrowFeilds} data-source={this.state.data} />
                </Card>
                <Card title="申请资料">
                    <Row>
                        <Col span={8}><FileView title="担保合同：" storageList={this.state.guaranteeStorageList} /></Col>
                        <Col span={8}><FileView title="技术服务协议：" storageList={this.state.serviceStorageList} /></Col>
                        <Col span={8}><FileView title="借款协议：" storageList={this.state.loanContractStorageList} /></Col>
                    </Row>
                    <Row>
                        <Col span={8}><FileView title="其他资料：" storageList={this.state.otherInfoImageStorageList} /></Col>
                        <Col span={8}><FileView title="附加资料：" storageList={this.state.additionStorageList} /></Col>
                    </Row>
                </Card>
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