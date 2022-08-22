class Business {
    getCategory() {
        return [
            { name: "自有资金业务", val: "自有资金业务" },
            { name: "白猫贷业务", val: "白猫贷业务" },
            { name: "保理业务", val: "保理业务" },
            { name: "员工贷业务", val: "员工贷业务" },
            // { name: "经营贷业务", val: "经营贷业务" },
            // { name: "供应链业务", val: "供应链业务" }
        ]
    }

}

const businessConfig = new Business();
export default businessConfig;
