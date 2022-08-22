import React, { Component } from 'react';
// import moment from 'moment'
import {message, Popconfirm } from 'antd';
// import Filter from '../../ui/Filter_obj8';
import { axios_sh } from '../../../ajax/request';
import { company_list, product_list, get_merchant_list, bd_list, bd_export, bd_crawl, bd_return_begin, bd_return_cancel } from '../../../ajax/api';
import { format_table_data,bmd } from '../../../ajax/tool';
import { host_cxfq } from '../../../ajax/config';
import { browserHistory } from 'react-router';
import Permissions from '../../../templates/Permissions';
import ComponentRoute from '../../../templates/ComponentRoute';
import List from '../../templates/list';
class Borrow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            company_list: '',
            product_list: '',
            merchant_list: '',
            loading: false,
            total: 1,
            current: 1,
            pageSize: 50,
            data: [],
            filter: {},
            button: false,
            more: true
        };
        this.idArr = [];
    }
    componentWillMount() {
        //this.getSelect();
        this.filter = {
            time: {
                name: "签单时间",
                type: "range_date",
                feild_s: "start_sign_date",
                feild_e: "start_end_date",
                placeHolder: ['开始日期', "结束日期"]
            },
            insur_company: {
                name: "保险公司",
                type: "select",
                placeHolder: "全部",
                values: "companys"
            },
            status: {
                name: "保单状态",
                type: "select",
                placeHolder: "全部",
                values: [{ name: "全部", val: "" }, { name: "正常", val: 0 }, { name: "退保", val: -1 }]
            },
            crawler_status: {
                name: "爬取状态",
                type: "select",
                placeHolder: "全部",
                values: [{ name: "全部", val: "" }, { name: "未爬取", val: 0 }, { name: "爬取中", val: 1 }, { name: "爬取成功", val: 2 }, { name: "爬取失败", val: -2 }, { name: "无此结果", val: -1 }, { name: "核对存疑", val: -3 }]
            },
            beneficiary_type: {
                name: "投保人",
                type: "select",
                placeHolder: "全部",
                values: [{ name: "全部", val: 0 }, { name: "智度小贷", val: 2 }, { name: "其他", val: 1 }]
            },
            product: {
                name: "产品名称",
                type: "select",
                placeHolder: "全部",
                values: "products"
            },
            merchant: {
                name: "商户名称",
                type: "select",
                placeHolder: "全部",
                values: "merchants"
            },
            bd_no: {
                name: "保单号",
                type: "text",
                placeHolder: "请输入保单号"
            }
        };
        this.columns = [
            {
                title: "序号",
                dataIndex: "key",
                width: "50px",
                render:(text,record,index)=>{
                    if(text==="合计"){
                        return text;
                    }
                    return `${index+1}`
                }
            },
            {
                title: "关联订单号",
                dataIndex: "orderNo",
                //width:"150px"
            },
            {
                title: "保险公司",
                dataIndex: "insurCompany",
                // width:"100px"
            },
            {
                title: "保单号",
                dataIndex: "bdNo",
                // width:"100px"
            },
            {
                title: "签单日期",
                dataIndex: "signDate",
                // width:"100px",
                render: (e) => {
                    return e ? e : "-";
                },
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"signDate",true)
                }
            },
            {
                title: "起保日期",
                dataIndex: "startDate",
                // width:"100px",
                render: (e) => {
                    return e ? e : "-";
                },
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"startDate",true)
                }
            },
            {
                title: "终保日期",
                dataIndex: "endDate",
                // width:"120px",
                render: (e) => {
                    return e ? e : "-";
                },
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"endDate",true)
                }
            },
            {
                title: "投保人",
                dataIndex: "tbr",
                // width:"100px"
            },
            {
                title: "被保险人",
                // width:"80px",
                dataIndex: "beneficiary"
            },
            {
                title: "商业险",
                dataIndex: "syx",
                // width:"80px",
                render: e => {
                    return e ? e.money() : "-"
                },
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"syx")
                }
            },
            {
                title: "车船税",
                dataIndex: "ccs",
                // width:"80px",
                render: e => {
                    return e ? e.money() : "-"
                },
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"ccs")
                }
            },
            {
                title: "交强险",
                dataIndex: "jqx",
                // width:"80px",
                render: e => {
                    return e ? e.money() : "-"
                },
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"jqx")
                }
            },
            {
                title: "滞纳金",
                dataIndex: "znj",
                // width:"80px",
                render: e => {
                    return e ? e.money() : "-"
                },
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"znj")
                }
            },
            {
                title: "保单状态",
                dataIndex: "status",
                // width:"100px",
                render: e => {
                    return e === 0 ? '正常' : '退保'
                }
            },
            {
                title: "爬取状态",
                dataIndex: "crawlerStatus",
                // width:"100px",
                render: e => {
                    var status = { '0': "未爬取", '1': "爬取中", '2': "爬取成功", '-1': "无此结果 ", '-2': "爬取失败", "-3": "核对存疑" };
                    return status[e]
                }
            },
            //{
            //    title:"产品名称",
            //    dataIndex:"productName",
            //    width:"100px"
            //},
            {
                title: "商户名称",
                dataIndex: "merchantName",
                // width:"100px"
            },
            {
                title: "操作",
                // fixed:"right",
                // width: "100px",
                render: (e) => {
                    var btn = '', btns = "", pdbtn = "";
                    if (e.syx) {
                        if (e.remainValue) {
                            if (!e.preReturnStatus) {
                                btns = <Popconfirm title="发起退保后，到期应还费用将不再自动划扣，确定发起吗？" onConfirm={() => { this.bd_return(e.id, true) }}><Permissions type="primary" size="small" style={{ marginTop: "5px",marginRight:"5px"}} server={global.AUTHSERVER.cxfq.key} permissions={global.AUTHSERVER.cxfq.access.bd_return} tag="button">发起退保</Permissions></Popconfirm>
                                pdbtn = <Permissions type="primary" size="small" onClick={() => { this.pd(e.id) }} style={{ marginTop: "5px"}} server={global.AUTHSERVER.cxfq.key} permissions={global.AUTHSERVER.cxfq.access.bd_endorsement} tag="button">批单</Permissions>
                            } else {
                                btns = <Popconfirm title="取消退保后，到期应还费用将继续自动划扣，确定取消吗？" onConfirm={() => { this.bd_return(e.id, false) }}><Permissions type="danger" size="small" style={{ marginTop: "5px" ,marginRight:"5px" }} server={global.AUTHSERVER.cxfq.key} permissions={global.AUTHSERVER.cxfq.access.bd_return} tag="button">取消退保</Permissions></Popconfirm>
                            }
                            btn = <div>
                                {btns}
                                <Permissions type="primary" size="small" onClick={() => { this.tb(e.id) }} style={{ marginTop: "5px",marginRight:"5px"}} server={global.AUTHSERVER.cxfq.key} permissions={global.AUTHSERVER.cxfq.access.bd_return} tag="button">确认退保</Permissions>
                                
                               {pdbtn}
                            </div>
                        } else {
                            btn = <Permissions type="primary" size="small" onClick={() => { this.pd(e.id) }} style={{ marginTop: "5px" }} server={global.AUTHSERVER.cxfq.key} permissions={global.AUTHSERVER.cxfq.access.bd_endorsement} tag="button">批单</Permissions>
                        }
                    }
                    return (<div>
                        <Permissions onClick={() => { this.detail(e.id) }} server={global.AUTHSERVER.cxfq.key} permissions={global.AUTHSERVER.cxfq.access.bd_detail} tag="button" size="small" src={"/bd/indent/cxfq/detail?id=" + e.id}>查看</Permissions>&emsp;
                        <Permissions type="success" size="small" onClick={() => { this.start_crawl(e.id) }} disabled={this.state.button} server={global.AUTHSERVER.cxfq.key} permissions={global.AUTHSERVER.cxfq.access.bd_crawl} tag="button" style={{ marginTop: "5px" }}>爬取</Permissions>
                        {
                            e.status ? null : btn
                        }




                    </div>)
                }
            }
        ]
    }

    componentDidMount() {
        this.getSelect();
        var select=window.localStorage.getItem(this.props.location.pathname);
        if(select){
            this.get_list(1,JSON.parse(select).remberData);
        }else{
            this.get_list();
        }
    }
    bd_return(id, type) {
        var url = type ? bd_return_begin : bd_return_cancel;
        axios_sh.get(url + "?requestId=" + id).then(e => {
            this.get_list()
        })
    }
    get_list(page_no, filter = {}) {
        this.setState({
            loading: true,
            selectedRowKeys: [],
            selectedRows: []
        });
        let rqd = {
            page: page_no || 1,
            page_size: 50,
            //status:status,
            ...filter
        }
        axios_sh.post(bd_list, rqd).then((data) => {
            var list = data.data;
            this.setState({
                data: format_table_data(list,page_no,50),
                total: data.totalData,
                current: data.current,
                loading: false
            })
        });
    }
    get_filter(data) {
        this.get_list(1, data);
        this.setState({
            filter: data
        });
    }
    page_up(page, pageSize) {
        window.scrollTo(0,0);
        this.get_list(page, this.state.filter);
    }
    filterValue(arr) {
        let res = [{ val: "", name: "全部" }];
        for (let a in arr) {
            res.push({ val: arr[a].name, name: arr[a].name })
        }
        return res;
    }
    getSelect() {
        axios_sh.get(company_list).then(e => {
            this.setState({ company_list: this.filterValue(e.data) })
        });
        axios_sh.get(product_list).then(e => {
            this.setState({ product_list: this.filterValue(e.data) })
        });
        axios_sh.get(get_merchant_list).then(e => {
            this.setState({ merchant_list: this.filterValue(e.data) })
        })
    }
    list_export() {
        let param = this.state.filter;
        let querys = [];
        for (let p in param) {
            querys.push(p + "=" + param[p]);
        }
        window.open(host_cxfq + bd_export + "?" + querys.join("&"))
    }
    start_crawl(id) {
        if (this.state[id]) {
            message.warn('请勿重复操作，请1小时后再次操作。');
            return
        }
        message.success("爬取中");
        this.setState({ button: true });
        axios_sh.get(bd_crawl + "?ids=" + id).then(e => {
            if (!e.code) {
                message.success("爬取成功");
                this.idArr.push(id);
                this.get_list(1, this.state.filter);
                this.setState({ [id]: true, button: false })
            }
        });
        setTimeout(() => { this.setState({ [id]: false }) }, 3600000)
    }
    start_crawl_more() {
        var ids = this.state.selectedRowKeys;
        if (ids.length === 0) {
            message.warn('请先选择订单');
            return;
        }
        for (var i in ids) {
            for (var j in this.idArr) {
                if (ids[i] === this.idArr[j]) {
                    message.warn("已选订单中有刚爬取过的订单，请检查！");
                    return;
                }
            }
        }
        var param = ids.join(",");
        axios_sh.get(bd_crawl + "?ids=" + param).then(e => {
            if (!e.code) {
                message.success("爬取成功");
                this.setState({ selectedRowKeys: [] })

            }
        });
    }
    detail(id) {
        bmd.navigate("/bd/indent/cxfq/detail?id=" + id);
    }
    tb(id) {
        browserHistory.push("/bd/indent/cxfq/tb?id=" + id);
    }
    pd(id) {
        browserHistory.push("/bd/indent/cxfq/pd?id=" + id);
    }
    render() {
        let pagination = {
            total: this.state.total,
            current: this.state.current,
            pageSize: this.state.pageSize,
            onChange: this.page_up.bind(this),
            showTotal:total=>`共${total}条数据`

        };
        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({ selectedRowKeys, selectedRows });
            },
            getCheckboxProps: record => ({
                disabled: record.key === '总计',
                name: record.key
            })
        };
        const table_info = {
            rowKey: "id",
            // scroll:{x:1800},
            rowSelection: rowSelection,
            columns: this.columns,
            dataSource: this.state.data,
            pagination: pagination,
            loading: this.state.loading
        };
        const table={
            filter:{
                "data-get":this.get_filter.bind(this),
                "data-source":this.filter,
                "companys":this.state.company_list,
                "merchants":this.state.merchant_list,
                "products":this.state.product_list,
                "data-paths":this.props.location.pathname,
            },
            tableInfo:table_info,
            tableTitle:{
                left:<span>金额单位：元</span>,
                right:<span>
                    <Permissions type="primary" onClick={this.start_crawl_more.bind(this)} server={global.AUTHSERVER.cxfq.key} permissions={global.AUTHSERVER.cxfq.access.bd_crawl} tag="button">批量爬取</Permissions>&emsp;
                    <Permissions server={global.AUTHSERVER.cxfq.key} permissions={global.AUTHSERVER.cxfq.access.bd_export} tag="button" type="primary" onClick={this.list_export.bind(this)} >导出</Permissions>
                </span>
            }
        }
        return (
            <List {...table} />
            // <div>
            //     <Filter data-get={this.get_filter.bind(this)} data-source={this.filter} companys={this.state.company_list} products={this.state.product_list} merchants={this.state.merchant_list} />
            //     <Row style={{ padding: "20px" }}>
            //         <Row style={{ background: "#fff" }}>
            //             <Row style={{ padding: "15px 22px 0 22px" }}>
            //                 <div className="text-right" style={{ float: "right" }}>
            //                     <Permissions server={global.AUTHSERVER.cxfq.key} roleKey={global.AUTHSERVER.cxfq.role.export} tag="button" type="primary" onClick={this.list_export.bind(this)} >导出</Permissions>
            //                 </div>
            //                 {/* <Button type="primary" onClick={this.list_export.bind(this)} > 导出 </Button>&emsp; */}
            //                 <Button type="primary" onClick={this.start_crawl_more.bind(this)} >批量爬取</Button>
            //             </Row>
            //             <Row className="content">
            //                 <Table {...table_info} bordered />
            //             </Row>
            //         </Row>
            //     </Row>
            // </div>
        )
    }
}

export default ComponentRoute(Borrow);