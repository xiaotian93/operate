import React , { Component } from 'react';
import { Button, message, Spin } from 'antd';

import Card from '../../../templates/Card';
import BaseInfo from './baseinfo';
import RelateInfo from './relateinfo';
import StepOne from './step_one';
import StepTwo from './step_two';
import StepThree from './step_three';
import { axios_sh , axios_cxfq } from './../../../ajax/request';
import { capital_confirm_detail , capital_confirm_submit } from './../../../ajax/api';
import { page_go } from '../../../ajax/tool';

class Confirm extends Component {
    constructor(props){
        super(props);
        this.state = {
            loading:true,
            step_one:"radio",
            base_info:{},
            relate_info:"",
            type:props.location.query.type,
            request_id:this.props.location.query.request_id||"",
            step_two_source:[],
            step_three_source:[]
        }
    }
    componentDidMount(){
        this.detail_info_get();
    }

    // 获取确认详情
    detail_info_get(){
        axios_sh.post(capital_confirm_detail,{requestId:this.state.request_id}).then(data=>{
            let step_two_source = data.data.detailList;
            // let step_three_source = data.data.capitalAccountList;
            this.setState({
                loading:false,
                base_info:data.data.basic,
                relate_info:data.data,
                element_map:data.data.detailCapitalMapping||[],
                account_all:data.data.capitalAccountList||[]
            });
            this.step_one.setState({
                disable_more:step_two_source.length>1?false:true
            })
            let amount_total = 0;
            let confirm_total = 0;
            for(let s in step_two_source){
                step_two_source[s].confirm = step_two_source[s].status===1?step_two_source[s].amount:0;
                confirm_total += step_two_source[s].confirm;
                amount_total += step_two_source[s].amount;
            }
            if(step_two_source.length>0){
                step_two_source.push({subGroup:"total",subGroupStr:"合计",amount:amount_total,confirm:confirm_total,status:"-1"});
            }
            this.step_two.setState({
                source:step_two_source,
                source_view:step_two_source
            })
        })
    }

    // 选择第一步
    step_one_change(type){
        this.step_two.setState({
            element:type
        })
        this.step_three.setState({
            element:type
        })
        this.step_two.init_data();
        this.step_three.init_data();
    }

    // 绑定组件
    bind_step_one(main){
        this.step_one = main;
    }
    bind_step_two(main){
        this.step_two = main;
    }
    bind_step_three(main){
        this.step_three = main;
    }

    // 选择成份
    step_two_select(keys,rows){
        this.allot_amount(keys,this.step_three.state.selectedRows);
        let account_all = JSON.parse(JSON.stringify(this.state.account_all));
        let step_three_source = [];
        let maps = this.state.element_map;
        let group_ids = [];
        for(let r in rows){
            group_ids = group_ids.concat(maps[rows[r].subGroup])
        }
        group_ids = [...new Set(group_ids)];
        for(let a in account_all){
            if(group_ids.indexOf(account_all[a].groupId)>=0){
                // account_all[a].amount = 10000;
                step_three_source.push(account_all[a]);
            }
        }
        this.step_three.init_data();
        this.step_three.setState({
            source:step_three_source
        })
    }
    
    // 选择账户主体
    step_three_select(rows){
        this.allot_amount(this.step_two.state.selectedRowKeys,rows);
    }
    
    // 计算确认金额
    allot_amount(two_select_keys,three_source){
        let step_two_source = JSON.parse(JSON.stringify(this.step_two.state.source));
        let step_three_source = JSON.parse(JSON.stringify(three_source));
        let step_select_keys = JSON.parse(JSON.stringify(two_select_keys));
        let step_two_select = [];
        for(let s in step_two_source){
            let element = step_two_source[s];
            if(step_select_keys.indexOf(element.subGroup)<0){
                continue;
            }
            element.select = true;
            for(let r in step_three_source){
                if(element.confirm<element.amount){
                    let differ = Math.round(element.amount - element.confirm);
                    if(differ>step_three_source[r].amount){
                        element.confirm = Math.round(parseInt(element.confirm,10) + parseInt(step_three_source[r].amount,10)) ;
                        step_three_source[r].amount = 0;
                    }else{
                        element.confirm = element.amount;
                        element.status = 2;
                        step_three_source[r].amount = Math.round(step_three_source[r].amount-differ);
                        break;
                    }
                }else{
                    element.status = 2;
                    break;
                }
            }
            step_two_select.push(element)
        }
        let last = step_two_source.length-1;
        step_two_source[last].confirm = 0 ;
        for(let s in step_two_source){
            if(s===last.toString()){
                continue;
            }
            step_two_source[last].confirm += step_two_source[s].confirm;
        }
        this.step_two.setState({
            source_view:step_two_source,
            selectedRows:step_two_select
        })
    }

    // 提交数据
    submit_data(){
        let req = {
            requestId:this.state.base_info.requestId,
            group:this.state.base_info.group,
            detailReqList:[],
            capitalAccountReqList:[]
        }
        let element_select = this.step_two.state.selectedRows;
        let account_select = this.step_three.state.selectedRows;
        req.detailReqList = element_select;
        req.capitalAccountReqList = account_select;
        if(this.varify_data()){
            axios_cxfq.post(capital_confirm_submit,req).then(data=>{
                page_go("/zj/confirm");
            })
        }
    }

    // 验证所选主体是否包含成份
    varify_data(){
        let element_select = this.step_two.state.selectedRows;
        let account_select = this.step_three.state.selectedRows;
        if(element_select.length<=0){
            message.warn("请选择成份");
                return false
        }
        if(account_select.length<=0){
            message.warn("请选择资金账户");
                return false
        }
        for(let e in element_select){
            let accounts = this.state.element_map[element_select[e].subGroup];
            if(element_select[e].status!==2){
                message.warn("未确认完成金额");
                return false
            }
            for(let a in account_select){
                if(!accounts.includes(account_select[a].groupId)){
                    message.warn("所选成份不包含所选主体");
                    return false;
                }
            }
        }
        return true;
    }

    render(){
        let relate_info = this.state.relate_info?<RelateInfo data-source={this.state.relate_info} />:"";
        return (
            <div>
                <Spin tip="loading" spinning={this.state.loading}>
                    <Card className="contain">
                        <BaseInfo data-source={this.state.base_info} /><br />
                        { relate_info }
                    </Card>
                    <Card className="contain">
                        <h3 className="sub-title">资金确认信息</h3>
                        <StepOne onChange={this.step_one_change.bind(this)} main_bind={this.bind_step_one.bind(this)} />
                        <StepTwo select={this.step_two_select.bind(this)} main_bind={this.bind_step_two.bind(this)} />
                        <StepThree select={this.step_three_select.bind(this)} main_bind={this.bind_step_three.bind(this)} />
                    </Card>
                    <Card>
                        <div style={{textAlign:"center"}}>
                            <Button type="primary" onClick={this.submit_data.bind(this)}>&emsp;提&nbsp;交&emsp;</Button>
                        </div>
                    </Card>
                </Spin>
            </div>
        )
    }
}

export default Confirm;