import React, { Component } from 'react';
import { Form as FormAnt, Input, Checkbox, Button, Select, DatePicker } from 'antd';
import moment from 'moment';
const FormItem = FormAnt.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
/**
 * 筛选项
 * @items 表单元素
 * @bindsearch 搜索事件
 * @bindget 获取数据
 */

class Filter extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        props.bindget(this.getData.bind(this));
        props.bindset(this.setData.bind(this));
    }
    itemStyle = { display: "flex", alignItems: "center", marginTop: "10px", paddingRight: "20px" };
    getData() {
        let formData = this.props.form.getFieldsValue();
        this.props.items.forEach(item => {
            let val = formData[item.key];
            if (val === undefined || val === null || val === "") return delete formData[item.key];
            if (item.type === 'range_date') {
                if (val.length === 2) {
                    formData[item.feild_s] = val[0].format("YYYY-MM-DD") + (item.withTime ? " 00:00:00" : "");
                    formData[item.feild_e] = val[1].format("YYYY-MM-DD") + (item.withTime ? " 23:59:59" : "");
                }
                delete formData[item.key]
            }
            if(item.type === 'date'){
                formData[item.key] = val.format("YYYY-MM-DD");
            }
            if(item.name&&item.name.indexOf("⾦额")!==-1){
                formData[item.key] = val*100;
            }
        })
        return formData;
    }
    setData(data) {
        if (!data) return;
        let formValue = {};
        this.props.items.forEach(item => {
            if (item.type === "range_date") {
                formValue[item.key] = (data[item.feild_s] && data[item.feild_e]) ? [moment(data[item.feild_s]), moment(data[item.feild_e])] : undefined;
            }else if(item.type === 'date'){
                formValue[item.key] = data[item.key] ? moment(data[item.key]) : undefined;
            } else {
                if (data[item.key] === undefined) return;
                if (item.type === 'select') {
                    formValue[item.key] = data[item.key] || null;
                } else {
                    formValue[item.key] = data[item.key];
                }
            }
        })
        this.props.form.setFieldsValue(formValue);
    }
    searchData() {
        this.props.bindsearch(this.getData());
    }
    renderViewItem(item) {
        switch (item.type) {
            case "select":
                let values = item.values || this.props.options[item.key] || [];
                return <Select placeholder={item.placeholder || `请选择${item.name || item.key}`} onChange={item.onChange}>
                    <Option value={null}>全部</Option>
                    {values.map(val => <Option value={val.val + ""} key={val.val} >{val.name}</Option>)}
                </Select>
            case "range_date":
                return <RangePicker placeholder={item.placeholder || ["开始时间", "结束时间"]} />
            case "date":
                return <DatePicker placeholder={item.placeholder || "请选择日期"} />
            case "text":
            default:
                return <Input style={{ height: "30px", padding: "0px 10px" }} placeholder={item.placeholder || `请输入${item.name || item.key}`} />;
        }
    }
    renderItem(item) {
        return <div style={{ ...this.itemStyle }} className="filter-form" key={item.key}>
            <label style={{ marginRight: "10px" }}>{item.name}</label>
            <FormItem style={{ width: "180px", display: "inline-block", marginBottom: "0px" }}>
                {this.props.form.getFieldDecorator(item.key, { initialValue: item.default, valuePropName: item.valuePropName || "value" })(this.renderViewItem(item))}
            </FormItem>
        </div>
    }
    render() {
        const { items, bindrember, rember, bindreset } = this.props;
        const { resetFields } = this.props.form;
        return <FormAnt style={{ display: "flex", flexWrap: "wrap", padding: "5px 22px 15px 22px" }}>
            {items.map(item => this.renderItem(item))}
            <div style={{ ...this.itemStyle }}>
                <Checkbox onChange={bindrember} defaultChecked={rember}>记住</Checkbox>
                <Button type="primary" onClick={this.searchData.bind(this)}>查询</Button> &emsp;
                <Button onClick={() => { resetFields(); bindreset(); }}>重置</Button>
            </div>
        </FormAnt>
    }
}

Filter.defaultProps = {
    bindsearch: () => { },
    bindget: () => { },
    bindset: () => { },
    bindreset: () => { }
}
export default FormAnt.create()(Filter);