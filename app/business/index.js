/**
 * Created by yanggang on 2017/3/6.
 */
import React from 'react';
import {HashRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom';
import { Layout,Menu, Icon } from 'antd';
import OrgList from './organization/list';
import UserList from './user/list';
import DeviceList from './device/list';

const { Header, Footer, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;

export class Business extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Layout>
                <Sider width={250} style={{"background":"#fff"}}>
                    <Menu>
                        {/*<Menu.Item key="mail">*/}
                            {/*<Icon type="fork" />组织管理*/}
                        {/*</Menu.Item>*/}
                        <Menu.Item key="orgs" >
                            <Link to="/main/business/orgs"> <Icon type="solution" />警所管理</Link>
                        </Menu.Item>

                        {/*<Menu.Item key="alipay">*/}
                            {/*<Icon type="idcard" />角色管理*/}
                        {/*</Menu.Item>*/}
                        <Menu.Item key="users">
                            <Link to="/main/business/users"> <Icon type="team" />人员管理</Link>
                        </Menu.Item>
                        {/*<Menu.Item key="alipay2">*/}
                            {/*<Icon type="user" />账户管理*/}
                        {/*</Menu.Item>*/}
                        {/*<Menu.Item key="alipay3">*/}
                            {/*<Icon type="schedule" />排班管理*/}
                        {/*</Menu.Item>*/}
                        <Menu.Item key="devices">
                            <Link to="/main/business/devices"> <Icon type="laptop" />终端管理</Link>
                        </Menu.Item>
                        {/*<Menu.Item key="alipay6">*/}
                            {/*<Icon type="calculator" />卡号管理*/}
                        {/*</Menu.Item>*/}
                        {/*<Menu.Item key="alipay7">*/}
                            {/*<Icon type="lock" />绑定管理*/}
                        {/*</Menu.Item>*/}
                        {/*<Menu.Item key="alipay8">*/}
                            {/*<Icon type="car" />车辆管理*/}
                        {/*</Menu.Item>*/}

                    </Menu>
                </Sider>
                <Layout style={{borderLeft:'solid 1px #e8e8e8'}}>
                    <Router>
                        <Switch>

                            <Route path="/main/business/orgs" component={OrgList}/>
                            <Route path="/main/business/users" component={UserList}/>
                            <Route path="/main/business/devices" component={DeviceList}/>

                        </Switch>
                    </Router>
                </Layout>
            </Layout>
        );
    }
}