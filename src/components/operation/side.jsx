import React, { Component } from 'react';
import MenuTem from '../templates/menu';


class SiderCustom extends Component {
    componentWillMount(){
        this.data=[
            {
                title: "融担费用",
                router: "/operation/rd",
                server: global.AUTHSERVER.bmdCashLoan.key,
                // permissions: global.AUTHSERVER.account.access.balance_list,
                child: [
                    {
                        title: "代收融担费用-华章汉辰",
                        router: "/operation/rd/ds",
                        server: global.AUTHSERVER.bmdCashLoan.key,
                        // permissions: global.AUTHSERVER.bmdCashLoan.access.credit_system_list
                    },
                    {
                        title: "华章汉辰代偿费用",
                        router: "/operation/rd/dc",
                        server: global.AUTHSERVER.bmdCashLoan.key,
                        // permissions: global.AUTHSERVER.bmdCashLoan.access.credit_manual_list
                    },
                    {
                        title: "融担服务费",
                        router: "/operation/rd/td",
                        server: global.AUTHSERVER.bmdCashLoan.key,
                        // permissions: global.AUTHSERVER.bmdCashLoan.access.credit_manual_list
                    },
                ]
            },
            {child:[
                {
                    title:"项目成本",
                    router:"/operation/xmcb",
                    server: global.AUTHSERVER.capital.key,
                    permissions: global.AUTHSERVER.capital.access.manage_cost_record,
                }
            ]}
            
        ]
    }
    render() {
        return (
            <MenuTem data={this.data} />
        )
    }
}

export default SiderCustom;















