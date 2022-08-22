import React, { Component } from 'react';
import { Modal } from 'antd';
import Form from '.';

class ModalForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            items: []
        }
        props.bindshow(this.show.bind(this));
    }
    tmpData = null
    show(items = [], data) {
        this.tmpData = data;
        this.setState({ visible: true, items: items });
    }
    confirm() {
        return new Promise((resolve, reject) => {
            let result = this.props.bindSubmit(this.getData(), this.tmpData);
            if (!result) resolve(null);
            result.then(data => {
                this.cancel();
                resolve(true)
            }).catch(e=>reject(e));
        })

    }
    cancel() {
        this.tmpData = null;
        this.setState({ visible: false });
        setTimeout(()=>this.setState({ visible: false,items:[] }));
    }
    render() {
        const modalProps = {
            visible: this.state.visible,
            title: this.props.title,
            maskClosable: false,
            onOk: this.confirm.bind(this),
            onCancel: this.cancel.bind(this)
        }
        return <Modal {...modalProps}>
            <Form items={this.state.items} bindget={get => this.getData = get} />
        </Modal>
    }
}
ModalForm.defaultProps = {
    bindshow: () => { },
    title: "",
    bindsubmit: () => { }
}
export default ModalForm;