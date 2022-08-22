export default {
    filter:{
        time: {
            name: "还款日期",
            type: "range_date_notime",
            feild_s: "repay_start_date",
            feild_e: "repay_end_date",
            default: [moment().subtract(1, "days"), moment()],
            placeHolder: ['开始日期', "结束日期"]
        },
        borrower: {
            name: "借款方",
            type: "text",
            placeHolder: "请输入借款方"
        },
        "--": {
            name: "",
            type: "blank"
        },
        status: {
            name: "还款状态",
            type: "select",
            placeHolder: "全部",
            values: pay_status
        },
        domain_no: {
            name: "订单编号",
            type: "text",
            placeHolder: "请输入订单编号"
        }
    }
}