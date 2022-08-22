import React, { Component } from 'react';
// import moment from 'moment'
import { Table , Row , Button , message,Modal ,Form,Col,Input} from 'antd';
// import Filter from '../../ui/Filter_obj';
import {axios_sh,axios_cxfq} from '../../../ajax/request';
import {company_list,product_list,get_merchant_list,tbd_list,patch_bd_prepare,patch_bd,deny_archive} from '../../../ajax/api';
import { format_table_data,format_time ,bmd} from '../../../ajax/tool';
import { page } from '../../../ajax/config';
import List from '../../templates/list';
import Permissions from '../../../templates/Permissions';
const EditableCell = ({ editable, value, onChange }) => (
    <div>
        {editable
            ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} placeholder="请输入补录的保单号" />
            : HaveValue(value)
        }
    </div>
);
const HaveValue=(value)=>
{
    return value?value:"--"
}

class Borrow extends Component{
    constructor(props) {
        super(props);
        this.state = {
            company_list:'',
            product_list:'',
            merchant_list:'',
            loading: false,
            total:1,
            current:1,
            pageSize:page.size,
            data:[],
            filter:{},
            button:false,
            more:true,
            visible:false,
            syxList:[],
            jqxList:[],
            prepare:{
                archiveSize:'',
                tbdSize:"",
                orderId:"",
                orderNo:""
            },
            bdArr:[],
            deny:false
        };
        this.idArr=[];
        this.syxArr=[]
    }
    componentWillMount(){
        //this.getSelect();
        this.filter = {
            time:{
                name:"订单日期",
                type:"range_date",
                feild_s:"start_date",
                feild_e:"end_date",
                placeHolder:['开始日期',"结束日期"]
            },
            order_no :{
                name:"订单编号",
                type:"text",
                placeHolder:"请输入订单编号"
            },
            insur_company_id :{
                name:"保险公司",
                type:"select",
                placeHolder:"全部",
                values:"companys"
            },
            archive_status :{
                name:"补录状态",
                type:"select",
                placeHolder:"全部",
                values:[{name:"全部",val:""},{name:"待补录",val:0},{name:"已补录",val:1},{name:"补录中",val:2},{name:"补录驳回",val:-1}]
            },
            product_id :{
                name:"产品名称",
                type:"select",
                placeHolder:"全部",
                values:"products"
            },
            merchant_id :{
                name:"商户名称",
                type:"select",
                placeHolder:"全部",
                values:"merchants"
            }

        };
        this.columns=[
            {
                title:"序号",
                dataIndex:"key",
                render:(text,record,index)=>{
                    if(text==="合计"){
                        return text;
                    }
                    return `${index+1}`
                }
            },
            {
                title:"订单日期",
                dataIndex:"orderCreateTime",
                render:e=>{
                    return format_time(e)
                },
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"orderCreateTime")
                }
                //width:"150px"
            },
            {
                title:"订单编号",
                dataIndex:"orderNo",
                //width:"100px"
            },
            //{
            //    title:"保险公司",
            //    dataIndex:"insurCompany",
            //    //width:"100px",
            //    //render:(e)=>{
            //    //    if(e.length>0){
            //    //        var company=[];
            //    //        for(var i in e){
            //    //            company.push(e[i]);
            //    //        }
            //    //        return company.split(",");
            //    //    }else{
            //    //        return ''
            //    //    }
            //    //}
            //},
            {
                title:"投保单数量",
                dataIndex:"tbdSize",
                //width:"100px"
            },
            {
                title:"补录状态",
                dataIndex:"archiveStatusStr",
                //width:"100px"
            },
            {
                title:"补录数量",
                //width:"80px",
                //dataIndex:"archiveSize",
                render:e=>{
                    return e.archiveSize+'/'+e.tbdSize
                }
            },
            {
                title:"产品名称",
                dataIndex:"productName",
                //width:"100px"
            },
            {
                title:"商户名称",
                dataIndex:"merchantName",
                //width:"100px"
            },
            {
                title:"操作",
                //fixed:"right",
                //width:"150px",
                render:(e)=>{
                    return (<div>
                        <Permissions type="primary" size="small" onClick={()=>{this.prepare(e.orderId)}} disabled={this.state.button} server={global.AUTHSERVER.cxfq.key} permissions={global.AUTHSERVER.cxfq.access.bd_patch} tag="button">补录</Permissions>
                    </div>)

                }
            }
        ];
        this.prepareColumns=[
            {
                title:"序号",
                dataIndex:"key"
            },
            {
                title:"保险公司",
                dataIndex:"insurCompany"
            },
            {
                title:"类型",
                dataIndex:"typeStr"
            },
            {
                title:"金额",
                dataIndex:"amount",
                render:(e)=>{
                    return e.money()
                }
            },
            {
                title:"保单起止日期",
                render:(e)=>{
                    if(e.startDate&&e.endDate){
                        return e.startDate
                    }else{
                        return '--'
                    }

                }
            },
            {
                title:"补录单号",
                dataIndex:"bdNo",
                render: (text, record) => this.renderColumns(text, record, 'bdNo'),
            },
            {
                title:"补录状态",
                dataIndex:"archiveStatusStr"
            },
            {
                title:"保单状态",
                dataIndex:"statusStr",
                render:(e)=>{
                    return e?e:'--'
                }
            },
            {
                title:"爬虫状态",
                dataIndex:"crawlerStatusStr",
                render:(e)=>{
                    return e?e:'--'
                }
            },
            {
                title:"操作",
                render:(e)=>{
                    if(e.archiveStatus===1){
                        if(e.editable){
                            return <Button type="primary" size="small" onClick={()=>{this.save(e.key)}}>保存</Button>
                        }else{
                            return <div>
                                {
                                    //<Button type="danger" size="small" onClick={()=>{this.denyArchive(e.id)}}>驳回</Button>&emsp;
                                }

                                <Button type="primary" size="small" onClick={()=>{this.edit(e.key)}}>修改</Button>
                            </div>
                        }
                    }else if(e.archiveStatus===-1){
                        if(e.editable){
                            return <Button type="primary" size="small" onClick={()=>{this.save(e.key)}}>保存</Button>
                        }else{
                            return <Button type="danger" size="small" onClick={()=>{this.edit(e.key)}}>修改</Button>
                        }

                    }else if(e.archiveStatus===0){
                        //return <Button type="primary" size="small" onClick={()=>{this.save(e.key)}}>补录</Button>
                        if(e.editable){
                            return <Button type="primary" size="small" onClick={()=>{this.save(e.key)}}>保存</Button>
                        }else{
                            return <Button type="primary" size="small" onClick={()=>{this.edit(e.key)}}>补录</Button>
                        }
                    }
                }
            }
        ]
    }
    componentDidMount(){
        this.getSelect();
        var select=window.localStorage.getItem(this.props.location.pathname);
        if(select){
            this.get_list(1,JSON.parse(select).remberData);
        }else{
            this.get_list();
        }
    }
    get_list(page_no,filter={}){
        this.setState({
            loading:true,
            selectedRowKeys:[],
            selectedRows:[]
        });
        let rqd = {
            page:1,
            page_size:page.size,
            //status:status,
            ...filter
        }
        axios_sh.post(tbd_list,rqd).then((data)=>{
            var list=data.data;
            this.setState({
                data:format_table_data(list,page_no,page.size),
                total:list.totalData,
                current:list.current,
                loading:false
            })
        });
    }
    get_filter(data){
        this.get_list(1,data);
        this.setState({
            filter:data
        });
    }
    page_up(page,pageSize){
        window.scrollTo(0,0);
        this.get_list(page,this.state.filter);
    }
    filterValue(arr){
        let res = [{val:"",name:"全部"}];
        for(let a in arr){
            res.push({val:arr[a].id,name:arr[a].name})
        }
        return res;
    }
    getSelect(){
        axios_sh.get(company_list).then(e=>{
            this.setState({company_list:this.filterValue(e.data)})
        });
        axios_sh.get(product_list).then(e=>{
            this.setState({product_list:this.filterValue(e.data)})
        });
        axios_sh.get(get_merchant_list).then(e=>{
            this.setState({merchant_list:this.filterValue(e.data)})
        })
    }
    prepare(id){
        this.syxArr=[];
        this.setState({
            visible:true,
            syxList:[],
            jqxList:[],
            prepareId:id
        });
        axios_sh.get(patch_bd_prepare+"?orderId="+id).then(e=>{
            if(!e.code){
                var bdArr=[];
                bdArr=e.data.syxList;
                if(e.data.jqxccsList){
                    bdArr.push(e.data.jqxccsList[0])
                    this.setState({
                        //jqxList:e.data.jqxccsList
                    })
                }
                //for()
                this.setState({
                    bdArr:format_table_data(bdArr),
                    prepare:e.data
                });
            }
        });
    }
    onOk(){
        var syxArr=[],jqxArr=[];
        var bdArr=this.state.bdArr;
        for(var b in bdArr){
            if(bdArr[b].editable){
                message.warn("请先保存订单信息");
                return;
            }
            if(!bdArr[b].bdNo){
                message.warn("请填写正确保单号，支持50字以内的字母，数字及组合");
                return;
            }
            var bdInfo={};
            bdInfo.bdNo=bdArr[b].bdNo;
            bdInfo.id=bdArr[b].id;
            bdInfo.type=bdArr[b].type;
            bdInfo.ordinal=bdArr[b].ordinal;
            if(bdArr[b].type===1){
                syxArr.push(bdInfo)
            }else if(bdArr[b].type===3){
                jqxArr.push(bdInfo)
            }
        }
        var param={};
        param.orderId=this.state.prepare.orderId;
        param.jqxccsList=jqxArr;
        param.syxList=syxArr;
        axios_cxfq.post(patch_bd,param).then(e=>{
            if(!e.code){
                message.success("补录成功");
                this.setState({
                    visible:false
                });
                this.get_list()
            }
        });
    }
    onCancel(){
        this.setState({
            visible:false
        })
    }
    getSyx(e){
        this.syxArr.push(e)
    }
    getJqx(e){
        this.jqx=e;
    }
    //保单补录修改
    renderColumns(text, record, column) {
        return (
            <EditableCell editable={record.editable} value={text} onChange={value => this.handleChange(value, record.key, column)} />
        );
    }
    edit(key) {
        const newData = [...this.state.bdArr];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            target.editable = true;
            this.setState({ bdArr: newData });
        }
    }
    save(key) {
        const newData = [...this.state.bdArr];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            var bd=/^[A-Za-z0-9]{1,50}$/;
            if(!bd.test(target.bdNo)){
                message.warn("请填写正确保单号，支持50字以内的字母，数字及组合");
                return
            }
            if(!target.bdNo){
                message.warn("请填写正确保单号，支持50字以内的字母，数字及组合");
                return
            }
            delete target.editable;
            this.setState({ bdArr: newData });
            this.cacheData = newData.map(item => ({ ...item }));
        }
        console.log(this.state.bdArr)
    }
    handleChange(value, key, column) {
        const newData = [...this.state.bdArr];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            target[column] = value;
            this.setState({ bdArr: newData });
        }
    }
    //保单驳回
    denyArchive(key){
        this.setState({
            deny:true,
            denyId:key
        })
    }
    ondenyCancel(){
        this.setState({deny:false})
    }
    ondenyOk(){
        if(!this.state.denyReason){
            message.warn("请输入驳回意见");
            return;
        }
        if(this.state.denyReason.lenght>50){
            message.warn("驳回意见不能超过50个字");
            return;
        }
        axios_cxfq.get(deny_archive+"?insurDetailId="+this.state.denyId+"&denyReason="+this.state.denyReason).then((e)=>{
            if(!e.code){
                message.success("驳回成功");
                this.ondenyCancel();
                this.prepare(this.state.prepareId);
            }
        });
    }
    denyReason(e){
        this.setState({denyReason:e.target.value})
    }
    render (){
        let pagination = {
            total : this.state.total,
            current : this.state.current,
            //pageSize : this.state.pageSize+1,
            pageSize:20,
            onChange : this.page_up.bind(this),
            showTotal:total=>`共${total}条数据`
        };
        const table_info={
            //rowKey:"orderId",
            //scroll:{x:1800},
            //rowSelection:rowSelection,
            columns:this.columns,
            dataSource:this.state.data,
            pagination : pagination,
            loading:this.state.loading
        };
        const foot=<div style={{textAlign:"center"}}>
            <Button style={{marginRight:"10px"}} onClick={this.onCancel.bind(this)}>取消</Button>
            <Button type="primary" onClick={this.onOk.bind(this)}>确认</Button>
        </div>;
        const denyFoot=<div style={{textAlign:"center"}}>
            <Button style={{marginRight:"10px"}} onClick={this.ondenyCancel.bind(this)}>取消</Button>
            <Button type="primary" onClick={this.ondenyOk.bind(this)}>确认</Button>
        </div>;
        const modalInfo={
            title:"补填详情",
            footer:foot,
            visible:this.state.visible,
            closable:false,
            width:"80%"

        };
        const deny={
            title:"确认驳回？",
            visible:this.state.deny,
            closable:false,
            footer:denyFoot
        }
        const table={
            filter:{
                "data-get":this.get_filter.bind(this),
                "data-source":this.filter,
                "companys":this.state.company_list,
                "merchants":this.state.merchant_list,
                "products":this.state.product_list
            },
            tableInfo:table_info,
            tableTitle:{
                left:null,
                right:null
            }
        }
        return(
            <div>
                {/* <Filter data-get={this.get_filter.bind(this)} data-source={this.filter} companys={this.state.company_list} products={this.state.product_list} merchants={this.state.merchant_list} />
                <Row style={{padding:"20px"}}>
                <Row style={{background:"#fff"}}>
                <Row className="content">
                    <Table {...table_info} bordered />
                </Row>
                </Row>
                </Row> */}
                <List {...table} />
                <Modal {...modalInfo}>
                    <Row style={{fontSize:"14px",color:"#444",marginBottom:"10px"}}>
                        <Col span={12}>订单编号:{this.state.prepare.orderNo}</Col>
                        <Col span={8}>补录数量:{this.state.prepare.archiveSize+'/'+this.state.prepare.tbdSize}</Col>
                    </Row>
                    <Table columns={this.prepareColumns} dataSource={this.state.bdArr} bordered pagination={false} />
                    {
                        //this.state.syxList.map((i,k)=>{
                        //    return <Bd data={i} key={k} onref={this.getSyx.bind(this)} />
                        //})
                    }
                    {
                        //this.state.jqxList.map((i,k)=>{
                        //    return <Bd data={i} key={k} onref={this.getJqx.bind(this)} />
                        //})
                    }
                </Modal>
                <Modal {...deny}>
                    <Input placeholder="请输入驳回意见" onChange={this.denyReason.bind(this)} />
                </Modal>
            </div>
        )
    }
}

export default Form.create()(Borrow);
