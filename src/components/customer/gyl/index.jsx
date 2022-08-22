import React, { Component } from 'react';
import { Button, message, Upload, Spin, Modal } from 'antd';
import { browserHistory } from 'react-router';
import { axios_gyl } from '../../../ajax/request';
import { custom_list, custom_del, dropdown_list ,merchant_img_upload } from '../../../ajax/api';
import { page, host_gyl } from '../../../ajax/config';
import { format_table_data, bmd } from '../../../ajax/tool';
// import Path from './../../../templates/Path';
// import Filter from '../../ui/Filter_obj8';
import ComponentRoute from '../../../templates/ComponentRoute';
import List from '../../templates/list';
import ListBtn from '../../templates/listBtn';
import Permissions from '../../../templates/Permissions';
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
            creditCode: {
                name: "统一社会信用代码",
                type: "text",
                placeHolder: "请输入统一社会信用代码"
            },
            name: {
                name: "企业名称",
                type: "text",
                placeHolder: "请输入企业名称"
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
                    <Button type="primary" size="small" onClick={() => { this.go_edit(data.id) }}>编辑</Button>,
                    <Button type="danger" size="small" onClick={() => { this.set_modal(data) }}>删除</Button>]
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
        browserHistory.push('/kh/gyl/list/edit?companyId=' + id);
    }
    go_detail(id) {
        bmd.navigate('/kh/gyl/list/detail?companyId=' + id);
    }

    go_insert() {
        browserHistory.push('/kh/gyl/list/edit');
    }
    dropdownList() {
        axios_gyl.post(dropdown_list).then((e) => {
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
        //let rqd = "?";
        //rqd += "page="+ pageNow +"&";
        //rqd += "size="+ page.size;
        //let rqd={};
        rqd.page = pageNow;
        rqd.size = page.size
        axios_gyl.post(custom_list, rqd).then((data) => {
            console.log(data)
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
        axios_gyl.post(custom_del, rqd).then(data => {
            message.success(data.msg);
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
        console.log(file)
        if(file.status === "done"){
            this.onImport(file.response.data.storageNo,true)
        };
    }
    onImport(storageServiceId,checkDuplicate){
        axios_gyl.post("/manage/company/zip_save",{storageServiceId,checkDuplicate}).then(data=>{
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
        let uploadProps = {
            action: host_gyl + merchant_img_upload,
            accept: 'application/zip,application/x-gzip',
            onChange: this.onUpload.bind(this),
            withCredentials: true,
            showUploadList:false,
            // fileList: [],
            // data: {  },
            name: "file"
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
                    <Permissions {...uploadProps} server={global.AUTHSERVER.gyl.key} permissions={global.AUTHSERVER.gyl.access.import} tag={Upload}><Button type="primary">导入客户</Button></Permissions>&emsp;
                    <Button type="primary" onClick={this.go_insert.bind(this)}>新增企业</Button>
                </span>
            },
            modalInfo: modal_props,
            modalContext: <p>确定删除订单吗？</p>
        }
        return <Spin spinning={this.state.loading}><List {...table} /></Spin>
    }
}

export default ComponentRoute(Indent);