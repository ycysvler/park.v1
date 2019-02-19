/**
 * Created by yanggang on 2017/3/6.
 */
import React from 'react';
import {Layout, Button, Divider, Checkbox} from 'antd';
import {PoliceActions, PoliceStore} from '../reflux.js';
import {UserActions, UserStore} from '../../system/user/userapi.js';
import {VideoActions, VideoStore} from '../../blinkvideo/reflux.js';
import VideoDialog from '../../blinkvideo/videodialog';

export default class PoliceNavInfo extends React.Component {
    constructor(props) {
        super(props);


        this.unsubscribe = PoliceStore.listen(this.onStatusChange.bind(this));

        this.state = {
            info: props.info,
            showvideo:false
        };
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    componentWillReceiveProps(props) {
        this.setState({info: props.info});
    }

    onStatusChange = (type, data) => {

    }

    componentDidMount() {
    }

    onBack = () => {
        // 设置没有选中效果
        PoliceActions.refresh();
    }

    onShowVideo = () => {
        let groupId = UserStore.getUser().employeeDto.id;
        let employee = [this.state.info.id];
        VideoActions.videoInvitation(groupId, employee);

        this.setState({convId: groupId, showvideo: true,isCameraClose:false, videotitle:'视频'});
    }

    onShowAudio = () => {
        let groupId = UserStore.getUser().employeeDto.id;
        let employee = [this.state.info.id];
        VideoActions.audioInvitation(groupId, employee);

        this.setState({convId: groupId, showvideo: true,isCameraClose:true, videotitle:'通话'});
    }


    onHideVideo=()=>{
        this.setState({showvideo: false});
    }

    render() {
        return (<Layout className="infopage">
                <div className="padding-33">
                    <div className="spacebetween">
                        <h3>
                            {/*<img style={{width: 32, marginRight: 8}} src={this.state.info.portrait}/>*/}

                            {this.state.info.name}</h3>
                        <span></span>
                    </div>
                    <div className="spacebetween">
                        <b>状态：</b>
                        <span>{PoliceStore.getWorkStatusText(this.state.info.workStatus)}</span>
                    </div>
                    <div className="spacebetween">
                        <b>电话：</b>
                        <span>{this.state.info.phone}</span>
                    </div>
                    <div className="spacearound margin-v-12">
                        <Button type="primary" onClick={()=>{
                            PoliceActions.showCommandDialog(this.state.info)
                        }}>指令</Button>
                        <Button type="primary" onClick={this.onShowVideo}>视频</Button>
                        <Button type="primary" onClick={this.onShowAudio}>通话</Button>
                    </div>
                </div>
                <Divider/>
                <div className="padding-33">
                    <div className="spacebetween">
                        <h3>警员信息</h3>
                        <span></span>
                    </div>
                    <div className="spacebetween">
                        <b>部门：</b>
                        <span>{this.state.info.deptName}-{this.state.info.orgName}</span>
                    </div>
                    <div className="spacebetween">
                        <b>位置：</b>
                        <span>{this.state.info.address}</span>
                    </div>
                    <div className="spacebetween">
                        <b>职务：</b>
                        <span>{this.state.info.position}</span>
                    </div>
                </div>

                {this.props.hideback ? null :
                    <div className="spacearound "><Button onClick={this.onBack} icon="left">返回</Button></div>}
                {this.state.showvideo ? <VideoDialog convId={this.state.convId}  isCameraClose={this.state.isCameraClose} title={this.state.videotitle} hideVideo={this.onHideVideo} /> : null}
            </Layout>
        );
    }
}