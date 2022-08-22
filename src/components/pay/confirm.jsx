import React, { Component } from 'react';
import { Table , Row , Modal , Button } from 'antd';

import { axios_pay , resolve_res } from '../../ajax/request';
import { pay_wait , pay_confirm , pay_deny , pay_wait_total } from '../../ajax/api';
import { page } from '../../ajax/config';
import { format_table_data } from '../../ajax/tool';
import Permissions from '../../templates/Permissions';
import ComponentRoute from '../../templates/ComponentRoute';

class Review extends Component{
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys:[1,2],
            loading: true,
            total:0,
            pageSize:page.size,
            data:[],
            visible:false,
            loading_model:false,
            total_money:0,
            model_id:0,
            model_text:""
        };
    }
    componentWillMount(){
        this.columns = [
            {
                title: '序号',
                dataIndex: 'key'
            },
            {
                title: '支付流水号',
                dataIndex: 'id'
            },
            {
                title: '产品名称',
                dataIndex:'businessType'
            },
            {
                title: '支付通道',
                dataIndex: 'payChannel'
            },
            {
                title: '收款方户名',
                //width:160,
                dataIndex: 'bankAccountName',
            
            },
            {
                title: '收款方账号',
                //width:120,
                dataIndex: 'bankCardNumber',
            },
            {
                title: '归属银行',
                dataIndex: 'bankName',
            },
            {
                title: '交易金额',
                dataIndex: 'amount',
            },
            {
                title: '操作',
                width:150,
                fixed: 'right',
                render: (data) => (
                    <span>
                        <Permissions server={global.AUTHSERVER.bmd.key} permissions={global.AUTHSERVER.bmd.access.payConfirm} tag="button" type="primary" size="small" onClick={()=>{ this.approved(data,true) }}>确认支付</Permissions>&nbsp;
                        <Permissions server={global.AUTHSERVER.bmd.key} permissions={global.AUTHSERVER.bmd.access.payConfirm} tag="button" type="danger" size="small" onClick={ ()=>{ this.approved(data,false) } }>拒绝</Permissions>
                    </span>
                )
            }
        ]
        
    }
    componentDidMount(){
        this.get_list();
        this.get_total();
    }
    get_list(page_no){
        let data = {
            page:page_no||1,
            size:page.size,
            status:0
        }
        axios_pay.post(pay_wait,{...data}).then((data)=>{
            if(!data){
                return;
            }
            let list = data.data;
            this.setState({
                data:format_table_data(list),
                loading:false,
                total:data.totalPage*page.size,
                current:data.currentPage
            })
        });
    }

    // 查询结果统计
    get_total(){
        axios_pay.post(pay_wait_total).then(data=>{
            console.log(data);
            this.setState({
                total_money:data.data.totalAmount?data.data.totalAmount:0
            })
        })
    }

    approved(data,ifpass){
        this.setState({
            model_id:data.id,
            model_pass:ifpass,
            visible:true,
            model_text:ifpass?"是否确认支付"+data.amount+"元?":"确认拒绝吗？"
        })
    }
    handleOk(){
        let rqd = {
            id:this.state.model_id,
        }
        let url = this.state.model_pass?pay_confirm:pay_deny;
        axios_pay.post(url,rqd).then((res)=>{
            resolve_res(res);
            this.setState({
                visible:false
            })
            this.get_list();
        });
    }
    handleCancel(){
        this.setState({
            visible:false
        })
    }

    page_up(page,pageSize){
        this.get_list(page);
    }
    
    render (){
        let pagination = {
            total : this.state.total,
            current : this.state.current,
            pageSize:this.state.pageSize,
            onChange:this.page_up.bind(this)
        }
        
        return(
            <div className="Component-body">
                <Row className="table-content">
                    <div className="text-orange">当前查询结果 交易金额合计：<span className="total-bold">{this.state.total_money.money()}</span>元</div>
                    <Table columns={this.columns} dataSource={this.state.data} bordered pagination = {pagination} loading={this.state.loading} />
                </Row>
                <Modal visible={this.state.visible} title="是否确认" onOk={this.handleOk.bind(this)} onCancel={this.handleCancel.bind(this)} footer={[<Button key="back" onClick={this.handleCancel.bind(this)}>取消</Button>,<Button key="submit" type="primary" loading={this.state.loading_model} onClick={this.handleOk.bind(this)}>确认</Button>]}>
                    <p>{this.state.model_text}</p>
                </Modal>
            </div>
        )
    }
}

export default ComponentRoute(Review);
