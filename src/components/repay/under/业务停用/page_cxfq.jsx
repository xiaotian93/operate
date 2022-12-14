import React, { Component } from 'react';
import { Row , Col , Modal , Button , Input , message , Select , DatePicker , Form } from 'antd';
import moment from 'moment'

// import Filter from '../../ui/Filter';
import RepayConfirm from '../../elements/confirm';
import { axios_repay } from '../../../../ajax/request'
import { under_repay_plan , under_repay_plan_total , under_repay_plan_select_total , under_repay_total_confirm , repay , under_repay_export , under_repay_plan_all_total } from '../../../../ajax/api';
import { page , under_repay_status_select , host_repay } from '../../../../ajax/config';
import { format_table_data , format_date, bmd } from '../../../../ajax/tool';
import Permissions from '../../../../templates/Permissions';
import List from '../../../templates/list';
import ListBtn from '../../../templates/listBtn';

const Option = Select.Option;
const FormItem = Form.Item;

class Page extends Component{
    constructor(props) {
        super(props);
        let endDate = moment();
        let day = endDate.date();
        if(day<=10){
            endDate.date(10);
        }else if(day>10&&day<=20){
            endDate.date(20);
        }else{
            endDate.add(1,"month");
            endDate.date(10);
        }
        this.state = {
            selectedRowKeys: [],
            selectedRows: [],
            loading: false,
            total:1,
            current:1,
            filter:{
                repay_start_date:moment().add(-1,"years").format("YYYY-MM-DD"),
                repay_end_date:(props.page_type==="hs"?endDate.format("YYYY-MM-DD"):moment().add(1,"month").format("YYYY-MM-DD"))
            },
            remark:"",
            selectValue:"",
            repay_date:undefined,
            pageSize:page.size,
            data:[],
            total_info:{
                amount:0
            },
            nowPage:1,
            totalDes:"",
            pre_pay:{
                value:'',
                total_money:0,
                total_principal:0,
                total_interest:0,
                total_defautInterest:0,
                total_serviceCharge:0,
                total_overdueFee:0,
                show:false,
                ids:[],
                loading:false
            },
            totalMoney:0
        };
    }
    
    componentWillMount(){
        this.columns = [
            {
                title: '??????',
                width:"50px",
                dataIndex: 'key',
                render:(text,record,index)=>{
                    if(text==="??????"){
                        return text;
                    }
                    return `${index+1}`
                }
            },
            {
                title: '????????????',
                // width:"19%",
                dataIndex: 'domainNo'
            },
            {
                title: '??????',
                // width:"3%",
                dataIndex: 'phase'
            },
            {
                title: '???????????????',
                // width:"5%",
                dataIndex: 'repayDate',
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"repayDate",true)
                }
            },
            {
                title: '?????????',
                dataIndex: 'borrowerName'
            },
            {
                title: '????????????',
                // width:"4%",
                // dataIndex: 'productName',
                render:e=>{
                    if(e.key==="??????"){
                        return;
                    }
                    return e.productName||"--"
                }
            },
            {
                title: '????????????',
                // width:"4%",
                // dataIndex: 'merchantName',
                render:e=>{
                    if(e.key==="??????"){
                        return;
                    }
                    return e.merchantName||"--"
                }
            },
            {
                title: '????????????',
                // width:"5%",
                dataIndex:"principal",
                render:data=>{
                    return data?data.money():"--"
                },
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"principal")
                }
            },
            {
                title: '????????????',
                // width:"5%",
                dataIndex:"interest",
                render:data=>{
                    return data?data.money():"--"
                },
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"interest")
                }
            },
            {
                title: '???????????????',
                // width:"5%",
                dataIndex:"serviceFee",
                render:data=>{
                    return data?data.money():"--"
                },
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"serviceFee")
                }
            },
            {
                title: '??????????????????',
                // width:"5%",
                dataIndex:"otherFee",
                render:data=>{
                    return data?data.money():"--"
                },
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"otherFee")
                }
            },
            {
                title: '??????????????????',
                // width:"5%",
                dataIndex:"overdueFee",
                render:data=>{
                    return data?data.money():"--"
                },
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"overdueFee")
                }
            },
            {
                title: '????????????',
                // width:"5%",
                dataIndex:"needPayMoney",
                render:data=>{
                    return data?data.money():"--"
                },
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"needPayMoney")
                }
            },
            {
                title: '????????????',
                // width:"8%",
                render:(data)=>{
                    if(data.repayStatus===2){
                        return <span className="text-danger">{data.repayStatusStr}</span>
                    }
                    return data.repayStatusStr
                }
            },
            {
                title: '??????',
                // fixed:"right",
                // width:170,
                render: (data) => {
                    var btn=[];
                    // if(data.repayStatus===2){
                    //     btn.push(<Permissions server={global.AUTHSERVER.cxfq.key} tag="button" type="primary" size="small" onClick={()=>(this.batch_pay(data))}>??????</Permissions>)
                    // }
                    btn.push(<Permissions size="small" onClick={()=>{this.get_detail(data)}} server={global.AUTHSERVER.loanmanage.key} permissions={global.AUTHSERVER.loanmanage.access.cxfq_contract_detail} tag="button" src={"/hk/under/"+ this.props.page_type +"/detail?contract_no="+data.contractId}>??????</Permissions>);
                    return <ListBtn btn={btn} />;
                }
            }
        ]
        let pay_status = under_repay_status_select;
        pay_status.unshift({
            name:"??????",val:""
        })
        this.filter = {
            time:{
                name:"????????????",
                type:"range_date_notime",
                feild_s:"repay_start_date",
                feild_e:"repay_end_date",
                default:[moment().subtract(1,"days"),moment()],
                placeHolder:['????????????',"????????????"]
            },
            borrower:{
                name:"?????????",
                type:"text",
                placeHolder:"??????????????????"
            },
            "--":{
                name:"",
                type:"blank"
            },
            status:{
                name:"????????????",
                type:"select",
                placeHolder:"??????",
                values:pay_status
            },
            domain_no:{
                name:"????????????",
                type:"text",
                placeHolder:"?????????????????????"
            }
        }
        this.form_init_data = {
            repay_order_no:"",
            date:undefined,
            remark:"",
            repay_type:undefined
        }
    }
    componentDidMount(){
        var select=window.localStorage.getItem(this.props.path);
        if(select){
            this.get_list(1,JSON.parse(select).remberData);
        }else{
            this.get_list(1,this.state.filter);
        }
    }
    get_detail(data){
        bmd.navigate("/hk/under/"+ this.props.page_type +"/detail?contract_no="+data.contractId)
    }
    get_list(page_no,filter={}){
        let data = JSON.parse(JSON.stringify(filter));
        data.page = page_no||1;
        data.size = page.size;
        data.product_line = this.props.page_type;
        this.setState({
            loading:true,
            selectedRowKeys:[],
            selectedRows:[]
        });
        axios_repay.post(under_repay_plan,data).then((data)=>{
            let list = data.data;
            this.setState({
                data:format_table_data(list,page_no,page.size),
                loading:false,
                totalDes:"",
                total:data.total,
                current:data.current
            })
            if(list.length>0){
                this.get_total(filter);
            }
        });
    }
    get_total(filter={}){
        let data = {
            product_line:this.props.page_type,
            ...filter
        }
        axios_repay.post(under_repay_plan_total,data).then((data)=>{
            let info = data.data;
            for(let d in this.state.data[0]){
                info[d]=info[d]?info[d]:""
            }
            info.key = "??????";
            let temp = JSON.parse(JSON.stringify(this.state.data));
            temp.push(info);
            this.setState({
                data:temp,
                totalDes:"???????????????????????????????????????",
                total_info:info
            })
        })
    }
    get_filter(data){
        let filter = {};
        for(let d in data){
            filter[data[d].key] = data[d].value
        }
        this.setState({
            filter:filter
        })
        this.get_list(1,filter);
    }
    // ????????????
    export_list(){
        let filter = this.state.filter;
        let filterStr = [];
        for(let f in filter){
            filterStr.push(f+'='+filter[f])
        }
        filterStr.push("product_line="+this.props.page_type)
        let url = host_repay + under_repay_export + "?" + filterStr.join("&");
        window.open(url);
    }
    set_filter(){
        return [{ key:"time",value:[moment(this.state.filter.repay_start_date) ,moment(this.state.filter.repay_end_date) ] }]
    }
    set_pre_pay(config,init=true){
        this.setState({
            pre_pay:config
        })
        if(init){
            this.props.form.setFieldsValue(this.form_init_data);
        }
    }
    // ????????????????????????
    pre_pay(repay_info){
        let rqd = {
            repay_info : JSON.stringify(repay_info),
            contract_and_phase:JSON.stringify(this.state.pre_pay.ids)
        }
        axios_repay.post(repay,rqd).then((data)=>{
            this.get_list(this.state.nowPage,this.state.filter);
            this.get_total(this.state.filter);
            message.success(data.msg);
            this.modal_hide();
        })
    }
    // ????????????????????????
    pay_all(repay_info){
        let data = {
            ...this.state.filter,
            product_line:this.props.page_type,
            repay_info:JSON.stringify(repay_info)
        }
        axios_repay.post(under_repay_total_confirm,data).then((data)=>{
            this.get_list(this.state.nowPage,this.state.filter);
            message.success(data.msg);
            this.modal_hide()
        })
    }
    // ??????????????????
    batch_pay(data){
        if(data){
            this.confirm_modal.get_cofirm_info(data.domainNo,data.phase);
            return ;
        }
        let datas = this.state.selectedRows;
        if(datas.length<=0){
            message.warn("???????????????");
            return;
        }
        let ids = [];
        for(let d in datas){
            ids.push({domain_no:datas[d].domainNo,domain_name:datas[d].domainName,phase:datas[d].phase});
        }
        this.select_total_get(ids);
    }
    // ??????????????????????????????
    select_total_get(ids,date){
        let rqd = {
            contract_and_phase:JSON.stringify(ids),
            repay_date:format_date(moment(date))
        }
        axios_repay.post(under_repay_plan_select_total,rqd).then(data=>{
            let info = data.data;
            let config = {
                ids:ids,
                discountInterestFee:info.discountInterestFee,
                discountServiceFee:info.discountServiceFee,
                discountOtherFee:info.discountOtherFee,
                discountOverdueFee:info.discountOverdueFee,
                discountPenaltyFee:info.discountPenaltyFee,
                total_money:info.amount,
                total_principal : info.principal,
                total_interest : info.interest,
                total_defautInterest : info.otherFee,
                total_serviceCharge : info.serviceFee,
                total_overdueFee : info.overdueFee,
                value : `${info.unPayCount}????????????${info.normalCount||"0"}????????????${info.overdueCount||"0"}??????`,
                type : "list",
                loading:false,
                show:true 
            }
            this.set_pre_pay(config,date?false:true);
        })
    }

    total_pay(date){
        let filter = this.state.filter;
        let data = {
            product_line:this.props.page_type,
            ...filter
        }
        axios_repay.post(under_repay_plan_all_total,data).then(res=>{
            if(!res.data.amount){
                message.warn("??????????????????");
                return;
            }
            let total_info = res.data;
            let count = total_info.unPayCount + total_info.overdueCount;
            let config = {
                discountInterestFee:total_info.discountInterestFee,
                discountServiceFee:total_info.discountServiceFee,
                discountOtherFee:total_info.discountOtherFee,
                discountOverdueFee:total_info.discountOverdueFee,
                discountPenaltyFee:total_info.discountPenaltyFee,
                total_money:total_info.amount,
                total_principal : total_info.principal,
                total_interest : total_info.interest,
                total_defautInterest : total_info.otherFee,
                total_serviceCharge : total_info.serviceFee,
                total_overdueFee : total_info.overdueFee,
                value : `${count}????????????${total_info.unPayCount||"0"}????????????${total_info.overdueCount||"0"}??????`,
                type : "total",
                loading:false,
                show:true 
            }
            this.set_pre_pay(config,date?false:true);
        })
    }

    // ????????????
    pay_confirm(){
        this.props.form.validateFields((err,values)=>{
            if(err){
                return;
            }
            let info = JSON.parse(JSON.stringify(this.state.pre_pay));
            info.loading = true;
            this.setState({
                pre_pay:info
            })
            let form_data = values;
            form_data.date = form_data.date.format("YYYY-MM-DD");
            let repay_info = {
                "repayType":form_data.repay_type,
                "repayOrderNo":form_data.date,  // ????????? ??????????????????????????????
                "repayDate":form_data.date,     
                "confirmRepayDate":form_data.date,  // ????????? ??????????????????????????????
                "accountName":"",                   // ????????? ???????????????????????????
                "remark":form_data.remark,
                "amount":info.total_money,
                "discountInterestFee":info.discountInterestFee,
                "discountServiceFee":info.discountServiceFee,
                "discountOtherFee":info.discountOtherFee,
                "discountOverdueFee":info.discountOverdueFee,
                "discountPenaltyFee":info.discountPenaltyFee
            }
            if(this.state.pre_pay.type==="list"){
                this.pre_pay(repay_info)
            }else{
                this.pay_all(repay_info)
            }
        });
    }
    detail(id){
        window.open('/zf/pay/hs/detail?id='+id)
    }
    // ????????????
    modal_hide(){
        let init_data = {
            ids:[],
            discountInterestFee:0,
            discountServiceFee:0,
            discountOtherFee:0,
            discountOverdueFee:0,
            discountPenaltyFee:0,
            total_money:0,
            total_principal : 0,
            total_interest : 0,
            total_defautInterest : 0,
            total_serviceCharge : 0,
            total_overdueFee : 0,
            value : `0????????????0????????????0??????`,
            type : "list",
            loading:false,
            show:false 
        }
        this.setState({
            pre_pay:init_data
        })
    }
    // ??????????????????
    repay_date_change(date,str){
        if(this.state.pre_pay.type==="total"){
            // this.total_pay(str)
            return;
        }
        let ids = this.state.pre_pay.ids;
        this.select_total_get(ids,str);
    }
    textChange(e){
        let value = e.target.value;
        if(value.length>100){
            message.warn("??????????????????????????????100",3);
            value = value.slice(0,100)
        }
        let key = e.target.getAttribute("data-key");
        this.setState({
            [key]:value
        })
    }
    selectChange(val){
        this.setState({
            selectValue:val
        })
    }
    dateChange(val,valStr){
        this.setState({
            repay_date:val
        })
    }
    page_up(page,pageSize){
        window.scrollTo(0,0);
        this.setState({
            nowPage:page
        })
        this.get_list(page,this.state.filter);
    }
    showTotal(){
        return `???${this.state.total}?????????`
    }
    // ????????????
    bindmain(main){
        this.confirm_modal = main;
    }
    render (){
        const { selectedRowKeys } = this.state;
        const { getFieldDecorator } = this.props.form;
        var page=parseInt(this.state.total/(this.state.pageSize + 1),10);
        let pagination = {
            total : this.state.total+page,
            current : this.state.current,
            pageSize : this.state.pageSize+1,
            showTotal:this.showTotal.bind(this),
            onChange : this.page_up.bind(this)
        }
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({ selectedRowKeys , selectedRows });
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User',
                name: record.name
            }),
        };
        // let table_height = window.innerHeight - 470;
        const table_props = {
            rowSelection:rowSelection,
            columns:this.columns ,
            // scroll:{x:2000,y:table_height},
            dataSource:this.state.data,
            pagination : pagination,
            loading:this.state.loading,
            footer:()=> this.state.totalDes
        }
        const footer = [
            <Button key="submit" type="primary" loading={this.state.pre_pay.loading} onClick={this.pay_confirm.bind(this)}>????????????</Button>
        ]
        const payConfirm_props = {
            visible : this.state.pre_pay.show, 
            title : "???????????????",
            // onOk : this.handleOk.bind(this), 
            onCancel : this.modal_hide.bind(this),
            footer : footer,
            className:"pay-plan"
        }
        const table={
            filter:{
                "data-get":this.get_filter.bind(this),
                "data-source":this.filter,
                "data-set":this.set_filter.bind(this),
                "data-paths":this.props.path
            },
            tableInfo:table_props,
            tableTitle:{
                left:<span>
                    ?????????????????? 
                </span>,
                right:<span>
                    <Button type="primary" onClick={(e)=>(this.batch_pay())}>????????????????????????</Button>&emsp;
                    <Button type="primary" onClick={(e)=>(this.total_pay())}>????????????????????????</Button>&emsp;
                    <Permissions type="primary" onClick={(e)=>(this.export_list())} server={global.AUTHSERVER.loanmanage.key} permissions={global.AUTHSERVER.loanmanage.access.cxfq_under_repay_export} tag="button">??????</Permissions>
                </span>
            },
            isFilter:true
        }

        return(
            <div className="Component-body">
                <List {...table} />
                {/* <Filter data-get={this.get_filter.bind(this)} data-set={this.set_filter.bind(this)} data-source={this.filter} />
                <Row className="table-content">
                    <div className="table-btns">
                        <div>
                            <Button type="primary" onClick={(e)=>(this.batch_pay())}>????????????????????????</Button>&emsp;
                            <Button type="primary" onClick={(e)=>(this.total_pay())}>????????????????????????</Button>&emsp;
                        </div>
                        <div>
                            <Button type="primary" onClick={(e)=>(this.export_list())}>??????</Button>
                        </div>                        
                    </div>
                    <Table {...table_props} bordered />
                </Row> */}
                {/* ???????????????????????? */}
                <RepayConfirm bindmain={this.bindmain.bind(this)} />

                <Modal {...payConfirm_props}>
                    <Row>
                        <Col span={8}>
                            <div className="key">??????????????????</div>
                        </Col>
                        <Col span={14} offset={2}>
                            <div className="value">{this.state.pre_pay.value}</div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <div className="key">???????????????????????????</div>
                        </Col>
                        <Col span={14} offset={2} className="value">
                            <div className="value">{this.state.pre_pay.total_money.money()}</div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={2}>
                            <div className="key">??????:</div>
                        </Col>
                        <Col span={6}>
                            <div className="key">??????????????????:</div>
                        </Col>
                        <Col span={14} offset={2} className="value">
                            <div className="value">{this.state.pre_pay.total_principal.money()}</div>
                        </Col>
                        <Col span={8}>
                            <div className="key">??????????????????:</div>
                        </Col>
                        <Col span={14} offset={2} className="value">
                            <div className="value">{this.state.pre_pay.total_interest.money()}</div>
                        </Col>
                        <Col span={8}>
                            <div className="key">????????????????????????:</div>
                        </Col>
                        <Col span={14} offset={2} className="value">
                            <div className="value">{this.state.pre_pay.total_defautInterest.money()}</div>
                        </Col>
                        <Col span={8}>
                            <div className="key">?????????????????????:</div>
                        </Col>
                        <Col span={14} offset={2} className="value">
                            <div className="value">{this.state.pre_pay.total_serviceCharge.money()}</div>
                        </Col>
                        <Col span={8}>
                            <div className="key">??????????????????(?????????):</div>
                        </Col>
                        <Col span={14} offset={2} className="value">
                            <div className="value">{this.state.pre_pay.total_overdueFee.money()}</div>
                        </Col>
                    </Row>
                    <Form>
                        <Row>
                            <Col span={8}>
                                <div className="key">????????????:</div>
                            </Col>
                            <Col span={14} offset={2} className="value">
                                <FormItem>
                                    {getFieldDecorator("date",{
                                        rules:[{ required: true, message: '???????????????' }]
                                    })(
                                        <DatePicker onChange={this.repay_date_change.bind(this)} />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <div className="key">???????????????:</div>
                            </Col>
                            <Col span={14} offset={2} className="value">
                                <FormItem>
                                    {getFieldDecorator("repay_order_no",{
                                        rules:[{required:true,message:"??????????????????"}]
                                    })(
                                        <Input placeholder="?????????????????????" />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <div className="key">????????????:</div>
                            </Col>
                            <Col span={14} offset={2} className="value">
                                <FormItem>
                                    {getFieldDecorator("repay_type",{
                                        rules:[{required:true,message:"??????????????????"}]
                                    })(
                                        <Select placeholder="?????????????????????">
                                            <Option value="??????">??????</Option>
                                            <Option value="??????">??????</Option>
                                            <Option value="???????????????">???????????????</Option>
                                            <Option value="??????">??????</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <div className="key">??????:</div>
                            </Col>
                            <Col span={14} offset={2} className="value">
                                <FormItem>
                                    {getFieldDecorator("remark")(
                                        <Input placeholder="????????????" />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
                <style>{`
                    .pay-plan {
                        font-size:14px;
                    }
                    .pay-plan .ant-form-item {
                        margin-bottom:10px;
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

export default Form.create()(Page);
