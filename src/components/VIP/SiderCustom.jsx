import React, { Component } from 'react';
import MenuTem from '../templates/menu';


class SiderCustom extends Component {
    componentWillMount(){
        this.data=[
            {
                title:"白猫贷业务",
                router:"/vip/bmd",
                child:[
                    {
                        title:"会员订单管理",
                        router:"/vip/bmd/order",
                        server:global.AUTHSERVER.bmdCashLoan.key,
                        permissions:global.AUTHSERVER.bmdCashLoan.access.vip_list
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















