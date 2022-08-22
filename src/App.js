import React, { Component, Suspense } from 'react';
import { Layout } from 'antd';
import './style/index.less';
import HeaderCustom from './components/HeaderCustom';
// import Login from './components/pages/Login'
import './ajax/authConfig';
import { axios_auth } from './ajax/request';
import { auth_permission } from './ajax/api';
import './keep.op';
import './revision.op';
import SideBottom from './components/SideBottom';

window.Number.prototype.money = function(num=2){
    let num_str = parseFloat(this/100).toFixed(num);
    let num_int = parseInt(num_str.split(".")[0],10).toLocaleString();
    return num_int + "." + num_str.split(".")[1];
}
window.String.prototype.money = function(num=2){
    let num_str = parseFloat(this/100).toFixed(num);
    let num_int = num_str.split(".")[0].toLocaleString();
    return num_int + "." + num_str.split(".")[1];
}

window.Number.prototype.remoney = function(){
    let money = parseFloat(this)*100;
    return parseInt(money.toFixed(0),10)||0;
}
window.String.prototype.remoney = function(){
    let money = parseFloat(this.replaceAll(",",""))*100;
    return parseInt(money.toFixed(0),10)||0;
}
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            min_height: window.innerHeight - 26,
        };
    }
    componentWillMount () {
        this.setState({
            min_height:window.innerHeight - 26
        })
        localStorage.setItem("select",JSON.stringify({}));
        window.onresize = () => {
            console.log('屏幕变化了');
            this.setState({
                min_height:window.innerHeight - 26
            })
        }
        axios_auth.get(auth_permission).then(data=>{
            localStorage.setItem("permissions",JSON.stringify(data.data)||"[]");
        })

    }
    render() {
        return (
            <Layout className="bmd">
                <HeaderCustom />
                <Layout className="ant-layout-has-sider" style={{minHeight:this.state.min_height+'px'}} >
                    <Suspense fallback={<div />}>
                    {this.props.children}
                    </Suspense>
                </Layout>
                <SideBottom />
            </Layout>
        );
    }
}


export default App;