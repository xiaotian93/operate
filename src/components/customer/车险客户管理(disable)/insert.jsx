import React, { Component } from 'react';
import { Row , Button , Modal , Spin , message} from 'antd';
import moment from 'moment'
import { browserHistory } from 'react-router';
import CompanyForm from './../forms/company';
import LegalForm from './../forms/legal';
import ClearingForm from './../forms/clearing';
import OperatorForm from './../forms/operator';
import RepayForm from './../forms/repay';

import { axios_sh , axios_cxfq } from '../../../ajax/request'
import { customer_company_insert , customer_company_show , customer_company_edit } from '../../../ajax/api';
import { page } from '../../../ajax/config';

class Borrow extends Component{
    constructor(props) {
        super(props);
        let id = this.props.location.query.id;
        this.state = {
            loading:false,
            filter:{},
            spinning:id?true:false,
            pageSize:page.size,
            id:id,
            data:[],
            isleave:false
        };
    }
    componentWillMount(){
        this.props.router.setRouteLeaveHook(
            this.props.route,
            this.routerWillLeave.bind(this)
    )
    }
    componentDidMount(){
        if(this.state.id){
            this.setState({
                spinning:true
            })
            this.show_customer(this.state.id);
        }
    }
    shouldComponentUpdate(props,state){
        this.props.router.setRouteLeaveHook(
            this.props.route,
            this.routerWillLeave.bind(this)
    )
    return true
    
}
routerWillLeave(nextLocation){
    if(this.state.isleave){
        return true
    }else{
        this.setState({
            leave:true,
            isleave:true,
            next:nextLocation.pathname
        })
        return false;
    }
};
leaveOk(){
    this.setState({
        leave:false,
        isleave:false
    })
}
leaveClose(){
    this.setState({
        leave:false,
        isleave:true
    })
    browserHistory.push(this.state.next)
}
    // 绑定企业名称
    sync_name(val){
        this.clearing.setState({
            settleAccountName:val
        })
        this.clearing.props.form.setFieldsValue({settleAccountName:val});
    }
    // 绑定表单
    form_bind(key,main){
        this[key] = main;
    }
    form_data_get(){
        this.setState({
            loading:true
        })
        // 获取企业信息
        let company = new Promise((res,rej)=>{
            this.company.props.form.validateFieldsAndScroll((err,data)=>{
                if(err){
                    this.cancel_loading()
                    rej(err);
                }
                data.expireDate = moment(data.expireDate).format("YYYY-MM-DD");
                res(data);
            })
        })
        // 获取法人信息
        let legal = new Promise((res,rej)=>{
            this.legal.props.form.validateFieldsAndScroll((err,data)=>{
                if(err){
                    this.cancel_loading()
                    rej(err);
                }
                res(data);
            })
        })
        // 获取结算账户信息
        let clearing = new Promise((res,rej)=>{
            this.clearing.props.form.validateFieldsAndScroll((err,data)=>{
                if(err){
                    this.cancel_loading()
                    rej(err);
                }
                res(data);
            })
        })
        // 获取经办人信息
        let operator = new Promise((res,rej)=>{
            this.operator.props.form.validateFieldsAndScroll((err,data)=>{
                if(err){
                    this.cancel_loading()
                    rej(err);
                }
                res(data);
            })
        })
        // 获取还款账户信息
        let repay = new Promise((res,rej)=>{
            this.repay.props.form.validateFieldsAndScroll((err,data)=>{
                if(err){
                    this.cancel_loading()
                    rej(err);
                }
                res(data);
            })
        })
        Promise.all([company,legal,clearing,operator,repay]).then((res)=>{
            let all_data = {};
            all_data = Object.assign(...res);
            let id = this.state.id;
            if(id){
                all_data.id = id;
                this.update_customer(all_data);
            }else{
                this.insert_customer(all_data);
            }
        })
    }
    // 取消loading
    cancel_loading(){
        this.setState({
            loading:false
        })
    }
    // 添加企业客户
    insert_customer(data){
        axios_cxfq.post(customer_company_insert,data).then(data=>{
            this.setState({
                isleave:true,
                loading:false
            })
            
            Modal.success({
                title: '操作成功',
                content: '客户信息添加成功',
                okText:"确认",
                onOk:()=>{
                    this.go_list()
                }
            });
        })
    }
    // 修改企业客户
    update_customer(data){
        axios_cxfq.post(customer_company_edit,data).then(data=>{
            this.setState({
                isleave:true,
                loading:false
            })
            Modal.success({
                title: '操作成功',
                content: '客户信息修改成功',
                okText:"确认",
                onOk:()=>{
                    this.go_list()
                }
            });
        })
    }
    // 查看企业客户
    show_customer(id){
        axios_sh.post(customer_company_show,{id:id}).then(data=>{
            let obj = data.data;
            this.company.form_data_set(obj);
            this.legal.form_data_set(obj);
            this.clearing.form_data_set(obj);
            this.operator.form_data_set(obj);
            this.repay.form_data_set(obj);
            this.setState({
                spinning:false
            })
        })
    }
    // 处理上传结果
    resolve_upload(main,key,res){
        if(res.fileList&&res.fileList.length>3){
            message.warn("最多上传3张照片");
        }
        res.fileList.splice(3);
        main.setState({
            upload_icon:(res.fileList.length>=3?false:true),
            fileList:res.fileList
        })
        let file = res.file;
        // 上传中
        if(file.status==="uploading"){
            return;
        }
        // 上传完成
        if(file.status==="done"){
            let vals = main.props.form.getFieldValue(key)||[];
            vals.push(file.response.data.storageNo);
            main.props.form.setFieldsValue({
                [key]:vals
            })
        }
        // 删除图片
        if(file.status==="removed"){
            let storageNo = file.response.data.storageNo;
            let vals = main.props.form.getFieldValue(key);
            let index = vals.indexOf(storageNo);
            vals.splice(index,1);
            main.props.form.setFieldsValue({
                [key]:vals
            })
        }
        // 上传错误
        if(file.status==="error"){
            res.fileList.pop()
            main.setState({
                fileList:res.fileList
            })
        }
    }
    // 调回列表页
    go_list(){
        this.props.router.push('/kh/cxfq/company');
    }
    // 点击重置
    reset_click(){
        this.go_list();
        // Modal.confirm({
        //     title: '操作确认',
        //     content: '确认清空但当前内容？',
        //     okText: '确认',
        //     cancelText: '取消',
        //     onOk:()=>{
        //         this.reset_form();
        //     }
        // });
    }
    // 重置表单
    reset_form(){
        this.clearing.props.form.resetFields();
        this.clearing.props.form.setFieldsValue({khhmc:"label"});
        this.clearing.setState({
            settleAccountName:"",
            fileList:[]
        })
        this.legal.props.form.resetFields();
        this.legal.setState({
            fileList:[]
        })
        this.company.props.form.resetFields();
        this.company.props.form.setFieldsValue({location:"地址"});
        this.company.props.form.setFieldsValue({qyNo:this.company.qyNo});
        this.company.setState({
            fileList:[]
        })
        this.operator.props.form.resetFields();
        this.operator.setState({
            fileList:[]
        })
        this.repay.props.form.resetFields();
        this.repay.props.form.setFieldsValue({khhmc:"label"});
        // this.repay.setState({
        //     fileList:[]
        // })
    }
    page_up(page,pageSize){
        this.get_list(page,this.state.filter);
    }
    render (){
        const leave={
            visible:this.state.leave,
            maskClosable:false,
            closable:false,
            onOk:this.leaveClose.bind(this),
            onCancel:this.leaveOk.bind(this),
            cancelText:"取消",
            okText:"确认退出",
            title:"退出确认"
        }
        return(
            <Spin tip="loading" spinning={this.state.spinning}>
                <Row className="content" style={{marginBottom:"60px"}}>
                    <CompanyForm change-name={this.sync_name.bind(this)} data-upload={this.resolve_upload} data-key="company" data-bind = { this.form_bind.bind(this) } />
                    <LegalForm data-upload={this.resolve_upload} data-key="legal" data-bind = { this.form_bind.bind(this) } />
                    <ClearingForm data-upload={this.resolve_upload} data-key="clearing" data-bind = { this.form_bind.bind(this) } />
                    <OperatorForm data-upload={this.resolve_upload} data-key="operator" data-bind = { this.form_bind.bind(this) } />
                    <RepayForm data-upload={this.resolve_upload} data-key="repay" data-bind = { this.form_bind.bind(this) } />
                </Row>
                <Row style={{height:"50px",background:"#fff",position:"fixed",bottom:"0",right:"0",lineHeight:"50px",textAlign:"center",width:"calc(100% - 170px)",boxShadow:"0px -2px 4px 0px rgba(0,0,0,0.1)"}}>
                    <Button onClick={this.reset_click.bind(this)}>取消</Button>
                    <Button loading={this.state.loading} onClick={this.form_data_get.bind(this)} style={{ marginLeft: '30px' }} type="primary">确认</Button>
                </Row>
                <Modal {...leave}>
                    是否确认退出此页面？退出后您当前录入的信息将不可保存。
                </Modal>
            </Spin>
        )
    }
}

export default Borrow;
