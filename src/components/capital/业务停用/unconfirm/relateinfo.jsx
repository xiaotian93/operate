import React , { Component } from 'react';
import { Table , Row , Col} from 'antd';

class RelateInfo extends Component{
    constructor(props){
        super(props);
        this.state = {
            type:props["data-source"].basic.group,
            source_repay:props["data-source"].repaymentRelatedAccountList||[],
            source_bzj:props["data-source"].bzjRelatedAccountList||[]
        }
    }
    componentWillMount(){
        this.columns_repay = [
            {
                title:"还款方",
                dataIndex:"repayee"
            },
            {
                title:"偿还成份",
                dataIndex:"elementList",
                render:data=>{
                    return data.join("、")
                }
            }
        ]
        this.columns_bzj = [
            {
                title:"请求类型",
                dataIndex:"type"
            },
            {
                title:"保证金种类",
                dataIndex:"bzjType"
            },
            {
                title:"交易方账户名",
                dataIndex:"accountName"
            }
        ]
    }
    componentDidMount(){

    }
    render(){
        const table_props_repay = {
            columns:this.columns_repay ,
            rowKey:"repayee",
            dataSource:this.state.source_repay,
            pagination : false
        }
        const table_props_bzj = {
            columns:this.columns_bzj ,
            rowKey:"type",
            dataSource:this.state.source_bzj,
            pagination : false
        }

        let table_map = {
            "repayment":<Table {...table_props_repay} bordered />,
            "bzj":(<Table {...table_props_bzj} bordered />)
        }
        if(!table_map[this.state.type]){
            return <span />
        }
        return (
            <Row>
                <h3 className="sub-title">关联账户信息</h3>
                <Col span={10}>
                    { table_map[this.state.type] }
                </Col>
            </Row>
        );
    }
}

export default RelateInfo;