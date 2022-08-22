import React, { Component } from 'react';
import ComponentRoute from '../../templates/ComponentRoute';
class List extends Component {
    componentWillMount() {

    }
    componentDidMount() {
        
    }
    render() {
        var data=this.props.btn;
        return (
            <div className="Component-body">
                {
                    data.map((i,k)=>{
                    return <span key={k} style={{marginRight:k===data.length-1?"0":"5px"}}>{i}</span>;
                    })
                }
            </div>
        )
    }
}

export default ComponentRoute(List);
