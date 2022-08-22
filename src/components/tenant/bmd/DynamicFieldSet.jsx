import { Form } from 'antd';
import React from 'react';
import Basic from './user';
// let id = 0;

class DynamicFieldSet extends React.Component {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      support: false
    }
    this.arr = [];
    this.id = 0;
  }
  remove(k) {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    // if (keys.length === 1) {
    //   return;
    // }
    console.log(k)
    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
    // this.arr.filter(key=>{console.log(key.props.del_key)});
    this.arr = this.arr.filter(key => key.props.del_key !== k); console.log(this.arr)
  }

  add() {
    this.setState({
      support: true
    })
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    if (keys.length > 0) {
      this.id = keys[keys.length - 1]
    }
    // console.log(this.id+=1)
    const nextKeys = keys.concat(this.id += 1);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
    console.log(nextKeys)
  }

  handleSubmit(e) {
    // e.preventDefault();
    var dataArr = [];
    for (var i in this.arr) {
      // console.log(this.arr)
      // console.log(this.arr[i].props.form.getFieldsValue())
      var tem = this.arr[i].sub();
      if (tem.length < 1) {
        return [];
      }
      for (var j in tem) {
        dataArr.push(tem[j]);
      }
    }
    return dataArr;
  }
  getVal(e) {
    this.arr.push(e);
  }
  render() {
    // var Basic=this.props.children;console.log(Basic)
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const data = this.props.user_data;

    getFieldDecorator('keys', { initialValue: this.props.id ? this.props.user_key : [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (
      <Basic key={k} del={() => this.remove(k)} num={index} onRef={this.getVal.bind(this)} periodUnit={this.props.periodUnit} tag={this.props.tag} del_key={k} id={this.props.id} edit_data={data[k]} support={this.state.support} />
      // <Basic></Basic>
      // Basic.key=k
    ));
    return (
      <div onSubmit={this.handleSubmit.bind(this)}>


        {formItems}
      </div>
    );
  }
}

const WrappedDynamicFieldSet = Form.create({ name: 'dynamic_form_item' })(DynamicFieldSet);
//   ReactDOM.render(<WrappedDynamicFieldSet />, mountNode);
export default WrappedDynamicFieldSet