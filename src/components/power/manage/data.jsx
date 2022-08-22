var data = {
    db: [
        {
            gnmk: { title: "待办管理" },
            gncd: { title: "白猫贷评额", span: 2 },
            ywlb: { title: "机审评额", applicationKey: "bmd-cashloan" },
            gnqx: [{ label: "查看详情", value: 7, key: "credit_system_detail" }, { label: "查看页面", value: 7, key: "credit_system_list" }]
        },
        {
            gnmk: { title: "待办管理" },
            gncd: { title: "白猫贷评额" },
            ywlb: { title: "人工评额", applicationKey: "bmd-cashloan" },
            gnqx: [{ label: "查看详情", value: 8, key: "credit_manual_detail" }, { label: "查看页面", value: 7, key: "credit_manual_list" }, { label: "通过", value: 7, key: "credit_manual_approve" }, { label: "驳回", value: 7, key: "credit_manual_deny" }]
        },
        {
            gnmk: { title: "待办管理" },
            gncd: { title: "待初审", span: 4 },
            ywlb: { title: "员工贷业务", applicationKey: "bmd-yuangongdai" },
            gnqx: [{ label: "查看详情", key: "ygd_approve0_detail" }, { label: "查看页面", value: 3, key: "ygd_approve0_list" }, { label: "通过", value: 4, key: "ygd_approve0" }, { label: "驳回", value: 4, key: "ygd_reject0" }]
        },
        {
            gnmk: { title: "待办管理" },
            gncd: { title: "待初审" },
            ywlb: { title: "经营贷业务", applicationKey: "bmd-yuangongdai" },
            gnqx: [{ label: "查看详情", value: 8, key: "jyd_approve0_detail" }, { label: "查看页面", value: 3, key: "jyd_approve0_list" }, { label: "通过", value: 4, key: "jyd_approve0" }, { label: "驳回", value: 4, key: "jyd_reject0" }]
        },
        {
            gnmk: { title: "待办管理" },
            gncd: { title: "待初审" },
            ywlb: { title: "供应链业务", applicationKey: "bmd-gongyinglian" },
            gnqx: [{ label: "查看详情", key: "approve0_detail" }, { label: "查看页面", key: "approve0_list" }, { label: "通过", key: "approve0" }, { label: "驳回", key: "reject0" }]
        },
        {
            gnmk: { title: "待办管理" },
            gncd: { title: "待初审" },
            ywlb: { title: "白猫贷业务", applicationKey: "bmd-cashloan" },
            gnqx: [{ label: "查看详情", value: 8, key: "audit0_detail" }, { label: "查看页面", key: "audit0_list" }]
        },
        {
            gnmk: { title: "待办管理" },
            gncd: { title: "待复审", span: 4 },
            ywlb: { title: "员工贷业务", applicationKey: "bmd-yuangongdai" },
            gnqx: [{ label: "查看详情", value: 8, key: "ygd_approve1_detail" }, { label: "查看页面", value: 8, key: "ygd_approve1_list" }, { label: "通过", value: 3, key: "ygd_approve1" }, { label: "驳回", value: 4, key: "ygd_reject1" }]
        },
        {
            gnmk: { title: "待办管理" },
            gncd: { title: "待复审" },
            ywlb: { title: "经营贷业务", applicationKey: "bmd-yuangongdai" },
            gnqx: [{ label: "查看详情", value: 8, key: "jyd_approve1_detail" }, { label: "查看页面", value: 8, key: "jyd_approve1_list" }, { label: "通过", value: 3, key: "jyd_approve1" }, { label: "驳回", value: 4, key: "jyd_reject1" }]
        },
        {
            gnmk: { title: "待办管理" },
            gncd: { title: "待复审" },
            ywlb: { title: "供应链业务", applicationKey: "bmd-gongyinglian" },
            gnqx: [{ label: "查看详情", key: "approve1_detail" }, { label: "查看页面", key: "approve1_list" }, { label: "通过", key: "approve1" }, { label: "驳回", key: "reject1" }]
        },
        {
            gnmk: { title: "待办管理" },
            gncd: { title: "待复审" },
            ywlb: { title: "白猫贷业务", applicationKey: "bmd-cashloan" },
            gnqx: [{ label: "查看详情", value: 8, key: "audit1_detail" }, { label: "查看页面", value: 8, key: "audit1_list" }, { label: "通过", value: 3, key: "audit1_approve" }, { label: "驳回", value: 4, key: "audit1_deny" }]
        },
        // {
        //     gnmk: { title: "待办管理" },
        //     gncd: { title: "支付待审核", span: 1 },
        //     ywlb: { title: "", applicationKey: "bmd-pay-gateway" },
        //     gnqx: [{ label: "查看页面", value: 8, key: "api_trade_pay_list" }, { label: "通过/驳回", value: 8, key: "oper" }]
        // },
    ],
    zf: [
        {
            gnmk: { title: "支付管理" },
            gncd: { title: "待放款", span: 4 },
            ywlb: { title: "员工贷业务", applicationKey: "bmd-yuangongdai" },
            gnqx: [{ label: "查看详情", value: 8, key: "ygd_wait_pay_detail" }, { label: "查看页面", key: "ygd_wait_pay_list" }]
        },
        {
            gnmk: { title: "支付管理" },
            gncd: { title: "待放款" },
            ywlb: { title: "经营贷业务", applicationKey: "bmd-yuangongdai" },
            gnqx: [{ label: "查看详情", value: 8, key: "jyd_wait_pay_detail" }, { label: "查看页面", key: "jyd_wait_pay_list" }]
        },
        {
            gnmk: { title: "支付管理" },
            gncd: { title: "待放款" },
            ywlb: { title: "供应链业务", applicationKey: "bmd-gongyinglian" },
            gnqx: [{ label: "查看页面", key: "wait_pay_list" }]
        },
        {
            gnmk: { title: "支付管理" },
            gncd: { title: "待放款" },
            ywlb: { title: "白猫贷业务", applicationKey: "bmd-cashloan" },
            gnqx: [{ label: "查看详情", value: 8, key: "pay_detail" }, { label: "查看页面", value: 8, key: "pay_list" }]
        },
        // {
        //     gnmk: { title: "支付管理" },
        //     gncd: { title: "付款单查询", span: 1 },
        //     ywlb: { title: "", applicationKey: "bmd-pay-gateway" },
        //     gnqx: [{ label: "查看页面", value: 8, key: "trade_pay_list" }]
        // },
        // {
        //     gnmk: { title: "支付管理" },
        //     gncd: { title: "收款单查询", span: 1 },
        //     ywlb: { title: "", applicationKey: "bmd-pay-gateway" },
        //     gnqx: [{ label: "查看页面", value: 8, key: "trade_repay_list" }]
        // },
    ],
    jk: [
        {
            gnmk: { title: "借款管理" },
            gncd: { title: "借款查询", span: 8 },
            ywlb: { title: "员工贷业务", applicationKey: "bmd-yuangongdai" },
            gnqx: [{ label: "查看详情", value: 8, key: "ygd_pay_success_detail" }, { label: "查看页面", value: 8, key: "ygd_pay_success_list" }]
        },
        {
            gnmk: { title: "借款管理" },
            gncd: { title: "借款查询" },
            ywlb: { title: "经营贷业务", applicationKey: "bmd-yuangongdai" },
            gnqx: [{ label: "查看详情", value: 8, key: "jyd_pay_success_detail" }, { label: "查看页面", value: 8, key: "jyd_pay_success_list" }]
        },
        {
            gnmk: { title: "借款管理" },
            gncd: { title: "借款查询" },
            ywlb: { title: "供应链业务", applicationKey: "bmd-gongyinglian" },
            gnqx: [{ label: "查看详情", value: 8, key: "submit_success_detail" }, { label: "查看页面", key: "submit_success_list" }]
        },
        {
            gnmk: { title: "借款管理" },
            gncd: { title: "借款查询" },
            ywlb: { title: "大额消费分期业务", applicationKey: "bmd-yuangongdai" },
            gnqx: [{ label: "查看详情", value: 8, key: "defq_pay_success_detail" }, { label: "查看页面", value: 8, key: "defq_pay_success_list" }]
        },
        {
            gnmk: { title: "借款管理" },
            gncd: { title: "借款查询" },
            ywlb: { title: "白猫贷业务", applicationKey: "bmd-cashloan" },
            gnqx: [{ label: "查看详情", value: 8, key: "loan_detail" }, { label: "查看页面", key: "loan_list" }]
        },
        {
            gnmk: { title: "借款管理" },
            gncd: { title: "借款查询" },
            ywlb: { title: "自有资金业务/保理业务", applicationKey: "bmd-loanmanage-mgnt" },
            gnqx: [{ label: "查看页面", key: "loan_contract_list" }]
        },
    ],
    hk: [
        {
            gnmk: { title: "还款管理" },
            gncd: { title: "待还款查询", span: 4 },
            ywlb: { title: "智尊保业务", applicationKey: "bmd-loan-manage" },
            gnqx: [{ label: "查看详情", value: 8, key: "zzb_contract_detail" }, { label: "查看页面", value: 8, key: "zzb_under_repay_list" }, { label: "还款确认", value: 8, key: "zzb_repay" }, { label: "导出", value: 9, key: "zzb_under_repay_export" }]
        },
        {
            gnmk: { title: "还款管理" },
            gncd: { title: "待还款查询" },
            ywlb: { title: "经营贷业务", applicationKey: "bmd-loan-manage" },
            gnqx: [{ label: "查看详情", value: 8, key: "jyd_contract_detail" }, { label: "查看页面", value: 8, key: "jyd_under_repay_list" }, { label: "还款确认", value: 8, key: "jyd_repay" }, { label: "导出", value: 9, key: "jyd_under_repay_export" }]
        },
        {
            gnmk: { title: "还款管理" },
            gncd: { title: "待还款查询" },
            ywlb: { title: "信用贷实时业务", applicationKey: "bmd-loan-manage" },
            gnqx: [{ label: "查看详情", value: 8, key: "bmd_online_contract_detail" }, { label: "查看页面", value: 8, key: "bmd_online_under_repay_list" }, { label: "还款确认", value: 8, key: "bmd_online_repay" }, { label: "导出", value: 9, key: "bmd_online_under_repay_export" }]
        },
        {
            gnmk: { title: "还款管理" },
            gncd: { title: "待还款查询" },
            ywlb: { title: "小额贷业务", applicationKey: "bmd-loan-manage" },
            gnqx: [{ label: "查看详情", value: 8, key: "lsdk_contract_detail" }, { label: "查看页面", value: 8, key: "lsdk_under_repay_list" }, { label: "还款确认", value: 8, key: "lsdk_repay" }, { label: "导出", value: 9, key: "lsdk_under_repay_export" }]
        },

        {
            gnmk: { title: "还款管理" },
            gncd: { title: "还款计划", span: 8 },
            ywlb: { title: "智尊保业务", applicationKey: "bmd-loan-manage" },
            gnqx: [{ label: "查看页面", value: 8, key: "zzb_repay_plan_list" }, { label: "还款全部", value: 1, key: "zzb_repay_batch" }, { label: "导出", value: 2, key: "zzb_repay_plan_export" }]
        },
        {
            gnmk: { title: "还款管理" },
            gncd: { title: "还款计划" },
            ywlb: { title: "员工贷业务", applicationKey: "bmd-yuangongdai" },
            gnqx: [{ label: "还款", value: 358, key: "ygd_repay" }]
        },
        {
            gnmk: { title: "还款管理" },
            gncd: { title: "还款计划" },
            ywlb: { title: "经营贷业务", applicationKey: "bmd-yuangongdai" },
            gnqx: [{ label: "还款全部", value: 1, key: "jyd_repay" }]
        },
        {
            gnmk: { title: "还款管理" },
            gncd: { title: "还款计划" },
            ywlb: { title: "还款计划数据", applicationKey: "bmd-loanmanage-mgnt" },
            gnqx: [{ label: "查看详情（自有资金，白猫贷，保理，员工贷，供应链等业务）", value: 8, key: "contract_detail" }, { label: "查看页面（自有资金，白猫贷，保理，员工贷，供应链等业务）", value: 8, key: "repay_contract_list" }, { label: "申请结清证明（自有资金，白猫贷）", value: 8, key: "clear_sign_apply" }, { label: "减免申请（自有资金，白猫贷，保理，员工贷，供应链等业务）", value: 8, key: "discount_apply"}, { label: "还款申请（自有资金，白猫贷，保理）", value: 8, key: "repay_apply" }]
        },
        {
            gnmk: { title: "还款管理" },
            gncd: { title: "还款计划" },
            ywlb: { title: "信用贷离线业务", applicationKey: "bmd-loan-manage" },
            gnqx: [{ label: "查看页面", value: 8, key: "bmd_offline_repay_plan_list" }, { label: "还款全部", value: 1, key: "bmd_offline_repay_batch" }, { label: "导出", value: 2, key: "bmd_offline_repay_plan_export" }]
        },
        {
            gnmk: { title: "还款管理" },
            gncd: { title: "还款计划" },
            ywlb: { title: "供应链业务", applicationKey: "bmd-gongyinglian" },
            gnqx: [{ label: "进件详情", value: 8, key: "pay_success_detail" }]
        },

        {
            gnmk: { title: "还款管理" },
            gncd: { title: "还款计划" },
            ywlb: { title: "信用贷实时业务", applicationKey: "bmd-loan-manage" },
            gnqx: [{ label: "查看页面", value: 8, key: "bmd_online_repay_plan_list" }, { label: "还款全部", value: 1, key: "bmd_online_repay_batch" }, { label: "导出", value: 2, key: "bmd_online_repay_plan_export" }]
        },
        {
            gnmk: { title: "还款管理" },
            gncd: { title: "还款计划" },
            ywlb: { title: "小额贷业务", applicationKey: "bmd-loan-manage" },
            gnqx: [{ label: "查看页面", value: 8, key: "lsdk_repay_plan_list" }, { label: "还款全部", value: 1, key: "lsdk_repay_batch" }, { label: "导出", value: 2, key: "lsdk_repay_plan_export" }]
        },
        {
            gnmk: { title: "还款管理" },
            gncd: { title: "减免审批", span: 1 },
            ywlb: { title: "", applicationKey: "bmd-loanmanage-mgnt" },
            gnqx: [{ label: "查看详情", value: 8, key: "discount_detail" },{ label: "查看页面", value: 8, key: "discount_list" },{ label: "审批", value: 8, key: "discount_audit" },]
        },
        {
            gnmk: { title: "还款管理" },
            gncd: { title: "导出数据", span: 1 },
            ywlb: { title: "", applicationKey: "bmd-loanmanage-mgnt" },
            gnqx: [{ label: "导出", value: 8, key: "repay_detail_export" },]
        },
    ],
    zj: [
        {
            gnmk: { title: "资金管理", span: 6 },
            gncd: { title: "账户一览", span: 1 },
            ywlb: { title: "", applicationKey: "bmd-accounting-server" },
            gnqx: [{ label: "账户明细", value: 8, key: "balance_detail" }, { label: "查看页面", value: 8, key: "balance_list" }, { label: "编辑", value: 9, key: "balance_edit" }]
        },
        {
            gnmk: { title: "资金管理" },
            gncd: { title: "明细汇总", span: 1 },
            ywlb: { title: "", applicationKey: "bmd-accounting-server" },
            gnqx: [{ label: "查看详情", value: 8, key: "accounting_detail" }, { label: "查看页面", value: 8, key: "accounting_list" }, { label: "添加资金", value: 1, key: "accounting_add" }, { label: "导出", value: 4, key: "accounting_export" }]
        },
        {
            gnmk: { title: "资金管理" },
            gncd: { title: "业务分账", span: 1 },
            ywlb: { title: "", applicationKey: "bmd-accounting-server" },
            gnqx: [{ label: "查看页面", value: 8, key: "accounting_divide" },{ label: "确认分账", value: 8, key: "accounting_divide_operate" }]
        },
        {
            gnmk: { title: "资金管理" },
            gncd: { title: "对账明细", span: 1 },
            ywlb: { title: "", applicationKey: "bmd-accounting-server" },
            gnqx: [{ label: "查看页面", value: 8, key: "bill_list" }]
        },
        {
            gnmk: { title: "支付管理" },
            gncd: { title: "业务与第三方对账差异", span: 1 },
            ywlb: { title: "", applicationKey: "bmd-accounting-server" },
            gnqx: [{ label: "处理", value: 8, key: "lm_reconcile_process" },{ label: "查看页面", value: 8, key: "lm_reconcile" }]
        },
        {
            gnmk: { title: "支付管理" },
            gncd: { title: "三方与基本户对账明细", span: 1 },
            ywlb: { title: "", applicationKey: "bmd-accounting-server" },
            gnqx: [{ label: "查看页面", value: 8, key: "inner_reconcile" }]
        }
    ],
    cp: [
        {
            gnmk: { title: "产品管理", span: 2 },
            gncd: { title: "车险产品", span: 1 },
            ywlb: { title: "", applicationKey: "bmd-chexianfenqi" },
            gnqx: [{ label: "查看详情", value: 8, key: "product_detail" }, { label: "查看页面", value: 8, key: "product_list" }, { label: "新增", value: 9, key: "product_add" }, { label: "停用（启用）", value: 1, key: "product_transfer_status" }, { label: "编辑", value: 2, key: "product_update" }]
        },
        {
            gnmk: { title: "产品管理" },
            gncd: { title: "产品列表", span: 1 },
            ywlb: { title: "", applicationKey: "bmd-loanmanage-server" },
            gnqx: [{ label: "查看详情", value: 8, key: "product_detail" }, { label: "查看页面", value: 8, key: "product_list" }, { label: "停用（启用）", value: 1, key: "product_enable" }, { label: "编辑", value: 2, key: "product_edit" }]
        },
        {
            gnmk: { title: "产品管理" },
            gncd: { title: "项目管理", span: 2 },
            ywlb: { title: "", applicationKey: "bmd-loanmanage-server" },
            gnqx: [{ label: "默认", value: 8, key: "default" }, { label: "停用（启用）", value: 2, key: "app_status_update" },{label:"放款规模配置	",key:"loan_limit_edit"}]
        },
        {
            gnmk: { title: "产品管理" },
            gncd: { title: "项目管理" },
            ywlb: { title: "白猫贷业务", applicationKey: "bmd-cashloan" },
            gnqx: [{ label: "额度配置", value: 2, key: "loan_config_update" }, { label: "业务信息查看详情", value: 2, key: "product_detail" }, { label: "业务信息编辑", value: 2, key: "product_update" }, { label: "业务信息查看新增", value: 2, key: "product_create" }]
        }
    ],
    kh: [
        {
            gnmk: { title: "客户管理" },
            gncd: { title: "个人客户", span: 1 },
            ywlb: { title: "", applicationKey: "bmd-loanmanage-mgnt" },
            gnqx: [ { label: "查看页面", value: 8, key: "borrower_list" },{ label: "查看详情", value: 8, key: "borrower_detail" },{ label: "修改手机号", value: 8, key: "borrower_phone_change_apply" }]
        },
        {
            gnmk: { title: "客户管理" },
            gncd: { title: "企业客户", span: 1 },
            ywlb: { title: "", applicationKey: "bmd-loanmanage-mgnt" },
            gnqx: [{ label: "查看页面", value: 8, key: "borrower_list" }]
        },
        {
            gnmk: { title: "客户管理" },
            gncd: { title: "供应链业务", span: 1 },
            ywlb: { title: "", applicationKey: "bmd-gongyinglian" },
            gnqx: [{ label: "查看页面、导入客户、新增企业、编辑、删除", key: "default" }]
        },
        {
            gnmk: { title: "客户管理" },
            gncd: { title: "审批管理", span: 1 },
            ywlb: { title: "", applicationKey: "bmd-loanmanage-mgnt" },
            gnqx: [{ label: "查看页面", value: 8, key: "borrower_phone_change_list" },{ label: "查看详情", value: 8, key: "borrower_phone_change_detail" },{ label: "审批", value: 8, key: "borrower_phone_change_audit" }]
        },
    ],
    sh: [
        {
            gnmk: { title: "商户管理", span: 4 },
            gncd: { title: "商户审核", span: 1 },
            ywlb: { title: "", applicationKey: "bmd-open-merchant" },
            gnqx: [{ label: "查看页面", value: 8, key: "merchant_audit_list" }, { label: "审核", value: 9, key: "merchant_audit" }]
        },
        {
            gnmk: { title: "商户管理" },
            gncd: { title: "认证商户", span: 1 },
            ywlb: { title: "", applicationKey: "bmd-open-merchant" },
            gnqx: [{ label: "查看详情", value: 8, key: "merchant_detail" }, { label: "查看页面", value: 9, key: "merchant_list" }, { label: "添加合同", value: 8, key: "merchant_contract_add" }, { label: "导出合同", value: 8, key: "merchant_contract_export" }, { label: "查看合同", value: 8, key: "merchant_contract_detail" },]
        },
    ],
    dh: [
        {
            gnmk: { title: "贷后管理1", span: 3 },
            gncd: { title: "贷后管理", span: 1 },
            ywlb: { title: "", applicationKey: "bmd-postloan" },
            // gnqx:[{label:"减免",value:8,key:"pl_discount_add"},{label:"人工划扣",value:2,key:"pl_repay_add"},{label:"添加催记",value:1,key:"pl_reminder_add"}]
            gnqx: [{ label: "默认", value: 8, key: "default" }, { label: "编辑联系人", key: "contacts_edit" }, { label: "打电话", key: "call_send" }, { label: "通话记录", key: "call_list" },{ label: "联系人信息", key: "contacts_list" },{ label: "联系人电话脱敏", key: "contacts_phone_desensitise" },{label:"导出",key:"pl_contract_export"}]

        },
        {
            gnmk: { title: "贷后管理1" },
            gncd: { title: "审批管理", span: 1 },
            ywlb: { title: "", applicationKey: "bmd-postloan" },
            gnqx: [{ label: "审批", value: 8, key: "pl_audit" }]
        },
        {
            gnmk: { title: "贷后管理1" },
            gncd: { title: "外呼记录查询", span: 1 },
            ywlb: { title: "", applicationKey: "bmd-postloan" },
            gnqx: [{ label: "查看页面", value: 8, key: "call_list" }]
        }
    ],
    vip: [
        {
            gnmk: { title: "会员管理", span: 1 },
            gncd: { title: "白猫贷业务", span: 1 },
            ywlb: { title: "", applicationKey: "bmd-cashloan" },
            gnqx: [{ label: "查看详情", value: 8, key: "vip_detail" }, { label: "查看页面", value: 8, key: "vip_list" }, { label: "导出", value: 2, key: "vip_export" }]
        },
    ],
    yy:[
        {
            gnmk: { title: "运营管理", span: 1 },
            gncd: { title: "项目成本", span: 1 },
            ywlb: { title: "", applicationKey: "bmd-loancoop-capital" },
            gnqx: [{ label: "查看页面", value: 8, key: "manage_cost_record" }]
        },
    ],
    other: [
        {
            gnmk: { title: "其他权限", span: 5 },
            gncd: { title: "保分期业务", span: 1 },
            ywlb: { title: "花生业务，智尊保业务", applicationKey: "bmd-bfq-manager" },
            gnqx: [{ label: "默认", value: 8, key: "default" }]
        },
        {
            gnmk: { title: "其他权限" },
            gncd: { title: "房抵贷业务", span: 1 },
            ywlb: { title: "", applicationKey: "fangdidai" },
            gnqx: [{ label: "默认", value: 8, key: "default" }]
        },
        {
            gnmk: { title: "其他权限" },
            gncd: { title: "信用贷离线业务", span: 1 },
            ywlb: { title: "", applicationKey: "bmd-loancoop-offline" },
            gnqx: [{ label: "默认", value: 9, key: "default" }]
        },
        {
            gnmk: { title: "其他权限" },
            gncd: { title: "信用贷实时业务", span: 1 },
            ywlb: { title: "", applicationKey: "bmd-loancoop-online" },
            gnqx: [{ label: "导出", value: 9, key: "export" }, { label: "导出（非脱敏）", value: 9, key: "export_real" }]
        },
        {
            gnmk: { title: "其他权限" },
            gncd: { title: "供应链业务", span: 1 },
            ywlb: { title: "", applicationKey: "bmd-gongyinglian" },
            gnqx: [{ label: "默认", value: 9, key: "default" }]
        },

    ]
}
var permissions = JSON.parse(window.localStorage.getItem("permissions")) || [];
for (var p in data) {
    data[p].forEach(i => {
        permissions.forEach(j => {
            if (i.ywlb.applicationKey && j.applicationKey === i.ywlb.applicationKey) {
                var per = j.permissionList;
                var power = i.gnqx;
                per.forEach(k => {
                    power.forEach(m => {
                        // if(m.applicationId){
                        //     return;
                        // }
                        if (k.key === m.key) {
                            m.value = k.id;
                            m.applicationId = k.applicationId;
                        }
                    })
                })
            }
        })
    });
}
export default data;
