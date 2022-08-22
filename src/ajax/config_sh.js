// 车险分期配置信息
/*
NOT_BIND_CARD(-6),  //还款个人未绑卡
    RETURN(-5), //已退保
    LOAN_FAILURE(-4), // 放款失败
    ZD_NO_PASS(-3), //智度审核未通过
    NO_PASS(-2), //商户审核未通过
    INVALID(-1), //已失效
    UN_SIGNED(0), //待签约
    UN_PAY(1), //待首付
    UNDER_REVIEW(2), //待商户审核
    ZD_UNDER_REVIEW_0(3), //待智度初审
    ZD_UNDER_REVIEW_1(4),   //待智度复审
    UN_LOAN(5), //待放款
    PAYING(6),  //放款中
    UN_REPAY(7), //待还款
    CLOSE(8); //已结清
*/
// 订单状态
export const order_status_map = {
	"-5" : "提前结清",
	"-4" : "放款失败",
	"-3" : "审核未通过",
	"-2" : "进审未通过", 
	"-1" : "已失效",
	"0" : "待签约",
	"1" : "待首付",
	"2" : "待进审", 
	"3" : "待初审", 
	"4" : "待复审", 
	"5" : "待放款", 
    "6" : "待放款", 
    "11" : "待还款",
    "12" : "还款处理中",
    "13" : "逾期未还款",
    "21" : "提前结清",
    "22" : "正常结清",
    "23" : "逾期结清"
}
// 订单状态下拉
export const order_status_select = [
	{val:"2" ,name: "待进审"}, 
	{val:"-2" ,name: "进审未通过"}, 
	{val:"3" ,name: "待初审"}, 
	{val:"4" ,name: "待复审"}, 
	{val:"-3" ,name: "审核未通过"},
	// {val:"-1" ,name: "已失效"},
	{val:"0" ,name: "待签约"},
	{val:"1" ,name: "待首付"},
	{val:"5,6" ,name: "待放款"}, 
    {val:"-4" ,name: "放款失败"},
    {val:"11" ,name: "待还款"},
    {val:"12" ,name: "还款处理中"},
    {val:"13" ,name: "逾期未还款"},
    {val:"21,-5" ,name: "提前结清"},
    {val:"22" ,name: "正常结清"},
    {val:"23" ,name: "逾期结清"}
]

// 企业规模
export const enterprise_scale = [
	{val:"1",name:"个体工商户"}, 
	{val:"2",name:"农村专业合作组织"}, 
	{val:"3",name:"微型企业"}, 
	{val:"4",name:"小型企业"}, 
	{val:"5",name:"中型企业"}, 
	{val:"6",name:"大型企业"}, 
	{val:"7",name:"其他组织"}
]
// 产业类型
export const industry_type = [
	{val:"1",name:"第一产业"},
	{val:"2",name:"第二产业"},
	{val:"3",name:"第三产业"}
]
// 所属行业
export const trade_type = [
	{val:"1",name:"居民服务和其他服务业"},
	{val:"2",name:"建筑业"}, 
	{val:"3",name:"交通运输、仓储和邮政业"}, 
	{val:"4",name:"农、林、牧、渔业"}, 
	{val:"5",name:"采矿业"}, 
	{val:"6",name:"制造业"}, 
	{val:"7",name:"电力、燃气及水的生产和供应业"}, 
	{val:"8",name:"信息传输、计算机服务和软件业"}, 
	{val:"9",name:"批发和零售业"},
	{val:"10",name:"住宿和餐饮业"}, 
	{val:"11",name:"房地产业"}, 
	{val:"12",name:"租赁和商务服务业"}, 
	{val:"13",name:"其他"}
]
