import React, { Component } from 'react';
import {Row,Col,Form,Select,Input,Radio,message,Button} from 'antd';
import {axios_sh} from '../../../ajax/request';
import {bank_list} from '../../../ajax/api';
import RepayMore from './repayBankMore';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
let clickNum=1
class Repay extends Component{
    constructor(props) {
        super(props);
        // props.onRef(this);
        console.log(props.name)
        this.state = {
            bank:[],
            type:"2",
            add_btn:false,
            id:props.id
        };
        // this.product=[]
        this.click=[];
        this.refArr=[];
        this.editArr=[];
        this.num=1;
    }
    componentWillMount(){
        this.getShNo();
        if(this.state.id){
            setTimeout(()=>{
                this.editData()
            },100)

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
    type_change(e){
        this.setState({
            type:e.target.value,
            add_btn:(e.target.value==="3"?true:false)
        })
    }
    onRef(e){
        this.refArr.push(e)
    }
    //add
    test(){
        var mm=[];
        for(let i in this.state.addClick){
            for(let j in this.editArr){
                if(i===j){
                                mm.push(<RepayMore key={this.editArr[j]} onRef={this.onRef.bind(this)} del={this.delete.bind(this)} id={this.editArr[j]} num={j} addCar={this.add.bind(this)} />)
                            }
            }
        }
        return mm;
    }
    add(){
        if(this.click.length>0){
            //console.log(this.editArr+"--"+this.click)
            clickNum=this.click[this.click.length-1];
            clickNum++;
        }else{
            clickNum++;
        }
        this.editArr.push(clickNum);
        this.click.push(clickNum);
        this.setState({
            addClick:this.click,
            //editArrs:this.editArr
        })
    }
    delete(num,k) {
        this.editArr.splice(k,1);
        var node=document.getElementById(num);
        var childs = node.childNodes;
        for(var i = 0; i < childs.length; i++) {
            node.removeChild(childs[i]);
        }
        node.remove();
        message.success('结算账户信息删除成功');
        for(var p in this.refArr){
            if(typeof this.refArr[p]!=='number'&&typeof this.refArr[p]!=='string'){
                if(this.refArr[p].props.num===k){
                    this.refArr[p]=k;
                }
            }


        }
        this.setState({
            editArrs:this.editArr
        })

    }
    editData(){
        console.log(this.props.name)
        var data=JSON.parse(window.localStorage.getItem("detail"));
        var repayBankAccounts=data.repayBankAccounts;
        if(repayBankAccounts.length<1){
            this.setState({
                type:"3"            
            })
            return;
        }
        var tem=true,tem_arr=[],data_arr=[],more_data_arr=[];
        for(var i in repayBankAccounts){
            if(repayBankAccounts[i].repayBankAccount===this.props.name){
                
                tem=false;
                this.props.form.setFieldsValue({bankName:repayBankAccounts[i].bankName,repayBankAccount:repayBankAccounts[i].repayBankAccount,repayBankCard:repayBankAccounts[i].repayBankCard,subBankName:repayBankAccounts[i].subBankName})
            }else{
                tem_arr.push(repayBankAccounts[i])
                
                
            }
        }
        if(tem){
            for(var j in tem_arr){
                if(j===0){
                    this.props.form.setFieldsValue({bankName:repayBankAccounts[i].bankName,repayBankAccount:repayBankAccounts[i].repayBankAccount,repayBankCard:repayBankAccounts[i].repayBankCard,subBankName:repayBankAccounts[i].subBankName})
                }else{
                    data_arr.push(1)
                    this.refArr[j].props.form.setFieldsValue({bankName:repayBankAccounts[i].bankName,repayBankAccount:repayBankAccounts[i].repayBankAccount,repayBankCard:repayBankAccounts[i].repayBankCard,subBankName:repayBankAccounts[i].subBankName})
                }
            }
            this.setState({
                type:"2",
                addClick:data_arr
            })
            this.click=data_arr;
            this.editArr=data_arr;
        }else{
            for(var k in tem_arr){
                more_data_arr.push(1)
                this.refArr[k].props.form.setFieldsValue({bankName:repayBankAccounts[i].bankName,repayBankAccount:repayBankAccounts[i].repayBankAccount,repayBankCard:repayBankAccounts[i].repayBankCard,subBankName:repayBankAccounts[i].subBankName})
            }
            this.setState({
                type:"1",
                addClick:more_data_arr
            })
            this.click=more_data_arr;
            this.editArr=more_data_arr;
        }
    }
    render(){
        // console.log(this.state.sh_name)
        const { getFieldDecorator } = this.props.form;
        const formInfo={
            labelCol:{span:4},
            wrapperCol:{span:6},
            colon:false
        };
        const formInfoSmall={
            labelCol:{span:8},
            wrapperCol:{span:12},
            colon:false
        };
        return (
            <div>
            <div className="sh_add_card">
                <Row>
                    <Col span={13}>
                    <div className="sh_add_title">结算账户信息</div>
                    </Col>
                    <Col span={5}>
                    <Button type="primary" disabled={this.state.add_btn?true:false} onClick={this.add.bind(this)}>添加还款账户</Button>
                    </Col>
                </Row>
                
                
                <Row style={{marginBottom:"15px"}}>
                    <Col span={4}>
                    <span style={{fontSize:'14px',color:"#7F8FA4",marginLeft:"3px"}}>还款账户</span>
                    </Col>
                    <Col span={12}>
                    <RadioGroup value={this.state.type} onChange={this.type_change.bind(this)}>
                                <Radio value="1" >同结算账户</Radio>
                                <Radio value="2" >非结算账户</Radio>
                                <Radio value="3" >不需商户还款</Radio>
                             </RadioGroup>
                    </Col>
                </Row>
                {
                    this.state.type==="2"?
                
                <div>
                    <FormItem label="商户全称" {...formInfo} >
                        {getFieldDecorator('repayBankAccount', {
                            initialValue:"",
                            rules:[{required:true,message:"请输入还款账户名"}]
                        })(
                            <Input placeholder="请输入还款账户名" />
                        )}

                </FormItem>
                <FormItem label="还款账号" {...formInfo} >
                        {getFieldDecorator('repayBankCard', {
                            initialValue:"",
                            rules:[{required:true,message:"请输入还款账号"}]
                        })(
                            <Input placeholder="请输入还款账号" />
                        )}

                </FormItem>
                <Row>
                            <Col span={12}>
                                <FormItem {...formInfoSmall} label="开户行" >
                                    {getFieldDecorator('bankName', {
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
                            <Col span={12} pull={1}>
                                <FormItem {...formInfoSmall} label="" >
                                    {getFieldDecorator('subBankName', {
                                        initialValue:"",
                                        rules:[{pattern:/^[\u4e00-\u9fa5]{1,25}$/,message:"格式错误"},{required:true,message:"请输入开户支行名称"}]
                                    })(
                                        <Input placeholder="请输入开户支行名称" />
                                    )}

                                </FormItem>
                            </Col>
                        </Row>
                        </div>:null
                }
                
            </div>
            {
                    this.test()
                }
            </div>
        )
        
    }
}
export default Form.create()(Repay);