import React, { Component } from 'react';
import { axios_loanMgnt } from '../../../../ajax/request';
import { repay_borrower_detail ,repay_borrower_info,repay_get_url} from '../../../../ajax/api';
import Panel from '../../../../templates/Panel';
import LineTable from '../../../../templates/TableLine';
import FileShow from '../../../detail/components/fileShow';
import ImgTag from '../../../../templates/ImageTag_w';
import {Table} from "antd";
import Nophoto from '../../../../style/imgs/noPhoto.png';
class Order extends Component {
    constructor(props) { 
        super(props);
        this.state={
            orderData:{
                borrowerContactsList:[],
                bindCardList:[],
            },
            person:[],
            argeement:[],
            maritalStatuses:[],
            qualifications:[]
        }
        this.files=[]
    }
    componentWillMount() {
        this.borrower=[
            {
                title:"借款方",
                dataIndex:"name",
            },
            {
                title:"性别",
                dataIndex:"gender",
                // render:e=>e||"--"
            },
            {
                title:"年龄",
                dataIndex:"age"
            },
            {
                title:"民族",
                dataIndex:"idCardInfo.ethnicity"
            },
            {
                title:"身份证号",
                dataIndex:"idCardInfo.idNo"
            },
            {
                title:"有效期截止日",
                dataIndex:"idCardInfo.validityEndDate"
            },
            {
                title:"通讯地址",
                render:e=>{
                    return e.borrowerContactInfo?(e.borrowerContactInfo.province||"")+(e.borrowerContactInfo.city||"")+(e.borrowerContactInfo.district||"")+(e.borrowerContactInfo.detail||""):"--"
                }
            },
            {
                title:"注册手机号",
                dataIndex:"phone"
            },
        ]
        this.card=[
            {
                title:"账户名称",
                dataIndex:"accountName",
            },
            {
                title:"银行简称",
                dataIndex:"bankName",
                render:e=>e||"--"
            },{
                title:"银行卡号",
                dataIndex:"bankCardNumber"
            },{
                title:"银行卡预留手机号",
                dataIndex:"phone"
            },{
                title:"绑卡完成时间",
                dataIndex:"createTime"
            }
        ]
        this.person=[
            {
                title:"婚否",
                dataIndex:"borrowerMaritalInfo.maritalStatus",
                render:e=>{
                    var val="",type=this.state.maritalStatuses;
                    if(type&&e.borrowerMaritalInfo){
                        type.forEach(item=>{
                            if(item.name===e.borrowerMaritalInfo.maritalStatus){
                                val=item.val
                            }
                        })
                    }
                    return val
                }
            },
            {
                title:"教育程度",
                dataIndex:"borrowerEduInfo.qualification",
                render:e=>{
                    var val="",type=this.state.qualifications;
                    if(type&&e.borrowerEduInfo){
                        type.forEach(item=>{
                            if(item.name===e.borrowerEduInfo.qualification){
                                val=item.val
                            }
                        })
                    }
                    return val
                }
            },{
                title:"年薪",
                dataIndex:"borrowerJobInfo.annualSalary"
            },{
                title:"毕业学校",
                dataIndex:"borrowerEduInfo.school"
            },{
                title:"院系专业",
                dataIndex:"borrowerEduInfo.major"
            },{
                title:"从事行业",
                dataIndex:"borrowerJobInfo.industry",
                render:e=>{
                    var val="",type=this.state.industries;
                    if(type&&e.borrowerJobInfo){
                        type.forEach(item=>{
                            if(item.name===e.borrowerJobInfo.industry){
                                val=item.val
                            }
                        })
                    }
                    return val
                }
            },{
                title:"所在单位类别",
                dataIndex:"borrowerJobInfo.companyType",
                render:e=>{
                    var val="",type=this.state.companyType;
                    if(type&&e.borrowerJobInfo){
                        type.forEach(item=>{
                            if(item.name===e.borrowerJobInfo.companyType){
                                val=item.val
                            }
                        })
                    }
                    return val
                }
            },{
                title:"单位名称",
                dataIndex:"borrowerJobInfo.companyName"
            },{
                title:"现居地址/联系地址",
                dataIndex:"borrowerResidentInfo",
                render:e=>{
                    var detail=e.borrowerContactInfo;
                    return detail?((detail.province||"")+(detail.city||"")+(detail.district||"")+(detail.detail||"")):"--"
                }
            },{
                title:"邮箱",
                dataIndex:"borrowerContactInfo.email"
            },{
                title:"住房类型",
                dataIndex:"borrowerResidentInfo.residentStatus",
                render:e=>{
                    var val="",type=this.state.residentStatuses;
                    if(type&&e.borrowerResidentInfo){
                        type.forEach(item=>{
                            if(item.name===e.borrowerResidentInfo.residentStatus){
                                val=item.val
                            }
                        })
                    }
                    return val
                }
            },
        ]
        this.contact=[
            {
                title:"姓名",
                dataIndex:"name"
            },
            {
                title:"手机号",
                dataIndex:"phone"
            },
            {
                title:"与本人关系",
                dataIndex:"relation",
                render:e=>{
                    var type={SELF:"本人",SPOUSE:"配偶",SON:"子",DAUGHTER:"女",PARENT:"父母",BROTHER_OR_SISTER:"兄弟姐妹",FRIEND:"朋友",COLLEAGUE:"同事",OTHER:"其他"}
                    return type[e]||"--"
                }
            }
        ]
        this.getInfo();
    }
    getInfo() {
        axios_loanMgnt.post(repay_borrower_detail, { contractNo: this.props.contract_no }).then(e=>{
            if(!e.code){
                var person=[
                    {des:"身份证正面",storageId:e.data.idCardInfo.frontImgStorageId||""},
                    {des:"身份证反面",storageId:e.data.idCardInfo.backImgStorageId||""},
                    {des:"手持证件照",storageId:e.data.livecheckInfo.bestImgStorageId||""}
                ]
                this.getImageUrls(person)
                
                this.setState({
                    orderData:e.data,
                })
                if(e.data.borrowerFiles){

                if(e.data.borrowerFiles.creditAuthAgreementStorageId){
                    this.getUrl("征信授权",e.data.borrowerFiles.creditAuthAgreementStorageId,"argeement")
                }
                if(e.data.borrowerFiles.repayAgreementStorageId){
                    this.getUrl("委托代扣",e.data.borrowerFiles.repayAgreementStorageId,"argeement")
                }
                if(e.data.borrowerFiles.infoAuthAgreementStorageId){
                    this.getUrl("个人信息授权",e.data.borrowerFiles.infoAuthAgreementStorageId,"argeement")
                }
            }

            }
        })
        axios_loanMgnt.post(repay_borrower_info).then(e=>{
            if(!e.code){
                this.setState({
                    ...e.data
                })
            }
        })
    }
    getImageUrls(imgs) {
        Promise.all(imgs.map((img,index) => new Promise((resolve, reject) => {
            if (!img.storageId) return resolve({ des: img.des, src: Nophoto ,key:index});
            axios_loanMgnt.post(repay_get_url, { storageId: img.storageId }).then(data => {
                resolve({ des: img.des, src: data.data });
            })
        }))).then(imgs => this.setState({ person:imgs }));
    }
    getUrl(title,id,status,isFile,index){
        var files=this.state[status];
        axios_loanMgnt.post(repay_get_url,{storageId:id}).then(e=>{
            files.push({
                title:title,
                file:[
                    { name:title,src:e.data}
                ]
            })
            this.setState({
                [status]:files
            })
        })
    }
    render() {
        const table={
            bordered:true,
            pagination:false
        }
        console.log(this.state.person)
        return <div className="bmd_detail">
            <Panel title="实名信息">
                <ImgTag imgs={this.state.person} />
                <LineTable columns={this.borrower} dataSource={this.state.orderData} />
            </Panel>
            <Panel title="绑卡信息">
                <Table columns={this.card} dataSource={this.state.orderData.bindCardList} {...table} />
            </Panel>
            <Panel title="个人信息">
                <LineTable columns={this.person} dataSource={this.state.orderData} />
            </Panel>
            
            <Panel title="紧急联系人信息">
                <Table columns={this.contact} dataSource={this.state.orderData.borrowerContactsList} {...table} />
            </Panel>
            <Panel title="协议相关">
                <FileShow source={this.state.argeement} />
            </Panel>
            
        </div>
    }
}
export default Order