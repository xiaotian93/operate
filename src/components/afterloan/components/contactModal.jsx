import React, { Component } from 'react';
import { message,Form ,Select,Input,Modal} from 'antd';
import { axios_postloan } from '../../../ajax/request';
import { afterloan_borrower_update ,afterloan_borrower_create} from '../../../ajax/api';
const FormItem = Form.Item;
const { Option } = Select;
class Overdue extends Component {
    constructor(props) {
        super(props);
        props.onRef(this);
        this.state = {
            contact_visible:false,
            relation:"",
            contactList:[],
            phone:""
        };
        this.contacts=[{value:"SPOUSE",name:"配偶"},{value:"SON",name:"子"},{value:"DAUGHTER",name:"女"},{value:"PARENT",name:"父母"},{value:"BROTHER_OR_SISTER",name:"兄弟姐妹"},{value:"FRIEND",name:"朋友"},{value:"COLLEAGUE",name:"同事"},{value:"OTHER",name:"其他"}]
    }
    componentWillMount(){
    }
    modalShow(){
        this.setState({
            contact_visible:true
        })
    }
    modalCancel(){
        this.setState({
            contact_visible:false
        })
    }
    change_name(name){
        this.state.contactList.forEach(e=>{
            if(e.name===name){
                this.setState({
                    relation:e.relation
                })
            }
        })
    }
    //选择关系
    relationChange(e){
        this.setState({
            add_relation:e
        })
    }
    //新增联系人
    modalSure(){
        this.props.form.validateFields((err,val)=>{
            if(!err){
                if(this.state.edit){
                    val.contactsId=this.state.contactsId;
                    if(val.phone===this.state.phone){
                        delete val.phone;
                    }
                    axios_postloan.post(afterloan_borrower_update,val).then(e=>{
                        if(!e.code){
                            message.success("编辑成功");
                            this.props.getList();
                            this.modalCancel();
                        }
                    })
                }else{
                    val.borrowerId=this.props.borrowerId
                    axios_postloan.post(afterloan_borrower_create,val).then(e=>{
                        if(!e.code){
                            message.success("新增成功");
                            this.props.getList();
                            this.modalCancel();
                        }
                    })
                }
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
                            
        const contactModal={
            title:"联系人信息",
            visible:this.state.contact_visible,
            onCancel:this.modalCancel.bind(this),
            onOk:this.modalSure.bind(this),
            maskClosable:false
        }

        return (
         <div>
             <Modal {...contactModal}>
                    <FormItem {...formItemLayout} label="关系">
                        {getFieldDecorator('relation', {
                            // initialValue:this.today,
                            rules: [{ required: true, message: '请选择关系' }],
                        })(
                            <Select placeholder="请选择" style={{width:"100%"}} onChange={this.relationChange.bind(this)}>
                                {this.contacts.map((i,k)=>{
                                    return <Option value={i.value} key={k}>{i.name}</Option>
                                })}
                            </Select>
                        )}
                    </FormItem>
                    {/* {this.state.add_relation==="OTHER"?<Col push={8} span={24}><FormItem {...formItemLayout} label="">
                        {getFieldDecorator('name', {
                            // initialValue:this.today,
                        })(
                            <Input placeholder="请填写具体关系（选填）" />
                        )}
                    </FormItem></Col>:null} */}
                    <FormItem {...formItemLayout} label="姓名">
                        {getFieldDecorator('name', {
                            // initialValue:this.today,
                            rules: [{ required: true, message: '请输入姓名' },{pattern:/^[\u4e00-\u9fa5]{0,10}$/,message:"请输入10个字以内的汉字"}],
                        })(
                            <Input placeholder="请输入姓名" />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="手机号">
                        {getFieldDecorator('phone', {
                            // initialValue:this.today,
                            rules: [{ required: true, message: '请输入手机号' }],
                        })(
                            <Input placeholder="请输入手机号" />
                        )}
                    </FormItem>
                 </Modal>
         </div>
        )
    }

}
export default Form.create()(Overdue);
