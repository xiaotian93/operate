import React, { Component } from 'react';
import {Button} from 'antd';
import Dynamic from "../addTemplate/add";
class Business extends Component {
    constructor(props) {
        super(props);
        props.onref(this);
    }
    user(e) {
        this.user_child = e;
    }
    add() {
        this.user_child.add();
    }
    get_val(){
        var val={
            labelInfoList:this.user_child.handleSubmit(),
            delLabelIdList:this.user_child.delId
        }
        return val
    }
    render() {
        return (
            <div className="sh_add_card">
            <div className="sh_inner_box">
                <span className="sh_add_title">用户群配置</span>
                <Button type="primary" onClick={this.add.bind(this)} style={{ marginLeft: "20px" }} icon="plus" size="small">新增用户群</Button>
                <Dynamic onRef={this.user.bind(this)} type="user" phase={this.props.phase} unit={this.props.unit} service={this.props.service} rate={this.props.rate} user_data={this.props.user_data} configNo={this.props.configNo} user_key={this.props.user_key} isAdd={this.props.isAdd} calRateType={this.props.calRateType} />
                {/* periodUnit={this.state.periodUnit_type} tag={this.state.tagArr} id={this.state.id} user_key={this.state.userEdit} user_data={this.state.userArr} */}
            </div>
        </div>
        )
    }

}
export default Business
