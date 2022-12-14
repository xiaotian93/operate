import React, { Component } from 'react';
import {Row,Col,Form} from 'antd';
import {manage_get,merchant_img_list,merchant_invoice,merchant_detail_uesr} from '../../../../ajax/api';
// import Repay from './repayBank';
import {host_sh} from '../../../../ajax/config';
// import {axios_sh} from '../../../ajax/request';
import img from '../../../../style/imgs/PDF.png';
import ImgViewer from '../../../../templates/ImgViewer';
import Time from '../../audit/detail/timeLine';
import { axios_merchant_json,axios_merchant } from '../../../../ajax/request';

const FormItem = Form.Item;
class Basic extends Component{
    constructor(props) {
        super(props);
        // props.onRef(this);
        this.state = {
            // audit:props.location.query.audits,
            // accountId:props.location.query.accountId
            invoice:{},
            value:{}
        };
    }
    componentWillMount(){
        
        axios_merchant.post(merchant_invoice,{accountId:this.props.accountId}).then(e=>{
            this.setState({
                invoice:e.data||{}
            })
        })
        axios_merchant.post(merchant_detail_uesr,{accountId:this.props.accountId}).then(data=>{
            this.setState({
                value:data.data||{}
            })
            this.imgType(data.data);
        })
    }
    imgType(value){
        if(JSON.stringify(value)){
        var param=[
            value.imageLicense,
            value.imageLegalIdFront,
            value.imageLegalIdBack,
            value.imageAuthFile,
            value.imageContactsIdFront,
            value.imageContactsIdBack
        ]
            
        axios_merchant_json.post(merchant_img_list,param).then(e=>{
            var data=e.data;
            for(var i in data){
                if(data[i].storageNo===value.imageLicense){
                    this.setState({
                        imageLicense:data[i]
                    })
                }else if(data[i].storageNo===value.imageLegalIdFront){
                    this.setState({
                        imageLegalIdFront:data[i]
                    })
                }else if(data[i].storageNo===value.imageLegalIdBack){
                    this.setState({
                        imageLegalIdBack:data[i]
                    })
                }else if(data[i].storageNo===value.imageAuthFile){
                    this.setState({
                        imageAuthFile:data[i]
                    })
                }else if(data[i].storageNo===value.imageContactsIdFront){
                    this.setState({
                        imageContactsIdFront:data[i]
                    })
                }else if(data[i].storageNo===value.imageContactsIdBack){
                    this.setState({
                        imageContactsIdBack:data[i]
                    })
                }
            }
        })
    }
    }
    imgShow(e,des){
        if(e.contentType!=="application/pdf"){
            var img=[];
            var img1={src:host_sh+manage_get+"?type=ORIGIN&storageNo="+e.storageNo,des:des};
            img.push(img1)
            new ImgViewer(img,{index:0,show:true});
        }else{
            window.open(host_sh+manage_get+"?type=ORIGIN&storageNo="+e.storageNo)
        }
        
    }
    //????????????
    attachmentOpen(e) {
        window.open(host_sh + manage_get + "?type=ORIGIN&storageNo=" + e)
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formInfo={
            labelCol:{span:6},
            wrapperCol:{span:9},
            colon:false
        };
        var img_show=host_sh+manage_get+"?type=THUMB&storageNo=";
        return (
            <div>
                {/* <Row className="path">
                <Breadcrumb>
                    <Breadcrumb.Item>????????????</Breadcrumb.Item>
                    <Breadcrumb.Item>????????????</Breadcrumb.Item>
                    <Breadcrumb.Item>{this.state.audit==="true"?"??????":"??????"}</Breadcrumb.Item>
                </Breadcrumb>
                </Row> */}
                
                <Form className="sh_add">
                <Time accountId={this.props.accountId} />
                <div className="sh_add_card">
                <div className="sh_add_title">????????????</div>
                    <FormItem label="????????????" {...formInfo} >
                        {getFieldDecorator('name', {
                            initialValue:"",
                        })(
                            <div>{this.state.value.name}</div>
                        )
                        
                        }
                    </FormItem>

                    <FormItem label="????????????" {...formInfo} >
                        {getFieldDecorator('shortName', {
                            initialValue:"",
                        })(
                            <div>{this.state.value.shortName}</div>
                        )}

                    </FormItem>
                    <FormItem label="????????????" {...formInfo} >
                        {getFieldDecorator('address', {
                            initialValue:"",
                        })(
                            <div>{this.state.value.address}</div>
                        )}

                    </FormItem>
                    <FormItem label="????????????????????????" {...formInfo} >
                            {getFieldDecorator('creditCode', {
                            initialValue:"",
                        })(
                            <div>{this.state.value.licenseNo}</div>
                        )}
                    </FormItem>
                </div>
                <div className="sh_add_card">
                <div className="sh_add_title">????????????</div>
                    <FormItem label="????????????" {...formInfo} >
                        {getFieldDecorator('adminName', {
                            initialValue:"",
                        })(
                            <div>{this.state.value.legalName}</div>
                        )}

                    </FormItem>
                    <FormItem label="???????????????" {...formInfo} >
                        {getFieldDecorator('adminPhone', {
                            initialValue:"",
                        })(
                            <div>{this.state.value.legalPhone}</div>
                        )}

                    </FormItem>
                    <FormItem label="?????????????????????" {...formInfo} >
                        {getFieldDecorator('adminIdCard', {
                            initialValue:"",
                        })(
                            <div>{this.state.value.legalIdNo}</div>
                        )}

                    </FormItem>
                </div>
                <div className="sh_add_card">
                <div className="sh_add_title">???????????????</div>
                    <FormItem label="???????????????" {...formInfo} >
                        {getFieldDecorator('adminName', {
                            initialValue:"",
                        })(
                            <div>{this.state.value.contactsName}</div>
                        )}

                    </FormItem>
                    <FormItem label="??????????????????" {...formInfo} >
                        {getFieldDecorator('adminPhone', {
                            initialValue:"",
                        })(
                            <div>{this.state.value.contactsPhone}</div>
                        )}

                    </FormItem>
                    <FormItem label="???????????????" {...formInfo} >
                        {getFieldDecorator('adminEmail', {
                            initialValue:"",
                        })(
                            <div>{this.state.value.contactsMail}</div>
                        )}

                    </FormItem>
                    <FormItem label="?????????????????????" {...formInfo} >
                        {getFieldDecorator('adminIdCard', {
                            initialValue:"",
                        })(
                            <div>{this.state.value.contactsIdNo}</div>
                        )}

                    </FormItem>
                </div>
                <div className="sh_add_card">
                <div className="sh_add_title">??????????????????</div>
                    <FormItem label="???????????????" {...formInfo} className="paddingRight" >
                        {getFieldDecorator('settleAccountName', {
                            initialValue:this.state.sh_name,
                            //rules:[{required:true,message:"????????????????????????"},{pattern:/^[a-zA-Z\u4e00-\u9fa5]{1,50}$/,message:"????????????"}]
                        })(
                            <div>{this.state.value.name}</div>
                        )}

                    </FormItem>
                    <FormItem label="??????????????????" {...formInfo} >
                        {getFieldDecorator('settleBankCard', {
                            initialValue:"",
                        })(
                            <div>{this.state.value.bankNo}</div>
                        )}

                    </FormItem>
                    <Row>
                        <Col span={24}>
                            <FormItem label="???????????????" {...formInfo} >
                                {getFieldDecorator('bankName', {
                                })(
                                    <div>{this.state.value.bankName+this.state.value.bankSubName}</div>

                                )}

                            </FormItem>
                        </Col>
                        {/* <Col span={11} style={{marginLeft:'5px'}} >
                            <FormItem label="" wrapperCol={{span:13}} colon={false} >
                                {getFieldDecorator('subBankName', {
                                })(
                                    <div>????????????????????????????????????</div>
                                    )}

                            </FormItem>
                        </Col> */}
                    </Row>
                </div>
                <div className="sh_add_card">
                <div className="sh_add_title">????????????</div>
                    <FormItem label="????????????" {...formInfo} >
                        {getFieldDecorator('name', {
                            initialValue:"",
                        })(
                            <div>{this.state.invoice.companyName||"--"}</div>
                        )
                        
                        }
                    </FormItem>

                    <FormItem label="??????????????????" {...formInfo} >
                        {getFieldDecorator('shortName', {
                            initialValue:"",
                        })(
                            <div>{this.state.invoice.licenseNo||"--"}</div>
                        )}

                    </FormItem>
                    <FormItem label="?????????" {...formInfo} >
                        {getFieldDecorator('aaa', {
                            initialValue:"",
                        })(
                            <div>{this.state.invoice.bankName||"--"}</div>
                        )}

                    </FormItem>
                    <FormItem label="????????????" {...formInfo} >
                            {getFieldDecorator('bbb', {
                            initialValue:"",
                        })(
                            <div>{this.state.invoice.bankNo||"--"}</div>
                        )}
                    </FormItem>
                    <FormItem label="????????????" {...formInfo} >
                            {getFieldDecorator('ccc', {
                            initialValue:"",
                        })(
                            <div>{this.state.invoice.address||"--"}</div>
                        )}
                    </FormItem>
                    <FormItem label="??????????????????" {...formInfo} >
                            {getFieldDecorator('ddd', {
                            initialValue:"",
                        })(
                            <div>{this.state.invoice.phoneNo||"--"}</div>
                        )}
                    </FormItem>
                    </div>
                    
                <div className="sh_add_card img_label">
                <div className="sh_add_title">????????????</div>
                    <FormItem label="??????????????????(????????????)" {...formInfo} className="texthh">
                        {getFieldDecorator('license', {
                            initialValue:"",
                        })(
                            <div style={{width:"96px",height:"96px",padding:"9px",border:"1px solid #D9D9D9",borderRadius:"4px"}} onClick={()=>{this.imgShow(this.state.imageLicense,"??????????????????")}}><img style={{width:"100%",height:"100%"}} src={this.state.imageLicense?(this.state.imageLicense.contentType==="application/pdf"?img:img_show+this.state.imageLicense.storageNo):null} alt="" /></div>
                        )}
                    </FormItem>
                    
                    <Row>
                        <Col span={12}>
                            <FormItem label="?????????????????????" className="texthh" labelCol={{span:12}} wrapperCol={{span:8}} colon={false}>
                        {getFieldDecorator('adminIdCardStorageNoZm', {
                            initialValue:"",
                        })(
                            <div style={{width:"96px",height:"96px",padding:"9px",border:"1px solid #D9D9D9",borderRadius:"4px"}} onClick={()=>{this.imgShow(this.state.imageLegalIdFront,"?????????????????????")}}><img style={{width:"100%",height:"100%"}} src={this.state.imageLegalIdFront?(this.state.imageLegalIdFront.contentType==="application/pdf"?img:img_show+this.state.imageLegalIdFront.storageNo):null} alt="" /></div>         
                            )}
                        
                    </FormItem>
                        </Col>
                        <Col span={11} pull={3} style={{marginLeft:"16px"}}>
                            <FormItem label="" wrapperCol={{span:12}} colon={false} className="texthh">
                        {getFieldDecorator('adminIdCardStorageNoFm', {
                            initialValue:"",
                        })(
                            <div style={{width:"96px",height:"96px",padding:"9px",border:"1px solid #D9D9D9",borderRadius:"4px"}} onClick={()=>{this.imgShow(this.state.imageLegalIdBack,"?????????????????????")}}><img style={{width:"100%",height:"100%"}} src={this.state.imageLegalIdBack?(this.state.imageLegalIdBack.contentType==="application/pdf"?img:img_show+this.state.imageLegalIdBack.storageNo):null} alt="" /></div>
                        )}
                    </FormItem>
                        </Col>
                        
                    </Row>
                    
                    <FormItem label="????????????????????? (????????????)" {...formInfo} >
                        {getFieldDecorator('bankAccountLic', {
                            initialValue:"",
                            // rules:[{required:true,message:"??????????????????????????????"}]
                        })(
                            <div style={{width:"96px",height:"96px",padding:"9px",border:"1px solid #D9D9D9",borderRadius:"4px"}} onClick={()=>{this.imgShow(this.state.imageAuthFile,"?????????????????????")}}><img style={{width:"100%",height:"100%"}} src={this.state.imageAuthFile?(this.state.imageAuthFile.contentType==="application/pdf"?img:img_show+this.state.imageAuthFile.storageNo):null} alt="" /></div>
                        )}
                        
                    </FormItem>
                    <Row>
                        <Col span={12}>
                            <FormItem label="????????????????????????" className="texthh" labelCol={{span:12}} wrapperCol={{span:8}} colon={false}>
                        {getFieldDecorator('adminIdCardStorageNoZm', {
                            initialValue:"",
                        })(
                            <div style={{width:"96px",height:"96px",padding:"9px",border:"1px solid #D9D9D9",borderRadius:"4px"}} onClick={()=>{this.imgShow(this.state.imageContactsIdFront,"????????????????????????")}}><img style={{width:"100%",height:"100%"}} src={this.state.imageContactsIdFront?(this.state.imageContactsIdFront.contentType==="application/pdf"?img:img_show+this.state.imageContactsIdFront.storageNo):null} alt="" /></div>
                        )}
                        
                    </FormItem>
                        </Col>
                        <Col span={11} pull={3} style={{marginLeft:"16px"}}>
                            <FormItem label="" wrapperCol={{span:12}} colon={false} className="texthh">
                        {getFieldDecorator('adminIdCardStorageNoFm', {
                            initialValue:"",
                        })(
                            <div style={{width:"96px",height:"96px",padding:"9px",border:"1px solid #D9D9D9",borderRadius:"4px"}} onClick={()=>{this.imgShow(this.state.imageContactsIdBack,"????????????????????????")}}><img style={{width:"100%",height:"100%"}} src={this.state.imageContactsIdBack?(this.state.imageContactsIdBack.contentType==="application/pdf"?img:img_show+this.state.imageContactsIdBack.storageNo):null} alt="" /></div>
                        )}
                        
                    </FormItem>
                        </Col>
                        
                    </Row>

                </div>
                    
                <div className="sh_add_card img_label">
                        <div className="sh_add_title">??????</div>
                        {
                            this.state.value.attachment&&this.state.value.attachment!=="null" ? JSON.parse(this.state.value.attachment).map((i, k) => {
                                return <Row key={k} style={{ marginBottom: "5px" }} ><Col span={6} style={{textAlign:"right",color:"rgba(0,0,0,0.5)",paddingRight:"10px",fontSize:"14px"}}><span>??????{k+1}</span></Col><Col span={9} onClick={() => { this.attachmentOpen(i.storageNo) }} style={{ cursor: "pointer", fontSize: "14px" }}>{i.name}</Col></Row>
                            }):"????????????"
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