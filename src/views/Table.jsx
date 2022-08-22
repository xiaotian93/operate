import React from 'react';
import { Table as TableAntd } from 'antd'

const Table = (props) => {
    let columns = props.columns.map(col => {
        if (!col.render) {
            col.render = data => {
                if (data === null || data === undefined || data === "") return '--';
                return data;
            }
        }
        // 覆盖操作的render
        if (col.operate) {
            col.render = data => {
                if (data.key.toString().indexOf("合计")>=0) return "--"
                return col.operate(data)
            }
        }
        // 重写排序
        if (col.order) {
            col.sorter = (a, b) => {
                if (a.key.toString().indexOf("合计")>=0 || b.key.toString().indexOf("合计")>=0) return;
                return col.order(a, b);
            }
        }
        return col
    });
    let dataSource = props.dataSource.map((data, index) => {
        if (data.key) return data;
        data.key = index + 1;
        return data;
    })
    document.onscroll = function () {
        var table = document.getElementsByClassName("tableInfo")[0];
        var table_fixed = document.getElementsByClassName("tablefixed")[0];
        if (!table || !table_fixed) return;
        var height = table.getElementsByTagName("thead")[0].offsetHeight + 1;
        var offtop = table.getBoundingClientRect().top;
        var width = table.offsetWidth;
        table_fixed.style.display = offtop > 50 ? "none" : "block";
        table_fixed.style.width = width + "px";
        table_fixed.style.height = height + "px";
    }
    return <div className="table-wrapper" style={{fontSize:"12px"}}>
        <TableAntd {...props} columns={columns} dataSource={dataSource} bordered className="tableInfo" />
        <TableAntd {...props} columns={columns} dataSource={dataSource} bordered className="tablefixed" />
        <style>{`.tablefixed{
            position:fixed;
            top:50px;
            overflow:hidden;
            z-index:100;
            display:none;
        }`}</style>
    </div>;
}

export default Table;