import React , { forwardRef } from 'react';
import { Form as FormAnt, Input, Button, Select, DatePicker } from 'antd';
import moment from 'moment';

const FormItem = FormAnt.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
/**
 * 筛选项
 * @items 表单元素
 * @bindsubmit 搜索事件
 * @bindget 获取数据
 */
const Form = forwardRef(({ items, form, bindsubmit, bindget, bindset, bindreset, options },_ref) => {
    const { getFieldDecorator, resetFields, getFieldsValue, setFieldsValue } = form;
    const getData = () => {
        let formData = getFieldsValue();console.log(formData)
        items.forEach(item => {
            let val = formData[item.key];
            if (val === undefined || val === null || val === "") return delete formData[item.key];
            if (item.type === 'range_date') {
                if (val.length === 2) {
                    formData[item.feild_s] = val[0].format("YYYY-MM-DD") + (item.withTime ? " 00:00:00" : "");
                    formData[item.feild_e] = val[1].format("YYYY-MM-DD") + (item.withTime ? " 23:59:59" : "");
                }
                delete formData[item.key]
            }
            if (item.name&&item.name.indexOf("金额")!==-1) {
                formData[item.key] = formData[item.key]*100;
            }
        })
        return formData;
    }
    bindget(getData);
    const setData = data => {
        if (!data) return;
        let formValue = {};
        items.forEach(item => {
            if (item.type === "range_date") {
                formValue[item.key] = (data[item.feild_s] && data[item.feild_e]) ? [moment(data[item.feild_s]), moment(data[item.feild_e])] : undefined;
            } else {
                if (data[item.key] === undefined) return;
                if (item.type === 'select') {
                    formValue[item.key] = data[item.key] || null;
                } else {
                    formValue[item.key] = data[item.key];
                }
            }
        })
        setFieldsValue(formValue);
    }
    bindset(setData);
    const searchData = () => {
        bindsubmit(getData());
    }
    const renderViewItem = item => {
        switch (item.type) {
            case "select":
                let values = item.values || options[item.key] || [];
                return <Select placeholder={item.placeholder || `请选择${item.name || item.key}`} onChange={item.onChange}>
                    <Option value={null}>全部</Option>
                    {values.map(val => <Option value={val.val + ""} key={val.val} >{val.name}</Option>)}
                </Select>
            case "range_date":
                return <RangePicker placeholder={item.placeholder || ["开始时间", "结束时间"]} />
            case "text":
            default:
                return <Input style={{ height: "30px", padding: "0px 10px" }} placeholder={item.placeholder || `请输入${item.name || item.key}`} />;
        }
    }
    const renderItem = item => {
        if (item.type === "submit") return <FormItem>
            <Button type="primary" onClick={searchData}>查询</Button>&emsp;
            {item.reset && <Button onClick={() => { resetFields(); bindreset(); }}>重置</Button>}
        </FormItem>
        return <div style={{display:"flex",alignItems:"center",marginBottom:"20px"}} key={item.key}>
            <label style={{fontSize:"14px",color:"#00000080",marginRight:"10px"}}>{ item.name }</label>
            <FormItem style={{flexGrow:1,marginBottom:"0px"}}>
                {getFieldDecorator(item.key, { initialValue: item.default, valuePropName: item.valuePropName || "value" })(renderViewItem(item))}
            </FormItem>
        </div>
    }
    return <FormAnt ref={_ref}>
        {items.map(item => renderItem(item))}
    </FormAnt>
})
Form.defaultProps = {
    bindsubmit: () => { },
    bindget: () => { },
    bindset: () => { },
    bindreset: () => { }
}
export default FormAnt.create()(Form);