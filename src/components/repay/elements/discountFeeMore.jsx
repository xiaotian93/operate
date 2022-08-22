import Fee from './discountFeeMoreModal';
import React, { Component } from 'react';
import {Input,Form} from 'antd';
import {accDiv} from '../../../ajax/tool';
const { TextArea } = Input;
const FormItem = Form.Item;
class FeeMore extends Component {
    constructor(props){
        super(props);
        props.onRef(this);
        this.child=[];
    }
    get_fee(e){
        this.child.push(e)
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        var data = this.props.data;console.log(data)
        var title=[
            {title:"应还本金",type:"none",param:"principal",father:"plan"},
            {title:"应还利息",type:"day",param:"interest",father:"plan"},
            {title:"应还服务费",type:"day",param:"serviceFee",father:"plan"},
            {title:"应还其他费用",type:"day",param:"otherFee",father:"plan"},
            {title:"应还逾期罚息",type:"day",param:"overdueFee",father:"plan"},
            {title:"应还违约金",type:"money",param:"penaltyOverdueFee",father:"plan"},
            {title:"应还提前结清手续费",type:"money",param:"penaltyAheadFee",father:"plan"},
            {title:"应还科技服务费",type:"money",param:"serviceTechFee",father:"plan"},
        ]
        return (
            <div className="sh_add">
                <table className="sh_product_table" cellSpacing="0" cellPadding="0" style={{ fontSize: "14px" }}>
                    <thead style={{ background: "#f7f7f7" }}>
                        <tr>
                            <th style={{ background: "#f7f7f7" }}>费用类别</th>
                            <th style={{ background: "#f7f7f7" }}>期数</th>
                            <th style={{ background: "#f7f7f7" }}>原始金额</th>
                            <th style={{ background: "#f7f7f7" }}>减免</th>
                            <th style={{ background: "#f7f7f7" }}>减免后</th>

                        </tr>
                    </thead>
                    <tbody>
                        {
                            title.map((p,i)=>{
                                   return data.map((e, k) => {
                                    return <Fee key={k} data={e} row={data.length} index={k} title={p.title} type={p.type} onRef={this.get_fee.bind(this)} param={p.param} father={p.father} discount={this.props.discount} />
                                    })
                                    
                                
                            })
                        }
                        <tr>
                            <td>合计</td>
                            <td>--</td>
                            <td>{accDiv(this.props.plan_money,100).toFixed(2)}</td>
                            <td>{this.props.discount_money.toFixed(2)}</td>
                            <td>{(accDiv(this.props.plan_money,100)-this.props.discount_money).toFixed(2)}</td>
                        </tr>

                    </tbody>
                </table>
                <div style={{marginTop:"30px"}}>
                <FormItem label="申请原因" wrapperCol={{ span: 21 }} labelCol={{span:3}} hideRequiredMark colon={false} required>
                    {getFieldDecorator('purpose', {
                        // rules: [{ pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "格式错误" }],
                        validateTrigger: "onChange"
                    })(
                        <TextArea placeholder="请输入" />
                    )}
                </FormItem>
                </div>
            </div>
        )
    }
}
export default Form.create()(FeeMore)