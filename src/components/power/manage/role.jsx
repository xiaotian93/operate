import React, { Component } from 'react';
import { Button, Modal, Form, Input, Tabs, Table, Checkbox, message, Tooltip } from 'antd';
import { axios_auth } from '../../../ajax/request';
// import { axios_auth } from '../../../ajax/config';
import { power_group_list, power_group_unable, power_group_enable, power_group_add, power_group_detail, power_group_update, power_group_check ,auth_permission} from '../../../ajax/api';
import { page } from '../../../ajax/config';
import { format_table_data, bmd } from '../../../ajax/tool';
import Permissions from '../../../templates/Permissions';
import List from '../../templates/list';
import Btn from '../../templates/listBtn';
import ComponentRoute from '../../../templates/ComponentRoute';
// import dataInfo from "./testData";
import dataInfo from "./data";
const { TabPane } = Tabs;
const CheckboxGroup = Checkbox.Group;
class Loan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkAll: true,
            activeKey:"db",
            // activeKey: "test",
            list: [],
            // dataInfo:dataInfo
        };
        this.loader = [];
    }
    componentWillMount() {
        this.columns = [
            {
                title: '序号',
                dataIndex: 'key',
                render:(text,record,index)=>{
                    if(text==="合计"){
                        return text;
                    }
                    return `${index+1}`
                }
            },
            {
                title: '添加时间',
                dataIndex: 'createTime',
                render: e => (e || "-"),
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"createTime",true)
                }
            },
            {
                title: '角色名',
                dataIndex: "name"
            },
            {
                title: '备注',
                dataIndex: 'desc',
                render: e => {
                    if (e.length > 15) {
                        var text = e.slice(0, 15);
                        return <Tooltip title={e}>{text + "..."}</Tooltip>
                    } else {
                        return e || "-"
                    }
                }
            },
            {
                title: '状态',
                dataIndex: "status",
                render: e => (e ? "停用" : "正常")
            },
            {
                title: '操作',
                render: data => {
                    var datas = data.status ? <Button size="small" type="primary" onClick={(e) => this.changeStatua(data, true)}>启用</Button> : <Button size="small" type="danger" onClick={(e) => this.changeStatua(data, false)}>停用</Button>;
                    var btn = [<Button size="small" type="primary" onClick={(e) => this.edit(data)}>编辑</Button>,
                        datas,
                    <a href={"/power/manage/role/detail?groupId="+data.id } target="blank"><Button size="small">查看</Button></a>]
                    return <Btn btn={btn} />
                }
            }
        ];
        this.filter = {
            name: {
                name: "角色",
                type: "text",
            },
            status: {
                name: "状态",
                type: "select",
                values: [{ name: "正常", val: "0" }, { name: "停用", val: "1" }]
            }
        }
        this.columns_modal = [
            // {
            //     title: "功能模块",
            //     dataIndex: "gnmk",
            //     render: (e, row, index) => {
            //         const obj = {
            //             children: <Checkbox indeterminate={e.type?"":e.noCheck} checked={!e.noCheck} onChange={(check) => { this.check_change(check, index, e.title) }}>
            //                 {e.title}
            //             </Checkbox>,
            //             props: {
            //                 rowSpan: e.span || 0
            //             }
            //         }
            //         return obj
            //     }
            // },
            {
                title: "功能菜单",
                dataIndex: "gncd",
                render: (e, row, index) => {
                    const obj = {
                        children: <Checkbox indeterminate={e.type ? "" : e.noCheck} checked={!e.noCheck} onChange={(check) => { this.check_change(check, index, e.title) }}>
                            {e.title}
                        </Checkbox>,
                        props: {
                            rowSpan: e.span || 0
                        }
                    }
                    return obj
                }
            },
            {
                title: "业务列表",
                dataIndex: "ywlb",
                render: (e, row, index) => {
                    if (!e.title) {
                        return;
                    }
                    return <Checkbox indeterminate={e.type ? "" : e.noCheck} checked={!e.noCheck} onChange={(check) => { this.check_change(check, index) }}>
                        {e.title}
                    </Checkbox>
                }
            },
            {
                title: "功能权限",
                dataIndex: "gnqx",
                render: (e, row, index) => {
                    var arr = [];
                    for (var i in e) {
                        if (!e[i].noCheck) {
                            arr.push(e[i].value)
                        }
                    }
                    if (e.length < 1) {
                        return
                    }
                    console.log(arr)
                    return <CheckboxGroup options={e} value={arr} onChange={(checked) => { this.role_change(checked, e.length, index) }} />
                }
            },
        ]
    }
    componentDidMount() {
        var select=window.localStorage.getItem(this.props.location.pathname);
        if(select){
            this.get_list(1,JSON.parse(select).remberData);
        }else{
            this.get_list();
        }
    }
    role_change(checkedList, length_qx, index) {
        var key = this.state.activeKey;
        var data = dataInfo[key][index].gnqx;
        for (var i in data) {
            if (checkedList.indexOf(data[i].value) === -1) {
                data[i].noCheck = true
            } else {
                data[i].noCheck = false
            }
        }
        var ywlb = dataInfo[key][index].ywlb;
        ywlb.noCheck = !(checkedList.length === length_qx);
        if (checkedList.length < 1) {
            ywlb.type = true;
        } else {
            ywlb.type = false;
        }
        var gncd = dataInfo[key][index].gncd.title;
        var gnmk = dataInfo[key][index].gnmk.title;
        var length = 0;
        var length_arr = [];
        for (var m in dataInfo[key]) {
            if (dataInfo[key][m].gncd.title === gncd) {
                var test = dataInfo[key][m].gnqx;
                length += test.length;
                for (var p in test) {
                    if (!test[p].noCheck) {
                        length_arr.push(test[p].noCheck)
                    }
                }
            }
        }
        for (var j in dataInfo[key]) {
            if (dataInfo[key][j].gncd.title === gncd && dataInfo[key][j].gncd.span) {
                dataInfo[key][j].gncd.noCheck = !(length_arr.length === length)
                dataInfo[key][j].gncd.type = length_arr.length < 1 ? true : false
            }
            // console.log(length, length_arr)

            if (dataInfo[key][j].gnmk.title === gnmk && dataInfo[key][j].gnmk.span) {
                dataInfo[key][j].gnmk.noCheck = !(checkedList.length === length)
                dataInfo[key][j].gnmk.type = (checkedList.length === length)
                // if(checkedList.length<1){
                //     dataInfo[key][j].gnmk.type=true;
                // }else{
                //     dataInfo[key][j].gnmk.type=false;
                // }
            }

        }

        // console.log(checkedList)
        this.setState({
        })
    }
    check_change(e, index, title) {
        var key = this.state.activeKey;
        if (title) {
            for (var k in dataInfo[key]) {
                for (var p in dataInfo[key][k]) {
                    if (dataInfo[key][k][p].title === title && !dataInfo[key][k][p].span) {
                        dataInfo[key][k].gncd.noCheck = !e.target.checked;
                        dataInfo[key][k].gnmk.noCheck = !e.target.checked;
                        dataInfo[key][k].ywlb.noCheck = !e.target.checked;
                        dataInfo[key][k].gncd.type = !e.target.checked;
                        dataInfo[key][k].gnmk.type = !e.target.checked;
                        dataInfo[key][k].ywlb.type = !e.target.checked;
                        var datas = dataInfo[key][k].gnqx;
                        for (var m in datas) {
                            datas[m].noCheck = !e.target.checked
                        }
                    }
                }
            }
        }
        dataInfo[key][index].ywlb.noCheck = !e.target.checked;
        dataInfo[key][index].ywlb.type = !e.target.checked;
        var data = dataInfo[key][index].gnqx;
        for (var i in data) {
            data[i].noCheck = !e.target.checked
        }
        var gncd = dataInfo[key][index].gncd.title;
        var gnmk = dataInfo[key][index].gnmk.title;
        var length = 0;
        var length_arr = [];
        for (let m in dataInfo[key]) {
            if (dataInfo[key][m].gncd.title === gncd) {
                var test = dataInfo[key][m].gnqx;
                length += test.length;
                for (let p in test) {
                    if (!test[p].noCheck) {
                        length_arr.push(test[p].noCheck)
                    }
                }
            }
        }
        for (var j in dataInfo[key]) {
            if (dataInfo[key][j].gncd.title === gncd && dataInfo[key][j].gncd.span) {
                dataInfo[key][j].gncd.noCheck = !(length_arr.length === length)
                dataInfo[key][j].gncd.type = length_arr.length < 1 ? true : false
            }
            if (dataInfo[key][j].gnmk.title === gnmk && dataInfo[key][j].gnmk.span) {
                dataInfo[key][j].gnmk.noCheck = !e.target.checked
                if (title) {
                    dataInfo[key][j].gnmk.type = !e.target.checked
                } else {
                    dataInfo[key][j].gnmk.type = e.target.checked
                }
            }
        }
        this.setState({
        })
    }
    get_list(page_no = 1, filter = {}) {
        let rqd = JSON.parse(JSON.stringify(filter));
        rqd.page = page_no;
        rqd.size = page.size;
        this.setState({
            loading: true
        })
        this.loader.push("list");
        axios_auth.post(power_group_list, rqd).then((data) => {
            this.loader.splice(this.loader.indexOf("list"), 1);
            let detail = format_table_data(data.data.list, page_no, page.size);
            this.setState({
                list: detail,
                loading: this.loader.length > 0,
                pageCurrent: data.data.pageSize,
                pageTotal: data.data.totalRecord
            });
        });
    }
    // 查看详情
    showDetail(data) {
        bmd.navigate("/power/manage/role/detail", { groupId: data.id });
    }
    //编辑
    edit(data) {
        this.setState({
            // visible: true,
            isEdit: true,
            editId: data.id
        })
        axios_auth.post(power_group_detail, { groupId: data.id }).then(e => {
            if (!e.code) {
                var data = e.data;
                this.props.form.setFieldsValue({ name: data.name, desc: data.desc });
                var permissionList = data.permissionList, idArr = [];
                for (var i in permissionList) {
                    idArr.push(permissionList[i].id)
                }
                this.editId(false, idArr)
            }
        })
    }
    editId(info, checked = []) {
        var data = dataInfo;
        for (var i in data) {
            for (var j in data[i]) {
                var arr = data[i][j].gnqx;

                for (var k in arr) {
                    if (info) {
                        arr[k].noCheck = false;
                        data[i][j].gnmk.noCheck = false;
                        data[i][j].gncd.noCheck = false;
                        data[i][j].ywlb.noCheck = false;
                    } else {
                        if (checked.indexOf(arr[k].value) === -1) {

                            arr[k].noCheck = true;
                        } 
                    }
                }
            }
        }
        for (var t in data) {
            for (var m in data[t]) {
                var length = 0;
                var length_arr = [];
                var length_yw = 0;
                var length_arr_yw = [];
                var aa = data[t][m].gncd.title;
                var test=[];
                if (data[t][m].gncd.span) {
                    for (var p in data[t]) {
                        if (data[t][p].gncd.title === aa && !data[t][p].gncd.span) {
                            test = data[t][m].gnqx.concat(data[t][p].gnqx);
                        } else {
                            test = data[t][m].gnqx
                        }
                    }
                }
                //功能菜单
                length = test.length;
                for (let p in test) {
                    if (!test[p].noCheck) {
                        length_arr.push(test[p].noCheck)
                    }
                }

                //业务列表
                var yw = data[t][m].gnqx;
                length_yw = yw.length;
                for (var w in yw) {
                    if (!yw[w].noCheck) {
                        length_arr_yw.push(yw[w].noCheck)
                    }
                }
                data[t][m].ywlb.noCheck = !(length_arr_yw.length === length_yw);
                data[t][m].ywlb.type = length_arr_yw.length < 1 ? true : false;
                if (data[t][m].gncd.span) {
                    data[t][m].gncd.noCheck = !(length_arr.length === length)
                    data[t][m].gncd.type = length_arr.length < 1 ? true : false
                }
            }
        }
        this.setState({visible: !info})
    }
    //改变状态
    changeStatua(data, type) {
        this.setState({
            visible_status: true,
            change_id: data.id,
            change_type: type
        })

    }
    //删除
    delete() {

    }
    // 获取筛选数据
    get_filter(data) {
        let filter = {};
        filter = JSON.parse(JSON.stringify(data));
        this.setState({
            filter: filter
        })
        this.get_list(this.state.listPage, filter);
    }

    // 翻页
    page_up(page, pageSize) {
        window.scrollTo(0,0);
        this.setState({
            listPage: page
        })
        this.get_list(page, this.state.filter);
    }
    // 显示总数
    showTotal() {
        return "共" + this.state.pageTotal + "条数据"
    }
    //新建用户
    addUser() {
        this.setState({
            visible: true,
            isEdit: false
        })
    }
    cancel() {
        this.setState({
            visible: false
        })
        this.editId(true);
        this.props.form.setFieldsValue({ name: "", desc: "" });
    }
    check(data) {
        axios_auth.post(power_group_check, { name: data.target.value }).then(e => {
            if (e.status === -1) {
                message.warn(e.msg);
                this.props.form.setFieldsValue({ name: "" });
            }
        })
    }
    save() {
        this.props.form.validateFieldsAndScroll((err, val) => {
            if (!err) {
                console.log(dataInfo)
                var data = dataInfo, permission = [];
                for (var i in data) {
                    for (var j in data[i]) {
                        // var applicationId = data[i][j].ywlb.applicationId;
                        var arr = data[i][j].gnqx;
                        for (var k in arr) {
                            if (!arr[k].noCheck) {
                                var temp = {
                                    id: arr[k].value,
                                    applicationId:arr[k].applicationId
                                }
                                permission.push(temp);
                            }
                        }
                    }
                }
                if (permission.length < 1) {
                    message.warn("请选择功能权限");
                    return;
                }
                val.permissionListJson = JSON.stringify(permission);
                console.log(val)
                // return;
                if (this.state.isEdit) {
                    val.groupId = this.state.editId;
                }
                axios_auth.post(!this.state.isEdit ? power_group_add : power_group_update, val).then(e => {
                    if (!e.status) {
                        message.success(!this.state.isEdit ? "新建成功" : "修改成功");
                        this.getAuth();
                        this.get_list();
                        this.cancel();
                    }else{
                        message.warn(e.msg)
                    }
                })
            }
        })
    }
    getAuth(){
        axios_auth.get(auth_permission).then(data=>{
            localStorage.setItem("permissions",JSON.stringify(data.data)||"[]");
        })
    }
    tabChange(e) {
        this.setState({
            activeKey: e
        })
    }
    save_status() {
        axios_auth.post(this.state.change_type ? power_group_enable : power_group_unable, { groupId: this.state.change_id }).then(e => {
            message.success("操作成功");
            this.getAuth();
            this.cancel_status();
            this.get_list();
        })
    }
    cancel_status() {
        this.setState({
            visible_status: false
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        if (this.props.children) {
            return this.props.children
        }
        let pagination = {
            total: this.state.pageTotal,
            current: this.state.pageCurrent,
            pageSize: page.size,
            showTotal: this.showTotal.bind(this),
            onChange: this.page_up.bind(this)
        }
        const table_props = {
            rowKey: "key",
            columns: this.columns,
            dataSource: this.state.list,
            footer: () => this.state.totalDes,
            pagination: pagination,
            loading: this.state.loading,
        }
        const table = {
            filter: {
                "data-get": this.get_filter.bind(this),
                "data-source": this.filter,
                "defaultValue": this.state.filter,
                "data-paths":this.props.location.pathname,
            },
            tableInfo: table_props,
            tableTitle: {
                left: <span>查询结果统计：<span style={{ color: "#000" }}>共{this.state.pageTotal}个账号</span></span>,
                right: <Permissions type="primary" onClick={this.addUser.bind(this)} server={global.AUTHSERVER.bmdCashLoan.key} tag="button">
                    新建角色
                </Permissions>
            }
        }
        const modalInfo = {
            title: !this.state.isEdit ? "新建角色" : "编辑角色",
            visible: this.state.visible,
            footer: <div>
                <Button onClick={this.cancel.bind(this)} >取消</Button>
                <Button type="primary" onClick={this.save.bind(this)}>保存</Button>
            </div>,
            closable: false,
            bodyStyle: {
                width: "90%"
            },
            width: "80%"
        }
        const modalStatus = {
            title: null,
            visible: this.state.visible_status,
            footer: <div>
                <Button onClick={this.cancel_status.bind(this)} >取消</Button>
                <Button type="primary" onClick={this.save_status.bind(this)}>确认</Button>
            </div>,
            closable: false
        }
        return (
            <div>
                <List {...table} />
                <Modal {...modalStatus}>
                    {this.state.change_type ? "是否启用？" : "停用后，将不可用该角色对应权限，是否停用"}
                </Modal>
                <Modal {...modalInfo}>
                    <Form className="sh_add" layout="horizontal">
                        <Form.Item label="角色名称" wrapperCol={{ span: 16 }} labelCol={{ span: 24 }}>
                            {getFieldDecorator('name', {
                                rules: [{ max: 15, message: "最多15个字" }, { required: true, message: '请输入角色名称', }
                                ],
                            })(<Input placeholder="支持中英文及字符，最多15个字" onBlur={this.check.bind(this)} />)}
                        </Form.Item>
                        <Form.Item label="备注" wrapperCol={{ span: 16 }} labelCol={{ span: 24 }}>
                            {getFieldDecorator('desc', {
                                rules: [{ max: 50, message: "最多50个字" }],
                                initialValue: ""
                            })(<Input placeholder="支持中英文及字符，最多50个字" />)}
                        </Form.Item>
                    </Form>
                    <div style={{ fontSize: "14px", color: "rgba(0,0,0,0.5)", marginBottom: "8px" }}>权限</div>
                    {
                        dataInfo.test ? <Tabs tabPosition="left" onChange={this.tabChange.bind(this)}>
                            <TabPane tab="测试权限" key="test">
                                <Table columns={this.columns_modal} dataSource={dataInfo.test} pagination={false} bordered />
                            </TabPane>
                        </Tabs> :

                            <Tabs tabPosition="left" onChange={this.tabChange.bind(this)}>
                                <TabPane tab="待办管理" key="db">
                                    <Table columns={this.columns_modal} dataSource={dataInfo.db} pagination={false} bordered />
                                </TabPane>
                                <TabPane tab="支付管理" key="zf">
                                    <Table columns={this.columns_modal} dataSource={dataInfo.zf} pagination={false} bordered />
                                </TabPane>
                                <TabPane tab="借款管理" key="jk">
                                    <Table columns={this.columns_modal} dataSource={dataInfo.jk} pagination={false} bordered />
                                </TabPane>
                                <TabPane tab="还款管理" key="hk">
                                    <Table columns={this.columns_modal} dataSource={dataInfo.hk} pagination={false} bordered />
                                </TabPane>
                                <TabPane tab="资金管理" key="zj">
                                    <Table columns={this.columns_modal} dataSource={dataInfo.zj} pagination={false} bordered />
                                </TabPane>
                                <TabPane tab="产品管理" key="cp">
                                    <Table columns={this.columns_modal} dataSource={dataInfo.cp} pagination={false} bordered />
                                </TabPane>
                                <TabPane tab="客户管理" key="kh">
                                    <Table columns={this.columns_modal} dataSource={dataInfo.kh} pagination={false} bordered />
                                </TabPane>
                                <TabPane tab="商户管理" key="sh">
                                    <Table columns={this.columns_modal} dataSource={dataInfo.sh} pagination={false} bordered />
                                </TabPane>
                                <TabPane tab="保单管理" key="bd">
                                    <Table columns={this.columns_modal} dataSource={dataInfo.bd} pagination={false} bordered />
                                </TabPane>
                                <TabPane tab="数据统计" key="tj">
                                    <Table columns={this.columns_modal} dataSource={dataInfo.tj} pagination={false} bordered />
                                </TabPane>
                                <TabPane tab="贷后管理" key="dh">
                                    <Table columns={this.columns_modal} dataSource={dataInfo.dh} pagination={false} bordered />
                                </TabPane>
                                <TabPane tab="会员管理" key="vip">
                                    <Table columns={this.columns_modal} dataSource={dataInfo.vip} pagination={false} bordered />
                                </TabPane>
                                <TabPane tab="运营管理" key="yy">
                                    <Table columns={this.columns_modal} dataSource={dataInfo.yy} pagination={false} bordered />
                                </TabPane>
                                <TabPane tab="其他权限" key="other">
                                    <Table columns={this.columns_modal} dataSource={dataInfo.other} pagination={false} bordered />
                                </TabPane>
                            </Tabs>
                    }
                </Modal>
            </div>
        )
    }
}

export default ComponentRoute(Form.create()(Loan));
