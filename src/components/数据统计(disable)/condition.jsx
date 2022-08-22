import React, { Component } from 'react';
import { Row , Col , Button , Spin } from 'antd';
import moment from 'moment';

import { report_info } from '../../ajax/api';
import { axios_monthly } from '../../ajax/request';
import { format_table_data , format_date ,bmd} from '../../ajax/tool';
import { page as size , product_list } from '../../ajax/config';
// import Filter from './../ui/Filter_nomal';
// import Path from './../../templates/Path';
import {host_monthly} from '../../ajax/config';
import TableCol from '../../templates/TableCol';
import List from '../templates/list';
product_list.unshift({name:"全部",val:""});

class Amount extends Component{
    constructor(props) {
        super(props);
        this.state = {
            index:props.index,
            rate:{
            },
            name:"",
            listPage:1,
            pageSize:size.size,
            
        };
        this.fifter={
            "startTime":moment().date(1).subtract(1,'months').format("YYYY-MM-DD HH:mm:ss"),
            "endTime":moment().date(1).subtract(1,'days').format("YYYY-MM-DD HH:mm:ss")
        }
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
                title: '获贷客户名称',
                width:"15%",
                dataIndex: 'name',
            },
            {
                title: '获贷客户注册明细地址',
                width:"25%",
                dataIndex: 'address',
                render:data=>{
                    return data?data:"-"
                }
            },
            {
                title: '放贷金额',
                dataIndex: 'loanAmount',
                render:data=>{
                    return data
                },
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"loanAmount")
                }
            },
            {
                title: '放贷时间',
                dataIndex: 'loanStartDate',
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"loanStartDate",true)
                }
            },
            {
                title: '利率（年化）',
                dataIndex: 'rate',
                render:data=>{
                    return data+"%"
                }
            },
            {
                title:'还贷时间',
                dataIndex:'loanEndDate',
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"loanEndDate",true)
                }
            },
            {
                title:'还贷情况',
                dataIndex:'statusStr'
            },
            {
                title:'备注',
                dataIndex:'remark',
                render:(e)=>{
                    return e?e:"-"
                }
            }
        ];
        this.filter = {
            belongService:{
                name:"产品",
                type:"select",
                placeHolder:"选择产品",
                values:product_list
            },
            time:{
                name:"放贷时间",
                type:"range_date",
                feild_s:"startTime",
                feild_e:"endTime",
                placeHolder:['开始日期',"结束日期"]
            }
            
        }
    }
    componentDidMount(){
        var select=window.localStorage.getItem(this.props.location.pathname);
        if(select){
            this.get_list(1,JSON.parse(select).remberData);
        }else{
            this.get_list(1,this.fifter);
        }
        

    }
    // 列表数据
    get_list(page_no , filter={}){
        let data = JSON.parse(JSON.stringify(filter));
        data.belongService = data.belongService?data.belongService:"";
        this.setState({
            loading:true
        })
        let rqd = {
            ...data,
            page:page_no||1,
            size:size.size
        }
        axios_monthly.post(report_info,rqd).then((data)=>{
            let list = data.data;
            this.setState({
                data:format_table_data(list,page_no,size.size),
                loading:false,
                pageTotal:data.total,
                pageCurrent:data.current
            })
        });
    }
    // 获取筛选项
    get_filter(data){
        let filter = {};
        let dates = ["startTime","endTime"];
        for(let d in data){
            if(dates.includes(d)){
                filter[d] = format_date(moment(data[d]));
                continue;
            }
            filter[d] = data[d];
        }
        filter.belongService = filter.belongService?filter.belongService:"";
        this.setState({
            filter:filter
        })
        // 列表数据
        this.get_list(this.state.listPage,filter);
    }
    // 设置筛选项默认值
    set_filter(filter){
        let start = moment().date(1).subtract(1,'months');
        let end = moment().date(1).subtract(1,'days');
        // filter.props.form.setFieldsValue({"time":[start,end]});
        filter.setState({
            "time":[start,end]
        })
    }
    export_excel(){
        let filters = this.state.filter;
        let param = [];
        for(let f in filters){
            param.push(f+"="+filters[f]);
        }
        window.open(host_monthly+"report_customer_info/export_customer_info?"+param.join("&"));
    }
    showTotal(){
        return "共"+this.state.pageTotal+"条数据"
    }
    // 翻页
    page_up(page,pageSize){
        window.scrollTo(0,0);
        this.setState({
            listPage:page
        })
        this.get_list(page,this.state.filter);
    }
    render(){
        let pagination = {
            total : this.state.pageTotal,
            current : this.state.pageCurrent,
            pageSize : this.state.pageSize,
            showTotal:this.showTotal.bind(this),
            onChange : this.page_up.bind(this)
        }
        const table_props = {
            columns:this.columns ,
            dataSource:this.state.data,
            pagination : pagination
        }
        let display_rate = (this.state.index===2?"block":"none");
        const table={
            filter:{
                "data-get":this.get_filter.bind(this),
                "data-source":this.filter,
                "data-set":this.set_filter.bind(this),
                "data-paths":this.props.location.pathname,
            },
            tableInfo:table_props,
            tableTitle:{
                left:<span>金额单位：万元</span>,
                right:<Button type="primary" onClick={this.export_excel.bind(this)}>导出</Button>
            }
        }
        return(
            <Spin spinning={this.state.loading}>
                <List {...table} />
                {/* <Filter data-get={this.get_filter.bind(this)} data-set={this.set_filter.bind(this)} data-source={this.filter} /> */}
                <Row style={{padding:"20px"}}>
                <Row style={{background:"#fff"}}>
                {/* <Row style={{margin:"15px 22px"}}>
                    <div className="text-right" style={{marginBottom:"10px"}}>
                        <Button type="primary" onClick={this.export_excel.bind(this)}>导出</Button>
                    </div>
                    <Table {...table_props} bordered />
                </Row> */}
                
                <Row className="content" style={{display:display_rate}}>
                    <div className="sub-title">此期间利率分析</div>
                    <Col span="8">
                        <TableCol data-source={this.state.rate} data-columns={this.rate} />
                    </Col>
                </Row>
                </Row>
                </Row>
                
            </Spin>
        )
    }
}

export default Amount;