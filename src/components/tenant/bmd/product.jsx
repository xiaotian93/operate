import React, { Component } from 'react';
import { Row, Button, Table, Modal, Spin,Form ,Input,message} from 'antd';
import { xjd_product_list, xjd_product_del,xjd_product_loan_get,xjd_product_loan_set ,xjd_product_enable,xjd_product_disable} from '../../../ajax/api';
import { axios_xjd_p,axios_xjd } from '../../../ajax/request';
// import Filter from '../../ui/Filter_obj8';
import { format_table_data ,accDiv,accMul,bmd} from '../../../ajax/tool';
import { page } from '../../../ajax/config';
import { browserHistory } from 'react-router';
import ComponentRoute from '../../../templates/ComponentRoute';
import ListBtn from '../../templates/listBtn';
import Permissions from '../../../templates/Permissions';
const FormItem = Form.Item;
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
            singleDayPaymentLimit:0,
            totalPaymentLimit:0
        };
    }
    componentWillMount() {
        window.localStorage.setItem("detail", "");
        this.filter = {

            time: {
                name: "添加时间",
                type: "range_date_day",
                feild_s: "commitTimeStart",
                feild_e: "commitTimeEnd",
                placeHolder: ['开始日期', "结束日期"]
            },
            merchantName: {
                name: '商户全称/简称',
                type: 'text',
                placeHolder: '请输入商户名称/简称'
            },
            status: {
                name: '所属渠道',
                type: 'select',
                placeHolder: '请选择所属渠道',
                values: [{ val: "", name: "全部" }, { val: "1", name: "待审核" }, { val: "3", name: "不通过" }]
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
                title: '新增时间',
                dataIndex: 'createTime',
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"createTime",true)
                }
            },
            {
                title: '产品名称',
                dataIndex: 'productName',
            },
            {
                title: '借款金额',
                render: e=>{
                    return accDiv(e.minAmount,100)+"-"+accDiv(e.maxAmount,100)
                }
            },
            {
                title: '借款期限',
                render: e=>{
                    var type={"DAY":"日","MONTH":"个月","YEAR":"年"}
                    return e.periodGap+type[e.periodUnitType];
                },
            },
            {
                title: '借款期数',
                render: e=>{
                    return e.totalPeriodList.join(",");
                },
            },
            {
                title: '子产品描述',
                dataIndex: 'desc',
            },
            {
                title: '状态',
                // dataIndex: 'statusStr',
                render:(e)=>{
                    if(e.statusStr==="已启用"){
                        this.product_user=e.productName
                    }
                    return <span className={e.status?"text-danger":""}>{e.statusStr}</span>
                }
            },
            {
                title: '最近操作时间',
                dataIndex: 'lastOperatorTime',
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"lastOperatorTime",true)
                }
            },
            {
                title: '操作',
                width: 180,
                render: (data) => {
                    var btn=[];
                    if(data.status){
                        btn.push(<Permissions size="small" type="primary" onClick={() => { this.change_status(data.code,true) }} server={global.AUTHSERVER.bmdCashLoan.key} tag="button" permissions={global.AUTHSERVER.bmdCashLoan.access.product_transfer_status}>启用</Permissions>)
                    }else{
                        btn.push(<Permissions size="small" type="danger" onClick={() => { this.change_status(data.code,false) }} server={global.AUTHSERVER.bmdCashLoan.key} tag="button" permissions={global.AUTHSERVER.bmdCashLoan.access.product_transfer_status}>停用</Permissions>)
                    }
                    btn.push(<Permissions size="small" onClick={() => { this.edit(data.code) }} type="primary" server={global.AUTHSERVER.bmdCashLoan.key} tag="button" permissions={global.AUTHSERVER.bmdCashLoan.access.product_update}>编辑</Permissions>);
                    btn.push(<Permissions size="small" onClick={() => { this.detail(data.code) }} server={global.AUTHSERVER.bmdCashLoan.key} tag="button" permissions={global.AUTHSERVER.bmdCashLoan.access.product_detail}>查看</Permissions>);
                    return <ListBtn btn={btn} />;
                }

            }
        ];
        this.get_list();
        this.loan_get();
    }
    //额度
    loan_get(){
        axios_xjd_p.get(xjd_product_loan_get).then(e=>{
            if(!e.code){
                if(!e.data){
                    this.setState({
                        isSet:true,
                        isCancel:false
                    });
                    return;
                }
                this.setState({
                    isSet:false,
                    isCancel:true,
                    singleDayPaymentLimit:accDiv(e.data.singleDayPaymentLimit,1000000),
                    totalPaymentLimit:accDiv(e.data.totalPaymentLimit,1000000)
                })
            }
        })
    }
    editLimit(){
        this.setState({
            isSet:true
        });
        setTimeout(function(){
            this.props.form.setFieldsValue({singleDayPaymentLimit:this.state.singleDayPaymentLimit,totalPaymentLimit:this.state.totalPaymentLimit});
        }.bind(this),100)
    }
    cancelLimit(){
        this.setState({
            isSet:false
        });
    }
    get_filter(data) {
        // let paths = this.props.location.pathname;
        // window.localStorage.setItem(paths,JSON.stringify(data))
        this.setState({
            filter: data
        })
        this.get_list(1, data)
    }
    get_list(page_no, filter = {}) {
        let data = {};
        data.page = page_no || 1;
        data.size = page.size;
        if (JSON.stringify(filter) === "{}") {
            // data.status="1";
        }
        this.setState({
            loading: true,
        })
        axios_xjd_p.get(xjd_product_list + "?page=1&size=100").then((data) => {
            if(!data.code){
                let list = data.data.list;
                this.setState({
                    data: format_table_data(list),
                    loading: false,
                    total: data.totalData,
                    current: data.current
                })
            }
            
        });
    }
    page_up(page, pageSize) {
        window.scrollTo(0,0);
        this.get_list(page, this.state.filter);
    }
    add() {
        browserHistory.push("/sh/bmd/add");
    }
    edit(id) {
        browserHistory.push("/sh/bmd/edit?id=" + id);
    }
    detail(id) {
        browserHistory.push("/sh/bmd/detail?id=" + id);
    }
    delete(){
        axios_xjd_p.post(xjd_product_del)
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
    save(){
        if(this.state.error.type){
            this.props.form.setFields({
                [this.state.error.name]:{
                    errors: [new Error(this.state.error.text)],
                    value:this.state.error.value
                },
            });
            return;
        }
        this.props.form.validateFields((err,val)=>{
            if(!err){
                var param={
                    totalPaymentLimit:accMul(val.totalPaymentLimit,1000000),
                    singleDayPaymentLimit:accMul(val.singleDayPaymentLimit,1000000)
                }
                axios_xjd.post(xjd_product_loan_set,param).then(e=>{
                    if(!e.code){
                        message.success('操作成功');
                        this.loan_get();
                    }
                })
            }
        })
    }
    //输入范围判定
    check_val(e,name,val,type){
        this.setState({
            error:{
                type:false,
                name:"",
                text:""
            }
        })
        var val_get=this.props.form.getFieldValue(val);
        if(val_get===""||e.target.value===""){
            return;
        }
        if(type){
            if(Number(e.target.value)>Number(val_get)){
                this.props.form.setFields({
                    [name]: {
                        errors: [new Error('不能高于总放款额度')],
                        value:e.target.value
                    },
                });
                this.setState({
                    error:{
                        type:true,
                        name:name,
                        text:"不能大于最大范围",
                        value:e.target.value
                    }
                })
            }
        }else{
            if(Number(e.target.value)<Number(val_get)){
                this.props.form.setFields({
                    [name]: {
                        errors: [new Error('不能低于单日放款限额')],
                        value: e.target.value
                    },
                });
                this.setState({
                    error:{
                        type:true,
                        name:name,
                        text:"不能小于最小范围",
                        value:e.target.value
                    }
                })
            }
        }
    }
    //停用/启用
    change_status(code,status){
        this.setState({
            product_code:code,
            product_status:status,
            visiable_status:true
        })
    }
    sure_status(){
        axios_xjd.post(this.state.product_status?xjd_product_enable:xjd_product_disable,{code:this.state.product_code}).then(e=>{
            if(!e.code){
                message.success("操作成功");
                this.cancel_status();
                this.get_list();
            }else{
                this.cancel_status();
            }
        })
    }
    cancel_status(){
        this.setState({
            visiable_status:false
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
            columns: this.columns,
            dataSource: this.state.data,
            loading: this.state.loading,
            pagination: pagination,
            rowKey: "code"
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
        const modalStatua={
            title: this.state.product_status?"是否启用":"是否停用",
            footer: [
                <Button onClick={this.cancel_status.bind(this)} key="cancel">取消</Button>,
                <Button type="primary" key="sure" onClick={this.sure_status.bind(this)}>确定</Button>
            ],
            visible: this.state.visiable_status,
            maskClosable: false,
            closable:false
        }
        // let paths = this.props.location.pathname;
        const { getFieldDecorator } = this.props.form;
        const formInfo={
            labelCol:{md:{span:12},lg:{span:11},xl:{span:11}},
            wrapperCol:{md:{span:12},lg:{span:11},xl:{span:11}},
            colon:false
        };
        return (
            <div>
                {/* <Filter data-get={this.get_filter.bind(this)} data-source={this.filter} top="20px" data-paths={paths} status="" /> */}
                <Row style={{ padding: "0px" }}>
                <div className="content sh_add" style={{ background: "#fff",marginBottom:"15px" }}>
                    <div className="product_title">放款规模配置</div>
                    {this.state.isSet?<Form layout="inline">
                    <FormItem label="总放款额度上限" {...formInfo} >
                        {getFieldDecorator('totalPaymentLimit', {
                            rules:[{required:true,message:"请输入"},{ pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "格式错误" }]
                        })(
                            <Input placeholder="请输入" onBlur={(e)=>{this.check_val(e,"totalPaymentLimit","singleDayPaymentLimit",false)}} />
                        )}
                        <div className="formIcon">万元</div>
                    </FormItem>
                    <FormItem label="单日放款限额" {...formInfo} >
                        {getFieldDecorator('singleDayPaymentLimit', {
                            rules:[{required:true,message:"请输入"},{ pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "格式错误" }]
                        })(
                            <Input placeholder="请输入" onBlur={(e)=>{this.check_val(e,"singleDayPaymentLimit","totalPaymentLimit",true)}} />
                        )}
                        <div className="formIcon">万元</div>
                    </FormItem>
                    {this.state.isCancel?<Button type="" onClick={this.cancelLimit.bind(this)} style={{marginRight:"10px"}}>取消</Button>:null}
                    <Button type="primary" onClick={this.save.bind(this)}>保存</Button>
                    </Form>:<Form layout="inline">
                    <FormItem label="总放款额度上限" {...formInfo} style={{width:"250px"}} >
                        {getFieldDecorator('totalPaymentLimit1', {
                            rules:[{required:true,message:"请输入"}]
                        })(
                        <span>{this.state.totalPaymentLimit+"万元"}</span>
                        )}
                    </FormItem>
                    <FormItem label="单日放款限额" {...formInfo} style={{width:"260px"}} >
                        {getFieldDecorator('singleDayPaymentLimit1', {
                            rules:[{required:true,message:"请输入"}]
                        })(
                        <div>{this.state.singleDayPaymentLimit+"万元"}</div>
                        )}
                    </FormItem>
                    
                    <Permissions type="primary" onClick={this.editLimit.bind(this)} server={global.AUTHSERVER.bmdCashLoan.key} tag="button" permissions={global.AUTHSERVER.bmdCashLoan.access.loan_config_update}>编辑</Permissions>
                    </Form>}
                    
                </div>
                    <Spin spinning={this.state.spin}>
                        <Row style={{ background: "#fff" }}>
                            <Row className="content">
                            <div className="product_title">产品配置</div>
                            
                            {/* <List {...table} /> */}
                                <div style={{ float: "left",lineHeight: "28px", background: "#FFFAE5",padding:"0 5px" }}>
                                    金额单位：元
                                </div>
                                {
                                    this.state.isSet?null:<div style={{textAlign:"right"}}><Permissions type="primary" style={{ marginBottom: "10px" }} onClick={this.add.bind(this)} server={global.AUTHSERVER.bmdCashLoan.key} tag="button" permissions={global.AUTHSERVER.bmdCashLoan.access.product_create}>新增产品</Permissions></div>
                                }
                                <Table {...table_props} bordered rowKey="code" />
                                
                                </Row>

                        </Row>
                        
                    </Spin>
                </Row>
                <Modal {...modalInfo} />
                <Modal {...modalStatua}>
                    <p style={{fontSize:"14px"}}>{this.state.product_status?"是否确认启用该产品？启用后当前使用产品【"+this.product_user+"】将被自动停用":"是否确认停用该产品？"}</p>
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