import React , { Component } from 'react';
import {Row,Form,Select,Input,Col,Button} from 'antd';
import {axios_sh} from '../../../ajax/request';
import {bank_list} from '../../../ajax/api';
const FormItem = Form.Item;
const Option = Select.Option;
//const {  RangePicker } = DatePicker;
//let clickNum=1,clickArr=[],refArr=[];
class Insurance extends Component{
    constructor(props) {
        super(props);
        props.onRef(this);
        this.state={
            bank:[]
        }
    }
    componentWillMount(){
        //clickArr=[];
        //refArr=[]
    }
    componentDidMount() {
        this.getOption()
    }
    getOption(){
        axios_sh.get(bank_list).then(e=>{
            if(!e.code){
                this.setState({
                    bank:e.data
                })
            }
        })
    }
    delete() {
        this.props.del(this.props.id,this.props.num)
    }
    getCalc(e){
        if(e.target.value){
            if(e.target.value.indexOf(".")===-1){
                e.target.value=parseFloat(e.target.value).toFixed(2);
            }else if(e.target.value.split(".")[1].length<2){
                e.target.value=parseFloat(e.target.value).toFixed(2);
            }
            this.props.form.setFieldsValue({syx:e.target.value})

        }
    }
    bdChange(e){
        e.target.value=e.target.value.toUpperCase();  //字母小写转大写
        this.props.form.setFieldsValue({insurNo:e.target.value});
    }
    addCar(){
        this.props.addCar();
    }
    render() {
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
        var syxKey=Number(this.props.num)+2<10?"0"+(Number(this.props.num)+2):Number(this.props.num)+2;
        return (
            //<Form className='fqsq'>
            <Row >
                <Row id={this.props.id} className="sh_add_card">
                    <Row>
                        <Row style={{marginBottom:"18px"}}>
                            <Col span={13}>
                                <div className="sh_add_title">结算账户信息{syxKey}</div>
                            </Col>
                            <Col span={10}>
                                <Button type="danger" onClick={this.delete.bind(this)} icon="minus" style={{marginRight:"15px"}}>删除还款账户</Button>
                                <Button type="primary" icon="plus" onClick={this.addCar.bind(this)}>添加还款账户</Button>
                                
                            </Col>
                            {/* <Col span={5}>
                                <Button type="danger" size="small" onClick={this.delete.bind(this)} icon="minus" >删除保单</Button>
                            </Col> */}
                        </Row>
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

                    </Row>
                </Row>
            </Row>
            //</Form>
        )
    }
}
export default Form.create()(Insurance);