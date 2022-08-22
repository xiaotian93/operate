import React from 'react';
import ComponentRoute from './../../../templates/ComponentRoute';
import RepayListTemplate from '../../../controllers/repayPlan/templates';
import Permissions from '../../../templates/Permissions';
import ListBtn from '../../templates/listBtn';
import Page from './page';
import Repay from '../../repay/elements/ygdDiscount';
import { axios_ygd_json } from '../../../ajax/request';
const Jyd = () => {
    const instance = {
        repayAllModel:()=>{}
    }
    const repayShow = data=>{
        var phase=data.currentRpPhase,repayPhase=[];
        for(let i=phase;i<=data.phaseCount;i++){
            repayPhase.push(i)
        }
        setTimeout(function(){
            instance.repayAllModel.show({ axios:axios_ygd_json , domainNo:data.domainNo , repayPhase ,contract_no:data.contractNo});
        },10)
    }
    let listProps = {
        title:"经营贷",
        appKey:"jingyingdai",
        repayBtn:true,
        labelName: "经营贷业务",
        labelType: "BUSINESS",
        project:"jyd",
        bindcolumns:(columns,templates)=>{
            let operateCol = columns[Math.max(0,columns.length-1)];
            operateCol.operate = data=>{
                var btn= [];
                if(data.manageCurrentRpStatus===100||data.manageCurrentRpStatus===160){
                    btn.push(<Permissions size="small" type="primary" server={global.AUTHSERVER.ygd.key} permissions={global.AUTHSERVER.ygd.access.jyd_repay} tag="button" onClick={() => { repayShow(data) }} key={data.domainNo+"repay_ygd"}>还款全部</Permissions>)
                }
                btn.push(
                    <Permissions size="small" server={global.AUTHSERVER.mgnt.key} tag="button" onClick={() => templates.detail(data) } src={window.location.pathname + "/detail?contract_no=" + data.contractNo + "&appKey=" + data.appKey + "&urlType=jk&repayBtn=true"} key={data.domainNo+"detail_ygd"} permissions={global.AUTHSERVER.loanmanage.access.contract_detail}>查看</Permissions>
                )
                return <ListBtn btn={btn} />
            }
        }
    }
    return <RepayListTemplate {...listProps} >
        <Repay onRef={model => instance.repayAllModel = model} repayAll project={listProps.project} repayType="员工贷" />
    </RepayListTemplate>
        // let paths = props.location.pathname;
        // return(
        //     <Page routes={props.routes} params={props.params} title="经营贷" page_type="jyd" path={paths} />
        // )
    
}

export default ComponentRoute(Jyd);
