import React, { Component } from 'react';
import { axios_loanMgnt,axios_payState ,axios_common} from '../../../ajax/request';
import Card from '../../../views/Card';
import TableCol from '../../detail/table-col';
import Table from '../../../views/Table';
import MgntProjectCtrl from '../../../request/mgnt/project';
import StorageNoViewCtrl from '../../../controllers/storageView/Mgnt';
// import ImageViewer from '../../../views/image/ImageViewer.jsx';
import ImageViewer from '../../../templates/ImageTag_w.jsx';
import noPhoto from '../../../style/imgs/noPhoto.png';
import {Tooltip,Icon} from 'antd';
class PrivateDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detail: this.getInit(),
            imgs: []
        }
        this.id = props.location.query.id;
        this.fieldMap = {
            companyType: [],
            degreeList: [],
            employOptionsList: [],
            industries: [],
            maritalStatuses: [],
            occupationList: [],
            qualifications: [],
            residentStatuses: [],
            relationOptionsList: [],
            technicalTitleList: [],
            titleList: []
        };
        this.appKeyList = [];
    }
    componentDidMount() {
        if (!this.id) return;
        Promise.all([axios_loanMgnt.post("/manage/util/getBorrowerInfoOptions")]).then(([fieldMapData]) => {
            this.fieldMap = fieldMapData.data;
            axios_loanMgnt.post("/manage/borrower/detail", { id: this.id }).then(({ data }) => {
                let imgs = [];
                let idCardInfo = data.idCardInfo || {};
                let livecheckInfo = data.livecheckInfo || {};
                imgs.push({ des: "身份证正面", storageId: idCardInfo.frontImgStorageId });
                imgs.push({ des: "身份证反面", storageId: idCardInfo.backImgStorageId });
                imgs.push({ des: "活体检测照片", storageId: livecheckInfo.bestImgStorageId });
                // imgs.push({ des: "收入证明", src: data.salaryProveStorageUrl });
                // data.borrowerJobInfo.salaryProveStorageUrl = data.salaryProveStorageUrl;
                this.getImageUrls(imgs);
                this.setState({ detail: Object.assign({}, data, this.getInit(data)) });
            })
        })
    }
    getImageUrls(imgs) {
        Promise.all(imgs.map((img,index) => new Promise((resolve, reject) => {
            if (!img.storageId) return resolve({ des: img.des, src: noPhoto ,key:index});
            axios_loanMgnt.post("/manage/util/getStorageUrl", { storageId: img.storageId }).then(data => {
                resolve({ des: img.des, src: data.data });
            })
        }))).then(imgs => this.setState({ imgs }));
    }
    selectParam = {
        labelType: "PERSON",
        usage: "CONTRACT_LIST"
    }
    getAppKeys() {
        return new Promise((resolve, reject) => {
            axios_loanMgnt.post("/manage/util/getLoanAppOptions", this.selectParam).then(data => {
                resolve(data.data)
            }).catch(e => reject(e));
        })
    }
    getDomains() {
        return new Promise((resolve, reject) => {
            axios_loanMgnt.post("/manage/util/getAppLabelOptions", { ...this.selectParam }).then(data => {
                resolve(data.data)
            }).catch(e => reject(e));
        })
    }
    getInit(data = {}) {
        return {
            borrowerContactInfo: data.borrowerContactInfo || {},
            idCardInfo: data.idCardInfo || {},
            identity: data.identity || {},
            borrowerResidentInfo: data.borrowerResidentInfo || {},
            borrowerEduInfo: data.borrowerEduInfo || {},
            borrowerJobInfo: data.borrowerJobInfo || {},
            borrowerMaritalInfo: data.borrowerMaritalInfo || {},
            borrowerContactsList: data.borrowerContactsList || [],
            bindCardList: data.bindCardList || [],
            borrowerFiles: data.borrowerFiles || {}
        }
    }
    getFieldMap(key, val) {
        if (!this.fieldMap[key]) return '--'
        let current = this.fieldMap[key].find(data => data.name === val) || {};
        return current.val || "--"
    }
    getAddress(info) {
        let detail = `${info.province || ""}${info.city || ""}${info.district || ""}${info.detail || ""}`;
        return detail || "--"
    }
    baseInfo = {
        name: { name: "姓名" },
        phone: { name: "注册手机号" },
        contactPhone: { name: "联系手机号", render: data => data.borrowerContactInfo.phone },
        email: { name: "邮箱", render: data => data.borrowerContactInfo.email },
        ethnicity: { name: "民族", render: data => data.idCardInfo.ethnicity },
        idNo: { name: "身份证号", render: data => data.idCardInfo.idNo || data.identity.idNo },
        validityStartDate: { name: "身份证有效日期起始日期", render: data => data.idCardInfo.validityStartDate },
        validityEndDate: { name: "身份证有效日期到期日期", render: data => data.idCardInfo.validityEndDate },
        authorityOrg: { name: "身份证签署机关", render: data => data.idCardInfo.authorityOrg },
        address: { name: "户籍地址", render: data => data.idCardInfo.address },
        residentStatus: { name: "居住状况", render: data => this.getFieldMap("residentStatuses", data.borrowerResidentInfo.residentStatus) },
        resdientAddress: { name: "居住地址", render: data => this.getAddress(data.borrowerResidentInfo) },
        contactAddress: { name: "通讯地址", render: data => this.getAddress(data.borrowerContactInfo) },
        id: { name: "客户id" },
        createTime: { name: "创建时间" },
        
        businessLabelName: { name: "业务" },
        appKey: { name: "项目", render: data => MgntProjectCtrl.nameMap(data.appKey) },
        channel: { name: "渠道" },
        identityId: { name: "实名认证状态", render: data => data.identified ? "已认证" : "未认证" },
        identityCreateTime: { name: "实名认证时间", render: data => data.identity.createTime },
        identityUpdateTime: { name: "认证更新时间", render: data => data.identity.updateTime },
    }
    educationInfo = {
        qualification: { name: "学历", render: data => this.getFieldMap("qualifications", data.qualification) },
        degree: { name: "学位", render: data => this.getFieldMap("degreeList", data.degree) },
        school: { name: "学校" },
        major: { name: "专业" },
        createTime: { name: "信息创建时间", span_val: 3 },
        updateTime: { name: "信息更新时间", span_val: 3 }
    }
    workInfo = {
        employmentStatus: { name: "就业状况", render: data => this.getFieldMap("employOptionsList", data.employmentStatus) },
        companyName: { name: "单位名称" },
        companyType: { name: "单位性质", render: data => this.getFieldMap("companyType", data.companyType) },
        industry: { name: "单位所属行业", render: data => this.getFieldMap("industries", data.industry) },
        address: { name: "单位详细地址" },
        postcode: { name: "单位所在地邮编" },
        phone: { name: "单位联系方式" },
        occupation: { name: "职业", render: data => this.getFieldMap("occupationList", data.occupation) },
        title: { name: "职务", render: data => this.getFieldMap("titleList", data.title) },
        technicalTitle: { name: "职称", render: data => this.getFieldMap("technicalTitleList", data.technicalTitle) },
        startWorkingTime: { name: "本单位工作起始年份" },
        annualSalary: { name: "年收入" },
        salaryProveStorageId: { name: "收入证明", render: data => data.salaryProveStorageId ? <StorageNoViewCtrl storageId={data.salaryProveStorageId}>收入证明</StorageNoViewCtrl> : "--" },
        createTime: { name: "信息创建时间" },
        updateTime: { name: "信息更新时间", span_val: 3 }
    }
    marriageInfo = {
        maritalStatus: { name: "婚姻状况", render: data => this.getFieldMap("maritalStatuses", data.maritalStatus) },
        spouseName: { name: "配偶姓名" },
        spouseIdNo: { name: "配偶身份证号" },
        spousePhone: { name: "配偶联系电话" },
        spouseCompanyName: { name: "配偶工作单位", span_val: 3 },
        createTime: { name: "信息创建时间" },
        updateTime: { name: "信息更新时间" }
    }
    relationInfo = [
        { title: "与本人关系", dataIndex: "relation", render: data => this.getFieldMap("relationOptionsList", data) },
        { title: "联系人姓名", dataIndex: "name" },
        { title: "联系人手机号", dataIndex: "phone" },
        { title: "联系人身份证号", dataIndex: "idNo" },
        { title: "所属公司名称", dataIndex: "companyName" },
        { title: "信息创建时间", dataIndex: "createTime" },
        { title: "信息更新时间", dataIndex: "updateTime" }
    ]
    bankCardInfo = [
        { title: "绑定支付渠道", dataIndex: "channelKey",render:e=><div>{e}<Tooltip title={window.localStorage.getItem("channelName")||""} trigger="click"><Icon type="question-circle-o" onClick={()=>{this.get_channelKey(e)}} style={{marginLeft:3}} /></Tooltip></div> },
        { title: "银行卡姓名", dataIndex: "accountName" },
        { title: "银行卡号", dataIndex: "bankCardNumber" ,render:e=><div>{e}<Tooltip title={window.localStorage.getItem("bankName")||""} trigger="click"><Icon type="question-circle-o" onClick={()=>{this.get_bank(e)}} style={{marginLeft:3}} /></Tooltip></div>},
        { title: "银行预留手机号", dataIndex: "phone" },
        { title: "开户银行", dataIndex: "bankName" },
        { title: "绑卡时间", dataIndex: "lastBindTime" },
        { title: "更新时间", dataIndex: "updateTime" }
    ]
    get_channelKey(channelKey){
        console.log(1)
         axios_payState.post("/manage/ajax/channel_key/get?channelKey="+channelKey).then(e=>{
            if(!e.code){
                window.localStorage.setItem("channelName",e.data.channelName)
            }
        })
    }
    get_bank(bank){
        var str=bank.substring(0,6)
        axios_common.post("/api/bank/info?bankCardNo="+str).then(e=>{
            if(!e.code){
                window.localStorage.setItem("bankName",e.data.bankName)
            }
        })
    }
    render() {
        return <div>
            <Card title="基础信息">
                <ImageViewer imgs={this.state.imgs} />
                <TableCol data-columns={this.baseInfo} data-source={this.state.detail} />
            </Card>
            <Card title="教育信息">
                <TableCol data-columns={this.educationInfo} data-source={this.state.detail.borrowerEduInfo || {}} />
            </Card>
            <Card title="工作信息">
                <TableCol data-columns={this.workInfo} data-source={this.state.detail.borrowerJobInfo || {}} />
            </Card>
            <Card title="婚姻信息">
                <TableCol data-columns={this.marriageInfo} data-source={this.state.detail.borrowerMaritalInfo || {}} />
            </Card>
            <Card title="联系人信息">
                <Table columns={this.relationInfo} dataSource={this.state.detail.borrowerContactsList || []} pagination={false} />
            </Card>
            <Card title="绑卡信息">
                <Table columns={this.bankCardInfo} dataSource={this.state.detail.bindCardList || []} pagination={false} />
            </Card>
            <Card title="签署文件">
                <StorageNoViewCtrl storageId={this.state.detail.borrowerFiles.repayAgreementStorageId}>委托扣款协议</StorageNoViewCtrl>&emsp;
                <StorageNoViewCtrl storageId={this.state.detail.borrowerFiles.creditAuthAgreementStorageId}>征信授权协议</StorageNoViewCtrl>&emsp;
                <StorageNoViewCtrl storageId={this.state.detail.borrowerFiles.infoAuthAgreementStorageId}>信息授权及使用协议</StorageNoViewCtrl>&emsp;
            </Card>
        </div>
    }
}

export default PrivateDetail;