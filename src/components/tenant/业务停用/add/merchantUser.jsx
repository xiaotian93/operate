import React, { Component } from 'react';
import {Row,Button,Col,Form,Modal,Table,Input,Upload,Icon,message} from 'antd';
import {axios_sh} from '../../../ajax/request';
import {merchant_insur_company_list,merchant_detail,manage_upload,merchant_user_add,reset_pwd,merchant_user_status,merchant_image} from '../../../ajax/api';
import {format_table_data,format_time} from '../../../ajax/tool';
import {host_cxfq} from '../../../ajax/config';
import ImgViewer from '../../../templates/ImgViewer';
import img from '../../../style/imgs/PDF.png';

const FormItem = Form.Item;
class Basic extends Component{
    constructor(props) {
        super(props);
        // props.onRef(this);
        this.state = {
            visible:false,
            bank:[],
            dataSource:[],
            bussiness:[],
            data:[],
            id:props.id,
            selectedRowKeys:[],
            id_card_storage_no_fm:[],
            id_card_storage_no_zm:[],
            is_enable:false
        };
        this.count=1;
        this.dataSource=[]
    }
    componentDidMount(){
        this.getShNo();
        this.columns=[
            {
                title:"序号",
                dataIndex:"key"
            },
            {
                title:"新增时间",
                dataIndex:"createTime",
                render:e=>{
                    return format_time(e)
                }
            },
            {
                title:"账户ID",
                dataIndex:"id",
                
            },
            {
                title:"账户名",
                dataIndex:"username"
            },
            {
                title:"姓名",
                dataIndex:"name"
            },
            {
                title:"身份证号",
                dataIndex:"idCard"
            },
            {
                title:"手机号",
                dataIndex:"phone"
            },
            {
                title:"邮箱",
                dataIndex:"email"
            },
            {
                title:"账户状态",
                dataIndex:"enable",
                render:e=>{
                    if(e===0){
                        return "正常"
                    }else if(e===1){
                        return "停用"
                    }else{
                        return "-"
                    }
                }
            },
            {
                title:"操作",
                width:200,
                render:(data)=>{
                    var btn=[];
                    if(data.enable===0){
                        btn.push(<Button type="primary" size="small" key={1} style={{marginRight:"5px"}} onClick={()=>{this.change_enable(data.id,1,false)}}>停用</Button>)
                    }else if(data.enable===1){
                        btn.push(<Button type="danger" size="small" key={2} style={{marginRight:"5px"}} onClick={()=>{this.change_enable(data.id,0,true)}}>启用</Button>)
                    }
                    btn.push(<Button type="danger" size="small" key={3} style={{marginRight:"5px"}} onClick={()=>{this.pwd(data.username,data.id)}}>重置密码</Button>)
                    btn.push(<Button type="primary" size="small" key={4} onClick={()=>{this.img_show(data)}}>身份证</Button>)
                    return btn
                }
            }
        ];
        this.bussiness=[
            {
                title:"保险公司名称",
                dataIndex:"fullName"
            }
        ]
        if(this.state.id){
            setTimeout(()=>{
                this.editData();
            },300)
        }
    }
    getShNo(){
        axios_sh.get(merchant_insur_company_list).then(e=>{
            if(!e.code){
                this.dataSource=format_table_data(e.data)
            }
        })
    }
    editData(){
        // this.getShNo();
        var data=JSON.parse(window.localStorage.getItem("detail"));
        var userInfos=data.userInfos;
        this.setState({dataSource:userInfos})
    }
    //创建公司
    creat(){
        this.setState({
            visible_creat:true
        })
    }
    cancel_creat(){
        this.setState({
            visible_creat:false
        });
        this.props.form.resetFields();
    }
    change_creat(){
        this.props.form.validateFields((err,val)=>{
            console.log(val)
            if(!err){
                if(val.password!==val.password_sure){
                    message.warn("两次输入密码不一致，请确认");
                    return;
                }
                delete val.password_sure;
                val.merchant_id=this.state.id;
                console.log(val)
                axios_sh.post(merchant_user_add,val).then(e=>{
                    this.setState({
                        visible_creat:false,
                        add_success:true,
                        add_email:val.email,
                        add_name:val.username,
                        add_pwd:val.password
                    });
                    this.props.form.resetFields();
                    axios_sh.get(merchant_detail+"?id="+this.state.id).then((e)=>{
                        if(!e.code){
                            this.setState({
                                dataSource:e.data.userInfos
                            })
                            // window.localStorage.setItem("detail",JSON.stringify(e.data));
                        }
                    });
                })
            }
        })

    }
    Upload(e,parm){
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
                this.props.form.setFieldsValue({[parm]:fileList[0].response.data.storageNo})
            }
        }

    }
    idcardFUpload(e){
        this.Upload(e,'id_card_storage_no_fm')
    }
    idcardZUpload(e){
        this.Upload(e,'id_card_storage_no_zm')
    }
    //password
    cancel_pwd(){
        this.setState({
            password_visible:false
        })
    }
    pwd(e,id){
        this.setState({
            password_visible:true,
            user:e,
            user_id:id
        })
    }
    change_pwd(){
        axios_sh.get(reset_pwd+"?userId="+this.state.user_id).then(e=>{
            this.setState({
                pwd_sure:true,
                password_visible:false
            })
        })
    }
    pwd_sure_ok(){
        this.setState({
            pwd_sure:false
        })
    }
    change_enable(id,status,aa){
        if(aa){
            axios_sh.get(merchant_user_status+"?userId="+id+"&targetStatus="+status).then(e=>{
                this.setState({
                    is_enable:false
                })
            axios_sh.get(merchant_detail+"?id="+this.state.id).then((e)=>{
                if(!e.code){
                    this.setState({
                        dataSource:e.data.userInfos
                    })
                    // window.localStorage.setItem("detail",JSON.stringify(e.data));
                }
            });
        })
        }else{
            this.setState({
                is_enable:true,
                change_id:id
            })
        }
        
    }
    img_show(data){
        var img=[],zm={},fm={};
        zm.src=host_cxfq+merchant_image+"?storageNo="+data.idCardStorageNoZm;
        zm.des="身份证正面";
        fm.src=host_cxfq+merchant_image+"?storageNo="+data.idCardStorageNoFm;
        fm.des="身份证反面";
        img.push(zm);
        img.push(fm);
        new ImgViewer(img,{index:0,show:true});

    }
    UpperCase(e){
        e.target.value=e.target.value.toUpperCase();  //字母小写转大写
        this.props.form.setFieldsValue({id_card:e.target.value});
        
    }
    //停用二次确认
    payok(){
        this.change_enable(this.state.change_id,1,true)
    }
    paycancel(){
        this.setState({
            is_enable:false
        })
    }
    add_cancel(){
        this.setState({
            add_success:false
        })
    }
    //pwd验证
    pwd_verify(e){
        var pwd=this.props.form.getFieldValue("password");
        if(pwd&&pwd!==e.target.value&&e.target.value){
            this.setState({
                verify:true
            })
        }else{
            this.setState({
                verify:false
            })
        }
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
    render() {
        //console.log(this.state.selectedRowKeys)
        var heights=document.body.clientHeight-260;
        const modalInfo_creat={
            visible:this.state.visible_creat,
            title:"新增操作员",
            maskClosable:false,
            onCancel:this.cancel_creat.bind(this),
            onOk:this.change_creat.bind(this),
            bodyStyle:{
                height:heights,
                overflowY:"auto",
                overflowX:"hidden"
            },
        };
        const { getFieldDecorator } = this.props.form;
        const formInfo={
            labelCol:{span:7},
            wrapperCol:{span:15},
            colon:false
        };
        const bankUploadf={
            action:host_cxfq+manage_upload,
            listType:'picture-card',
            accept:'image/*,application/pdf',
            fileList:this.state.id_card_storage_no_fm,
            name:'file',
            withCredentials:true,
            onChange:this.idcardFUpload.bind(this),
            onPreview:(e)=>{this.imgShow(e,"身份证反面")}
        };
        const bankUploadz={
            action:host_cxfq+manage_upload,
            listType:'picture-card',
            accept:'image/*,application/pdf',
            fileList:this.state.id_card_storage_no_zm,
            name:'file',
            withCredentials:true,
            onChange:this.idcardZUpload.bind(this),
            onPreview:(e)=>{this.imgShow(e,"身份证正面")}
        };
        const change_password={
            title:"密码重置",
            visible:this.state.password_visible,
            onCancel:this.cancel_pwd.bind(this),
            onOk:this.change_pwd.bind(this)

        }
        const enable={
            visible:this.state.is_enable,
            title:null,
            maskClosable:false,
            onCancel:this.paycancel.bind(this),
            onOk:this.payok.bind(this)
        }
        const add_sure={
            visible:this.state.add_success,
            title:"新增操作员",
            maskClosable:false,
            // onCancel:null,
            // onOk:this.add_cancel.bind(this),
            footer:<Button type="primary" size="small" onClick={this.add_cancel.bind(this)}>确定</Button>
        }
        return (
            <Row className="sh_add" >
            <div className="sh_add_card insur_company">
                <Row>
                    <Col span={20}>
                        <Button type="primary" onClick={this.creat.bind(this)} >新增操作员</Button>
                    </Col>
                </Row>
                <Row style={{marginTop:"20px"}}>
                    <Col span={24}>
                        <Table columns={this.columns} dataSource={format_table_data(this.state.dataSource)} bordered pagination={false} rowKey="id" />
                    </Col>
                </Row>
            </div>
            <Modal {...change_password}>
                是否重置操作员{this.state.user}的登陆密码?
            </Modal>
            <Modal visible={this.state.pwd_sure} onCancel={this.pwd_sure_ok.bind(this)} footer={null}>
                密码已重置为123456
            </Modal>
            <Modal {...enable}>确定要停用该操作员吗？</Modal>
                
                <Modal {...modalInfo_creat} >
                    <Form className="sh_add border">
                    <FormItem label="操作员账户名" {...formInfo} >
                        {getFieldDecorator('username', {
                            rules:[{required:true,message:"请输入操作员账户名"},{pattern:/^[0-9a-zA-Z（）()]{1,50}$/,message:"格式错误"}]
                        })(
                            <Input placeholder="支持字母、数字，用于登录商户端" />
                        )}

                    </FormItem>
                    <FormItem label="操作员姓名" {...formInfo} >
                        {getFieldDecorator('name', {
                            initialValue:"",
                            rules:[{required:true,message:"请输入操作员姓名"},{pattern:/^[a-zA-Z\u4e00-\u9fa5（）()]{1,50}$/,message:"格式错误"}]
                        })(
                            <Input placeholder="支持汉字" />
                        )}

                    </FormItem>
                    <FormItem label="操作员手机号" {...formInfo} >
                        {getFieldDecorator('phone', {
                            initialValue:"",
                            rules:[{required:true,message:"请输入操作员手机号"},{pattern:/^[1][3,4,5,6,7,8][0-9]{9}$/,message:"格式错误"}]
                        })(
                            <Input placeholder="请输入操作员手机号" />
                        )}

                    </FormItem>
                    <FormItem label="操作员身份证号" {...formInfo} >
                        {getFieldDecorator('id_card', {
                            initialValue:"",
                            rules:[{required:true,message:"请输入操作员身份证号"},{pattern:/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,message:"格式错误"}]
                        })(
                            <Input placeholder="支持数字、字母" onBlur={this.UpperCase.bind(this)} />
                        )}

                    </FormItem>
                    <FormItem label="操作员邮箱" {...formInfo} >
                        {getFieldDecorator('email', {
                            initialValue:"",
                            rules:[{required:true,message:"请输入操作员邮箱"},{pattern:/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,message:"格式错误"}]
                        })(
                            <Input placeholder="请输入邮箱" />
                        )}

                    </FormItem>
                    
                    <FormItem label="登录密码" {...formInfo} >
                        {getFieldDecorator('password', {
                            initialValue:"",
                            rules:[{required:true,message:"请输入登录密码"},{pattern:/^[0-9a-zA-Z]{6,50}$/,message:"格式错误"}]
                        })(
                            <Input placeholder="支持字母、数字，至少6位" />
                        )}

                    </FormItem>
                    <FormItem label="确认登录密码" {...formInfo} extra={this.state.verify?"两次输入密码不一致":""} >
                        {getFieldDecorator('password_sure', {
                            initialValue:"",
                            rules:[{required:true,message:"请再次输入登录密码"},{pattern:/^[0-9a-zA-Z]{6,50}$/,message:"格式错误"}],
                            
                        })(
                            <Input placeholder="请再次输入登录密码" onBlur={this.pwd_verify.bind(this)} />
                        )}

                    </FormItem>
                    <Row>
                        <Col span={12}>
                            <FormItem label="操作员身份证影像" labelCol={{span:14}} wrapperCol={{span:10}} colon={false} >
                        {getFieldDecorator('id_card_storage_no_zm', {
                            initialValue:"",
                            rules:[{required:true,message:"请上传身份证正面"}]
                        })(
                            <div />
                        )}
                        <Upload {...bankUploadz}>
                        {
                            this.state.id_card_storage_no_zm.length>0?null:<div><Icon type="plus" /><div className="ant-upload-text">身份证正面</div></div>
                        }
                                
                        </Upload>
                    </FormItem>
                        </Col>
                        <Col span={12}>
                        <FormItem label="" wrapperCol={{span:10}} colon={false} >
                        {getFieldDecorator('id_card_storage_no_fm', {
                            initialValue:"",
                            rules:[{required:true,message:"请上传身份证反面"}]
                        })(
                            <div />
                        )}
                        <Upload {...bankUploadf}>
                        {
                            this.state.id_card_storage_no_fm.length>0?null:<div><Icon type="plus" /><div className="ant-upload-text">身份证反面</div></div>
                        }
                                
                        </Upload>
                    </FormItem>
                        </Col>
                    </Row>
                    
                    <Row>
                        <Col className="toast" push={7} span={18}>支持jpg,jpeg,png,pdf格式的图片，大小不超过10M</Col>
                    </Row>
                    </Form>
                </Modal>
                <Modal {...add_sure}>
                    <div style={{marginBottom:"10px"}}>操作员账户已创建成功</div>
                    <div style={{marginBottom:"10px"}}>系统已向{this.state.add_email}邮箱发送账户信息，请通知其查收</div>
                    <div style={{marginBottom:"10px"}}>账户名：{this.state.add_name}</div>
                    <div>登录密码：{this.state.add_pwd}</div>
                </Modal>
                <style>{`
                    .ant-form-extra{
                        color:red
                    }
                    `
                }
                    
                    </style>
            </Row>

        )

    }
}
export default Form.create()(Basic);