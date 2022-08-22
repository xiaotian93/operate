import React, { Component } from 'react';
import ListCtrl from '../../../controllers/List';
import { axios_loanMgnt, axios_loanMgnt_json } from '../../../ajax/request';
import Permissions from '../../../templates/Permissions';
import { bmd } from '../../../ajax/tool';
import ComponentRoute from '../../../templates/ComponentRoute';
import businessConfig from '../../../config/business';
import MgntProjectCtrl from '../../../request/mgnt/project';
import { Button, Tooltip, Modal, Form, Input, Upload, message, Row, Col } from 'antd';
import { custom_changePhone_upload, custom_changePhone_getStorageUrl, custom_person_changePhone } from '../../../ajax/api';
import { host_loanmanageMgnt } from '../../../ajax/config';
const FormItem = Form.Item;
const { TextArea } = Input;
class PrivateList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: this.getItems(),
            appKeys: [],
            frontIdCardImgStorageId: [],
            backIdCardImgStorageId: [],
            holdIdCardImgStorageId: []
        }
    }
    columns = [
        { title: "序号", dataIndex: "key" },
        { title: "创建时间", dataIndex: "createTime", order: (a, b) => (new Date(a).getTime() - new Date(b).getTime()) > 0 ? 0 : -1 },
        { title: "客户ID", dataIndex: "id" },
        { title: "姓名", dataIndex: "name" },
        { title: "注册手机号", dataIndex: "phone" },
        { title: "身份证号", dataIndex: "idNo" },
        { title: "业务", dataIndex: "businessLabelName" },
        { title: "项目", dataIndex: "appKeyName" },
        { title: "渠道", dataIndex: "channel" },
        { title: "实名认证状态", dataIndex: "identified", render: data => data ? "已认证" : "未认证" },
        { title: "绑卡状态", dataIndex: "isBindCard", render: data => data ? "已绑卡" : "未绑卡" },
        {
            title: "操作", render: data => {
                return <div><Permissions size="small" server={global.AUTHSERVER.mgnt.key} tag="button" permissions={global.AUTHSERVER.mgnt.access.borrower_detail} onClick={e => bmd.navigate(this.props.location.pathname + "/detail", { id: data.id })}>查看</Permissions>
                <Permissions size="small" server={global.AUTHSERVER.mgnt.key} tag="button" permissions={global.AUTHSERVER.mgnt.access.borrower_phone_change_apply} onClick={() => { this.setInfo(data, "phone") }} type="primary" style={{ "marginLeft": 5 }}>修改手机号</Permissions>
                    {/* <Tooltip title={<div><Button size="small" type="primary" onClick={() => { this.setInfo(data, "phone") }}>修改手机号</Button><Button size="small" type="primary">修改手机号</Button></div>}><Button size="small" type="primary" style={{ "marginLeft": 5 }}>更多操作</Button></Tooltip> */}
                    </div>
            }
        },
    ]
    items = [
        { name: "创建时间", key: "createTime", feild_s: "startDate", feild_e: "endDate", type: "range_date", withTime: true },
        { name: "姓名", key: "name" },
        { name: "注册手机号", key: "phone" },
        { name: "身份证号", key: "idNo" },
        { name: "业务", key: "businessLabelName", type: "select", values: businessConfig.getCategory(), default: null, onChange: val => this.getAppkeysByDomain(val) },
        { name: "项目", key: "appKey", type: "select", default: null },
        { name: "渠道", key: "channel" }
    ]
    getItems() {
        return [
            { name: "创建时间", key: "createTime", feild_s: "startDate", feild_e: "endDate", type: "range_date", withTime: true },
            { name: "姓名", key: "name" },
            { name: "注册手机号", key: "phone" },
            { name: "身份证号", key: "idNo" },
            { name: "业务", key: "businessLabelName", type: "select", values: businessConfig.getCategory(), default: null, onChange: val => this.getAppkeysByDomain(val) },
            { name: "项目", key: "appKey", type: "select", default: null },
            { name: "渠道", key: "channel" }
        ]
    }
    getAppkeysByDomain(domain) {
        this.setFilter({ appKey: undefined });
        MgntProjectCtrl.getByLabelName(domain).then(data => {
            this.setState({ appKeys: MgntProjectCtrl.getSelect(data.data) });
        })
    }
    listRequestor(listParam) {
        return new Promise((resolve, reject) => {
            axios_loanMgnt.post("/manage/borrower/list", { ...listParam, type: "PERSONAL" }).then(data => {
                data.data.list.forEach(record => {
                    record.appKeyName = MgntProjectCtrl.nameMap(record.appKey);
                })
                resolve(data);
            }).catch(e => reject(e));
        });
    }
    resetField() {
        this.setState({ appkeys: [] })
    }
    setInfo(e, type) {
        console.log(e)
        const title = { phone: "手机号", name: "姓名", idCard: "身份证号" }
        this.setState({
            visible: true,
            setType: type,
            modalTitle: "修改" + title[type],
            id: e.id
        })
    }
    cancal() {
        this.setState({
            visible: false, frontIdCardImgStorageId: [],
            backIdCardImgStorageId: [],
            holdIdCardImgStorageId: []
        })
        this.props.form.resetFields();
    }
    licenseupload(e) {
        console.log(e)
        if (e.fileList.length > 1) return;
        this.Upload(e, 'frontIdCardImgStorageId', 'frontIdCardImgStorageId')
    }
    handlePreview(e) {
        console.log(e)
        var urls = e.response ? e.response.data : e.storageNo;
        window.open(host_loanmanageMgnt + custom_changePhone_getStorageUrl + "?storageNo=" + urls);
    }
    backIdCardupload(e) {
        this.Upload(e, 'backIdCardImgStorageId', 'backIdCardImgStorageId')
    }
    holdIdCardupload(e) {
        this.Upload(e, 'holdIdCardImgStorageId', 'holdIdCardImgStorageId')
    }
    //
    changePhone() {
        this.props.form.validateFieldsAndScroll((err, val) => {
            console.log(val)
            if (!err) {
                val.borrowerId = this.state.id;
                axios_loanMgnt_json.post(custom_person_changePhone, val).then(e => {
                    if (!e.code) {
                        message.success("修改成功");
                        this.cancal();
                    }
                })
            }
        })
    }
    Upload(e, parm, name) {
        console.log(e)
        var fileList = e.fileList;
        // if(fileList[0].response.data){
        // if(e.file.status!=="removed"){
        if (e.file.size > 10000000) {
            message.warn('上传文件大小不超过10M');
            return;
        }
        if (e.file.response && e.file.response.code) {
            message.warn(e.file.response.errorMsg);
            return;
        }
        // }
        // for(var r in fileList){
        //     console.log(fileList[r])
        //     if(fileList[r].response&&fileList[r].response.code){

        //         fileList.remove(fileList[r])
        //     }
        // }
        this.setState({
            [parm]: fileList
        });

        if (fileList.length > 0) {
            if (name === "attachment") {
                var imgStr = [];
                for (var p in fileList) {
                    if (fileList[p].size > 10000000) {
                        message.warn('上传文件大小不超过10M');
                        return;
                    }
                    if (fileList[p].response && !fileList[p].response.code) {
                        //console.log(parm)
                        var imgJson = {
                            name: fileList[p].name,
                            storageNo: fileList[p].response.data.storageNo
                        }
                        imgStr.push(imgJson)
                    } else {
                        var imgJsons = {
                            name: fileList[p].name,
                            storageNo: fileList[p].uid
                        }
                        imgStr.push(imgJsons)
                    }
                }
                this.props.form.setFieldsValue({ [name]: JSON.stringify(imgStr) });
            } else {
                if (e.fileList[0].type === "application/pdf") {
                    // if (fileList[0].response && !fileList[0].response.code) {
                    //     this.setState({
                    //         [parm]: [{
                    //             uid: "1",
                    //             name: "111.pdf",
                    //             status: "done",
                    //             url: img,
                    //             type: "application/pdf",
                    //             openUrl: host + manage_get + "?storageNo=" + fileList[0].response.data.storageNo + "&type=ORIGIN",
                    //         }]
                    //     })
                    // }


                } else {
                    this.setState({
                        [parm]: fileList
                    });
                }
                if (fileList[0].size > 10000000) {
                    message.warn('上传图片大小不超过10M');
                    return;
                }
                if (fileList[0].response && !fileList[0].response.code) {
                    //console.log(parm)
                    this.props.form.setFieldsValue({ [name]: fileList[0].response.data })
                }
            }
        } else {
            this.props.form.setFieldsValue({ [name]: "" })
        }
        // }

    }
    render() {
        const listProps = {
            items: this.items,
            columns: this.columns,
            filterOptions: { appKey: this.state.appKeys },
            bindreset: this.resetField.bind(this),
            bindsetFilter: set => this.setFilter = set,
            listRequestor: this.listRequestor.bind(this)
        }
        const modalInfo = {
            visible: this.state.visible,
            title: this.state.modalTitle,
            footer: <div><Button size="small" onClick={this.cancal.bind(this)}>取消</Button><Button size="small" type="primary" onClick={this.changePhone.bind(this)}>确认</Button></div>,
            closable:false
        }
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        }
        const formItemLayoutCol = {
            labelCol: { span: 12 },
            wrapperCol: { span: 12 },
        }
        console.log(host_loanmanageMgnt + custom_changePhone_upload)
        const license = {
            action: host_loanmanageMgnt + custom_changePhone_upload,
            className: "upload-list-inline imgChange",
            fileList: this.state.frontIdCardImgStorageId,
            onChange: this.licenseupload.bind(this),
            withCredentials: true,
            data: { usage: 'frontIdCardImg' },
            name: "file",
            // multiple: true,
            // onPreview: this.handlePreview.bind(this),
            listType: "picture-card",
            accept:"image/*"
        };
        const backIdCard = {
            action: host_loanmanageMgnt + custom_changePhone_upload,
            className: "upload-list-inline imgChange",
            fileList: this.state.backIdCardImgStorageId,
            onChange: this.backIdCardupload.bind(this),
            withCredentials: true,
            data: { usage: 'frontIdCardImg' },
            name: "file",
            // multiple: true,
            onPreview: this.handlePreview.bind(this),
            listType: "picture-card",
            accept:"image/*"
        }
        const holdIdCard = {
            action: host_loanmanageMgnt + custom_changePhone_upload,
            className: "upload-list-inline imgChange",
            fileList: this.state.holdIdCardImgStorageId,
            onChange: this.holdIdCardupload.bind(this),
            withCredentials: true,
            data: { usage: 'frontIdCardImg' },
            name: "file",
            // multiple: true,
            onPreview: this.handlePreview.bind(this),
            listType: "picture-card",
            accept:"image/*"
        }
        const { getFieldDecorator } = this.props.form;
        return <div>
            <Modal {...modalInfo} >
                <Form>
                    <FormItem
                        {...formItemLayout}
                        label="原手机号"
                    >
                        {getFieldDecorator('fromPhone', {
                            rules: [
                                { required: true, message: '请输入原手机号' },
                                { pattern: /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/, message: '格式错误' }
                            ],
                        })(
                            <Input placeholder="请输入原手机号" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="新手机号"
                    >
                        {getFieldDecorator('toPhone', {
                            rules: [
                                { required: true, message: '请输入新手机号' },
                                { pattern: /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/, message: '格式错误' }
                            ],
                        })(
                            <Input placeholder="请输入新手机号" />
                        )}
                    </FormItem>
                    <Row>
                        <Col span={12}>
                            <FormItem {...formItemLayoutCol} label="身份证影像">
                                {getFieldDecorator('frontIdCardImgStorageId', {
                                    initialValue: "", rules: [
                                        { required: true, message: '请上传身份证正面' },
                                    ],
                                })(<div />)}
                                <Upload {...license}>{this.state.frontIdCardImgStorageId.length < 1 ? <div style={{ color: "#1B84FF", cursor: "pointer" }}>正面</div> : null}</Upload>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayoutCol} label="">
                                {getFieldDecorator('backIdCardImgStorageId', {
                                    initialValue: "", rules: [
                                        { required: true, message: '请上传身份证反面' },
                                    ]
                                })(<div />)}
                                <Upload {...backIdCard}>{this.state.backIdCardImgStorageId.length < 1 ? <div style={{ color: "#1B84FF", cursor: "pointer" }}>反面</div> : null}</Upload>
                            </FormItem>
                        </Col>
                    </Row>


                    <FormItem {...formItemLayout} label="手持身份证">
                        {getFieldDecorator('holdIdCardImgStorageId', {
                            initialValue: "", rules: [
                                { required: true, message: '请上传手持身份证' },
                            ]
                        })(<div />)}
                        <Upload {...holdIdCard}>{this.state.holdIdCardImgStorageId < 1 ? <div style={{ color: "#1B84FF", cursor: "pointer" }}>上传</div> : null}</Upload>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="备注（选填）"
                    >
                        {getFieldDecorator('remark')(
                            <TextArea />
                        )}
                    </FormItem>
                </Form>
            </Modal>
            <ListCtrl {...listProps} />
        </div>
    }
}

export default Form.create()(ComponentRoute(PrivateList));