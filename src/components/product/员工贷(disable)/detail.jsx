import React , { Component } from 'react';
import { Row , Form , Select,Button} from 'antd';
import {product_detail} from '../../../ajax/api';
import {axios_ygd} from '../../../ajax/request';
// import Path from '../../../templates/Path';
import ComponentRoute from '../../../templates/ComponentRoute';
import { browserHistory } from 'react-router';
const FormItem = Form.Item;
const Option = Select.Option;
class Product extends Component{
    constructor(props){
        super(props);
        this.state = {
            businessArr:[],
            repayPlanTypeArr:[],
            repayTypeArr:[],
            productId:props.location.query.productId
        }
    }
    componentWillMount () {
        // this.getOption()
    }
    componentDidMount(){
            this.getDetail();

    }
    getOption(){
        var data=JSON.parse(window.localStorage.getItem("dropdownList"));
        var business=data.business;
        var repayPlanType=data.repayPlanType;
        var repayType=data.repayType;
        var businessArr=[],repayPlanTypeArr=[],repayTypeArr=[];
        for(var i in business){
            businessArr.push(<Option value={i} key={i+"business"}>{business[i]}</Option>)
        }
        for(var j in repayPlanType){
            repayPlanTypeArr.push(<Option value={j} key={j+"repayPlanType"}>{repayPlanType[j]}</Option>)
        }
        for(var k in repayType){
            repayTypeArr.push(<Option value={k} key={k}>{repayType[k]}</Option>)
        }
        this.setState({
            businessArr:businessArr,
            repayPlanTypeArr:repayPlanTypeArr,
            repayTypeArr:repayTypeArr
        })
    }
    //获取详情
    getDetail(){
        var rqd={
            productId:this.state.productId
        }
        axios_ygd.post(product_detail,rqd).then(e=>{
            var data=e.data;
            for(var i in data){
                this.setState({
                    [i]:data[i]
                })
            }

        })
    }
    edit(){
        browserHistory.push("/cp/ygd/list/edit?productId="+this.props.location.query.productId+"&project="+this.props.location.query.project+"&configId="+this.props.location.query.productConfigId+"&code="+this.props.location.query.code);
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout={
            labelCol: { span: 6 },
            wrapperCol: { span: 10 }
        };
        var data=JSON.parse(window.localStorage.getItem("dropdownList"))||{};
        var project={ygd:"员工贷",jyd:"经营贷"};
        return(
            <Row>
                <Form className="product_cxfq">
                    <Row className="content_cx">
                    <div className="card_cx">
                        <div className="title">
                            <div className="icon" />
                            <span className="titleWord">产品信息</span>
                        </div>
                        <Row className="form_cx">
                        
                        <FormItem {...formItemLayout} label="产品名称">
                            {getFieldDecorator('name', {
                            })(
                                <div>{this.state.name}</div>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="所属项目">
                            {getFieldDecorator('project', {
                            })(
                                <div>{project[this.state.project]}</div>
                            )}
                        </FormItem>
                        {
                        //     <FormItem {...formItemLayout} label="还款计划生成方式">
                        //     {getFieldDecorator('repayPlanType', {
                        //     })(
                        //         <div>{data.repayPlanType[this.state.repayPlanType]}</div>
                        //     )}
                        // </FormItem>
                        }
                        
                        <FormItem {...formItemLayout} label="还款方式">
                            {getFieldDecorator('repayType', {
                            })(
                                <div>{data.repayType?data.repayType[this.state.repayType]:""}</div>
                            )}
                        </FormItem>
                            {
                            //    <FormItem {...formItemLayout} label="逾期利率">
                            //        {getFieldDecorator('overdueRate', {
                            //
                            //        })(
                            //            <div>{this.state.overdueRate+"%"}</div>
                            //        )}
                            //    </FormItem>
                            //    <FormItem {...formItemLayout} label="罚息利率">
                            //{getFieldDecorator('penaltyRate', {
                            //})(
                            //    <div>{this.state.penaltyRate+"%"}</div>
                            //    )}
                            //    </FormItem>
                            }

                    </Row>
                    </div>
                    </Row>
                    <Row className="content_cx">
                    <div className="card_cx">
                    <div className="title">
                            <div className="icon" />
                            <span className="titleWord">上报信息</span>
                        </div>
                        <Row className="form_cx">
                        <FormItem {...formItemLayout} label="还款方式">
                            {getFieldDecorator('reportRepayMethod', {
                            })(
                                <div>{data.repayMethod?data.repayMethod[this.state.reportRepayMethod]:""}</div>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="贷款方式">
                            {getFieldDecorator('reportLoanMethod', {
                            })(
                                <div>{data.loanMethod?data.loanMethod[this.state.reportLoanMethod]:""}</div>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="贷款用途">
                            {getFieldDecorator('reportPurpose', {
                            })(
                                <div>{data.purpose?data.purpose[this.state.reportPurpose]:""}</div>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="贷款投向">
                            {getFieldDecorator('reportBusiness', {
                            })(
                                <div>{data.business?data.business[this.state.reportBusiness]:""}</div>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="受托支付">
                            {getFieldDecorator('reportEntrust', {
                            })(
                                <div>{this.state.reportEntrust?"是":"否"}</div>
                            )}
                        </FormItem>
                    </Row>
                    </div>
                    </Row>
                    
                    <Row className="content_cx" style={{textAlign:"center",margin:"10px 0"}}>
                        <Button onClick={this.edit.bind(this)} type="primary">编辑</Button>
                    </Row>
                </Form>
            </Row>
        )

    }
}
export default ComponentRoute(Form.create()(Product));