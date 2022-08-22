import React from 'react';
import { axios_loanMgnt } from '../../ajax/request';

const StorageNoViewCtrl = (props) => {
    const bindClick = e=>{
        axios_loanMgnt.post("/manage/util/getStorageUrl",{storageId:props.storageId}).then(data=>{
            window.open(data.data);
        })
    }
    return <a onClick={bindClick}>{props.children}</a>
}


export default StorageNoViewCtrl;