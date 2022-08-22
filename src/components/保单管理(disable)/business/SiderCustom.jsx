import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router';
const { Sider } = Layout;
// const SubMenu = Menu.SubMenu;

class SiderCustom extends Component {
    constructor(props){
        super(props);
        let keys = document.location.pathname
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
                    <Menu.Item key={"/bus/list/insurance"}>
                        <Link to={'/bus/list/insurance'}><span className="nav-text">保单管理</span></Link>
                    </Menu.Item>

                </Menu>
            </Sider>
        )
    }
}

export default SiderCustom;