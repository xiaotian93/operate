import React , { Component } from 'react';
export default function(RootComponent){
    return class ComponentRoute extends Component{
        render (){
            let props = this.props;
            let Children = props.children;
            if(Children){
                return props.children
            }else{
                return <RootComponent {...props} />
            }
        }
    }
}
