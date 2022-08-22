import React, { Component } from 'react';
import { Router, Route, browserHistory, IndexRedirect } from 'react-router';
import App from '../App';

// 白猫贷评额
import gtask_match_bmd_auto from '../components/gtasks/match/bmd_auto';
import gtask_match_bmd_audit from '../components/gtasks/match/bmd_audit';

// 待初审
import gtask_check_ygd from '../components/gtasks/check/ygd';
import gtask_check_jyd from '../components/gtasks/check/jyd';
import gtask_check_gyl from '../components/gtasks/check/gyl';
import gtask_check_zzb from '../components/gtasks/check/zzb';
import gtask_check_bmd from '../components/gtasks/check/bmd';

// 待复审
import gtask_index from '../components/gtasks/index';
import gtask_review_zzb from '../components/gtasks/review/zzb';
import gtask_review_ygd from '../components/gtasks/review/ygd';
import gtask_review_jyd from '../components/gtasks/review/jyd';
import gtask_review_gyl from '../components/gtasks/review/gyl';
import gtask_review_bmd from '../components/gtasks/review/bmd';

// 借款管理
import borrow_index from '../components/borrow/index';
import borrow_list_zzb from '../components/borrow/list/zzb';
import borrow_list_ygd from '../components/borrow/list/ygd';
import borrow_list_jyd from '../components/borrow/list/jyd';
import borrow_list_gyl from '../components/borrow/list/gyl';
import borrow_list_bmd from '../components/borrow/list/bmd';
import borrow_list_xjdOffline from '../components/borrow/list/xjdOffline';
import borrow_list_xjdOnline from '../components/borrow/list/xjdOnline';
import borrow_list_defq from '../components/borrow/list/defq';
import borrow_list_zyzj from '../components/borrow/list/zyzj';
import borrow_list_bl from '../components/borrow/list/bl';
import borrow_list_zd from '../components/borrow/list/zd';

import borrow_detail_zyzj from '../components/borrow/detail/zyzj';

// 查看页
import detail_zzb from '../components/detail/detail_zzb';
import detail_ygd from '../components/detail/detail_ygd';
import detail_jyd from '../components/detail/detail_jyd';
import detail_gyl from '../components/detail/detail_gyl';
import detail_bmd from '../components/detail/detailBmd';
import detail_bmd_credit from '../components/detail/detailBmdCredit';
import detail_xjdOffline from '../components/detail/detail_xjdOffline';

import repay_index from '../components/repay/index';
import repay_zzb from '../components/repay/plan/zzb';
import repay_ygd from '../components/repay/plan/ygd';
import repay_jyd from '../components/repay/plan/jyd';
import repay_gyl from '../components/repay/plan/gyl';
import repay_cashloan from '../components/repay/plan/cashloan';
import repay_bl from '../components/repay/plan/bl';
import repay_zyzj from '../components/repay/plan/zyzj';
import repay_xed from '../components/repay/plan/xed';
import detail_repay from '../components/repay/plan/detail';
import detail_gyl_repay from '../components/repay/plan/detail_model';
import detail_new_repay from '../components/repay/plan/detail_new';
import repay_zd from '../components/repay/plan/zd';


import repay_export from '../components/repay/export';
import repay_audit from '../components/repay/audit/list';

import repay_under_ygd from '../components/repay/under/ygd';
import repay_under_jyd from '../components/repay/under/jyd';
import repay_under_gyl from '../components/repay/under/gyl';
import repay_under_zzb from '../components/repay/under/zzb';
import repay_under_cashloan from '../components/repay/under/cashloan';
import repay_under_zyzj from '../components/repay/under/zyzj';
import repay_under_xed from '../components/repay/under/xed';
import repay_under_bl from '../components/repay/under/bl';
import repay_under_zd from '../components/repay/under/zd';


import create_account from '../components/pages/create_account';
import pay_ygd from '../components/pay/pay/ygd';
import pay_jyd from '../components/pay/pay/jyd';
import pay_gyl from '../components/pay/pay/gyl';
import pay_bmd from '../components/pay/pay/bmd';

// 数据统计
import index_statistics from '../components/statistics/index';
import loan_statistics from '../components/statistics/loan';
import loanCensus_statistics from '../components/statistics/loanCensus.jsx';
import repayCensus_statistics from '../components/statistics/repayCensus.jsx';

// 报表管理
// import statement from '../components/statement/index';
import statement_condition from '../components/statistics/condition';
import statement_structure from '../components/statistics/table';

//产品管理
import product from '../components/product';
import product_total_list from '../components/product/total/list';
import product_total_add from '../components/product/total/add';
import product_total_detail from '../components/product/total/detail';
import product_project_list from '../components/product/project/list';
import product_project_product from '../components/product/project/child/listTab';
import product_project_product_add from '../components/product/project/child/product/add';
import product_project_product_detail from '../components/product/project/child/product/detail';

// 客户管理
import customer from '../components/customer/index';
import customer_gyl_list from '../components/customer/gyl/index';
import customer_gyl_edit from '../components/customer/gyl/edit';
import customer_gyl_detail from '../components/customer/gyl/detail';

import customer_private_list from '../components/customer/Private/list';
import customer_private_detail from '../components/customer/Private/detail';
import customer_anterprise_list from '../components/customer/Anterprise/list';
import customer_jyd_list from '../components/customer/jyd/index';
import customer_jyd_detail from '../components/customer/jyd/detail';
import customer_jyd_edit from '../components/customer/jyd/edit';


import customer_changeInfo_apply_list from '../components/customer/approve/index';

//商户管理
import tenant from '../components/tenant';
import audit_detail from '../components/tenant/audit/detail/index';
import audit_list from '../components/tenant/audit/list';
import total_list from '../components/tenant/total/list';
import total_edit from '../components/tenant/total/edit/index';

// 逾期管理
import index_afterloan from '../components/afterloan/index';
import afterloan_overdue from '../components/afterloan/overdue';
import afterloan_overdue_detail from '../components/afterloan/detail';
import afterloan_overdue_detail_call from '../components/afterloan/components/callLog';
import approve_list from '../components/afterloan/approve';
import calllog_list from '../components/afterloan/callLogAll';

// 资金管理
const capital = React.lazy(() => import('../components/capital/index'));
const capital_account = React.lazy(() => import('../components/capital/account/list'));
const capital_account_detail = React.lazy(() => import('../components/capital/account/detail'));
const capital_account_info_edit = React.lazy(() => import('../components/capital/account/components/account/edit'));
const capital_account_detail_info = React.lazy(() => import('../components/capital/account/components/account/detail'));
const capital_total = React.lazy(() => import('../components/capital/total/total'));
const capital_total_element = React.lazy(() => import('../components/capital/total/element'));
const capital_divide = React.lazy(() => import('../components/capital/divide/undivide'));
const capital_business = React.lazy(() => import('../components/capital/divide/business'));
// 资金管理-保理
const capital_bl_account = React.lazy(() => import('../components/capital/accountBl/list'));
const capital_bl_account_detail = React.lazy(() => import('../components/capital/accountBl/detail'));
const capital_bl_account_info_edit = React.lazy(() => import('../components/capital/accountBl/components/account/edit'));
const capital_bl_account_detail_info = React.lazy(() => import('../components/capital/accountBl/components/account/detail'));
const capital_bl_total = React.lazy(() => import('../components/capital/totalBl/total'));
const capital_bl_total_element = React.lazy(() => import('../components/capital/totalBl/element'));
const capital_bl_divide = React.lazy(() => import('../components/capital/divideBl/undivide'));
const capital_bl_business = React.lazy(() => import('../components/capital/divideBl/business'));


const capitalBusinessDifference = React.lazy(() => import("../components/capital/reconcile/difference"));
const capitalInnerDifference = React.lazy(() => import("../components/capital/reconcile/particulars"));
const capitalBankDifference = React.lazy(() => import("../components/capital/bank/list"));


// 支付管理
const payIndex = React.lazy(() => import('../components/pay/index'));
const payInsert = React.lazy(() => import('../components/pay/insert_pay'));
const payPayZzb = React.lazy(() => import("../components/pay/pay/zzb"));
const payTradePay = React.lazy(() => import("../components/pay/pay/pay"));
const payTradeRepay = React.lazy(() => import("../components/pay/pay/repay"));
const payAuditPay = React.lazy(() => import("../components/pay/pay/audit"));

// 会员管理
const vipIndex = React.lazy(() => import('../components/VIP/index'));
const vipBmdOrder = React.lazy(() => import('../components/VIP/bmd/order'));
const vipBmdOrderDetail = React.lazy(() => import('../components/VIP/bmd/detail'));

//权限管理
const powerIndex = React.lazy(() => import("../components/power/index"));
const powerUserList = React.lazy(() => import("../components/power/user/index"));
const powerUserDetail = React.lazy(() => import("../components/power/user/detail"));
const powerRole = React.lazy(() => import("../components/power/manage/role"));
const powerRoleDetail = React.lazy(() => import("../components/power/manage/role_detail"));
const powerAssign = React.lazy(() => import("../components/power/manage/assign"));
const powerList = React.lazy(() => import("../components/power/manage/list"));

// 文档
const doc = React.lazy(() => import("../components/doc/index"));
const viewer = React.lazy(() => import("../components/doc/items/viewer"));
const richText = React.lazy(() => import("../Test/Umeditor"));

// iframe
const frame = React.lazy(() => import("../components/frame/frame"));
const detailReport = React.lazy(() => import("../components/detail/detailReport"));
const notFound = React.lazy(() => import("../components/pages/NotFound"));

//运营管理
const operaIndex = React.lazy(() => import("../components/operation/index"));
const operaRddsList = React.lazy(() => import("../components/operation/rdfy/dsList"));
const operaRddcList = React.lazy(() => import("../components/operation/rdfy/dcList"));
const operaRdtdList = React.lazy(() => import("../components/operation/rdfy/tdList"));
const operaXmcbList = React.lazy(() => import("../components/operation/xmcb/"));



export default class CRouter extends Component {
    render() {
        return (
            <Router history={browserHistory}>
                <Route path={'/'} breadcrumbName="Home" components={App}>
                    <IndexRedirect to={"db/check/bmd"} />
                    {/* 待办管理 */}
                    <Route path={'db'} breadcrumbName="待办管理" component={gtask_index}>
                        <IndexRedirect to="/db/match/bmd" />
                        <Route path={"check"} breadcrumbName="待初审">
                            <Route path={'zzb'} breadcrumbName="智尊保业务" component={gtask_check_zzb}>
                                <Route path={'detail'} breadcrumbName="查看" component={detail_zzb} />
                            </Route>
                            <Route path={'ygd'} breadcrumbName="员工贷业务" component={gtask_check_ygd}>
                                <Route path={'detail'} breadcrumbName="查看" component={detail_ygd} />
                            </Route>
                            <Route path={'jyd'} breadcrumbName="经营贷业务" component={gtask_check_jyd}>
                                <Route path={'detail'} breadcrumbName="查看" component={detail_jyd} />
                            </Route>
                            <Route path={'gyl'} breadcrumbName="供应链" component={gtask_check_gyl}>
                                <Route path={'detail'} breadcrumbName="查看" component={detail_gyl} />
                            </Route>
                            <Route path={'bmd'} breadcrumbName="白猫贷业务" component={gtask_check_bmd}>
                                <Route path={'detail'} breadcrumbName="查看" component={detail_bmd} />
                                <Route path={'report'} breadcrumbName="运营商报告" component={detailReport} />
                            </Route>
                        </Route>
                        <Route path={"review"} breadcrumbName="待复审">
                            <Route path={'zzb'} breadcrumbName="智尊保业务" component={gtask_review_zzb}>
                                <Route path={'detail'} breadcrumbName="查看" component={detail_zzb} />
                            </Route>
                            <Route path={'ygd'} breadcrumbName="员工贷业务" component={gtask_review_ygd}>
                                <Route path={'detail'} breadcrumbName="查看" component={detail_ygd} />
                            </Route>
                            <Route path={'jyd'} breadcrumbName="经营贷业务" component={gtask_review_jyd}>
                                <Route path={'detail'} breadcrumbName="查看" component={detail_jyd} />
                            </Route>
                            <Route path={'gyl'} breadcrumbName="供应链业务" component={gtask_review_gyl}>
                                <Route path={'detail'} breadcrumbName="查看" component={detail_gyl} />
                            </Route>
                            <Route path={'bmd'} breadcrumbName="白猫贷业务" component={gtask_review_bmd}>
                                <Route path={'detail'} breadcrumbName="查看" component={detail_bmd} />
                                <Route path={'report'} breadcrumbName="运营商报告" component={detailReport} />
                            </Route>
                        </Route>

                        <Route path={"bmd"} breadcrumbName="白猫贷">
                            <IndexRedirect to="/db/bmd/auto" />
                            <Route path={'auto'} breadcrumbName="机器评额" component={gtask_match_bmd_auto}>
                                <Route path={'detail'} breadcrumbName="查看" component={detail_bmd_credit} />
                            </Route>
                            <Route path={'audit'} breadcrumbName="人工评额" component={gtask_match_bmd_audit}>
                                <Route path={'detail'} breadcrumbName="查看" component={detail_bmd_credit} />
                            </Route>
                        </Route>
                        <Route path={'pay/audit'} breadcrumbName="支付待审核" component={payAuditPay} />
                    </Route>
                    {/*借款管理*/}
                    <Route path={'jk'} breadcrumbName="借款管理" component={borrow_index}>
                        <IndexRedirect to="/jk/list/bmd" />
                        <Route path={'list/zzb'} breadcrumbName="智尊保业务" component={borrow_list_zzb}>
                            <Route path={'detail'} breadcrumbName="查看" component={detail_zzb} />
                        </Route>
                        <Route path={'list/ygd'} breadcrumbName="员工贷业务" component={borrow_list_ygd}>
                            <Route path={'detail'} breadcrumbName="查看" component={detail_ygd} />
                        </Route>
                        <Route path={'list/defq'} breadcrumbName="大额消费分期业务" component={borrow_list_defq}>
                            <Route path={'detail'} breadcrumbName="查看" component={detail_ygd} />
                        </Route>
                        <Route path={'list/jyd'} breadcrumbName="经营贷业务" component={borrow_list_jyd}>
                            <Route path={'detail'} breadcrumbName="查看" component={detail_jyd} />
                        </Route>
                        <Route path={'list/gyl'} breadcrumbName="供应链业务" component={borrow_list_gyl}>
                            <Route path={'detail'} breadcrumbName="查看" component={detail_gyl} />
                        </Route>
                        <Route path={'list/bmd'} breadcrumbName="白猫贷业务" component={borrow_list_bmd}>
                            <Route path={'detail'} breadcrumbName="查看" component={detail_bmd} />
                            <Route path={'report'} breadcrumbName="运营商报告" component={detailReport} />
                        </Route>
                        <Route path={'list/xjdOffline'} breadcrumbName="现金贷离线业务" component={borrow_list_xjdOffline}>
                            <Route path={'detail'} breadcrumbName="查看" component={detail_xjdOffline} />
                        </Route>
                        <Route path={'list/xjdOnline'} breadcrumbName="现金贷实时业务" component={borrow_list_xjdOnline} />
                        <Route path={'list/zyzj'} breadcrumbName="自有资金业务" component={borrow_list_zyzj}>
                            <Route path={'detail'} breadcrumbName="查看" component={borrow_detail_zyzj} />
                        </Route>
                        <Route path={'list/bl'} breadcrumbName="保理业务" component={borrow_list_bl}>
                            <Route path={'detail'} breadcrumbName="查看" component={borrow_detail_zyzj} />
                        </Route>
                        <Route path={'list/zd'} breadcrumbName="助贷业务" component={borrow_list_zd}>
                            <Route path={'detail'} breadcrumbName="查看" component={borrow_detail_zyzj} />
                        </Route>
                    </Route>
                    {/* 支付管理 */}
                    <Route path={'zf'} breadcrumbName="支付管理" component={payIndex}>
                        <Route path={'insert'} breadcrumbName="新增放款" component={payInsert} />
                        <Route path={"pay"} breadcrumbName="待放款">
                            <Route path={'zzb'} breadcrumbName="智尊保业务" component={payPayZzb}>
                                <Route path={'detail'} breadcrumbName="查看" component={detail_zzb} />
                            </Route>
                            <Route path={'ygd'} breadcrumbName="员工贷业务" component={pay_ygd}>
                                <Route path={'detail'} breadcrumbName="查看" component={detail_ygd} />
                            </Route>
                            <Route path={'jyd'} breadcrumbName="经营贷业务" component={pay_jyd}>
                                <Route path={'detail'} breadcrumbName="查看" component={detail_jyd} />
                            </Route>
                            <Route path={'gyl'} breadcrumbName="供应链业务" component={pay_gyl}>
                                <Route path={'detail'} breadcrumbName="查看" component={detail_gyl} />
                            </Route>
                            <Route path={'bmd'} breadcrumbName="白猫贷业务" component={pay_bmd}>
                                <Route path={'detail'} breadcrumbName="查看" component={detail_bmd} />
                            </Route>
                        </Route>
                        <Route path={'trade/pay'} breadcrumbName="付款单查询" component={payTradePay} />
                        <Route path={'trade/repay'} breadcrumbName="收款单查询" component={payTradeRepay} />
                    </Route>
                    {/*还款管理*/}
                    <Route path={'hk'} breadcrumbName="还款管理" component={repay_index}>
                        <IndexRedirect to="/hk/plan/bmd" />
                        <Route path="audit" component={repay_audit} breadcrumbName="减免审批" />
                        <Route path="export" component={repay_export} breadcrumbName="导出数据" />
                        <Route path="plan" breadcrumbName="还款计划">
                            <Route path={'zzb'} breadcrumbName="智尊保业务" component={repay_zzb}>
                                <Route path={'detail'} breadcrumbName="查看" component={detail_repay} />
                            </Route>
                            <Route path={'ygd'} breadcrumbName="员工贷业务" component={repay_ygd}>
                                <Route path={'detail'} breadcrumbName="查看" component={detail_gyl_repay} />
                            </Route>
                            <Route path={'jyd'} breadcrumbName="经营贷业务" component={repay_jyd}>
                                <Route path={'detail'} breadcrumbName="查看" component={detail_gyl_repay} />
                            </Route>
                            <Route path={'gyl'} breadcrumbName="供应链业务" component={repay_gyl}>
                                <Route path={'detail'} breadcrumbName="查看" component={detail_gyl_repay} />
                            </Route>
                            <Route path={'zyzj'} breadcrumbName="自有资金业务" component={repay_zyzj}>
                                <Route path={'detail'} breadcrumbName="查看" component={detail_new_repay} />
                            </Route>
                            <Route path={'cashloan'} breadcrumbName="白猫贷自有业务" component={repay_cashloan}>
                                <Route path={'detail'} breadcrumbName="查看" component={detail_new_repay} />
                            </Route>
                            <Route path={'cashcoop_daiyunying'} breadcrumbName="小额贷" component={repay_xed}>
                                <Route path={'detail'} breadcrumbName="查看" component={detail_repay} />
                            </Route>
                            <Route path={'bl'} breadcrumbName="保理业务" component={repay_bl}>
                                <Route path={'detail'} breadcrumbName="查看" component={detail_new_repay} />
                            </Route>
                            <Route path={'zd'} breadcrumbName="助贷业务" component={repay_zd}>
                                <Route path={'detail'} breadcrumbName="查看" component={detail_new_repay} />
                            </Route>
                        </Route>
                        <Route path="under" breadcrumbName="还款查询">
                            <Route path={'ygd'} breadcrumbName="员工贷业务" component={repay_under_ygd}>
                                <Route path={'detail'} breadcrumbName="查看" component={detail_gyl_repay} />
                            </Route>
                            <Route path={'jyd'} breadcrumbName="经营贷业务" component={repay_under_jyd}>
                                <Route path={'detail'} breadcrumbName="查看" component={detail_gyl_repay} />
                            </Route>
                            <Route path={'gyl'} breadcrumbName="供应链业务" component={repay_under_gyl}>
                                <Route path={'detail'} breadcrumbName="查看" component={detail_gyl_repay} />
                            </Route>
                            <Route path={'zzb'} breadcrumbName="智尊保业务" component={repay_under_zzb}>
                                <Route path={'detail'} breadcrumbName="查看" component={detail_repay} />
                            </Route>
                            <Route path={'zyzj'} breadcrumbName="自有资金业务" component={repay_under_zyzj}>
                                <Route path={'detail'} breadcrumbName="查看" component={detail_new_repay} />
                            </Route>
                            <Route path={'cashloan'} breadcrumbName="白猫贷业务" component={repay_under_cashloan}>
                                <Route path={'detail'} breadcrumbName="查看" component={detail_new_repay} />
                            </Route>
                            <Route path={'cashcoop_daiyunying'} breadcrumbName="小额贷业务" component={repay_under_xed}>
                                <Route path={'detail'} breadcrumbName="查看" component={detail_repay} />
                            </Route>
                            <Route path={'bl'} breadcrumbName="保理业务" component={repay_under_bl}>
                                <Route path={'detail'} breadcrumbName="查看" component={detail_new_repay} />
                            </Route>
                            <Route path={'zd'} breadcrumbName="助贷业务" component={repay_under_zd}>
                                <Route path={'detail'} breadcrumbName="查看" component={detail_new_repay} />
                            </Route>
                        </Route>
                    </Route>
                    {/*资金管理*/}
                    <Route path={'zj'} breadcrumbName="资金管理" component={capital}>
                        <IndexRedirect to="/zj/account" />
                        <Route path={'account'} breadcrumbName="账户一览" component={capital_account}>
                            <Route path={'detail'} breadcrumbName="账户明细" component={capital_account_detail} />
                            <Route path={'edit'} breadcrumbName="编辑账户信息" component={capital_account_info_edit} />
                            <Route path={'info'} breadcrumbName="账户信息" component={capital_account_detail_info} />
                        </Route>
                        <Route path={'total'} breadcrumbName="明细汇总" component={capital_total}>
                            <Route path={'element'} breadcrumbName="资金成分查询" component={capital_total_element} />
                        </Route>
                        <Route path={'business'} breadcrumbName="业务分账" component={capital_business} />
                        <Route path={'business/undivide'} breadcrumbName="分账流水" component={capital_divide} />
                        <Route path={"difference"} breadcrumbName="业务与三方对账差异" component={capitalBusinessDifference} />
                        <Route path={"inner"} breadcrumbName="三方与基本户对账明细" component={capitalInnerDifference} />
                        <Route path={"bank"} breadcrumbName="银行与三方对账结果" component={capitalBankDifference} />

                        <Route path={'blaccount'} breadcrumbName="账户一览" component={capital_bl_account}>
                            <Route path={'detail'} breadcrumbName="账户明细" component={capital_bl_account_detail} />
                            <Route path={'edit'} breadcrumbName="编辑账户信息" component={capital_bl_account_info_edit} />
                            <Route path={'info'} breadcrumbName="账户信息" component={capital_bl_account_detail_info} />
                        </Route>
                        <Route path={'bltotal'} breadcrumbName="明细汇总" component={capital_bl_total}>
                            <Route path={'element'} breadcrumbName="资金成分查询" component={capital_bl_total_element} />
                        </Route>
                        <Route path={'blbusiness'} breadcrumbName="业务分账" component={capital_bl_business} />
                        <Route path={'blbusiness/undivide'} breadcrumbName="分账流水" component={capital_bl_divide} />

                    </Route>
                    {/*产品管理*/}
                    <Route path={'cp'} breadcrumbName="产品管理" component={product}>
                        <Route path={'total/list'} breadcrumbName="产品列表" component={product_total_list}>
                            <Route path={'add'} breadcrumbName="产品添加" component={product_total_add} />
                            <Route path={'edit'} breadcrumbName="产品编辑" component={product_total_add} />
                            <Route path={'detail'} breadcrumbName="产品查看" component={product_total_detail} />
                        </Route>
                        <Route path={'project/list'} breadcrumbName="项目管理" component={product_project_list} >
                            <Route path={'product'} breadcrumbName="产品管理" component={product_project_product}>
                                <Route path={'edit'} breadcrumbName="编辑" component={product_project_product_add} />
                                <Route path={'add'} breadcrumbName="新增" component={product_project_product_add} />
                                <Route path={'detail'} breadcrumbName="查看" component={product_project_product_detail} />
                            </Route>
                        </Route>
                    </Route>
                    {/*客户管理*/}
                    <Route path={'kh'} breadcrumbName="客户管理" component={customer}>
                        <Route path={'gyl/list'} breadcrumbName="供应链业务" component={customer_gyl_list}>
                            <Route path={'edit'} breadcrumbName="客户编辑" component={customer_gyl_edit} />
                            <Route path={'detail'} breadcrumbName="客户查看" component={customer_gyl_detail} />
                        </Route>
                        <Route path={'jyd/list'} breadcrumbName="经营贷业务" component={customer_jyd_list}>
                            <Route path={'edit'} breadcrumbName="客户编辑" component={customer_jyd_edit} />
                            <Route path={'detail'} breadcrumbName="客户查看" component={customer_jyd_detail} />
                        </Route>

                        <Route path={'private/list'} breadcrumbName="个人客户" component={customer_private_list}>
                            <Route path={'detail'} breadcrumbName="客户查看" component={customer_private_detail} />
                        </Route>
                        <Route path={'anterprise/list'} breadcrumbName="企业客户" component={customer_anterprise_list} />
                        <Route path={'approve/list'} breadcrumbName="审批管理" component={customer_changeInfo_apply_list} />

                    </Route>

                    {/*商户管理*/}
                    <Route path={'sh'} breadcrumbName="商户管理" component={tenant}>
                        <Route path={'audit'} breadcrumbName="商户审核" component={audit_list}>
                            <Route path={'edit'} breadcrumbName="审核" component={audit_detail} />
                            <Route path={'detail'} breadcrumbName="查看" component={audit_detail} />
                        </Route>
                        <Route path={'total'} breadcrumbName="认证商户" component={total_list}>
                            <Route path={'edit'} breadcrumbName="编辑" component={total_edit} />
                            <Route path={'detail'} breadcrumbName="查看" component={total_edit} />
                        </Route>
                    </Route>

                    <Route path={'tj'} breadcrumbName="数据统计" component={index_statistics}>
                        <IndexRedirect to="/tj/loan" />
                        {/* 报表管理 */}
                        <Route path={'bb/condition'} breadcrumbName="放贷情况表" component={statement_condition} />
                        <Route path={'bb/structure'} breadcrumbName="业务结构表" component={statement_structure} />
                        {/* <Route path={'bb/structure/bulk'} component={statement_bulk} />
                        <Route path={'bb/structure/amount'} component={statement_amount} />
                        <Route path={'bb/structure/rate'} component={statement_rate} />
                        <Route path={'bb/structure/period'} component={statement_period} />
                        <Route path={'bb/structure/industry'} component={statement_industry} />
                        <Route path={'bb/structure/form'} component={statement_form} />
                        <Route path={'bb/structure/guarantee'} component={statement_guarantee} /> */}
                        <Route path={"loan"} breadcrumbName="借贷统计" component={loan_statistics} />
                        <Route path={"loanCensus"} breadcrumbName="进件统计" component={loanCensus_statistics} />
                        <Route path={"repayCensus"} breadcrumbName="还款统计" component={repayCensus_statistics} />
                        {/* <Route path={"overdue"} breadcrumbName="逾期统计" component={overdue_statistics} /> */}
                        {/* <Route path={"dynamic"} breadcrumbName="动态逾期率" component={dynamic_overdue} /> */}
                        {/* <Route path={"dynamicDetail"} breadcrumbName="动态逾期率明细" component={dynamic_detail_overdue} /> */}
                        {/* <Route path={"vintage"} breadcrumbName="vintage逾期率" component={vintage_overdue} /> */}
                    </Route>

                    <Route path={'dh'} breadcrumbName="贷后管理" component={index_afterloan}>
                        <IndexRedirect to="/dh/overdue" />
                        <Route path={"overdue"} breadcrumbName="贷后管理" component={afterloan_overdue}>
                            <Route path={"detail"} breadcrumbName="查看" component={afterloan_overdue_detail} search={"dhCallList"}>
                                <Route path={"call"} breadcrumbName="通话记录" component={afterloan_overdue_detail_call} />
                            </Route>
                        </Route>
                        <Route path={'overdue/report'} breadcrumbName="运营商报告" component={detailReport} />
                        <Route path={"approve"} breadcrumbName="审批管理" component={approve_list} />
                        <Route path={"calllog"} breadcrumbName="外呼记录查询" component={calllog_list}>
                            <Route path={"detail"} breadcrumbName="查看" component={afterloan_overdue_detail} />
                        </Route>
                    </Route>

                    <Route path={'vip'} breadcrumbName="会员管理" component={vipIndex}>
                        <IndexRedirect to="/vip/bmd/order" />
                        <Route path={"bmd"} breadcrumbName="白猫贷业务" component={vipBmdOrder}>
                            <Route path={"order"} breadcrumbName="会员订单管理" component={vipBmdOrder}>
                                <Route path={"detail"} breadcrumbName="查看" component={vipBmdOrderDetail} />
                            </Route>
                        </Route>
                    </Route>

                    <Route path={'operation'} breadcrumbName="运营管理" component={operaIndex}>
                        <IndexRedirect to="/operation/rd/ds" />
                        <Route path={"rd"} breadcrumbName="融担费用" component={operaRddsList}>
                            <Route path={"ds"} breadcrumbName="代收融担费用-华章汉辰" component={operaRddsList} />
                            <Route path={"dc"} breadcrumbName="华章汉辰代偿费用" component={operaRddcList} />
                            <Route path={"td"} breadcrumbName="融担服务费" component={operaRdtdList} />
                        </Route>
                        <Route path={"xmcb"} breadcrumbName="项目成本" component={operaXmcbList} />
                    </Route>

                    <Route path={'power'} breadcrumbName="权限管理" component={powerIndex}>
                        <IndexRedirect to="/power/user/list" />
                        <Route path={"user/list"} breadcrumbName="人员管理" component={powerUserList}>
                            <Route path={"detail"} breadcrumbName="查看" component={powerUserDetail} />
                        </Route>
                        <Route path={"manage"} breadcrumbName="权限管理" component={powerRole}>
                            <Route path={"role"} breadcrumbName="角色管理" component={powerRole}>
                                <Route path={"detail"} breadcrumbName="查看" component={powerRoleDetail} />
                            </Route>
                            <Route path={"assign"} breadcrumbName="权限分配" component={powerAssign} />
                            <Route path={"list"} breadcrumbName="权限列表" component={powerList} />
                        </Route>
                    </Route>

                    {/* 测试文档 */}
                    <Route path={'doc'} component={doc}>
                        <IndexRedirect to="/doc/viewer" />
                        <Route path="rich" component={richText} />
                        <Route path="viewer" component={viewer} />
                    </Route>
                    {/* frame */}
                    <Route path={'frame'} component={frame} />
                    <Route path={'report'} breadcrumbName="运营商报告" component={detailReport} />

                    {/* <Route path={'example'} breadcrumbName="示例" component={widthSider(exampleSider)}> */}
                    {/* <Route path={'list'} breadcrumbName="列表" component={listExample} /> */}
                    {/* </Route> */}

                    <Route path="create" component={create_account} />
                    <Route path="*" component={notFound} />
                </Route>
            </Router>
        )
    }
}