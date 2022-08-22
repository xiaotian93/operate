import React, { Component } from 'react';
import { Row, Col, Button } from 'antd';
import moment from 'moment';
import { report_info } from '../../ajax/api';
import { axios_monthly } from '../../ajax/request';
import { bmd } from '../../ajax/tool';
import { page as size, product_list } from '../../ajax/config';
// import Filter from './../ui/Filter_nomal';
// import Path from './../../templates/Path';
import { host_monthly } from '../../ajax/config';
import TableCol from '../../templates/TableCol';
import ListCtrl from '../../controllers/List';
product_list.unshift({ name: "全部", val: "" });

class Amount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: props.index,
            rate: {
            },
            name: "",
            listPage: 1,
            pageSize: size.size,

        };
        this.fifter = {
            "startTime": moment().date(1).subtract(1, 'months').format("YYYY-MM-DD HH:mm:ss"),
            "endTime": moment().date(1).subtract(1, 'days').format("YYYY-MM-DD HH:mm:ss")
        }
    }
    componentWillMount() {
        this.columns = [
            {
                title: '序号',
                dataIndex: 'key',
                render: (text, record, index) => {
                    if (text === "合计") {
                        return text;
                    }
                    return `${index + 1}`
                }
            },
            {
                title: '获贷客户名称',
                width: "15%",
                dataIndex: 'name',
            },
            {
                title: '获贷客户注册明细地址',
                width: "25%",
                dataIndex: 'address',
                render: data => {
                    return data ? data : "-"
                }
            },
            {
                title: '放贷金额',
                dataIndex: 'loanAmount',
                render: data => {
                    return data
                },
                sorter: (a, b) => {
                    return bmd.getSort(a, b, "loanAmount")
                }
            },
            {
                title: '放贷时间',
                dataIndex: 'loanStartDate',
                sorter: (a, b) => {
                    return bmd.getSort(a, b, "loanStartDate", true)
                }
            },
            {
                title: '利率（年化）',
                dataIndex: 'rate',
                render: data => {
                    return data + "%"
                }
            },
            {
                title: '还贷时间',
                dataIndex: 'loanEndDate',
                sorter: (a, b) => {
                    return bmd.getSort(a, b, "loanEndDate", true)
                }
            },
            {
                title: '还贷情况',
                dataIndex: 'statusStr'
            },
            {
                title: '备注',
                dataIndex: 'remark',
                render: (e) => {
                    return e ? e : "-"
                }
            }
        ];
        this.filter = {
            belongService: {
                name: "产品",
                type: "select",
                placeHolder: "选择产品",
                values: product_list
            },
            time: {
                name: "放贷时间",
                type: "range_date",
                feild_s: "startTime",
                feild_e: "endTime",
                placeHolder: ['开始日期', "结束日期"]
            }

        }
    }
    filterItems = [
        {
            name: "产品",
            key: "belongService",
            type: "select",
            placeHolder: "选择产品",
            values: product_list
        },
        {
            name: "放贷时间",
            key: "time",
            type: "range_date",
            feild_s: "startTime",
            feild_e: "endTime",
            placeHolder: ['开始日期', "结束日期"]
        }
    ]
    defaultFilter = {
        "startTime": moment().date(1).subtract(1, 'months').format("YYYY-MM-DD HH:mm:ss"),
        "endTime": moment().date(1).subtract(1, 'days').format("YYYY-MM-DD HH:mm:ss")
    }
    listRequestor(param) {
        param.belongService = param.belongService ? param.belongService : "";
        return axios_monthly.post(report_info, { ...param });
    }
    export_excel() {
        let filters = this.state.filter;
        let param = [];
        for (let f in filters) {
            param.push(f + "=" + filters[f]);
        }
        window.open(host_monthly + "report_customer_info/export_customer_info?" + param.join("&"));
    }
    render() {
        let display_rate = (this.state.index === 2 ? "block" : "none");
        const listProps = {
            items: this.filterItems,
            columns: this.columns,
            defaultFilter: this.defaultFilter,
            bindsetFilter: set => this.setFilter = set,
            listRequestor: this.listRequestor.bind(this)
        }
        return (
            <div>
                {/* <List {...table} /> */}
                <ListCtrl {...listProps}>
                    <Button type="primary" onClick={this.export_excel.bind(this)}>导出</Button>
                </ListCtrl>
                {/* <Filter data-get={this.get_filter.bind(this)} data-set={this.set_filter.bind(this)} data-source={this.filter} /> */}
                <Row style={{ padding: "20px" }}>
                    <Row style={{ background: "#fff" }}>
                        <Row className="content" style={{ display: display_rate }}>
                            <div className="sub-title">此期间利率分析</div>
                            <Col span="8">
                                <TableCol data-source={this.state.rate} data-columns={this.rate} />
                            </Col>
                        </Row>
                    </Row>
                </Row>

            </div>
        )
    }
}

export default Amount;