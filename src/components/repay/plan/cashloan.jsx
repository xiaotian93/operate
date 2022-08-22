import React from 'react';
import ComponentRoute from './../../../templates/ComponentRoute';
import RepayListTemplate from '../../../controllers/repayPlan/templates';
import Permissions from '../../../templates/Permissions';
import ListBtn from '../../templates/listBtn';
import Repay from '../../repay/elements/zyzjRepay';
import {Button} from 'antd';
const BmdCashLoan = () => {
    const instance = {
        repayAllModel:()=>{}
    }
    const repayShow = data=>{
        setTimeout(function(){
            instance.repayAllModel.show({contract_no:data.contractNo,phaseStart:data.currentRpPhase,phaseEnd:data.phaseCount,appKey:data.appKey});
        },10)
    }
    let listProps = {
        title:"白猫贷",
        labelName: "白猫贷业务",
        labelType: "BUSINESS",
        repayBtn:true,
        bindcolumns:(columns,templates)=>{
            let operateCol = columns[Math.max(0,columns.length-1)];
            operateCol.operate = data=>{
                var btn=[]
                if(data.contractStatus===800){
                    if(data.signStorageId){
                        btn.push(<Permissions size="small" server={global.AUTHSERVER.mgnt.key} tag="button" onClick={() => templates.contractDownload(data) } type="primary" >下载结清证明</Permissions>)
                    }else{
                        btn.push(<Permissions key={data.domainNo} size="small" server={global.AUTHSERVER.mgnt.key} tag="button" onClick={()=>{templates.contractApplyShow(data)}} permissions={global.AUTHSERVER.mgnt.access.clear_sign_apply}>申请结清证明</Permissions>)
                    }
                }
                if(data.manageCurrentRpStatus===100||data.manageCurrentRpStatus===160){
                    btn.push(<Permissions size="small" type="primary" onClick={() => { repayShow(data) }} key={data.domainNo+"repay_gyl"} server={global.AUTHSERVER.mgnt.key} permissions={global.AUTHSERVER.mgnt.access.repay_apply} tag="button">还款全部</Permissions>)
                }
                btn.push(<Permissions size="small" server={global.AUTHSERVER.mgnt.key} permissions={global.AUTHSERVER.mgnt.access.contract_detail} tag="button" onClick={() => templates.detail(data) } src={window.location.pathname + "/detail?contract_no=" + data.contractNo + "&appKey=" + data.appKey + "&urlType=jk&repayBtn=&contractId="+data.contractId+"&borrowerId="+data.borrowerId}>查看</Permissions>)
                return <ListBtn btn={btn} />
            }
        }
    }
    return <RepayListTemplate {...listProps} >
        <Repay onRef={model => instance.repayAllModel = model} repayAll project={listProps.project} repayType="白猫贷业务" />
    </RepayListTemplate>
}

export default ComponentRoute(BmdCashLoan);
