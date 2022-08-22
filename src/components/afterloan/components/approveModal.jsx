import React, { Component } from 'react';
import { Button, Modal , Form , Input , Row , message ,Table,Col} from 'antd';
import moment from 'moment'

import { axios_postloan } from '../../../ajax/request';
import { afterloan_overdue_audit,afterloan_overdue_auditlist} from '../../../ajax/api';
import { format_table_data} from '../../../ajax/tool';
const { TextArea } = Input;
class UrgeModal extends Component{
    constructor(props) {
        super(props);
        this.state = {
            visible:false,
            userId :"",
            
        };
        this.today = moment()
    }
    componentDidMount(){
        this.columns_history = [
            {
                title: '序号',
                dataIndex: 'key',
            },
            {
                title:"申请金额",
                // dataIndex:"money",
                render:(datas)=> {
                    var type=datas.type;
                    if(datas.data){
                        var amount=JSON.parse(datas.data);
                        if(type==="PL_DISCOUNT"){
                            var discounts=amount.phaseList;
                            var money=0;
                            for(var i in discounts){
                                for(var j in discounts[i].discount){
                                    money+=Number(discounts[i].discount[j]);
                                }
                                
                            }
                            this.money+=Number(money.money())
                            return money.money();
                            
                        }else{
                            this.money+=Number(amount.amount.money())
                            return amount.amount.money()
                        }
                    }
                    

                }
            },
            {
                title: '审批人',
                dataIndex:'auditor',
                render:e=>e||"--"
            },
            {
                title: '审批时间',
                dataIndex:'auditTime',
                render:e=>e||"--"
            },
            {
                title: '审批结果',
                dataIndex:'status',
                render:e=>{
                    var type={0:"待审核",100:"审核中",200:"审核成功",300:"审核失败"};
                    return type[e]
                }
            },
            {
                title: '审批意见',
                dataIndex:'auditOpinion',
                render:e=>e||"--"
            },
        ];
        // this.get_list();
    }
    componentWillReceiveProps(props){
        this.setState({
            visible:props.visible,
            userId:props.userId,
            domainNo:props.domainNo,
            type:props.type
        })
    }
    get_list(){
        console.log(this.state.domainNo)
        let rqd = {};
        rqd.page = 1;
        rqd.size = 200;
        rqd.domainNo=this.state.domainNo;
        rqd.type=this.state.type;
        this.setState({
            loading:true
        })
        axios_postloan.post(afterloan_overdue_auditlist,rqd).then((data)=>{
            let detail = data.data.list;
            this.setState({
                list:format_table_data(detail,1,200),
            });
        });
    }
    // // 显示催记弹窗
    // insertUrge(e){
    //     let info = this.props.form.getFieldsValue();
    //     info.collectionTime = format_date(info.collectionTime);
    //     info.userLoanId = this.state.userId;
    //     axios_xjd.post(afterloan_overdue_insert_collection,info).then(res=>{
    //         message.success(res.msg);
    //         this.setState({
    //             modalVisible:false
    //         })
    //         this.cancelModal();
    //     })
    // }

    // 关闭弹窗
    cancelModal(){
        this.setState({
            visible:false,
            opinion:""
        })
        this.props.bindcancel();
        this.props.form.resetFields();
    }
    reject(){
        if(!this.state.opinion){
            message.warn("请填写审批意见");
            return;
        }
        var param={
            auditOrderId:this.props.auditOrderId,
            auditResult:false,
            opinion:this.state.opinion
        }
        axios_postloan.post(afterloan_overdue_audit,param).then(e=>{
            if(!e.code){
                message.success("审批成功");
                this.cancelModal();
                this.props.list();
            }
        })
    }
    agree(){
        var param={
            auditOrderId:this.props.auditOrderId,
            auditResult:true,
            opinion:this.state.opinion||""
        }
        axios_postloan.post(afterloan_overdue_audit,param).then(e=>{
            if(!e.code){
                message.success("审批成功");
                this.cancelModal();
                this.props.list();
            }
        })
    }
    change(e){
        this.setState({
            opinion:e.target.value
        })
    }
    render (){
        const modalProps = {
            title:this.props.type==="PL_DISCOUNT"?(this.props.modalType?"减免审批":"减免查看"):(this.props.modalType?"人工划扣审批":"人工划扣查看"),
            visible:this.state.visible,
            onCancel:this.cancelModal.bind(this),
            footer:this.props.modalType?<div>
                <Button type="danger" size="small" onClick={this.reject.bind(this)}>驳回</Button>
                <Button type="primary" size="small" onClick={this.agree.bind(this)}>通过</Button>
            </div>:null,
            maskClosable: false,
            width:600
        }
        var data=this.props.data;
        var amount=data?JSON.parse(data.data):"";
        var phaseList=amount.phaseList;
        var title=[
            {title:"应还本金",param:"principal",father:"plan"},
            {title:"应还利息",param:"interest",father:"plan"},
            {title:"应还服务费",param:"serviceFee",father:"plan"},
            {title:"应还其他费用",param:"otherFee",father:"plan"},
            {title:"应还逾期罚息",param:"overdueFee",father:"expect"},
            {title:"应还违约金",param:"penaltyOverdueFee",father:"expect"},
            {title:"应还提前结清手续费",param:"penaltyAheadFee",father:"expect"},
            {title:"应还科技服务费",param:"serviceTechFee",father:"plan"},
            {title:"合计",type:true,param:["principal","interest","serviceFee","otherFee","overdueFee","penaltyOverdueFee","penaltyOverdueFee","serviceTechFee"],father:"expect"},
        ]
        var ys=0,jm=0;
        return(
            <Modal {...modalProps}>
                <div className="sh_add">
                {this.props.type==="PL_DISCOUNT"?<div>
                <table className="sh_product_table" cellSpacing="0" cellPadding="0" style={{ fontSize: "14px" }}>
                    <thead style={{ background: "#f7f7f7" }}>
                        <tr>
                            <th style={{ background: "#f7f7f7" }}>费用类别</th>
                            <th style={{ background: "#f7f7f7" }}>期数</th>
                            <th style={{ background: "#f7f7f7" }}>原始金额(元)</th>
                            <th style={{ background: "#f7f7f7" }}>减免(元)</th>
                            <th style={{ background: "#f7f7f7" }}>减免后(元)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            title.map((i,k)=>{
                                
                                return phaseList.map((j,n)=>{
                                    if(i.type){
                                        var type=i.param;
                                        type.map((y,m)=>{
                                            ys+=j.expect[y];
                                            jm+=j.discount[y];
                                            return true
                                        })
                                    }
                                    if(i.title==="合计"){
                                        if(n===phaseList.length-1){
                                            return <tr>
                                            {<td>{i.title}</td>}
                                        <td>{i.type?"":j.phase}</td>
                                        <td>{i.type?ys.money():j.expect[i.param].money()}</td>
                                        <td>{i.type?jm.money():j.discount[i.param].money()}</td>
                                        <td>{i.type?(ys-jm).money():(Number(j.expect[i.param])-Number(j.discount[i.param])).money()}</td>
                                        </tr>
                                        }
                                                
                                    }else{
                                        return <tr>
                                        {n?null:<td rowSpan={phaseList.length}>{i.title}</td>}
                                    <td>{i.type?"":j.phase}</td>
                                    <td>{i.type?ys.money():j.expect[i.param].money()}</td>
                                    <td>{i.type?jm.money():j.discount[i.param].money()}</td>
                                    <td>{i.type?(ys-jm).money():(Number(j.expect[i.param])-Number(j.discount[i.param])).money()}</td>
                                    </tr>
                                    }
                                    return true
                                })
                            })
                            
                        }
                        {/* {
                            phaseList.map((j,n)=>{
                                return title.map((i,k)=>{
                                    var ys=0,jm=0;
                                    if(i.type){
                                        var type=i.param;
                                        type.map((y,m)=>{
                                            ys+=j.expect[y];
                                            jm+=j.discount[y];
                                        })
                                    }
                                    return <tr>
                                    {n?null:<td rowSpan={j.length}>{i.title}</td>}
                                <td>{i.type?"":j.phase}</td>
                                <td>{i.type?ys.money():j.expect[i.param].money()}</td>
                                <td>{i.type?jm.money():j.discount[i.param].money()}</td>
                                <td>{i.type?(ys-jm).money():(Number(j.expect[i.param])-Number(j.discount[i.param])).money()}</td>
                                </tr>
                                })
                            })
                            
                        } */}
                    </tbody>
                </table>
                <Row className="row">
                    <Col span={3} className="rowTitle">申请人</Col>
                    <Col span={20}>{data.sender||"无"}</Col>
                </Row>
                <Row className="row">
                    <Col span={3} className="rowTitle">申请原因</Col>
                    <Col span={20}>{data.purpose||"无"}</Col>
                </Row>
                <Row className="row">
                    <Col span={3} className="rowTitle">审批历史</Col>
                    <Col span={20}>
                        <Table columns={this.columns_history} dataSource={this.props.history} bordered pagination={false} />
                    </Col>
                </Row>
                {this.props.modalType?<Row className="row">
                    <Col span={3} className="rowTitle">审批意见</Col>
                    <Col span={20}>
                        <TextArea onChange={this.change.bind(this)} value={this.state.opinion} />
                    </Col>
                </Row>:null}
                </div>:
                <div>
                <Row className="row">
                    <Col span={5} className="rowTitle">应还金额</Col>
                    <Col span={18}>{amount?amount.amount.money()+"元":""}</Col>
                </Row>
                <Row className="row">
                    <Col span={5} className="rowTitle">申请划扣金额</Col>
                    <Col span={18}>{amount?amount.amount.money()+"元":""}</Col>
                </Row>
                <Row className="row">
                    <Col span={5} className="rowTitle">申请人</Col>
                    <Col span={18}>{data?data.sender:""}</Col>
                </Row>
                <Row className="row">
                    <Col span={5} className="rowTitle">申请原因</Col>
                    <Col span={18}>{data?data.purpose||"无":"无"}</Col>
                </Row>
                <Row className="row">
                    <Col span={5} className="rowTitle">审批历史</Col>
                    <Col span={18}>
                        <Table columns={this.columns_history} dataSource={this.props.history} bordered pagination={false} />
                    </Col>
                </Row>
                {this.props.modalType?<Row className="row">
                    <Col span={5} className="rowTitle">审批意见</Col>
                    <Col span={18}>
                        <TextArea onChange={this.change.bind(this)} value={this.state.opinion} />
                    </Col>
                </Row>:null}
                </div>}
                </div>
                <style>{`
                    .row{
                        margin-top:30px;
                        font-size:14px;
                        color:#000
                    }
                    .rowTitle{ 
                        opacity:0.5;
                        text-align:right;
                        margin-right:10px
                    }
                `}</style>
            </Modal>
        )
    }
}

export default Form.create()(UrgeModal);
