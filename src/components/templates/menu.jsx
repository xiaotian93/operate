import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
import Permissions from '../../templates/Permissions';
const { Sider } = Layout;
const SubMenu = Menu.SubMenu;
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
        console.log(openKeys.join("/"))
    }
    render() {
        var data=this.props.data;
        let keys = document.location.pathname
        keys = this.props.setRouter?keys.split("/").splice(0,3).join("/"):keys.split("/").splice(0,4).join("/");
        var heights=window.innerHeight-170;
        return (
            <Sider className="sideMenu">
                <Menu defaultSelectedKeys={[keys]} onOpenChange={this.onOpenChange.bind(this)} openKeys={this.state.openKeys} onSelect={this.onSelect.bind(this)} mode="inline" selectedKeys={[keys]} style={{marginTop:"10px",height:heights+"px",overflowY:"auto",overflowX:"hidden"}}>
                        {
                            data.map((i,k)=>{
                                var child=i.child,arr=[];
                                child.map((j,m)=>{
                                    arr.push(
                                        <Menu.Item key={j.router}>
                                        <Permissions server={j.server} permissions={j.permissions||"default"} tag="link" to={j.router}><span>{j.title}</span></Permissions>
                                        </Menu.Item>
                                    )
                                    return true
                                })
                                if(i.title){
                                    return <SubMenu key={i.router} title={<span>{i.title}</span>}>
                                        {arr}
                                    </SubMenu>
                                    
                                }else{
                                    return arr
                                }
                            })
                        }
                </Menu>
            </Sider>
        )
    }
}

export default SiderCustom;