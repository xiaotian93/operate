import React, { Component } from 'react';
import { Form } from 'antd';

// import moment from 'moment';
import TableNormal from '../../../templates/TableNormal';
import { axios_sh } from '../../../ajax/request';
import { capital_account_history , capital_business_type } from '../../../ajax/api';
import { format_time , page_go ,bmd} from '../../../ajax/tool';

class Detail extends Component{
    //构造器
	constructor(props) {
        super(props);
        this.state = {
            source:[],
            loading:true,
            business_type:[]
        };
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
                title: '请求流水号',
                width:"13%",
                dataIndex: 'requestId',
            },
            {
                title: '请求发起时间',
                dataIndex: 'requestTime',
                render:data=>{
                    return format_time(data)
                },
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"requestTime")
                }
            },
            {
                title: '请求确认时间',
                dataIndex: 'confirmTime',
                render:data=>{
                    return format_time(data)
                },
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"confirmTime")
                }
            },
            {
                title: '操作人',
                dataIndex: 'operator',
                render:data=>{
                    return data?data:"系统自动"
                }
            },	
            {
                title: '关联订单编号',
                width:"22%",
                dataIndex: 'orderNo'
            },
            {
                title: '业务类型',
                dataIndex: 'groupStr'
            },
            {
                title: '借款人',
                width:"15%",
                dataIndex: 'borrower'
            },			
            {
                title: '请求金额',
                dataIndex: 'amount',
                render:data=>{
                    return data.money()
                },
                sorter: (a, b) => {
                    return bmd.getSort(a,b,"amount")
                }
            }
		];

        this.filter = {
            time:{
                name:"请求发起时间",
                type:"range_date",
                feild_s:"start_time",
                feild_e:"end_time",
                placeHolder:['开始日期',"结束日期"]
            },
            group:{
                name:"业务类型",
                type:"select",
                placeHolder:"全部",
                values:"business_type"
            },
            order_no:{
                name:"关联订单编号",
                type:"text",
                placeHolder:"请输入关联订单编号"
            }
        }
	}

    componentDidMount(){
        this.business_type_get();
    }

    // 获取业务类型
    business_type_get(){
        axios_sh.post(capital_business_type).then(data=>{
            let list = data.data;
            let values = [];
            values.push({name:"全部",val:""})
            for(let l in list){
                values.push({name:list[l].desc,val:list[l].value})
            }
            this.setState({
                business_type:values
            })
        })
    }

    // 设置筛选项下拉数据
    bindmain(main){
        this.table = main;
    }

    // 资金确认
    capital_confirm(obj){
        page_go("/zj/confirm/repay?request_id="+obj.requestId+"&type="+obj.groupStr);
    }

    render(){
        return(            
        <div>
            <TableNormal 
                axios={axios_sh} 
                path={capital_account_history} 
                columns={this.columns}
                filter={this.filter}
                data-paths={this.props.location.pathname}
                // filter-datas = {["business_type"]}
                select_props={{
                    business_type:this.state.business_type
                }}
                filter-get={this.filter_get}
                // bindmain={this.bindmain.bind(this)} 
                tableTitle={{left:<span>金额单位：元</span>,right:null}}
            />
            
        </div>
    );      
    }
}

export default Form.create()(Detail);