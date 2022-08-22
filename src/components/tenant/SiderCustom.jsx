import React, { Component } from 'react';
import MenuTem from '../templates/menu';


class SiderCustom extends Component {
    componentWillMount(){
        this.data=[
            {
                child:[
                    {
                        title:"商户审核",
                        router:"/sh/audit",
                        server:global.AUTHSERVER.merchant.key,
                        permissions:global.AUTHSERVER.merchant.access.merchant_audit_list
                    },
                ]
            },
            {
                child:[
                    {
                        title:"认证商户",
                        router:"/sh/total",
                        server:global.AUTHSERVER.merchant.key,
                        permissions:global.AUTHSERVER.merchant.access.merchant_list
                    },
                ]
            },
            // {
            //     child:[
            //         {
            //             title:"车险分期业务",
            //             router:"/sh/list",
            //             server:global.AUTHSERVER.cxfq.key,
            //             permissions:global.AUTHSERVER.cxfq.access.merchant_list
            //         },
            //     ]
            // },
            // {
            //     child:[
            //         {
            //             title:"信用贷实时业务",
            //             router:"/sh/online",
            //             server:global.AUTHSERVER.bmdOnline.key,
            //             permissions:global.AUTHSERVER.bmdOnline.access.merchant_list
            //         },
            //     ]
            // },
            // {
            //     child:[
            //         {
            //             title:"白猫贷业务",
            //             router:"/sh/bmd",
            //             server:global.AUTHSERVER.bmdCashLoan.key,
            //             permissions:global.AUTHSERVER.bmdCashLoan.access.product_list
            //         },
            //     ]
            // },
            
        ]
    }
    render() {
        return (
            <MenuTem data={this.data} setRouter />
        )
    }
}
export default SiderCustom;















