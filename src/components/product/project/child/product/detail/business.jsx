import React, { Component } from 'react';

import {Table,Row,Col} from 'antd';
import {axios_zyzj_json} from '../../../../../../ajax/request';
import {merchant_zj_business_info,merchant_zj_business_user} from '../../../../../../ajax/api';
// import {accMul} from '../../../../../../ajax/tool';
class Bus extends Component {
    constructor(props) {
        super(props);
        this.state={
            service_fee:"0",
            id:"",
            userEdit:[],
            userArr:[],
            rate:props.rate
        }
    }
    componentDidMount() {
        console.log(this.state.rate)
        this.get_edit();
        
    }
    get_edit(){
        axios_zyzj_json.get(merchant_zj_business_info+"?lmLoanConfigNo="+this.props.configNo).then(e=>{
            if(!e.code&&e.data){
                this.setState({
                    id:e.data.id,
                    service_fee:e.data.feeRateCalMode,
                    rate:!e.data.isFixedRate
                })
            }
        })
        axios_zyzj_json.get(merchant_zj_business_user+"?lmLoanConfigNo="+this.props.configNo).then(e=>{
            if(!e.code&&e.data){
                var arr = e.data;
                var map = {},
                    dest = [];
                for (var i = 0; i < arr.length; i++) {
                    var ai = arr[i];
                    if (!map[ai.userLabel]) {
                        dest.push({
                            id: ai.userLabel,
                            data: [ai]
                        });
                        map[ai.userLabel] = ai;
                    } else {
                        for (var j = 0; j < dest.length; j++) {
                            var dj = dest[j];
                            if (dj.id === ai.userLabel) {
                                dj.data.push(ai);
                                break;
                            }
                        }
                    }
                }
                
                this.setState({
                    userArr:dest,
                })
                console.log(dest)
            }
        })
        
    }
    render() {
        const type={FIX:"借款金额百分比/期",GENERAL_SUB_INTEREST:"综合费率-利息费率",NEVER:"不收取"};
        const titleInfo = {
            span: 4,
            className: "text_margin"
        }
        const columns=[
            {
                title:"期数",
                dataIndex:"periodCount"
            },
            {
                title:"综合费率（"+this.props.rate+"利率）",
                // dataIndex:"generalRate",
                render:e=>{
                    var e=e.generalRate||e.aprGeneralRate;
                    if(this.state.rate){
                        var val=e?e.split("-"):[];
                        return val[0]+"%-"+val[1]+"%"
                    }else{
                        return e+"%"
                    }
                }
            },
            {
                title:"小贷利息费（"+this.props.rate+"利率）",
                // dataIndex:"interestRate",
                render:e=>{
                    var data=e.interestRate||e.aprInterestRate;
                    return data+"%"
                }
            }
        ];
        if(this.state.service_fee==="FIX"){
            columns.push({title:"小贷服务费收取金额",dataIndex:"feeRate",render:e=>e+"%*借款金额/期"})
        }
        return (<div>
            <div className="sh_add_card_product">
                <div className="sh_add_title" style={{ marginLeft: "20px" }}>业务信息</div>
            <Row className="product_card">
                <Row className="sh_inner_box" style={{ marginBottom: "10px" }}>
                    <Col {...titleInfo}>
                        <span className="product_card_title">综合费率是否浮动</span>
                    </Col>
                    <Col span={16} pull={1}>
                        <span className="product_card_title">{this.state.rate?"是":"否"}</span>
                    </Col>
                </Row>
                <Row className="sh_inner_box" style={{ marginBottom: "10px" }}>
                    <Col {...titleInfo}>
                        <span className="product_card_title">小贷服务费</span>
                    </Col>
                    <Col span={16} pull={1}>
                        <span className="product_card_title">{type[this.state.service_fee]}</span>
                    </Col>
                </Row>
            </Row>
            </div>
            <div className="sh_add_card_product">
                <div className="sh_add_title" style={{ marginLeft: "20px" }}>用户群配置</div>
                <Row className="product_card">
                {this.state.userArr.map((i,k)=>{
                    return <div style={{marginBottom:"20px"}} key={k}>
                            <div style={{marginBottom:"5px",fontSize:"14px"}}>用户群名称：{i.id}</div>
                            <Table dataSource={i.data} columns={columns} bordered pagination={false} rowKey="id" />
                        </div>
                })}
                </Row>
            </div>
        </div>)
    }
}
export default Bus