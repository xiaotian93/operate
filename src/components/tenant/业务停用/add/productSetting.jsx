import React, { Component } from 'react';
import {Row,Form,Select,message} from 'antd';
import Products from './productDetail_new';
import {prodoct_use} from '../../../ajax/api';
import {axios_sh} from '../../../ajax/request';
import Repay from './repaySetting';
const FormItem = Form.Item;
const Option = Select.Option;
var del_id="";
class Product extends Component{
    constructor(props) {
        super(props);
        props.onRef(this);
        this.state = {
            discount1:'',
            discount2:'',
            discount3:'',
            discount1Show:1,
            discount2Show:1,
            discount3Show:1,
            product:props.product,
            id:props.id,
            productDetail:"",
            product_select:[],
            select_val:window.localStorage.getItem("detail")?JSON.parse(window.localStorage.getItem("detail")).basic.productIds:[]
        };
        this.product=[];
        this.refArr=[];
    }
    componentWillMount(){
        var data=JSON.parse(window.localStorage.getItem('productList'));
        for(var i in data){
            this.product.push(<Option key={i} value={data[i].id.toString()} aa={data[i]}>{data[i].name}</Option>)
        }
        if(this.state.id){
            setTimeout(()=>{
                this.detailData()
                this.repay.editData();
            },200)
        }
    }
    discount1(e){
        for(var i=1;i<4;i++){
            if(i.toString()===e.target.value||i.toString()===this.state.discount2||i.toString()===this.state.discount3){
                this.setState({
                    ["discount2_"+e.target.value]:true,
                    ["discount3_"+e.target.value]:true
                });
            }else{
                this.setState({
                    ["discount2_"+i]:false,
                    ["discount3_"+i]:false
                });
            }
        }
        this.setState({
            discount1:e.target.value
        });
        // this.props.form.setFieldsValue({discount1Payer:e.target.value})
    }
    discount2(e){
        for(var i=1;i<4;i++){
            if(i.toString()===e.target.value||i.toString()===this.state.discount1||i.toString()===this.state.discount3){
                this.setState({
                    ["discount1_"+e.target.value]:true,
                    ["discount3_"+e.target.value]:true
                });
            }else{
                this.setState({
                    ["discount1_"+i]:false,
                    ["discount3_"+i]:false
                });
            }
        }
        this.setState({
            discount2:e.target.value
        });
        // this.props.form.setFieldsValue({discount2Payer:e.target.value})
    }
    discount3(e){
        for(var i=1;i<4;i++){
            if(i.toString()===e.target.value||i.toString()===this.state.discount1||i.toString()===this.state.discount2){
                this.setState({
                    ["discount2_"+e.target.value]:true,
                    ["discount1_"+e.target.value]:true
                });
            }else{
                this.setState({
                    ["discount2_"+i]:false,
                    ["discount1_"+i]:false
                });
            }
        }
        this.setState({
            discount3:e.target.value
        });
        // this.props.form.setFieldsValue({discount3Payer:e.target.value})
    }
    detailData(){
        var data=JSON.parse(window.localStorage.getItem("detail"));
        var productSettings=data.productSettings;
        var repay=data.repaySettings[0];
        this.setState({
            product_select:productSettings
        })
        this.props.form.setFieldsValue({productIds:data.basic.productIds})
        for(var rd in repay){
            if(rd==="bankName"||rd==="merchantRepayBankCard"||rd==="subBankName"||rd==="merchantRepayBankAccount"){
                this.repay.props.form.setFieldsValue({[rd]:repay[rd]})
            }else if(rd==="repayDayType"){
                this.repay.props.form.setFieldsValue({[rd]:repay[rd].toString()})
            }
        }
        // for(var pp in productSettings){
        //     //console.log(productSettings[pp].productId+'=='+basic.productIds[pi])
        //     if(this.state.product.id===productSettings[pp].productId){
        //         for(var pj in productSettings[pp]){
        //             if(pj==="discount1Payer"&&productSettings[pp][pj]){
        //                 var dis1="discount1Per_"+productSettings[pp].discount1Payer;
        //                 this.setState({discount1:productSettings[pp][pj].toString()});

        //                 this.props.form.setFieldsValue({"discount1Payer":productSettings[pp][pj],[dis1]:productSettings[pp].discount1Per})
        //             }else if(pj==="discount2Payer"&&productSettings[pp][pj]){
        //                 var dis2="discount2Per_"+productSettings[pp].discount2Payer;
        //                 this.setState({discount2:productSettings[pp][pj].toString()});

        //                 this.props.form.setFieldsValue({"discount2Payer":productSettings[pp][pj],[dis2]:productSettings[pp].discount2Per})
        //             }else if(pj==="discount3Payer"&&productSettings[pp][pj]){
        //                 var dis3="discount3Per_"+productSettings[pp].discount3Payer;
        //                 this.setState({discount3:productSettings[pp][pj].toString()});

        //                 this.props.form.setFieldsValue({"discount3Payer":productSettings[pp][pj],[dis3]:productSettings[pp].discount3Per})
        //             }else if(pj==="haveJqxccs"){
        //                 this.props.form.setFieldsValue({"haveJqxccs":productSettings[pp].haveJqxccs.toString()})
        //             }else if(pj!=="discount1Per"&&pj!=="discount2Per"&&pj!=="discount3Per"&&pj!=="discount1Qudao"&&pj!=="discount2Qudao"&&pj!=="discount3Qudao"&&pj!=="discount1Payer"&&pj!=="discount2Payer"&&pj!=="discount3Payer"){
        //                 this.props.form.setFieldsValue({[pj]:productSettings[pp][pj]})
        //             }
        //         }

        //     }
        // }
    }
    //产品选择
    handleChange(value) {
        // console.log(value);
        var data=JSON.parse(window.localStorage.getItem('productList'));
        var productList=[];
        for(var i in value){
            for(var j in data){
                //alert(i)
                if(Number(value[i])===data[j].id){
                    productList.push(data[j]);
                }
            }
        }
        this.setState({
            product_select:productList,
        })
        if(this.state.select_val.length>value.length){
            axios_sh.get(prodoct_use+"?productId="+del_id+"&merchantId="+this.state.id).then(e=>{
                if(e.data){
                    message.warn("该产品正在使用，不支持删除");
                    this.props.form.setFieldsValue({productIds:this.state.select_val})
                }else{
                    this.setState({
                        select_val:value
                    })
                    this.props.form.setFieldsValue({productIds:value})
                }
            })
        }else{
            this.setState({
                select_val:value
            })
            this.props.form.setFieldsValue({productIds:value})
        }
        // this.props.productList(productList);
        
    }
    del(e){
        del_id=e
    }
    get_product(e){
        this.refArr.push(e);
    }
    get_data(){
        var aa=[],productSettings=[],productArr=[];
        for(var i in this.refArr){
            for(var j in this.state.product_select){
                if(this.state.product_select[j].id){
                    if(Number(this.refArr[i].state.product.id)===Number(this.state.product_select[j].id)){
                    aa.push(this.refArr[i])
                    }
                }else{
                    if(Number(this.refArr[i].state.product.id)===Number(this.state.product_select[j].productId)){
                        aa.push(this.refArr[i])
                     }
                    
                    
                }
                
            }
        }
        // return aa
        for(var k in aa){
            aa[k].props.form.validateFields((err,val)=>{
                if(!err){
                    productSettings.push(val);
                }
            });
        }
        if(aa.length!==productSettings.length){
            return [];
        }
        for(var p in productSettings){
            if(JSON.stringify(productSettings[p]!=="{}")){
                productArr.push(productSettings[p])
            }
        }
        console.log(productArr)
        return productArr;
    }
    repay_onref(e){
        this.repay=e;
        
    }
    get_repay(){
        var repay={};
        this.repay.props.form.validateFields((err,val)=>{
            if(!err){
                repay=val;
            }
        });
        return repay;
    }
    render() {
        var values=window.localStorage.getItem("detail")?JSON.parse(window.localStorage.getItem("detail")).basic.productIds:[];
        const { getFieldDecorator } = this.props.form;
        const formInfo={
            labelCol:{md:{span:3},lg:{span:2},xl:{span:2}},
            wrapperCol:{md:{span:9},lg:{span:7},xl:{span:7}},
            colon:false
        };
        return (
            
            <Form className="sh_add">
                <Row className="sh_add_product">
                <div className="sh_inner_box">
                <FormItem label="开通产品" {...formInfo} >
                        {getFieldDecorator('productIds', {
                            rules:[{required:true,message:"请选择要开通的产品名称"}]
                        })(
                            <div />
                        )}
                        <Select mode="multiple" onChange={this.handleChange.bind(this)} placeholder="请选择要开通的产品名称" className="selectMore" defaultValue={values} style={{ width: '100%' }} onDeselect={this.del.bind(this)} value={this.state.select_val} >
                            {this.product}
                        </Select>

                    </FormItem>
                </div>
                </Row>
                {this.state.product_select.map((i,k)=>{
                    return <Products key={i.id||i.productId} product={i} id={this.state.id} onRef={this.get_product.bind(this)} />
                })}
                <Repay onRef={this.repay_onref.bind(this)} />
            </Form>
        )

    }
}
export default Form.create()(Product);