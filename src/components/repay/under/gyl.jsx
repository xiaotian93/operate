import React from 'react';
import ComponentRoute from './../../../templates/ComponentRoute';
import RepayListTemplate from '../../../controllers/repayList/template';

const Gyl = () => {
    let listProps = {
        title:"供应链",
        labelName: "供应链业务",
        labelType: "BUSINESS",
        bindcolumns:(columns,templates)=>{
        }
    }
    return <RepayListTemplate {...listProps} />
}

export default ComponentRoute(Gyl);
