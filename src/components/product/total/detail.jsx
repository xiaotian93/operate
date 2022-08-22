import React, { Component } from 'react';
import { Form, Button,Tabs,Row ,Table} from 'antd';
import { loan_manage_childList} from '../../../ajax/api';
import { axios_loan } from '../../../ajax/request';
import ComponentRoute from '../../../templates/ComponentRoute';
import Parent from './product_parent';
import { browserHistory } from 'react-router';
const TabPane = Tabs.TabPane;
class Product_cxfq extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productId: props.location.query.code,
            id: props.location.query.id,
            child:[]
        };
    }
    componentWillMount() {
        this.childList()
        this.columns=[
            {
                title:"序号",
                render:(text,rec,index)=>index+1
            },
            {
                title:"在用商户ID",
                dataIndex:"cooperatorNo",
                render:e=>e||"--"
            },
            {
                title:"在用商户",
                dataIndex:"cooperator"
            },
            {
                title:"在用项目",
                dataIndex:"appName"
            },
            {
                title:"子产品编号",
                dataIndex:"configNo"
            },
            {
                title:"子产品创建时间",
                dataIndex:"createTime"
            },
            {
                title:"子产品最近操作时间",
                dataIndex:"updateTime"
            },
            {
                title:"子产品状态",
                // dataIndex:"status",
                render:e=>{
                    return <span className={!e.status?"text-danger":""}>{!e.status?"已停用":"已启用"}</span>

                }
            },
            {
                title:"操作",
                render:e=>{
                    return <Button type="primary" size="small" onClick={()=>{this.detail(e)}}>查看</Button>
                }
            }
        ]
    }
    detail(data){
        browserHistory.push("/cp/project/list/product/detail?configNo="+data.configNo+"&productCode="+data.productCode+"&appKey="+data.appKey+"&cooperator="+data.cooperator+"&appName="+data.appName)
    }
    //子产品列表
    childList(){
        axios_loan.post(loan_manage_childList,{productId:this.state.id}).then(e=>{
            if(!e.code){
                    this.setState({
                        child:e.data
                    })
            }
        })
    }
    
    render() {
        // let paths = ["产品管理1"];
        // if (this.state.productId) {
        //     paths.push("产品编辑");
        // } else {
        //     paths.push("产品添加");
        // }
        const tableInfo={
            columns:this.columns,
            dataSource:this.state.child,
            pagination:false,
            bordered:true,
            rowKey:"configNo"
        }
        return (
            <div className="content bmd">
                <Tabs defaultActiveKey="1" className="sh_tab">
                    <TabPane tab="主产品" key="1">
                        <Parent productId={this.state.productId} />
                    </TabPane>
                    <TabPane tab="子产品" key="2">
                        <Row style={{background:"#fff"}}>
                            <Row className="content">
                                <Table {...tableInfo} />
                            </Row>

                        </Row>
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}
export default ComponentRoute(Form.create()(Product_cxfq));