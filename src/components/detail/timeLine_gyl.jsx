import React, { Component } from 'react';
import { Table, Icon } from 'antd';
import { axios_gyl } from '../../ajax/request';
import { gyl_status_log } from '../../ajax/api';
import Card from '../../views/Card';

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
                    let status = { 0: "草稿", 20: "初审", 21: "复审", 30: "待付款", 31: "付款中", 40: "付款完成", 60: "已结清", 61: "已驳回", 62: "付款失败" };
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
        axios_gyl.post(gyl_status_log, param).then((e) => {
            var line = e.data.list;
            this.setState({
                status: e.status
            });
            if (e.status !== -1) {
                this.setState({
                    data: line
                })
            }
        })
    };
    set_height(e) {
        this.setState({
            height: e
        })
    }
    render() {
        if (this.state.status === -1 || this.state.data.length === 0) return <span />;
        return <Card title="审核意见">
            <div style={{ marginBottom: "5px" }}>业务发起时间 {this.state.data[0].statusChangeTime}</div>
            {/* <Table columns={this.columns} dataSource={this.state.data} bordered pagination={false} className="verify_table" /> */}
            <div style={{ height: this.state.data.length < 3 ? "auto" : this.state.height ? "auto" : "110px", overflow: "hidden" }}><Table columns={this.columns} dataSource={this.state.data} bordered pagination={false} className="verify_table" /></div>
            {
                this.state.data.length > 2 ? (this.state.height ? <div style={{ textAlign: "left", color: "#1B84FF", marginTop: "20px", fontSize: "12px", cursor: "pointer" }} onClick={() => { this.set_height(false) }}>点击收起<Icon type="up" /></div> : <div style={{ textAlign: "left", color: "#1B84FF", marginTop: "20px", fontSize: "12px", cursor: "pointer" }} onClick={() => { this.set_height(true) }}>查看更多<Icon type="down" /></div>) : null
            }
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
        </Card>
    }
}
export default TimeLine;