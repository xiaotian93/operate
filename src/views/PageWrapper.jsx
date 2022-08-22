import React, { Suspense } from 'react';
import { Layout, Breadcrumb } from 'antd';
import { Link } from 'react-router'
import UIConfig from '../config/ui';
const { Content } = Layout;

const PageWrapper = (props) => {
    let breadPath = [];
    const style = { marginLeft: UIConfig.siderWidth + "px" };
    if (!props.ready) return <div style={{ ...style, justifyContent: "center", alignItems: "center", display: "flex", width: "100%" }}>加载中...</div>
    return (
        <Layout>
            <Content style={style}>
                <Breadcrumb className="path">
                    {props.routes.slice(0, -1).map((route, i) => {
                        breadPath.push(route.path);
                        return <Breadcrumb.Item key={i}><Link to={"/" + breadPath.join('/')}>{route.breadcrumbName}</Link></Breadcrumb.Item>
                    })}
                    {props.routes.slice(-1).map((route, i) => <Breadcrumb.Item key={i}>{route.breadcrumbName}</Breadcrumb.Item>)}
                </Breadcrumb>
                <Suspense fallback={<div />}>
                    {props.children}
                </Suspense>
            </Content>
        </Layout>
    )
}
PageWrapper.defaultProps = {
    ready: true
}
export default PageWrapper;