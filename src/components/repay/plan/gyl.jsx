import React from 'react';
import ComponentRoute from './../../../templates/ComponentRoute';
import RepayListTemplate from '../../../controllers/repayPlan/templates';
import Permissions from '../../../templates/Permissions';
import ListBtn from '../../templates/listBtn';
import Repay from '../../repay/elements/ygdDiscount';
import { axios_gyl_json } from '../../../ajax/request';
import {Button} from 'antd';
const Gyl = () => {
    const instance = {
        repayAllModel:()=>{}
    }
    const repayShow = data=>{
        var phase=data.currentRpPhase,repayPhase=[];
        for(let i=phase;i<=data.phaseCount;i++){
            repayPhase.push(i)
        }
        setTimeout(function(){
            instance.repayAllModel.show({ axios:axios_gyl_json , domainNo:data.domainNo , repayPhase ,contract_no:data.contractNo});
        },10)
    }
    let listProps = {
        title:"供应链",
        labelName: "供应链业务",
        labelType: "BUSINESS",
        repayBtn:true,
        bindcolumns:(columns,templates)=>{
            let operateCol = columns[Math.max(0,columns.length-1)];
            operateCol.operate = data=>{
                var btn=[];
                if(data.manageCurrentRpStatus===100||data.manageCurrentRpStatus===160){
                    btn.push(<Permissions size="small" type="primary" onClick={() => { repayShow(data) }} key={data.domainNo+"repay_gyl"} server={global.AUTHSERVER.gyl.key} tag="button">还款全部</Permissions>)
                }
                btn.push(<Permissions size="small" server={global.AUTHSERVER.mgnt.key} tag="button" onClick={() => templates.detail(data) } src={window.location.pathname + "/detail?contract_no=" + data.contractNo + "&appKey=" + data.appKey + "&urlType=jk&repayBtn=true"} key={data.domainNo+"detail_gyl"} permissions={global.AUTHSERVER.loanmanage.access.contract_detail}>查看</Permissions>)
                return <ListBtn btn={btn} />
            }
        }
    }
    return <RepayListTemplate {...listProps}>
        <Repay onRef={model => instance.repayAllModel = model} repayAll project={listProps.project} repayType="供应链金融" />
    </RepayListTemplate>
}

export default ComponentRoute(Gyl);
