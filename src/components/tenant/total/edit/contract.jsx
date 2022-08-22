import React, { Component } from 'react';
import {Table,Button,Modal,Form,Radio,DatePicker,Input,Upload,Icon,message} from 'antd';
import { axios_merchant } from '../../../../ajax/request';
import {merchant_contract_list,merchant_img_upload,merchant_contract_create,manage_get,merchant_contract_update} from '../../../../ajax/api';
import {host_sh} from '../../../../ajax/config';
import img from '../../../../style/imgs/PDF.png';
import {format_date,format_table_data,format_time} from '../../../../ajax/tool';
import Permissions from '../../../../templates/Permissions';
import moment from 'moment';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const newTime=new Date().getTime();
class Basic extends Component{
    constructor(props) {
        super(props);
        // props.onRef(this);
        this.state = {
            visible:false,
            storageNo:[],
            isEdit:false,
        };
    }
    componentWillMount(){
        this.get_list();
        this.columns=[
            {
                title:"序号",
                dataIndex:"key"
            },
            {
                title:"合同名称",
                dataIndex:"name"
            },
            {
                title:"签约方",
                dataIndex:"bmdSinger",
                render:e=>{
                    var data={baimaodai:"智度小贷",zhiyou:"喀什智尤",other:"外部主体"};
                    return data[e];
                }
            },
            {
                title:"合同类型",
                dataIndex:"type",
                render:e=>{
                    var data={execute:"执行",framework:"框架",no_cash:"无金额"};
                    return data[e];
                }
            },
            {
                title:"业务类型",
                dataIndex:"businessLineId",
                render:e=>{
                    var data={1:"信用贷",2:"车险分期"};
                    return data[e];
                }
            },
            {
                title:"到期时间",
                dataIndex:"expireTime",
                render:e=>{
                    
                    return e?format_date(e):"--"
                }
            },
            {
                title:"备注",
                dataIndex:"remark",
                render:e=>{
                    return e||"--"
                }
            },
            {
                title:"操作人",
                dataIndex:"creatorName"
            },
            {
                title:"修改时间",
                dataIndex:"updateTime",
                render:e=>{
                    return e?format_time(e):"--"
                }
            },
            {
                title:"操作",
                render:e=>{
                    return <div>
                        {this.props.edit==="true"?<Button size="small" type="primary" onClick={()=>{this.edit(e)}} style={{marginRight:"10px"}}>编辑</Button>:null}
                        {e.storageNo?<span>
                            <Permissions size="small" onClick={()=>{this.imgShow(e,true)}} server={global.AUTHSERVER.merchant.key} tag="button" permissions={global.AUTHSERVER.merchant.access.merchant_contract_export}>下载</Permissions>&nbsp;&nbsp;
                            <Permissions size="small" onClick={()=>{this.imgShow(e)}} server={global.AUTHSERVER.merchant.key} tag="button" permissions={global.AUTHSERVER.merchant.access.merchant_contract_detail}>查看</Permissions>
                        </span>:null}
                        
                    </div>
                }
            },
        ]
    }
    get_list(){
        var param={
            // merchantId:JSON.parse(window.localStorage.getItem("total_sh")).id,
            merchantId:this.props.id,
            page:1,
            size:100
        }
        axios_merchant.post(merchant_contract_list,param).then(e=>{
            this.setState({
                data:format_table_data(e.data.list)
            })
        })
    }
    edit(e){
        this.setState({
            visible:true,
            isEdit:true,
            updateId:e.id
        })
        for(var i in e){
            if(i!=="creatorId"&&i!=="creatorName"&&i!=="merchantId"&&i!=="updateTime"&&i!=="id"&&i!=="key"){
                if(i==="storageNo"){
                    if(e[i]){
                        var file={};
                        file.uid=i;
                        file.name=i;
                        file.storageNo=e[i];
                        file.url=img;
                        this.setState({
                            storageNo:[file]
                        })
                        this.props.form.setFieldsValue({[i]:e[i]})
                    }
                }else if(i==="expireTime"){
                    if(e[i]){
                        this.props.form.setFieldsValue({[i]:moment(format_date(e[i]))})
                    }
                }else{
                    this.props.form.setFieldsValue({[i]:e[i].toString()})
                }
            }
        }
    }
    idcardZUpload(e){
        this.Upload(e,'storageNo','storageNo')
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
                    openUrl:host_sh+manage_get+"?storageNo="+fileList[0].response.data.storageNo+"&type=ORIGIN",
                }]
                })
                }
                
                
            }else{
                this.setState({
                    [parm]:fileList
                });
            }
            if(fileList[0].size>30000000){
                message.warn('上传文件大小不超过30M');
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
    //add
    add(){
        this.setState({
            visible:true,
            isEdit:false
        })
    }
    submit(){
        var url=this.state.isEdit?merchant_contract_update:merchant_contract_create;
        this.props.form.validateFields((err,val)=>{
            if(!err){
                if(val.expireTime){
                    val.expireTime=val.expireTime.format("YYYY-MM-DD")
                }else{
                    val.expireTime=""
                }
                val.merchantId=this.props.id;console.log(typeof val.expireTime);
                if(this.state.isEdit){
                    val.id=this.state.updateId;
                }
                axios_merchant.post(url,val).then(e=>{
                    if(!e.code){
                        message.success(this.state.isEdit?"修改成功":"创建成功");
                        this.get_list();
                        this.cancel();
                    }
                })

            }
        })
    }
    cancel(){
        this.setState({
            visible:false
        })
        this.props.form.resetFields();
        this.setState({
            storageNo:[]
        })
    }
    change_date(date,dateStr){
        console.log(date,dateStr)
        this.props.form.setFieldsValue({"expireTime":111})
    }
    imgShow(e,download=false){
        window.open(host_sh+manage_get+"?storageNo="+e.storageNo+"&type=ORIGIN&forceDownload="+download+"&fileName="+e.name)
        // axios_pdf.get(manage_get+"?type=ORIGIN&storageNo="+e.storageNo)
    }
    //row classname
    rowClass(rec,index){
        console.log(rec,index)
        if(JSON.stringify(rec)!=="{}"&&rec.expireTime){
            if(rec.expireTime-newTime<0){
                return "bg-red"
            }else{
                if((rec.expireTime-newTime)/86400000<30){
                    return "bg-yellow"
                }else{
                    return ""
                }
            }
        }
        
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const formInfo={
            labelCol:{span:6},
            wrapperCol:{span:16},
            colon:false
        };
        const idcardzUpload={
            action:host_sh+merchant_img_upload,
            listType:'picture-card',
            accept:'application/pdf',
            fileList:this.state.storageNo,
            name:'file',
            withCredentials:true,
            data:{
                "usage":"contract"
            },
            onChange:this.idcardZUpload.bind(this),
            onPreview:(e)=>{this.imgShow(e)}
        };
        const upload_info={
            title:"编辑合同",
            closable:false,
            visible:this.state.visible,
            footer:<div style={{textAlign:"center"}}>
                <Button onClick={this.cancel.bind(this)}>取消</Button>
                <Button type="primary" onClick={this.submit.bind(this)}>提交</Button>
            </div>
        }
        return (
            <div className="sh_add">
            <div className="sh_add_card">
                <div style={{marginBottom:"20px",overflow:"hidden"}}>
                {this.props.edit==="true"?<Permissions type="primary" style={{float:"left"}} onClick={this.add.bind(this)} server={global.AUTHSERVER.merchant.key} tag="button" permissions={global.AUTHSERVER.merchant.access.merchant_contract_add}>添加</Permissions>:null}
                <div style={{float:"left",margin:"5px 0 5px 8px"}}>
                    <div style={{width:"12px",height:"12px",background:"#FFFBE6",border:"1px solid #DCDEE2",float:"left",marginTop:"3px"}} /><div style={{fontSize:"12px",color:"#000",float:"left",margin:"0 16px 0 4px"}}>表示距离合同到期时间小于30天</div>
                    <div style={{width:"12px",height:"12px",background:"#FDECEA",border:"1px solid #DCDEE2",float:"left",marginTop:"3px"}} /><div style={{fontSize:"12px",color:"#000",float:"left",margin:"0 16px 0 4px"}}>表示合同已过期</div>
                </div>
                </div>
                <Table columns={this.columns} dataSource={this.state.data} bordered pagination={false} rowClassName={this.rowClass.bind(this)} />
            </div>
            <Modal {...upload_info}>
                <Form>
                    <FormItem label="合同名称" {...formInfo} >
                        {getFieldDecorator('name', {
                            rules:[{required:true,message:"请输入合同名称"}]
                        })(
                            <Input placeholder="请输入合同名称" />
                        )
                        }
                        <span style={{fontSize:"12px",color:"rgba(0,0,0,0.5)"}}>格式如：小贷&呆小二-短期小额贷-合作协议</span>
                    </FormItem>
                    <FormItem label="签约方" {...formInfo} >
                        {getFieldDecorator('bmdSinger', {
                            rules:[{required:true,message:"请选择签约方"}]
                        })(
                            <RadioGroup>
                                <Radio value="baimaodai">智度小贷</Radio>
                                <Radio value="zhiyou">喀什智优</Radio>
                                <Radio value="other">外部主体</Radio>
                            </RadioGroup>
                        )
                        
                        }
                    </FormItem>
                    <FormItem label="合同类型" {...formInfo} >
                        {getFieldDecorator('type', {
                            rules:[{required:true,message:"请选择合同类型"}]
                        })(
                            <RadioGroup>
                                <Radio value="execute">执行</Radio>
                                <Radio value="framework">框架</Radio>
                                <Radio value="no_cash">无金额</Radio>
                            </RadioGroup>
                        )
                        
                        }
                    </FormItem>
                    <FormItem label="业务类型" {...formInfo} >
                        {getFieldDecorator('businessLineId', {
                            rules:[{required:true,message:"请选择业务类型"}]
                        })(
                            <RadioGroup>
                                <Radio value="1">信用贷</Radio>
                                <Radio value="2">车险分期</Radio>
                            </RadioGroup>
                        )
                        
                        }
                    </FormItem>
                    <FormItem label="到期时间" {...formInfo} >
                        {getFieldDecorator('expireTime', {
                            // initialValue:"",
                        })(
                            <DatePicker onChange={this.change_date.bind(this)} />
                        )
                        
                        }
                    </FormItem>
                    <FormItem label="备注信息" {...formInfo} >
                        {getFieldDecorator('remark', {
                            initialValue:"",
                        })(
                            <Input placeholder="请输入备注信息" />
                        )
                        
                        }
                    </FormItem>
                    <FormItem label="上传合同" {...formInfo} extra="支持pdf格式，大小不超过30M" className="upload" >
                        {getFieldDecorator('storageNo', {
                            initialValue:"",
                        })(
                            <div />
                        )
                        
                        }
                        <Upload {...idcardzUpload}>
                            {
                                this.state.storageNo.length>0?null:<div className="test"><Icon type="plus" /><div className="ant-upload-text">上传</div></div>
                            }
                        </Upload>
                    </FormItem>
                    
                </Form>
            </Modal>
            <style>
                {`
                .upload .ant-upload-list-picture-card{
                    display:inline-block!important;
                }
                .bg-red{
                    background:#FDECEA
                }
                .bg-yellow{
                    background:#FFFBE6
                }
                `}
            </style>
            </div>
            
        )
    }
}
export default Form.create()(Basic)