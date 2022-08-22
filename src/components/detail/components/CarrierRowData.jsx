import React, { Component } from 'react';
import { Tabs ,Table, Select } from 'antd';

import { axios_risk } from '../../../ajax/request';
import { bmd, format_table_data } from '../../../ajax/tool';
import Panel from '../../../templates/Panel';
import TableLine from '../../../templates/TableLine';

const Option = Select.Option;

class CarrierRowData extends Component{
    constructor(props) {
        super(props);
        this.state = {
            recharges:[]
        };
        // this.appKey = props.appKey;
        // this.appTaskId = props.appTaskId;
    }
    componentWillMount(){
        this.columnsCall = [
            {
                title:"通话时间",
                dataIndex:"time"
            },
            {
                title:"通话类型",
                dataIndex:"location_type"
            },
            {
                title:"地点",
                dataIndex:"location"
            },
            {
                title:"费用",
                dataIndex:"fee"
            },
            {
                title:"通话时长",
                dataIndex:"duration"
            },
            {
                title:"对方号码",
                dataIndex:"peer_number"
            }
        ]
        this.columnsBill = [
            {
                title:"月份",
                dataIndex:"bill_month"
            },
            {
                title:"实际费用",
                dataIndex:"actual_fee",
                render:(data)=>bmd.money(data)
            },
            {
                title:"基础费用",
                dataIndex:"base_fee",
                render:(data)=>bmd.money(data)
            },
            {
                title:"待缴费用",
                dataIndex:"unpaid_fee",
                render:(data)=>bmd.money(data)
            },
            {
                title:"通话费用",
                dataIndex:"voice_fee",
                render:(data)=>bmd.money(data)
            },
            {
                title:"开始日期",
                dataIndex:"bill_start_date"
            },
            {
                title:"结束日期",
                dataIndex:"bill_end_date"
            }
        ]
        this.columnsNet = [
            {
                title:"流量类型",
                dataIndex:"net_type"
            },
            {
                title:"流量归属地",
                dataIndex:"location"
            },
            {
                title:"服务类型",
                dataIndex:"service_name"
            },
            {
                title:"流量",
                dataIndex:"subflow"
            },
            {
                title:"时间",
                dataIndex:"time"
            },
            {
                title:"时长",
                dataIndex:"duration"
            }
        ]
        this.columnsRecharge = [
            {
                title:"充值类型",
                dataIndex:"type"
            },
            {
                title:"金额",
                dataIndex:"amount",
                render:(data)=>bmd.money(data)
            },
            {
                title:"充值时间",
                dataIndex:"recharge_time"
            }
        ]
        this.columnsSmses = [
            {
                title:"服务名称",
                dataIndex:"service_name"
            },
            {
                title:"时间",
                dataIndex:"time"
            },
            {
                title:"费用",
                dataIndex:"fee",
                render:(data)=>bmd.money(data)
            },
            {
                title:"归属地",
                dataIndex:"location"
            },
            {
                title:"对方号码",
                dataIndex:"peer_number"
            },
            {
                title:"发送类型",
                dataIndex:"send_type"
            }
        ]
        this.columnsPakcage = [
            {
                title:"流量",
                dataIndex:"item"
            },
            {
                title:"总量",
                dataIndex:"total"
            },
            {
                title:"已使用",
                dataIndex:"used"
            },
            {
                title:"单位",
                dataIndex:"unit"
            }
        ]
    }
    componentWillReceiveProps(props){
        this.appKey = props.appKey;
        this.appTaskId = props.appTaskId;
        this.carrierReportUrl = props.carrierReportUrl;
        if(this.carrierReportUrl){
            this.getCarrierReport(this.carrierReportUrl);
        }
    }
    componentDidMount(){
    }

    // 获取运营商数据
    getCarrierReport(carrierReportUrl){
        axios_risk.get(carrierReportUrl).then(res=>{
            let detail = JSON.parse(res.data.raw_data);
            console.log("row_data",JSON.parse(res.data.raw_data))
            console.log("report",JSON.parse(res.data.report))
            // 设置通话记录筛选项
            let opts = [],packageOpts = []
            for(let o in detail.calls){
                opts.push(
                    <Option key={o} value={detail.calls[o].bill_month}>{detail.calls[o].bill_month}</Option>
                )
            }

            // 设置流量筛选项
            for(let o in detail.packages){
                packageOpts.push(
                    <Option key={o} value={detail.packages[o].bill_start_date+"&"+detail.packages[o].bill_start_date}>
                        {detail.packages[o].bill_start_date+" "+detail.packages[o].bill_start_date}
                    </Option>
                )
            }
            this.detail = detail;
            this.filterCalls(detail.calls[0].bill_month);
            this.filterNets(detail.nets[0].bill_month);
            this.filterSmses(detail.smses[0].bill_month);
            this.filterPackages(detail.packages[0].bill_start_date+"&"+detail.packages[0].bill_start_date);
            this.setState({
                netsTotal:detail.nets[0].total,
                recharges:detail.recharges,
                bills:detail.bills,
                callOptions:opts,
                packageOptions:packageOpts,
            })
        });

    }
    // 过滤通话记录
    filterCalls(val){
        let list = this.detail.calls.filter((cal)=>cal.bill_month===val);
        this.setState({
            selectCall:val,
            callsList:list[0]?list[0].items:[]
        })
    }
    // 过滤nets
    filterNets(val){
        let list = this.detail.nets.filter((net)=>net.bill_month===val);
        this.setState({
            selectNet:val,
            netsList:list[0]?list[0].items:[]
        })
    }

    // 过滤短信记录
    filterSmses(val){
        let list = this.detail.smses.filter((net)=>net.bill_month===val);
        this.setState({
            selectSmse:val,
            smsesList:list[0]?list[0].items:[]
        })
    }

    // 过滤流量
    filterPackages(val){
        let list = this.detail.packages.filter((pk)=>pk.bill_start_date===val.split("&")[0]);
        this.setState({
            selectPackage:val,
            packagesList:format_table_data(list[0]?list[0].items:[])
        })
    }

    render (){
        let paginationNet = {
            total:this.state.netsTotal
        }
        return(
            <div>
                <Panel title="通话记录">
                    <Select value={this.state.selectCall} style={{marginBottom:"10px",width:"100px"}} placeholder="请选择月份" onChange={this.filterCalls.bind(this)}>
                        { this.state.callOptions }
                    </Select>
                    <Table columns={this.columnsCall} dataSource={this.state.callsList} bordered pagination={false} rowKey="time" />
                </Panel>
                <Panel title="账单">
                    <Table columns={this.columnsBill} dataSource={this.state.bills} bordered pagination={false} rowKey="bill_month" />
                </Panel>
                <Panel title="nets">
                    <Select value={this.state.selectNet} style={{marginBottom:"10px",width:"100px"}} placeholder="请选择月份" onChange={this.filterNets.bind(this)}>
                        { this.state.callOptions }
                    </Select>
                    <Table columns={this.columnsNet} dataSource={this.state.netsList} bordered pagination={paginationNet} rowKey="details_id" />
                </Panel>
                <Panel title="充值记录">
                    <Table columns={this.columnsRecharge} dataSource={this.state.recharges} bordered pagination={false} rowKey="details_id" />
                </Panel>
                <Panel title="短信记录">
                    <Select value={this.state.selectSmse} style={{marginBottom:"10px",width:"100px"}} placeholder="请选择月份" onChange={this.filterSmses.bind(this)}>
                        { this.state.callOptions }
                    </Select>
                    <Table columns={this.columnsSmses} dataSource={this.state.smsesList} bordered pagination={false} rowKey="details_id" />
                </Panel>
                <Panel title="流量记录">
                    <Select value={this.state.selectPackage} style={{marginBottom:"10px",width:"180px"}} placeholder="请选择月份" onChange={this.filterPackages.bind(this)}>
                        { this.state.packageOptions }
                    </Select>
                    <Table columns={this.columnsPakcage} dataSource={this.state.packagesList} bordered pagination={false} />
                </Panel>
            </div>
        )
    }
}

export default CarrierRowData;