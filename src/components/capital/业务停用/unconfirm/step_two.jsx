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
            source:[],
            source_view:[]
        }
        props["main_bind"](this);
    }
    componentWillMount(){
        this.column = [
            {
                title:"请求类型",
                dataIndex:"subGroupStr"
            },
            {
                title:"状态",
                dataIndex:"statusStr"
            },
            {
                title:"请求金额",
                dataIndex:"amount",
                render:data=>{
                    return data.money();
                }
            },
            {
                title:"已确认金额",
                render:data=>{
                    let money = data.confirm?data.confirm.money():"0.00";
                    let money_map = {
                        "0":<span className="text-danger">{money}</span>,
                        "-1":<span>{money}</span>,
                        "1":<span className="text-success">{data.amount.money()}</span>,
                        "2":<span className="text-success">{money}</span>
                    }
                    return money_map[data.status]||money
                }
            }
        ]
    }
    componentDidMount(){

    }
    init_data(){
        this.setState({
            selectedRows:[],
            selectedRowKeys:[],
            source_view:JSON.parse(JSON.stringify(this.state.source))
        })
    }
    render(){
        let rowSelection = {
            selectedRows:this.state.selectedRows,
            selectedRowKeys:this.state.selectedRowKeys,
            type:this.state.element===1?"radio":"checkbox",
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    // selectedRows,
                    selectedRowKeys
                })
                this.props.select(selectedRowKeys,selectedRows);
            },
            getCheckboxProps: record => ({
                disabled: record.status === 1||record.status === '-1'
            }),
        }
        let table_props = {
            rowKey:"subGroup",
            dataSource:this.state.source_view,
            columns:this.column,
            rowSelection:rowSelection,
            pagination:false,
            rowClassName:data=>{
                return (data.select?"bg-warn":"")
            }
        }
        return (
            <Row>
                <div className="sub-title">第二步:本次需要确认的成份</div>
                <Col span={24}>
                    <Table {...table_props} bordered />
                </Col>
            </Row>
        );
    }
}

export default Step;