import React, { Component } from 'react';
import { Table , Row , Col , Button , Modal , Input } from 'antd';
import Filter from '../../ui/Filter_3line.jsx';
// import moment from 'moment'

const data = [{
    key:"30",
    1: '1',
    2: 'John Brown',
    3: 32,
    4: 'New York No. 1 Lake Park',
    5: '1',
    6: 'John Brown',
    7: 32,
    8: 'New York No. 1 Lake Park',
    9: '1',
    10: 'John Brown',
    11: 32,
    12: 'New York No. 1 Lake Park',
    13: '1',
    14: 'John Brown',
    15: 32,
    16: 'New York No. 1 Lake Park',
    17: '1',
    18: 'John Brown',
    19: 32,
    20: 'New York No. 1 Lake Park',
    21: '1',
    22: 'John Brown',
    23: 32,
    24: 'New York No. 1 Lake Park',

}];

class Insurance extends Component{
    constructor(props){
        super(props);
        this.state={
            colums:[
                {
                    title: '日期',
                    className: "grey",
                    dataIndex: 'blank1',
                    type:"date"
                },
                {
                    title: '商业险',
                    className: "grey",
                    dataIndex: 'blank1',
                    type:"input",
                    placeholder:"请输入商业险"
                },
                {
                    title: '日期',
                    className: "grey",
                    dataIndex: 'blank1',
                    type:"date"
                },
                {
                    title: '商业险',
                    className: "grey",
                    dataIndex: 'blank1',
                    type:"input",
                    placeholder:"请输入商业险"
                },
                {
                    title: '日期',
                    className: "grey",
                    dataIndex: 'blank1',
                    type:"date"
                },
                {
                    title: '商业险',
                    className: "grey",
                    dataIndex: 'blank1',
                    type:"input",
                    placeholder:"请输入商业险"
                },
            ],
            modal:{
                title:"补填",
                visible:false,
                value:"",
                loading:false
            }
        };
        this.colums=[
            {
                title:"序号",
                dataIndex:"1",
                width:"100px"

            },
            {
                title:"投保单号",
                dataIndex:"2",
                width:"100px"

            },
            {
                title:"保单号",
                dataIndex:"3",
                width:"100px"

            },
            {
                title:"账单日期",
                dataIndex:"4",
                width:"100px"

            },
            {
                title:"签单日期",
                dataIndex:"5",
                width:"100px"

            },
            {
                title:"起保日期",
                dataIndex:"6",
                width:"100px"

            },
            {
                title:"终保日期",
                dataIndex:"7",
                width:"100px"

            },
            {
                title:"保险公司",
                dataIndex:"8",
                width:"100px"

            },
            {
                title:"投保人",
                dataIndex:"9",
                width:"100px"

            },
            {
                title:"被保险人",
                dataIndex:"10",
                width:"100px"

            },
            {
                title:"商业险",
                dataIndex:"11",
                width:"100px"

            },
            {
                title:"车船险",
                dataIndex:"12",
                width:"100px"

            },
            {
                title:"交强险",
                dataIndex:"13",
                width:"100px"

            },
            {
                title:"滞纳金",
                dataIndex:"14",
                width:"100px"

            },
            {
                title:"车辆初登日期",
                dataIndex:"15",
                width:"100px"

            },
            {
                title:"车牌号",
                dataIndex:"16",
                width:"100px"

            },
            {
                title:"车型",
                dataIndex:"17",
                width:"100px"

            },
            {
                title:"vin码",
                dataIndex:"18",
                width:"100px"

            },
            {
                title:"发动机号",
                dataIndex:"19",
                width:"100px"

            },
            {
                title:"保单状态",
                dataIndex:"20",
                fixed:"right",
                width:"100px"

            },
            {
                title:"爬取状态",
                dataIndex:"21",
                fixed:"right",
                width:"100px"

            },
            {
                title:"匹配状态",
                dataIndex:"22",
                fixed:"right",
                width:"100px"

            },
            {
                title:"产品名称",
                dataIndex:"23",
                fixed:"right",
                width:"100px"

            },
            {
                title:"操作",
                dataIndex:"24",
                fixed:"right",
                width:"240px",
                render: (text, record) => (
                    <div>
                        <span onClick={this.showModal.bind(this)}>
                            <a>补填</a>
                        </span>
                        <span>
                            <a href="/bus/list/insurance/operate?type=crawling" target="_blank">重爬</a>
                        </span>
                        <span className="ant-divider" />
                        <span>
                            <a href="/bus/list/insurance/operate?type=return" target="_blank">退保</a>
                        </span>
                        <span className="ant-divider" />
                        <span>
                            <a href="/bus/list/insurance/operate?type=payMore" target="_blank">多付</a>
                        </span>
                        <span className="ant-divider" />
                        <span>
                            <a href="/bus/list/insurance/operate?type=buyBack" target="_blank">回购</a>
                        </span>
                        <span className="ant-divider" />
                        <span>
                            <a href="/bus/list/insurance/operate?type=settle" target="_blank">结清</a>
                        </span>
                    </div>
                )
            }
        ];
        this.filter = {
            __OrderId:{
                name:"订单号",
                type:"text",
                placeHolder:"请输入订单号"
            },
            __VinCode:{
                name:"vin码",
                type:"text",
                placeHolder:"请输入vin码"
            },
            __InsurNo:{
                name:"保单号",
                type:"text",
                placeHolder:"请输入保单号"
            },
            time:{
                name:"订单时间",
                type:"range_date",
                feild_s:"__SignTime",
                feild_e:"__SignTime",
                placeHolder:['开始日期',"结束日期"]
            },
            // billNo2:{
            //     name:"保险公司",
            //     type:"select",
            //     values:this.state.companys
            // },
            __CompanyId:{
                name:"保险公司",
                placeHolder:"请选择保险公司",
                type:"select",
                values:JSON.parse(localStorage.getItem("select")).companys_number
                // type:"multi_select",
                // values:'companys'
            },
            __OnlineCondition:{
                name:"线上数据",
                placeHolder:"请选择线上数据",
                type:"select",
                values:[{
                    name:"全部",
                    val:""
                },{
                    name:"存在",
                    val:"存在"
                },{
                    name:"不存在",
                    val:"不存在"
                }]
            },
            __ExcelCondition:{
                name:"线下数据",
                placeHolder:"请选择线下数据",
                type:"select",
                values:[{
                    name:"全部",
                    val:""
                },{
                    name:"存在",
                    val:"存在"
                },{
                    name:"不存在",
                    val:"不存在"
                }]
            },
            __MatchMsgDetail:{
                name:"匹配状态",
                placeHolder:"请选择匹配状态",
                type:"select",
                op:"like",
                values:[{
                    name:"全部",
                    val:""
                },{
                    name:"未匹配",
                    val:"未匹配"
                },{
                    name:"匹配成功",
                    val:"匹配成功"
                },{
                    name:"vin码匹配失败",
                    val:"vin码匹配失败"
                },{
                    name:"金额匹配失败",
                    val:"金额匹配失败"
                },{
                    name:"借贷日期匹配失败",
                    val:"借贷日期匹配失败"
                },{
                    name:"收款信息匹配失败",
                    val:"收款信息匹配失败"
                }]
            },
            __OrderIds:{
                name:"订单号",
                type:"text",
                placeHolder:"请输入订单号"
            },
            __VinCodes:{
                name:"vin码",
                type:"text",
                placeHolder:"请输入vin码"
            },
            __InsurNos:{
                name:"保单号",
                type:"text",
                placeHolder:"请输入保单号"
            }
        }
    }
    getValue(e){
        this.setState({
            modal:{
                title:this.state.modal.title,
                value:e.target.value,
                visible:true
            }
        })
    }
    showModal(){
        this.setState({
            modal:{
                title:this.state.modal.title,
                visible:true,
                value:""
            }
        });
    }
    handleOk(){
        this.setState({
            modal:{
                loading:true,
                title:this.state.modal.title,
                visible:this.state.modal.visible
            }
        });alert(11)
        //setTimeout(()=>{
        //    this.setState({
        //        modal:{
        //            loading:false,
        //            //visible:false
        //        }
        //    });
        //},3000);
        //alert(this.state.modal.value)
    }
    handleCancel(){
        this.setState({
            modal:{
                title:this.state.modal.title,
                visible:false,
                value:""
            }
        });
    }
    render (){
        var footer=[
            <Button key="back" onClick={this.handleCancel.bind(this)}>取消</Button>,
            <Button key="submit" type="primary" loading={this.state.modal.loading} onClick={this.handleOk.bind(this)}>确认</Button>
        ];
        let modal={
            title:this.state.modal.title,
            visible:this.state.modal.visible,
            onOk:this.handleOk.bind(this),
            onCancel:this.handleCancel.bind(this),
            footer:footer
        };
        return (
            <div>
                <Row className="path">
                    <Col span={24}>
                        <span className="f2">业务资料&nbsp;&gt;&nbsp;</span><span className="f2 text-blue">保单管理</span>
                    </Col>
                </Row>
                <Filter data-source={this.filter} />
                <div className="content">
                    <Button type="primary">刷新查询结果</Button>
                    <Button type="primary" style={{marginLeft:"10px"}}>导出查询结果</Button>
                </div>
                <Row className="content">
                    <Table columns={this.colums} dataSource={data} scroll={{x:2500}} bordered />
                </Row>
                <Modal {...modal}>
                    <p>原投保单号：123</p>
                    <p>保险公司：四川</p>
                    <div style={{height:"20px"}}><Col span={4}>补填保单号：</Col><Col span={12}><Input type="text" onChange={this.getValue.bind(this)} value={this.state.modal.value} /></Col></div>
                </Modal>
            </div>

        )
    }
}
export default Insurance;