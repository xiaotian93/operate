import React, { Component } from 'react';
import {Row,Button,Col,Form,Table} from 'antd';
import {axios_sh} from '../../../ajax/request';
import {merchant_insur_company_list,merchant_image} from '../../../ajax/api';
import {format_table_data,format_time} from '../../../ajax/tool';
import {host_cxfq} from '../../../ajax/config';
import ImgViewer from '../../../templates/ImgViewer';
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
            selectedRowKeys:[],
            id_card_storage_no_fm:[],
            id_card_storage_no_zm:[]
        };
        this.count=1;
        this.dataSource=[]
    }
    componentDidMount(){
        this.getShNo();
        this.columns=[
            {
                title:"序号",
                dataIndex:"key"
            },
            {
                title:"新增时间",
                dataIndex:"createTime",
                render:e=>{
                    return format_time(e)
                }
            },
            {
                title:"账户ID",
                dataIndex:"id",
                
            },
            {
                title:"账户名",
                dataIndex:"username"
            },
            {
                title:"姓名",
                dataIndex:"name"
            },
            {
                title:"身份证号",
                dataIndex:"idCard"
            },
            {
                title:"手机号",
                dataIndex:"phone"
            },
            {
                title:"邮箱",
                dataIndex:"email"
            },
            {
                title:"账户状态",
                dataIndex:"enable",
                render:e=>{
                    if(e===0){
                        return "正常"
                    }else if(e===1){
                        return "停用"
                    }else{
                        return "-"
                    }
                }
            },
            {
                title:"操作",
                render:(data)=>{
                    var btn=[];
                    btn.push(<Button type="primary" size="small" key={4} onClick={()=>{this.img_show(data)}}>身份证</Button>)
                    return btn
                }
            }
        ];
        
        if(this.state.id){
            setTimeout(()=>{
                this.editData();
            },300)
        }
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
        var userInfos=data.userInfos;
        this.setState({dataSource:userInfos})
    }
    
    img_show(data){
        var img=[],zm={},fm={};
        zm.src=host_cxfq+merchant_image+"?storageNo="+data.idCardStorageNoZm;
        zm.des="身份证正面";
        fm.src=host_cxfq+merchant_image+"?storageNo="+data.idCardStorageNoFm;
        fm.des="身份证反面";
        img.push(zm);
        img.push(fm);
        new ImgViewer(img,{index:0,show:true});

    }
    render() {
        //console.log(this.state.selectedRowKeys)
        
        return (
            <Row className="sh_add" >
            <div className="sh_add_card insur_company">
                
                <Row>
                    <Col span={24}>
                        <Table columns={this.columns} dataSource={format_table_data(this.state.dataSource)} bordered pagination={false} rowKey="id" />
                    </Col>
                </Row>
            </div>
            
                
                
            </Row>

        )

    }
}
export default Form.create()(Basic);