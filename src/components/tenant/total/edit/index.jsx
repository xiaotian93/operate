import React, { Component } from 'react';
import {Row,Tabs,Button} from 'antd';
import Detail from './detail';
import Contract from './contract';
// import { browserHistory } from 'react-router';
const TabPane = Tabs.TabPane;

class Edit extends Component{
    constructor(props) {
        super(props);
        this.state = {
            edit:props.location.query.edit,
            accountId:props.location.query.accountId,
            id:props.location.query.id
        };
        this.productArr=[];
        this.productNew=[]
    }
    componentDidMount(){
        
    }
    edit(){
        window.location.href="/sh/total/edit?accountId="+this.state.accountId+"&edit=true&id="+this.state.id
    }
    render(){
        return (
            <div>
                <Row className="content" style={{marginBottom:"40px"}} >
                <Tabs defaultActiveKey={this.state.edit==="true"?"2":"1"} className="sh_tab">
                    <TabPane tab="基础信息" key="1">
                        {this.state.edit==="true"?"基本信息只能由商户在开放平台进行编辑":<Detail accountId={this.state.accountId} />}
                    </TabPane>
                    <TabPane tab="合同协议" key="2">
                        <Contract id={this.state.id} edit={this.state.edit} />
                    </TabPane>
                </Tabs>
                {this.state.edit==="true"?null:<Row className="" style={{textAlign:"center"}}>
                        <Button onClick={this.edit.bind(this)} type="primary">编辑</Button>
                    </Row>}
                </Row>
            </div>
        )
    }
}
export default Edit