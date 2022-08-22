import React, { Component } from 'react';
import { Row, Col, Button, Spin } from 'antd';
import moment from 'moment';

import { rate_structure } from '../../ajax/api';
import { axios_monthly } from '../../ajax/request';
import { format_table_data, bmd } from '../../ajax/tool';
import { host_monthly } from './../../ajax/config';
import List from '../templates/list';
import { ListTip } from '../../views/List';
import Table from '../../views/Table';
class Amount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            provinceStatData: [],
            cityStatData: [],
            performanceRate: "0%",
            rate: {},
            filter: {
                startTime: moment().date(1).subtract(1, 'months').format("YYYY-MM-DD"),
                endTime: moment().date(1).subtract(1, 'days').format("YYYY-MM-DD")
            },
            name: ""
        };
    }
    componentWillMount() {
        this.columns = [
            {
                title: '序号',
                dataIndex: 'key'
            },
            {
                title: '借款主体性质',
                dataIndex: 'classifyName',
            },
            {
                title: '累计投放笔数',
                dataIndex: 'countNum'
            },
            {
                title: '累计发放户数',
                dataIndex: 'countDistinctNum',
            },
            {
                title: '累计投放金额',
                dataIndex: 'sumLoanAmount',
                sorter: (a, b) => {
                    return bmd.getSort(a, b, "sumLoanAmount")
                }
            },
            {
                title: '累计投放占比',
                dataIndex: 'percent'
            },
            {
                title: '贷款余额',
                dataIndex: 'balance',
                sorter: (a, b) => bmd.getSort(a, b, "balance")
            },
            {
                title: "在贷笔数",
                dataIndex: "waitPayOrderNum"
            },
            {
                title: "在贷户数",
                dataIndex: "waitPayDistinctNum"
            }
        ];
        this.rate = {
            "max": {
                name: "最高利率",
                width_key: "40%",
                span_val: 7
            },
            "min": {
                name: "最低利率",
                span_val: 7
            },
            "jiaquan": {
                name: "加权平均利率",
                span_val: 7
            }
        }
        this.item_types = [
            {
                val: "借款主体性质划分",
                name: "主体性质"
            },
            {
                val: "借款额度划分",
                name: "借款额度"
            },
            {
                val: "借款利率划分",
                name: "借款利率"
            },
            {
                val: "借款期限划分",
                name: "借款期限"
            },
            {
                val: "借款行业类型划分",
                name: "行业类型"
            },
            {
                val: "借贷形态划分",
                name: "借贷形态"
            },
            {
                val: "担保方式划分",
                name: "担保方式"
            }
        ]
        this.filter = {
            time: {
                name: "放贷时间",
                type: "range_date_day",
                feild_s: "startTime",
                feild_e: "endTime",
                placeHolder: ['开始日期', "结束日期"]
            },
            itemType: {
                name: "结构类型",
                type: "select",
                placeHolder: "请选择结构类型",
                values: this.item_types
            }
        }
    }
    componentDidMount() {
        var select = window.localStorage.getItem(this.props.location.pathname);
        if (select) {
            this.getList(JSON.parse(select).remberData);
        } else {
            this.getList();
        }
    }
    hasCityAndProvinceTypes = ["借款期限划分", "借款额度划分", "借款利率划分", "借贷形态划分"];
    // 列表数据
    getList(filter = {}) {
        let start = moment().date(1).subtract(1, 'months').format("YYYY-MM-DD");
        let end = moment().date(1).subtract(1, 'days').format("YYYY-MM-DD");
        let data = JSON.parse(JSON.stringify(filter));
        data.startTime = data.startTime ? data.startTime : start;
        data.endTime = data.endTime ? data.endTime : end;
        this.setState({ loading: true });
        Promise.all([
            this.getCityStatDataList(data),
            this.getProvinceStatDataList(data),
            this.getPerformanceRate(data),
        ]).then(([cityStatData, provinceStatData, performanceRate]) => {
            this.setState({ cityStatData, provinceStatData, performanceRate, loading: false })
        }).catch(()=>{
            this.setState({loading:false})
        });
    }
    getPerformanceRate(data) {
        return new Promise((resolve, reject) => {
            axios_monthly.post("/compliance_rate/get", data).then(data => {
                resolve(data.data);
            }).catch(e => reject(e));
        })
    }
    // 市数据统计
    getCityStatDataList(data) {
        return new Promise((resolve, reject) => {
            axios_monthly.post("/month_report/city/get", data).then(resData => {
                let list = resData.data.list[0].monthReportItems;
                let total = resData.data.list[0].sumMonthReportItems;
                list.push(total);
                resolve(list);
            }).catch(e => reject(e))
        })
    }
    // 省统计数据
    getProvinceStatDataList(data) {
        return new Promise((resolve, reject) => {
            axios_monthly.post("/month_report/province/get", data).then(resData => {
                let list = resData.data.list[0].monthReportItems;
                let total = resData.data.list[0].sumMonthReportItems;
                list.push(total);
                resolve(list);
            }).catch(e => reject(e));
        })
    }
    // 利率分析
    getRateData(filter) {
        let data = JSON.parse(JSON.stringify(filter || this.state.filter));
        axios_monthly.post(rate_structure, data).then(data => {
            let obj = data.data;
            for (let o in obj) {
                obj[o] = parseFloat(obj[o]).toFixed(2);
            }
            this.setState({ rate: obj })
        })
    }
    // 获取筛选项
    get_filter(data) {
        this.setState({ filter: data });
        // 列表数据
        this.getList(data);
        // 获取利率
        this.getRateData(data);
    }
    // 设置筛选项默认值
    set_filter(filter) {
        let start = moment().date(1).subtract(1, 'months');
        let end = moment().date(1).subtract(1, 'days');
        filter.setState({ "time": [start, end] })
    }
    exportExcel(type) {
        let filters = this.state.filter;
        let param = [];
        for (let f in filters) {
            param.push(f + "=" + filters[f]);
        }
        let path = "";
        if (type === "city") path = "month_report/city/excel";
        if (type === "province") path = "month_report/province/excel";

        window.open(host_monthly + path + "?" + param.join("&"));
    }
    render() {
        const table_props = {
            columns: this.columns,
            dataSource: format_table_data(this.state.cityStatData),
            pagination: false
        }
        let showRate = this.state.filter.itemType === "借款利率划分";
        let showProvinaceTable = this.hasCityAndProvinceTypes.indexOf(this.state.filter.itemType) >= 0 ? "block" : "none";
        let showLoanStatus = this.state.filter.itemType === "借贷形态划分";
        const table = {
            filter: {
                "data-get": this.get_filter.bind(this),
                "data-source": this.filter,
                "data-set": this.set_filter.bind(this),
                "data-paths": this.props.location.pathname,
            },
            tableInfo: table_props,
            tableTitle: {
                left: <span>金额单位：万元，保留六位小数</span>,
                right: <Button type="primary" onClick={e=>this.exportExcel("city")}>导出</Button>
            }
        }
        return (
            <Spin spinning={this.state.loading}>
                <List {...table}>
                    <div style={{ marginBottom: "10px", display: showRate ? "block" : "none" }}>
                        最高利率：{this.state.rate.max || 0}%  &emsp; 最低利率:{this.state.rate.min || 0}%  &emsp; 加权平均利率：{this.state.rate.jiaquan}%
                    </div>
                    <div style={{ marginBottom: "10px", display: showLoanStatus ? "block" : "none" }}>
                        非展期合同履约率：{this.state.performanceRate}%
                    </div>
                </List>
                <Row style={{ padding: "20px" }}>
                    <Row className="content" style={{ display: showProvinaceTable, background: "#fff" }}>
                        <div style={{ display: "flex", marginBottom: "10px", justifyContent: "space-between" }}>
                            <ListTip text="金额单位：元，保留六位小数" />
                            <Button type="primary" onClick={e=>this.exportExcel("province")}>导出</Button>
                        </div>
                        <div style={{ marginBottom: "10px", display: showRate ? "block" : "none" }}>
                            最高利率：{this.state.rate.max || 0}%  &emsp; 最低利率:{this.state.rate.min || 0}% &emsp; 加权平均利率：{this.state.rate.jiaquan}%
                        </div>
                        <div style={{ marginBottom: "10px", display: showLoanStatus ? "block" : "none" }}>
                            非展期合同履约率：{this.state.performanceRate}%
                        </div>
                        <Col>
                            <Table columns={this.columns} dataSource={format_table_data(this.state.provinceStatData)} pagination={false} />
                        </Col>
                    </Row>
                </Row>
            </Spin>
        )
    }
}

export default Amount;
