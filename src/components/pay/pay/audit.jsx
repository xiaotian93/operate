import React, { Component } from 'react';
// import { Table , Row } from 'antd';

// import Filter from '../../ui/Filter_obj8';
import { axios_payState } from '../../../ajax/request'
import { audit_pay_list, audit_pay_approve, audit_pay_reject } from '../../../ajax/api';
import { page } from '../../../ajax/config';
import { format_table_data, bmd } from '../../../ajax/tool';
import ComponentRoute from '../../../templates/ComponentRoute';
import List from '../../templates/list';
import Btn from '../../templates/listBtn';
import Permissions from '../../../templates/Permissions';
import { Button, Modal, Input, message } from 'antd';
class Borrow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRows: [],
            loading: false,
            total: 1,
            current: 1,
            filter: {},
            pageSize: page.size,
            data: []
        };
    }
    componentWillMount() {
        const status = {
            10: "初始化",
            20: "待回调",
            30: "已成功",
            40: "发送中",
            41: "确认中",
            50: "本地错误",
            51: "本地错误",
            54: "已失败",
            55: "已拒绝",
            60: "已退款"
        }
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
                title: '订单编号',
                dataIndex: 'buOrderId',
            },
            // {
            //     title: '商户订单号',
            //     dataIndex: 'buOrderId',
            // },
            {
                title: '商户号',
                dataIndex: 'merchantId',
            },
            {
                title: '金额',
                dataIndex: "amount",
                render: (data) => {
                    return data ? ((data / 100).toFixed(2)) : "--"
                },
                sorter: (a, b) => {
                    return bmd.getSort(a, b, "amount")
                }
            },
            {
                title: '账户名',
                dataIndex: "accountName"
            },
            {
                title: '银行卡号',
                dataIndex: 'bankCardNumber',

            },
            {
                title: '银行简称',
                dataIndex: 'bankName',
                render: e => e || "--"

            },
            {
                title: '支付通道',
                dataIndex: 'channelName',

            },
            {
                title: '订单创建时间',
                dataIndex: 'createTime',

            },
            {
                title: '支付成功时间',
                dataIndex: 'successTime',
                render: data => bmd.format_time(data) || "--",
                sorter: (at, bt) => bmd.getTimes(at) - bmd.getTimes(bt)
            },
            {
                title: '支付状态',
                dataIndex: 'status',
                render: e => {
                    return status[e]
                }
            },
            {
                title: '备注',
                dataIndex: 'failReason',
                render: e => {
                    return e || "--"
                }

            },
            {
                title: '操作',
                render: e => {
                    var btn = [<Permissions size="small" type="primary" server={global.AUTHSERVER.payGateway.key} tag="button" onClick={() => { this.auditShow(e, true) }} permissions={global.AUTHSERVER.payGateway.access.oper}>通过</Permissions>, <Permissions size="small" type="danger" server={global.AUTHSERVER.payGateway.key} tag="button" onClick={() => { this.auditShow(e, false) }} permissions={global.AUTHSERVER.payGateway.access.oper}>拒绝</Permissions>]
                    return <Btn btn={btn} />
                }
            },
        ];
        this.filter = {
            buOrderId: {
                name: "订单编号",
                type: "text",
                placeHolder: "请输入订单编号"
            },
            accountName: {
                name: "账户名",
                type: "text",
            },
        }
    }
    componentDidMount() {
        var select = window.localStorage.getItem(this.props.location.pathname);
        if (select) {
            this.get_list(1, JSON.parse(select).remberData);
        } else {
            this.get_list();
        }
    }
    //审核
    auditShow(data, audit) {
        this.setState({
            visible: true,
            pgwOrderId: data.pgwOrderId,
            auditType: audit
        })
    }
    audit() {
        if (this.state.auditType) {
            axios_payState.post(audit_pay_approve, { pgwOrderId: this.state.pgwOrderId }).then(e => {
                if (!e.code) {
                    this.cancel()
                    this.get_list();
                }
            })
        } else {
            if (!this.state.comment) {
                message.warn("请输入审核意见");
                return;
            }
            axios_payState.post(audit_pay_reject, { pgwOrderId: this.state.pgwOrderId, comment: this.state.comment }).then(e => {
                if (!e.code) {
                    this.cancel();
                    this.get_list();
                }
            })
        }

    }
    cancel() {
        this.setState({
            visible: false,
            comment: ""
        })
    }
    getComment(e) {
        this.setState({
            comment: e.target.value
        })
    }
    get_list(page_no, filter = {}) {
        let data = JSON.parse(JSON.stringify(filter));
        data.page = page_no || 1;
        data.size = page.size;
        data.status = 10;
        this.setState({
            loading: true,
        })
        axios_payState.post(audit_pay_list, data).then((data) => {
            let list = data.data;
            this.setState({
                data: format_table_data(list.list, page_no, page.size),
                loading: false,
                total: list.total,
                current: list.page,
            })
        });
    }
    get_filter(data) {
        let filter = {};
        filter = JSON.parse(JSON.stringify(data));
        this.setState({
            filter: filter
        })
        this.get_list(1, filter);
    }
    page_up(page, pageSize) {
        window.scrollTo(0, 0);
        this.get_list(page, this.state.filter);
    }
    render() {
        let pagination = {
            total: this.state.total,
            current: this.state.current,
            pageSize: this.state.pageSize,
            onChange: this.page_up.bind(this),
            showTotal: total => `共${total}条数据`

        }
        const table_props = {
            columns: this.columns,
            dataSource: this.state.data,
            pagination: pagination,
            loading: this.state.loading,
        }
        const table = {
            filter: {
                "data-get": this.get_filter.bind(this),
                "data-source": this.filter,
                "data-paths": this.props.location.pathname,
            },
            tableInfo: table_props,
            tableTitle: {
                left: <span>
                    金额单位：元
                </span>,
                right: null
            },
        }
        const modalInfo = {
            visible: this.state.visible,
            title: "审核",
            footer: <div>
                <Button type="primary" size="small" onClick={this.audit.bind(this)}>确认</Button>
                <Button type="danger" size="small" onClick={this.cancel.bind(this)}>取消</Button>
            </div>,
            onCancel: this.cancel.bind(this)
        }
        return (
            <div>
                <List {...table} />
                <Modal {...modalInfo}>{this.state.auditType ? <span>确认通过该订单？</span> : <Input onChange={this.getComment.bind(this)} placeholder="请输入审核意见" value={this.state.comment} />}</Modal>
            </div>
            // <div className="Component-body">
            //     <Filter data-get={this.get_filter.bind(this)} data-source={this.filter} />
            //     <Row className="table-content">
            //         <span>金额单位：元</span>
            //         <Table {...table_props} bordered />
            //     </Row>
            // </div>
        )
    }
}

export default ComponentRoute(Borrow);