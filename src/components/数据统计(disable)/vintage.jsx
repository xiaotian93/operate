import React, { Component } from 'react';
import { Table , Row } from 'antd';
// import moment from 'moment'

// import Filter from '../ui/Filter_nomal';
import { axios_total } from '../../ajax/request';
import { host_total } from '../../ajax/config';
import { statistics_overdue_vintage , statistics_overdue_vintage_export , statistics_overdue_total } from '../../ajax/api';
import { page } from '../../ajax/config';
import { format_table_data, format_date ,bmd} from '../../ajax/tool';
import Permissions from '../../templates/Permissions';

class Overdue extends Component{
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            filter:{
                businessName : "cash-coop-0003"
            },
            pageSize:page.size,
            total:[],
            data:[],
            list:[],
            listPage:1
        };
        this.loader = [];
    }
    componentWillMount(){
        this.columns = [
            {
                title: '日期',
                dataIndex: 'date',
                width:100,
                render:data=>format_date(data),
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"date")
                }
            },
            {
                title:"W1",
                dataIndex:"W1",
                width:70,
                render:res=>res+"%"
            },
            {
                title:"W2",
                dataIndex:"W2",
                width:70,
                render:res=>res+"%"
            },
            {
                title:"W3",
                dataIndex:"W3",
                width:70,
                render:res=>res+"%"
            },
            {
                title:"W4",
                dataIndex:"W4",
                width:70,
                render:res=>res+"%"
            },
            {
                title:"W5",
                dataIndex:"W5",
                width:70,
                render:res=>res+"%"
            },
            {
                title:"W6",
                dataIndex:"W6",
                width:70,
                render:res=>res+"%"
            },
            {
                title:"W7",
                dataIndex:"W7",
                width:70,
                render:res=>res+"%"
            },
            {
                title:"W8",
                dataIndex:"W8",
                width:70,
                render:res=>res+"%"
            },
            {
                title:"W9",
                dataIndex:"W9",
                width:70,
                render:res=>res+"%"
            },
            {
                title:"W10",
                dataIndex:"W10",
                width:70,
                render:res=>res+"%"
            },
            {
                title:"W11",
                dataIndex:"W11",
                width:70,
                render:res=>res+"%"
            },
            {
                title:"W12",
                dataIndex:"W12",
                width:70,
                render:res=>res+"%"
            },
            {
                title:"W13",
                dataIndex:"W13",
                width:70,
                render:res=>res+"%"
            },
            {
                title:"W14",
                dataIndex:"W14",
                width:70,
                render:res=>res+"%"
            },
            {
                title:"W15",
                dataIndex:"W15",
                width:70,
                render:res=>res+"%"
            }
        ];
        this.filter = {
            time :{
                name: "统计周期",
                type: "select",
                placeHolder:"全部"
            }
        }
    }
    componentDidMount(){
        this.get_list(1,this.state.filter);
    }

    // 展开数据
    flodData(list){
        let res = [];
        for(let l in list){
            let detail = list[l];
            let obj = {};
            for(let d in detail){
                if(Array.isArray(detail[d])){
                    for(let t in detail[d]){
                        obj[detail[d][t].type] = detail[d][t].rate;
                    }
                }else{
                    obj[d] = detail[d];
                }
            }
            res.push(obj);
        }
        return res;
    }

    get_list(page_no=1,filter={}){
        let rqd = JSON.parse(JSON.stringify(filter));
        rqd.page = page_no;
        rqd.size = page.size;
        this.setState({
            loading:true
        })
        this.loader.push("list");
        axios_total.post(statistics_overdue_vintage,rqd).then((data)=>{
            let detail = data.data.list;
            this.loader.splice(this.loader.indexOf("list"),1);
            this.setState({
                list:format_table_data(this.flodData(detail)),
                loading:this.loader.length>0,
                pageCurrent:data.data.current,
                pageTotal:data.data.total
            });
            (this.loader.length<=0)&&this.refresh_tabel("list");
        });
    }
    // 获取统计数据
    get_total(filter){
        this.loader.push("total");
        axios_total.post(statistics_overdue_total,filter).then(res=>{
            this.loader.splice(this.loader.indexOf("total"),1);
            let total = res.data;
            total.key="total";
            total.overdueTerm = "合计";
            this.setState({
                loading:this.loader.length>0,
                totalDes:"此合计是当前查询结果的合计",
                total:total
            });
            (this.loader.length<=0)&&this.refresh_tabel("total");
        })
    }
    // 刷新列表数据
    refresh_tabel(type){
        this.setState({
            data:this.state.list.concat(this.state.total)
        })
    }
    get_filter(data){
        let paths = this.props.location.pathname;
        window.localStorage.setItem(paths,JSON.stringify(data))
        let filter = {};
        filter = JSON.parse(JSON.stringify(data));
        filter.businessName = "cash-coop-0003";
        this.setState({
            filter:filter
        })
        this.get_list(this.state.listPage,filter);
        // this.get_total(filter);
    }

    // 翻页
    page_up(page,pageSize){
        this.setState({
            listPage:page
        })
        this.get_list(page,this.state.filter);
    }
    // 显示总数
    showTotal(){
        return "共"+this.state.pageTotal+"条数据"
    }
    // 导出
    exportList(){
        let query = [];
        for(let f in this.state.filter){
            query.push(f+"="+this.state.filter[f]);
        }
        let url = host_total+statistics_overdue_vintage_export+"?"+query.join("&");
        window.open(url);
    }
    render (){
        let pagination = {
            total : this.state.pageTotal,
            current : this.state.pageCurrent,
            pageSize : this.state.pageSize,
            showTotal:this.showTotal.bind(this),
            onChange : this.page_up.bind(this)
        }
        const table_props = {
            rowKey:"key",
            columns:this.columns ,
            dataSource:this.state.data,
            pagination : pagination,
            scroll:{y:window.innerHeight-310,x:1200},
            className:"bmd-table-scroll",
            loading:this.state.loading,
            footer:()=>this.state.totalDes
        }
        return(
            <div>
                {/* <Filter data-get={this.get_filter.bind(this)} data-source={this.filter} /> */}
                <Row className="table-content">
                    <div style={{marginBottom:"10px"}}>
                        <div className="text-right">
                        <Permissions type="primary" onClick={this.exportList.bind(this)} server={global.AUTHSERVER.loanStats.key} permissions={global.AUTHSERVER.loanStats.access.vintage_overdue_export} tag="button">导出</Permissions>
                        </div>
                    </div>
                    <Table {...table_props} bordered />
                </Row>
            </div>
        )
    }
}

export default Overdue;
