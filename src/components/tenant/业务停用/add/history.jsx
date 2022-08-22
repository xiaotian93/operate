import React, { Component } from 'react';
import {Table} from 'antd';
import {merchant_history} from '../../../ajax/api';
import {axios_sh} from '../../../ajax/request';
import {format_time,format_table_data} from '../../../ajax/tool';
class History extends Component{
    constructor(props) {
        super(props);
        // props.onRef(this);
        this.state = {
            id:props.id,
            data:[] 
        };
    }
    componentWillMount(){
        this.column=[
            {
                title:"版本",
                width:80,
                render:(e)=>{
                    return e.versionStr+(e.isRecent?"(当前)":"")
                }
            },
            {
                title:"操作时间",
                dataIndex:"modifyTime",
                render:e=>{
                    return e?format_time(e):"-"
                }
            },
            {
                title:"操作人",
                dataIndex:"operator"
            },
            {
                title:"操作内容",
                dataIndex:"modifyField"
            },
            {
                title:"旧值",
                dataIndex:"oldValue",
                render:e=>{
                    return e?e:"-"
                }
            },
            {
                title:"新值",
                dataIndex:"newValue",
                render:e=>{
                    return e?e:"-"
                }
            },
        ];
        if(this.state.id){
            axios_sh.get(merchant_history+"?merchantId="+this.state.id).then(e=>{
            this.setState({
                data:format_table_data(e.data)
            })
        })
        }
        
    }
    render(){
        return (
            <div className="sh_add">
            <div className="sh_add_card">
            <Table columns={this.column} dataSource={this.state.data} bordered rowKey="id" />
            </div>
            </div>
        )
    }
}
export default History;