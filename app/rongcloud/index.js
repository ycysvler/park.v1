/**
 * Created by yanggang on 2017/3/6.
 */
import React from 'react';
import {HashRouter as Router, Route, Link, Switch, Redirect} from 'react-router-dom';
import {Layout, Input, Icon, Button, Card, Row, Col,notification} from 'antd';
import './index.less';
const {Header, Footer, Sider, Content} = Layout;
import {RongCloudActions, RongCloudStore} from './reflux.js';
export class RongCloudDemo extends React.Component {
    constructor(props) {
        super(props);
        this.unsubscribe = RongCloudStore.listen(this.onStatusChange.bind(this));
        this.state = {id:'2193', name:'2193',instance: null, targetId:'2192'};
    }

    componentWillUnmount() {
    }

    onStatusChange = (action, data) => {
        let self = this;
        if (action === 'token') {
            if(data.code == 200){
                self.state.token = data.token;
                self.onLogin();
            }
            else{

            }
        }
    }

    componentDidMount() {
        var appKey = "82hegw5u8yp1x";//"8w7jv4qb78a9y";
        var token = "ZThhLI1Xa1BX5EMREAdArWSH6ouuI8NT/fNmMkzF+4IOKIoFvbsi6JnH8QmnSltLkCcsK8vOgKl3IZgfbxFiWg==";
        var config = {
            protobuf: "//cdn.ronghub.com/protobuf-2.3.0.min.js"
        };
        RongIMLib.RongIMClient.init(appKey, null, config);
        var instance = RongIMClient.getInstance();

        this.state.instance = instance;
        this.state.token = token;

        // 连接状态监听器
        RongIMClient.setConnectionStatusListener({
            onChanged: function (status) {
                console.log('IMC Connection Status :',status);
                switch (status) {
                    case RongIMLib.ConnectionStatus.CONNECTED:
                        break;
                }
            }
        });
        RongIMClient.setOnReceiveMessageListener({
            // 接收到的消息
            onReceived: function (message) {
                // 判断消息类型
                console.log("新消息", message);

                notification.open({
                    message: '新消息',
                    description: JSON.stringify(message.content),// JSON.stringify( message),
                });
            }
        });
    }

    onNameChange = (e) => {
        const {value} = e.target;
        console.log(value);
    }

    onSendMessage = () => {
        var aaa = {
            content: "文字内容 hello user9!",
            extra: {}
        };


        aaa.content = this.state.content;
        aaa.extra = {'sender':32};



        var conversationtype = RongIMLib.ConversationType.PRIVATE; // 私聊
        var msg = new RongIMLib.TextMessage(aaa);
        var targetId = this.state.targetId;
        this.state.instance.sendMessage(conversationtype, targetId, msg, {
            onSuccess: function (message) {
                //document.getElementById("result").innerHTML += "<br>发送文字消息成功";
                console.log("发送文字消息成功");
                console.log(message);
            },
            onError: function (errorCode, message) {
                console.log("发送文字消息失败");
                console.log(errorCode);
            }
        });
    }

    onGetToken=()=>{
        RongCloudActions.token(this.state.id,this.state.name);
    }

    onLogin = ()=>{
        let token = this.state.token;
        console.log('token', token);
        //开始链接
        RongIMClient.connect(token, {
            onSuccess: function (userId) {
                //链接成功后 才可 发送消息
                console.log("链接成功，用户id：" + userId);

                notification.open({
                    message: '链接成功',
                    description: '用户id：'+ userId,
                });

                //document.getElementById("result").innerHTML += "链接成功，用户id：" + userId;
                //sendTextMessage();
            },
            onTokenIncorrect: function () {
                console.log('token无效');
                notification['error']({
                    message: 'token无效',
                    description: 'token无效',
                });

            },
            onError: function (errorCode) {
                console.log(errorCode);
                notification['error']({
                    message: '未知错误',
                    description: errorCode,
                });
            }
        });
    }

    render() {
        let self = this;
        return (<Layout className='rongcloud'>
                <Row>
                    <Card title="用户信息">
                        <Row>
                            <Col span={3}><span className="propName">用户ID：</span></Col>
                            <Col span={6}><Input onChange={(e)=>{self.setState({id:e.target.value})}} value={this.state.id} placeholder="user id"/></Col>
                            <Col span={3} offset={1} ><span className="propName">用户名：</span></Col>
                            <Col span={6}><Input onChange={(e)=>{self.setState({name:e.target.name})}} value={this.state.name} placeholder="user name"/></Col>


                            <Col span={3} offset={1} ><Button type="primary" onClick={this.onGetToken}>登录</Button></Col>
                        </Row>
                    </Card>
                </Row>
                <br />
                    <Row>
                        <Card title="发送文本消息">
                            <Row>
                                <Col span={3}><span className="propName">接收人ID：</span></Col>
                                <Col span={6}><Input onChange={(e)=>{self.setState({targetId:e.target.value})}} value={this.state.targetId} placeholder="接收人ID"/></Col>

                            </Row>
                            <br/>
                            <Row>
                                <Col span={3}><span className="propName">文本内容：</span></Col>
                                <Col span={12}><Input.TextArea rows={4} onChange={(e)=>{self.setState({content:e.target.value})}} value={this.state.content} placeholder="发送内容"/></Col>

                            </Row>
                            <br/>
                            <Row>
                                <Col span={3}></Col>
                                <Col span={3}><Button type="primary" onClick={this.onSendMessage}>发送消息</Button></Col>

                            </Row>
                        </Card>

                    </Row>
                <div></div>
            </Layout>
        );
    }
}