import {
    Form, Input, Icon, Button,
  } from 'antd';
  import React , { Component } from 'react';
//   import Basic from './formBasic';
  let id = 0;
  
  class DynamicFieldSet extends React.Component {
    constructor(props) {
      super(props);
      this.state={
          
      }
      this.arr=[]
  }
    remove = (k) => {
      const { form } = this.props;
      // can use data-binding to get
      const keys = form.getFieldValue('keys');
      // We need at least one passenger
      if (keys.length === 1) {
        return;
      }
  
      // can use data-binding to set
      form.setFieldsValue({
        keys: keys.filter(key => key !== k),
      });
      this.arr.filter(key=>key!=k);
    }
  
    add = () => {
      const { form } = this.props;
      // can use data-binding to get
      const keys = form.getFieldValue('keys');console.log(keys)
      const nextKeys = keys.concat(id++);
      // can use data-binding to set
      // important! notify form to detect changes
      form.setFieldsValue({
        keys: nextKeys,
      });
    }
  
    handleSubmit = (e) => {
      e.preventDefault();
      for(var i in this.arr){
        console.log(this.arr)
        console.log(this.arr[i].props.form.getFieldsValue())
      }
      this.props.form.validateFields((err, values) => {
        console.log(values)
        if (!err) {
          const { keys, names } = values;
          console.log('Received values of form: ', values);
          console.log('Merged values:', keys.map(key =>{console.log(key)}));
        }
      });
    }
  getVal(e){
    this.arr.push(e)
  }
    render() {
        var Basic=this.props.children;console.log(Basic)
      const { getFieldDecorator, getFieldValue } = this.props.form;
      const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 4 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 20 },
        },
      };
      const formItemLayoutWithOutLabel = {
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 20, offset: 4 },
        },
      };
      getFieldDecorator('keys', { initialValue: [] });
      const keys = getFieldValue('keys');
      const formItems = keys.map((k, index) => (
        // <Basic key={k} del={() => this.remove(k)} num={index} onRef={this.getVal.bind(this)}></Basic>
        // <Basic></Basic>
        Basic.key=k
      ));
      return (
        <Form onSubmit={this.handleSubmit}>
          {formItems}
          <Form.Item {...formItemLayoutWithOutLabel}>
            <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
              <Icon type="plus" /> Add field
            </Button>
          </Form.Item>
          <Form.Item {...formItemLayoutWithOutLabel}>
            <Button type="primary" htmlType="submit">Submit</Button>
          </Form.Item>
        </Form>
      );
    }
  }
  
  const WrappedDynamicFieldSet = Form.create({ name: 'dynamic_form_item' })(DynamicFieldSet);
//   ReactDOM.render(<WrappedDynamicFieldSet />, mountNode);
  export default WrappedDynamicFieldSet