/**
 * Created by yanggang on 2017/3/6.
 */
import React from 'react';
import {HashRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom';
import { Layout,Menu, Icon ,Form} from 'antd';


import UserList from './user/list';
import OrgList from './organization/list';
import UserInfo from './user/info';

const { Header, Footer, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
export class System extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Layout>
                <Sider width={250} style={{"background":"#fff"}}>
                    <Menu

                    defaultSelectedKeys={['mail']}>
                        {/*<Menu.Item key="mail">*/}
                            {/*<Link to="/main/system/users"> <Icon type="team" />用户管理</Link>*/}
                        {/*</Menu.Item>*/}
                        {/*<Menu.Item key="app" >*/}
                            {/*<Link to="/main/system/orgs"> <Icon type="team" />警所管理</Link>*/}
                        {/*</Menu.Item>*/}
                        <Menu.Item key="alipay">
                            <Icon type="profile" />我的日志
                        </Menu.Item>
                        <Menu.Item key="alipay1">
                            <Icon type="profile" />其他日志
                        </Menu.Item>
                        <Menu.Item key="alipay2">
                            <Icon type="profile" />终端日志
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout style={{borderLeft:'solid 1px #e8e8e8'}}>
                    <Router>
                        <Switch>
                            <Route path="/main/system/users" component={UserList}/>
                            <Route path="/main/system/orgs" component={OrgList}/>
                            <Route path="/main/system/user/info" component={UserInfo}/>
                        </Switch>
                    </Router>
                </Layout>
            </Layout>
        );
    }
}