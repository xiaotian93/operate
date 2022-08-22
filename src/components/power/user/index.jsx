import React, { Component } from 'react';
import { Button, Modal, Form ,Input} from 'antd';
import { axios_auth } from '../../../ajax/request';
import { power_user_list } from '../../../ajax/api';
import { page } from '../../../ajax/config';
import { format_table_data, bmd } from '../../../ajax/tool';
import List from '../../templates/list';
import Btn from '../../templates/listBtn';
import ComponentRoute from '../../../templates/ComponentRoute';

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
            listPage: 1
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
                title: '账号ID',
                dataIndex: 'id'
            },
            {
                title: '账号名称',
                dataIndex: "login"
            },
            {
                title: '人员姓名',
                dataIndex: 'name'
            },
            {
                title: '手机号',
                dataIndex: 'phoneNo'
            },
            {
                title: '状态',
                dataIndex: "status",
                render: e => (e?"停用":"正常")
            },
            {
                title: '操作',
                render: data => {
                    // var btn=[<Button size="small" type="primary" onClick={(e) => this.edit(data)}>编辑</Button>,
                    // <Button size="small" type="danger" onClick={(e) => this.changeStatua(data)}>停用</Button>,
                    // <Button size="small" type="danger" onClick={(e) => this.delete(data)}>删除</Button>,
                    // <Button size="small" onClick={(e) => this.showDetail(data)}>查看</Button>]
                    var btn=[
                    <a href={"/power/user/list/detail?authAccountId="+data.id}><Button size="small">查看</Button></a>]
                    return <Btn btn={btn} />
                }
            }
        ];
        this.filter = {
            name: {
                name: "人员姓名",
                type: "text",
            },
            phoneNo: {
                name: "手机号",
                type: "text",
            },
            status: {
                name: "状态",
                type: "select",
                values:[{name:"正常",val:"0"},{name:"停用",val:"1"}]
            }
        }
    }
    componentDidMount() {
        var select=window.localStorage.getItem(this.props.location.pathname);
        if(select){
            this.get_list(1,JSON.parse(select).remberData);
        }else{
            this.get_list();
        }
    }
    get_list(page_no = 1, filter = {}) {
        let rqd = JSON.parse(JSON.stringify(filter));
        rqd.page = page_no;
        rqd.size = page.size;
        this.setState({
            loading: true
        })
        this.loader.push("list");
        axios_auth.post(power_user_list, rqd).then((data) => {
            this.loader.splice(this.loader.indexOf("list"), 1);
            let detail = format_table_data(data.data.list, page_no, page.size);
            this.setState({
                list: detail,
                loading: this.loader.length > 0,
                pageCurrent: data.data.page,
                pageTotal: data.data.totalRecord
            });
        });
    }
    // 查看详情
    showDetail(data) {
        bmd.navigate("/power/user/list/detail", { authAccountId: data.id });
    }
    //编辑
    edit(){
        this.setState({
            visible:true
        })
    }
    //改变状态
    changeStatua(){
        
    }
    //删除
    delete(){
        
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
            visible:true
        })
    }
    cancel() {
        this.setState({
            visible:false
        })
    }
    save(){
        this.props.form.validateFieldsAndScroll((err, val)=>{
            if(!err){

            }
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
            pageSize: this.state.pageSize + 1,
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
                right: null
                // <Permissions type="primary" onClick={this.addUser.bind(this)} server={global.AUTHSERVER.bmdCashLoan.key} tag="button">
                //     新建用户
                // </Permissions>
            }
        }
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 4 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 16 },
            },
            colon:false
          };
        const modalInfo={
            title:"新建用户",
            visible:this.state.visible,
            footer:<div>
                <Button onClick={this.cancel.bind(this)} >取消</Button>
                <Button type="primary" onClick={this.save.bind(this)}>保存</Button>
            </div>,
            closable:false
        }
        return (
            <div>
                <List {...table} />
                <Modal {...modalInfo}>
                    <Form className="sh_add">
                        <Form.Item label="用户姓名" {...formItemLayout}>
                            {getFieldDecorator('email', {
                                rules: [{pattern:/^[a-zA-Z\u4e00-\u9fa5（）()]{1,50}$/,message:"格式错误"},{required: true,message: '请输入用户姓名',}
                                ],
                            })(<Input placeholder="请输入用户姓名" />)}
                        </Form.Item>
                        <Form.Item label="账号" {...formItemLayout}>
                            {getFieldDecorator('email', {
                                rules: [{pattern:/^[a-zA-Z0-9]{1,50}$/,message:"格式错误"},{required: true,message: '请输入账号',}
                                ],
                            })(<Input placeholder="支持数字、字母，不区分大小写" />)}
                        </Form.Item>
                        <Form.Item label="手机号" {...formItemLayout}>
                            {getFieldDecorator('email', {
                                rules: [{pattern:/(^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9]|16[6]|17[0135678]|19[89])\d{8}$)/,message:"格式错误"},{required: true,message: '请输入手机号',}
                                ],
                            })(<Input placeholder="请输入11位手机号" />)}
                        </Form.Item>
                        <Form.Item label="登录密码" {...formItemLayout}>
                            {getFieldDecorator('email', {
                                rules: [{pattern:/^[a-zA-Z0-9]{6,18}$/,message:"格式错误"},{required: true,message: '请输入登录密码',}
                                ],
                            })(<Input placeholder="6-18位字母、数字，不区分大小写" />)}
                        </Form.Item>
                        <Form.Item label="登录密码" {...formItemLayout}>
                            {getFieldDecorator('email', {
                                rules: [{pattern:/^[a-zA-Z0-9]{6,18}$/,message:"格式错误"},{required: true,message: '请输入登录密码',}
                                ],
                            })(<Input placeholder="6-18位字母、数字，不区分大小写" />)}
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}

export default ComponentRoute(Form.create()(Loan));
