import React from 'react';
import ImageViewer from './ImageViewer';

const StorageIdViewer = (props) => {
    const imgs = props.imgs.map(img=>({...img,src:props.host+"/manage/util/getStorageUrl?storageId="+img.storageId}))
    return <ImageViewer imgs={imgs} placeholder={props.placeholder} />
}
 
export default StorageIdViewer;