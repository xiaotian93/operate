import React, { Component } from 'react';
import { Button, Modal, Form ,Tag,Select,message} from 'antd';
import { axios_auth } from '../../../ajax/request';
import { power_assign_list,power_group_list ,power_assign,power_assign_batch,auth_permission,power_perm_update,power_perm_detail} from '../../../ajax/api';
import { page } from '../../../ajax/config';
import { format_table_data } from '../../../ajax/tool';
import List from '../../templates/list';
import Btn from '../../templates/listBtn';
import ComponentRoute from '../../../templates/ComponentRoute';
import Permissions from '../../../templates/Permissions';
import Zone from './dataPower';
const Option = Select.Option;
// let is_del="";
class Loan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            filter: {},
            pageTotal: 1,
            pageCurrent: 1,
            pageSize: page.size,
            data: [],
            total: {},
            list: [],
            listPage: 1,
            selectedRowKeys:[],
            userArr:[],
            roleArr:[],
            roleIds:[]
        };
        this.loader = [];
    }
    componentWillMount() {
        this.columns = [
            {
                title: '序号',
                dataIndex: 'key',
            },
            {
                title: '人员姓名',
                dataIndex: 'name'
            },
            {
                title: '角色名称',
                dataIndex: 'groupList',
                render:e=>{
                    var arr=[]
                    for(var i in e){
                        arr.push(<a href={"/power/manage/role/detail?groupId="+e[i].id} style={{marginRight:"10px"}} key={e[i].id}>{e[i].name}</a>)
                    }
                    return arr.length>0?arr:"-";
                }
            },
            {
                title: '状态',
                dataIndex: "status",
                render: e => (e?"停用":"正常")
            },
            {
                title: '操作',
                render: data => {
                    // var btn=[<Button size="small" type="primary" onClick={(e) => this.edit(data)}>编辑</Button>,
                    // <Button size="small" type="danger" onClick={(e) => this.changeStatua(data)}>停用</Button>,
                    // <Button size="small" type="danger" onClick={(e) => this.delete(data)}>删除</Button>,
                    // <Button size="small" onClick={(e) => this.showDetail(data)}>查看</Button>]
                    var btn=[
                    <Button size="small" type="primary" onClick={(e) => this.showDetail(data)}>分配角色</Button>,
                    <Button size="small" type="primary" onClick={(e) => this.showDataPower(data)}>分配数据权限</Button>
                    ]
                    return <Btn btn={btn} />
                }
            }
        ];
        this.filter = {
            name: {
                name: "人员姓名",
                type: "text",
            },
            phoneNo: {
                name: "手机号",
                type: "text",
            },
            status: {
                name: "状态",
                type: "select",
                values:[{name:"正常",val:"0"},{name:"停用",val:"1"}]
            }
        }
    }
    componentDidMount() {
        var select=window.localStorage.getItem(this.props.location.pathname);
        if(select){
            this.get_list(1,JSON.parse(select).remberData);
        }else{
            this.get_list();
        }
        this.getSelect();
    }
    get_list(page_no = 1, filter = {}) {
        let rqd = JSON.parse(JSON.stringify(filter));
        rqd.page = page_no;
        rqd.size = page.size;
        this.setState({
            loading: true
        })
        this.loader.push("list");
        axios_auth.post(power_assign_list, rqd).then((data) => {
            this.loader.splice(this.loader.indexOf("list"), 1);
            let detail = format_table_data(data.data.list, page_no, page.size);
            this.setState({
                list: detail,
                loading: this.loader.length > 0,
                pageCurrent: data.data.page,
                pageTotal: data.data.totalRecord
            });
        });
    }
    getSelect(){
        var arr=[]
        axios_auth.post(power_group_list).then(e=>{
            if(!e.code){
                var data=e.data.list;
                for(var i in data){
                    if(!data[i].status){
                        arr.push(<Option key={data[i].id} value={data[i].id+""}>{data[i].name}</Option>)
                    }
                }
                this.setState({
                    roleArr:arr
                })
            }
        })
    }
    // 查看详情
    showDetail(data) {
        var group=data.groupList,groupArr=[];
        for(var i in group){
            groupArr.push(group[i].id+"");
        }
        this.setState({
            visible:true,
            batch:false,
            userIds:[data.id],
            roleIds:groupArr
        })
    }
    // 获取筛选数据
    get_filter(data) {
        let filter = {};
        filter = JSON.parse(JSON.stringify(data));
        this.setState({
            filter: filter
        })
        this.get_list(this.state.listPage, filter);
    }
    // 翻页
    page_up(page, pageSize) {
        window.scrollTo(0,0);
        this.setState({
            listPage: page
        })
        this.get_list(page, this.state.filter);
    }
    // 显示总数
    showTotal() {
        return "共" + this.state.pageTotal + "条数据"
    }
    //批量分配
    addUser(perm) {
        if(this.state.selectedRowKeys.length<1){
            message.warn("请先选择用户");
            return
        }
        if(perm){
            this.setState({
                zone_visible:true,
                accountId:""
            })
            setTimeout(function(){
                this.data_child.getZoneList();
            }.bind(this),100)
        }else{
            this.setState({
                visible:true,
                batch:true
            })
        }
        var user=[],id=[];
        for(var i in this.state.selectRow){
            user.push(this.state.selectRow[i].name);
            id.push(this.state.selectRow[i].id)
        }
        this.setState({
            userArr:user,
            userIds:id,
            accountIdList:id
        })
    }
    cancel() {
        this.setState({
            visible:false
        })
    }
    save(){
        var param={};
        var roleIds=this.state.roleIds;
        var userIds=this.state.userIds;
        var roleArr=[],userArr=[];
        for(var i in roleIds){
            var roleJson={
                id:roleIds[i]
            }
            roleArr.push(roleJson)
        }
        for(var j in userIds){
            var userJson={
                id:userIds[j]
            }
            userArr.push(userJson)
        }
        if(this.state.batch){
            param.authAccountsJson=JSON.stringify(userArr)
        }else{
            param.authAccountId=userIds[0]
        }
        param.groupsJson=JSON.stringify(roleArr);
        axios_auth.post(this.state.batch?power_assign_batch:power_assign,param).then(e=>{
            if(!e.code){
                message.success("分配成功");
                this.getAuth();
                this.get_list();
                this.cancel();
                if(this.state.batch){
                    this.setState({
                        selectedRowKeys:[]
                    })
                }
            }
        })

    }
    getAuth(){
        axios_auth.get(auth_permission).then(data=>{
            localStorage.setItem("permissions",JSON.stringify(data.data)||"[]");
        })
    }
    onSelectChange(selectedRowKeys,selectRow) {
        this.setState({ selectedRowKeys ,selectRow});
    };
    role_change(val){
        console.log(val)
        if(val.length<this.state.roleIds.length){
            this.setState({
                roleIds_temp:val
            })
        }else{
            this.setState({
                roleIds:val
            })
        }
        
    }
    deselect(val){
        // console.log(val)
        // is_del=true;
        this.setState({
            deleteRole:val+"",
            visible_del:true
        })
    }
    save_del(){
        // is_del=true;
        this.setState({
            visible_del:false,
            roleIds:this.state.roleIds_temp
        })
    }
    cancel_del(){
        // is_del=false;
        this.setState({
            visible_del:false,
            roleIds:this.state.roleIds
        })
    }
    //分配数据权限
    showDataPower(data){
        this.setState({
            zone_visible:true,
            accountIdList:[data.id],
            accountId:data.id
        })
        setTimeout(function(){
            this.data_child.getZoneList();
        }.bind(this),100)
       
    }
    saveData(){
        var data=this.data_child.state.data,permList=[],havePerm=[];
        data.forEach(item=>{
            permList.push.apply(permList,item.checkedPermission);
            havePerm.push.apply(havePerm,item.havePerm)
        })
        console.log(permList)
        var tempPerm=permList.filter(i=>{
            return havePerm.some(j=>{
                return i.id===j.id&&i.zoneId===j.zoneId
            })
        })
        console.log(tempPerm);
        console.log(havePerm)
        var zonePermAddList = permList.filter(x=>{
			return !tempPerm.some(y=>{
				return x.id===y.id&&x.zoneId===y.zoneId;
			})
        })
        
        var zonePermDelList=havePerm.filter(x=>{
			return !tempPerm.some(y=>{
				return x.id===y.id&&x.zoneId===y.zoneId;
			})
        })
        // return;
        var param={
            zoneTypeKey:"loan-manage-app",
            accountIdList:JSON.stringify(this.state.accountIdList),
            zonePermAddList:JSON.stringify(zonePermAddList),
            zonePermDelList:JSON.stringify(zonePermDelList)
        }
        axios_auth.post(power_perm_update,param).then(e=>{
            if(!e.code){
                message.success("分配成功");
                this.cancelData();
                this.setState({
                    selectedRowKeys:[]
                })
            }
        })
    }
    cancelData(){
        this.setState({
            zone_visible:false
        })
    }
    dataRef(e){
        this.data_child=e
    }
    render() {
        if (this.props.children) {
            return this.props.children
        }
        let pagination = {
            total: this.state.pageTotal,
            current: this.state.pageCurrent,
            pageSize: this.state.pageSize + 1,
            showTotal: this.showTotal.bind(this),
            onChange: this.page_up.bind(this)
        }
        const table_props = {
            rowKey: "key",
            columns: this.columns,
            dataSource: this.state.list,
            footer: () => this.state.totalDes,
            pagination: pagination,
            loading: this.state.loading,
            rowSelection:{
                selectedRowKeys:this.state.selectedRowKeys,
                onChange: this.onSelectChange.bind(this),
            }
        }
        const table = {
            filter: {
                "data-get": this.get_filter.bind(this),
                "data-source": this.filter,
                "defaultValue": this.state.filter,
                "data-paths":this.props.location.pathname,
            },
            tableInfo: table_props,
            tableTitle: {
            left: null,
                right: 
                <div><Button type="primary" onClick={()=>{this.addUser()}}>
                    批量分配角色
                </Button>
                <Button type="primary" onClick={()=>{this.addUser(true)}} style={{marginLeft:5}}>
                批量分配数据权限
            </Button></div>
            }
        }
        const modalInfo={
            title:this.state.batch?"批量分配":"分配角色",
            visible:this.state.visible,
            footer:<div>
                <Button onClick={this.cancel.bind(this)} >取消</Button>
                <Button type="primary" onClick={this.save.bind(this)}>保存</Button>
            </div>,
            closable:false
        }
        const modalDel={
            title:"删除角色",
            visible:this.state.visible_del,
            footer:<div>
                <Button onClick={this.cancel_del.bind(this)} >取消</Button>
                <Button type="primary" onClick={this.save_del.bind(this)}>确定</Button>
            </div>,
            closable:false
        }
        const zoneInfo={
            title:"分配数据权限",
            visible:this.state.zone_visible,
            footer:<div>
                <Button onClick={this.cancelData.bind(this)} >取消</Button>
                <Button type="primary" onClick={this.saveData.bind(this)}>保存</Button>
            </div>,
            closable:false
        }
        return (
            <div>
                <List {...table} />
                <Modal {...modalDel}>
                    确定删除该角色？
                </Modal>
                <Modal {...modalInfo}>
                    {this.state.batch?<div>
                        <div>已选用户</div>
                        <div style={{marginTop:"10px"}}>
                            {this.state.userArr.map((i,k)=>{
                            return <Tag key={k} style={{marginBottom:"5px"}}>{i}</Tag>
                            })}
                        </div>
                        <div style={{margin:"10px 0"}}>分配角色</div>
                        <div>
                            <Select mode="multiple" style={{ width: '100%' }} placeholder="请选择角色" onChange={this.role_change.bind(this)}>
                                {this.state.roleArr}
                            </Select>
                        </div>
                    </div>:<Select mode="multiple" style={{ width: '100%' }} placeholder="请选择角色" onChange={this.role_change.bind(this)} value={this.state.roleIds} onDeselect={this.deselect.bind(this)} dropdownStyle={{display:this.state.visible_del?"none":""}}>
                            {this.state.roleArr}
                    </Select>
                    }
                </Modal>
                <Modal {...zoneInfo}><Zone onRef={this.dataRef.bind(this)} accountId={this.state.accountId} >
                <div>已选用户</div>
                        <div style={{marginTop:"10px"}}>
                            {this.state.userArr.map((i,k)=>{
                            return <Tag key={k} style={{marginBottom:"5px"}}>{i}</Tag>
                            })}
                        </div>
                    </Zone></Modal>
            </div>
        )
    }
}

export default ComponentRoute(Form.create()(Loan));
