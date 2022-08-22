import React, { Component } from 'react';
import { Row, Col, Modal, Button, DatePicker, message, Radio } from 'antd';
import moment from 'moment'
// import Filter from '../../ui/Filter_nomal';
import { axios_repay , axios_sh } from '../../../../ajax/request'
import { repay_plan_list, pre_pay_cxfq, cal_sum_loan_amount_interest , repay_plan_export_cxfq , statistics_select , repay_plan_total } from '../../../../ajax/api';
import { page , host_monthly, host_cxfq , repay_status_select , repay_status_select_map } from '../../../../ajax/config';
import { format_table_data ,bmd} from '../../../../ajax/tool';
import Permissions from '../../../../templates/Permissions';
import List from '../../../templates/list';
import ListBtn from '../../../templates/listBtn';
const RadioGroup = Radio.Group;

class Page extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            selectedRows: [],
            textValue: "",
            radioValue: "SETTLE",
            dateValue: moment(),
            loading: false,
            total: 1,
            totalDes:"",
            current: 1,
            filter: {},
            pageSize: page.size,
            data: [],
            nowPage: 1,
            productName:[],
            merchantName:[],
            pre_pay: {
                domainNo: "",
                pay_date: "",
                total_money: "",
                total_interest:0,
                total_otherFee:0,
                total_overdueFee:0,
                total_penaltyFee:0,
                total_principal:0,
                total_serviceFee:0,
                serial_number: "",
                show: false,
                contract_id: "",
                loading: false
            }
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
                dataIndex: 'domainNo'
            },
            {
                title: '借款方',
                dataIndex: 'borrowerName'
            },
            {
                title: '产品名称',
                // dataIndex: 'product_name',
                render:e=>{
                    if(e.key==="合计"){
                        return;
                    }
                    return e.productName||"--"
                }
            },
            {
                title: '商户名称',
                // dataIndex: 'merchant_name',
                render:e=>{
                    if(e.key==="合计"){
                        return;
                    }
                    return e.merchantName||"--"
                }
            },
            {
                title: '借款金额',
                dataIndex:"loanAmount",
                render: data => {
                    return data?data.money():"--"
                },
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"loanAmount")
                }
            },
            {
                title: '已还本金合计',
                dataIndex: 'returnPrincipal',
                render: data => {
                    return data?data.money():"0.00"
                },
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"returnPrincipal")
                }
            },
            {
                title: '已还期数',
                render: (data) => {
                    return data.repayPhase 
                }
            },
            {
                title: '总期数',
                render: (data) => {
                    return data.totalPhase
                }
            },
            {
                title: '贷款开始时间',
                //width: 110,
                dataIndex: 'loanStartDate',
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"loanStartDate",true)
                }
            },
            {
                title: '订单状态',
                dataIndex: 'status',
                render:data=>(repay_status_select_map[data])
            },
            {
                title: '操作',
                // width: 140,
                render: (data) => {
                    if(data.key==="合计"){
                        return;
                    }
                    var btn=[];
                    if(data.status === 0){
                        btn.push(<Permissions server={global.AUTHSERVER.loanmanage.key} permissions={global.AUTHSERVER.loanmanage.access.cxfq_repay_batch} tag="button" type="primary" size="small" onClick={() => (this.set_pre_pay(true, data))}>还款全部</Permissions>);
                    }
                    btn.push(<Permissions size="small" onClick={()=>{this.detail(data)}} server={global.AUTHSERVER.loanmanage.key} permissions={global.AUTHSERVER.loanmanage.access.cxfq_contract_detail} tag="button" src={"/hk/plan/" + this.props.page_type + "/detail?contract_no=" + data.contractId}>查看</Permissions>);
                    return <ListBtn btn={btn} />;
                    
                }
            }
        ];
        let status = repay_status_select;
        status.unshift({name:"全部",val:""})
        this.filter = {
            domain_no: {
                name: "订单编号",
                type: "text",
                placeHolder: "请输入订单号"
            },
            borrower: {
                name: "借款方",
                type: "text",
                placeHolder: "请输入借款方"
            },
            product_ame: {
                name: "产品名称",
                type: "select",
                placeHolder: "全部",
                values: "productName"
            },
            merchant_name: {
                name: "商户名称",
                type: "select",
                placeHolder: "全部",
                values: "merchantName"
            },
            borrow_time: {
                name: "借款时间",
                type: "range_date_day",
                placeHolder: ["开始时间", "结束时间"],
                feild_s: "start_date",
                feild_e: "end_date"
            },
            status: {
                name: "订单状态",
                type: "select",
                placeHolder: "全部",
                values: status
            }
        }
    }
    componentDidMount() {
        var select=window.localStorage.getItem(this.props.path);
        if(select){
            this.get_list(1,JSON.parse(select).remberData);
        }else{
            this.get_list();
        }
       this.get_select();
    }
    detail(data){
        bmd.navigate("/hk/plan/" + this.props.page_type + "/detail?contract_no=" + data.contractId)
    }
    get_list(page_no, filter = {}) {
        let data = JSON.parse(JSON.stringify(filter));
        data.page = page_no || 1;
        data.size = page.size;
        data.product_line = this.props.page_type;
        this.setState({
            loading: true,
            selectedRowKeys: []
        });
        axios_repay.post(repay_plan_list, data).then((data) => {
            let list = data.data;
            this.setState({
                data: format_table_data(list,page_no,page.size),
                loading: false,
                totalDes:"",
                total: data.total,
                current: data.current
            })
            if(list.length>0){
                this.get_total(filter);
            }
        });
    }
    // 获取统计数据
    get_total(filter){
        filter.product_line = this.props.page_type;
        axios_repay.post(repay_plan_total,filter).then(data=>{
            let detail = data.data;
            detail.key = "合计";
            let lists = JSON.parse(JSON.stringify(this.state.data));
            lists.push(detail)
            this.setState({
                totalDes:"此合计是当前查询结果的合计",
                data:lists
            })
        })
    }

    get_filter(data) {
        this.setState({
            filter: data
        })
        this.get_list(1, data);
    }

    // 获取下拉菜单
    get_select(){
        axios_repay.post(statistics_select,{product_line:this.props.page_type}).then(data=>{
            let selects = data.data;
            let temp = {};
            for(let s in selects){
                if(!selects){
                    continue;
                }
                temp[s] = [];
                for(let t in selects[s]){
                    temp[s].push({name:selects[s][t],val:selects[s][t]})
                }
            }
            this.setState({
                ...temp
            })
        })
    }
    // 提前还款弹窗
    set_pre_pay(show, data) {
        let pay_date = moment().format("YYYY-MM-DD");
        let status = {
            domainNo: data ? data.domainNo : "",
            pay_date: pay_date,
            total_money: data ? data.loanAmount : "",
            total_interest:0,
            total_otherFee:0,
            total_overdueFee:0,
            total_penaltyFee:0,
            total_principal:0,
            total_serviceFee:0,
            type: 2,
            serial_number: "",
            remark: "",
            show: show,
            contract_id: data ? data.contractId : "",
            loading: false
        };
        if (show) {
            this.get_principal_intersert(data.contractId, pay_date)
        }
        this.setState({
            pre_pay: status,
            textValue: "",
            radioValue: "SETTLE",
            dateValue: moment()
        })
    }
    pre_pay() {
        let status = JSON.parse(JSON.stringify(this.state.pre_pay));
        status.loading = true;
        this.setState({
            pre_pay: status
        })
        let rqd = {
            settleType: this.state.radioValue,
            settleDate: this.state.pre_pay.pay_date,
            orderNo: this.state.pre_pay.domainNo,
        }
        axios_sh.post(pre_pay_cxfq, rqd).then((data) => {
            this.get_list(this.state.nowPage, this.state.filter);
            status.loading = false;
            status.show = false;
            this.setState({
                pre_pay: status
            })
        })
    }
    // 获取提前还款本息合计  (此处吐槽两万字.......)
    get_principal_intersert(contractNo, date) {
        let rqd = {
            contract_id: contractNo,
            repay_date: date
        }
        axios_repay.post(cal_sum_loan_amount_interest, rqd).then((data) => {
            let status = JSON.parse(JSON.stringify(this.state.pre_pay));
            status.total_money = data.data.amount;
            status.total_interest = data.data.interest;
            status.total_otherFee = (data.data.otherFee+data.data.otherFeeTech);
            status.total_overdueFee = data.data.overdueFee;
            status.total_penaltyFee = data.data.penaltyFee;
            status.total_principal = data.data.principal;
            status.total_serviceFee = (data.data.serviceFee+data.data.serviceFeeTech);
            this.setState({
                pre_pay: status
            });
        })
    }
    textChange(e) {
        let value = e.target.value;
        if (value.length > 100) {
            message.warn("流水号最大长度不超过100", 3);
            value = value.slice(0, 100)
        }
        let status = JSON.parse(JSON.stringify(this.state.pre_pay));
        status.serial_number = value;
        this.setState({
            pre_pay: status,
            textValue: value
        })
    }
    radioChange(e) {
        let status = JSON.parse(JSON.stringify(this.state.pre_pay));
        status.type = e.target.value;
        this.setState({
            pre_pay: status,
            radioValue: e.target.value,
        });
    }
    dateChange(str) {
        let status = JSON.parse(JSON.stringify(this.state.pre_pay));
        status.pay_date = str;
        this.get_principal_intersert(status.contract_id, str)
        this.setState({
            pre_pay: status,
            dateValue: str === "" ? undefined : moment(str)
        })
    }
    disabledDate(curr) {
        curr = curr ? curr : moment();
        return curr.valueOf() > Date.now();
    }
    page_up(page, pageSize) {
        window.scrollTo(0,0);
        this.setState({
            nowPage: page
        })
        this.get_list(page, this.state.filter);
    }
    export_result() {
        let filter = this.state.filter;
        let str = [];
        let url = "";
        for (let f in filter) {
            str.push(f + "=" + filter[f]);
        }
        if(this.props.page_type==="cxfq"){
            url = host_cxfq + repay_plan_export_cxfq + "?" + str.join("&");
        }else{
            url = host_monthly + "/sum_repay_plan/repay_plan?belongService="+this.props.page_type+"&" + str.join("&");
        }
        window.open(encodeURI( url ));
    }
    showTotal(){
        return `共${this.state.total}条数据`
    }
    render() {
        var page=parseInt(this.state.total/(this.state.pageSize + 1),10);
        let pagination = {
            total: this.state.total+page,
            current: this.state.current,
            pageSize: this.state.pageSize+1,
            showTotal:this.showTotal.bind(this),
            onChange: this.page_up.bind(this)
        }
        const table_props = {
            columns: this.columns,
            dataSource: this.state.data,
            pagination: pagination,
            footer:()=>this.state.totalDes,
            loading: this.state.loading,
        }
        const footer = [
            <Button key="submit" type="primary" loading={this.state.pre_pay.loading} onClick={() => { this.pre_pay(2) }}>确认还款请求</Button>
        ]

        // 弹窗参数
        const prePay_props = {
            visible: this.state.pre_pay.show,
            title: "提前还款确认单",
            onCancel: () => { this.set_pre_pay(false) },
            footer: footer,
            className: "pay-plan"
        }
        const table={
            filter:{
                "data-get":this.get_filter.bind(this),
                "data-source":this.filter,
                "loanPeriod":this.state.loanPeriod,
                "merchantName":this.state.merchantName,
                "productName":this.state.productName,
                "data-paths":this.props.path,
            },
            tableInfo:table_props,
            tableTitle:{
                left:<span>
                    金额单位：元 
                </span>,
                right:<span>
                    <Permissions type="primary" onClick={(e) => (this.export_result())} server={global.AUTHSERVER.loanmanage.key} permissions={global.AUTHSERVER.loanmanage.access.cxfq_repay_plan_export} tag="button">导出</Permissions>
                </span>
            },
        }
        return (
            <div className="Component-body">
                <List {...table} />
                {/* <Filter data-get={this.get_filter.bind(this)} data-source={this.filter} loanPeriod={this.state.loanPeriod} merchantName={this.state.merchantName} productName={this.state.productName} />
                <Row className="table-content">
                    <div className="text-right" span={24} style={{marginBottom:"10px"}}>
                        <Button type="primary" onClick={(e) => (this.export_result())}>导出</Button>
                    </div>
                    <Table {...table_props} bordered />
                </Row> */}
                
                <Modal {...prePay_props}>
                    <Row>
                        <Col span={6}>
                            <div className="key">订单编号:</div>
                        </Col>
                        <Col span={16} offset={2}>
                            <div className="value">{this.state.pre_pay.domainNo}</div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <div className="key">提前还款日期:</div>
                        </Col>
                        <Col span={16} offset={2} className="value">
                            <DatePicker value={this.state.dateValue} disabledDate={this.disabledDate} placeholder="输入提前还款日期" onChange={(moment, str) => { this.dateChange(str) }} />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <div className="key">提前还款本息合计:</div>
                        </Col>
                        <Col span={16} offset={2}>
                            <div className="value">{this.state.pre_pay.total_money}</div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={2}>
                            <div className="key">其中:</div>
                        </Col>
                        <Col span={4}>
                            <div className="key">应还本金合计:</div>
                        </Col>
                        <Col span={14} offset={2} className="value">
                            <div className="value">{this.state.pre_pay.total_principal.money()}</div>
                        </Col>
                        <Col span={6}>
                            <div className="key">应还利息合计:</div>
                        </Col>
                        <Col span={14} offset={2} className="value">
                            <div className="value">{this.state.pre_pay.total_interest.money()}</div>
                        </Col>
                        <Col span={6}>
                            <div className="key">应还其他费用合计:</div>
                        </Col>
                        <Col span={14} offset={2} className="value">
                            <div className="value">{this.state.pre_pay.total_otherFee.money()}</div>
                        </Col>
                        <Col span={6}>
                            <div className="key">应还服务费合计:</div>
                        </Col>
                        <Col span={14} offset={2} className="value">
                            <div className="value">{this.state.pre_pay.total_serviceFee.money()}</div>
                        </Col>
                        <Col span={6}>
                            <div className="key">应还逾期罚息合计:</div>
                        </Col>
                        <Col span={14} offset={2} className="value">
                            <div className="value">{this.state.pre_pay.total_overdueFee.money()}</div>
                        </Col>
                        <Col span={6}>
                            <div className="key">应还提前还款违约金:</div>
                        </Col>
                        <Col span={14} offset={2} className="value">
                            <div className="value">{this.state.pre_pay.total_penaltyFee.money()}</div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <div className="key">备注:</div>
                        </Col>
                        <Col span={16} offset={2} className="value">
                            <RadioGroup onChange={this.radioChange.bind(this)} value={this.state.radioValue}>
                                <Radio value={"SETTLE"}>提前结清</Radio>
                                <Radio value={"RETURN"}>退保</Radio>
                            </RadioGroup>
                        </Col>
                    </Row>
                </Modal>

                <style>{`
                    .pay-plan .ant-model-body{
                        font-size:14px;
                    }
                    .pay-plan div.key{
                        line-height: 40px;
                        text-align: right;
                    }
                    .pay-plan div.value{
                        line-height: 40px;
                        text-align: left;
                    }
                    .pay-plan div.ant-modal-title,.pay-plan div.ant-modal-footer{
                        text-align:center
                    }
                `}</style>
            </div>
        )
    }
}

export default Page;