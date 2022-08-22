// 数据请求接口地址
const api = {
	// 创建账号
	create_account: "/manage/agent/create",
	aesKey: "/api/authutil/aes_key",
	// 获取验证码
	captcha: "/api/authutil/send_sms",
	// 登录
	login: "/api/authutil/login",
	// 登录
	login_free: "/auth/login_as?login=jiangmengjin",
	// 花生业务详情页
	hs_detail: "/api/loan/huashenghaoche/getOrderId",
	// 智尊保业务详情页
	zzb_detail: "/api/loan/zhizunbao/getOrderId",
	// 待审核列表
	// audit_list: "/api/task/list",
	// 通过或者驳回审核任务
	// pass_reject : "api/task/approve",
	// 审核任务
	// audit_task: "/api/task/get",
	// 获取下拉列表数据
	select_data: "component/get_all_dropdown_data",
	// 花生借款查询
	hs_borrow_list: "/api/loan/huashenghaoche/list",
	// 智尊保借款查询
	zzb_borrow_list: "/api/loan/zhizunbao/list",
	// 支付单列表
	pay_list: "/api/pay_request/list",
	// 待支付
	pay_wait: "/api/bmd_pay_request/list/wait_pay",
	// 待支付统计
	pay_wait_total: "/api/bmd_pay_request/amount/wait_pay",
	// 支付中
	pay_doing: "/api/bmd_pay_request/list/paying",
	// 支付成功
	pay_success: "/api/bmd_pay_request/list/pay_success",
	// 支付失败
	pay_failure: "/api/bmd_pay_request/list/pay_failure",
	// 确认支付
	pay_confirm: "/api/bmd_pay_request/confirm",
	// 拒绝支付
	pay_deny: "/api/bmd_pay_request/deny",
	// 新增放款
	insert_pay: "/api/loan/bfq/web_add",
	// 支付结果查询
	pay_related: "/api/bmd_pay_request/list/pay_related",
	// 支付结果明细
	pay_detail: "/api/bmd_pay_request/pay_detail",
	// 导入台账
	import_excel: "/insurance/excel/import",
	// 立即匹配
	match_now: "match/go_match",
	// 确认台账
	insert_excel: "/insurance/excel/batch_insert",
	// 花生待匹配列表
	hs_match_list: "/pre_match/list",
	// 花生待匹配进审
	hs_match_success: "/pre_match/sign_success",
	// 花生待匹配驳回
	hs_match_fail: "/pre_match/sign_fail",
	match_success_approve: "/pre_match/sign_all_full_match_success",
	// 花生待匹配统计
	hs_match_total: "/pre_match/statistics",
	// 花生初审列表
	hs_audit_first: "/api/huashenghaoche/task/list/audit",
	// 花生初审统计
	hs_audit_total: "/api/huashenghaoche/task/stats/audit",
	// 花生审核通过
	hs_tast_approve: "/api/huashenghaoche/task/approve",
	// 花生复审列表
	hs_audit_second: "/api/huashenghaoche/task/list/senior_audit",
	// 花生复审详情列表
	combined_senior_audit: "/api/huashenghaoche/task/list/combined_senior_audit",
	// 花生复审详情列表统计
	combined_senior_total: "/api/huashenghaoche/task/stats/senior_audit",
	// 智尊保初审列表
	zzb_audit_first: "/api/zhizunbao/task/list/audit",
	// 智尊保初审导出
	zzb_audit_first_export: "/api/zhizunbao/task/list/audit/export",
	// 智尊保审核通过
	zzb_tast_approve: "/api/zhizunbao/task/approve",
	// 智尊保复审列表
	zzb_audit_second: "/api/zhizunbao/task/list/senior_audit",
	// 智尊保复审导出
	zzb_audit_second_export: "/api/zhizunbao/task/list/senior_audit/export",
	// 智尊保待放款
	zzb_send_pay: "/api/loan/zhizunbao/send_pay",
	// 智尊保审核进度
	zzb_task_history: "/api/zhizunbao/task/getHistory",

	// 衡度业务
	// 初审
	audit_first: "/api/bfq/task/list/audit",
	// 复审
	audit_second: "/api/bfq/task/list/senior_audit",
	// 审核
	tast_approve: "/api/bfq/task/approve",
	// 审核进度
	task_history: "/api/task/getHistory",
	// 借款列表
	loan_list: "/api/loan/bfq/list",
	// 发送支付
	send_pay: "/api/loan/bfq/send_pay",

	// 现金贷自有
	// 评额列表
	xjd_order_credit_list: "/manage/credit/list",
	xjd_order_credit_list_detail: "/manage/credit/get_detail",
	xjd_order_credit_audit_pass: "/manage/credit/approve1",
	xjd_order_credit_audit_deny: "/manage/credit/deny",
	xjd_order_list: "/manage/loan_order/get_list",
	xjd_order_detail: "/manage/loan_order/get_detail",
	xjd_order_audit_pass: "/manage/loan_order/approve1",
	xjd_order_audit_deny: "/manage/loan_order/deny",

	xjd_select_app: "/manage/loan_order/register_app_list",
	xjd_select_product: "/manage/loan_order/product_list",
	xjd_select_channel: "/manage/dropdown/client_channel",

	xjd_credit_system_list: "/manage/credit/system/list",
	xjd_credit_system_detail: "/manage/credit/system/detail",
	xjd_credit_manual_list: "/manage/credit/manual/list",
	xjd_credit_manual_detail: "/manage/credit/manual/detail",
	xjd_credit_manual_approve: "/manage/credit/manual/approve",
	xjd_credit_manual_deny: "/manage/credit/manual/deny",
	xjd_audit0_list: "/manage/loan_order/audit0/list",
	xjd_audit0_detail: "/manage/loan_order/audit0/detail",
	xjd_audit0_approve: "/manage/loan_order/audit0/approve",
	xjd_audit0_deny: "/manage/loan_order/audit0/deny",
	xjd_audit1_list: "/manage/loan_order/audit1/list",
	xjd_audit1_detail: "/manage/loan_order/audit1/detail",
	xjd_audit1_approve: "/manage/loan_order/audit1/approve",
	xjd_audit1_deny: "/manage/loan_order/audit1/deny",
	xjd_pay_list: "/manage/loan_order/pay/list",
	xjd_pay_detail: "/manage/loan_order/pay/detail",
	xjd_loan_list: "/manage/loan_order/loan/list",
	xjd_loan_detail: "/manage/loan_order/loan/detail",


	// 现金贷离线  借款管理
	// 合作方代号
	xjdOffline_borrow_select_cop: "/manage/dropdown/cop_info",
	// 借款列表
	xjdOffline_borrow_list: "/manage/loan/list",
	xjdOffline_borrow_list_export: "/manage/loan/excel",

	// 还款计划
	repay_plan_list: "/api/repay_plan/list",
	// 还款计划白猫贷
	// repay_plan_bmd_list: "/manage/contract/getContractSummary",

	repay_plan_bmd_list: "/manage/contract/list",

	// 还款计划导出
	repay_plan_list_export: "/api/repay_plan/export_list",
	//还款计划导出--白猫贷
	repay_plan_detail_export: "/manage/export/repayDetail",
	// 还款计划合计
	repay_plan_total: "/api/repay_plan/sum",
	repay_plan_total_bmd: "/manage/contract/listSum",
	// repay_plan_total_bmd:"/manage/contract/getSumContractSummary",
	//还款计划白猫贷下拉
	repay_plan_bmd_select_product: "/manage/util/getProductOptions",
	repay_plan_bmd_select_merchant: "/manage/util/getCooperatorOptions",
	repay_overdue_bmd_select_merchant: "/manage/loanApp/getAllCooperator",
	// 获取还款确认单信息
	repay_confirm_info: "/repayment/manage/late_fee/info",
	// 根据金额确认
	repay_confirm_money: "/repayment/manage/late_fee/confirm/by_amount",
	// 根据天数确认
	repay_confirm_days: "/repayment/manage/late_fee/confirm/by_days",
	// 待还款查询
	under_repay_plan_bmd: "/manage/repayPlan/list",
	under_repay_plan: "/api/under_repay_plan/list",
	// 待还款统计
	under_repay_total_bmd: "/manage/repayPlan/listSum",
	under_repay_plan_total: "/api/under_repay_plan/sum",
	// under_repay_plan_total : "/api/under_repay_plan/statistics",
	// 待还款统计  根据勾选
	under_repay_plan_select_total: "/api/statistics/by_select",
	// 待还款统计 全部
	under_repay_plan_all_total: "api/statistics/by_condition",
	// 全部数据还款确认
	under_repay_total_confirm: "/api/repay/batch",
	// 待还款导出
	under_repay_export: "/api/under_repay_plan/export_list",
	// 还款详情
	repay_detail: "/api/repay_plan/detail",
	repay_detail_bmd: "/manage/contract/getContractDetail",
	repay_contract_detail: "/manage/contract/detail",
	repay_contract_plan: "/manage/contract/repayPlan",
	repay_contract_undiscount: "/manage/contract/unusedDiscountList",
	//人工划扣试算
	repay_deduction_count: "/manage/contract/estimate",
	// 还款详情 by 
	repay_detail_by_domainNo: "api/repay_plan/detail/by_domain_no",
	//贷中减免
	repay_discount_apply: "/manage/discount/apply",
	//贷中审批列表
	repay_discount_audit_list: "/manage/discount/list",
	//贷中审批详情
	repay_discount_audit_detail: "/manage/discount/detail",
	//贷中审核
	repay_discount_audit: "/manage/discount/audit",
	//还款认领
	repay_directRepay: "/manage/repay/directRepay",
	// 还款
	repay: "/api/repay/select",
	// repay : "/api/repay/batch/select",
	// 提前还款
	pre_pay: "/api/repay/surrender_by_contract_id",
	// 提现还款 车险分期 orderNo=1t23g32&settleDate=2019-04-19&settleType=SETTLE
	pre_pay_cxfq: "/bookkeeping/settle",
	// 计算提前还款数
	cal_sum_loan_amount_interest: "/api/statistics/cal_repay_surrender",
	// 车险分期还款计划导出
	repay_plan_export_cxfq: "/manage/repay_plan/export",
	// cal_sum_loan_amount_interest:"/api/repay/cal_sum_loan_amount_interest",

	// 还款通知
	repay_inform: "/api/loan/zhizunbao/repayment",
	// 还款确认
	repay_confirm: "/api/loan/zhizunbao/repayment/confirm",
	// 还款导出
	repay_export: "/api/loan/zhizunbao/repayment/export",
	//自有资金
	repay_zyzj: "/manage/cop_order_info/order_detail",

	//房抵贷列表页
	fdd_get_list: "manage/order/gets",
	//房抵贷详情页
	fdd_get_detail: "manage/order/get",
	//初审通过
	fdd_approve0: "manage/order/approve0",
	//初审驳回
	fdd_deny0: "manage/order/deny0",
	//复审通过
	fdd_approve1: "manage/order/approve1",
	//复审驳回
	fdd_deny1: "manage/order/deny1",
	//审核流程
	fdd_gets_status_log: "manage/order/gets_status_log",
	//支付流程测试
	fdd_paying: "manage/order/paying",
	fdd_payed: "manage/order/payed",
	fdd_payfail: "manage/order/payfail",
	fdd_cleared: "manage/order/cleared",

	// 车险分期图片获取
	gtask_img_url: "/api/storage/get",
	// 车险待进审列表
	cxfq_under_review_list: "/manage/order/under_review_list",
	cxfq_under_review_detail: "/manage/order/under_review_detail",
	cxfq_under_review_export: "/manage/order/under_review_export",
	// 车险分期订单列表
	cxfq_order_list: "manage/order/get_list",
	// 车险分期产品列表
	cxfq_product_list: "manage/all_product_list",
	// 车险分期商户列表
	cxfq_business_list: "manage/all_business_list",
	//车险初审列表
	cxfq_first_list: "/manage/order/audit0_list",
	cxfq_first_detail: "/manage/order/audit0_detail",
	cxfq_first_export: "/manage/order/audit0_export",
	// 车险分期初审通过
	cxfq_first_pass: "/manage/order/audit0_approve",
	// 车险分期初审批量通过
	cxfq_first_pass_batch: "/manage/order/audit0_approve_batch",
	// 车险分期初审驳回
	cxfq_first_deny: "/manage/order/audit0_deny",
	// 车险分期初审批量驳回
	cxfq_first_deny_batch: "/manage/order/audit0_deny_batch",
	//车险复审列表
	cxfq_second_list: "/manage/order/audit1_list",
	cxfq_second_detail: "/manage/order/audit1_detail",
	cxfq_second_export: "/manage/order/audit1_export",
	// 车险分期复审通过
	cxfq_second_pass: "/manage/order/audit1_approve",
	// 车险分期复审批量通过
	cxfq_second_pass_batch: "/manage/order/audit1_approve_batch",
	// 车险分期复审驳回
	cxfq_second_deny: "/manage/order/audit1_deny",
	// 车险分期复审批量驳回
	cxfq_second_deny_batch: "/manage/order/audit1_deny_batch",
	//车险复审列表
	cxfq_thrice_list: "/manage/order/audit2_list",
	cxfq_thrice_detail: "/manage/order/audit2_detail",
	cxfq_thrice_export: "/manage/order/audit2_export",
	// 车险分期三审通过
	cxfq_thrice_pass: "/manage/order/audit2_approve",
	// 车险分期三审批量通过
	cxfq_thrice_pass_batch: "/manage/order/audit2_approve_batch",
	// 车险分期三审驳回
	cxfq_thrice_deny: "/manage/order/audit2_deny",
	// 车险分期三审批量驳回
	cxfq_thrice_deny_batch: "/manage/order/audit2_deny_batch",
	// 车险分期详情页
	cxfq_detail: "manage/order/detail",
	// 车险分期订单图片地址
	cxfq_img_path: "api/storage/get",
	// 车险分期借款协议
	cxfq_contract_path: "api/storage/get_contract",
	// 车险分期审核进度
	cxfq_audit_log: "manage/order/get_status_log_list",
	// 车险分期导出
	cxfq_export_excel: "manage/order/export",
	// 车险分期待放款
	cxfq_upder_pay: "/manage/order/pay_request",
	//车险待放款列表
	cxfq_pay_list: "/manage/order/pay_list",
	cxfq_pay_detail: "/manage/order/pay_detail",
	//车险借款列表
	cxfq_loan_list: "/manage/order/loan_list",
	cxfq_loan_detail: "/manage/order/loan_detail",

	//资金管理
	capital_account: "bmd_accounting/balance/all",
	capital_bl_account: "bmd_gj_accounting/balance/all",
	capital_account_edit: "/bmd_accounting/balance/update_info",
	capital_bl_account_edit: "/bmd_gj_accounting/balance/update_info",
	//资金详情表格
	capital_account_detail: "bmd_accounting/accounting/list",
	capital_bl_account_detail: "bmd_gj_accounting/accounting/list",
	//资金详情统计接口
	capital_account_stat: "bmd_accounting/accounting/stat",
	capital_bl_account_stat: "bmd_gj_accounting/accounting/stat",
	//资金管理人工充值
	capital_account_web_add: "bmd_accounting/accounting/web_add",
	capital_bl_account_web_add: "bmd_gj_accounting/accounting/web_add",
	//资金管理人工提现
	capital_account_web_sub: "bmd_accounting/accounting/web_sub",
	capital_bl_account_web_sub: "bmd_gj_accounting/accounting/web_sub",
	// 搜索资金账户
	capital_account_user_list: "bmd_accounting/accounting/list_user_account",
	capital_bl_account_user_list: "bmd_gj_accounting/accounting/list_user_account",
	// 车险分期归档驳回
	deny_archive: 'manage/order/deny_archive',
	// 获取资金总额
	capital_account_total: "bmd_accounting/balance",
	capital_bl_account_total: "bmd_gj_accounting/balance",
	// 资金管理导出
	capital_account_export: "bmd_accounting/accounting/export",
	capital_bl_account_export: "bmd_gj_accounting/accounting/export",
	// 未分账资金流水
	capital_undivide: "bmd_accounting/undivide/accounting/list",
	capital_bl_undivide: "bmd_gj_accounting/undivide/accounting/list",
	// 未分账业务帐
	capital_business: "bmd_accounting/undivide/business_accounting/apply/list",
	capital_bl_business: "bmd_gj_accounting/undivide/business_accounting/apply/list",
	// 分账拒绝
	capital_business_deny: "bmd_accounting/undivide/business_accounting/deny",
	capital_bl_business_deny: "bmd_gj_accounting/undivide/business_accounting/deny",
	// 分账确认
	capital_confirm: "bmd_accounting/undivide/business_accounting/confirm",
	capital_bl_confirm: "bmd_gj_accounting/undivide/business_accounting/confirm",
	// 分账挂起
	capital_hangup: "bmd_accounting/undivide/accounting/suspend",
	capital_bl_hangup: "bmd_gj_accounting/undivide/accounting/suspend",
	// 待确认请求
	capital_unverify_list: "/bookkeeping/un_confirm/list",
	// 业务类型列表
	capital_business_type: "/bookkeeping/group_list",
	// 待确认请求详情
	capital_confirm_detail: "/bookkeeping/un_confirm/detail",
	// 资金确认
	capital_confirm_submit: "/bookkeeping/confirm",
	// 成分查询
	capital_element: "bmd_accounting/accounting/detail",
	capital_bl_element: "bmd_gj_accounting/accounting/detail",
	// 资金统计
	capital_account_stats: "bmd_accounting/undivide/stats",
	capital_bl_account_stats: "bmd_gj_accounting/undivide/stats",
	// 历史请求查询
	capital_account_history: "/bookkeeping/al_confirm/list",
	//对账明细
	capital_bill: "bmd_accounting/bill/list",
	capital_bl_bill: "bmd_gj_accounting/bill/list",

	//资金管理 详情页
	capital_account_detail_info: "/bmd_accounting/balance/self_account_detail",
	capital_bl_account_detail_info: "/bmd_gj_accounting/balance/self_account_detail",
	capital_account_edit_info: "/bmd_accounting/balance/update_info",
	capital_bl_account_edit_info: "/bmd_gj_accounting/balance/update_info",


	//车险产品管理 产品编号
	product_gen_code: '/manage/product/gen_code',
	//车险产品管理  产品新增
	product_add: '/manage/product/add',
	//产品列表
	cx_product_list: '/manage/product/list',
	//产品详情
	cx_product_detail: "/manage/product/detail",
	//产品编辑
	cx_product_update: "/manage/product/update",
	//产品状态改变
	cx_product_status: "/manage/product/transfer_status",
	//操作记录
	history_list: "/manage/product/history_list",

	// 客户管理  企业客户列表
	customer_company_list: '/manage/customer_business/list',
	// 客户管理  企业客户添加
	customer_company_insert: '/manage/customer_business/add',
	// 客户管理  修改企业客户
	customer_company_edit: '/manage/customer_business/update',
	// 客户管理  查看企业客户
	customer_company_show: '/manage/customer_business/detail',
	// 客户管理  修改企业客户状态
	customer_company_edit_status: '/manage/customer_business/transfer_status',
	// 客户管理  个人客户列表
	customer_person_list: '/manage/customer_person/list',
	// 客户管理  个人客户详情
	customer_person_show: '/manage/customer_person/detail',
	// 客户管理  修改个人客户状态
	customer_person_edit_status: '/manage/customer_person/transfer_status',
	// 车险分期文件上传
	upload_file_cxfq: '/api/storage/manage_upload',
	// 获取所有银行
	get_all_banks: '/manage/bank_list',
	// 白猫贷自有业务
	customer_bmd_list: "/manage/customer/get_list",
	customer_bmd_detail: "/manage/customer/get_detail",
	//信用贷离线
	xyd_offline_list: "/manage/loaner/list",
	xyd_offline_detail: "/manage/loaner/detail",
	xyd_offline_img: "/manage/storage/get",
	xyd_offline_cop_info: "/manage/dropdown/cop_info",


	// 月报结构表
	monthly_structure: '/month_report/city/get',
	// 利率分析
	rate_structure: 'rate/detail_json',
	// 放贷情况表
	report_info: "report_customer_info/customer_info",

	//车险分期商户管理
	//商户列表
	merchant_list: '/manage/merchant/list',
	//改变商户状态
	transfer_status: "/manage/merchant/transfer_status",
	//获取产品列表
	sh_product_list: '/manage/valid_product_list',
	//渠道列表
	qudao_list: '/manage/qudao_list',
	//商户图片上传
	manage_upload: 'api/storage/manage_upload',
	//银行列表
	bank_list: '/manage/bank_list',
	//关联企业列表
	customer_business: "/manage/customer_business/list",
	//商户新增
	merchant_add: "/manage/merchant/add",
	//商户详情
	merchant_detail: "/manage/merchant/detail",
	//商户编辑
	merchant_ipdate: "/manage/merchant/update",
	//图片展示
	merchant_image: "api/storage/get",
	//商户编辑
	merchant_edit: "/manage/merchant/update",
	//协议模板
	merchant_tem: "/manage/protocol_template/list",
	//放款账户停用
	merchant_pay_setting: "/manage/pay_setting/transfer_status",
	//获取保险公司列表
	merchant_insur_company_list: "/manage/insur_company/list",
	//新增操作员
	merchant_user_add: "/manage/merchant_user/add",
	//重置操作员密码
	reset_pwd: "/manage/merchant_user/reset_password",
	//启用/停用操作员
	merchant_user_status: "/manage/merchant_user/transfer_status",
	//商户操作记录
	merchant_history: "/manage/merchant/history_list",
	//判断商户产品是否在使用中
	prodoct_use: "/manage/product/is_using",

	//保单管理
	//保险公司列表
	company_list: "/manage/all_insur_company_list",
	//产品列表
	product_list: "/manage/valid_product_list",
	//商户列表
	get_merchant_list: "/manage/merchant/list?page=1&page_size=1000",
	//保单列表
	bd_list: "/manage/bd_list",
	//发起退保
	bd_return_begin: "/manage/bd/pre_return",
	//取消退保
	bd_return_cancel: "/manage/bd/pre_return/cancel",
	//导出
	bd_export: "/manage/bd_export",
	//爬取
	bd_crawl: "/manage/bd_crawl",
	//查看详情
	bd_detail: "/manage/bd_detail",
	//投保单列表
	tbd_list: "/manage/tbd_list",
	//补填投保单详情
	patch_bd_prepare: "/manage/patch_bd/prepare",
	//补填投保单
	patch_bd: "/manage/patch_bd",
	//退保
	bd_return: "/manage/bd/return",
	//批单
	bd_endorsement: "/manage/bd/endorsement",
	//退保状态查询
	bd_return_get: "/manage/bd/return/get",
	//批单状态查询
	bd_endorsement_get: "/manage/bd/endorsement/get",
	//保单修改记录
	bd_modify_history: "/manage/bd/modify_history",
	//花生保单列表
	bd_list_hs: "insurance/list",
	//花生保单详情
	bd_detail_hs: "insurance/detail",
	//花生保单爬虫详情
	bd_crawler_detail_hs: "insurance/crawler_detail",
	//智尊保投保单列表
	tbd_list_hs: "insurance_application/list",
	//保单产品
	bd_product_list: "filter/insurance/product",
	//保单客户
	bd_customer_list: "filter/insurance/customer",
	//保单保险公司
	bd_company_list: "filter/insurance/company",
	//花生保单爬虫
	bd_retry_crawler: "insurance/retry_crawler",

	//员工贷审核列表
	ygd_list: "manage/order/ygd/gets",
	//员工贷初审列表
	ygd_list_approve0: "manage/order/ygd/get_approve0_list",
	ygd_detail_approve0: "manage/order/ygd/get_approve0_detail",
	//员工贷复审列表
	ygd_list_approve1: "manage/order/ygd/get_approve1_list",
	ygd_detail_approve1: "manage/order/ygd/get_approve1_detail",
	//员工贷详情
	ygd_detail: "manage/order/ygd/get",
	//员工贷初审通过
	ygd_approve0: "manage/order/ygd/approve0",
	//员工贷复审通过
	ygd_approve1: "manage/order/ygd/approve1",
	//员工贷初审驳回
	ygd_deny0: "manage/order/ygd/reject0",
	//员工贷复审驳回
	ygd_deny1: "manage/order/ygd/reject1",
	//员工贷审核流程
	ygd_status_log: "manage/order/ygd/gets_status_log",
	//员工贷支付管理
	get_wait_pay_list: "manage/order/ygd/get_wait_pay_list",
	get_wait_pay_detail: "manage/order/ygd/get_wait_pay_detail",

	//员工贷放款成功
	get_pay_success_detail_ygd: "manage/order/ygd/get_pay_success_detail",
	get_pay_success_list_ygd: "manage/order/ygd/get_pay_success_list",

	//大额分期放款成功
	defq_pay_success_list: "manage/order/defq/get_pay_success_list",
	defq_pay_success_detail: "manage/order/defq/get_pay_success_detail",

	//经营贷审核列表
	jyd_list: "manage/order/jyd/gets",
	//经营贷初审列表
	jyd_list_approve0: "manage/order/jyd/get_approve0_list",
	jyd_detail_approve0: "manage/order/jyd/get_approve0_detail",
	//经营贷复审列表
	jyd_list_approve1: "manage/order/jyd/get_approve1_list",
	jyd_detail_approve1: "manage/order/jyd/get_approve1_detail",
	//经营贷详情
	jyd_detail: "manage/order/jyd/get",
	//经营贷初审通过
	jyd_approve0: "manage/order/jyd/approve0",
	//经营贷复审通过
	jyd_approve1: "manage/order/jyd/approve1",
	//经营贷初审驳回
	jyd_deny0: "manage/order/jyd/reject0",
	//经营贷复审驳回
	jyd_deny1: "manage/order/jyd/reject1",
	//经营贷审核流程
	jyd_status_log: "manage/order/jyd/gets_status_log",
	//经营贷支付管理
	get_wait_pay_list_jyd: "manage/order/jyd/get_wait_pay_list",
	get_wait_pay_detail_jyd: "manage/order/jyd/get_wait_pay_detail",
	//经营贷放款成功
	get_pay_success_list_jyd: "manage/order/jyd/get_pay_success_list",
	get_pay_success_detail_jyd: "manage/order/jyd/get_pay_success_detail",

	//供应链审核列表
	gyl_list: "manage/order/gyl/gets",
	//供应链初审列表
	gyl_list_approve0: "manage/order/gyl/get_approve0_list",
	gyl_detail_approve0: "manage/order/gyl/get_approve0_detail",
	//供应链复审列表
	gyl_detail_approve1: "manage/order/gyl/get_approve1_detail",
	//供应链详情
	gyl_detail: "manage/order/gyl/get",
	//供应链初审通过
	gyl_approve0: "manage/order/gyl/approve0",
	//供应链初审驳回
	gyl_deny0: "manage/order/gyl/reject0",
	//供应链审核流程
	gyl_status_log: "manage/order/gyl/gets_status_log",
	//供应链支付管理
	get_wait_pay_list_gyl: "manage/order/gyl/get_wait_pay_list",
	get_wait_pay_detail_gyl: "manage/order/gyl/get_wait_pay_detail",
	//供应链放款成功
	get_pay_success_list_gyl: "manage/order/gyl/submit_success_list",
	// get_pay_success_list_gyl:"manage/order/gyl/get_pay_success_list",
	get_pay_success_detail_gyl: "manage/order/gyl/get_pay_success_detail",

	//员工贷
	//客户列表
	custom_list: "manage/company/gets",
	//客户详情
	custom_detail: "manage/company/get",
	//客户图片上传
	custom_update: "manage/storage/company/upload",
	//客户创建
	custom_create: "manage/company/create",
	//客户删除
	custom_del: "manage/company/delete",
	//客户更新
	custom_update_detail: "manage/company/update",

	//产品列表
	product_list_ygd: "manage/product/gets",
	//创建产品
	product_create: "manage/product/create",
	//产品详情
	product_detail: "manage/product/get_by_product_Id",
	//产品更新
	product_update: "manage/product/update",
	// 获取所有银行
	dropdown_list: 'manage/util/dropdown_list',
	//员工贷图片查看
	ygd_img_get: "manage/storage/ygd/get",
	gyl_img_get: "manage/storage/gyl/get",

	// 获取账号权限
	auth_permission: "/auth/get_app_list",
	//车险产品还款方式
	cxfq_repay_type: "manage/real_repay_type/list",

	// 数据统计
	// 借贷统计列表
	statistics_loan_list: "api/statistics/loan_repay_stats_detail",
	// 借贷统计
	statistics_loan_total: "api/statistics/loan_repay_stats_sum",
	// 借贷统计导出
	statistics_loan_list_export: "api/statistics/export_loan_repay_stats",
	// 统计下拉列表
	statistics_select: "api/form/select/loan_repay_stats",
	// 逾期统计列表
	statistics_overdue_list: "api/statistics/overdue_stats_detail",
	// 逾期统计
	statistics_overdue_total: "api/statistics/overdue_stats_sum",
	// 逾期统计导出
	statistics_overdue_export: "api/statistics/export_overdue_stats_detail",
	// 动态逾期统计率
	statistics_overdue_dynamic: "/api/overdue/dynamic",
	statistics_overdue_dynamic_export: "/api/export/dynamic_overdue",
	// 动态逾期统计率明细
	statistics_overdue_dynamic_detail: "/api/overdue/dynamic/detail",
	statistics_overdue_dynamic_detail_export: "/api/export/dynamic_overdue_detail",
	// vintage逾期率
	statistics_overdue_vintage: "/api/overdue/vintage",
	statistics_overdue_vintage_export: "/api/export/vintage_overdue",

	// 贷后管理
	// afterloan_overdue:"/manage/post_loan/get_list",
	afterloan_overdue: "/manage/contract/list",
	afterloan_overdue_total: "/manage/contract/listStats",
	afterloan_overdue_export: "/manage/export/pl_contract_info",
	afterloan_overdue_insert_collection: "/manage/reminder/create",
	afterloan_overdue_detail: "/manage/post_loan/get_detail",
	afterloan_overdue_reminder_list: "/manage/reminder/list",
	afterloan_overdue_deduction: "/manage/repay/apply",
	afterloan_overdue_repaylist: "/manage/repay/plRepayDetail/list",
	//减免
	afterloan_overdue_discount: "/manage/discount/apply",
	//审批列表
	afterloan_overdue_auditlist: "/manage/audit/list",
	afterloan_overdue_audit: "/manage/audit",
	// afterloan_borrower_detail:"/manage/borrower/contactList",
	//贷后联系人
	afterloan_borrower_detail: "/manage/borrower/contacts/list",
	afterloan_borrower_create: "/manage/borrower/contacts/create",
	afterloan_borrower_update: "/manage/borrower/contacts/update",
	afterloan_borrower_delete: "/manage/borrower/contacts/delete",
	//打电话接口
	afterloan_call_send: "/manage/call/send",
	afterloan_call_list: "/manage/call/list",
	afterloan_call_audio: "/manage/call/getAudioUrl",
	afterloan_call_detail: "/manage/call/detail",
	afterloan_call_hangUp: "/manage/call/hangUp",
	// 贷后管理
	// afterloan_overdue:"/manage/pl/contract/list",
	// afterloan_overdue_total:"/manage/pl/contract/listStats",
	// afterloan_overdue_export:"/manage/post_loan/export",
	// afterloan_overdue_insert_collection:"/manage/pl/reminder/create",
	// afterloan_overdue_detail:"/manage/post_loan/get_detail",
	// afterloan_overdue_reminder_list:"/manage/pl/reminder/list",
	// afterloan_overdue_deduction:"/manage/pl/repay/apply",
	// afterloan_overdue_repaylist:"/manage/repay/plRepayDetail/list",
	// //减免
	// afterloan_overdue_discount:"/manage/pl/discount/apply",
	// //审批列表
	// afterloan_overdue_auditlist:"/manage/pl/audit/list",
	// afterloan_overdue_audit:"/manage/pl/audit",
	// afterloan_borrower_detail:"/manage/borrower/contactList",

	//总体商户管理
	//商户审核列表
	merchant_audit_list: "/manage/audit/list",
	//处理审核数据
	merchant_audit_handle: "/manage/audit/handle",
	//审核历史
	merchant_audit_history: "/manage/audit/history",
	//图片查看
	manage_get: "/manage/storage/get",
	//商户列表
	merchant_total_list: "/manage/merchant/list",
	//合同列表
	merchant_contract_list: "/manage/contract/list",
	//图片上传
	merchant_img_upload: "/manage/storage/upload",
	//创建合同
	merchant_contract_create: "/manage/contract/create",
	//编辑合同
	merchant_contract_update: "/manage/contract/update",
	//图片类型查看
	merchant_img_list: "/manage/storage/list",
	//查看发票详情
	merchant_invoice: "/manage/merchant/invoice_info",
	//商户详情
	merchant_detail_uesr: "/manage/merchant/detail",

	// 会员订单管理
	vip_order_list: "/manage/vip_order/get_list",
	vip_order_detail: "/manage/vip_order/get_detail",
	vip_order_export: "/manage/vip_order/export",

	// 运营商报告
	carrier_report: "/api/app/identify/carrier_report",

	//付款订单列表
	trade_pay_list: "manage/ajax/trade/pay/list",
	//收款订单列表
	trade_repay_list: "manage/ajax/trade/repay/list",
	audit_pay_list: "/manage/ajax/api_req/pay/list",
	//支付管理 审核通过
	audit_pay_approve: "/manage/ajax/api_req/pay/begin_bk_pay",
	//支付管理 审核驳回
	audit_pay_reject: "/manage/ajax/api_req/pay/reject",
	//现金贷产品新增
	xjd_product: "/manage/product_config/create",
	//现金贷产品详情
	xjd_product_detail: "/manage/product_config/get_detail",
	//现金贷产品用户群详情
	xjd_product_detail_user: "/manage/product_config/get_product_user_group",
	//现金贷产品修改
	xjd_product_update: "/manage/product_config/update",
	//现金贷产品列表
	xjd_product_list: "/manage/product_config/get_list",
	//现金贷产品删除
	xjd_product_del: "/manage/test/delete_product",
	//现金贷额度获取
	xjd_product_loan_get: "/manage/loan_config/get",
	//现金贷额度设置
	xjd_product_loan_set: "/manage/loan_config/save",
	//现金贷产品启用
	xjd_product_enable: "/manage/product_config/enable",
	//现金贷产品停用
	xjd_product_disable: "/manage/product_config/disable",
	//现金贷产品新增产品选择
	xjd_product_select: "/manage/product_config/parent/get_list",
	//现金贷产品操作记录
	xjd_product_operating_record: "/manage/product_config/operating_record",

	//白猫贷减免详情
	bmd_repay_get_info: "/manage/repayment/get_discount_info",
	//根据天数减免
	bmd_repay_discount_days: "/manage/repayment/get_discount_fee_by_days",
	//减免提交
	bmd_repay_discount_confirm: "/manage/repayment/confirm_discount_info",

	//借贷管理-产品列表
	loan_manage_list: "manage/product/list",
	//借贷管理-产品停用/启用
	loan_manage_list_enable: "manage/product/enable",
	//借贷管理-产品新增
	loan_manage_add: "manage/product/create",
	// loan_manage_add:"manage/product/create",
	//借贷管理-产品编辑
	loan_manage_update: "manage/product/update",
	//借贷管理-产品详情
	loan_manage_detail: "manage/product/detail",
	//借贷管理-产品是否可编辑
	loan_manage_canEdit: "manage/product/canEdit",
	//子产品列表
	loan_manage_childList: "/manage/appLoanConfig/listByProductId",
	//商户管理实时
	//列表
	merchant_online_list: "/manage/api/merchant/get_merchant_list",
	//商户添加列表
	merchant_online_add_list: "/manage/api/merchant/get_open_merchant_list",
	//添加商户
	merchant_online_add_merchant: "/manage/api/merchant/add_merchant",
	//商户详情
	merchant_online_detail: "/manage/api/merchant/get_merchant",
	//商户关联项目列表
	merchant_online_bind_list: "/manage/api/merchant/get_merchant_bind_list",
	//关联项目list
	merchant_online_app_list: "/manage/api/merchant/get_app_list",
	//商户与项目关联
	merchant_online_app_add: "/manage/api/merchant/bind_loan_app_list",
	//商户与项目关联删除
	merchant_online_app_del: "/manage/api/merchant/unbind_loan_app",
	//项目同步历史数据
	merchant_online_sync_all_data: "/manage/api/merchant/sync_all_data",

	//权限管理
	//角色列表
	power_group_list: "/manage/api/group/list",
	//角色停用
	power_group_unable: "/manage/api/group/unable",
	//角色启用
	power_group_enable: "/manage/api/group/enable",
	//角色新增
	power_group_add: "/manage/api/group/add",
	//角色详情
	power_group_detail: "/manage/api/group/detail",
	//角色修改
	power_group_update: "/manage/api/group/update",
	//角色名唯一判断
	power_group_check: "/manage/api/group/check",
	//用户列表
	power_user_list: "/manage/api/auth_account/list",
	//用户详情
	power_user_detail: "/manage/api/auth_account/detail",
	//分配权限
	power_assign: "/manage/api/account_group/add",
	//分配权限批量
	power_assign_batch: "/manage/api/account_group/batch_add",
	//分配权限列表
	power_assign_list: "/manage/api/account_group/list",
	//获取域列表
	power_zone_list: "/manage/api/zone/list",
	//获取域权限列表
	power_permission_list: "/manage/api/zone/permission_list",
	//域权限赋权
	power_perm_update: "/manage/api/zone/perm_account_update",
	//获取用户域权限
	power_perm_detail: "/manage/api/zone/perm_account_list",

	//商户管理--资金业务
	//商户列表
	merchant_zj_list: "/manage/loanApp/list",
	//项目下拉
	merchant_zj_select_appkey: "/manage/loanApp/getAllLoanApp",
	//商户停用/启用
	merchant_zj_enable: "/manage/loanApp/enableOrDisable",
	//商户子产品新增
	merchant_zj_product_add: "/manage/appLoanConfig/add",
	//商户子产品列表
	merchant_zj_product_list: "/manage/appLoanConfig/listByApp",
	//商户子产品停用/启用
	merchant_zj_product_enable: "/manage/appLoanConfig/enableOrDisable",
	//获取产品名称列表
	merchant_zj_select_product: "/manage/product/getAllProduct",
	//商户子产品详情
	merchant_zj_product_detail: "/manage/appLoanConfig/detail",
	//商户主产品详情
	merchant_zj_product_detail_bycode: "/manage/product/detail",
	//商户子产品编辑
	merchant_zj_product_update: "/manage/appLoanConfig/update",
	//商户 业务信息
	merchant_zj_business_info: "/manage/app_loan_config/get_for_yy",
	merchant_zj_business_user: "/manage/app_user_credit_label/list_for_yy",
	merchant_zj_business_add: "/manage/app_loan_config/create_all_for_yy",
	//商户 白猫贷业务信息
	merchant_bmd_business_info: "/manage/util/rpTemplate/config/Detail",
	merchant_bmd_business_add: "/manage/product_config/create",
	merchant_bmd_business_detail: "/manage/product_config/get_detail",
	merchant_bmd_business_update: "/manage/product_config/update",
	//数据统计--放贷统计
	loan_census_list: "/manage/api/daily_loan_contract_stats/stat_gets",
	//配置接口
	app_config: "/manage/api/appstatconfig/all",
	//数据统计--还款统计
	repay_census_list: "/manage/api/daily_repay_date_repay_stats/stat_gets",
	//数据统计--申请统计
	repay_apply_list: "/manage/api/daily_apply_contract_stats/stat_gets",
	bussiness_list: "/manage/api/daily_business_stats/stat_gets",
	//数据统计--借贷统计

	//还款管理--员工贷--还款预览
	repay_ygd_estimate: "/manage/repay_req/repay_estimate",
	//还款管理--员工贷--还款
	repay_ygd_and_claim: "/manage/repay_req/repay_and_claim",
	//还款管理--导出列表
	repay_export_list: "/export/getList",
	//还款管理--下载
	repay_export_download: "/export/downLoad",
	//还款管理--导出
	repay_export_detail: "/export/repayDetail",
	//还款管理--导出--下拉
	repay_export_getAllLoanApp: "/manage/util/getLoanAppOptions",
	//还款管理--申请结清证明
	repay_contract_apply: "/manage/contract/applyClearSign",
	//还款管理--下载结清证明
	repay_contract_download: "/manage/contract/downLoadSign",

	//借贷详情相关接口
	repay_pay_detail: "/manage/contract/payDetail",
	repay_borrower_detail: "/manage/contract/borrowerDetail",
	repay_contract_list: "/manage/contract/repayList",
	repay_contract_type: "/manage/util/getRepayOptions",
	repay_borrower_info: "/manage/util/getBorrowerInfoOptions",
	//借款管理-自有资金
	jk_zyzj_list: "/manage/contract/loanContract_list",
	jk_zyzj_select: "/manage/util/getContractStatusOptions",
	//借贷管理-图片获取
	repay_get_url: "/manage/util/getStorageUrl",
	//自有资金 审核记录
	repay_zyzj_auditLog: "manage/cop_order_audit_info/log_list_for_yy",

	//项目管理 放款额度配置
	//获取额度
	project_limit_get: "/manage/appLoanLimitConfig/list",
	//编辑额度
	project_limit_edit: "/manage/appLoanLimitConfig/edit",

	//运营管理
	//融担业务
	//代收
	operation_rd_ds_list: "/manage/guarantee/get_rd_cost_list",
	operation_rd_ds_export: "/manage/guarantee/export_rd_cost",
	//代偿
	operation_rd_dc_list: "/manage/guarantee/get_dc_cost_list",
	operation_rd_dc_export: '/manage/guarantee/export_dc_cost',
	operation_rd_dc_status: "/manage/guarantee/update_dc_status",
	//通道费
	operation_rd_tdf_list: "/manage/guarantee/get_rd_channel_fee_list",
	operation_rd_tdf_export: "/manage/guarantee/export_channel_fee_cost",

	//资金管理-银行与三方对账结果
	capital_account_bank_list: "/bmd_accounting/inner_reconcile_info/list",
	//资金管理-银行与三方对账结果-备注
	capital_account_bank_comment: "/bmd_accounting/inner_reconcile_info/comment",
	//资金管理-银行与三方对账结果-人工确认
	capital_account_bank_manual_confirmation: "/bmd_accounting/inner_reconcile_info/manual_confirmation",
	//客户管理-经营贷业务
	// 列表
	customer_jyd_list: "/manage/company/list",
	//下拉
	customer_jyd_dropdown_scale: "/manage/dropdown/scale",
	customer_jyd_dropdown_industry_type: "/manage/dropdown/industry_type",
	customer_jyd_dropdown_industry_involved: "/manage/dropdown/industry_involved",
	//经营贷账号创建
	customer_jyd_account_create: "/manage/account/create",
	customer_jyd_company_create: "/manage/company/create",
	//客户管理-修改手机号
	custom_person_changePhone: "/manage/borrower/phoneChange/add",
	//修改手机号-文件上传
	custom_changePhone_upload: "/manage/util/uploadStorage",
	//修改手机号-文件查看
	custom_changePhone_getStorageUrl: "/manage/util/getStorageUrl",
	//修改手机号-详情
	custom_changePhone_detail: "/manage/borrower/phoneChange/detail",
	//修改手机号-审批
	custom_changePhone_approve: "/manage/borrower/phoneChange/audit",
	//运营管理-项目成本-列表
	operation_xmcb_list: "/manage/cost_record/get_cost",
	operation_xmcb_list_child: "/manage/cost_record/get_item",
	operation_xmcb_export_child: "/manage/cost_record/export_items",
	operation_xmcb_confirm_child: "/manage/cost_record/confirm",
	operation_xmcb_pay: "/manage/cost_record/pay",
	operation_xmcb_voucher: "/manage/cost_record/get_voucher_url",
	operation_xmcb_export_list: "/manage/cost_record/export_cost",
	operation_xmcb_select_subject: "/manage/dropdown/cost_record_subject",
	operation_xmcb_select_app_key: "/manage/dropdown/app_key",
	operation_xmcb_export_raw: "/manage/cost_record/export_raw",
	afterloan_call_CallIntentTag:"/manage/page_options/getCallRecordCallIntentTag",

}
module.exports = api;