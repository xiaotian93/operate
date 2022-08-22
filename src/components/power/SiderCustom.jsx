import React, { Component } from 'react';
import MenuTem from '../templates/menu';


class SiderCustom extends Component {
    componentWillMount(){
        this.data=[
            {
                child:[
                    {
                        title:"人员管理",
                        router:"/power/user/list",
                        server:global.AUTHSERVER.login.key,
                        permissions:global.AUTHSERVER.login.access.operate_admin
                    },
                    
                ]
            },
            {
                title:"权限管理",
                router:"/power/manage",
                child:[
                    {
                        title:"角色管理",
                        router:"/power/manage/role",
                        // server:global.AUTHSERVER.login.key,
                        // permissions:global.AUTHSERVER.login.access.operate_admin
                    },
                    {
                        title:"权限分配",
                        router:"/power/manage/assign",
                        // server:global.AUTHSERVER.login.key,
                        // permissions:global.AUTHSERVER.login.access.operate_admin
                    },
                    {
                        title:"权限列表",
                        router:"/power/manage/list",
                        server:global.AUTHSERVER.login.key,
                        permissions:global.AUTHSERVER.login.access.operate_admin
                    },
                ]
            },
        ]
    }
    render() {
        return (
            <MenuTem data={this.data} />
        )
    }
}

export default SiderCustom;















