import React, { Component } from 'react';
import { message, Modal } from 'antd';

import { axios_gyl } from '../../../ajax/request';
import Permissions from '../../../templates/Permissions';
import ComponentRoute from '../../../templates/ComponentRoute';
import Form from '../../../views/form';
import ListCtrl from '../../../controllers/List';

class reviewGyl extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: [],
            modalDes: "",
            confirmLoading: false
        };
        this.currentOrder = {};
        this.currentOperate = "PASS";
    }
    componentWillMount() {
        this.columns = [
            {
                title: '序号',
                width: 50,
                dataIndex: 'key'
            },
            {
                title: '订单编号',
                dataIndex: 'orderNo',
            },
            {
                title: '订单时间',
                dataIndex: "createTime",
                sorter: true
            },
            {
                title: '借款方',
                dataIndex: 'borrowerCompanyName',
            },
            {
                title: '产品名称',
                dataIndex: 'appLoanConfigName',
            },
            {
                title: '债权人',
                dataIndex: 'payeeCompanyName'
            },
            {
                title: '借款金额',
                dataIndex: "amount",
                render: (data) => data ? data.money() : "--",
                sorter: true
            },
            {
                title: '借款期限(天)',
                dataIndex: "period"
            },
            {
                title: '备注',
                dataIndex: "remark"
            },
            {
                title: '操作',
                className: "operate",
                render: (data) => [
                    <Permissions server={global.AUTHSERVER.gyl.key} key="pass" type="primary" size="small" onClick={() => this.showModal(data, true)} permissions={global.AUTHSERVER.gyl.access.approve1}>通过</Permissions>,
                    <Permissions server={global.AUTHSERVER.gyl.key} key="refuse" type="danger" size="small" onClick={() => (this.showModal(data, false))} permissions={global.AUTHSERVER.gyl.access.reject1}>驳回</Permissions>,
                    <Permissions server={global.AUTHSERVER.gyl.key} key="detail" size="small" onClick={() => (this.detail(data.orderNo))} permissions={global.AUTHSERVER.gyl.access.approve1_detail} src={'/db/review/gyl/detail?orderNo=' + data.orderNo + '&audit=first&type=review'}>查看</Permissions>
                ]
            }
        ];
        this.items = [
            {
                name: "订单编号",
                key: "orderNo",
                type: "text",
                placeHolder: "请输入订单编号"
            },
            {
                name: "订单时间",
                key: "time",
                type: "range_date",
                feild_s: "createTimeMin",
                feild_e: "createTimeMax",
                withTime:true,
                placeHolder: ['开始日期', "结束日期"]
            },
            {
                name: "借款方",
                key: "borrowerCompanyName",
                type: "text",
                placeHolder: "请输入借款方"
            }
        ]

    }
    listRequestor(param) {
        return axios_gyl.post("manage/order/gyl/get_approve1_list", param);
    }
    detail(orderNo) {
        window.open('/db/review/gyl/detail?orderNo=' + orderNo + '&audit=first&type=review');
    }
    showModal(data, pass) {
        this.setState({
            visible: true,
            title: `确认所选订单${pass ? "通过" : "驳回"}？`,
            modalDes: (data.feeCollectMode === "ADVANCE" && pass) ? <span style={{ marginBottom: "10px", color: "red", marginLeft: "11px" }}>
                当前订单为【先付息后放款】类型，请确认是否已收到息费&emsp;
                <a target="_blank" href="/zj/account/detail?accountId=10988">去确认</a><br /><br />
            </span> : ""
        });
        this.currentOrder = data;
        this.currentOperate = pass ? "PASS" : "REFUSE";
    }
    hideModal(e) {
        this.setState({ visible: false });
        this.currentOrder = {};
        this.setForm({ comment: "" });
    }
    submitComment() {
        let formData = this.getFormData();
        let rqd = { orderNo: this.currentOrder.orderNo, ...formData };
        let response = null;
        this.setState({ confirmLoading: true });
        if (this.currentOperate === "REFUSE") {
            if (!formData.comment) {
                message.warn("驳回意见不能为空");
                this.setState({ confirmLoading: false });
                return;
            }
            response = this.approveReject(rqd);
        } else {
            response = this.approvePass(rqd);
        }
        response.then(data => {
            message.success(data.msg);
            this.getList();
            this.hideModal();
        }).finally(e => {
            this.setState({ confirmLoading: false });
        })

    }
    approvePass(param) {
        return axios_gyl.post("manage/order/gyl/approve1", param)
    }
    approveReject(param) {
        return axios_gyl.post("manage/order/gyl/reject1", param)
    }
    render() {
        const modalProps = {
            title: this.state.title,
            visible: this.state.visible,
            confirmLoading: this.state.confirmLoading,
            onOk: this.submitComment.bind(this),
            onCancel: this.hideModal.bind(this)
        }
        const listProps = {
            items: this.items,
            columns: this.columns,
            listRequestor: this.listRequestor.bind(this),
            bindrefresh: refresh => this.getList = refresh
        }
        return <ListCtrl {...listProps}>
            <Modal {...modalProps}>
                {this.state.modalDes}
                <Form items={[{ key: "comment", placeholder: "请输入审批意见" }]} bindget={get => this.getFormData = get} bindset={set => this.setForm = set} />
            </Modal>
        </ListCtrl>
    }
}

export default ComponentRoute(reviewGyl);
