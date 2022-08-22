import React, { Component } from 'react';
import {Row,Table,Form} from 'antd';
import {axios_sh} from '../../../ajax/request';
import {bank_list} from '../../../ajax/api';
import {format_time,format_table_data} from '../../../ajax/tool';
class Basic extends Component{
    constructor(props) {
        super(props);
        props.onRef(this);
        this.state = {
            bank:[],
            dataSource:[],
            id:props.id
        };
        this.count=1;
        this.dataSource=[]
    }
    componentWillMount(){
        this.getShNo();
        this.columns=[
            {
                title:"序号",
                dataIndex:"key"
            },
            {
                title:"账户名",
                dataIndex:"name"
            },
            {
                title:"账户简称",
                dataIndex:"shortName"
            },
            {
                title:"账号",
                dataIndex:"bankCard"
            },
            {
                title:"省份",
                dataIndex:"province"
            },
            {
                title:"市",
                dataIndex:"city"
            },
            {
                title:"区/县",
                dataIndex:"area"
            },
            {
                title:"开户行",
                dataIndex:"headBank"
            },
            {
                title:"开户行支行",
                dataIndex:"bankName"
            },
            {
                title:"操作",
                render:(data)=>{
                    return <a className="ant-btn ant-btn-denger ant-btn-sm" onClick={()=>{this.del(data)}} >删除</a>
                }
            }
        ];
        this.columns_edit=[
            {
                title:"序号",
                dataIndex:"key"
            },
            {
                title:"新增时间",
                dataIndex:"paySettingCreateTime",
                render:e=>{
                    return e?format_time(e):"-"
                }
            },
            {
                title:"账户名",
                dataIndex:"name"
            },
            {
                title:"账户简称",
                dataIndex:"shortName"
            },
            {
                title:"账号",
                dataIndex:"bankCard"
            },
            {
                title:"省份",
                dataIndex:"province"
            },
            {
                title:"市",
                dataIndex:"city"
            },
            {
                title:"区/县",
                dataIndex:"area"
            },
            {
                title:"开户行",
                dataIndex:"headBank"
            },
            {
                title:"开户行支行",
                dataIndex:"bankName"
            },
            {
                title:"状态",
                dataIndex:"enable",
                render:e=>{
                    if(e===1){
                        return "停用"
                    }else if(e===0){
                        return "正常"
                    }else{
                        return "-"
                    }
                    
                }
            }
        ];
        if(this.state.id){
            //setTimeout(()=>{
                this.editData()
            //},200)

        }
    }
    componentDidMount(){
    }
    
    getShNo(){
        axios_sh.get(bank_list).then(e=>{
            if(!e.code){
                this.setState({
                    bank:e.data
                })
            }
        })
    }
    
    editData(){
        var data=JSON.parse(window.localStorage.getItem("detail"));
        var paySettings=data.paySettings;
        var payArr=[];
        for(var pa in paySettings){
            this.count++;
            // paySettings[pa].key=this.count;
            payArr.push(paySettings[pa]);
        }
        this.dataSource=format_table_data(payArr);
        this.setState({dataSource:format_table_data(payArr)})
    }
    render() {
        return (
            <Row className="sh_add" >
            <Row className="sh_add_card">
                {/* <Row>
                    {/* <Col span={2} style={{paddingRight:'20px',textAlign:'left',fontSize:'14px',color:"#7F8FA4",}}>放款账户</Col> */}
                    
                {/* </Row> */}
                <Row>
                        <Table columns={this.state.id?this.columns_edit:this.columns} dataSource={this.state.dataSource} bordered pagination={false} rowKey="bankCard" />
                </Row>
            </Row>
                

            </Row>

        )

    }
}
export default Form.create()(Basic);