import React , { Component } from 'react';
// import moment from 'moment';

class TableLine extends Component{
	constructor(props){
		super(props);
        let datasource=props.dataSource;
        this.state = {
            source:datasource||[]
        };
        this.map = this.props.dataMap||false;
    }
    componentWillReceiveProps(props){
        this.setState({
            source:props.dataSource||[]
        })
    }
    createTabel(source=[]){
        let trs = [],tds = [];
        for(let c in source){
            if(this.map){
                tds.push(<td className={"key"} key={"k"+c}>{this.map[source[c].key||source[c].question]||source[c].key||source[c].question}</td>);
            }else{
                tds.push(<td className={"key"} key={"k"+c}>{source[c].key||source[c].question}</td>);
            }
            tds.push(<td className={"value"} key={"v"+c}>{source[c].value||source[c].answer}</td>);
        }
        for(let t = 0; t< tds.length;t+=8){
            let line = tds.slice(t,t+8);
            let ll = line.length;
            for(var l=8;l>ll;l-=2){
                line.push(<td key={"b"+l}>--</td>);
                line.push(<td key={"bb"+l}>--</td>);
            }
            trs.push(<tr key={"t"+t}>{line}</tr>);
        }
        return trs;
    }
	render() {
        if(!this.state.source||this.state.source.length<=0){
            return <div style={{textAlign:"center",color:"#0000006e"}}><i className="anticon anticon-frown-o" /> 暂无数据</div>
        }
		return (
            <table className="table-line-full">
                <tbody>
                    { this.createTabel(this.state.source) }
                </tbody>
                <style>
                    {
                        `
                        .table-line-full{
                            width:100%;
                            border-collapse: collapse;
                        }
                        .table-line-full td{
                            padding:10px;
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