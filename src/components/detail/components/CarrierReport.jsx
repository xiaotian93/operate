import React, { Component } from 'react';
import { Table } from 'antd';

import { bmd, format_table_data } from '../../../ajax/tool';
import Panel from '../../../templates/Panel';
import QAList from '../../../templates/QAList';


class CarrierReprot extends Component {
    constructor(props) {
        super(props);
        let detail = this.splitData(props.dataSource)
        this.state = {
            ...detail,
            activeDegree: [],
            baseCheckItems: [],
        };
        // this.appKey = props.appKey;
        // this.appTaskId = props.appTaskId;
    }
    componentWillMount() {
        this.columnsActive = [
            {
                title: "分析项目",
                dataIndex: "app_point_zh"
            },
            {
                title: "近1月数量",
                dataIndex: "item.item_1m"
            },
            {
                title: "近3月数量",
                dataIndex: "item.item_3m"
            },
            {
                title: "近6月数量",
                dataIndex: "item.item_6m"
            },
            {
                title: "近3月平均数量",
                dataIndex: "item.avg_item_3m"
            },
            {
                title: "近6月平均数量",
                dataIndex: "item.avg_item_6m"
            }
        ]
        this.columnsBaseCheckItems = [
            {
                title: "分析点",
                dataIndex: "check_item"
            },
            {
                title: "分析结果",
                dataIndex: "result"
            },
            {
                title: "结果说明",
                dataIndex: "comment"
            }
        ]
        this.columnsBehaviorCheck = [
            {
                title: "分析点",
                dataIndex: "check_point_cn"
            },
            {
                title: "分析结果",
                dataIndex: "result"
            },
            {
                title: "标记",
                dataIndex: "score"
            },
            {
                title: "证据",
                dataIndex: "evidence"
            }
        ]
        this.columnsCallContactDetail = [
            {
                title: "通话地",
                dataIndex: "city"
            },
            {
                title: "与联系人关系",
                dataIndex: "p_relation"
            },
            {
                title: "联系人号码",
                dataIndex: "peer_num"
            },
            {
                title: "号码类型",
                dataIndex: "group_name"
            },
            {
                title: "近1周通话次数",
                dataIndex: "call_cnt_1m:"
            },
            {
                title: "近1月通话次数",
                dataIndex: "call_cnt_1w"
            },
            {
                title: "近3月通话次数",
                dataIndex: "call_cnt_3m"
            },
            {
                title: "近6月通话次数",
                dataIndex: "call_cnt_6m"
            },
            {
                title: "近3月主叫次数",
                dataIndex: "dial_cnt_3m"
            },
            {
                title: "近6月主叫次数",
                dataIndex: "dial_cnt_6m"
            },
            {
                title: "近3月主叫时长",
                dataIndex: "dial_time_3m"
            },
            {
                title: "近6月主叫时长",
                dataIndex: "dial_time_6m"
            },
            {
                title: "近3月被叫次数",
                dataIndex: "dialed_cnt_3m"
            },
            {
                title: "近6月被叫次数",
                dataIndex: "dialed_cnt_6m"
            },
            {
                title: "近3月被叫时长",
                dataIndex: "dialed_time_3m"
            },
            {
                title: "近6月被叫时长",
                dataIndex: "dialed_time_6m"
            },
            {
                title: "近3月早晨通话次数",
                dataIndex: "call_cnt_morning_3m"
            },
            {
                title: "近6月早晨通话次数",
                dataIndex: "call_cnt_morning_6m"
            },
            {
                title: "近3月中午通话次数",
                dataIndex: "call_cnt_noon_3m"
            },
            {
                title: "近6月中午通话次数",
                dataIndex: "call_cnt_noon_6m"
            },
            {
                title: "近3月下午通话次数",
                dataIndex: "call_cnt_afternoon_3m"
            },
            {
                title: "近6月下午通话次数",
                dataIndex: "call_cnt_afternoon_6m"
            },
            {
                title: "近3月晚上通话次数",
                dataIndex: "call_cnt_evening_3m"
            },
            {
                title: "近6月晚上通话次数",
                dataIndex: "call_cnt_evening_6m"
            },
            {
                title: "近3月凌晨通话次数",
                dataIndex: "call_cnt_night_3m"
            },
            {
                title: "近6月凌晨通话次数",
                dataIndex: "call_cnt_night_6m"
            },
            {
                title: "近3月工作日通话次数",
                dataIndex: "call_cnt_weekday_3m"
            },
            {
                title: "近6月工作日通话次数",
                dataIndex: "call_cnt_weekday_6m"
            },
            {
                title: "近3月节假日通话次数",
                dataIndex: "call_cnt_holiday_3m"
            },
            {
                title: "近6月节假日通话次数",
                dataIndex: "call_cnt_holiday_6m"
            },
            {
                title: "近3月周末通话次数",
                dataIndex: "call_cnt_weekend_3m"
            },
            {
                title: "近6月周末通话次数",
                dataIndex: "call_cnt_weekend_6m"
            },
            {
                title: "近3月工作日是否全天联系",
                dataIndex: "call_if_whole_day_3m"
            },
            {
                title: "近6月工作日是否全天联系",
                dataIndex: "call_if_whole_day_6m"
            },
            {
                title: "近3月通话时长",
                dataIndex: "call_time_3m"
            },
            {
                title: "近6月通话时长",
                dataIndex: "call_time_6m"
            },
            {
                title: "号码标识",
                dataIndex: "company_name"
            },
            {
                title: "第一次通话时间",
                dataIndex: "trans_start"
            },
            {
                title: "最后一次通话时间",
                dataIndex: "trans_end"
            }
        ]
        this.columnsCallDurationDetail = [
            {
                title: "分析点",
                dataIndex: "desc"
            },
            {
                title: "时段",
                dataIndex: "time_step_zh"
            },
            {
                title: "主叫次数",
                dataIndex: "item.dial_cnt"
            },
            {
                title: "主叫时长",
                dataIndex: "item.dial_time"
            },
            {
                title: "被叫次数",
                dataIndex: "item.dialed_cnt"
            },
            {
                title: "被叫时长",
                dataIndex: "item.dialed_time"
            },
            {
                title: "第一次通话时间",
                dataIndex: "item.farthest_call_time"
            },
            {
                title: "最后一次通话时间",
                dataIndex: "item.latest_call_time"
            },
            {
                title: "通话次数",
                dataIndex: "item.total_cnt"
            },
            {
                title: "通话时长（秒）",
                dataIndex: "item.total_time"
            },
            {
                title: "通话号码数",
                dataIndex: "item.uniq_num_cnt"
            }
        ]
        this.columnsCallFamilyDetail = [
            {
                title: "分析项",
                dataIndex: "app_point"
            },
            {
                title: "分析项（中文）",
                dataIndex: "app_point_zh"
            },
            {
                title: "近1月数量",
                dataIndex: "item.item_1m"
            },
            {
                title: "近3月数量",
                dataIndex: "item.item_3m"
            },
            {
                title: "近6月数量",
                dataIndex: "item.item_6m"
            },
            {
                title: "近3月平均数量",
                dataIndex: "item.avg_item_3m"
            },
            {
                title: "近6月平均数量",
                dataIndex: "item.avg_item_6m"
            }
        ]
        this.columnsCallRiskAnalysis = [
            {
                title: "分析项",
                dataIndex: "analysis_desc"
            },
            {
                title: "近1月通话次数",
                dataIndex: "analysis_point.call_cnt_1m"
            },
            {
                title: "近3月通话次数",
                dataIndex: "analysis_point.call_cnt_3m"
            },
            {
                title: "近6月通话次数",
                dataIndex: "analysis_point.call_cnt_6m"
            },
            {
                title: "近3月平均通话次数",
                dataIndex: "analysis_point.avg_call_cnt_3m"
            },
            {
                title: "近6月平均通话次数",
                dataIndex: "analysis_point.avg_call_cnt_6m"
            },
            {
                title: "近1月通话时长（秒）",
                dataIndex: "analysis_point.call_time_1m"
            },
            {
                title: "近3月通话时长（秒）",
                dataIndex: "analysis_point.call_time_3m"
            },
            {
                title: "近6月通话时长（秒）",
                dataIndex: "analysis_point.call_time_6m"
            },
            {
                title: "近3月平均通话时长（秒）",
                dataIndex: "analysis_point.avg_call_time_3m"
            },
            {
                title: "近6月平均通话时长（秒）",
                dataIndex: "analysis_point.avg_call_time_6m"
            },
            {
                title: "近1月主叫通话次数",
                dataIndex: "analysis_point.call_analysis_dial_point.call_dial_cnt_1m"
            },
            {
                title: "近3月主叫通话次数",
                dataIndex: "analysis_point.call_analysis_dial_point.call_dial_cnt_3m"
            },
            {
                title: "近6月主叫通话次数",
                dataIndex: "analysis_point.call_analysis_dial_point.call_dial_cnt_6m"
            },
            {
                title: "近3月主叫月均通话次数",
                dataIndex: "analysis_point.call_analysis_dial_point.avg_call_dial_cnt_3m"
            },
            {
                title: "近6月主叫月均通话次数",
                dataIndex: "analysis_point.call_analysis_dial_point.avg_call_dial_cnt_6m"
            },
            {
                title: "近1月主叫通话时长",
                dataIndex: "analysis_point.call_analysis_dial_point.call_dial_time_1m"
            },
            {
                title: "近3月主叫通话时长",
                dataIndex: "analysis_point.call_analysis_dial_point.call_dial_time_3m"
            },
            {
                title: "近6月主叫通话时长",
                dataIndex: "analysis_point.call_analysis_dial_point.call_dial_time_6m"
            },
            {
                title: "近3月主叫月均通话时长",
                dataIndex: "analysis_point.call_analysis_dial_point.avg_call_dial_time_3m"
            },
            {
                title: "近6月主叫月均通话时长",
                dataIndex: "analysis_point.call_analysis_dial_point.avg_call_dial_time_6m"
            },
            {
                title: "近1个月被叫通话次数",
                dataIndex: "analysis_point.call_analysis_dialed_point.call_dialed_cnt_1m"
            },
            {
                title: "近3个月被叫通话次数",
                dataIndex: "analysis_point.call_analysis_dialed_point.call_dialed_cnt_3m"
            },
            {
                title: "近6个月被叫通话次数",
                dataIndex: "analysis_point.call_analysis_dialed_point.call_dialed_cnt_6m"
            },
            {
                title: "近3月被叫月均通话次数",
                dataIndex: "analysis_point.call_analysis_dialed_point.avg_call_dialed_cnt_3m"
            },
            {
                title: "近6月被叫月均通话次数",
                dataIndex: "analysis_point.call_analysis_dialed_point.avg_call_dialed_cnt_6m"
            },
            {
                title: "近1月被叫通话时长",
                dataIndex: "analysis_point.call_analysis_dialed_point.call_dialed_time_1m"
            },
            {
                title: "近3月被叫通话时长",
                dataIndex: "analysis_point.call_analysis_dialed_point.call_dialed_time_3m"
            },
            {
                title: "近6月被叫通话时长",
                dataIndex: "analysis_point.call_analysis_dialed_point.call_dialed_time_6m"
            },
            {
                title: "近3月被叫月均通话时长",
                dataIndex: "analysis_point.call_analysis_dialed_point.avg_call_dialed_time_3m"
            },
            {
                title: "近6月被叫月均通话时长",
                dataIndex: "analysis_point.call_analysis_dialed_point.avg_call_dialed_time_6m"
            }
        ]
        this.columnsCallServiceAnalysis = [
            {
                title: "分析项目",
                dataIndex: "analysis_desc"
            },
            {
                title: "近1月通话次数",
                dataIndex: "analysis_point.call_cnt_1m"
            },
            {
                title: "近3月通话次数",
                dataIndex: "analysis_point.call_cnt_3m"
            },
            {
                title: "近6月通话次数",
                dataIndex: "analysis_point.call_cnt_6m"
            },
            {
                title: "近3月平均通话次数",
                dataIndex: "analysis_point.avg_call_cnt_3m"
            },
            {
                title: "近6月平均通话次数",
                dataIndex: "analysis_point.avg_call_cnt_6m"
            },
            {
                title: "近1月通话时长（秒）",
                dataIndex: "analysis_point.call_time_1m"
            },
            {
                title: "近3月通话时长（秒）",
                dataIndex: "analysis_point.call_time_3m"
            },
            {
                title: "近6月通话时长（秒）",
                dataIndex: "analysis_point.call_time_6m"
            },
            {
                title: "近3月平均通话时长",
                dataIndex: "analysis_point.avg_call_time_3m"
            },
            {
                title: "近6月平均通话时长",
                dataIndex: "analysis_point.avg_call_time_6m"
            },
            {
                title: "近1月主叫通话次数",
                dataIndex: "analysis_point.call_analysis_dial_point.call_dial_cnt_1m"
            },
            {
                title: "近3月主叫通话次数",
                dataIndex: "analysis_point.call_analysis_dial_point.call_dial_cnt_3m"
            },
            {
                title: "近6月主叫通话次数",
                dataIndex: "analysis_point.call_analysis_dial_point.call_dial_cnt_6m"
            },
            {
                title: "近3月主叫月均通话次数",
                dataIndex: "analysis_point.call_analysis_dial_point.avg_call_dial_cnt_3m"
            },
            {
                title: "近6月主叫月均通话次数",
                dataIndex: "analysis_point.call_analysis_dial_point.avg_call_dial_cnt_6m"
            },
            {
                title: "近1月主叫通话时长",
                dataIndex: "analysis_point.call_analysis_dial_point.call_dial_time_1m"
            },
            {
                title: "近3月主叫通话时长",
                dataIndex: "analysis_point.call_analysis_dial_point.call_dial_time_3m"
            },
            {
                title: "近6月主叫通话时长",
                dataIndex: "analysis_point.call_analysis_dial_point.call_dial_time_6m"
            },
            {
                title: "近3月主叫月均通话时长",
                dataIndex: "analysis_point.call_analysis_dial_point.avg_call_dial_time_3m"
            },
            {
                title: "近6月主叫月均通话时长",
                dataIndex: "analysis_point.call_analysis_dial_point.avg_call_dial_time_6m"
            },
            {
                title: "近1个月被叫通话次数",
                dataIndex: "analysis_point.call_analysis_dialed_point.call_dialed_cnt_1m"
            },
            {
                title: "近3个月被叫通话次数",
                dataIndex: "analysis_point.call_analysis_dialed_point.call_dialed_cnt_3m"
            },
            {
                title: "近6个月被叫通话次数",
                dataIndex: "analysis_point.call_analysis_dialed_point.call_dialed_cnt_6m"
            },
            {
                title: "近3月被叫月均通话次数",
                dataIndex: "analysis_point.call_analysis_dialed_point.avg_call_dialed_cnt_3m"
            },
            {
                title: "近6月被叫月均通话次数",
                dataIndex: "analysis_point.call_analysis_dialed_point.avg_call_dialed_cnt_6m"
            },
            {
                title: "近1月被叫通话时长",
                dataIndex: "analysis_point.call_analysis_dialed_point.call_dialed_time_1m"
            },
            {
                title: "近3月被叫通话时长",
                dataIndex: "analysis_point.call_analysis_dialed_point.call_dialed_time_3m"
            },
            {
                title: "近6月被叫通话时长",
                dataIndex: "analysis_point.call_analysis_dialed_point.call_dialed_time_6m"
            },
            {
                title: "近3月被叫月均通话时长",
                dataIndex: "analysis_point.call_analysis_dialed_point.avg_call_dialed_time_3m"
            },
            {
                title: "近6月被叫月均通话时长",
                dataIndex: "analysis_point.call_analysis_dialed_point.avg_call_dialed_time_6m"
            }
        ]
        this.columnsTimeDetail = [
            {
                title:"分析项（中文）",
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
            },
            {
                title:"近3月平均数量",
                dataIndex:"item.avg_item_3m"
            },
            {
                title:"近6月平均数量",
                dataIndex:"item.avg_item_6m"
            }
        ]
        this.columnsCellBehavior = [
            {
                title:"手机号码",
                dataIndex:"cell_phone_num"
            },
            {
                title:"短信次数",
                dataIndex:"sms_cnt"
            },
            {
                title:"流量使用",
                dataIndex:"net_flow"
            },
            {
                title:"消费金额",
                dataIndex:"total_amount"
            },
            {
                title:"月份",
                dataIndex:"cell_mth"
            },
            {
                title:"归属地",
                dataIndex:"cell_loc"
            },
            {
                title:"运营商（中文）",
                dataIndex:"cell_operator_zh"
            },
            {
                title:"运营商",
                dataIndex:"cell_operator"
            },
            {
                title:"通话次数",
                dataIndex:"call_cnt"
            },
            {
                title:"通话时长（秒）",
                dataIndex:"call_time"
            },
            {
                title:"主叫次数",
                dataIndex:"dial_cnt"
            },
            {
                title:"主叫时长（秒）",
                dataIndex:"dial_time"
            },
            {
                title:"被叫次数",
                dataIndex:"dialed_cnt"
            },
            {
                title:"被叫时长（秒）",
                dataIndex:"dialed_time"
            },
            {
                title:"充值次数",
                dataIndex:"rechange_cnt"
            },
            {
                title:"充值总额（分）",
                dataIndex:"rechange_amount"
            }
        ]
        this.columnsConsumptionDetail = [
            {
                title:"分析项（中文）",
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
            },
            {
                title:"近3月平均数量",
                dataIndex:"item.avg_item_3m"
            },
            {
                title:"近6月平均数量",
                dataIndex:"item.avg_item_6m"
            },
        ]
        this.columnsContactRegion = [
            {
                title:"地区名称",
                dataIndex:"region_loc"
            },
            {
                title:"通话号码数",
                dataIndex:"region_uniq_num_cnt"
            },
            {
                title:"通话次数",
                dataIndex:"region_call_cnt"
            },
            {
                title:"通话时长（秒）",
                dataIndex:"region_call_time"
            },
            {
                title:"主叫次数",
                dataIndex:"region_dial_cnt"
            },
            {
                title:"主叫时长（秒）",
                dataIndex:"region_dial_time"
            },
            {
                title:"被叫次数",
                dataIndex:"region_dialed_cnt"
            },
            {
                title:"被叫时长（秒）",
                dataIndex:"region_dialed_time"
            },
            {
                title:"主叫平均时长（秒）",
                dataIndex:"region_avg_dial_time"
            },
            {
                title:"被叫平均时长（秒）",
                dataIndex:"region_avg_dialed_time"
            },
            {
                title:"主叫次数占比",
                dataIndex:"region_dial_cnt_pct"
            },
            {
                title:"主叫时长占比",
                dataIndex:"region_dial_time_pct"
            },
            {
                title:"被叫次数占比",
                dataIndex:"region_dialed_cnt_pct"
            },
            {
                title:"被叫时长占比",
                dataIndex:"region_dialed_time_pct"
            }
        ]
        this.columnsMainService = [
            {
                title:"号码类型",
                dataIndex:"group_name"
            },
            {
                title:"号码标识",
                dataIndex:"company_name"
            },
            {
                title:"服务号码",
                dataIndex:"service_num"
            },
            {
                title:"月份",
                dataIndex:"interact_mth"
            },
            {
                title:"通话次数",
                dataIndex:"interact_cnt"
            },
            {
                title:"通话时长",
                dataIndex:"interact_time"
            },
            {
                title:"主叫次数",
                dataIndex:"dial_cnt"
            },
            {
                title:"被叫次数",
                dataIndex:"dialed_cnt"
            },
            {
                title:"主叫时长（秒）",
                dataIndex:"dial_time"
            },
            {
                title:"被叫时长（秒）",
                dataIndex:"dialed_time"
            },
            {
                title:"总服务次数",
                dataIndex:"total_service_cnt"
            }
        ]
        this.columnsSmsContactDetail = [
            {
                title:"对方号码",
                dataIndex:"peer_num"
            },
            {
                title:"近1周短信次数",
                dataIndex:"sms_cnt_1w"
            },
            {
                title:"近1月短信次数",
                dataIndex:"sms_cnt_1m"
            },
            {
                title:"近3月短信次数",
                dataIndex:"sms_cnt_3m"
            },
            {
                title:"近6月短信次数",
                dataIndex:"sms_cnt_6m"
            },
            {
                title:"近3月发送短信次数",
                dataIndex:"send_cnt_3m"
            },
            {
                title:"近6月发送短信次数",
                dataIndex:"send_cnt_6m"
            },
            {
                title:"近3月接收短信次数",
                dataIndex:"receive_cnt_3m"
            },
            {
                title:"近6月接收短信次数",
                dataIndex:"receive_cnt_6m"
            }
        ]
        this.columnsTripInfo = [
            {
                title:"目的地",
                dataIndex:"trip_dest"
            },
            {
                title:"出发时间",
                dataIndex:"trip_start_time"
            },
            {
                title:"回程时间",
                dataIndex:"trip_end_time"
            },
            {
                title:"出发地",
                dataIndex:"trip_leave"
            },
            {
                title:"时间段",
                dataIndex:"trip_type"
            }
        ]
    }
    componentWillReceiveProps(props) {
        if (props.dataSource) {
            let detail = this.splitData(props.dataSource)
            this.setState({
                ...detail
            })
        }
    }

    splitData(detail) {
        if (!detail) {
            return ""
        }
        detail = JSON.parse(detail);
        return {
            userBaseInfo: detail.user_basic,
            cellPhoneBaseInfo:detail.cell_phone,
            userInfoCheck: format_table_data(detail.user_info_check || []),
            friendCircel: detail.friend_circle.summary,
            activeDegree: detail.active_degree,
            baseCheckItems: detail.basic_check_items,
            behaviorCheck: detail.behavior_check,
            callContactDetail: format_table_data(detail.call_contact_detail || []),
            callDurationDetail: bmd.unfoldObjArray(detail.call_duration_detail || {}),
            callFamilyDetail: detail.call_family_detail,
            callRiskAnalysis: detail.call_risk_analysis,
            callServiceAnalysis: detail.call_service_analysis,
            callTimeDetail: detail.call_time_detail,
            cellBehavior: bmd.unfoldObjArray(detail.cell_behavior),
            consumptionDetail:detail.consumption_detail,
            contactRegion:format_table_data(bmd.unfoldObjArray(detail.contact_region)),
            mainService:format_table_data(bmd.unfoldObjArray(detail.main_service)),
            smsContactDetail:detail.sms_contact_detail,
            tripInfo:format_table_data(detail.trip_info)
        }
    }

    // 表格统一
    tableOptions(list = [], rowKey) {
        return {
            dataSource: list,
            bordered: true,
            rowKey,
            pagination: {
                total: list.length,
                pageSize: 10
            }
        }
    }

    // 简表
    shortOptions(list = [], rowKey) {
        return {
            dataSource: list,
            bordered: true,
            rowKey,
            pagination: false
        }
    }

    render() {
        let props = this.tableOptions;
        let short = this.shortOptions;
        return (
            <div>
                <Panel title="用户基础信息">
                    <QAList dataSource={this.state.userBaseInfo} />
                </Panel>
                <Panel title="手机号基础信息">
                    <QAList dataSource={this.state.cellPhoneBaseInfo} />
                </Panel>
                <Panel title="活跃程度分析">
                    <Table columns={this.columnsActive} {...props(this.state.activeDegree, "app_point")} />
                </Panel>
                <Panel title="基本信息校验项">
                    <Table columns={this.columnsBaseCheckItems} {...props(this.state.baseCheckItems, "check_item")} />
                </Panel>
                <Panel title="行为检测">
                    <Table columns={this.columnsBehaviorCheck} {...props(this.state.behaviorCheck, "check_point")} />
                </Panel>
                <Panel title="行为分析">
                    <Table columns={this.columnsCellBehavior} {...short(this.state.cellBehavior, "cell_mth")} />
                </Panel>
                <Panel title="通话详单">
                    <Table columns={this.columnsCallContactDetail} {...props(this.state.callContactDetail, "key")} scroll={{ x: 2400 }} />
                </Panel>
                <Panel title="通话时段分析">
                    <Table columns={this.columnsCallDurationDetail} {...props(this.state.callDurationDetail, "akid")} />
                </Panel>
                <Panel title="亲情号通话详单">
                    <Table columns={this.columnsCallFamilyDetail} {...props(this.state.callFamilyDetail, "app_point")} />
                </Panel>
                <Panel title="通话风险分析">
                    <Table columns={this.columnsCallRiskAnalysis} {...props(this.state.callRiskAnalysis, "analysis_item")} scroll={{ x: 2400 }} />
                </Panel>
                <Panel title="通话服务分析">
                    <Table columns={this.columnsCallServiceAnalysis} {...short(this.state.callServiceAnalysis, "analysis_item")} scroll={{ x: 2400 }} />
                </Panel>
                <Panel title="通话时长详单">
                    <Table columns={this.columnsTimeDetail} {...short(this.state.callTimeDetail, "app_point")} />
                </Panel>
                <Panel title="消费详单">
                    <Table columns={this.columnsConsumptionDetail} {...short(this.state.consumptionDetail, "app_point")} />
                </Panel>
                <Panel title="联系人区域汇总">
                    <Table columns={this.columnsContactRegion} {...props(this.state.contactRegion, "key")} />
                </Panel>
                <Panel title="常用服务详单">
                    <Table columns={this.columnsMainService} {...props(this.state.mainService, "key")} />
                </Panel>
                <Panel title="短信详单">
                    <Table columns={this.columnsSmsContactDetail} {...props(this.state.smsContactDetail, "peer_num")} />
                </Panel>
                <Panel title="用户出行分析">
                    <Table columns={this.columnsTripInfo} {...props(this.state.tripInfo, "key")} />
                </Panel>
            </div>
        )
    }
}

export default CarrierReprot;