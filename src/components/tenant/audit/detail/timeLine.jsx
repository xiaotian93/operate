import React, { Component } from 'react';
//import moment from 'moment';

import {Icon,Table} from 'antd';
import {axios_merchant} from '../../../../ajax/request';
import {merchant_audit_history} from '../../../../ajax/api';
import {format_time} from '../../../../ajax/tool';

class TimeLine extends Component{
    constructor(props) {
        super(props);
        this.state={
            data:[],
            first:{
                createTime:''
            },
            status:-2
        }
    }

    componentWillMount() {
        setTimeout(function(){
            this.timeLine()
        }.bind(this),1000)
        this.columns=[{
            title:"阶段名称",
            dataIndex:"node",
            width:100,
            render:e=>("商户提交")  
          },
          {
              title:"审批人",
              width:100,
              dataIndex:"auditorName"  
            },
            {
              title:"审批时间",
              width:200,
              dataIndex:"auditTime",
              render:e=>(format_time(e))  
            },
            {
              title:"审批结果",
              width:100,
              dataIndex:"status",
              render:e=>(e===2?<span className="text-success">通过</span>:<span className="text-danger">不通过</span>)   
            },
            {
              title:"审核意见",
              dataIndex:"auditOpinion",
              render:e=>(e||"无")  
            },
      ]
    };
    timeLine() {
        var param={
            accountId:this.props.accountId
        };
        axios_merchant.post(merchant_audit_history,param).then((e)=>{
            var line=e.data,arr=[];
            for(var i in line){
                if(line[i].status!==1){
                    arr.push(line[i])
                }
            }
            this.setState({
                data:arr,
                first:line[0]
            })
        })
    };
    set_height(e){
        this.setState({
            height:e
        })
    }
    render() {
        //let status={"2":"待审核","3":"初审","4":"复审","5":"待放款","6":"付款中","7":"待还款","8":"已结清","-3":"已驳回","-4":"付款失败","-5":"已退保",'0':'待签约'};

        return(
            <div>
                
                    <div>
                        
                        <div className="sh_add_card">
                        <div className="sh_add_title">审核信息</div>

                        {this.state.data.length<0?"":<div style={{background:"##F7F7F7",padding:"#20px 20px 0 20px",overflow:"hidden",height:this.state.data.length<3?"auto":this.state.height?"auto":"110px"}}>
                            {/* <Timeline >
                                {
                                    this.state.data.map(function(i,k){
                                        
                                        var time=<Timeline.Item key={k} color={i.status===3?"#F04134":"#1B84FF"} className="timeline"><div style={{float:"left",fontSize:"14px"}}>商户提交</div>
                                        <div style={{color:"#000",float:"left",marginLeft:"30px",width:"calc(100% - 100px)"}}>
                                        <p style={{color:"#000",fontSize:"14px"}}>{format_time(i.commitTime)}</p>
                                        {
                                            i.status===1?null:<div style={{color:"#393A3E",marginTop:"10px",fontSize:"14px"}}>
                                            <span style={{color:i.status===2?"#00B471":"#F04134"}}>{i.status===2?"通过":"不通过"}</span>
                                            <span style={{fontSize:"12px",marginLeft:"14px"}}>审批人：{i.auditorName}</span>
                                            <span className="widths" style={{fontSize:"12px"}}>{format_time(i.auditTime)}</span>
                                            <div style={{fontSize:"12px",marginTop:"3px"}}>审核意见：{i.auditOpinion?i.auditOpinion:"无"}</div>
                                            </div>
                                        }
                                        
                                        </div>
                                        </Timeline.Item>
                                        return time
                                    })
                                }
                            </Timeline> */}
                            <Table columns={this.columns} dataSource={this.state.data} bordered pagination={false} className="verify_table" />
                            </div>}
                            {
                                this.state.data.length>2?(this.state.height?<div style={{textAlign:"left",color:"#1B84FF",marginTop:"20px",fontSize:"12px",cursor:"pointer"}} onClick={()=>{this.set_height(false)}}>点击收起<Icon type="up" /></div>:<div style={{textAlign:"left",color:"#1B84FF",marginTop:"20px",fontSize:"12px",cursor:"pointer"}} onClick={()=>{this.set_height(true)}}>查看更多<Icon type="down" /></div>):null
                            }
                            
                        </div>

                        <style>{`
                            .widths{
                                width:200px!important;
                            }
                            .timeline span {
                                margin-left:20px;
                            }
                            .timeline span:first-child{
                                margin-left:0
                            }
                            .ant-timeline-item-content{
                                overflow:hidden;
                            }
                            .timeline span>p{
                                margin:0
                            }
                            .accountTitle{
                                margin-bottom:20px
                            }
                            .left{
                                margin-left:360px!important
                            }
                        `}
                </style>
                    </div>
                

            </div>


        )

    }
}
export default TimeLine;