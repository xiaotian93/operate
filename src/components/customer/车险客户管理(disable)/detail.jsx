import React, { Component } from 'react';
import { Row, Button } from 'antd';
// import moment from 'moment'
import ImgTag from '../../../templates/ImageTag_w';
import TableCol from '../../../templates/TableCol_4';
import { host_cxfq } from '../../../ajax/config';
import { axios_sh } from '../../../ajax/request'
import { customer_company_show, gtask_img_url } from '../../../ajax/api';
import ComponentRoute from '../../../templates/ComponentRoute';

class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            id: this.props.location.query.id,
            source: [],
            storages: []
        };
    }
    componentWillMount() {
        this.basic = {
            "name": {
                name: "企业名称",
            },
            "shortName": {
                name: "企业简称"
            },
            "creditCode": {
                name: "企业统一信用代码",
            },
            "expireDate": {
                name: "营业执照截止日期"
            },
            "industry": {
                name: "所属行业",
            },
            "scale": {
                name: "企业规模"
            },
            "type": {
                name: "产业类型"
            },
            "mobile": {
                name: "企业联系方式"
            },
            "province": {
                name: "省份"
            },
            "city": {
                name: "城市"
            },
            "area": {
                name: "区/县",

            },
            "time": {
                name: "注册时间",
                render: () => { return "--" }
            },
            "time1": {
                name: "商户名称",
                render: () => { return "--" }
            },
            "time2": {
                name: "渠道",
                render: () => { return "--" }
            },
            "qyNo": {
                name: "客户ID",
            },
            "status": {
                name: "客户状态",
                render: (e) => {
                    var status = { "-1": "黑名单", "0": "正常", "1": "白名单" };
                    return status[e.status]
                }
            }
        }
        this.fr = {
            "frName": {
                name: "法人姓名"
            },
            "frPhone": {
                name: "法人手机号"
            },
            "frIdCard": {
                name: "法人身份证号",
                // span_val:3
            },
        }
        this.js = {
            "settleAccountName": {
                name: "结算账户名称"
            },
            "settleBankCard": {
                name: "结算账号"
            },
            "settleBankName": {
                name: "开户银行"
            },
            // "settleBankLic": ["13gwebvgrbv", "13gqevasv"],

            "settleSubBankName": {
                name: "开户行名称"
            },
        }
        this.hk = {
            "repayAccountName": {
                name: "还款账户名称",
                // span_val:3
            },
            "repayBankCard": {
                name: "还款银行卡号",
                // span_val:3
            },
        }
        this.fields = {
            // "frIdCardStorageNo": ["13t2gwrb", "21f3ewge", "1f3egvbv"],

            "agentName": {
                name: "联系人姓名"
            },
            "agentPhone": {
                name: "联系人手机号"
            },
            "agentIdCard": {
                name: "联系人身份证号",
            },
            "agentEmail": {
                name: "联系人邮箱",
            },
            // "agentIdCardStorageNo": ["21g3webvcaf", "f3gvev"],

            // "repayBankLic": ["123gevwsa","534gev"],
            // "repayBankName": {
            //     name:"还款账户银行"
            // },
            // "repaySubBankName": {
            //     name:"还款账户开户行"
            // }
        }
    }
    componentDidMount() {
        this.show_customer(this.state.id);
    }
    // 查看企业客户
    show_customer(id) {
        axios_sh.post(customer_company_show, { id: id }).then(data => {
            let obj = data.data;
            let license = JSON.parse(obj.license);
            let frIdCardStorageNo = JSON.parse(obj.frIdCardStorageNo);
            let settleBankLic = JSON.parse(obj.settleBankLic);
            let agentIdCardStorageNo = JSON.parse(obj.agentIdCardStorageNo);
            // let repayBankLic = JSON.parse(obj.repayBankLic);
            let imgs = [];
            for (let l in license) {
                imgs.push({ src: host_cxfq + gtask_img_url + "?storageNo=" + license[l], des: "营业执照" })
            }
            for (let l in frIdCardStorageNo) {
                imgs.push({ src: host_cxfq + gtask_img_url + "?storageNo=" + frIdCardStorageNo[l], des: "法人身份证影像" })
            }
            for (let l in settleBankLic) {
                imgs.push({ src: host_cxfq + gtask_img_url + "?storageNo=" + settleBankLic[l], des: "结算银行开户许可证" })
            }
            for (let l in agentIdCardStorageNo) {
                imgs.push({ src: host_cxfq + gtask_img_url + "?storageNo=" + agentIdCardStorageNo[l], des: "联系人身份证影像" })
            }
            // for(let l in repayBankLic){
            //     imgs.push({src:host_cxfq+gtask_img_url+"?storageNo="+repayBankLic[l],des:"还款银行开户许可证"})
            // }
            this.setState({
                storages: imgs,
                source: obj
            });

        })
    }
    // 编辑客户信息
    update_customer() {
        this.props.router.push("/kh/cxfq/company/insert?id=" + this.state.id);
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
                        <span className="titleWord">法人信息</span>
                    </div>
                    <Row className="contain">
                        <TableCol data-source={this.state.source} data-columns={this.fr} />
                    </Row>
                </div>
                <div className="detail_card">
                    <div className="title">
                        <div className="icon" />
                        <span className="titleWord">结算账户信息</span>
                    </div>
                    <Row className="contain">
                        <TableCol data-source={this.state.source} data-columns={this.js} />
                    </Row>
                </div>
                <div className="detail_card">
                    <div className="title">
                        <div className="icon" />
                        <span className="titleWord">还款账户信息</span>
                    </div>
                    <Row className="contain">
                        <TableCol data-source={this.state.source} data-columns={this.hk} />
                    </Row>
                </div>
                <div className="detail_card">
                    <div className="title">
                        <div className="icon" />
                        <span className="titleWord">联系人信息</span>
                    </div>
                    <Row className="contain">
                        <TableCol data-source={this.state.source} data-columns={this.fields} />
                    </Row>
                </div>
                {/* <Row className="contain"> */}
                {/* <TableCol data-source={this.state.source} data-columns={this.fields} /> */}
                {/* </Row> */}
                <Row className="" style={{ textAlign: "center", margin: "10px 2%" }}>
                    <Button onClick={this.update_customer.bind(this)} type="primary">编辑</Button>
                </Row>

            </div>
        )
    }
}

export default ComponentRoute(Detail);
