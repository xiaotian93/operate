import { axios_zj } from "../../ajax/request";

class AccountManager {
    accountInfo = { list: [] };
    getSelect() {
        return this.accountInfo.list.map(account => ({ name: `${account.innerName}(${account.usage})`, val: account.accountId + "" }))
    }
    mapName(accountId) {
        let account = this.accountInfo.list.find(ac => ac.accountId === accountId) || {};
        return `${account.innerName}(${account.usage})`;
    }
    ready() {
        return new Promise((resolve, reject) => {
            axios_zj.post("/bmd_gj_accounting/merchant/list", { all: false }).then(data => {
                this.accountInfo = data.data;
                resolve(true)
            }).catch(e => reject(e));
        })
    }
}

const AccountCtrl = new AccountManager();
export default AccountCtrl;