import React, { Component } from 'react';
import {Row,Col,Form,Select,Input,Upload,Icon,message,Modal} from 'antd';
import {manage_upload,qudao_list,bank_list,merchant_image} from '../../../ajax/api';
// import Repay from './repayBank';
import {host_cxfq} from '../../../ajax/config';
import {axios_sh} from '../../../ajax/request';
import img from '../../../style/imgs/PDF.png';
import ImgViewer from '../../../templates/ImgViewer';

const FormItem = Form.Item;
const Option = Select.Option;
class Basic extends Component{
    constructor(props) {
        super(props);
        props.onRef(this);
        this.state = {
            shId:'',
            product:[],
            licenseStorage:[],
            bankAccountLicStorage:[],
            qudao:[],
            bank:[],
            id:props.id,
            productIds:[],
            adminIdCardZmStorage:[],
            adminIdCardFmStorage:[],
            sh_name:"",
            bank_type:true
        };
        this.product=[]
    }
    componentWillMount(){
        this.getShNo();
        this.productList();
        // var data=JSON.parse(window.localStorage.getItem('productList'));
        // for(var i in data){
        //     this.product.push(<Option key={i} value={data[i].id.toString()} aa={data[i]}>{data[i].name}</Option>)
        // }
        if(this.state.id){
            setTimeout(()=>{
                if(window.localStorage.getItem("detail")){
                    this.editData()
                }
            },100)

        }
    }
    getShNo(){
        var shNo=new Date().getTime().toString().substring(5);
        this.setState({
            shId:shNo
        })
    }
    // handleChange(value) {
    //     console.log(value);
    //     var data=JSON.parse(window.localStorage.getItem('productList'));
    //     var productList=[];
    //     for(var i in value){
    //         for(var j in data){
    //             //alert(i)
    //             if(Number(value[i])===data[j].id){
    //                 productList.push(data[j]);
    //             }
    //         }
    //     }
    //     this.props.productList(productList);
    //     this.props.form.setFieldsValue({productIds:value})
    // }
    productList(){
        axios_sh.get(qudao_list).then(e=>{
            if(!e.code){
                this.setState({
                    qudao:e.data
                })
            }
        })
        axios_sh.get(bank_list).then(e=>{
            if(!e.code){
                this.setState({
                    bank:e.data
                })
            }
        })
    }
    Upload(e,parm,name){
        console.log(e)
        var fileList=e.fileList;
        this.setState({
            [parm]:fileList
        });
        
        if(fileList.length>0){
            if(e.fileList[0].type==="application/pdf"){
                if(fileList[0].response&&!fileList[0].response.code){
                    this.setState({
                    [parm]:[{
                    uid:"1",
                    name:"111.pdf",
                    status:"done",
                    url:img,
                    type:"application/pdf",
                    openUrl:host_cxfq+merchant_image+"?storageNo="+fileList[0].response.data.storageNo,
                }]
                })
                }
                
                
            }else{
                this.setState({
                    [parm]:fileList
                });
            }
            if(fileList[0].size>10000000){
                message.warn('上传图片大小不超过10M');
                return;
            }
            if(fileList[0].response&&!fileList[0].response.code){
                //console.log(parm)
                this.props.form.setFieldsValue({[name]:fileList[0].response.data.storageNo})
            }
        }else{
            this.props.form.setFieldsValue({[name]:""})
        }

    }
    // beforeUpload(e){
    //     if(e.type==="application/pdf"){
    //         this.setState({
    //             bank_type:false
    //         })
    //     }
    //     return true
    // }
    licenseUpload(e){
        this.Upload(e,'licenseStorage','license')

    }
    bankUpload(e){
        this.Upload(e,'bankAccountLicStorage','bankAccountLic')
    }
    idcardZUpload(e){
        this.Upload(e,'adminIdCardZmStorage','adminIdCardStorageNoZm')
    }
    idcardFUpload(e){
        this.Upload(e,'adminIdCardFmStorage','adminIdCardStorageNoFm')
    }
    editData(){
        var data=JSON.parse(window.localStorage.getItem("detail"));
        var basic=data.basic;
        for(var i in basic){
            if(i==="type"){
                this.props.form.setFieldsValue({[i]:basic[i].toString()})
            }else if(i==="licenseStorage"||i==="bankAccountLicStorage"||i==="adminIdCardZmStorage"||i==="adminIdCardFmStorage"){
                if(basic[i]){
                var fileList=[],file={};
                file.uid=i;
                file.name=i;
                
                    if(basic[i].contentType==="application/pdf"){
                    file.url=img;
                    file.openUrl=host_cxfq+merchant_image+"?storageNo="+basic[i].storageNo;
                }else{
                    file.url=host_cxfq+merchant_image+"?storageNo="+basic[i].storageNo;
                }
                file.storageNo=basic[i];
                file.type=basic[i].contentType;
                fileList.push(file);
                this.setState({[i]:fileList});
                this.props.form.setFieldsValue({[i]:basic[i]})
            }
            }else if(i==="customerBusinessIds"){

            }else if(i==="productIds"){
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
                // this.props.form.setFieldsValue({[i]:basic[i]})
            }else if(i!=="id"){
                this.props.form.setFieldsValue({[i]:basic[i]});
                this.setState({shId:basic.shNo,sh_name:basic.settleAccountName});
            }
        }
    }
    shName(e){
        this.setState({
            sh_name:e.target.value
        })
        this.props.form.setFieldsValue({settleAccountName:e.target.value});
    }
    imgShow(e,des){
        if(e.type!=="application/pdf"){
            var img=[];
            if(e.url){
                var imgs={
                    src:e.url,
                    des:des,
                    key:e.url
                }
                img.push(imgs)
            }else{
                if(e.response&&!e.response.code){
                    var img1={src:host_cxfq+merchant_image+"?storageNo="+e.response.data.storageNo,des:des,key:e.response.data.storageNo};
                    img.push(img1)
                }
            }
            new ImgViewer(img,{index:0,show:true});
        }else{
            if(e.openUrl){
                window.open(e.openUrl)
                
            }else{
                if(e.response&&!e.response.code){
                    window.open(host_cxfq+merchant_image+"?storageNo="+e.response.data.storageNo)
                }
            }
        }
        
    }
    imgCancel(){
        this.setState({
            previewVisible:false
        })
    }
    UpperCase(e){
        e.target.value=e.target.value.toUpperCase();  //字母小写转大写
        this.props.form.setFieldsValue({adminIdCard:e.target.value});
        
    }
    render() {
        // var value=window.localStorage.getItem("detail")?JSON.parse(window.localStorage.getItem("detail")).basic.productIds:[];
        const { getFieldDecorator } = this.props.form;
        const formInfo={
            labelCol:{span:4},
            wrapperCol:{span:6},
            colon:false
        };
        const imageUpload={
            action:host_cxfq+manage_upload,
            listType:'picture-card',
            accept:'image/*,application/pdf',
            fileList:this.state.licenseStorage,
            name:'file',
            withCredentials:true,
            onChange:this.licenseUpload.bind(this),
            onPreview:(e)=>{this.imgShow(e,"营业执照")}
        };
        const bankUpload={
            action:host_cxfq+manage_upload,
            listType:'picture-card',
            // listType:this.state.bankAccountLic[0].type&&this.state.bankAccountLic[0].type==="application/pdf"?"text":'picture-card',
            accept:'image/*,application/pdf',
            fileList:this.state.bankAccountLicStorage,
            name:'file',
            withCredentials:true,
            onChange:this.bankUpload.bind(this),
            onPreview:(e)=>{this.imgShow(e,"银行开户许可证")},
            // beforeUpload:this.beforeUpload.bind(this)
        };
        const idcardzUpload={
            action:host_cxfq+manage_upload,
            listType:'picture-card',
            accept:'image/*,application/pdf',
            fileList:this.state.adminIdCardZmStorage,
            name:'file',
            withCredentials:true,
            onChange:this.idcardZUpload.bind(this),
            onPreview:(e)=>{this.imgShow(e,"身份证正面")}
        };
        const idcardfUpload={
            action:host_cxfq+manage_upload,
            listType:'picture-card',
            accept:'image/*,application/pdf',
            fileList:this.state.adminIdCardFmStorage,
            name:'file',
            withCredentials:true,
            onChange:this.idcardFUpload.bind(this),
            onPreview:(e)=>{this.imgShow(e,"身份证反面")}
        };
        return (
                <Form className="sh_add">
                <div className="sh_add_card">
                <div className="sh_inner_box">
                <div className="sh_add_title">商户信息</div>
                <FormItem label="商户ID" {...formInfo} className="" >
                        {getFieldDecorator('shNo', {
                            initialValue:this.state.id?this.state.shId:"SH"+this.state.shId,
                            rules:[{required:true,message:""}]
                        })(
                            <div style={{fontSize:"14px"}}>{this.state.id?this.state.shId:"SH"+this.state.shId}</div>
                        )}

                    </FormItem>
                    <FormItem label="归属渠道" {...formInfo} >
                        {getFieldDecorator('qudao', {
                            rules:[{required:true,message:"请选择归属渠道"}]
                        })(
                            <Select placeholder="请选择归属渠道">
                                {
                                    this.state.qudao.map((i,k)=>{
                                        return <Option value={i.name} key={k} >{i.name}</Option>
                                    })
                                }
                            </Select>
                        )}

                    </FormItem>
                    <FormItem label="商户类型" {...formInfo} >
                        {getFieldDecorator('type', {
                            rules:[{required:true,message:"请选择商户类型"}]
                        })(
                            <Select placeholder="请选择商户类型">
                                <Option value="1" >4s门店</Option>
                                <Option value="2" >货运公司</Option>
                                <Option value="3" >保险代理</Option>
                                <Option value="4" >大型企业</Option>
                                <Option value="5" >平台方</Option>
                                <Option value="6" >物流公司</Option>
                                <Option value="7" >租赁</Option>
                                <Option value="8" >网约车</Option>
                            </Select>
                        )}

                    </FormItem>
                    <FormItem label="商户全称" {...formInfo} >
                        {getFieldDecorator('name', {
                            initialValue:"",
                            rules:[{required:true,message:"请输入商户名称"},{pattern:/^[a-zA-Z\u4e00-\u9fa5（）()]{1,50}$/,message:"格式错误"}]
                        })(
                            <Input placeholder="请输入商户名称" onBlur={this.shName.bind(this)} />
                        )}

                    </FormItem>
                    <Row>
                        <Col span={12} push={4} className="toast">必须与营业执照名称一致</Col>
                    </Row>

                    <FormItem label="商户简称" {...formInfo} >
                        {getFieldDecorator('shortName', {
                            initialValue:"",
                            rules:[{required:true,message:"请输入商户简称"},{pattern:/^[a-zA-Z\u4e00-\u9fa5（）()]{1,50}$/,message:"格式错误"}]
                        })(
                            <Input placeholder="请输入商户简称" />
                        )}

                    </FormItem>
                    <FormItem label="商户地址" {...formInfo} >
                        {getFieldDecorator('address', {
                            initialValue:"",
                            rules:[{required:true,message:"请输入商户地址"}]
                        })(
                            <Input placeholder="请输入商户地址" />
                        )}

                    </FormItem>
                    <FormItem label="统一社会信用代码" {...formInfo} >
                            {getFieldDecorator('creditCode', {
                            initialValue:"",
                            rules:[{required:true,message:"请输入统一社会信用代码"},{pattern:/^[A-Z0-9]{18}$/,message:"请输入18位数字或大写字母"}]
                        })(
                            <Input placeholder="请输入统一社会信用代码" />
                        )}

                    </FormItem>
                </div>
                </div>
                <div className="sh_add_card">
                <div className="sh_inner_box">
                <div className="sh_add_title">联系人信息</div>
                    <FormItem label="联系人姓名" {...formInfo} >
                        {getFieldDecorator('adminName', {
                            initialValue:"",
                            rules:[{required:true,message:"请输入联系人姓名"},{pattern:/^[\u4e00-\u9fa5]{1,20}$/,message:"格式错误"}]
                        })(
                            <Input placeholder="请输入联系人姓名" />
                        )}

                    </FormItem>
                    <FormItem label="联系人手机号" {...formInfo} >
                        {getFieldDecorator('adminPhone', {
                            initialValue:"",
                            rules: [{ required: true, message: '请输入联系人手机号' },{pattern:/^[1][3,4,5,6,7,8][0-9]{9}$/,message:"手机号格式错误"}]
                        })(
                            <Input placeholder="请输入联系人手机号" />
                        )}

                    </FormItem>
                    <FormItem label="联系人邮箱" {...formInfo} >
                        {getFieldDecorator('adminEmail', {
                            initialValue:"",
                            rules: [{ required: true, message: '请输入联系人邮箱' },{pattern:/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,message:"邮箱格式错误"}]
                        })(
                            <Input placeholder="请输入联系人邮箱" />
                        )}

                    </FormItem>
                    <FormItem label="联系人身份证号" {...formInfo} >
                        {getFieldDecorator('adminIdCard', {
                            initialValue:"",
                            rules: [{ required: true, message: '请输入联系人身份证号' },{pattern:/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,message:"身份证号格式错误"}]
                        })(
                            <Input placeholder="请输入联系人身份证号" onBlur={this.UpperCase.bind(this)} />
                        )}

                    </FormItem>
                </div>
                </div>
                <div className="sh_add_card">
                <div className="sh_inner_box">
                <div className="sh_add_title">结算账户信息</div>
                    <FormItem label="结算账户名" {...formInfo} className="paddingRight" >
                        {getFieldDecorator('settleAccountName', {
                            initialValue:this.state.sh_name,
                            //rules:[{required:true,message:"请输入结算账户名"},{pattern:/^[a-zA-Z\u4e00-\u9fa5]{1,50}$/,message:"格式错误"}]
                        })(
                            <Input placeholder="自动读取商户名称" disabled />
                        )}

                    </FormItem>
                    <FormItem label="结算账号" {...formInfo} >
                        {getFieldDecorator('settleBankCard', {
                            initialValue:"",
                            rules:[{required:true,message:"请输入结算账号"},{pattern:/^[0-9]{1,25}$/,message:"格式错误"}]
                        })(
                            <Input placeholder="请输入结算账号" />
                        )}

                    </FormItem>
                    <Row>
                        <Col span={12}>
                            <FormItem label="开户行名称" labelCol={{span:8}} wrapperCol={{span:12}} colon={false} >
                                {getFieldDecorator('bankName', {
                                    rules:[{required:true,message:"请选择银行"}]
                                })(
                                    <Select placeholder="请选择银行" >
                                        {
                                            this.state.bank.map((i,k)=>{
                                                return <Option key={k} value={i.name} >{i.name}</Option>
                                            })
                                        }
                                    </Select>
                                )}

                            </FormItem>
                        </Col>
                        <Col span={11} pull={2} style={{marginLeft:'5px'}} >
                            <FormItem label="" wrapperCol={{span:13}} colon={false} >
                                {getFieldDecorator('subBankName', {
                                    rules:[{pattern:/^[\u4e00-\u9fa5]{1,25}$/,message:"格式错误"},{required:true,message:"请输入开户支行名称"}]
                                })(
                                    <Input placeholder="请输入开户支行名称 " />
                                )}

                            </FormItem>
                        </Col>
                    </Row>
                </div>
                </div>
                {/* <Repay name={this.state.sh_name} id={this.state.id}></Repay> */}
                    
                    {/* <FormItem label="开通产品" {...formInfo} >
                        {getFieldDecorator('productIds', {
                            rules:[{required:true,message:"请选择要开通的产品名称"}]
                        })(
                            <div />
                        )}
                        <Select mode="multiple" onChange={this.handleChange.bind(this)} placeholder="请选择要开通的产品名称" className="selectMore" defaultValue={value} >
                            {this.product}
                        </Select>

                    </FormItem> */}
                <div className="sh_add_card">
                <div className="sh_inner_box">
                <div className="sh_add_title">影像资料</div>
                    <FormItem label="营业执照影像(加盖公章)" {...formInfo} className="texthh">
                        {getFieldDecorator('license', {
                            initialValue:"",
                            rules:[{required:true,message:"请上传营业执照影像"}]
                        })(
                            <div />
                        )}
                        <Upload {...imageUpload}>
                            {
                                this.state.licenseStorage.length>0?null:<div><Icon type="plus" /><div className="ant-upload-text">上传</div></div>
                            }
                        </Upload>
                    </FormItem>

                    <Row>
                        <Col className="toast" push={4} span={12}>请上传清晰的营业执照影像。支持jpg、jepg、png、pdf格式，大小不超过10M</Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem label="联系人身份证影像" className="" labelCol={{span:8}} wrapperCol={{span:8}} colon={false}>
                        {getFieldDecorator('adminIdCardStorageNoZm', {
                            initialValue:"",
                            rules:[{required:true,message:"请上传身份证正面"}]
                        })(
                            <div />
                        )}
                        <Upload {...idcardzUpload}>
                            {
                                this.state.adminIdCardZmStorage.length>0?null:<div><Icon type="plus" /><div className="ant-upload-text">身份证正面</div></div>
                            }
                        </Upload>
                    </FormItem>
                        </Col>
                        <Col span={11} pull={5}>
                            <FormItem label="" wrapperCol={{span:12}} colon={false} className="texthh">
                        {getFieldDecorator('adminIdCardStorageNoFm', {
                            initialValue:"",
                            rules:[{required:true,message:"请上传身份证反面"}]
                        })(
                            <div />
                        )}
                        <Upload {...idcardfUpload}>
                            {
                                this.state.adminIdCardFmStorage.length>0?null:<div><Icon type="plus" /><div className="ant-upload-text">身份证反面</div></div>
                            }
                        </Upload>
                    </FormItem>
                        </Col>
                        
                    </Row>
                    <Row>
                        <Col className="toast" push={4} span={12}>请上传清晰的联系人身份证影像。支持jpg、jepg、png、pdf格式，大小不超过10M</Col>
                    </Row>
                    
                    <FormItem label="银行开户许可证(选填)" {...formInfo} >
                        {getFieldDecorator('bankAccountLic', {
                            initialValue:"",
                            // rules:[{required:true,message:"请上传银行开户许可证"}]
                        })(
                            <div />
                        )}
                        <Upload {...bankUpload}>
                            {
                                this.state.bankAccountLicStorage.length>0?null:<div><Icon type="plus" /><div className="ant-upload-text">上传</div></div>
                            }
                        </Upload>
                    </FormItem>
                    <Row>
                        <Col className="toast" push={4} span={12}>请上传清晰的银行开户许可证影像。支持jpg、jepg、png、pdf格式，大小不超过10M</Col>
                    </Row>
                </div>
                </div>
                    
                    <Modal visible={this.state.previewVisible} footer={null} onCancel={this.imgCancel.bind(this)}>
                        <img alt="暂无图片" style={{ width: '100%' }} src={this.state.img_show} />
                    </Modal>
                </Form>
            )

    }
}
export default Form.create()(Basic);