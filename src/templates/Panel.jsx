import React, { Component } from 'react';
import { Row } from 'antd';

class Panel extends Component{
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render (){
        return(
            <Row className="detail-content">
                { this.props.title?<div className="detail-title">{this.props.title}</div>:"" }
                <div className="detail-body">
                    { this.props.children }
                </div>
            </Row>
        )
    }
}

export default Panel;