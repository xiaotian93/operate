import React , { Component } from 'react';


class Table extends Component{
	constructor(props){
        super(props);
		var source=props["data-source"]
        this.state = {
        	...source,
        	trs:[]
        }
    }
    render(){
		let columns = this.props['data-columns'];
		let data = this.props['data-source'];
		let num = parseInt(this.props['data-row'],10)||8;
		let trs = [],temp = [],count=0,col_num=Object.keys(columns).length;
		// for(var p in columns){
		// 	col_num++;
        // }
		var tem=col_num%4;
		if(col_num>4&&tem){
			for(var j=0;j<tem;j++){
				columns["z"+j]="-";
			}
		}else{
			var aa=4-col_num;
			for(var m=0;m<aa;m++){
				columns["z"+m]="-";
			}
		}
		for(let c in columns){
			let item = columns[c];
			temp.push(<td key={c+"key"} colSpan={item.span_key} style={{width:item.width_key}} className={"key "+item.className_key||""}>{item.name||"--"}</td>);
			if(item.render){
				temp.push(<td key={c+"val"} colSpan={item.span_val} style={{width:item.width_val}} className={item.className_val||""}>{ item.render(data)||"--" }</td>);
			}else{
				temp.push(<td key={c+"val"} colSpan={item.span_val} style={{width:item.width_val}} className={item.className_val||""}>{data[c]||"--"}</td>);
			}
			count += parseInt(item.span_val||1,10) + parseInt(item.span_key||1,10);
			if(count%num===0){
				trs.push(<tr key={c+"tr"}>{temp}</tr>);
				temp = [];
				count = 0;
			}
		}
    	return <table className="table-col"><tbody>{ trs }</tbody></table>
    }
}

export default Table;