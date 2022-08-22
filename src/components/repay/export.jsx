import React, { Component } from 'react';
import ComponentRoute from '../../templates/ComponentRoute';
import { repay_export_list, repay_export_detail, repay_export_download } from '../../ajax/api';
import List from '../templates/list';
import { axios_loanMgnt } from '../../ajax/request';
import { page } from '../../ajax/config';
import { Button, message } from 'antd';
import { format_table_data } from '../../ajax/tool';
class Export extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filter: {},
            nowPage: 1,
            pageSize: page.size,
            doamin:[],
            appKey:[]
        }
    }
    componentWillMount() {
        this.get_list();
        this.get_select();
        this.filter = {
            time: {
                name: "创建时间",
                type: "range_date_day",
                placeHolder: ["开始时间", "结束时间11"],
                feild_s: "startDate",
                feild_e: "endDate",
            },
            appKey: {
                name: "业务",
                type: "select",
                values: "appKey"
            }
        }
        this.filter_export = {
            time: {
                name: "借贷时间",
                type: "range_date_day",
                placeHolder: ["开始时间", "结束时间"],
                feild_s: "startDate",
                feild_e: "endDate",
            },
            // domain: {
            //     name: "业务",
            //     type: "select",
            //     values: "domain",
            //     // relevance: "parent",
            //     // relevanceChild: "appKey",
            //     all: "hidden",
            //     getAppkey:true
            // },
            // appKey: {
            //     name: "项目",
            //     type: "select",
            //     values: "appKey",
            //     // relevance: "domain",
            //     all: "hidden"
            // },
            domain: {
                name: "业务",
                type: "select",
                values: "domain",
                relevance: "parent",
                relevanceChild: "appKey",
                all: "hidden"
            },
            appKey: {
                name: "项目",
                type: "select",
                values: "appKey",
                relevance: "domain",
                all: "hidden"
            },
        }
        this.columns = [
            {
                title: "序号",
                render: (e, rec, index) => {
                    return index + 1
                }
            },
            {
                title: "创建时间",
                dataIndex: "createTime"
            },
            {
                title: "项目",
                dataIndex: "appName"
            },
            {
                title: "文件名称",
                dataIndex: "fileName"
            },
            {
                title: "文件状态",
                dataIndex: "status",
                render: e => {
                    var type = { 0: "初始化", 400: "导出中", 800: "导出完成", 900: "导出失败" };
                    return type[e]
                }
            },
            {
                title: "操作",
                render: e => (e.status === 800 ? <Button type="primary" size="small" onClick={() => { this.download(e.id) }}>下载</Button> : null)
            }
        ]
    }
    get_list(pageNo, filter = this.state.filter) {
        let param = JSON.parse(JSON.stringify(filter));
        param.page = pageNo || 1;
        param.size = page.size;
        this.setState({
            loading: true
        })
        axios_loanMgnt.post(repay_export_list, param).then(e => {
            this.setState({
                loading: false
            })
            if (!e.code) {
                this.setState({
                    data: format_table_data(e.data.list),
                    total: e.data.total,
                    current: e.data.current,
                })
            }
        }).catch(e => {
            this.setState({
                loading: false
            })
        })
    }
    get_select1() {
        axios_loanMgnt.post("/manage/util/getAppLabelOptions",{labelType:"BUSINESS",usage:"CONTRACT_LIST"}).then(e=>{
            if(!e.code){
                var domain=[];
                for(var i in e.data){
                    domain.push({name:e.data[i].name,val:e.data[i].name})
                }
                this.setState({
                    doamin:domain
                })
            }
        })
    }
    get_select(){
        axios_loanMgnt.post("/manage/util/getLoanAppOptions", { usage: "CONTRACT_LIST" }).then(data => {
            if (!data.code) {
                var domainType = { "bmd-cashloan": "白猫贷", "bmd-loancoop-capital": "自有资金", "bmd-gongyinglian": "供应链", "bmd-yuangongdai": "员工贷" }
                var list = data.data, domainArr = [], appArr = [], dataNew = {};
                for (var i = 0; i < list.length; i++) {
                    if (!dataNew[list[i].domain]) {
                        var json = {}
                        var arr = [];
                        json.name = domainType[list[i].domain];
                        json.val = list[i].domain
                        arr.push({ name: list[i].appName, val: list[i].appKey });
                        json.child = arr;
                        dataNew[list[i].domain] = json;
                    } else {
                        dataNew[list[i].domain].child.push({ name: list[i].appName, val: list[i].appKey })
                    }
                }
                this.setState({
                    domain: domainArr,
                    appKey: appArr,
                    select_data: dataNew
                })
            }
        })
    }
    getAppkey(e){
        axios_loanMgnt.post("/manage/util/getLoanAppOptions",{labelType:"BUSINESS",labelName:e,usage:"CONTRACT_LIST"}).then(e=>{
            if(!e.code){
                var appKey=[];
                for(var i in e.data){
                    appKey.push({name:e.data[i].appName,val:e.data[i].appKey})
                }
                this.setState({
                    appKey:appKey
                })
            }
        })
    }
    download(id) {
        axios_loanMgnt.get(repay_export_download + "?id=" + id).then(e => {
            if (!e.code) {
                window.open(e.data)
            }
        })
    }
    get_filter(data) {
        this.setState({
            filter: data
        })
        this.get_list(this.state.nowPage, data);
    }
    get_export(data) {
        axios_loanMgnt.post(repay_export_detail, data).then(e => {
            this.setState({
                loading: true
            })
        }).catch(e => {
            this.setState({
                loading: false
            })
        })
        setTimeout(() => {
            this.get_list();
        }, 1000)
    }
    get_filter_export(data) {
        var startDate = data.startDate;
        var endDate = data.endDate
        if (!startDate || !endDate) {
            message.warn("请选择导出时间");
            return;
        }
        // if (((new Date(endDate).getTime() - new Date(startDate).getTime()) / 1000 / 60 / 60 / 24) > 31) {
        //     console.log(((new Date(endDate).getTime() - new Date(startDate).getTime()) / 1000 / 60 / 60 / 24))
        //     message.warn("每次只能导出1个月数据哦~");
        //     return;
        // }
        if (!data.appKey) {
            message.warn("请选择项目");
            return;
        }
        this.get_export(data);

    }
    set_filter(filter) {
        this.filter = filter;
    }
    page_up(page, pageSize) {
        window.scrollTo(0, 0);
        this.setState({
            nowPage: page
        })
        this.get_list(page, this.state.filter);
    }
    showTotal() {
        return `共${this.state.total}条数据`
    }
    render() {
        let pagination = {
            total: this.state.total,
            current: this.state.current,
            pageSize: this.state.pageSize,
            showTotal: this.showTotal.bind(this),
            onChange: this.page_up.bind(this)
        }
        var info = {
            filter: {
                "data-get": this.get_filter_export.bind(this),
                "data-source": this.filter_export,
                "data-set": this.set_filter.bind(this),
                // "appKey": this.state.appKey,
                // "domain": this.state.doamin,
                // getAppkey:this.getAppkey.bind(this),
                button: "导出",
                "appKey": this.state.select_data,
                "domain": this.state.select_data,
            },
            tableInfo: {
                columns: this.columns,
                dataSource: this.state.data,
                pagination: pagination,
                loading: this.state.loading,
                rowKey: "key"
            },
            tableTitle: {
                left: null,
                right: null

                // <div className="export"><FilterObj data-source={this.filter_export} button="导出" data-get={this.get_filter_export.bind(this)} appKey={this.state.appKey} /></div>
            }
        }
        return (<div><List {...info} />
            <style>{`
            .export .filter{
                padding:0
            }
        `}</style>
        </div>)
    }
}
export default ComponentRoute(Export);
