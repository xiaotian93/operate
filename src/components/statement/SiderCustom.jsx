import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
// import { Link } from 'react-router';
import Permissions from '../../templates/Permissions';

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
                    {/* <Menu.Item key={"/bb/condition"}>
                    <Permissions server={global.AUTHSERVER.statement.key} tag="link" to={'/bb/condition'}><span>放贷情况表</span></Permissions> */}

                        {/* <Link to={'/bb/condition'}><span>放贷情况表</span></Link> */}
                    {/* </Menu.Item>
                    <Menu.Item key={"/bb/structure"}>
                    <Permissions server={global.AUTHSERVER.statement.key} tag="link" to={'/bb/structure'}><span>业务结构表</span></Permissions> */}

                        {/* <Link to={'/bb/structure'}><span>业务结构表</span></Link> */}
                    {/* </Menu.Item> */}
                    {/* <SubMenu key={'/bb/structure'} title={<span>业务结构表</span>}>
                        <Menu.Item key={"/bb/structure/bulk"}>
                            <Link to={'/bb/structure/bulk'}><span>借款主体性质划分</span></Link>
                        </Menu.Item>
                        <Menu.Item key={"/bb/structure/amount"}>
                            <Link to={'/bb/structure/amount'}><span>借款额度划分</span></Link>
                        </Menu.Item>
                        <Menu.Item key={"/bb/structure/rate"}>
                            <Link to={'/bb/structure/rate'}><span>借款利率划分</span></Link>
                        </Menu.Item>
                        <Menu.Item key={"/bb/structure/period"}>
                            <Link to={'/bb/structure/period'}><span>借款期限划分</span></Link>
                        </Menu.Item>
                        <Menu.Item key={"/bb/structure/industry"}>
                            <Link to={'/bb/structure/industry'}><span>借款行业类型划分</span></Link>
                        </Menu.Item>
                        <Menu.Item key={"/bb/structure/form"}>
                            <Link to={'/bb/structure/form'}><span>借贷形态划分</span></Link>
                        </Menu.Item>
                        <Menu.Item key={"/bb/structure/guarantee"}>
                            <Link to={'/bb/structure/guarantee'}><span>担保方式划分</span></Link>
                        </Menu.Item>
                    </SubMenu> */}
                </Menu>
            </Sider>
        )
    }
}

export default SiderCustom;