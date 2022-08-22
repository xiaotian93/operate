import React, { Component } from 'react';
import { Timeline,Table ,Icon} from 'antd';
import { bmd } from '../../../ajax/tool';


const TimelineItem = Timeline.Item;
class AuditLog extends Component{
    constructor(props) {
        super(props);
        this.state={
            logLines:this.createLine(props.dataSource),
            time:"",
            data:[]
        }
        this.logs = props.dataSource;
    }
    componentWillMount() {
        this.setState({
            radioValue:this.props.view
        })
        
        this.columns=[{
            title:"阶段名称",
            dataIndex:"node",
          },
          {
              title:"审批人",
              dataIndex:"auditor"  
            },
            {
              title:"审批时间",
              dataIndex:"auditTime",
            //   render:e=>(format_time(e))  
            },
            {
              title:"审批结果",
              dataIndex:"auditResult",
              render:e=>(e?<span className="text-success">通过</span>:<span className="text-danger">不通过</span>)   
            },
            {
                title:"评估额度(元)",
                dataIndex:"loanAmount",
                render:e=>(e?e.money():0)  
              },
            {
              title:"审核意见",
              dataIndex:"comment",
              render:e=>(e||"无")  
            },
      ]
      this.columns_normal=[{
        title:"阶段名称",
        dataIndex:"node",
      },
      {
          title:"审批人",
          dataIndex:"auditor"  
        },
        {
          title:"审批时间",
          dataIndex:"auditTime",
        //   render:e=>(format_time(e))  
        },
        {
          title:"审批结果",
          dataIndex:"auditResult",
          render:e=>(e?<span className="text-success">通过</span>:<span className="text-danger">不通过</span>)   
        },
        {
          title:"审核意见",
          dataIndex:"comment",
          render:e=>(e||"无")  
        },
  ]
    }
    componentWillReceiveProps(props){
        this.setState({
            logLines:this.createLine(props.dataSource)
        })
    }
    set_height(e){
        this.setState({
            height:e
        })
    }
    createLine(logs=[]){
        let lines = [];
        for(let l in logs){
            let res = "";
            if( logs[l].auditResult!==null){
                res = <span className={`audit-res ${logs[l].auditResult?"text-success":"text-danger"}`}>{`审批意见：${logs[l].comment||"无"}`}</span>
            }
            lines.push(
                <TimelineItem key={l}>
                    <div className="node-name">{logs[l].node}</div>
                    <div>
                        { res }
                        { logs[l].loanAmount?<div className="audit-info">评估额度：{bmd.money(logs[l].loanAmount)}</div>:"" }
                        <div className="audit-info">
                            {logs[l].auditor?<span>审批人：{logs[l].auditor}</span>:""}
                            <span>{logs[l].auditTime}</span>
                        </div>
                    </div>
                </TimelineItem>
            )
        }
        if(lines.length<=0){
            lines.push(
                <TimelineItem key={"-1"}>
                    <div className="node-name">业务发起</div>
                </TimelineItem>
            )
        }
        return lines;
    }

    render() {
        var time="";
        for(var i in this.props.dataSource){
            if(this.props.dataSource[i].node==="业务发起"){
                time=this.props.dataSource[i].auditTime
                this.props.dataSource.splice(i,1);
            }
        }
        let keys = document.location.pathname
        keys = keys.split("/").splice(0,4).join("/");
        return (
            <div>
                {time?<div style={{marginBottom:"5px"}}>业务发起时间 {time}</div>:null}
                <div style={{height:this.props.dataSource.length<3?"auto":this.state.height?"auto":"110px",overflow:"hidden"}}><Table columns={this.props.columns?this.props.columns:((keys==="/db/bmd/audit"||keys==="/db/bmd/auto")?this.columns:this.columns_normal)} dataSource={this.props.dataSource} bordered pagination={false} className="verify_table" /></div>
                {
                               this.props.dataSource?(this.props.dataSource.length>2?(this.state.height?<div style={{textAlign:"left",color:"#1B84FF",marginTop:"20px",fontSize:"12px",cursor:"pointer"}} onClick={()=>{this.set_height(false)}}>点击收起<Icon type="up" /></div>:<div style={{textAlign:"left",color:"#1B84FF",marginTop:"20px",fontSize:"12px",cursor:"pointer"}} onClick={()=>{this.set_height(true)}}>查看更多<Icon type="down" /></div>):null):null
                            }
            </div>
        )
    }
}
export default AuditLog