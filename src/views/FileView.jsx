import React from 'react';

const FileView = ({ title, storageList = [] }) => {
    if (storageList.length <= 0) {
        return <span>{title}暂无</span>
    }
    return <span style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
        <span>{title}</span>
        {storageList.map(storage => (<a href={storage.url} key={storage.storageNo} download style={{ marginRight: "8px" }}>{storage.fileOriginName||storage.storageNo}</a>))}
    </span>
}

export default FileView;