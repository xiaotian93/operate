import React, { Component } from 'react';
import {Row,Table,Col,Form} from 'antd';
import {axios_sh} from '../../../ajax/request';
import {bank_list} from '../../../ajax/api';
class Basic extends Component{
    constructor(props) {
        super(props);
        props.onRef(this);
        this.state = {
            visible:false,
            bank:[],
            dataSource:[],
            id:props.id
        };
        this.count=1;
        this.dataSource=[]
    }
    componentWillMount(){
        this.getShNo();
        this.columns=[
            {
                title:"账户名",
                dataIndex:"name"
            },
            {
                title:"账户简称",
                dataIndex:"shortName"
            },
            {
                title:"账号",
                dataIndex:"bankCard"
            },
            {
                title:"省份",
                dataIndex:"province"
            },
            {
                title:"市",
                dataIndex:"city"
            },
            {
                title:"区/县",
                dataIndex:"area"
            },
            {
                title:"开户行",
                dataIndex:"headBank"
            },
            {
                title:"开户行支行",
                dataIndex:"bankName"
            }
        ];
        if(this.state.id){
            //setTimeout(()=>{
                this.editData()
            //},200)

        }
    }
    getShNo(){
        axios_sh.get(bank_list).then(e=>{
            if(!e.code){
                this.setState({
                    bank:e.data
                })
            }
        })
    }
    add(){
        this.setState({visible:true})
    }
    cancel(){
        this.setState({visible:false})
    }
    editData(){
        var data=JSON.parse(window.localStorage.getItem("detail"));
        var paySettings=data.paySettings;
        var payArr=[];
        for(var pa in paySettings){
            this.count++;
            paySettings[pa].key=this.count;
            payArr.push(paySettings[pa]);
        }
        this.dataSource=payArr;
        this.setState({dataSource:payArr})
    }
    render() {
        return (
            <Row className="sh_add" >
                <Row>
                    <Col span={4} style={{paddingRight:'20px',textAlign:'right',fontSize:'14px',color:"#7F8FA4",}}>放款账户:</Col>
                    <Col span={20}>
                        <Row>
                            <Col span={18}>
                                <Table columns={this.columns} dataSource={this.state.dataSource} bordered pagination={false} />
                            </Col>
                        </Row>
                    </Col>
                </Row>

            </Row>

        )

    }
}
export default Form.create()(Basic);