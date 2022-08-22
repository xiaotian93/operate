import React, { Component } from 'react';
import {Table,Icon} from 'antd';

import axios from '../../ajax/request';
import { zzb_task_history } from '../../ajax/api';
import {format_time} from '../../ajax/tool';
class TimeLine_zzb extends Component{
    constructor(props) {
        super(props);
        this.state={
            data:[],
            status:-1,
            time:""
        }
    }

    componentWillMount() {
        setTimeout(function(){
            this.timeLine()
        }.bind(this),1000)
        this.columns = [
            {
                title: "阶段名称",
                dataIndex: "taskName",
            },
            {
                title: "审批人",
                dataIndex: "approvalDetail.userName",
            },
            {
                title: "审批时间",
                dataIndex: "approvalDetail.time",
                render:e=>{
                    return e?format_time(e):"--"
                }
            },
            {
                title: "审批结果",
                render: e=>{
                    return e&&e.approvalDetail?(e.endTime===null?"审核中":(e.approvalDetail.approved)?<span className="text-success">同意</span>:<span className="text-danger">驳回</span>):"--"
                }
            },
            {
                title: "审核意见",
                dataIndex: "approvalComments",
                render: e => {
                    for(var i in e){
                        return e[i].message
                    }
                }
            },
        ]
    };
    timeLine() {
        var param={
            id:this.props.pild
        };
        axios.post(zzb_task_history,param).then((e)=>{
            var line=e.data,arr=[];
            for(var i in line){
                if(line[i].taskName!=="业务发起"){
                    arr.push(line[i])
                }else{
                    this.setState({
                        time:line[i].startTime
                    })
                }
            }
            this.setState({
                status:e.status
            });
            if(e.status!==-1){
                this.setState({
                    data:arr
                })
            }
        })
    };
    set_height(e){
        this.setState({
            height:e
        })
    }

    render() {

        return(
            <div>
                {
                    this.state.status===-1?"":<div >
                        {/* <div className="title">
                            <div className="icon" />
                            <span className="titleWord">审核意见</span>
                        </div> */}
                        {/* <div className="content">
                        <div style={{background:"#F7F7F7",padding:"20px 20px 0 20px"}}>
                            <Timeline >
                           
                                            
                                                 {/* <Timeline.Item className="timeline"><div style={{float:"left",width:"100px",fontSize:"14px"}}>{111}</div><div style={{color:"#00B471",float:"left",marginLeft:"30px"}}><p style={{color:"#00B471",fontSize:"14px"}}>驳回:审批意见：1111</p><div style={{color:"#393A3E",marginTop:"10px"}}><span className="">{"审批人："+111}</span><span className="widths">{'审批时间：'+1111}</span></div></div></Timeline.Item> */}
                                {/* {
                                    this.state.data.map(function(i,k){
                                        if(i.taskName==="业务发起"){
                                            return <Timeline.Item key={k} className="timeline" style={{fontSize:"14px"}}><span>{i.taskName}</span><span className="widths" style={{marginLeft:"30px",color:"#393A3E"}}>{'订单生成时间：'+timeConverter(i.startTime)}</span></Timeline.Item>
                                        }else{
                                            if(i.approvalComments!==[]){
                                                var approvalComments=i.approvalComments;
                                                return <Timeline.Item key={k} className="timeline"><div style={{float:"left",width:"100px",fontSize:"14px"}}>{i.taskName}</div><div style={{color:i.approvalDetail.approved?"#00B471":"red",float:"left",marginLeft:"30px"}}><p style={{color:i.approvalDetail.approved?"#00B471":"red",fontSize:"14px"}}>{i.endTime===null?"审核中":(i.approvalDetail.approved?"同意：":"驳回：")}
                                                <p>{
                                                    approvalComments.map(function(j,p){
                                                        return j.message;
                                                    })
                                                }</p>
                                                </p><div style={{color:"#393A3E",marginTop:"10px"}}><span className="">{i.approvalDetail===null?"":"审批人："+i.approvalDetail.userName}</span><span className="widths">{i.approvalDetail===null?"":timeConverter(i.approvalDetail.time)}</span></div></div></Timeline.Item>
                                            }
                                        }
                                        return ""
                                    }) */}
                                {/* }
                            </Timeline>
                            </div>
                        </div> */}
                        <div className="content">
                            {/* <div style={{ marginBottom: "5px" }}>业务发起时间 {format_time(this.state.data[0].startTime)}</div> */}
                            {/* <Table columns={this.columns} dataSource={this.state.data} bordered pagination={false} className="verify_table" /> */}
                            <div style={{ marginBottom: "5px" }}>业务发起时间 {this.state.time?format_time(this.state.time):""}</div>
                            <div style={{height:this.state.data.length<3?"auto":this.state.height?"auto":"110px",overflow:"hidden"}}><Table columns={this.columns} dataSource={this.state.data} bordered pagination={false} className="verify_table" /></div>
                            {
                               this.state.data.length>2?(this.state.height?<div style={{textAlign:"left",color:"#1B84FF",marginTop:"20px",fontSize:"12px",cursor:"pointer"}} onClick={()=>{this.set_height(false)}}>点击收起<Icon type="up" /></div>:<div style={{textAlign:"left",color:"#1B84FF",marginTop:"20px",fontSize:"12px",cursor:"pointer"}} onClick={()=>{this.set_height(true)}}>查看更多<Icon type="down" /></div>):null
                            }
                        </div>

                        <style>{`
                    .widths{
                        width:200px!important;
                    }
                    .timeline span {
                        margin-left:20px;float:left;width:100px
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


                `}</style>
                    </div>
                }

            </div>


        )

    }
}
export default TimeLine_zzb;