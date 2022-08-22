import React, { Component } from 'react';
import MenuTem from '../templates/menu';

class SiderCustom extends Component {
    componentWillMount(){
        this.data=[
            {
                child:[
                    {
                        title:"保单管理-车险",
                        router:"/bd/indent/cxfq",
                        server:global.AUTHSERVER.cxfq.key,
                        permissions:global.AUTHSERVER.cxfq.access.bd_list
                    },
                ]
            },
            {
                child:[
                    {
                        title:"投保单管理-车险",
                        router:"/bd/tbd/cxfq",
                        server:global.AUTHSERVER.cxfq.key,
                        permissions:global.AUTHSERVER.cxfq.access.tbd_list
                    },
                ]
            },
            {
                child:[
                    {
                        title:"保单管理-花生",
                        router:"/bd/indent/hs",
                        server:global.AUTHSERVER.insurance.key,
                        permissions:global.AUTHSERVER.insurance.access.hs_insurance_list
                    },
                ]
            },
            {
                child:[
                    {
                        title:"保单管理-智尊保",
                        router:"/bd/indent/zzb",
                        server:global.AUTHSERVER.insurance.key,
                        permissions:global.AUTHSERVER.insurance.access.zzb_insurance_list
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















