import React, { Component } from 'react';
import { Modal, Table } from 'antd';

class DivideModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            source: []
        }
        props.bindshow(this.show.bind(this));
    }
    show(source) {
        this.setState({
            visible: true,
            source
        })
    }
    hide() {
        this.setState({ visible: false })
        setTimeout(() => {
            this.setState({ source: [] })
        }, 1000)
    }
    submit() {
        this.props.bindsubmit(this.state.source);
    }
    render() {
        const modalProps = {
            title: "确认分账",
            width: 900,
            visible: this.state.visible,
            onOk: this.submit.bind(this),
            onCancel: this.hide.bind(this)
        }
        const tableProps = {
            dataSource: this.state.source,
            columns: this.props.columns,
            pagination: false
        }
        console.log(modalProps)
        return <Modal {...modalProps}>
            <Table {...tableProps} bordered />
        </Modal>
    }
}
DivideModal.defaultProps = {
    bindshow: () => { },
    bindsubmit: () => { }
}
export default DivideModal;