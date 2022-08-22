import React , { Component } from 'react';
import { Row , Col , Radio } from 'antd';

const RadioGroup = Radio.Group;

class BaseInfo extends Component{
    constructor(props){
        super(props);
        this.state = {
            element:1,
            disable_more:false
        }
        props.main_bind(this)
    }
    componentWillMount(){
        
    }
    componentDidMount(){

    }
    onChange(e){
        this.setState({
            element:e.target.value
        })
        this.props.onChange(parseInt(e.target.value,10));
    }
    render(){
        return (
            <Row>
                <div className="sub-title">第一步:选择确认方式</div>
                <Col span={10} offset={2}>
                    <RadioGroup onChange={this.onChange.bind(this)} value={this.state.element}>
                        <Radio value={1}>单成份确认</Radio>
                        <Radio disabled={this.state.disable_more} value={2}>多成份确认</Radio>
                    </RadioGroup>
                </Col>
                <br /><br />
            </Row>
        );
    }
}

export default BaseInfo;