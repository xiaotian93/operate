class ValueMap{
    constructor(values){
        this.list = values;
    }
    getValue(key){
        var current = this.list.find(item=>{
            return item.key === key;
        })
        return current?current.value:null
    }
    getMap(){
        return this.list.filter(item=>{
            return item.value!==null || item.value !== undefined;
        }).map(item=>{
            return { key:item.key,map:item.value }
        });
    }
    getSelect(){
        return this.list.filter(item=>{
            return item.value!==null || item.value !== undefined;
        }).map(item=>{
            return { val:item.key,name:item.value }
        });
    }
}

export default ValueMap;