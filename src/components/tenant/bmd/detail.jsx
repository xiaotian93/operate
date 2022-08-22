import React, { Component } from 'react';
import { Tabs ,Table} from 'antd';
// import Filter from '../../ui/Filter_obj8';
import ComponentRoute from '../../../templates/ComponentRoute';
import Product from './detail_product';
import {xjd_product_operating_record} from '../../../ajax/api';
import { axios_xjd } from '../../../ajax/request';
const { TabPane } = Tabs;
class Product_cxfq extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.location.query.id,
            data:[]
        };
    }
    componentWillMount() {
        this.colums=[
            {
                title:"版本",
                dataIndex:"version",
                render:e=>("V"+e)
            },
            {
                title:"操作时间",
                dataIndex:"operatingTime"
            },
            {
                title:"操作人",
                dataIndex:"operator"
            },
            {
                title:"操作内容",
                render:e=>{
                    var data=e.contentList;
                    var temp=[]
                    for(var i in data){
                        temp.push(<div>{data[i]}</div>)
                    }
                    return temp;
                }
            },
        ]
        this.operating();
    }
    operating(){
        axios_xjd.post(xjd_product_operating_record,{code:this.state.id}).then(e=>{
            if(!e.code){
                this.setState({
                    data:e.data
                })
            }
        })
    }
    render() {
        return (
            <div className="content">
                <Tabs defaultActiveKey="1" className="sh_tab">
                    <TabPane tab="产品信息" key="1">
                        <Product id={this.state.id} />
                    </TabPane>
                    <TabPane tab="操作记录" key="2">
                        <div className="content" style={{background:"#fff"}}>
                            <Table columns={this.colums} bordered dataSource={this.state.data} pagination={false} rowKey="version" />
                        </div>
                    </TabPane>
                </Tabs>
            </div>

        )
    }
}
export default ComponentRoute(Product_cxfq);