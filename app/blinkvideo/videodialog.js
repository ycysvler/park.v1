/**
 * Created by yanggang on 2017/3/6.
 */
import React from 'react';
import $ from 'jquery';
import {HashRouter as Router, Route, Link, Switch, Redirect} from 'react-router-dom';
import {Layout, Menu, Modal, notification} from 'antd';
import {VideoActions, VideoStore} from './reflux';
import {UserActions, UserStore} from '../system/user/userapi.js';
const {Header, Footer, Sider, Content} = Layout;
const SubMenu = Menu.SubMenu;

import './index.less';

export default class Video extends React.Component {
    constructor(props) {
        super(props);

        this.unsubscribe = VideoStore.listen(this.onStatusChange.bind(this));

        this.state = {
            visible: true,
            videos: [],
            faces: {},
            blinkEngine: null
        };

    }

    componentWillUnmount() {
        clearInterval(this.interval);

        this.unsubscribe();
    }

    buildNotificationBody = (data) => {
        return <div className="notification">
            <img src={data.image} /><p>
            <div>姓 名：{data.criminal.name}</div>
            <div>曾用姓名：{data.criminal.cname}</div>
            <div>性 别：{data.criminal.sex}</div>
            <div>身 高：{data.criminal.height}</div>
            <div>出生日期：{data.criminal.birthday}</div>
            <div><a href={data.criminal.href} target="_blank">详情</a></div>

        </p>
        </div>;
    }

    onStatusChange = (type, data) => {
        let self = this;
        if (type === 'face') {
            console.log('face', data);

            if (!this.state.faces.hasOwnProperty(data.id)) {
                this.state.faces[data.id] = data;

                notification.config({
                    duration: 12,
                });

                notification.open({
                    message: '全国一级通缉犯',
                    description: self.buildNotificationBody(data),
                });
            }
        }
    }

    /**
     * 请求token
     *
     */
    getToken = (tokenUrl, uid, appid, callback) => {
        $.ajax({
            url: tokenUrl,
            type: "POST",
            data: 'uid=' + uid + '&appid=' + appid,
            async: true,
            success: function (data) {
                callback(data);
            },
            error: function (er) {
                swal("请求token失败!");
            }
        });
    }

    eaveConv = () => {
        this.state.blinkEngine.leaveChannel(this.state.convId);
    }

    search = () => {

        let canvas = this.refs.canvas;
        let context = canvas.getContext("2d");
        this.state.videos.forEach((item) => {
            let video = item.video;
            context.drawImage(video, 0, 0, 320, 240);
            var base64Img = canvas.toDataURL("image/png").replace(/^data:image\/(png|jpg);base64,/, "");

            VideoActions.face(base64Img);
        });
    }

    componentDidMount() {


        let self = this;
        let tokenUrl = global_config.TOKEN_URL;
        let wsNavUrl = global_config.WS_NAV_URL;

        let selfUserType = BlinkConstant.UserType.NORMAL;  // 用户模式类型 NORMAL：普通模式，OBSERVER：观察者模式
        let isCameraClose = true;                          // 是否关闭摄像头
        let convId = self.props.convId;                    // 会议室编号

        console.log('convId', convId);

        let selfUserId = UserStore.getUser().employeeDto.name; // 参会人名称
        let appId = '1234567890abcdefg';

        let blinkEngine;

        /**
         * 初始化BlinkEngine
         *
         */
        function initBlinkEngine() {
            var blinkEngine = new BlinkEngine(wsNavUrl);

            self.state.blinkEngine = blinkEngine;

            // 注册回调
            var blinkEngineEventHandle = new BlinkEngineEventHandle();
            // 加入完成
            blinkEngineEventHandle.on('onJoinComplete', function (data) {
                console.log('onJoinComplete', JSON.stringify(data));
                var isJoined = data.isJoined;
                if (isJoined) {
                    if (selfUserType == BlinkConstant.UserType.NORMAL) {
                        var localVideoView = blinkEngine.createLocalVideoView();


                        self.state.videos.push({id: 'yanggang', video: localVideoView});

                        self.interval = setInterval(function () {
                            console.log('search');
                            self.search();
                        }, 2000);


                        self.refs.mainVideo.append(localVideoView);
                        // $("#mainVideo").append(localVideoView);
                        // 加入时是否关闭了本地摄像头
                        if (isCameraClose) {
                            $("#btn_camera").addClass("btn_camera_close");
                            // addCloseVideoCover(selfUserId);
                        }
                    }
                } else {
                    swal("加入会议失败!");
                }
            });

            // 其它用户加入
            blinkEngineEventHandle.on('onUserJoined', function (data) {
                console.log(JSON.stringify(data));
                var userType = data.userType;
                if (userType == BlinkConstant.UserType.NORMAL) {
                    var userId = data.userId;
                    var talkType = data.talkType;

                    var remoteVideoView = blinkEngine.createRemoteVideoView(userId);
                    self.state.videos.push({id: userId, video: remoteVideoView});
                    self.refs.mainVideo.append(remoteVideoView);

                    // 加入时是否开启了摄像头
                    if (talkType == 0) { // 没有开启
                        // 提示信息
                        $("#tip").text(getTime() + " [" + data.userId + "] 已加入会议且没有开启摄像头");
                        addCloseVideoCover(userId);
                    } else {
                        // 提示信息
                        $("#tip").text(getTime() + " [" + data.userId + "] 已加入会议");
                    }
                    // 本地计时
                    if (blinkEngine.getRemoteStreamCount() == 1) {
                        timedCount();
                    }
                }
            });

            // 其它用户离开
            blinkEngineEventHandle.on('onUserLeft', function (data) {
                console.log(JSON.stringify(data));
                var userType = data.userType;
                if (userType == BlinkConstant.UserType.NORMAL) {
                    var userId = data.userId;
                    var mainVideo = $("#mainVideo").children("video:eq(0)");
                    var mainVideoId = mainVideo.attr("id");

                    // 移除远端视频
                    removeVideo(userId);
                    // 移除state中的缓存
                    for (let i = 0; i < self.state.videos.length; i++) {
                        let item = self.state.videos[i];
                        if (item.id == userId) {
                            self.state.videos.splice(i, 1);
                            break;
                        }
                    }

                    // 移除覆盖层
                    removeCloseVideoCover(userId);
                    // 提示信息
                    $("#tip").text(getTime() + " [" + userId + "] 已离开会议");
                    // 重置本地计时
                    if (blinkEngine.getRemoteStreamCount() == 0) {
                        clearTimedCount();
                    }
                }
            });

            // 注册回调
            blinkEngine.setBlinkEngineEventHandle(blinkEngineEventHandle);
            return blinkEngine;
        }

        /**
         * 计时器
         *
         */
        var t;

        function timedCount() {
            return;
            var c = 0;
            t = setInterval(function () {
                $("#timer").text("您已加入 : " + formatSeconds(c));
                c = c + 1;
            }, 1000);
        }

        function clearTimedCount() {
            clearInterval(t);
            t = null;
            //initTimer();
        }


        // 登录并打开视频
        this.getToken(tokenUrl, selfUserId, appId, function (data) {
            var token = data;
            console.log('token', token);
            try {
                blinkEngine = initBlinkEngine();
                var myVideoConstraints = initVideoConstraints();
                var myBandWidth = initBandWidth();
//                    // 设置本地视频参数
                blinkEngine.setVideoParameters({
                    VIDEO_PROFILE: myVideoConstraints,
                    VIDEO_MAX_RATE: myBandWidth.max,
                    VIDEO_MIN_RATE: myBandWidth.min,
                    USER_TYPE: selfUserType,
                    IS_CLOSE_VIDEO: self.props.isCameraClose
                });
//                    // 设置上报丢包率信息
                blinkEngine.enableSendLostReport(true);
//                    // 加入会议
                //convId = '9999';
                blinkEngine.joinChannel(convId, selfUserId, token);
            } catch (err) {
                console.log("初始化失败!", err);
            }
        });

        /**
         * 删除覆盖层
         *
         */
        function removeCloseVideoCover(closeVideoId) {
            $('#' + closeVideoId + '_cover').remove();
        }

        /**
         * 删除video
         *
         */
        function removeVideo(removeVideoId) {
            var parentDiv = $("#" + removeVideoId).parent();
            $("#" + removeVideoId).remove();
            if (parentDiv.is('li')) { // 如果是子窗口的video
                parentDiv.remove();
            }
        }


        /**
         * 初始化视频参数
         *
         */
        function initVideoConstraints() {
            var myVideoConstraints = {};
            myVideoConstraints.width = 320;
            myVideoConstraints.height = 240;
            myVideoConstraints.frameRate = 15;
            return myVideoConstraints;
        }

        /**
         * 根据分辨率设置带宽
         *
         */
        function initBandWidth() {
            var myBandWidth = {};
            myBandWidth.min = 250;
            myBandWidth.max = 300;
            return myBandWidth;
        }
    }


    handleCancel = (e) => {
        this.eaveConv();
        this.props.hideVideo();
        //this.setState({visible: false});
    }

    render() {
        return (
            <Modal title={this.props.title}
                   visible={this.state.visible}
                   footer={null}
                   width={674}
                   onCancel={this.handleCancel}
            >
                <Layout className="main video">
                    <div ref="mainVideo" className="mainVideo"></div>
                    <canvas style={{"visibility": "collapse", "position": "absolute"}} width="320px" height="240px"
                            ref="canvas"/>

                </Layout>

            </Modal>
        );
    }
}