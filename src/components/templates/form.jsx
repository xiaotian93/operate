import React, { Component } from 'react';
import { Row, Col, Form, Input, Modal, Radio, Button, message, Select, Icon, Tooltip ,Upload,Checkbox} from 'antd';
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
var formArr=[];
class Basic extends Component{
    constructor(props) {
        super(props);
        this.data=[
            {
                formTitle:"测试",
                type:"input",   //input select upload textArea range（范围）radio checkbox text
                key:"aa",
                formInner:"%",
                formOut:"123",
                initialValue:"",
                rules:[{ required: true, message: "请输入" }, { pattern: /^[1-9]\d*$/, message: "格式错误" }],
                formEvens:{}
            },
            {
                formTitle:"select1",
                type:"select",   //input select upload textArea range（范围）radio checkbox text
                key:"aa1",
                formInner:"",
                formOut:"",
                initialValue:"",
                rules:[],
                formEvens:{},
                values:[{val:1,name:"123"},{val:2,name:"23455"}]
            },
            {
                formTitle:"upload",
                type:"upload",   //input select upload textArea range（范围）radio checkbox text
                key:"aa2",
                formInner:"",
                formOut:"",
                initialValue:"",
                rules:[],
                formEvens:{
                    name:"file",
                    action:"wwww",

                },
                values:[]
            },
            {
                formTitle:"textArea",
                type:"textArea",   //input select upload textArea range（范围）radio checkbox text
                key:"aa3",
                formInner:"",
                formOut:"",
                initialValue:"",
                rules:[],
                formEvens:{},
                values:[]
            },
            {
                formTitle:"radio",
                type:"radio",   //input select upload textArea range（范围） radio checkbox text
                key:"aa4",
                formInner:"",
                formOut:"",
                initialValue:"",
                rules:[],
                formEvens:{},
                values:[{val:1,name:"123"},{val:2,name:"23455"}]
            },
            {
                formTitle:"checkbox",
                type:"checkbox",   //input select upload textArea range（范围） radio checkbox text
                key:"aa5",
                formInner:"",
                formOut:"",
                initialValue:[],
                rules:[],
                formEvens:{},
                values:[{val:1,name:"123"},{val:2,name:"23455"}]
            },
            {
                formTitle:"text",
                type:"text",   //input select upload textArea range（范围） radio checkbox text
                key:"aa6",
                formInner:"",
                formOut:"",
                initialValue:"",
                rules:[],
                formEvens:{},
                values:"123333"
            },
            {
                formTitle:"range",
                type:"range",   //input select upload textArea range（范围） radio checkbox text
                key:["aa7","aa8"],
                formInner:"%",
                formOut:"",
                initialValue:{min:"",max:""},
                rules:{min:[],max:[]},
                formEvens:{},
                values:"",
                placeholder:{min:"",max:""}
            }
        ];
        this.formArr=[]

    }
    componentWillMount(){
        formArr=[]
        // this.setForm();
    }
    componentDidMount(){
        // formArr=[]
    }
    setForm(data){
        var info=data.formEvens?data.formEvens:{};
        const type=data.type;
        switch(type){
            case 'input':
                return <Input placeholder={"请输入"+data.formTitle} {...info} />;
            case 'select':
                return <Select placeholder={"请选择"+data.formTitle}>
                    {data.values.map((i,k)=>{
                        return <Option value={i.val.toString()} key={k}>{i.name}</Option>
                    })}
                </Select>
            case 'upload':
                return <Upload {...info}><Button>上传</Button></Upload>
            case 'textArea':
                return <TextArea placeholder={"请输入"+data.formTitle} {...info} />;
            case 'radio':
                return <Radio.Group placeholder={"请选择"+data.formTitle}>
                    {data.values.map((i,k)=>{
                        return <Radio value={i.val} key={k}>{i.name}</Radio>
                    })}
                </Radio.Group>
            case 'checkbox':
                return <Checkbox.Group placeholder={"请选择"+data.formTitle}>
                    {data.values.map((j,m)=>{
                        return <Checkbox value={j.val.toString()} key={m}>{j.name}</Checkbox>
                    })}
                </Checkbox.Group>
        }
    }
    //获取表单返回值
    get_val(){
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err){
                console.log(values)
            }
        })
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const formInfo = {
            labelCol: { span: 5 },
            wrapperCol: { span: 6 },
            colon: false
        };

        const formInfoText = {
            labelCol: { span: 6 },
            wrapperCol: { span: 4 },
            colon: false
        };
        const formInfoSmall = {
            labelCol: { span: 7 },
            wrapperCol: { span: 11 },
            colon: false,
            className: "tableForm text_left",
            labelAlign: "left"
        };
        const titleInfo = {
            span: 4,
            className: "text_margin"
        }
        var data=this.data
        return (
            <Form className="sh_add">
            {
                data.map((i,k)=>{
                    switch(i.type){
                        case 'text':
                            return <Row style={{ marginBottom: "10px", fontSize: "14px" }} key={k}>
                            <Col span={6}><span style={{ width: "100%", paddingRight: "10px", lineHeight: "20px", whiteSpace: "normal", display: "inline-block", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>{i.formTitle}</span></Col>
                            <Col span={8} style={{ lineHeight: "22px", color: "#000" }}>{i.values}</Col>
                        </Row>
                        case 'range':
                            return <Row key={k}>
                            <Col
                                span={6}
                                style={{ textAlign: "right", fontSize: "14px", color: "rgba(0,0,0,0.5)", paddingRight: "10px", marginBottom: "15px", lineHeight: "32px" }}
                            >
                                <span>{i.formTitle}</span>
                            </Col>
                            <Col span={8}>
                                <FormItem className="text_left" label="" {...formInfoSmall} >
                                    {getFieldDecorator(i.key[0], {
                                        initialValue: i.initialValue.min,
                                        rules: i.rules.min
                                    })(
                                        <Input placeholder={"请输入"+(i.placeholder?i.placeholder.min:"")} />
                                    )}
                                    {i.formInner?<div className="formIcon">{i.formInner}</div>:null}
                                    {i.formOut?<div className="formText">{i.formOut}</div>:null}
                                </FormItem>
                            </Col>
                            <Col span={1} pull={4} style={{ lineHeight: "32px" }}>——</Col>
                            <Col span={8} pull={4} >
                                <FormItem className="" label="" {...formInfoSmall} >
                                    {getFieldDecorator(i.key[1], {
                                        initialValue: i.initialValue.max,
                                        rules: i.rules.max
                                    })(
                                        <Input placeholder={"请输入"+(i.placeholder?i.placeholder.max:"")} />
                                    )}
                                    {i.formInner?<div className="formIcon">{i.formInner}</div>:null}
                                    {i.formOut?<div className="formText">{i.formOut}</div>:null}
                                </FormItem>
                            </Col>

                        </Row>
                        default:
                            return <FormItem label={i.formTitle} labelCol={{ span: 6 }} wrapperCol={{ span: 8 }} colon={false} key={i.key}>
                            {getFieldDecorator(i.key, {
                                initialValue: i.initialValue,
                                rules: i.rules
                            })(
                                this.setForm(i)
                            )}
                            {i.formInner?<div className="formIcon">{i.formInner}</div>:null}
                            {i.formOut?<div className="formText">{i.formOut}</div>:null}
                        </FormItem>
                    }
                })
            }
            <Button onClick={this.get_val.bind(this)}>提交</Button>
            </Form>
        )
    }
}
export default Form.create()(Basic);