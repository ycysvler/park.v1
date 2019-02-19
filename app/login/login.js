/**
 * Created by yanggang on 2017/3/6.
 */
import React from 'react';
import {Layout, Input, Row, Col, Button, message} from 'antd';
import {UserActions, UserStore} from '../system/user/userapi.js';
import {HashRouter as Router, withRouter} from 'react-router-dom';

import './login.less';

export class Login extends React.Component {
    constructor(props) {
        super(props);
        this.unsubscribe = UserStore.listen(this.onStatusChange.bind(this));
        this.state = {"logined": false};
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    componentDidMount() {
        if (window.screen.width > 1920) {
            document.body.style.zoom = window.screen.width / 1920;
        }
    }

    onStatusChange = (action, data) => {
        if (action === 'login') {
            if (data.statusCode == 200)
                this.props.history.push('/main/home/alarm');
            else {

                message.warning(data.reason);
            }
        }
    }

    accountChange = (e) => {
        this.state.account = e.target.value;
    }
    passwordChange = (e) => {
        this.state.password = e.target.value;
    }

    login = () => {
        let account = this.state.account;
        let password = this.state.password;
        if (account && account === "") {
            alert("账号不能为空");
            return;
        }
        if (password && password === "") {
            alert("密码不能为空");
            return;
        }
        console.log('???');
        UserActions.login(account, password);
    }

    render = () => {

        return (

            <Layout className="main">
                <div className="header">
                    <div className="logo">
                        <img style={{width: 24, marginRight: 8}}
                             src="http://www.zsbdga.cn:8861/uploadfile/201803/png/20180323192040731350.png"/>
                        可视化指挥平台
                    </div>


                </div>
                <Layout className="contentlt" style={{background: '#F4F4F4', textAlign: 'center'}}>
                    <div>
                        <div className="form-item contentlt" style={{width: 650, height: 400, background: 'white'}}>
                            <div style={{width: 300}}>
                                <h2 style={{marginBottom: 40}}>用户登录</h2>
                                <Input size="large" onChange={this.accountChange} style={{marginBottom: 24}}
                                       name="account" placeholder="账户（邮箱或手机号）"/>
                                <Input size="large" onChange={this.passwordChange} style={{marginBottom: 24}}
                                       type="password" name="account"
                                       placeholder="密码"/>
                                <Button type="primary" className="login-button" style={{width: '100%', height: 40}}
                                        onClick={this.login}>登 录</Button>
                            </div>
                        </div>
                        <div style={{marginBottom: 24, marginTop: 24}}>版权所有：融聚世界网络科技有限公司</div>
                    </div>

                </Layout>
            </Layout>

        );
    }
}

