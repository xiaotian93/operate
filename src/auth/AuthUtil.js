export const hasPermission = (server, pms) => {
    let permissions = JSON.parse(localStorage.getItem("permissions")) || [];
    let permission = [];

    permissions.forEach(item => {
        if (item.applicationKey === server) {
            permission = item;
        }
    });
    // 判断是否拥有权限
    let perm = {};
    for (let p in permission.permissionList) {
        if (permission.permissionList[p].key === pms) {
            perm = permission.permissionList[p];
        }
    }
    console.log(perm);

    return perm.hasPermission;
}