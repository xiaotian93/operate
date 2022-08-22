import React, { Component } from 'react';
import { Button } from 'antd';
import { axios_gyl } from '../../../ajax/request';
import { custom_detail } from '../../../ajax/api';
import ImgTag from '../../../templates/ImageTag_w';
import TableCol from '../../../templates/TableCol_4';
import { browserHistory } from 'react-router';
import ComponentRoute from '../../../templates/ComponentRoute';
import Card from '../../../views/Card';
class Gyl extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companyId: props.location.query.companyId,
            statusMsg: "",
            visible: false,
            guaranteeStorageList: [],
            frameStorageList: [],
            loanContractStorageList: [],
            serviceStorageList: [],
            personPromiseStorageList: [],
            personWageStorageList: [],
            otherInfoImageStorageList: [],
            additionStorageList: [],
            source: {
                otherStorageList: []
            },
            storages: []
        }
    }
    componentWillMount() {
        if (this.state.companyId) {
            this.getDetail();
        };
        const down = JSON.parse(window.localStorage.getItem("dropdownList"));
        const industryInvolved = down.industryInvolved;
        const industryType = down.industryType;
        const scale = down.scale;
        this.basic = {
            "name": {
                name: "企业名称",
                render: (e) => { return e.name ? e.name : "--" }
            },
            "shortName": {
                name: "企业简称",
                render: (e) => { return e.shortName ? e.shortName : "--" }
            },
            "creditCode": {
                name: "企业统一信用代码",
                render: (e) => { return e.creditCode ? e.creditCode : "--" }
            },
            "expireDate": {
                name: "营业执照截止日期",
                render: (e) => { return e.expireDate ? e.expireDate : "--" }
            },
            "industryInvolved": {
                name: "所属行业",
                render: (e) => {
                    return industryInvolved ? (e.industryInvolved ? industryInvolved[e.industryInvolved.toString()] : "--") : "--"
                }
            },
            "scale": {
                name: "企业规模",
                render: (e) => {
                    return scale ? (e.scale ? scale[e.scale.toString()] : "--") : "--"
                }
            },
            "industryType": {
                name: "产业类型",
                render: (e) => {
                    return industryType ? (e.industryType ? industryType[e.industryType.toString()] : "--") : "--"
                }
            },
            "mobile": {
                name: "企业联系方式",
                render: (e) => { return e.mobile ? e.mobile : "--" }
            },
            "addressProvince": {
                name: "省份",
                render: (e) => { return e.addressProvince ? e.addressProvince : "--" }
            },
            "addressCity": {
                name: "城市",
                render: (e) => { return e.addressCity ? e.addressCity : "--" }
            },
            "addressDistrict": {
                name: "区/县",
                render: (e) => { return e.addressDistrict ? e.addressDistrict : "--" }
            },
            "addressDetail": {
                name: "详细地址",
                render: (e) => { return e.addressDetail ? e.addressDetail : "--" }
            },
            "time": {
                name: "注册时间",
                render: () => { return "--" }
            },
            "time1": {
                name: "商户名称",
                render: () => { return "--" }
            },
            "time2": {
                name: "渠道",
                render: () => { return "--" }
            },
            "qyNo": {
                name: "客户ID",
                render: (e) => { return e.qyNo ? e.qyNo : "--" }
            },
        }
        this.fr = {
            "legalManName": {
                name: "法人姓名",
                render: (e) => { return e.legalManName ? e.legalManName : "--" }
            },
            "legalPersonPhone": {
                name: "法人手机号",
                render: (e) => { return e.legalPersonPhone ? e.legalPersonPhone : "--" }
            },
            "legalPersonIdCard": {
                name: "法人身份证号",
                render: (e) => { return e.legalPersonIdCard ? e.legalPersonIdCard : "--" }
            },
        }
        this.js = {
            "settleAccountName": {
                name: "结算账户名称",
                render: (e) => { return e.settleAccountName ? e.settleAccountName : "--" }
            },
            "settleBankCard": {
                name: "结算账号",
                render: (e) => { return e.settleBankCard ? e.settleBankCard : "--" }
            },
            "settleBankName": {
                name: "开户银行",
                render: (e) => { return e.settleBankName ? e.settleBankName : "--" }
            },
            "settleSubBankName": {
                name: "开户行名称",
                render: (e) => { return e.settleSubBankName ? e.settleSubBankName : "--" }
            },
        }
        this.hk = {
            "repayAccountName": {
                name: "还款账户名称",
                // span_val:3,
                render: (e) => { return e.repayAccountName ? e.repayAccountName : "--" }
            },
            "repayBankCard": {
                name: "还款银行卡号",
                // span_val:3,
                render: (e) => { return e.repayBankCard ? e.repayBankCard : "--" }
            },
        }
        this.fields = {
            "agentName": {
                name: "联系人姓名",
                render: (e) => { return e.agentName ? e.agentName : "--" }
            },
            "agentPhone": {
                name: "联系人手机号",
                render: (e) => { return e.agentPhone ? e.agentPhone : "--" }
            },
            "agentIdCard": {
                name: "联系人身份证号",
                render: (e) => { return e.agentIdCard ? e.agentIdCard : "--" }
            },
            "agentEmail": {
                name: "联系人邮箱",
                render: (e) => { return e.agentEmail ? e.agentEmail : "--" }
            },
        }
    }
    getImage(storageList=[], des) {
        return storageList.map(storage => ({ src: storage.url, des }))
    }
    //订单详情
    getDetail() {
        axios_gyl.get(custom_detail + "?companyId=" + this.state.companyId).then((data) => {
            let idcardArr = [];
            let detail = data.data;
            idcardArr = idcardArr.concat(this.getImage(detail.agentIdCardStorageList, "联系人身份证"))
            idcardArr = idcardArr.concat(this.getImage(detail.legalPersonIdCardStorageList, "法人身份证"))
            idcardArr = idcardArr.concat(this.getImage(detail.licenseStorageList, "营业执照影像"))
            idcardArr = idcardArr.concat(this.getImage(detail.settleBankLicStorageList, "开户许可证"))
            this.setState({ source: detail, storages: idcardArr })
        });
    }
    go_edit(id) {
        browserHistory.push('/kh/gyl/list/edit?companyId=' + this.state.companyId);
    }
    render() {
        return <div>
            <Card title="基本信息">
                <ImgTag imgs={this.state.storages} />
                {this.state.storages.map(file => {
                    return <a href={file.src} style={{ display: "inline-block",marginRight:"20px",marginBottom:"20px" }} target="_blank">{file.des}</a>
                })}
                <TableCol data-source={this.state.source} data-columns={this.basic} />
            </Card>
            <Card title="其他资料">
                {this.state.source.otherStorageList && this.state.source.otherStorageList.map(file => {
                    return <a href={file.url} style={{ display: "block" }} download>{file.fileOriginName}</a>
                })}
            </Card>
            <Card title="法人信息">
                <TableCol data-source={this.state.source} data-columns={this.fr} />
            </Card>
            <Card title="结算账户信息">
                <TableCol data-source={this.state.source} data-columns={this.js} />
            </Card>
            <Card title="还款账户信息">
                <TableCol data-source={this.state.source} data-columns={this.hk} />
            </Card>
            <Card title="联系人信息">
                <TableCol data-source={this.state.source} data-columns={this.fields} />
            </Card>
            <div style={{ textAlign: "center", margin: "10px 2%" }}>
                <Button onClick={this.go_edit.bind(this)} type="primary">编辑</Button>
            </div>
        </div>
    }
}
export default ComponentRoute(Gyl);