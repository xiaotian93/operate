import React, { Component } from 'react';
import { Button, message, Upload, Spin, Modal } from 'antd';
import { browserHistory } from 'react-router';
import { axios_ygd } from '../../../ajax/request';
import { customer_jyd_list, custom_del, dropdown_list ,merchant_img_upload } from '../../../ajax/api';
import { page, host_gyl } from '../../../ajax/config';
import { format_table_data, bmd } from '../../../ajax/tool';
// import Path from './../../../templates/Path';
// import Filter from '../../ui/Filter_obj8';
import ComponentRoute from '../../../templates/ComponentRoute';
import List from '../../templates/list';
import ListBtn from '../../templates/listBtn';
import Permissions from '../../../templates/Permissions';
import ModalJyd from './modal';
class Indent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            source: [],
            loading: true,
            modal: {
                id: null,
                visible: false
            },
            industryInvolved: {},
            scale: {}
        }
    }
    componentWillMount() {
        this.dropdownList();
        this.filter = {
            companyNo: {
                name: "企业ID",
                type: "text",
                placeHolder: "请输入企业ID"
            },
            name: {
                name: "企业名称",
                type: "text",
                placeHolder: "请输入企业名称"
            },
            creditCode: {
                name: "统一社会信用代码",
                type: "text",
                placeHolder: "请输入统一社会信用代码"
            },
            // name :{
            //     name:"企业名称",
            //     type:"text",
            //     placeHolder:"请输入企业名称"
            // }
        };
    }
    componentDidMount() {
        this.columns = [
            {
                title: "序号",
                dataIndex: "key",
                width: 50,
                render: (text, record, index) => {
                    if (text === "合计") {
                        return text;
                    }
                    return `${index + 1}`
                }
            },
            {
                title: "企业ID",
                dataIndex: "companyNo",
                render: (e) => {
                    return e ? e : "-"
                }
            },
            {
                title: "企业名称",
                dataIndex: "name",
                render: (e) => {
                    return e ? e : "-"
                }
            },
            {
                title: "统一社会信用代码",
                dataIndex: "creditCode",
                render: (e) => {
                    return e ? e : "-"
                }
            },
            {
                title: "企业规模",
                dataIndex: "scale",
                render: (e) => {
                    return e ? this.state.scale[e] : "-"
                }
            },
            {
                title: "行业性质",
                dataIndex: "industryInvolved",
                render: (e) => {
                    return e ? this.state.industryInvolved[e] : "-"
                }
            },
            {
                title: "注册时间",
                dataIndex: "createTime",
                render: (e) => {
                    return e ? e : "-"
                },
                sorter: (a, b) => {
                    return bmd.getSort(a, b, "createTime", true)
                }
            },
            {
                title: "操作",
                render: (data) => {
                    var btn = [<Button type="" size="small" onClick={() => { this.go_detail(data.id) }} src={'/kh/gyl/list/detail?companyId=' + data.id}>查看</Button>,
                    <Button type="primary" size="small" onClick={() => { this.go_edit(data.id) }}>编辑</Button>,<Button type="danger" size="small" onClick={() => { this.set_modal(data) }}>删除</Button>
                    ]
                    return <ListBtn btn={btn} />;
                }
            }
        ];
        var select = window.localStorage.getItem(this.props.location.pathname);
        if (select) {
            this.get_list(1, JSON.parse(select).remberData);
        } else {
            this.get_list();
        }
    }
    go_edit(id) {
        browserHistory.push('/kh/jyd/list/edit?companyId=' + id);
    }
    go_detail(id) {
        bmd.navigate('/kh/jyd/list/detail?companyId=' + id);
    }

    go_insert() {
        this.jydChild.show();
    }
    dropdownList() {
        axios_ygd.post(dropdown_list).then((e) => {
            window.localStorage.setItem("dropdownList", JSON.stringify(e.data))
            this.setState({
                industryInvolved: e.data.industryInvolved,
                scale: e.data.scale
            })
        })
    }
    // 获取筛选值
    get_filter(data) {
        let filter = {};
        filter = JSON.parse(JSON.stringify(data));
        this.setState({
            filter: filter
        })
        this.get_list(1, filter);
    }
    get_list(pageNow = 1, filter = {}) {
        let rqd = JSON.parse(JSON.stringify(filter));
        let param = "?";
        param += "page="+ pageNow +"&";
        param += "size="+ page.size+"&";
        for(let fil in rqd){
            param+=fil+"="+rqd[fil]+"&";
        }
        axios_ygd.get(customer_jyd_list+param).then((data) => {
            this.setState({
                source: format_table_data(data.data.list, pageNow, page.size),
                total: data.data.total,
                loading: false,
                current: pageNow
            })
        })
    }
    // 删除订单
    delete() {
        let rqd = {
            companyId: this.state.modal.id
        };
        axios_ygd.post(custom_del, rqd).then(data => {
            message.success("删除成功");
            this.set_modal(false);
            this.get_list();
        })
    }
    set_modal(data) {
        if (data) {
            this.setState({
                modal: {
                    visible: true,
                    id: data.id
                }
            })
        } else {
            this.setState({ modal: { visible: false, id: null } })
        }
    }
    onUpload({file, fileList}) {
        this.setState({ loading: true });
        if(file.status === "done"){
            this.onImport(file.response.data.storageNo,true)
        };
    }
    onImport(storageServiceId,checkDuplicate){
        axios_ygd.post("/manage/company/zip_save",{storageServiceId,checkDuplicate}).then(data=>{
            if(data.code === 1005001001){
                Modal.confirm({
                    title:"重复上传",
                    content:"企业信息已存在，再次导入将覆盖当前企业资料，是否导入？",
                    onOk:e=>Promise.resolve(this.onImport(storageServiceId,false)),
                    onCancel:e=>Promise.resolve(this.setState({loading:false}))
                })
                return;
            }
            message.success("导入成功~");
            this.get_list();
        }).catch(e=>this.setState({loading:false}));
    }
    page_up(page, pageSize) {
        window.scrollTo(0, 0);
        this.get_list(page);
    }
    jyd(child){
        this.jydChild=child;
    }
    render() {
        let pagination = {
            total: this.state.total,
            current: this.state.current,
            pageSize: page.size,
            onChange: this.page_up.bind(this),
            showTotal: total => `共${total}条数据`

        }
        let table_props = {
            columns: this.columns,
            className: "table-sh lg",
            pagination: pagination,
            rowKey: "key",
            dataSource: this.state.source
        }
        let modal_props = {
            title: "删除确认",
            visible: this.state.modal.visible,
            onOk: () => { this.delete(); },
            onCancel: () => { this.set_modal(false); }
        }
        const table = {
            filter: {
                "data-get": this.get_filter.bind(this),
                "data-source": this.filter,
                "data-paths": this.props.location.pathname,
            },
            tableInfo: table_props,
            tableTitle: {
                left: null,
                right: <span style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button type="primary" onClick={this.go_insert.bind(this)}>导入客户</Button>
                </span>
            },
            modalInfo: modal_props,
            modalContext: <p>确定删除订单吗？</p>
        }
        return (<div><Spin spinning={this.state.loading}><List {...table} /></Spin><ModalJyd onRef={this.jyd.bind(this)} list={()=>{this.get_list(this.state.current,this.state.filter)}} /></div>)
    }
}

export default ComponentRoute(Indent);