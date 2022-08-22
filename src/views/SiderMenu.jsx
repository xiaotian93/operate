import React from 'react';
import { Layout, Menu } from 'antd';
import Permissions from '../templates/Permissions';
import UIConfig from '../config/ui';
const { Sider } = Layout;
const SubMenu = Menu.SubMenu;

const SiderMenu = ({ defaultSelectedKey, defaultOpenKey ,menuData = [],keyLength }) => {
    const style = { marginTop: "10px", height: window.innerHeight - UIConfig.navHeight + "px", overflowY: "auto", overflowX: "hidden" };
    const renderMenu = data => data.map(item => {
        if (item.children && item.children.length > 0) {
            return <SubMenu title={item.title} key={item.router}>
                {renderMenu(item.children)}
            </SubMenu>
        }
        return <Menu.Item key={item.router}>
            <Permissions server={item.server} permissions={item.permissions || "default"} tag="link" to={item.router}><span>{item.title}</span></Permissions>
        </Menu.Item>
    })
    defaultSelectedKey = defaultSelectedKey.split("/").slice(0,keyLength).join("/");
    defaultOpenKey = defaultOpenKey||defaultSelectedKey.split("/").slice(0, keyLength-1).join("/")
    return <Sider className="sideMenu">
        <Menu defaultSelectedKeys={[defaultSelectedKey]} defaultOpenKeys={[defaultOpenKey]} mode="inline" style={style} >
            {renderMenu(menuData)}
        </Menu>
    </Sider>
}
SiderMenu.defaultProps = {
    keyLength:4
}
export default SiderMenu;