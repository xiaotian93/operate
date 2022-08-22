import React , { Component } from 'react';
import { Row , Col , DatePicker , Input ,Button} from 'antd';
// import moment from 'moment';
let datas={};
class Line_Table extends Component{
    constructor(props){
        super(props);
        let datasource=props.dataSource;
        this.state = {
            ...datasource
        };
        this.columns = props.columns;
        this.line = props.line;
    }
    get_obj_key(obj,dataIndex) {
        let res = "";
        let keys = dataIndex.split(".");
        if(keys.length<=1){
            return (obj[keys[0]]||"");
        }
        res = JSON.stringify(obj[keys[0]])
        for(let k=1;k<keys.length;k++){
            res = JSON.parse(res)[keys[k]];
        }
        return res
    };
    dateChange(date, dateString,key) {
        console.log(date, dateString);
        this.setState({
            [key]:dateString
        })
        //this.props.getdate(key,dateString)
    }
    textChange(e){
        let key = e.target.getAttribute("id");
        this.setState({
            [key]:e.target.value
        })
        //this.props.getdate(key,e.target.value)
    }
    getData(){
        let columns=this.columns;
        let data={};
        for(let i in columns){
            if(columns[i].id){
                //data.key=columns[i].id;
                //data.value=this.state[columns[i].id];
                data[columns[i].id]=this.state[columns[i].id]||''
            }
        }
        this.props.getdate(data)
    }
    data(keys,values){
        datas.key=keys;
        datas.value=values;
    }
    render() {
        let columns = this.columns;
        let line = this.line;
        let count = 1,trs = [],tds = [];
        for(let c in columns){
            tds.push(
                <td className={columns[c].className||""} key={"key"+c} >{columns[c].title}</td>
            )
            if(!columns[c].type){
                let value = "";
                if(columns[c].dataIndex){
                    // value = this.state[columns[c].dataIndex]||"";
                    value = this.get_obj_key(this.state,columns[c].dataIndex);
                }else{
                    value = columns[c].render(this.state);
                }
                tds.push(
                    <td className={columns[c].className||""} key={"value"+c} >{value}</td>
                );
            }else if(columns[c].type==="date"){
                tds.push(
                    <td className={columns[c].className||""} key={"value"+c} ><DatePicker id={columns[c].id||""} onChange={(data,str)=>{this.dateChange(data,str,columns[c].id)}} /></td>
                )
            }else if(columns[c].type==="input"){
                tds.push(
                    <td className={columns[c].className||""} key={"value"+c} ><Input placeholder={columns[c].placeholder||""} id={columns[c].id||""} onChange={this.textChange.bind(this)} /></td>
                )
            }


            if(count%line===0){
                trs.push(
                    <tr className={tds[0].props.className} key={"tr"+c}>
                        {tds.splice(0,line*2)}
                    </tr>
                )
            }
            count ++;
        }

        return (
            <div>
                <Row>
                    <Col span={24} style={{background:"#fff",position:"relative"}}>
                        <table className="line-table">
                            <tbody>
                            { trs }
                            </tbody>
                        </table>

                    </Col>

                </Row>
                <div style={{"textAlign":"center","marginTop":"40px"}}>
                    <a href="/bus/list/insurance"><Button type="primary">返回</Button></a>
                    <Button type="primary" style={{"marginLeft":"20px"}} onClick={this.getData.bind(this)}>确认</Button>
                </div>
            </div>

        )
    }
}

export default Line_Table;