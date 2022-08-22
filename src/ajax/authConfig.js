global.AUTHSERVER = {
    login: {
        key: "bmd-auth-server",
        access: {
            default: "default",
            test1: "test1",
            test2: "test2",
            operate_admin: "operate_admin"
        },
        role: {
            admin: "admin",
            test1: "test1",
            test2: "test2"
        }
    },
    bfq: {
        key: "bmd-bfq-manager",
        access: {
            default: "default"
        },
        role: {
            normalAuditor: "act_auditor",
            seniorAuditor: "act_senior_auditor",
            read: "audit_readonly",
            repayConfirm: "repayment_confirm",
            payConfirm: "pay_confirm",
            downPaymentConfirm: "pay_in_advance_confirm"
        }
    },
    bmd: {
        key: "bmd-pay-server",
        access: {
            default: "default",
            accountInsert: "accounting_add",
            payRead: "pay_readonly",
            payConfirm: "pay_verify"
        }
    },
    fdd: {
        key: "fangdidai",
        access: {
            default: "default"
        },
        role: {
            admin: "admin"
        }
    },
    cxfq: {
        key: "bmd-chexianfenqi",
        access: {
            default: "default",
            under_review_list: "under_review_list",
            under_review_detail: "under_review_detail",
            under_review_export: "under_review_export",
            audit0_list: "audit0_list",
            audit0_detail: "audit0_detail",
            audit0_export: "audit0_export",
            audit0_approve: "audit0_approve",
            audit0_deny: "audit0_deny",
            audit0_approve_batch: "audit0_approve_batch",
            audit0_deny_batch: "audit0_deny_batch",
            audit1_list: "audit1_list",
            audit1_detail: "audit1_detail",
            audit1_export: "audit1_export",
            audit1_approve: "audit1_approve",
            audit1_deny: "audit1_deny",
            audit1_approve_batch: "audit1_approve_batch",
            audit1_deny_batch: "audit1_deny_batch",
            audit2_list: "audit2_list",
            audit2_detail: "audit2_detail",
            audit2_export: "audit2_export",
            audit2_approve: "audit2_approve",
            audit2_deny: "audit2_deny",
            audit2_approve_batch: "audit2_approve_batch",
            audit2_deny_batch: "audit2_deny_batch",
            pay_list: "pay_list",
            pay_detail: "pay_detail",
            pay_request: "pay_request",
            loan_list: "loan_list",
            loan_detail: "loan_detail",
            bookkeeping_settle: "bookkeeping_settle",
            //资金管理-待确认请求
            bookkeeping_un_confirm_list: "bookkeeping_un_confirm_list",
            bookkeeping_un_confirm_detail: "bookkeeping_un_confirm_detail",
            bookkeeping_confirm: "bookkeeping_confirm",
            bookkeeping_al_confirm_list: "bookkeeping_al_confirm_list",
            //产品
            product_list: "product_list",
            product_detail: "product_detail",
            product_add: "product_add",
            product_update: "product_update",
            product_transfer_status: "product_transfer_status",
            //客户
            customer_business_list: "customer_business_list",
            customer_business_detail: "customer_business_detail",
            customer_business_add: "customer_business_add",
            customer_business_update: "customer_business_update",
            customer_business_transfer_status: "customer_business_transfer_status",
            customer_person_list: "customer_person_list",
            customer_person_detail: "customer_person_detail",
            customer_person_transfer_status: "customer_person_transfer_status",
            //商户
            merchant_list: "merchant_list",
            merchant_detail: "merchant_detail",
            merchant_add: "merchant_add",
            merchant_update: "merchant_update",
            merchant_transfer_status: "merchant_transfer_status",
            //保单
            bd_list: "bd_list",
            bd_detail: "bd_detail",
            bd_export: "bd_export",
            bd_crawl: "bd_crawl",
            bd_return: "bd_return",
            bd_endorsement: "bd_endorsement",
            tbd_list: "tbd_list",
            bd_patch: "bd_patch"
        },
        role: {
            admin: "admin",
            check: "audit0",
            review: "audit1",
            third: "audit2",
            config: "manage_setting",
            export: "export"
        }
    },
    ygd: {
        key: "bmd-yuangongdai",
        access: {
            default: "default",
            ygd_approve0_list: "ygd_approve0_list",
            ygd_approve0_detail: "ygd_approve0_detail",
            ygd_approve1_detail: "ygd_approve1_detail",
            ygd_approve1_list: "ygd_approve1_list",
            ygd_pay_success_detail: "ygd_pay_success_detail",
            ygd_pay_success_list: "ygd_pay_success_list",
            ygd_wait_pay_detail: "ygd_wait_pay_detail",
            ygd_wait_pay_list: "ygd_wait_pay_list",
            ygd_approve0: "ygd_approve0",
            ygd_approve1: "ygd_approve1",
            ygd_retreat0: "ygd_reject0",
            ygd_retreat1: "ygd_reject1",
            ygd_repay: "ygd_repay",
            op_audit: "op_audit",
            jyd_approve0_list: "jyd_approve0_list",
            jyd_approve0_detail: "jyd_approve0_detail",
            jyd_approve1_detail: "jyd_approve1_detail",
            jyd_approve1_list: "jyd_approve1_list",
            jyd_pay_success_detail: "jyd_pay_success_detail",
            jyd_pay_success_list: "jyd_pay_success_list",
            jyd_wait_pay_detail: "jyd_wait_pay_detail",
            jyd_wait_pay_list: "jyd_wait_pay_list",
            jyd_approve0: "jyd_approve0",
            jyd_approve1: "jyd_approve1",
            jyd_retreat0: "jyd_reject0",
            jyd_retreat1: "jyd_reject1",
            defq_pay_success_list: "defq_pay_success_list",
            defq_pay_success_detail: "defq_pay_success_detail",
            jyd_repay: "jyd_repay"
        },
        role: {
            admin: "admin"
        }
    },
    insurance: {
        key: "bmd-insurance-manage",
        access: {
            default: "default",
            hs_insurance_crawler: "hs_insurance_crawler",
            hs_insurance_detail: "hs_insurance_detail",
            hs_insurance_list: "hs_insurance_list",
            zzb_insurance_crawler: "zzb_insurance_crawler",
            zzb_insurance_detail: "zzb_insurance_detail",
            zzb_insurance_list: "zzb_insurance_list"
        }
    },
    //借贷管理（新）
    loan: {
        key: "bmd-loanmanage-server",
        access: {
            default: "default",
            repayConfirm: "repay_confirm",
            bmd_contract_detail: "bmd_contract_detail",
            bmd_contract_list: "bmd_contract_list",
            bmd_zf_contract_detail: "bmd_zf_contract_detail",
            bmd_zf_contract_list: "bmd_zf_contract_list",
            product_detail: "product_detail",
            product_edit: "product_edit",
            product_enable: "product_enable",
            product_list: "product_list",
            pl_audit: "pl_audit",
            pl_contract_add: "pl_contract_add",
            pl_discount_add: "pl_discount_add",
            pl_reminder_add: "pl_reminder_add",
            pl_repay_add: "pl_repay_add",
            repay_plan_export: "repay_plan_export",
            app_status_update: "app_status_update",
            loan_limit_edit: "loan_limit_edit"
        }
    },
    account: {
        key: "bmd-accounting-server",
        access: {
            update: "update_info",
            add: "accounting_add",
            divide: "accounting_divide",
            read: "accounting_read",
            admin: "bookkeeping_admin",
            default: "default",
            gj_oper: "gj_oper",
            accounting_detail: "accounting_detail",
            accounting_export: "accounting_export",
            accounting_list: "accounting_list",
            balance_detail: "balance_detail",
            balance_edit: "balance_edit",
            balance_list: "balance_list",
            bill_list: "bill_list",
            accounting_divide_operate: "accounting_divide_operate",
        }
    },
    statement: {
        key: "bmd-supervise-statistic",
        access: {
            default: "default"
        }
    },
    merchant: {
        key: "bmd-open-merchant",
        access: {
            default: "default",
            merchant_audit: "merchant_audit",
            merchant_audit_list: "merchant_audit_list",
            merchant_contract_add: "merchant_contract_add",
            merchant_contract_detail: "merchant_contract_detail",
            merchant_contract_export: "merchant_contract_export",
            merchant_detail: "merchant_detail",
            merchant_list: "merchant_list"
        }
    },
    bmdCashLoan: {
        key: "bmd-cashloan",
        access: {
            default: "default",
            creditAudit: "credit_manual_audit",
            orderAudit: "loan_manual_audit",
            sensitive: "sensitive",
            credit_system_list: "credit_system_list",
            credit_system_detail: "credit_system_detail",
            credit_manual_list: "credit_manual_list",
            credit_manual_detail: "credit_manual_detail",
            credit_manual_approve: "credit_manual_approve",
            credit_manual_deny: "credit_manual_deny",
            audit0_list: "audit0_list",
            audit0_detail: "audit0_detail",
            audit1_list: "audit1_list",
            audit1_detail: "audit1_detail",
            audit1_approve: "audit1_approve",
            audit1_deny: "audit1_deny",
            pay_list: "pay_list",
            pay_detail: "pay_detail",
            loan_list: "loan_list",
            loan_detail: "loan_detail",
            vip_list: "vip_list",
            vip_detail: "vip_detail",
            vip_export: "vip_export",
            customer_list: "customer_list",
            customer_detail: "customer_detail",
            product_list: "product_list",
            product_detail: "product_detail",
            product_transfer_status: "product_transfer_status",
            product_create: "product_create",
            product_update: "product_update",
            loan_config_update: "loan_config_update"
        },
        role: {
            admin: "admin"
        }
    },
    bmdOffline: {
        key: "bmd-loancoop-offline",
        access: {
            default: "default"
        },
        role: {
            admin: "admin",
            operate: "operate"
        }
    },
    loanStats: {
        key: "bmd-loan-stats",
        access: {
            default: "default",
            dynamic_overdue_detail_export: "dynamic_overdue_detail_export",
            dynamic_overdue_detail_list: "dynamic_overdue_detail_list",
            dynamic_overdue_export: "dynamic_overdue_export",
            dynamic_overude_list: "dynamic_overude_list",
            vintage_overdue_export: "vintage_overdue_export",
            vintage_overdue_list: "vintage_overdue_list"
        }
    },
    bmdOnline: {
        key: "bmd-loancoop-online",
        access: {
            default: "default",
            merchant_add: "merchant_add",
            merchant_detail: "merchant_detail",
            merchant_edit: "merchant_edit",
            merchant_list: "merchant_list",
            merchant_project_add: "merchant_project_add",
            merchant_project_delete: "merchant_project_delete",
            merchant_sync_all_dada: "merchant_sync_all_dada"
        },
        role: {
            admin: "admin",
        }
    },
    payGateway: {
        key: "bmd-pay-gateway",
        access: {
            default: "default",
            api_trade_pay_list: "api_trade_pay_list",
            trade_pay_list: "trade_pay_list",
            trade_repay_list: "trade_repay_list",
            oper: "oper"
        }
    },
    //借贷管理（老）
    loanmanage: {
        key: "bmd-loan-manage",
        access: {
            default: "default",
            admin: "admin",
            repay_confirm: "repay_confirm",
            bmd_offine_contract_detail: "bmd_offline_contract_detail",
            bmd_offine_repay: "bmd_offline_repay",
            bmd_offine_repay_batch: "bmd_offline_repay_batch",
            bmd_offine_repay_plan_export: "bmd_offline_repay_plan_export",
            bmd_offine_repay_plan_list: "bmd_offline_repay_plan_list",
            bmd_offine_under_repay_export: "bmd_offline_under_repay_export",
            bmd_offine_under_repay_list: "bmd_offline_under_repay_list",
            bmd_online_contract_detail: "bmd_online_contract_detail",
            bmd_online_repay: "bmd_online_repay",
            bmd_online_repay_batch: "bmd_online_repay_batch",
            bmd_online_repay_plan_export: "bmd_online_repay_plan_export",
            bmd_online_repay_plan_list: "bmd_online_repay_plan_list",
            bmd_online_under_repay_export: "bmd_online_under_repay_export",
            bmd_online_under_repay_list: "bmd_online_under_repay_list",
            cxfq_contract_detail: "cxfq_contract_detail",
            cxfq_repay: "cxfq_repay",
            cxfq_repay_batch: "cxfq_repay_batch",
            cxfq_repay_plan_export: "cxfq_repay_plan_export",
            cxfq_repay_plan_list: "cxfq_repay_plan_list",
            cxfq_under_repay_export: "cxfq_under_repay_export",
            cxfq_under_repay_list: "cxfq_under_repay_list",
            fdd_contract_detail: "fdd_contract_detail",
            fdd_repay: "fdd_repay",
            fdd_repay_batch: "fdd_repay_batch",
            fdd_repay_plan_export: "fdd_repay_plan_export",
            fdd_repay_plan_list: "fdd_repay_plan_list",
            fdd_under_repay_export: "fdd_under_repay_export",
            fdd_under_repay_list: "fdd_under_repay_list",
            hs_contract_detail: "hs_contract_detail",
            hs_repay: "hs_repay",
            hs_repay_batch: "hs_repay_batch",
            hs_repay_plan_export: "hs_repay_plan_export",
            hs_repay_plan_list: "hs_repay_plan_list",
            hs_under_repay_export: "hs_under_repay_export",
            hs_under_repay_list: "hs_under_repay_list",
            jyd_contract_detail: "jyd_contract_detail",
            jyd_repay: "jyd_repay",
            jyd_repay_batch: "jyd_repay_batch",
            jyd_repay_plan_export: "jyd_repay_plan_export",
            jyd_repay_plan_list: "jyd_repay_plan_list",
            jyd_under_repay_export: "jyd_under_repay_export",
            jyd_under_repay_list: "jyd_under_repay_list",
            loan_stats_export: "loan_stats_export",
            loan_stats_list: "loan_stats_list",
            lsdk_contract_detail: "lsdk_contract_detail",
            lsdk_repay: "lsdk_repay",
            lsdk_repay_batch: "lsdk_repay_batch",
            lsdk_repay_plan_export: "lsdk_repay_plan_export",
            lsdk_repay_plan_list: "lsdk_repay_plan_list",
            lsdk_under_repay_export: "lsdk_under_repay_export",
            lsdk_under_repay_list: "lsdk_under_repay_list",
            overdue_stats_export: "overdue_stats_export",
            overdue_stats_list: "overdue_stats_list",
            ygd_contract_detail: "ygd_contract_detail",
            ygd_repay: "ygd_repay",
            ygd_repay_batch: "ygd_repay_batch",
            ygd_repay_plan_export: "ygd_repay_plan_export",
            ygd_repay_plan_list: "ygd_repay_plan_list",
            ygd_under_repay_export: "ygd_under_repay_export",
            ygd_under_repay_list: "ygd_under_repay_list",
            zzb_contract_detail: "zzb_contract_detail",
            zzb_repay: "zzb_repay",
            zzb_repay_batch: "zzb_repay_batch",
            zzb_repay_plan_export: "zzb_repay_plan_export",
            zzb_repay_plan_list: "zzb_repay_plan_list",
            zzb_under_repay_export: "zzb_under_repay_export",
            zzb_under_repay_list: "zzb_under_repay_list"
        }
    },
    biUdata: {
        key: "bmd-bi-udata",
        access: {
            default: "default"
        }
    },
    gyl: {
        key: "bmd-gongyinglian",
        access: {
            default: "default",
            approve0_list: "approve0_list",  // 初审列表页
            approve1_list: "approve1_list",  // 复审列表页
            wait_pay_list: "wait_pay_list",  // 待放款列表页
            pay_success_list: "submit_success_list",  // 借款订单列表页
            approve0_detail: "approve0_detail",  // 初审详情页面
            approve1_detail: "approve1_detail",  // 复审详情页
            pay_success_detail: "submit_success_detail",  // 借款订单详情页
            approve0: "approve0",  // 初审审核通过权限
            approve1: "approve1",  // 复审审核通过权限
            reject0: "reject0",  // 初审审核拒绝权限
            reject1: "reject1",  // 复审审核拒绝权限
            gyl_repay: "gyl_repay",
            import: "company_import "
        }
    },
    //借贷管理后台
    mgnt: {
        key: "bmd-loanmanage-mgnt",
        access: {
            default: "default",
            repay_detail_export: "repay_detail_export",
            clear_sign_apply: "clear_sign_apply",
            loan_contract_list: "loan_contract_list",  //借款订单列表
            contract_detail: "contract_detail",  //详情
            discount_apply: "discount_apply",  //减免申请	
            discount_audit: "discount_audit",  //减免审核	
            discount_detail: "discount_detail",  //减免详情	
            repay_apply: "repay_apply",  //还款申请	
            discount_list: "discount_list",  //减免列表	
            borrower_phone_change_apply: "borrower_phone_change_apply",
            borrower_phone_change_audit: "borrower_phone_change_audit",
            borrower_phone_change_detail: "borrower_phone_change_detail",
            borrower_phone_change_list: "borrower_phone_change_list",
            borrower_list: "borrower_list",
            borrower_detail: "borrower_detail",
            repay_contract_list: "repay_contract_list",

        }
    },
    postloan: {
        key: "bmd-postloan",
        access: {
            default: "default",
            pl_audit: "pl_audit",
            contacts_list: "contacts_list",
            contacts_edit: "contacts_edit",
            call_send: "call_send",
            call_list: "call_list",
            call_download: "call_download",
            pl_contract_export: "pl_contract_export"
        }
    },
    capital: {
        key: "bmd-loancoop-capital",
        access: {
            manage_cost_record: "manage_cost_record"
        }
    }
}
