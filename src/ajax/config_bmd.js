// 车险分期配置信息
/*
REVIEWING_0 = 0;    //待初审
REVIEWING_1 = 10;   //待复审
REVIEW_DENY = 21;   //审核未通过
REVIEWING_2 = 30;   //待三审(待买卡的订单)
UNDER_PAY = 40;   //待放款
PAY_FAILED = 41;   //放款失败
UNDER_REPAY = 50;   //待还款
UNDER_REPAY_OVERDUE = 52;   //逾期未还款
SETTLE_NORMAL = 60;   //正常结清
SETTLE_ADVANCE = 61;   //提前结清
SETTLE_OVERDUE = 62;   //逾期结清
EXPIRED = 71;   //已失效
*/
// 订单状态
export const order_status_map = {
	0: "待机审",
    5: "待人工审核",
    7: "审核不通过",
    10: "待放款",
    11: "放款失败",
    14: "放款请求发送中",
    15: "等待放款回调",
    20: "待还款",
    30: "已结清",
    41: "已失效"
}
// 订单状态下拉
export const order_status_select = [
	{val:"",name:"全部"},
    {val:"0",name:"待机审"},
    {val:"5",name:"待人工审核"},
    {val:"7",name:"审核不通过"},
    {val:"10",name:"待放款"},
    {val:"11",name:"放款失败"},
    {val:"14",name:"放款请求发送中"},
    {val:"15",name:"等待放款回调"},
    {val:"20",name:"待还款"},
    {val:"30",name:"已结清"},
    {val:"41",name:"已失效"}
]
