import React, { Component } from 'react';
import Config from './productConfig';
import Bus from './business';
import BmdBus from './bmdBusiness';
import { merchant_zj_product_detail_bycode } from '../../../../../../ajax/api';
import { axios_loan } from '../../../../../../ajax/request';
class Business extends Component {
    constructor(props) {
        super(props);
        // props.onRef(this);
        this.state = {
            configNo: props.location.query.configNo,
            cooperator:props.location.query.cooperator,
            appKey:props.location.query.appKey,
            appName:props.location.query.appName,
            productCode:props.location.query.productCode,
        };
    }
    componentWillMount() {
        this.product_info()
    }
    product_info() {
        axios_loan.post(merchant_zj_product_detail_bycode,{code:this.state.productCode}).then(e=>{
            var data=e.data;
            this.setState({
                rateUnit:data.loanLimit.rateUnit,
                repayPlanTemplate:data.loanConfig.repayPlanTemplate
            })
        })
    }
    render() {
        const type = { "DAY": "日", "MONTH": "月", "YEAR": "年" };console.log(this.state.rateUnit)
        return (<div className="sh_add content">
            <Config configNo={this.state.configNo} cooperator={this.state.cooperator} appKey={this.state.appKey} appName={this.state.appName} />
            {this.state.appKey==="cashloan"?<BmdBus configNo={this.state.configNo} rate={type[this.state.rateUnit]} productCode={this.state.productCode} repayPlanTemplate={this.state.repayPlanTemplate} />:<Bus configNo={this.state.configNo} rate={type[this.state.rateUnit]} productCode={this.state.productCode} />}
            
        </div>)
    }
}
export default Business