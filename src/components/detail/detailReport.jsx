import React, { Component } from 'react';

import { axios_risk } from '../../ajax/request';
// import { bmd } from '../../ajax/tool';
// import Panel from '../../templates/Panel';
// import TableLine from '../../templates/TableLine';
// import QAList from '../../templates/QAList';
// import FileShow from './components/fileShow';
import CarrierReport from './components/CarrierReport';

class BMDDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
      
        };
        this.reportUrl = decodeURIComponent(props.location.query.reportUrl);
    }

    componentDidMount(){
        this.getDetail(this.reportUrl);
        // this.getContractInfo(this.domainName,this.domainNo);
    }
    // 获取运营商数据
    getDetail(carrierReportUrl){
        console.log(carrierReportUrl)
        axios_risk.get(carrierReportUrl).then(res=>{
            console.log("row_data",JSON.parse(res.data.raw_data));
            console.log("report",JSON.parse(res.data.report));
            this.setState({
                report:res.data.report
            })
        });
    }

    render (){
        return(
            <div className="detail-contain ant-layout">
                <CarrierReport dataSource = {this.state.report} />
                {/* <Tabs defaultActiveKey="1" className="bmdTab">
                    <TabPane tab="运营商报告" key="4">
                        <CarrierReport dataSource = {this.state.report} />
                    </TabPane>
                </Tabs> */}
            </div>
        )
    }
}

export default BMDDetail;