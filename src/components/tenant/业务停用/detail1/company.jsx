import React, { Component } from 'react';
import {Row,Col,Form,Table} from 'antd';
import {axios_sh} from '../../../ajax/request';
import {merchant_insur_company_list,merchant_image} from '../../../ajax/api';
import {format_table_data} from '../../../ajax/tool';
import ImgViewer from '../../../templates/ImgViewer';
import {host_cxfq} from '../../../ajax/config';
class Basic extends Component{
    constructor(props) {
        super(props);
        this.state = {
            visible:false,
            bank:[],
            dataSource:[],
            bussiness:[],
            data:[],
            id:props.id,
            selectedRowKeys:[]
        };
        this.count=1;
        this.dataSource=[]
    }
    componentWillMount(){
        this.getShNo();
        this.columns=[
            {
                title:"序号",
                dataIndex:"key"
            },
            // {
            //     title:"新增时间",
            //     dataIndex:"createTime",
            //     render:e=>{
            //         return format_time(e)
            //     }
            // },
            {
                title:"保险公司图标",
                dataIndex:"logoStorageNo",
                render:e=>{
                    return <img src={host_cxfq+merchant_image+"?storageNo="+e} onClick={()=>{this.img_show(e)}} alt="图标" />
                }
            },
            {
                title:"保险公司名称",
                dataIndex:"fullName"
            },
            {
                title:"保险公司简称",
                dataIndex:"name"
            },
            // {
            //     title:"状态",
            //     dataIndex:"enable",
            //     render:e=>{
            //         if(e===0){
            //             return "正常"
            //         }else if(e===1){
            //             return "停用"
            //         }else{
            //             return "-"
            //         }
            //     }
            // }
        ];
        
        // this.editData();
        if(this.state.id){
            setTimeout(()=>{
                this.editData();
            },300)
        }
    }
    img_show(e){
        var imgs={
            src:host_cxfq+merchant_image+"?storageNo="+e
        }
        new ImgViewer([imgs],{index:0,show:true});
    }
    getShNo(){
        axios_sh.get(merchant_insur_company_list).then(e=>{
            if(!e.code){
                this.dataSource=format_table_data(e.data)
            }
        })
    }
    
    editData(){
        // this.getShNo();
        var data=JSON.parse(window.localStorage.getItem("detail"));
        var insurCompanies=data.insurCompanies;
        var company_data=JSON.parse(window.localStorage.getItem("companyList"));
        var dataArr=[],keyArr=[];
        for(var i in insurCompanies){
            for(var j in company_data){
                if(Number(insurCompanies[i].id)===Number(company_data[j].id)){
                    dataArr.push(company_data[j]);
                    keyArr.push(Number(company_data[j].key));
                }
            }

        }
        this.setState({dataSource:format_table_data(dataArr),selectedRowKeys:keyArr})
    }
    
    render() {
        //console.log(this.state.selectedRowKeys)
        
        return (
            <Row className="sh_add" >
            <div className="sh_add_card insur_company">
                
                <Row>
                    <Col span={24}>
                        <Table columns={this.columns} dataSource={this.state.dataSource} bordered pagination={false} />
                    </Col>
                </Row>
            </div>
            </Row>

        )

    }
}
export default Form.create()(Basic);