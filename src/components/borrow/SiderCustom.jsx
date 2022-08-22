import React, { Component } from 'react';
// import { Link } from 'react-router';

import MenuTem from '../templates/menu';
class SiderCustom extends Component {
    componentWillMount(){
        this.data=[
            {
                title:"借款查询",
                router:"/jk/list",
                child:[
                    {
                        title:"白猫贷业务",
                        router:"/jk/list/bmd",
                        server:global.AUTHSERVER.bmdCashLoan.key,
                        permissions:global.AUTHSERVER.bmdCashLoan.access.loan_list
                    },
                    {
                        title:"自有资金业务",
                        router:"/jk/list/zyzj",
                        server:global.AUTHSERVER.mgnt.key,
                        permissions:global.AUTHSERVER.mgnt.access.loan_contract_list
                    },
                    {
                        title:"助贷业务",
                        router:"/jk/list/zd",
                        server:global.AUTHSERVER.mgnt.key,
                        permissions:global.AUTHSERVER.mgnt.access.loan_contract_list
                    },
                    {
                        title:"保理业务",
                        router:"/jk/list/bl",
                        server:global.AUTHSERVER.mgnt.key,
                        permissions:global.AUTHSERVER.mgnt.access.loan_contract_list
                    },
                    {
                        title:"员工贷业务",
                        router:"/jk/list/ygd",
                        server:global.AUTHSERVER.ygd.key,
                        permissions:global.AUTHSERVER.ygd.access.ygd_pay_success_list
                    },
                    {
                        title:"经营贷业务",
                        router:"/jk/list/jyd",
                        server:global.AUTHSERVER.ygd.key,
                        permissions:global.AUTHSERVER.ygd.access.jyd_pay_success_list
                    },
                    {
                        title:"供应链业务",
                        router:"/jk/list/gyl",
                        server:global.AUTHSERVER.gyl.key,
                        permissions:global.AUTHSERVER.gyl.access.pay_success_list
                    },
                    
                    // {
                    //     title:"大额消费分期业务",
                    //     router:"/jk/list/defq",
                    //     server:global.AUTHSERVER.ygd.key,
                    //     permissions:global.AUTHSERVER.ygd.access.defq_pay_success_list
                    // },
                    {
                        title:"智尊保业务",
                        router:"/jk/list/zzb",
                        server:global.AUTHSERVER.bfq.key,
                        permissions:""
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















