import Store from '../index';

class Table{
    constructor(tableName){
        this.store = new Store(tableName);
    }
    get(){
        return this.store.get()||{};
    }
    save(data){
        if(typeof data === 'undefined') throw new Error("data is not defined")
        this.store.set(data);
    }
    clear(){
        this.store.clear();
    }
}

export default Table;