import React, { Component } from 'react';
import { Row , Col } from 'antd';
// import moment from 'moment'

import LineTable from '../../../ui/edit_Table';

class Insurance extends Component{
    constructor(props){
        super(props);
        this.state={
            type:this.props.location.query.type,
            data:{}
        }
    }
    componentWillMount(){
        this.colums={
            return:[
                {
                    title: '保单号',
                    className: "grey",
                    dataIndex: 'blank1',
                    height:"50px"
                },
                {
                    title: '保险公司',
                    className: "grey",
                    dataIndex: 'blank1',
                    height:"50px"

                },
                {
                    title: '退保完成日',
                    className: "",
                    dataIndex: 'blank1',
                    type:"date",
                    height:"50px",
                    id:"finshDate"
                },
                {
                    title: '退保核算日期',
                    className: "",
                    dataIndex: 'blank1',
                    type:"date",
                    height:"50px",
                    id:"aa"
                },
                {
                    title: '商业险金额',
                    className: "grey",
                    dataIndex: 'blank1',
                    height:"50px"
                },
                {
                    title: '商业险退保金额',
                    className: "grey",
                    dataIndex: 'blank1',
                    type:"input",
                    placeholder:"请输入商业险的退保金额",
                    height:"50px",
                    id:"bb"
                },
                {
                    title: '交强险金额',
                    className: "",
                    dataIndex: 'blank1',
                    height:"50px"
                },
                {
                    title: '交强险退保金额',
                    className: "",
                    dataIndex: 'blank1',
                    type:"input",
                    placeholder:"请输入交强险的退保金额",
                    height:"50px",
                    id:"cc"
                },
                {
                    title: '车船税金额',
                    className: "grey",
                    dataIndex: 'blank1',
                    height:"50px"
                },
                {
                    title: '车船税退保金额',
                    className: "grey",
                    dataIndex: 'blank1',
                    type:"input",
                    placeholder:"请输入车船税的退保金额",
                    height:"50px",
                    id:"dd"
                },
                {
                    title: '备注',
                    className: "",
                    dataIndex: 'blank1',
                    type:"input",
                    placeholder:"请输入备注",
                    height:"50px",
                    id:"remark"
                },
                {
                    title: '退保退款合计',
                    className: "",
                    dataIndex: 'blank1',
                    height:"50px"
                },
            ],
            payMore:[
                {
                    title: '保单号',
                    className: "grey",
                    dataIndex: 'blank1',
                    height:"50px"
                },
                {
                    title: '保险公司',
                    className: "grey",
                    dataIndex: 'blank1',
                    height:"50px"
                },
                {
                    title: '签单日期',
                    className: "",
                    dataIndex: 'blank1',
                    height:"50px",
                    id:"ad"
                },
                {
                    title: '多付核算日期',
                    className: "",
                    dataIndex: 'blank1',
                    height:"50px",
                    type:"date"
                },
                {
                    title: '商业险金额',
                    className: "grey",
                    dataIndex: 'blank1',
                    height:"50px"
                },
                {
                    title: '商业险多付金额',
                    className: "grey",
                    dataIndex: 'blank1',
                    height:"50px",
                    type:"input",
                    placeholder:"请输入商业险的多付金额",
                },
                {
                    title: '交强险金额',
                    className: "",
                    dataIndex: 'blank1',
                    height:"50px"
                },
                {
                    title: '交强险多付金额',
                    className: "",
                    dataIndex: 'blank1',
                    height:"50px",
                    type:"input",
                    placeholder:"请输入交强险的多付金额",
                },
                {
                    title: '车船税金额',
                    className: "grey",
                    dataIndex: 'blank1',
                    height:"50px"
                },
                {
                    title: '车船税多付金额',
                    className: "grey",
                    dataIndex: 'blank1',
                    height:"50px",
                    type:"input",
                    placeholder:"请输入车船税的多付金额",
                },
                {
                    title: '备注',
                    className: "",
                    dataIndex: 'blank1',
                    height:"50px",
                    type:"input",
                    placeholder:"请输入备注",
                },
                {
                    title: '多付金额合计',
                    className: "",
                    dataIndex: 'blank1',
                    height:"50px"
                },
            ],
            buyBack:[
                {
                    title: '保单号',
                    className: "grey",
                    dataIndex: 'blank1',
                    height:"50px"
                },
                {
                    title: '保险公司',
                    className: "grey",
                    dataIndex: 'blank1',
                    height:"50px"
                },
                {
                    title: '签单日期',
                    className: "",
                    dataIndex: 'blank1',
                    height:"50px"
                },
                {
                    title: '回购核算日期',
                    className: "",
                    dataIndex: 'blank1',
                    height:"50px",
                    type:"date"
                },
                {
                    title: '商业险金额',
                    className: "grey",
                    dataIndex: 'blank1',
                    height:"50px"
                },
                {
                    title: '回购金额合计',
                    className: "grey",
                    dataIndex: 'blank1',
                    height:"50px"
                },
                {
                    title: '交强险金额',
                    className: "",
                    dataIndex: 'blank1',
                    height:"50px"
                },
                {
                    title: '备注',
                    className: "",
                    dataIndex: 'blank1',
                    height:"50px",
                    type:"input",
                    placeholder:"请输入备注"
                },
                {
                    title: '车船税金额',
                    className: "",
                    dataIndex: 'blank1',
                    height:"50px"
                }
            ],
            settle:[
                {
                    title: '保单号',
                    className: "grey",
                    dataIndex: 'blank1',
                    height:"50px"
                },
                {
                    title: '保险公司',
                    className: "grey",
                    dataIndex: 'blank1',
                    height:"50px"
                },
                {
                    title: '签单日期',
                    className: "",
                    dataIndex: 'blank1',
                    height:"50px"
                },
                {
                    title: '结清核算日期',
                    className: "",
                    dataIndex: 'blank1',
                    height:"50px",
                    type:"date"
                },
                {
                    title: '商业险金额',
                    className: "grey",
                    dataIndex: 'blank1',
                    height:"50px"
                },
                {
                    title: '结清商业险金额',
                    className: "grey",
                    dataIndex: 'blank1',
                    height:"50px"
                },
                {
                    title: '备注',
                    className: "",
                    dataIndex: 'blank1',
                    height:"50px",
                    type:"input",
                    placeholder:"请输入备注"
                },
                {
                    title: '',
                    className: "",
                    dataIndex: 'blank1',
                    height:"50px"
                },
            ]
        }
        this.title={
            return:{
                nav:"退保",
                title:"第一步：填写退保金额"
            },
            payMore:{
                nav:"多付",
                title:"填写多付金额"
            },
            buyBack:{
                nav:"回购",
                title:"填写回购金额"
            },
            settle:{
                nav:"结清",
                title:""
            }

        }
    }
    getData(e){
        this.setState({
            data:e
        })
    }
    render (){
        var type=this.props.location.query.type;
        return (
            <div>
                <Row className="path">
                    <Col span={24}>
                        <span className="f2">还款管理&nbsp;&gt;&nbsp;</span><span className="f2">保单管理&nbsp;&gt;&nbsp;</span><span className="f2 text-blue">{this.title[type].nav}</span>
                    </Col>
                </Row>
                <Row className="content">
                    <Col span={24}>
                        <div style={{"marginBottom":"10px"}}>{this.title[type].title}</div>
                        <div className="operate">
                            <LineTable line={2} columns={this.colums[type]} className="edit-table" getdate={this.getData.bind(this)} />
                            {
                                type==="settle"?<span className="tishi">本次结清不会退保，但会扣除该借款金额对应的所有应还利息</span>:""
                            }

                        </div>


                    </Col>

                </Row>
            </div>

        )
    }
}
export default Insurance;