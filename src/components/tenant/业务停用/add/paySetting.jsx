import React, { Component } from 'react';
import {Row,Button,Table,Col,Form,Select,Modal,Input} from 'antd';
import {axios_sh} from '../../../ajax/request';
import {bank_list,merchant_pay_setting,merchant_detail} from '../../../ajax/api';
import location_data from '../../../utils/province_city';
import {format_time,format_table_data} from '../../../ajax/tool';
const FormItem = Form.Item;
const Option = Select.Option;
class Basic extends Component{
    constructor(props) {
        super(props);
        props.onRef(this);
        this.state = {
            visible:false,
            bank:[],
            dataSource:[],
            id:props.id,
            is_enable:false
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
            {
                title:"账户名",
                dataIndex:"name"
            },
            {
                title:"账户简称",
                dataIndex:"shortName"
            },
            {
                title:"账号",
                dataIndex:"bankCard"
            },
            {
                title:"省份",
                dataIndex:"province"
            },
            {
                title:"市",
                dataIndex:"city"
            },
            {
                title:"区/县",
                dataIndex:"area"
            },
            {
                title:"开户行",
                dataIndex:"headBank"
            },
            {
                title:"开户行支行",
                dataIndex:"bankName"
            },
            {
                title:"操作",
                render:(data)=>{
                    return <a className="ant-btn ant-btn-denger ant-btn-sm" onClick={()=>{this.del(data)}} >删除</a>
                }
            }
        ];
        this.columns_edit=[
            {
                title:"序号",
                dataIndex:"key"
            },
            {
                title:"新增时间",
                dataIndex:"paySettingCreateTime",
                render:e=>{
                    return e?format_time(e):"-"
                }
            },
            {
                title:"账户名",
                dataIndex:"name"
            },
            {
                title:"账户简称",
                dataIndex:"shortName"
            },
            {
                title:"账号",
                dataIndex:"bankCard"
            },
            {
                title:"省份",
                dataIndex:"province"
            },
            {
                title:"市",
                dataIndex:"city"
            },
            {
                title:"区/县",
                dataIndex:"area"
            },
            {
                title:"开户行",
                dataIndex:"headBank"
            },
            {
                title:"开户行支行",
                dataIndex:"bankName"
            },
            {
                title:"状态",
                dataIndex:"enable",
                render:e=>{
                    if(e===1){
                        return "停用"
                    }else if(e===0){
                        return "正常"
                    }else{
                        return "-"
                    }
                    
                }
            },
            {
                title:"操作",
                // fixed:"right",
                render:(data)=>{
                    if(data.enable===1){
                        return <Button type="primary" size="small" onClick={()=>{this.pay_change(data.id,0,true)}} >启用</Button>
                    }else if(data.enable===0){
                        return <Button type="danger" size="small" onClick={()=>{this.pay_change(data.id,1,false)}} >停用</Button>
                    }else{
                        return "-"
                    }
                    
                }
            }
        ];
        if(this.state.id){
            //setTimeout(()=>{
                this.editData()
            //},200)

        }
    }
    componentDidMount(){
        this.set_province();
    }
    pay_change(id,state,execute){
        if(execute){
            axios_sh.get(merchant_pay_setting+"?paySettingId="+id+"&targetStatus="+state).then(e=>{
                if(state){
                    this.setState({
                        is_enable:false
                    })
                }
            axios_sh.get(merchant_detail+"?id="+this.state.id).then((e)=>{
                if(!e.code){
                    console.log(this.dataSource)
                    var tem_arr=e.data.paySettings||[];
                    for(var i in this.dataSource){
                        if(!this.dataSource[i].id){
                            tem_arr.push(this.dataSource[i]);
                        }
                    }
                    this.setState({
                        dataSource:format_table_data(tem_arr)
                    })
                    window.localStorage.setItem("detail",JSON.stringify(e.data));
                }
            });
        })
        }else{
            this.setState({
                is_enable:true,
                change_id:id
            })
        }
        
    }
    getShNo(){
        axios_sh.get(bank_list).then(e=>{
            if(!e.code){
                this.setState({
                    bank:e.data
                })
            }
        })
    }
    del(data){
        console.log(this.state.dataSource.filter(todo=>todo.key!==data.key))
        this.setState({
            dataSource:this.state.dataSource.filter(todo=>todo.key!==data.key)
        });
        this.dataSource=this.state.dataSource.filter(todo=>todo.key!==data.key)
    }
    add(){
        this.setState({visible:true})
    }
    cancel(){
        this.setState({visible:false})
        this.props.form.resetFields();
    }
    addData(){
        this.props.form.validateFields((err,data)=>{
            if(!err){
                console.log(data)
                this.count++;
                data.key=this.count;
                data.shortName=data.shortName||data.name;
                this.dataSource.unshift(data);
                this.setState({visible:false,dataSource:format_table_data(this.dataSource)});
                this.props.form.resetFields();
            }
        });
    }
    editData(){
        var data=JSON.parse(window.localStorage.getItem("detail"));
        var paySettings=data.paySettings;
        var payArr=[];
        for(var pa in paySettings){
            this.count++;
            paySettings[pa].key=this.count;
            payArr.push(paySettings[pa]);
        }
        this.dataSource=payArr;
        this.setState({dataSource:format_table_data(payArr)})
    }
    // 设置省市区
    set_province(){
        let provinces = [];
        for(let p in location_data){
            provinces.push(<Option key={p} value={p}>{p}</Option>);
        }
        this.setState({
            province:provinces
        })
        // this.props.form.setFieldsValue({"province":key});
        // this.set_city(key);
    }
    // 设置城市
    set_city(val){
        let citys = [],citys_data=location_data[val];
        for(let c in citys_data){

            citys.push(<Option key={c} value={c}>{c}</Option>)
        }
        this.setState({
            city:citys
        })
        this.props.form.setFieldsValue({"city":undefined});
        // this.set_county(key,val);
    }
    // 设置区县
    set_county(val,pro){
        if(!val){
            return;
        }
        console.log(val,pro)
        let province = pro||this.props.form.getFieldValue("province");
        let countys_data = location_data[province][val];
        let countys = [];
        for(let c in countys_data){
            countys.push(<Option key={c} value={countys_data[c]}>{countys_data[c]}</Option>)
        }
        this.setState({
            county:countys
        })
        this.props.form.setFieldsValue({"area":undefined})
    }
    //停用二次确认
    payok(){
        this.pay_change(this.state.change_id,1,true)
    }
    paycancel(){
        this.setState({
            is_enable:false
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const modalInfo={
            visible:this.state.visible,
            title:"新增收款账户",
            maskClosable:false,
            onCancel:this.cancel.bind(this),
            onOk:this.addData.bind(this)
        };
        const formInfoSmall={
            labelCol:{span:5},
            wrapperCol:{span:10},
            colon:false,
            className:"tableForm"
        };
        const formInfoSmalls={
            labelCol:{span:10},
            wrapperCol:{span:14},
            colon:false,
            className:"tableForm"
        };
        const enable={
            visible:this.state.is_enable,
            title:null,
            maskClosable:false,
            onCancel:this.paycancel.bind(this),
            onOk:this.payok.bind(this)
        }
        return (
            <Row className="sh_add" >
            <Row className="sh_add_card">
                <Row>
                    {/* <Col span={2} style={{paddingRight:'20px',textAlign:'left',fontSize:'14px',color:"#7F8FA4",}}>放款账户</Col> */}
                    <Col span={20}>
                        <Button type="primary" onClick={this.add.bind(this)} >新增收款账户</Button>
                    </Col>
                </Row>
                <Row style={{marginTop:"20px"}}>
                        <Table columns={this.state.id?this.columns_edit:this.columns} dataSource={this.state.dataSource} bordered pagination={false} rowKey="bankCard" />
                </Row>
            </Row>
                <Modal {...modalInfo} >
                    <Form className="modal">
                        <FormItem label="账户名" {...formInfoSmall} >
                            {getFieldDecorator('name',{
                                rules:[{pattern:/^[0-9a-zA-Z\u4e00-\u9fa5（）()]{1,50}$/,message:"格式错误"},{required:true,message:"请输入账户名信息"}]
                            })(
                                <Input placeholder="请输入账户名信息" />
                            )}

                        </FormItem>
                        <FormItem label="账户简称(选填)" {...formInfoSmall} >
                            {getFieldDecorator('shortName',{
                                rules:[{pattern:/^[0-9a-zA-Z\u4e00-\u9fa5（）()]{1,50}$/,message:"格式错误"}]
                            })(
                                <Input placeholder="请输入账户简称" />
                            )}

                        </FormItem>
                        <FormItem label="账号" {...formInfoSmall} >
                            {getFieldDecorator('bankCard', {
                                rules:[{pattern:/^[0-9]{1,25}$/,message:"格式错误"},{required:true,message:"请输入账号信息"}]
                            })(
                                <Input placeholder="请输入账号信息" />
                            )}

                        </FormItem>
                        <Row>
                            <Col span={12} >
                                <FormItem {...formInfoSmalls} label="开户行" >
                                    {getFieldDecorator('province', {
                                        rules:[{required:true,message:"请选择省份"}]
                                    })(
                                        <Select placeholder="省份" onChange={this.set_city.bind(this)}>
                                            {this.state.province}
                                        </Select>
                                    )}

                                </FormItem>
                            </Col>
                            <Col span={6} style={{marginLeft:"5px"}}>
                                <FormItem label="" >
                                    {getFieldDecorator('city', {
                                        rules:[{required:true,message:"请选择市"}]
                                    })(
                                        <Select placeholder="市" onChange={this.set_county.bind(this)}>
                                            {this.state.city}
                                        </Select>
                                    )}

                                </FormItem>
                            </Col>
                            <Col span={5} style={{marginLeft:"5px"}}>
                                <FormItem label="" >
                                    {getFieldDecorator('area', {
                                        rules:[{required:true,message:"请选择区/县"}]
                                    })(
                                        <Select placeholder="区/县">
                                            {this.state.county}
                                        </Select>
                                    )}

                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12} push={5} >
                                <FormItem {...formInfoSmalls} >
                                    {getFieldDecorator('headBank', {
                                        rules:[{required:true,message:"请选择银行"}]
                                    })(
                                        <Select placeholder="请选择银行">
                                            {
                                                this.state.bank.map((i,k)=>{
                                                    return <Option value={i.name} key={k} >{i.name}</Option>
                                                })
                                            }
                                        </Select>
                                    )}

                                </FormItem>
                            </Col>
                            <Col span={10} style={{marginLeft:"5px"}}>
                                <FormItem label="" >
                                    {getFieldDecorator('bankName', {
                                        rules:[{pattern:/^[\u4e00-\u9fa5]{1,25}$/,message:"格式错误"},{required:true,message:"请输入开户行名称"}]
                                    })(
                                        <Input placeholder="请输入开户行名称" />
                                    )}

                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
                <Modal {...enable}>停用后，信息不再展示到分期进件系统，确认停用？</Modal>
            </Row>

        )

    }
}
export default Form.create()(Basic);