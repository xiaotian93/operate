import React, { Component } from 'react';
import { Row, Button, message,Form ,DatePicker,Select,Input,Col,Table,Modal,Icon,Popconfirm} from 'antd';
import moment from 'moment';
import { axios_postloan } from '../../../ajax/request';
import { afterloan_overdue_insert_collection ,afterloan_borrower_detail,afterloan_call_hangUp,afterloan_borrower_delete,afterloan_call_send,afterloan_call_detail} from '../../../ajax/api';
import Btn from "../../templates/listBtn";
import {page_go} from "../../../ajax/tool";
import ContactModal from "./contactModal";
import Permissions from '../../../templates/Permissions';
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
class Overdue extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contact_visible:false,
            relation:"",
            contactList:[]
        };
        this.getCallDetail=""
    }
    componentWillMount(){
        // window.localStorage.setItem("dhCallList",JSON.stringify(this.props.locations.query))
        var permissions=JSON.parse(window.localStorage.getItem("permissions"))||[];
        permissions.forEach(item=>{
            if(item.applicationKey==="bmd-postloan"){
                var permissionList=item.permissionList;
                permissionList.forEach(ele=>{
                    if(ele.key==="contacts_list"&&ele.hasPermission){
                        this.get_contactList();
                    }
                })
            }
        })
        this.columns=[
            {
                title:"序号",
                render:(text,record,index)=>{
                    return index+1
                }
            },
            {
                title:"关系",
                dataIndex:"plRelation",
                render:e=>{
                    var type={SELF:"本人",SPOUSE:"配偶",SON:"子",DAUGHTER:"女",PARENT:"父母",BROTHER_OR_SISTER:"兄弟姐妹",FRIEND:"朋友",COLLEAGUE:"同事",OTHER:"其他"}
                    return type[e]||"--"
                }
            },
            {
                title:"姓名",
                dataIndex:"name"
            },
            {
                title:"手机号",
                dataIndex:"phone"
            },
            {
                title:"数据更新时间",
                dataIndex:"updateTime"
            },
            {
                title:"通话次数",
                // dataIndex:"callNum",
                render:e=>{
                // return e.callNum?<div onClick={()=>{this.callLog(e)}} style={{color:"#1B84FF",cursor:"pointer"}}>{e.callNum}</div>:<span>{e.callNum}</span>
                return e.callNum?<Permissions tag="link" server={global.AUTHSERVER.postloan.key} permissions={global.AUTHSERVER.postloan.access.call_list} type="primary" size="small" onClick={()=>{this.callLog(e)}} >{e.callNum}</Permissions>:<span>{e.callNum}</span>
                }
            },
            {
                title:"最近通话时间",
                dataIndex:"lastCallTime",
                render:e=>e||"--"
            },
            {
                title:"操作",
                render:e=>{
                    var btn=[];
                    if(e.source){
                        btn.push(<Permissions tag="button" server={global.AUTHSERVER.postloan.key} permissions={global.AUTHSERVER.postloan.access.contacts_edit} type="primary" size="small" onClick={()=>{this.editContact(e)}} >编辑</Permissions>);
                        btn.push(<Button type="danger" size="small" onClick={()=>{this.deleteContact(e)}}>删除</Button>)
                    }
                    if(e.hangUp){
                        btn.push(<Popconfirm title="确定要挂断电话吗？" onConfirm={()=>{this.hangUp(e)}}><Icon type="phone" style={{fontSize:16,color:"red",cursor:"pointer"}} /></Popconfirm>)
                        // btn.push(<Button icon="phone" shape="circle" type="danger" size="small" onClick={()=>{this.hangUp(e)}} />)

                    }else{
                        // btn.push(<Popconfirm title="确定要拨出电话吗？" onConfirm={()=>{this.call(e)}}><Icon type="phone" style={{fontSize:16,color:"#1B84FF",cursor:"pointer"}} /></Popconfirm>)
                        if(!e.source){
                            btn.push(<Popconfirm title="确定要拨出电话吗？" onConfirm={()=>{this.call(e)}}><Permissions tag="icon" server={global.AUTHSERVER.postloan.key} permissions={global.AUTHSERVER.postloan.access.call_send} /></Popconfirm>);
                        }
                    }
                    return <Btn btn={btn} />
                }
            },
        ]
    }
    //编辑联系人
    editContact(data){
        this.contact_child.setState({
            contact_visible:true,
            edit:true,
            contactsId:data.id
        })
        setTimeout(function(){
            this.contact_child.props.form.setFieldsValue({relation:data.plRelation,name:data.name,phone:data.phone})
            this.contact_child.setState({
                phone:data.phone
            })
        }.bind(this),100)
    }
    //获取联系人列表
    get_contactList(id) {
        var callDetail=JSON.parse(window.localStorage.getItem("callDetail"));
        axios_postloan.post(afterloan_borrower_detail, { contractNo: this.props.contractNo }).then(e => {
            if (!e.code&&e.data.length>0) {
                e.data.forEach(item=>{
                    if(item.id===id||item.callStatus===10){
                        item.hangUp=true;
                    }
                    if(item.callStatus===10&&item.id===callDetail.id&&!id&&id!==null){
                        // this.call(item)
                        this.getCallDetail=setInterval(function(){
                            this.callDetail(callDetail.requestNo,callDetail.id);
                        }.bind(this),3000)
                    }
                })
                this.setState({
                    contactList: e.data,
                    borrowerId:e.data[0].borrowerId
                })
            }
        })
    }
    //删除联系人
    deleteContact(data){
        this.setState({
            del_visible:true,
            contactsId:data.id
        })
    }
    //打电话
    call(data){
        if(this.state.callRequestNo){
            message.warn("不能同时拨打给多人");
            return;
        }
        message.success("正在拨打中。。。");
        axios_postloan.post(afterloan_call_send,{contactsId:data.id||"",contractId:this.props.contractId}).then(e=>{
            if(!e.code){
                // message.success("电话已接通");
                this.change_name(data.name)
                this.getCallDetail=setInterval(function(){
                    this.callDetail(e.data,data);
                }.bind(this),3000)
                this.get_contactList(data.id);
                var detail={id:data.id,requestNo:e.data}
                window.localStorage.setItem("callDetail",JSON.stringify(detail));
                this.setState({
                    callRequestNo:e.data
                })
            }else{
                clearInterval(this.getCallDetail);
            }
        })
    }
    callDetail(requestNo,data){
        axios_postloan.post(afterloan_call_detail,{requestNo:requestNo}).then(e=>{
            if(!e.code){
                if((e.data.status===80||e.data.status===90)&&e.data.type==="MANUAL_COLLECTION"){
                    message.success("对方已挂断");
                    clearInterval(this.getCallDetail);
                    this.state.contactList.forEach(item=>{
                        if(item.id===data.id){
                            item.hangUp=false;
                        }
                        this.setState({
                            contactList:this.state.contactList,
                            callRequestNo:""
                        })
                    })
                }
                
            }else{
                clearInterval(this.getCallDetail);
            }
        }) 
    }
    //挂电话
    hangUp(data){
        if(this.state.isHangUp){
            message.warn("不能重复挂断电话");
            return;
        }
        var callDetail=JSON.parse(window.localStorage.getItem("callDetail"));
        if(data.id===callDetail.id){
            axios_postloan.post(afterloan_call_detail,{requestNo:callDetail.requestNo}).then(e=>{
                if(!e.code){
                    if(e.data.status===10&&e.data.type==="MANUAL_COLLECTION"){
                        clearInterval(this.getCallDetail);
                        message.warn("正在挂断，请稍等。。。");
                        this.setState({
                            isHangUp:true
                        })
                        axios_postloan.post(afterloan_call_hangUp,{requestNo:callDetail.requestNo}).then(e=>{
                            setTimeout(function(){
                                this.state.contactList.forEach(item=>{
                                    if(item.id===data.id){
                                        item.hangUp=false;
                                    }
                                    this.setState({
                                        contactList:this.state.contactList,
                                        callRequestNo:"",
                                        isHangUp:false
                                    })
                                })
                            }.bind(this),3000)
                            
                        })
                    }else if(e.data.status===0){
                        clearInterval(this.getCallDetail);
                        message.warn("该电话状态异常，暂时不能挂断，请稍后重试");
                    }
                    
                }else{
                    clearInterval(this.getCallDetail);
                    message.warn("该电话暂时不能挂断，请稍后重试");
                }
            }) 
        }
    }
    disableDate(current){
        return current&&current<moment().startOf("day");
    }
    modalShow(){
        this.contact_child.setState({
            contact_visible:true,
            edit:false
        })
        this.contact_child.props.form.resetFields();
    }
    modalCancel(){
        this.setState({
            contact_visible:false
        })
    }
    change_name(name){
        var type={SELF:"本人",SPOUSE:"配偶",SON:"子",DAUGHTER:"女",PARENT:"父母",BROTHER_OR_SISTER:"兄弟姐妹",FRIEND:"朋友",COLLEAGUE:"同事",OTHER:"其他"}
        this.state.contactList.forEach(e=>{
            if(e.name===name){
                this.setState({
                    relation:type[e.plRelation],
                    phone:e.phone,
                    name:name,
                    id:e.id||""
                })
            }
        })
    }
    //添加催记
    insertUrge(e){
        this.props.form.validateFields((err,val)=>{
            if(!err){
                val.contractNo=this.props.contractNo;
                val.remindTime=moment().format("YYYY-MM-DD HH:mm:ss");
                val.promiseRepayTime=val.promiseRepayTime?val.promiseRepayTime.format("YYYY-MM-DD HH:mm:ss"):"";
                val.overdueReason=val.overdueReason||"";
                val.contactsId=this.state.id;
                axios_postloan.post(afterloan_overdue_insert_collection,val).then(res=>{
                    if(!res.code){
                        message.success(res.msg);
                        this.clear();
                        if(this.props.gelist){
                            this.props.gelist()
                        }
                    }
                })
            }
        })
    }
    //催记清空
    clear(){
        this.props.form.resetFields();
        this.setState({
            relation:"",
            phone:"",
            name:"",
            id:""
        })
    }
    //通话记录
    callLog(e){
        console.log(this.props.locations)
        page_go("/dh/overdue/detail/call?contractId="+this.props.contractId+"&name="+(e?e.name:"")+"&relation="+(e?e.plRelation:""));
    }
    //选择关系
    relationChange(e){
        this.setState({
            add_relation:e
        })
    }
    contactRef(e){
        this.contact_child=e;
    }
    //删除联系人
    delCancel(){
        this.setState({
            del_visible:false
        })
    }
    delSure(){
        axios_postloan.post(afterloan_borrower_delete,{contactsId:this.state.contactsId}).then(e=>{
            if(!e.code){
                message.success("删除成功");
                this.get_contactList();
                this.delCancel()
            }
        })
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            }
        };
                            
        const delModal={
            title:"",
            visible:this.state.del_visible,
            onCancel:this.delCancel.bind(this),
            onOk:this.delSure.bind(this),
            maskClosable:false
        }

        return (
         <div>
             <Row className="detail-content">
                 <div style={{width:"50%",float:"left"}}>
                    <div className="detail-title"><div style={{width:"100%"}}>联系人信息&emsp;
                        <div style={{float:"right"}}>
                            {/* <Permissions type="primary" onClick={this.modalShow.bind(this)} server={global.AUTHSERVER.loan.key} tag="button" permissions={global.AUTHSERVER.loan.access.pl_reminder_add}>新增</Permissions> */}
                            <Button type="primary" style={{marginLeft:"10px"}} onClick={this.modalShow.bind(this)}>新增</Button>
                            {/* <Button type="primary" style={{marginLeft:"10px"}} onClick={()=>{this.callLog()}}>通话记录</Button> */}
                            <Permissions tag="button" server={global.AUTHSERVER.postloan.key} permissions={global.AUTHSERVER.postloan.access.call_list} type="primary" style={{marginLeft:"10px"}} onClick={()=>{this.callLog()}} >通话记录</Permissions>
                        </div>
                            
                        </div></div>
                        <Col className="detail-body">
                            <Table columns={this.columns} bordered dataSource={this.state.contactList||[{aa:1}]} pagination={false} rowKey="id" />
                        </Col>
                 </div>
                 <div style={{width:"15px",float:"left",background:"#F4F6F7",height:"542px"}} />
                 <div > 
                     {/* style={{width:"calc(50% - 15px)",float:"left"}} */}
                 <Form style={{width:"calc(50% - 15px)",float:"left"}}>
                 <div className="detail-title" ><div style={{width:"100%"}}>添加催记&emsp;</div></div>
                    <FormItem {...formItemLayout} label="姓名" style={{marginTop:"15px"}}>
                        {getFieldDecorator('contactName', {
                            initialValue:this.state.name,
                            rules: [{ required: true, message: '请选择姓名' }],
                        })(
                            <Select placeholder="请选择" onChange={this.change_name.bind(this)} >
                                {this.state.contactList.map((e,k)=>{
                                    return <Option value={e.name} key={k}>{e.name}</Option>
                                })}
                            </Select>
                        )}
                    </FormItem>
                    <Row style={{marginBottom:"24px"}}>
                        <Col span={8} style={{textAlign:"right",paddingRight:"8px",color:"rgba(0,0,0,0.5)"}}>关系:</Col>
                        <Col span={14}>{this.state.relation}</Col>
                    </Row>
                    <Row style={{marginBottom:"24px"}}>
                        <Col span={8} style={{textAlign:"right",paddingRight:"8px",color:"rgba(0,0,0,0.5)"}}>电话:</Col>
                        <Col span={14}>{this.state.phone}</Col>
                    </Row>
                    <FormItem {...formItemLayout} label="催收状态" style={{marginTop:"15px"}}>
                        {getFieldDecorator('result', {
                            // initialValue:this.today,
                            rules: [{ required: true, message: '请选择催收状态' }],
                        })(
                            <Select placeholder="请选择">
                                <Option value="无人接听">无人接听</Option>
                                <Option value="跳票">跳票</Option>
                                <Option value="承诺还款">承诺还款</Option>
                                <Option value="第三人代缴">第三人代缴</Option>
                                <Option value="无诚意">无诚意</Option>
                                <Option value="电话设置">电话设置</Option>
                                <Option value="转告">转告</Option>
                                <Option value="不认识本人">不认识本人</Option>
                                <Option value="不配合">不配合</Option>
                                <Option value="关机">关机</Option>
                                <Option value="停机">停机</Option>
                                <Option value="空号">空号</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="承诺还款时间(选填)">
                        {getFieldDecorator('promiseRepayTime', {
                            // initialValue:this.today,
                            // rules: [{ required: true, message: '请选择日期' }],
                        })(
                            <DatePicker disabledDate={this.disableDate.bind(this)} />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="逾期原因(选填)">
                        {getFieldDecorator('overdueReason',{
                            // initialValue:""
                        })(
                            <Select placeholder="请选择">
                                <Option value="经济困难">经济困难</Option>
                                <Option value="中介办理">中介办理</Option>
                                <Option value="忘记还款">忘记还款</Option>
                                <Option value="名义借贷">名义借贷</Option>
                                <Option value="卡片原因">卡片原因</Option>
                                <Option value="还款原因">还款原因</Option>
                                <Option value="交通原因">交通原因</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="备注(选填)">
                        {getFieldDecorator('remark',{
                            initialValue:""
                        })(
                            <TextArea rows={4} placeholder="请输入" />
                        )}
                    </FormItem>
                    <FormItem wrapperCol = {{span:"10",offset:"10"}}>
                        <Button type="" onClick={this.clear.bind(this)} size="small" style={{marginRight:"20px"}}>清空</Button>
                        <Button type="primary" onClick={this.insertUrge.bind(this)} size="small">确定</Button>
                        {/* <Permissions type="primary" onClick={this.insertUrge.bind(this)} size="small" server={global.AUTHSERVER.loan.key} tag="button" permissions={global.AUTHSERVER.loan.access.pl_reminder_add}>确定</Permissions> */}
                    </FormItem>
                </Form>
                 </div>
                 <ContactModal onRef={this.contactRef.bind(this)} borrowerId={this.state.borrowerId} getList={this.get_contactList.bind(this)} />
                 <Modal {...delModal}>确认删除联系人信息吗？</Modal>
            </Row>
         </div>
        )
    }

}
export default Form.create()(Overdue);
