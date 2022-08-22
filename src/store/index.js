import initData from './init';

class Store {
    constructor(name) {
        this.name = name;
        this.table = {};
        this.init();
    }
    init(){
        let table = localStorage.getItem(this.name);
        let init = JSON.parse(JSON.stringify(initData[this.name]));
        try {
            table = JSON.parse(table)||{};
        } catch (error) {
            throw new Error("data not a legal json");
        }
        if(init.version !== table.version){
            this.table = init;
        }else{
            this.table = table;
        }
    }
    get(){
        return this.table.data;
    }
    set(data){
        let init = initData[this.name];
        if(init.dataType !== typeof data) throw new Error("data type not equal");
        this.table.data = data;

        localStorage.setItem(this.name , JSON.stringify(this.table));
    }
    clear(key){
        localStorage.removeItem(this.name);
    }
}

export default Store;