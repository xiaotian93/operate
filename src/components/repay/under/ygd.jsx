import React from 'react';
import ComponentRoute from './../../../templates/ComponentRoute';
import RepayListTemplate from '../../../controllers/repayList/template';

const Ygd = () => {
    let listProps = {
        title:"员工贷",
        labelName: "员工贷业务",
        labelType: "BUSINESS",
        appKey:"yuangongdai",
        project:"ygd",
        bindcolumns:(columns,templates)=>{
            let repayDateColumn = columns.find(col=>col.dataIndex ==="repayDate");
            repayDateColumn.render = data=>data;
        }
    }
    return <RepayListTemplate {...listProps} />
}

export default ComponentRoute(Ygd);
