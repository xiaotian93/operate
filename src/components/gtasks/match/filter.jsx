import React , { Component } from 'react';
import { Row , Col , DatePicker , Select ,Button,Input} from 'antd';
import moment from 'moment';

// import Btn from '../../ui/Buttons';
const RangePicker = DatePicker.RangePicker
const Option = Select.Option;

class Filter extends Component{
	constructor(props){
		super(props);
        this.state = { ...props }
	}
    componentDidMount(){
        // this.reset_data();
        document.addEventListener("keydown", this.onKeyDown.bind(this));
        let items = this.state['data-source'];
        var get_select=JSON.parse(window.localStorage.getItem(this.state['data-paths']));
        for(var i in get_select){
            for(let j in items){
                if(items[j].type==="range_date"){
                    this.setState({
                        time:[moment(get_select[items[j].feild_s]),moment(get_select[items[j].feild_e])]
                    })
                }else{
                    this.setState({
                [i]:get_select[i]
            })
                }
            }
        }
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
        let values = {};
        for(let i in items){
            if(!this.state[i]||this.state[i].length<=0){
                continue;
            }
            if(items[i].type==="range_date"){
                let key_s = items[i].feild_s;
                values[key_s] = this.state[i]?this.state[i][0].format("YYYY-MM-DD") + " 00:00:00":"";
                let key_e = items[i].feild_e;
                values[key_e] = this.state[i]?this.state[i][1].format("YYYY-MM-DD") + " 23:59:59":"";
            }else if(items[i].type==="multi_select"){
                let arr = [];
                arr = this.state[i]||[];
                values[i] = arr.join(',');
            }else{
                values[i] = this.state[i]||"";
            }
        }
        this.props['data-get'](values);
    }
    reset_data(e){
        let items = this.state['data-source'];
        let null_data = {}
        for(let i in items){
            if(!items[i].default&&(!this.state[i]||this.state[i].length<=0)){
                continue;
            }
            null_data[i] = "";
            if(items[i].type==="range_date"){
                null_data[i] = items[i].default;
            }else if(items[i].type==="multi_select"){
                null_data[i] = [];
            }else if(items[i].type==="select"){
                null_data[i] = "";
            }else{
                document.getElementById(i).value = "";
            }
        }
        this.setState(null_data)
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
                ele = (
                    <Col key={i} className="element">
                        <RangePicker value={this.state[i]} className={i} placeholder={items[i].placeHolder} onChange={(date,str)=>{ this.dateChange(date,str,i) }} />
                    </Col>)
            }else if(items[i].type==="text"){
                ele = (
                    <Col key={i} className="element">
                        <Input id={i} onChange={this.textChange.bind(this)} type="text" className="ipt-text" placeholder={items[i].placeHolder} value={this.state[i]} />
                    </Col>)
            }else if(items[i].type==="select"){
                let values = items[i].values;
                let opt_ele = [];
                for(let v in values){
                    opt_ele.push(<Option key={v} value={values[v].val+""}>{values[v].name}</Option>)
                }
                let select = (<Select value={this.state[i]} id={i} placeholder={items[i].placeHolder} onChange={(val)=>{ this.selectChange(val,i)}}>{opt_ele}</Select>);
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
                        <Select key={i} value={this.state[i]} mode="multiple" placeholder={items[i].placeHolder} onChange={(val)=>{ this.selectChange(val,i)}}>
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
                </Row>
                
                <Row style={{textAlign:"right",marginTop:"10px"}}>
                    <Button type="primary" onClick={this.get_data.bind(this)}>查询</Button>&emsp;
                    <Button onClick={this.reset_data.bind(this)}>重置</Button>
                </Row>
            </Row>
		)
	}
}

export default Filter;