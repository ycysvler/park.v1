/**
 * Created by yanggang on 2017/3/6.
 */
import React from 'react';
import {HashRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom';
import { Layout,Menu, Icon } from 'antd';
import FaceList from './face/list';

const { Header, Footer, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;

export class Face extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Layout>
                <Sider width={250} style={{"background":"#fff"}}>
                    <Menu>

                        <Menu.Item key="alipay9">
                            <Link to="/main/face/faces"> <Icon type="laptop" />图像仓库</Link>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout style={{borderLeft:'solid 1px #e8e8e8'}}>
                    <Router>
                        <Switch>

                            <Route path="/main/face/faces" component={FaceList}/>

                        </Switch>
                    </Router>
                </Layout>
            </Layout>
        );
    }
}