import React, { Component } from 'react';
import {Row,Button,Tabs,message,Spin, Modal} from 'antd';
import Basic from './basic';
import Product from './productSetting';
// import Repay from './repaySetting';
import Pay from './paySetting';
import Business from './customerBusiness';
import Company from './company';
import {merchant_add,merchant_edit} from '../../../ajax/api';
import { browserHistory } from 'react-router';
import {axios_cxfq} from '../../../ajax/request';
import User from './merchantUser';
// import History from './history';
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
            tabs:"1",
            repayData:[],
            spin:false,
            isleave:false
        };
        this.productArr=[];
        this.productNew=[]
    }
    componentWillMount() {
        this.props.router.setRouteLeaveHook(
            this.props.route,
            this.routerWillLeave.bind(this)
    )
    }
    shouldComponentUpdate(props,state){
        this.props.router.setRouteLeaveHook(
            this.props.route,
            this.routerWillLeave.bind(this)
    )
    return true
    
}
    routerWillLeave(nextLocation){
        if(this.state.isleave){
            return true
        }else{
            this.setState({
                leave:true,
                isleave:true,
                next:nextLocation.pathname
            })
            return false;
        }
    };
    leaveOk(){
        this.setState({
            leave:false,
            isleave:false
        })
    }
    leaveClose(){
        this.setState({
            leave:false,
            isleave:true
        })
        browserHistory.push(this.state.next)
    }
    callback(key){
        this.setState({tabs:key});
        if(key==="3"){
            if(!this.state.id){
                setTimeout(()=>{
                    this.repays.setState({
                        productList:this.productSet()
                    })
                    // this.repays.editData();
                },100)
            }else{
                // var productList=JSON.parse(window.localStorage.getItem("detail")).productSettings;
                setTimeout(()=>{
                    this.repays.setState({
                        // productList:this.productSet().length>0?this.productSet():productList
                        productList:this.productSet()
                    })
                    // this.repays.editData();
                },10)
            }

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
        //this.productArr=[];
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
    company(e){
        this.insurCompany=e;
    }
    productSet(){
        var aa=[];
        for(var k in this.state.productList){
            aa.push(this.state.productList[k].id)
        }
        var product_data=this.products.get_data();
        for(var j in product_data){
            if(aa.indexOf(Number(product_data[j].productId))<0){
                this.productArr.splice(j,1)
            }
        }        
        var productSettings=[];
        productSettings=product_data;
        // for(var m in product_data){
        //     productSettings.push(product_data[m].props.form.getFieldsValue())
        // }
        return productSettings;
    }
    submit(){
        this.setState({
            btn:true
        })
        var payArr=[],param={},payList,business,basic={},basicCheck,insurCompany,insurCompanies=[],product_check=true,cp_arr=[],hk_arr=[];
        this.basics.props.form.validateFields((err,val)=>{
            if(!err){
                basic=val;
                basicCheck=true
            }else{
                basicCheck=false
            }
        });
        this.products.props.form.validateFields((err,val)=>{
            if(!err){
                basic.productIds=val.productIds;
                product_check=true
            }else{
                product_check=false;
                
            }
        });
        if(this.state.id){
            var details=JSON.parse(window.localStorage.getItem("detail"));
            // repay=this.repays?this.repays.getRepay():details.repaySettings;
            payList=this.pays?this.pays.state.dataSource:details.paySettings;
            business=this.bus?this.bus.state.dataSource:details.basic.customerBusinessIds;
            insurCompany=this.insurCompany?this.insurCompany.state.dataSource:details.insurCompanies;
            console.log(this.bus)
            if(this.bus){
                var customerBusinessIdArr=[];
                for(var j in business){
                    customerBusinessIdArr.push(business[j].id);
                }
                basic.customerBusinessIds=customerBusinessIdArr;
            }else{
                basic.customerBusinessIds=business;
            }
            // productDetail=details.productSettings;
            basic.id=Number(this.state.id);
        }else{
            // repay=this.repays?this.repays.getRepay():"";
            payList=this.pays?this.pays.state.dataSource:'';
            business=this.bus?this.bus.state.dataSource:"";
            insurCompany=this.insurCompany?this.insurCompany.state.dataSource:"";
            var customerBusinessIds=[];
            if(business){
                for(var bus in business){
                    customerBusinessIds.push(business[bus].id);
                }
            }
            if(JSON.stringify(basic)!=="{}"){
                basic.customerBusinessIds=customerBusinessIds;
            }

        }
        for(var p in payList){
            delete payList[p].key;
            payArr.push(payList[p]);
        }
        
        param.basic=basic;
        // param.repaySettings=repay;
        param.paySettings=payArr;
        
        
        if(JSON.stringify(param.basic)==='{}'||!basicCheck){
            message.warn('基础信息不完整，请检查！');
            this.setState({
                btn:false
            })
            return
        }
        if(!product_check){
            message.warn('请先开通产品');
            this.setState({
                btn:false
            })
                return
        }
        if(this.products.get_data().length>0){
            // param.productSettings=this.products.get_data();
            var pro_data=this.products.get_data();
            for(var pro in pro_data){
                var hk=this.products.get_repay(),cp={};
                pro_data[pro].interestUserPer=pro_data[pro].interestUserPer?parseFloat(pro_data[pro].interestUserPer):0;
                pro_data[pro].interestPayerPer=pro_data[pro].interestPayerPer?parseFloat(pro_data[pro].interestPayerPer):0;
                pro_data[pro].serviceFeeUserPer=pro_data[pro].serviceFeeUserPer?parseFloat(pro_data[pro].serviceFeeUserPer):0;
                pro_data[pro].serviceFeePayerPer=pro_data[pro].serviceFeePayerPer?parseFloat(pro_data[pro].serviceFeePayerPer):0;
                pro_data[pro].otherFeeUserPer=pro_data[pro].otherFeeUserPer?parseFloat(pro_data[pro].otherFeeUserPer):0;
                pro_data[pro].otherFeePayerPer=pro_data[pro].otherFeePayerPer?parseFloat(pro_data[pro].otherFeePayerPer):0;
                pro_data[pro].lateFeeUserPer=pro_data[pro].lateFeeUserPer?parseFloat(pro_data[pro].lateFeeUserPer):0;
                pro_data[pro].lateFeePayerPer=pro_data[pro].lateFeePayerPer?parseFloat(pro_data[pro].lateFeePayerPer):0;
                pro_data[pro].penaltyFeeUserPer=pro_data[pro].penaltyFeeUserPer?parseFloat(pro_data[pro].penaltyFeeUserPer):0;
                pro_data[pro].penaltyFeePayerPer=pro_data[pro].penaltyFeePayerPer?parseFloat(pro_data[pro].penaltyFeePayerPer):0;
                if((pro_data[pro].interestUserPer+pro_data[pro].interestPayerPer!==Number(pro_data[pro].interestPer))||(pro_data[pro].serviceFeeUserPer+pro_data[pro].serviceFeePayerPer!==Number(pro_data[pro].serviceFeePer))||(pro_data[pro].otherFeeUserPer+pro_data[pro].otherFeePayerPer!==Number(pro_data[pro].otherFeePer))||(pro_data[pro].lateFeeUserPer+pro_data[pro].lateFeePayerPer!==Number(pro_data[pro].lateFeePer))||(pro_data[pro].penaltyFeeUserPer+pro_data[pro].penaltyFeePayerPer!==Number(pro_data[pro].penaltyFeePer))){
                    this.setState({
                        btn:false
                    })
                    message.warn("客户还款利率、商户代偿利率填写错误，请检查！");
                    return
                }
                //产品与还款分离
                for(var qf in pro_data[pro]){
                    if(qf==="interestUserPer"||qf==="interestPayerPer"||qf==="serviceFeeUserPer"||qf==="serviceFeePayerPer"||qf==="otherFeeUserPer"||qf==="otherFeePayerPer"||qf==="lateFeeUserPer"||qf==="lateFeePayerPer"||qf==="penaltyFeeUserPer"||qf==="penaltyFeePayerPer"||qf==="principalType"){
                        // var hk={};
                        console.log(hk)
                        hk[qf]=pro_data[pro][qf];
                    }else{
                        // var cp={};
                        cp[qf]=pro_data[pro][qf];
                    }
                }
                hk.productId=pro_data[pro].productId;
                hk_arr.push(hk);
                cp_arr.push(cp);
            }
        }else{
            message.warn('产品配置信息不完整，请检查！');
            this.setState({
                btn:false
            })
            return
        }
        param.productSettings=cp_arr;
        param.repaySettings=hk_arr;
        if(param.repaySettings.length===0){
            message.warn('还款配置信息不完整，请检查！');
            this.setState({
                btn:false
            })
            return
        }
        if(param.paySettings.length===0){
            message.warn('收款账户配置信息不完整，请检查！');
            this.setState({
                btn:false
            })
            return
        }
        if(insurCompany.length<1){
            message.warn('合作保险公司配置信息不完整，请检查！');
            this.setState({
                btn:false
            })
            return
        }
        for(var com in insurCompany){
            var test={};
            test.id=insurCompany[com].id;
            test.name=insurCompany[com].name;
            insurCompanies.push(test);
        }
        param.insurCompanies=insurCompanies;
        // if(!this.bus){
        //     var repay_data=param.repaySettings;
        //     var products_data=param.productSettings;
        //     for(var re in repay_data){
        //         for(var pr in products_data){
        //             if(products_data[pr].productId===repay_data[re].productId){
        //                 if((Number(repay_data[re].interestPayerPer)+Number(repay_data[re].interestUserPer)!==Number(products_data[pr].interestPer))||(Number(repay_data[re].lateFeePayerPer)+Number(repay_data[re].lateFeeUserPer)!==Number(products_data[pr].lateFeePer))||(Number(repay_data[re].otherFeePayerPer)+Number(repay_data[re].otherFeeUserPer)!==Number(products_data[pr].otherFeePer))||(Number(repay_data[re].penaltyFeePayerPer)+Number(repay_data[re].penaltyFeeUserPer)!==Number(products_data[pr].penaltyFeePer))||(Number(repay_data[re].serviceFeePayerPer)+Number(repay_data[re].serviceFeeUserPer)!==Number(products_data[pr].serviceFeePer))){
        //                     message.warn('客户还款利率、商户代偿利率填写错误，请检查！');
        //                     this.setState({
        //                         btn:false
        //                     })
        //                     return;
        //                 }
        //             }
        //         }
        //     }
        // }
        console.log(param);
        if(this.state.id){
            //var pp=this.products.props.form.getFieldsValue();
            // for(var m in this.productSetValue()){
            //     for(var mn in this.productSetValue()[m]){
            //         if(this.productSetValue()[m][mn]===""){
            //             message.warn('产品配置信息不完整，请检查！');
            //             return
            //         }
            //     }
            // }
            // param.productSettings=this.productArr.length>0?this.productSetValue():productDetail;
            axios_cxfq.post(merchant_edit,JSON.stringify(param)).then((e)=>{
                if(!e.code){
                    this.setState({
                        spin:false,
                        btn:false,
                        isleave:true,
                    })
                    message.success('编辑成功');
                    browserHistory.push('/sh/list');
                }else{
                    this.setState({
                        btn:false
                    })
                }
            })
        }else{
            // if(productSettings.length===0){
            //     message.warn('产品配置信息不完整，请检查！');
            //     return
            // }
            // param.productSettings=productSettings;
            axios_cxfq.post(merchant_add,JSON.stringify(param)).then((e)=>{
                if(!e.code){
                    this.setState({
                        spin:false,
                        btn:false,
                        isleave:true,
                    })
                    message.success('新增成功');
                    browserHistory.push('/sh/list');
                }else{
                    this.setState({
                        btn:false
                    })
                }
            })
        }


    }
    productSetValue(){
        var dataArr=[];
        for(var i in this.productArr){
            this.productArr[i].props.form.validateFieldsAndScroll((err,data)=>{
                //if(!err){
                    if(Number(data.discount1Payer)===1){
                        data.discount1Per=data.discount1Per_1;
                        delete data.discount1Per_1;
                    }else if(Number(data.discount1Payer)===2){
                        data.discount1Per=data.discount1Per_2;
                        delete data.discount1Per_2
                    }else if(Number(data.discount1Payer)===3){
                        data.discount1Per=data.discount1Per_3;
                        delete data.discount1Per_3
                    }
                    if(Number(data.discount2Payer)===1){
                        data.discount2Per=data.discount2Per_1;
                        delete data.discount2Per_1;
                    }else if(Number(data.discount2Payer)===2){
                        data.discount2Per=data.discount2Per_2;
                        delete data.discount2Per_2
                    }else if(Number(data.discount2Payer)===3){
                        data.discount2Per=data.discount2Per_3;
                        delete data.discount2Per_3
                    }
                    if(Number(data.discount3Payer)===1){
                        data.discount3Per=data.discount3Per_1;
                        delete data.discount3Per_1;
                    }else if(Number(data.discount3Payer)===2){
                        data.discount3Per=data.discount3Per_2;
                        delete data.discount3Per_2
                    }else if(Number(data.discount3Payer)===3){
                        data.discount3Per=data.discount3Per_3;
                        delete data.discount3Per_3
                    }
                    dataArr.push(data);
                //}
            });
            //var data=this.productArr[i].props.form.getFieldsValue();

        }
        console.log(dataArr)
        return dataArr
    }
    cancel(){
        browserHistory.push('/sh/list');
    }
    render() {
        const leave={
            visible:this.state.leave,
            maskClosable:false,
            closable:false,
            onOk:this.leaveClose.bind(this),
            onCancel:this.leaveOk.bind(this),
            cancelText:"取消",
            okText:"确认退出",
            title:"退出确认"
        }
        return (
            <div >
                <Row className="content" style={{marginBottom:"40px"}} >
                <Spin spinning={this.state.spin}>
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
                        {/* <TabPane tab="还款配置" key="3"><Repay productList={this.state.repayData} onRef={this.repay.bind(this)} id={this.state.id} /></TabPane> */}
                        <TabPane tab="收款账户配置" key="4" forceRender><Pay onRef={this.pay.bind(this)} id={this.state.id} /></TabPane>
                        <TabPane tab="关联企业" key="5"><Business onRef={this.bussiness.bind(this)} id={this.state.id} /></TabPane>
                        <TabPane tab="合作保险公司" key="6" forceRender><Company onRef={this.company.bind(this)} id={this.state.id} /></TabPane>
                        {
                            this.state.id?<TabPane tab="商户操作员" key="7" disabled={this.state.id?false:true} forceRender><User id={this.state.id} /></TabPane>:null
                        }
                        {
                            // this.state.id?<TabPane tab="操作记录" key="8" disabled={this.state.id?false:true} forceRender><History id={this.state.id} /></TabPane>:null
                        }
                        
                    </Tabs>
                    </Spin>
                </Row>
                {
                    <Row style={{height:"50px",background:"#fff",position:"fixed",bottom:"0",right:"0",lineHeight:"50px",textAlign:"center",width:"calc(100% - 170px)",boxShadow:"0px -2px 4px 0px rgba(0,0,0,0.1)"}}>
                        <Button onClick={this.cancel.bind(this)}>取消</Button>
                        <Button type="primary" onClick={this.submit.bind(this)} style={{ marginLeft: '30px' }} disabled={this.state.btn} >提交</Button>
                    </Row>
                }
                <Modal {...leave}>
                    是否确认退出此页面？退出后您当前录入的信息将不可保存。
                </Modal>
            </div>
        )
    }
}
export default Tenant_add;