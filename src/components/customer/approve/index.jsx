import React, { Component } from 'react';
import ListCtrl from '../../../controllers/List';
import { axios_loanMgnt } from '../../../ajax/request';
import Permissions from '../../../templates/Permissions';
import ComponentRoute from '../../../templates/ComponentRoute';
import businessConfig from '../../../config/business';
import MgntProjectCtrl from '../../../request/mgnt/project';
import { Button, Modal, Form, Input , message } from 'antd';
import { custom_changePhone_detail, custom_changePhone_approve, custom_changePhone_getStorageUrl } from '../../../ajax/api';
import ImgTag from '../../../templates/ImageTag_w';
const { TextArea } = Input;
class PrivateList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: this.getItems(),
            appKeys: [],
            detail:{},
            cardImg:[],
            holdImg:[]
        }
    }
    columns = [
        { title: "序号", dataIndex: "key" },
        { title: "申请流水号", dataIndex: "applyNo"},
        { title: "客户ID", dataIndex: "borrowerId" },
        { title: "姓名", dataIndex: "borrowerName" },
        { title: "注册手机号", render:data => data.status==="200"?data.toPhone:data.fromPhone},
        { title: "项目", dataIndex: "appKeyName" },
        { title: "申请人", dataIndex: "applicant" },
        { title: "申请时间", dataIndex: "createTime"},
        { title: "审批状态", dataIndex: "status", render: data => {const type={0:"初始化",200:"待审批",800:"审批通过",900:"审批未通过"}
    return type[data]} },
        { title: "审批人", dataIndex: "auditor"},
        { title: "审批时间", dataIndex: "updateTime"},
        {
            title: "操作", render: data => {
                return data.status===200?<Permissions size="small" server={global.AUTHSERVER.mgnt.key} tag="button" permissions={global.AUTHSERVER.mgnt.access.borrower_phone_change_audit} type="primary" onClick={()=>{this.detail(data,true)}}>审批</Permissions>:<Permissions size="small" onClick={()=>{this.detail(data,false)}} server={global.AUTHSERVER.mgnt.key} tag="button" permissions={global.AUTHSERVER.mgnt.access.borrower_phone_change_detail}>查看</Permissions>
            }
        },
    ]
    items = [
        // { name: "创建时间", key: "createTime", feild_s: "startDate", feild_e: "endDate", type: "range_date", withTime: true },
        { name: "姓名", key: "borrowerName" },
        { name: "注册手机号", key: "borrowerPhone" },
        // { name: "身份证号", key: "idNo" },
        { name: "业务", key: "domain", type: "select", values: [{ name: "自有资金业务", val: "bmd-loancoop-capital" },
        { name: "白猫贷业务", val: "bmd-cashloan" },
        ], default: null, onChange: val => this.getAppkeysByDomain(val) },
        { name: "项目", key: "appKey", type: "select", default: null },
        { name: "状态", key: "status" ,type: "select", values:[{val:200,name:"待审批"},{val:800,name:"审批通过"},{val:900,name:"审批未通过"}]}
    ]
    getItems() {
        return [
            { name: "姓名", key: "borrowerName" },
            { name: "注册手机号", key: "borrowerPhone" },
            { name: "业务", key: "domain", type: "select", values: businessConfig.getCategory(), default: null, onChange: val => this.getAppkeysByDomain(val) },
            { name: "项目", key: "appKey", type: "select", default: null },
            { name: "渠道", key: "status" ,type: "select", values:[{val:200,name:"待审批"},{val:800,name:"审批通过"},{val:900,name:"审批未通过"}]}
        ]
    }
    getAppkeysByDomain(domain) {
        this.setFilter({ appKey: undefined });
        var domainName={"bmd-cashloan":"白猫贷业务","bmd-loancoop-capital":"自有资金业务"}
        MgntProjectCtrl.getByLabelName(domainName[domain]).then(data => {
            this.setState({ appKeys: MgntProjectCtrl.getSelect(data.data) });
        })
    }
    listRequestor(listParam) {
        return new Promise((resolve, reject) => {
            axios_loanMgnt.post("/manage/borrower/phoneChange/list", { ...listParam }).then(data => {
                data.data.list.forEach(record => {
                    record.appKeyName = MgntProjectCtrl.nameMap(record.appKey);
                })
                resolve(data);
            }).catch(e => reject(e));
        });
    }
    resetField() {
        this.setState({ appkeys: [] })
    }
    detail(data,approve){
        console.log(this.state.cardImg)
        this.setState({
            visible:true,
            approve:approve,
            applyNo:data.applyNo
        })
        axios_loanMgnt.post(custom_changePhone_detail,{phoneChangeApplyId:data.id}).then(e=>{
            if(!e.code){
                this.setState({
                    detail:e.data
                })
                Promise.all([axios_loanMgnt.post(custom_changePhone_getStorageUrl,{storageId:e.data.resInfo.backIdCardImgStorageId}),axios_loanMgnt.post(custom_changePhone_getStorageUrl,{storageId:e.data.resInfo.frontIdCardImgStorageId})]).then((imgs)=>{
                    var img=[];
                    imgs.map((item,k)=>{
                        return img.push({src:item.data,desc:"",key:"card"+k})
                    })
                    this.setState({
                        cardImg:img
                    })
                })
                axios_loanMgnt.post(custom_changePhone_getStorageUrl,{storageId:e.data.resInfo.holdIdCardImgStorageId}).then(e=>{
                    this.setState({
                        holdImg:[{src:e.data,desc:""}]
                    })
                })
            }
        })
    }
    cancel(){
        this.setState({
            visible:false,
            opinion:"",
            cardImg:[],
            holdImg:[]
        })
    }
    audit(audit){
        var param={
            applyNo:this.state.applyNo,
            approve:audit,
            opinion:this.state.opinion||""
        }
        axios_loanMgnt.post(custom_changePhone_approve,param).then(e=>{
            if(!e.code){
                message.success("审批成功");
                this.cancel();
                this.refresh();
            }
        })
    }
    getOpinion(val){
        this.setState({
            opinion:val.target.value||""
        })
    }
    openUrl(url){
        window.open(url)
    }
    render() {
        const listProps = {
            items: this.items,
            columns: this.columns,
            filterOptions: { appKey: this.state.appKeys },
            bindreset: this.resetField.bind(this),
            bindsetFilter: set => this.setFilter = set,
            listRequestor: this.listRequestor.bind(this),
            bindrefresh: set => this.refresh = set,
        }
        const modal={
            title:this.state.approve?"审批":"查看",
            visible:this.state.visible,
            onCancel:this.cancel.bind(this),
            footer:this.state.approve?<div>
                <Button type="primary" size="small" onClick={()=>{this.audit(true)}}>通过</Button>
                <Button type="danger" size="small" onClick={()=>{this.audit(false)}}>拒绝</Button>
            </div>:null,
            width:600
        }
        return <div>
            <ListCtrl {...listProps} />
            <Modal {...modal} >
                <div className="modal">
                <div>
                    <span>原手机号：</span>
                    <span>{this.state.detail.fromPhone}</span>
                </div>
                <div>
                    <span>新手机号：</span>
                    <span>{this.state.detail.toPhone}</span>
                </div>
                <div className="over">
                    <div className="left">身份证影像：</div>
                    <div className="left"><ImgTag imgs={this.state.cardImg} /></div>
                </div>
                <div className="over">
                    <div className="left">手持身份证：</div>
                    <div className="left"><ImgTag imgs={this.state.holdImg} /></div>
                </div>
                <div>
                    <span>备注：</span>
                    <span>{this.state.detail.remark||"暂无备注"}</span>
                </div>
                {this.state.approve?<div className="over">
                    <div className="left">审批意见：</div>
                    <TextArea value={this.state.opinion} onChange={this.getOpinion.bind(this)} className="left" style={{width:"80%"}} />
                </div>:<div>
                <div>
                    <span>申请人：</span>
                    <span>{this.state.detail.applicant}</span>
                </div>
                <div>
                    <span>审批人：</span>
                    <span>{this.state.detail.auditor}</span>
                </div>
                <div>
                    <span>审批时间：</span>
                    <span>{this.state.detail.updateTime}</span>
                </div>
                <div>
                    <span>审批结果：</span>
                    <span>{this.state.detail.status===800?"通过":"拒绝"}</span>
                </div>
                <div>
                    <span>审批意见：</span>
                    <span>{this.state.detail.opinion||"--"}</span>
                </div>
                    </div>}
                    </div>
            </Modal>
            <style>{`
                .modal{
                    font-size:14px
                }
                .modal div{
                    margin-bottom:8px
                }
                .left{
                    float:left
                }
                .over{
                    overflow:hidden
                }
            `}</style>
        </div>
    }
}

export default ComponentRoute(PrivateList);