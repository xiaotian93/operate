import React , { Component } from 'react';

import TableCol from '../../../../templates/TableCol';

class BaseInfo extends Component{
    constructor(props){
        super(props);
        this.state = {
            source:props['data-source']
        }
    }
    componentWillMount(){
        this.fields = {
            borrower:{
                name:"借款人"
            },
            requestTime:{
                name:"请求发起时间"
            },
            amount:{
                name:"请求金额",
                render:data=>{
                    return data.amount.money()
                }
            },
            groupStr:{
                name:"业务类型"
            },
            requestId:{
                name:"请求流水号"
            },
            shouldPayTime:{
                name:"应还款日期"
            },
            orderNo:{
                name:"关联订单编号",
                span_val:3
            }
        }
    }
    componentDidMount(){

    }
    render(){
        let table = "";
        let source = this.props["data-source"];
        if(source.orderNo){
            table = <TableCol data-source={source} data-columns={this.fields} />;
        }
        return (
            <div>
                <h3 className="sub-title">基础信息</h3>
                { table }
            </div>
        );
    }
}

export default BaseInfo;