import React, { Component } from 'react';
import { Row, Button, Table, Modal, Spin, Form, message } from 'antd';
import { merchant_zj_product_list, xjd_product_del, merchant_zj_product_enable } from '../../../../../ajax/api';
import { axios_loan } from '../../../../../ajax/request';
// import Filter from '../../ui/Filter_obj8';
import { format_table_data, accDiv, bmd } from '../../../../../ajax/tool';
import { page } from '../../../../../ajax/config';
import { browserHistory } from 'react-router';
import ComponentRoute from '../../../../../templates/ComponentRoute';
import ListBtn from '../../../../templates/listBtn';
import Permissions from '../../../../../templates/Permissions';
import BmdLimit from '../bmd/limit';
import Limit from './limit/limit';
class Product_cxfq extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filter: {},
            data: [],
            loading: false,
            pageSize: page.size,
            total: 1,
            current: 1,
            visiable: false,
            id: "",
            spin: false,
            singleDayPaymentLimit: 0,
            totalPaymentLimit: 0,
            appKey: props.appKey,
            domain: props.domain,
            appName: props.appName
        };
    }
    componentWillMount() {
        window.localStorage.setItem("detail", "");
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
                title: '子产品新增时间',
                dataIndex: 'createTime',
                sorter: (a, b) => {
                    return bmd.getSort(a, b, "createTime", true)
                }
            },
            {
                title: '子产品编号',
                dataIndex: 'configNo',
            },
            {
                title: '主产品编号',
                dataIndex: 'productCode',
            },
            {
                title: '主产品名称',
                dataIndex: 'productName',
            },
            {
                title: '借款金额范围',
                render: e => {
                    return accDiv(e.minLoanAmount, 100) + "-" + accDiv(e.maxLoanAmount, 100)

                }
            },
            {
                title: '借款期限范围',
                render: e => {
                    var type = { "DAY": "日", "MONTH": "个月", "YEAR": "年" }
                    return e.minLoanPeriod + "-" + e.maxLoanPeriod + type[e.phaseGapUnit];
                },
            },
            {
                title: '支持期数',
                render: e => {
                    return e.supportPhases;
                },
            },
            {
                title: '子产品描述',
                dataIndex: 'desc',
                render: e => e || "--"
            },
            {
                title: '状态',
                // dataIndex: 'statusStr',
                render: (e) => {
                    // if(e.statusStr==="已启用"){
                    //     this.product_user=e.productName
                    // }
                    return <span className={!e.status ? "text-danger" : ""}>{!e.status ? "已停用" : "已启用"}</span>
                }
            },
            {
                title: '最近操作时间',
                dataIndex: 'updateTime',
                sorter: (a, b) => {
                    return bmd.getSort(a, b, "updateTime", true)
                }
            },
            {
                title: '操作',
                width: 180,
                render: (data) => {
                    var btn = [];
                    if (!data.status) {
                        btn.push(<Permissions size="small" type="primary" onClick={() => { this.change_status(data.configNo, true) }} server={global.AUTHSERVER.loan.key} tag="button">启用</Permissions>)
                    } else {
                        btn.push(<Permissions size="small" type="danger" onClick={() => { this.change_status(data.configNo, false,) }} server={global.AUTHSERVER.loan.key} tag="button" >停用</Permissions>)
                    }
                    btn.push(<Permissions size="small" onClick={() => { this.edit(data.configNo) }} type="primary" server={global.AUTHSERVER.loan.key} tag="button" >编辑</Permissions>);
                    btn.push(<Permissions size="small" onClick={() => { this.detail(data) }} server={global.AUTHSERVER.loan.key} tag="button" >查看</Permissions>);
                    return <ListBtn btn={btn} />;
                }

            }
        ];
        this.get_list();
        // this.loan_get();
    }
    get_list(page_no, filter = {}) {
        let data = {
            appKey: this.state.appKey
        };

        this.setState({
            loading: true,
        })
        axios_loan.post(merchant_zj_product_list, data).then((data) => {
            if (!data.code) {
                let list = data.data;
                this.setState({
                    data: format_table_data(list),
                    loading: false,
                    total: data.totalData,
                    current: data.current,
                    cooperator: list.length > 0 ? list[0].cooperator : "",
                })
            }

        });
    }
    page_up(page, pageSize) {
        window.scrollTo(0, 0);
        this.get_list(page, this.state.filter);
    }
    add() {
        browserHistory.push({ pathname: "/cp/project/list/product/add", query: { cooperator: this.state.cooperator, appKey: this.state.appKey, domain: this.state.domain, appName: this.state.appName } });
    }
    edit(id) {
        browserHistory.push({ pathname: "/cp/project/list/product/edit", query: { cooperator: this.state.cooperator, appKey: this.state.appKey, domain: this.state.domain, configNo: id, appName: this.state.appName } });
    }
    detail(id) {
        browserHistory.push({ pathname: "/cp/project/list/product/detail", query: { cooperator: this.state.cooperator, appKey: this.state.appKey, configNo: id.configNo, productCode: id.productCode, appName: this.state.appName } });
    }
    delete() {
        axios_loan.post(xjd_product_del)
    }
    cancel() {
        this.setState({
            visiable: false
        })
    }
    sure(id) {
        this.setState({
            visiable: true,
            id: id
        })
    }

    //停用/启用
    change_status(code, status) {
        this.setState({
            product_code: code,
            product_status: status,
            visiable_status: true
        })
    }
    sure_status() {
        axios_loan.post(merchant_zj_product_enable, { loanConfigNo: this.state.product_code, enable: this.state.product_status }).then(e => {
            if (!e.code) {
                message.success("操作成功");
                this.cancel_status();
                this.get_list();
            } else {
                this.cancel_status();
            }
        })
    }
    cancel_status() {
        this.setState({
            visiable_status: false
        })
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
            rowKey: "configNo",
            columns: this.columns,
            dataSource: this.state.data,
            loading: this.state.loading,
            pagination: pagination,
        }
        const modalInfo = {
            title: "添加商户",
            footer: [
                <Button onClick={this.cancel.bind(this)} key="cancel">取消</Button>,
                <Button type="primary" key="sure">确认添加</Button>
            ],
            visible: this.state.visiable,
            maskClosable: false
        }
        const modalStatua = {
            title: this.state.product_status ? "是否启用" : "是否停用",
            footer: [
                <Button onClick={this.cancel_status.bind(this)} key="cancel">取消</Button>,
                <Button type="primary" key="sure" onClick={this.sure_status.bind(this)}>确定</Button>
            ],
            visible: this.state.visiable_status,
            maskClosable: false,
            closable: false
        }
        // let paths = this.props.location.pathname;

        return (
            <div>
                <Row style={{ padding: "0px" }}>
                    <Spin spinning={this.state.spin}>
                        <Row style={{ background: "#fff" }}>
                            <Row className="content">
                                <div className="product_title">商户名称：{this.state.cooperator}<span style={{ marginLeft: "20px" }}>项目名称：{this.state.appName}</span></div>
                                {/* {this.state.appKey === "cashloan" ? <BmdLimit /> : <Limit appKey={this.state.appKey} />} */}
                                <Limit appKey={this.state.appKey} />
                                <div style={{ float: "left", lineHeight: "28px", background: "#FFFAE5", padding: "0 5px" }}>
                                    金额单位：元
                                </div>
                                <div style={{ textAlign: "right" }}><Permissions type="primary" style={{ marginBottom: "10px" }} onClick={this.add.bind(this)} server={global.AUTHSERVER.loan.key} tag="button" >新增子产品</Permissions></div>
                                <Table {...table_props} bordered rowKey="code" />

                            </Row>

                        </Row>

                    </Spin>
                </Row>
                <Modal {...modalInfo} />
                <Modal {...modalStatua}>
                    <p style={{ fontSize: "14px" }}>{this.state.product_status ? "是否确认启用该产品？" : "是否确认停用该产品？停用后" + this.state.cooperator + "中此产品对应订单将无法进件"}</p>
                </Modal>
                <style>{`
                    .product_title{
                        font-size:16px;
                        color:#000;
                        font-weight:500;
                        margin-bottom:20px
                    }
                `}</style>
            </div>
        )
    }
}
export default ComponentRoute(Form.create()(Product_cxfq));
