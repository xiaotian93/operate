import React, { Component } from 'react';
import { Modal, Input, Button, Icon, message } from 'antd';
// import moment from 'moment'
// import Filter from '../../ui/Filter';
import axios from '../../../ajax/request'
import { zzb_audit_first, zzb_tast_approve, zzb_audit_first_export } from '../../../ajax/api';
import { host, page } from '../../../ajax/config';
import { format_table_data ,bmd} from '../../../ajax/tool';
import Permissions from '../../../templates/Permissions';
import ComponentRoute from '../../../templates/ComponentRoute';
import List from '../../templates/list';
import ListBtn from '../../templates/listBtn';
class check_hs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            selectedRows: [],
            loading: false,
            total: 1,
            current: 1,
            pageSize: page.size,
            data: [],
            model: {
                visible: false,
                loading: false,
                title: '确认通过？',
                text: '',
                approved: true,
                id: 0
            },
            companys: []
        };
    }
    componentWillMount() {
        this.columns = [
            {
                title: '序号',
                width: 50,
                dataIndex: 'key',
                render:(text,record,index)=>{
                    if(text==="合计"){
                        return text;
                    }
                    return `${index+1}`
                }
            },
            {
                title: '订单编号',
                // width:300,
                dataIndex: 'orderId',
            },
            {
                title: '订单时间',
                // width:200,
                dataIndex: 'showVo.signTime',
                sorter: (a, b) => {
                    if(a.key==="合计"||b.key==="合计"){
                        return;
                    }
                    return bmd.getTimes(a.showVo.signTime)-bmd.getTimes(b.showVo.signTime)
                }
            },
            {
                title: '借款方',
                // width:250,
                render: (data) => {
                    if (data.showVo.borrowType === 0) {
                        return data.showVo.borrow_info.person.name
                    } else {
                        return data.showVo.borrow_info.company.name
                    }
                }
            },
            // {
            //     title: '联系方式',
            //     render:(data) => {
            //         if(data.showVo.borrowType===0){
            //             return data.showVo.borrow_info.person.phone
            //         }else{
            //             return data.showVo.borrow_info.company.contact
            //         }
            //     }
            // },
            // {
            //     title: '证件号',
            //     width:250,
            //     render:(data) => {
            //         if(data.showVo.borrowType===0){
            //             return data.showVo.borrow_info.person.id
            //         }else{
            //             return data.showVo.borrow_info.company.business_license
            //         }
            //     }
            // },
            {
                title: '借款金额',
                dataIndex: 'showVo.borrow_info.amount',
                sorter: (a, b) => {
                    if(a.key==="合计"||b.key==="合计"){
                        return;
                    }
                    return a.showVo.borrow_info.amount-b.showVo.borrow_info.amount
                }
            },
            // {
            //     title: '商业险金额（元）',
            //     dataIndex: 'showVo.policy_info.fee.commInsurance',
            // },
            // {
            //     title: '借款期限（月）',
            //     dataIndex: 'showVo.borrow_info.loan_period',
            // },
            {
                title: '商户名称',
                dataIndex: 'showVo.business_name',
            },
            {
                title: '产品名称',
                // width:120,
                dataIndex: 'showVo.project_name',
            },
            {
                title: '操作',
                // width:230,
                // fixed: 'right',
                render: (data) => {
                    if (data.key === '总计') {
                        return '';
                    }
                    var btn=[<Button type="primary" size="small" onClick={() => (this.approved(data, true))}>通过</Button>,<Button type="danger" size="small" onClick={() => (this.approved(data, false))}>驳回</Button>,<Button size="small" onClick={() => (this.detail(data.taskId, data.bussiness))}>查看</Button>]
                    return <ListBtn btn={btn} />;
                }
            }
        ];
        this.filter = {
            __ProjectName: {
                name: "产品",
                type: "select",
                placeHolder: "全部",
                values: JSON.parse(localStorage.getItem("select")).zzb_project_name
            },
            __OrderId: {
                name: "订单号",
                type: "text",
                placeHolder: "请输入订单号"
            },
            time: {
                name: "订单时间",
                type: "range_date",
                feild_s: "__SignTime",
                feild_e: "__SignTime",
                placeHolder: ['开始日期', "结束日期"]
            },
            __Borrower: {
                name: "借款方",
                type: "text",
                op: "like",
                placeHolder: "请输入借款方"
            },
            // __BorrowType:{
            //     name:"企业/个人",
            //     type:"select",
            //     placeHolder:"全部",
            //     values:[{
            //         name:"全部",
            //         val:""
            //     },{
            //         name:"个人",
            //         val:0
            //     },{
            //         name:"企业",
            //         val:1
            //     }]
            // }
        }

    }
    componentDidMount() {
        this.get_select();
        // this.get_list();
        let paths = this.props.location.pathname;
        var select = JSON.parse(window.localStorage.getItem(paths));
        if (select) {
            this.get_list(1, select.remberData);
        } else {
            this.get_list();
        }
    }
    get_list(page_no, filter = []) {
        let rqd = {
            page: page_no || 1,
            size: page.size,
            filter: JSON.stringify(filter)
        }
        this.setState({
            loading: true,
            selectedRowKeys: []
        })
        axios.post(zzb_audit_first, rqd).then((data) => {
            let list = this.extract_data(data);
            this.setState({
                data: format_table_data(list, page_no, page.size),
                total: data.totalPage * page.size,
                current: data.currentPage,
                loading: false
            })
        });

    }
    get_select() {
        let select_data = JSON.parse(localStorage.getItem("select"));
        this.setState({
            companys: select_data.companys_require
        })
    }
    extract_data(data) {
        let list = data.data;
        let res = [];
        for (let l in list) {
            let item = JSON.parse(list[l].processVariables.detail);
            // item = JSON.parse(item.detail);
            item.taskId = list[l].id;
            item.bussiness = list[l].processVariables.id;
            //console.log("id："+item.id,"taskId："+item.taskId)
            res.push(item);
        }
        return res;
    }
    get_filter(data) {
        this.get_list(1, data);
        this.setState({
            filter: data
        })
        // let paths = this.props.location.pathname;
        // window.localStorage.setItem(paths, JSON.stringify(data))
    }
    detail(taskId, bussiness) {
        window.open('/db/check/zzb/detail?taskId=' + taskId + '&id=' + bussiness)
    }
    approved(data, pass) {
        this.setState({
            model: {
                approved: pass,
                visible: true,
                title: pass ? '确认所选订单及关联订单通过？' : '确认所选订单及关联订单驳回？',
                text: '',
                id: [data.taskId]
            }
        })
    }
    mouse_enter(event, data, text) {
        let td = event.target;
        if (td.className.indexOf("corner") < 0) {
            return;
        }
        let scroll_ele = td.parentElement.parentElement.parentElement.parentElement;
        this.setState({
            postil: {
                show: "inline-block",
                text: text,
                left: td.offsetLeft + td.clientWidth + 25 - scroll_ele.scrollLeft,
                td: td.offsetTop - scroll_ele.scrollTop + td.clientHeight
            }
        })
    }
    mouse_out(event) {
        let td = event.target;
        if (td.className.indexOf("corner") < 0) {
            return;
        }
        this.setState({
            postil: {
                show: "none",
                text: "",
                left: 10,
                top: 10
            }
        })
    }
    handleOk() {
        this.approve_post(this.state.model.id, this.state.model.approved, this.state.model.text);

    }
    batch_operation(pass) {
        let rows = this.state.selectedRows;
        let ids = [];
        if (rows.length <= 0) {
            message.warn("请选择订单");
            return;
        }
        for (let r in rows) {
            ids.push(rows[r].taskId);
        }
        this.setState({
            model: {
                approved: pass,
                visible: true,
                title: pass ? '确认所选订单及关联订单均通过？' : '确认所选订单及关联订单均被驳回？',
                text: '',
                id: ids
            }
        })
    }
    approve_post(taskIds, approved, comment) {
        let rqd = [];
        if (!approved) {
            if (!comment) {
                message.warn("驳回意见不能为空");
                return;
            }
        }
        rqd.push("approved=" + approved);
        rqd.push("comment=" + comment);
        for (let t in taskIds) {
            rqd.push("taskId=" + taskIds[t]);
        }
        this.setState({
            loading: true
        })
        axios.post(zzb_tast_approve, rqd.join("&")).then((res) => {
            this.setState({
                loading: false
            })
            if (!res.data) {
                this.get_list();
                this.handleCancel();
                message.success(res.msg)
                return;
            }
            let des = "";
            let { orderId, relatedOrderId } = res.data;
            if (approved === false) {
                if (relatedOrderId) {
                    des = "订单" + orderId + "与关联订单" + relatedOrderId + "均被驳回";
                } else {
                    des = "订单已驳回";
                }
            } else {
                if (!relatedOrderId) {
                    des = "订单已通过";
                } else if (res.data.needAudit) {
                    des = "因关联订单" + relatedOrderId + "未审核所选订单暂进入等待状态";
                } else {
                    des = "订单" + orderId + "与关联订单" + relatedOrderId + "均已通过";
                }
            }
            Modal.success({
                title: '',
                content: des,
                okText: '确定'
            });
            this.get_list();
        });
    }
    handleCancel() {
        this.setState({
            model: {
                approved: this.state.model.approved,
                text: this.state.model.text,
                id: this.state.model.id,
                title: this.state.model.title,
                visible: false
            }
        })
    }
    textChange(e) {
        this.setState({
            model: {
                approved: this.state.model.approved,
                text: e.target.value,
                visible: this.state.model.visible,
                title: this.state.model.title,
                id: this.state.model.id,
            }
        })
    }

    page_up(page, pageSize) {
        window.scrollTo(0,0);
        this.get_list(page, this.state.filter);
    }
    show_import() {
        this.setState({
            upload: {
                show: !this.state.upload.show
            }
        });
    }
    get_upload_companyId(id) {
        this.setState({
            upload: {
                companyId: id
            }
        })
    }
    table_export() {
        window.open(host + zzb_audit_first_export + "?filter=" + encodeURI(JSON.stringify(this.state.filter || [])))
    }
    render() {
        const { selectedRowKeys } = this.state;
        let pagination = {
            total: this.state.total,
            current: this.state.current,
            pageSize: this.state.pageSize + 1,
            onChange: this.page_up.bind(this),
            showTotal: total => `共${total}条数据`

        }
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(selectedRowKeys, selectedRows);
                this.setState({ selectedRowKeys, selectedRows });
            },
            getCheckboxProps: record => ({
                disabled: record.key === '总计',
                name: record.key
            }),
        };
        const table_props = {
            // scroll:{x: 2500},
            rowSelection: rowSelection,
            columns: this.columns,
            dataSource: this.state.data,
            pagination: pagination,
            loading: this.state.loading,
        }
        const footer = [
            <Button key="back" onClick={this.handleCancel.bind(this)}>取消</Button>,
            <Button key="submit" type="primary" loading={this.state.loading_model} onClick={this.handleOk.bind(this)}>确认</Button>
        ]
        const model_props = {
            visible: this.state.model.visible,
            confirmLoading: false,
            title: this.state.model.title,
            onOk: this.handleOk.bind(this),
            onCancel: this.handleCancel.bind(this),
            footer: footer
        }

        let upload_items = [];
        for (let c in this.state.companys) {
            upload_items.push(
                <div key={c} className="uploadButton" onClick={() => { this.get_upload_companyId(this.state.companys[c].val) }}><Icon type="folder-add" />&emsp;{this.state.companys[c].name}</div>
            )
        }
        const filter = {
            "data-get": this.get_filter.bind(this),
            "data-source": this.filter,
            "companys": this.state.companys,
            "data-paths":this.props.location.pathname,
        }
        const tableTitle = {
            left: <span>金额单位：元</span>,
            right: <span>
                <Permissions server={global.AUTHSERVER.bfq.key} roleKey={global.AUTHSERVER.bfq.role.normalAuditor} tag="button" type="primary" onClick={(e) => (this.batch_operation(true))}>批量通过</Permissions>&emsp;
                        <Permissions server={global.AUTHSERVER.bfq.key} roleKey={global.AUTHSERVER.bfq.role.normalAuditor} tag="button" type="danger" onClick={(e) => (this.batch_operation(false))}>批量驳回</Permissions>&emsp;
                        <Button type="primary" onClick={this.table_export.bind(this)}>&emsp;导出&emsp;</Button>
            </span>
        }
        const modalContent=<Input placeholder="请输入审批意见" value={this.state.model.text} onChange={this.textChange.bind(this)} />

        return (
            <List filter={filter} isFilter tableTitle={tableTitle} tableInfo={table_props} modalInfo={model_props} modalContent={modalContent} />
            // <div className="Component-body">
                // <Filter data-get={this.get_filter.bind(this)} data-source={this.filter} companys={this.state.companys} />
            //     <Row style={{ padding: "20px" }}>
            //         <Row style={{ background: "#fff" }}>
            //             <Row style={{ padding: "15px 22px 0 22px" }}>

            //                 <Col span={24} className="text-right">
            //                     <Permissions server={global.AUTHSERVER.bfq.key} roleKey={global.AUTHSERVER.bfq.role.normalAuditor} tag="button" type="primary" onClick={(e) => (this.batch_operation(true))}>批量通过</Permissions>&emsp;
            //             <Permissions server={global.AUTHSERVER.bfq.key} roleKey={global.AUTHSERVER.bfq.role.normalAuditor} tag="button" type="danger" onClick={(e) => (this.batch_operation(false))}>批量驳回</Permissions>&emsp;
            //             <Button type="primary" onClick={this.table_export.bind(this)}>&emsp;导出&emsp;</Button>&emsp;
            //         </Col>
            //             </Row>
            //             <Row className="content">
            //                 <Table {...table_props} bordered />
            //             </Row>
            //         </Row>
            //     </Row>

            //     <Modal {...model_props}>
            //         <Input placeholder="请输入审批意见" value={this.state.model.text} onChange={this.textChange.bind(this)} />
            //     </Modal>
            // </div>
        )
    }
}

export default ComponentRoute(check_hs);
