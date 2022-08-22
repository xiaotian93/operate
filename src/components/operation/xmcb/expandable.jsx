import { Modal, Form, Input, Button, DatePicker, Upload, message } from "antd";
import { accMul } from '../../../ajax/tool';
import { axios_zyzj } from '../../../ajax/request';
import { merchant_img_upload, operation_xmcb_pay, operation_xmcb_confirm_child } from '../../../ajax/api';
import React, { Component } from "react";
import { host_zyzj } from '../../../ajax/config';
import moment from "moment";
const FormItem = Form.Item;

class Pay extends Component {
    constructor(props) {
        super(props);
        props.onRef(this);
        this.state = {
            visible: false,
            fileList: [],
            confirm:true
        };
    }
    sure() {
        let param = "";
        this.props.form.validateFields(this.state.confirm?["confirmStorageId"]:["actualCost","actualCostDate","payStorageId"],(err, values) => {
            if (!err) {
                if (this.state.confirm) {
                    values.costRecordId = this.props.id;
                    for (var i in values) {
                        param += i + "=" + values[i] + "&";
                    }
                    axios_zyzj.get(operation_xmcb_confirm_child + "?" + param).then(e => {
                        if (!e.code) {
                            message.success("对账成功");
                            this.cancel();
                            this.props.getList();
                        }
                    })
                    return;
                }
                values.actualCost = accMul(values.actualCost, 100);
                values.actualCostDate = values.actualCostDate.format("YYYY-MM-DD");
                values.costRecordId = this.props.id;
                for (var i in values) {
                    param += i + "=" + values[i] + "&";
                }
                axios_zyzj.get(operation_xmcb_pay + "?" + param).then(e => {
                    if (!e.code) {
                        message.success("支付成功");
                        this.cancel();
                        this.props.getList();
                    }
                })
            }
        })
    }
    cancel() {
        this.setState({
            visible: false
        })
        this.props.form.resetFields();
        this.setState({ fileList: [] })
    }
    upload(info) {
        var newFile = [info.file];
        info.fileList = newFile
        if (info.file.status === 'done') {
            if (info.file.response) {
                if (info.file.response.code === 0) {
                    if (this.state.confirm) {
                        this.props.form.setFieldsValue({ confirmStorageId: info.file.response.data })
                    } else {
                        this.props.form.setFieldsValue({ payStorageId: info.file.response.data })
                    }
                } else {
                    message.warn(info.file.response.msg);
                    return;
                }
            }
        } else if (info.file.status === 'error') {
            message.error("上传失败");
        }
        this.setState({ fileList: [info.fileList[0]] })
    }
    onRemove() {
        this.setState({ fileList: [] })

    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const modal = {
            title: this.state.confirm?"确认对账":"确认支付",
            visible: this.state.visible,
            footer: <div>
                <Button type="primary" size="small" onClick={this.sure.bind(this)}>确认</Button>
                <Button size="small" onClick={this.cancel.bind(this)}>取消</Button>
            </div>,
            closable: false
        }
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };
        const upload = {
            action: host_zyzj + merchant_img_upload,
            className: "upload-list-inline imgChange",
            onChange: this.upload.bind(this),
            withCredentials: true,
            name: "file",
            fileList: this.state.fileList,
            onRemove: this.onRemove.bind(this)
        };
        return (
            <Modal {...modal}>
                {
                    this.state.confirm ? <FormItem label="对账凭证" {...formItemLayout}>
                        {getFieldDecorator("confirmStorageId", {
                            rules: [{ required: true, message: '请选择对账凭证' }]

                        })(
                            <div />
                        )}
                        <Upload {...upload} ><Button>上传</Button></Upload>
                    </FormItem> :
                        <div>
                            <FormItem label="实付金额" {...formItemLayout}>
                                {getFieldDecorator("actualCost", {
                                    rules: [{ required: true, message: '请输入实付金额' }, { pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "格式错误" }]
                                })(
                                    <Input placeholder="请填写金额" />
                                )}
                            </FormItem>
                            <FormItem label="实付时间" {...formItemLayout}>
                                {getFieldDecorator("actualCostDate", {
                                    rules: [{ required: true, message: '请选择实付时间' }],
                                    initialValue:moment()
                                })(
                                    <DatePicker />
                                )}
                            </FormItem>
                            <FormItem label="支付凭证" {...formItemLayout}>
                                {getFieldDecorator("payStorageId", {
                                    rules: [{ required: true, message: '请选择支付凭证' }]

                                })(
                                    <div />
                                )}
                                <Upload {...upload} ><Button>上传</Button></Upload>
                            </FormItem>

                        </div>
                }

            </Modal>
        )
    }
}
export default Form.create()(Pay)
