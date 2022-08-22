import React, { Component } from 'react';
import { Modal, Select, Form, Row,Col, Button,Input , DatePicker , message} from 'antd';

import moment from 'moment';
// import Path from '../../../templates/Path';
import TableColumn from '../../../../templates/TableNormal';
import { axios_zj } from '../../../../ajax/request';
import { capital_account , capital_bill ,capital_account_stat, capital_account_web_add , capital_account_web_sub , capital_account_total , capital_account_export , capital_hangup , capital_account_user_list } from '../../../../ajax/api';
import { host_zj,page } from '../../../../ajax/config';
import { bmd } from '../../../../ajax/tool';
// import Permissions from '../../../templates/Permissions';
import ComponentRoute from '../../../../templates/ComponentRoute';

const Option = Select.Option;
const FormItem = Form.Item;
class Detail extends Component{
    //构造器
	constructor(props) {
          super(props);
          this.state = {
          	visible: false,
            loading_table: true,
            loading_total: true,
            targetAccountIdValue:"",
            account_map:{},
            accountId:props.accountId,
            targetAccountIds:[],
            total:1,
            current:1,
            pageSize:page.size,
            total_money:"",
            total_fee:"",
            income:{
                count:0,
                totalAmount:0
            },
            expend:{
                count:0,
                totalAmount:0
            },
            factorage:{
                count:0,
                totalAmount:0
            },
            d1:[],
            status:0,
            startDate:moment().format("YYYY-MM-DD HH:mm:ss"),
            endDate:moment().format("YYYY-MM-DD HH:mm:ss"),
            accountName:""
        };
    }
   componentWillMount(){
        this.columns = [
		{
		    title: '序号',
            dataIndex: 'key',
            render:(text,record,index)=>{
                if(text==="合计"){
                    return text;
                }
                return `${index+1}`
            }
		},
		{
		    title: '交易时间',
            dataIndex: 'tradeTime',
            render:e=>{
                var date=e.date;
                var time=e.time;
                return date.year+"-"+date.month+"-"+date.day+" "+time.hour+":"+time.minute+":"+time.second;
            },
            sorter: (a, b) => {
                var date_a=a.tradeTime.date;
                var time_a=a.tradeTime.time;
                var str_a=date_a.year+"-"+date_a.month+"-"+date_a.day+" "+time_a.hour+":"+time_a.minute+":"+time_a.second;
                var date_b=b.tradeTime.date;
                var time_b=b.tradeTime.time;
                var str_b=date_b.year+"-"+date_b.month+"-"+date_b.day+" "+time_b.hour+":"+time_b.minute+":"+time_b.second;
                return Date.parse(str_a) - Date.parse(str_b)
            }
        },
        {
		    title: '商户订单号',
            width:"7%",
            dataIndex: 'bmdOrderId',
            render:e=>(e||"--")
		},	
		{
		    title: '交易号',
            width:"7%",
            dataIndex: 'serialNumber',
            render:e=>(e||"--")
		},	
		{
		    title: '交易方向',
		    dataIndex: 'type',
            render:data=>{
                return data===2?"收入":"支出"
            }
		},	
		{
		    title: '交易金额',
		    dataIndex: 'amount',
            render:data=>{
                return data.money()
            },
            sorter: (a, b) => {
                return bmd.getSort(a,b,"amount")
            }
		},
		// {
		//     title: '交易类型',
		//     dataIndex: 'subType',
		// },			
		{
		    title: '手续费',
		    dataIndex: 'fee',
            render:data=>{
                return data.money()
            },
            sorter: (a, b) => {
                return bmd.getSort(a,b,"fee")
            }
		},			
		{
            title: '目标账号',
            // width:"10%",
            dataIndex:"targetAccount",
            render:data=>{
                return data||"--";
            }
		},
		{
            title: '目标账户名',
            dataIndex:"targetName",
            render:data=>{
                return data||"--";
            }
		},			
		{
            title: '目标身份证',
            dataIndex:"targetIdNo",
            render:data=>{
                return data||"--";
            }

        },		
        {
            title: '目标手机号',
            dataIndex:"targetPhone",
            render:data=>{
                return data||"--";
            }

        },		
        {
            title: '内部账户编号',
            dataIndex:"accountId",
            render:data=>{
                return this.state.account_map[data]||"--"
            }
		},
        // {
        //     title: '备注',
        //     // width:"10%",
        //     dataIndex:"desc"
        // },
        // {
        //     title: '操作',
        //     className:"operate",
        //     render:data=>{
        //         let res = [];
        //         if(data.accountId===1&&data.subType==="付款"){
        //             // res.push(<Button key="down" type="primary" size="small" onClick={(e)=>{this.download_voucher(data.serialNumber)}}>下载凭证</Button> );
        //             res.push(<span key="k">&nbsp;</span>)
        //         }
                
        //         if(data.suspend){
        //             res.push(<Button key="hasrefuse" size="small">已挂起</Button>)
        //             res.push(<span key="g1">&nbsp;</span>)
        //         }else{
        //             if(data.remainAmount===data.amount){
        //                 res.push(<Button key="refuse" type="primary" size="small" onClick={(e)=>{this.account_refuse_confirm(data)}}>挂起</Button>)
        //                 res.push(<span key="g3">&nbsp;</span>)
        //             }
        //         }
        //         if(data.remainAmount<data.amount){
        //             res.push(<Button key="show" type="primary" size="small" onClick={(e)=>{this.element_show(data)}}>查看成分</Button>)
        //             res.push(<span key="g2">&nbsp;</span>)
        //         }
        //         return res
        //     }
        // }
		];

        let pay_type = [
            {
                name:"全部",
                val:""
            },
            {
                name:"支出",
                val:"1"
            },
            {
                name:"收入",
                val:"2"
            }
        ]
        

        this.filter = {
            time:{
                name:"交易日期",
                type:"range_date",
                feild_s:"startDate",
                feild_e:"endDate",
                placeHolder:['开始日期',"结束日期"]
            },
            type:{
                name:"交易方向",
                type:"select",
                placeHolder:"请选择支付类型",
                values:pay_type
            },
            // subType:{
            //     name:"交易类型",
            //     type:"select",
            //     placeHolder:"请选择交易类型",
            //     values:deal_type
            // },
            accountId:{
                name:"内部账户编号",
                type:"select",
                placeHolder:"请选择支付通道",
                values:"account_all"
            },
            serialNumber:{
                name:"交易号",
                type:"text",
                placeHolder:"请输入交易号"
            },
            // processed:{
            //     name:"处理情况",
            //     type:"select",
            //     placeHolder:"请选择处理情况",
            //     values:[{name:"全部",val:""},{name:"已处理",val:true},{name:"未处理",val:false}]
            // }
        }
        let filters = JSON.parse(localStorage.getItem(window.location.pathname)||"{}");
        filters.accountId = this.state.accountId;
        localStorage.setItem(window.location.pathname,JSON.stringify(filters))
        console.log(filters)
	}

    componentDidMount(){
        this.get_all_account();
    }

    // 绑定表格this
    bindmain(main){
        this.table = main;
    }

    // 统计接口导入
    get_total_info(param={}){
    	let rqd={
            ...param
        }
        axios_zj.post(capital_account_stat,rqd).then((data)=>{
            let state = {
            	income:data.data['收入'],
                expend:data.data['支出'],
                factorage:data.data['手续费'],
                total_money:0,
            }
            // if(rqd.accountId==="5"||rqd.accountId==="6"){
            //     state.total_money = state.income.totalAmount-state.expend.totalAmount+this.state.total_fee;
            // }else{
                state.total_money = state.income.totalAmount-state.expend.totalAmount-state.factorage.totalAmount;
            // }
            this.setState(state)
        });
    }

    // 获取总额
    get_total_money(param={}){
        let rqd = {
            ...param
        }
        axios_zj.post(capital_account_total,rqd).then(data=>{
            this.setState({
                loading_total:false,
                total_fee:data.data.fee
            })
            this.get_total_info(param);
        })
    }
    // 获取全部账户
    get_all_account() {
        axios_zj.post(capital_account).then(data=>{
            let accounts = data.data.list;
            let temp = [];
            let options = [];
            let account_map = {};
            for(let a in accounts){
                let name = `${accounts[a].innerName}(${accounts[a].usage})`;
                account_map[accounts[a].accountId] = name;
                temp.push({
                    val:accounts[a].accountId,
                    name:name
                })
                options.push(<Option key={a} value={accounts[a].accountId+""}>{name}</Option>)
            }
            temp.unshift({name:"全部",val:""});
            this.setState({
                account_all:temp,
                account_map,
                account_all_option:options
            })
            this.table.setState({
                account_all:temp
            })
        })
    }

    // 查询
    get_filter(data){
        this.get_total_money(data);
    }

    // 设置筛选
    set_filter(filter){
        if(this.state.accountId){
            filter.props.form.setFieldsValue({accountId:this.state.accountId});
        }
    }

    // 导出
    table_export(){
        let str = [];
        let filters = this.table.state.filter;
        for(let f in filters){
            str.push(f+"="+filters[f]);
        }
        let params = str.join("&")?"?"+str.join("&"):"";
        window.open(host_zj + capital_account_export + params);
    }

    // 下载凭证
    download_voucher(serialNumber){
        window.open("http://pay.baimaodai.com/voucher/get?channel=连连支付&serialNumber="+serialNumber);
    }
    
    // 查看成分
    element_show(data){
        bmd.navigate("/zj/total/element?id="+data.id+"&account_name="+this.state.account_map[data.accountId])
    }

    // 账单挂起确认
    account_refuse_confirm(data){
        Modal.confirm({
            content:"确认挂起吗？",
            okText:"确认",
            cancelText:"取消",
            onOk:()=>{
                this.account_refuse(data.id);
            },
            onCancel:()=>{
                
            }
        })
    }

    // 账单挂起
    account_refuse(accountingId){
        axios_zj.post(capital_hangup,{accountingId:accountingId}).then(data=>{
            message.success("操作成功");
            this.table.update_list();
        })
    }

    // 人工录入充值
    person_charge(param){
        let rqd = {
            ...param
        }
        axios_zj.post(capital_account_web_add,rqd).then(data=>{
            this.table.refresh_list();
            this.hideModal();
            this.props.form.resetFields();
        })
    }

    // 人工录入提现
    person_withdraw(param){
        let rqd = {
            ...param
        }
        axios_zj.post(capital_account_web_sub,rqd).then(data=>{
            this.table.refresh_list();
            this.hideModal();
            this.props.form.resetFields();
        })
    }

    // 提交表单
    recharge(e){
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) {
                console.log('Received values of form: ', values);
                return;
            }
            values.date = moment(values.date).format("YYYY-MM-DD HH:mm:ss");
            values.amount = values.amount*100;
            values.fee = values.fee*100;
            values.desc = values.desc||"";
            console.log(values);
            if(this.state.modal_type==="cz"){
                this.person_charge(values);
            }
            if(this.state.modal_type==="tx"){
                this.person_withdraw(values);
            }
        });
    }
    
	// 显示弹窗
    showModal(e){
        let type = e.target.getAttribute("data-type");
        this.props.form.resetFields();
        this.setState({
            modal_type: type,
            visible: true
        });
    }
    // 隐藏弹窗
    hideModal(type){
        this.setState({
            visible: false
        });
    }
    // 搜索交易账户
    targetAccountIdChangeEvent(val){
        this.setState({
            targetAccountIdValue:val
        })
        if(this.selectStatus){
            this.selectStatus = false;
            return;
        }
        clearTimeout(this.timer);
        this.timer = setTimeout(()=>{
            axios_zj.post(capital_account_user_list,{accountName:val}).then(res=>{
                // this.props.form.setFieldsValue({targetAccountId:""});
                this.setState({
                    targetAccountIds:res.data.list||[]
                })
            })
        },800)
    }
    // 选择账户
    targetAccountIdSelectEvent(val,data){
        this.selectStatus = true;
        this.props.form.setFieldsValue({targetAccountId:data.props["data-id"]});
    }

    render(){
    	const { getFieldDecorator } = this.props.form;
        let table_new = {
            axios:axios_zj,
            path:capital_bill,
            "list-key":"data.list",
            columns:this.columns,
            filter:this.filter,
            "data-paths":this.props.location.pathname,
            // "filter-datas" : ["account_all"],
            select_props:{
                account_all:this.state.account_all
            },
            "filter-get" : this.get_filter.bind(this),
            "filter-set" : this.set_filter.bind(this),
            bindmain:this.bindmain.bind(this),
            tableTitle:{left:<span>金额单位：元</span>,right:null}
        }

        let modal_props = {
            title:"加款至账户",
            className:"pay-plan",
            visible:this.state.visible,
            okText:"确认",
            width:780,
            footer:null,
            onCancel:this.hideModal.bind(this)
        }
        let modal_text = {
            date : "资金到账时间：",
            serialNumber : "交易号：",
            targetAccount:"加款账户",
            amount : "加款金额(元)：",
            accountName : "打款方名称：",
            bankCardNumber : "打款方银行账号：",
            bankName : "打款方银行：",
            desc : "备注：",
            fee:"手续金额(元)："
        }
        if(this.state.modal_type==="tx"){
            modal_props.title = "从账户提现";
            modal_text.date = "提现时间：";
            modal_text.targetAccount = "提现账户";
            modal_text.serialNumber = "交易号：";
            modal_text.amount = "提现金额(元)：";
            modal_text.accountName = "收款方";
            modal_text.bankCardNumber = "收款方银行账号";
            modal_text.bankName = "收款银行";
            modal_text.desc = "备注：";
        }
        let typeMap = {
            "100":"银行卡账户",
            "1000":"默认主体账户"
        }
        let targetAccountId_option = this.state.targetAccountIds.map(accountInfo=>{
            let name = "("+typeMap[accountInfo.type]+") 主体:"+accountInfo.entity;
            if(accountInfo.type===100){
                name += " 卡号："+accountInfo.key;
            }
            return <Option key={accountInfo.id} data-id={accountInfo.id} value={name}>{name}</Option>
        });
        return(            
        <div>
            
            <Row>
                <TableColumn {...table_new}>
                    <div />
                    {/* <div>
                        <Permissions server={global.AUTHSERVER.account.key} permissions={global.AUTHSERVER.account.access.add} tag="button" type="primary" data-type="cz" onClick={this.showModal.bind(this)}>&emsp;新增加款&emsp;</Permissions>&emsp;
                        <Permissions server={global.AUTHSERVER.account.key} permissions={global.AUTHSERVER.account.access.add} tag="button" type="primary" data-type="tx" onClick={this.showModal.bind(this)}>&emsp;新增提现&emsp;</Permissions>&emsp; 
                        <Button type="primary" onClick={this.table_export.bind(this)}>&emsp;导出&emsp;</Button>
                    </div> */}
                </TableColumn>
            </Row>
            <Modal { ...modal_props }>
            <Form onSubmit={ this.recharge.bind(this) }>
                <Row>
                    <Col span={4}>
                        <div className="key">支付通道</div>
                    </Col>
                    <Col span={19} offset={1} className="value">
                       <FormItem>
                        {getFieldDecorator('accountId', {
                            rules: [{ required: true, message: '请选择支付通道' }],
                        })(
                            <Select placeholder="请选择支付通道">
                                {this.state.account_all_option}
                            </Select>
                        )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={4}>
                        <div className="key">{modal_text.date}</div>
                    </Col>
                    <Col span={19} offset={1} className="value">
                        <FormItem>
                        {getFieldDecorator('date', {
                            rules: [{ required: true, message: '请选择日期' }],
                        })(
                            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder="请选择日期" />
                        )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={4}>
                        <div className="key">{ modal_text.serialNumber }</div>
                    </Col>
                    <Col span={19} offset={1} className="value">
                       <FormItem>
                        {getFieldDecorator('serialNumber', {
                            rules: [{ required: true, message: '请输入交易号' }],
                        })(
                            <Input placeholder="请填写支付通道后台显示的交易号" />
                        )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={4}>
                        <div className="key">{ modal_text.amount }</div>
                    </Col>
                    <Col span={19} offset={1} className="value">
                        <FormItem>
                        {getFieldDecorator('amount', {
                            rules: [{ required: true, message: '请输入加款金额' }],
                        })(
                            <Input placeholder="请填写支付通道后台显示的加款金额" />
                        )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={4}>
                        <div className="key">{ modal_text.fee }</div>
                    </Col>
                    <Col span={19} offset={1} className="value">
                        <FormItem>
                        {getFieldDecorator('fee', {
                            rules: [{ required: true, message: '请输入手续金额' }],
                        })(
                            <Input placeholder="请填写支付通道后台显示的手续金额" />
                        )}
                        </FormItem>
                    </Col>
                </Row>
                <Col span={4}>
                    <div className="key">{modal_text.targetAccount}</div>
                </Col>
                <Col span={19} offset={1} className="value">
                    <FormItem>
                    {getFieldDecorator('targetAccountId', {
                        rules: [{ required: true, message: '请选择交易账户' }],
                    })(
                        <div />
                    )}
                    <Select mode="combobox" showArrow={false} filterOption = {false} defaultActiveFirstOption={false} placeholder="请选择交易账户" onChange={this.targetAccountIdChangeEvent.bind(this)} onSelect={this.targetAccountIdSelectEvent.bind(this)}>
                        {targetAccountId_option}
                    </Select>
                    </FormItem>
                </Col>
                <Row>
                    <Col span={4}>
                        <div className="key">{modal_text.desc}</div>
                    </Col>
                    <Col span={19} offset={1} className="value">
                        <FormItem>
                        {getFieldDecorator('desc')(
                            <Input placeholder="请输入备注" />
                        )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={24} className="text-center">
                        <FormItem>
                        <Button type="primary" htmlType="submit">确定</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>  
            </Modal>       
            <style>{`
                    .pay-plan .ant-model-body{
                        font-size:14px;
                    }
                    .pay-plan div.key{
                        line-height: 40px;
                        text-align: right;
                    }
                    .pay-plan div.value{
                        line-height: 40px;
                        text-align: left;
                    }
                    .pay-plan div.ant-modal-title,.pay-plan div.ant-modal-footer{
                        text-align:center
                    }
                `}</style>
        </div>
    );      
    }
}


export default ComponentRoute(Form.create()(Detail));