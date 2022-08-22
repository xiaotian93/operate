import ax from 'axios';
import { message } from 'antd';
import { host, host_pay, host_auth , host_nomal , host_contract , login_page , host_fdd , host_cxfq , host_zj , host_monthly ,host_bd,host_ygd,host_gyl,host_repay ,host_sh , host_xjd, host_xjdOffline, host_risk , host_total,host_payState,host_loanmanage,host_xjdOnline,host_zyzj,host_bi,host_loanmanageMgnt,host_postloan,host_common} from './config';


const error_info = {
    net: "数据请求失败",
    404: "请求地址错误",
    500: "服务器异常",
    502: "服务器正在部署",
    401: "未登录",
    405: "请求方法错误",
    403: "访问无权限"
}

// 提示信息停留时间
const duration = 5;

// 数据请求参数
const axios_config = {
	timeout: 50000,
    responseType: 'json',
    withCredentials: true,
    validateStatus: function(status) {
        return (status >= 200 && status < 300);
    },
    transformRequest: [function(data) {
    	if(typeof(data)==="string"){
    		return data;
    	}
        let ret = [];
        for (let it in data) {
            ret.push(it + "=" + encodeURIComponent(data[it]));
        }
        return ret.join("&");
    }],
    transformResponse: [function(data) {
        let res;
        try {
            res = JSON.parse(JSON.stringify(data));
        } catch (e) {
            message.error("返回值格式错误");
            res = { state: -100, msg: "HAHA", data: null };
        }
        // 100 未登录 200 权限不足 300 权限不足 0 未定义错误
        if(res.status===100){
            window.location.href = login_page+"?redirectUrl="+window.location.href;
            message.warn("未登录！");
            return Promise.reject(res.msg,duration);
        }
        if(res.status!==0){
            message.error("错误代码："+res.status+"--错误信息："+res.msg, duration);
            return Promise.reject(res.msg)
        }
        return res;
    }]
}

const axios_config_new = {
    timeout: 50000,
    responseType: 'json',
    withCredentials: true,
    validateStatus: function(status) {
        return (status >= 200 && status < 300);
    },
    transformRequest: [function(data) {
        if(typeof(data)==="string"){
            return data;
        }
        let ret = [];
        for (let it in data) {
            ret.push(it + "=" + encodeURIComponent(data[it]));
        }
        return ret.join("&");
    }],
    transformResponse: [function(data) {
        let res;
        try {
            res = JSON.parse(JSON.stringify(data));
            // 100 未登录 200 权限不足 300 权限不足 0 未定义错误
            if(res.code===100){
                window.location.href = login_page+"?redirectUrl="+window.location.href;
                message.warn("未登录！");
                return Promise.reject(res.msg,duration);
            }
            if(res.code === 1005001001){
                return Promise.resolve(res);
            }
            if(res.code!==0){
                message.error(res.errMsg||res.errorMsg||res.err_msg||res.msg);
                // message.error("错误代码："+res.code+"--错误信息："+res.msg, duration);
                return Promise.reject(res.msg)
            }
        } catch (e) {
            message.error("返回值格式错误");
            res = { state: -100, msg: "HAHA", data: null };
        }
        return res;
    }]
}
const axios_config_json = {
    timeout: 50000,
    responseType: 'json',
    withCredentials: true,
    headers:{ "Content-Type":"application/json" },
    validateStatus: function(status) {
        return (status >= 200 && status < 300);
    },
    transformRequest: [function(data) {
        if(typeof(data)==="string"){
            return decodeURI(data);
        }
        return JSON.stringify(data);
    }],
    transformResponse: [function(data) {
        let res;
        try {
            res = JSON.parse(JSON.stringify(data));
            // 100 未登录 200 权限不足 300 权限不足 0 未定义错误
            if(res.code===100){
                window.location.href = login_page+"?redirectUrl="+window.location.href;
                message.warn("未登录！");
                return Promise.reject(res.msg);
            }
            // if(res.errMsg){
            //     message.error(res.errMsg);
            //     return Promise.resolve(res)
            // }
            // 
            if(res.code!==0){
                message.error(res.errMsg||res.errorMsg||res.err_msg||res.msg);
                // message.error("错误代码："+res.code+"--错误信息："+res.msg, duration);
                return Promise.reject(res.msg,duration)
            }
        } catch (e) {
            message.error("返回值格式错误");
            res = { state: -100, msg: "HAHA", data: null };
        }
        return res;
    }]
}

// 拦截器处理
// var errTest="";
const interceptors_res = (response) => {
    return response.data;
}

const interceptors_err = (err,data) => {
    let status = err.response ? err.response.status : "net";
    message.error(error_info[status], 3);
    return Promise.reject(error_info[status]);
}

// 请求实例
const axios = ax.create(axios_config);
axios.defaults.baseURL = host;
axios.interceptors.response.use(interceptors_res, interceptors_err);
export default axios;   // 默认请求实例

// 通用请求实例
const axios_n = ax.create(axios_config);
axios_n.defaults.baseURL = host_nomal;
axios_n.interceptors.response.use(interceptors_res, interceptors_err);
export const axios_nomal = axios_n;

// 验证请求实例
const axios_a = ax.create(axios_config_new);
axios_a.defaults.baseURL = host_auth;
axios_a.interceptors.response.use(interceptors_res, interceptors_err);
export const axios_auth = axios_a;

// 支付请求实例
const axios_p = ax.create(axios_config)
axios_p.defaults.baseURL = host_pay;
axios_p.interceptors.response.use(interceptors_res, interceptors_err);
export const axios_pay = axios_p;

// 还款计划请求实例
const axios_r = ax.create(axios_config)
axios_r.defaults.baseURL = host_repay;
axios_r.interceptors.response.use(interceptors_res, interceptors_err);
export const axios_repay = axios_r;


// 合同数据请求实例
const axios_c = ax.create(axios_config)
axios_c.defaults.baseURL = host_contract;
axios_c.interceptors.response.use(interceptors_res, interceptors_err);
export const axios_contract = axios_c;

// 房抵贷请求实例
const axios_f = ax.create(axios_config_new);
axios_f.defaults.baseURL = host_fdd;
axios_f.interceptors.response.use(interceptors_res, interceptors_err);
export const axios_fdd = axios_f;

// 商户平台请求实例
const axios_s = ax.create(axios_config_new);
axios_s.defaults.baseURL = host_cxfq;
axios_s.interceptors.response.use(interceptors_res, interceptors_err);
export const axios_sh = axios_s;

// 产品管理请求实例
const axios_cx = ax.create(axios_config_json);
axios_cx.defaults.baseURL = host_cxfq;
axios_cx.interceptors.response.use(interceptors_res, interceptors_err);
export const axios_cxfq = axios_cx;

// 资金管理请求实例
const axios_z = ax.create(axios_config_new);
axios_z.defaults.baseURL = host_zj;
axios_z.interceptors.response.use(interceptors_res, interceptors_err);
export const axios_zj = axios_z;

// 月报管理请求实例
const axios_m = ax.create(axios_config_new);
axios_m.defaults.baseURL = host_monthly;
axios_m.interceptors.response.use(interceptors_res, interceptors_err);
export const axios_monthly = axios_m;

// 保单平台请求实例
const axios_b = ax.create(axios_config_new);
axios_b.defaults.baseURL = host_bd;
axios_b.interceptors.response.use(interceptors_res, interceptors_err);
export const axios_bd = axios_b;

// 员工贷请求实例
const axios_y = ax.create(axios_config_new);
axios_y.defaults.baseURL = host_ygd;
axios_y.interceptors.response.use(interceptors_res, interceptors_err);
export const axios_ygd = axios_y;

// 供应链请求实例
const axios_g = ax.create(axios_config_new);
axios_g.defaults.baseURL = host_gyl;
axios_g.interceptors.response.use(interceptors_res, interceptors_err);
export const axios_gyl = axios_g;
// 产品管理请求实例
const axios_gj = ax.create(axios_config_json);
axios_gj.defaults.baseURL = host_gyl;
axios_gj.interceptors.response.use(interceptors_res, interceptors_err);
export const axios_gyl_json = axios_gj;

// 产品管理请求实例
const axios_cp = ax.create(axios_config_json);
axios_cp.defaults.baseURL = host_ygd;
axios_cp.interceptors.response.use(interceptors_res, interceptors_err);
export const axios_ygd_json = axios_cp;

//商户管理请求实例
const axios_mer = ax.create(axios_config_new);
axios_mer.defaults.baseURL = host_sh;
axios_mer.interceptors.response.use(interceptors_res, interceptors_err);
export const axios_merchant = axios_mer;

const axios_mer_j = ax.create(axios_config_json);
axios_mer_j.defaults.baseURL = host_sh;
axios_mer_j.interceptors.response.use(interceptors_res, interceptors_err);
export const axios_merchant_json = axios_mer_j;

// 贷后管理
const axios_x = ax.create(axios_config_new);
axios_x.defaults.baseURL = host_xjd;
axios_x.interceptors.response.use(interceptors_res, interceptors_err.bind(axios_x));
export const axios_xjd = axios_x;
// 贷后管理
const axios_x_p = ax.create(axios_config_json);
axios_x_p.defaults.baseURL = host_xjd;
axios_x_p.interceptors.response.use(interceptors_res, interceptors_err.bind(axios_x_p));
export const axios_xjd_p = axios_x_p;

// 贷后管理
const axios_xof = ax.create(axios_config_new);
axios_xof.defaults.baseURL = host_xjdOffline;
axios_xof.interceptors.response.use(interceptors_res, interceptors_err);
export const axios_xjdOffline = axios_xof;

// 风控数据
const axios_i = ax.create(axios_config_new);
axios_i.defaults.baseURL = host_risk;
axios_i.interceptors.response.use(interceptors_res, interceptors_err);
export const axios_risk = axios_i;

// 风控数据
const axios_t = ax.create(axios_config_new);
axios_t.defaults.baseURL = host_total;
axios_t.interceptors.response.use(interceptors_res, interceptors_err);
export const axios_total = axios_t;

// 支付订单状态
const axios_ps = ax.create(axios_config_new);
axios_ps.defaults.baseURL = host_payState;
axios_ps.interceptors.response.use(interceptors_res, interceptors_err);
export const axios_payState = axios_ps;

const axios_com = ax.create(axios_config_new);
axios_com.defaults.baseURL = host_common;
axios_com.interceptors.response.use(interceptors_res, interceptors_err);
export const axios_common = axios_com;

// 借贷管理
const axios_l = ax.create(axios_config_new);
axios_l.defaults.baseURL = host_loanmanage;
axios_l.interceptors.response.use(interceptors_res, interceptors_err);
export const axios_loan = axios_l;
const axios_lj = ax.create(axios_config_json);
axios_lj.defaults.baseURL = host_loanmanage;
axios_lj.interceptors.response.use(interceptors_res, interceptors_err);
export const axios_loan_json = axios_lj;

//贷后新
const axios_after = ax.create(axios_config_new);
axios_after.defaults.baseURL = host_postloan;
axios_after.interceptors.response.use(interceptors_res, interceptors_err);
export const axios_postloan = axios_after;

// 借贷管理--新
const axios_l_new = ax.create(axios_config_new);
axios_l_new.defaults.baseURL = host_loanmanageMgnt;
axios_l_new.interceptors.response.use(interceptors_res, interceptors_err);
export const axios_loanMgnt = axios_l_new;

const axios_l_new_j = ax.create(axios_config_json);
axios_l_new_j.defaults.baseURL = host_loanmanageMgnt;
axios_l_new_j.interceptors.response.use(interceptors_res, interceptors_err);
export const axios_loanMgnt_json = axios_l_new_j;

// 商户管理——实时
const axios_on = ax.create(axios_config_new);
axios_on.defaults.baseURL = host_xjdOnline;
axios_on.interceptors.response.use(interceptors_res, interceptors_err);
export const axios_online = axios_on;
const axios_onj = ax.create(axios_config_json);
axios_onj.defaults.baseURL = host_xjdOnline;
axios_onj.interceptors.response.use(interceptors_res, interceptors_err);
export const axios_online_json = axios_onj;
//自有资金
const axios_zy = ax.create(axios_config_new);
axios_zy.defaults.baseURL = host_zyzj;
axios_zy.interceptors.response.use(interceptors_res, interceptors_err);
export const axios_zyzj = axios_zy;

const axios_zy_j = ax.create(axios_config_json);
axios_zy_j.defaults.baseURL = host_zyzj;
axios_zy_j.interceptors.response.use(interceptors_res, interceptors_err);
export const axios_zyzj_json = axios_zy_j;

//bi
const axios_b_data = ax.create(axios_config_new);
axios_b_data.defaults.baseURL = host_bi;
axios_b_data.interceptors.response.use(interceptors_res, interceptors_err);
export const axios_bi = axios_b_data;

// 上传文件
const upload_i = (key,backfn)=> {
    return {
        accept:"image/*",
        action: host_cxfq+'/api/storage/manage_upload',
        listType:"picture-card",
        name:"file",
        multiple:true,
        withCredentials:true,
        data:{
            usage:key
        },
        onChange:function(res){
            if(res.file.status==='done'){
                if(res.file.response.code!==0){
                    message.error(res.file.response.msg, duration);
                    res.file.status = "error";
                }
            }
            backfn(key,res);
        }
    }
}
export const upload_image = upload_i;

// 处理返回值
export const resolve_res = (res) => {
    if (res && res.status === 0) {
        message.success("操作成功")
    } else {
        message.error(res.msg||"操作失败")
    }
}

