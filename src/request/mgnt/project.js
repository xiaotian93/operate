import { axios_loanMgnt } from "../../ajax/request";

class MgntProjectManager {
    list = [];
    nameMap(appKey) {
        let app = this.list.find(item=>item.appKey === appKey)||{};
        return app.appName||appKey;
    }
    getSelect(list=this.list) {
        return list.map(item=>({name:item.appName,val:item.appKey}));
    }
    getByLabelName(labelName){
        return axios_loanMgnt.post("/manage/util/getLoanAppOptions",{labelName,labelType:"BUSINESS"})
    }
    ready() {
        return new Promise((resolve, reject) => {
            axios_loanMgnt.post("/manage/util/getLoanAppOptions").then(data => {
                this.list = data.data;
                resolve(true);
            }).catch(e=>reject(e));
        })
    }
}
const MgntProjectCtrl = new MgntProjectManager()
export default MgntProjectCtrl;