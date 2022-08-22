import React, { Component } from 'react';
const Discount=({data})=>{
    var title=[
        {title:"应还本金",param:"principal",father:"plan",discount:"principal"},
        {title:"应还利息",param:"interest",father:"plan",discount:"interest"},
        {title:"应还服务费",param:"serviceFee",father:"plan",discount:"serviceFee"},
        {title:"应还其他费用",param:"otherFee",father:"plan",discount:"otherFee"},
        {title:"应还逾期罚息",param:"overdueInterest",father:"overdueInterest",discount:"overdueFee"},
        {title:"应还违约金",param:"penaltyOverdueFee",father:"expect",discount:"penaltyOverdueFee"},
        {title:"应还提前结清手续费",param:"penaltyAheadFee",father:"expect",discount:"penaltyAheadFee"},
        {title:"应还科技服务费",param:"serviceTechFee",father:"expect",discount:"serviceTechFee"},
        {title:"合计",type:true,param:["principal","interest","serviceFee","otherFee","overdueInterest","penaltyOverdueFee","penaltyAheadFee","serviceTechFee"],father:["overdueInterest"]},
    ]
    var phaseList=data?data:[];
    var planTotal=0,discountTotal=0;
    return <div className="sh_add"><table className="sh_product_table" cellSpacing="0" cellPadding="0" style={{ fontSize: "14px" }}>
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
                                    // planTotal+=j[i.param]!==undefined?j[i.param]:j[i.father];
                                    discountTotal+=j.discount[0][i.discount]?j.discount[0][i.discount]:0;
                                    // console.log(i.param)
                                    if(i.title==="合计"){
                                        let plan=0;
                                        
                                        if(typeof(i.param)==="object"){
                                            i.param.forEach(item=>{
                                                plan+=j[item]
                                            })
                                        }else{
                                            plan=j[i.param]
                                        }
                                        if(n===phaseList.length-1){
                                            return <tr key={n}>
                                            {<td>{i.title}</td>}
                                        <td>{i.type?"":j.phase}</td>
                                        <td>{plan.money()}</td>
                                        <td>{discountTotal.money()}</td>
                                        <td>{(Number(plan)-Number(discountTotal)).money()}</td>
                                        </tr>
                                        }
                                                
                                    }else{
                                        let plan=0;
                                        if(typeof(i.param)==="object"){
                                            i.param.forEach(item=>{
                                                plan+=j[item]
                                            })
                                        }else{
                                            plan=j[i.param]
                                        }
                                        return <tr key={n}>
                                        {n?null:<td rowSpan={phaseList.length}>{i.title}</td>}
                                    <td>{i.type?"":j.phase}</td>
                                    <td>{plan.money()}</td>
                                    <td>{j.discount[0][i.discount]?j.discount[0][i.discount].money():0}</td>
                                    <td>{(Number(plan)-Number((j.discount[0][i.discount]?j.discount[0][i.discount]:0))).money()}</td>
                                    </tr>
                                    }
                                    return true
                                })
                            })
                            
                        }
                        {/* <tr>
                            <td>合计</td>
                            <td>--</td>
                            <td>{planTotal.money()}</td>
                            <td>{discountTotal.money()}</td>
                            <td>{(Number(planTotal)-Number(discountTotal)).money()}</td>
                        </tr> */}
    </tbody>
    </table>
    </div>
}
export default Discount