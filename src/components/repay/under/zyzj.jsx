import React from 'react';
import ComponentRoute from './../../../templates/ComponentRoute';
import RepayListTemplate from '../../../controllers/repayList/template';
import ListBtn from '../../templates/listBtn';
import Permissions from '../../../templates/Permissions';

const Capital = () => {
    let listProps = {
        labelName: "自有资金业务",
        labelType: "BUSINESS",
        bindcolumns:(columns,templates)=>{
            let operateCol = columns[Math.max(0,columns.length-1)];
            operateCol.operate = data=>{
                var btn=[]
                btn.push(<Permissions size="small" server={global.AUTHSERVER.mgnt.key} permissions={global.AUTHSERVER.mgnt.access.contract_detail} tag="button" onClick={() => templates.detail(data) } src={window.location.pathname + "/detail?contract_no=" + data.contractNo + "&appKey=" + data.appKey + "&urlType=jk&repayBtn=&contractId="+data.contractId+"&borrowerId="+data.borrowerId}>查看</Permissions>)
                return <ListBtn btn={btn} />
            }
        }
    }
    return <RepayListTemplate {...listProps} />
}

export default ComponentRoute(Capital);