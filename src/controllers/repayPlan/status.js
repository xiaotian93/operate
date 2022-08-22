class Status {
    constructor(){
        this.names = ["待还款", "逾期未还", "提前还款", "正常还款", "逾期还款"];
        this.values = [100 ,160 ,810 ,830 ,860];
        this.map = {};
        this.underRepayMap = {};
        this.names.forEach((name,index)=>{
            this.map[this.values[index]] = name;
            this.underRepayMap[this.values[index]] = "当期"+name;
        })
        this.select = this.names.map((name,index)=>({name,val:this.values[index]}));
        this.underRepaySelect = this.names.map((name,index)=>({name:"当期"+name,val:this.values[index]}))
    }
}

export default new Status();