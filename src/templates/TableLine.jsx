import React , { Component } from 'react';
import { bmd } from '../ajax/tool';
// import moment from 'moment';

class TableLine extends Component{
	constructor(props){
		super(props);
        let datasource=props.dataSource;
        this.state = {
            source:datasource||{}
        };
        this.columns = props.columns;
    }
    componentWillReceiveProps(props){
        this.setState({
            source:props.dataSource||{}
        })
    }
    createTabel(columns){
        let trs = [],tds = [];
        for(let c in columns){
            tds.push(<td className={"key " + (columns[c].classNameKey||"")} key={"k"+c}>{columns[c].title||columns[c].name}</td>);
            if(columns[c].render)
                tds.push(<td className={"value " + (columns[c].classNameVal||"")} key={"v"+c}>{columns[c].render(this.state.source)}</td>);
            else
                tds.push(<td className={"value " + (columns[c].classNameVal||"")} key={"v"+c}>{bmd.resolveBlank(this.getDeepObjVal(this.state.source,columns[c].dataIndex))}</td>);
        }
        for(let t = 0; t< tds.length;t+=8){
            let line = tds.slice(t,t+8);
            let temp=line.length;
            for(var l=8;l>temp;l--){
                line.push(<td key={"b"+l}>--</td>);
                // line.push(<td key={"bb"+l}>--</td>);
            }
            trs.push(<tr key={"t"+t}>{line}</tr>);
        }
        return trs;
    }
    getDeepObjVal(obj,dataIndex="") {
        let res = "";
        let keys = dataIndex.split(".");
        if(!dataIndex){
            return "noKey";
        }
        if(keys.length<=1){
            return (obj[keys[0]]===null||obj[keys[0]]===undefined)?"--":obj[keys[0]];
        }
        res = JSON.stringify(obj[keys[0]]||{})
        for(let k=1;k<keys.length;k++){
            res = JSON.parse(res)[keys[k]];
        }
        return (res===null||res===undefined)?"--":res
    };
	render() {
		return (
            <table className="table-line-full">
                <tbody>
                { this.createTabel(this.columns) }
                </tbody>
                <style>
                    {
                        `
                        .table-line-full{
                            width:100%;
                            border-collapse: collapse;
                            font-size:13px;
                        }
                        .table-line-full td{
                            padding:5px 10px;
                            border:1px solid rgba(220,222,226,1);
                            word-break: break-word;
                        }
                        .table-line-full td.key{
                            font-weight: bold!important;
                            background-color: #F4F4F4;
                            font-weight:800;
                            width:10%;
                        }
                        .table-line-full td.value{
                            width:15%;
                        }
                        `
                    }
                </style>
            </table>
		)
	}
}

export default TableLine;