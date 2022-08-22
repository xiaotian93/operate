import React, { Component } from 'react';
import {Table,Checkbox} from 'antd';
import { axios_auth } from '../../../ajax/request';
import { power_zone_list,power_permission_list,power_perm_detail} from '../../../ajax/api';
const CheckboxGroup = Checkbox.Group;
class Power extends Component{
    constructor(props) {
        super(props);
        props.onRef(this);
        this.state = {
            
        };
        this.columns=[
            {
                title:"项目",
                dataIndex:"name"
            },
            {
                title:"权限列表",
                render:(e,row,index)=>{
                    var arr=[];
                    e.havePermValue.forEach(item=>{
                        arr.push(item.id||item.value)
                    })
                    return <CheckboxGroup options={e.ZonePermission} value={arr} onChange={(checked)=>{this.getCheck(checked,e,index)}} />
                }
            },
        ]
    }
    componentWillMount(){
        this.getZoneList()
    }
    getZoneList(){
        axios_auth.post(power_zone_list,{zoneTypeKey:"loan-manage-app"}).then(e=>{
            if(!e.code){
                var data=e.data;
                axios_auth.post(power_permission_list,{zoneTypeKey:"loan-manage-app"}).then(val=>{
                    var contract_list_id=""
                    val.data.forEach(i=>{
                        if(i.applicationKey==="bmd-loanmanage-mgnt"&&i.key==="contract_list"){
                            contract_list_id=i.id
                        }
                    })
                    data.forEach(element => {
                        element.ZonePermission=[{label:"借贷管理",applicationKey:"bmd-loanmanage-mgnt",value:contract_list_id}]
                        element.checkedPermission=[];
                        element.havePerm=[];
                        element.havePermValue=[];
                    });
                    if(this.props.accountId){
                        this.getUserZone(data)
                    }else{
                        this.setState({
                            data:data,
                            indeterminate:true
                        })
                    }
                })
            }
        })
    }
    getUserZone(data){
        axios_auth.post(power_perm_detail,{accountId:this.props.accountId,zoneTypeKey:"loan-manage-app"}).then(e=>{
            var user=e.data,checkAll=true,indeterminate=[];
            data.forEach(item=>{
                item.havePerm=[];
                user.forEach(perm=>{
                    if(item.id===perm.zoneId){
                        item.ZonePermission.forEach(zone=>{
                            if(zone.value===perm.zonePermissionId){
                                item.havePerm.push({zoneId:perm.zoneId,id:perm.zonePermissionId});
                                item.havePermValue.push({zoneId:perm.zoneId,id:perm.zonePermissionId});
                                item.checkedPermission.push({zoneId:perm.zoneId,id:perm.zonePermissionId});
                            }
                        })
                    }
                })
                if(item.ZonePermission.length!==item.checkedPermission.length){
                    checkAll=false;
                    return
                }
                indeterminate.push.apply(indeterminate,item.checkedPermission)

                // if(item.checkedPermission.length>0&&item.ZonePermission.length!==item.checkedPermission.length){
                //     indeterminate=false;
                //     return
                // }
            })
            this.setState({
                data:data,
                checkAll:checkAll,
                indeterminate:indeterminate.length>0?checkAll:true
            })
        })
    }
    getCheck(checked,data,index){
        // console.log(checked,data)
        var ZonePermission=data.ZonePermission;
        data.checkedPermission=[];
        data.havePermValue=[];
        var dataTemp=this.state.data;
        checked.forEach(item=>{
            data.havePermValue.push({id:item})
            ZonePermission.forEach(i=>{
                if(i.value===item){
                    data.checkedPermission.push({id:i.value,zoneId:data.id});
                }
            })
        })
        dataTemp[index]=data;
        var tableData=this.state.data,checkAll=true,indeterminate=[];
        tableData.forEach(item=>{
            if(item.ZonePermission.length!==item.checkedPermission.length){
                checkAll=false;
                return
            }
            indeterminate.push.apply(indeterminate,item.checkedPermission)
        })
        this.setState({
            data:dataTemp,
            indeterminate:indeterminate.length>0?checkAll:true,
            checkAll:checkAll
        })
    }
    //全部选择
    setCheckAll(e){
        var value=e.target.checked;console.log(value)
        var tableData=this.state.data;
        tableData.forEach(item=>{
            if(value){
                item.ZonePermission.forEach(i=>{
                    item.havePermValue.push({id:i.value,zoneId:item.id});
                    item.checkedPermission.push({id:i.value,zoneId:item.id})
                })

            }else{
                item.havePermValue=[]
                item.checkedPermission=[]
            }
        })
        this.setState({
            checkAll:value,
            data:tableData,
            indeterminate:true
        })
    }
    render(){
        return <div>
            {!this.props.accountId?this.props.children:null}
            <Checkbox indeterminate={!this.state.indeterminate} checked={this.state.checkAll} onChange={this.setCheckAll.bind(this)} style={{margin:"5px 0"}}>全部选择/全部取消</Checkbox>
            <Table columns={this.columns} dataSource={this.state.data} pagination={false} size="small" bordered /></div>
    }
}
export default Power