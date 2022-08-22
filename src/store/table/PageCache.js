import Table from '.';

class PageCache extends Table{
    constructor(path){
        super("pageInfo");
        this.path = path;
    }
    getPageInfo(){
        return this.get()[this.path]||{};
    }
    savePageInfo(cache){
        let data = this.get();
        data[this.path] = cache;
        this.save(data);
    }
    clearPageInfo(){
        let data = this.get();
        delete data[this.path];
        this.save(data);
    }
}

export default PageCache;