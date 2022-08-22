import React, { Component } from 'react';
import {Row,Button,Col,Form,Modal,Table} from 'antd';
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
            selectedRowKeys:[],
            changData:[]
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
            },
            {
                title:"操作",
                render:(data)=>{
                    return <Button type="danger" size="small" onClick={()=>{this.del(data)}} >删除</Button>
                }
            }
        ];
        this.bussiness=[
            {
                title:"序号",
                width:"50px",
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
    detail(id){
        window.open('/kh/company/detail?id='+id);
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
    del(data){
        var selectKeys=this.state.dataSource;
        var selectArr=[];
        for(var i in selectKeys){
            selectArr.push(selectKeys[i].key);
        }
        this.setState({
            dataSource:format_table_data(this.state.dataSource.filter(todo=>todo.key!==data.key)),
            selectedRowKeys:selectArr
        });
    }
    add(){
        var selectKeys=this.state.dataSource;
        var selectArr=[];
        for(var i in selectKeys){
            selectArr.push(selectKeys[i].key);
        }
        this.setState({visible:true,selectedRowKeys:selectArr})
    }
    cancel(){
        this.setState({visible:false})
    }
    onSelectChange(selectedRowKeys,selectedRow) {
        console.log('selectedRowKeys changed: ', selectedRow,selectedRowKeys);
        this.setState({ data:selectedRow,selectedRowKeys:selectedRowKeys});
    }
    change(){
        this.setState({visible:false});
        this.setState({ dataSource:format_table_data(this.state.data) });
    }
    editData(){
        // this.getShNo();
        
        var data=JSON.parse(window.localStorage.getItem("detail"));
        var cus=JSON.parse(window.localStorage.getItem("customer_business"));
        var customerBusinessIds=data.basic.customerBusinessIds;
        var dataArr=[],keyArr=[];
        for(var i in customerBusinessIds){
                    for(var j in cus){
                        if(Number(customerBusinessIds[i])===Number(cus[j].id)){
                            dataArr.push(cus[j]);
                            keyArr.push(Number(cus[j].key));
                        }
                    }
        
        }
            
        this.setState({dataSource:format_table_data(dataArr),selectedRowKeys:keyArr})
    }
    render() {
        //console.log(this.state.selectedRowKeys)
        var heights=document.body.clientHeight-260;
        const modalInfo={
            visible:this.state.visible,
            title:"新增关联企业",
            maskClosable:false,
            onCancel:this.cancel.bind(this),
            onOk:this.change.bind(this),
            bodyStyle:{
                width:"750px",
                height:heights,
                overflowY:"auto"
            },
            width:750
        };
        const table_bus={
            rowSelection:{
                onChange:this.onSelectChange.bind(this),
                selectedRowKeys:this.state.selectedRowKeys
            },
            columns:this.bussiness,
            dataSource:this.state.changData,
            pagination:false
        }
        return (
            <Row className="sh_add" >
            <div className="sh_add_card">
                <Row>
                    {/* <Col span={2} style={{paddingRight:'20px',textAlign:'left',fontSize:'14px',color:"#7F8FA4"}}>关联企业</Col> */}
                    <Col span={20}>
                        <Button type="primary" onClick={this.add.bind(this)} >新增关联企业</Button>
                    </Col>
                </Row>
                <Row style={{marginTop:"20px"}}>
                    <Col span={20}>
                        <Table columns={this.columns} dataSource={this.state.dataSource} bordered pagination={false} />
                    </Col>
                </Row>
            </div>
                
                <Modal {...modalInfo} >
                    <Table {...table_bus} bordered />
                </Modal>

            </Row>

        )

    }
}
export default Form.create()(Basic);