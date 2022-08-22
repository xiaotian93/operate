import React, { Component } from 'react';
import moment from 'moment';
import { Tooltip } from 'antd';
import Auditingview from './auditingView_zzb';
//import Gallery from '../Gallery.jsx';
import axios from '../../ajax/request';
import { zzb_detail } from '../../ajax/api';
import TimeLine from './timeLine_zzb';

import {person,borrow_info,policy_info,car_info,payee_info,repayee_info,company} from './showData_zzb';
import ImgTag from '../../templates/ImageTag_w';
//api url
//var url='/api/huashenghaoche/task/get';
//var url="/api/loan/huashenghaoche/get";
class Detail extends Component{
    constructor(props) {
        super(props);
        let id , taskId , orderNo , schedule = false;
        if(props.location){
            this.type = this.props.location.query.type;
            this.approve = this.props.location.query.approve;
            this.timeline = this.props.location.query.timeline;
            taskId = props.location.query.taskId;
            id = props.location.query.id;
            schedule = true;
        }else{
            // orderNo = 'BFQ_ZZB_00_201805071146045000373';
            orderNo = props.orderNo;
        }
        this.state={
            id:id,
            orderNo:orderNo,
            taskId:taskId,
            schedule:schedule,
            borrow_info:{
                company:{
                    name:"",
                    contact:"",
                    business_license:"",
                    license_deadline:"",
                    address:{
                        province:"",
                        city:"",
                        district:"",
                        detail:""
                    },
                    legal_person:{
                        name:"",
                        phone:"",
                        id:""
                    }
                },
                person:{
                    name:"",
                    phone:"",
                    id:"",
                    gender:"",
                    address:{
                        province:"",
                        city:"",
                        district:"",
                        detail:""
                    }
                },
                amount:"",
                interest_rate:"",
                real_amount:"",
                loan_period:"",
                start_date:"",
                end_date:"",
                repayment_date:"",
                agreement:"",
                project_name:"",
                signTime:""
            },
            policy_info:{
                fee:{
                    commInsurance:"",
                    trafficInsurance:"",
                    travelTax:"",
                    lateFee:""
                }

            },
            errorData:[],
            car_info:'',
            payee_info:{
                account_name:"",
                bank_card_number:"",
                bank_full_name:"",
                bank_name:"",
                id_number:"",
                money:"",
                address:{
                    province:"",
                    city:"",
                    district:"",
                    detail:""
                }
            },
            repayee_info:'',
            processInstanceId:"",
            matchType:"",
            img:[],
            personImg:[
                //{
                //    des:"身份证",
                //    src:"http://img.hb.aicdn.com/1cad414972c5db2b8c1942289e3aeef37175006a8bb16-CBtjtX_fw"
                //}
            ],
            borrowType:1
        };
        
        this.url={
            taskId:"/api/task/get",
            id:"/api/loan/zhizunbao/get"
            //id:"/pre_match/get",
        }
    };
    componentWillMount() {
        if(this.props.location){
            this.detailData();
        }else{
            this.get_detail_orderNo();
        }
        this.person={
            name:{
                name:"借款方",
                width_key:"10%"
            },
            phone:{
                name:"手机号",
                width_key:"10%"
            },
            id:{
                name:"身份证号",
                width_key:"10%"
            },
            gender:{
                name:"性别",
                width_key:"10%"
            },
            borrower:{
                name:"借款方",
                width_key:"10%"
            },
        }
    }
    detailData() {
        var param={},url;
        var taskId=this.state.taskId;
        var id=this.state.id;
        if(taskId===undefined){
            param.id=id;
            url=this.url.id;
        }else{
            param.taskId=taskId;
            url=this.url.taskId;
        }
        axios.post(url,param).then((e)=>{
            this.resolve_data(e);
        })
    };
    get_detail_orderNo(){
        console.log(zzb_detail)
        axios.post(zzb_detail,{order_id:this.state.orderNo}).then((e)=>{
            this.resolve_data(e);
        })
    }
    resolve_data(e){
        var showDetail,project={},matchDetailList={},otherArr=[],personArr=[],othersarr=[];
        let taskId = this.state.taskId;
        var processInstanceId=e.data.processInstanceId;
        //var detail=e.data.processVariables.detail;
        var detail=(taskId===undefined?e.data.data:e.data.processVariables.detail);
        detail=JSON.parse(detail);
        showDetail=detail.showVo;
        var matchType=showDetail.matchType;
        //获取借款信息
        var personData=showDetail.borrow_info;
        project.project_name=showDetail.project_name;
        project.signTime=showDetail.signTime;
        project.business_name=showDetail.business_name;
        //获取保单信息
        var policy_info=showDetail.policy_info;
        //获取被保人信息
        var insured_info=showDetail.insured_info;
        //获取车辆信息
        var car_info=showDetail.car_info;
        //获取收款账户信息
        var payee_info=showDetail.payee_info;
        //获取还款账户信息
        var repayee_info=showDetail.repayee_info;
        //匹配失败数据
        var error=detail.matchDetailList;
        //借款金额
        var money=showDetail.borrow_info.real_amount;
        var moneys={
            money:money
        };
        // 借款协议
        var online_contract={online_contract:showDetail.online_contract};
        //获取图片信息
        var attachment=showDetail.attachment;
        var borrowType=showDetail.borrowType;
        for(var k in attachment){
            if(attachment[k].length<0){
                continue
            }
            if(k==="other"&&attachment[k].length>0){
                for (var j = 0; j < attachment[k].length; j++){
                    var others={};
                    others.des="其他资料";
                    others.src=attachment[k][j];
                    others.key=j;
                    othersarr.push(others);
                }
            }
            for (var i = 0; i < attachment[k].length; i++) {
                var warranty = {};
                var person={};
                if(k==='id_card'){
                    person.des = (borrowType===0?"身份证":"法人身份证");
                    person.src=attachment[k][i];
                    person.key=i;
                    personArr.push(person);
                }else if(k==='invoice'){
                    warranty.des=" 新车发票／行驶证";
                    warranty.src=attachment[k][i];
                    warranty.key=i;
                    otherArr.push(warranty);
                }else if(k==='insurance_policy'){
                    warranty.des=" 投保单/保单";
                    warranty.src=attachment[k][i];
                    warranty.key=i;
                    otherArr.push(warranty);
                }
            }
        }
        if(othersarr.length>0){
            otherArr.push(othersarr[0]);
        }
        
        this.setState({
            borrow_info:Object.assign(personData,project,online_contract),
            policy_info:Object.assign(policy_info,insured_info),
            errorData:error,
            car_info:car_info,
            payee_info:Object.assign(payee_info,moneys),
            repayee_info:repayee_info,
            processInstanceId:processInstanceId,
            matchType:matchType,
            img:otherArr,
            personImg:personArr,
            borrowType:borrowType
        });
        console.log(detail,matchDetailList)
    }
    render() {
        function creatTable(val,arr,obj,mat,matchType){
            //val--一行所需表头数量  arr--表头数组  obj--表格所需数据object  mat--所需校验数组  matchType--商业险/交强险唯一显示标示
            var $td,$th,$ths=[],$trs=[],$tr,too,$a;
            for(var i in arr){
                var key=arr[i].type;
                var match=arr[i].match;
                var title=arr[i].title;
                //是否需要匹配
                if(match){
                    if(mat.length>0){
                        var matkeys=[];  //所有匹配值集合
                        for(var j in mat){
                            matkeys.push(mat[j].matchKey);
                            if(mat[j].matchKey===key){
                                if(mat[j].status===-1){
                                    //匹配失败
                                    $td=React.createElement("td",{className:"error",key:i+j+"tds"},key===''?'':(arr[i].secondary===''?obj[key]:(obj[arr[i].secondary]===null?"":obj[arr[i].secondary][key])));
                                    too=<Tooltip title={"线上数据为："+(key===''?'':mat[j]["matchValueInOnline"])} placement="right" key={i+j} trigger="click">{$td}</Tooltip>;
                                }else{
                                    //匹配成功
                                    too=React.createElement("td",{key:i+j+"tds"},key===''?'':(arr[i].secondary===''?obj[key]||"--":(obj[arr[i].secondary]===null?"":obj[arr[i].secondary][key]||"--")));
                                }

                            }
                            //需要匹配的值未出现在匹配数组中
                            if(matkeys.indexOf(key)===-1){
                                too=React.createElement("td",{key:i},key===''?'':(arr[i].secondary===''?obj[key]||"--":(obj[arr[i].secondary]===null?"":obj[arr[i].secondary][key]||"--")));
                            }
                        }
                    }else{
                        too=React.createElement("td",{key:i},key===''?'':(arr[i].secondary===''?obj[key]||"--":(obj[arr[i].secondary]===null?"":obj[arr[i].secondary][key]||"--")));
                    }
                }else{
                    //不需要匹配
                    if(matchType==="CiNumber"){
                        //商业险
                        too=React.createElement("td",{key:i},title==='交强险保单号'?'--':(arr[i].secondary===''?obj[key]||"--":(obj[arr[i].secondary]===null?"":obj[arr[i].secondary][key]||"--")));

                    }else if(matchType==="TiNumber"){
                        //交强险
                        too=React.createElement("td",{key:i},title==='商业险保单号'?'--':(arr[i].secondary===''?obj[key]||"--":(obj[arr[i].secondary]===null?"":obj[arr[i].secondary][key]||"--")));

                    }else{
                        if(key==="online_contract"){
                            $a=React.createElement("a",{href:obj[key],target:"_blank"},obj[key]);
                            too=React.createElement("td",{key:i,colSpan:arr[i]["colSpan"]?arr[i]["colSpan"]:0},$a);
                        }else if(key==="comm_insurance_id"){
                            too=React.createElement("td",{key:i},obj[key]||obj.id);
                        }else if(key==="repayment_date"){
                            let start = moment(new Date(obj.start_date));
                            let end = moment(new Date(obj.start_date)).add(1,"months").date(obj.repayment_date||1);
                            let diff = end.diff(start,'days');
                            if(diff&&diff>=40){
                                too=React.createElement("td",{key:i,className:"bg-warn"},obj[key]);
                            }else{
                                too=React.createElement("td",{key:i},obj[key]);
                            }
                        }else if(key==="province"){
                            var province=obj[arr[i].secondary]?(obj[arr[i].secondary]["province"]?obj[arr[i].secondary]["province"]:''):'';
                            var city=obj[arr[i].secondary]?(obj[arr[i].secondary]["city"]?obj[arr[i].secondary]["city"]:''):'';
                            var district=obj[arr[i].secondary]?(obj[arr[i].secondary]["district"]?obj[arr[i].secondary]["district"]:''):'';
                            var detail=obj[arr[i].secondary]?(obj[arr[i].secondary]["detail"]?obj[arr[i].secondary]["detail"]:''):'';
                            too=React.createElement("td",{key:i,colSpan:7},province+city+district+detail);
                        }else if(key!=="city"&&key!=="district"&&key!=="detail"&&key!==""){
                            too=React.createElement("td",{key:i,colSpan:arr[i]["colSpan"]?arr[i]["colSpan"]:0},key===''?'':(arr[i].secondary===''?obj[key]||"--":(obj[arr[i].secondary]===null?"-":obj[arr[i].secondary][key]||"--")));
                        }
                    }
                }
                if(key!=="city"&&key!=="district"&&key!=="detail"&&key!==""){
                    $th=React.createElement("th",{key:i+"th"},arr[i].title);
                    $ths.push($th,too);
                }
                i = parseInt(i,10);
                if(i===val-1||i===val*2-1||i===val*3-1||i===val*4-1){
                    $tr=React.createElement("tr",{key:i+"tr"},$ths);
                    $ths=[];
                    $trs.push($tr);
                }
                var $tbody=React.createElement("tbody",null,$trs);
                var $table=React.createElement("table",{className:"mytable"},$tbody);
            }
            return $table;
        }
        return(
            <div>
                {
                    this.state.schedule||this.state.taskId?<div className="detail_card">
                        <div className="title">
                            <div className="icon" />
                            <span className="titleWord">审核意见</span>
                        </div>
                        { this.state.schedule?<TimeLine pild={this.state.id} />:"" }
                        {
                            this.state.taskId!==undefined?<Auditingview id={this.state.taskId} />:<div />
                        }
                </div>:null
                }
                
                
                <div className="detail_card">
                    <div className="title">
                        <div className="icon" />
                        <span className="titleWord">{this.state.borrowType===0?"个人借款信息":"企业借款信息"}</span>
                    </div>
                    <div className="content">
                        <div style={{width:"50%"}}>
                            <ImgTag imgs={this.state.personImg} />
                        </div>
                        
                        {
                            this.state.borrowType===0?creatTable(4,person,this.state.borrow_info.person,this.state.errorData):creatTable(4,company,this.state.borrow_info.company,this.state.errorData)
                        }
                        {
                            creatTable(4,borrow_info,this.state.borrow_info,this.state.errorData)
                        }
                    </div>
                </div>
                <div className="detail_card">
                    <div className="title">
                        <div className="icon" />
                        <span className="titleWord">保单信息</span>
                    </div>
                    <div className="content">
                    <div style={{width:"100%"}}>
                        <ImgTag imgs={this.state.img} />
                    </div>
                        
                        {
                            creatTable(4,policy_info,this.state.policy_info,this.state.errorData,this.state.matchType)
                        }
                        {
                            creatTable(4,car_info,this.state.car_info,this.state.errorData)
                        }
                    </div>

                </div>
                <div className="detail_card">
                    <div className="title">
                        <div className="icon" />
                        <span className="titleWord">收款账户信息</span>
                    </div>
                    <div className="content">
                        {
                            creatTable(4,payee_info,this.state.payee_info,this.state.errorData)
                        }

                    </div>
                </div>
                <div className="detail_card">
                    <div className="title">
                        <div className="icon" />
                        <span className="titleWord">还款账户信息</span>
                    </div>
                    <div className="content">
                        {
                            creatTable(4,repayee_info,this.state.repayee_info,this.state.errorData)
                        }

                    </div>
                </div>
                
            </div>
        )
    }
}
export default Detail;



