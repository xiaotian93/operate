import React from 'react';
import ComponentRoute from './../../../templates/ComponentRoute';
import RepayListTemplate from '../../../controllers/repayList/template';
import Page from './page';
const Jyd = () => {
    let listProps = {
        title:"经营贷",
        labelName: "经营贷业务",
        labelType: "BUSINESS",
        appKey:"jingyingdai",
        project:"jyd",
        bindcolumns:(columns,templates)=>{
            let repayDateColumn = columns.find(col=>col.dataIndex ==="repayDate");
            repayDateColumn.render = data=>data;
        }
    }
    return <RepayListTemplate {...listProps} />
    // // let props = props;
    //     return(
    //         <Page {...props} title="经营贷业务" page_type="jyd" path={props.location.pathname} />
    //     )
}

export default ComponentRoute(Jyd);
