import React, { Component } from 'react';
import { Button, Popconfirm, message, Carousel, Modal } from 'antd';
// import Filter from '../../../templates/Filter';
import { axios_zyzj } from '../../../ajax/request';
import { host_zyzj } from '../../../ajax/config';
import { operation_xmcb_list, operation_xmcb_list_child, operation_xmcb_export_child, operation_xmcb_voucher, operation_xmcb_export_list, operation_xmcb_select_app_key, operation_xmcb_select_subject, operation_xmcb_export_raw } from '../../../ajax/api';
import { page } from '../../../ajax/config';
import { bmd } from '../../../ajax/tool';
// import Permissions from '../../../templates/Permissions';
import List from '../../templates/list';
import Btn from "../../templates/listBtn";
import { Table } from 'antd';
import PayModal from './expandable';
class Loan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            filter: {},
            pageTotal: 1,
            pageCurrent: 1,
            pageSize: page.size,
            data: [],
            total: {},
            list: [],
            listPage: 1,
            img:[],
            confirm:true
        };
        this.loader = [];
    }
    componentWillMount() {
        this.columns = [
            {
                title: '账单月',
                dataIndex: "settleMonth",
                render: e => (e || "--")
            },
            {
                title: '合作方',
                dataIndex: 'appKey',
            },
            {
                title: '应结科目',
                dataIndex: 'subject',
                render: e => (e || "--")
            },            
            {
                title: '应付1',
                dataIndex: 'planCost1',
                render: e => bmd.money(e) || "--"
            },
            {
                title: '应付2',
                dataIndex: 'planCost2',
                render: e => bmd.money(e) || "--"
            },
            {
                title: '应付3',
                dataIndex: "planCost3",
                render: e => bmd.money(e) || "--"
            },
            {
                title: '应付4',
                dataIndex: 'planCost4',
                render: (data) => bmd.money(data),
            },
            {
                title: '应付5',
                dataIndex: 'planCost5',
                render: (data) => bmd.money(data),
            },
            {
                title: '应付6',
                dataIndex: 'planCost6',
                render: (data) => bmd.money(data),
            },
            {
                title: '实付',
                dataIndex: 'actualCost',
                render: (data) => bmd.money(data),
            },
            {
                title: '实付时间',
                dataIndex: 'actualCostDate',
                render: (data) => data || "--",
            },
            {
                title: '状态',
                dataIndex: 'status',
                // render:(data)=> bmd.money(data),
            },
            {
                title: '操作',
                render: e => {
                    let arr = [];
                    if (e.status === "待确认") {
                        arr = [
                            <Button type="primary" size="small" onClick={() => { this.export_item(e) }}>下载明细</Button>,
                            <Button type="primary" size="small" onClick={() => { this.pay(e.id,true) }}>确认对账</Button>
                        ]
                    }
                    if (e.status === "待付款") {
                        arr = [
                            <Button type="primary" size="small" onClick={() => { this.export_item(e) }}>下载明细</Button>,
                            <Button type="primary" size="small" onClick={() => { this.pay(e.id,false) }}>确认付款</Button>,
                            <Button type="primary" size="small" onClick={() => { this.get_voucher_url(e.id,false) }}>对账凭证</Button>
                        ]
                    }
                    if (e.status === "已付款") {
                        arr = [
                            <Button type="primary" size="small" onClick={() => { this.export_item(e) }}>下载明细</Button>,
                            <Button type="primary" size="small" onClick={() => { this.get_voucher_url(e.id,false) }}>对账凭证</Button>,
                            <Button type="primary" size="small" onClick={() => { this.get_voucher_url(e.id,true) }}>付款凭证</Button>
                        ]
                    }
                    return <Btn btn={arr} />
                }
            },
        ];
        this.filter = {
            settleMonth: {
                name: "账单月",
                type: "range_month",
                default: ""
            },
            appKey: {
                name: "合作方",
                type: "select",
                values: "appKey"
            },
            subject: {
                name: "应结科目",
                type: "select",
                values: "subject"
            },
        }
    }
    componentDidMount() {
        this.get_select();
        var select = window.localStorage.getItem(this.props.location.pathname);
        if (select && select.isRember) {
            this.get_list(1, JSON.parse(select).remberData);
        } else {
            this.get_list();
        }
    }
    get_select() {
        axios_zyzj.get(operation_xmcb_select_subject).then(e => {
            this.setState({ subject: e.data.list })
        })
        axios_zyzj.get(operation_xmcb_select_app_key).then(e => {
            this.setState({ appKey: e.data.list })
        })
    }
    get_list(page_no = 1, filter = this.state.filter) {
        let rqd = JSON.parse(JSON.stringify(filter));
        var fil = "";
        for (var f in rqd) {
            fil += f + "=" + rqd[f] + "&";
        }
        this.setState({
            loading: true
        })
        this.loader.push("list");
        axios_zyzj.get(operation_xmcb_list + "?" + fil).then((data) => {
            if(!data.code){
                this.setState({
                    data: data.data,
                    loading: false
                });
            }else{
                this.setState({
                    loading: false
                });
            }
            
        });
    }
    // 获取筛选数据
    get_filter(data) {
        let filter = {};
        filter = JSON.parse(JSON.stringify(data));
        this.setState({
            filter: filter
        })
        this.get_list(this.state.listPage, filter);
        // axios_zyzj.get("/test/dddd",{a:1});
        // this.get_total(filter);
    }

    // 翻页
    page_up(page, pageSize) {
        window.scrollTo(0, 0);
        this.setState({
            listPage: page
        })
        this.get_list(page, this.state.filter);
    }
    // 导出列表
    exportList() {
        let query = [];
        for (let f in this.state.filter) {
            query.push(f + "=" + this.state.filter[f]);
        }
        let url = host_zyzj + operation_xmcb_export_list + "?" + query.join("&");
        window.open(url);
    }
    // 导出明细
    exportItem() {
        let query = [];
        for (let f in this.state.filter) {
            query.push(f + "=" + this.state.filter[f]);
        }
        let url = host_zyzj + operation_xmcb_export_child + "?" + query.join("&");
        window.open(url);
    }

    // 显示总数
    showTotal() {
        return "共" + this.state.pageTotal + "条数据"
    }
    expandedRow(record) {
        const columns = [
            {
                title: '账单月',
                dataIndex: "settleMonth",
                render: e => (e || "--")
            },
            {
                title: '合作方',
                dataIndex: 'appKey',
            },  
            {
                title: '资产包',
                dataIndex: 'payMonth',
            },
            {
                title: '应付1',
                dataIndex: 'planCost1',
                render: e => e > 0 ? bmd.money(e) : "--"
            },
            {
                title: '应付2',
                dataIndex: 'planCost2',
                render: e => e > 0 ? bmd.money(e) : "--"
            },
            {
                title: '应付3',
                dataIndex: "planCost3",
                render: e => e > 0 ? bmd.money(e) : "--"
            },
            {
                title: '应付4',
                dataIndex: 'planCost4',
                render: (data) => bmd.money(data),
            },
            {
                title: '应付5',
                dataIndex: 'planCost5',
                render: (data) => bmd.money(data),
            },
            {
                title: '应付6',
                dataIndex: 'planCost6',
                render: (data) => bmd.money(data),
            },
        ]
        return <Table columns={columns} dataSource={this.state[record.id]} pagination={false} rowKey="payMonth" />
    }
    expandedRowData(expanded, record) {
        if(!expanded) return;
        axios_zyzj.get(operation_xmcb_list_child + "?costRecordId=" + record.id).then(e => {
            this.setState({ [record.id]: e.data })
        })
    }
    //下载明细
    export_item(data) {
        if(data.appKey==="乐信-分期乐"){
            window.open(host_zyzj + operation_xmcb_export_raw + "?costRecordId=" + data.id+"&seq=0",1)
            window.open(host_zyzj + operation_xmcb_export_raw + "?costRecordId=" + data.id+"&seq=1",2)
        }else{
            var url = host_zyzj + operation_xmcb_export_raw + "?costRecordId=" + data.id;
            window.open(url);
        }
    }
    // //确认对账
    // confirm(id) {
    //     axios_zyzj.get(operation_xmcb_confirm_child + "?costRecordId=" + id).then(e => {
    //         if (!e.code) {
    //             message.success("确认成功");
    //             this.get_list();
    //         }
    //     })
    // }
    //确认付款
    pay(id,confirm) {
        this.setState({
            costRecordId: id,confirm:confirm
        })
        this.child.setState({ visible: true,confirm:confirm })
    }
    childModal(e) {
        this.child = e;
    }
    //查看凭证
    get_voucher_url(id,pay) {
        axios_zyzj.get(operation_xmcb_voucher + "?costRecordId=" + id).then(e => {
            var data=e.data,temp=[];
            if(pay){
                window.open(data["付款凭证"])
            }else{
                window.open(data["对账凭证"])
            }
            // for(let i in data){
            //     temp.push(<div key={data[i]}><img src={data[i]} /><span>{i}</span></div>);
            // }
            // const carousel=<Carousel>{temp}</Carousel>
            // this.setState({img:carousel,visibleImg:true})
        })
    }
    cancel(){
        this.setState({visibleImg:false,img:[]})
    }
    render() {
        if (this.props.children) {
            return this.props.children
        }
        const table_props = {
            rowKey: "id",
            columns: this.columns,
            dataSource: this.state.data,
            footer: () => this.state.totalDes,
            pagination: false,
            expandedRowRender: this.expandedRow.bind(this),
            defaultExpandAllRows: true,
            onExpand: this.expandedRowData.bind(this),

            loading: this.state.loading,
        }
        const table = {
            filter: {
                "data-get": this.get_filter.bind(this),
                "data-source": this.filter,
                "defaultValue": this.state.filter,
                "data-paths": this.props.location.pathname,
                "subject": this.state.subject,
                "appKey": this.state.appKey
            },
            tableInfo: table_props,
            tableTitle: {
                left: <span>金额单位：元</span>,
                right: <div><Button type="primary" onClick={this.exportList.bind(this)} >导出列表</Button><Button type="primary" onClick={this.exportItem.bind(this)} style={{marginLeft:5}}>导出明细</Button></div>
            }
        }
        // const modal={
        //     visible:this.state.visibleImg,
        //     closable:false,
        //     footer:<Button onClick={this.cancel.bind(this)}>关闭</Button>
        // }
        return (
            <div>
                <List {...table} />
                <PayModal onRef={this.childModal.bind(this)} id={this.state.costRecordId} getList={this.get_list.bind(this)} confirm={this.state.confirm} />
                {/* <Modal {...modal}>{this.state.img}</Modal> */}
                <style>{`
                .ant-carousel .slick-slide {
                    text-align: center;
                    height: 460px;
                    overflow: hidden;
                  }
                  .ant-carousel .slick-slide img{
                    height:90%
                  }
                  .ant-carousel .slick-slide span{
                    line-height:30px
                  }
                  .ant-carousel .slick-slide h3 {
                    color: #fff;
                  }
                  .ant-carousel .slick-dots li button{
                      background:#364d79
                  }
                  .ant-carousel .slick-dots li.slick-active button{
                    background:#364d79
                  }
                `
                }</style>
            </div>

        )
    }
}

export default Loan;
