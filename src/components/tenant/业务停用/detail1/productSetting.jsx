import React, { Component } from 'react';
import {Row,Form,Select} from 'antd';
import Products from './productDetail';
import Repay from './repaySetting';
const FormItem = Form.Item;
const Option = Select.Option;
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
            productName:[]
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
                this.detailData();
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
        var productList=JSON.parse(window.localStorage.getItem("productList"));
        var basic=data.basic;
        var productId=basic.productIds;
        var value=[];
        for(var j in productId){
            for(var k in productList){

                if(productId[j]===productList[k].id.toString()){
                    value.push(productList[k].name)
                }
            }
        }
        this.setState({
            product_select:productSettings,
            productName:value
        })
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
            product_select:productList
        })
        // this.props.productList(productList);
        this.props.form.setFieldsValue({productIds:value})
    }
    get_product(e){
        this.refArr.push(e);
    }
    get_data(){
        var aa=[],productSettings=[];
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
        return productSettings;
    }
    get_repay(e){
        this.repay=e;
    }
    render() {
        
        
        var value=this.state.productName.join(" , ");
        const { getFieldDecorator } = this.props.form;
        const formInfo={
            labelCol:{span:2},
            wrapperCol:{span:6},
            colon:false
        };
        return (
            
            <Form className="sh_add">
                <Row className="sh_add_product">
                <div className="sh_inner_box">
                <FormItem label="开通产品" {...formInfo} >
                        {getFieldDecorator('productIds', {
                        })(
                            <div style={{fontSize:"14px"}}>{value}</div>
                        )}
                    </FormItem>
                </div>
                </Row>
                {this.state.product_select.map((i,k)=>{
                    return <Products key={k} product={i} id={this.state.id} onRef={this.get_product.bind(this)} />
                })}
                <Repay onRef={this.get_repay.bind(this)} />
            </Form>
        )

    }
}
export default Form.create()(Product);