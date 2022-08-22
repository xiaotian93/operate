import React, { Component } from 'react';
import { Row ,Table} from 'antd';
// import moment from 'moment'
import TableCol from '../../../templates/TableCol_4';
import { host_cxfq } from '../../../ajax/config';
import { axios_sh } from '../../../ajax/request'
import { customer_person_show, gtask_img_url } from '../../../ajax/api';
import ImgTag from '../../../templates/ImageTag_w';
import {format_table_data} from '../../../ajax/tool';
class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            id: this.props.location.query.id,
            storages: [],
            source: [],
            data:[]
        };
    }
    componentWillMount() {
        this.basic = {
            "name": {
                name: "姓名",
            },
            "cardType": {
                name: "证件类型"
            },
            "cardNo": {
                name: "证件编号"
            },
            "address": {
                name: "地址",
            },
            "phone": {
                name: "手机号",
            },
            "phone1": {
                name: "注册终端",
                render: () => { return "微信小程序" }
            },
            "createTime": {
                name: "注册日期",
            },
            "statusStr": {
                name: "客户状态",

            },
            "personNo": {
                name: "客户ID",
                // span_val: 7
            },
        }
        
    }
    componentDidMount() {
        this.show_customer(this.state.id);
        this.fields = [
            {
                title:"",
                dataIndex:"key",
                render:(e)=>{return "卡"+e}
            },
            {
                title:"绑卡状态",
                dataIndex:"bindCardStatusStr"
            },
            {
                title:"银行预留手机号",
                dataIndex:"bankPhone"
            },
            {
                title:"银行卡号开户行",
                dataIndex:"bankName"
            },
            {
                title:"银行卡号",
                dataIndex:"bankCard"
            }
        ]
    }
    // 查看企业客户
    show_customer(id) {
        axios_sh.post(customer_person_show, { id: id }).then(data => {
            let obj = data.data;
            // let cardStorageNoList = obj.cardStorageNoList;
            let imgs = [];
            // if (cardStorageNoList && cardStorageNoList.length > 2) {
                imgs.push({ src: host_cxfq + gtask_img_url + "?storageNo=" + obj.cardFrontStorageNo, des: "身份证正面" })
                imgs.push({ src: host_cxfq + gtask_img_url + "?storageNo=" + obj.cardBackStorageNo, des: "身份证反面" })
            // }
            for (let o in obj) {
                obj[o] = obj[o] || "--"
            }
            this.setState({
                storages: imgs,
                source: obj,
                data:format_table_data(obj.bankCardInfoList)
            });

        })
    }
    render() {
        return (
            <div>
                <div className="detail_card">
                    <div className="title">
                        <div className="icon" />
                        <span className="titleWord">基本信息</span>
                    </div>
                    <Row className="contain">
                        {/* <div className="sub-title">证件影像</div> */}
                        <div className="imgs">
                            <ImgTag imgs={this.state.storages} />
                        </div>
                        <TableCol data-source={this.state.source} data-columns={this.basic} />
                    </Row>
                </div>
                <div className="detail_card">
                    <div className="title">
                        <div className="icon" />
                        <span className="titleWord">银行卡信息</span>
                    </div>
                    <Row className="contain">
                    <Table dataSource={this.state.data} columns={this.fields} bordered pagination={false} rowKey="bankCard" />
                    </Row>
                    
                </div>
                {/* <Row className="contain">
                    <TableCol data-source={this.state.source} data-columns={this.fields} />
                </Row>
                <Row className="contain" style={{ display: (this.state.storages.length > 0 ? "block" : "none") }}>
                    <div className="sub-title">证件影像</div>
                    <div className="imgs">
                        <Card list={this.state.storages} />
                    </div>
                </Row> */}

            </div>
        )
    }
}

export default Detail;
