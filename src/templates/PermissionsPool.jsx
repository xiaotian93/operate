// <Card server="title" flod="true">
import React, { Component } from 'react';
import { message } from 'antd';
import { Link } from 'react-router';
// import axios from '../ajax/request';

import { bmd } from '../ajax/tool';

class PermissionPool extends Component{
    constructor(props) {
        super(props);
        this.power = props["powers"];
    }   

    // 识别是否有权限
    hasPermissions(server,pms){
        let permissions = JSON.parse(localStorage.getItem("permissions"))||[];
        let permission = {};
        permissions.forEach(item => {
            if(item.applicationKey===server){
                permission = item;
            }
        });
        // 判断是否拥有权限
        for(let p in permission.permissionList){
            if(permission.permissionList[p].key===pms){
                permission.permissionList[p].applicationName = permission.applicationName;
                return permission.permissionList[p]
            }
        }
        return {hasPermission:false,name:""};
    }

    // 识别是否有角色
    hasRoles(server,roleKey){
        let permissions = JSON.parse(localStorage.getItem("permissions"))||[];
        let permission = [];
        permissions.forEach(item => {
            if(item.applicationKey===server){
                permission = item;
            }
        });
        // 判断是否拥有权限
        for(let p in permission.roleList){
            if(permission.roleList[p].key===roleKey){
                permission.roleList[p].applicationName = permission.applicationName;
                return permission.roleList[p]
            }
        }
        return {hasRole:false,name:""};
    }

    // 标签动作
    linkAction(e){
        // [{server:"bmd-chexianfenqi",access:"default",role:"admin"}]
        e.stopPropagation();
        let accessNames = [];
        for(let p in this.power){
            let power = this.power[p];
            if(!power.server){
                bmd.redirect(this.props["to"]+power.to)
                return;
            }
            let role = this.hasRoles(power.server,power.role);
            if(power.role&&role.hasRole){
                bmd.redirect(this.props["to"]+power.to)
                return;
            }else{
                role.name&&accessNames.push(role.applicationName+role.name);
            }
            power.access = power.access?power.access:"default";
            let access = this.hasPermissions(power.server,power.access);
            if(access.hasPermission){
                bmd.redirect(this.props["to"]+power.to);
                return;
            }else{
                access.name&&accessNames.push(access.applicationName+access.name);
            }
        }
        message.warn("暂无"+accessNames.join(","));
    }

    render (){
        return (
            <Link onClick={this.linkAction.bind(this)}>
                { this.props.children }
            </Link>
        )
    }
}

export default PermissionPool;