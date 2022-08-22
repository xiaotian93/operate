import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
import logo from '../style/imgs/logo.png';
import logotest from '../style/imgs/logotest.png';
import PermissionPool from '../templates/PermissionsPool';
const { Header } = Layout;
class HeaderCustom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            select: [document.location.pathname.split("/")[1]],
            operate_admin:false
        }
    }
    componentWillMount(){
        let permissions = JSON.parse(localStorage.getItem("permissions"))||[];
        if(permissions.length>0){
            for(var i in permissions){
                if(permissions[i].applicationKey==="bmd-auth-server"){
                    var permissionsList=permissions[i].permissionList;
                    for(var j in permissionsList){
                        if(permissionsList[j].key==="operate_admin"&&permissionsList[j].hasPermission){
                            this.setState({
                                operate_admin:true
                            })
                        }
                    }
                }
            }
        }
    }
    render() {
        let browser_host = window.location.hostname;
        var url=browser_host.indexOf('baimaodai.com')>=0;
        let select = document.location.pathname.split("/")[1];
        return (
            <Header style={{position:"fixed",width:"100%",zIndex:"99"}}>
                <div className="top-nav">
                    <div className="logo">
                        <img src={url?logo:logotest} style={{height:!url?"25px":"auto",width:!url?"auto":"126px"}} alt="首页" />
                    </div>
                    <Menu selectedKeys={[select]}>
                        <Menu.Item key={"db"} activeClassName="active">
                            <PermissionPool powers={[{server:global.AUTHSERVER.bmdCashLoan.key,to:"check/bmd"},{server:global.AUTHSERVER.bfq.key,role:global.AUTHSERVER.bfq.role.read,to:"check/zzb"},{server:global.AUTHSERVER.ygd.key,to:"check/ygd"},{server:global.AUTHSERVER.gyl.key,to:"check/gyl"}]} to={'/db/'}>
                                <span className="nav-text">待办管理</span>
                                <span className="line" />
                            </PermissionPool>
                        </Menu.Item>
                        <Menu.Item key={"zf"} activeClassName="active">
                            <PermissionPool powers={[{server:global.AUTHSERVER.bmdCashLoan.key,to:"pay/bmd"},{server:global.AUTHSERVER.bfq.key,to:"pay/zzb"},{server:global.AUTHSERVER.ygd.key,to:"pay/ygd"},{server:global.AUTHSERVER.bmd.key,to:"pay/confirm"},{server:global.AUTHSERVER.gyl.key,to:"pay/gyl"}]} to={'/zf/'}>
                                <span className="nav-text">支付管理</span>
                                <span className="line" />
                            </PermissionPool>
                        </Menu.Item>
                        <Menu.Item key={'jk'} activeClassName="active">
                            <PermissionPool powers={[{server:global.AUTHSERVER.bmdCashLoan.key,to:"list/bmd"},{server:global.AUTHSERVER.bfq.key,to:"list/zzb"},{server:global.AUTHSERVER.ygd.key,to:"list/ygd"},{server:global.AUTHSERVER.bmdOffline.key,to:"list/xjdOffline"},{server:global.AUTHSERVER.bmdOnline.key,to:"list/xjdOnline"},{server:global.AUTHSERVER.gyl.key,to:"list/gyl"}]} to={'/jk/'}>
                                <span className="nav-text">借款管理</span>
                                <span className="line" />
                            </PermissionPool>
                        </Menu.Item>
                        <Menu.Item key={"hk"} activeClassName="active">
                            <PermissionPool powers={[{server:global.AUTHSERVER.mgnt.key,to:"plan/zyzj"},{server:global.AUTHSERVER.loanmanage.key,to:"plan/cashcoop_daiyunying"}]} to={'/hk/'}>
                                <span className="nav-text">还款管理</span>
                                <span className="line" />
                            </PermissionPool>
                        </Menu.Item>
                        <Menu.Item key={"zj"} activeClassName="active">
                            <PermissionPool powers={[{server:global.AUTHSERVER.account.key,to:"account"},{server:global.AUTHSERVER.account.key,access:global.AUTHSERVER.account.access.read,to:"total"},{server:global.AUTHSERVER.account.key,access:global.AUTHSERVER.account.access.divide,to:"business"}]} to={'/zj/'}>
                                <span className="nav-text">资金管理</span>
                                <span className="line" />
                            </PermissionPool>
                        </Menu.Item>
                        <Menu.Item key={"cp"} activeClassName="active">
                            <PermissionPool powers={[{server:global.AUTHSERVER.loan.key,to:"total/list"},{server:global.AUTHSERVER.ygd.key,to:"ygd/list"}]} to={'/cp/'}>
                                <span className="nav-text">产品管理</span>
                                <span className="line" />
                            </PermissionPool>
                        </Menu.Item>
                        <Menu.Item key={"kh"} activeClassName="active">
                            <PermissionPool powers={[{server:global.AUTHSERVER.mgnt.key,to:"private/list"},{server:global.AUTHSERVER.gyl.key,to:"gyl/list"},{server:global.AUTHSERVER.ygd.key,to:"jyd/list"}]} to={'/kh/'}>
                                <span className="nav-text">客户管理</span>
                                <span className="line" />
                            </PermissionPool>
                        </Menu.Item>
                        <Menu.Item key={"sh"} activeClassName="active">
                            <PermissionPool powers={[{server:global.AUTHSERVER.merchant.key,to:"audit"}]} to={'/sh/'}>
                                <span className="nav-text">商户管理</span>
                                <span className="line" />
                            </PermissionPool>
                        </Menu.Item>
                        {/* <Menu.Item key={"bb"} activeClassName="active">
                            <PermissionPool powers={[{server:global.AUTHSERVER.statement.key,to:"structure"}]} to={'/bb/'}>
                                <span className="nav-text">报表管理</span>
                                <span className="line" />
                            </PermissionPool>
                        </Menu.Item> */}
                        {/* <Menu.Item key={"bd"} activeClassName="active">
                            <PermissionPool powers={[{server:global.AUTHSERVER.insurance.key,to:"indent/hs"}]} to={'/bd/'}>
                                <span className="nav-text">保单管理</span>
                                <span className="line" />
                            </PermissionPool>
                        </Menu.Item> */}
                        {/* 迁移至有数系统 */}
                        {/* <Menu.Item key={"tj"} activeClassName="active">
                            <PermissionPool powers={[{server:global.AUTHSERVER.biUdata.key,to:"loan"},{server:global.AUTHSERVER.statement.key,to:"bb/condition"}]} to={'/tj/'}>
                                <span className="nav-text">数据统计</span>
                                <span className="line" />
                            </PermissionPool>
                        </Menu.Item> */}
                        <Menu.Item key={"dh"} activeClassName="active">
                            <PermissionPool powers={[{server:global.AUTHSERVER.postloan.key,to:"overdue"}]} to={'/dh/'}>
                                <span className="nav-text">贷后管理</span>
                                <span className="line" />
                            </PermissionPool>
                        </Menu.Item>
                        <Menu.Item key={"vip"} activeClassName="active">
                            <PermissionPool powers={[{server:global.AUTHSERVER.bmdCashLoan.key,to:"bmd/order"}]} to={'/vip/'}>
                                <span className="nav-text">会员管理</span>
                                <span className="line" />
                            </PermissionPool>
                        </Menu.Item>
                        <Menu.Item key={"operation"} activeClassName="active">
                            <PermissionPool powers={[{server:global.AUTHSERVER.bmdCashLoan.key,to:"rd/ds"},{server:global.AUTHSERVER.capital.key,to:"rd/xmcb"}]} to={'/operation/'}>
                                <span className="nav-text">运营管理</span>
                                <span className="line" />
                            </PermissionPool>
                        </Menu.Item>
                        {this.state.operate_admin?<Menu.Item key={"power"} activeClassName="active">
                            <PermissionPool powers={[{server:global.AUTHSERVER.login.key,access:global.AUTHSERVER.login.access.operate_admin,to:"user/list"}]} to={'/power/'}>
                                <span className="nav-text">权限管理</span>
                                <span className="line" />
                            </PermissionPool>
                        </Menu.Item>:null}
                    </Menu>
                </div>
            </Header>
        )
    }
}


export default HeaderCustom;
