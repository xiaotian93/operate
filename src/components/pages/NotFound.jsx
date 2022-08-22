/**
 * Created by hao.cheng on 2017/5/7.
 */
import React from 'react';
import img from '../../style/imgs/404.png';


class NotFound extends React.Component {
    constructor(props){
        super(props);
        this.state={
            animated: ''
        }
    }
    enter () {
        this.setState({animated: 'hinge'})
    };
    render() {
        return (
            <div className="notFound">
                <img src={img} alt="404" className={`animated swing ${this.state.animated}`} onMouseEnter={this.enter.bind(this)} />
            </div>
        )
    }
}

export default NotFound;