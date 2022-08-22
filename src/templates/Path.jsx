import React, { Component } from 'react';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router'

class Path extends Component{
    constructor(props) {
        super(props);
        this.state = {
            routes:props.routes,
            params:props.params,
            paths:[]
        };
    }
    componentDidMount(){
      
    }
    componentWillReceiveProps(props){
        this.setState({
            routes:props.routes,
            params:props.params
        })
    }
    itemRender(route, params, routes, paths) {
        const last = routes.indexOf(route) === routes.length - 1;
        return last ? <span key={route.path}>{route.breadcrumbName}</span> : <Link to={"/"+paths.join('/')} key={route.path}>{route.breadcrumbName}</Link>;
      }
    render (){
        // return <Breadcrumb className="path" itemRender={this.itemRender.bind(this)} routes={this.state.routes} ></Breadcrumb>
        const arr=[];
        return <Breadcrumb className="path">
            {
                this.props.routes.map((i,k)=>{
                    if(i.path!=="/"){
                        arr.push(i.path);
                    }
                    var search=i.search?JSON.parse(window.localStorage.getItem(i.search)):{};                    
                    return k===this.state.routes.length-1?<Breadcrumb.Item key={k}>{i.breadcrumbName}</Breadcrumb.Item>:<Breadcrumb.Item key={k}><Link to={{pathname:"/"+arr.join('/'),query:search}}>{i.breadcrumbName}</Link></Breadcrumb.Item>
                })
            }
        </Breadcrumb>
    }
}

export default Path;