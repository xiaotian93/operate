import React, { Component } from 'react';
import { Button, Form } from 'antd';
// import moment from 'moment'

// import Filter from '../ui/Filter_nomal';
import { axios_repay, axios_postloan } from '../../ajax/request';
import { host_xjd } from '../../ajax/config';
import { afterloan_overdue_auditlist , afterloan_overdue_export , statistics_select } from '../../ajax/api';
import { page , repay_status_select } from '../../ajax/config';
import { format_table_data , bmd } from '../../ajax/tool';
import UrgeModal from './components/approveModal';
import ComponentRoute from '../../templates/ComponentRoute';
import List from '../templates/list';
class Overdue extends Component{
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            modalVisible:false,
            total:[],
            filter:{},
            pageSize:page.size,
            data:[],
            list:[],
            listPage:1,
            history:[]
        };
        this.loader = [];
        this.money=0;
    }
    componentWillMount(){
        this.columns = [
            {
                title: '序号',
                dataIndex: 'key',
                render:(text,record,index)=>{
                    if(text==="合计"){
                        return text;
                    }
                    return `${index+1}`
                }
            },
            {
                title: '申请流水号',
                dataIndex: 'auditOrderNo',
            },
            {
                title: '订单编号',
                dataIndex:'domainNo'
            },
            {
                title: '客户名称',
                dataIndex:"borrowerName",
            },
            // {
            //     title: '注册手机号',
            //     dataIndex:'overdueAmount',
            //     render:(data)=> data===undefined?"--":data.money()
            // },
            {
                title: '申请类型',
                dataIndex:'type',
                render:(data)=> data==="PL_DISCOUNT"?"减免":"人工划扣"
            },
            {
                title:"申请金额",
                // dataIndex:"money",
                render:(datas)=> {
                    var type=datas.type;
                    if(datas.data){
                        var amount=JSON.parse(datas.data);
                        if(type==="PL_DISCOUNT"){
                            var discounts=amount.phaseList;
                            var money=0;
                            for(var i in discounts){
                                for(var j in discounts[i].discount){
                                    money+=Number(discounts[i].discount[j]);
                                }
                                
                            }
                            this.money+=Number(money.money())
                            return money.money();
                            
                        }else{
                            this.money+=Number(amount.amount.money())
                            return amount.amount.money()
                        }
                    }
                    

                },
                sorter: (a, b) => {
                    var type_a=a.type,money_a=0,money_b=0,type_b=b.type;
                    if(a.data){
                        var amount=JSON.parse(a.data);
                        if(type_a==="PL_DISCOUNT"){
                            var discounts=amount.phaseList;
                            var money=0;
                            for(var i in discounts){
                                for(var j in discounts[i].discount){
                                    money+=Number(discounts[i].discount[j]);
                                }
                                
                            }
                            money_a=money;
                            
                        }else{
                            
                            money_a=amount.amount
                        }
                    }
                    if(b.data){
                        var amount_b=JSON.parse(b.data);
                        if(type_b==="PL_DISCOUNT"){
                            var discounts_b=amount_b.phaseList;
                            var moneys=0;
                            for(var k in discounts_b){
                                for(var n in discounts_b[k].discount){
                                    moneys+=Number(discounts_b[k].discount[n]);
                                }
                                
                            }
                            money_b=moneys;
                            
                        }else{
                            
                            money_b=amount_b.amount
                        }
                    }
                    return Number(money_a)-Number(money_b);
                }
            },
            {
                title: '申请人',
                dataIndex:'sender',
                render:e=>e||"--"
            },
            {
                title: '申请时间',
                dataIndex:'createTime',
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"createTime",true)
                }
            },
            {
                title: '审批状态',
                dataIndex:'status',
                render:e=>{
                    var type={0:"待审批",100:"审批中",200:"审批通过",300:"审批未通过"};
                    return type[e]
                }
            },
            {
                title: '审批人',
                dataIndex:'auditor',
                render:e=>e||"--"
            },
            {
                title: '审批时间',
                dataIndex:'auditTime',
                render:e=>e||"--",
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"auditTime",true)
                }
            },
            {
                title: '操作',
                className:"operate",
                render: (data) => {
                    let content = [
                        <Button key="show" size="small" onClick={()=>{this.showUrgeModal(data,false)}}>查看</Button>
                    ]
                    if(!data.status){
                        // content.push(<Permissions key="audit" size="small" type="primary" onClick={()=>{this.showUrgeModal(data,true)}} server={global.AUTHSERVER.loan.key} tag="button" permissions={global.AUTHSERVER.loan.access.pl_audit}>审批</Permissions>)
                        content.push(<Button key="audit" size="small" type="primary" onClick={()=>{this.showUrgeModal(data,true)}} >审批</Button>)
                    }
                    return data.key==="合计"?<span />:content
                }
            }
        ];
        repay_status_select.unshift({name:"全部",val:""});
        this.filter = {
            domainNo :{
                name: "订单编号",
                type: "text",
                placeHolder: "请输入客户名称"
            },
            borrowerName :{
                name: "客户名称",
                type: "text",
                placeHolder: "请输入客户名称"
            },
            // borrower :{
            //     name: "注册手机号",
            //     type: "text",
            //     placeHolder: "请输入客户名称"
            // },
            type :{
                name:"申请类型",
                type:"select",
                placeHolder:"全部",
                values:[{val:"PL_DISCOUNT",name:"减免"},{val:"PL_DEDUCT",name:"人工划扣"}]
            },
            status :{
                name:"审批状态",
                type:"select",
                placeHolder:"全部",
                values:[{val:0,name:"待审批"},{val:200,name:"审批通过"},{val:300,name:"审批未通过"}]
            }
        }
    }
    componentDidMount(){
        var select=window.localStorage.getItem(this.props.location.pathname);
        if(select){
            if(JSON.stringify(JSON.parse(select).remberData)!=="{}"||JSON.parse(select).isRember){
                this.get_list(1,JSON.parse(select).remberData);
            }else{
                this.get_list(1,{status:"0"});
            }
        }else{
            this.get_list(1,{status:"0"});
        }
    }
    get_list(page_no=1,filter={}){
        let rqd = JSON.parse(JSON.stringify(filter));
        rqd.page = page_no;
        rqd.size = page.size;
        this.setState({
            loading:true
        })
        this.loader.push("list");
        axios_postloan.post(afterloan_overdue_auditlist,rqd).then((data)=>{
            let detail = data.data.list;
            this.loader.splice(this.loader.indexOf("list"),1);
            let total = {
                overduePrincipal:0,
                overdueAmount:0,
                repayOverduePrincipal:0,
                repayOverdueAmount:0,
            };
            for(let d in detail){
                total.overduePrincipal += detail[d].overduePrincipal;
                total.overdueAmount += detail[d].overdueAmount;
                total.repayOverduePrincipal += detail[d].repayOverduePrincipal;
                total.repayOverdueAmount += detail[d].repayOverdueAmount;
            }
            total.key = "合计";
            this.setState({
                list:format_table_data(detail,page_no,page.size),
                loading:this.loader.length>0,
                // total:detail.length>0?[total]:null,
                pageTotal:data.data.total,
                pageCurrent:data.data.current,
                // current:detail.current
            });
            (this.loader.length<=0)&&this.refresh_tabel("list");
        });
    }
    // 获取统计数据
    get_total(filter){
        this.loader.push("total");
        // this.setState({
        //     totalDes:"此合计是当前查询结果的合计",
        //     total:{money:this.money}
        // });
        // (this.loader.length<=0)&&this.refresh_tabel("total");
    }
    // 刷新列表数据
    refresh_tabel(type){
        this.setState({
            data:this.state.list
            // data:this.state.list.concat(this.state.total)
        })
    }

    // 显示催记弹窗
    showUrgeModal(data,type){
        // console.log(data)
        this.setState({
            auditOrderId :data.id,
            modalVisible:true,
            type:data.type,
            dataInfo:data,
            modalType:type,
            domainNo:data.domainNo,
        })
        let rqd = {};
        rqd.page = 1;
        rqd.size = 200;
        rqd.domainNo=data.domainNo;
        rqd.type=data.type;
        axios_postloan.post(afterloan_overdue_auditlist,rqd).then((data)=>{
            let detail = data.data.list;
            this.setState({
                history:format_table_data(detail,1,200),
            });
        });
    }

    modalHide(data){
        this.setState({
            modalVisible:false
        })
    }

    // 查看详情页
    showDetail(data){
        bmd.redirect("/dh/overdue/detail?userId="+data.userLoanId,{domainName:data.loanConfigNo||"",domainNo:data.orderNo||""});
    }

    get_filter(data){
        // let paths = this.props.location.pathname;
        // window.localStorage.setItem(paths,JSON.stringify(data))
        let filter = {};
        filter = JSON.parse(JSON.stringify(data));
        this.setState({
            filter:filter
        })
        this.get_list(this.state.listPage,filter);
        // this.get_total(filter);
    }

    // 获取下拉菜单
    get_select(){
        axios_repay.get(statistics_select).then(data=>{
            let selects = data.data;
            let temp = {};
            for(let s in selects){
                if(!selects){
                    continue;
                }
                temp[s] = [];
                for(let t in selects[s]){
                    // 商户名称没有 需要判断
                    if(!selects[s][t]){
                        continue;
                    }
                    temp[s].push({name:selects[s][t],val:selects[s][t]})
                }
                temp[s].unshift({name:"全部",val:""})
            }
            this.setState({
                ...temp
            })
        })
    }
    // 翻页
    page_up(page,pageSize){
        window.scrollTo(0,0);
        this.setState({
            modalVisible:false,
        })
        this.get_list(page,this.state.filter)
    }
    // 导出
    exportList(){
        let query = [];
        for(let f in this.state.filter){
            query.push(f+"="+this.state.filter[f]);
        }
        let url = host_xjd+afterloan_overdue_export+"?"+query.join("&");
        window.open(url);
    }
    showTotal(){
        return "共"+this.state.pageTotal+"条数据"
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
            loading:this.state.loading,
            footer:()=>this.state.totalDes,
            rowClassName:function(data){
            }
        }
        const table={
            filter:{
                "data-get":this.get_filter.bind(this),
                "data-source":this.filter,
                "phase":this.state.phase,
                "productName":this.state.productName,
                "merchantName":this.state.merchantName,
                "loanTerm":this.state.loanTerm,
                status:window.localStorage.getItem(this.props.location.pathname)?(JSON.parse(window.localStorage.getItem(this.props.location.pathname)).isRember&&JSON.parse(window.localStorage.getItem(this.props.location.pathname)).remberData.status!=="0"?JSON.parse(window.localStorage.getItem(this.props.location.pathname)).remberData.status:"0"):"0",
                "data-paths":this.props.location.pathname
            },
            tableInfo:table_props,
            tableTitle:{
                left:<span>金额单位：元</span>,
                right:null
                // <Permissions disabled type="primary" onClick={this.exportList.bind(this)} server={global.AUTHSERVER.loan.key} tag="button">导出</Permissions>
            }
        }
        return(
            <div>
                {/* <Filter data-get={this.get_filter.bind(this)} data-source={this.filter} phase={this.state.phase} productName={this.state.productName} merchantName={this.state.merchantName} loanTerm={this.state.loanTerm} />
                <Row className="table-content">
                    <div className="table-btns">
                        <span style={{marginTop:"10px"}}>金额单位:元</span>
                        <div className="text-right">
                        <Permissions type="primary" onClick={this.exportList.bind(this)} server={global.AUTHSERVER.loan.key} tag="button">导出</Permissions>
                        </div>
                    </div>
                    <Table {...table_props} bordered />
                </Row> */}
                <List {...table} />
                <UrgeModal auditOrderId={this.state.auditOrderId} visible={this.state.modalVisible} bindcancel={this.modalHide.bind(this)} type={this.state.type} data={this.state.dataInfo} modalType={this.state.modalType} domainNo={this.state.domainNo} list={this.get_list.bind(this)} history={this.state.history} />
            </div>
        )
    }
}

export default ComponentRoute(Form.create()(Overdue));
