import React, { Component } from 'react';
import { Row, Button, Modal } from 'antd';
import { axios_gyl, axios_gyl_json } from '../../../ajax/request';
import { custom_detail, custom_create, custom_update_detail, gyl_img_get } from '../../../ajax/api';
import Person from './info/borrow_person';
import Info from './info/borrow_info';
import Settle from './info/settle';
import Agent from './info/agent';
import Repay from './info/repay';
import { page_go } from '../../../ajax/tool';
// import Path from '../../../templates/Path';
import moment from 'moment';
import ComponentRoute from '../../../templates/ComponentRoute';
import UploadFile from '../../../model/staticModel/uploadFileList';
import { host_gyl } from '../../../ajax/config';
class Ygd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companyId: props.location.query.companyId,
            statusMsg: "",
            visible: false
        }
        this.uploadFile = new UploadFile(host_gyl + gyl_img_get);
    }
    componentWillMount() {
        if (this.state.companyId) {
            this.getDetail();
        } else {
            this.getCompanyId()
        }

    }
    getCompanyId() {
        axios_gyl_json.post(custom_create, {}).then(e => {
            this.setState({
                companyId: e.data.id
            })
        })
    }
    //编辑订单
    getDetail() {
        var param = {
            companyId: this.state.companyId
        };
        axios_gyl.post(custom_detail, param).then(e => {
            var detail = e.data;
            var company = this.company.props.form.getFieldsValue();
            var legal = this.legal.props.form.getFieldsValue();
            var agent = this.agent.props.form.getFieldsValue();
            var settle = this.settle.props.form.getFieldsValue();
            var repay = this.repay.props.form.getFieldsValue();
            this.company.setState({
                licenseStorageList: this.uploadFile.getByStorageNoList(detail.licenseStorageList),
                otherStorageList: this.uploadFile.getByStorageNoList(detail.otherStorageList)
            });
            this.legal.setState({ legalPersonIdCardStorageList: this.uploadFile.getByStorageNoList(detail.legalPersonIdCardStorageList) });
            this.agent.setState({ agentIdCardStorageList: this.uploadFile.getByStorageNoList(detail.agentIdCardStorageList) });
            this.settle.setState({ settleBankLicStorageList: this.uploadFile.getByStorageNoList(detail.settleBankLicStorageList) })
            for (var i in company) {
                if (!detail[i]) continue;
                if (i === "expireDate") {
                    this.company.props.form.setFieldsValue({ [i]: detail[i] ? moment(detail[i]) : "" })
                } else if (i === "industryType" || i === "industryInvolved" || i === "scale") {
                    this.company.props.form.setFieldsValue({ [i]: detail[i] ? detail[i].toString() : "" })
                } else {
                    this.company.props.form.setFieldsValue({ [i]: detail[i] })
                }
            }
            for (var j in legal) {
                if (!detail[j]) continue;
                this.legal.props.form.setFieldsValue({ [j]: detail[j] })
            }
            for (var k in agent) {
                if (!detail[k]) continue;
                this.agent.props.form.setFieldsValue({ [k]: detail[k] })
            }
            for (var s in settle) {
                if (!detail[s]) continue;
                this.settle.props.form.setFieldsValue({ [s]: detail[s] })
            }
            for (var r in repay) {
                this.repay.props.form.setFieldsValue({ [r]: detail[r] })
            }
            this.setState({ companyId: e.data.id })
        })

    }
    getCompany(e) {
        this.company = e;
    }
    getInfo(e) {
        this.legal = e;
    }
    getAgent(e) {
        this.agent = e;
    }
    getSettle(e) {
        this.settle = e;
    }
    getRepay(e) {
        this.repay = e;
    }
    //提交审核
    audit() {
        var saveData = {
            id: this.state.companyId
        };
        this.setState({
            visible: false
        })
        var personCheck, infoCheck, materialCheck, legalCheck, repayCheck;
        this.company.props.form.validateFieldsAndScroll((err, val) => {
            if (!err) {
                for (var i in val) {
                    if (i === "expireDate") {
                        saveData[i] = val[i].format("YYYY-MM-DD") + " 00:00:00";
                    } else {
                        saveData[i] = val[i]
                    }
                }
                personCheck = true;
            }
        })
        this.agent.props.form.validateFieldsAndScroll((err, val) => {
            if (!err) {
                for (var j in val) {
                    saveData[j] = val[j]
                }
                infoCheck = true;
            }
        })
        this.settle.props.form.validateFieldsAndScroll((err, val) => {
            if (!err) {
                for (var k in val) {
                    saveData[k] = val[k]
                }
                materialCheck = true;
            }
        })
        this.legal.props.form.validateFieldsAndScroll((err, val) => {
            if (!err) {
                for (var l in val) {
                    saveData[l] = val[l]
                }
                legalCheck = true;
            }
        })
        this.repay.props.form.validateFieldsAndScroll((err, val) => {
            if (!err) {
                for (var r in val) {
                    saveData[r] = val[r]
                }
                repayCheck = true;
            }
        })
        if (personCheck && infoCheck && materialCheck && legalCheck && repayCheck) {
            axios_gyl_json.post(custom_update_detail, saveData).then(e => {
                if (!e.code) { page_go("/kh/gyl/list") }
            })
        }
    }
    //取消
    cancel() {
        this.setState({
            visible: true
        });
    }
    modalCancel() {
        this.setState({ visible: false });
        page_go("/kh/gyl/list");
    }
    render() {
        const foot = <div>
            <Button type="primary" onClick={this.audit.bind(this)}>不，我要提交</Button>
            <Button type="primary" onClick={this.modalCancel.bind(this)}>是，我要离开</Button>
        </div>;
        const modal = {
            title: null,
            visible: this.state.visible,
            footer: foot,
            closable: false
        };
        return (
            <div>
                <div className="content" style={{ marginBottom: "60px" }}>
                    <Person orderNo={this.state.orderNo} onRef={this.getCompany.bind(this)} companyId={this.state.companyId} />
                    <Info orderNo={this.state.orderNo} onRef={this.getInfo.bind(this)} companyId={this.state.companyId} />
                    <Settle orderNo={this.state.orderNo} onRef={this.getSettle.bind(this)} companyId={this.state.companyId} />
                    <Agent orderNo={this.state.orderNo} onRef={this.getAgent.bind(this)} companyId={this.state.companyId} />
                    <Repay orderNo={this.state.orderNo} onRef={this.getRepay.bind(this)} companyId={this.state.companyId} />
                </div>

                <Row style={{ height: "50px", background: "#fff", position: "fixed", bottom: "0", right: "0", lineHeight: "50px", textAlign: "center", width: "calc(100% - 170px)", boxShadow: "0px -2px 4px 0px rgba(0,0,0,0.1)" }}>
                    <Button onClick={this.cancel.bind(this)}>取消</Button>
                    <Button type="primary" style={{ marginLeft: "30px" }} onClick={this.audit.bind(this)}>提交</Button>
                </Row>
                <Modal {...modal}><span style={{ fontSize: "16px" }}>是否放弃保存当前信息？</span></Modal>
                <style>{`
                    .ant-upload.ant-upload-select-picture-card{
                        border: none!important;
                        width: auto!important;
                        height:auto!important;
                        margin-bottom: 0!important;
                        background-color:#fff!important;
                      }
                      .ant-upload.ant-upload-select-picture-card > .ant-upload{
                        padding: 0!important;
                      }
                `}</style>
            </div>
        )
    }
}
export default ComponentRoute(Ygd);