import React, { Component } from 'react';
import { Form, Select, Row ,Button} from 'antd';
import {accDiv} from '../../../../../../ajax/tool';
import Rate from './rate';
const Option = Select.Option;
const FormItem=Form.Item;
class FormInfo extends Component {
    constructor(props){
        super(props);
        props.onRef(this)
    }
    componentDidMount(){
        this.setValue();
    }
    setValue() {
        var data=this.props.defalut;
        for(var i in data){
            if(i==="bank"){
                this.props.form.setFieldsValue({[i]:data[i]})
            }else{
                this.rateChild.props.form.setFieldsValue({[i]:(data[i]===""||data[i]===null)?"":accDiv(data[i],100)})
            }
        }
    }
    delete(){
        this.props.del();
    }
    child(e){
        this.rateChild=e
    }
    getValue(){
        return this.rateChild.getValue()
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        let bank=["中国工商银行","中国银行","中国建设银行","中信银行","中国农业银行","招商银行","中国光大银行","中国民生银行","广发银行","中国交通银行","中国邮政储蓄银行","兴业银行","浦东发展银行","华夏银行","北京银行","上海银行","浙商银行","渤海银行","平安银行"]
        return <Row>
            <FormItem label={<span style={{ width: "100%" }}>适用银行</span>} labelCol={{ span: 4 }} wrapperCol={{ span: 7 }} colon={false}>
        {getFieldDecorator("bank", {
            // initialValue: "",
        })(
            <Select placeholder="请选择适用银行">
                {
                    bank.map((i,k)=>{
                        return <Option value={i} key={k}>{i}</Option>

                    })
                }
            </Select>
        )}
        <Button type="danger" onClick={this.delete.bind(this)} style={{position:"absolute",left:"105%"}}>删除</Button>
        </FormItem>
        
            <Rate onRef={this.child.bind(this)} rate="rate" min="min" max="max" getValue={this.getValue.bind(this)} />
        </Row>
    }
}
export default Form.create()(FormInfo);