import React, { Component } from 'react';
import { bmd } from '../ajax/tool';

class SideBottom extends Component {
    logout(){
        bmd.logout();
    }
    password(){
        bmd.password();
    }
    render() {
        if(window.location.pathname.split("/").length<=2){
            return <span />
        }else{
            return (
                <ul className="sideBottom">
                    <li onClick={this.password.bind(this)}>
                        <div>修改密码</div>  
                    </li>
                    <li onClick={this.logout.bind(this)}>
                        <div>退出登录</div>
                    </li>
                </ul>
            )
        }
}
}

export default SideBottom;