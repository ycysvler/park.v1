/**
 * Created by yanggang on 2017/3/6.
 */
import React from 'react';
import $ from 'jquery';
import {HashRouter as Router, Route, Link, Switch, Redirect} from 'react-router-dom';
import {Layout, Button, Menu, Avatar, Modal, Row, Col, Input, Select, notification} from 'antd';
import {PoliceActions, PoliceStore} from './reflux';

const {Header, Footer, Sider, Content} = Layout;
const SubMenu = Menu.SubMenu;

import './index.less';

export default class CommandDialog extends React.Component {
    constructor(props) {
        super(props);

        this.unsubscribe = PoliceStore.listen(this.onStatusChange.bind(this));

        this.state = {visible: false, command: '', info: {}};

    }

    componentWillUnmount() {
        this.unsubscribe();
    }


    onStatusChange = (type, data) => {
        let self = this;
        if (type === 'showCommandDialog') {
            this.setState({visible: true, info: data});
        }
    }

    componentDidMount() {
    }

    handleCancel = (e) => {
        this.setState({visible: false});
    }

    handleChange = (value) => {
        this.setState({command: value});
    }
    commandChange = (e) => {
        this.setState({command: e.target.value});
    }

    sendCommand=(e)=>{
        PoliceActions.sendInstructions(this.state.info.id, this.state.command);

    }


    render() {
        return (
            <Modal title="指令"
                   visible={this.state.visible}
                   footer={null}
                   width={500}
                   onCancel={this.handleCancel}
            >
                <Layout className="main" style={{padding: 12}}>
                    <Row style={{padding: 4}}>

                        <Col span={6} style={{textAlign: 'right'}}>
                            <Avatar size="large"
                                    style={{marginRight: 8}}
                                    src="http://www.zsbdga.cn:8861/uploadfile/201803/png/20180323192040731350.png"/>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={17}>
                            <div>{this.state.info.name}</div>
                            <div>警号：{this.state.info.number}</div>
                        </Col>
                    </Row>
                    <Row style={{padding: 4}}>

                        <Col span={6} style={{textAlign: 'right'}}>
                            <span>预设指令：</span>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={17}>
                            <Select onChange={this.handleChange} defaultValue="" style={{width: 331}}>
                                <Select.Option value="收到请回复">收到请回复</Select.Option>
                                <Select.Option value="请马上到达案发地点">请马上到达案发地点</Select.Option>
                            </Select>
                        </Col>
                    </Row>
                    <Row style={{padding: 4}}>

                        <Col span={6} style={{textAlign: 'right'}}>
                            <span></span>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={17}>
                            <Input.TextArea
                                onChange={this.commandChange}
                                value={this.state.command}
                                placeholder="输入指令内容"
                                autosize={{minRows: 2, maxRows: 4}}
                            />
                        </Col>
                    </Row>
                    <Row style={{padding: 4}}>
                        <Col span={6} style={{textAlign: 'right'}}>
                            <span></span>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={17}>
                            <Button type="primary" onClick={this.sendCommand}>发送</Button>
                        </Col>
                    </Row>
                </Layout>

            </Modal>
        );
    }
}