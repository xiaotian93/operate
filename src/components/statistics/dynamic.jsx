import React, { Component } from 'react';
import { Table , Row } from 'antd';
// import moment from 'moment'

// import Filter from '../ui/Filter_nomal';
import { axios_total } from '../../ajax/request';
import { host_total } from '../../ajax/config';
import { statistics_overdue_dynamic , statistics_overdue_dynamic_export , statistics_overdue_total } from '../../ajax/api';
import { page } from '../../ajax/config';
import { format_table_data, bmd, format_date } from '../../ajax/tool';
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
                dataIndex: 'loanDate',
                render:data=>format_date(data),
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"loanDate")
                }
            },
            {
                title: '放款金额',
                width:90,
                dataIndex: 'loanAmount',
                render:data=>bmd.money(data),
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"loanAmount")
                }
            },
            {
                title: '逾期金额占比',
                width:106,
                dataIndex: 'overdueAmount',
                render:(data,row)=>Math.round(data/row.loanAmount*10000)/100+"%"
            },
            {
                title:"D1",
                width:70,
                dataIndex:"D1",
                render:res=> res+"%"
            },
            {
                title:"D2",
                width:70,
                dataIndex:"D2",
                render:res=> res+"%"
            },
            {
                title:"D3",
                width:70,
                dataIndex:"D3",
                render:res=> res+"%"
            },
            {
                title:"D4",
                width:70,
                dataIndex:"D4",
                render:res=> res+"%"
            },
            {
                title:"D5",
                width:70,
                dataIndex:"D5",
                render:res=> res+"%"
            },
            {
                title:"D6",
                width:70,
                dataIndex:"D6",
                render:res=> res+"%"
            },
            {
                title:"D7",
                width:70,
                dataIndex:"D7",
                render:res=> res+"%"
            },
            {
                title:"D8",
                width:70,
                dataIndex:"D8",
                render:res=> res+"%"
            },
            {
                title:"D9",
                width:70,
                dataIndex:"D9",
                render:res=> res+"%"
            },
            {
                title:"D10",
                width:70,
                dataIndex:"D10",
                render:res=> res+"%"
            },
            {
                title:"D11",
                width:70,
                dataIndex:"D11",
                render:res=> res+"%"
            },
            {
                title:"D12",
                width:70,
                dataIndex:"D12",
                render:res=> res+"%"
            },
            {
                title:"D13",
                width:70,
                dataIndex:"D13",
                render:res=> res+"%"
            },
            {
                title:"D14",
                width:70,
                dataIndex:"D14",
                render:res=> res+"%"
            },
            {
                title:"D15",
                width:70,
                dataIndex:"D15",
                render:res=> res+"%"
            },
            {
                title:"D16",
                width:70,
                dataIndex:"D16",
                render:res=> res+"%"
            },
            {
                title:"D17",
                width:70,
                dataIndex:"D17",
                render:res=> res+"%"
            },
            {
                title:"D18",
                width:70,
                dataIndex:"D18",
                render:res=> res+"%"
            },
            {
                title:"D19",
                width:70,
                dataIndex:"D19",
                render:res=> res+"%"
            },
            {
                title:"D20",
                width:70,
                dataIndex:"D20",
                render:res=> res+"%"
            },
            {
                title:"D21",
                width:70,
                dataIndex:"D21",
                render:res=> res+"%"
            },
            {
                title:"D22",
                width:70,
                dataIndex:"D22",
                render:res=> res+"%"
            },
            {
                title:"D23",
                width:70,
                dataIndex:"D23",
                render:res=> res+"%"
            },
            {
                title:"D24",
                width:70,
                dataIndex:"D24",
                render:res=> res+"%"
            },
            {
                title:"D25",
                width:70,
                dataIndex:"D25",
                render:res=> res+"%"
            },
            {
                title:"D26",
                width:70,
                dataIndex:"D26",
                render:res=> res+"%"
            },
            {
                title:"D27",
                width:70,
                dataIndex:"D27",
                render:res=> res+"%"
            },
            {
                title:"D28",
                width:70,
                dataIndex:"D28",
                render:res=> res+"%"
            },
            {
                title:"D29",
                width:70,
                dataIndex:"D29",
                render:res=> res+"%"
            },
            {
                title:"D30",
                width:70,
                dataIndex:"D30",
                render:res=> res+"%"
            },
            {
                title:"D60",
                width:70,
                dataIndex:"D60",
                render:res=> res+"%"
            },
            {
                title:"D90",
                width:70,
                dataIndex:"D90",
                render:res=> res+"%"
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
        axios_total.post(statistics_overdue_dynamic,rqd).then((data)=>{
            let detail = data.data.list;
            console.log(this.flodData(detail));
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
        let url = host_total+statistics_overdue_dynamic_export+"?"+query.join("&");
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
            className:"bmd-table-scroll",
            columns:this.columns ,
            dataSource:this.state.data,
            pagination : pagination,
            scroll:{x:2540,y:window.innerHeight-310},
            loading:this.state.loading,
            footer:()=>this.state.totalDes
        }
        return(
            <div>
                {/* <Filter data-get={this.get_filter.bind(this)} data-source={this.filter} /> */}
                <Row className="table-content">
                    <div className="table-btns">
                        <span style={{lineHeight: "28px",background: "#FFFAE5",padding:"0 5px",fontSize:"12px",color:"rgba(0,0,0,0.65)"}}>金额单位:元</span>
                        <div className="text-right">
                        <Permissions type="primary" onClick={this.exportList.bind(this)} server={global.AUTHSERVER.loanStats.key} permissions={global.AUTHSERVER.loanStats.access.dynamic_overdue_export} tag="button">导出</Permissions>
                        </div>
                    </div>
                    <Table {...table_props} bordered />
                </Row>
            </div>
        )
    }
}

export default Overdue;
