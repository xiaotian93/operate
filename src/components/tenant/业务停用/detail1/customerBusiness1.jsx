import React, { Component } from 'react';
import {Row,Col,Form,Modal,Table} from 'antd';
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
                title:"企业名称",
                dataIndex:"name"
            }
        ];
        this.bussiness=[
            {
                title:"序号",
                dataIndex:"key"
            },
            {
                title:"企业ID",
                dataIndex:"id"
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
                this.dataSource=format_table_data(e.data)
            }
        })
    }
    del(data){
        console.log(this.state.dataSource.filter(todo=>todo.key!==data.key))
        this.setState({
            dataSource:this.state.dataSource.filter(todo=>todo.key!==data.key)
        });
    }
    add(){
        this.setState({visible:true})
    }
    cancel(){
        this.setState({visible:false})
    }
    onSelectChange(selectedRowKeys,selectedRow) {
        console.log('selectedRowKeys changed: ', selectedRow);
        this.setState({ data:selectedRow,selectedRowKeys:selectedRowKeys});
    }
    change(){
        this.setState({visible:false})
        this.setState({ dataSource:this.state.data });
    }
    editData(){
        var data=JSON.parse(window.localStorage.getItem("detail"));
        var customerBusinessIds=data.basic.customerBusinessIds;
        var dataArr=[],keyArr=[];
        for(var i in customerBusinessIds){
            for(var j in this.dataSource){
                if(Number(customerBusinessIds[i])===Number(this.dataSource[j].id)){
                    dataArr.push(this.dataSource[j]);
                    keyArr.push(this.dataSource[j].key);
                }
            }

        }
        this.setState({dataSource:dataArr,selectedRowKeys:keyArr})
    }
    render() {
        //console.log(this.state.selectedRowKeys)
        const modalInfo={
            visible:this.state.visible,
            title:"添加关联企业",
            onCancel:this.cancel.bind(this),
            onOk:this.change.bind(this)
        };
        const table_bus={
            rowSelection:{
                onChange:this.onSelectChange.bind(this),
                selectedRowKeys:this.state.selectedRowKeys
            },
            columns:this.bussiness,
            dataSource:this.dataSource,
            pagination:false
        }
        return (
            <Row className="sh_add" >
                <Row>
                    <Col span={4} style={{paddingRight:'20px',textAlign:'right',fontSize:'14px',color:"#7F8FA4"}}>关联企业:</Col>
                    <Col span={20}>
                        <Row>
                            <Col span={8}>
                                <Table columns={this.columns} dataSource={this.state.dataSource} bordered pagination={false} />
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Modal {...modalInfo} >
                    <Table {...table_bus} bordered />
                </Modal>

            </Row>

        )

    }
}
export default Form.create()(Basic);