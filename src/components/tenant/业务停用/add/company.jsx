import React, { Component } from 'react';
import {Row,Button,Col,Form,Modal,Table,Input,Upload,Icon} from 'antd';
import {axios_sh} from '../../../ajax/request';
import {merchant_insur_company_list,merchant_image} from '../../../ajax/api';
import {format_table_data} from '../../../ajax/tool';
import ImgViewer from '../../../templates/ImgViewer';
import {host_cxfq} from '../../../ajax/config';
const FormItem = Form.Item;
class Basic extends Component{
    constructor(props) {
        super(props);
        props.onRef(this);
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
            // },
            {
                title:"操作",
                render:(data)=>{
                    var btn=[];
                    // if(data.enable===0){
                    //     btn.push(<Button type="primary" size="small" key={1} style={{marginRight:"5px"}}>停用</Button>)
                    // }else if(data.enable===1){
                    //     btn.push(<Button type="danger" size="small" key={2} style={{marginRight:"5px"}}>启用</Button>)
                    // }
                    btn.push(<Button type="danger" size="small" key={3} onClick={()=>{this.del(data)}}>删除</Button>)
                    return btn
                }
            }
        ];
        this.bussiness=[
            {
                title:"保险公司名称",
                dataIndex:"fullName"
            },
            {
                title:"保险公司图标",
                dataIndex:"logoStorageNo",
                render:e=>{
                    return <img src={host_cxfq+merchant_image+"?storageNo="+e} alt="图标" />
                }
            }
        ]
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
    del(data){
        var selectKeys=this.state.dataSource;
        var selectArr=[];
        for(var i in selectKeys){
            selectArr.push(selectKeys[i].key);
        }
        this.setState({
            dataSource:format_table_data(this.state.dataSource.filter(todo=>todo.key!==data.key)),
            selectedRowKeys:selectArr
        });
    }
    add(){
        var selectKeys=this.state.dataSource;
        var selectArr=[];
        for(var i in selectKeys){
            selectArr.push(selectKeys[i].key);
        }
        this.setState({visible:true,selectedRowKeys:selectArr})
    }
    cancel(){
        this.setState({visible:false})
    }
    onSelectChange(selectedRowKeys,selectedRow) {
        console.log('selectedRowKeys changed: ', selectedRow,selectedRowKeys);
        this.setState({ data:selectedRow,selectedRowKeys:selectedRowKeys});
    }
    change(){
        this.setState({visible:false});
        this.setState({ dataSource:format_table_data(this.state.data) });
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
    //创建公司
    creat(){
        this.setState({
            visible_creat:true
        })
    }
    cancel_creat(){
        this.setState({
            visible_creat:false
        })
    }
    change_creat(){

    }
    render() {
        //console.log(this.state.selectedRowKeys)
        var heights=document.body.clientHeight-260;
        const modalInfo={
            visible:this.state.visible,
            title:"新增合作保险公司",
            maskClosable:false,
            onCancel:this.cancel.bind(this),
            onOk:this.change.bind(this),
            bodyStyle:{
                height:heights,
                overflowY:"auto"
            },
        };
        const modalInfo_creat={
            visible:this.state.visible_creat,
            title:"创建合作保险公司",
            maskClosable:false,
            onCancel:this.cancel_creat.bind(this),
            onOk:this.change_creat.bind(this)
        };
        const table_bus={
            rowSelection:{
                onChange:this.onSelectChange.bind(this),
                selectedRowKeys:this.state.selectedRowKeys
            },
            columns:this.bussiness,
            dataSource:this.dataSource,
            pagination:false
        }
        
        const { getFieldDecorator } = this.props.form;
        const formInfo={
            labelCol:{span:6},
            wrapperCol:{span:10},
            colon:false
        };
        const bankUpload={
            // action:host_cxfq+manage_upload,
            listType:'picture-card',
            accept:'image/*',
            fileList:this.state.bankAccountLic,
            name:'file',
            withCredentials:true,
            // onChange:this.bankUpload.bind(this),
            // onPreview:this.imgShow.bind(this)
        };
        return (
            <Row className="sh_add" >
            <div className="sh_add_card insur_company">
                <Row>
                    {/* <Col span={3} style={{paddingRight:'20px',textAlign:'left',fontSize:'14px',color:"#7F8FA4"}}>合作保险公司</Col> */}
                    <Col span={20}>
                        <Button type="primary" onClick={this.add.bind(this)} >新增合作保险公司</Button>
                        {/* <Button type="primary" onClick={this.creat.bind(this)} style={{marginLeft:"10px"}} >创建合作保险公司</Button> */}
                    </Col>
                </Row>
                <Row style={{marginTop:"20px"}}>
                    <Col span={24}>
                        <Table columns={this.columns} dataSource={this.state.dataSource} bordered pagination={false} />
                    </Col>
                </Row>
            </div>
            <Modal {...modalInfo} >
                    <Table {...table_bus} bordered />
                </Modal>
                
                <Modal {...modalInfo_creat} >
                    <Form className="sh_add border">
                    <FormItem label="保险公司名称" {...formInfo} >
                        {getFieldDecorator('name', {
                            initialValue:"",
                            rules:[{required:true,message:"请输入保险公司名称"},{pattern:/^[a-zA-Z\u4e00-\u9fa5（）()]{1,50}$/,message:"格式错误"}]
                        })(
                            <Input placeholder="请输入保险公司名称" />
                        )}

                    </FormItem>
                    <FormItem label="保险公司简称" {...formInfo} >
                        {getFieldDecorator('name1', {
                            initialValue:"",
                            rules:[{required:true,message:"请输入保险公司简称"},{pattern:/^[a-zA-Z\u4e00-\u9fa5（）()]{1,50}$/,message:"格式错误"}]
                        })(
                            <Input placeholder="请输入保险公司简称" />
                        )}

                    </FormItem>
                    <FormItem label="保险公司图标" {...formInfo} >
                        {getFieldDecorator('name2', {
                            initialValue:"",
                            rules:[{required:true,message:"请输入保险公司名称"},{pattern:/^[a-zA-Z\u4e00-\u9fa5（）()]{1,50}$/,message:"格式错误"}]
                        })(
                            <div />
                        )}
                        <Upload {...bankUpload}>
                                <div><Icon type="plus" /></div>
                        </Upload>
                    </FormItem>
                    <Row>
                        <Col className="toast" push={6} span={18}>支持jpg,jpeg,png格式的图片，大小不超过20k</Col>
                    </Row>
                    </Form>
                </Modal>

            </Row>

        )

    }
}
export default Form.create()(Basic);