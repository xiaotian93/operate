import React , { Component } from 'react';
import { Row , Col , DatePicker , Select , Button ,Input,Checkbox} from 'antd';
import moment from 'moment';

const RangePicker = DatePicker.RangePicker
const Option = Select.Option;

class Filter extends Component{
	constructor(props){
		super(props);
        this.state = { ...props }
	}
    componentDidMount(){
        let default_data = (this.props["data-set"]?this.props["data-set"]():{});
        let default_value = {};
        for(let d in default_data){
            default_value[default_data[d].key] = default_data[d].value
        }
        var select=JSON.parse(window.localStorage.getItem(this.state['data-paths']));
        var get_select=select?select.remberData:[];
        this.setState({
            isRember:select?select.isRember:false
        })
        for(let m in get_select){
            var start,end;
            if(get_select[m].op==="ge"){
                start=get_select[m].value
            }
            if(get_select[m].op==="le"){
                end=get_select[m].value
            }
            if(get_select[m].op==="ge"||get_select[m].op==="le"){
                    this.setState({
                        time:[moment(start),moment(end)]
                    })
            }else{
                if(get_select[m].value.indexOf("-")!==-1){
                    default_value[get_select[m].key] = moment(get_select[m].value)
                }else{
                    default_value[get_select[m].key] = get_select[m].value
                }
            }
        }
        this.setState({...default_value});
        document.addEventListener("keydown", this.onKeyDown.bind(this))
    }
    onKeyDown(e){
        if(e.keyCode===13){
            this.get_data()
        }
    }
    textChange(e){
        let key = e.target.getAttribute("id");
        this.setState({
            [key]:e.target.value
        })
    }
    selectChange(val,key){
        this.setState({
            [key]:val
        })
    }
    dateChange(date1,date2,key){
        this.setState({
            [key]:date1
        })
    }
    get_data(e){
        let items = this.state['data-source'];
        let values = [];
        for(let i in items){
            if(!this.state[i]||this.state[i].length<=0){
                continue;
            }
            if(items[i].type==="range_date"){
                let start = {}
                let sdate = this.state[i][0];
                start.key = items[i].feild_s;
                start.value = sdate?sdate.format("YYYY-MM-DD") + " 00:00:00":"";
                start.op = "ge";
                let end = {};
                let edate = this.state[i][1];
                end.key = items[i].feild_e;
                end.value = edate?edate.format("YYYY-MM-DD") + " 23:59:59":"";
                end.op = "le";
                values.push(start,end);
            }else if(items[i].type==="range_date_notime"){
                let start = {}
                let sdate = this.state[i][0];
                start.key = items[i].feild_s;
                start.value = sdate?sdate.format("YYYY-MM-DD"):"";
                start.op = "ge";
                let end = {};
                let edate = this.state[i][1];
                end.key = items[i].feild_e;
                end.value = edate?edate.format("YYYY-MM-DD"):"";
                end.op = "le";
                values.push(start,end);
            }else if(items[i].type==="multi_select"){
                let arr = [];
                arr = this.state[i]||[];
                values.push({
                    key:i,value:arr.join(','),op:"in"
                })
            }else if(items[i].type==="single_date"){
                let val = {};
                val.key = i;
                val.value = this.state[i].format("YYYY-MM-DD")||"";
                val.op = items[i].op?items[i].op:"eq";
                values.push(val);
            }else{
                let val = {};
                val.key = i;
                val.value = this.state[i]||"";
                val.op = items[i].op?items[i].op:"eq";
                values.push(val);
            }
        }
        var pathData={};
        pathData.isRember=this.state.isRember;
        pathData.remberData=this.state.isRember?values:[];
        window.localStorage.setItem(this.props["data-paths"],JSON.stringify(pathData));
        console.log(pathData)
        this.props['data-get'](values);
    }
    reset_data(e){
        let items = this.state['data-source'];
        let null_data = {}
        for(let i in items){
            if(!this.state[i]||this.state[i].length<=0){
                continue;
            }
            null_data[i] = "";
            if(items[i].type==="range_date"||items[i].type==="range_date_notime"){
                null_data[i] = items[i].default;
            }else if(items[i].type==="multi_select"){
                null_data[i] = [];
            }else if(items[i].type==="select"){
                if(items[i].resetValue){
                    null_data[i] = items[i].resetValue;
                }else{
                    null_data[i] = "";
                }
                // null_data[i] = undefined;
            }else if(items[i].type==="single_date"){
                null_data[i] = undefined;
            }else{
                document.getElementById(i).value = "";
            }
        }
        this.setState(null_data);
        // this.props['data-get'](null_data);

    }
    remeber(e){
        this.setState({
            isRember:e.target.checked
        })
    }
	render(){
        let items = this.state["data-source"];
        let filter_elements = [];
        for(let i in items){
            let ele = "";
            let label = (
                <Col key={i+"key"} className="element-name">
                    {items[i].name}
                </Col>
            )
            if(items[i].type==="range_date"){
                console.log(i)
                ele = (
                    <Col key={i} className="element">
                        <RangePicker value={this.state[i]} className={i} placeholder={["开始时间","结束时间"]} onChange={(date,str)=>{ this.dateChange(date,str,i) }} allowClear={!items[i].no_clear} />
                    </Col>)
            }else if(items[i].type==="range_date_notime"){
                ele = (
                    <Col key={i} className="element">
                        <RangePicker value={this.state[i]} className={i} placeholder={items[i].placeHolder} onChange={(date,str)=>{ this.dateChange(date,str,i) }} allowClear={!items[i].no_clear} />
                    </Col>)
            }else if(items[i].type==="single_date"){
                ele = (
                    <Col key={i} className="element">
                        <DatePicker value={this.state[i]} onChange={(date,str)=>{ this.dateChange(date,str,i) }} className={i} placeholder={"请选择"+items[i].name} allowClear={!items[i].no_clear} />
                    </Col>)
            }else if(items[i].type==="text"){
                ele = (
                    <Col key={i} className="element">
                        <Input id={i} onChange={this.textChange.bind(this)} type="text" className="ipt-text" placeholder={"请输入"+items[i].name} value={this.state[i]} />
                    </Col>)
            }else if(items[i].type==="select"){
                let values = items[i].values;
                values = typeof values==="string"?this.props[values]:values;
                let opt_ele = (items[i].all==="hidden")?[<Option key={100} value={items[i].defaultValue?items[i].defaultValue:""}>全部</Option>]:[<Option key={100} value={items[i].defaultValue?items[i].defaultValue:""}>全部</Option>];
                for(let v in values){
                    if(values[v].name!=="全部"){
                        opt_ele.push(<Option key={v} value={values[v].val+""}>{values[v].name}</Option>)
                    }
                }
                // console.log(opt_ele)
                let select = (<Select dropdownMatchSelectWidth={false} dropdownMenuStyle={{width:"auto"}} value={this.state[i]||""} id={i} placeholder={items[i].placeHolder} onChange={(val)=>{ this.selectChange(val,i)}}>{opt_ele}</Select>);
                ele = (
                    <Col key={i} className="element">
                        {select}
                    </Col>)
            }else if(items[i].type==="multi_select"){
                let val_key = items[i].values;
                let ops = this.state[val_key];
                let opt_ele = [];
                for(let o in ops){
                    opt_ele.push(<Option key={ops[o].val}>{ops[o].name}</Option>)
                }
                ele = (
                    <Col key={i} className="element">
                        <Select dropdownMatchSelectWidth={false} dropdownMenuStyle={{width:"auto"}} key={i} value={this.state[i]} mode="multiple" placeholder={"请选择"+items[i].name} onChange={(val)=>{ this.selectChange(val,i)}}>
                            {opt_ele}
                        </Select>
                    </Col>
                )
            }
            var divs=(
                <div className="item" key={i}>{label}{ele}</div>
            )
            filter_elements.push(divs);
        }
		return (
			<Row className="filter filter-bar">
                <Row className="items">
                    {filter_elements}
                    <div className="item">
                    <Checkbox onChange={this.remeber.bind(this)} checked={this.state.isRember}>记住</Checkbox>
                    <Button type="primary" onClick={this.get_data.bind(this)}>查询</Button>&emsp;
                    <Button onClick={this.reset_data.bind(this)}>重置</Button>
                    </div>
                </Row>
            
                {/* <Row style={{textAlign:"right",marginTop:"10px"}}>
                    <Button type="primary" onClick={this.get_data.bind(this)}>查询</Button>&emsp;
                    <Button onClick={this.reset_data.bind(this)}>重置</Button>
                </Row> */}
            </Row>
		)
	}
}

export default Filter;