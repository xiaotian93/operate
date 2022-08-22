import React, { Component } from 'react';
import { Table , Row , Col , Button , Modal , message } from 'antd';
import moment from 'moment'

import Filter from '../../ui/Filter';
import axios from '../../../ajax/request'
import { loan_list , send_pay } from '../../../ajax/api';
import { page } from '../../../ajax/config';
import { format_table_data } from '../../../ajax/tool';

class Pay extends Component{
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            selectedRows: [],
            loading: false,
            total:1,
            current:1,
            filter:{},
            pageSize:page.size,
            data:[],
            pay_confirm:{
                show:false,
                title:"",
                ids:"",
                money:0,
                combine:false,
                loading:false
            },
            loanPeriod:JSON.parse(localStorage.getItem("select")).zzb_loan_period
        };
    }
    componentWillMount(){
        this.columns = [
            {
                title: '序号',
                dataIndex: 'key',
            },
            {
                title: '订单编号',
                dataIndex: 'orderId',
            },
            {
                title: '订单时间',
                render : (data) => {
                    return moment(data.createTime).format("YYYY-MM-DD hh:mm:ss")
                }
            },
            {
                title: '借款方',
                render : (data) => {
                    if(!data.dataObj.showVo){
                        return '';
                    }
                    if(data.dataObj.showVo.borrowType===1){
                        return data.dataObj.showVo.borrowInfo.company.name
                    }else{
                        return data.dataObj.showVo.borrowInfo.person.name
                    }
                }
            },
            {
                title: '借款金额',
                dataIndex: 'dataObj.showVo.borrowInfo.amount',
            },
            {
                title: '借款期限(月)',
                dataIndex: 'dataObj.showVo.borrowInfo.loanPeriod'
            },
            {
                title: '操作',
                width:170,
                render: (data) => (
                    <span>
                        <a className="ant-btn-success ant-btn-sm" onClick={()=>(this.set_confirm(true,false,data.id,data.dataObj.showVo.borrowInfo.amount))}>放款</a>&emsp;
                        <a className="ant-btn ant-btn-sm" onClick={()=>(this.detail(data.id))}>查看</a>&emsp;
                    </span>
                )
            }
        ];
        this.filter = {
            time:{
                name:"订单时间",
                type:"range_date",
                feild_s:"start_time",
                feild_e:"end_time",
                placeHolder:['开始日期',"结束日期"]
            },
            order_id:{
                name:"订单号",
                type:"text",
                placeHolder:"请输入订单号"
            },
            name:{
                name:"借款方",
                type:"text",
                placeHolder:"请输入借款方"
            },
            loan_period:{
                name:"借款期限",
                type:"multi_select",
                placeHolder:"请选择",
                values:'loanPeriod'
            }
        }
    }
    componentDidMount(){
        this.get_list();
    }
    get_list(page_no,filter={}){
        let data = JSON.parse(JSON.stringify(filter));
        data.page = page_no||1;
        data.size = page.size;
        data.app_id = "hengdu";
        data.status = 3;
        this.setState({
            loading:true,
            selectedRowKeys:[]
        })
        axios.post(loan_list,data).then((data)=>{
            let list = data.data;
            this.setState({
                data:format_table_data(list),
                loading:false,
                total:data.total,
                current:data.current
            })
        });
    }
    send_pay(){
        let rqd = [];
        let pay_confirm = JSON.parse(JSON.stringify(this.state.pay_confirm));
        let ids = pay_confirm.ids;
        if(typeof(ids)==='string'||typeof(ids)==='number'){
            rqd.push("id="+ids)
        }else{
            for(let i in ids){
                rqd.push("id="+ids[i])
            }
        }
        rqd.push("combine="+pay_confirm.combine);
        pay_confirm.loading = true;
        this.setState({
            pay_confirm:pay_confirm
        })
        axios.post(send_pay,rqd.join("&")).then((data)=>{
            this.get_list();
            this.setState({
                selectedRows:[]
            })
            this.set_confirm(false);
        });
    }
    set_confirm(show,combine=false,ids,moneys){
        let confirm = {
            show:show,
            title:"",
            ids:'',
            money:0,
            combine:combine,
            loading:false
        }
        if(show){
            confirm.ids = ids;
            confirm.money = moneys;
            if(combine){
                confirm.title = "合并支付确认"
            }else{
                confirm.title = (typeof(ids)==='object'?"逐条支付确认":"支付确认")
            }
        }
        this.setState({
            pay_confirm:{
                ...confirm
            }
        })
    }
    batch_operation(combine){
        let rows = this.state.selectedRows;
        let ids = [],moneys=0;
        if(rows.length<=0){
            message.warn("请选择订单");
            return;
        }
        for(let r in rows){
            ids.push(rows[r].id);
            moneys += parseFloat(rows[r].dataObj.showVo.borrowInfo.amount);
        }
        this.set_confirm(true,combine,ids,moneys);
    }
    get_filter(data){
        let filter = {};
        filter.filter = JSON.stringify(data);
        this.setState({
            filter:filter
        })
        this.get_list(1,filter);
    }
    detail(id){
        window.open('/zf/pay/hd/detail?id='+id);
    }
    page_up(page,pageSize){
        this.get_list(page,this.state.filter);
    }
    render (){
        const { selectedRowKeys } = this.state;
        let pagination = {
            total : this.state.total,
            current : this.state.current,
            pageSize : this.state.pageSize,
            onChange : this.page_up.bind(this)
        }
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(selectedRowKeys,selectedRows);
                this.setState({ selectedRowKeys , selectedRows });
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User',
                name: record.name
            }),
        };
        const table_props = {
            rowSelection:rowSelection,
            columns:this.columns ,
            dataSource:this.state.data,
            pagination : pagination,
            loading:this.state.loading,
        }

        const footer = [
            <Button key="back" onClick={(e)=>(this.set_confirm(false,false))}>取消</Button>,
            <Button key="submit" type="primary" loading={this.state.pay_confirm.loading} onClick={this.send_pay.bind(this)}>确认</Button>
        ]
        const model_props = {
            visible : this.state.pay_confirm.show, 
            title : this.state.pay_confirm.title,
            onOk : this.send_pay.bind(this), 
            onCancel : (e)=>(this.set_confirm(false,false)),
            footer : footer
        }

        return(
            <div className="Component-body">
                <Row className="path">
                    <Col span={24}>
                        <span className="f2">支付管理&nbsp;&gt;&nbsp;</span><span className="f2 text-blue">待放款</span>
                    </Col>
                </Row>
                <Filter data-get={this.get_filter.bind(this)} data-source={this.filter} loanPeriod={this.state.loanPeriod} />
                <Row className="content">
                    <Col span={22}>
                        <Button type="primary" onClick={(e)=>(this.batch_operation(true))}>批量合并支付</Button>&emsp;
                        <Button type="primary" onClick={(e)=>(this.batch_operation(false))}>批量逐条支付</Button>
                    </Col>
                </Row>
                <Row className="content">
                    <Table {...table_props} bordered />
                </Row>
                <Modal {...model_props}>
                    <h3>是否确认支付{ this.state.pay_confirm.money }</h3>
                </Modal>
            </div>
        )
    }
}

export default Pay;
