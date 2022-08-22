import React , { Component } from 'react';
import { Row , Col , Table } from 'antd';

// import { format_table_data } from './../../../ajax/tool';
class Step extends Component{
    constructor(props){
        super(props);
        this.state = {
            element:1,
            selectedRows:[],
            selectedRowKeys:[],
            source:[]
        }
        props["main_bind"](this);
    }
    componentWillMount(){
        this.column = [
            {
                title:"账户主体",
                dataIndex:"accountName"
            },
            {
                title:"科目名称",
                dataIndex:"groupName"
            }
            // {
            //     title:"金额",
            //     dataIndex:"amount",
            //     render:data=>{
            //         return data.money()
            //     }
            // }
        ]
    }
    componentDidMount(){
        
    }
    onChange(e){
        this.setState({
            element:e.target.value
        })
    }
    init_data(){
        this.setState({
            selectedRows:[],
            selectedRowKeys:[]
        })
    }
    render(){
        let rowSelection = {
            selectedRows:this.state.selectedRows,
            selectedRowKeys:this.state.selectedRowKeys,
            type:this.state.element===1?"checkbox":"radio",
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRows,
                    selectedRowKeys
                });
                this.props.select(selectedRows);
            },
            getCheckboxProps: record => ({
                // disabled: record.status === '1'||record.status === '-1'
            }),
        }
        let table_props = {
            rowKey:"accountId",
            dataSource:this.state.source,
            columns:this.column,
            rowSelection:rowSelection,
            pagination:false,
            rowClassName:data=>{
                return (data.select?"bg-warn":"")
            }
        }
        return (
            <Row style={{marginTop:"20px"}}>
                <div className="sub-title">第三步:选择资金账户确认</div>
                <Col span={24}>
                    <Table {...table_props} bordered />
                </Col>
            </Row>
        );
    }
}

export default Step;