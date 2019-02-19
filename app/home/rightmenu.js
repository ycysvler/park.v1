/**
 * Created by yanggang on 2017/3/6.
 */
import React from 'react';
import {HashRouter as Router, Route, Link, Switch, Redirect} from 'react-router-dom';
import {Layout, Menu, Icon} from 'antd';

const {Header, Footer, Sider, Content} = Layout;
const SubMenu = Menu.SubMenu;

import {UserActions, UserStore} from './userapi.js';
import {NotFound} from '../../notfound';


export class UserList extends React.Component {
    constructor(props) {
        super(props);


        this.unsubscribe_user = UserStore.listen(this.onStatusChange.bind(this));
    }

    componentWillUnmount() {
        this.unsubscribe_user();
    }

    onStatusChange = (type, data) => {

    }

    componentDidMount() {
        if (!UserStore.current) {
            this.props.history.push('/login');
        }
    }


    handleClick = (e) => {
        this.setState({
            current: e.key,
        });
    }

    render() {
        return (<Layout className="main">
                <div className="header">
                    <div className="logo">六盘水市公安局中山分局可视化指挥平台</div>

                    <Menu
                        style={{flexGrow: 1}}
                        theme="dark"
                        mode="horizontal"
                    >
                        <Menu.Item key="mail">
                            <Link to='/wellcome'>首页</Link>
                        </Menu.Item>
                        <Menu.Item key="app">
                            <Link to='/main/home'>指挥调度</Link>

                        </Menu.Item>
                        <Menu.Item key="1">
                            人脸识别
                        </Menu.Item>
                        <Menu.Item key="2">
                            智能分析
                        </Menu.Item>
                        <Menu.Item key="3">
                            <Link to='/main/business'>业务支撑</Link>

                        </Menu.Item>
                        <Menu.Item key="4">
                            <Link to='/main/system'>系统管理</Link>

                        </Menu.Item>
                    </Menu>

                    <div className='user'>
                        <div><img style={{width: 30, marginRight: 8}}
                                  src={UserStore.current ? UserStore.current.headUrlImg : ''}/></div>
                        <div>
                            {UserStore.current ? UserStore.current.creator : ''}
                        </div>

                    </div>
                </div>
                <Layout>
                    <Layout>
                        <Router>
                            <Switch>
                                <Route strict path="/main/home" component={Home}/>
                                <Route path="/main/system" component={System}/>
                                <Route path="/main/business" component={Business}/>

                                <Route component={NotFound}/>
                            </Switch>
                        </Router>
                    </Layout>
                </Layout>
            </Layout>
        );
    }
}