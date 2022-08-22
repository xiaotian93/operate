import React, { Component } from 'react';
import { Table , Row , Modal , Button } from 'antd';
import moment from 'moment'
// import { Link } from 'react-router';

import { axios_pay } from '../../ajax/request';
import { pay_related , pay_detail } from '../../ajax/api';
import { page , bill_status} from '../../ajax/config';
import { format_table_data } from '../../ajax/tool';
import ComponentRoute from '../../templates/ComponentRoute';

class Review extends Component{
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            loading: true,
            loading_model:true,
            total:0,
            pageSize:page.size,
            data:[],
            detail:[],
            visible:false,
            model_title:"xxxx",
            model_type:true,
            model_id:0,
            comment:""
        };
    }
    componentWillMount(){
        this.columns = [
            {
                title: '序号',
                width:50,
                dataIndex: 'key',
            },
            {
                title: '支付流水号',
                width:110,
                dataIndex: 'id',
            },
            {
                title: '支付时间',
                width:160,
                render: (text, record) => (
                    <span>
                        {moment(text.createTime).format("YYYY-MM-DD HH:mm:ss")}
                    </span>
                )
            },
            {
                title: '业务类型',
                width:100,
                dataIndex: 'businessType',
            },
            {
                title: '支付通道',
                width:100,
                dataIndex: 'payChannel',
            },
            {
                title: '收款方户名',
                dataIndex: 'bankAccountName',
            },
            {
                title: '收款方账号',
                width:160,
                dataIndex: 'bankCardNumber',
            },
            {
                title: '归属银行',
                width:100,
                dataIndex: 'bankName',
            },
            {
                title: '交易金额',
                width:100,
                dataIndex: 'amount',
            },
            {
                title: '支付状态',
                width:100,
                render: (text, record) => (
                    <span>
                        {bill_status[text.status]}
                    </span>
                )
            },
            // {
            //     title: '操作',
            //     width: 85,
            //     fixed: 'right',
            //     render: (data) => (
            //         <span>
            //             <Button size="small" data-id={data.id} onClick={this.detail.bind(this)}>查看</Button>
            //         </span>
            //     )
            // }
        ]
        this.detail_feild = [
            {
                title: '序号',
                dataIndex: 'key',
            },
            {
                title: '订单编号',
                dataIndex: 'orderId',
            },
            {
                title: '申请日期',
                render:(data) => (data.signTime?moment(data.signTime).format("YYYY-MM-DD HH:mm:ss"):"")
            },
            {
                title: '借款方',
                dataIndex: 'name',
            },
            {
                title: '借款金额',
                dataIndex: 'amount',
            },
            {
                title: '借款期限（月）',
                dataIndex: 'loanPeriod',
            }
        ]
        this.get_list();
    }
    
    get_list(page_no){
        let data = {
            page:page_no||1,
            size:page.size,
            status:10
        }
        axios_pay.post(pay_related,data).then((data)=>{
            if(!data){
                return;
            }
            this.setState({
                data:format_table_data(data.data),
                loading:false,
                total:data.totalPage*page.size,
                current:data.currentPage
            })
        });
    }
    get_detail(id){
        this.setState({
            detail:[],
            detail_loading:false
        })
        axios_pay.post(pay_detail,{id:id}).then((data)=>{
            this.setState({
                detail:format_table_data(data.data),
                detail_loading:false
            })
        })
    }
    detail(e){
        let id = e.target.getAttribute("data-id");
        this.get_detail(id);
        this.setState({
            visible:true,
            detail_loading:true
        })
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
        const { selectedRowKeys } = this.state;
        let pagination = {
            total : this.state.total,
            current : this.state.current,
            pageSize:this.state.pageSize,
            onChange:this.page_up.bind(this)
        }
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({ selectedRowKeys });
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User',
                name: record.name
            }),
        };
        let table_height = window.innerHeight - 248;
        
        return(
            <div className="Component-body">
                <Row className="table-content">
                    <Table rowSelection={rowSelection} scroll={{x:1300,y:table_height}} columns={this.columns} dataSource={this.state.data} bordered pagination = {pagination} loading={this.state.loading} />
                </Row>
                <Modal visible={this.state.visible} width={800} title={'订单明细'} onCancel={this.handleCancel.bind(this)} footer={[<Button key="back" onClick={this.handleCancel.bind(this)}>关闭</Button>]}>
                    <Table columns={this.detail_feild} dataSource={this.state.detail} pagination={false} bordered loading={this.state.detail_loading} />
                </Modal>
            </div>
        )
    }
}

export default ComponentRoute(Review);
