import React, { Component } from 'react';
import { Form ,Layout } from 'antd';
import SiderCustom from './SiderCustom';
import Path from '../../templates/Path';
const { Content } = Layout;

class BasicForms extends Component {
    render() {
        return (
        <Layout className="ant-layout-has-sider">
            <SiderCustom />
          <Layout>
            <Content style={{width:"calc(100% - 190px)",marginLeft:"190px"}}>
                <Path routes={this.props.routes} params={this.props.params} />
              {this.props.children}
            </Content>
          </Layout>
        </Layout>
        )
    }
}

const BasicForm = Form.create()(BasicForms);

export default BasicForm;