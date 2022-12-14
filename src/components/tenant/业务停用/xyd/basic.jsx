import React, { Component } from 'react';
import { Row, Col, Form, Select, Checkbox, message ,Button} from 'antd';
import { manage_get, merchant_img_list, merchant_online_detail ,merchant_online_add_merchant} from '../../../ajax/api';
// import Repay from './repayBank';
import { host_sh } from '../../../ajax/config';
// import {axios_sh} from '../../../ajax/request';
import img from '../../../style/imgs/PDF.png';
import ImgViewer from '../../../templates/ImgViewer';
import { axios_merchant_json, axios_online } from '../../../ajax/request';
import Permissions from '../../../templates/Permissions';
const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
class Basic extends Component {
    constructor(props) {
        super(props);
        // props.onRef(this);
        this.state = {
            // id: props.location.query.id,
            // audit: props.location.query.audits,
            // accountId: props.location.query.accountId,
            invoice: {},
            detail: {},
            merchant: {}
        };
    }
    componentWillMount() {
        this.get_detail()
    }
    get_detail(){
        axios_online.post(merchant_online_detail, { merchantNo: this.props.merchantNo }).then(e => {
            this.setState({
                merchant: e.data
            })
            this.imgType(e.data)
        })
    }
    imgType(value = {}) {
        var param = [
            value.imageLicense,
            value.imageLegalIdFront,
            value.imageLegalIdBack,
            value.imageAuthFile,
            value.imageContactsIdFront,
            value.imageContactsIdBack
        ]

        axios_merchant_json.post(merchant_img_list, param).then(e => {
            var data = e.data;
            for (var i in data) {
                if (data[i].storageNo === value.imageLicense) {
                    this.setState({
                        imageLicense: data[i]
                    })
                } else if (data[i].storageNo === value.imageLegalIdFront) {
                    this.setState({
                        imageLegalIdFront: data[i]
                    })
                } else if (data[i].storageNo === value.imageLegalIdBack) {
                    this.setState({
                        imageLegalIdBack: data[i]
                    })
                } else if (data[i].storageNo === value.imageAuthFile) {
                    this.setState({
                        imageAuthFile: data[i]
                    })
                } else if (data[i].storageNo === value.imageContactsIdFront) {
                    this.setState({
                        imageContactsIdFront: data[i]
                    })
                } else if (data[i].storageNo === value.imageContactsIdBack) {
                    this.setState({
                        imageContactsIdBack: data[i]
                    })
                }
            }
        })
    }
    imgShow(e, des) {
        if (e.contentType !== "application/pdf") {
            var img = [];
            var img1 = { src: host_sh + manage_get + "?type=ORIGIN&storageNo=" + e.storageNo, des: des };
            img.push(img1)
            new ImgViewer(img, { index: 0, show: true });
        } else {
            window.open(host_sh + manage_get + "?type=ORIGIN&storageNo=" + e.storageNo)
        }

    }
    //????????????
    attachmentOpen(e) {
        window.open(host_sh + manage_get + "?type=ORIGIN&storageNo=" + e)
    }
    edit() {
        this.setState({
            isEdit: true
        })
        setTimeout(function(){
            this.props.form.setFieldsValue({merchantType:this.state.merchant.merchantType.indexOf(",")==="-1"?[this.state.merchant.merchantType]:this.state.merchant.merchantType.split(","),channelName:this.state.merchant.channelName});

        }.bind(this),100)
    }
    cancel() {
        this.setState({
            isEdit: false
        })
    }
    change_base(){
        this.props.form.validateFields((err,val)=>{
            var param={};
            param.channelName=val.channelName;
            param.merchantNo=this.props.merchantNo;
            param.merchantType=val.merchantType.join(",");
            axios_online.post(merchant_online_add_merchant,param).then(e=>{
                if(!e.code){
                    message.success("????????????");
                    this.cancel();
                    this.get_detail();
                }
            })
        })
    }
    render() {
        // var value = window.localStorage.getItem("audit_sh") ? JSON.parse(window.localStorage.getItem("audit_sh")) : {};
        var value = this.state.merchant;
        const { getFieldDecorator } = this.props.form;
        const formInfo = {
            labelCol: { span: 6 },
            wrapperCol: { span: 9 },
            colon: false
        };
        var img_show = host_sh + manage_get + "?type=THUMB&storageNo=";
        // const plainOptions = '????????????, ????????????'
        return (
            <div>

                <Form className="sh_add">
                    <div className="sh_add_card">
                        <div style={{ overflow: "hidden" }}>
                            <div className="sh_add_title" style={{ float: "left" }}>?????????????????? </div>
                            {
                                !this.state.isEdit ? <Permissions style={{ float: "right", marginLeft: "30px", cursor: "pointer" }} onClick={this.edit.bind(this)} size="small" type="primary" server={global.AUTHSERVER.bmdOnline.key} permissions={global.AUTHSERVER.bmdOnline.access.merchant_edit} tag="button">??????</Permissions> : <div><Button style={{ float: "right", marginLeft: "20px", cursor: "pointer" }} onClick={this.change_base.bind(this)} type="primary" size="small">??????</Button><Button style={{ float: "right", marginLeft: "20px", cursor: "pointer" }} onClick={this.cancel.bind(this)} type="danger" size="small">??????</Button></div>
                            }

                        </div>
                        {!this.state.isEdit ?
                            <div>
                                <FormItem label={<span style={{ background: this.state.namecolor }}>????????????</span>} {...formInfo} >
                                    {getFieldDecorator('name', {
                                        initialValue: "",
                                    })(
                                        <span>{value.channelName}</span>
                                    )

                                    }
                                </FormItem>
                                <FormItem label={<span style={{ background: this.state.namecolor }}>????????????</span>} {...formInfo} >
                                    {getFieldDecorator('name', {
                                        initialValue: "",
                                    })(
                                        <span>{value.merchantType}</span>
                                    )

                                    }
                                </FormItem>
                            </div> :
                            <div>
                                <FormItem label={<span style={{ background: this.state.namecolor }}>????????????</span>} {...formInfo} >
                                    {getFieldDecorator('channelName', {
                                        initialValue: "",
                                    })(
                                        <Select placeholder="???????????????????????????">
                                            <Option value="??????">??????</Option>
                                            <Option value="??????">??????</Option>
                                            <Option value="??????">??????</Option>
                                            <Option value="??????">??????</Option>
                                            <Option value="????????????">????????????</Option>
                                            <Option value="?????????">?????????</Option>
                                            <Option value="????????????">????????????</Option>
                                            <Option value="??????">??????</Option>
                                        </Select>
                                    )

                                    }
                                </FormItem>
                                <FormItem label={<span style={{ background: this.state.namecolor }}>????????????</span>} {...formInfo} >
                                    {getFieldDecorator('merchantType', {
                                        initialValue: "",
                                    })(
                                        <CheckboxGroup >
                                            <Checkbox value="????????????">????????????</Checkbox>
                                            <Checkbox value="????????????">????????????</Checkbox>
                                        </CheckboxGroup>
                                    )

                                    }
                                </FormItem>
                            </div>
                        }
                    </div>
                    <div className="sh_add_card">
                        <div style={{ overflow: "hidden" }}>
                            <div className="sh_add_title" style={{ float: "left" }}>???????????? </div>
                        </div>

                        <FormItem label={<span style={{ background: this.state.namecolor }}>????????????</span>} {...formInfo} >
                            {getFieldDecorator('name', {
                                initialValue: "",
                            })(
                                <span>{value.name}</span>
                            )

                            }
                        </FormItem>

                        <FormItem label={<span style={{ background: this.state.shortNamecolor }}>????????????</span>} {...formInfo} >
                            {getFieldDecorator('shortName', {
                                initialValue: "",
                            })(
                                <span>{value.shortName}</span>
                            )}

                        </FormItem>
                        <FormItem label={<span style={{ background: this.state.addresscolor }}>????????????</span>} {...formInfo} >
                            {getFieldDecorator('address', {
                                initialValue: "",
                            })(
                                <span>{value.address}</span>
                            )}

                        </FormItem>
                        <FormItem label={<span style={{ background: this.state.licenseNocolor }}>????????????????????????</span>} {...formInfo} >
                            {getFieldDecorator('creditCode', {
                                initialValue: "",
                            })(
                                <span>{value.licenseNo}</span>
                            )}
                        </FormItem>
                    </div>
                    <div className="sh_add_card">
                        <div className="sh_add_title">????????????</div>
                        <FormItem label={<span style={{ background: this.state.legalNamecolor }}>????????????</span>} {...formInfo} >
                            {getFieldDecorator('adminName', {
                                initialValue: "",
                            })(
                                <span>{value.legalName}</span>
                            )}

                        </FormItem>
                        <FormItem label={<span style={{ background: this.state.legalPhonecolor }}>???????????????</span>} {...formInfo} >
                            {getFieldDecorator('adminPhone', {
                                initialValue: "",
                            })(
                                <span>{value.legalPhone}</span>
                            )}

                        </FormItem>
                        <FormItem label={<span style={{ background: this.state.legalIdNocolor }}>?????????????????????</span>} {...formInfo} >
                            {getFieldDecorator('adminIdCard', {
                                initialValue: "",
                            })(
                                <span>{value.legalIdNo}</span>
                            )}

                        </FormItem>
                    </div>
                    <div className="sh_add_card">
                        <div className="sh_add_title">???????????????</div>
                        <FormItem label={<span style={{ background: this.state.contactsNamecolor }}>???????????????</span>} {...formInfo} >
                            {getFieldDecorator('adminName', {
                                initialValue: "",
                            })(
                                <span>{value.contactsName}</span>
                            )}

                        </FormItem>
                        <FormItem label={<span style={{ background: this.state.contactsPhonecolor }}>??????????????????</span>} {...formInfo} >
                            {getFieldDecorator('adminPhone', {
                                initialValue: "",
                            })(
                                <span>{value.contactsPhone}</span>
                            )}

                        </FormItem>
                        <FormItem label={<span style={{ background: this.state.contactsMailcolor }}>???????????????</span>} {...formInfo} >
                            {getFieldDecorator('adminEmail', {
                                initialValue: "",
                            })(
                                <span>{value.contactsMail}</span>
                            )}

                        </FormItem>
                        <FormItem label={<span style={{ background: this.state.contactsIdNocolor }}>?????????????????????</span>} {...formInfo} >
                            {getFieldDecorator('adminIdCard', {
                                initialValue: "",
                            })(
                                <span>{value.contactsIdNo}</span>
                            )}

                        </FormItem>
                    </div>
                    <div className="sh_add_card">
                        <div className="sh_add_title">??????????????????</div>
                        <FormItem label={<span style={{ background: this.state.namecolor }}>???????????????</span>} {...formInfo} className="paddingRight" >
                            {getFieldDecorator('settleAccountName', {
                                initialValue: this.state.sh_name,
                                //rules:[{required:true,message:"????????????????????????"},{pattern:/^[a-zA-Z\u4e00-\u9fa5]{1,50}$/,message:"????????????"}]
                            })(
                                <span>{value.name}</span>
                            )}

                        </FormItem>
                        <FormItem label={<span style={{ background: this.state.bankNocolor }}>??????????????????</span>} {...formInfo} >
                            {getFieldDecorator('settleBankCard', {
                                initialValue: "",
                            })(
                                <span>{value.bankNo}</span>
                            )}

                        </FormItem>
                        <Row>
                            <Col span={24}>
                                <FormItem label={<span style={{ background: this.state.bankNamecolor || this.state.bankSubNamecolor }}>???????????????</span>} {...formInfo} >
                                    {getFieldDecorator('bankName', {
                                    })(
                                        <span>{value.bankName + value.bankSubName}</span>

                                    )}

                                </FormItem>
                            </Col>

                        </Row>
                    </div>

                    <div className="sh_add_card img_label">
                        <div className="sh_add_title">????????????</div>
                        <FormItem label={<span style={{ background: this.state.imageLicensecolor }}>??????????????????(????????????)</span>} {...formInfo} className="texthh">
                            {getFieldDecorator('license', {
                                initialValue: "",
                            })(
                                <div style={{ width: "96px", height: "96px", padding: "9px", border: "1px solid #D9D9D9", borderRadius: "4px" }} onClick={() => { this.imgShow(this.state.imageLicense, "??????????????????") }}><img style={{ width: "100%", height: "100%" }} src={this.state.imageLicense ? (this.state.imageLicense.contentType === "application/pdf" ? img : img_show + this.state.imageLicense.storageNo) : null} alt="" /></div>
                            )}
                        </FormItem>

                        <Row>
                            <Col span={12}>
                                <FormItem label={<span style={{ background: this.state.imageLegalIdFrontcolor || this.state.imageLegalIdBackcolor }}>?????????????????????</span>} className="texthh" labelCol={{ span: 12 }} wrapperCol={{ span: 8 }} colon={false}>
                                    {getFieldDecorator('adminIdCardStorageNoZm', {
                                        initialValue: "",
                                    })(
                                        <div style={{ width: "96px", height: "96px", padding: "9px", border: "1px solid #D9D9D9", borderRadius: "4px" }} onClick={() => { this.imgShow(this.state.imageLegalIdFront, "?????????????????????") }}><img style={{ width: "100%", height: "100%" }} src={this.state.imageLegalIdFront ? (this.state.imageLegalIdFront.contentType === "application/pdf" ? img : img_show + this.state.imageLegalIdFront.storageNo) : null} alt="" /></div>
                                    )}

                                </FormItem>
                            </Col>
                            <Col span={11} pull={3} style={{ marginLeft: "16px" }}>
                                <FormItem label="" wrapperCol={{ span: 12 }} colon={false} className="texthh">
                                    {getFieldDecorator('adminIdCardStorageNoFm', {
                                        initialValue: "",
                                    })(
                                        <div style={{ width: "96px", height: "96px", padding: "9px", border: "1px solid #D9D9D9", borderRadius: "4px" }} onClick={() => { this.imgShow(this.state.imageLegalIdBack, "?????????????????????") }}><img style={{ width: "100%", height: "100%" }} src={this.state.imageLegalIdBack ? (this.state.imageLegalIdBack.contentType === "application/pdf" ? img : img_show + this.state.imageLegalIdBack.storageNo) : null} alt="" /></div>
                                    )}
                                </FormItem>
                            </Col>

                        </Row>

                        <FormItem label={<span style={{ background: this.state.imageAuthFilecolor }}>????????????????????? (????????????)</span>} {...formInfo} >
                            {getFieldDecorator('bankAccountLic', {
                                initialValue: "",
                                // rules:[{required:true,message:"??????????????????????????????"}]
                            })(
                                <div style={{ width: "96px", height: "96px", padding: "9px", border: "1px solid #D9D9D9", borderRadius: "4px" }} onClick={() => { this.imgShow(this.state.imageAuthFile, "?????????????????????") }}><img style={{ width: "100%", height: "100%" }} src={this.state.imageAuthFile ? (this.state.imageAuthFile.contentType === "application/pdf" ? img : img_show + this.state.imageAuthFile.storageNo) : null} alt="" /></div>
                            )}

                        </FormItem>
                        <Row>
                            <Col span={12}>
                                <FormItem label={<span style={{ background: this.state.imageContactsIdFrontcolor || this.state.imageContactsIdBackcolor }}>????????????????????????</span>} className="texthh" labelCol={{ span: 12 }} wrapperCol={{ span: 8 }} colon={false}>
                                    {getFieldDecorator('adminIdCardStorageNoZm', {
                                        initialValue: "",
                                    })(
                                        <div style={{ width: "96px", height: "96px", padding: "9px", border: "1px solid #D9D9D9", borderRadius: "4px" }} onClick={() => { this.imgShow(this.state.imageContactsIdFront, "????????????????????????") }}><img style={{ width: "100%", height: "100%" }} src={this.state.imageContactsIdFront ? (this.state.imageContactsIdFront.contentType === "application/pdf" ? img : img_show + this.state.imageContactsIdFront.storageNo) : null} alt="" /></div>
                                    )}

                                </FormItem>
                            </Col>
                            <Col span={11} pull={3} style={{ marginLeft: "16px" }}>
                                <FormItem label="" wrapperCol={{ span: 12 }} colon={false} className="texthh">
                                    {getFieldDecorator('adminIdCardStorageNoFm', {
                                        initialValue: "",
                                    })(
                                        <div style={{ width: "96px", height: "96px", padding: "9px", border: "1px solid #D9D9D9", borderRadius: "4px" }} onClick={() => { this.imgShow(this.state.imageContactsIdBack, "????????????????????????") }}><img style={{ width: "100%", height: "100%" }} src={this.state.imageContactsIdBack ? (this.state.imageContactsIdBack.contentType === "application/pdf" ? img : img_show + this.state.imageContactsIdBack.storageNo) : null} alt="" /></div>
                                    )}

                                </FormItem>
                            </Col>

                        </Row>

                    </div>
                    <div className="sh_add_card img_label">
                        <div className="sh_add_title">??????</div>
                        {
                            value.attachment && value.attachment !== "null" ? (JSON.parse(value.attachment) || []).map((i, k) => {
                                return <Row key={k} style={{ marginBottom: "5px" }} ><Col span={6} style={{ textAlign: "right", color: "rgba(0,0,0,0.5)", paddingRight: "10px", fontSize: "14px" }}><span style={{ background: this.state.attachmentcolor }}>??????{k + 1}</span></Col><Col span={9} onClick={() => { this.attachmentOpen(i.storageNo) }} style={{ cursor: "pointer", fontSize: "14px" }}>{i.name}</Col></Row>
                            }) : "????????????"
                        }
                    </div>
                </Form>
                <style>{`
                    .ant-form-item{
                        font-size:14px!important
                    }
                `}</style>
            </div>
        )

    }
}
export default Form.create()(Basic);