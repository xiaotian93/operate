import React, { Component } from 'react';
import {Row,Col,Form,Select,Modal} from 'antd';
import {qudao_list,bank_list,merchant_image} from '../../../../ajax/api';
import {host_cxfq} from '../../../../ajax/config';
import {axios_sh} from '../../../../ajax/request';
import img from '../../../style/imgs/PDF.png';
import ImgViewer from '../../../../templates/ImgViewer';

const FormItem = Form.Item;
const Option = Select.Option;
class Basic extends Component{
    constructor(props) {
        super(props);
        props.onRef(this);
        this.state = {
            shId:'',
            product:[],
            license:[],
            bankAccountLic:[],
            qudao:[],
            bank:[],
            id:props.id,
            productIds:[],
            basicData:{
                bankAccountLicStorage:{
                    // contentType:""
                },
                adminIdCardFmStorage:{
                    // contentType:""
                },
                adminIdCardZmStorage:{
                    // contentType:""
                },
                licenseStorage:{
                    // contentType:""
                }
            },
            productName:[]
        };
        this.product=[]
    }
    componentWillMount(){
        this.getShNo();
        this.productList();
        var data=JSON.parse(window.localStorage.getItem('productList'));
        for(var i in data){
            this.product.push(<Option key={i} value={data[i].id.toString()} aa={data[i]}>{data[i].name}</Option>)
        }
        if(this.state.id){
            setTimeout(()=>{
                this.editData()
            },100)

        }
    }
    getShNo(){
        var shNo=new Date().getTime().toString().substring(5);
        this.setState({
            shId:shNo
        })
    }
    productList(){
        axios_sh.get(qudao_list).then(e=>{
            if(!e.code){
                this.setState({
                    qudao:e.data
                })
            }
        });
        axios_sh.get(bank_list).then(e=>{
            if(!e.code){
                this.setState({
                    bank:e.data
                })
            }
        })
    }
    editData(){
        var data=JSON.parse(window.localStorage.getItem("detail"));
        var productList=JSON.parse(window.localStorage.getItem("productList"));
        var basic=data.basic;
        var productId=basic.productIds;
        var value=[];
        for(var j in productId){
            for(var k in productList){

                if(productId[j]===productList[k].id.toString()){
                    value.push(productList[k].name)
                }
            }
        }
        this.setState({
            basicData:basic,
            productName:value
        })
        for(var i in basic){
            if(i==="productIds"){
                var product=[];
                var productArr=JSON.parse(window.localStorage.getItem("productList"));
                for(var p in basic[i]){
                    for(var m in productArr){
                        if(basic[i][p]===productArr[m].id.toString()){
                            product.push(productArr[m]);
                        }
                    }
                }
                this.setState({
                    productList:product
                })
                this.props.productList(product);
            }
        }
    }
    licenseShow(open){
        if(open){
            var img=[];
            var img1={src:host_cxfq+merchant_image+"?storageNo="+this.state.basicData.license,des:"营业执照"};
            img.push(img1)
            new ImgViewer(img,{index:0,show:true});
        }else{
            window.open(host_cxfq+merchant_image+"?storageNo="+this.state.basicData.license)
        }
        
    }
    bankAccountLicShow(open){
        if(open){
            var img=[];
            var img1={src:host_cxfq+merchant_image+"?storageNo="+this.state.basicData.bankAccountLic,des:"银行开户许可证"};
            img.push(img1)
            new ImgViewer(img,{index:0,show:true});
        }else{
            window.open(host_cxfq+merchant_image+"?storageNo="+this.state.basicData.bankAccountLic)
        }
        
    }
    idzShow(open){
        if(open){
            var img=[];
            var img1={src:host_cxfq+merchant_image+"?storageNo="+this.state.basicData.adminIdCardStorageNoZm,des:"身份证正面"};
            img.push(img1)
            new ImgViewer(img,{index:0,show:true});
        //     this.setState({
        //     img_show:host_cxfq+merchant_image+"?storageNo="+this.state.basicData.adminIdCardStorageNoZm,
        //     previewVisible:true
        // })
        }else{
            window.open(host_cxfq+merchant_image+"?storageNo="+this.state.basicData.adminIdCardStorageNoZm)
        }
        
    }
    idfShow(open){
        if(open){
            var img=[];
            var img1={src:host_cxfq+merchant_image+"?storageNo="+this.state.basicData.adminIdCardStorageNoFm,des:"身份证反面"};
            img.push(img1)
            new ImgViewer(img,{index:0,show:true});
        }else{
            window.open(host_cxfq+merchant_image+"?storageNo="+this.state.basicData.adminIdCardStorageNoFm)
        }
        
    }
    imgCancel(){
        this.setState({
            previewVisible:false
        })
    }
    render() {
        //console.log(this.props.productId)
        const { getFieldDecorator } = this.props.form;
        const formInfo={
            labelCol:{span:4},
            wrapperCol:{span:6},
            colon:true
        };
        var types={1:"4s门店",2:"货运公司",3:"保险代理",4:"大型企业",5:"平台方",6:"物流公司",7:"租赁",8:"网约车"};
        return (
                <Form className="sh_add" disabled="true">
                <div className="sh_add_card">
                <div className="sh_inner_box">
                <div className="sh_add_title">商户信息</div>
                    <FormItem label="商户ID" {...formInfo} >
                        {getFieldDecorator('shNo', {
                        })(
                            <div style={{fontSize:"14px"}}>{this.state.basicData.shNo}</div>
                        )}

                    </FormItem>
                    <FormItem label="归属渠道" {...formInfo} >
                        {getFieldDecorator('qudao', {
                        })(
                            <div style={{fontSize:"14px"}}>{this.state.basicData.qudao}</div>
                        )}

                    </FormItem>
                    <FormItem label="商户类型" {...formInfo} >
                        {getFieldDecorator('type', {
                        })(
                            <div style={{fontSize:"14px"}}>{types[this.state.basicData.type]}</div>
                        )}

                    </FormItem>
                    <FormItem label="商户全称" {...formInfo} >
                        {getFieldDecorator('name', {

                        })(
                            <div style={{fontSize:"14px"}}>{this.state.basicData.name}</div>
                        )}

                    </FormItem>
                    <FormItem label="商户简称" {...formInfo} >
                        {getFieldDecorator('shortName', {
                        })(
                            <div style={{fontSize:"14px"}}>{this.state.basicData.shortName}</div>
                        )}

                    </FormItem>
                    <FormItem label="商户地址" {...formInfo} >
                        {getFieldDecorator('address', {
                        })(
                            <div style={{fontSize:"14px"}}>{this.state.basicData.address}</div>
                        )}

                    </FormItem>
                    <FormItem label="统一社会信用代码" {...formInfo} >
                        {getFieldDecorator('creditCode', {
                        })(
                            <div style={{fontSize:"14px"}}>{this.state.basicData.creditCode}</div>
                        )}

                    </FormItem>
                </div>
                </div>
                <div className="sh_add_card">
                <div className="sh_inner_box">
                <div className="sh_add_title">联系人信息</div>
                <FormItem label="联系人姓名" {...formInfo} >
                        {getFieldDecorator('adminName', {
                        })(
                            <div style={{fontSize:"14px"}}>{this.state.basicData.adminName}</div>
                        )}

                    </FormItem>
                <FormItem label="联系人手机号" {...formInfo} >
                        {getFieldDecorator('adminPhone', {
                        })(
                            <div style={{fontSize:"14px"}}>{this.state.basicData.adminPhone}</div>
                        )}

                    </FormItem>
                    <FormItem label="联系人邮箱" {...formInfo} >
                        {getFieldDecorator('adminEmail', {
                        })(
                            <div style={{fontSize:"14px"}}>{this.state.basicData.adminEmail}</div>
                        )}

                    </FormItem>
                    <FormItem label="联系人身份证号" {...formInfo} >
                        {getFieldDecorator('adminIdCard', {
                            
                        })(
                            <div style={{fontSize:"14px"}}>{this.state.basicData.adminIdCard}</div>
                        )}

                    </FormItem>
                </div>
                </div>
                <div className="sh_add_card">
                <div className="sh_inner_box">
                <div className="sh_add_title">结算账户信息</div>
                <FormItem label="结算账户名" {...formInfo} >
                        {getFieldDecorator('settleAccountName', {
                        })(
                            <div style={{fontSize:"14px"}}>{this.state.basicData.settleAccountName}</div>
                        )}

                    </FormItem>
                    <FormItem label="结算账号" {...formInfo} >
                        {getFieldDecorator('settleBankCard', {
                        })(
                            <div style={{fontSize:"14px"}}>{this.state.basicData.settleBankCard}</div>
                        )}

                    </FormItem>
                    <Row>
                        <Col span={12}>
                            <FormItem label="开户行名称" labelCol={{span:8}} wrapperCol={{span:16}} >
                                {getFieldDecorator('bankName', {

                                })(
                                    <div style={{fontSize:"14px"}}>{this.state.basicData.bankName+this.state.basicData.subBankName}</div>
                                )}

                            </FormItem>
                        </Col>
                        {/* <Col span={11} pull={4} style={{marginLeft:'5px'}} >
                            <FormItem label="" wrapperCol={{span:13}} colon={false} >
                                {getFieldDecorator('subBankName', {
                                    initialValue:""
                                })(
                                    <div style={{fontSize:"14px"}}>{this.state.basicData.subBankName}</div>
                                )}

                            </FormItem>
                        </Col> */}
                    </Row>
                </div>
                </div>
                <div className="sh_add_card">
                <div className="sh_inner_box">
                <div className="sh_add_title">影像资料</div>
                <FormItem label="营业执照影像" {...formInfo} >
                        {getFieldDecorator('license', {
                        })(
                            <img alt="" src={this.state.basicData.licenseStorage?(this.state.basicData.licenseStorage.contentType!=="application/pdf"?(host_cxfq+merchant_image+"?storageNo="+this.state.basicData.license):img):null} style={{width:"100px",height:"100px"}} onClick={()=>{this.licenseShow(this.state.basicData.licenseStorage.contentType!=="application/pdf"?true:false)}} />
                        )}
                    </FormItem>
                    <Row>
                        <Col span={12}>
                            <FormItem label="联系人身份证影像" className="" labelCol={{span:8}} wrapperCol={{span:8}}>
                        {getFieldDecorator('adminIdCardStorageNoZm', {
                            
                        })(
                            <img alt="" src={this.state.basicData.adminIdCardZmStorage?(this.state.basicData.adminIdCardZmStorage.contentType!=="application/pdf"?(host_cxfq+merchant_image+"?storageNo="+this.state.basicData.adminIdCardStorageNoZm):img):null} style={{width:"100px",height:"100px"}} onClick={()=>{this.idzShow(this.state.basicData.adminIdCardZmStorage.contentType!=="application/pdf"?true:false)}} />
                        )}
                        
                    </FormItem>
                        </Col>
                        <Col span={12} pull={5}>
                            <FormItem label="" wrapperCol={{span:12}} colon={false} className="texthh">
                        {getFieldDecorator('adminIdCardStorageNoFm', {
                        
                        })(
                            <img alt="" src={this.state.basicData.adminIdCardFmStorage?(this.state.basicData.adminIdCardFmStorage.contentType!=="application/pdf"?(host_cxfq+merchant_image+"?storageNo="+this.state.basicData.adminIdCardStorageNoFm):img):null} style={{width:"100px",height:"100px"}} onClick={()=>{this.idfShow(this.state.basicData.adminIdCardFmStorage.contentType!=="application/pdf"?true:false)}} />
                        )}
                    </FormItem>
                        </Col>
                        
                    </Row>
                    <FormItem label="银行开户许可证" {...formInfo} >
                        {getFieldDecorator('bankAccountLic', {
                        })(
                            
                            <img alt="" src={this.state.basicData.bankAccountLicStorage?(this.state.basicData.bankAccountLicStorage.contentType!=="application/pdf"?(host_cxfq+merchant_image+"?storageNo="+this.state.basicData.bankAccountLic):img):null} style={{width:"100px",height:"100px"}} onClick={()=>{this.bankAccountLicShow(this.state.basicData.bankAccountLicStorage.contentType!=="application/pdf"?true:false)}} />
                        )}

                    </FormItem>
                </div>
                </div>   
                    
                    
                    {/* <FormItem label="开通产品" {...formInfo} >
                        {getFieldDecorator('productIds', {
                        })(
                            <div />
                        )}
                        <div style={{fontSize:"14px"}}>{value}</div>


                    </FormItem> */}
                    
                    <Modal visible={this.state.previewVisible} footer={null} onCancel={this.imgCancel.bind(this)}>
                        <img alt="暂无图片" style={{ width: '100%' }} src={this.state.img_show} />
                    </Modal>

                </Form>
            )

    }
}
export default Form.create()(Basic);