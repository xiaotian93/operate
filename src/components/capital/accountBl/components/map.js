const subjectList = [
    { key: "ZHIDUXIAODAI", short: "智度小贷", name: "广州市智度互联网小额贷款有限公司" },
    { key: "KASHIZHIYOU", short: "喀什智优", name: "喀什智优网络科技有限公司" },
    { key: "BAIMAOKEJI", short: "白猫科技", name: "霍尔果斯白猫科技有限公司" },
    { key: "ZHIDUBAOLI", short: "智度保理", name: "广州市智度商业保理有限公司" }
]

export const subjectMap = (key) => {
    return subjectList.find(sub=>sub.key===key)||{ short: "--", name: "--" };
}
export const subjectSelect = ()=>{
    return subjectList.map(sub=>({name:sub.short,val:sub.key}));
}
export const shareStatusMap = {
    "0": "待定账户",
    "1": "自有账户",
    "2": "共管账户"
}
