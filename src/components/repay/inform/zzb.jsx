import React, { Component } from 'react';
import { Table , Row , Col , Modal , message , Button } from 'antd';
import moment from 'moment';

import Filter from '../../ui/Filter';
import axios from '../../../ajax/request'
import { repay_inform , repay_confirm , repay_export } from '../../../ajax/api';
import { page , host } from '../../../ajax/config';
import { format_table_data } from '../../../ajax/tool';

class review_hs extends Component{
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            total:1,
            current:1,
            pageSize:page.size,
            data:[],
            filter:{},
            modal:{
                visible:false,
                id:0
            }
            
        };
    }
    componentWillMount(){
        this.columns = [
            {
                title: '序号',
                dataIndex: 'key',
            },
            {
                title: '接收时间',
                width:200,
                render:(data)=>{
                    return moment(data.createTime).format("YYYY-MM-DD HH:mm:ss")
                }
            },
            {
                title: '还款到账时间',
                width:200,
                dataIndex: 'repayeeDate',
            },
            {
                title: '订单编号',
                width:300,
                dataIndex: 'orderId',
            },
            {
                title: '借款方',
                width:80,
                dataIndex: 'borrowerName',
            },
            {
                title: '本期还款金额',
                width:120,
                dataIndex: 'repayeeAmount',
            },
            {
                title: '本期还款期数',
                width:100,
                dataIndex: 'repayeePeriod',
            },
            {
                title: '借款方证件号',
                width:250,
                dataIndex: 'borrowerIdCard',
            },
            {
                title: '借贷时间',
                width:150,
                dataIndex: 'borrowDate',
            },
            {
                title: '借款金额（元）',
                width:150,
                dataIndex: 'borrowAmount',
            },
            {
                title: '产品名称',
                width:250,
                dataIndex: 'projectName',
            },
            {
                title: '操作',
                fixed: 'right',
                width:80,
                render: (data) => {
                    if(data.statusStr==="未确认"){
                        return (
                            <span>
                                <a className="ant-btn ant-btn-denger ant-btn-sm" onClick={()=>(this.pay_confirm(data))}>{data.statusStr}</a>
                            </span>
                        )
                    }
                    return data.statusStr
                }
            }
        ];
        this.filter = {
            time:{
                name:"接收时间",
                type:"range_date",
                feild_s:"startTime",
                feild_e:"endTime",
                placeHolder:['开始日期',"结束日期"],
            },
            "--":{
                name:"",
                placeHolder:"",
                type:"blank"
            },
            "-1":{
                name:"",
                placeHolder:"",
                type:"blank"
            },
            // __SignDate:{
            //     name:"签单日",
            //     placeHolder:"请选择",
            //     type:"single_date"
            // },
            // __Company:{
            //     name:"保险公司",
            //     placeHolder:"请选择",
            //     type:"select",
            //     values:JSON.parse(localStorage.getItem("select")).companys
            // },
            projectName:{
                name:"产品名称",
                placeHolder:"请选择",
                type:"select",
                values:JSON.parse(localStorage.getItem("select")).zzb_project_name
            },
            borrowerName:{
                name:"借款方",
                placeHolder:"请输入借款方",
                type:"text"
            }
        }
    }
    componentDidMount(){
        this.get_list(1);
    }
    get_list(page_no,filter={}){
        let data = {
            page:page_no||1,
            size:page.size,
            ...filter
        }
        this.setState({
            loading:true,
            selectedRowKeys:[]
        })
        axios.post(repay_inform,data).then((data)=>{
            let list = data.data;
            this.setState({
                data:format_table_data(list),
                loading:false,
                total:data.total,
                current:data.current
            })
        });
    }
    get_filter(data){
        let newFilter = JSON.parse(JSON.stringify(data));
        let res = {};
        for(let n in newFilter){
            res[newFilter[n].key] = newFilter[n].value;
        }
        this.setState({
            filter:res
        })
        this.get_list(1,res);
    }
    export_excel(){
        let filter = this.state.filter;
        let query = [],search="?";
        for(let f in filter){
            query.push(f + "=" + filter[f]);
        }
        search += query.join("&");
        window.open(host+repay_export+search);
    }
    pay_confirm(data){
        this.setState({
            modal:{
                id:data.repaymentId,
                loading:false,
                visible:true
            }
        })
    }
    handleOk(){
        this.setState({
            modal:{
                id:this.state.modal.id,
                loading:true,
                visible:true
            }
        })
        let rqd = {
            repaymentId : this.state.modal.id
        }
        axios.post(repay_confirm,rqd).then((data)=>{
            message.success(data.msg);
            this.get_list(1,this.state.filter);
            this.handleCancel();
        })
    }
    handleCancel(){
        this.setState({
            modal:{
                id:null,
                loading:false,
                visible:false
            }
        })
    }
    page_up(page,pageSize){
        this.get_list(page,this.state.filter);
    }
    render (){
        const pagination = {
            total : this.state.total,
            current : this.state.current,
            pageSize : parseInt(this.state.pageSize,10)+1,
            onChange : this.page_up.bind(this)
        }
        const table_props = {
            scroll:{x: 2000},
            columns:this.columns ,
            dataSource:this.state.data,
            pagination : pagination,
            loading:this.state.loading,
        }
        const modal_props = {
            title : "确认订单",
            visible : this.state.modal.visible,
            onOk : this.handleOk.bind(this),
            onCancel : this.handleCancel.bind(this),
            okText : "确认",
            cancelText : "取消"
        }

        return(
            <div className="Component-body">
                <Row className="path">
                    <Col span={24}>
                        <span className="f2">还款管理&nbsp;&gt;&nbsp;</span><span className="f2">还款通知&nbsp;&gt;&nbsp;</span><span className="f2 text-blue">智尊保业务</span>
                    </Col>
                </Row>
                <Filter data-get={this.get_filter.bind(this)} data-source={this.filter} />
                <Row className="content">
                    <Col span={24} className="text-right">
                        <Button type="primary" loading={this.state.export_loading} onClick={this.export_excel.bind(this)}>&emsp;导出&emsp;</Button>&emsp;
                    </Col>
                </Row>
                <Row className="content">
                    <Table {...table_props} bordered />
                </Row>
                <Modal {...modal_props}>
                    <h3>是否确认订单？</h3>
                </Modal>
            </div>
        )
    }
}

export default review_hs;