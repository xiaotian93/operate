import React from 'react';
import Table from './Table';
import Filter from './form/Filter';
import { Pagination, Spin } from 'antd';

/**
 * 列表View
 * @items 筛选项
 * @columns 表头
 * @dataSource 表格数据
 * @tableInfo 表格其他参数
 * @total 列表总数
 * @current 当前页数
 * @pageSize 每页条数
 * @rember 是否保存状态
 * @bindrember 切换状态
 * @bindpage 翻页事件
 * @bindsearch 搜索事件
 * @bindfilterget 筛选项获取数据事件
 * @bindfilterset 筛选项数据设置事件
 * @listFoot 列表底部内容
 */
const List = ({ items, dataSource, columns, tableInfo, total, current, pageSize, rember, bindrember, bindpage, bindsearch, bindfilterget, bindfilterset, children, listFoot, loading , bindreset,filterOptions }) => {
    const tableProps = {
        dataSource,
        columns,
        pagination: false,
        ...tableInfo
    }
    const paginationProps = {
        total,
        current,
        pageSize,
        showTotal: num => `共${num}条数据`,
        onChange: bindpage,
        style: { textAlign: "right", padding: "15px 0px 0px 0px" }
    }
    return <div className="list-content">
        {items.length>0 && <Filter items={items} bindreset={bindreset} rember={rember} bindsearch={bindsearch} bindget={bindfilterget} bindset={bindfilterset} bindrember={bindrember} options={filterOptions} />}
        <div style={{ backgroundColor: "#FFF", padding: "15px 22px", margin: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>{children}</div>
            <Spin spinning={loading}>
                <Table {...tableProps} />
                {dataSource.length > 0 && <div>{listFoot}</div>}
                {dataSource.length > 0 && <Pagination {...paginationProps} />}
            </Spin>
        </div>
    </div>;
}
List.defaultProps = {
    items: [],
    dataSource: [],
    columns: [],
    tableInfo: {},
    total: 1,
    current: 1,
    pageSize: 0,
    filterOptions:{},
    bindpage: () => { },
    bindsearch: () => { },
    bindfilterget: () => { }
}

export const ListTip = ({ text }) => {
    return <div style={{ padding: "0px 5px", fontSize: "12px", lineHeight: "28px", backgroundColor: "#fffae5", color: "000000a6" }}>{text || "金额单位：元"}</div>
}

export default List;