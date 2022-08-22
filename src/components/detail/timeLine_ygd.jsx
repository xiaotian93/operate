import React, { Component } from 'react';
import { Table ,Icon} from 'antd';
import { axios_ygd } from '../../ajax/request';
import { ygd_status_log } from '../../ajax/api';

class TimeLine extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [
                { statusChangeTime: '' }
            ],
            status: -1
        }
    }

    componentWillMount() {
        setTimeout(function () {
            this.timeLine()
        }.bind(this), 1000)
        this.columns = [
            {
                title: "阶段名称",
                dataIndex: "afterStatus",
                render: e => {
                    let status = { 0: "草稿", 20: "初审", 21: "复审", 30: "待付款", 31: "付款中", 40: "付款完成", 60: "已结清", 61: "已驳回", 62: "付款失败" ,10:"风险评级"};
                    return status[e];
                }
            },
            {
                title: "审批人",
                dataIndex: "accountName"
            },
            {
                title: "审批时间",
                dataIndex: "statusChangeTime"
            },
            // {
            //     title: "审批结果",
            //     dataIndex: "auditResultStr"
            // },
            {
                title: "审核意见",
                dataIndex: "comment",
                render: e => (e || "无")
            },
        ]
    };
    timeLine() {
        var param = {
            orderNo: this.props.pild
        };
        axios_ygd.post(ygd_status_log, param).then((e) => {
            var line = e.data.list;
            this.setState({
                status: e.status
            });
            for (var i in line) {
                if (line[i].node === "业务发起") {
                    line.splice(i, 1)
                }
            }
            if (e.status !== -1) {
                this.setState({
                    data: line,
                    first: line[0]
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
        // let status = { 0: "草稿", 20: "初审", 21: "复审", 30: "待付款", 31: "付款中", 40: "付款完成", 60: "已结清", 61: "已驳回", 62: "付款失败" };

        return (
            <div>
                {
                    this.state.status === -1 || this.state.data.length === 0 ? "" : <div className="detail_card">
                        <div className="title">
                            <div className="icon" />
                            <span className="titleWord">审核意见</span>
                        </div>
                        {/* <div className="content">
                            <div style={{ background: "#F7F7F7", padding: "20px 20px 0 20px" }}>
                                <Timeline >
                                    <Timeline.Item className="timeline"><span style={{ fontSize: "14px" }}>业务发起</span><span className="widths" style={{ marginLeft: "30px", color: "#393A3E" }}>订单生成时间：{this.state.data[0].statusChangeTime}</span></Timeline.Item>
                                    {
                                        this.state.data.map(function (i, k) {
                                            //if(i.preStatus===0){
                                            //    return <Timeline.Item key={k} className="timeline"><span>业务发起</span><span className="left widths">{'订单生成时间：'+i.statusChangeTime}</span></Timeline.Item>
                                            //}

                                            // if(i.afterStatus===0){
                                            //     return <Timeline.Item key={k} className="timeline" style={{fontSize:"14px"}}><span>业务发起</span><span className="widths" style={{marginLeft:"30px",color:"#393A3E"}}>{'订单生成时间：'+i.statusChangeTime}</span></Timeline.Item>
                                            // }else{

                                            return <Timeline.Item key={k} className="timeline">
                                                <div style={{ float: "left", width: "100px", fontSize: "14px" }}>{status[i.afterStatus]}</div>
                                                <div style={{ color: "#00B471", float: "left", marginLeft: "30px" }}>
                                                    <p style={{ color: "#00B471", fontSize: "14px" }}>{"审批意见：" + (i.comment ? i.comment : "无")}</p>
                                                    {/* <div style={{color:"#393A3E",marginTop:"10px"></div> */}
                                                    {/* <div style={{ color: "#393A3E", marginTop: "10px" }}>
                                                        <span>{"审批人：" + i.accountName}</span>
                                                        <span className="widths">{i.statusChangeTime}</span>
                                                    </div></div></Timeline.Item> */}
                                            {/* // }
                                        })
                                    }
                                </Timeline>
                            </div>
                        </div> */}
                        <div className="content">
                            <div style={{ marginBottom: "5px" }}>业务发起时间 {this.state.data[0].statusChangeTime}</div>
                            {/* <Table columns={this.columns} dataSource={this.state.data} bordered pagination={false} className="verify_table" /> */}
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
export default TimeLine;