import React, { Component } from 'react';
import { Button, Modal, Form, Select,Checkbox, message} from 'antd';
import { merchant_online_list, transfer_status,merchant_online_add_list ,merchant_online_add_merchant} from '../../../ajax/api';
import { axios_online } from '../../../ajax/request';
// import Filter from '../../ui/Filter_obj8';
import { format_table_data ,bmd} from '../../../ajax/tool';
import { page } from '../../../ajax/config';
import { browserHistory } from 'react-router';
import Permissions from '../../../templates/Permissions';
import ComponentRoute from '../../../templates/ComponentRoute';
import List from '../../templates/list';
import ListBtn from '../../templates/listBtn';
const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
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
            merchant:[]
        };
    }
    componentWillMount() {
        window.localStorage.setItem("detail", "");
        this.filter = {

            time: {
                name: "添加时间",
                type: "range_date_day",
                feild_s: "beginDate",
                feild_e: "endDate",
                placeHolder: ['开始日期', "结束日期"]
            },
            name: {
                name: '商户全称/简称',
                type: 'text',
                placeHolder: '请输入商户名称/简称'
            },
            channelName: {
                name: '所属渠道',
                type: 'select',
                placeHolder: '请选择所属渠道',
                values: [{ val: "", name: "全部" }, { val: "自有", name: "自有" }, { val: "贰法", name: "贰法" }, { val: "全旗", name: "全旗" }, { val: "传驹", name: "传驹" }, { val: "君正科迅", name: "君正科迅" }, { val: "上时针", name: "上时针" }, { val: "三七网络", name: "三七网络" }, { val: "汉鹰", name: "汉鹰" }]
            }
        };
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
                title: '商户ID',
                dataIndex: 'merchantNo',
            },
            {
                title: '添加时间',
                dataIndex: 'createTime',
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"createTime",true)
                }

            },
            {
                title: '商户简称',
                dataIndex:"shortName"

            },
            {
                title: '所属渠道',
                dataIndex: 'channelName',

            },
            {
                title: '商户类型',
                dataIndex: 'merchantType'

            },
            {
                title: '关联项目',
                render: e => {
                    var data=e.simpleLoanAppList;
                    var tem=[];
                    for(var i in data){
                        if(data[i].appName){
                            tem.push(data[i].appName)
                        }
                    }
                    return tem.join(",")||"--"
                }

            },
            {
                title: '操作',
                width: 180,
                render: (data) => {
                    var btn=[];
                    if(data.status === 1){
                        btn.push(<Permissions type="primary" size="small" onClick={() => { this.audit(data.merchantNo, data.data, true, data.id) }} server={global.AUTHSERVER.bmdOnline.key} tag="button">删除</Permissions>)
                    }
                    btn.push(<Permissions size="small" onClick={() => { this.audit(data.merchantNo, data.data, false, data.id) }} server={global.AUTHSERVER.bmdOnline.key} permissions={global.AUTHSERVER.bmdOnline.access.merchant_detail} tag="button">查看</Permissions>);
                    return <ListBtn btn={btn} />;
                }

            }
        ];
        var select=window.localStorage.getItem(this.props.location.pathname);
        if(select){
            this.get_list(1,JSON.parse(select).remberData);
        }else{
            this.get_list();
        }
        axios_online.get(merchant_online_add_list).then(e=>{
            if(!e.code){
                var data=e.data;
                this.setState({
                    merchant:data
                })
            }
        })
    }
    get_filter(data) {
        this.setState({
            filter: data
        })
        this.get_list(1, data)
    }
    get_list(page_no, filter = {}) {
        let data = JSON.parse(JSON.stringify(filter));
        data.page = page_no || 1;
        data.size = page.size;
        if (JSON.stringify(filter) === "{}") {
            // data.status="1";
        }
        this.setState({
            loading: true,
        })
        axios_online.post(merchant_online_list, data).then((data) => {
            let list = data.data;
            this.setState({
                data: format_table_data(list),
                loading: false,
                // total: data.totalData,
                // current: data.current
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
    audit(accountId, data, audits, id) {
        
            browserHistory.push("/sh/online/details?accountId=" + accountId + "&audits=" + audits + "&id=" + id);
        


    }
    changeState(id, status) {
        axios_online.get(transfer_status + "?id=" + id + "&targetStatus=" + status).then((e) => {
            if (!e.code) {
                this.setState({
                    visiable: false
                })
                this.get_list()
            }
        });

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
    onOk(){
        this.props.form.validateFields((err,val)=>{
            if(!err){
                val.merchantType=val.merchantType.join(",")
                console.log(val)
                axios_online.post(merchant_online_add_merchant,val).then(e=>{
                    if(!e.code){
                        message.success("添加成功");
                        this.cancel();
                        this.get_list();
                    }
                })
            }
            
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formInfo = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
            colon: true
        };
        // let pagination = {
        //     total: this.state.total,
        //     current: this.state.current,
        //     pageSize: this.state.pageSize,
        //     onChange: this.page_up.bind(this),
        //     showTotal: total => `共${total}条数据`
        // }
        const table_props = {
            columns: this.columns,
            dataSource: this.state.data,
            loading: this.state.loading,
            pagination: false,
            rowKey: "id"
        }
        const modalInfo = {
            title: "添加商户",
            footer: [
                <Button onClick={this.cancel.bind(this)} key="cancel">取消</Button>,
                <Button type="primary" onClick={() => { this.onOk() }} key="sure">确认添加</Button>
            ],
            visible: this.state.visiable,
            maskClosable: false,
            closable:false
        }
        let paths = this.props.location.pathname;
        
        const plainOptions=['小贷商户','智优商户'];
        const table={
            filter:{
                "data-get":this.get_filter.bind(this),
                "data-source":this.filter,
                "data-paths":paths,
                // "status":""
            },
            tableInfo:table_props,
            tableTitle:{
                left:null,
                right:<Permissions type="primary" onClick={this.add.bind(this)} tag="button" server={global.AUTHSERVER.bmdOnline.key} permissions={global.AUTHSERVER.bmdOnline.access.merchant_add}>添加商户</Permissions>
            }
        }
        return (
            <div>
                {/* <Filter data-get={this.get_filter.bind(this)} data-source={this.filter} top="20px" data-paths={paths} status="" />
                <Row style={{ padding: "20px" }}>
                    <Spin spinning={this.state.spin}>
                        <Row style={{ background: "#fff" }}>
                            <Row className="content">
                                <Permissions type="primary" size="small" onClick={this.add.bind(this)} server={global.AUTHSERVER.bmdOnline.key} tag="button" style={{ marginBottom: "10px" }}>添加商户</Permissions>
                                <Table {...table} bordered />
                            </Row>

                        </Row>
                    </Spin>
                </Row> */}
                <List {...table} />
                <Modal {...modalInfo}>
                    <FormItem label="商户简称" {...formInfo} >
                        {getFieldDecorator('merchantNo', {
                        })(
                            <Select style={{width:'200px'}} placeholder="请选择要添加的商户">
                                {this.state.merchant.map((i,k)=>{
                                    return <Option value={i.merchantNo} key={k}>{i.shortName}</Option>
                                })}
                                
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label="所属渠道" {...formInfo} >
                        {getFieldDecorator('channelName', {
                        })(
                            <Select placeholder="请选择商户对应的渠道" style={{width:'200px'}}>
                                <Option value="自有">自有</Option>
                                <Option value="贰法">贰法</Option>
                                <Option value="全旗">全旗</Option>
                                <Option value="传驹">传驹</Option>
                                <Option value="君正科迅">君正科迅</Option>
                                <Option value="上时针">上时针</Option>
                                <Option value="三七网络">三七网络</Option>
                                <Option value="汉鹰">汉鹰</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label="商户类型" {...formInfo} >
                        {getFieldDecorator('merchantType', {
                        })(
                            <CheckboxGroup options={plainOptions} />
                        )}
                    </FormItem>
                </Modal>
            </div>
        )
    }
}
export default ComponentRoute(Form.create()(Product_cxfq));