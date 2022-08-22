import React, { Component } from 'react';
import {Row,Tabs,Button} from 'antd';
import Basic from '../detail/basic';
import Product from '../detail/productSetting';
// import Repay from './repaySetting';
import Pay from '../detail/paySetting';
import Business from '../detail/customerBusiness';
import Company from '../detail/company';
import User from '../detail/merchantUser';
import History from '../detail/history';
const TabPane = Tabs.TabPane;
class Tenant_add extends Component{
    constructor(props) {
        super(props);
        this.state = {
            productList:[],
            productSetting:[],
            id:props.location.query.id,
            basic:{},
            productIds:["3"],
            tabs:"1"
        };
        this.productArr=[];
    }
    componentWillMount(){
    }
    callback(key){
        this.setState({tabs:key})
        if(key==="3"){
            setTimeout(()=>{
                this.repays.setState({
                    productList:this.state.productList
                })
            },100)
        }
        if(this.state.id){
            setTimeout(()=>{
                //this.editData()
            },100)

        }
    }
    product(e){
        this.products=e;
        this.productArr.push(e)
    }
    basic(e){
        this.basics=e;
    }
    productList(e){
        //console.log(e)
        this.setState({
            productList:e
        })
    }
    repay(e){
        this.repays=e
    }
    pay(e){
        this.pays=e
    }
    bussiness(e){
        this.bus=e
    }
    getProduct(){
        this.state.productList.map((i,k)=>{
            return <Product onRef={this.product.bind(this)} product={i} />
        })
    }
    productSet(){
        var productSettings=[];
        for(var i in this.productArr){
            productSettings.push(this.productArr[i].props.form.getFieldsValue())
        }
        return productSettings;
    }
    edit(){
        this.props.router.push("/sh/list/edit?id="+this.state.id)
    }
    render() {
        return (
            <div >
                <Row className="content" style={{marginBottom:"30px"}} >

                    <Tabs defaultActiveKey="1" onChange={this.callback.bind(this)} className="sh_tab">
                        <TabPane tab="基础信息" key="1"><Basic onRef={this.basic.bind(this)} productList={this.productList.bind(this)} id={this.state.id} basic={this.state.basic} productId={this.state.productIds} /></TabPane>
                        <TabPane tab="产品还款配置" key="2" forceRender>
                        <Product onRef={this.product.bind(this)} id={this.state.id} />
                            {
                            // this.state.productList.length>0?this.state.productList.map((i,k)=>{
                            //     return <Product onRef={this.product.bind(this)} product={i} key={k} id={this.state.id} />
                            // }):<div style={{fontSize:"14px",textAlign:"center",marginTop:"20px"}}>请先选择开通产品</div>
                        }
                        </TabPane>
                        {/* <TabPane tab="还款配置" key="3"><Repay productList={this.state.productSetting} onRef={this.repay.bind(this)} id={this.state.id} /></TabPane> */}
                        <TabPane tab="收款账户配置" key="4"><Pay onRef={this.pay.bind(this)} id={this.state.id} /></TabPane>
                        <TabPane tab="关联企业" key="5" forceRender><Business onRef={this.bussiness.bind(this)} id={this.state.id} /></TabPane>
                        <TabPane tab="合作保险公司" key="6" forceRender><Company id={this.state.id} /></TabPane>
                        <TabPane tab="商户操作员" key="7" disabled={this.state.id?false:true}><User id={this.state.id} /></TabPane>
                        <TabPane tab="操作记录" key="8" disabled={this.state.id?false:true}><History id={this.state.id} /></TabPane>
                    </Tabs>
                    <Row className="" style={{textAlign:"center"}}>
                        <Button onClick={this.edit.bind(this)} type="primary">编辑</Button>
                    </Row>
                </Row>

            </div>
        )
    }
}
export default Tenant_add;