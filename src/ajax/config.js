import productConfig from './config/pro';
import testConfig from './config/test';
import stagingConfig from './config/staging';
import devConfig from './config/dev.js';

const hostname = window.location.hostname;
let domain = hostname.split(".").splice("-2").join(".");

let origin = {};
switch (domain) {
    case "baimaodai.cn":
        origin = testConfig.origin;
        break;
    case "heimaodai.com":
        origin = stagingConfig.origin;
        break;
    case "baimaodai.com":
        origin = productConfig.origin;
        break;
    case "lanmaodai.cn":
        origin = devConfig.origin;
        break;
    default:
        origin = testConfig.origin;
}
if (window.location.host === "yzh-account.baimaodai.cn") {
    origin = devConfig.origin
}

//资金管理host
export const host_zj = origin.zj;
//房抵贷host
export const host_fdd = origin.fdd;
//房抵贷host
export const host_cxfq = origin.cxfq;
// 还款管理host
export const host_repay = origin.repay;
// 通用host
export const host_nomal = origin.default;
// 接口请求Host
export const host = origin.manage;
// 合同数据Host
export const host_contract = origin.default + "contract_api";
// 支付数据Host
export const host_pay = origin.pay;
// 登陆验证Host
export const host_auth = origin.auth;
// 月报情况host
export const host_monthly = origin.monthly;
//保单管理host
export const host_bd = origin.bd;
//员工贷host
export const host_ygd = origin.ygd;
// 供应链host
export const host_gyl = origin.gyl;
//商户管理host
export const host_sh = origin.merchant;
// 现金贷host
export const host_xjd = origin.xjd;
// 现金贷离线host
export const host_xjdOffline = origin.xjdOffline;
// 风控数据host
export const host_risk = origin.risk;
// 数据统计
export const host_total = origin.total;
// 现金贷实时host
export const host_xjdOnline = origin.xjdOnline;
// 支付订单状态
export const host_payState = origin.payState;
//借贷管理
export const host_loanmanage = origin.loanmanage;
//自有资金
export const host_zyzj = origin.zyzj;
//bi
export const host_bi = origin.bi;
//借贷管理--新
export const host_loanmanageMgnt = origin.loanmanageMgnt;
//贷后管理
export const host_postloan = origin.postloan;

export const host_common = origin.common;




// 登录页连接
export const login_page = origin.auth + "/auth/login";
export const logout_page = origin.auth + "/auth/logout";
export const pwd_page = origin.auth + "/auth/wait_change_password";
// 列表每页条数
export const page = { size: 100 }

export const bill_status = {
    0: "待提审",
    300: "审核中",
    400: "审核通过",
    500: "支付中",
    800: "已发送支付",
    1300: "审核被拒绝",
    1500: "发送支付失败",
    1800: "支付失败",
    2000: "支付成功"
}

export const review_status = {
    0: "待审核",
    300: "待审核",
    400: "审核通过",
    500: "审核通过",
    800: "审核通过",
    1300: "审核失败",
    1500: "放款失败",
    1800: "放款失败",
    2000: "放款成功"
}
export const pay_status = {
    0: "待审核",
    300: "待审核",
    400: "审核通过",
    500: "发送中",
    800: "发送中",
    1300: "审核失败",
    1500: "支付失败",
    1800: "支付失败",
    2000: "支付成功"
}
export const repay_status_select = [
    // {"0":"未还款","1":"已还清","2":"逾期未还","3":"逾期已还清"}
    { name: "待还款", val: "0" },
    { name: "逾期未还款", val: "2" },
    { name: "提前结清", val: "4" },
    { name: "正常结清", val: "1" },
    { name: "逾期结清", val: "3" }
]
export const repay_status_select_map = {
    // {"0":"未还款","1":"已还清","2":"逾期未还","3":"逾期已还清"}
    "0": "待还款",
    "1": "正常结清",
    "2": "逾期未还款",
    "3": "逾期结清",
    "4": "提前结清",
    "6": "未结清",
    "7": "已还"
}

export const under_repay_status_select = [
    { name: "待还款", val: "0" },
    { name: "逾期未还款", val: "2" },
]
// 全部产品列表
export const product_list = [
    { val: "hs", name: "花生" },
    { val: "zzb", name: "智尊保" },
    { val: "ygd", name: "员工贷" },
    { val: "jyd", name: "经营贷" },
    { val: "fdd", name: "房抵贷" },
    { val: "cxfq", name: "车险分期" },
    { val: "abb", name: "雷鸟快保" }
]