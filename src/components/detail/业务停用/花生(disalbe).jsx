import React, { Component } from 'react';
import { Tooltip } from 'antd';
import Auditingview from './auditingView';
//import Gallery from '../Gallery.jsx';
import axios from '../../../ajax/request';
// import TimeLine from './timeLine';
import Gallery from './Gallery';
import {person,borrow_info,policy_info,car_info,payee_info,repayee_info,company} from './showData';
class Detail extends Component{
    constructor(props) {
        super(props);
        this.state={
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
                //    des:"?????????",
                //    src:"http://img.hb.aicdn.com/1cad414972c5db2b8c1942289e3aeef37175006a8bb16-CBtjtX_fw"
                //}
            ],
            borrowType:1
        };
        this.type=this.props.location.query.type;
        this.approve=this.props.location.query.approve;
        this.timeline=this.props.location.query.timeline;
        this.url={
            //taskId:"/api/task/get",
            //id:"/api/loan/huashenghaoche/get",
            id:"/pre_match/get"
        }
    };
    componentWillMount() {
        this.detailData();
    }
    detailData() {
        var param={},showDetail,project={},matchDetailList={},otherArr=[],personArr=[],url;
        var taskId=this.props.location.query.taskId;
        var id=this.props.location.query.id;
        if(taskId===undefined){
            param.id=id;
            url=this.url.id;
        }else{
            param.taskId=taskId;
            url=this.url.taskId;
        }
        axios.post(url,param).then((e)=>{
            var processInstanceId=e.data.processInstanceId;
            //var detail=e.data.processVariables.detail;
            var detail=(taskId===undefined?e.data.data:e.data.processVariables.detail);
            detail=JSON.parse(detail);
            showDetail=detail.showVo;console.log(showDetail)
            var matchType=showDetail.matchType;
            //??????????????????
            var personData=showDetail.borrow_info;
            project.project_name=showDetail.project_name;
            project.signTime=showDetail.signTime;
            project.business_name="??????????????????????????????????????????";
            //??????????????????
            var policy_info=showDetail.policy_info;
            //?????????????????????
            var insured_info=showDetail.insured_info;
            //??????????????????
            var car_info=showDetail.car_info;
            //????????????????????????
            var payee_info=showDetail.payee_info;
            //????????????????????????
            var repayee_info=showDetail.repayee_info;
            //??????????????????
            var error=detail.matchDetailList;
            //????????????
            var money=(policy_info.fee.commInsurance!=null?parseFloat(policy_info.fee.commInsurance):0)+(policy_info.fee.lateFee!=null?parseFloat(policy_info.fee.lateFee):0)+(policy_info.fee.trafficInsurance!=null?parseFloat(policy_info.fee.trafficInsurance):0)+(policy_info.fee.travelTax!=null?parseFloat(policy_info.fee.travelTax):0);
            var moneys={
                money:money.toFixed(2)
            };
            // ????????????
            var online_contract={online_contract:showDetail.online_contract};
            //??????????????????
            var attachment=showDetail.attachment;
            var borrowType=showDetail.borrowType;
            for(var k in attachment){
                if(attachment[k].length<0){
                    continue
                }
                for (var i = 0; i < attachment[k].length; i++) {
                    var warranty = {};
                    var person={};
                    if(k==='insurance_policy'){
                        warranty.des=" ?????????/??????";
                        warranty.src=attachment[k][i];
                        otherArr.push(warranty);
                    }else if(k==='id_card'){
                        person.des = (borrowType===0?"?????????":"???????????????");
                        person.src=attachment[k][i];
                        personArr.push(person);;
                    }else if(k==='invoice'){
                        warranty.des=" ????????????????????????";
                        warranty.src=attachment[k][i];
                        otherArr.push(warranty);
                    }else if(k==='other'){
                        warranty.des=" ????????????";
                        warranty.src=attachment[k][i];
                        otherArr.push(warranty);
                    }
                }
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
        })
    };
    render() {
        function creatTable(val,arr,obj,mat,matchType){
            //val--????????????????????????  arr--????????????  obj--??????????????????object  mat--??????????????????  matchType--?????????/???????????????????????????
            var $td,$th,$ths=[],$trs=[],$tr,too,$a;
            for(var i in arr){
                var key=arr[i].type;
                var match=arr[i].match;
                var title=arr[i].title;
                //??????????????????
                if(match){
                    if(mat.length>0){
                        var matkeys=[];  //?????????????????????
                        for(var j in mat){
                            matkeys.push(mat[j].matchKey);
                            if(mat[j].matchKey===key){
                                if(mat[j].status===-1){
                                    //????????????
                                    $td=React.createElement("td",{className:"error",key:i+j+"tds"},key===''?'':(arr[i].secondary===''?obj[key]:(obj[arr[i].secondary]===null?"":obj[arr[i].secondary][key])));
                                    too=<Tooltip title={"??????????????????"+(key===''?'':mat[j]["matchValueInOnline"])} placement="right" key={i+j} trigger="click">{$td}</Tooltip>;
                                }else{
                                    //????????????
                                    too=React.createElement("td",{key:i+j+"tds"},key===''?'':(arr[i].secondary===''?obj[key]:(obj[arr[i].secondary]===null?"":obj[arr[i].secondary][key])));
                                }

                            }
                            //?????????????????????????????????????????????
                            if(matkeys.indexOf(key)===-1){
                                too=React.createElement("td",{key:i},key===''?'':(arr[i].secondary===''?obj[key]:(obj[arr[i].secondary]===null?"":obj[arr[i].secondary][key])));
                            }
                        }
                    }else{
                        too=React.createElement("td",{key:i},key===''?'':(arr[i].secondary===''?obj[key]:(obj[arr[i].secondary]===null?"":obj[arr[i].secondary][key])));
                    }
                }else{
                    //???????????????
                    if(matchType==="CiNumber"){
                        //?????????
                        too=React.createElement("td",{key:i},title==='??????????????????'?'':(arr[i].secondary===''?obj[key]:(obj[arr[i].secondary]===null?"":obj[arr[i].secondary][key])));

                    }else if(matchType==="TiNumber"){
                        //?????????
                        too=React.createElement("td",{key:i},title==='??????????????????'?'':(arr[i].secondary===''?obj[key]:(obj[arr[i].secondary]===null?"":obj[arr[i].secondary][key])));

                    }else{
                        if(key==="online_contract"){
                            $a=React.createElement("a",{href:obj[key],target:"_blank"},obj[key]);
                            too=React.createElement("td",{key:i},$a);
                        }else if(key==="province"){
                            var province=obj[arr[i].secondary]?(obj[arr[i].secondary]["province"]?obj[arr[i].secondary]["province"]:''):'';
                            var city=obj[arr[i].secondary]?(obj[arr[i].secondary]["city"]?obj[arr[i].secondary]["city"]:''):'';
                            var district=obj[arr[i].secondary]?(obj[arr[i].secondary]["district"]?obj[arr[i].secondary]["district"]:''):'';
                            var detail=obj[arr[i].secondary]?(obj[arr[i].secondary]["detail"]?obj[arr[i].secondary]["detail"]:''):'';
                            too=React.createElement("td",{key:i,colSpan:7},province+city+district+detail);
                        }else if(key!=="city"&&key!=="district"&&key!=="detail"){
                            too=React.createElement("td",{key:i},key===''?'':(arr[i].secondary===''?obj[key]:(obj[arr[i].secondary]===null?"":obj[arr[i].secondary][key])));
                        }
                    }
                }
                if(key!=="city"&&key!=="district"&&key!=="detail"){
                    $th=React.createElement("th",{key:i+"th"},arr[i].title);
                    $ths.push($th,too);
                }
                i = parseInt(i,10);
                if(i===val-1||i===val*2-1||i===val*3-1){
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
                    this.props.location.query.taskId!==undefined?<Auditingview id={this.props.location.query.taskId} />:<div /> 
                }
                <div>
                    <div className="title">
                        <div className="icon" />
                        <span className="titleWord">{this.state.borrowType===0?"??????????????????":"??????????????????"}</span>
                    </div>
                    <div className="content">
                        <Gallery card={this.state.personImg} />
                        {
                            this.state.borrowType===0?creatTable(4,person,this.state.borrow_info.person,this.state.errorData):creatTable(4,company,this.state.borrow_info.company,this.state.errorData)
                        }
                        {
                            creatTable(4,borrow_info,this.state.borrow_info,this.state.errorData)
                        }

                    </div>
                </div>
                <div>
                    <div className="title">
                        <div className="icon" />
                        <span className="titleWord">????????????</span>
                    </div>
                    <div className="content">
                        <Gallery card={this.state.img} />
                        {
                            creatTable(6,policy_info,this.state.policy_info,this.state.errorData,this.state.matchType)
                        }
                        {
                            creatTable(5,car_info,this.state.car_info,this.state.errorData)
                        }
                    </div>

                </div>
                <div>
                    <div className="title">
                        <div className="icon" />
                        <span className="titleWord">??????????????????</span>
                    </div>
                    <div className="content">
                        {
                            creatTable(5,payee_info,this.state.payee_info,this.state.errorData)
                        }

                    </div>
                </div>
                <div>
                    <div className="title">
                        <div className="icon" />
                        <span className="titleWord">??????????????????</span>
                    </div>
                    <div className="content">
                        {
                            creatTable(5,repayee_info,this.state.repayee_info,this.state.errorData)
                        }

                    </div>
                </div>
            </div>
        )

    }
}
export default Detail;