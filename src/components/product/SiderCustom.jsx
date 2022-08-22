import React, { Component } from 'react';
import MenuTem from '../templates/menu';
class SiderCustom extends Component {
    componentWillMount(){
        this.data=[
            {
                child:[
                    {
                        title:"产品列表",
                        router:"/cp/total/list",
                        server:global.AUTHSERVER.loan.key,
                        permissions:global.AUTHSERVER.loan.access.product_list
                    },
                ]
            },
            {
                child:[
                    {
                        title:"项目管理",
                        router:"/cp/project/list",
                        server:global.AUTHSERVER.loan.key,
                        permissions:global.AUTHSERVER.loan.access.default
                    },
                ]
            }
        ]
    }
    render() {
        return (
            <MenuTem data={this.data} />
        )
    }
}

export default SiderCustom;















