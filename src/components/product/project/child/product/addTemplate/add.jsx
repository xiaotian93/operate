import { Form, message } from 'antd';
import React from 'react';
import Basic from '../business/business_account';
import User from '../business/user/user';
// let id = 0;

class DynamicFieldSet extends React.Component {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      support: false
    }
    this.arr = [];
    this.id = props.user_key?props.user_key[props.user_key.length-1]:0;
    this.delId=[];
  }
  remove(k) {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    if(keys.length===1){
      message.warn("至少需要一个用户群");
      return false;
    }
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
    this.arr = this.arr.filter(key => key.props.del_key !== k); 
    return true
  }
  remove_arr(e){
    this.delId.push(e.state.childId);
  }
  add() {
    this.setState({
      support: true
    })
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    // if (keys.length > 0) {
    //   this.id = keys[keys.length - 1]
    // }
    const nextKeys = keys.concat(this.id += 1);
    form.setFieldsValue({
      keys: nextKeys,
    });
  }

  handleSubmit(e) {
    var dataArr = [];
    for (var i in this.arr) {
      var tem = this.arr[i].sub();console.log(this.arr)
      if (tem.length < 1) {
        return [];
      }
      for (var j in tem) {
        dataArr.push(tem[j]);
      }
    }
    console.log(dataArr)
    return dataArr;
  }
  getVal(e) {
    this.arr.push(e);
  }
  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const data = this.props.user_data;
    getFieldDecorator('keys', { initialValue: !this.props.isAdd ? this.props.user_key : [1] });
    const keys = getFieldValue('keys');console.log(keys)
    const formItems = keys.map((k, index) => (  
      this.props.type==="user"?<User key={k} del={() => this.remove(k)} num={index} onRef={this.getVal.bind(this)} tag={this.props.phase} unit={this.props.unit} service={this.props.service} rate={this.props.rate} edit_data={data[k]} configNo={this.props.configNo} del_key={k} remove_arr={this.remove_arr.bind(this)} calRateType={this.props.calRateType} />:
      <Basic key={k} del={() => this.remove(k)} num={index} onRef={this.getVal.bind(this)} />
    ));
    return (
      <div onSubmit={this.handleSubmit.bind(this)}>
        {formItems}
      </div>
    );
  }
}

const WrappedDynamicFieldSet = Form.create({ name: 'dynamic_form_item' })(DynamicFieldSet);
export default WrappedDynamicFieldSet
