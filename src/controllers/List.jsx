import React, { Component } from 'react';
import List, { ListTip } from '../views/List';
import { page } from '../ajax/config';
import PageCache from '../store/table/PageCache';

/**
 * 列表数据逻辑处理
 * @listRequestor 请求数据方法
 * @totalRequestor 请求数据统计方法
 * @columns 表头
 * @items 筛选项
 * @tableInfo 表格其他数据
 */
class ListCtrl extends Component {
    constructor(props) {
        super(props);
        this.pageStore = new PageCache(window.location.pathname);
        this.pageCache = this.pageStore.getPageInfo();
        this.filterCache = this.pageCache.filter||{};
        this.state = {
            rember:this.pageCache.rember,
            dataSource:[],
            loading:false,
            hasTotal:true,
            total:0,
            current:1
        }
        this.setFilter = ()=>{}
        this.getFilter = ()=>{}
        props.bindsetFilter(this.setFilterValue.bind(this));
        props.bindrefresh(this.requestData.bind(this));
    }
    componentDidMount(){
        this.props.bindgetFilter(this.getFilter.bind(this));
        this.setFilter (this.props.defaultFilter);
        this.setFilter (this.pageCache.filter);
        this.filter = this.getFilter();
        this.page = 1;
        if(this.props.type!=="repay") this.requestData();
        document.addEventListener("keydown", this.onKeyDown.bind(this))
    }
    requestData(){
        this.setState({loading:true,dataSource:[],total:0});
        Promise.all([this.getList(),this.getTotal()]).then(([listData,totalData])=>{
            console.log(listData)
            let list = listData.data.list;
            (list.length>0)&&totalData&&list.push(totalData);
            this.setState({
                hasTotal:!!totalData,
                dataSource:listData.data.list,
                current:this.page,
                total:listData.data.total
            })
        }).finally(()=>this.setState({loading:false}))
    }
    getList(param={}){
        let req = {
            ...this.filter,
            page:this.page,
            size:page.size,
            ...param
        }
        return this.props.listRequestor(req);
    }
    getTotal(param={}){
        return this.props.totalRequestor({...param,...this.filter})
    }
    searchList(filter){
        this.filter = filter;
        this.page = 1;
        // 缓存筛选项
        if(this.state.rember){
            this.pageStore.savePageInfo({filter,rember:true});
        }
        this.requestData();
    }
    changePage(page){
        this.page = page;
        this.requestData();
    }
    changeRember(e){
        this.setState({rember:!this.state.rember});
        this.pageStore.clearPageInfo();
    }
    setFilterValue(data){
        this.setFilter(data);
    }
    onKeyDown(e){
        if(e.keyCode !== 13) return;
        this.searchList(this.getFilter())
    }
    render() { 
        const listProps = {
            loading:this.state.loading,
            dataSource:this.state.dataSource,
            columns:this.props.columns,
            items:this.props.items,
            filterOptions:this.props.filterOptions,
            tableInfo:this.props.tableInfo,
            pageSize:page.size,
            current:this.state.current,
            total:this.state.total,
            rember:this.state.rember,
            listFoot:this.state.hasTotal&&<span style={{fontSize:"13px"}}>此合计是当前查询结果的合计</span>,
            bindpage:this.changePage.bind(this),
            bindsearch:this.searchList.bind(this),
            bindrember:this.changeRember.bind(this),
            bindfilterget:get=>this.getFilter = get,
            bindfilterset:set=>this.setFilter = set,
            bindreset:this.props.bindreset
        }
        return <List { ...listProps }>
            { this.props.listTips&&<ListTip text={this.props.listTip} /> }
            { this.props.children }
        </List>;
    }
}
ListCtrl.defaultProps = {
    listTips:true,
    defaultFilter:{},
    bindsetFilter:()=>Promise.resolve({}),
    bindgetFilter:()=>Promise.resolve({}),
    listRequestor:()=>Promise.resolve({}),
    totalRequestor:()=>Promise.resolve(null),
    bindrefresh:()=>Promise.resolve({})
}
export default ListCtrl;