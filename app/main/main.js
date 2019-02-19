/**
 * Created by yanggang on 2017/3/6.
 */
import React from 'react';
import {HashRouter as Router, Route, Link, Switch, Redirect} from 'react-router-dom';
import {Map, Marker, NavigationControl, InfoWindow} from 'react-bmap';
import {UserActions, UserStore} from '../system/user/userapi.js';
import {SystemActions, SystemStore} from '../system/system/systemapi.js';
import {RongCloudActions, RongCloudStore} from '../rongcloud/reflux.js';
import {AlarmActions, AlarmStore} from '../alarm/reflux.js';
import moment from 'moment';
import {Layout, Badge, Dropdown, Button, Divider,notification, Menu, message,Modal, Avatar, Row, Col} from 'antd';
import AlarmNavInfo from '../alarm/nav/info';
import VideoDialog from '../blinkvideo/videodialog';
import {System} from '../system/index';
import {Business} from '../business/index';
import {Face} from '../face/index';
import {Home} from '../home/index';
import Video from '../blinkvideo/videodialog';
import CommandDialog from '../police/commandialog';
import {NotFound} from '../notfound';

import './main.less';

const {Header, Footer, Sider, Content} = Layout;

const SubMenu = Menu.SubMenu;

export class Main extends React.Component {

    constructor(props) {
        super(props);
        moment.locale('zh-cn');

        this.unsubscribe_user = UserStore.listen(this.onStatusChange.bind(this));
        this.unsubscribe_sys = SystemStore.listen(this.onStatusChange.bind(this));
        this.unsubscribe_alam = AlarmStore.listen(this.onStatusChange.bind(this));
        this.unsubscribe_rong = RongCloudStore.listen(this.onStatusChange.bind(this));

        this.state = {hasNewMsg:false,id:'4', name:'ccc',instance: null,messages:[],showvideo:false};

        notification.config({
            placement: 'bottomRight',
        });
    }

    componentWillUnmount() {
        this.unsubscribe_sys();
        this.unsubscribe_user();
        this.unsubscribe_alam();
        this.unsubscribe_rong();
    }

    onStatusChange = (type, data, callfrom) => {
        let self = this;

        if (type === 'goLogin') {
            message.info('登录信息已过期，请重新登录！');
            setTimeout(function () {
                self.props.history.push('/login');
            }, 1000);
        }

        if(type === 'alertInfo'){
            message.info(data);
        }
        if(type === 'alertSuccess'){
            message.success(data);
        }
        if(type === 'alertError'){
            message.error(data);
        }
        if(type === 'alertWarning'){
            message.warning(data);
        }

        if (type === 'token') {
            console.log('token > ', data.token);
            if(data.code == 200){
                self.state.token = data.token;
                self.rongCloudLogin();
            }
        }

        if(type === 'new'){
            // 一条新消息来了
            this.setState({hasNewMsg:true,messages:RongCloudStore.messages});

        }

        if(type === 'single' && callfrom === 'message'){
            this.setState({
                dialog_visibility:true,
                alarm:data
            });
        }
    }

    rongCloudLogin=()=>{
        let token = this.state.token;
        console.log('rongCloudLogin > ', token);
        //开始链接
        RongIMClient.connect(token, {
            onSuccess: function (userId) {
                //链接成功后 才可 发送消息
                console.log('融云 > ',"融云登录，用户id：" + userId);

                // notification.open({
                //     message: '融云登录',
                //     description: '用户id：'+ userId,
                // });
            },
            onTokenIncorrect: function () {
                console.log('融云 > ','token无效');
                notification['error']({
                    message: 'token无效',
                    description: 'token无效',
                });

            },
            onError: function (errorCode) {
                console.log('融云 > ',errorCode);
                notification['error']({
                    message: '未知错误',
                    description: errorCode,
                });
            }
        });

        var callback = {
            onSuccess: function(userId) {
                console.log("Reconnect successfully." + userId);
            },
            onTokenIncorrect: function() {
                console.log('token无效');
            },
            onError:function(errorCode){
                console.log(errorcode);
            }
        };
        var config = {
            // 默认 false, true 启用自动重连，启用则为必选参数
            auto: true,
            // 重试频率 [100, 1000, 3000, 6000, 10000, 18000] 单位为毫秒，可选
            url: 'cdn.ronghub.com/RongIMLib-2.2.6.min.js',
            // 网络嗅探地址 [http(s)://]cdn.ronghub.com/RongIMLib-2.2.6.min.js 可选
            rate: [100, 1000, 3000, 6000, 10000]
        };
        RongIMClient.reconnect(callback, config);
    }

    componentDidMount() {
        let self = this;
        var appKey = "82hegw5u8yp1x";
        var config = {
            protobuf: "//cdn.ronghub.com/protobuf-2.3.0.min.js"
        };
        RongIMLib.RongIMClient.init(appKey, null, config);
        var instance = RongIMClient.getInstance();

        this.state.instance = instance;

        // 连接状态监听器
        RongIMClient.setConnectionStatusListener({
            onChanged: function (status) {
                switch (status) {
                    case RongIMLib.ConnectionStatus.CONNECTED:
                        console.log('融云 > ','链接成功');
                        break;
                    case RongIMLib.ConnectionStatus.CONNECTING:
                        console.log('融云 > ','正在链接');
                        break;
                    case RongIMLib.ConnectionStatus.DISCONNECTED:
                        console.log('融云 > ','断开连接');
                        break;
                    case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
                        console.log('融云 > ','其他设备登录');
                        break;
                    case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
                        console.log('融云 > ','域名不正确');
                        break;
                    case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
                        console.log('融云 > ','网络不可用');
                        break;
                }
            }
        });
        RongIMClient.setOnReceiveMessageListener({
            // 接收到的消息
            onReceived: function (message) {
                let temp = JSON.parse( JSON.stringify(message));

                console.log('message', temp);

                let content = JSON.parse( JSON.stringify(message)).content;
                let msg = JSON.parse(content.content);
                msg.messageId = temp.messageId;

                // 不显示的消息就算了
                if(msg.msg_show === 1){
                    if(msg.msg_type ==='110001' ||
                        msg.msg_type ==='110102' ||
                        msg.msg_type ==='110103' ||
                        msg.msg_type ==='110201' ||
                        msg.msg_type ==='110401'
                    )
                    RongCloudActions.new(msg);
                }

                // 这是一条客户端发来的视频邀请
                if(msg.msg_type === '130501'){
                    const key = 'videoInvitation';
                    const btn = (
                        <div>
                            <Button type="primary"
                                    style={{marginRight:8}}
                                    onClick={() => {self.setState({showvideo:true,convId:msg.content.groupId, isCameraClose:false,videotitle:'视频'}); notification.close(key);}}>
                                同意
                            </Button>
                            <Button type="danger" onClick={() => notification.close(key)}>
                                拒绝
                            </Button>

                        </div>
                    );

                    notification.open({
                        message: msg.msg_title,
                        description: '',// JSON.stringify( message),
                        duration:15,
                        btn,
                        key,
                    });
                }
                // 这是一条客户端发来的语音邀请
                if(msg.msg_type === '130401'){
                    const key = 'audioInvitation';
                    const btn = (
                        <div>
                            <Button type="primary"
                                    style={{marginRight:8}}
                                    onClick={() => {self.setState({showvideo:true,isCameraClose:true,videotitle:'通话'}); notification.close(key);}}>
                                同意
                            </Button>
                            <Button type="danger" onClick={() => notification.close(key)}>
                                拒绝
                            </Button>

                        </div>
                    );

                    notification.open({
                        message: msg.msg_title,
                        description: '',// JSON.stringify( message),
                        duration:15,
                        btn,
                        key,
                    });
                }
                // 有人拒绝了你的通话 / 视频邀请
                if(msg.msg_type === '130402' || msg.msg_type === '130502'){
                    notification.open({
                        message: msg.msg_title,
                        description: '',// JSON.stringify( message),
                        duration:10
                    });
                }


            }
        });

        console.log('get token');
        RongCloudActions.token(this.state.id,this.state.name);
    }

    handleClick = (e) => {
        this.setState({
            current: e.key,
        });
    }

    removeMessageItem=(e)=>{
        console.log('msgid', e);
        console.log('data', e.item.props.data);

        let alarmId = e.item.props.data.msg_content.alarmId;
        let executeId = e.item.props.data.msg_content.executeId;
        AlarmActions.single(alarmId, executeId, 'message');

        RongCloudActions.remove(e.key);
    }

    getMessageItem=()=>{
        let self = this;
        let items = [];
        RongCloudStore.messages.forEach((item,index)=>{
            switch(item.msg_type){
                case "110001":
                    items.push(<Menu.Item data={item} key={index}><div style={{paddingLeft:12, margin:8, borderLeft: '4px solid #296FD2'}}>
                        <Row>
                            <Col span={12}><span style={{color:'#4A4A4A'}}>{item.msg_title}</span></Col>
                            <Col span={12} style={{color:'#9B9B9B', textAlign: "right", fontSize:'12px'}}><span>{item.msg_time}</span></Col>
                        </Row>
                        <Row>
                            <Col span={24}><span style={{color:'#9B9B9B', fontSize:'12px'}}>{item.msg_content.text}</span></Col>

                        </Row>
                    </div></Menu.Item>);
                    break;
                case "110102":
                    items.push(<Menu.Item data={item} key={index}><div style={{paddingLeft:12, margin:8, borderLeft: '4px solid #296FD2'}}>
                        <Row>
                            <Col span={12}><span style={{color:'#4A4A4A'}}>{item.msg_title}</span></Col>
                            <Col span={12} style={{color:'#9B9B9B', textAlign: "right", fontSize:'12px'}}><span>{item.msg_time}</span></Col>
                        </Row>
                        <Row>
                            <Col span={24}><span style={{color:'#9B9B9B', fontSize:'12px'}}>{item.msg_content.text}</span></Col>

                        </Row>
                    </div></Menu.Item>);
                    break;
                case "110103":
                    items.push(<Menu.Item data={item} key={index}><div style={{paddingLeft:12, margin:8, borderLeft: '4px solid #F04F69'}}>
                        <Row>
                            <Col span={12}><span style={{color:'#4A4A4A'}}>{item.msg_title}</span></Col>
                            <Col span={12} style={{color:'#9B9B9B', textAlign: "right", fontSize:'12px'}}><span>{item.msg_time}</span></Col>
                        </Row>
                        <Row>
                            <Col span={24}><span style={{color:'#9B9B9B', fontSize:'12px'}}>{item.msg_content.text}</span></Col>

                        </Row>
                    </div></Menu.Item>);
                    break;
                case "110201":
                    items.push(<Menu.Item data={item} key={index}><div style={{paddingLeft:12, margin:8, borderLeft: '4px solid #FFBB4C'}}>
                        <Row>
                            <Col span={12}><span style={{color:'#4A4A4A'}}>{item.msg_title}</span></Col>
                            <Col span={12} style={{color:'#9B9B9B', textAlign: "right", fontSize:'12px'}}><span>{item.msg_time}</span></Col>
                        </Row>
                        <Row>
                            <Col span={24}><span style={{color:'#9B9B9B', fontSize:'12px'}}>{item.msg_content.text}</span></Col>

                        </Row>
                    </div></Menu.Item>);
                    break;

                case "110401":
                    items.push(<Menu.Item data={item} key={index}><div style={{paddingLeft:12, margin:8, borderLeft: '4px solid #FFBB4C'}}>
                        <Row>
                            <Col span={12}><span style={{color:'#4A4A4A'}}>{item.msg_title}</span></Col>
                            <Col span={12} style={{color:'#9B9B9B', textAlign: "right", fontSize:'12px'}}><span>{item.msg_time}</span></Col>
                        </Row>
                        <Row>
                            <Col span={24}><span style={{color:'#9B9B9B', fontSize:'12px'}}>{item.msg_content.text}</span></Col>

                        </Row>
                    </div></Menu.Item>);
                    break;

                case "":
                    break;
            }

        });
        return <Menu onClick={this.removeMessageItem} style={{width: 400}}>{items}</Menu>;
    }

    dialogHide = (e) => {
        this.setState({dialog_visibility:false});
    }
    dialogShow = (e) => {
        this.setState({dialog_visibility:true});
    }

    onHideVideo=()=>{
        this.setState({showvideo: false});
    }

    render() {
        const menu = this.getMessageItem();

        return (<Layout className="main">
                <div className="header">
                    <div className="logo">
                        <Avatar style={{marginRight: 8}}
                                src="http://www.zsbdga.cn:8861/uploadfile/201803/png/20180323192040731350.png"/>

                        可视化指挥平台
                    </div>
                    <Menu
                        style={{flexGrow: 1}}
                        theme="dark"
                        mode="horizontal"
                    >
                        <Menu.Item key="app">
                            <Link to='/main/home'>指挥调度</Link>

                        </Menu.Item>
                        <Menu.Item key="1">
                            <Link to='/main/face'>人脸识别</Link>

                        </Menu.Item>
                        {/*<Menu.Item key="2">*/}
                            {/*警务信息*/}
                        {/*</Menu.Item>*/}
                        <Menu.Item key="3">
                            <Link to='/main/business'>资源管理</Link>
                        </Menu.Item>
                        <Menu.Item key="4">
                            <Link to='/main/system'>系统设置</Link>

                        </Menu.Item>
                    </Menu>

                    <div className='user'>
                        <div>
                            <Avatar style={{marginRight: 8}}
                                    src={"http://124.42.103.196/service/file/down?fileId=8"}/>

                        </div>
                        <div style={{marginRight: 16}}>
                            {sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')).employeeDto.name : '袁洋'}
                        </div>
                        <div className='bar'>
                            <Badge onClick={()=>{this.setState({hasNewMsg:false})}} dot={this.state.hasNewMsg}>
                                <Dropdown  overlay={menu} trigger={['click']}>
                                    <span style={{color: "#999", cursor:'pointer'}}>通知</span>
                                </Dropdown>
                            </Badge>
                            <Divider type="vertical"/>
                            <a href="javascript:open('/vsb/', '_self').close();" style={{color: "#999", cursor:'pointer'}} >退出</a>
                        </div>
                        <Modal width={388}
                               title="警情" footer={null}
                               visible={this.state.dialog_visibility}
                               onCancel={this.dialogHide}
                        >
                            <div className="alarmnav">
                                <AlarmNavInfo info={this.state.alarm}  hideback/>
                            </div>
                        </Modal>

                        {this.state.showvideo  ? <VideoDialog convId={this.state.convId} isCameraClose={this.state.isCameraClose} title={this.state.videotitle} hideVideo={this.onHideVideo} /> : null}
                        <CommandDialog />
                    </div>
                </div>
                <Layout>
                    <Router>
                        <Switch>
                            <Route strict path="/main/home" component={Home}/>
                            <Route path="/main/system" component={System}/>
                            <Route path="/main/business" component={Business}/>
                            <Route path="/main/video" component={Video}/>
                            <Route path="/main/face" component={Face}/>

                            <Route component={NotFound}/>
                        </Switch>
                    </Router>
                </Layout>
            </Layout>
        );
    }
}