import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router';
const { Sider } = Layout;

class SiderCustom extends Component {
    constructor(props){
        super(props);
        let keys = document.location.pathname;
        let openKeys = keys.split("/").splice(0,3);
        keys = keys.split("/").splice(0,4);
        this.state = {
            collapsed:true,
            selectKeys:[keys.join('/')],
            openKeys:[openKeys.join("/")]
        };
    }
    onOpenChange(openKeys){
        if(openKeys.length>1){
            openKeys.shift();
        }
        this.setState({
            openKeys
        });
    }
    onSelect(data){
        let keys = data.key.split("/");
        let openKeys = keys.splice(0,3);
        this.setState({
            openKeys:[openKeys.join("/")]
        })
    }
    render() {
        return (
            <Sider>
                <Menu defaultSelectedKeys={this.state.selectKeys} onOpenChange={this.onOpenChange.bind(this)} openKeys={this.state.openKeys} onSelect={this.onSelect.bind(this)} onClick={this.handleClick} mode="inline" theme="dark">
                    <Menu.Item key={'/doc/viewer'}>
                        <Link to={'/doc/viewer'}><span>图片查看器</span></Link>
                    </Menu.Item>
                    {/* <Menu.Item key={'/doc/result'}>
                        <Link to={'/doc/result'}><span>支付结果查询</span></Link>
                    </Menu.Item> */}
                    
                </Menu>
            </Sider>
        )
    }
}

export default SiderCustom;