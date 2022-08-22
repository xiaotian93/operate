// name width render data_index key_span val_span 
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
		let trs = [],temp = [],count=0;
		for(let c in columns){
			let item = columns[c];
            temp.push(<td key={c+"key"} colSpan={item.span_key} style={{width:item.width_key}} className={"key "+item.className_key}>{item.name}</td>);
            let value = "";
			if(item.render){
                value = item.render(data);
			}else{
                value = data[c];
            }
            value = (value===null||value===undefined||value==="")?"--":value;
            temp.push(<td key={c+"val"} colSpan={item.span_val} style={{width:item.width_val}} className={item.className_val}>{value}</td>);
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