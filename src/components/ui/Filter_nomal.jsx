import React , { Component } from 'react';
import { Form , Input , DatePicker , Select , Button } from 'antd';
// import moment from 'moment';
import { format_date } from '../../ajax/tool';

const RangePicker = DatePicker.RangePicker
const Option = Select.Option;
const FormItem = Form.Item;

class Filter extends Component{
	constructor(props){
		super(props);
        this.state = {
            proportion:props.proportion||6,                         // 每个模块的宽度比例
            formitem_label:parseInt(props.form_label,10)||5,        // 表单元素label宽度
            items:props['data-source']||{},                         // 筛选项配置数据
            filters:[]                                              // 筛选项元素
        }
	}
    componentDidMount(){
        if(this.props['data-set']){
            this.props['data-set'](this);
        }
        this.get_form_data();
        document.addEventListener("keydown", this.onKeyDown.bind(this))
    }
    onKeyDown(e){
        if(e.keyCode===13){
            this.get_form_data()
        }
    }
    create_items(){
        let items = this.state.items;
        let filters = [];
        let formItemLayout = {
            labelCol:{ span:0 },
            wrapperCol:{ span:24 }
        }
        let { getFieldDecorator } = this.props.form;
        for(let i in items){
            let item = items[i];
            let ele ;
            if(items[i].type==="range_date"||items[i].type==="range_date_notime"){
                ele = <RangePicker className={i} placeholder={item.placeHolder} />
            }else if(items[i].type==="select"){
                let values = item.values;
                values = typeof values==="string"?this.props[values]:values;
                let opts = [];
                for(let v in values){
                    opts.push(<Option key={i+v} value={values[v].val+""}>{values[v].name}</Option>)
                }
                ele = <Select key={i+"item"} placeholder={item.placeHolder}>{opts}</Select>
            }else if(items[i].type==="date"){
                ele = <DatePicker placeholder={item.placeHolder} />
            }else if(items[i].type==="text"){
                ele = <Input className={i} placeholder={item.placeHolder} />
            }else{
                ele = <div />
            }
            let col = (
                <div className="item" key={i} style={{visibility:i==="blank"?"hidden":"visible"}}>
                    <div className={"element-name "+(item.key_className||"")} dangerouslySetInnerHTML={{__html:item.name}} />
                    <div className="element">
                        <FormItem {...formItemLayout}>
                            {getFieldDecorator(i)(ele)}
                        </FormItem>
                    </div>
                </div>
            )
            filters.push(col);
        }
        return filters
    }
    get_form_data(){
        let form_data = this.props.form.getFieldsValue();
        let res = {};
        for(let f in form_data){
            if(!form_data[f]){
                continue;
            }else if(form_data[f] instanceof Array){
                let obj = this.state.items[f];
                let start = obj["feild_s"];
                let end = obj["feild_e"];
                if(obj.type==="range_date_notime"){
                    if(format_date(form_data[f][0])){
                        res[start] = format_date(form_data[f][0]);
                        res[end] = format_date(form_data[f][1]);
                    }
                    
                }else{
                    if(format_date(form_data[f][0])){
                        res[start] = format_date(form_data[f][0])?format_date(form_data[f][0])+" 00:00:00":"";
                        res[end] = format_date(form_data[f][1])?format_date(form_data[f][1])+" 23:59:59":"";
                    }
                    
                }
            }else{
                res[f] = form_data[f];
            }
        }
        let paths = window.location.pathname;
        localStorage.setItem(paths,JSON.stringify(res))
        this.props['data-get'](res);
    }
    reset_form_data(){
        this.props.form.resetFields();
    }
	render(){
        let cols = this.create_items();
		return (
            <Form className="filter-bar">
    			<div className="items">
                    { cols }
                </div>
                <div className="btns">
                    <Button type="primary" onClick={this.get_form_data.bind(this)}>查询</Button>&emsp;
                    <Button type="defalut" onClick={this.reset_form_data.bind(this)}>重置</Button>
                </div>
            </Form>
		)
	}
}

export default Form.create()(Filter);