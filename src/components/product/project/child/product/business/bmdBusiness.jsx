import React, { Component } from 'react';
import BusinessPart from './business';
import User from './userGroup';
import {Button, message} from 'antd';
import {axios_xjd_p,axios_loan} from '../../../../../../ajax/request';
import {merchant_bmd_business_detail,merchant_bmd_business_add,merchant_bmd_business_info,merchant_bmd_business_update} from '../../../../../../ajax/api';
import { browserHistory } from 'react-router';
import Expiry from '../../bmd/expiry';
import {accMul,accDiv} from '../../../../../../ajax/tool';
import Permissions from '../../../../../../templates/Permissions';
class Business extends Component {
    constructor(props) {
        super(props);
        this.state={
            service_fee:"0",
            id:"",
            userEdit:[],
            userArr:[]
        }
    }
    componentWillMount() {
        if(!this.props.isAdd){
            setTimeout(function(){
                this.get_edit();
            }.bind(this),1000)
            
        }
        setTimeout(function(){
            this.get_service();
        }.bind(this),1000)
    }
    get_service(){
        var apploanConfig=this.props.detail;
        axios_loan.post(merchant_bmd_business_info,{rpTemplate:this.props.isAdd?apploanConfig.repayPlanTemplate:this.props.repayPlanTemplate}).then(e=>{
            if(!e.code){
                var serviceFeeCalType=e.data.serviceFeeCalType,type={NONE:"NEVER",GENERAL_SUB_INTEREST:"GENERAL_SUB_INTEREST",LOAN_AMOUNT_RATE:"FIX"},serviceTechFeeCalType=e.data.serviceTechFeeCalType;
                this.setState({
                    service_fee:type[serviceFeeCalType],
                    serviceFeeCalType:serviceFeeCalType,
                    serviceTechFeeCalType:serviceTechFeeCalType
                })
            }
        })
    }
    get_edit(){
        var apploanConfig=this.props.detail;
        axios_xjd_p.get(merchant_bmd_business_detail+"?code="+apploanConfig.productCode).then(e=>{
            if(!e.code&&e.data){
                var productConfig=e.data.productConfig;
                this.setState({
                    id:productConfig.id,
                })
                this.business_child.props.form.setFieldsValue({allowInputLoanAmount:productConfig.allowInputLoanAmount})
                this.expiry_child.props.form.setFieldsValue({creditValidity:productConfig.creditValidity,identityValidity:productConfig.identityValidity,loanResubmitValidity:productConfig.loanResubmitValidity,reCreditValidity:productConfig.reCreditValidity,resubmitValidity:productConfig.resubmitValidity});
                //用户群
                var arr = e.data.productUserGroupList;
                var map = {},
                    dest = [];
                for (var i = 0; i < arr.length; i++) {
                    var ai = arr[i];
                    ai.userLabel=ai["key"]//用户群名称
                    ai.periodCount=ai.period//期数
                    for(let j in ai){
                        if(j.indexOf("Rate")!==-1){
                            ai[j]=accMul(ai[j],100);
                        }
                    }
                    if (!map[ai.key]) {
                        dest.push({
                            id: ai.key,
                            data: [ai]
                        });
                        map[ai.key] = ai;
                    } else {
                        for (var j = 0; j < dest.length; j++) {
                            var dj = dest[j];
                            if (dj.id === ai.key) {
                                dj.data.push(ai);
                                break;
                            }
                        }
                    }
                }
                var userEdits = [];
                for (let p in dest) {
                    userEdits.push(Number(p))
                }
                this.setState({
                    userArr:dest,
                    userEdit: userEdits
                })
                this.user_child.user_child.id=userEdits[userEdits.length-1]
            }
        })
    }
    business(e){
        this.business_child=e
    }
    user(e){
        this.user_child=e
    }
    get_val(){
        var apploanConfig=this.props.detail;
        var expiry=this.expiry_child.get_val();
        if(this.user_child.get_val().labelInfoList.length<1){
            return;
        }
        if(!expiry){
            return
        }
        if(!this.business_child.get_val()){
            return;
        }
        var config={
            //"id": apploanConfig.id,修改时必传
            "code": apploanConfig.productCode,//产品编号
            "desc": apploanConfig.desc,//产品描述 
            "minAmount": apploanConfig.minLoanAmount,//单笔金额借款范围
            "maxAmount": apploanConfig.maxLoanAmount,
            "name": apploanConfig.productName,//产品名称
            "periodUnitType": this.props.periodUnit_type,//借款期限单位 e.g. DAY/MONTH/YEAR
            "serviceFeeCalType": this.state.serviceFeeCalType,//小贷服务费收取方式
            "allowInputLoanAmount": this.business_child.get_val().allowInputLoanAmount,//是否允许自选借款金额
            "totalPeriodList": (apploanConfig.supportPhases).split(","),//借款期限
            "periodGap":apploanConfig.phaseGapCount, //每期间隔
            "lmLoanConfigNo":this.props.configNo,
            "serviceTechFeeCalType":this.state.serviceTechFeeCalType, //服务科技费收取方式
            "rateUnitType":this.props.rate_type,  //借款利率单位
        }
        //有效期配置
        for(var ex in expiry){
            config[ex]=expiry[ex];
        }
        //用户群
        var userGroup=this.user_child.get_val().labelInfoList;
        userGroup.forEach(item=>{
            for(let it in item){
                if(it.indexOf("Rate")!==-1){
                    item[it]=accDiv(item[it],100)
                }
            }
            // for(var j in item){
                // item.generalRate//综合费率
                // item.interestRate//利息利率
                item["key"]=item.userLabel//用户群名称
                item.period=item.periodCount//期数
                // item.serviceFeeRate//服务费率
                delete item.userLabel;
                delete item.periodCount;
            // }
        })
        config.productUserGroupList=userGroup;
        // console.log(config);
        // return;
        if(!this.props.isAdd){
            axios_xjd_p.post(merchant_bmd_business_update,config).then(e=>{
                if(!e.code){
                    message.success("编辑成功");
                    browserHistory.push("/cp/project/list/product?appKey="+this.props.appKey+"&domain="+this.props.domain+"&appName="+this.props.appName)
                }
            })
        }else{
            axios_xjd_p.post(merchant_bmd_business_add,config).then(e=>{
                if(!e.code){
                    message.success("新建成功");
                    browserHistory.push("/cp/project/list/product?appKey="+this.props.appKey+"&domain="+this.props.domain+"&appName="+this.props.appName)
                }
            })
        }
        
        // console.log(this.business_child.get_val())
        // console.log(this.user_child.get_val())
        
    }
    service_type(e){
        this.setState({
            service_fee:e
        })
    }
    rate_type(e){
        this.setState({
            rate:e
        })
    }
    //有效期配置
    expiry(e){
        this.expiry_child=e
    }
    render() {
        return (<div>
            <BusinessPart onref={this.business.bind(this)} service={this.state.service_fee} rate={this.rate_type.bind(this) } cashloan />
            <User phase={this.props.phase} unit={this.props.unit} onref={this.user.bind(this)} service={this.state.service_fee} rate={this.state.rate} user_key={this.state.userEdit} user_data={this.state.userArr} configNo={this.props.configNo} isAdd={this.props.isAdd} />
            <Expiry onref={this.expiry.bind(this)} />
            {/* <Config /> */}
            <div style={{textAlign:"center"}}>
            <Permissions type="primary" onClick={this.get_val.bind(this)} server={global.AUTHSERVER.bmdCashLoan.key} permissions={!this.props.isAdd?global.AUTHSERVER.bmdCashLoan.access.product_update:global.AUTHSERVER.bmdCashLoan.access.product_create} tag="button" >确认并提交</Permissions>
            </div>
        </div>)
    }
}
export default Business