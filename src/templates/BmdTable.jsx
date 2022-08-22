import React, { Component } from 'react';
import { Table , Row } from 'antd';

import Filter from '../components/ui/Filter_nomal';
import { axios_nomal } from '../ajax/request'
import { page } from '../ajax/config';
import { format_table_data } from '../ajax/tool';

/**
 * path 列表 请求地址 String
 * reqData 请求数据
 * columns 表格数据配置 Array Obj
 * list-key 请求列表数据的key String
 * row-key 请求列表数据的key String
 * rowSelection 表格选择配置 Object
 * filter 筛选项配置 Object
 * filter-datas 表格下拉菜单数据key Array Str
 * filter-get 筛选项查询时间  Func
 * bindmain 组件this绑定  Func
 */

class BmdTable extends Component{
    constructor(props) {
        super(props);
        this.state = {
            filterProps:props.filter||false,
            filter_datas:props['filter-datas'],
            list_key:props["list-key"]||"data",
            loading:false,
            path:props.path,
            axios:props.axios||axios_nomal,
            columns:props.columns,
            page:1,
            total:0,
            current:0,
            filter:{},
            source:[]
        };
        this.reqData = props["req-data"]||{};
        if(props["bindmain"]){
            props["bindmain"](this)
        };
    }
    componentWillMount(){
        
    }
    componentDidMount(){
        // let paths = this.props.location.pathname;
        // var select= JSON.parse(window.localStorage.getItem(paths));
        // if(select){
        //     this.get_list(1,select);
        // }else{
        //     this.get_list();
        // }
    }
    // 获取客户列表
    get_list(page_no=1,filter={}){
        let rqd = JSON.parse(JSON.stringify(filter));
        let staticData = this.reqData;
        rqd = {
            ...rqd,
            ...staticData
        }
        rqd.page = page_no;
        rqd.size = page.size;  
        rqd.page_size = page.size;  
        this.setState({
            loading:true
        })
        this.state.axios.post(this.state.path,rqd).then((data)=>{
            let list = data[this.state.list_key];
            let total = data.totalPage?data.totalPage*page.size:data.total*page.size;

            this.setState({
                source:format_table_data(list),
                loading:false,
                current:data.current||data.currentPage,
                total:total
            })
        });
    }
    
    // 刷新列表
    refresh_list(){
        this.get_list(1,this.state.filter);
    }

    // 更新列表
    update_list(){
        this.get_list(this.state.page,this.state.filter);
    }

    // 获取筛选值
    get_filter(data){
        let filter = {};
        filter = JSON.parse(JSON.stringify(data));
        // let paths = this.props.location.pathname;
        // window.localStorage.setItem(paths,JSON.stringify(filter))
        this.setState({
            page:1,
            filter:filter
        })
        if(this.props["filter-get"]){
            this.props["filter-get"](filter);
        }
        this.get_list(1,filter);
    }
    
    // 翻页
    page_up(page){
        this.setState({
            page:page
        })
        this.get_list(page,this.state.filter);
    }
    render (){
        let pagination = {
            total : this.state.total,
            current : this.state.current,
            pageSize : page.size,
            onChange : this.page_up.bind(this)
        }
        let rowSelection = {
            selectedRows:this.state.selectedRows,
            selectedRowKeys:this.state.selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRows,
                    selectedRowKeys
                })
            },
            getCheckboxProps: this.props.rowSelection?this.props.rowSelection.getCheckboxProps:null,
        }
        const table_props = {
            columns:this.state.columns ,
            dataSource:this.state.source,
            pagination : pagination,
            rowKey:this.props["row-key"]||"key",
            rowSelection:this.props.rowSelection?rowSelection:null,
            loading:this.state.loading,
        }
        let selects = this.state.filter_datas||[];
        let select_props = {};
        for(let s in selects){
            select_props[selects[s]] = this.state[selects[s]]
        }
        // let paths = this.props.location.pathname;
        let filter = "";
        if(this.state.filter){
            filter = <Filter data-get={this.get_filter.bind(this)} data-set={this.props["filter-set"]} data-source={this.state.filterProps} {...select_props} />
        }
        return(
            <div>
                { filter }
                <Row style={{padding:"20px"}}>
            <Row style={{background:"#fff"}}>
            <Row className="table-content">
                    <div className="table-btns">
                        {this.props.children}
                    </div>
                    <Table {...table_props} bordered />
                </Row>
            </Row>
            </Row>
                
            </div>
        )
    }
}

export default BmdTable;