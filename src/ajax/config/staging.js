const domain = "heimaodai.com"
export default {
    origin:{
        default : `http://bd.bfq.${domain}/`,
        manage : `http://bfq.api.${domain}`,
        fdd : `http://fdd.api.${domain}/`,
        cxfq : `http://cxfq.api.${domain}/chexianfenqi/`,
        zj : `http://accounting.api.${domain}/`,
        repay : `http://lm.api.${domain}/`,
        pay : `http://pay.api.${domain}`,
        auth : `http://auth.${domain}`,
        monthly : `http://supervise-stat.api.${domain}/`,
        ygd : `http://ygd.api.${domain}/`,
        gyl : `http://gyl.api.${domain}/`,
        
        bd : `http://bdgl.api.${domain}/api/`,
        merchant : `http://merchant.api.${domain}`,
        xjd : `http://cashloan.api.${domain}`,
        xjdOffline : `http://loancoop-offline.api.${domain}`,
        risk : `http://rc-data.api.${domain}/`,
        total : `http://loanstats.api.${domain}`,
        xjdOnline : `http://loancoop.api.${domain}/`,
        payState : `http://pay-gateway.api.${domain}/`,
        loanmanage:`http://loanmanage.api.${domain}/`,
        zyzj:`http://loancoop-capital.api.${domain}`,
        bi:`http://bi-udata.api.${domain}`,
        loanmanageMgnt:`http://loanmanage-mgnt.api.${domain}/`,
        postloan:`http://postloan.api.${domain}/`,
        common:`http://common.srv.${domain}`

    }
}
