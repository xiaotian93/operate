import React, { Component } from 'react';
import { Row } from 'antd';
// import moment from 'moment'

import { axios_xjd } from '../../../ajax/request';
import { vip_order_detail } from '../../../ajax/api';
import { bmd } from '../../../ajax/tool';
import Panel from '../../../templates/Panel';
import TableLine from '../../../templates/TableLine';

class Overdue extends Component{
    constructor(props) {
        super(props);
        this.state = {
            visible:false,
            detail:{}
        };
        this.loader = [];
        this.vipInfoId = props.location.query.vipInfoId;
    }
    componentWillMount(){
        this.columnsVip = [
            {
                title: '会员姓名',
                dataIndex: 'borrower'
            },
            {
                title: '联系电话',
                dataIndex: 'phoneNo'
            },
            {
                title: '性别',
                dataIndex: 'gender'
            },
            {
                title: '年龄',
                dataIndex: 'age'
            },
            {
                title: '身份证号',
                dataIndex: 'idCardNo'
            },
            {
                title: '通讯地址',
                dataIndex: 'idCardAddress'
			},
			{
                title: '注册终端',
                dataIndex: 'clientPlatform'
            },
            {
                title: '注册渠道',
                dataIndex: 'clientChannel'
			},
			{
                title: '注册APP',
                dataIndex: 'registerApp'
            },
            {
                title: '订单时间',
                dataIndex: 'orderTime'
            },
            {
                title: '订单编号',
                dataIndex: 'orderNo'
            },
            {
                title: '会员状态',
                dataIndex: 'vipStatusStr'
            },
            {
                title: '会员编号',
                dataIndex: 'vipNo'
            },
            {
                title: '会员卡类型',
                dataIndex: 'vipName'
			},
			{
                title: '原始价格(元)',
                dataIndex: 'vipOriginAmount',
                render:data=> bmd.money(data.vipOriginAmount)
            },
            {
                title: '购买价格',
                dataIndex: 'vipRealAmount',
                render:data=> bmd.money(data.vipRealAmount)
			},
            {
                title: '折扣率',
                dataIndex: 'discountCoupon',
                render:data=>bmd.percent(data.discountCoupon)
			},
            {
                title: '有效期',
                dataIndex: 'validity',
                render:data=>data.validity+"天"
            },
            {
                title: '生效时间',
                dataIndex: 'effectTime'
            },
            {
                title: '会员支付时间',
                dataIndex:"payTime"
            },
            {
                title: '会员支付方式',
                dataIndex:"payChannel"
            },
            {
                title: '支付流水号',
                dataIndex:"paySerialNo"
            },
            {
                title: '会员协议',
                dataIndex:"vipProtocolUrl",
                render:data=><a target="_blank" href={data.vipProtocolUrl}>点击查看</a>
            }
        ];
        this.columnsLoan = [
            {
                title: '是否使用借贷服务',
                dataIndex: 'loanUseStatusStr',
            },
            {
                title: '借贷金额',
                dataIndex: 'loanAmount',
                render:data=> bmd.money(data.loanAmount)
            },
            {
                title: '年化综合费率',
                dataIndex:'yearInterestRate',
                render:data=> bmd.percent(data.yearInterestRate)
            },
            {
                title: '借贷期限',
                dataIndex:'loanTerm'
            },
            {
                title: '借贷开始时间',
                dataIndex:'loanStartTime'
            },
            {
                title: '借贷结束时间',
                dataIndex:'loanEndTime'
            },
            {
                title: '产品名称',
                dataIndex:'productName'
            },
            {
                title: '商户名称',
                dataIndex:'merchantName'
            },
            {
                title: '借贷订单时间',
                dataIndex:'loanOrderTime'
            },
            {
                title: '借贷订单编号',
                dataIndex:'orderNo'
            }
        ];
    }
    componentDidMount(){
        this.getDetail();
    }
    getDetail(){
        axios_xjd.post(vip_order_detail,{vipInfoId:this.vipInfoId}).then((data)=>{
            this.setState({
                detail:data.data
            });
        });
    }

    // 显示催记弹窗
    modalShow(e){
        this.setState({
            visible:true
        })
    }

    // 关闭催记弹窗
    modalHide(e){
        this.setState({
            visible:false
        })
        this.getDetail();
    }

    render (){
        return(
            <Row className="detail-contain">
                <Panel title="会员信息">
                    <TableLine columns={this.columnsVip} dataSource={this.state.detail} />
                </Panel>
                <Panel title="关联借贷信息">
                    <TableLine columns={this.columnsLoan} dataSource={this.state.detail} />
                </Panel>
            </Row>
        )
    }
}

export default Overdue;