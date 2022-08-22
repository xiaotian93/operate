import React, { Component } from 'react';
import { Row, Col, Form } from 'antd';
import { manage_get, merchant_img_list, merchant_invoice, merchant_detail_uesr } from '../../../../ajax/api';
// import Repay from './repayBank';
import { host_sh } from '../../../../ajax/config';
// import {axios_sh} from '../../../ajax/request';
import img from '../../../../style/imgs/PDF.png';
import ImgViewer from '../../../../templates/ImgViewer';
import Verify from './audit';
import Time from './timeLine';
import { axios_merchant_json, axios_merchant } from '../../../../ajax/request';
const FormItem = Form.Item;
class Basic extends Component {
    constructor(props) {
        super(props);
        // props.onRef(this);
        this.state = {
            id: props.location.query.id,
            audit: props.location.query.audits,
            accountId: props.location.query.accountId,
            invoice: {},
            detail: {}
        };
    }
    componentWillMount() {
        if(this.state.id==="null"){
            return;
        }
        this.imgType();
        
        axios_merchant.post(merchant_invoice, { accountId: this.state.accountId }).then(e => {
            this.setState({
                invoice: e.data || {}
            })
        })
        axios_merchant.post(merchant_detail_uesr, { accountId: this.state.accountId }).then(e => {
            if (!e.code) {
                var data = e.data;
                var value = window.localStorage.getItem("audit_sh") ? JSON.parse(window.localStorage.getItem("audit_sh")) : {};
                for (var i in data) {
                    if (i !== "accountId" && i !== "id" && i !== "status") {
                        if (data[i] !== value[i]) {
                            this.setState({
                                [i + "color"]: "rgba(240,65,52,0.1)"
                            })
                        } else {
                            // this.setState({
                            //     [i]:""
                            // })
                        }
                    }

                }
            }
        })
    }
    imgType() {
        var value = window.localStorage.getItem("audit_sh") ? JSON.parse(window.localStorage.getItem("audit_sh")) : {};
        if(!value){
            return;
        }
        console.log(value)
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
    //附件打开
    attachmentOpen(e) {
        window.open(host_sh + manage_get + "?type=ORIGIN&storageNo=" + e)
    } 
    render() {
        var value = window.localStorage.getItem("audit_sh") ? JSON.parse(window.localStorage.getItem("audit_sh")) : {};
        const { getFieldDecorator } = this.props.form;
        const formInfo = {
            labelCol: { span: 6 },
            wrapperCol: { span: 9 },
            colon: false
        };
        var img_show = host_sh + manage_get + "?type=THUMB&storageNo=";
        return (
            <div>

                <Form className="sh_add content">
                    {this.state.audit === "true" ? <Verify auditId={this.state.id} /> : null}
                    {this.state.id!=="null"?<Time accountId={this.state.accountId} />:null}
                    <div className="sh_add_card">
                        <div style={{ overflow: "hidden" }}>
                            <div className="sh_add_title" style={{ float: "left" }}>商户信息 </div>
                            <div style={{ fontSize: "12px", color: "#000", float: "left", margin: "6px 0 0 8px" }}>底色标红</div>
                            <div style={{ width: "12px", height: "12px", background: "rgba(240,65,52,0.1)", border: "1px solid #DCDEE2", float: "left", marginTop: "8px", marginLeft: "4px" }} /><div style={{ fontSize: "12px", color: "#000", float: "left", margin: "6px 16px 0 4px" }}>的字段表示商户本次修改的信息内容，适用于下列所有字段</div>
                        </div>

                        <FormItem label={<span style={{ background: this.state.namecolor }}>商户全称</span>} {...formInfo} >
                            {getFieldDecorator('name', {
                                initialValue: "",
                            })(
                                <span>{value?value.name:"——"}</span>
                            )

                            }
                        </FormItem>

                        <FormItem label={<span style={{ background: this.state.shortNamecolor }}>商户简称</span>} {...formInfo} >
                            {getFieldDecorator('shortName', {
                                initialValue: "",
                            })(
                                <span>{value?value.shortName:"——"}</span>
                            )}

                        </FormItem>
                        <FormItem label={<span style={{ background: this.state.addresscolor }}>办公地址</span>} {...formInfo} >
                            {getFieldDecorator('address', {
                                initialValue: "",
                            })(
                                <span>{value?value.address:"——"}</span>
                            )}

                        </FormItem>
                        <FormItem label={<span style={{ background: this.state.licenseNocolor }}>统一社会信用代码</span>} {...formInfo} >
                            {getFieldDecorator('creditCode', {
                                initialValue: "",
                            })(
                                <span>{value?value.licenseNo:"——"}</span>
                            )}
                        </FormItem>
                    </div>
                    <div className="sh_add_card">
                        <div className="sh_add_title">法人信息</div>
                        <FormItem label={<span style={{ background: this.state.legalNamecolor }}>法人姓名</span>} {...formInfo} >
                            {getFieldDecorator('adminName', {
                                initialValue: "",
                            })(
                                <span>{value?value.legalName:"——"}</span>
                            )}

                        </FormItem>
                        <FormItem label={<span style={{ background: this.state.legalPhonecolor }}>法人手机号</span>} {...formInfo} >
                            {getFieldDecorator('adminPhone', {
                                initialValue: "",
                            })(
                                <span>{value?value.legalPhone:"——"}</span>
                            )}

                        </FormItem>
                        <FormItem label={<span style={{ background: this.state.legalIdNocolor }}>法人身份证号码</span>} {...formInfo} >
                            {getFieldDecorator('adminIdCard', {
                                initialValue: "",
                            })(
                                <span>{value?value.legalIdNo:"——"}</span>
                            )}

                        </FormItem>
                    </div>
                    <div className="sh_add_card">
                        <div className="sh_add_title">联系人信息</div>
                        <FormItem label={<span style={{ background: this.state.contactsNamecolor }}>联系人姓名</span>} {...formInfo} >
                            {getFieldDecorator('adminName', {
                                initialValue: "",
                            })(
                                <span>{value?value.contactsName:"——"}</span>
                            )}

                        </FormItem>
                        <FormItem label={<span style={{ background: this.state.contactsPhonecolor }}>联系人手机号</span>} {...formInfo} >
                            {getFieldDecorator('adminPhone', {
                                initialValue: "",
                            })(
                                <span>{value?value.contactsPhone:"——"}</span>
                            )}

                        </FormItem>
                        <FormItem label={<span style={{ background: this.state.contactsMailcolor }}>联系人邮箱</span>} {...formInfo} >
                            {getFieldDecorator('adminEmail', {
                                initialValue: "",
                            })(
                                <span>{value?value.contactsMail:"——"}</span>
                            )}

                        </FormItem>
                        <FormItem label={<span style={{ background: this.state.contactsIdNocolor }}>联系人身份证号</span>} {...formInfo} >
                            {getFieldDecorator('adminIdCard', {
                                initialValue: "",
                            })(
                                <span>{value?value.contactsIdNo:"——"}</span>
                            )}

                        </FormItem>
                    </div>
                    <div className="sh_add_card">
                        <div className="sh_add_title">结算账户信息</div>
                        <FormItem label={<span style={{ background: this.state.namecolor }}>结算账户名</span>} {...formInfo} className="paddingRight" >
                            {getFieldDecorator('settleAccountName', {
                                initialValue: this.state.sh_name,
                                //rules:[{required:true,message:"请输入结算账户名"},{pattern:/^[a-zA-Z\u4e00-\u9fa5]{1,50}$/,message:"格式错误"}]
                            })(
                                <span>{value?value.name:"——"}</span>
                            )}

                        </FormItem>
                        <FormItem label={<span style={{ background: this.state.bankNocolor }}>结算银行账号</span>} {...formInfo} >
                            {getFieldDecorator('settleBankCard', {
                                initialValue: "",
                            })(
                                <span>{value?value.bankNo:"——"}</span>
                            )}

                        </FormItem>
                        <Row>
                            <Col span={24}>
                                <FormItem label={<span style={{ background: this.state.bankNamecolor || this.state.bankSubNamecolor }}>开户行名称</span>} {...formInfo} >
                                    {getFieldDecorator('bankName', {
                                    })(
                                        <span>{value?(value.bankName + value.bankSubName):"——"}</span>

                                    )}

                                </FormItem>
                            </Col>

                        </Row>
                    </div>

                    {value?<div className="sh_add_card img_label">
                        <div className="sh_add_title">影像资料</div>
                        <FormItem label={<span style={{ background: this.state.imageLicensecolor }}>营业执照影像(加盖公章)</span>} {...formInfo} className="texthh">
                            {getFieldDecorator('license', {
                                initialValue: "",
                            })(
                                <div style={{ width: "96px", height: "96px", padding: "9px", border: "1px solid #D9D9D9", borderRadius: "4px" }} onClick={() => { this.imgShow(this.state.imageLicense, "营业执照影像") }}><img style={{ width: "100%", height: "100%" }} src={this.state.imageLicense ? (this.state.imageLicense.contentType === "application/pdf" ? img : img_show + this.state.imageLicense.storageNo) : null} alt="" /></div>
                            )}
                        </FormItem>

                        <Row>
                            <Col span={12}>
                                <FormItem label={<span style={{ background: this.state.imageLegalIdFrontcolor || this.state.imageLegalIdBackcolor }}>法人身份证影像</span>} className="texthh" labelCol={{ span: 12 }} wrapperCol={{ span: 8 }} colon={false}>
                                    {getFieldDecorator('adminIdCardStorageNoZm', {
                                        initialValue: "",
                                    })(
                                        <div style={{ width: "96px", height: "96px", padding: "9px", border: "1px solid #D9D9D9", borderRadius: "4px" }} onClick={() => { this.imgShow(this.state.imageLegalIdFront, "法人身份证正面") }}><img style={{ width: "100%", height: "100%" }} src={this.state.imageLegalIdFront ? (this.state.imageLegalIdFront.contentType === "application/pdf" ? img : img_show + this.state.imageLegalIdFront.storageNo) : null} alt="" /></div>
                                    )}

                                </FormItem>
                            </Col>
                            <Col span={11} pull={3} style={{ marginLeft: "16px" }}>
                                <FormItem label="" wrapperCol={{ span: 12 }} colon={false} className="texthh">
                                    {getFieldDecorator('adminIdCardStorageNoFm', {
                                        initialValue: "",
                                    })(
                                        <div style={{ width: "96px", height: "96px", padding: "9px", border: "1px solid #D9D9D9", borderRadius: "4px" }} onClick={() => { this.imgShow(this.state.imageLegalIdBack, "法人身份证反面") }}><img style={{ width: "100%", height: "100%" }} src={this.state.imageLegalIdBack ? (this.state.imageLegalIdBack.contentType === "application/pdf" ? img : img_show + this.state.imageLegalIdBack.storageNo) : null} alt="" /></div>
                                    )}
                                </FormItem>
                            </Col>

                        </Row>

                        <FormItem label={<span style={{ background: this.state.imageAuthFilecolor }}>授权委托书影像 (加盖公章)</span>} {...formInfo} >
                            {getFieldDecorator('bankAccountLic', {
                                initialValue: "",
                                // rules:[{required:true,message:"请上传银行开户许可证"}]
                            })(
                                <div style={{ width: "96px", height: "96px", padding: "9px", border: "1px solid #D9D9D9", borderRadius: "4px" }} onClick={() => { this.imgShow(this.state.imageAuthFile, "授权委托书影像") }}><img style={{ width: "100%", height: "100%" }} src={this.state.imageAuthFile ? (this.state.imageAuthFile.contentType === "application/pdf" ? img : img_show + this.state.imageAuthFile.storageNo) : null} alt="" /></div>
                            )}

                        </FormItem>
                        <Row>
                            <Col span={12}>
                                <FormItem label={<span style={{ background: this.state.imageContactsIdFrontcolor || this.state.imageContactsIdBackcolor }}>联系人身份证影像</span>} className="texthh" labelCol={{ span: 12 }} wrapperCol={{ span: 8 }} colon={false}>
                                    {getFieldDecorator('adminIdCardStorageNoZm', {
                                        initialValue: "",
                                    })(
                                        <div style={{ width: "96px", height: "96px", padding: "9px", border: "1px solid #D9D9D9", borderRadius: "4px" }} onClick={() => { this.imgShow(this.state.imageContactsIdFront, "联系人身份证正面") }}><img style={{ width: "100%", height: "100%" }} src={this.state.imageContactsIdFront ? (this.state.imageContactsIdFront.contentType === "application/pdf" ? img : img_show + this.state.imageContactsIdFront.storageNo) : null} alt="" /></div>
                                    )}

                                </FormItem>
                            </Col>
                            <Col span={11} pull={3} style={{ marginLeft: "16px" }}>
                                <FormItem label="" wrapperCol={{ span: 12 }} colon={false} className="texthh">
                                    {getFieldDecorator('adminIdCardStorageNoFm', {
                                        initialValue: "",
                                    })(
                                        <div style={{ width: "96px", height: "96px", padding: "9px", border: "1px solid #D9D9D9", borderRadius: "4px" }} onClick={() => { this.imgShow(this.state.imageContactsIdBack, "联系人身份证反面") }}><img style={{ width: "100%", height: "100%" }} src={this.state.imageContactsIdBack ? (this.state.imageContactsIdBack.contentType === "application/pdf" ? img : img_show + this.state.imageContactsIdBack.storageNo) : null} alt="" /></div>
                                    )}

                                </FormItem>
                            </Col>

                        </Row>

                    </div>:
                    <div className="sh_add_card">
                    <div className="sh_add_title">影像资料</div>
                    <FormItem label={<span style={{ background: this.state.imageLicensecolor }}>营业执照影像(加盖公章)</span>} {...formInfo} className="texthh">
                        {getFieldDecorator('license', {
                            initialValue: "",
                        })(
                            <div>——</div> 
                        )}
                    </FormItem>

                    <Row>
                        <Col span={12}>
                            <FormItem label={<span style={{ background: this.state.imageLegalIdFrontcolor || this.state.imageLegalIdBackcolor }}>法人身份证影像</span>} className="texthh" labelCol={{ span: 12 }} wrapperCol={{ span: 8 }} colon={false}>
                                {getFieldDecorator('adminIdCardStorageNoZm', {
                                    initialValue: "",
                                })(
                                    <div>——</div>
                                )}

                            </FormItem>
                        </Col>
                        

                    </Row>

                    <FormItem label={<span style={{ background: this.state.imageAuthFilecolor }}>授权委托书影像 (加盖公章)</span>} {...formInfo} >
                        {getFieldDecorator('bankAccountLic', {
                            initialValue: "",
                            // rules:[{required:true,message:"请上传银行开户许可证"}]
                        })(
                            <div>——</div>
                        )}

                    </FormItem>
                    <Row>
                        <Col span={12}>
                            <FormItem label={<span style={{ background: this.state.imageContactsIdFrontcolor || this.state.imageContactsIdBackcolor }}>联系人身份证影像</span>} className="texthh" labelCol={{ span: 12 }} wrapperCol={{ span: 8 }} colon={false}>
                                {getFieldDecorator('adminIdCardStorageNoZm', {
                                    initialValue: "",
                                })(
                                    <div>——</div>
                                )}

                            </FormItem>
                        </Col>
                    </Row>

                </div>
                }
                    <div className="sh_add_card img_label">
                        <div className="sh_add_title">附件</div>
                        {
                            value?(value.attachment&&value.attachment!=="null" ?(JSON.parse(value.attachment)||[]).map((i, k) => {
                                return <Row key={k} style={{ marginBottom: "5px" }} ><Col span={6} style={{textAlign:"right",color:"rgba(0,0,0,0.5)",paddingRight:"10px",fontSize:"14px"}}><span style={{background: this.state.attachmentcolor}}>附件{k+1}</span></Col><Col span={9} onClick={() => { this.attachmentOpen(i.storageNo) }} style={{ cursor: "pointer", fontSize: "14px" }}>{i.name}</Col></Row>
                            }):"暂无附件"):"暂无附件"
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