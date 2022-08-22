import React from 'react';
import RepayListTemplate from './templates';


const RepayList = () => {
    let listProps = {
        title:"示例",
        domain: "bmd-loancoop-capital",
        bkSubject: "ZHIDUXIAODAI",
    }
    return <RepayListTemplate {...listProps} />
}
export default RepayList;