import React, { Component } from 'react';
import MenuTem from '../templates/menu';


class SiderCustom extends Component {
    componentWillMount(){
        this.data=[
            {
                child:[
                    {
                        title:"贷后管理",
                        router:"/dh/overdue",
                        server:global.AUTHSERVER.postloan.key,
                        permissions:""
                    },
                ]
            },
            {
                child:[
                    {
                        title:"审批管理",
                        router:"/dh/approve",
                        server:global.AUTHSERVER.postloan.key,
                        permissions:global.AUTHSERVER.postloan.access.pl_audit
                    },
                ]
            },
            {
                child:[
                    {
                        title:"外呼记录查询",
                        router:"/dh/calllog",
                        server:global.AUTHSERVER.postloan.key,
                        permissions:global.AUTHSERVER.postloan.access.call_list
                    },
                ]
            },
        ]
    }
    render() {
        return (
            <MenuTem data={this.data} setRouter />
        )
    }
}

export default SiderCustom;















