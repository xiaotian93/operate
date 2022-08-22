import React, { Component } from 'react';
import MenuTem from '../templates/menu';


class SiderCustom extends Component {
    componentWillMount(){
        this.data=[
            // {
            //     child:[
            //         {
            //             title:"放款统计",
            //             router:"/tj/loanCensus",
            //             server:global.AUTHSERVER.loanmanage.key,
            //             permissions:global.AUTHSERVER.loanmanage.access.loan_stats_list
            //         },
            //     ]
            // },
            {
                child:[
                    {
                        title:"借贷统计",
                        router:"/tj/loan",
                        server:global.AUTHSERVER.biUdata.key,
                        permissions:global.AUTHSERVER.biUdata.access.default
                    },
                ]
            },
            {
                child:[
                    {
                        title:"还款统计",
                        router:"/tj/repayCensus",
                        server:global.AUTHSERVER.biUdata.key,
                        permissions:global.AUTHSERVER.biUdata.access.default
                    },
                ]
            },
            {
                child:[
                    {
                        title:"进件统计",
                        router:"/tj/loanCensus",
                        server:global.AUTHSERVER.biUdata.key,
                        permissions:global.AUTHSERVER.biUdata.access.default
                    },
                ]
            },
            // {
            //     child:[
            //         {
            //             title:"逾期统计",
            //             router:"/tj/overdue",
            //             server:global.AUTHSERVER.loanmanage.key,
            //             permissions:global.AUTHSERVER.loanmanage.access.overdue_stats_list
            //         },
            //     ]
            // },
            // {
            //     child:[
            //         {
            //             title:"动态逾期率",
            //             router:"/tj/dynamic",
            //             server:global.AUTHSERVER.loanStats.key,
            //             permissions:global.AUTHSERVER.loanStats.access.dynamic_overude_list
            //         },
            //     ]
            // },
            // {
            //     child:[
            //         {
            //             title:"动态逾期率明细",
            //             router:"/tj/dynamicDetail",
            //             server:global.AUTHSERVER.loanStats.key,
            //             permissions:global.AUTHSERVER.loanStats.access.dynamic_overdue_detail_list
            //         },
            //     ]
            // },
            // {
            //     child:[
            //         {
            //             title:"vintage逾期率",
            //             router:"/tj/vintage",
            //             server:global.AUTHSERVER.loanStats.key,
            //             permissions:global.AUTHSERVER.loanStats.access.vintage_overdue_list
            //         },
            //     ]
            // },
            {
                child:[
                    {
                        title:"放贷情况表",
                        router:"/tj/bb/condition",
                        server:global.AUTHSERVER.statement.key,
                        permissions:""
                    },
                ]
            },
            {
                child:[
                    {
                        title:"业务结构表",
                        router:"/tj/bb/structure",
                        server:global.AUTHSERVER.statement.key,
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















