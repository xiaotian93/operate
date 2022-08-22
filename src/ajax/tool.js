import moment from 'moment';
import { browserHistory } from 'react-router';
import Decimal from 'decimal.js';
import { host_ygd, logout_page, pwd_page } from './config';
import { ygd_img_get } from './api';
import { message } from 'antd';
export default {};
// 获取地址栏参数
export const getUrlParam = (name) => {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if (r != null)
        return decodeURI(r[2]);
    return null;
}

// 格式化表格参数  添加需要
export const format_table_data = (data, page = 1, pageSize = 100) => {
    let source = JSON.parse(JSON.stringify(data));
    for (let s in source) {
        // if(page){
        // for(var j=page*pageSize;j<page*pageSize+source.length;j++){
        if (!source[s].key) {
            var j = (page - 1) * pageSize + Number(s);
            source[s].key = (parseInt(j, 10) + 1);
        }

        // }
        // }else{
        // source[s].key = (parseInt(s, 10) + 1);

        // }
    }

    return source;
}

// 格式化日期
export const format_date = (date) => {
    if (!date) {
        return ""
    }
    return moment(date).format("YYYY-MM-DD")
}
// 格式化时间
export const format_time = (date = "") => {
    if (!date) {
        return ""
    }
    return moment(date).format("YYYY-MM-DD HH:mm:ss");
}
// 页面跳转
export const page_go = (url) => {
    browserHistory.push(url);
}

export const bmd = {
    transformParams: (params) => {
        let paramStr = [];
        for (let p in params) {
            paramStr.push(p + "=" + params[p]);
        }
        paramStr = paramStr.join("&");
        return paramStr;
    },
    // 跳转页面
    redirect: (url, params = []) => {
        let paramStr = bmd.transformParams(params);
        url = url.indexOf("?") > 0 ? url + "&" + paramStr : url + "?" + paramStr
        browserHistory.push(url);
    },
    // 新打开一个页面
    navigate: (url, params = []) => {
        let paramStr = bmd.transformParams(params);
        url = url.indexOf("?") > 0 ? url + "&" + paramStr : url + "?" + paramStr
        window.open(url)
    },
    // 没有显示--
    show_blank: (data) => {
        return data || "--"
    },
    // 退出登录
    logout: () => {
        bmd.navigate(logout_page + "?redirectUrl=" + window.location.href);
    },
    //修改密码
    password: () => {
        bmd.navigate(pwd_page + "?redirectUrl=" + window.location.href);
    },
    percent: (num) => {
        num = parseFloat(num);
        if (isNaN(num)) {
            return "--"
        }
        return Decimal.mul(num, 100).toString() + "%";
    },
    money: function (money) {
        if (money === undefined || money === null) {
            return "--"
        }
        if (!money) {
            return "0.00"
        }
        let num_str = parseFloat(money / 100).toFixed(2);
        let num_int = parseInt(num_str.split(".")[0], 10).toLocaleString();
        return num_int + "." + num_str.split(".")[1];
    },
    remoney: function (moneyStr) {
        if (moneyStr === "" || moneyStr === null || moneyStr === undefined) {
            return "--"
        }
        let money = parseFloat(moneyStr) * 100;
        return parseInt(money.toFixed(0), 10) || 0;
    },
    resolveBlank(data) {
        return data === null ? "--" : (data === undefined ? "---" : data);
    },
    unfoldObjArray(arr) {
        let res = [];
        for (let a in arr) {
            let detail = arr[a], obj = {}, temp = [];
            if (detail === null || detail === undefined) {
                continue;
            }
            for (let d in detail) {
                if (Array.isArray(detail[d])) {
                    temp = detail[d];
                } else {
                    obj[d] = detail[d];
                }
            }
            for (let t in temp) {
                obj.akid = a + "-" + t;
                res.push(JSON.parse(JSON.stringify(Object.assign(obj, temp[t]))));
            }
        }
        return res;
    },
    getSelect(axios, select_data) {
    },
    //表格排序
    getSort(a, b, str, time) {
        if (a.key === "合计" || b.key === "合计") {
            return;
        }
        if (time) {
            return (a[str] ? this.getTimes(a[str]) : 0) - (b[str] ? this.getTimes(b[str]) : 0)
        } else {
            return (a[str] ? Number(a[str]) : 0) - (b[str] ? Number(b[str]) : 0)
        }
    },
    getTimes(str) {
        if (!str) return 0;
        var date = str;
        date = date.substring(0, 19);
        date = date.replace(/-/g, '/'); //必须把日期'-'转为'/'
        var timestamp = new Date(date).getTime();
        return timestamp;
    },
    objToDate(dateObj) {
        let date = new Date(dateObj);
        if (dateObj.date) {
            date.setFullYear(dateObj.date.year || 0);
            date.setMonth(Math.max(dateObj.date.month - 1, 0) || 0);
            date.setDate(dateObj.date.day || 0);
        }
        if (dateObj.time) {
            date.setHours(dateObj.time.hour || 0);
            date.setMinutes(dateObj.time.minute || 0);
            date.setSeconds(dateObj.time.second || 0);
            date.setMilliseconds(dateObj.time.nano || 0);
        }
        return date;
    },
    formatObjDate(dateObj) {
        if (!dateObj) return '--';
        return moment(this.objToDate(dateObj)).format("YYYY-MM-DD");
    },
    formatObjTime(dateObj) {
        if (!dateObj) return '--';
        return moment(this.objToDate(dateObj)).format("YYYY-MM-DD HH:mm:ss");
    },
    format_date(date) {
        if (!date) {
            return ""
        }
        return moment(date).format("YYYY-MM-DD")
    },
    // 格式化时间
    format_time(date = "") {
        if (!date) {
            return ""
        }
        return moment(date).format("YYYY-MM-DD HH:mm:ss");
    }
}

//图片编辑
export const img_edit = (data) => {
    var imgArr = [];
    for (let bd in data) {
        //let key=j;
        var StorageNoLists = {};
        StorageNoLists.uid = bd;
        StorageNoLists.url = host_ygd + ygd_img_get + '?storageNo=' + data[bd];
        StorageNoLists.name = "附件" + (Number(bd) + 1);
        StorageNoLists.size = 1;
        StorageNoLists.status = 'done';
        StorageNoLists.storageNo = data[bd];
        imgArr.push(StorageNoLists);
    }
    return imgArr;
}

//多张图片上传
export const upload_more = (e, name, status, that) => {
    var arr = [];
    for (var j in e.fileList) {
        if (e.fileList[j].size > 20000000) {
            message.warn('图片不能大于20M');
            return;
        }
    }
    that.setState({
        [status]: e.fileList
    });
    for (var i in e.fileList) {
        if (e.fileList[i].status === "done") {
            if (e.fileList[i].response) {
                if (e.fileList[i].response.code === 0) {
                    arr.push(e.fileList[i].response.data.storageNo)
                } else {
                    message.warn(e.fileList[i].response.msg);
                    return;
                }
            } else {
                arr.push(e.fileList[i].storageNo)
            }
        }
    };
    that.props.form.setFieldsValue({ [name]: arr });
}

//乘法 小数精度丢失
export const accMul = (arg1, arg2) => {
    if (arg1 === undefined || arg1 === null) {
        return;
    }
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try { m += s1.split(".")[1].length } catch (e) { }
    try { m += s2.split(".")[1].length } catch (e) { }
    return (Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m))
}
//除法 小数精度丢失
export const accDiv = (arg1, arg2) => {
    if (arg1 === undefined || arg1 === null) {
        return;
    }
    var t1 = 0, t2 = 0, r1, r2;
    try { t1 = arg1.toString().split(".")[1].length } catch (e) { }
    try { t2 = arg2.toString().split(".")[1].length } catch (e) { }
    if (Math) {
        r1 = Number(arg1.toString().replace(".", ""))
        r2 = Number(arg2.toString().replace(".", ""))
        return accMul((r1 / r2), Math.pow(10, t2 - t1));
    }
}
//减    
export const floatSub = (arg1, arg2) => {
    //  console.log(arg1,arg2)
    var r1, r2, m, n;
    try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2));
    //动态控制精度长度    
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(2);
}
//加    
export const floatAdd = (arg1, arg2) => {
    var r1, r2, m;
    try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2));
    return ((arg1 * m + arg2 * m) / m).toFixed(2);
}



