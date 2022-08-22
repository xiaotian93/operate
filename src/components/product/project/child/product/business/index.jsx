import React, { Component } from 'react';
import BusinessPart from './business';
import User from './userGroup';
import {Button, message} from 'antd';
import {axios_zyzj_json} from '../../../../../../ajax/request';
import {merchant_zj_business_info,merchant_zj_business_user,merchant_zj_business_add} from '../../../../../../ajax/api';
import { browserHistory } from 'react-router';
import {accMul} from '../../../../../../ajax/tool';
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
        if(this.props.configNo){
            this.get_edit();
        }
    }
    get_edit(){
        axios_zyzj_json.get(merchant_zj_business_info+"?lmLoanConfigNo="+this.props.configNo).then(e=>{
            if(!e.code&&e.data){
                this.setState({
                    id:e.data.id,
                    service_fee:e.data.feeRateCalMode,
                    rate:!e.data.isFixedRate
                })
                this.business_child.props.form.setFieldsValue({isFixedRate:!e.data.isFixedRate,feeRateCalMode:e.data.feeRateCalMode})
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
                var userEdits = [];
                for (let p in dest) {
                    userEdits.push(Number(p))
                }
                this.setState({
                    userArr:dest,
                    userEdit: userEdits
                })
                this.user_child.user_child.id=userEdits[userEdits.length-1]
                console.log(dest)
                console.log(userEdits)
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
        var config={
            //"id": apploanConfig.id,修改时必传
            "lmProductCode": apploanConfig.productCode,//产品名称
            "lmLoanConfigNo": apploanConfig.configNo,//核心生成并返回给你的 
            "minAmount": apploanConfig.minLoanAmount,//单笔金额借款范围
            "maxAmount": apploanConfig.maxLoanAmount,
            "interestRateType": this.props.rate_type,//费率计算单位 e.g. DAY/MONTH/YEAR
            "intervalUnitType": this.props.periodUnit_type,//借款期限单位 e.g. DAY/MONTH/YEAR
            "dailyPenaltyRate": accMul(apploanConfig.overdueInterestRate||0,100),//罚息收取金额
            "isFixedRate": this.business_child.get_val().isFixedRate,//综合费率是否固定
            "feeRateCalMode": this.business_child.get_val().feeRateCalMode,//小贷服务费收取方式 e.g. FIX("固定值")/GENERAL_SUB_INTEREST("浮动的综合费率减去利息利率")/DO_NOT("不收取")
            "useApr":apploanConfig.calRateType==="APR"?true:false
        }
        if(this.props.configNo){
            config.id=this.state.id
        }
        if(this.user_child.get_val().labelInfoList.length<1){
            return;
        }
        var param={
            labelInfoList:this.user_child.get_val().labelInfoList,
            appLoanConfig:config,
            lmAppKey:apploanConfig.appKey,
        }
        var delList=this.user_child.get_val().delLabelIdList;
        var delListArr=[];
        if(delList.length>0){
            delList.forEach(e=>{
                e.forEach(j=>{
                    delListArr.push(j)
                })
            })
            param.delLabelIdList=delListArr;
        }
        console.log(param)
        // return
        axios_zyzj_json.post(merchant_zj_business_add,param).then(e=>{
            if(!e.code){
                message.success(this.props.configNo?"编辑成功":"新建成功");
                browserHistory.push("/cp/project/list/product?appKey="+this.props.appKey+"&domain="+this.props.domain+"&appName="+this.props.appName)
            }
        })
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
    render() {
        console.log(this.props.detail)
        return (<div>
            <BusinessPart onref={this.business.bind(this)} service={this.service_type.bind(this)} rate={this.rate_type.bind(this)} />
            <User phase={this.props.phase} unit={this.props.unit} onref={this.user.bind(this)} service={this.state.service_fee} rate={this.state.rate} user_key={this.state.userEdit} user_data={this.state.userArr} configNo={this.props.configNo} isAdd={this.props.isAdd} calRateType={this.props.detail?this.props.detail.calRateType:""} />
            {/* <Config /> */}
            <div style={{textAlign:"center"}}>
            <Button type="primary" onClick={this.get_val.bind(this)} >确认并提交</Button>
            </div>
        </div>)
    }
}
export default Business
