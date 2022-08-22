import React, { Component } from 'react';
import { Row , Col , Table , Button , Spin } from 'antd';
import moment from 'moment';

import { report_info } from '../../ajax/api';
import { axios_monthly } from '../../ajax/request';
import { format_table_data , format_date } from '../../ajax/tool';
import { page as size , product_list } from '../../ajax/config';
import Filter from './../ui/Filter_nomal';
// import Path from './../../templates/Path';
import TableCol from './../../templates/TableCol';

product_list.unshift({name:"全部",val:""});

class Amount extends Component{
    constructor(props) {
        super(props);
        this.state = {
            index:props.index,
            rate:{
            },
            name:""
        };
    }
    componentWillMount(){
        this.columns = [
            {
                title: '序号',
                dataIndex: 'key',
            },
            {
                title: '获贷客户名称',
                width:"15%",
                dataIndex: 'name',
            },
            {
                title: '获贷客户注册明细地址',
                width:"25%",
                dataIndex: 'address'
            },
            {
                title: '放贷金额(万元)',
                dataIndex: 'loanAmount',
                render:data=>{
                    return data
                }
            },
            {
                title: '放贷时间',
                dataIndex: 'loanStartDate'
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
                dataIndex:'loanEndDate'
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
    }
    // 列表数据
    get_list(page_no , filter={}){
        let data = JSON.parse(JSON.stringify(filter));
        this.setState({
            loading:true
        })
        let rqd = {
            ...data,
            page:page_no,
            size:size.size
        }
        axios_monthly.post(report_info,rqd).then((data)=>{
            let list = data.data;
            this.setState({
                data:format_table_data(list),
                loading:false
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
        this.get_list(1,filter);
    }
    // 设置筛选项默认值
    set_filter(filter){
        let start = moment().date(1).subtract(1,'months');
        let end = moment().date(1).subtract(1,'days');
        filter.props.form.setFieldsValue({"time":[start,end]});
    }
    export_excel(){
        let filters = this.state.filter;
        let param = [];
        for(let f in filters){
            param.push(f+"="+filters[f]);
        }
        window.open("http://yy-support.baimaodai.com/report_customer_info/export_customer_info?"+param.join("&"));
    }
    render(){
        const table_props = {
            columns:this.columns ,
            dataSource:this.state.data,
            pagination : false
        }
        let display_rate = (this.state.index===2?"block":"none")
        return(
            <Spin spinning={this.state.loading}>
                <Filter data-get={this.get_filter.bind(this)} data-set={this.set_filter.bind(this)} data-source={this.filter} />
                <Row style={{padding:"20px"}}>
                <Row style={{background:"#fff"}}>
                <Row className="table-content">
                    <div className="table-btns">
                        <Button type="primary" onClick={this.export_excel.bind(this)}>导出</Button>
                    </div>
                    <Table {...table_props} bordered />
                </Row>
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