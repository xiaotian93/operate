class UploadFile {
    constructor(origin) {
        this.origin = origin;
    }
    getByStorageNo(storage,index=0) {
        return {
            uid: storage.storageNo,
            url: storage.url,
            name: storage.fileOriginName||"附件" + (Number(index) + 1),
            size: 1,
            status: 'done',
            storageNo:storage.storageNo
        }
    }
    getByStorageNoList(strNoList =[]){
        return strNoList.map(storage=>this.getByStorageNo(storage));
    }
}

export default UploadFile;