/**
 * Created by yanggang on 2017/3/6.
 */
import React from 'react';
import {HashRouter as Router, Route, Link, Switch, Redirect} from 'react-router-dom';
import {Button, Popover, Modal ,Divider, Icon} from 'antd';
import {Map, Marker, NavigationControl, InfoWindow} from 'react-bmap';
import {PoliceActions, PoliceStore} from '../../police/reflux.js';
import Config from 'config';
import Info from '../../police/nav/info';

import '../index.less';

export default class PoliceMarker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {visible: false, dialog_visibility: false, active: this.props.active};
    }

    componentWillUnmount() {
    }

    onStatusChange = (type, data) => {
    }

    componentDidMount() {
    }

    onClick = () => { 
        this.setState({dialog_visibility: !this.state.dialog_visibility});
    }

    showInfo = (event) => {
        this.setState({dialog_visibility:false, visible: true});
        // AlarmActions.showInfo(this.props.item.id);
    }
    handleCancel = (e) => {
        this.setState({dialog_visibility:false,visible: false});
    }

    content = (
        <div>
            <p>Content</p>
            <p>Content</p>
        </div>
    );

    render() {

        let icon = "/icons/icon_xunluo_map@2x.png";
        let active = this.state.active;


        switch (this.props.item.workStatus) {
            case 1:
                icon = active ? "/icons/icon_xunluo_map@3x.png" : "/icons/icon_xunluo_map@2x.png";
                break;
            case 2:
                icon = active ? "/icons/icon_beiqin_map@3x.png" : "/icons/icon_beiqin_map@2x.png";
                break;
            case 3:
                icon = active ? "/icons/icon_chujing_map@3x.png" : "/icons/icon_chujing_map@2x.png";
                break;
            case 4:
                icon = active ? "/icons/icon_zhiban_map@3x.png" : "/icons/icon_zhiban_map@2x.png";
                break;
        }

        document.log('marker > police > active', this.props.item.id, active, icon);

        return (
            <div  className="marker">
                <div className="img">
                    <Popover
                        title={null} visible={this.state.dialog_visibility}
                        content={

                        <div className="marker">
                            <div className="popover">
                                <div className="spacebetween">
                                    <h4></h4>
                                    <Icon className="close" onClick={this.handleCancel} type="close" />
                                </div>

                                <div className="spacebetween">
                                    <h4>{this.props.item.name}</h4>
                                    <a onClick={this.showInfo}>查看详情</a>
                                </div>
                                <div className="spacebetween">
                                    <h4>状态：</h4>
                                    <span>{PoliceStore.getWorkStatusText(this.props.item.workStatus)}</span>
                                </div>
                                <div className="spacebetween">
                                    <h4>电话：</h4>
                                    <span>{this.props.item.phone}</span>
                                </div>
                                <div className="spacearound">
                                    <Button type="primary">指令</Button>
                                    <Button type="primary">视频</Button>
                                    <Button type="primary">通话</Button>
                                </div>
                            </div>
                        </div>
                    } >
                        <img onClick={this.onClick} src={Config.base + icon}/>
                    </Popover>

                </div>


                <Modal width={388}
                       title="警情" footer={null}
                       visible={this.state.visible}
                       onCancel={this.handleCancel}
                >
                    <div className="alarmnav">
                        <Info info={this.props.item} hideback/>
                    </div>
                </Modal>

            </div>
        );
    }
}