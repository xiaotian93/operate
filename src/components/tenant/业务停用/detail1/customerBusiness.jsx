import React, { Component } from 'react';
import {Row,Col,Form,Table} from 'antd';
import {axios_sh} from '../../../ajax/request';
import {customer_business} from '../../../ajax/api';
import {format_table_data} from '../../../ajax/tool';

class Basic extends Component{
    constructor(props) {
        super(props);
        props.onRef(this);
        this.state = {
            visible:false,
            bank:[],
            dataSource:[],
            bussiness:[],
            data:[],
            id:props.id,
            selectedRowKeys:[]
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
            // {
            //     title:"新增时间",
            //     dataIndex:"createTime"
            // },
            {
                title:"企业ID",
                dataIndex:"qyNo"
            },
            {
                title:"企业名称",
                render:(e)=>{
                    return <div style={{color:"#1B84FF",cursor:"pointer"}} onClick={()=>{this.detail(e.id)}}>{e.name}</div>
                }
            }
        ];
        this.bussiness=[
            {
                title:"序号",
                width:"40px",
                dataIndex:"key"
            },
            {
                title:"企业ID",
                dataIndex:"qyNo"
            },
            {
                title:"企业名称",
                dataIndex:"name"
            },
            {
                title:"企业规模",
                dataIndex:"scale"
            },
            {
                title:"行业性质",
                dataIndex:"industry"
            }
        ];
        if(this.state.id){
            setTimeout(()=>{
                this.editData();
            },300)
        }
    }
    getShNo(){
        axios_sh.get(customer_business).then(e=>{
            if(!e.code){
                // this.dataSource=format_table_data(e.data)
                this.setState({
                    changData:format_table_data(e.data)
                })
            }
        })
    }
    detail(id){
        window.open('/kh/company/detail?id='+id);
    }
    editData(){
        // this.getShNo();
        var data=JSON.parse(window.localStorage.getItem("detail"));
        var customerBusinessIds=data.basic.customerBusinessIds;
        var dataArr=[],keyArr=[];
        // for(var i in customerBusinessIds){
        //     for(var j in this.dataSource){
        //         if(Number(customerBusinessIds[i])===Number(this.dataSource[j].id)){
        //             dataArr.push(this.dataSource[j]);
        //             keyArr.push(Number(this.dataSource[j].key));
        //         }
        //     }

        // }
        axios_sh.get(customer_business).then(e=>{
            if(!e.code){
                var data=format_table_data(e.data);
                for(var i in customerBusinessIds){
                    for(var j in data){
                        if(Number(customerBusinessIds[i])===Number(data[j].id)){
                            dataArr.push(data[j]);
                            keyArr.push(Number(data[j].key));
                        }
                    }
        
                }
            }
        })
        this.setState({dataSource:dataArr,selectedRowKeys:keyArr})
    }
    render() {
        //console.log(this.state.selectedRowKeys)
        
        return (
            <Row className="sh_add" >
            <div className="sh_add_card">
                {/* <Row>
                    <Col span={2} style={{paddingRight:'20px',textAlign:'left',fontSize:'14px',color:"#7F8FA4"}}>关联企业</Col>
                    
                </Row> */}
                <Row>
                    <Col span={20}>
                        <Table columns={this.columns} dataSource={this.state.dataSource} bordered pagination={false} />
                    </Col>
                </Row>
            </div>
                
                

            </Row>

        )

    }
}
export default Form.create()(Basic);