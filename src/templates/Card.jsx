// <Card title="title" flod="true">
import React, { Component } from 'react';
import { Row , Col , Icon } from 'antd';

class Card extends Component{
    constructor(props) {
        super(props);
        this.state = {
            upload_icon:true,
            visible:true
        };
    }
    componentWillMount(){
        
    }
    componentDidMount(){

    }
    fold_form(){
        this.setState({
            visible:!this.state.visible
        })
    }
    render (){
        let display = this.state.visible?"block":"none";
        let display_up = this.state.visible?"none":"block";
        let flod = (
            <div onClick={this.fold_form.bind(this)}>
                <Icon style={{display:display}} type="down" />
                <Icon style={{display:display_up}} type="up" />
            </div>
        )
        let title = (
            <Row>
                <Col span={24} className="card-title">
                    <div>{this.props.title}</div>
                    {this.props.flod?flod:""}
                </Col>
            </Row>
        )
        let className = this.props.className;
        return(
            <Row className={"card "+className}>
                {this.props.title?title:""}
                <Row className="card-content" style={{display:display}}>
                    <Col span={24}>
                        { this.props.children }
                    </Col>
                </Row>
            </Row>
        )
    }
}

export default Card;