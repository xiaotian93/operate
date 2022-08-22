import React, { Component } from 'react';
import { Table, Spin } from 'antd';

import { axios_risk } from '../../../ajax/request';
import { bmd, format_table_data } from '../../../ajax/tool';
import Panel from '../../../templates/Panel';
import QAList from '../../../templates/QAList';

class CarrierReprot extends Component{
    constructor(props) {
        super(props);
        this.state = {
            activeDegree:[],
            loading:true,
            baseCheckItems:[],
        };
        // this.appKey = props.appKey;
        // this.appTaskId = props.appTaskId;
        this.carrierReportUrl = props.carrierReportUrl;
        if(this.carrierReportUrl){
            this.getCarrierReport(this.carrierReportUrl);
        }
    }
    componentWillMount(){
        this.columnsBaseInfo = {
            name:"姓名",
            id_card:"身份证号",
            gender:"性别",
            age:"年龄",
            constellation:"星座",
            province:"省份",
            city:"城市",
            region:"区县",
            native_place:"户籍所在地"
        }
        this.columnsUserInfoCheck = [
            {
                title:"直接联系人中关注名单(Ⅱ类)人数",
                dataIndex:"check_black_info.contacts_class1_blacklist_cnt"
            },
            {
                title:"直接联系人人数",
                dataIndex:"check_black_info.contacts_class1_cnt"
            },
            {
                title:"间接联系人中关注名单(Ⅱ类)人数",
                dataIndex:"check_black_info.contacts_class2_blacklist_cnt"
            },
            {
                title:"引起间接关注名单(Ⅱ类)人数",
                dataIndex:"check_black_info.contacts_router_cnt"
            },
            {
                title:"直接联系人中引起间接关注名单(Ⅱ类)占比",
                dataIndex:"check_black_info.contacts_router_ratio"
            },
            {
                title:"用户号码联系关注名单综合分数（分数范围0-100，参考分为40，分数越低风险越大）",
                dataIndex:"check_black_info.phone_gray_score"
            }
        ]
        this.columnsFriendCircel = {
            friend_num_3m:"近3月朋友联系数量",
            good_friend_num_3m:"近3月好朋友联系数量（联系10次以上）",
            friend_city_center_3m:"近3月朋友圈中心城市",
            is_city_match_friend_city_center_3m:"近3月朋友圈中心地是否与手机归属地一致",
            inter_peer_num_3m:"近3月互通电话号码数目",
            friend_num_6m:"近6月朋友联系数量",
            good_friend_num_6m:"近6月好朋友联系数量（联系10次以上）",
            friend_city_center_6m:"近6月朋友圈中心城市",
            is_city_match_friend_city_center_6m:"近6月朋友圈中心地是否与手机归属地一致",
            inter_peer_num_6m:"近6月互通电话号码数目"
        }
        this.columnsActive = [
            {
                title:"分析项目",
                dataIndex:"app_point_zh"
            },
            {
                title:"近1月数量",
                dataIndex:"item.item_1m"
            },
            {
                title:"近3月数量",
                dataIndex:"item.item_3m"
            },
            {
                title:"近6月数量",
                dataIndex:"item.item_6m"
            }
            // {
            //     title:"近3月平均数量",
            //     dataIndex:"item.avg_item_3m"
            // },
            // {
            //     title:"近6月平均数量",
            //     dataIndex:"item.avg_item_6m"
            // }
        ]
        this.columnsCallRiskAnalysis = [
            {
                title:"分析项",
                dataIndex:"analysis_desc"
            },
            {
                title:"近3月通话次数",
                dataIndex:"analysis_point.call_cnt_3m"
            },
            {
                title:"近6月通话次数",
                dataIndex:"analysis_point.call_cnt_6m"
            },
            {
                title:"近3月通话时长（秒）",
                dataIndex:"analysis_point.call_time_3m"
            },
            {
                title:"近6月通话时长（秒）",
                dataIndex:"analysis_point.call_time_6m"
            }
        ]
    }
    componentWillReceiveProps(props){
        this.appKey = props.appKey;
        this.appTaskId = props.appTaskId;
        this.carrierReportUrl = props.carrierReportUrl;
        if(this.carrierReportUrl){
            this.setState({
                loading:true
            })
            this.getCarrierReport(this.carrierReportUrl);
        }
    }

    // 获取运营商数据
    getCarrierReport(carrierReportUrl){
        axios_risk.get(carrierReportUrl).then(res=>{
            if(!res.data){
                this.setState({
                    report:false
                })
                return;
            }
            let detail = JSON.parse(res.data.report);
            this.setState({
                report:true,
                loading:false,
                userBaseInfo:detail.user_basic,
                userInfoCheck:format_table_data(detail.user_info_check),
                friendCircel:detail.friend_circle.summary,
                activeDegree:detail.active_degree,
                baseCheckItems:detail.basic_check_items,
                behaviorCheck:detail.behavior_check,
                callContactDetail:format_table_data(detail.call_contact_detail),
                callDurationDetail:bmd.unfoldObjArray(detail.call_duration_detail),
                callFamilyDetail:detail.call_family_detail,
                callRiskAnalysis:detail.call_risk_analysis,
            })
        });
    }

    // 表格同一项
    tableOptions(list=[],rowKey){
        return {
            dataSource:list,
            bordered:true,
            rowKey,
            pagination:{
                total:list.length,
                pageSize:10
            }
        }
    }
    // 简易表格
    simpleOptions(list=[],rowKey){
        return {
            dataSource:list,
            bordered:true,
            rowKey,
            pagination:false
        }
    }
    render (){
        // let props = this.tableOptions;
        let short = this.simpleOptions;
        if(!this.state.report){
            return <div>
                <Panel>
                    暂无报告
                </Panel>
            </div>
        }
        let reportPath = window.location.pathname.split("/");
        reportPath.pop();
        return(
            <Spin tip="加载中..." spinning={this.state.loading}>
                <Panel title="基础信息">
                    <QAList dataMap={this.columnsBaseInfo} dataSource={this.state.userBaseInfo} />
                </Panel>
                <Panel title="用户行为检测(关注名单)">
                    <Table columns={this.columnsUserInfoCheck} {...short(this.state.userInfoCheck,"key")} />
                </Panel>
                <Panel title="朋友圈">
                    <QAList dataMap={this.columnsFriendCircel} dataSource={this.state.friendCircel} />
                </Panel>
                <Panel title="风险联系">
                    <Table columns={this.columnsCallRiskAnalysis} {...short(this.state.callRiskAnalysis,"analysis_item")} />
                </Panel>
                <Panel title="活跃程度分析">
                    <Table columns={this.columnsActive} {...short(this.state.activeDegree,"app_point")} />
                    <div style={{textAlign:"center",marginTop:"10px"}}>
                        <a target="_blank" href={reportPath.join("/")+"/report?reportUrl="+encodeURIComponent(this.carrierReportUrl)}>查看全部报告</a>
                    </div>
                </Panel>
            </Spin>
        )
    }
}

export default CarrierReprot;