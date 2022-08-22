import React, { Component } from 'react';
import { Button, message, Icon } from 'antd';
import { Link } from 'react-router';

import { bmd } from '../ajax/tool';

class Permissions extends Component {
    constructor(props) {
        super(props);
        let server = props["server"];
        let pms = props["permissions"];
        let role = props["roleKey"];
        this.state = {
            allow: true,
            msg: ""
        };
        // 角色验证
        if (role) {
            this.state = {
                allow: this.hasRoles(server, role).allow,
                msg: this.hasRoles(server, role).msg
            };
            return;
        }

        // 权限验证
        if (server) {
            pms = pms ? pms : "default";
            this.state = {
                allow: this.hasPermissions(server, pms).allow,
                msg: this.hasPermissions(server, pms).msg
            };
        }
    }
    // 识别是否有权限
    hasPermissions(server, pms) {
        let permissions = JSON.parse(localStorage.getItem("permissions")) || [];
        let res = { allow: false, msg: "" };
        let permission = [];

        permissions.forEach(item => {
            if (item.applicationKey === server) {
                permission = item;
            }
        });
        // 判断是否拥有权限
        let perm = {};
        for (let p in permission.permissionList) {
            if (permission.permissionList[p].key === pms) {
                perm = permission.permissionList[p];
            }
        }
        if (perm.hasPermission) {
            res.allow = true;
        } else {
            if (perm.name) {
                var text = "";
                if (perm.name && perm.name.indexOf("权限") === -1) {
                    text = "权限";
                }
                res = { allow: false, msg: `缺少${permission.applicationName}的${perm.name}${text}` }
            } else {
                res = { allow: false, msg: `缺少${permission.applicationName}的默认权限` }
            }
        }
        return res;
    }

    // 识别是否有角色
    hasRoles(server, roleKey) {
        let permissions = JSON.parse(localStorage.getItem("permissions")) || [];
        let res = { allow: false, msg: "" };
        let permission = [];

        permissions.forEach(item => {
            if (item.applicationKey === server) {
                permission = item;
            }
        });
        // 判断是否拥有权限
        let role = {};
        for (let p in permission.roleList) {
            if (permission.roleList[p].key === roleKey) {
                role = permission.roleList[p];
            }
        }
        if (role.hasRole) {
            res.allow = true;
        } else {
            res = { allow: false, msg: `缺少${permission.applicationName}的${role.name}` }
            // res = { allow:false,msg:`缺少${permission.applicationName}的${role.name}，applicationKey：${permission.applicationKey}，Key:${role.key}` }
        }
        return res;
    }

    // 标签动作
    linkAction(e) {
        if (this.state.allow) {
            if (this.props["to"]) {
                bmd.redirect(this.props["to"]);
            }
            if (this.props["onClick"]) {
                this.props["onClick"](e);
            }
            return;
        }
        e.stopPropagation();
        message.warn(this.state.msg);
    }

    // 按钮动作
    btnAction(e) {
        // let server = this.props["server"];
        // let pms = this.props["permissions"]||"default";
        // this.hasPermissions(server,pms);
        if (this.state.allow) {
            this.props["onClick"](e);
            return;
        }
        e.stopPropagation();
        message.warn(this.state.msg);
    }
    default(e) {
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            window.event.returnValue = false;
        }
    }
    render() {
        let type = this.props["tag"];
        // 链接
        if (type === "link") {
            return (
                <Link onClick={this.linkAction.bind(this)} className={this.state.allow ? "" : "noPermissinons"}>
                    {this.props.children}
                </Link>
            )
        }
        if (type === "button") {
            let props = JSON.parse(JSON.stringify(this.props));
            delete props.onClick;
            delete props.roleKey;
            delete props.permissions;
            delete props.server;
            delete props.tag;
            props.className = props.className || "";
            props.className += (this.state.allow ? "" : "disabled");
            return (
                this.props.children === "查看" && props.className.indexOf("disabled") === -1 ? <a href={props.src || ""} onClick={(e) => { this.default(e) }} className={props.className} >
                    <Button {...props} className={props.className} onClick={this.btnAction.bind(this)}>
                        {this.props.children}
                    </Button>
                </a> : <Button {...props} className={props.className} onClick={this.btnAction.bind(this)}>
                    {this.props.children}
                </Button>
            )
        }
        if (type === "icon") {
            return <Icon type="phone" style={{ fontSize: 16, color: "#1B84FF", cursor: "pointer" }} className={this.state.allow ? "" : "noPermissinons"} onClick={this.btnAction.bind(this)} />
        }
        const Element = type;
        delete Element.tag;
        return (
            <Element {...this.props}>
                {this.props.children}
            </Element>
        )
    }
}
Permissions.defaultProps = {
    onClick: () => { },
    tag: "button"
}
export default Permissions;