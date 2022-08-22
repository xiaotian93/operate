import React, { Component } from 'react';
import { Row, Button, Table, Modal, Spin, Form, message } from 'antd';
import { merchant_online_bind_list, merchant_online_app_list, merchant_online_app_add ,merchant_online_app_del,merchant_online_sync_all_data} from '../../../ajax/api';
import { axios_online } from '../../../ajax/request';
import { format_table_data } from '../../../ajax/tool';
import { page } from '../../../ajax/config';
import Permissions from '../../../templates/Permissions';
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
            app_list: [],
            selectedRowKeys: [],
            selectedRowKeys_default: []
        };
    }
    componentWillMount() {
        this.columns = [
            {
                title: '序号',
                dataIndex: 'key'

            },
            {
                title: '项目名称',
                render:e=>{
                    return e.simpleLoanApp.appName||e.simpleLoanApp.appKey
                }
            },
            {
                title: '关联时间',
                dataIndex: 'createTime'

            },
            {
                title: '操作',
                width: 180,
                render: (data) => {
                    return <div><Permissions type="primary" size="small" onClick={() => { this.history_show(data) }} server={global.AUTHSERVER.bmdOnline.key} permissions={global.AUTHSERVER.bmdOnline.access.merchant_sync_all_dada} tag="button" style={{ marginRight: "5px" }}>同步历史数据</Permissions><Permissions type="danger" size="small" onClick={() => { this.del_show(data) }} server={global.AUTHSERVER.bmdOnline.key} permissions={global.AUTHSERVER.bmdOnline.access.merchant_project_delete} tag="button">删除</Permissions></div>
                }

            }
        ];
        this.columns_app = [
            {
                title: "序号",
                dataIndex: "key"
            },
            {
                title: "项目名称",
                render: (e) => {
                    return e.appName || e.appKey
                }
            }
        ]

        this.get_list();
        this.get_app();
    }
    all_data(){
        var param={
            merchantNo:this.props.merchantNo,
            appKey:this.state.history_data.appKey,
            productKey:this.state.history_data.productKey
        }
        axios_online.post(merchant_online_sync_all_data,param).then(e=>{
            // if(!e.code){
                this.cancel_history();
            // }
        })
    }
    get_app() {
        axios_online.post(merchant_online_app_list).then(e => {
            this.setState({
                app_list: format_table_data(e.data)
            })
        })
    }
    get_list() {
        let data = { merchantNo: this.props.merchantNo };
        this.setState({
            loading: true,
        })
        axios_online.post(merchant_online_bind_list, data).then((data) => {
            let list = data.data, arr = [];
            for (var i in list) {
                arr.push(list[i].simpleLoanApp.id);
            }
            this.setState({
                data: format_table_data(list),
                loading: false,
                total: data.totalData,
                current: data.current,
                selectedRowKeys: arr,
                selectedRowKeys_default: arr
            })
        });
    }
    page_up(page, pageSize) {
        this.get_list(page, this.state.filter);
    }
    add() {
        this.setState({
            visiable: true
        })
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
    select(rowKeys, rows) {
        this.setState({
            selectedRowKeys: rowKeys,
            loanAppList: rows
        })
    }
    select_change(record, selected, selectedRows, nativeEvent) {
        var id = record.id;
        if (this.state.selectedRowKeys_default.indexOf(id) !== -1 && !selected) {
            message.warn('已关联项目无法取消');
            this.setState({
                selectedRowKeys: this.state.selectedRowKeys,
            })
        }

    }
    //项目关联
    add_app() {
        var list = [];var applist=this.state.loanAppList;
        for (var i in applist) {
            delete applist[i].key;
            if (this.state.selectedRowKeys_default.indexOf(applist[i].id) === -1) {
                list.push(applist[i])
            }
        }
        var param = {
            merchantNo: this.props.merchantNo,
            loanAppList: JSON.stringify(list)
        }
        axios_online.post(merchant_online_app_add, param).then(e=>{
            if(!e.code){
                message.success("关联成功");
                this.cancel();
                this.get_list();
            }
        })
    }
    //del
    del_show(data){
        this.setState({
            visiable_del:true,
            del_data:data
        })
    }
    del_app(){
        var param={
            merchantNo:this.props.merchantNo,
            appKey:this.state.del_data.appKey,
            productKey:this.state.del_data.productKey
        }
        axios_online.post(merchant_online_app_del,param).then(e=>{
            if(!e.code){
                message.success("删除成功");
                this.cancel_del();
                this.get_list();
            }
        })
    }
    cancel_del(){
        this.setState({
            visiable_del:false,
        })
    }
    //history
    history_show(data){
        this.setState({
            visiable_history:true,
            history_data:data
        })
    }
    cancel_history(){
        this.setState({
            visiable_history:false,
        })
    }
    render() {
        // let pagination = {
        //     total: this.state.total,
        //     current: this.state.current,
        //     pageSize: this.state.pageSize,
        //     onChange: this.page_up.bind(this),
        //     showTotal: total => `共${total}条数据`
        // }
        const table = {
            columns: this.columns,
            dataSource: this.state.data,
            loading: this.state.loading,
            pagination: false,
            rowKey: "id"
        }
        const modalInfo = {
            title: "请选择需要关联的项目",
            footer: [
                <Button onClick={this.cancel.bind(this)} key="cancel">取消</Button>,
                <Button type="primary" onClick={() => { this.add_app() }} key="sure">新增</Button>
            ],
            visible: this.state.visiable,
            maskClosable: false,
            closable:false
        }
        const modalDel={
            title: null,
            footer: [
                <Button onClick={this.cancel_del.bind(this)} key="cancel">取消</Button>,
                <Button type="primary" onClick={() => { this.del_app() }} key="sure">删除</Button>
            ],
            visible: this.state.visiable_del,
            maskClosable: false,
            closable:false
        }
        const modalHistory={
            title: null,
            footer: [
                <Button onClick={this.cancel_history.bind(this)} key="cancel">取消</Button>,
                <Button type="primary" onClick={() => { this.all_data() }} key="sure">确定</Button>
            ],
            visible: this.state.visiable_history,
            maskClosable: false,
            closable:false
        }
        // let paths = this.props.location.pathname;
        const app_table = {
            columns: this.columns_app,
            dataSource: this.state.app_list,
            rowKey: "id",
            rowSelection: {
                selectedRowKeys: this.state.selectedRowKeys,
                onChange: this.select.bind(this),
                onSelect: this.select_change.bind(this)
            },
            pagination: false,
            bodyStyle: {
                height: "300px",
                overflowY: "auto"
            }
        }
        return (
            <div>
                <Row style={{ padding: "20px", background: "#fff" }}>
                    <Spin spinning={this.state.spin}>
                        {/* <Row style={{ background: "#fff" }}> */}
                        {/* <Row className="content"> */}
                        <Permissions type="primary" size="small" style={{ marginBottom: "10px" }} onClick={this.add.bind(this)} server={global.AUTHSERVER.bmdOnline.key} permissions={global.AUTHSERVER.bmdOnline.access.merchant_project_add} tag="button">添加项目</Permissions>

                        <Table {...table} bordered />
                        {/* </Row> */}

                        {/* </Row> */}
                    </Spin>
                </Row>
                <Modal {...modalInfo}>
                    <Table {...app_table} bordered />
                </Modal>
                <Modal {...modalDel}>
                    是否删除与此项目的关联？
                </Modal>
                <Modal {...modalHistory}>
                    是否同步历史数据？
                </Modal>
            </div>
        )
    }
}
export default Form.create()(Product_cxfq);